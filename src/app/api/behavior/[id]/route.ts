import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import Behavior from '@/models/Behavior'

export async function GET(
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
    const behavior = await Behavior.findOne({
      _id: id,
      teacher: session.user.id,
    })
      .populate('student', 'name seatNumber')
      .populate('class', 'name subject')

    if (!behavior) {
      return NextResponse.json({ error: 'Behavior not found' }, { status: 404 })
    }

    return NextResponse.json(behavior)
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
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    await dbConnect()

    const updatedBehavior = await Behavior.findOneAndUpdate(
      { _id: id, teacher: session.user.id },
      body,
      { new: true }
    )
      .populate('student', 'name seatNumber')
      .populate('class', 'name subject')

    if (!updatedBehavior) {
      return NextResponse.json({ error: 'Behavior not found' }, { status: 404 })
    }

    return NextResponse.json(updatedBehavior)
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
    const deletedBehavior = await Behavior.findOneAndDelete({
      _id: id,
      teacher: session.user.id,
    })

    if (!deletedBehavior) {
      return NextResponse.json({ error: 'Behavior not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Behavior deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
