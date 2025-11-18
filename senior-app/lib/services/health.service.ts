import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';

type HealthRecord = Database['public']['Tables']['health_records']['Row'];
type HealthRecordInsert = Database['public']['Tables']['health_records']['Insert'];

export type HealthRecordType = 'blood_pressure' | 'blood_sugar' | 'weight' | 'temperature' | 'heart_rate';

export interface BloodPressureValue {
  systolic: number;
  diastolic: number;
}

export interface HealthRecordWithValue extends Omit<HealthRecord, 'value'> {
  value: BloodPressureValue | number;
}

export class HealthService {
  /**
   * Get all health records for a user
   */
  static async getHealthRecords(
    userId: string,
    type?: HealthRecordType
  ): Promise<HealthRecord[]> {
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get health records for a specific date range
   */
  static async getRecordsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    type?: HealthRecordType
  ): Promise<HealthRecord[]> {
    let query = supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', startDate.toISOString())
      .lte('recorded_at', endDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get the latest health record of a specific type
   */
  static async getLatestRecord(
    userId: string,
    type: HealthRecordType
  ): Promise<HealthRecord | null> {
    const { data, error } = await supabase
      .from('health_records')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || null;
  }

  /**
   * Create a new health record
   */
  static async createHealthRecord(
    record: HealthRecordInsert
  ): Promise<HealthRecord> {
    const { data, error } = await supabase
      .from('health_records')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create health record');

    return data;
  }

  /**
   * Create a blood pressure record
   */
  static async createBloodPressureRecord(
    userId: string,
    systolic: number,
    diastolic: number,
    notes?: string
  ): Promise<HealthRecord> {
    return this.createHealthRecord({
      user_id: userId,
      type: 'blood_pressure',
      value: { systolic, diastolic },
      unit: 'mmHg',
      notes,
    });
  }

  /**
   * Create a blood sugar record
   */
  static async createBloodSugarRecord(
    userId: string,
    value: number,
    notes?: string
  ): Promise<HealthRecord> {
    return this.createHealthRecord({
      user_id: userId,
      type: 'blood_sugar',
      value,
      unit: 'mg/dL',
      notes,
    });
  }

  /**
   * Create a weight record
   */
  static async createWeightRecord(
    userId: string,
    value: number,
    notes?: string
  ): Promise<HealthRecord> {
    return this.createHealthRecord({
      user_id: userId,
      type: 'weight',
      value,
      unit: 'kg',
      notes,
    });
  }

  /**
   * Create a temperature record
   */
  static async createTemperatureRecord(
    userId: string,
    value: number,
    notes?: string
  ): Promise<HealthRecord> {
    return this.createHealthRecord({
      user_id: userId,
      type: 'temperature',
      value,
      unit: '°C',
      notes,
    });
  }

  /**
   * Create a heart rate record
   */
  static async createHeartRateRecord(
    userId: string,
    value: number,
    notes?: string
  ): Promise<HealthRecord> {
    return this.createHealthRecord({
      user_id: userId,
      type: 'heart_rate',
      value,
      unit: 'bpm',
      notes,
    });
  }

  /**
   * Get health statistics for a specific type
   */
  static async getHealthStats(
    userId: string,
    type: HealthRecordType,
    days: number = 30
  ): Promise<{
    average: number;
    min: number;
    max: number;
    latest: number;
    trend: 'up' | 'down' | 'stable';
  } | null> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await this.getRecordsByDateRange(
      userId,
      startDate,
      endDate,
      type
    );

    if (records.length === 0) return null;

    // For blood pressure, we'll use systolic value
    const values = records.map((record) => {
      if (type === 'blood_pressure') {
        const value = record.value as BloodPressureValue;
        return value.systolic;
      }
      return record.value as number;
    });

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const latest = values[values.length - 1];

    // Calculate trend (compare last 3 values with previous 3 values)
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (values.length >= 6) {
      const recentAvg =
        values.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
      const previousAvg =
        values.slice(-6, -3).reduce((sum, val) => sum + val, 0) / 3;
      const diff = recentAvg - previousAvg;

      if (Math.abs(diff) > average * 0.05) {
        // 5% change threshold
        trend = diff > 0 ? 'up' : 'down';
      }
    }

    return {
      average: Math.round(average * 10) / 10,
      min,
      max,
      latest,
      trend,
    };
  }

  /**
   * Check if a blood pressure reading is in normal range
   */
  static isBloodPressureNormal(systolic: number, diastolic: number): {
    status: 'normal' | 'elevated' | 'high' | 'very_high';
    message: string;
  } {
    if (systolic >= 180 || diastolic >= 120) {
      return {
        status: 'very_high',
        message: '고혈압 위기 - 즉시 의사와 상담하세요',
      };
    } else if (systolic >= 140 || diastolic >= 90) {
      return {
        status: 'high',
        message: '고혈압 - 의사와 상담이 필요합니다',
      };
    } else if (systolic >= 130 || diastolic >= 80) {
      return {
        status: 'elevated',
        message: '주의 - 혈압이 높은 편입니다',
      };
    } else {
      return {
        status: 'normal',
        message: '정상 범위입니다',
      };
    }
  }

  /**
   * Check if a blood sugar reading is in normal range
   */
  static isBloodSugarNormal(
    value: number,
    fasting: boolean = false
  ): {
    status: 'normal' | 'prediabetes' | 'diabetes';
    message: string;
  } {
    if (fasting) {
      if (value >= 126) {
        return { status: 'diabetes', message: '당뇨병 범위 - 의사와 상담하세요' };
      } else if (value >= 100) {
        return { status: 'prediabetes', message: '공복혈당장애 - 주의가 필요합니다' };
      } else {
        return { status: 'normal', message: '정상 범위입니다' };
      }
    } else {
      if (value >= 200) {
        return { status: 'diabetes', message: '당뇨병 범위 - 의사와 상담하세요' };
      } else if (value >= 140) {
        return { status: 'prediabetes', message: '주의 - 혈당이 높은 편입니다' };
      } else {
        return { status: 'normal', message: '정상 범위입니다' };
      }
    }
  }
}
