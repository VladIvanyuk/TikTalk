import { Profile } from '@tt/shared';
import { meActions, profileActions } from './actions';
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

export interface MeState {
  me: Profile | null;
  subscribers: Profile[];
}

export const initialMeState: MeState = {
  me: null,
  subscribers: [],
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
    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters,
      };
    }),
  ),
});

export const meFeature = createFeature({
  name: 'meFeature',
  reducer: createReducer(
    initialMeState,
    on(meActions.meLoaded, (state, payload) => {
      return {
        ...state,
        me: payload.me,
      };
    }),
    on(meActions.subscribersLoaded, (state, payload) => {
      return {
        ...state,
        subscribers: payload.subscribers,
      };
    }),
  ),
});
