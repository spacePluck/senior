import { useEffect, useState, useCallback } from 'react';
import { MedicationService } from '@/lib/services/medication.service';
import { useMedicationStore } from '@/store/useMedicationStore';
import { useUserStore } from '@/store/useUserStore';
import type { Database } from '@/types/database';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationInsert = Database['public']['Tables']['medications']['Insert'];
type MedicationUpdate = Database['public']['Tables']['medications']['Update'];

export function useMedications() {
  const { user } = useUserStore();
  const { medications, setMedications, addMedication, updateMedication, deleteMedication } =
    useMedicationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMedications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await MedicationService.getMedications(user.id);
      setMedications(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading medications:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, setMedications]);

  const createMedication = useCallback(
    async (medication: Omit<MedicationInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      setLoading(true);
      setError(null);

      try {
        const newMedication = await MedicationService.createMedication({
          ...medication,
          user_id: user.id,
        });
        addMedication(newMedication);
        return newMedication;
      } catch (err) {
        setError(err as Error);
        console.error('Error creating medication:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, addMedication]
  );

  const updateMedicationById = useCallback(
    async (id: string, updates: MedicationUpdate) => {
      setLoading(true);
      setError(null);

      try {
        const updated = await MedicationService.updateMedication(id, updates);
        updateMedication(id, updates);
        return updated;
      } catch (err) {
        setError(err as Error);
        console.error('Error updating medication:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateMedication]
  );

  const deleteMedicationById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await MedicationService.deleteMedication(id);
        deleteMedication(id);
      } catch (err) {
        setError(err as Error);
        console.error('Error deleting medication:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [deleteMedication]
  );

  const getLowStockMedications = useCallback(async (threshold: number = 5) => {
    if (!user?.id) return [];

    try {
      return await MedicationService.getLowStockMedications(user.id, threshold);
    } catch (err) {
      console.error('Error getting low stock medications:', err);
      return [];
    }
  }, [user?.id]);

  const getAdherenceRate = useCallback(async (days: number = 30) => {
    if (!user?.id) return 0;

    try {
      return await MedicationService.getAdherenceRate(user.id, days);
    } catch (err) {
      console.error('Error getting adherence rate:', err);
      return 0;
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadMedications();
    }
  }, [user?.id, loadMedications]);

  return {
    medications,
    loading,
    error,
    loadMedications,
    createMedication,
    updateMedication: updateMedicationById,
    deleteMedication: deleteMedicationById,
    getLowStockMedications,
    getAdherenceRate,
  };
}
