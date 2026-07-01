import { Component, output } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.scss',
})
export class ChatInputComponent {
  messageControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1)],
  });

  sent = output<string>();

  onSend(event: Event): void {
    event.preventDefault();
    const value = this.messageControl.value.trim();
    if (!value) return;
    this.sent.emit(value);
    this.messageControl.reset();
  }
}
