import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../../shared/services/chat/chat.service';
import { fromEvent, startWith, Subject, switchMap, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chat } from '../../../../shared/services/chat/model/types';
import { PostFormComponent } from '../../../../shared/components/post-form/post-form.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';

@Component({
  selector: 'app-chat-workspace',
  imports: [ChatHeaderComponent, PostFormComponent, ChatMessagesComponent],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWorkspaceComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(ChatService);
  private readonly destroyRef = inject(DestroyRef);
  readonly hostElement = inject(ElementRef);
  readonly r2 = inject(Renderer2);

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

  ngAfterViewInit(): void {
    this.resizeFeedList();

    fromEvent(window, 'resize')
      .pipe(throttleTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resizeFeedList();
      });
  }

  private resizeFeedList(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 48;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', height + 'px');
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
