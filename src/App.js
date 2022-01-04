import React from 'react';
import './App.css';

var myAudio = document.getElementById("beep");

var myTimer; // Define The Timer variable

function Message(props) {
	// Component Message
	return <h1>{props.message}</h1>; // Return status of clock
}
class Clock extends React.Component {
	// Define the Clock Component
	constructor(props) {
		// Constructors of the Clock Component
		super(props);
		{
			/*Define The Component State*/
		}
		this.state = {
				SessionTimer: 25,
				Break: 5,
				TimerSecond: 0,
				TimerDislay: 25,
				AbleToClick: true,
				isBreak: false,
				message: "Clock Ready",
				label:"Session"
			};
		{
			/*Define all the function in Component*/
		}
		this.startButton = this.startButton.bind(this);
		this.resetButton = this.resetButton.bind(this);
		this.IncreaseSession = this.IncreaseSession.bind(this);
		this.DecreaseSession = this.DecreaseSession.bind(this);
		this.IncreaseBreak = this.IncreaseBreak.bind(this);
		this.DecreaseBreak = this.DecreaseBreak.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.Timer = this.Timer.bind(this);
	}
	formatNumber(i) {
		// Function to format digit clock
		if (i < 10) {
			return "0" + i;
		} else {
			return i;
		}
	}
	startButton() {
		// Start button function
    myAudio.pause();
		if (this.state.AbleToClick == true) {
			// The feature of button is true then
			this.setState((state) => ({
				AbleToClick: !state.AbleToClick,
				message: "Session Counting"
			})); // switch the feature of button and Bring out another messeage
			this.Timer(true); // Start Timer
		}
		if (this.state.AbleToClick == false) {
			this.setState((state) => ({
				AbleToClick: !state.AbleToClick,
				message: "Pause"
			}));
			this.Timer(false);
		}
	}

	Timer(bolean) {
		const timer = 1000;
		if (bolean == true) {
			myTimer = setInterval(this.startTimer, timer);
		} else {
			clearInterval(myTimer);
		}
	}
	startTimer() {
		if (this.state.TimerSecond <= 0) {
			this.setState((state) => ({
				TimerSecond: 60,
				TimerDislay: state.TimerDislay - 1
			}));
		}

		this.setState({ TimerSecond: this.state.TimerSecond - 1 });

		if (this.state.TimerDislay < 0 && this.state.isBreak === false) {
      myAudio.play()
			this.setState((state) => ({
				TimerDislay: state.Break,
				isBreak: true,
				TimerSecond: 0,
				message: "Break counting",
				label:"Break"
			}));

		}
		if (this.state.isBreak === true && this.state.TimerDislay < 0) {
      myAudio.play()
			this.setState((state) => ({
				TimerDislay: state.SessionTimer,
				isBreak: false,
				TimerSecond: 0,
				message: "Break counting",
				label:"Session"
			}));
		}
	}

	resetButton() {
    myAudio.load();
		this.setState({
			SessionTimer: 25,
			Break: 5,
			TimerSecond: 0,
			TimerDislay: 25,
			TimerStart: false,
			AbleToClick: true,
			isBreak: false,
			message: "Reseted",
			label:"Session"
		});
		this.Timer(false);
	}
	IncreaseSession() {
		this.setState((state) => ({
			SessionTimer: state.SessionTimer + 1,
			TimerDislay: state.SessionTimer + 1
		}));
		if(this.state.SessionTimer >= 60 && this.state.TimerDislay >= 60){
			this.setState({SessionTimer:60, TimerDislay:60});
		}
	}
	DecreaseSession() {
		if (this.state.SessionTimer == 1) {
			this.setState((state) => ({ SessionTimer: 1 }));
		} else {
			this.setState((state) => ({
				SessionTimer: state.SessionTimer - 1,
				TimerDislay: state.SessionTimer - 1
			}));
		}
	}
	IncreaseBreak() {
		this.setState((state) => ({
			Break: state.Break + 1
		}));
		if(this.state.Break >= 60){
			this.setState({Break:60})
		}
	}
	DecreaseBreak() {
		if (this.state.Break == 1) {
			this.setState((state) => ({
				Break: 1
			}));
		} else {
			this.setState((state) => ({
				Break: state.Break - 1
			}));
		}
	}
	render() {
		return (
			<div id="Clock-Para">
				<Message message={this.state.message} />
				<div id="break-session">
					<div id="break-label" class="break-session-class">
						<p class="text-center break-session-common">Break</p>
						<p id="break-length" class="text-center timer-setup">
							{this.state.Break}
						</p>
						<button
							id="break-decrement"
							class="btn btn-default btn-danger increase-decrease"
							onClick={this.DecreaseBreak}
						>
							-
						</button>
						<button
							id="break-increment"
							class="btn btn-default btn-primary increase-decrease"
							onClick={this.IncreaseBreak}
						>
							+
						</button>
					</div>
					<div id="session-label" class="break-session-class">
						<p class="text-center break-session-common">Session</p>
						<p id="session-length" class="text-center timer-setup">
							{this.state.SessionTimer}
						</p>
						<button
							id="session-decrement"
							class="btn btn-default btn-danger increase-decrease"
							onClick={this.DecreaseSession}
						>
							-
						</button>
						<button
							id="session-increment"
							class="btn btn-default btn-primary increase-decrease"
							onClick={this.IncreaseSession}
						>
							+
						</button>
					</div>
				</div>
					<p id ="timer-label" class= "text-center">{this.state.label}</p>
					<p id="time-left" class="text-center">
						{this.formatNumber(this.state.TimerDislay)}:{this.formatNumber(this.state.TimerSecond)}
					</p>

					<div id="Timer-Button">
						<button
							id="reset"
							class="btn btn-default btn-primary reset-start"
							onClick={this.resetButton}
						>
							Reset
						</button>
						<button
							id="start_stop"
							class="btn btn-default btn-danger reset-start"
							onClick={this.startButton}
						>
							Start/Pause
						</button>
					</div>

			</div>
		);
	}
}

export default Clock;
