import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Activity from '@/models/Activity';
import Student from '@/models/Student';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const activity = await Activity.findOne({
      _id: id,
      teacher: session.user.id,
    })
      .populate('class', 'name subject grade')
      .populate('students', 'name seatNumber');

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      students, 
      startDate, 
      endDate, 
      isAllDay, 
      location, 
      attachments, 
      status, 
      priority, 
      reminders 
    } = body;

    await dbConnect();

    // Verify students belong to teacher (if updating students)
    if (students && students.length > 0) {
      const studentCount = await Student.countDocuments({
        _id: { $in: students },
        teacher: session.user.id,
      });

      if (studentCount !== students.length) {
        return NextResponse.json({ 
          error: 'Some students not found or do not belong to teacher' 
        }, { status: 400 });
      }
    }

    const updateData: {
      title?: string;
      description?: string;
      students?: string[];
      startDate?: Date;
      endDate?: Date;
      isAllDay?: boolean;
      location?: string;
      attachments?: string[];
      status?: string;
      priority?: string;
      reminders?: string[];
    } = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (students) updateData.students = students;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (isAllDay !== undefined) updateData.isAllDay = isAllDay;
    if (location !== undefined) updateData.location = location;
    if (attachments) updateData.attachments = attachments;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (reminders) updateData.reminders = reminders;

    const activity = await Activity.findOneAndUpdate(
      { 
        _id: id,
        teacher: session.user.id 
      },
      updateData,
      { new: true }
    )
      .populate('class', 'name subject grade')
      .populate('students', 'name seatNumber');

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const activity = await Activity.findOneAndDelete({
      _id: id,
      teacher: session.user.id,
    });

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
