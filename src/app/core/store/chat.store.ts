import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ChatMessage } from '../models/message.model';
import { Conversation } from '../models/conversation.model';
import { ChatService } from '../services/chat.service';
import { ConversationRepository } from '../repositories/conversation.repository';

interface ChatState {
  messages: ChatMessage[];
  isAiTyping: boolean;
  currentConversationId: string | null;
  selectedStack: string;
}

const initialState: ChatState = {
  messages: [],
  isAiTyping: false,
  currentConversationId: null,
  selectedStack: 'angular',
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      chatService = inject(ChatService),
      conversationRepo = inject(ConversationRepository),
    ) => ({
      // Start a brand new conversation
      startNewConversation(): void {
        patchState(store, {
          messages: [],
          isAiTyping: false,
          currentConversationId: crypto.randomUUID(),
        });
      },

      // Set the active tech stack (called when the user picks a pill)
      setStack(stack: string): void {
        patchState(store, { selectedStack: stack });
      },

      // Load an existing conversation from repository
      loadConversation(conversation: Conversation): void {
        patchState(store, {
          messages: conversation.messages,
          isAiTyping: false,
          currentConversationId: conversation.id,
        });
      },

      addMessage(message: ChatMessage): void {
        patchState(store, (state) => ({
          messages: [...state.messages, message],
        }));
      },

      setAiTyping(isTyping: boolean): void {
        patchState(store, { isAiTyping: isTyping });
      },

      // Save current conversation to repository
      saveConversation(): void {
        const messages = store.messages();
        const id = store.currentConversationId();

        if (!messages.length || !id) return;

        // Auto-generate title from first user message
        const firstUserMessage = messages.find((m) => m.sender === 'user');
        const title = firstUserMessage
          ? firstUserMessage.text.slice(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '')
          : 'New conversation';

        const conversation: Conversation = {
          id,
          title,
          messages,
          createdAt: new Date(messages[0].timestamp),
          updatedAt: new Date(),
        };

        conversationRepo.save(conversation);
      },

      sendToAI: rxMethod<ChatMessage>(
        pipe(
          tap(() => patchState(store, { isAiTyping: true })),
          switchMap((userMessage) => {
            const history = store.messages().slice(0, -1);
            const stack = store.selectedStack();
            return chatService.sendMessage(userMessage.text, history, stack).pipe(
              tap((response) => {
                const aiMessage: ChatMessage = {
                  id: crypto.randomUUID(),
                  sender: 'ai',
                  text: response.reply,
                  timestamp: new Date(),
                };
                patchState(store, (state) => ({
                  messages: [...state.messages, aiMessage],
                  isAiTyping: false,
                }));

                // Save AFTER AI message is added to state
                const messages = store.messages();
                const id = store.currentConversationId();
                if (!messages.length || !id) return;

                const firstUserMessage = messages.find((m) => m.sender === 'user');
                const title = firstUserMessage
                  ? firstUserMessage.text.slice(0, 50) +
                    (firstUserMessage.text.length > 50 ? '...' : '')
                  : 'New conversation';

                const conversation: Conversation = {
                  id,
                  title,
                  messages,
                  createdAt: new Date(messages[0].timestamp),
                  updatedAt: new Date(),
                };

                conversationRepo.save(conversation);
              }),
            );
          }),
        ),
      ),
    }),
  ),
);
