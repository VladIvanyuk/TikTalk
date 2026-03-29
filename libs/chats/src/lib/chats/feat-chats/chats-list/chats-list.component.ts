import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatService } from '@tt/shared';
import { AsyncPipe } from '@angular/common';
import { map, startWith, switchMap } from 'rxjs';
import { InputComponent } from '@tt/shared';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChatButtonComponent } from '../../ui/chat-button/chat-button.component';

@Component({
  selector: 'app-chats-list',
  imports: [
    AsyncPipe,
    ChatButtonComponent,
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsListComponent {
  private readonly chatService = inject(ChatService);

  readonly searchControl = new FormControl();

  readonly chats$ = this.chatService.getMyChats().pipe(
    map((chats) => chats),
    switchMap((chats) => {
      return this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          return chats.filter((chat) => {
            return (
              chat.userFrom.firstName.toLowerCase().includes(value.toLowerCase()) ||
              chat.userFrom.lastName.toLowerCase().includes(value.toLowerCase())
            );
          });
        }),
      );
    }),
  );
}
