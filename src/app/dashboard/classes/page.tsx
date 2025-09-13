'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Users,
  BookOpen,
  Calendar,
  Settings,
  Eye,
  Search,
  Filter,
  MoreVertical,
  Clock,
  MapPin,
  GraduationCap,
  BarChart3,
  Grid3X3,
  List,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Select, SelectOption } from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface Class {
  _id: string
  name: string
  subject: string
  description?: string
  grade: string
  students: any[]
  academicYear: string
  classCode?: string
  room?: string
  capacity: number
  status: 'active' | 'inactive' | 'archived'
  startDate: string
  endDate?: string
  semester?: string
  schedule: Array<{
    day: string
    startTime: string
    endTime: string
    duration: number
    room?: string
  }>
  settings: {
    attendanceWeight: number
    behaviorWeight: number
    assignmentWeight: number
    maxAbsences: number
    gradingPolicy: string
    lateSubmissionPolicy: string
    behaviorTracking: boolean
    parentNotifications: boolean
  }
  stats?: {
    studentCount: number
    assignmentCount: number
    attendanceToday: number
    attendanceRate: number
  }
  createdAt: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    grade: '',
    classCode: '',
    room: '',
    capacity: 30,
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    semester: '',
    schedule: [] as Array<{
      day: string
      startTime: string
      endTime: string
      duration: number
      room?: string
    }>,
    settings: {
      attendanceWeight: 30,
      behaviorWeight: 20,
      assignmentWeight: 50,
      maxAbsences: 10,
      gradingPolicy: '',
      lateSubmissionPolicy: '',
      behaviorTracking: true,
      parentNotifications: true,
    },
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes?includeStats=true')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingClass
        ? `/api/classes/${editingClass._id}`
        : '/api/classes'
      const method = editingClass ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchClasses()
        setIsModalOpen(false)
        setEditingClass(null)
        setFormData({
          name: '',
          subject: '',
          description: '',
          grade: '',
          classCode: '',
          room: '',
          capacity: 30,
          startDate: new Date(),
          endDate: undefined,
          semester: '',
          schedule: [],
          settings: {
            attendanceWeight: 30,
            behaviorWeight: 20,
            assignmentWeight: 50,
            maxAbsences: 10,
            gradingPolicy: '',
            lateSubmissionPolicy: '',
            behaviorTracking: true,
            parentNotifications: true,
          },
        })
      }
    } catch (error) {
      console.error('Error saving class:', error)
    }
  }

  const handleEdit = (classData: Class) => {
    setEditingClass(classData)
    setFormData({
      name: classData.name,
      subject: classData.subject,
      description: classData.description || '',
      grade: classData.grade,
      classCode: classData.classCode || '',
      room: classData.room || '',
      capacity: classData.capacity || 30,
      startDate: new Date(classData.startDate),
      endDate: classData.endDate ? new Date(classData.endDate) : undefined,
      semester: classData.semester || '',
      schedule: classData.schedule || [],
      settings: classData.settings || {
        attendanceWeight: 30,
        behaviorWeight: 20,
        assignmentWeight: 50,
        maxAbsences: 10,
        gradingPolicy: '',
        lateSubmissionPolicy: '',
        behaviorTracking: true,
        parentNotifications: true,
      },
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفصل؟')) {
      try {
        const response = await fetch(`/api/classes/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchClasses()
        }
      } catch (error) {
        console.error('Error deleting class:', error)
      }
    }
  }

  const openModal = () => {
    setEditingClass(null)
    setFormData({
      name: '',
      subject: '',
      description: '',
      grade: '',
      classCode: '',
      room: '',
      capacity: 30,
      startDate: new Date(),
      endDate: undefined,
      semester: '',
      schedule: [],
      settings: {
        attendanceWeight: 30,
        behaviorWeight: 20,
        assignmentWeight: 50,
        maxAbsences: 10,
        gradingPolicy: '',
        lateSubmissionPolicy: '',
        behaviorTracking: true,
        parentNotifications: true,
      },
    })
    setIsModalOpen(true)
  }

  // Filter classes based on search and status
  const filteredClasses = classes.filter(classData => {
    const matchesSearch =
      classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.grade.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || classData.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
            نشط
          </Badge>
        )
      case 'inactive':
        return (
          <Badge className='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'>
            غير نشط
          </Badge>
        )
      case 'archived':
        return <Badge variant='secondary'>مؤرشف</Badge>
      default:
        return <Badge variant='default'>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6 bg-background min-h-screen'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            الفصول الدراسية
          </h1>
          <p className='text-muted-foreground'>إدارة فصولك الدراسية وطلابك</p>
        </div>
        <div className='flex items-center space-x-4 space-x-reverse'>
          <ThemeToggle />
          <Button onClick={openModal} className='flex items-center'>
            <Plus className='h-4 w-4 ml-2' />
            إضافة فصل جديد
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
            <div className='flex flex-col md:flex-row gap-4 flex-1'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='البحث في الفصول...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pr-10'
                />
              </div>
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <SelectOption value='all'>جميع الحالات</SelectOption>
                <SelectOption value='active'>نشط</SelectOption>
                <SelectOption value='inactive'>غير نشط</SelectOption>
                <SelectOption value='archived'>مؤرشف</SelectOption>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size='sm'
                onClick={() => setViewMode('grid')}
                title='عرض الشبكة'
              >
                <Grid3X3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline'}
                size='sm'
                onClick={() => setViewMode('table')}
                title='عرض الجدول'
              >
                <List className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Display */}
      {viewMode === 'grid' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredClasses.map(classData => (
            <Card
              key={classData._id}
              className='hover:shadow-lg transition-all duration-200 hover:scale-[1.02]'
            >
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <CardTitle className='text-lg text-foreground'>
                      {classData.name}
                    </CardTitle>
                    <CardDescription className='text-muted-foreground'>
                      {classData.subject} - الصف {classData.grade}
                    </CardDescription>
                    <div className='mt-2'>
                      {getStatusBadge(classData.status)}
                    </div>
                  </div>
                  <div className='flex space-x-1 space-x-reverse'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(classData)}
                      className='h-8 w-8 p-0'
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(classData._id)}
                      className='h-8 w-8 p-0 text-red-600 hover:text-red-700 dark:text-red-400'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center text-muted-foreground'>
                      <Users className='h-4 w-4 ml-2' />
                      الطلاب
                    </div>
                    <span className='font-medium text-foreground'>
                      {classData.stats?.studentCount ||
                        classData.students.length}
                    </span>
                  </div>

                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center text-muted-foreground'>
                      <Calendar className='h-4 w-4 ml-2' />
                      معدل الحضور
                    </div>
                    <span className='font-medium text-foreground'>
                      {classData.stats?.attendanceRate?.toFixed(1) || 0}%
                    </span>
                  </div>

                  {classData.room && (
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <MapPin className='h-4 w-4 ml-2' />
                      القاعة: {classData.room}
                    </div>
                  )}

                  {classData.classCode && (
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <GraduationCap className='h-4 w-4 ml-2' />
                      كود الفصل: {classData.classCode}
                    </div>
                  )}

                  {classData.description && (
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {classData.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الفصل</TableHead>
                  <TableHead>المادة</TableHead>
                  <TableHead>الصف</TableHead>
                  <TableHead>الطلاب</TableHead>
                  <TableHead>معدل الحضور</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map(classData => (
                  <TableRow key={classData._id}>
                    <TableCell className='font-medium'>
                      {classData.name}
                    </TableCell>
                    <TableCell>{classData.subject}</TableCell>
                    <TableCell>{classData.grade}</TableCell>
                    <TableCell>
                      {classData.stats?.studentCount ||
                        classData.students.length}
                    </TableCell>
                    <TableCell>
                      {classData.stats?.attendanceRate?.toFixed(1) || 0}%
                    </TableCell>
                    <TableCell>{getStatusBadge(classData.status)}</TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleEdit(classData)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleDelete(classData._id)}
                          className='text-red-600 hover:text-red-700'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'تعديل الفصل' : 'إضافة فصل جديد'}
        size='lg'
      >
        <Tabs defaultValue='basic' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='basic'>المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value='schedule'>الجدولة</TabsTrigger>
            <TabsTrigger value='settings'>الإعدادات</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <TabsContent value='basic' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Input
                  label='اسم الفصل'
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <Input
                  label='المادة'
                  value={formData.subject}
                  onChange={e =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />

                <Input
                  label='الصف'
                  value={formData.grade}
                  onChange={e =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  required
                />

                <Input
                  label='كود الفصل'
                  value={formData.classCode}
                  onChange={e =>
                    setFormData({ ...formData, classCode: e.target.value })
                  }
                  placeholder='اختياري'
                />

                <Input
                  label='القاعة'
                  value={formData.room}
                  onChange={e =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  placeholder='اختياري'
                />

                <Input
                  label='السعة'
                  type='number'
                  value={formData.capacity}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value) || 30,
                    })
                  }
                  min='1'
                  max='100'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-foreground mb-2'>
                  الوصف
                </label>
                <textarea
                  className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground'
                  rows={3}
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    تاريخ البداية
                  </label>
                  <DatePicker
                    value={formData.startDate}
                    onChange={date =>
                      setFormData({ ...formData, startDate: date })
                    }
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    تاريخ النهاية (اختياري)
                  </label>
                  <DatePicker
                    value={formData.endDate}
                    onChange={date =>
                      setFormData({ ...formData, endDate: date })
                    }
                  />
                </div>
              </div>

              <Input
                label='الفصل الدراسي'
                value={formData.semester}
                onChange={e =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                placeholder='مثال: الفصل الأول 2024'
              />
            </TabsContent>

            <TabsContent value='schedule' className='space-y-4'>
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                <Calendar className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>ميزة الجدولة ستكون متاحة قريباً</p>
                <p className='text-sm'>
                  يمكنك إضافة الجداول الدراسية وتنظيم أوقات الفصول
                </p>
              </div>
            </TabsContent>

            <TabsContent value='settings' className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    وزن الحضور (%)
                  </label>
                  <Input
                    type='number'
                    value={formData.settings.attendanceWeight}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          attendanceWeight: parseInt(e.target.value) || 30,
                        },
                      })
                    }
                    min='0'
                    max='100'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    وزن السلوك (%)
                  </label>
                  <Input
                    type='number'
                    value={formData.settings.behaviorWeight}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          behaviorWeight: parseInt(e.target.value) || 20,
                        },
                      })
                    }
                    min='0'
                    max='100'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    وزن الواجبات (%)
                  </label>
                  <Input
                    type='number'
                    value={formData.settings.assignmentWeight}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          assignmentWeight: parseInt(e.target.value) || 50,
                        },
                      })
                    }
                    min='0'
                    max='100'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    الحد الأقصى للغياب
                  </label>
                  <Input
                    type='number'
                    value={formData.settings.maxAbsences}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          maxAbsences: parseInt(e.target.value) || 10,
                        },
                      })
                    }
                    min='1'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    سياسة التقييم
                  </label>
                  <textarea
                    className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground'
                    rows={3}
                    value={formData.settings.gradingPolicy}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          gradingPolicy: e.target.value,
                        },
                      })
                    }
                    placeholder='اكتب سياسة التقييم للفصل...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    سياسة التسليم المتأخر
                  </label>
                  <textarea
                    className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground'
                    rows={3}
                    value={formData.settings.lateSubmissionPolicy}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          lateSubmissionPolicy: e.target.value,
                        },
                      })
                    }
                    placeholder='اكتب سياسة التسليم المتأخر...'
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-foreground'>
                    تتبع السلوك
                  </label>
                  <input
                    type='checkbox'
                    checked={formData.settings.behaviorTracking}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          behaviorTracking: e.target.checked,
                        },
                      })
                    }
                    className='rounded border-input text-primary focus:ring-ring'
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-foreground'>
                    إشعارات أولياء الأمور
                  </label>
                  <input
                    type='checkbox'
                    checked={formData.settings.parentNotifications}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          parentNotifications: e.target.checked,
                        },
                      })
                    }
                    className='rounded border-input text-primary focus:ring-ring'
                  />
                </div>
              </div>
            </TabsContent>

            <div className='flex justify-end space-x-3 space-x-reverse pt-4 border-t border-border'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button type='submit'>
                {editingClass ? 'حفظ التعديلات' : 'إضافة الفصل'}
              </Button>
            </div>
          </form>
        </Tabs>
      </Modal>
    </div>
  )
}
