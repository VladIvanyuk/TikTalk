import { avatarSizes } from '@tt/shared';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SvgIconComponent } from '@tt/shared';
import { ButtonComponent } from '@tt/shared';
import { Profile } from '@tt/shared';
import { AvatarComponent } from '@tt/shared';

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
