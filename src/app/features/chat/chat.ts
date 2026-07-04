import { Component, inject, ViewChild, ElementRef, effect, OnInit, signal } from '@angular/core';
import { ChatStore } from '../../core/store/chat.store';
import { MessageBubbleComponent } from '../../shared/components/message-bubble/message-bubble';
import { ChatInputComponent } from '../../shared/components/chat-input/chat-input';
import { ChatMessage } from '../../core/models/message.model';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [MessageBubbleComponent, ChatInputComponent, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements OnInit {
  store = inject(ChatStore);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  isSidebarOpen = false;

  isProfileMenuOpen = signal(false);
  userEmail = signal('');

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

    const user = this.supabase.currentUserValue;
    if (user?.email) {
      this.userEmail.set(user.email);
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.set(!this.isProfileMenuOpen());
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
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
  }

  startNewChat(): void {
    this.store.startNewConversation();
    this.closeSidebar();
  }

  async signOut(): Promise<void> {
    this.closeProfileMenu();
    await this.supabase.signOut();
    this.router.navigate(['/auth']);
  }
}
