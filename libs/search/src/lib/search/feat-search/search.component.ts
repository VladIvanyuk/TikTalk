import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
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

  readonly form: FormGroup<SearchForm>;

  constructor() {
    this.form = this.fb.group<SearchForm>({
      firstName: this.fb.nonNullable.control(''),
      lastName: this.fb.nonNullable.control(''),
      stack: this.fb.nonNullable.control([]),
    });

    this.form.valueChanges
      .pipe(startWith(void 0), debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const filters = this.form.getRawValue();
        this.store.dispatch(profileActions.filterEvents({ filters: filters }));
      });
  }

  readonly profiles = this.store.selectSignal(profileFeature.selectProfiles);
}
