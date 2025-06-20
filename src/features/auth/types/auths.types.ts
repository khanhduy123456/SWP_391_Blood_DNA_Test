export interface Login {
  Email: string;
  Password: string;
}

export interface Register {
  fullName: string;
  email: string;
  Phone: string;
  password: string;
  address: string;
  role: string;
}
// Reverse mapping để convert từ number về string (optional)
export const UserRoleNames = {
  1: 'Admin',
  0: 'Staff',
  2: 'Client',
  3: 'Manager'
} as const;

export type UserRole = "customer" | "staff" | "manager" | "admin";