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

export const meActions = createActionGroup({
  source: 'Me',
  events: {
    'me loaded': props<{ me: Profile }>(),
    'subscribers loaded': props<{ subscribers: Profile[] }>(),
  },
});
