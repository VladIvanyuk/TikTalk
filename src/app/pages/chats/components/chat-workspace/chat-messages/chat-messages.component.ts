import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-messages',
  imports: [],
  templateUrl: './chat-messages.component.html',
  styleUrl: './chat-messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesComponent { }
