export interface ExtractionResult {
  replyText: string;
}

export interface ExtractionHistoryItem {
  id: string;
  timestamp: number;
  emailText: string;
  result: ExtractionResult;
}
