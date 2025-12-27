import { getDatabase } from '@/lib/mongodb'
import { Task } from '@/types/hire.types'
import { ObjectId } from 'mongodb'

export class TaskService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<Task>('tasks')
  }

  static async getTasksByHireId(hireId: string): Promise<Task[]> {
    const collection = await this.getCollection()
    return await collection.find({ hireId }).sort({ createdAt: -1 }).toArray()
  }

  static async getTaskById(id: string): Promise<Task | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  static async createTask(taskData: Omit<Task, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const collection = await this.getCollection()
    const now = new Date()
    const task: Task = {
      ...taskData,
      id: new ObjectId().toString(),
      createdAt: now,
      updatedAt: now
    }

    const result = await collection.insertOne(task)
    return {
      ...task,
      _id: result.insertedId
    }
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
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

  static async deleteTask(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async getTasksDueToday(): Promise<Task[]> {
    const collection = await this.getCollection()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return await collection.find({
      dueDate: {
        $gte: today,
        $lt: tomorrow
      },
      completed: false
    }).toArray()
  }
}