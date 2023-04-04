/*
 *
 * Vehicles actions
 *
 */

import * as CONSTANTS from './constants';

export function createVehicle(payload) {
  return {
    type: CONSTANTS.CREATE_VEHICLE,
    payload
  }
}

export function getVehicles() {
  return{
    type: CONSTANTS.GET_VEHICLES
  }
}
export function getVehicleById(id) {
  return {
    type: CONSTANTS.GET_VEHICLE_BY_ID,
    id
  }
}
export function updateVehicle(payload) {
  return {
    type: CONSTANTS.UPDATE_VEHICLE,
    payload
  }
}
export function deleteVehicle(id) {
  return {
    type: CONSTANTS.DELETE_VEHICLE,
    id
  }
}

export function getParkingAreas() {
  return {
    type: CONSTANTS.GET_PARKING_AREAS
  }
}
