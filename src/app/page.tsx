'use client'

import Link from 'next/link';
import { BookOpen, Users, UserCheck, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              نظام إدارة الفصول
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              نظام شامل لإدارة الفصول والطلاب والحضور والدرجات
            </p>
            <div className="space-x-4 space-x-reverse">
              <Link href="/auth/signin">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  إنشاء حساب جديد
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            المميزات الرئيسية
          </h2>
          <p className="text-lg text-gray-600">
            كل ما تحتاجه لإدارة فصلك الدراسي بكفاءة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>إدارة الفصول</CardTitle>
              <CardDescription>
                إنشاء وإدارة الفصول الدراسية مع جميع التفاصيل
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>إدارة الطلاب</CardTitle>
              <CardDescription>
                إضافة وتتبع معلومات الطلاب وترتيبهم
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <UserCheck className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>تسجيل الحضور</CardTitle>
              <CardDescription>
                تسجيل حضور وغياب الطلاب بسهولة
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Award className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>دفتر الدرجات</CardTitle>
              <CardDescription>
                إدخال وتتبع درجات الطلاب وحساب المتوسطات
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              ابدأ اليوم
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              انضم إلى آلاف المعلمين الذين يستخدمون نظامنا
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                إنشاء حساب مجاني
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}