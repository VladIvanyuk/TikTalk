import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { avatarSizes } from '../../types/components.types';
import { TagComponent } from '../common/tag/tag.component';
import { ButtonComponent } from '../common/button/button.component';
import { Profile } from '../../types/profiles.types';
import { ImgPipe } from '../../pipes/img-pipe.pipe';

@Component({
  selector: 'app-profile-card',
  imports: [AvatarComponent, TagComponent, ButtonComponent, ImgPipe],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  avatarSizes = avatarSizes;
  readonly profile = input.required<Profile>();
}
