import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/authStore';
import { 
  BookOpen, 
  ClipboardList, 
  GraduationCap, 
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import campusImage from '@/assets/campus-bg.jpg';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data for demonstration
  const mockStats = {
    enrolledClasses: 5,
    attendanceRate: 85,
    averageGrade: 88.5,
    upcomingAssignments: 3,
  };

  const mockClasses = [
    {
      id: '1',
      name: 'Advanced React Development',
      code: 'CS301',
      teacher: 'Dr. Smith',
      nextClass: '2025-09-19 10:00 AM',
      attendance: 90,
      currentGrade: 92,
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS205',
      teacher: 'Prof. Johnson',
      nextClass: '2025-09-19 2:00 PM',
      attendance: 88,
      currentGrade: 85,
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CS401',
      teacher: 'Dr. Williams',
      nextClass: '2025-09-20 9:00 AM',
      attendance: 78,
      currentGrade: 89,
    },
  ];

  const mockUpcomingAssignments = [
    {
      id: '1',
      title: 'React Hooks Assignment',
      course: 'Advanced React Development',
      dueDate: '2025-09-25',
      daysLeft: 6,
      status: 'pending' as const,
    },
    {
      id: '2',
      title: 'Database Design Project',
      course: 'Database Management Systems',
      dueDate: '2025-09-28',
      daysLeft: 9,
      status: 'in-progress' as const,
    },
    {
      id: '3',
      title: 'Software Testing Report',
      course: 'Software Engineering',
      dueDate: '2025-09-22',
      daysLeft: 3,
      status: 'pending' as const,
    },
  ];

  const getAttendanceColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 2) return 'text-destructive';
    if (daysLeft <= 7) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="h-32 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${campusImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
          <div className="relative h-full flex items-center px-6">
            <div className="text-white">
              <h1 className="text-2xl font-bold">Hello, {user?.name}!</h1>
              <p className="text-white/90">Ready to excel in your studies today?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.enrolledClasses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(mockStats.attendanceRate)}`}>
              {mockStats.attendanceRate}%
            </div>
            <p className="text-xs text-muted-foreground">Overall attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(mockStats.averageGrade)}`}>
              {mockStats.averageGrade}%
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockStats.upcomingAssignments}</div>
            <p className="text-xs text-muted-foreground">Assignments due</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Classes
            </CardTitle>
            <CardDescription>Your enrolled courses this semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockClasses.map((classItem) => (
              <div key={classItem.id} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{classItem.name}</h4>
                      <Badge variant="secondary">{classItem.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Instructor: {classItem.teacher}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Attendance</span>
                    <span className={`font-medium ${getAttendanceColor(classItem.attendance)}`}>
                      {classItem.attendance}%
                    </span>
                  </div>
                  <Progress value={classItem.attendance} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Current Grade</span>
                    <span className={`font-medium ${getGradeColor(classItem.currentGrade)}`}>
                      {classItem.currentGrade}%
                    </span>
                  </div>
                  <Progress value={classItem.currentGrade} className="h-2" />
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Next class: {classItem.nextClass}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Upcoming Assignments
            </CardTitle>
            <CardDescription>Assignments and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUpcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <Badge variant={getStatusColor(assignment.status) as any}>
                    {assignment.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {assignment.dueDate}
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${getUrgencyColor(assignment.daysLeft)}`}>
                    <Clock className="h-3 w-3" />
                    {assignment.daysLeft} days left
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Things you can do right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              View Classes
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <GraduationCap className="h-6 w-6" />
              Check Grades
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ClipboardList className="h-6 w-6" />
              Submit Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};