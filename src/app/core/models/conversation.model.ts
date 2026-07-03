import { ChatMessage } from './message.model';

export interface Conversation {
  id: string;
  title: string; // Auto-generated from first message
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
