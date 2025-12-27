export enum UserRole {
  USER = 'USER',
  DEPARTMENT = 'DEPARTMENT',
  HR = 'HR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  password?: string;
  role: UserRole;
  department?: string;
  createdAt?: Date;
  updatedAt?: Date;
}