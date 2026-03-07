import { avatarSizes } from './../../../../shared/types/components.types';
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
import { PostFormComponent } from '../../../../shared/components/post-form/post-form.component';
import { PostsService } from '../../../../shared/services/posts/posts.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { Post } from '../../../../shared/services/posts/model/types';
import { AvatarComponent } from '../../../../shared/components/common/avatar/avatar.component';
import { DatePipe } from '@angular/common';
import { SvgIconComponent } from '../../../../shared/components/common/svg-icon/svg-icon.component';
import { fromEvent, Observable, switchMap, tap, throttleTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-posts-feed',
  imports: [PostFormComponent, AvatarComponent, DatePipe, SvgIconComponent],
  templateUrl: './posts-feed.component.html',
  styleUrl: './posts-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsFeedComponent implements OnInit, AfterViewInit {
  private readonly postsService = inject(PostsService);
  readonly avatarSizes = avatarSizes;
  readonly me = inject(ProfileService).myProfile;
  readonly posts = signal<Post[]>([]);
  readonly destroyRef = inject(DestroyRef);

  readonly hostElement = inject(ElementRef);
  readonly r2 = inject(Renderer2);

  ngOnInit(): void {
    this.fetchPosts().subscribe({
      error: (err) => {
        console.error('Error fetching posts:', err);
      },
    });
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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
        switchMap(() => this.fetchPosts()),
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

  fetchPosts(): Observable<Post[]> {
    return this.postsService.getPosts().pipe(
      tap((data) => {
        this.posts.set(data);
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }
}
