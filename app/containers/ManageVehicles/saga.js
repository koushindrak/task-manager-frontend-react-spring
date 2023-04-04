import { take, takeEvery,call, put, select } from 'redux-saga/effects';
import {apiCallHandler, apis, apiTypes} from "../../../apiCallHandler";
import * as CONSTANTS from "../ManageVehicles/constants";

export function* handleCreateVehicleRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.CREATE_VEHICLE_SUCCESS, CONSTANTS.CREATE_VEHICLE_FAILURE, apis.VEHICLE_APIS_BASE_URL,apiTypes.CREATE)];
}
export function* watchCreateVehicleRequest() {
  yield takeEvery(CONSTANTS.CREATE_VEHICLE,handleCreateVehicleRequest)
}

export function* handleGetVehicleRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.GET_VEHICLES_SUCCESS, CONSTANTS.GET_VEHICLES_FAILURE, apis.VEHICLE_APIS_BASE_URL,apiTypes.GET_ALL)];
}
export function* watchGetVehicleRequest() {
  yield takeEvery(CONSTANTS.GET_VEHICLES,handleGetVehicleRequest)
}
export function* handleGetParkingAreaRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.GET_PARKING_AREAS_SUCCESS, CONSTANTS.GET_PARKING_AREAS_FAILURE, apis.PARKING_AREA_APIS_BASE_URL,apiTypes.GET_ALL)];
}
export function* watchGetParkingAreasRequest() {
  yield takeEvery(CONSTANTS.GET_PARKING_AREAS,handleGetParkingAreaRequest)
}

export function* handleGetVehicleByIdRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.GET_VEHICLE_BY_ID_SUCCESS, CONSTANTS.GET_VEHICLE_BY_ID_FAILURE, apis.VEHICLE_APIS_BASE_URL,apiTypes.GET_BY_ID)];
}
export function* watchGetVehicleByIdRequest() {
  yield takeEvery(CONSTANTS.GET_VEHICLE_BY_ID,handleGetVehicleByIdRequest)
}

export function* handleUpdateVehicleRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.UPDATE_VEHICLE_SUCCESS, CONSTANTS.UPDATE_VEHICLE_FAILURE, apis.VEHICLE_APIS_BASE_URL,apiTypes.UPDATE_BY_ID)];
}
export function* watchUpdateVehicleRequest() {
  yield takeEvery(CONSTANTS.UPDATE_VEHICLE,handleUpdateVehicleRequest)
}

export function* handleDeleteVehicleRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.DELETE_VEHICLE_SUCCESS, CONSTANTS.DELETE_VEHICLE_FAILURE, apis.VEHICLE_APIS_BASE_URL,apiTypes.DELETE_BY_ID)];
}
export function* watchDeleteVehicleRequest() {
  yield takeEvery(CONSTANTS.DELETE_VEHICLE,handleDeleteVehicleRequest)
}
export default function* defaultSaga() {
  yield [
    watchCreateVehicleRequest(),
    watchGetVehicleRequest(),
    watchGetParkingAreasRequest(),
    watchGetVehicleByIdRequest(),
    watchUpdateVehicleRequest(),
    watchDeleteVehicleRequest(),
  ]
}
