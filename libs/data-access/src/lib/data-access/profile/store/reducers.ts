import { Profile } from '@tt/shared';
import { profileActions } from './actions';
import { createFeature, createReducer, on } from '@ngrx/store';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.profileLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload['profiles'],
      };
    }),
  ),
});
