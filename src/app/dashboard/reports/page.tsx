'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Download, FileText, TrendingUp, Users, Calendar } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Class {
  _id: string
  name: string
  subject: string
  students: any[]
}

interface AttendanceData {
  date: string
  present: number
  absent: number
  late: number
  excused: number
}

interface GradeData {
  student: string
  average: number
}

export default function ReportsPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [gradeData, setGradeData] = useState<GradeData[]>([])
  const [loading, setLoading] = useState(true)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchAttendanceData()
      fetchGradeData()
    }
  }, [selectedClass])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
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

  const fetchAttendanceData = async () => {
    try {
      // Generate sample data for the last 7 days
      const data: AttendanceData[] = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        data.push({
          date: date.toLocaleDateString('ar-SA', {
            month: 'short',
            day: 'numeric',
          }),
          present: Math.floor(Math.random() * 20) + 15,
          absent: Math.floor(Math.random() * 5) + 1,
          late: Math.floor(Math.random() * 3),
          excused: Math.floor(Math.random() * 2),
        })
      }
      setAttendanceData(data)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    }
  }

  const fetchGradeData = async () => {
    try {
      // Generate sample grade data
      const data: GradeData[] = []
      const students =
        classes.find(c => c._id === selectedClass)?.students || []
      students.forEach((student, index) => {
        data.push({
          student: student.name,
          average: Math.floor(Math.random() * 40) + 60, // Random grade between 60-100
        })
      })
      setGradeData(data)
    } catch (error) {
      console.error('Error fetching grade data:', error)
    }
  }

  const getAttendanceSummary = () => {
    const total = attendanceData.reduce(
      (sum, day) => sum + day.present + day.absent + day.late + day.excused,
      0
    )
    const present = attendanceData.reduce((sum, day) => sum + day.present, 0)
    return total > 0 ? ((present / total) * 100).toFixed(1) : 0
  }

  const getGradeSummary = () => {
    if (gradeData.length === 0) return { average: 0, highest: 0, lowest: 0 }
    const averages = gradeData.map(d => d.average)
    return {
      average: (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(
        1
      ),
      highest: Math.max(...averages),
      lowest: Math.min(...averages),
    }
  }

  const gradeSummary = getGradeSummary()

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            التقارير والإحصائيات
          </h1>
          <p className='text-gray-600'>عرض تحليلات مفصلة عن أداء الطلاب</p>
        </div>
        <Button className='flex items-center'>
          <Download className='h-4 w-4 ml-2' />
          تصدير التقرير
        </Button>
      </div>

      {/* Class Selection */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center space-x-4 space-x-reverse'>
            <label className='text-sm font-medium text-gray-700'>الفصل:</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {classes.map(classData => (
                <option key={classData._id} value={classData._id}>
                  {classData.name} - {classData.subject}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-blue-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>إجمالي الطلاب</p>
                <p className='text-2xl font-bold'>
                  {classes.find(c => c._id === selectedClass)?.students
                    .length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Calendar className='h-8 w-8 text-green-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>معدل الحضور</p>
                <p className='text-2xl font-bold text-green-600'>
                  {getAttendanceSummary()}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <TrendingUp className='h-8 w-8 text-yellow-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>متوسط الدرجات</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {gradeSummary.average}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <FileText className='h-8 w-8 text-purple-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>أعلى درجة</p>
                <p className='text-2xl font-bold text-purple-600'>
                  {gradeSummary.highest}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>معدل الحضور الأسبوعي</CardTitle>
            <CardDescription>
              تتبع حضور الطلاب خلال الأسبوع الماضي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='present' fill='#10B981' name='حاضر' />
                <Bar dataKey='absent' fill='#EF4444' name='غائب' />
                <Bar dataKey='late' fill='#F59E0B' name='متأخر' />
                <Bar dataKey='excused' fill='#3B82F6' name='معذور' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الدرجات</CardTitle>
            <CardDescription>توزيع درجات الطلاب حسب الفئات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'ممتاز (90-100)',
                      value: gradeData.filter(d => d.average >= 90).length,
                    },
                    {
                      name: 'جيد جداً (80-89)',
                      value: gradeData.filter(
                        d => d.average >= 80 && d.average < 90
                      ).length,
                    },
                    {
                      name: 'جيد (70-79)',
                      value: gradeData.filter(
                        d => d.average >= 70 && d.average < 80
                      ).length,
                    },
                    {
                      name: 'مقبول (60-69)',
                      value: gradeData.filter(
                        d => d.average >= 60 && d.average < 70
                      ).length,
                    },
                    {
                      name: 'ضعيف (<60)',
                      value: gradeData.filter(d => d.average < 60).length,
                    },
                  ]}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name} ${value}`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {[0, 1, 2, 3, 4].map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>أداء الطلاب</CardTitle>
          <CardDescription>ترتيب الطلاب حسب متوسط درجاتهم</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-right'>
              <thead>
                <tr className='border-b'>
                  <th className='pb-3'>الترتيب</th>
                  <th className='pb-3'>اسم الطالب</th>
                  <th className='pb-3'>المتوسط</th>
                  <th className='pb-3'>التقدير</th>
                </tr>
              </thead>
              <tbody>
                {gradeData
                  .sort((a, b) => b.average - a.average)
                  .map((student, index) => (
                    <tr key={student.student} className='border-b'>
                      <td className='py-3'>{index + 1}</td>
                      <td className='py-3 font-medium'>{student.student}</td>
                      <td className='py-3'>{student.average}%</td>
                      <td className='py-3'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.average >= 90
                              ? 'bg-green-100 text-green-800'
                              : student.average >= 80
                              ? 'bg-blue-100 text-blue-800'
                              : student.average >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : student.average >= 60
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.average >= 90
                            ? 'ممتاز'
                            : student.average >= 80
                            ? 'جيد جداً'
                            : student.average >= 70
                            ? 'جيد'
                            : student.average >= 60
                            ? 'مقبول'
                            : 'ضعيف'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
