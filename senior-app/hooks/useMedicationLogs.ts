import { useEffect, useState, useCallback } from 'react';
import { MedicationService } from '@/lib/services/medication.service';
import { useMedicationStore } from '@/store/useMedicationStore';
import { useUserStore } from '@/store/useUserStore';
import type { Database } from '@/types/database';

type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

export function useMedicationLogs() {
  const { user } = useUserStore();
  const { todayLogs, setTodayLogs, markAsTaken, markAsSkipped } = useMedicationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadTodayLogs = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await MedicationService.getTodayLogs(user.id);
      setTodayLogs(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading today logs:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, setTodayLogs]);

  const markLogAsTaken = useCallback(
    async (logId: string) => {
      setLoading(true);
      setError(null);

      try {
        await MedicationService.markLogAsTaken(logId);
        markAsTaken(logId);
      } catch (err) {
        setError(err as Error);
        console.error('Error marking log as taken:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [markAsTaken]
  );

  const markLogAsSkipped = useCallback(
    async (logId: string) => {
      setLoading(true);
      setError(null);

      try {
        await MedicationService.markLogAsSkipped(logId);
        markAsSkipped(logId);
      } catch (err) {
        setError(err as Error);
        console.error('Error marking log as skipped:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [markAsSkipped]
  );

  const getLogsByDateRange = useCallback(
    async (startDate: Date, endDate: Date) => {
      if (!user?.id) return [];

      try {
        return await MedicationService.getLogsByDateRange(user.id, startDate, endDate);
      } catch (err) {
        console.error('Error getting logs by date range:', err);
        return [];
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (user?.id) {
      loadTodayLogs();
    }
  }, [user?.id, loadTodayLogs]);

  return {
    todayLogs,
    loading,
    error,
    loadTodayLogs,
    markLogAsTaken,
    markLogAsSkipped,
    getLogsByDateRange,
  };
}
