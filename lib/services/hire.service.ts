import { getDatabase } from '@/lib/mongodb'
import { Hire, HireFilters, HireListResponse } from '@/types/hire.types'
import { ObjectId } from 'mongodb'

export class HireService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<Hire>('hires')
  }

  static async getHires(filters: HireFilters = {}, page: number = 1, pageSize: number = 10): Promise<HireListResponse> {
    const collection = await this.getCollection()
    const query: any = {}

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

    const total = await collection.countDocuments(query)
    const skip = (page - 1) * pageSize

    const hires = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    return {
      hires,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  static async getHireById(id: string): Promise<Hire | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async createHire(hireData: Omit<Hire, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Hire> {
    const collection = await this.getCollection()
    const now = new Date()
    const hire: Hire = {
      ...hireData,
      id: new ObjectId().toString(),
      createdAt: now,
      updatedAt: now
    }

    const result = await collection.insertOne(hire)
    return {
      ...hire,
      _id: result.insertedId
    }
  }

  static async updateHire(id: string, updates: Partial<Hire>): Promise<Hire | null> {
    const collection = await this.getCollection()
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  static async deleteHire(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}