import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectManageTasksDomain = state => state.get('manageTasks', initialState);

export const createRevenueSuccess=()=> createSelector(selectManageTasksDomain,substate=>substate.createRevenueResponse)
export const createRevenueFailure=()=> createSelector(selectManageTasksDomain,substate=>substate.createRevenueError)

export const getRevenueSuccess=()=> createSelector(selectManageTasksDomain,substate=>substate.getRevenueResponse)
export const getRevenueFailure=()=> createSelector(selectManageTasksDomain,substate=>substate.getRevenueError)

export const getRevenueByIdSuccess=()=> createSelector(selectManageTasksDomain,substate=>substate.getRevenueByIdResponse)
export const getRevenueByIdFailure=()=> createSelector(selectManageTasksDomain,substate=>substate.getRevenueByIdError)

export const updateRevenueSuccess=()=> createSelector(selectManageTasksDomain,substate=>substate.updateRevenueResponse)
export const updateRevenueFailure=()=> createSelector(selectManageTasksDomain,substate=>substate.updateRevenueError)

export const deleteRevenueSuccess=()=> createSelector(selectManageTasksDomain,substate=>substate.deleteRevenueResponse)
export const deleteRevenueFailure=()=> createSelector(selectManageTasksDomain,substate=>substate.deleteRevenueError)

export { selectManageTasksDomain };
