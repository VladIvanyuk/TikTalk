import { Component, input } from '@angular/core';
import { avatarSizes } from '../../../types/components.types';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  size = input.required<avatarSizes>();
  url = input.required<string | null>();
}
