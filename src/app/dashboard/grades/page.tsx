'use client'

import React, { useState, useEffect } from 'react'
import {
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Edit,
  Save,
  X,
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
import { Select, SelectOption } from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { calculateGrade } from '@/lib/utils'

// Developer Note:
// This component manages a gradebook with an editable state.
// `isEditing` toggles the UI between a read-only view and an editable table.
// `pendingGrades` stores changes in a key-value format (`${studentId}-${assignmentId}`: score)
// before they are saved to the backend.

interface Student {
  _id: string
  name: string
  seatNumber: number
}

interface Assignment {
  _id: string
  title: string
  maxScore: number
  weight: number
}

interface Grade {
  _id: string
  student: { _id: string }
  assignment: { _id: string; weight: number }
  score: number
  percentage: number
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

  // State for editing grades
  const [isEditing, setIsEditing] = useState(false)
  const [pendingGrades, setPendingGrades] = useState<Record<string, string>>({})

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

  // --- Handlers for Edit Mode ---
  const handleGradeChange = (
    studentId: string,
    assignmentId: string,
    value: string
  ) => {
    const gradeKey = `${studentId}-${assignmentId}`
    setPendingGrades(prev => ({ ...prev, [gradeKey]: value }))
  }

  const handleSaveChanges = async () => {
    console.log('Saving grades:', pendingGrades)
    // Here you would typically call an API to bulk-update grades
    // For example: await fetch('/api/grades/bulk-update', { method: 'POST', body: JSON.stringify(pendingGrades) })
    // For this example, we'll just simulate a delay and refetch.
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In a real app, you would update the local `grades` state based on the API response
    // For now, we just refetch all grades.
    await fetchGrades()
    setIsEditing(false)
    setPendingGrades({})
    setLoading(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setPendingGrades({})
  }

  // --- Calculations ---
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
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6 p-4 sm:p-6 bg-muted/40 min-h-screen'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>دفتر الدرجات</h1>
          <p className='text-muted-foreground'>
            تتبع درجات الطلاب وإحصائيات الأداء
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {isEditing ? (
            <>
              <Button variant='outline' onClick={handleCancel} size='sm'>
                <X className='h-4 w-4 ml-1' />
                إلغاء
              </Button>
              <Button onClick={handleSaveChanges} size='sm'>
                <Save className='h-4 w-4 ml-1' />
                حفظ التغييرات
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size='sm'>
              <Edit className='h-4 w-4 ml-1' />
              تعديل الدرجات
            </Button>
          )}
        </div>
      </div>

      {/* Class Selection */}
      <Card>
        <CardContent className='p-4 sm:p-6'>
          <div className='flex items-center gap-4'>
            <label className='text-sm font-medium'>الفصل:</label>
            <div className='w-full sm:w-64'>
              <Select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                disabled={isEditing}
              >
                {classes.map(classData => (
                  <SelectOption key={classData._id} value={classData._id}>
                    {classData.name} - {classData.subject}
                  </SelectOption>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Stats Cards remain the same */}
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-primary ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>إجمالي الطلاب</p>
                <p className='text-2xl font-bold'>{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <TrendingUp className='h-8 w-8 text-green-500 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>متوسط الدرجات</p>
                <p className='text-2xl font-bold text-green-500'>
                  {stats.averageGrade.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Award className='h-8 w-8 text-yellow-500 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>أعلى درجة</p>
                <p className='text-2xl font-bold text-yellow-500'>
                  {stats.highestGrade.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <BookOpen className='h-8 w-8 text-red-500 ml-3' />
              <div>
                <p className='text-sm text-muted-foreground'>أقل درجة</p>
                <p className='text-2xl font-bold text-red-500'>
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
            {isEditing
              ? 'أدخل الدرجات في الحقول أدناه. سيتم الحفظ عند الضغط على زر الحفظ.'
              : 'عرض درجات جميع الطلاب في الفصل المحدد'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table className='min-w-full divide-y divide-border'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-1/12'>الرقم</TableHead>
                  <TableHead className='w-3/12'>اسم الطالب</TableHead>
                  {assignments.map(assignment => (
                    <TableHead key={assignment._id} className='text-center'>
                      <div>
                        <div className='font-medium'>{assignment.title}</div>
                        <div className='text-xs text-muted-foreground'>
                          ({assignment.maxScore})
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
                          const gradeKey = `${student._id}-${assignment._id}`
                          const grade = grades.find(
                            g =>
                              g.student._id === student._id &&
                              g.assignment._id === assignment._id
                          )
                          const currentValue =
                            pendingGrades[gradeKey] ?? grade?.score ?? ''

                          return (
                            <TableCell
                              key={assignment._id}
                              className='text-center p-1'
                            >
                              {isEditing ? (
                                <Input
                                  type='number'
                                  value={currentValue}
                                  onChange={e =>
                                    handleGradeChange(
                                      student._id,
                                      assignment._id,
                                      e.target.value
                                    )
                                  }
                                  className='max-w-[80px] mx-auto text-center'
                                  max={assignment.maxScore}
                                  min={0}
                                />
                              ) : grade ? (
                                <div>
                                  <div className='font-medium'>
                                    {grade.score}
                                  </div>
                                  <div className='text-xs text-muted-foreground'>
                                    {grade.percentage.toFixed(1)}%
                                  </div>
                                </div>
                              ) : (
                                <span className='text-muted-foreground'>-</span>
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
                              <div className='text-xs text-muted-foreground'>
                                {calculateGrade(studentAverage, 100)}
                              </div>
                            </div>
                          ) : (
                            <span className='text-muted-foreground'>-</span>
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
