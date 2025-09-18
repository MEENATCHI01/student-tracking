import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Users, 
  Calendar,
  BookOpen,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Classes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock classes data
  const mockClasses = [
    {
      id: '1',
      name: 'Advanced React Development',
      code: 'CS301',
      description: 'Learn advanced React concepts including hooks, context, and performance optimization.',
      students: 30,
      schedule: [
        { day: 'Monday', time: '10:00 AM - 12:00 PM' },
        { day: 'Wednesday', time: '10:00 AM - 12:00 PM' },
      ],
      semester: 'Fall 2025',
      status: 'active' as const,
    },
    {
      id: '2',  
      name: 'Database Management Systems',
      code: 'CS205',
      description: 'Comprehensive coverage of database design, SQL, and database administration.',
      students: 32,
      schedule: [
        { day: 'Tuesday', time: '2:00 PM - 4:00 PM' },
        { day: 'Thursday', time: '2:00 PM - 4:00 PM' },
      ],
      semester: 'Fall 2025',
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Software Engineering',
      code: 'CS401',
      description: 'Software development lifecycle, project management, and team collaboration.',
      students: 20,
      schedule: [
        { day: 'Friday', time: '9:00 AM - 12:00 PM' },
      ],
      semester: 'Fall 2025',
      status: 'active' as const,
    },
    {
      id: '4',
      name: 'Machine Learning Fundamentals',
      code: 'CS503',
      description: 'Introduction to machine learning algorithms and their applications.',
      students: 18,
      schedule: [
        { day: 'Monday', time: '2:00 PM - 5:00 PM' },
      ],
      semester: 'Fall 2025',
      status: 'draft' as const,
    },
  ];

  const filteredClasses = mockClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Classes</h1>
              <p className="text-muted-foreground">Manage your classes and course content</p>
            </div>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Class
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search classes by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{classItem.code}</Badge>
                        <Badge variant={getStatusColor(classItem.status) as any}>
                          {classItem.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {classItem.name}
                      </CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Class
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {classItem.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{classItem.students} students</span>
                    </div>
                    <span className="text-muted-foreground">{classItem.semester}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </h4>
                    <div className="space-y-1">
                      {classItem.schedule.map((schedule, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex justify-between">
                          <span>{schedule.day}</span>
                          <span>{schedule.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <BookOpen className="h-3 w-3" />
                        Content
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Users className="h-3 w-3" />
                        Students
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No classes found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms.' : 'Create your first class to get started.'}
              </p>
              {!searchTerm && (
                <Button variant="gradient" className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Class
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Classes;