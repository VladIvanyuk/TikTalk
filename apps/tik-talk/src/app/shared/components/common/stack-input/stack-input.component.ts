import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-stack-input',
  imports: [TagComponent],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: StackInputComponent,
      multi: true,
    },
  ],
})
export class StackInputComponent implements ControlValueAccessor, OnInit {
  readonly currentStack = signal<string[]>([]);
  readonly stack = input<string[]>([]);

  onChange: (value: string[]) => void = () => {};
  onTouch: () => void = () => {};

  ngOnInit(): void {
    this.currentStack.set([...this.stack()]);
  }

  writeValue(value: string): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onAddSkill(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    if (value.trim() === '') {
      return;
    }

    this.currentStack.update((prev) => [...prev, value]);
    this.onChange(this.currentStack());
    inputElement.value = '';
  }

  onRemoveSkill(index: number): void {
    this.currentStack.update((prev) => prev.filter((_, i) => i !== index));
    this.onChange(this.currentStack());
  }
}
