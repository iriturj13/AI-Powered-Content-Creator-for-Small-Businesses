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