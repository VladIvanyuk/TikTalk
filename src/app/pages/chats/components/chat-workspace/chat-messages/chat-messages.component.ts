import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Chat, ChatMessage } from '../../../../../shared/services/chat/model/types';
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

  readonly filterredByDateMessages = computed(() => {
    const messagesWithDate: { date: string; messages: ChatMessage[] }[] = [];

    this.chat().messages.forEach((message) => {
      const date = new Date(message.createdAt).toISOString().split('T')[0];
      if (!messagesWithDate.find((item) => item.date === date)) {
        messagesWithDate.push({ date, messages: [message] });
      } else {
        messagesWithDate.find((item) => item.date === date)?.messages.push(message);
      }
    });

    return messagesWithDate;
  });
}
