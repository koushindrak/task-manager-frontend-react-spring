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
import * as commonUtils from '../../common-files/commonUtils'



const defaultButton = props => (
  <button type="button" {...props} >
    {props.children}
  </button>
)
const statusColumn = {
  Header: 'Status',
  accessor: 'status',
  filterable: true,
  filterMethod: (filter, row) => {
    const value = row[filter.id] ?  row[filter.id].toLowerCase() : ""; // Convert data value to lowercase
    const filterValue = filter.value.toLowerCase(); // Convert filter value to lowercase
    return value.includes(filterValue); // Perform case-insensitive comparison
  },
  style: { textAlign: "center" },
  Cell: row => (
    <div
      style={{
        backgroundColor: getStatusColor(row.value),
        padding: '10px', // Decreased padding for a sleeker look
        borderRadius: '4px', // Added border radius for a rounded look
        color: '#fff', // Set text color to white for better contrast
        fontWeight: 'bold', // Increased font weight for emphasis
        textTransform: 'capitalize', // Capitalize the text for proper case
        transition: 'background-color 0.2s ease-in-out', // Smooth transition for color change
        display: 'flex', // Use flexbox for centering text vertically
        justifyContent: 'center', // Center align text horizontally
        alignItems: 'center', // Center align text vertically
        border: 'none',
        boxShadow: '2px 2px 1px rgba(0,0,0,0.1)', // Added subtle box shadow for depth
      }}
    >
      {row.value}
    </div>
  )
};

