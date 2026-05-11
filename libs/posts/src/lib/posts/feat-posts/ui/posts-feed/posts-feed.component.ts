import { ActivatedRoute } from '@angular/router';
import { avatarSizes } from '@tt/shared';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2,
  signal,
} from '@angular/core';
import { PostsService } from '@tt/shared';
import { meFeature } from '@tt/data-access';
import { Post } from '@tt/shared';
import { AvatarComponent } from '@tt/shared';
import { DatePipe } from '@angular/common';
import { SvgIconComponent } from '@tt/shared';
import { fromEvent, Observable, startWith, switchMap, tap, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostFormComponent } from '../../post-form/post-form.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-posts-feed',
  imports: [PostFormComponent, AvatarComponent, DatePipe, SvgIconComponent],
  templateUrl: './posts-feed.component.html',
  styleUrl: './posts-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsFeedComponent implements AfterViewInit {
  private readonly postsService = inject(PostsService);
  private readonly store = inject(Store);
  readonly avatarSizes = avatarSizes;

  readonly me = this.store.selectSignal(meFeature.selectMe);
  readonly posts = signal<Post[]>([]);
  readonly destroyRef = inject(DestroyRef);
  readonly route = inject(ActivatedRoute);

  readonly hostElement = inject(ElementRef);
  readonly r2 = inject(Renderer2);
  readonly currentId = signal<string>(this.route.snapshot.params['id']);

  constructor() {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith({ id: this.currentId() }),
        switchMap(({ id }) => {
          this.currentId.set(id);
          return this.fetchPosts(this.currentId());
        }),
      )
      .subscribe();
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

  sendPost(text: string): void {
    this.postsService
      .sendPost({
        authorId: this.me()!.id,
        content: text,
        communityId: 0,
        title: '',
      })
      .pipe(
        switchMap(() => this.fetchPosts(this.currentId())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.error('Error sending post:', err);
        },
      });
  }

  sendComment(text: string, postId: number): void {
    this.postsService
      .sendComment({
        authorId: this.me()!.id,
        postId,
        text,
      })
      .pipe(
        switchMap(() => this.fetchPosts(this.currentId())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.error('Error sending comment:', err);
        },
      });
  }

  fetchPosts(userId: string): Observable<Post[]> {
    const id = String(userId === 'me' ? this.me()!.id : userId);
    return this.postsService.getPosts(id).pipe(
      tap((data) => {
        this.posts.set(data);
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
