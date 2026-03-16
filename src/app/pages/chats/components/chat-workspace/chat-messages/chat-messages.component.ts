import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Chat } from '../../../../../shared/services/chat/model/types';
import { ProfileService } from '../../../../../shared/services/profile/profile.service';
import { AvatarComponent } from '../../../../../shared/components/common/avatar/avatar.component';
import { avatarSizes } from '../../../../../shared/types/components.types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-messages',
  imports: [AvatarComponent, DatePipe],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesComponent {
  readonly chat = input.required<Chat>();
  readonly myProfile = inject(ProfileService).myProfile;

  readonly avatarSizes = avatarSizes;
}
