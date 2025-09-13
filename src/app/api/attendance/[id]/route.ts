import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Attendance from '@/models/Attendance'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, notes } = body

    await dbConnect()

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { _id: id, teacher: session.user.id },
      { status, notes },
      { new: true }
    )
      .populate('student', 'name seatNumber')
      .populate('class', 'name')

    if (!updatedAttendance) {
      return NextResponse.json(
        { error: 'Attendance not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedAttendance)
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
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const deletedAttendance = await Attendance.findOneAndDelete({
      _id: id,
      teacher: session.user.id,
    })

    if (!deletedAttendance) {
      return NextResponse.json(
        { error: 'Attendance not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Attendance deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
