import { create } from 'zustand';
import type { Database } from '@/types/database';

type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationLog = Database['public']['Tables']['medication_logs']['Row'];

interface MedicationStore {
  medications: Medication[];
  todayLogs: MedicationLog[];
  setMedications: (medications: Medication[]) => void;
  setTodayLogs: (logs: MedicationLog[]) => void;
  addMedication: (medication: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markAsTaken: (logId: string) => void;
  markAsSkipped: (logId: string) => void;
}

export const useMedicationStore = create<MedicationStore>((set) => ({
  medications: [],
  todayLogs: [],
  setMedications: (medications) => set({ medications }),
  setTodayLogs: (logs) => set({ todayLogs: logs }),
  addMedication: (medication) =>
    set((state) => ({
      medications: [...state.medications, medication],
    })),
  updateMedication: (id, updates) =>
    set((state) => ({
      medications: state.medications.map((med) =>
        med.id === id ? { ...med, ...updates } : med
      ),
    })),
  deleteMedication: (id) =>
    set((state) => ({
      medications: state.medications.filter((med) => med.id !== id),
    })),
  markAsTaken: (logId) =>
    set((state) => ({
      todayLogs: state.todayLogs.map((log) =>
        log.id === logId
          ? { ...log, status: 'taken' as const, taken_at: new Date().toISOString() }
          : log
      ),
    })),
  markAsSkipped: (logId) =>
    set((state) => ({
      todayLogs: state.todayLogs.map((log) =>
        log.id === logId ? { ...log, status: 'skipped' as const } : log
      ),
    })),
}));
