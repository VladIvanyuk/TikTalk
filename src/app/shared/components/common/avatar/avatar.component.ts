import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { avatarSizes } from '../../../types/components.types';
import { ImgPipe } from '../../../pipes/img-pipe.pipe';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-avatar',
  imports: [ImgPipe, NgOptimizedImage],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly size = input.required<avatarSizes>();
  readonly url = input.required<string | null>();
}
