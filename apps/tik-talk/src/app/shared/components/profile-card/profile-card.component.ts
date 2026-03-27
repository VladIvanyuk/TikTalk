import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { avatarSizes } from '../../types/components.types';
import { TagComponent } from '../common/tag/tag.component';
import { ButtonComponent } from '../common/button/button.component';
import { Profile } from '../../types/profiles.types';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';

@Component({
  selector: 'app-profile-card',
  imports: [ProfileHeaderComponent, TagComponent, ButtonComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  readonly avatarSizes = avatarSizes;
  readonly profile = input.required<Profile>();
}
