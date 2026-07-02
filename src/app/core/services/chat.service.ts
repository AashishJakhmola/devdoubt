import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { ChatMessage } from '../models/message.model';

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/chat';

  sendMessage(
    message: string,
    history: ChatMessage[]
  ): Observable<ChatResponse> {
    const body: ChatRequest = { message, history };

    return this.http.post<ChatResponse>(this.apiUrl, body).pipe(
      catchError((error) => {
        console.error('API error:', error);
        return of({
          reply:
            'I am having trouble connecting right now. Please try again in a moment.',
        });
      })
    );
  }
}