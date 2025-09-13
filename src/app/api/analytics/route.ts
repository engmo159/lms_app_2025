import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Analytics from '@/models/Analytics';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import Assignment from '@/models/Assignment';
import Grade from '@/models/Grade';
import Behavior from '@/models/Behavior';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'comprehensive';
    const period = searchParams.get('period') || 'monthly';
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');

    await dbConnect();

    let query: any = { teacher: session.user.id };
    if (classId) query.class = classId;
    if (studentId) query.student = studentId;

    // Get analytics data
    const analytics = await Analytics.find(query)
      .sort({ date: -1 })
      .limit(100);

    // If no analytics data exists, generate it
    if (analytics.length === 0) {
      await generateAnalytics(session.user.id, classId || undefined, studentId || undefined);
      const newAnalytics = await Analytics.find(query)
        .sort({ date: -1 })
        .limit(100);
      return NextResponse.json(newAnalytics);
    }

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
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
    const { type, period, classId, studentId } = body;

    await dbConnect();

    // Generate analytics for the specified parameters
    const analytics = await generateAnalytics(session.user.id, classId || undefined, studentId || undefined, type, period);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function generateAnalytics(
  teacherId: string, 
  classId?: string, 
  studentId?: string, 
  type: string = 'comprehensive',
  period: string = 'monthly'
) {
  const analytics: any[] = [];
  const now = new Date();
  
  // Calculate date range based on period
  let startDate: Date;
  switch (period) {
    case 'daily':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'semester':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Build query
  let query: any = { teacher: teacherId };
  if (classId) query.class = classId;
  if (studentId) query.student = studentId;

  // Generate attendance analytics
  if (type === 'attendance' || type === 'comprehensive') {
    const attendanceData = await Attendance.aggregate([
      { $match: { ...query, date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          absentDays: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          lateDays: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    for (const data of attendanceData) {
      const attendanceRate = data.totalDays > 0 ? (data.presentDays / data.totalDays) * 100 : 0;
      
      const analyticsRecord = new Analytics({
        teacher: teacherId,
        class: classId,
        student: studentId,
        type: 'attendance',
        period,
        date: new Date(data._id),
        metrics: {
          totalDays: data.totalDays,
          presentDays: data.presentDays,
          absentDays: data.absentDays,
          lateDays: data.lateDays,
          attendanceRate
        }
      });
      
      await analyticsRecord.save();
      analytics.push(analyticsRecord);
    }
  }

  // Generate grade analytics
  if (type === 'grades' || type === 'comprehensive') {
    const gradeData = await Grade.aggregate([
      { $match: { ...query } },
      {
        $group: {
          _id: null,
          averageGrade: { $avg: '$percentage' },
          totalAssignments: { $sum: 1 },
          completedAssignments: { $sum: { $cond: [{ $gt: ['$score', 0] }, 1, 0] } }
        }
      }
    ]);

    if (gradeData.length > 0) {
      const analyticsRecord = new Analytics({
        teacher: teacherId,
        class: classId,
        student: studentId,
        type: 'grades',
        period,
        date: now,
        metrics: {
          averageGrade: gradeData[0].averageGrade,
          totalAssignments: gradeData[0].totalAssignments,
          completedAssignments: gradeData[0].completedAssignments
        }
      });
      
      await analyticsRecord.save();
      analytics.push(analyticsRecord);
    }
  }

  // Generate behavior analytics
  if (type === 'behavior' || type === 'comprehensive') {
    const behaviorData = await Behavior.aggregate([
      { $match: { ...query, date: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          positiveBehaviors: { $sum: { $cond: [{ $eq: ['$type', 'positive'] }, 1, 0] } },
          negativeBehaviors: { $sum: { $cond: [{ $eq: ['$type', 'negative'] }, 1, 0] } }
        }
      }
    ]);

    if (behaviorData.length > 0) {
      const totalBehaviors = behaviorData[0].positiveBehaviors + behaviorData[0].negativeBehaviors;
      const behaviorScore = totalBehaviors > 0 ? 
        ((behaviorData[0].positiveBehaviors - behaviorData[0].negativeBehaviors) / totalBehaviors) * 100 : 0;
      
      const analyticsRecord = new Analytics({
        teacher: teacherId,
        class: classId,
        student: studentId,
        type: 'behavior',
        period,
        date: now,
        metrics: {
          positiveBehaviors: behaviorData[0].positiveBehaviors,
          negativeBehaviors: behaviorData[0].negativeBehaviors,
          behaviorScore
        }
      });
      
      await analyticsRecord.save();
      analytics.push(analyticsRecord);
    }
  }

  return analytics;
}
