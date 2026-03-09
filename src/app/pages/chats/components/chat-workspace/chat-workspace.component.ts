import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chat-workspace',
  imports: [],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceComponent {}
