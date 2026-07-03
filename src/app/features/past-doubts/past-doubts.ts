import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink  } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConversationRepository } from '../../core/repositories/conversation.repository';
import { ChatStore } from '../../core/store/chat.store';
import { Conversation } from '../../core/models/conversation.model';

@Component({
  selector: 'app-past-doubts',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './past-doubts.html',
  styleUrl: './past-doubts.scss',
})
export class PastDoubtsComponent implements OnInit {
  private repo = inject(ConversationRepository);
  private store = inject(ChatStore);
  private router = inject(Router);

  conversations = signal<Conversation[]>([]);

  ngOnInit(): void {
    this.conversations.set(this.repo.getAll());
  }

  loadConversation(conversation: Conversation): void {
    this.store.loadConversation(conversation);
    this.router.navigate(['/chat']);
  }

  deleteConversation(event: Event, id: string): void {
    event.stopPropagation();
    this.repo.delete(id);
    this.conversations.set(this.repo.getAll());
  }

  startNewChat(): void {
    this.store.startNewConversation();
    this.router.navigate(['/chat']);
  }

  getMessagePreview(conversation: Conversation): string {
    const firstAi = conversation.messages.find((m) => m.sender === 'ai');
    if (!firstAi) return 'No response yet';
    return firstAi.text.slice(0, 80) + (firstAi.text.length > 80 ? '...' : '');
  }

  getMessageCount(conversation: Conversation): number {
    return conversation.messages.filter((m) => m.sender === 'user').length;
  }
}