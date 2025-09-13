import mongoose, { Document, Schema } from 'mongoose'

export interface IReport extends Document {
  title: string
  type:
    | 'attendance'
    | 'grades'
    | 'behavior'
    | 'performance'
    | 'summary'
    | 'custom'
  teacher: mongoose.Types.ObjectId
  class?: mongoose.Types.ObjectId
  student?: mongoose.Types.ObjectId
  period: {
    startDate: Date
    endDate: Date
    academicYear: string
    semester?: string
  }
  data: {
    summary: {
      totalStudents: number
      averageAttendance: number
      averageGrade: number
      behaviorScore: number
      topPerformers: mongoose.Types.ObjectId[]
      strugglingStudents: mongoose.Types.ObjectId[]
    }
    attendance: {
      daily: Array<{
        date: Date
        present: number
        absent: number
        late: number
        excused: number
        percentage: number
      }>
      byStudent: Array<{
        student: mongoose.Types.ObjectId
        totalDays: number
        presentDays: number
        absentDays: number
        lateDays: number
        excusedDays: number
        percentage: number
      }>
    }
    grades: {
      byAssignment: Array<{
        assignment: mongoose.Types.ObjectId
        averageScore: number
        highestScore: number
        lowestScore: number
        passRate: number
      }>
      byStudent: Array<{
        student: mongoose.Types.ObjectId
        averageGrade: number
        totalAssignments: number
        completedAssignments: number
        gradeDistribution: {
          A: number
          B: number
          C: number
          D: number
          F: number
        }
      }>
    }
    behavior: {
      incidents: Array<{
        student: mongoose.Types.ObjectId
        type: 'positive' | 'negative'
        description: string
        date: Date
        points: number
      }>
      summary: {
        totalPositive: number
        totalNegative: number
        averageBehaviorScore: number
      }
    }
  }
  filters: {
    dateRange?: {
      start: Date
      end: Date
    }
    students?: mongoose.Types.ObjectId[]
    assignments?: mongoose.Types.ObjectId[]
    attendanceStatus?: string[]
  }
  isPublic: boolean
  sharedWith: mongoose.Types.ObjectId[] // teachers who can view this report
  generatedAt: Date
  createdAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'attendance',
        'grades',
        'behavior',
        'performance',
        'summary',
        'custom',
      ],
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    period: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      academicYear: {
        type: String,
        required: true,
      },
      semester: String,
    },
    data: {
      summary: {
        totalStudents: Number,
        averageAttendance: Number,
        averageGrade: Number,
        behaviorScore: Number,
        topPerformers: [Schema.Types.ObjectId],
        strugglingStudents: [Schema.Types.ObjectId],
      },
      attendance: {
        daily: [
          {
            date: Date,
            present: Number,
            absent: Number,
            late: Number,
            excused: Number,
            percentage: Number,
          },
        ],
        byStudent: [
          {
            student: { type: Schema.Types.ObjectId, ref: 'Student' },
            totalDays: Number,
            presentDays: Number,
            absentDays: Number,
            lateDays: Number,
            excusedDays: Number,
            percentage: Number,
          },
        ],
      },
      grades: {
        byAssignment: [
          {
            assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
            averageScore: Number,
            highestScore: Number,
            lowestScore: Number,
            passRate: Number,
          },
        ],
        byStudent: [
          {
            student: { type: Schema.Types.ObjectId, ref: 'Student' },
            averageGrade: Number,
            totalAssignments: Number,
            completedAssignments: Number,
            gradeDistribution: {
              A: Number,
              B: Number,
              C: Number,
              D: Number,
              F: Number,
            },
          },
        ],
      },
      behavior: {
        incidents: [
          {
            student: { type: Schema.Types.ObjectId, ref: 'Student' },
            type: {
              type: String,
              enum: ['positive', 'negative'],
            },
            description: String,
            date: Date,
            points: Number,
          },
        ],
        summary: {
          totalPositive: Number,
          totalNegative: Number,
          averageBehaviorScore: Number,
        },
      },
    },
    filters: {
      dateRange: {
        start: Date,
        end: Date,
      },
      students: [Schema.Types.ObjectId],
      assignments: [Schema.Types.ObjectId],
      attendanceStatus: [String],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
ReportSchema.index({
  teacher: 1,
  type: 1,
  'period.startDate': 1,
  'period.endDate': 1,
})
ReportSchema.index({ class: 1, type: 1 })
ReportSchema.index({ student: 1, type: 1 })

export default mongoose.models.Report ||
  mongoose.model<IReport>('Report', ReportSchema)
