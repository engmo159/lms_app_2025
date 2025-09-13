import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Activity from '@/models/Activity';
import Class from '@/models/Class';
import Student from '@/models/Student';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');

    await dbConnect();

    const query: {
      teacher: string;
      type?: string;
      class?: string;
      status?: string;
      startDate?: { $gte?: Date; $lte?: Date };
    } = { teacher: session.user.id };
    if (type) query.type = type;
    if (classId) query.class = classId;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query)
      .populate('class', 'name subject grade')
      .populate('students', 'name seatNumber')
      .sort({ startDate: 1 })
      .limit(limit);

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      type, 
      classId, 
      students, 
      startDate, 
      endDate, 
      isAllDay, 
      location, 
      attachments, 
      priority, 
      reminders 
    } = body;

    // Validate required fields
    if (!title || !type || !startDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, type, startDate' 
      }, { status: 400 });
    }

    await dbConnect();

    // Verify class belongs to teacher (if specified)
    if (classId) {
      const classData = await Class.findOne({
        _id: classId,
        teacher: session.user.id,
      });

      if (!classData) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 });
      }
    }

    // Verify students belong to class (if specified)
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

    const activity = new Activity({
      title,
      description,
      type,
      class: classId,
      teacher: session.user.id,
      students: students || [],
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      isAllDay: isAllDay || false,
      location,
      attachments: attachments || [],
      priority: priority || 'medium',
      reminders: reminders || [],
    });

    await activity.save();

    const populatedActivity = await Activity.findById(activity._id)
      .populate('class', 'name subject grade')
      .populate('students', 'name seatNumber');

    return NextResponse.json(populatedActivity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
