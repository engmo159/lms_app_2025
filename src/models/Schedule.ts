import mongoose, { Document, Schema } from 'mongoose'

export interface ISchedule extends Document {
  class: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  dayOfWeek: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  subject: string
  room?: string
  isActive: boolean
  academicYear: string
  semester?: string
  createdAt: Date
  updatedAt: Date
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    dayOfWeek: {
      type: String,
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    academicYear: {
      type: String,
      required: true,
      default: () => new Date().getFullYear().toString(),
    },
    semester: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index to prevent overlapping schedules
ScheduleSchema.index({ teacher: 1, dayOfWeek: 1, startTime: 1, endTime: 1 })

export default mongoose.models.Schedule ||
  mongoose.model<ISchedule>('Schedule', ScheduleSchema)
