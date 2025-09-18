import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AttendanceChart } from '@/components/analytics/AttendanceChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

const Analytics: React.FC = () => {
  // Mock analytics data
  const mockOverviewStats = [
    {
      title: 'Overall Attendance',
      value: '87.5%',
      change: '+2.3%',
      trend: 'up' as const,
      description: 'vs. last month',
    },
    {
      title: 'Average Grade',
      value: '85.2%',
      change: '+1.8%',
      trend: 'up' as const,
      description: 'across all classes',
    },
    {
      title: 'Assignment Completion',
      value: '92.1%',
      change: '-0.5%',
      trend: 'down' as const,
      description: 'submission rate',
    },
    {
      title: 'Active Students',
      value: '156',
      change: '+12',
      trend: 'up' as const,
      description: 'enrolled students',
    },
  ];

  const mockClassPerformance = [
    {
      name: 'Advanced React Development',
      code: 'CS301',
      attendance: 92,
      averageGrade: 88.5,
      submissions: 95,
      trend: 'up' as const,
    },
    {
      name: 'Database Management Systems', 
      code: 'CS205',
      attendance: 85,
      averageGrade: 82.1,
      submissions: 88,
      trend: 'down' as const,
    },
    {
      name: 'Software Engineering',
      code: 'CS401',
      attendance: 90,
      averageGrade: 91.2,
      submissions: 96,
      trend: 'up' as const,
    },
    {
      name: 'Machine Learning Fundamentals',
      code: 'CS503',
      attendance: 78,
      averageGrade: 79.8,
      submissions: 82,
      trend: 'down' as const,
    },
  ];

  const mockAlerts = [
    {
      type: 'warning',
      title: 'Low Attendance Alert',
      message: 'CS503 has attendance below 80% threshold',
      class: 'Machine Learning Fundamentals',
    },
    {
      type: 'success',
      title: 'High Performance',
      message: 'CS401 students showing excellent progress',
      class: 'Software Engineering',
    },
    {
      type: 'info',
      title: 'Assignment Due',
      message: '3 assignments due within the next week',
      class: 'Multiple Classes',
    },
  ];

  const getColorByValue = (value: number, type: 'attendance' | 'grade' | 'submission') => {
    const thresholds = {
      attendance: { good: 85, warning: 70 },
      grade: { good: 85, warning: 70 },
      submission: { good: 90, warning: 75 },
    };
    
    const threshold = thresholds[type];
    if (value >= threshold.good) return 'text-success';
    if (value >= threshold.warning) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (value: number) => {
    if (value >= 85) return 'bg-success';
    if (value >= 70) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track performance and insights across your classes</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockOverviewStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.trend === 'up' ? 
                    <TrendingUp className="h-4 w-4 text-success" /> : 
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  }
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1">
                    <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <AttendanceChart />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Class Performance Overview
                </CardTitle>
                <CardDescription>
                  Attendance, grades, and submission rates by class
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockClassPerformance.map((classItem, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{classItem.name}</h4>
                          <Badge variant="secondary">{classItem.code}</Badge>
                        </div>
                      </div>
                      {classItem.trend === 'up' ? 
                        <TrendingUp className="h-4 w-4 text-success" /> : 
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      }
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className={getColorByValue(classItem.attendance, 'attendance')}>
                            {classItem.attendance}%
                          </span>
                        </div>
                        <Progress value={classItem.attendance} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Avg Grade</span>
                          <span className={getColorByValue(classItem.averageGrade, 'grade')}>
                            {classItem.averageGrade}%
                          </span>
                        </div>
                        <Progress value={classItem.averageGrade} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Submissions</span>
                          <span className={getColorByValue(classItem.submissions, 'submission')}>
                            {classItem.submissions}%
                          </span>
                        </div>
                        <Progress value={classItem.submissions} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Alerts and Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Alerts & Insights
                </CardTitle>
                <CardDescription>
                  Important notifications and performance insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAlerts.map((alert, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0 mt-0.5">
                      {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-warning" />}
                      {alert.type === 'success' && <TrendingUp className="h-4 w-4 text-success" />}
                      {alert.type === 'info' && <GraduationCap className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {alert.class}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;