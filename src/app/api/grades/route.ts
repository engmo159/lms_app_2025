import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Grade from '@/models/Grade'
import Student from '@/models/Student'
import Assignment from '@/models/Assignment'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')
    const assignmentId = searchParams.get('assignmentId')

    await dbConnect()
    let query: any = { teacher: session.user.id }
    if (classId) query.class = classId
    if (assignmentId) query.assignment = assignmentId

    const grades = await Grade.find(query)
      .populate('student', 'name seatNumber')
      .populate('assignment', 'title maxScore weight type')
      .populate('class', 'name subject')
      .sort({ 'student.seatNumber': 1 })

    return NextResponse.json(grades)
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
    const { studentId, assignmentId, classId, score, maxScore, notes } = body

    await dbConnect()

    // Verify that the student belongs to the teacher
    const student = await Student.findOne({
      _id: studentId,
      teacher: session.user.id,
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Verify that the assignment belongs to the teacher
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      teacher: session.user.id,
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    const percentage = (score / maxScore) * 100

    const grade = new Grade({
      student: studentId,
      assignment: assignmentId,
      class: classId,
      teacher: session.user.id,
      score,
      maxScore,
      percentage,
      notes,
    })

    await grade.save()
    return NextResponse.json(grade, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Grade already exists for this student and assignment' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
