import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProfileCardComponent } from './shared/components/profile-card/profile-card.component';
import { ProfileService } from './shared/services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Profile } from './shared/types/profiles.types';

@Component({
  selector: 'app-root',
  imports: [ProfileCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  profileService = inject(ProfileService);
  destroyRef = inject(DestroyRef);

  readonly profiles = signal<Profile[] | null>(null);

  ngOnInit(): void {
    this.profileService
      .getProfilesData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        console.log(data);
        this.profiles.set(data);
      });
  }
}
