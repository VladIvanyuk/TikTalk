import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputComponent, ProfileCardComponent, StackInputComponent } from '@tt/shared';
import { profileActions, profileFeature } from '@tt/data-access';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { Store } from '@ngrx/store';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly isSearchInitialized = signal<boolean>(false);

  readonly form: FormGroup<SearchForm>;

  readonly storeFilters = this.store.selectSignal(profileFeature.selectProfileFilters);

  constructor() {
    this.form = this.fb.group<SearchForm>({
      firstName: this.fb.nonNullable.control(this.storeFilters()?.firstName),
      lastName: this.fb.nonNullable.control(this.storeFilters()?.lastName),
      stack: this.fb.nonNullable.control(this.storeFilters()?.stack),
    });

    this.form.valueChanges
      .pipe(startWith(void 0), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const filters = this.isSearchInitialized() ? this.form.getRawValue() : this.storeFilters();

        this.isSearchInitialized.set(true);
        this.store.dispatch(profileActions.filterEvents({ filters: filters }));
      });
  }

  readonly profiles = this.store.selectSignal(profileFeature.selectProfiles);
}
