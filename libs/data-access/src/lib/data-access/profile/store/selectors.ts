import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducers';

export const selectProfiles = createSelector(profileFeature.selectProfiles, (profiles) => profiles);
