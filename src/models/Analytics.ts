import mongoose, { Document, Schema } from 'mongoose'

export interface IAnalytics extends Document {
  teacher: mongoose.Types.ObjectId
  class?: mongoose.Types.ObjectId
  student?: mongoose.Types.ObjectId
  type: 'attendance' | 'grades' | 'behavior' | 'engagement' | 'performance'
  period: 'daily' | 'weekly' | 'monthly' | 'semester' | 'yearly'
  date: Date
  metrics: {
    // Attendance metrics
    totalDays?: number
    presentDays?: number
    absentDays?: number
    lateDays?: number
    attendanceRate?: number
    
    // Grade metrics
    averageGrade?: number
    totalAssignments?: number
    completedAssignments?: number
    gradeDistribution?: { [grade: string]: number }
    
    // Behavior metrics
    positiveBehaviors?: number
    negativeBehaviors?: number
    behaviorScore?: number
    
    // Engagement metrics
    participationScore?: number
    assignmentSubmissionRate?: number
    lateSubmissions?: number
    
    // Performance metrics
    improvementRate?: number
    trendDirection?: 'up' | 'down' | 'stable'
    percentile?: number
  }
  insights?: string[]
  recommendations?: string[]
  createdAt: Date
  updatedAt: Date
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
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
    type: {
      type: String,
      enum: ['attendance', 'grades', 'behavior', 'engagement', 'performance'],
      required: true,
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'semester', 'yearly'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    metrics: {
      // Attendance metrics
      totalDays: Number,
      presentDays: Number,
      absentDays: Number,
      lateDays: Number,
      attendanceRate: Number,
      
      // Grade metrics
      averageGrade: Number,
      totalAssignments: Number,
      completedAssignments: Number,
      gradeDistribution: Schema.Types.Mixed,
      
      // Behavior metrics
      positiveBehaviors: Number,
      negativeBehaviors: Number,
      behaviorScore: Number,
      
      // Engagement metrics
      participationScore: Number,
      assignmentSubmissionRate: Number,
      lateSubmissions: Number,
      
      // Performance metrics
      improvementRate: Number,
      trendDirection: {
        type: String,
        enum: ['up', 'down', 'stable'],
      },
      percentile: Number,
    },
    insights: [String],
    recommendations: [String],
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient querying
AnalyticsSchema.index({ teacher: 1, type: 1, period: 1, date: -1 })
AnalyticsSchema.index({ class: 1, type: 1, date: -1 })
AnalyticsSchema.index({ student: 1, type: 1, date: -1 })

export default mongoose.models.Analytics ||
  mongoose.model<IAnalytics>('Analytics', AnalyticsSchema)
