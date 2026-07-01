import { Component, inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ChatStore } from '../../core/store/chat.store';
import { MessageBubbleComponent } from '../../shared/components/message-bubble/message-bubble';
import { ChatInputComponent } from '../../shared/components/chat-input/chat-input';
import { ChatMessage } from '../../core/models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageBubbleComponent, ChatInputComponent],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent {
  store = inject(ChatStore);

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

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
    setTimeout(() => this.scrollToBottom(), 50);
  }
}
