export interface MarketingFormData {
  businessName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  goal: string;
  hashtags: string;
  city: string;
}

export interface GeneratedCaption {
  title: string;
  caption: string;
  hashtags: string[];
  imageBase64?: string;
}

export interface GenerationResponse {
  options: GeneratedCaption[];
}

// Audit Types
export interface AuditIssue {
  category: 'Fairness/Bias' | 'Harmful Content' | 'Neutrality' | 'Misleading Claims' | 'Other';
  concern: string;
  explanation: string;
}

export interface AuditResponse {
  issues: AuditIssue[];
  revisedContent: string;
}

export interface AuditResultItem extends AuditResponse {
  originalText: string;
}

// History Types
export interface HistoryItem {
  id: string;
  type: 'generate' | 'audit';
  timestamp: number;
  data: {
    formData?: MarketingFormData; // For generate
    genResults?: GeneratedCaption[]; // For generate
    auditInput?: string; // For audit
    auditResult?: AuditResponse; // For audit
  };
}