import { avatarSizes } from '../../types/components.types';
import { ProfileService } from '../../services/profile/profile.service';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TextareaComponent } from '../common/textarea/textarea.component';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { ButtonComponent } from '../common/button/button.component';
import { SvgIconComponent } from '../common/svg-icon/svg-icon.component';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

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

  submit(): void {
    this.sendPost.emit(this.postTextControl.value);
    this.postTextControl.patchValue('');
  }
}
