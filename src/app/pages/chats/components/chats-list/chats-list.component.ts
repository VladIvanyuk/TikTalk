import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatService } from '../../../../shared/services/chat/chat.service';
import { AsyncPipe } from '@angular/common';
import { map, startWith, switchMap } from 'rxjs';
import { ChatButtonComponent } from './chat-button/chat-button.component';
import { InputComponent } from '../../../../shared/components/common/input/input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
