import { createActionGroup, props } from '@ngrx/store';
import { Profile } from '@tt/shared';
import { SearchForm } from '../services/model/types';

export const profileActions = createActionGroup({
  source: 'Profile',
  events: {
    'filter events': props<{ filters: SearchForm }>(),
    'profile loaded': props<{ profiles: Profile[] }>(),
  },
});
