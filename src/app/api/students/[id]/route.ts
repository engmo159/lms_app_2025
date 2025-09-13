import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Student from '@/models/Student'
import Class from '@/models/Class'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const student = await Student.findOne({
      _id: (await params).id,
      teacher: session.user.id,
    }).populate('class', 'name subject')

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    await dbConnect()

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: (await params).id, teacher: session.user.id },
      body,
      { new: true }
    ).populate('class', 'name subject')

    if (!updatedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(updatedStudent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const deletedStudent = await Student.findOneAndDelete({
      _id: (await params).id,
      teacher: session.user.id,
    })

    if (!deletedStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Remove student from class
    await Class.findByIdAndUpdate(deletedStudent.class, {
      $pull: { students: deletedStudent._id },
    })

    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
