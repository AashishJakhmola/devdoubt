import { Component, output, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('textareaRef')
  textareaRef!: ElementRef<HTMLTextAreaElement>;

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend(event);
      return;
    }
    // Auto-resize textarea after content changes
    setTimeout(() => this.autoResize(), 0);
  }

  private autoResize(): void {
    const el = this.textareaRef?.nativeElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  }

  onSend(event: Event): void {
    event.preventDefault();
    const value = this.messageControl.value.trim();
    if (!value) return;
    this.sent.emit(value);
    this.messageControl.reset();
    // Reset textarea height after send
    setTimeout(() => {
      if (this.textareaRef?.nativeElement) {
        this.textareaRef.nativeElement.style.height = 'auto';
      }
    }, 0);
  }
}
