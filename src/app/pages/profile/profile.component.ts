import { avatarSizes } from './../../shared/types/components.types';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProfileService } from '../../shared/services/profile/profile.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileHeaderComponent } from '../../shared/components/profile-header/profile-header.component';

@Component({
  selector: 'app-profile',
  imports: [ProfileHeaderComponent, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);

  readonly avatarSizes = avatarSizes;

  private readonly me$ = toObservable(this.profileService.myProfile);

  ngOnInit(): void {
    console.log(this.route.snapshot.params['id']);
  }

  readonly profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'me') {
        return this.me$;
      }

      return this.profileService.getUser(id);
    }),
  );
}
