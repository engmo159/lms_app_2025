import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';
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
    const type = searchParams.get('type');
    const classId = searchParams.get('classId');
    const studentId = searchParams.get('studentId');
    const isGenerated = searchParams.get('isGenerated');

    await dbConnect();

    let query: any = { teacher: session.user.id };
    if (type) query.type = type;
    if (classId) query.class = classId;
    if (studentId) query.student = studentId;
    if (isGenerated !== null) query.isGenerated = isGenerated === 'true';

    const reports = await Report.find(query)
      .populate('class', 'name subject grade')
      .populate('student', 'name seatNumber')
      .sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
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
      type, 
      classId, 
      studentId, 
      dateRange, 
      filters 
    } = body;

    // Validate required fields
    if (!title || !type || !classId || !dateRange) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, type, classId, dateRange' 
      }, { status: 400 });
    }

    await dbConnect();

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: session.user.id,
    });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Verify student belongs to class (if specified)
    if (studentId) {
      const student = await Student.findOne({
        _id: studentId,
        class: classId,
        teacher: session.user.id,
      });

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
    }

    const report = new Report({
      title,
      type,
      class: classId,
      teacher: session.user.id,
      student: studentId,
      dateRange: {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end),
      },
      filters: filters || {},
    });

    await report.save();

    // Generate report data
    const reportData = await generateReportData(report);
    
    // Update report with generated data
    report.data = reportData;
    report.isGenerated = true;
    report.generatedAt = new Date();
    await report.save();

    const populatedReport = await Report.findById(report._id)
      .populate('class', 'name subject grade')
      .populate('student', 'name seatNumber');

    return NextResponse.json(populatedReport, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function generateReportData(report: any): Promise<any> {
  const { type, class: classId, student: studentId, dateRange, filters } = report;
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);

  let query: any = { 
    class: classId,
    date: { $gte: startDate, $lte: endDate }
  };

  if (studentId) {
    query.student = studentId;
  }

  switch (type) {
    case 'attendance':
      const attendanceData = await Attendance.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$student',
            totalDays: { $sum: 1 },
            presentDays: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
            absentDays: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
            lateDays: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }
          }
        },
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },
        {
          $project: {
            studentName: '$student.name',
            studentId: '$student._id',
            totalDays: 1,
            presentDays: 1,
            absentDays: 1,
            lateDays: 1,
            attendanceRate: {
              $multiply: [
                { $divide: ['$presentDays', '$totalDays'] },
                100
              ]
            }
          }
        }
      ]);

      return {
        summary: {
          totalStudents: attendanceData.length,
          averageAttendanceRate: attendanceData.length > 0 ? 
            attendanceData.reduce((sum, item) => sum + item.attendanceRate, 0) / attendanceData.length : 0
        },
        data: attendanceData
      };

    case 'grades':
      const gradeData = await Grade.aggregate([
        { $match: { class: classId } },
        {
          $group: {
            _id: '$student',
            averageGrade: { $avg: '$percentage' },
            totalAssignments: { $sum: 1 },
            completedAssignments: { $sum: { $cond: [{ $gt: ['$score', 0] }, 1, 0] } }
          }
        },
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },
        {
          $project: {
            studentName: '$student.name',
            studentId: '$student._id',
            averageGrade: 1,
            totalAssignments: 1,
            completedAssignments: 1,
            completionRate: {
              $multiply: [
                { $divide: ['$completedAssignments', '$totalAssignments'] },
                100
              ]
            }
          }
        }
      ]);

      return {
        summary: {
          totalStudents: gradeData.length,
          averageGrade: gradeData.length > 0 ? 
            gradeData.reduce((sum, item) => sum + item.averageGrade, 0) / gradeData.length : 0
        },
        data: gradeData
      };

    case 'behavior':
      const behaviorData = await Behavior.aggregate([
        { $match: { ...query } },
        {
          $group: {
            _id: '$student',
            positiveBehaviors: { $sum: { $cond: [{ $eq: ['$type', 'positive'] }, 1, 0] } },
            negativeBehaviors: { $sum: { $cond: [{ $eq: ['$type', 'negative'] }, 1, 0] } },
            totalPoints: { $sum: '$points' }
          }
        },
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: '_id',
            as: 'student'
          }
        },
        { $unwind: '$student' },
        {
          $project: {
            studentName: '$student.name',
            studentId: '$student._id',
            positiveBehaviors: 1,
            negativeBehaviors: 1,
            totalPoints: 1,
            behaviorScore: {
              $cond: [
                { $gt: [{ $add: ['$positiveBehaviors', '$negativeBehaviors'] }, 0] },
                {
                  $multiply: [
                    { $divide: ['$positiveBehaviors', { $add: ['$positiveBehaviors', '$negativeBehaviors'] }] },
                    100
                  ]
                },
                0
              ]
            }
          }
        }
      ]);

      return {
        summary: {
          totalStudents: behaviorData.length,
          averageBehaviorScore: behaviorData.length > 0 ? 
            behaviorData.reduce((sum, item) => sum + item.behaviorScore, 0) / behaviorData.length : 0
        },
        data: behaviorData
      };

    case 'comprehensive':
      // Combine all data types
      const [attendance, grades, behavior] = await Promise.all([
        generateReportData({ ...report, type: 'attendance' }),
        generateReportData({ ...report, type: 'grades' }),
        generateReportData({ ...report, type: 'behavior' })
      ]);

      return {
        attendance,
        grades,
        behavior,
        summary: {
          totalStudents: attendance.summary.totalStudents,
          averageAttendanceRate: attendance.summary.averageAttendanceRate,
          averageGrade: grades.summary.averageGrade,
          averageBehaviorScore: behavior.summary.averageBehaviorScore
        }
      };

    default:
      return { error: 'Invalid report type' };
  }
}
