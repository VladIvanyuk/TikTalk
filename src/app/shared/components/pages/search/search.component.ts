import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../types/profiles.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProfileCardComponent } from '../../profile-card/profile-card.component';

@Component({
  selector: 'app-search',
  imports: [ProfileCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
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