// Function to get status color based on task status
const getStatusColor = (status) => {
  switch (status) {
    case 'TODO':
      return '#e7c45b'; // Set the background color for "todo" status
    case 'INPROGRESS':
      return '#3d88d7'; // Set the background color for "inprogress" status
    case 'DONE':
      return '#28a745'; // Set the background color for "done" status
    default:
      return 'transparent'; // Set default background color
  }
};
let dueDateOld;
let payload = {
  id: '',
  name: '',
  description: "",
  dueDate: Date.now() + 24*60*60*1000,
  status:'TODO',
  labels: '',
  // "comments": null,
  priority: "MEDIUM",
  // "groupId": null,
  groupName: '',
  // "projectId": null,
  projectName: ''
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
    this.props.getAllTasks();
  }

  columns = [
    {
      Header: 'Name',
      accessor:'name',
      filterable: true,
      filterMethod: (filter, row) => {
        const value = row[filter.id] ?  row[filter.id].toLowerCase() : ""; // Convert data value to lowercase
        const filterValue = filter.value.toLowerCase(); // Convert filter value to lowercase
        return value.includes(filterValue); // Perform case-insensitive comparison
      },
      style: { textAlign: "center" }
    },
    {
      Header: 'Description',
      accessor: 'description',
      filterable: true,
      filterMethod: (filter, row) => {
        const value = row[filter.id] ?  row[filter.id].toLowerCase() : ""; // Convert data value to lowercase
        const filterValue = filter.value.toLowerCase(); // Convert filter value to lowercase
        return value.includes(filterValue); // Perform case-insensitive comparison
      },
      style: { textAlign: "center" }
    },
    {
      Header: 'Due Date',
      Cell: row => (<span>{new Date(row.original.dueDate).toLocaleString('en-US')}</span>),
      filterable: false,
      style: { textAlign: "center" },
    },
    {
      Header: 'Project Name',
      accessor: 'projectName',
      Filter: ({ filter, onChange }) => (
        <input
          type="text"
          placeholder="Search Project name" // Placeholder text
          value={filter ? filter.value : ''}
          onChange={event => onChange(event.target.value)}
          style={{ width: '100%' }} // Adjust the width as needed
        />
      ),
      filterable: true,
      filterMethod: (filter, row) => {
        const value = row[filter.id] ?  row[filter.id].toLowerCase() : ""; // Convert data value to lowercase
        const filterValue = filter.value.toLowerCase(); // Convert filter value to lowercase
        return value.includes(filterValue); // Perform case-insensitive comparison
      },
      style: { textAlign: "center" },
    },
    {
      Header: 'Labels',
      Cell: row => (<span>{row.original.labels.map(label => label.labelName).join(', ')}</span>),
      filterable: false,
      style: { textAlign: 'center' },
    },

    statusColumn,
    {
      Header: 'Actions',
      Cell: row => {
        return (
          <div>
            <button data-tip data-for={"edit" + row.original.id} onClick={()=>{
              this.setState({ selectedTaskId: row.original.id, addOrEditIsFetching: true, isEditTask:true });
              this.props.getAllTasksById(row.original.id)
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
    this.getAllTasksListener(nextProps);
    this.getAllTasksByIdListener(nextProps);
    this.updateTaskListener(nextProps);
    this.deleteTaskListener(nextProps);
  }

  createTaskListener(nextProps) {
    if(commonUtils.compare(nextProps.createTaskSuccess,this.props.createTaskSuccess)){
      this.props.getAllTasks()
      console.log("nextProps.createTaskSuccess----",nextProps.createTaskSuccess)
      this.manageNotificationModal(true, nextProps.createTaskSuccess.displayMessage, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.createTaskFailure,this.props.createTaskFailure)){
      console.log("this.props.createTaskFailure---",nextProps.createTaskFailure)
      this.manageNotificationModal(true, nextProps.createTaskFailure.error, "danger")
    }
  }

  getAllTasksListener(nextProps) {
    if(commonUtils.compare(nextProps.getAllTasksSuccess,this.props.getAllTasksSuccess)){
      this.setState({tasks: nextProps.getAllTasksSuccess.data})
    }
    if(commonUtils.compare(nextProps.getAllTasksFailure,this.props.getAllTasksFailure)){
      this.manageNotificationModal(true, nextProps.getAllTasksFailure.error, "danger")
    }
  }

  getAllTasksByIdListener(nextProps){
    if(commonUtils.compare(nextProps.getAllTasksByIdSuccess,this.props.getAllTasksByIdSuccess)){
      this.setState({selectedTaskData: nextProps.getAllTasksByIdSuccess.data},()=>{
        if(this.state.isEditTask){

          this.setState({payload:nextProps.getAllTasksByIdSuccess.data},()=>{
            $('#myModal').css({ display: "block" })
          })
        }
      })
    }
    if(commonUtils.compare(nextProps.getAllTasksByIdFailure,this.props.getAllTasksByIdFailure)){
      this.manageNotificationModal(true, nextProps.getAllTasksByIdFailure.error, "danger")
    }
  }

  updateTaskListener(nextProps) {
    if(commonUtils.compare(nextProps.updateTaskSuccess,this.props.updateTaskSuccess)){
      this.props.getAllTasks()
      this.manageNotificationModal(true, nextProps.updateTaskSuccess.displayMessage, "success")
      $('#myModal').css({display: "none"})

    }
    if(commonUtils.compare(nextProps.updateTaskFailure,this.props.updateTaskFailure)){
      this.manageNotificationModal(true, nextProps.updateTaskFailure.error, "danger")
    }
  }

  deleteTaskListener(nextProps) {
    if(commonUtils.compare(nextProps.deleteTaskSuccess,this.props.deleteTaskSuccess)){
      this.props.getAllTasks()
      this.manageNotificationModal(true, nextProps.deleteTaskSuccess.displayMessage, "success")
    }
    if(commonUtils.compare(nextProps.deleteTaskFailure,this.props.deleteTaskFailure)){
      this.manageNotificationModal(true, nextProps.deleteTaskFailure.error, "danger")
    }
  }

  manageNotificationModal(isOpen,message,type) {
    this.setState({openNotificationModal: isOpen, message:message, type: type})
  }

  addOnClickHandler = event => {
    this.props.getAllTasks();
    $('#myModal').css({ display: "block" })
    this.setState({ modal: true, payload })
  }

  addOrEditSubmitHandler = event => {
    console.log("addOrEditSubmitHandler-payload",this.state.payload)

    event.preventDefault();
    let payload = this.state.payload;
    if(this.state.isEditTask){
      console.log("payload--",payload)
      payload.id=this.state.selectedTaskId;
      payload.dueDate =  Date.parse(payload.dueDate)
      this.props.updateTask(payload);
    }else {
      console.log("dueDate---",payload.dueDate)
      payload.dueDate =  Date.parse(payload.dueDate)
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
  convertDueDateToDateTimeLocal = () => {
    const milliseconds = this.state.payload.dueDate;
    if (milliseconds !== undefined) { // Add this check
      return this.getDateTimeLocal(milliseconds);
    }
    return ''; // or return a default value if dueDate is undefined
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
                    <label htmlFor="name">Task Name :</label>
                    <input type="text" id="name" autoComplete="on" value={this.state.payload.name}
                           className="form-control" placeholder="Task Name" required onChange={this.onChangeHandler}/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description :</label>
                    <input type="text" id="description" autoComplete="on" value={this.state.payload.description}
                           className="form-control" placeholder="Task Description :"  onChange={this.onChangeHandler}/>
                  </div>


                  <div className="form-group">
                    <label htmlFor="dueDate">Task Due Date :</label>
                    <input type="datetime-local" id="dueDate" autoComplete="on"
                           value={this.convertDueDateToDateTimeLocal()}
                           className="form-control" placeholder="Task Due Date"
                           required onChange={this.onChangeHandler}/>
                  </div>

                  <div className="form-group">
                    <label form="status"> Task Status : </label>
                    <select name="status" id="status" value={this.state.payload.status} required onChange={this.onChangeHandler}>
                      <option key="TODO" value="TODO">TODO</option>)
                      <option key="INPROGRESS" value="INPROGRESS">IN PROGRESS</option>)
                      <option key="DONE" value="DONE">DONE</option>)
                    </select>
                  </div>
                  <div className="form-group">
                    <label form="priority"> Task Priority : </label>
                    <select name="priority" id="priority" value={this.state.payload.priority} required onChange={this.onChangeHandler}>
                      <option key="HIGH" value="HIGH">HIGH</option>)
                      <option key="MEDIUM" value="MEDIUM">MEDIUM</option>)
                      <option key="LOW" value="LOW">LOW</option>)
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

  getAllTasksSuccess: SELECTORS.getTaskSuccess(),
  getAllTasksFailure: SELECTORS.getTaskFailure(),

  getAllTasksByIdSuccess: SELECTORS.getTaskByIdSuccess(),
  getAllTasksByIdFailure: SELECTORS.getTaskByIdFailure(),

  updateTaskSuccess: SELECTORS.updateTaskSuccess(),
  updateTaskFailure: SELECTORS.updateTaskFailure(),

  deleteTaskSuccess: SELECTORS.deleteTaskSuccess(),
  deleteTaskFailure: SELECTORS.deleteTaskFailure()
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    createTask : payload => dispatch(ACTIONS.createTask(payload)),
    getAllTasks: () => dispatch(ACTIONS.getAllTasks()),
    getAllTasksById: id => dispatch(ACTIONS.getTaskById(id)),
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
