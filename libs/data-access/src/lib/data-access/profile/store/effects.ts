import { inject, Injectable } from '@angular/core';
import { ProfileDataService } from '../services';
import { ActionsSubject } from '@ngrx/store';
import { createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  private readonly profileService = inject(ProfileDataService);
  private readonly actions$ = inject(ActionsSubject);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap((action) => {
        return this.profileService.getProfilesData(action.filters);
      }),
      map((res) => profileActions.profileLoaded({ profiles: res })),
      catchError((err) => {
        return of(profileActions.profileLoaded({ profiles: [] }));
      }),
    );
  });
}
