import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { CommonMajorDestination } from './common-major-destination.model';

export const loadCommonMajorDestinations = createAction(
    '[CommonMajorDestination/API] Load CommonMajorDestinations',
    props<{ commonMajorDestinations: CommonMajorDestination[] }>()
);

export const addCommonMajorDestination = createAction(
    '[CommonMajorDestination/API] Add CommonMajorDestination',
    props<{ commonMajorDestination: CommonMajorDestination }>()
);

export const upsertCommonMajorDestination = createAction(
    '[CommonMajorDestination/API] Upsert CommonMajorDestination',
    props<{ commonMajorDestination: CommonMajorDestination }>()
);

export const addCommonMajorDestinations = createAction(
    '[CommonMajorDestination/API] Add CommonMajorDestinations',
    props<{ commonMajorDestinations: CommonMajorDestination[] }>()
);

export const upsertCommonMajorDestinations = createAction(
    '[CommonMajorDestination/API] Upsert CommonMajorDestinations',
    props<{ commonMajorDestinations: CommonMajorDestination[] }>()
);

export const updateCommonMajorDestination = createAction(
    '[CommonMajorDestination/API] Update CommonMajorDestination',
    props<{ commonMajorDestination: Update<CommonMajorDestination> }>()
);

export const updateCommonMajorDestinations = createAction(
    '[CommonMajorDestination/API] Update CommonMajorDestinations',
    props<{ commonMajorDestinations: Update<CommonMajorDestination>[] }>()
);

export const deleteCommonMajorDestination = createAction(
    '[CommonMajorDestination/API] Delete CommonMajorDestination',
    props<{ id: string }>()
);

export const deleteCommonMajorDestinations = createAction(
    '[CommonMajorDestination/API] Delete CommonMajorDestinations',
    props<{ ids: string[] }>()
);

export const clearCommonMajorDestinations = createAction(
    '[CommonMajorDestination/API] Clear CommonMajorDestinations'
);
