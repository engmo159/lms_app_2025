import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Attendance from '@/models/Attendance'
import Student from '@/models/Student'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const date = searchParams.get('date')

    await dbConnect()
    let query: any = { teacher: session.user.id }
    if (classId) query.class = classId
    if (date) query.date = new Date(date)

    const attendance = await Attendance.find(query)
      .populate('student', 'name seatNumber')
      .populate('class', 'name')
      .sort({ 'student.seatNumber': 1 })

    return NextResponse.json(attendance)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, classId, date, status, notes } = body

    await dbConnect()

    // Verify that the student belongs to the teacher
    const student = await Student.findOne({
      _id: studentId,
      teacher: session.user.id,
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const attendance = new Attendance({
      student: studentId,
      class: classId,
      teacher: session.user.id,
      date: new Date(date),
      status,
      notes,
    })

    await attendance.save()
    return NextResponse.json(attendance, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Attendance already recorded for this student on this date' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
