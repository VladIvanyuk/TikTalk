import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PostInputComponent } from '../../../../shared/components/post-input/post-input.component';

@Component({
  selector: 'app-posts-feed',
  imports: [PostInputComponent],
  templateUrl: './posts-feed.component.html',
  styleUrl: './posts-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsFeedComponent {}
