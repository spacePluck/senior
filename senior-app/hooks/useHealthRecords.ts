import { useEffect, useState, useCallback } from 'react';
import { HealthService, HealthRecordType } from '@/lib/services/health.service';
import { useHealthStore } from '@/store/useHealthStore';
import { useUserStore } from '@/store/useUserStore';
import type { Database } from '@/types/database';

type HealthRecord = Database['public']['Tables']['health_records']['Row'];
type HealthRecordInsert = Database['public']['Tables']['health_records']['Insert'];

export function useHealthRecords(type?: HealthRecordType) {
  const { user } = useUserStore();
  const { records, setRecords, addRecord, getRecordsByType, getLatestRecord } = useHealthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRecords = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await HealthService.getHealthRecords(user.id, type);
      setRecords(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading health records:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, type, setRecords]);

  const createRecord = useCallback(
    async (record: Omit<HealthRecordInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      setLoading(true);
      setError(null);

      try {
        const newRecord = await HealthService.createHealthRecord({
          ...record,
          user_id: user.id,
        });
        addRecord(newRecord);
        return newRecord;
      } catch (err) {
        setError(err as Error);
        console.error('Error creating health record:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, addRecord]
  );

  const createBloodPressure = useCallback(
    async (systolic: number, diastolic: number, notes?: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      setLoading(true);
      setError(null);

      try {
        const newRecord = await HealthService.createBloodPressureRecord(
          user.id,
          systolic,
          diastolic,
          notes
        );
        addRecord(newRecord);
        return newRecord;
      } catch (err) {
        setError(err as Error);
        console.error('Error creating blood pressure record:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, addRecord]
  );

  const createBloodSugar = useCallback(
    async (value: number, notes?: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      setLoading(true);
      setError(null);

      try {
        const newRecord = await HealthService.createBloodSugarRecord(
          user.id,
          value,
          notes
        );
        addRecord(newRecord);
        return newRecord;
      } catch (err) {
        setError(err as Error);
        console.error('Error creating blood sugar record:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, addRecord]
  );

  const createWeight = useCallback(
    async (value: number, notes?: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      setLoading(true);
      setError(null);

      try {
        const newRecord = await HealthService.createWeightRecord(
          user.id,
          value,
          notes
        );
        addRecord(newRecord);
        return newRecord;
      } catch (err) {
        setError(err as Error);
        console.error('Error creating weight record:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id, addRecord]
  );

  const getStats = useCallback(
    async (recordType: HealthRecordType, days: number = 30) => {
      if (!user?.id) return null;

      try {
        return await HealthService.getHealthStats(user.id, recordType, days);
      } catch (err) {
        console.error('Error getting health stats:', err);
        return null;
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (user?.id) {
      loadRecords();
    }
  }, [user?.id, loadRecords]);

  const filteredRecords = type ? getRecordsByType(type) : records;
  const latestRecord = type ? getLatestRecord(type) : null;

  return {
    records: filteredRecords,
    latestRecord,
    loading,
    error,
    loadRecords,
    createRecord,
    createBloodPressure,
    createBloodSugar,
    createWeight,
    getStats,
  };
}
