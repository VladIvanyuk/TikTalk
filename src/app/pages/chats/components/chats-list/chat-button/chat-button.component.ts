import { avatarSizes } from './../../../../../shared/types/components.types';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '../../../../../shared/components/common/avatar/avatar.component';
import { DatePipe } from '@angular/common';
import { MyChatList } from '../../../../../shared/services/chat/model/types';

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
