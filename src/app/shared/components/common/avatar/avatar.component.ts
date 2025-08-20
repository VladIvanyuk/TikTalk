import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { avatarSizes } from '../../../types/components.types';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly size = input.required<avatarSizes>();
  readonly url = input.required<string | null>();
}
