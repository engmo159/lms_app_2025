import mongoose, { Document, Schema } from 'mongoose'

export interface IStudent extends Document {
  name: string
  seatNumber: number
  class: mongoose.Types.ObjectId
  teacher: mongoose.Types.ObjectId
  avatar?: string
  phone?: string
  email?: string
  studentId?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female'
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  parentInfo: {
    fatherName?: string
    fatherPhone?: string
    fatherEmail?: string
    motherName?: string
    motherPhone?: string
    motherEmail?: string
    guardianName?: string
    guardianPhone?: string
    guardianEmail?: string
    relationship?: string
  }
  medicalInfo?: {
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
    emergencyContact?: string
  }
  academicInfo: {
    grade: string
    previousSchool?: string
    transferDate?: Date
    specialNeeds?: string[]
    learningStyle?: string
  }
  notes?: string
  tags?: string[] // for categorization
  isActive: boolean
  enrollmentDate: Date
  graduationDate?: Date
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    seatNumber: {
      type: Number,
      required: [true, 'Seat number is required'],
      min: 1,
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
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    parentInfo: {
      fatherName: String,
      fatherPhone: String,
      fatherEmail: String,
      motherName: String,
      motherPhone: String,
      motherEmail: String,
      guardianName: String,
      guardianPhone: String,
      guardianEmail: String,
      relationship: String,
    },
    medicalInfo: {
      allergies: [String],
      medications: [String],
      conditions: [String],
      emergencyContact: String,
    },
    academicInfo: {
      grade: {
        type: String,
        required: true,
      },
      previousSchool: String,
      transferDate: Date,
      specialNeeds: [String],
      learningStyle: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    graduationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index to ensure unique seat number per class
StudentSchema.index({ class: 1, seatNumber: 1 }, { unique: true })

export default mongoose.models.Student ||
  mongoose.model<IStudent>('Student', StudentSchema)
