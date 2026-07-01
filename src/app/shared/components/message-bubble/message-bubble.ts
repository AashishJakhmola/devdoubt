import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../../core/models/message.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.scss',
})
export class MessageBubbleComponent {
  message = input.required<ChatMessage>();
}
