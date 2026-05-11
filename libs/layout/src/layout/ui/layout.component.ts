import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../lib/layout/feat-sidebar/sidebar.component';
import { Store } from '@ngrx/store';
import { meActions, ProfileDataService } from '@tt/data-access';
import { map } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly store = inject(Store);
  private readonly profileDataService = inject(ProfileDataService);

  readonly subscribers$ = this.profileDataService
    .getMySubscribers()
    .pipe(map((subscribers) => subscribers.slice(0, 3)));

  ngOnInit(): void {
    this.profileDataService.getMe().subscribe((me) => {
      this.store.dispatch(meActions.meLoaded({ me }));
    });

    this.profileDataService
      .getMySubscribers()
      .pipe(map((subscribers) => subscribers.slice(0, 3)))
      .subscribe((subscribers) => {
        this.store.dispatch(meActions.subscribersLoaded({ subscribers }));
      });
  }
}
