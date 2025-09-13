import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Student from '@/models/Student'
import Class from '@/models/Class'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const classId = searchParams.get('classId')

    await dbConnect()
    let query: any = { teacher: session.user.id }
    if (classId) {
      query.class = classId
    }

    const students = await Student.find(query)
      .populate('class', 'name subject')
      .sort({ seatNumber: 1 })

    return NextResponse.json(students)
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
      name,
      seatNumber,
      classId,
      phone,
      email,
      parentName,
      parentPhone,
      notes,
    } = body

    await dbConnect()

    // Verify that the class belongs to the teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: session.user.id,
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    const newStudent = new Student({
      name,
      seatNumber,
      class: classId,
      teacher: session.user.id,
      phone,
      email,
      parentName,
      parentPhone,
      notes,
    })

    await newStudent.save()

    // Add student to class
    await Class.findByIdAndUpdate(classId, {
      $push: { students: newStudent._id },
    })

    return NextResponse.json(newStudent, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Seat number already exists in this class' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
