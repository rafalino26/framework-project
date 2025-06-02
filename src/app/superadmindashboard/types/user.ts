export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "regular" | "admin" | "superadmin";
  lastSignInAt: string | null;
  nim_nidn: string;
}