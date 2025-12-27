// Hire-related TypeScript interfaces and types
import { ObjectId } from 'mongodb'

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
export type WorkLocation = 'OFFICE' | 'REMOTE' | 'HYBRID';
export type HireStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TaskCategory = 'IT' | 'FACILITIES' | 'HR' | 'SECURITY' | 'MANAGER' | 'COMPLIANCE' | 'TRAINING';

export interface Hire {
  _id?: ObjectId;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  department: string;
  jobTitle: string;
  employmentType: EmploymentType;
  startDate: Date;
  workLocation: WorkLocation;
  status: HireStatus;
  notes?: string;
  managerName?: string;
  managerEmail?: string;
  hasBackgroundCheck?: boolean;
  backgroundCheckDate?: Date;
  hasSignedNDA?: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tasks?: Task[];
}

export interface HireFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  personalEmail?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  employmentType?: EmploymentType;
  startDate?: Date;
  workLocation?: WorkLocation;
  managerName?: string;
  managerEmail?: string;
  notes?: string;
}

export interface Task {
  _id?: ObjectId;
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: Priority;
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  category: TaskCategory;
  hireId: string;
  hire?: Hire;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalHires: number;
  hiresChange: number; // percentage change
  activeOnboarding: number;
  onboardingProgress: number; // percentage
  tasksDueToday: number;
  avgTimeToComplete: number; // in days
}

export interface Activity {
  id: string;
  type: 'hire_created' | 'task_completed' | 'status_changed' | 'hire_completed';
  message: string;
  timestamp: Date;
  user?: string;
  hireId?: string;
}

export interface DepartmentPerformance {
  department: string;
  hires: number;
  completionRate: number; // percentage
  avgTime: number; // in days
}

export interface HireFilters {
  status?: HireStatus;
  department?: string;
  employmentType?: EmploymentType;
  startDateFrom?: Date;
  startDateTo?: Date;
  search?: string;
}

export interface HireListResponse {
  hires: Hire[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FormErrors {
  [key: string]: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

// Component Props Interfaces
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  className?: string;
}

export interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface DatePickerProps {
  label: string;
  name: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: () => void;
}

export interface Step {
  id: number;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export interface FilterButtonsProps {
  filters: FilterOption[];
  activeFilter: string;
  onChange: (filterId: string) => void;
  className?: string;
}

export interface SkeletonProps {
  variant?: 'card' | 'table' | 'text' | 'avatar';
  lines?: number;
  className?: string;
}

// Utility types
export type SortDirection = 'asc' | 'desc';
export type SortField = keyof Hire | keyof Task;

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}