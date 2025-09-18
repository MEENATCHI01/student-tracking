import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  ClipboardList, 
  Calendar as CalendarIcon,
  Users, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from 'lucide-react';

const Attendance: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    classes, 
    attendance, 
    students,
    loading,
    fetchClasses, 
    fetchAttendance,
    fetchStudents,
    markAttendance 
  } = useDataStore();
  const { toast } = useToast();
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance(selectedClass, format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    // Initialize attendance data from fetched records
    const data: Record<string, string> = {};
    attendance.forEach(record => {
      data[record.student_id] = record.status;
    });
    setAttendanceData(data);
  }, [attendance]);

  const selectedClassData = classes.find(cls => cls.id === selectedClass);
  const classStudents = students.filter(student => 
    // Note: In a real app, you'd filter based on class enrollment
    true // For now, show all students
  );

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class first.",
        variant: "destructive"
      });
      return;
    }

    const promises = classStudents.map(student => {
      const status = attendanceData[student.id] || 'absent';
      return markAttendance({
        class_id: selectedClass,
        student_id: student.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: status as any,
        marked_by: user?.id
      });
    });

    try {
      await Promise.all(promises);
      toast({
        title: "Attendance Saved",
        description: "Attendance has been marked successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'late':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'excused':
        return <FileText className="h-4 w-4 text-primary" />;
      default:
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'excused':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const stats = {
    totalStudents: classStudents.length,
    presentCount: Object.values(attendanceData).filter(status => status === 'present').length,
    absentCount: Object.values(attendanceData).filter(status => status === 'absent').length,
    lateCount: Object.values(attendanceData).filter(status => status === 'late').length,
    attendanceRate: classStudents.length > 0 
      ? Math.round((Object.values(attendanceData).filter(status => status === 'present').length / classStudents.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Attendance Management</h1>
              <p className="text-muted-foreground">Track student attendance for your classes</p>
            </div>
            <Button 
              variant="gradient" 
              className="gap-2"
              onClick={handleSaveAttendance}
              disabled={!selectedClass || classStudents.length === 0}
            >
              <ClipboardList className="h-4 w-4" />
              Save Attendance
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Select Class and Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} ({cls.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedClass && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-success">{stats.presentCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                    <XCircle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.absentCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Late</CardTitle>
                    <Clock className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{stats.lateCount}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.attendanceRate}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Attendance Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Mark Attendance</CardTitle>
                      <CardDescription>
                        {selectedClassData?.name} - {format(selectedDate, 'PPP')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading.students ? (
                    <div className="text-center py-8">Loading students...</div>
                  ) : classStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No students found</h3>
                      <p className="mt-2 text-muted-foreground">
                        Add students to this class to start taking attendance.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Mark Attendance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classStudents.map((student) => {
                          const status = attendanceData[student.id] || 'absent';
                          return (
                            <TableRow key={student.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {student.profile?.full_name || 'Unknown'}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {student.profile?.email}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{student.student_id}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(status)}
                                  <Badge variant={getStatusColor(status) as any}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={status}
                                  onValueChange={(value) => handleAttendanceChange(student.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">Present</SelectItem>
                                    <SelectItem value="absent">Absent</SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                    <SelectItem value="excused">Excused</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {!selectedClass && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Select a Class</h3>
                  <p className="mt-2 text-muted-foreground">
                    Choose a class from the dropdown above to start taking attendance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Attendance;