'use client'

import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Smile,
  Frown,
  TrendingUp,
  TrendingDown,
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

interface Student {
  _id: string
  name: string
  seatNumber: number
  class: {
    _id: string
    name: string
    subject: string
  }
}

interface Behavior {
  _id: string
  student: Student
  type: 'positive' | 'negative'
  category: string
  title: string
  description: string
  points: number
  date: string
  createdAt: string
}

interface Class {
  _id: string
  name: string
  subject: string
  students: Student[]
}

export default function BehaviorPage() {
  const [behaviors, setBehaviors] = useState<Behavior[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBehavior, setEditingBehavior] = useState<Behavior | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    studentId: '',
    type: 'positive' as 'positive' | 'negative',
    category: '',
    title: '',
    description: '',
    points: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchBehaviors()
    }
  }, [selectedClass])

  const fetchBehaviors = async () => {
    try {
      const response = await fetch(`/api/behavior?classId=${selectedClass}`)
      if (response.ok) {
        const data = await response.json()
        setBehaviors(data)
      }
    } catch (error) {
      console.error('Error fetching behaviors:', error)
    } finally {
      setLoading(false)
    }
  }

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingBehavior
        ? `/api/behavior/${editingBehavior._id}`
        : '/api/behavior'
      const method = editingBehavior ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          points: parseInt(formData.points),
          classId: selectedClass,
        }),
      })

      if (response.ok) {
        await fetchBehaviors()
        setIsModalOpen(false)
        setEditingBehavior(null)
        setFormData({
          studentId: '',
          type: 'positive',
          category: '',
          title: '',
          description: '',
          points: '',
          date: new Date().toISOString().split('T')[0],
        })
      }
    } catch (error) {
      console.error('Error saving behavior:', error)
    }
  }

  const handleEdit = (behavior: Behavior) => {
    setEditingBehavior(behavior)
    setFormData({
      studentId: behavior.student._id,
      type: behavior.type,
      category: behavior.category,
      title: behavior.title,
      description: behavior.description,
      points: behavior.points.toString(),
      date: behavior.date.split('T')[0],
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      try {
        const response = await fetch(`/api/behavior/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchBehaviors()
        }
      } catch (error) {
        console.error('Error deleting behavior:', error)
      }
    }
  }

  const openModal = () => {
    setEditingBehavior(null)
    setFormData({
      studentId: '',
      type: 'positive',
      category: '',
      title: '',
      description: '',
      points: '',
      date: new Date().toISOString().split('T')[0],
    })
    setIsModalOpen(true)
  }

  const getBehaviorStats = () => {
    const positiveBehaviors = behaviors.filter(b => b.type === 'positive')
    const negativeBehaviors = behaviors.filter(b => b.type === 'negative')
    const totalPoints = behaviors.reduce((sum, b) => sum + b.points, 0)

    return {
      positive: positiveBehaviors.length,
      negative: negativeBehaviors.length,
      totalPoints,
    }
  }

  const stats = getBehaviorStats()

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
          <h1 className='text-2xl font-bold text-gray-900'>سجل السلوك</h1>
          <p className='text-gray-600'>تتبع سلوك الطلاب الإيجابي والسلبي</p>
        </div>
        <Button onClick={openModal} className='flex items-center'>
          <Plus className='h-4 w-4 ml-2' />
          إضافة سجل سلوك
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

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Smile className='h-8 w-8 text-green-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>سلوك إيجابي</p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats.positive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              <Frown className='h-8 w-8 text-red-600 ml-3' />
              <div>
                <p className='text-sm text-gray-600'>سلوك سلبي</p>
                <p className='text-2xl font-bold text-red-600'>
                  {stats.negative}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center'>
              {stats.totalPoints >= 0 ? (
                <TrendingUp className='h-8 w-8 text-blue-600 ml-3' />
              ) : (
                <TrendingDown className='h-8 w-8 text-red-600 ml-3' />
              )}
              <div>
                <p className='text-sm text-gray-600'>إجمالي النقاط</p>
                <p
                  className={`text-2xl font-bold ${
                    stats.totalPoints >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}
                >
                  {stats.totalPoints}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behaviors Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل السلوك</CardTitle>
          <CardDescription>عرض جميع سجلات السلوك للطلاب</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>الطالب</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>النقاط</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {behaviors.map(behavior => (
                <TableRow key={behavior._id}>
                  <TableCell>
                    {new Date(behavior.date).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{behavior.student.name}</div>
                      <div className='text-sm text-gray-500'>
                        رقم الجلوس: {behavior.student.seatNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        behavior.type === 'positive'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {behavior.type === 'positive' ? 'إيجابي' : 'سلبي'}
                    </span>
                  </TableCell>
                  <TableCell>{behavior.category}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{behavior.title}</div>
                      <div className='text-sm text-gray-500 truncate max-w-xs'>
                        {behavior.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        behavior.points >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {behavior.points >= 0 ? '+' : ''}
                      {behavior.points}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2 space-x-reverse'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEdit(behavior)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(behavior._id)}
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

      {/* Add/Edit Behavior Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBehavior ? 'تعديل سجل السلوك' : 'إضافة سجل سلوك جديد'}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              الطالب
            </label>
            <select
              value={formData.studentId}
              onChange={e =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value=''>اختر الطالب</option>
              {classes
                .find(c => c._id === selectedClass)
                ?.students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} (رقم الجلوس: {student.seatNumber})
                  </option>
                ))}
            </select>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                نوع السلوك
              </label>
              <select
                value={formData.type}
                onChange={e =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'positive' | 'negative',
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              >
                <option value='positive'>إيجابي</option>
                <option value='negative'>سلبي</option>
              </select>
            </div>

            <Input
              label='الفئة'
              value={formData.category}
              onChange={e =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder='مثل: مشاركة، إزعاج، مساعدة الآخرين'
              required
            />
          </div>

          <Input
            label='العنوان'
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              الوصف
            </label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='النقاط'
              type='number'
              value={formData.points}
              onChange={e =>
                setFormData({ ...formData, points: e.target.value })
              }
              placeholder='+5 أو -3'
              required
            />
            <Input
              label='التاريخ'
              type='date'
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className='flex justify-end space-x-3 space-x-reverse'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button type='submit'>
              {editingBehavior ? 'حفظ التعديلات' : 'إضافة السجل'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
