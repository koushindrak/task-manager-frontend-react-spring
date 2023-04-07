/**
 *
 * ManageTasks
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
export class ManageTasks extends React.Component {
  state = {
    tasks: [],
    payload: payload,
    selectedTaskId: '',
    selectedTaskData: {},
    isEditTask: false,
    isAddTask: false,
    openNotificationModal: false,
    type: '',
    message: '',
    modal: false


  }
  componentDidMount() {
    console.log("this.props--",this.props)
    // this.props.getTasks();
  }

  columns = [
    {
      Header: 'Name',
      accessor:'Name',
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
      Header: 'Due Date',
      accessor: 'dueDate',
      filterable: false,
      style: { textAlign: "center" },
    },
    {
      Header: 'Created At',
      Cell: row => (<span>{new Date(row.original.createdAt).toLocaleString('en-US')}</span>),
      filterable: false,
      style: { textAlign: "center" },
    },
    {
      Header: 'Group Name',
      accessor: 'groupName',
      filterable: true,
      style: { textAlign: "center" },
    },
    {
      Header: 'Project Name',
      accessor: 'projectName',
      filterable: true,
      style: { textAlign: "center" },
    },
    {
      Header: 'Labels',
      Cell: row => (<span>{row.original.labels.toString()}</span>),
      filterable: true,
      style: { textAlign: "center" },
    },
    {
      Header: 'Actions',
      Cell: row => {
        return (
          <div>
            <button data-tip data-for={"edit" + row.original.id} onClick={()=>{
              this.setState({ selectedTaskId: row.original.id, addOrEditIsFetching: true, isEditTask:true });
              this.props.getTasksById(row.original.id)
            }}>
              <FontAwesomeIcon icon={faPen} />
            </button>
            <ReactTooltip id={"edit" + row.original.id} place="bottom" type="dark">
              <div className="tooltipText"><p>Edit</p></div>
            </ReactTooltip>

            <button data-tip data-for={"delete" + row.original.id} onClick={() => {
              this.setState({ selectedTaskId: row.original.id });
              this.props.deleteTask(row.original.id)
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
    this.createTaskListener(nextProps);
    this.getTasksListener(nextProps);
    this.getTasksByIdListener(nextProps);
    this.updateTaskListener(nextProps);
    this.deleteTaskListener(nextProps);
  }

  createTaskListener(nextProps) {
    if(commonUtils.compare(nextProps.createTaskSuccess,this.props.createTaskSuccess)){
      this.props.getTasks()
      this.manageNotificationModal(true, nextProps.createTaskSuccess.message, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.createTaskFailure,this.props.createTaskFailure)){
      this.manageNotificationModal(true, nextProps.createTaskFailure.error, "danger")
    }
  }

  getTasksListener(nextProps) {
    if(commonUtils.compare(nextProps.getTasksSuccess,this.props.getTasksSuccess)){
      this.setState({tasks: nextProps.getTasksSuccess.data})
    }
    if(commonUtils.compare(nextProps.getTasksFailure,this.props.getTasksFailure)){
      this.manageNotificationModal(true, nextProps.getTasksFailure.error, "danger")
    }
  }

  getTasksByIdListener(nextProps){
    if(commonUtils.compare(nextProps.getTasksByIdSuccess,this.props.getTasksByIdSuccess)){
      this.setState({selectedTaskData: nextProps.getTasksByIdSuccess.data},()=>{
        if(this.state.isEditTask){

          this.setState({payload:nextProps.getTasksByIdSuccess.data},()=>{
            $('#myModal').css({ display: "block" })
          })
        }
      })
    }
    if(commonUtils.compare(nextProps.getTasksByIdFailure,this.props.getTasksByIdFailure)){
      this.manageNotificationModal(true, nextProps.getTasksByIdFailure.error, "danger")
    }
  }

  updateTaskListener(nextProps) {
    if(commonUtils.compare(nextProps.updateTaskSuccess,this.props.updateTaskSuccess)){
      this.props.getTasks()
      this.manageNotificationModal(true, nextProps.updateTaskSuccess.message, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.updateTaskFailure,this.props.updateTaskFailure)){
      this.manageNotificationModal(true, nextProps.updateTaskFailure.error, "danger")
    }
  }

  deleteTaskListener(nextProps) {
    if(commonUtils.compare(nextProps.deleteTaskSuccess,this.props.deleteTaskSuccess)){
      this.props.getTasks()
      this.manageNotificationModal(true, nextProps.deleteTaskSuccess.message, "success")
    }
    if(commonUtils.compare(nextProps.deleteTaskFailure,this.props.deleteTaskFailure)){
      this.manageNotificationModal(true, nextProps.deleteTaskFailure.error, "danger")
    }
  }

  manageNotificationModal(isOpen,message,type) {
    this.setState({openNotificationModal: isOpen, message:message, type: type})
  }

  addOnClickHandler = event => {
    this.props.getTasks();
    $('#myModal').css({ display: "block" })
    this.setState({ modal: true, payload })
  }

  addOrEditSubmitHandler = event => {
    event.preventDefault();
    let payload = this.state.payload;
    if(this.state.isEditTask){
      payload.id=this.state.selectedTaskId;
      this.props.updateTask(payload);
    }else {
      this.props.createTask(payload);
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

                <p><span>Manage Tasks</span></p>
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
              data={this.state.tasks}
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
                  {this.state.isEditTask ? <p>Edit Task</p> : <p> Add Task</p>}
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
                    <label form="vehicleType"> Project Type : </label>
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

ManageTasks.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  createTaskSuccess: SELECTORS.createTaskSuccess(),
  createTaskFailure: SELECTORS.createTaskFailure(),

  getTasksSuccess: SELECTORS.getTaskSuccess(),
  getTasksFailure: SELECTORS.getTaskFailure(),

  getTasksByIdSuccess: SELECTORS.getTaskByIdSuccess(),
  getTasksByIdFailure: SELECTORS.getTaskByIdFailure(),

  updateTaskSuccess: SELECTORS.updateTaskSuccess(),
  updateTaskFailure: SELECTORS.updateTaskFailure(),

  deleteTaskSuccess: SELECTORS.deleteTaskSuccess(),
  deleteTaskFailure: SELECTORS.deleteTaskFailure()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    createTask : payload => dispatch(ACTIONS.createTask(payload)),
    getTasks: () => dispatch(ACTIONS.getTasks()),
    getTasksById: id => dispatch(ACTIONS.getTaskById(id)),
    updateTask: (payload) => dispatch(ACTIONS.updateTask(payload)),
    deleteTask: id => dispatch(ACTIONS.deleteTask(id))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'manageTasks', reducer });
const withSaga = injectSaga({ key: 'manageTasks', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ManageTasks);
