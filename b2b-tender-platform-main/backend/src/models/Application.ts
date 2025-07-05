export interface Application {
  id: number;
  tender_id: number;
  company_id: number;
  proposal: string;
  quoted_price?: number;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
  created_at?: Date;
  updated_at?: Date;
}
