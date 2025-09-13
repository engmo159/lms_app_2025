import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Behavior from '@/models/Behavior'
import Student from '@/models/Student'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const studentId = searchParams.get('studentId')

    await dbConnect()
    let query: any = { teacher: session.user.id }
    if (classId) query.class = classId
    if (studentId) query.student = studentId

    const behaviors = await Behavior.find(query)
      .populate('student', 'name seatNumber')
      .populate('class', 'name subject')
      .sort({ date: -1 })

    return NextResponse.json(behaviors)
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
    const {
      studentId,
      classId,
      type,
      category,
      title,
      description,
      points,
      date,
    } = body

    await dbConnect()

    // Verify that the student belongs to the teacher
    const student = await Student.findOne({
      _id: studentId,
      teacher: session.user.id,
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const behavior = new Behavior({
      student: studentId,
      class: classId,
      teacher: session.user.id,
      type,
      category,
      title,
      description,
      points,
      date: new Date(date),
    })

    await behavior.save()
    return NextResponse.json(behavior, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
