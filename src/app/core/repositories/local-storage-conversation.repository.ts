import { Injectable } from '@angular/core';
import { ConversationRepository } from './conversation.repository';
import { Conversation } from '../models/conversation.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageConversationRepository extends ConversationRepository {
  private readonly STORAGE_KEY = 'devdoubt_conversations';

  getAll(): Conversation[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Conversation[];
      // Convert date strings back to Date objects
      return parsed.map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        messages: c.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    } catch {
      return [];
    }
  }

  getById(id: string): Conversation | null {
    return this.getAll().find((c) => c.id === id) ?? null;
  }

  save(conversation: Conversation): void {
    try {
      const all = this.getAll();
      const existingIndex = all.findIndex((c) => c.id === conversation.id);
      if (existingIndex >= 0) {
        all[existingIndex] = conversation;
      } else {
        all.unshift(conversation); // Add to beginning — newest first
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    } catch {
      console.error('Failed to save conversation');
    }
  }

  delete(id: string): void {
    try {
      const filtered = this.getAll().filter((c) => c.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      console.error('Failed to delete conversation');
    }
  }
}