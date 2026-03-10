import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../../shared/services/chat/chat.service';
import { startWith, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chat } from '../../../../shared/services/chat/model/types';
import { PostFormComponent } from '../../../../shared/components/post-form/post-form.component';

@Component({
  selector: 'app-chat-workspace',
  imports: [ChatHeaderComponent, PostFormComponent],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(ChatService);
  private readonly destroyRef = inject(DestroyRef);

  readonly fetchChatTrigger$ = new Subject<void>();
  readonly sendMessageTrigger$ = new Subject<string>();

  readonly chat = signal<Chat | null>(null);
  private readonly chatId = signal<string>(this.route.snapshot.params['id']);

  constructor() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.chatId.set(params['id']);
      this.fetchChatTrigger$.next();
    });

    this.sendMessageTrigger$
      .pipe(
        switchMap((text) => this.chatService.sendMessage(Number(this.chatId()), text)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.fetchChatTrigger$.next();
      });
  }

  ngOnInit(): void {
    this.fetchChat();
  }

  fetchChat(): void {
    this.fetchChatTrigger$
      .pipe(
        startWith(0),
        switchMap(() => this.chatService.getPersonalChat(Number(this.chatId()))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.chat.set(data);
      });
  }

  sendMessage(event: string): void {
    this.sendMessageTrigger$.next(event);
  }
}
