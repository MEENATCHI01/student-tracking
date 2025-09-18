import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Subject {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  subject_id?: string;
  teacher_id: string;
  semester?: string;
  academic_year?: string;
  schedule?: any;
  max_students: number;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  // Joined data
  subject?: Subject;
  enrollment_count?: number;
}

export interface Student {
  id: string;
  user_id: string;
  student_id: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: {
    full_name: string;
    email: string;
  };
}

export interface Assignment {
  id: string;
  class_id: string;
  title: string;
  description?: string;
  due_date?: string;
  max_grade: number;
  assignment_type: 'homework' | 'quiz' | 'exam' | 'project';
  status: 'active' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  // Joined data
  class?: Class;
  submission_count?: number;
}

export interface Grade {
  id: string;
  assignment_id: string;
  student_id: string;
  grade?: number;
  feedback?: string;
  submitted_at?: string;
  graded_at?: string;
  graded_by?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  assignment?: Assignment;
  student?: Student;
}

export interface AttendanceRecord {
  id: string;
  class_id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  marked_by?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  class?: Class;
  student?: Student;
}

interface DataState {
  // Data
  subjects: Subject[];
  classes: Class[];
  students: Student[];
  assignments: Assignment[];
  grades: Grade[];
  attendance: AttendanceRecord[];
  
  // Loading states
  loading: {
    subjects: boolean;
    classes: boolean;
    students: boolean;
    assignments: boolean;
    grades: boolean;
    attendance: boolean;
  };
  
  // Actions
  fetchSubjects: () => Promise<void>;
  fetchClasses: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  fetchAssignments: (classId?: string) => Promise<void>;
  fetchGrades: (assignmentId?: string) => Promise<void>;
  fetchAttendance: (classId?: string, date?: string) => Promise<void>;
  
  // CRUD operations
  createClass: (classData: Partial<Class>) => Promise<Class | null>;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  
  createAssignment: (assignmentData: Partial<Assignment>) => Promise<Assignment | null>;
  updateAssignment: (id: string, updates: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  
  createGrade: (gradeData: Partial<Grade>) => Promise<Grade | null>;
  updateGrade: (id: string, updates: Partial<Grade>) => Promise<void>;
  
  markAttendance: (attendanceData: Partial<AttendanceRecord>) => Promise<AttendanceRecord | null>;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  subjects: [],
  classes: [],
  students: [],
  assignments: [],
  grades: [],
  attendance: [],
  
  loading: {
    subjects: false,
    classes: false,
    students: false,
    assignments: false,
    grades: false,
    attendance: false,
  },
  
  // Fetch functions
  fetchSubjects: async () => {
    set(state => ({ loading: { ...state.loading, subjects: true } }));
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ subjects: data || [] });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      set(state => ({ loading: { ...state.loading, subjects: false } }));
    }
  },
  
  fetchClasses: async () => {
    set(state => ({ loading: { ...state.loading, classes: true } }));
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          subject:subjects(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ classes: (data || []) as Class[] });
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      set(state => ({ loading: { ...state.loading, classes: false } }));
    }
  },
  
  fetchStudents: async () => {
    set(state => ({ loading: { ...state.loading, students: true } }));
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ students: (data || []) as any });
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      set(state => ({ loading: { ...state.loading, students: false } }));
    }
  },
  
  fetchAssignments: async (classId?: string) => {
    set(state => ({ loading: { ...state.loading, assignments: true } }));
    try {
      let query = supabase
        .from('assignments')
        .select(`
          *,
          class:classes(name, code)
        `);
      
      if (classId) {
        query = query.eq('class_id', classId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ assignments: (data || []) as Assignment[] });
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      set(state => ({ loading: { ...state.loading, assignments: false } }));
    }
  },
  
  fetchGrades: async (assignmentId?: string) => {
    set(state => ({ loading: { ...state.loading, grades: true } }));
    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          assignments!inner(title, max_grade),
          students!inner(student_id, profiles!inner(full_name))
        `);
      
      if (assignmentId) {
        // Apply filter after the query
      }
      
      const { data: filteredData, error: filterError } = await supabase
        .from('grades')
        .select(`
          *,
          assignments!inner(title, max_grade),
          students!inner(student_id, profiles!inner(full_name))
        `)
        .eq(assignmentId ? 'assignment_id' : 'id', assignmentId || data?.[0]?.id || '')
        .order('created_at', { ascending: false });
      
      if (filterError && !assignmentId) throw error;
      set({ grades: ((assignmentId ? filteredData : data) || []) as any });
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      set(state => ({ loading: { ...state.loading, grades: false } }));
    }
  },
  
  fetchAttendance: async (classId?: string, date?: string) => {
    set(state => ({ loading: { ...state.loading, attendance: true } }));
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          classes!inner(name, code),
          students!inner(student_id, profiles!inner(full_name))
        `)
        .eq(classId ? 'class_id' : 'id', classId || 'none')
        .eq(date ? 'date' : 'id', date || 'none')
        .order('date', { ascending: false });
      
      if (error) throw error;
      set({ attendance: (data || []) as any });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      set(state => ({ loading: { ...state.loading, attendance: false } }));
    }
  },
  
  // CRUD operations
  createClass: async (classData) => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([classData as any])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh classes
      get().fetchClasses();
      return data as Class;
    } catch (error) {
      console.error('Error creating class:', error);
      return null;
    }
  },
  
  updateClass: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh classes
      get().fetchClasses();
    } catch (error) {
      console.error('Error updating class:', error);
    }
  },
  
  deleteClass: async (id) => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh classes
      get().fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  },
  
  createAssignment: async (assignmentData) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData as any])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh assignments
      get().fetchAssignments();
      return data as Assignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      return null;
    }
  },
  
  updateAssignment: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh assignments
      get().fetchAssignments();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  },
  
  deleteAssignment: async (id) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh assignments
      get().fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  },
  
  createGrade: async (gradeData) => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert([gradeData as any])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh grades
      get().fetchGrades();
      return data as Grade;
    } catch (error) {
      console.error('Error creating grade:', error);
      return null;
    }
  },
  
  updateGrade: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('grades')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh grades
      get().fetchGrades();
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  },
  
  markAttendance: async (attendanceData) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert([attendanceData as any])
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh attendance
      get().fetchAttendance();
      return data as AttendanceRecord;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return null;
    }
  },
  
  updateAttendance: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh attendance
      get().fetchAttendance();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  },
}));