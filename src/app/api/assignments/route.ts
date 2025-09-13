import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Assignment from '@/models/Assignment'
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

    const assignments = await Assignment.find(query)
      .populate('class', 'name subject')
      .sort({ createdAt: -1 })

    return NextResponse.json(assignments)
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
    const { title, description, classId, type, maxScore, weight, dueDate } =
      body

    await dbConnect()

    // Verify that the class belongs to the teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: session.user.id,
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    const newAssignment = new Assignment({
      title,
      description,
      class: classId,
      teacher: session.user.id,
      type,
      maxScore,
      weight,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    await newAssignment.save()
    return NextResponse.json(newAssignment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
