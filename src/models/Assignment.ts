import mongoose, { Document, Schema } from 'mongoose'

export interface IAssignment extends Document {
  title: string
  description?: string
  class: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  type:
    | 'homework'
    | 'quiz'
    | 'exam'
    | 'project'
    | 'participation'
    | 'lab'
    | 'presentation'
    | 'essay'
    | 'research'
    | 'practical'
  maxScore: number
  weight: number // percentage of total grade
  dueDate?: Date
  assignedDate: Date
  isPublished: boolean
  attachments?: string[]
  instructions?: string
  rubric?: {
    criteria: {
      name: string
      description: string
      maxPoints: number
    }[]
  }
  submissionType: 'individual' | 'group' | 'both'
  allowLateSubmission: boolean
  latePenalty: number // percentage penalty per day
  maxLateDays?: number
  requiresApproval: boolean
  isGraded: boolean
  gradingMethod: 'manual' | 'auto' | 'peer'
  timeLimit?: number // in minutes for timed assignments
  attempts?: number // max attempts allowed
  status: 'draft' | 'published' | 'closed' | 'graded'
  createdAt: Date
  updatedAt: Date
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
    type: {
      type: String,
      enum: [
        'homework',
        'quiz',
        'exam',
        'project',
        'participation',
        'lab',
        'presentation',
        'essay',
        'research',
        'practical',
      ],
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
      min: 0,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    dueDate: {
      type: Date,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    attachments: [String],
    instructions: {
      type: String,
      trim: true,
    },
    rubric: {
      criteria: [
        {
          name: String,
          description: String,
          maxPoints: Number,
        },
      ],
    },
    submissionType: {
      type: String,
      enum: ['individual', 'group', 'both'],
      default: 'individual',
    },
    allowLateSubmission: {
      type: Boolean,
      default: true,
    },
    latePenalty: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    maxLateDays: {
      type: Number,
      min: 0,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    isGraded: {
      type: Boolean,
      default: false,
    },
    gradingMethod: {
      type: String,
      enum: ['manual', 'auto', 'peer'],
      default: 'manual',
    },
    timeLimit: {
      type: Number,
      min: 0,
    },
    attempts: {
      type: Number,
      min: 1,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed', 'graded'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Assignment ||
  mongoose.model<IAssignment>('Assignment', AssignmentSchema)
