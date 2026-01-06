import {
  Hire,
  DashboardStats,
  Activity,
  DepartmentPerformance,
  EmploymentType,
  WorkLocation,
  HireStatus,
  Task,
  TaskCategory,
  Priority
} from '@/types/hire.types';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';

// Mock data generators
const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa',
  'Robert', 'Maria', 'William', 'Jennifer', 'Richard', 'Patricia', 'Charles', 'Linda'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
];

const departments = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'
];

const jobTitles = [
  'Software Engineer', 'Product Manager', 'UX Designer', 'Marketing Manager',
  'Sales Representative', 'HR Specialist', 'Financial Analyst', 'Operations Manager'
];

const cities = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Singapore'];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Generate mock hires
export function generateMockHires(count: number = 50): Hire[] {
  const hires: Hire[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const department = getRandomElement(departments);
    const startDate = generateRandomDate(subDays(new Date(), 90), addDays(new Date(), 30));
    const statusWeights = [0.1, 0.3, 0.4, 0.2]; // PENDING, ACTIVE, COMPLETED, CANCELLED
    const statusRandom = Math.random();
    let status: HireStatus = 'PENDING';

    if (statusRandom < statusWeights[0]) status = 'PENDING';
    else if (statusRandom < statusWeights[0] + statusWeights[1]) status = 'ACTIVE';
    else if (statusRandom < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = 'COMPLETED';
    else status = 'CANCELLED';

    const hire: Hire = {
      id: generateId(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      personalEmail: Math.random() > 0.7 ? `${firstName.toLowerCase()}${lastName.toLowerCase()}@gmail.com` : undefined,
      phone: Math.random() > 0.3 ? `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
      department,
      jobTitle: getRandomElement(jobTitles),
      employmentType: getRandomElement(['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN'] as EmploymentType[]),
      startDate,
      workLocation: getRandomElement(['OFFICE', 'REMOTE', 'HYBRID'] as WorkLocation[]),
      status,
      notes: Math.random() > 0.8 ? `Additional notes for ${firstName} ${lastName}` : undefined,
      managerName: Math.random() > 0.2 ? `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}` : undefined,
      managerEmail: Math.random() > 0.2 ? `${getRandomElement(firstNames).toLowerCase()}.${getRandomElement(lastNames).toLowerCase()}@company.com` : undefined,
      hasBackgroundCheck: Math.random() > 0.6,
      backgroundCheckDate: Math.random() > 0.6 ? generateRandomDate(subDays(new Date(), 30), new Date()) : undefined,
      hasSignedNDA: Math.random() > 0.4,
      createdAt: generateRandomDate(subDays(new Date(), 120), new Date()),
      updatedAt: generateRandomDate(subDays(new Date(), 30), new Date()),
      completedAt: status === 'COMPLETED' ? generateRandomDate(subDays(new Date(), 14), new Date()) : undefined,
    };

    hires.push(hire);
  }

  // Sort by created date (most recent first)
  return hires.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// Generate mock tasks for a hire
export function generateMockTasks(hireId: string): Task[] {
  const taskCategories: TaskCategory[] = ['IT', 'FACILITIES', 'HR', 'SECURITY', 'MANAGER', 'COMPLIANCE', 'TRAINING'];
  const taskTitles = {
    IT: ['Setup laptop', 'Configure email', 'Install software', 'VPN access'],
    FACILITIES: ['Desk assignment', 'Access card', 'Parking permit', 'Office tour'],
    HR: ['Complete paperwork', 'Benefits enrollment', 'Tax forms', 'Direct deposit setup'],
    SECURITY: ['Security training', 'Badge photo', 'System access', 'Password setup'],
    MANAGER: ['Meet manager', 'Team introduction', '1:1 meeting', 'Goal setting'],
    COMPLIANCE: ['NDA signing', 'Background check', 'Drug test', 'Reference check'],
    TRAINING: ['Safety training', 'Company policies', 'Product training', 'Team tools']
  };

  const tasks: Task[] = [];
  const numTasks = Math.floor(Math.random() * 8) + 5; // 5-12 tasks

  for (let i = 0; i < numTasks; i++) {
    const category = getRandomElement(taskCategories);
    const titles = taskTitles[category];
    const title = getRandomElement(titles);

    const priorityWeights = [0.1, 0.6, 0.25, 0.05]; // LOW, MEDIUM, HIGH, CRITICAL
    const priorityRandom = Math.random();
    let priority: Priority = 'MEDIUM';

    if (priorityRandom < priorityWeights[0]) priority = 'LOW';
    else if (priorityRandom < priorityWeights[0] + priorityWeights[1]) priority = 'MEDIUM';
    else if (priorityRandom < priorityWeights[0] + priorityWeights[1] + priorityWeights[2]) priority = 'HIGH';
    else priority = 'CRITICAL';

    const dueDate = generateRandomDate(new Date(), addDays(new Date(), 30));
    const completed = Math.random() > 0.4; // 60% completion rate

    const task: Task = {
      id: generateId(),
      title,
      description: Math.random() > 0.7 ? `Detailed instructions for ${title}` : undefined,
      assignedTo: Math.random() > 0.5 ? getRandomElement(['IT Team', 'HR Team', 'Facilities', 'Manager']) : getRandomElement(firstNames) + ' ' + getRandomElement(lastNames),
      dueDate,
      priority,
      completed,
      completedAt: completed ? generateRandomDate(subDays(dueDate, 7), dueDate) : undefined,
      notes: Math.random() > 0.8 ? `Additional notes for ${title}` : undefined,
      category,
      hireId,
      createdAt: generateRandomDate(subDays(new Date(), 30), new Date()),
      updatedAt: completed ? generateRandomDate(subDays(new Date(), 7), new Date()) : generateRandomDate(subDays(new Date(), 14), new Date()),
    };

    tasks.push(task);
  }

  return tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

// Generate dashboard stats
export function generateMockDashboardStats(): DashboardStats {
  const totalHires = 156;
  const hiresChange = 12; // +12%
  const activeOnboarding = 24;
  const onboardingProgress = 65; // 65%
  const tasksDueToday = 8;
  const avgTimeToComplete = 5.2; // days

  return {
    totalHires,
    hiresChange,
    activeOnboarding,
    onboardingProgress,
    tasksDueToday,
    avgTimeToComplete,
  };
}

// Generate recent activities
export function generateMockActivities(count: number = 10): Activity[] {
  const activities: Activity[] = [];
  const activityTypes: Activity['type'][] = ['hire_created', 'task_completed', 'status_changed', 'hire_completed'];

  for (let i = 0; i < count; i++) {
    const type = getRandomElement(activityTypes);
    const hire = generateMockHires(1)[0];
    const timestamp = generateRandomDate(subHours(new Date(), 24), new Date());

    let message = '';
    switch (type) {
      case 'hire_created':
        message = `New hire ${hire.firstName} ${hire.lastName} was added to ${hire.department}`;
        break;
      case 'task_completed':
        message = `${hire.firstName} ${hire.lastName} completed "${getRandomElement(['Setup laptop', 'Complete paperwork', 'Meet manager', 'Security training'])}"`;
        break;
      case 'status_changed':
        message = `${hire.firstName} ${hire.lastName} status changed to ${hire.status}`;
        break;
      case 'hire_completed':
        message = `${hire.firstName} ${hire.lastName} onboarding completed successfully`;
        break;
    }

    activities.push({
      id: generateId(),
      type,
      message,
      timestamp,
      user: Math.random() > 0.5 ? `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}` : undefined,
      hireId: hire.id,
    });
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Generate department performance data
export function generateMockDepartmentPerformance(): DepartmentPerformance[] {
  return departments.map(dept => ({
    department: dept,
    hires: Math.floor(Math.random() * 20) + 5,
    completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
    avgTime: Math.floor(Math.random() * 3) + 4, // 4-7 days
  }));
}

// Mock data store - using let for mutability in mock functions
let mockHiresData: Hire[] = generateMockHires(50);
let mockTasksData: Task[] = [];

// Initialize tasks for all hires
mockHiresData.forEach(hire => {
  mockTasksData.push(...generateMockTasks(hire.id));
});

// Export mock data functions
export const mockData = {
  getHires: (filters?: { status?: string; department?: string; search?: string }, page: number = 1, pageSize: number = 10) => {
    let filtered = [...mockHiresData];

    if (filters?.status) {
      filtered = filtered.filter((h: Hire) => h.status === filters.status);
    }

    if (filters?.department) {
      filtered = filtered.filter((h: Hire) => h.department === filters.department);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((h: Hire) =>
        h.firstName.toLowerCase().includes(search) ||
        h.lastName.toLowerCase().includes(search) ||
        h.email.toLowerCase().includes(search) ||
        h.department.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filtered.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  getHireById: (id: string) => {
    return mockHiresData.find((h: Hire) => h.id === id);
  },

  getTasksByHireId: (hireId: string) => {
    return mockTasksData.filter((t: Task) => t.hireId === hireId);
  },

  getDashboardStats: () => generateMockDashboardStats(),

  getRecentActivities: () => generateMockActivities(10),

  getDepartmentPerformance: () => generateMockDepartmentPerformance(),

  getRecentHires: (count: number = 5) => {
    return [...mockHiresData]
      .sort((a: Hire, b: Hire) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, count);
  },

  createHire: (hireData: Omit<Hire, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHire: Hire = {
      ...hireData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockHiresData.unshift(newHire);
    return newHire;
  },

  updateHire: (id: string, updates: Partial<Hire>) => {
    const index = mockHiresData.findIndex((h: Hire) => h.id === id);
    if (index >= 0) {
      mockHiresData[index] = { ...mockHiresData[index], ...updates, updatedAt: new Date() };
      return mockHiresData[index];
    }
    return null;
  },

  deleteHire: (id: string) => {
    const index = mockHiresData.findIndex((h: Hire) => h.id === id);
    if (index >= 0) {
      mockHiresData.splice(index, 1);
      // Also remove associated tasks
      mockTasksData = mockTasksData.filter((t: Task) => t.hireId !== id);
      return true;
    }
    return false;
  },
};