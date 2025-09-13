'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FileText, Calendar, Award } from 'lucide-react'
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

interface Assignment {
  _id: string
  title: string
  description?: string
  class: {
    _id: string
    name: string
    subject: string
  }
  type: 'homework' | 'quiz' | 'exam' | 'project' | 'participation'
  maxScore: number
  weight: number
  dueDate?: string
  assignedDate: string
  isPublished: boolean
}

interface Class {
  _id: string
  name: string
  subject: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  )
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    type: 'homework' as 'homework' | 'quiz' | 'exam' | 'project' | 'participation',
    maxScore: '',
    weight: '',
    dueDate: '',
  })

  useEffect(() => {
    fetchAssignments()
    fetchClasses()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments')
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      }
    } catch (error) {
      console.error('Error fetching assignments:', error)
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
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAssignment
        ? `/api/assignments/${editingAssignment._id}`
        : '/api/assignments'
      const method = editingAssignment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          maxScore: parseInt(formData.maxScore),
          weight: parseInt(formData.weight),
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        }),
      })

      if (response.ok) {
        await fetchAssignments()
        setIsModalOpen(false)
        setEditingAssignment(null)
        setFormData({
          title: '',
          description: '',
          classId: '',
          type: 'homework',
          maxScore: '',
          weight: '',
          dueDate: '',
        })
      }
    } catch (error) {
      console.error('Error saving assignment:', error)
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      classId: assignment.class._id,
      type: assignment.type,
      maxScore: assignment.maxScore.toString(),
      weight: assignment.weight.toString(),
      dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الواجب؟')) {
      try {
        const response = await fetch(`/api/assignments/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchAssignments()
        }
      } catch (error) {
        console.error('Error deleting assignment:', error)
      }
    }
  }

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      })

      if (response.ok) {
        await fetchAssignments()
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
    }
  }

  const openModal = () => {
    setEditingAssignment(null)
    setFormData({
      title: '',
      description: '',
      classId: '',
      type: 'homework',
      maxScore: '',
      weight: '',
      dueDate: '',
    })
    setIsModalOpen(true)
  }

  const getTypeText = (type: string) => {
    const types = {
      homework: 'واجب منزلي',
      quiz: 'اختبار قصير',
      exam: 'امتحان',
      project: 'مشروع',
      participation: 'مشاركة',
    }
    return types[type as keyof typeof types] || type
  }

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
            الواجبات والاختبارات
          </h1>
          <p className='text-gray-600'>إدارة الواجبات والاختبارات للطلاب</p>
        </div>
        <Button onClick={openModal} className='flex items-center'>
          <Plus className='h-4 w-4 ml-2' />
          إضافة واجب جديد
        </Button>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <FileText className='h-5 w-5 ml-2' />
            قائمة الواجبات والاختبارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الفصل</TableHead>
                <TableHead>الدرجة العظمى</TableHead>
                <TableHead>الوزن</TableHead>
                <TableHead>تاريخ الاستحقاق</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map(assignment => (
                <TableRow key={assignment._id}>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{assignment.title}</div>
                      {assignment.description && (
                        <div className='text-sm text-gray-500 truncate max-w-xs'>
                          {assignment.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                      {getTypeText(assignment.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{assignment.class.name}</div>
                      <div className='text-sm text-gray-500'>
                        {assignment.class.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.maxScore}</TableCell>
                  <TableCell>{assignment.weight}%</TableCell>
                  <TableCell>
                    {assignment.dueDate ? (
                      <div className='flex items-center text-sm'>
                        <Calendar className='h-4 w-4 ml-1' />
                        {new Date(assignment.dueDate).toLocaleDateString(
                          'ar-SA'
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {assignment.isPublished ? 'منشور' : 'مسودة'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2 space-x-reverse'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          handlePublish(assignment._id, assignment.isPublished)
                        }
                      >
                        {assignment.isPublished ? 'إلغاء النشر' : 'نشر'}
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEdit(assignment)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(assignment._id)}
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

      {/* Add/Edit Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? 'تعديل الواجب' : 'إضافة واجب جديد'}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            label='عنوان الواجب'
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
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                الفصل
              </label>
              <select
                value={formData.classId}
                onChange={e =>
                  setFormData({ ...formData, classId: e.target.value })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              >
                <option value=''>اختر الفصل</option>
                {classes.map(classData => (
                  <option key={classData._id} value={classData._id}>
                    {classData.name} - {classData.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                نوع الواجب
              </label>
              <select
                value={formData.type}
                onChange={e =>
                  setFormData({ ...formData, type: e.target.value as 'homework' | 'quiz' | 'exam' | 'project' | 'participation' })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              >
                <option value='homework'>واجب منزلي</option>
                <option value='quiz'>اختبار قصير</option>
                <option value='exam'>امتحان</option>
                <option value='project'>مشروع</option>
                <option value='participation'>مشاركة</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='الدرجة العظمى'
              type='number'
              value={formData.maxScore}
              onChange={e =>
                setFormData({ ...formData, maxScore: e.target.value })
              }
              required
            />
            <Input
              label='الوزن (%)'
              type='number'
              min='0'
              max='100'
              value={formData.weight}
              onChange={e =>
                setFormData({ ...formData, weight: e.target.value })
              }
              required
            />
          </div>

          <Input
            label='تاريخ الاستحقاق'
            type='date'
            value={formData.dueDate}
            onChange={e =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />

          <div className='flex justify-end space-x-3 space-x-reverse'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button type='submit'>
              {editingAssignment ? 'حفظ التعديلات' : 'إضافة الواجب'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
