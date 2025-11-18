import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationInsert = Database['public']['Tables']['medications']['Insert'];
type MedicationUpdate = Database['public']['Tables']['medications']['Update'];
type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

export class MedicationService {
  /**
   * Get all active medications for a user
   */
  static async getMedications(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single medication by ID
   */
  static async getMedicationById(id: string): Promise<Medication | null> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a new medication
   */
  static async createMedication(medication: MedicationInsert): Promise<Medication> {
    const { data, error } = await supabase
      .from('medications')
      // @ts-ignore - Supabase type inference issue with medications
      .insert(medication)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create medication');

    const medicationData = data as Medication;

    // Generate initial medication logs for the next 7 days
    await this.generateMedicationLogs(medicationData.id, medicationData.user_id, medicationData.times, 7);

    return medicationData;
  }

  /**
   * Update an existing medication
   */
  static async updateMedication(
    id: string,
    updates: MedicationUpdate
  ): Promise<Medication> {
    const { data, error } = await supabase
      .from('medications')
      // @ts-ignore - Supabase type inference issue with medications
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update medication');

    return data as Medication;
  }

  /**
   * Soft delete a medication (set active to false)
   */
  static async deleteMedication(id: string): Promise<void> {
    const { error } = await supabase
      .from('medications')
      // @ts-ignore - Supabase type inference issue with medications
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get today's medication logs for a user
   */
  static async getTodayLogs(userId: string): Promise<MedicationLog[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('medication_logs')
      .select('*, medications(*)')
      .eq('user_id', userId)
      .gte('scheduled_time', today.toISOString())
      .lt('scheduled_time', tomorrow.toISOString())
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get medication logs for a specific date range
   */
  static async getLogsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MedicationLog[]> {
    const { data, error } = await supabase
      .from('medication_logs')
      .select('*, medications(*)')
      .eq('user_id', userId)
      .gte('scheduled_time', startDate.toISOString())
      .lte('scheduled_time', endDate.toISOString())
      .order('scheduled_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Mark a medication log as taken
   */
  static async markLogAsTaken(logId: string): Promise<MedicationLog> {
    const { data, error } = await supabase
      .from('medication_logs')
      // @ts-ignore - Supabase type inference issue with medication_logs
      .update({
        status: 'taken',
        taken_at: new Date().toISOString(),
      })
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update medication log');

    const logData = data as MedicationLog;

    // Update medication stock
    const medication = await this.getMedicationById(logData.medication_id);
    if (medication && medication.current_stock) {
      await this.updateMedication(medication.id, {
        current_stock: Math.max(0, medication.current_stock - 1),
      });
    }

    return logData;
  }

  /**
   * Mark a medication log as skipped
   */
  static async markLogAsSkipped(logId: string): Promise<MedicationLog> {
    const { data, error } = await supabase
      .from('medication_logs')
      // @ts-ignore - Supabase type inference issue with medication_logs
      .update({ status: 'skipped' })
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update medication log');

    return data as MedicationLog;
  }

  /**
   * Generate medication logs for future days
   * @param medicationId - Medication ID
   * @param userId - User ID
   * @param times - Array of times (e.g., ["09:00", "13:00", "21:00"])
   * @param days - Number of days to generate logs for
   */
  static async generateMedicationLogs(
    medicationId: string,
    userId: string,
    times: string[],
    days: number = 7
  ): Promise<void> {
    const logs = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      for (const time of times) {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date(date);
        scheduledTime.setHours(hours, minutes, 0, 0);

        logs.push({
          medication_id: medicationId,
          user_id: userId,
          scheduled_time: scheduledTime.toISOString(),
          status: 'pending' as const,
        });
      }
    }

    // @ts-ignore - Supabase type inference issue with medication_logs
    const { error } = await supabase.from('medication_logs').insert(logs);

    if (error) throw error;
  }

  /**
   * Get medication adherence rate for a user
   * @param userId - User ID
   * @param days - Number of days to calculate (default: 30)
   * @returns Adherence rate as a percentage (0-100)
   */
  static async getAdherenceRate(
    userId: string,
    days: number = 30
  ): Promise<number> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('medication_logs')
      .select('status')
      .eq('user_id', userId)
      .gte('scheduled_time', startDate.toISOString())
      .lte('scheduled_time', endDate.toISOString());

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    const logs = data as { status: string }[];
    const takenCount = logs.filter((log) => log.status === 'taken').length;
    const totalCount = logs.length;

    return Math.round((takenCount / totalCount) * 100);
  }

  /**
   * Check for low stock medications
   * @param userId - User ID
   * @param threshold - Stock threshold (default: 5)
   * @returns Array of medications with low stock
   */
  static async getLowStockMedications(
    userId: string,
    threshold: number = 5
  ): Promise<Medication[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .lte('current_stock', threshold)
      .order('current_stock', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
