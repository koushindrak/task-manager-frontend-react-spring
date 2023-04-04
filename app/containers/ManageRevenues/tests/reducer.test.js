import { fromJS } from 'immutable';
import manageRevenuesReducer from '../reducer';

describe('manageRevenuesReducer', () => {
  it('returns the initial state', () => {
    expect(manageRevenuesReducer(undefined, {})).toEqual(fromJS({}));
  });
});
