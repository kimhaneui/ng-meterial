import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CommonMajorDestination } from './common-major-destination.model';
import * as CommonMajorDestinationActions from './common-major-destination.actions';

export const commonMajorDestinationsFeatureKey = 'commonMajorDestinations';

export interface State extends EntityState<CommonMajorDestination> {
    // additional entities state properties
}

export const adapter: EntityAdapter<CommonMajorDestination> = createEntityAdapter<CommonMajorDestination>();

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
});

const commonMajorDestinationReducer = createReducer(
    initialState,
    on(CommonMajorDestinationActions.addCommonMajorDestination,
        (state, action) => adapter.addOne(action.commonMajorDestination, state)
    ),
    on(CommonMajorDestinationActions.upsertCommonMajorDestination,
        (state, action) => adapter.upsertOne(action.commonMajorDestination, state)
    ),
    on(CommonMajorDestinationActions.addCommonMajorDestinations,
        (state, action) => adapter.addMany(action.commonMajorDestinations, state)
    ),
    on(CommonMajorDestinationActions.upsertCommonMajorDestinations,
        (state, action) => adapter.upsertMany(action.commonMajorDestinations, state)
    ),
    on(CommonMajorDestinationActions.updateCommonMajorDestination,
        (state, action) => adapter.updateOne(action.commonMajorDestination, state)
    ),
    on(CommonMajorDestinationActions.updateCommonMajorDestinations,
        (state, action) => adapter.updateMany(action.commonMajorDestinations, state)
    ),
    on(CommonMajorDestinationActions.deleteCommonMajorDestination,
        (state, action) => adapter.removeOne(action.id, state)
    ),
    on(CommonMajorDestinationActions.deleteCommonMajorDestinations,
        (state, action) => adapter.removeMany(action.ids, state)
    ),
    on(CommonMajorDestinationActions.loadCommonMajorDestinations,
        (state, action) => adapter.addAll(action.commonMajorDestinations, state)
    ),
    on(CommonMajorDestinationActions.clearCommonMajorDestinations,
        state => adapter.removeAll(state)
    ),
);

export function reducer(state: State | undefined, action: Action) {
    return commonMajorDestinationReducer(state, action);
}

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();
