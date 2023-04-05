/**
 *
 * Vehicles
 *
 */
/**
 *
 * ManageVehicles
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {compose} from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import * as SELECTORS from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as ACTIONS from './actions';
import ReactTable from "react-table";
import ReactTooltip from "react-tooltip";
import 'react-table/react-table.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import NotificationModal from '../../components/NotificationModal/Loadable'
import * as commonUtils from '../../../commonUtils'

const defaultButton = props => (
  <button type="button" {...props} >
    {props.children}
  </button>
)
let payload = {
  vehicleNo: 0,
  vehicleType: '',
  parkingAreaId:'',
}
export class ManageVehicles extends React.Component {
  state = {
    vehicles: [],
    parkingAreas: [],
    payload: payload,
    selectedVehicleId: '',
    selectedVehicleData: {},
    isEditVehicle: false,
    isAddVehicle: false,
    openNotificationModal: false,
    type: '',
    message: '',
    modal: false
  }
  componentDidMount() {

    this.props.getVehicles();
  }

  columns = [
    {
      Header: 'Name',
      accessor:'name',
      filterable: true,
      style: { textAlign: "center" }
    },
    {
      Header: 'Description',
      accessor: 'description',
      filterable: true,
      style: { textAlign: "center" }
    },
    {
      Header: 'Start Date',
      Cell: row => (<span>{new Date(row.original.startDate).toLocaleString('en-US')}</span>),
      accessor: 'startDate',
      filterable: true,
      style: { textAlign: "center" },
    },
    // {
    //   Header: 'Parking Area GPS Coordinates',
    //   Cell: row => (<span>{row.original.lat + "," + row.original.lng}</span>),
    //   filterable: true,
    //   style: { textAlign: "center" },
    // },
    {
      Header: 'End Date',
      Cell: row => (<span>{new Date(row.original.endDate).toLocaleString('en-US')}</span>),
      filterable: false,
      style: { textAlign: "center" },
    },
    {
      Header: 'Actions',
      Cell: row => {
        return (
          <div>
            <button data-tip data-for={"edit" + row.original.id} onClick={()=>{
              this.setState({ selectedVehicleId: row.original.id, addOrEditIsFetching: true, isEditVehicle:true });
              this.props.getVehiclesById(row.original.id)
            }}>
              <FontAwesomeIcon icon={faPen} />
            </button>
            <ReactTooltip id={"edit" + row.original.id} place="bottom" type="dark">
              <div className="tooltipText"><p>Edit</p></div>
            </ReactTooltip>

            <button data-tip data-for={"delete" + row.original.id} onClick={() => {
              this.setState({ selectedVehicleId: row.original.id });
              this.props.deleteVehicle(row.original.id)
            }}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <ReactTooltip id={"delete" + row.original.id} place="bottom" type="dark">
              <div className="tooltipText"><p>Delete</p></div>
            </ReactTooltip>
          </div>
        )
      }
    }
  ];


  componentWillReceiveProps(nextProps, nextContext) {
    this.createVehicleListener(nextProps);
    this.getVehiclesListener(nextProps);
    this.getParkingAreasListener(nextProps);
    this.getVehiclesByIdListener(nextProps);
    this.updateVehicleListener(nextProps);
    this.deleteVehicleListener(nextProps);
  }

  createVehicleListener(nextProps) {
    if(commonUtils.compare(nextProps.createVehicleSuccess,this.props.createVehicleSuccess)){
      this.props.getVehicles()
      this.manageNotificationModal(true, nextProps.createVehicleSuccess.message, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.createVehicleFailure,this.props.createVehicleFailure)){
      this.manageNotificationModal(true, nextProps.createVehicleFailure.error, "danger")
    }
  }

  getVehiclesListener(nextProps) {
    if(commonUtils.compare(nextProps.getVehiclesSuccess,this.props.getVehiclesSuccess)){
      this.setState({vehicles: nextProps.getVehiclesSuccess.data})
    }
    if(commonUtils.compare(nextProps.getVehiclesFailure,this.props.getVehiclesFailure)){
      this.manageNotificationModal(true, nextProps.getVehiclesFailure.error, "danger")
    }
  }

  getParkingAreasListener(nextProps) {
    if(commonUtils.compare(nextProps.getParkingAreasSuccess,this.props.getParkingAreasSuccess)){
      this.setState({parkingAreas: nextProps.getParkingAreasSuccess.data})
    }
    if(commonUtils.compare(nextProps.getParkingAreasFailure,this.props.getParkingAreasFailure)){
      this.manageNotificationModal(true, nextProps.getParkingAreasFailure.error, "danger")
    }
  }

  getVehiclesByIdListener(nextProps){
    if(commonUtils.compare(nextProps.getVehiclesByIdSuccess,this.props.getVehiclesByIdSuccess)){
      this.setState({selectedVehicleData: nextProps.getVehiclesByIdSuccess.data},()=>{
        if(this.state.isEditVehicle){

          this.setState({payload:nextProps.getVehiclesByIdSuccess.data},()=>{
            $('#myModal').css({ display: "block" })
          })
        }
      })
    }
    if(commonUtils.compare(nextProps.getVehiclesByIdFailure,this.props.getVehiclesByIdFailure)){
      this.manageNotificationModal(true, nextProps.getVehiclesByIdFailure.error, "danger")
    }
  }

  updateVehicleListener(nextProps) {
    if(commonUtils.compare(nextProps.updateVehicleSuccess,this.props.updateVehicleSuccess)){
      this.props.getVehicles()
      this.manageNotificationModal(true, nextProps.updateVehicleSuccess.message, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.updateVehicleFailure,this.props.updateVehicleFailure)){
      this.manageNotificationModal(true, nextProps.updateVehicleFailure.error, "danger")
    }
  }

  deleteVehicleListener(nextProps) {
    if(commonUtils.compare(nextProps.deleteVehicleSuccess,this.props.deleteVehicleSuccess)){
      this.props.getVehicles()
      this.manageNotificationModal(true, nextProps.deleteVehicleSuccess.message, "success")
    }
    if(commonUtils.compare(nextProps.deleteVehicleFailure,this.props.deleteVehicleFailure)){
      this.manageNotificationModal(true, nextProps.deleteVehicleFailure.error, "danger")
    }
  }

  manageNotificationModal(isOpen,message,type) {
    this.setState({openNotificationModal: isOpen, message:message, type: type})
  }

  addOnClickHandler = event => {
    this.props.getVehicles();
    this.props.getParkingAreas();
    $('#myModal').css({ display: "block" })
    this.setState({ modal: true, payload })
  }

  addOrEditSubmitHandler = event => {
    event.preventDefault();
    let payload = this.state.payload;
    if(this.state.isEditVehicle){
      payload.id=this.state.selectedVehicleId;
      payload.startDate = Date.parse(payload.startDate)
      payload.endDate = Date.parse(payload.endDate)
      this.props.updateVehicle(payload);
    }else {
      this.props.createVehicle(payload);
    }
  }
  onCloseHandler = (index) => {
    this.setState({
      openNotificationModal: false,
      message: ''
    })
  }
  onChangeHandler = event => {
    let payload = { ...this.state.payload }
    payload[event.currentTarget.id] = event.currentTarget.value;
    this.setState({ payload })
  }

  convertStartDateToDateTimeLocal = event => {
    const milliseconds =this.state.payload.startDate; // Example milliseconds value
    return this.getDateTimeLocal(milliseconds);
  }

  convertEndDateToDateTimeLocal = event => {
    const milliseconds =this.state.payload.endDate; // Example milliseconds value
    return this.getDateTimeLocal(milliseconds);
  }

  getDateTimeLocal(milliseconds) {
    const date = new Date(milliseconds);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
    return datetimeLocal
  }

  render() {
    return (
      <div>
        <React.Fragment >
          <div className="contentHeader">
            <div className="row">
              <div className="col-8">

                <p><span>Manage Vehicles</span></p>
              </div>
              <div className="col-4">
                <button className="addButton"
                        onClick={this.addOnClickHandler}> <span>&#43;</span>
                </button>
              </div>
            </div>

          </div>
          <div className="contentContainer">
            <ReactTable
              data={this.state.vehicles}
              columns={this.columns}
              defaultPageSize={10}
              noDataText={"No Data Found"}
              className="customReactTable"
              PreviousComponent={defaultButton}
              NextComponent={defaultButton}
            />
          </div>

          <div id="myModal" className="customModal">
            <form onSubmit={this.addOrEditSubmitHandler}>
              <div className="customModal-content">
                <div className="customModal-header">
                  <span className="close mr-r-10" onClick={() => $('#myModal').css({ display: "none" })}>&times;</span>
                  <button className="close">&#10003;</button>
                  {this.state.isEditVehicle ? <p>Edit Project</p> : <p> Add Project</p>}
                </div>
                <div className="customModal-body">

                  <div className="form-group">
                    <label htmlFor="name">Project Name :</label>
                    <input type="text" id="name" autoComplete="off" value={this.state.payload.name} className="form-control" placeholder="Project Name"
                           required onChange={this.onChangeHandler}/>
                  </div>

                  <div className="form-group">
                    <label form="description"> Project Description : </label>
                    <input type="text" id="description" autoComplete="off" value={this.state.payload.description} className="form-control" placeholder="Project Description"
                           required onChange={this.onChangeHandler}/>
                    {/*<select name="description" id="description" value={this.state.payload.description} required onChange={this.onChangeHandler}>*/}
                    {/*  <option key="CAR" value="CAR">Car</option>)*/}
                    {/*  <option key="BIKE" value="BIKE">Bike</option>)*/}
                    {/*  <option key="BICYCLE" value="BICYCLE">Bicycle</option>)*/}
                    {/*</select>*/}
                  </div>

                  <div className="form-group">
                    <label htmlFor="startDate">Project Start Date :</label>
                    <input type="datetime-local" id="startDate" autoComplete="off"
                           value={this.convertStartDateToDateTimeLocal(this.state.payload.startDate)}
                           className="form-control" placeholder="Project Start Date"
                           required onChange={this.onChangeHandler}/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">Project End Date :</label>
                    <input type="datetime-local" id="endDate" autoComplete="off"
                           value={this.convertEndDateToDateTimeLocal(this.state.payload.endDate)}
                           className="form-control" placeholder="Project End Date"
                           required onChange={this.onChangeHandler}/>
                  </div>
                  <div className="form-group">
                    <label form="status"> Project Status : </label>
                    <select name="status" id="status" value={this.state.payload.status} required onChange={this.onChangeHandler}>
                      <option key="ACTIVE" value="ACTIVE">ACTIVE</option>)
                      <option key="INACTIVE" value="INACTIVE">INACTIVE</option>)
                    </select>
                  </div>
                  {/*<div className="form-group">*/}
                  {/*  <label> Parking Areas : </label>*/}
                  {/*  <select className="form-control" value={this.state.payload.parkingAreaId} name="parkingAreaId" id="parkingAreaId" required onChange={this.onChangeHandler}>*/}
                  {/*    <option value=""> select</option>*/}
                  {/*    {this.state.parkingAreas.map((type, index) => {*/}
                  {/*      return (<option key={index} value={type.id}>{type.id}</option>)*/}
                  {/*    })*/}
                  {/*    }*/}
                  {/*  </select>*/}
                  {/*</div>*/}
                </div>
              </div>
            </form>
          </div>
          {this.state.openNotificationModal &&
          <NotificationModal
            type={this.state.type}
            message={this.state.message}
            onCloseHandler={this.onCloseHandler}
          />
          }
        </React.Fragment>

      </div>
    );
  }
}

