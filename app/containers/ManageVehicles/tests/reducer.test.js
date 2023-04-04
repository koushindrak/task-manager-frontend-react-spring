import { fromJS } from 'immutable';
import manageVehiclesReducer from '../reducer';

describe('manageVehiclesReducer', () => {
  it('returns the initial state', () => {
    expect(manageVehiclesReducer(undefined, {})).toEqual(fromJS({}));
  });
});
