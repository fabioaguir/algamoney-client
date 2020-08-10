import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  template: `
    <div class="p-invalid" *ngIf="isError()">
      {{ text }}
    </div>
  `,
  styleUrls: []
})
export class MessageComponent {

  @Input() control: FormControl;
  @Input() error: string;
  @Input() text: string;

  isError() {
    return this.control.hasError(this.error) && this.control.dirty;
  }
}
