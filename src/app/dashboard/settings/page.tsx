'use client'

import React, { useState, useEffect } from 'react'
import { User, Bell, Globe, Moon, Sun, Save } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface TeacherSettings {
  name: string
  email: string
  phone: string
  school: string
  subjects: string[]
  preferences: {
    language: 'ar' | 'en'
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<TeacherSettings>({
    name: '',
    email: '',
    phone: '',
    school: '',
    subjects: [],
    preferences: {
      language: 'ar',
      theme: 'light',
      notifications: true,
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/teacher/profile')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('تم حفظ الإعدادات بنجاح')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('حدث خطأ أثناء حفظ الإعدادات')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...settings.subjects]
    newSubjects[index] = value
    setSettings({ ...settings, subjects: newSubjects })
  }

  const addSubject = () => {
    setSettings({
      ...settings,
      subjects: [...settings.subjects, ''],
    })
  }

  const removeSubject = (index: number) => {
    const newSubjects = settings.subjects.filter((_, i) => i !== index)
    setSettings({ ...settings, subjects: newSubjects })
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
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>الإعدادات</h1>
        <p className='text-gray-600'>إدارة إعدادات حسابك وتفضيلاتك</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.includes('نجح')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <User className='h-5 w-5 ml-2' />
              معلومات الملف الشخصي
            </CardTitle>
            <CardDescription>تحديث معلوماتك الشخصية</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Input
              label='الاسم الكامل'
              value={settings.name}
              onChange={e => setSettings({ ...settings, name: e.target.value })}
            />

            <Input
              label='البريد الإلكتروني'
              type='email'
              value={settings.email}
              onChange={e =>
                setSettings({ ...settings, email: e.target.value })
              }
            />

            <Input
              label='رقم الهاتف'
              type='tel'
              value={settings.phone}
              onChange={e =>
                setSettings({ ...settings, phone: e.target.value })
              }
            />

            <Input
              label='اسم المدرسة'
              value={settings.school}
              onChange={e =>
                setSettings({ ...settings, school: e.target.value })
              }
            />

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                المواد التي تدرسها
              </label>
              {settings.subjects.map((subject, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 space-x-reverse mb-2'
                >
                  <Input
                    value={subject}
                    onChange={e => handleSubjectChange(index, e.target.value)}
                    placeholder='اسم المادة'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => removeSubject(index)}
                    className='text-red-600 hover:text-red-700'
                  >
                    حذف
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addSubject}
                className='mt-2'
              >
                إضافة مادة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Bell className='h-5 w-5 ml-2' />
              التفضيلات
            </CardTitle>
            <CardDescription>تخصيص تجربتك في التطبيق</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                اللغة
              </label>
              <select
                value={settings.preferences.language}
                onChange={e =>
                  setSettings({
                    ...settings,
                    preferences: {
                      ...settings.preferences,
                      language: e.target.value as 'ar' | 'en',
                    },
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='ar'>العربية</option>
                <option value='en'>English</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                المظهر
              </label>
              <div className='flex space-x-4 space-x-reverse'>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        theme: 'light',
                      },
                    })
                  }
                  className={`flex items-center px-4 py-2 rounded-md border ${
                    settings.preferences.theme === 'light'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Sun className='h-4 w-4 ml-2' />
                  فاتح
                </button>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        theme: 'dark',
                      },
                    })
                  }
                  className={`flex items-center px-4 py-2 rounded-md border ${
                    settings.preferences.theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <Moon className='h-4 w-4 ml-2' />
                  داكن
                </button>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div>
                <label className='text-sm font-medium text-gray-700'>
                  الإشعارات
                </label>
                <p className='text-xs text-gray-500'>
                  تلقي إشعارات حول الأنشطة المهمة
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    preferences: {
                      ...settings.preferences,
                      notifications: !settings.preferences.notifications,
                    },
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.preferences.notifications
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.preferences.notifications
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button
          onClick={handleSave}
          disabled={saving}
          className='flex items-center'
        >
          <Save className='h-4 w-4 ml-2' />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </div>
  )
}
