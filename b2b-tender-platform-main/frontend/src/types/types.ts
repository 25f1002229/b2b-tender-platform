export interface User {
  id: string;
  email: string;
  company: Company;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  description?: string;
  logo_url?: string;
  services_offered?: string[];
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  budget?: number;
  deadline?: string;
  status: 'draft' | 'active' | 'closed' | 'awarded';
  company_id: string;
}

export interface Application {
  id: string;
  tender_id: string;
  company_id: string;
  proposal: string;
  quoted_price?: number;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
}
