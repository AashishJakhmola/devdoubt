import { Conversation } from '../models/conversation.model';

export abstract class ConversationRepository {
  abstract getAll(): Conversation[];
  abstract getById(id: string): Conversation | null;
  abstract save(conversation: Conversation): void;
  abstract delete(id: string): void;
}