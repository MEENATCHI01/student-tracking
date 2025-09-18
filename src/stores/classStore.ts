import { create } from 'zustand';

export interface Class {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  studentIds: string[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  createdAt: Date;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxGrade: number;
  createdAt: Date;
}

export interface Grade {
  id: string;
  assignmentId: string;
  studentId: string;
  grade: number;
  feedback?: string;
  submittedAt?: Date;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

interface ClassState {
  classes: Class[];
  assignments: Assignment[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  selectedClass: Class | null;
  
  // Actions
  setClasses: (classes: Class[]) => void;
  addClass: (classData: Class) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  removeClass: (id: string) => void;
  setSelectedClass: (classData: Class | null) => void;
  
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  removeAssignment: (id: string) => void;
  
  addGrade: (grade: Grade) => void;
  updateGrade: (id: string, updates: Partial<Grade>) => void;
  
  addAttendanceRecord: (record: AttendanceRecord) => void;
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
}

export const useClassStore = create<ClassState>((set) => ({
  classes: [],
  assignments: [],
  grades: [],
  attendance: [],
  selectedClass: null,
  
  setClasses: (classes) => set({ classes }),
  addClass: (classData) => set((state) => ({ classes: [...state.classes, classData] })),
  updateClass: (id, updates) =>
    set((state) => ({
      classes: state.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeClass: (id) =>
    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
    })),
  setSelectedClass: (classData) => set({ selectedClass: classData }),
  
  addAssignment: (assignment) =>
    set((state) => ({ assignments: [...state.assignments, assignment] })),
  updateAssignment: (id, updates) =>
    set((state) => ({
      assignments: state.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  removeAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    })),
  
  addGrade: (grade) => set((state) => ({ grades: [...state.grades, grade] })),
  updateGrade: (id, updates) =>
    set((state) => ({
      grades: state.grades.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
  
  addAttendanceRecord: (record) =>
    set((state) => ({ attendance: [...state.attendance, record] })),
  updateAttendanceRecord: (id, updates) =>
    set((state) => ({
      attendance: state.attendance.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
}));