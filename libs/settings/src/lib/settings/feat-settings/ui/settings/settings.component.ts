import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ProfileDataService } from '@tt/data-access';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '@tt/shared';
import { avatarSizes } from '@tt/shared';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '@tt/shared';
import { TextareaComponent } from '@tt/shared';
import { ButtonComponent } from '@tt/shared';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { StackInputComponent } from '@tt/shared';
import { AvatarUploadComponent } from '../../../feat-avatar-upload/ui/avatar-upload/avatar-upload.component';

type SettingsForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  description: FormControl<string>;
  stack: FormControl<string[] | null>;
};

@Component({
  selector: 'app-settings',
  imports: [
    AsyncPipe,
    ProfileHeaderComponent,
    ReactiveFormsModule,
    InputComponent,
    FormsModule,
    TextareaComponent,
    ButtonComponent,
    RouterLink,
    AvatarUploadComponent,
    StackInputComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly profileDataService = inject(ProfileDataService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly avatar = signal<File | null>(null);

  readonly isLoading = signal(false);

  readonly me$ = toObservable(this.profileDataService.myProfile).pipe(
    tap((data) => {
      if (data) {
        this.form.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          description: data.description,
        });
      }
    }),
    takeUntilDestroyed(this.destroyRef),
  );

  readonly avatarSizes = avatarSizes;
  readonly form: FormGroup<SettingsForm>;

  constructor() {
    this.form = this.fb.group<SettingsForm>({
      firstName: this.fb.nonNullable.control('', Validators.required),
      lastName: this.fb.nonNullable.control('', Validators.required),
      username: this.fb.nonNullable.control({ value: '', disabled: true }),
      description: this.fb.nonNullable.control('', Validators.required),
      stack: this.fb.nonNullable.control(null),
    });
  }

  updateAvatar(file: File | null = null): void {
    this.avatar.set(file);
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);

    const value = this.form.getRawValue();

    if (this.avatar()) {
      this.profileDataService
        .updateAvatar(this.avatar()!)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.profileDataService.updateMyProfile(data);
          },
          error: (err) => {
            console.error(err);
          },
        });
    }

    this.profileDataService
      .updateMe(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.profileDataService.updateMyProfile(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
