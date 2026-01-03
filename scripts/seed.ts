import dotenv from 'dotenv';
dotenv.config();

import { generateMockHires, generateMockTasks } from '../lib/utils/mock-data';
import { HireService } from '../controllers/hire.service';
import { TaskService } from '../controllers/task.service';
import connectToDatabase from '../lib/mongodb';

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database.');

    console.log('Generating mock hires...');
    const mockHires = generateMockHires(50);

    console.log('Seeding hires...');
    for (const hire of mockHires) {
      try {
        await HireService.createHire(hire);
        console.log(`Created hire: ${hire.firstName} ${hire.lastName}`);
      } catch (error) {
        console.error(`Error creating hire ${hire.firstName} ${hire.lastName}:`, error);
      }
    }

    console.log('Generating and seeding tasks for each hire...');
    for (const hire of mockHires) {
      const mockTasks = generateMockTasks(hire.id);
      for (const task of mockTasks) {
        try {
          await TaskService.createTask(task);
          console.log(`Created task: ${task.title} for ${hire.firstName} ${hire.lastName}`);
        } catch (error) {
          console.error(`Error creating task ${task.title}:`, error);
        }
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedDatabase();