import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import MainPage from './components/MainPage';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Scoreboard from './components/Scoreboard';
import {HashRouter as Router, Route} from 'react-router-dom';

class App extends React.Component{
	render(){
		return (
			<Router>
				<Route path="/" exact component={MainPage} />
				<Route path="/:id" exact component={Quiz} />
				<Route path="/:id/r/:res" exact component={Result} />
				<Route path="/:id/scoreboard" exact component={Scoreboard} />
			</Router>
		);
	}
}

ReactDOM.render(<App/>,document.getElementById("root"));