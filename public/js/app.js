/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/
/*Parent component, TimersDashboard*/
class TimersDashboard extends React.Component {
  state = {
    timers: [
      {
	title: 'Practice squat',
	project: 'Gym Chores',
	id: uuid.v4(),
	elapsed: 5456099,
	runningSince: Date.now(),
      },
      {
	title: 'Bake squash',
	project: 'Kitchen Chores',
	id: uuid.v4(),
	elapsed: 1273998,
	runningSince: null,
      },
    ],
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  };

  createTimer = (timer) => {
    const t = helpers.newTimer(timer);
    this.setState({
	timers: this.state.timers.concat(t),
    });
  };

  handleEditFormSubmit = (attrs) => {
    this.updateTimer(attrs)
  };

  handleDeleteClick = (timerId) => {
    this.deleteTimer(timerId);
  }

  deleteTimer = (timerId) => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });
  };

  updateTimer = (attrs) => {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === attrs.id) {
	  return Object.assign({}, timer, {
	    title: attrs.title,
	    project: attrs.project,
	  });
	} else {
	  return timer;
	}
      }),
    });
  };

  stopTimer = (timerId) => {
    const now = Date.now();
    this.setState({
      timers: this.state.timers.map((timer) => {
	if (timer.id === timerId) {
	  const lastElapsed = now - timer.runningSince;
	  return Object.assign({}, timer, {
	    elapsed: timer.elapsed + lastElapsed,
	    runningSince: null,
	  });
	} else {
	  return timer;
	}
      }),
    });
  };

  handleStopClick = (timerId) => {
    this.stopTimer(timerId); 
  };

  startTimer = (timerId) => {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
	if (timer.id === timerId) {
	  return Object.assign({}, timer, {
	    runningSince: now, 
	  });
	} else {
	  return timer;
	}
      }),
    });
  };

  handleStartClick = (timerId) => {
    this.startTimer(timerId); 
  };

  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList 
	    timers={this.state.timers}
	    onFormSubmit={this.handleEditFormSubmit}
	    onDeleteClick={this.handleDeleteClick}
	    onStopClick={this.handleStopClick}
	    onStartClick={this.handleStartClick}
	  />
          <ToggleableTimerForm 
	    onFormSubmit={this.handleCreateFormSubmit}
	  />
        </div>
      </div>
    );
  }
}

/*Child component EditableTimersList*/
class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
	key={timer.id}
	id={timer.id}
	title={timer.title}
	project={timer.project}
	elapsed={timer.elapsed}
	runningSince={timer.runningSince}
	onFormSubmit={this.props.onFormSubmit}
	onDeleteClick={this.props.onDeleteClick}
	onStartClick={this.props.onStartClick}
	onStopClick={this.props.onStopClick}
      />
    ));
    return (
      <div id='timers'>
        {timers}
      </div> 
    );
  }
}

class EditableTimer extends React.Component {
  state = {
    editFormOpen: false,
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.closeForm();
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    if (this.props.editFormOpen) {
      return (
        <TimerForm
	  id = {this.props.id}
          title = {this.props.title}
          project = {this.props.project} 
	  onFormSubmit={this.handleSubmit}
	  onFormClose={this.handleFormClose}
	  />
      );
    } else {
      return (
        <Timer
	  id = {this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
	  onEditClick={this.handleEditClick}
	  onDeleteClick={this.props.onDeleteClick} 
	  onStartClick={this.props.onStartClick}
	  onStopClick={this.props.onStopClick}
	/>
      );
    }
  }
}

class TimerForm extends React.Component {
  state = {
    title: this.props.title || '',
    project: this.props.project || '',
  };

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleProjectChange = (e) => {
    this.setState({ project: e.target.value });
  };

  handleSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.title,
      project: this.state.project,
    });
  };

  render() {
    const submitText = this.props.id ? 'Update' : 'Create';
    return (
      <div className='ui centered card'>
        <div className='content'>
         <div className='ui form'>
          <div className='field'>
            <label>Title</label>
            <input 
	      type='text' 
	      defaultValue={this.state.title} 
	      onChange={this.handleTitleChange}	
	      />
          </div>
          <div className='field'>
            <label>Project</label>
            <input 
	      type='text' 
	      defaultValue={this.state.project} 
	      onChange={this.handleProjectChange}
	      />
          </div>
          <div className='ui two bottom attached buttons'>
            <button 
	      className='ui basic blue button'
	      onClick={this.handleSubmit}
	      >
              {submitText}
            </button>
            <button 
	      className='ui basic red button'
	      onClick={this.props.onFormClose}
	    >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {
  state = {
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormSubmit = (timer) => {
    // Warning, invokes onFormSubmit and the returned results will not
    // affect wheter the form is closed or not. Need to add error
    // handling in case the server returns an unexpected response
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  render () {
    if (this.state.isOpen) {
      return (
          <TimerForm 
	    onFormClose = {this.handleFormClose}
	    onFormSubmit = {this.handleFormSubmit}
	  />
        );
    } else {
      return (
          <div className='ui basic content center aligned segment'>
            <button className='ui basic button icon'
	      onClick={this.handleFormOpen}  
	    >
              <i className='plus icon' />
            </button>
          </div>
      );
    }
  }
}

class Timer extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  };

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  };

  handleStartClick = () => {
    this.props.onStartClick(this.props.id);
  };

  handleStopClick = () => {
    this.props.onStopClick(this.props.id);
  };

  handleDeleteClick = () => {
    this.props.onDeleteClick(this.props.id);
  };
 
  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
    return (
        <div className='ui centered card'>
          <div className='content'>
            <div className='header'>
              {this.props.title}
            </div>
          <div className='meta'>
            {this.props.project}
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className='extra content'>
            <span className='right floated edit icon'
	      onClick={this.props.onEditClick}
	    >
              <i className='edit icon' />
            </span>
	    <span className='right floated trash icon'
	      onClick={this.handleDeleteClick}
	    >
	      <i className='trash icon' />
	    </span>
          </div>
        </div>
        <TimerActionButton timerIsRunning={!!this.props.runningSince}
	   onStartClick={this.handleStartClick}
	   onStopClick={this.handleStopClick}
	/>
      </div>
    );
  }
}

class TimerActionButton extends React.Component {

  render () {
    if (this.props.timerIsRunning) {
      return (
        <div
	  className='ui bottom attached red basic button'
	  onClick={this.props.onStopClick}
	>
	  Stop
	</div>
      );
    } else {
      return (
        <div
	  className='ui bottom attached green basic button'
	  onClick={this.props.onStartClick}
        >
	  Start
        </div>
      );
    }
  }
}


ReactDOM.render(
  <TimersDashboard />, 
  document.getElementById('content')
);

