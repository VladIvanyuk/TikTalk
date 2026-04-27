import { avatarSizes } from '@tt/shared';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '@tt/shared';
import { DatePipe } from '@angular/common';
import { MyChatList } from '../../services/chat/model/types';

@Component({
  selector: 'app-chat-button',
  imports: [AvatarComponent, DatePipe],
  templateUrl: './chat-button.component.html',
  styleUrl: './chat-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatButtonComponent {
  readonly chat = input.required<MyChatList>();
  avatarSizes = avatarSizes;
}