ManageVehicles.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createVehicleSuccess: SELECTORS.createVehicleSuccess(),
  createVehicleFailure: SELECTORS.createVehicleFailure(),

  getVehiclesSuccess: SELECTORS.getVehicleSuccess(),
  getVehiclesFailure: SELECTORS.getVehicleFailure(),

  getParkingAreasSuccess: SELECTORS.getParkingAreasSuccess(),
  getParkingAreasFailure: SELECTORS.getParkingAreasFailure(),

  getVehiclesByIdSuccess: SELECTORS.getVehicleByIdSuccess(),
  getVehiclesByIdFailure: SELECTORS.getVehicleByIdFailure(),

  updateVehicleSuccess: SELECTORS.updateVehicleSuccess(),
  updateVehicleFailure: SELECTORS.updateVehicleFailure(),

  deleteVehicleSuccess: SELECTORS.deleteVehicleSuccess(),
  deleteVehicleFailure: SELECTORS.deleteVehicleFailure()
});

function mapDispatchToProps(dispatch) {

  return {
    dispatch,
    createVehicle : payload => dispatch(ACTIONS.createVehicle(payload)),
    getVehicles: () => dispatch(ACTIONS.getVehicles()),
    getParkingAreas: () => dispatch(ACTIONS.getParkingAreas()),
    getVehiclesById: id => dispatch(ACTIONS.getVehicleById(id)),
    updateVehicle: (payload) => dispatch(ACTIONS.updateVehicle(payload)),
    deleteVehicle: id => dispatch(ACTIONS.deleteVehicle(id))
  };
}


const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'manageVehicles', reducer });
const withSaga = injectSaga({ key: 'manageVehicles', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageVehicles);
