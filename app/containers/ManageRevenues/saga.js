import { take, takeEvery,call, put, select } from 'redux-saga/effects';
import {apiCallHandler, apis, apiTypes} from "../../../apiCallHandler";
import * as CONSTANTS from "../ManageRevenues/constants";

export function* handleCreateRevenueRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.CREATE_REVENUE_SUCCESS, CONSTANTS.CREATE_REVENUE_FAILURE, apis.REVENUE_APIS_BASE_URL,apiTypes.CREATE)];
}
export function* watchCreateRevenueRequest() {
  yield takeEvery(CONSTANTS.CREATE_REVENUE,handleCreateRevenueRequest)
}

export function* handleGetRevenueRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.GET_REVENUES_SUCCESS, CONSTANTS.GET_REVENUES_FAILURE, apis.REVENUE_APIS_BASE_URL,apiTypes.GET_ALL)];
}
export function* watchGetRevenueRequest() {
  yield takeEvery(CONSTANTS.GET_REVENUES,handleGetRevenueRequest)
}

export function* handleGetRevenueByIdRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.GET_REVENUE_BY_ID_SUCCESS, CONSTANTS.GET_REVENUE_BY_ID_FAILURE, apis.REVENUE_APIS_BASE_URL,apiTypes.GET_BY_ID)];
}
export function* watchGetRevenueByIdRequest() {
  yield takeEvery(CONSTANTS.GET_REVENUE_BY_ID,handleGetRevenueByIdRequest)
}

export function* handleUpdateRevenueRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.UPDATE_REVENUE_SUCCESS, CONSTANTS.UPDATE_REVENUE_FAILURE, apis.REVENUE_APIS_BASE_URL,apiTypes.UPDATE_BY_ID)];
}
export function* watchUpdateRevenueRequest() {
  yield takeEvery(CONSTANTS.UPDATE_REVENUE,handleUpdateRevenueRequest)
}

export function* handleDeleteRevenueRequest(action) {
  yield [apiCallHandler(action, CONSTANTS.DELETE_REVENUE_SUCCESS, CONSTANTS.DELETE_REVENUE_FAILURE, apis.REVENUE_APIS_BASE_URL,apiTypes.DELETE_BY_ID)];
}
export function* watchDeleteRevenueRequest() {
  yield takeEvery(CONSTANTS.DELETE_REVENUE,handleDeleteRevenueRequest)
}
export default function* defaultSaga() {
 yield [
   watchCreateRevenueRequest(),
   watchGetRevenueRequest(),
   watchGetRevenueByIdRequest(),
   watchUpdateRevenueRequest(),
   watchDeleteRevenueRequest(),
 ]
}
