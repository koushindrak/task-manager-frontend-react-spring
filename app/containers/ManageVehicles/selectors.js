import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the parkingAreas state domain
 */

const selectManageVehiclesDomain = state => state.get('manageVehicles', initialState);

export const createVehicleSuccess=()=> createSelector(selectManageVehiclesDomain,substate=>substate.createVehicleResponse)
export const createVehicleFailure=()=> createSelector(selectManageVehiclesDomain,substate=>substate.createVehicleError)

export const getVehicleSuccess=()=> createSelector(selectManageVehiclesDomain,substate=>substate.getVehicleResponse)
export const getVehicleFailure=()=> createSelector(selectManageVehiclesDomain,substate=>substate.getVehicleError)

export const getParkingAreasSuccess=()=> createSelector(selectManageVehiclesDomain,substate=>substate.getParkingAreasResponse)
export const getParkingAreasFailure=()=> createSelector(selectManageVehiclesDomain,substate=>substate.getParkingAreasFailure)

export const getVehicleByIdSuccess=()=> createSelector(selectManageVehiclesDomain,substate=>substate.getVehicleByIdResponse)
export const getVehicleByIdFailure=()=> createSelector(selectManageVehiclesDomain,substate=>substate.getVehicleByIdError)

export const updateVehicleSuccess=()=> createSelector(selectManageVehiclesDomain,substate=>substate.updateVehicleResponse)
export const updateVehicleFailure=()=> createSelector(selectManageVehiclesDomain,substate=>substate.updateVehicleError)

export const deleteVehicleSuccess=()=> createSelector(selectManageVehiclesDomain,substate=>substate.deleteVehicleResponse)
export const deleteVehicleFailure=()=> createSelector(selectManageVehiclesDomain,substate=>substate.deleteVehicleError)

export { selectManageVehiclesDomain };
