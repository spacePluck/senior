import { create } from 'zustand';
import type { Database } from '@/types/database';

type HealthRecord = Database['public']['Tables']['health_records']['Row'];

interface HealthStore {
  records: HealthRecord[];
  setRecords: (records: HealthRecord[]) => void;
  addRecord: (record: HealthRecord) => void;
  getRecordsByType: (type: HealthRecord['type']) => HealthRecord[];
  getLatestRecord: (type: HealthRecord['type']) => HealthRecord | null;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  records: [],
  setRecords: (records) => set({ records }),
  addRecord: (record) =>
    set((state) => ({
      records: [record, ...state.records],
    })),
  getRecordsByType: (type) => {
    return get().records.filter((record) => record.type === type);
  },
  getLatestRecord: (type) => {
    const records = get()
      .records.filter((record) => record.type === type)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
    return records[0] || null;
  },
}));
