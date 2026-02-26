import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostFormComponent } from '../../../../shared/components/post-form/post-form.component';
import { PostsService } from '../../../../shared/services/posts/posts.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';

@Component({
  selector: 'app-posts-feed',
  imports: [PostFormComponent],
  templateUrl: './posts-feed.component.html',
  styleUrl: './posts-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsFeedComponent {
  private readonly postsService = inject(PostsService);
  readonly me = inject(ProfileService).myProfile;

  sendPost(text: string): void {
    this.postsService
      .sendPost({
        authorId: this.me()!.id,
        content: text,
        communityId: 0,
        title: '',
      })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
      });
  }
}
