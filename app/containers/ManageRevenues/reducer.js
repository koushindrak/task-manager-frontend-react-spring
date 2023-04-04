/*
 *
 * ManageRevenues reducer
 *
 */

import { fromJS } from 'immutable';

export const initialState = fromJS({});
import * as CONSTANTS from './constants'
function manageRevenuesReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.CREATE_REVENUE_SUCCESS:
      return Object.assign({},state,{createRevenueResponse:action.response})

    case CONSTANTS.CREATE_REVENUE_FAILURE:
      return Object.assign({},state, {createRevenueError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.GET_REVENUES_SUCCESS:
      return Object.assign({},state,{getRevenueResponse:action.response})

    case CONSTANTS.GET_REVENUES_FAILURE:
      return Object.assign({},state, {getRevenueError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.GET_REVENUE_BY_ID_SUCCESS:
      return Object.assign({},state,{getRevenueByIdResponse:action.response})

    case CONSTANTS.GET_REVENUE_BY_ID_FAILURE:
      return Object.assign({},state, {getRevenueByIdError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.UPDATE_REVENUE_SUCCESS:
      return Object.assign({},state,{updateRevenueResponse:action.response})

    case CONSTANTS.UPDATE_REVENUE_FAILURE:
      return Object.assign({},state, {updateRevenueError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.DELETE_REVENUE_SUCCESS:
      return Object.assign({},state,{deleteRevenueResponse:action.response})

    case CONSTANTS.DELETE_REVENUE_FAILURE:
      return Object.assign({},state, {deleteRevenueError:{error:action.error,errorTime:new Date()}})

    default:
      return state;
  }
}

export default manageRevenuesReducer;
