import mongoose, { Document, Schema } from 'mongoose'

export interface IClass extends Document {
  name: string
  subject: string
  description?: string
  teacher: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[]
  academicYear: string
  grade: string
  classCode?: string // unique class identifier
  room?: string
  capacity: number
  schedule: {
    day: string
    startTime: string
    endTime: string
    duration: number // in minutes
    room?: string
  }[]
  settings: {
    attendanceWeight: number
    behaviorWeight: number
    assignmentWeight: number
    maxAbsences: number
    gradingPolicy: string
    lateSubmissionPolicy: string
    behaviorTracking: boolean
    parentNotifications: boolean
  }
  status: 'active' | 'inactive' | 'archived'
  startDate: Date
  endDate?: Date
  semester?: string
  prerequisites?: string[]
  objectives?: string[]
  resources?: string[]
  createdAt: Date
  updatedAt: Date
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    academicYear: {
      type: String,
      required: true,
      default: () => new Date().getFullYear().toString(),
    },
    grade: {
      type: String,
      required: true,
    },
    classCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 30,
      min: 1,
    },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
          ],
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          default: 45,
        },
        room: String,
      },
    ],
    settings: {
      attendanceWeight: {
        type: Number,
        default: 30,
        min: 0,
        max: 100,
      },
      behaviorWeight: {
        type: Number,
        default: 20,
        min: 0,
        max: 100,
      },
      assignmentWeight: {
        type: Number,
        default: 50,
        min: 0,
        max: 100,
      },
      maxAbsences: {
        type: Number,
        default: 10,
      },
      gradingPolicy: {
        type: String,
        trim: true,
      },
      lateSubmissionPolicy: {
        type: String,
        trim: true,
      },
      behaviorTracking: {
        type: Boolean,
        default: true,
      },
      parentNotifications: {
        type: Boolean,
        default: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    semester: {
      type: String,
      trim: true,
    },
    prerequisites: [String],
    objectives: [String],
    resources: [String],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Class ||
  mongoose.model<IClass>('Class', ClassSchema)
