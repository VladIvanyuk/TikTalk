import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ButtonComponent } from '../../shared/components/common/button/button.component';

export type LoginFormGroup = {
  username: FormControl<string>;
  password: FormControl<string>;
};

// gorillazbananaz
// Wnv0hODS9x

@Component({
  selector: 'app-login',
  imports: [NgOptimizedImage, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  form: FormGroup<LoginFormGroup>;

  constructor() {
    this.form = this.fb.group<LoginFormGroup>({
      username: this.fb.nonNullable.control('gorillazbananaz', [Validators.required]),
      password: this.fb.nonNullable.control('Wnv0hODS9x', [Validators.required]),
    });
  }

  readonly isPasswordVisible = signal(false);

  togglePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit(): void {
    const value = this.form.getRawValue();

    if (this.form.valid) {
      this.authService.login(value).subscribe((data) => {
        console.log(data);
      });
    }
  }
}
