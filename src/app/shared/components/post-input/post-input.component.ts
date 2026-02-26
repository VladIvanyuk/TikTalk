import { avatarSizes } from './../../types/components.types';
import { ProfileService } from './../../services/profile/profile.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TextareaComponent } from '../common/textarea/textarea.component';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { ButtonComponent } from '../common/button/button.component';
import { SvgIconComponent } from '../common/svg-icon/svg-icon.component';

@Component({
  selector: 'app-post-input',
  imports: [TextareaComponent, AvatarComponent, ButtonComponent, SvgIconComponent],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostInputComponent {
  readonly profileService = inject(ProfileService).myProfile;

  readonly avatarSizes = avatarSizes;
}
