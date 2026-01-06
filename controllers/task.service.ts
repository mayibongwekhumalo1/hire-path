import connectToDatabase from '@/lib/mongodb'
import TaskModel, { ITask } from '@/models/task.model'
import { Task } from '@/types/hire.types'

export class TaskService {
  private static async connect() {
    await connectToDatabase()
  }

  static async getTasksByHireId(hireId: string): Promise<Task[]> {
    await this.connect()
    const tasks = await TaskModel.find({ hireId }).sort({ createdAt: -1 }).lean()
    return tasks as Task[]
  }

  static async getTaskById(id: string): Promise<Task | null> {
    await this.connect()
    const task = await TaskModel.findById(id).lean()
    return task as Task | null
  }

  static async createTask(taskData: Omit<Task, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await this.connect()
    const task = new TaskModel(taskData)
    const savedTask = await task.save()
    return savedTask.toObject() as Task
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    await this.connect()
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean()
    return task as Task | null
  }

  static async deleteTask(id: string): Promise<boolean> {
    await this.connect()
    const result = await TaskModel.findByIdAndDelete(id)
    return !!result
  }

  static async getTasksDueToday(): Promise<Task[]> {
    await this.connect()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tasks = await TaskModel.find({
      dueDate: {
        $gte: today,
        $lt: tomorrow
      },
      completed: false
    }).lean()
    return tasks as Task[]
  }

  static async getAllTasks(): Promise<Task[]> {
    await this.connect()
    const tasks = await TaskModel.find({}).sort({ createdAt: -1 }).lean()
    return tasks as Task[]
  }
}