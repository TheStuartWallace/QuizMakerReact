import React from 'react';
import "../style/Result.css";
import QuizMaker from '../QuizMaker';


class Result extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			errorMessage : "Unknown Error",

			status : 0,

			marks : [],
			quiz_answer : [],

			id : this.props.match.params.id,
			resp : this.props.match.params.res,
		}

		this.getQuizData();
	}

	componentDidMount(){
		this.getQuizData();
	}

	getQuizData(){
		let quiz = {
			option : undefined,
			question : undefined,
		};

		QuizMaker.getQuizOptions(this.state.id).then((data)=>{
			if(data === undefined){
				this.setState({status : -1, errorMessage : "Quiz does not exist '"+this.state.id+"'"});
				return;
			}else{
				quiz.option = data;
			}
		});

		QuizMaker.getQuizQuestions(this.state.id).then((data) => {
			if(data === undefined){
				this.setState({status : -1, errorMessage : "Quiz does not exist '"+this.state.id+"'"});
				return;
			}else{
				quiz.question = data;
			}
		});

		QuizMaker.getQuizResponce(this.state.id,this.state.resp).then((data) => {
			if(data === undefined){
				this.setState({status : -1, errorMessage : "Unable to load result '"+this.state.resp+"'"});
				return;
			}else{
				this.setState({...data, quiz : quiz,status : 1});
			}
		});
	}

	render(){

		switch(this.state.status){
			default: case -1:	return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Error! ({this.state.errorMessage})</span>
				</div>
			);

			case 0: return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Loading...</span>
				</div>
			);
			

			case 1: return (
				<div className="globalWrapper">
					<div className="qTitle">{JSON.parse(this.state.quiz.option.title)}</div>
						<span className="rResultName">Showing results for '{this.state.name}' on the {JSON.parse(this.state.quiz.option.title)}</span>
						<br/><br/>
						{this.state.marks.map((data,index) => {
								return (
									<span key={index} className={data ? "qCorrect" : "qWrong"}>
										<span className="qResultQuestion">{JSON.parse(this.state.quiz.question[index].text)}</span>
										<br/>

										<span className="qResultAnswer"> {JSON.parse(this.state.quiz.question[index]["answer"+this.state.quiz_answer[index]])}</span>
										<br/>
										<br/>
									</span>
								);
						})}
				</div>
			);
		}
	}
}


export default Result;