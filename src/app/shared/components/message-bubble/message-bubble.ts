import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.scss',
})
export class MessageBubbleComponent {
  message = input.required<ChatMessage>();
}