import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useClassStore } from '@/stores/classStore';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Plus,
  Calendar,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import campusImage from '@/assets/campus-bg.jpg';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { classes, assignments, attendance } = useClassStore();

  // Mock data for demonstration
  const mockStats = {
    totalClasses: 4,
    totalStudents: 85,
    todayAttendance: 78,
    pendingGrades: 12,
  };

  const mockRecentClasses = [
    {
      id: '1',
      name: 'Advanced React Development',
      code: 'CS301',
      time: '10:00 AM',
      studentsPresent: 28,
      totalStudents: 30,
      status: 'ongoing' as const,
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS205',
      time: '2:00 PM',
      studentsPresent: 25,
      totalStudents: 32,
      status: 'upcoming' as const,
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CS401',
      time: '4:00 PM',
      studentsPresent: 18,
      totalStudents: 20,
      status: 'completed' as const,
    },
  ];

  const mockRecentAssignments = [
    {
      id: '1',
      title: 'React Hooks Assignment',
      className: 'Advanced React Development',
      dueDate: '2025-09-25',
      submissions: 25,
      totalStudents: 30,
    },
    {
      id: '2',
      title: 'Database Design Project',
      className: 'Database Management Systems',
      dueDate: '2025-09-28',
      submissions: 18,
      totalStudents: 32,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'success';
      case 'upcoming':
        return 'warning';
      case 'completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getAttendanceColor = (present: number, total: number) => {
    const percentage = (present / total) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
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
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-white/90">Ready to manage your classes today?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{mockStats.todayAttendance}</div>
            <p className="text-xs text-muted-foreground">Students present</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{mockStats.pendingGrades}</div>
            <p className="text-xs text-muted-foreground">Assignments to grade</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Classes
                </CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentClasses.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{classItem.name}</h4>
                    <Badge variant="secondary">{classItem.code}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {classItem.time}
                    </span>
                    <span className={`flex items-center gap-1 ${getAttendanceColor(classItem.studentsPresent, classItem.totalStudents)}`}>
                      <Users className="h-3 w-3" />
                      {classItem.studentsPresent}/{classItem.totalStudents}
                    </span>
                  </div>
                </div>
                <Badge variant={getStatusColor(classItem.status) as any}>
                  {classItem.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Recent Assignments
                </CardTitle>
                <CardDescription>Assignments needing attention</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentAssignments.map((assignment) => (
              <div key={assignment.id} className="p-3 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assignment.className}</p>
                  </div>
                  {assignment.submissions < assignment.totalStudents && (
                    <AlertCircle className="h-4 w-4 text-warning" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                  <span className={`font-medium ${
                    assignment.submissions === assignment.totalStudents 
                      ? 'text-success' 
                      : 'text-warning'
                  }`}>
                    {assignment.submissions}/{assignment.totalStudents} submitted
                  </span>
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
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ClipboardList className="h-6 w-6" />
              Take Attendance
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <GraduationCap className="h-6 w-6" />
              Grade Assignments
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              Create Assignment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};