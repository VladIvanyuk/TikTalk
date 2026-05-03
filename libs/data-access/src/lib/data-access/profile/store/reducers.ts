import { Profile } from '@tt/shared';
import { profileActions } from './actions';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SearchForm } from '../services/model/types';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: SearchForm;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {
    firstName: '',
    lastName: '',
    stack: [],
  },
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profileLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles,
      };
    }),
  ),
});
