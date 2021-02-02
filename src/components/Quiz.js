import React from 'react';
import '../style/Quiz.css';
import QuizMaker from '../QuizMaker';
import {Link} from 'react-router-dom';

class Quiz extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			status : 0,

			quiz_state : 0, 
			quiz_answer : [],

			quiz: {},

			id : this.props.match.params.id,

			qNameInput : "",
			resultLinkURL : "",
			savedLink : false,
		};
	}

	componentDidMount(){
		this.getQuizData();
	}

	getQuizData(){
		let quiz = {
			option : undefined,
			question : undefined,
		}

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
				this.setState({status : 1, quiz : quiz});
			}
		});
	}

	selectAnswer(id){
		let answers = this.state.quiz_answer.concat(id);
		this.setState(	
			{	quiz_answer : answers, 
				quiz_state : (this.state.quiz_state + 1),
				status : ((this.state.quiz_state+1) === this.state.quiz.question.length ? 3 : this.state.status)
			}, () => {
				if(this.state.status === 3){
					this.markAnswers(this.state.quiz_answer);
				}
		});
	}

	markAnswers(answersgiven){
		let marks = [];
		let right = 0;
		for(let a=0; a<this.state.quiz.question.length; a++){
			marks = marks.concat((answersgiven[a] === this.state.quiz.question[a].correct));
			if(answersgiven[a] === this.state.quiz.question[a].correct) right = right + 1;
		}

		this.setState({status : 4, marks : marks, won : (right >= this.state.quiz.option.score_win)});
	}

	saveResult(){
		QuizMaker.createResult(this.state.id,{name : this.state.qNameInput,quiz_answer : this.state.quiz_answer,marks : this.state.marks,})
		.then((data) => {
			this.setState({resultLinkURL : this.state.id+"/"+data,savedLink:true});
		});
	}

	handleInputChange(event){
		this.setState({[event.target.name] : event.target.value});
	}

	render(){
		if(this.state.status === -1){
			return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Error! ({this.state.errorMessage})</span>
				</div>
			);
		}

		if(this.state.status === 0){
			return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Loading...</span>
				</div>
			);
		}

		if(this.state.status === 1){
			return (
				<div className="globalWrapper">

					<div className="qTitle">{JSON.parse(this.state.quiz.option.title)}</div>
					<span className="qStartMessage">{JSON.parse(this.state.quiz.option.message_start)}</span>
					<span className="qQuestionCount">You have to answer {this.state.quiz.question.length} questions and need to answer {this.state.quiz.option.score_win} to win</span>
					<br/><br/>
					<button className="qStartButton" onClick={() => this.setState({status : 2})}>Start Quiz</button>
				</div>
			);
		}

		if(this.state.status === 2){
			return (
				<div className="globalWrapper">
					<div className="qTitle">{JSON.parse(this.state.quiz.option.title)}</div>
					<span className="qQuestion">{JSON.parse(this.state.quiz.question[this.state.quiz_state].text)}</span><br/>
					<br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(1)}>{JSON.parse(this.state.quiz.question[this.state.quiz_state].answer1)}</button><br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(2)}>{JSON.parse(this.state.quiz.question[this.state.quiz_state].answer2)}</button><br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(3)}>{JSON.parse(this.state.quiz.question[this.state.quiz_state].answer3)}</button><br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(4)}>{JSON.parse(this.state.quiz.question[this.state.quiz_state].answer4)}</button><br/>
				</div>
			);
		}

		if(this.state.status === 3){
			return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Marking...</span>
				</div>
			);
		}

		if(this.state.status === 4){
			return (
				<div className="globalWrapper">
					<div className="qTitle">{JSON.parse(this.state.quiz.option.title)}</div>
					<div className="qAnswerEnd">
						<span className="qEndMessage">{(this.state.won ? JSON.parse(this.state.quiz.option.message_end_win) : JSON.parse(this.state.quiz.option.message_end_loss))}</span>
						<br/>
						{this.state.marks.map((data,index) => {
								return (
									<div 	key={index} 
											className={data ? "qCorrect" : "qWrong"}>

										<div className="qResultQuestion">{JSON.parse(this.state.quiz.question[index].text)}</div>
										<div className="qResultAnswer"> {JSON.parse(this.state.quiz.question[index]["answer"+this.state.quiz_answer[index]])}</div>
										
									</div>
									);
						})}

					</div>

					<div className="qSaveResult">
						<div style={{display : this.state.savedLink ? 'none' : 'initial'}}>
							Want to show people how you did? Save you results!<br/>
							<br/>
							<div className="qSaveInputWrapper">
								<input placeholder="Your name here" className="qSaveInput" name="qNameInput" onChange={(e) => this.handleInputChange(e)} type="text" value={this.state.qNameInput} />
								<button className="qSaveButton" onClick={() => this.saveResult()}>Save Result</button>
							</div>
							<br/>
						</div>
						<div className="qResultLink" style={{display : this.state.savedLink ? 'block' : 'none'}}>
							<Link target="_blank" to={this.state.resultLinkURL}>Cool, here's your link</Link>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default Quiz;