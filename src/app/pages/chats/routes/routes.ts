import { Route } from '@angular/router';
import { ChatsComponent } from '../chats.component';
import { ChatWorkspaceComponent } from '../components/chat-workspace/chat-workspace.component';

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
