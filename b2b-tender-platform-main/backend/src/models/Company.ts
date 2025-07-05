export interface Company {
  id: number;
  name: string;
  industry?: string;
  description?: string;
  logo_url?: string;
  services_offered?: string[];
  created_at?: Date;
  updated_at?: Date;
}
