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
