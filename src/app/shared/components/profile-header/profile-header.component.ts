import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { avatarSizes } from '../../types/components.types';
import { Profile } from '../../types/profiles.types';
import { AvatarComponent } from '../common/avatar/avatar.component';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  readonly profile = input.required<Profile>();
  readonly avatarSize = input<avatarSizes>(avatarSizes.M);
}
