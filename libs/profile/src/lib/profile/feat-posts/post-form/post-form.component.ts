import { ProfileService } from '@tt/profile';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { avatarSizes, TextareaComponent } from '@tt/shared';
import { AvatarComponent } from '@tt/shared';
import { ButtonComponent } from '@tt/shared';
import { SvgIconComponent } from '@tt/shared';

type PostForm = {
  text: FormControl;
};

@Component({
  selector: 'app-post-form',
  imports: [
    TextareaComponent,
    AvatarComponent,
    ButtonComponent,
    SvgIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  private readonly fb = inject(FormBuilder);
  readonly me = inject(ProfileService).myProfile;

  readonly placeholder = input();

  readonly avatarSizes = avatarSizes;

  readonly sendPost = output<string>();

  formGroup: FormGroup<PostForm>;

  constructor() {
    this.formGroup = this.fb.group<PostForm>({
      text: this.fb.control(null),
    });
  }

  get postTextControl(): AbstractControl {
    return this.formGroup.get('text') as AbstractControl;
  }

  submit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.sendPost.emit(this.postTextControl.value);
    this.postTextControl.patchValue('');
  }
}
