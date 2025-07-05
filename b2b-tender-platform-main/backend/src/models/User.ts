export interface User {
  id: number;
  email: string;
  password_hash: string;
  company_id: number;
  created_at?: Date;
  updated_at?: Date;
}
