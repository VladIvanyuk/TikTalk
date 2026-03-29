import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@tt/shared';
import { fromEvent, startWith, Subject, switchMap, throttleTime, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Chat } from '@tt/shared';
import { PostFormComponent } from '@tt/shared';
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component';

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
  private readonly hostElement = inject(ElementRef);
  private readonly r2 = inject(Renderer2);

  readonly chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');

  readonly fetchChatTrigger$ = new Subject<void>();
  readonly sendMessageTrigger$ = new Subject<string>();
  readonly pollTrigger$ = new Subject<void>();

  readonly chat = signal<Chat | null>(null);
  private readonly chatId = signal<string>(this.route.snapshot.params['id']);
  private isUserAtBottom = true;

  constructor() {
    effect(() => {
      const chat = this.chat();
      if (chat && this.isUserAtBottom) {
        requestAnimationFrame(() => this.scrollToBottom());
      }
    });

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

    this.pollTrigger$
      .pipe(
        switchMap(() =>
          timer(5000, 5000).pipe(
            switchMap(() => this.chatService.getPersonalChat(Number(this.chatId()))),
            takeUntilDestroyed(this.destroyRef),
          ),
        ),
      )
      .subscribe((data) => this.chat.set(data));
  }

  ngOnInit(): void {
    this.fetchChat();
  }

  ngAfterViewInit(): void {
    this.resizeFeedList();
    this.initScrollListener();

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
        this.pollTrigger$.next();
      });
  }

  private initScrollListener(): void {
    const containerRef = this.chatContainer();
    if (!containerRef) {
      return;
    }

    const el = containerRef.nativeElement;
    fromEvent(el, 'scroll')
      .pipe(throttleTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const threshold = 100;
        const position = el.scrollTop + el.clientHeight;
        const bottom = el.scrollHeight;
        this.isUserAtBottom = position >= bottom - threshold;
      });
  }

  private scrollToBottom(): void {
    const containerRef = this.chatContainer();
    if (!containerRef) {
      return;
    }
    const el = containerRef.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  sendMessage(event: string): void {
    this.sendMessageTrigger$.next(event);
    this.scrollToBottom();
  }
}
