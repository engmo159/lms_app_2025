import mongoose, { Document, Schema } from 'mongoose'

export interface ISubmission extends Document {
  student: mongoose.Types.ObjectId
  assignment: mongoose.Types.ObjectId
  class: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  content: string
  attachments?: string[]
  submittedAt: Date
  isLate: boolean
  lateDays?: number
  status: 'draft' | 'submitted' | 'graded' | 'returned'
  grade?: mongoose.Types.ObjectId
  feedback?: string
  resubmissionAllowed: boolean
  resubmissionCount: number
  plagiarismScore?: number
  wordCount?: number
  createdAt: Date
  updatedAt: Date
}

const SubmissionSchema = new Schema<ISubmission>(
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
    content: {
      type: String,
      required: true,
    },
    attachments: [String],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateDays: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'graded', 'returned'],
      default: 'draft',
    },
    grade: {
      type: Schema.Types.ObjectId,
      ref: 'Grade',
    },
    feedback: {
      type: String,
      trim: true,
    },
    resubmissionAllowed: {
      type: Boolean,
      default: false,
    },
    resubmissionCount: {
      type: Number,
      default: 0,
    },
    plagiarismScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    wordCount: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index to ensure one submission per student per assignment
SubmissionSchema.index({ student: 1, assignment: 1 }, { unique: true })

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>('Submission', SubmissionSchema)
