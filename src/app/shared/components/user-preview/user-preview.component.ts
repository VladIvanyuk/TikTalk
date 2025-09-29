import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { avatarSizes } from '../../types/components.types';

@Component({
  selector: 'app-user-preview',
  imports: [AvatarComponent],
  templateUrl: './user-preview.component.html',
  styleUrl: './user-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPreviewComponent {
  readonly firstName = input.required();
  readonly lastName = input.required();
  readonly avatar = input.required<string | null>();

  readonly avatarSizes = avatarSizes;
}
