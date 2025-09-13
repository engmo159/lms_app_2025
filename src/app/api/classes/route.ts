import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Assignment from '@/models/Assignment';
import Attendance from '@/models/Attendance';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const status = searchParams.get('status');

    await dbConnect();
    
    let query: any = { teacher: session.user.id };
    if (status) {
      query.status = status;
    }

    const classes = await Class.find(query)
      .populate('students', 'name seatNumber avatar isActive')
      .sort({ createdAt: -1 });

    if (includeStats) {
      const classesWithStats = await Promise.all(
        classes.map(async (classItem) => {
          const studentCount = await Student.countDocuments({ 
            class: classItem._id, 
            isActive: true 
          });
          
          const assignmentCount = await Assignment.countDocuments({ 
            class: classItem._id 
          });
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const attendanceToday = await Attendance.countDocuments({
            class: classItem._id,
            date: { $gte: today },
            status: 'present'
          });

          return {
            ...classItem.toObject(),
            stats: {
              studentCount,
              assignmentCount,
              attendanceToday,
              attendanceRate: studentCount > 0 ? (attendanceToday / studentCount) * 100 : 0
            }
          };
        })
      );
      
      return NextResponse.json(classesWithStats);
    }

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
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
      name, 
      subject, 
      description, 
      grade, 
      schedule, 
      settings,
      classCode,
      room,
      capacity,
      startDate,
      endDate,
      semester,
      prerequisites,
      objectives,
      resources
    } = body;

    // Validate required fields
    if (!name || !subject || !grade || !startDate) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, subject, grade, startDate' 
      }, { status: 400 });
    }

    await dbConnect();
    
    // Check if class code is unique
    if (classCode) {
      const existingClass = await Class.findOne({ classCode });
      if (existingClass) {
        return NextResponse.json({ 
          error: 'Class code already exists' 
        }, { status: 400 });
      }
    }

    const newClass = new Class({
      name,
      subject,
      description,
      grade,
      schedule: schedule || [],
      settings: {
        attendanceWeight: 30,
        behaviorWeight: 20,
        assignmentWeight: 50,
        maxAbsences: 10,
        gradingPolicy: '',
        lateSubmissionPolicy: '',
        behaviorTracking: true,
        parentNotifications: true,
        ...settings
      },
      classCode,
      room,
      capacity: capacity || 30,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      semester,
      prerequisites: prerequisites || [],
      objectives: objectives || [],
      resources: resources || [],
      teacher: session.user.id,
    });

    await newClass.save();
    
    // Populate the response
    const populatedClass = await Class.findById(newClass._id)
      .populate('students', 'name seatNumber avatar')
      .populate('teacher', 'name email');

    return NextResponse.json(populatedClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
