import { Route } from '@angular/router';
import { ChatsComponent } from '../feat-chats/chats.component';
import { ChatWorkspaceComponent } from '../ui/chat-workspace/chat-workspace.component';

export const CHAT_ROUTES: Route[] = [
  {
    path: '',
    component: ChatsComponent,
    children: [
      {
        path: ':id',
        component: ChatWorkspaceComponent,
      },
    ],
  },
];
