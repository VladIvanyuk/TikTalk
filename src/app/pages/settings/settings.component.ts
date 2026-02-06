import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '../../shared/components/profile-header/profile-header.component';
import { avatarSizes } from '../../shared/types/components.types';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from '../../shared/components/common/input/input.component';
import { TextareaComponent } from '../../shared/components/common/textarea/textarea.component';
import { ButtonComponent } from '../../shared/components/common/button/button.component';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';

type SettingsForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  description: FormControl<string>;
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
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly me$ = toObservable(this.profileService.myProfile).pipe(
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
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    this.profileService
      .updateMe(value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.profileService.updateMyProfile(data);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
}
