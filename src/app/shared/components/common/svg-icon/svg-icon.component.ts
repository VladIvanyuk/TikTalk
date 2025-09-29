import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  template: `<svg class="icon"><use [attr.href]="href" /></svg>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
  readonly icon = input.required<string>();
  readonly name = input.required<string>();

  get href(): string {
    return `/assets/icons/svg-sprites/${this.name()}.svg#${this.icon()}`;
  }
}
