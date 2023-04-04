/**
 *
 * ManageRevenues
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
  hours: '',
  amount: '',
  vehicleType: '',
}
export class ManageRevenues extends React.Component {
  state = {
    revenues: [],
    payload: payload,
    selectedRevenueId: '',
    selectedRevenueData: {},
    isEditRevenue: false,
    isAddRevenue: false,
    openNotificationModal: false,
    type: '',
    message: '',
    modal: false
  }
  componentDidMount() {
    this.props.getRevenues();
  }

  columns = [
    {
      Header: 'Hours',
      accessor:'hours',
      filterable: true,
      style: { textAlign: "center" }
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      filterable: true,
      style: { textAlign: "center" }
    },
    {
      Header: 'Vehicle Type',
      accessor: 'vehicleType',
      filterable: true,
      style: { textAlign: "center" },
    },
    {
      Header: 'Create At',
      Cell: row => (<span>{new Date(row.original.createdAt).toLocaleString('en-US')}</span>),
      filterable: false,
      style: { textAlign: "center" },
    },
    {
      Header: 'Actions',
      Cell: row => {
        return (
          <div>
            <button data-tip data-for={"edit" + row.original.id} onClick={()=>{
              this.setState({ selectedRevenueId: row.original.id, addOrEditIsFetching: true, isEditRevenue:true });
              this.props.getRevenuesById(row.original.id)
            }}>
              <FontAwesomeIcon icon={faPen} />
            </button>
            <ReactTooltip id={"edit" + row.original.id} place="bottom" type="dark">
              <div className="tooltipText"><p>Edit</p></div>
            </ReactTooltip>

            <button data-tip data-for={"delete" + row.original.id} onClick={() => {
              this.setState({ selectedRevenueId: row.original.id });
              this.props.deleteRevenue(row.original.id)
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
    this.createRevenueListener(nextProps);
    this.getRevenuesListener(nextProps);
    this.getRevenuesByIdListener(nextProps);
    this.updateRevenueListener(nextProps);
    this.deleteRevenueListener(nextProps);
  }

  createRevenueListener(nextProps) {
    if(commonUtils.compare(nextProps.createRevenueSuccess,this.props.createRevenueSuccess)){
      this.props.getRevenues()
      this.manageNotificationModal(true, nextProps.createRevenueSuccess.message, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.createRevenueFailure,this.props.createRevenueFailure)){
      this.manageNotificationModal(true, nextProps.createRevenueFailure.error, "danger")
    }
  }

  getRevenuesListener(nextProps) {
    if(commonUtils.compare(nextProps.getRevenuesSuccess,this.props.getRevenuesSuccess)){
      this.setState({revenues: nextProps.getRevenuesSuccess.data})
    }
    if(commonUtils.compare(nextProps.getRevenuesFailure,this.props.getRevenuesFailure)){
      this.manageNotificationModal(true, nextProps.getRevenuesFailure.error, "danger")
    }
  }

  getRevenuesByIdListener(nextProps){
    if(commonUtils.compare(nextProps.getRevenuesByIdSuccess,this.props.getRevenuesByIdSuccess)){
      this.setState({selectedRevenueData: nextProps.getRevenuesByIdSuccess.data},()=>{
        if(this.state.isEditRevenue){

          this.setState({payload:nextProps.getRevenuesByIdSuccess.data},()=>{
            $('#myModal').css({ display: "block" })
          })
        }
      })
    }
    if(commonUtils.compare(nextProps.getRevenuesByIdFailure,this.props.getRevenuesByIdFailure)){
      this.manageNotificationModal(true, nextProps.getRevenuesByIdFailure.error, "danger")
    }
  }

  updateRevenueListener(nextProps) {
    if(commonUtils.compare(nextProps.updateRevenueSuccess,this.props.updateRevenueSuccess)){
      this.props.getRevenues()
      this.manageNotificationModal(true, nextProps.updateRevenueSuccess.message, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.updateRevenueFailure,this.props.updateRevenueFailure)){
      this.manageNotificationModal(true, nextProps.updateRevenueFailure.error, "danger")
    }
  }

  deleteRevenueListener(nextProps) {
    if(commonUtils.compare(nextProps.deleteRevenueSuccess,this.props.deleteRevenueSuccess)){
      this.props.getRevenues()
      this.manageNotificationModal(true, nextProps.deleteRevenueSuccess.message, "success")
    }
    if(commonUtils.compare(nextProps.deleteRevenueFailure,this.props.deleteRevenueFailure)){
      this.manageNotificationModal(true, nextProps.deleteRevenueFailure.error, "danger")
    }
  }

  manageNotificationModal(isOpen,message,type) {
    this.setState({openNotificationModal: isOpen, message:message, type: type})
  }

  addOnClickHandler = event => {
    this.props.getRevenues();
    $('#myModal').css({ display: "block" })
    this.setState({ modal: true, payload })
  }

  addOrEditSubmitHandler = event => {
    event.preventDefault();
    let payload = this.state.payload;
    if(this.state.isEditRevenue){
      payload.id=this.state.selectedRevenueId;
      this.props.updateRevenue(payload);
    }else {
      this.props.createRevenue(payload);
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
  render() {
    return (
      <div>
        <React.Fragment >
          <div className="contentHeader">
            <div className="row">
              <div className="col-8">

                <p><span>Manage Revenues</span></p>
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
              data={this.state.revenues}
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
                  {this.state.isEditRevenue ? <p>Edit Revenue</p> : <p> Add Revenue</p>}
                </div>
                <div className="customModal-body">

                  <div className="form-group">
                    <label form="hours"> Hours : </label>
                    <select name="hours" id="hours" value={this.state.payload.hours} required onChange={this.onChangeHandler}>
                      <option key="LESS_THAN_2_HOURS" value="LESS_THAN_2_HOURS">Less than 2 hours</option>)
                      <option key="LESS_THAN_12_HOURS" value="LESS_THAN_12_HOURS">Less than 12 hours</option>)
                      <option key="GREATER_THAN_12_HOURS" value="GREATER_THAN_12_HOURS">Greater than 12 hours</option>)
                      </select>
                  </div>

                  <div className="form-group">
                    <label for="amount">Amount :</label>
                    <input type="text" id="amount" autoComplete="off" value={this.state.payload.amount} className="form-control" placeholder="Amount" required onChange={this.onChangeHandler} />
                  </div>

                  <div className="form-group">
                    <label form="vehicleType"> Vehicle Type : </label>
                    <select name="vehicleType" id="vehicleType" value={this.state.payload.vehicleType} required onChange={this.onChangeHandler}>
                      <option key="CAR" value="CAR">Car</option>)
                      <option key="BIKE" value="BIKE">Bike</option>)
                      <option key="BICYCLE" value="BICYCLE">Bicycle</option>)
                    </select>
                  </div>
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

ManageRevenues.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createRevenueSuccess: SELECTORS.createRevenueSuccess(),
  createRevenueFailure: SELECTORS.createRevenueFailure(),

  getRevenuesSuccess: SELECTORS.getRevenueSuccess(),
  getRevenuesFailure: SELECTORS.getRevenueFailure(),

  getRevenuesByIdSuccess: SELECTORS.getRevenueByIdSuccess(),
  getRevenuesByIdFailure: SELECTORS.getRevenueByIdFailure(),

  updateRevenueSuccess: SELECTORS.updateRevenueSuccess(),
  updateRevenueFailure: SELECTORS.updateRevenueFailure(),

  deleteRevenueSuccess: SELECTORS.deleteRevenueSuccess(),
  deleteRevenueFailure: SELECTORS.deleteRevenueFailure()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    createRevenue : payload => dispatch(ACTIONS.createRevenue(payload)),
    getRevenues: () => dispatch(ACTIONS.getRevenues()),
    getRevenuesById: id => dispatch(ACTIONS.getRevenueById(id)),
    updateRevenue: (payload) => dispatch(ACTIONS.updateRevenue(payload)),
    deleteRevenue: id => dispatch(ACTIONS.deleteRevenue(id))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'manageRevenues', reducer });
const withSaga = injectSaga({ key: 'manageRevenues', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageRevenues);
