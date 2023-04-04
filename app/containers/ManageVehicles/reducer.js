/*
 *
 * Vehicles reducer
 *
 */


import { fromJS } from 'immutable';

export const initialState = fromJS({});
import * as CONSTANTS from './constants'

function manageVehiclesReducer(state = initialState, action) {
  switch (action.type) {
    case CONSTANTS.CREATE_VEHICLE_SUCCESS:
      return Object.assign({},state,{createVehicleResponse:action.response})

    case CONSTANTS.CREATE_VEHICLE_FAILURE:
      return Object.assign({},state, {createVehicleError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.GET_VEHICLES_SUCCESS:
      return Object.assign({},state,{getVehicleResponse:action.response})

    case CONSTANTS.GET_VEHICLES_FAILURE:
      return Object.assign({},state, {getVehicleError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.GET_PARKING_AREAS_SUCCESS:
      return Object.assign({},state,{getParkingAreasResponse:action.response})

    case CONSTANTS.GET_PARKING_AREAS_FAILURE:
      return Object.assign({},state, {getParkingAreasError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.GET_VEHICLE_BY_ID_SUCCESS:
      return Object.assign({},state,{getVehicleByIdResponse:action.response})

    case CONSTANTS.GET_VEHICLE_BY_ID_FAILURE:
      return Object.assign({},state, {getVehicleByIdError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.UPDATE_VEHICLE_SUCCESS:
      return Object.assign({},state,{updateVehicleResponse:action.response})

    case CONSTANTS.UPDATE_VEHICLE_FAILURE:
      return Object.assign({},state, {updateVehicleError:{error:action.error,errorTime:new Date()}})

    case CONSTANTS.DELETE_VEHICLE_SUCCESS:
      return Object.assign({},state,{deleteVehicleResponse:action.response})

    case CONSTANTS.DELETE_VEHICLE_FAILURE:
      return Object.assign({},state, {deleteVehicleError:{error:action.error,errorTime:new Date()}})

    default:
      return state;
  }
}

export default manageVehiclesReducer;
