export interface Login {
  Email: string;
  Password: string;
}

export interface Register {
  fullName: string;
  email: string;
  phone: string; 
  password: string;
  address: string;
  role?: string; // Optional
}
// Reverse mapping để convert từ number về string (optional)
export const UserRoleNames = {
  1: 'Admin',
  3: 'Staff',
  2: 'Customer',
  4: 'Manager'
} as const;

export type UserRole = "customer" | "staff" | "manager" | "admin";