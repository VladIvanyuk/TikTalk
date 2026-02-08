import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaComponent,
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  readonly inputValue = signal('');
  readonly label = input();
  readonly cols = input();
  readonly rows = input();

  onChange: (value: string) => void = () => {};
  onTouch: () => void = () => {};

  writeValue(value: string): void {
    this.inputValue.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLTextAreaElement;
    const value = inputElement.value;

    this.onChange(value);
  }
}
