import { avatarSizes } from './../../../../../shared/types/components.types';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SvgIconComponent } from '../../../../../shared/components/common/svg-icon/svg-icon.component';
import { ButtonComponent } from '../../../../../shared/components/common/button/button.component';
import { Profile } from '../../../../../shared/types/profiles.types';
import { AvatarComponent } from '../../../../../shared/components/common/avatar/avatar.component';

@Component({
  selector: 'app-chat-header',
  imports: [ButtonComponent, SvgIconComponent, AvatarComponent],
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatHeaderComponent {
  readonly companion = input.required<Profile>();

  readonly avatarSizes = avatarSizes;
}
