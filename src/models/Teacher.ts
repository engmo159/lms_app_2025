import mongoose, { Document, Schema } from 'mongoose'

export interface ITeacher extends Document {
  name: string
  email: string
  password: string
  phone?: string
  school?: string
  subjects: string[]
  avatar?: string
  department?: string
  employeeId?: string
  hireDate?: Date
  qualifications?: string[]
  bio?: string
  preferences: {
    language: 'ar' | 'en'
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    dashboardLayout: 'grid' | 'list'
    defaultView: 'classes' | 'students' | 'assignments' | 'attendance'
    timezone: string
    dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'
    timeFormat: '12h' | '24h'
  }
  settings: {
    attendanceThreshold: number // minimum attendance percentage
    gradingScale: 'percentage' | 'letter' | 'points'
    behaviorTracking: boolean
    parentCommunication: boolean
    autoBackup: boolean
  }
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const TeacherSchema = new Schema<ITeacher>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
    },
    school: {
      type: String,
      trim: true,
    },
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
    avatar: {
      type: String,
    },
    department: {
      type: String,
      trim: true,
    },
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    hireDate: {
      type: Date,
    },
    qualifications: [String],
    bio: {
      type: String,
      trim: true,
    },
    preferences: {
      language: {
        type: String,
        enum: ['ar', 'en'],
        default: 'ar',
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      dashboardLayout: {
        type: String,
        enum: ['grid', 'list'],
        default: 'grid',
      },
      defaultView: {
        type: String,
        enum: ['classes', 'students', 'assignments', 'attendance'],
        default: 'classes',
      },
      timezone: {
        type: String,
        default: 'Asia/Riyadh',
      },
      dateFormat: {
        type: String,
        enum: ['dd/mm/yyyy', 'mm/dd/yyyy', 'yyyy-mm-dd'],
        default: 'dd/mm/yyyy',
      },
      timeFormat: {
        type: String,
        enum: ['12h', '24h'],
        default: '24h',
      },
    },
    settings: {
      attendanceThreshold: {
        type: Number,
        default: 75,
        min: 0,
        max: 100,
      },
      gradingScale: {
        type: String,
        enum: ['percentage', 'letter', 'points'],
        default: 'percentage',
      },
      behaviorTracking: {
        type: Boolean,
        default: true,
      },
      parentCommunication: {
        type: Boolean,
        default: true,
      },
      autoBackup: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Teacher ||
  mongoose.model<ITeacher>('Teacher', TeacherSchema)
