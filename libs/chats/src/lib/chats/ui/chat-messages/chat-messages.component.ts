import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Chat } from '../../services/chat/model/types';
import { AvatarComponent } from '@tt/shared';
import { avatarSizes } from '@tt/shared';
import { DatePipe } from '@angular/common';
import { meFeature } from '@tt/data-access';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chat-messages',
  imports: [AvatarComponent, DatePipe],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesComponent {
  readonly chat = input.required<Chat>();
  private readonly store = inject(Store);
  readonly myProfile = this.store.selectSignal(meFeature.selectMe);

  readonly avatarSizes = avatarSizes;

  isLastMessageSame(index: number, createdAt: string): boolean {
    if (index === 0) {
      return false;
    }
    const prevMessageDate = new Date(this.chat().messages[index - 1]?.createdAt ?? '')
      .toISOString()
      .split('T')[0];
    const currentMessageDate = new Date(createdAt ?? '').toISOString().split('T')[0];

    return prevMessageDate === currentMessageDate;
  }
}
