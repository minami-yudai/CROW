export interface RecipientInfo {
  fullName: string;
  honorific?: string;
  organization?: string;
  department?: string;
  formattedAddressing: string;
  rawTextSnippet: string;
  coRecipients?: string[];
}

export interface SenderInfo {
  name?: string;
  organization?: string;
}

export interface SubjectVariations {
  standard: string;
  concise: string;
  actionOriented: string;
}

export interface SubjectInfo {
  primary: string;
  isExtractedFromHeader: boolean;
  variations: SubjectVariations;
  reasoning: string;
}

export interface EmailMetadata {
  category: string;
  urgency: "高" | "中" | "低" | string;
  replyNeeded: boolean;
  deadline?: string;
  summaryPoints: string[];
}

export interface ExtractionResult {
  recipient: RecipientInfo;
  sender?: SenderInfo;
  subject: SubjectInfo;
  metadata: EmailMetadata;
}

export interface ExtractionHistoryItem {
  id: string;
  timestamp: number;
  emailText: string;
  result: ExtractionResult;
}
