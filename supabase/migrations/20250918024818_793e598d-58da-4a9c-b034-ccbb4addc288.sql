-- Create subjects table with provided data
CREATE TABLE public.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert the provided subjects data
INSERT INTO public.subjects (name, code) VALUES 
('Software Engineering', 'SE'),
('Mobile Applications', 'MA'),
('Data Structure', 'DS'),
('Mathematics', 'MATH'),
('Information Security', 'IS'),
('Frontend Development', 'FD'),
('Basic Indian Language', 'BIL'),
('Information Security lab', 'IS-LAB'),
('Frontend Development lab', 'FD-LAB'),
('Mobile Applications lab', 'MA-LAB'),
('Data Structure lab', 'DS-LAB'),
('Integral Yoga', 'IY');

-- Create classes table
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  description text,
  subject_id uuid REFERENCES public.subjects(id),
  teacher_id uuid REFERENCES auth.users(id) NOT NULL,
  semester text,
  academic_year text,
  schedule jsonb, -- Store schedule as JSON
  max_students integer DEFAULT 50,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  student_id text NOT NULL UNIQUE,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create class_enrollments table (many-to-many relationship)
CREATE TABLE public.class_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamp with time zone,
  max_grade numeric DEFAULT 100,
  assignment_type text DEFAULT 'homework' CHECK (assignment_type IN ('homework', 'quiz', 'exam', 'project')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create grades table
CREATE TABLE public.grades (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  grade numeric CHECK (grade >= 0),
  feedback text,
  submitted_at timestamp with time zone,
  graded_at timestamp with time zone,
  graded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes text,
  marked_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subjects (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view subjects"
ON public.subjects FOR SELECT
TO authenticated
USING (true);

-- RLS Policies for classes
CREATE POLICY "Teachers can manage their own classes"
ON public.classes FOR ALL
TO authenticated
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view classes they're enrolled in"
ON public.classes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    JOIN public.students s ON s.id = ce.student_id
    WHERE ce.class_id = classes.id AND s.user_id = auth.uid()
  )
);

-- RLS Policies for students
CREATE POLICY "Users can view their own student record"
ON public.students FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view students in their classes"
ON public.students FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    JOIN public.classes c ON c.id = ce.class_id
    WHERE ce.student_id = students.id AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage students"
ON public.students FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for class_enrollments
CREATE POLICY "Teachers can manage enrollments for their classes"
ON public.class_enrollments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_enrollments.class_id AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view their own enrollments"
ON public.class_enrollments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = class_enrollments.student_id AND s.user_id = auth.uid()
  )
);

-- RLS Policies for assignments
CREATE POLICY "Teachers can manage assignments for their classes"
ON public.assignments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = assignments.class_id AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view assignments for their enrolled classes"
ON public.assignments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    JOIN public.students s ON s.id = ce.student_id
    WHERE ce.class_id = assignments.class_id AND s.user_id = auth.uid()
  )
);

-- RLS Policies for grades
CREATE POLICY "Teachers can manage grades for their classes"
ON public.grades FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.classes c ON c.id = a.class_id
    WHERE a.id = grades.assignment_id AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view their own grades"
ON public.grades FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = grades.student_id AND s.user_id = auth.uid()
  )
);

-- RLS Policies for attendance
CREATE POLICY "Teachers can manage attendance for their classes"
ON public.attendance FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = attendance.class_id AND c.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view their own attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = attendance.student_id AND s.user_id = auth.uid()
  )
);

-- Add indexes for better performance
CREATE INDEX idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX idx_classes_subject ON public.classes(subject_id);
CREATE INDEX idx_students_user ON public.students(user_id);
CREATE INDEX idx_class_enrollments_class ON public.class_enrollments(class_id);
CREATE INDEX idx_class_enrollments_student ON public.class_enrollments(student_id);
CREATE INDEX idx_assignments_class ON public.assignments(class_id);
CREATE INDEX idx_grades_assignment ON public.grades(assignment_id);
CREATE INDEX idx_grades_student ON public.grades(student_id);
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, date);
CREATE INDEX idx_attendance_student ON public.attendance(student_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON public.grades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();