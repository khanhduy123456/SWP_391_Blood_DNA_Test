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

export type UserRole = "customer" | "staff" | "manager" | "admin";