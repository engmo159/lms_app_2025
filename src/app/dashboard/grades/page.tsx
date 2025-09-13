'use client'

import React, { useState, useEffect } from 'react'
import {
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Plus,
  Edit,
  Download,
  Upload,
  Filter,
  Search,
  BarChart3,
  Eye,
  Save,
  X,
  Calendar,
  Clock,
  FileText,
  Target,
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
import { Select, SelectOption } from '@/components/ui/Select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { calculateGrade } from '@/lib/utils'

interface Student {
  _id: string
  name: string
  seatNumber: number
}

interface Assignment {
  _id: string
  title: string
  description?: string
  maxScore: number
  weight: number
  type:
    | 'homework'
    | 'quiz'
    | 'exam'
    | 'project'
    | 'participation'
    | 'lab'
    | 'presentation'
  dueDate?: string
  assignedDate: string
  isPublished: boolean
  status: 'draft' | 'published' | 'closed' | 'graded'
  class: string
}

interface Grade {
  _id: string
  student: Student
  assignment: Assignment
  score: number
  maxScore: number
  percentage: number
  notes?: string
  gradedAt: string
}

interface Class {
  _id: string
  name: string
  subject: string
  students: Student[]
}

export default function GradesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchAssignments()
      fetchGrades()
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

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`/api/assignments?classId=${selectedClass}`)
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const fetchGrades = async () => {
    try {
      const response = await fetch(`/api/grades?classId=${selectedClass}`)
      if (response.ok) {
        const data = await response.json()
        setGrades(data)
      }
    } catch (error) {
      console.error('Error fetching grades:', error)
    }
  }

  const getStudentAverage = (studentId: string) => {
    const studentGrades = grades.filter(
      grade => grade.student._id === studentId
    )
    if (studentGrades.length === 0) return 0

    let totalWeightedScore = 0
    let totalWeight = 0

    studentGrades.forEach(grade => {
      const weight = grade.assignment.weight
      totalWeightedScore += grade.percentage * weight
      totalWeight += weight
    })

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0
  }

  const getClassStats = () => {
    const currentClass = classes.find(c => c._id === selectedClass)
    if (!currentClass)
      return {
        totalStudents: 0,
        averageGrade: 0,
        highestGrade: 0,
        lowestGrade: 0,
      }

    const studentAverages = currentClass.students.map(student =>
      getStudentAverage(student._id)
    )
    const validAverages = studentAverages.filter(avg => avg > 0)

    return {
      totalStudents: currentClass.students.length,
      averageGrade:
        validAverages.length > 0
          ? validAverages.reduce((a, b) => a + b, 0) / validAverages.length
          : 0,
      highestGrade: validAverages.length > 0 ? Math.max(...validAverages) : 0,
      lowestGrade: validAverages.length > 0 ? Math.min(...validAverages) : 0,
    }
  }

  const stats = getClassStats()

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
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>دفتر الدرجات</h1>
        <p className='text-gray-600'>تتبع درجات الطلاب وإحصائيات الأداء</p>
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

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-blue-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>إجمالي الطلاب</p>
                <p className='text-2xl font-bold'>{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <TrendingUp className='h-8 w-8 text-green-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>متوسط الدرجات</p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats.averageGrade.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Award className='h-8 w-8 text-yellow-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>أعلى درجة</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {stats.highestGrade.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <BookOpen className='h-8 w-8 text-red-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>أقل درجة</p>
                <p className='text-2xl font-bold text-red-600'>
                  {stats.lowestGrade.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Award className='h-5 w-5 ml-2' />
            درجات الطلاب
          </CardTitle>
          <CardDescription>
            عرض درجات جميع الطلاب في الفصل المحدد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الجلوس</TableHead>
                  <TableHead>اسم الطالب</TableHead>
                  {assignments.map(assignment => (
                    <TableHead key={assignment._id} className='text-center'>
                      <div>
                        <div className='font-medium'>{assignment.title}</div>
                        <div className='text-xs text-gray-500'>
                          {assignment.maxScore} ({assignment.weight}%)
                        </div>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className='text-center'>المتوسط</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes
                  .find(c => c._id === selectedClass)
                  ?.students.sort((a, b) => a.seatNumber - b.seatNumber)
                  .map(student => {
                    const studentAverage = getStudentAverage(student._id)
                    return (
                      <TableRow key={student._id}>
                        <TableCell className='font-medium'>
                          {student.seatNumber}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        {assignments.map(assignment => {
                          const grade = grades.find(
                            g =>
                              g.student._id === student._id &&
                              g.assignment._id === assignment._id
                          )
                          return (
                            <TableCell
                              key={assignment._id}
                              className='text-center'
                            >
                              {grade ? (
                                <div>
                                  <div className='font-medium'>
                                    {grade.score}
                                  </div>
                                  <div className='text-xs text-gray-500'>
                                    {grade.percentage.toFixed(1)}%
                                  </div>
                                </div>
                              ) : (
                                <span className='text-gray-400'>-</span>
                              )}
                            </TableCell>
                          )
                        })}
                        <TableCell className='text-center'>
                          {studentAverage > 0 ? (
                            <div>
                              <div className='font-medium'>
                                {studentAverage.toFixed(1)}%
                              </div>
                              <div className='text-xs text-gray-500'>
                                {calculateGrade(studentAverage, 100)}
                              </div>
                            </div>
                          ) : (
                            <span className='text-gray-400'>-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
