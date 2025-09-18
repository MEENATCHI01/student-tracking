import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { 
  GraduationCap, 
  Search, 
  Filter,
  Edit,
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';

const Grades: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    classes, 
    assignments, 
    grades, 
    students,
    loading,
    fetchClasses, 
    fetchAssignments, 
    fetchGrades,
    fetchStudents,
    createGrade,
    updateGrade 
  } = useDataStore();
  const { toast } = useToast();
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [gradeForm, setGradeForm] = useState({
    grade: '',
    feedback: ''
  });

  useEffect(() => {
    fetchClasses();
    fetchStudents();
    fetchAssignments();
    fetchGrades();
  }, []);

  const classAssignments = assignments.filter(a => !selectedClass || a.class_id === selectedClass);
  const assignmentGrades = grades.filter(g => !selectedAssignment || g.assignment_id === selectedAssignment);
  
  const filteredGrades = assignmentGrades.filter(grade => {
    if (!searchTerm) return true;
    const studentName = grade.student?.profile?.full_name?.toLowerCase() || '';
    const assignmentTitle = grade.assignment?.title?.toLowerCase() || '';
    return studentName.includes(searchTerm.toLowerCase()) || 
           assignmentTitle.includes(searchTerm.toLowerCase());
  });

  const handleGradeSubmit = async () => {
    if (!editingGrade) return;
    
    const gradeData = {
      assignment_id: editingGrade.assignment_id,
      student_id: editingGrade.student_id,
      grade: parseFloat(gradeForm.grade) || null,
      feedback: gradeForm.feedback,
      graded_at: new Date().toISOString(),
      graded_by: user?.id
    };

    let success = false;
    if (editingGrade.id) {
      await updateGrade(editingGrade.id, gradeData);
      success = true;
    } else {
      const result = await createGrade(gradeData);
      success = !!result;
    }

    if (success) {
      toast({
        title: "Grade Updated",
        description: "The grade has been saved successfully."
      });
      setGradeDialogOpen(false);
      setEditingGrade(null);
      setGradeForm({ grade: '', feedback: '' });
    } else {
      toast({
        title: "Error",
        description: "Failed to save grade. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openGradeDialog = (grade: any) => {
    setEditingGrade(grade);
    setGradeForm({
      grade: grade.grade?.toString() || '',
      feedback: grade.feedback || ''
    });
    setGradeDialogOpen(true);
  };

  const getGradeColor = (grade: number | null, maxGrade: number) => {
    if (!grade) return 'text-muted-foreground';
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-primary';
    if (percentage >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const stats = {
    totalGrades: grades.length,
    gradedCount: grades.filter(g => g.grade !== null).length,
    averageGrade: grades.length > 0 
      ? grades.filter(g => g.grade !== null).reduce((sum, g) => sum + (g.grade || 0), 0) / grades.filter(g => g.grade !== null).length
      : 0,
    pendingGrades: grades.filter(g => g.grade === null).length
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Grades Management</h1>
              <p className="text-muted-foreground">Track and manage student grades</p>
            </div>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Export Grades
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{stats.totalGrades}</div>
                <p className="text-xs text-muted-foreground">All assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graded</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{stats.gradedCount}</div>
                <p className="text-xs text-muted-foreground">Completed grading</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {stats.averageGrade.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Overall performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{stats.pendingGrades}</div>
                <p className="text-xs text-muted-foreground">Need grading</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assignment</Label>
                  <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All assignments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All assignments</SelectItem>
                      {classAssignments.map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id}>
                          {assignment.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search students or assignments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grades Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grades</CardTitle>
                  <CardDescription>
                    {filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading.grades ? (
                <div className="text-center py-8">Loading grades...</div>
              ) : filteredGrades.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No grades found</h3>
                  <p className="mt-2 text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Start by creating assignments and grading them.'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Graded Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGrades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {grade.student?.profile?.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {grade.student?.student_id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{grade.assignment?.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Max: {grade.assignment?.max_grade} points
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${getGradeColor(grade.grade, grade.assignment?.max_grade || 100)}`}>
                            {grade.grade !== null ? `${grade.grade}/${grade.assignment?.max_grade}` : '-'}
                          </div>
                          {grade.grade !== null && (
                            <div className="text-sm text-muted-foreground">
                              {Math.round((grade.grade / (grade.assignment?.max_grade || 100)) * 100)}%
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={grade.grade !== null ? 'default' : 'secondary'}>
                            {grade.grade !== null ? 'Graded' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {grade.graded_at ? (
                            new Date(grade.graded_at).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openGradeDialog(grade)}
                            className="gap-2"
                          >
                            <Edit className="h-3 w-3" />
                            {grade.grade !== null ? 'Edit' : 'Grade'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGrade?.grade !== null ? 'Edit Grade' : 'Add Grade'}
            </DialogTitle>
            <DialogDescription>
              Grading {editingGrade?.student?.profile?.full_name} for {editingGrade?.assignment?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade">
                Grade (out of {editingGrade?.assignment?.max_grade || 100})
              </Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max={editingGrade?.assignment?.max_grade || 100}
                step="0.5"
                value={gradeForm.grade}
                onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                placeholder="Enter grade"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                rows={3}
                value={gradeForm.feedback}
                onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Add feedback for the student..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGradeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleGradeSubmit}>
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grades;