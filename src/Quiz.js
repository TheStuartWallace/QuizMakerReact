import React from 'react';
import './Quiz.css';
import firebase from './Firebase';
import {Link} from 'react-router-dom';

class Quiz extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			status : 0,

			quiz_state : 0,
			quiz_answer : [],

			id : this.props.match.params.id,

			qNameInput : "",
			resultLinkURL : "",
			savedLink : false,
		}

		this.getQuizData();
	}

	async getQuizData(){
		const quiz_data = await firebase.firestore().collection("quiz").doc(this.state.id).get();
		if(!quiz_data.exists){
		   	this.setState({status : -1, errorMessage : "Quiz does not exist '"+this.state.id+"'"});
			return;
		}else{
			this.setState({quizData : quiz_data.data()},()=>{document.title = JSON.parse(quiz_data.data().title)+" - Quiz Maker"});
		}

		const question_data = await firebase.firestore().collection("quiz").doc(this.state.id).collection("question").get();
		this.setState({status:1,questionData : question_data.docs.map(doc => doc.data())});
		
	}

	selectAnswer(id){
		let answers = this.state.quiz_answer.concat(id);
		this.setState(	
			{	quiz_answer : answers, 
				quiz_state : (this.state.quiz_state + 1),
				status : ((this.state.quiz_state+1) === this.state.questionData.length ? 3 : this.state.status)
			}, () => {
				if(this.state.status === 3){
					this.markAnswers(this.state.quiz_answer);
				}
			});
	}

	markAnswers(answersgiven){
		let marks = [];
		let right = 0;
		for(let a=0; a<this.state.questionData.length; a++){
			marks = marks.concat((answersgiven[a] === this.state.questionData[a].correct));
			if(answersgiven[a] === this.state.questionData[a].correct) right = right + 1;
		}

		this.setState({status : 4, marks : marks, won : (right >= this.state.quizData.score_win)});
	}

	saveResult(){
		let a = this;
		firebase.firestore().collection("quiz").doc(this.state.id).collection("response").add({
			name : this.state.qNameInput,
			quiz_answer : this.state.quiz_answer,
			marks : this.state.marks,
			time : firebase.firestore.FieldValue.serverTimestamp(),
		}).then(function(docRef) {
    		a.setState({resultLinkURL : a.state.id+"/r/"+docRef.id,savedLink:true})
		})
		.catch(function(error) {
		    this.setState({status : -1, errorMessage : error});
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

					<div className="qTitle">{JSON.parse(this.state.quizData.title)}</div>
					<span className="qStartMessage">{JSON.parse(this.state.quizData.message_start)}</span>
					<span className="qQuestionCount">You have to answer {this.state.questionData.length} questions and need to answer {this.state.quizData.score_win} to win</span>
					<br/><br/>
					<button className="qStartButton" onClick={() => this.setState({status : 2})}>Start Quiz</button>
				</div>
			);
		}

		if(this.state.status === 2){
			return (
				<div className="globalWrapper">
					<div className="qTitle">{JSON.parse(this.state.quizData.title)}</div>
					<span className="qQuestion">{JSON.parse(this.state.questionData[this.state.quiz_state].text)}</span><br/>
					<br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(1)}>{JSON.parse(this.state.questionData[this.state.quiz_state].answer1)}</button><br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(2)}>{JSON.parse(this.state.questionData[this.state.quiz_state].answer2)}</button><br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(3)}>{JSON.parse(this.state.questionData[this.state.quiz_state].answer3)}</button><br/>
					<button className="qAnswerButton" onClick={() => this.selectAnswer(4)}>{JSON.parse(this.state.questionData[this.state.quiz_state].answer4)}</button><br/>
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
					<div className="qTitle">{JSON.parse(this.state.quizData.title)}</div>
					<div className="qAnswerEnd">
						<span className="qEndMessage">{(this.state.won ? JSON.parse(this.state.quizData.message_end_win) : JSON.parse(this.state.quizData.message_end_loss))}</span>
						<br/>
						{this.state.marks.map((data,index) => {
								return (
									<div 	key={index} 
											className={data ? "qCorrect" : "qWrong"}>

										<div className="qResultQuestion">{JSON.parse(this.state.questionData[index].text)}</div>
										<div className="qResultAnswer"> {JSON.parse(this.state.questionData[index]["answer"+this.state.quiz_answer[index]])}</div>
										
									</div>
									);
						})}

					</div>

					<div className="qSaveResult">
						<div style={{display : this.state.savedLink ? 'none' : 'initial'}}>
							Want to show people how you did? Save you results!<br/>
							<br/>
							<input placeholder="Your name here" className="qSaveInput" name="qNameInput" onChange={(e) => this.handleInputChange(e)} type="text" value={this.state.qNameInput} />
							<button className="qSaveButton" onClick={() => this.saveResult()}>Save Result</button>
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