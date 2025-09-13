'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Save,
  RefreshCw,
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
import { Badge } from '@/components/ui/Badge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Select, SelectOption } from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { getAttendanceStatusColor, getAttendanceStatusText } from '@/lib/utils'

interface Student {
  _id: string
  name: string
  seatNumber: number
  class: {
    _id: string
    name: string
  }
}

interface Attendance {
  _id: string
  student: Student
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  markedAt: string
}

interface Class {
  _id: string
  name: string
  subject: string
  students: Student[]
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>(
    {}
  )
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  )
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([])

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes?includeStats=true')
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
        if (data.length > 0) {
          setSelectedClass(data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(
        `/api/attendance?classId=${selectedClass}&date=${dateStr}`
      )
      if (response.ok) {
        const data = await response.json()
        setAttendance(data)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const fetchAttendanceHistory = async () => {
    try {
      const startDate = new Date(selectedDate)
      const endDate = new Date(selectedDate)

      if (viewMode === 'weekly') {
        startDate.setDate(startDate.getDate() - startDate.getDay())
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
      } else if (viewMode === 'monthly') {
        startDate.setDate(1)
        endDate.setMonth(endDate.getMonth() + 1, 0)
      }

      const response = await fetch(
        `/api/attendance?classId=${selectedClass}&startDate=${
          startDate.toISOString().split('T')[0]
        }&endDate=${endDate.toISOString().split('T')[0]}`
      )
      if (response.ok) {
        const data = await response.json()
        setAttendanceHistory(data)
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error)
    }
  }

  const handleAttendanceChange = async (studentId: string, status: string) => {
    if (isEditing) {
      // Store pending changes
      setPendingChanges(prev => ({ ...prev, [studentId]: status }))
      return
    }

    try {
      const existingAttendance = attendance.find(
        a => a.student._id === studentId
      )

      if (existingAttendance) {
        // Update existing attendance
        const response = await fetch(
          `/api/attendance/${existingAttendance._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
          }
        )

        if (response.ok) {
          await fetchAttendance()
        }
      } else {
        // Create new attendance record
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId,
            classId: selectedClass,
            date: selectedDate.toISOString().split('T')[0],
            status,
          }),
        })

        if (response.ok) {
          await fetchAttendance()
        }
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
    }
  }

  const savePendingChanges = async () => {
    try {
      const promises = Object.entries(pendingChanges).map(
        async ([studentId, status]) => {
          const existingAttendance = attendance.find(
            a => a.student._id === studentId
          )

          if (existingAttendance) {
            return fetch(`/api/attendance/${existingAttendance._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            })
          } else {
            return fetch('/api/attendance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId,
                classId: selectedClass,
                date: selectedDate.toISOString().split('T')[0],
                status,
              }),
            })
          }
        }
      )

      await Promise.all(promises)
      setPendingChanges({})
      setIsEditing(false)
      await fetchAttendance()
    } catch (error) {
      console.error('Error saving changes:', error)
    }
  }

  const cancelPendingChanges = () => {
    setPendingChanges({})
    setIsEditing(false)
  }

  const exportAttendance = async () => {
    try {
      const response = await fetch(
        `/api/attendance/export?classId=${selectedClass}&date=${
          selectedDate.toISOString().split('T')[0]
        }`
      )
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance-${
          selectedDate.toISOString().split('T')[0]
        }.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting attendance:', error)
    }
  }

  const getAttendanceStats = () => {
    const currentClass = classes.find(c => c._id === selectedClass)
    if (!currentClass)
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        attendanceRate: 0,
      }

    const totalStudents = currentClass.students.length
    const present = attendance.filter(a => a.status === 'present').length
    const absent = attendance.filter(a => a.status === 'absent').length
    const late = attendance.filter(a => a.status === 'late').length
    const excused = attendance.filter(a => a.status === 'excused').length
    const attendanceRate =
      totalStudents > 0 ? ((present + late) / totalStudents) * 100 : 0

    return { totalStudents, present, absent, late, excused, attendanceRate }
  }

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
            حاضر
          </Badge>
        )
      case 'absent':
        return (
          <Badge className='bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'>
            غائب
          </Badge>
        )
      case 'late':
        return (
          <Badge className='bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'>
            متأخر
          </Badge>
        )
      case 'excused':
        return <Badge variant='secondary'>معذور</Badge>
      default:
        return <Badge variant='outline'>غير محدد</Badge>
    }
  }

  const stats = getAttendanceStats()

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
          <h1 className='text-3xl font-bold text-foreground'>تسجيل الحضور</h1>
          <p className='text-muted-foreground'>تسجيل حضور وغياب الطلاب</p>
        </div>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Button
            variant='outline'
            size='sm'
            onClick={exportAttendance}
            className='flex items-center gap-2'
          >
            <Download className='h-4 w-4' />
            تصدير
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditing(!isEditing)}
            className='flex items-center gap-2'
          >
            {isEditing ? (
              <Save className='h-4 w-4' />
            ) : (
              <Edit className='h-4 w-4' />
            )}
            {isEditing ? 'حفظ' : 'تعديل'}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-foreground mb-2'>
                الفصل
              </label>
              <Select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
              >
                {classes.map(classData => (
                  <SelectOption key={classData._id} value={classData._id}>
                    {classData.name} - {classData.subject}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className='lg:w-64'>
              <label className='block text-sm font-medium text-foreground mb-2'>
                التاريخ
              </label>
              <DatePicker
                value={selectedDate}
                onChange={date => setSelectedDate(date)}
              />
            </div>
            <div className='lg:w-48'>
              <label className='block text-sm font-medium text-foreground mb-2'>
                عرض
              </label>
              <Select
                value={viewMode}
                onChange={e =>
                  setViewMode(e.target.value as 'daily' | 'weekly' | 'monthly')
                }
              >
                <SelectOption value='daily'>يومي</SelectOption>
                <SelectOption value='weekly'>أسبوعي</SelectOption>
                <SelectOption value='monthly'>شهري</SelectOption>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-blue-600 dark:text-blue-400 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>إجمالي الطلاب</p>
                <p className='text-2xl font-bold text-foreground'>
                  {stats.totalStudents}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <CheckCircle className='h-8 w-8 text-green-600 dark:text-green-400 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>حاضر</p>
                <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                  {stats.present}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <XCircle className='h-8 w-8 text-red-600 dark:text-red-400 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>غائب</p>
                <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
                  {stats.absent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Clock className='h-8 w-8 text-yellow-600 dark:text-yellow-400 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>متأخر</p>
                <p className='text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
                  {stats.late}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <AlertCircle className='h-8 w-8 text-blue-600 dark:text-blue-400 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>معذور</p>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {stats.excused}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <TrendingUp className='h-8 w-8 text-purple-600 dark:text-purple-400 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>معدل الحضور</p>
                <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                  {stats.attendanceRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Tabs defaultValue='daily' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='daily'>تسجيل يومي</TabsTrigger>
          <TabsTrigger value='history'>سجل الحضور</TabsTrigger>
          <TabsTrigger value='analytics'>التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value='daily' className='space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center'>
                  <Calendar className='h-5 w-5 ml-2' />
                  تسجيل الحضور - {selectedDate.toLocaleDateString('ar-SA')}
                </CardTitle>
                {isEditing && (
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={cancelPendingChanges}
                    >
                      إلغاء
                    </Button>
                    <Button
                      size='sm'
                      onClick={savePendingChanges}
                      disabled={Object.keys(pendingChanges).length === 0}
                    >
                      حفظ التغييرات ({Object.keys(pendingChanges).length})
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الجلوس</TableHead>
                    <TableHead>اسم الطالب</TableHead>
                    <TableHead>الحضور</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes
                    .find(c => c._id === selectedClass)
                    ?.students.sort((a, b) => a.seatNumber - b.seatNumber)
                    .map(student => {
                      const studentAttendance = attendance.find(
                        a => a.student._id === student._id
                      )
                      const currentStatus =
                        pendingChanges[student._id] ||
                        studentAttendance?.status ||
                        'absent'

                      return (
                        <TableRow key={student._id}>
                          <TableCell className='font-medium'>
                            {student.seatNumber}
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {getAttendanceStatusBadge(currentStatus)}
                          </TableCell>
                          <TableCell>
                            <div className='flex space-x-2 space-x-reverse'>
                              <Button
                                size='sm'
                                variant={
                                  currentStatus === 'present'
                                    ? 'primary'
                                    : 'outline'
                                }
                                onClick={() =>
                                  handleAttendanceChange(student._id, 'present')
                                }
                              >
                                حاضر
                              </Button>
                              <Button
                                size='sm'
                                variant={
                                  currentStatus === 'absent'
                                    ? 'primary'
                                    : 'outline'
                                }
                                onClick={() =>
                                  handleAttendanceChange(student._id, 'absent')
                                }
                              >
                                غائب
                              </Button>
                              <Button
                                size='sm'
                                variant={
                                  currentStatus === 'late'
                                    ? 'primary'
                                    : 'outline'
                                }
                                onClick={() =>
                                  handleAttendanceChange(student._id, 'late')
                                }
                              >
                                متأخر
                              </Button>
                              <Button
                                size='sm'
                                variant={
                                  currentStatus === 'excused'
                                    ? 'primary'
                                    : 'outline'
                                }
                                onClick={() =>
                                  handleAttendanceChange(student._id, 'excused')
                                }
                              >
                                معذور
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='history' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BarChart3 className='h-5 w-5 ml-2' />
                سجل الحضور
              </CardTitle>
              <CardDescription>عرض تاريخ الحضور للطلاب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                <BarChart3 className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>ميزة سجل الحضور ستكون متاحة قريباً</p>
                <p className='text-sm'>يمكنك عرض تاريخ الحضور والغياب للطلاب</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='analytics' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <TrendingUp className='h-5 w-5 ml-2' />
                تحليلات الحضور
              </CardTitle>
              <CardDescription>إحصائيات مفصلة عن معدلات الحضور</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                <TrendingUp className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>ميزة التحليلات ستكون متاحة قريباً</p>
                <p className='text-sm'>
                  يمكنك عرض الرسوم البيانية والإحصائيات التفصيلية
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
