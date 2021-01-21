import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainPage from './MainPage';
import Quiz from './Quiz';
import Result from './Result';
import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends React.Component{
	render(){
		return (
			<Router>
				<Route path="/" exact component={MainPage} />
				<Route path="/:id" exact component={Quiz} />
				<Route path="/:id/r/:res" exact component={Result} />
			</Router>
		);
	}
}

ReactDOM.render(<App/>,document.getElementById("root"));