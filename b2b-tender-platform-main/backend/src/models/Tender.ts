export interface Tender {
  id: number;
  title: string;
  description: string;
  budget?: number;
  deadline?: Date;
  company_id: number;
  status: 'draft' | 'active' | 'closed' | 'awarded';
  created_at?: Date;
  updated_at?: Date;
}
