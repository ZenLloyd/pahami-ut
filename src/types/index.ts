export interface StudentProfile {
  name: string;
  nim: string;
  programStudi: string;
  semester: string;
}

export interface WeakTopic {
  id: string;
  moduleId: string;
  moduleTitle: string;
  topicName: string;
  pageRange: string;
  accuracy: number;
  status: "CRITICAL" | "WARNING" | "GOOD";
}

export interface ModuleMastery {
  id: string;
  code: string;
  title: string;
  sks: number;
  totalPages: number;
  masteryPercent: number;
  status: "MASTERED" | "IN_PROGRESS" | "NEEDS_REVIEW" | "WEAK";
  learningActivitiesCount: number;
}

export interface AICitation {
  id: string;
  moduleId: string;
  moduleCode: string;
  page: number;
  paragraphIndex?: number;
  snippet: string;
  queryTopic?: string;
  timestamp?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  citations?: AICitation[];
  suggestedFollowups?: string[];
  quizPrompt?: {
    topic: string;
    questionCount: number;
  };
}
