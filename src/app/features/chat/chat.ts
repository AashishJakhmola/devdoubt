import { Component, inject, ViewChild, ElementRef, effect, OnInit } from '@angular/core';
import { ChatStore } from '../../core/store/chat.store';
import { MessageBubbleComponent } from '../../shared/components/message-bubble/message-bubble';
import { ChatInputComponent } from '../../shared/components/chat-input/chat-input';
import { ChatMessage } from '../../core/models/message.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageBubbleComponent, ChatInputComponent, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements OnInit {
  store = inject(ChatStore);
  isSidebarOpen = false;

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  constructor() {
    effect(() => {
      this.store.messages();
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  ngOnInit(): void {
    // Start a new conversation when chat loads
    // Only if there isn't already an active conversation
    if (!this.store.currentConversationId()) {
      this.store.startNewConversation();
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {}
  }

  onMessageSent(text: string): void {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    this.store.addMessage(userMessage);
    this.store.sendToAI(userMessage);

    // Save conversation after every message
    setTimeout(() => this.store.saveConversation(), 100);
  }

  startNewChat(): void {
    this.store.startNewConversation();
    this.closeSidebar();
  }
}
