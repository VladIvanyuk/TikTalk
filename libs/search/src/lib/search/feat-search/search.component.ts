import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputComponent, ProfileCardComponent, StackInputComponent } from '@tt/shared';
import { ProfileDataService } from '@tt/data-access';
import { Profile } from '@tt/shared';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subject, switchMap } from 'rxjs';

type SearchForm = {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  stack: FormControl<string[]>;
};

@Component({
  selector: 'app-search',
  imports: [ProfileCardComponent, ReactiveFormsModule, InputComponent, StackInputComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly profileDataService = inject(ProfileDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup<SearchForm>;

  private readonly searchTrigger = new Subject<void>();

  constructor() {
    this.form = this.fb.group<SearchForm>({
      firstName: this.fb.nonNullable.control(''),
      lastName: this.fb.nonNullable.control(''),
      stack: this.fb.nonNullable.control([]),
    });

    this.searchTrigger
      .pipe(
        startWith(void 0),
        debounceTime(500),
        switchMap(() => this.profileDataService.getProfilesData(this.form.getRawValue())),
      )
      .subscribe((data) => {
        this.profiles.set(data);
      });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.searchTrigger.next();
    });
  }

  readonly profiles = signal<Profile[] | null>(null);

  submit(): void {
    console.log(this.form.value);
  }
}
