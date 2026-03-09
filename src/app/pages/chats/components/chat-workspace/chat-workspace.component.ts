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
import { startWith, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chat } from '../../../../shared/services/chat/model/types';

@Component({
  selector: 'app-chat-workspace',
  imports: [ChatHeaderComponent],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(ChatService);
  private readonly destroyRef = inject(DestroyRef);

  readonly fetchTrigger = new Subject<void>();

  readonly chat = signal<Chat | null>(null);
  private readonly chatId = signal<string>(this.route.snapshot.params['id']);

  ngOnInit(): void {
    this.fetchChat();

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.chatId.set(params['id']);
      this.fetchTrigger.next();
    });
  }

  fetchChat(): void {
    this.fetchTrigger
      .pipe(
        startWith(0),
        switchMap(() => this.chatService.getPersonalChat(Number(this.chatId()))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        this.chat.set(data);
      });
  }
}
