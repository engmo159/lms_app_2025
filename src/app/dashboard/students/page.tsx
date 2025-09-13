'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, Search, Filter } from 'lucide-react'
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
  phone?: string
  email?: string
  parentName?: string
  parentPhone?: string
  notes?: string
  isActive: boolean
  enrollmentDate: string
}

interface Class {
  _id: string
  name: string
  subject: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    seatNumber: '',
    classId: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    notes: '',
  })

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
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
      const url = editingStudent
        ? `/api/students/${editingStudent._id}`
        : '/api/students'
      const method = editingStudent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          seatNumber: parseInt(formData.seatNumber),
        }),
      })

      if (response.ok) {
        await fetchStudents()
        setIsModalOpen(false)
        setEditingStudent(null)
        setFormData({
          name: '',
          seatNumber: '',
          classId: '',
          phone: '',
          email: '',
          parentName: '',
          parentPhone: '',
          notes: '',
        })
      }
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      seatNumber: student.seatNumber.toString(),
      classId: student.class._id,
      phone: student.phone || '',
      email: student.email || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      notes: student.notes || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      try {
        const response = await fetch(`/api/students/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchStudents()
        }
      } catch (error) {
        console.error('Error deleting student:', error)
      }
    }
  }

  const openModal = () => {
    setEditingStudent(null)
    setFormData({
      name: '',
      seatNumber: '',
      classId: '',
      phone: '',
      email: '',
      parentName: '',
      parentPhone: '',
      notes: '',
    })
    setIsModalOpen(true)
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesClass = !selectedClass || student.class._id === selectedClass
    return matchesSearch && matchesClass
  })

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
          <h1 className='text-2xl font-bold text-gray-900'>الطلاب</h1>
          <p className='text-gray-600'>إدارة طلابك في جميع الفصول</p>
        </div>
        <Button onClick={openModal} className='flex items-center'>
          <Plus className='h-4 w-4 ml-2' />
          إضافة طالب جديد
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='البحث عن طالب...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pr-10'
                />
              </div>
            </div>
            <div className='sm:w-64'>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>جميع الفصول</option>
                {classes.map(classData => (
                  <option key={classData._id} value={classData._id}>
                    {classData.name} - {classData.subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center'>
            <Users className='h-5 w-5 ml-2' />
            قائمة الطلاب ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الجلوس</TableHead>
                <TableHead>اسم الطالب</TableHead>
                <TableHead>الفصل</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>ولي الأمر</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map(student => (
                <TableRow key={student._id}>
                  <TableCell className='font-medium'>
                    {student.seatNumber}
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{student.class.name}</div>
                      <div className='text-sm text-gray-500'>
                        {student.class.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.phone || '-'}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>
                        {student.parentName || '-'}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {student.parentPhone || '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2 space-x-reverse'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(student._id)}
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

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'تعديل الطالب' : 'إضافة طالب جديد'}
        size='lg'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='اسم الطالب'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label='رقم الجلوس'
              type='number'
              value={formData.seatNumber}
              onChange={e =>
                setFormData({ ...formData, seatNumber: e.target.value })
              }
              required
            />
          </div>

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

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='رقم الهاتف'
              type='tel'
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <Input
              label='البريد الإلكتروني'
              type='email'
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='اسم ولي الأمر'
              value={formData.parentName}
              onChange={e =>
                setFormData({ ...formData, parentName: e.target.value })
              }
            />
            <Input
              label='رقم هاتف ولي الأمر'
              type='tel'
              value={formData.parentPhone}
              onChange={e =>
                setFormData({ ...formData, parentPhone: e.target.value })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              ملاحظات
            </label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={3}
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
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
              {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
