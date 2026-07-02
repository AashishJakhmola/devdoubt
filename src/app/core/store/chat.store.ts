import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ChatMessage } from '../models/message.model';
import { ChatService } from '../services/chat.service';

interface ChatState {
  messages: ChatMessage[];
  isAiTyping: boolean;
}

const initialState: ChatState = {
  messages: [],
  isAiTyping: false,
};

export const ChatStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, chatService = inject(ChatService)) => ({
    addMessage(message: ChatMessage): void {
      patchState(store, (state) => ({
        messages: [...state.messages, message],
      }));
    },

    setAiTyping(isTyping: boolean): void {
      patchState(store, { isAiTyping: isTyping });
    },

    sendToAI: rxMethod<ChatMessage>(
      pipe(
        tap(() => patchState(store, { isAiTyping: true })),
        switchMap((userMessage) => {
          const history = store.messages().slice(0, -1);
          return chatService.sendMessage(userMessage.text, history).pipe(
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
            }),
          );
        }),
      ),
    ),
  })),
);
