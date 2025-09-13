import mongoose, { Document, Schema } from 'mongoose'

export interface IGrade extends Document {
  student: mongoose.Types.ObjectId
  assignment: mongoose.Types.ObjectId
  class: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  score: number
  maxScore: number
  percentage: number
  notes?: string
  gradedAt: Date
  createdAt: Date
  updatedAt: Date
}

const GradeSchema = new Schema<IGrade>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
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
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      trim: true,
    },
    gradedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index to ensure one grade per student per assignment
GradeSchema.index({ student: 1, assignment: 1 }, { unique: true })

export default mongoose.models.Grade ||
  mongoose.model<IGrade>('Grade', GradeSchema)
