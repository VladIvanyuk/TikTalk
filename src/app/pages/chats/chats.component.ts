import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chats',
  imports: [],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsComponent { }
