import connectToDatabase from '@/lib/mongodb'
import HireModel, { IHire } from '@/models/hire.model'
import { Hire, HireFilters, HireListResponse } from '@/types/hire.types'

export class HireService {
  private static async connect() {
    await connectToDatabase()
  }

  static async getHires(filters: HireFilters = {}, page: number = 1, pageSize: number = 10): Promise<HireListResponse> {
    await this.connect()
    const query: Record<string, any> = {}

    if (filters.status) {
      query.status = filters.status
    }

    if (filters.department) {
      query.department = filters.department
    }

    if (filters.employmentType) {
      query.employmentType = filters.employmentType
    }

    if (filters.startDateFrom || filters.startDateTo) {
      query.startDate = {}
      if (filters.startDateFrom) {
        query.startDate.$gte = filters.startDateFrom
      }
      if (filters.startDateTo) {
        query.startDate.$lte = filters.startDateTo
      }
    }

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { department: { $regex: filters.search, $options: 'i' } }
      ]
    }

    const total = await HireModel.countDocuments(query)
    const skip = (page - 1) * pageSize

    const hires = await HireModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean()

    return {
      hires: hires as Hire[],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  static async getHireById(id: string): Promise<Hire | null> {
    await this.connect()
    const hire = await HireModel.findById(id).lean()
    return hire as Hire | null
  }

  static async createHire(hireData: Omit<Hire, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Hire> {
    await this.connect()
    const hire = new HireModel(hireData)
    const savedHire = await hire.save()
    return savedHire.toObject() as Hire
  }

  static async updateHire(id: string, updates: Partial<Hire>): Promise<Hire | null> {
    await this.connect()
    const hire = await HireModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean()
    return hire as Hire | null
  }

  static async deleteHire(id: string): Promise<boolean> {
    await this.connect()
    const result = await HireModel.findByIdAndDelete(id)
    return !!result
  }

  static async getAllHires(): Promise<Hire[]> {
    await this.connect()
    const hires = await HireModel.find({}).sort({ createdAt: -1 }).lean()
    return hires as Hire[]
  }
}