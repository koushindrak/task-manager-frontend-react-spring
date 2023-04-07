/*
 *
 * ManageTasks actions
 *
 */

import * as CONSTANTS from './constants';

export function createRevenue(payload) {
  return {
    type: CONSTANTS.CREATE_REVENUE,
    payload
  }
}

export function getRevenues() {
  return{
    type: CONSTANTS.GET_REVENUES
  }
}
export function getRevenueById(id) {
  return {
    type: CONSTANTS.GET_REVENUE_BY_ID,
    id
  }
}
export function updateRevenue(payload) {
  return {
    type: CONSTANTS.UPDATE_REVENUE,
    payload
  }
}
export function deleteRevenue(id) {
  return {
    type: CONSTANTS.DELETE_REVENUE,
    id
  }
}
