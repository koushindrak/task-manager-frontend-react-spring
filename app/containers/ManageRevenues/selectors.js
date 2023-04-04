import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectManageRevenuesDomain = state => state.get('manageRevenues', initialState);

export const createRevenueSuccess=()=> createSelector(selectManageRevenuesDomain,substate=>substate.createRevenueResponse)
export const createRevenueFailure=()=> createSelector(selectManageRevenuesDomain,substate=>substate.createRevenueError)

export const getRevenueSuccess=()=> createSelector(selectManageRevenuesDomain,substate=>substate.getRevenueResponse)
export const getRevenueFailure=()=> createSelector(selectManageRevenuesDomain,substate=>substate.getRevenueError)

export const getRevenueByIdSuccess=()=> createSelector(selectManageRevenuesDomain,substate=>substate.getRevenueByIdResponse)
export const getRevenueByIdFailure=()=> createSelector(selectManageRevenuesDomain,substate=>substate.getRevenueByIdError)

export const updateRevenueSuccess=()=> createSelector(selectManageRevenuesDomain,substate=>substate.updateRevenueResponse)
export const updateRevenueFailure=()=> createSelector(selectManageRevenuesDomain,substate=>substate.updateRevenueError)

export const deleteRevenueSuccess=()=> createSelector(selectManageRevenuesDomain,substate=>substate.deleteRevenueResponse)
export const deleteRevenueFailure=()=> createSelector(selectManageRevenuesDomain,substate=>substate.deleteRevenueError)

export { selectManageRevenuesDomain };
