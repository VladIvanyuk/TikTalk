import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@tt/auth';
import { ButtonComponent } from '@tt/shared';
import { HttpResponseBase } from '@angular/common/http';
import { UNAUTHORIZED_RESPONS_STATUS } from '@tt/shared';

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
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  readonly form: FormGroup<LoginFormGroup>;

  constructor() {
    this.form = this.fb.group<LoginFormGroup>({
      username: this.fb.nonNullable.control('gorillazbananaz', [Validators.required]),
      password: this.fb.nonNullable.control('Wnv0hODS9x', [Validators.required]),
    });
  }

  readonly isPasswordVisible = signal(false);
  readonly isLoginLoading = signal(false);
  readonly loginError = signal<number | null>(null);

  readonly errors = UNAUTHORIZED_RESPONS_STATUS;

  togglePasswordVisibility(): void {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  onSubmit(): void {
    const value = this.form.getRawValue();

    if (!this.form.valid) {
      return;
    }
    this.isLoginLoading.set(true);
    this.authService
      .login(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err: HttpResponseBase) => {
          this.loginError.set(err.status);
          this.isLoginLoading.set(false);
        },
      });
  }
}
