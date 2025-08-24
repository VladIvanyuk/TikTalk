import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type LoginFormGroup = {
  username: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  fb = inject(FormBuilder);
  form: FormGroup<LoginFormGroup>;

  constructor() {
    this.form = this.fb.group<LoginFormGroup>({
      username: this.fb.nonNullable.control('', [Validators.required]),
      password: this.fb.nonNullable.control('', [Validators.required]),
    });
  }

  readonly isPasswordVisible = signal(false);

  togglePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit(): void {
    console.log(this.form.getRawValue());
  }
}
