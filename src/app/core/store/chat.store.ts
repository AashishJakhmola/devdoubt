import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { ChatMessage } from '../models/message.model';

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
  withMethods((store) => ({
    addMessage(message: ChatMessage): void {
      patchState(store, (state) => ({
        messages: [...state.messages, message],
      }));
    },
    setAiTyping(isTyping: boolean): void {
      patchState(store, { isAiTyping: isTyping });
    },
  })),
);
