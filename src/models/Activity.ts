import mongoose, { Document, Schema } from 'mongoose'

export interface IActivity extends Document {
  title: string
  description?: string
  type:
    | 'assignment'
    | 'exam'
    | 'quiz'
    | 'project'
    | 'presentation'
    | 'field_trip'
    | 'meeting'
    | 'event'
    | 'holiday'
    | 'other'
  teacher: mongoose.Types.ObjectId
  class?: mongoose.Types.ObjectId
  students?: mongoose.Types.ObjectId[]
  startDate: Date
  endDate?: Date
  dueDate?: Date
  duration?: number // in minutes
  location?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isRecurring: boolean
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc.
    endDate?: Date
    occurrences?: number
  }
  attachments?: Array<{
    name: string
    url: string
    type: string
    size: number
  }>
  reminders?: Array<{
    type: 'email' | 'sms' | 'push' | 'in_app'
    time: Date
    message: string
    sent: boolean
  }>
  tags?: string[]
  notes?: string
  isPublic: boolean
  visibility: 'private' | 'class' | 'school' | 'public'
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'assignment',
        'exam',
        'quiz',
        'project',
        'presentation',
        'field_trip',
        'meeting',
        'event',
        'holiday',
        'other',
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
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    dueDate: Date,
    duration: {
      type: Number,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'postponed'],
      default: 'scheduled',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrence: {
      pattern: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
      },
      interval: {
        type: Number,
        min: 1,
        default: 1,
      },
      daysOfWeek: [
        {
          type: Number,
          min: 0,
          max: 6,
        },
      ],
      endDate: Date,
      occurrences: {
        type: Number,
        min: 1,
      },
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    reminders: [
      {
        type: {
          type: String,
          enum: ['email', 'sms', 'push', 'in_app'],
        },
        time: Date,
        message: String,
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    tags: [String],
    notes: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['private', 'class', 'school', 'public'],
      default: 'private',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
ActivitySchema.index({ teacher: 1, startDate: 1 })
ActivitySchema.index({ class: 1, startDate: 1 })
ActivitySchema.index({ type: 1, status: 1 })
ActivitySchema.index({ startDate: 1, endDate: 1 })

export default mongoose.models.Activity ||
  mongoose.model<IActivity>('Activity', ActivitySchema)
