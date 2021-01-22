import React from 'react';
import './MainPage.css';
import firebase from './Firebase';
import {Link} from 'react-router-dom';

class MainPage extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			// Main Page States
			showStage : 0,
			showQuestion : 0,

			// Quiz Information 
			title : "\"\"",
			message_start : "\"\"",
			message_end_win : "\"\"",
			message_end_loss : "\"\"",
			quizQuestions : [{text:"\"\"",answer1:"\"\"",answer2:"\"\"",answer3:"\"\"",answer4:"\"\"",correct:-1}],
			score_win : 0,

			// Save Link Information
			resultLinkURL : "",
		}
	}

	verifyInput(){
		for(let a=0; a<this.state.quizQuestions.length; a++){
			if(JSON.parse(this.state.quizQuestions[a].text) === "") return false;
			if(JSON.parse(this.state.quizQuestions[a].answer1) === "") return false;
			if(JSON.parse(this.state.quizQuestions[a].answer2) === "") return false;
			if(JSON.parse(this.state.quizQuestions[a].answer3) === "") return false;
			if(JSON.parse(this.state.quizQuestions[a].answer4) === "") return false;
			if(this.state.quizQuestions[a].correct === -1) return false;
		}

		if(JSON.parse(this.state.title) === "") return false;
		if(JSON.parse(this.state.message_start) === "") return false;
		if(JSON.parse(this.state.message_end_win) === "") return false;
		if(JSON.parse(this.state.message_end_loss) === "") return false;

		return true;
	}

	handleInput(event){
		this.setState({
			[event.target.name] : JSON.stringify(event.target.value),
		})
	}

	handleQuestionInput(event,index){
		let array = this.state.quizQuestions;

		array[index] = {
			...array[index],
			[event.target.name] : JSON.stringify(event.target.value),
		}

		this.setState({quizQuestions : array});
	}

	setCorrect(index,value){
		let array = this.state.quizQuestions;

		array[index] = {
			...array[index],
			correct : value,
		}

		this.setState({quizQuestions : array});
	}

	addQuestion(){
		let array = this.state.quizQuestions.concat({text:"\"\"",answer1:"\"\"",answer2:"\"\"",answer3:"\"\"",answer4:"\"\"",correct:-1});
		this.setState({quizQuestions : array, showQuestion : array.length-1});
	}

	submitQuiz(){
		if(!this.verifyInput()){
			window.alert("Please ensure all fields are filled and correct answers selected before submitting");
			return;
		}
		
		let a = this;
		firebase.firestore().collection("quiz").add({
			
				title : this.state.title,
				score_win : this.state.score_win,
				message_start : this.state.message_start,
				message_end_win : this.state.message_end_win,
				message_end_loss : this.state.message_end_loss,
			
		}).then(function(docRef) {
    		
			let batch = firebase.firestore().batch();

			a.state.quizQuestions.forEach((doc,index) => {
				batch.set(firebase.firestore().collection("quiz").doc(docRef.id).collection("question").doc(""+index),doc);
			});

			batch.commit();

    		a.setState({resultLinkURL : docRef.id,showStage:3})
		})
		.catch(function(error) {
		    this.setState({showStage : -1, errorMessage : error});
		});
	}

	render(){
		switch(this.state.showStage){
			default: return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Error! ({this.state.errorMessage})</span>
				</div>
			);

			case -1: return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">{this.state.errorMessage}</span>
				</div>
			);

			case 0: return (
				<div className="globalWrapper">
				<button className="globalLeftNav" onClick={() => this.setState({showStage : this.state.showStage - 1})} disabled={(this.state.showStage <= 0)}>&lt;</button>
				<button className="globalRightNav" onClick={() => this.setState({showStage : this.state.showStage + 1})}>&gt;</button>
					<input 	name="title" 
						className="mpInputTitle"
						placeholder="Give your quiz a title" 
						type="text" 
						autoComplete="off"
						value={JSON.parse(this.state.title)} 
						onChange={(e) => this.handleInput(e)}/>

					<span className="mpQuizOption">
						<input 	placeholder="This is the start message" 
								className="mpInputStart" 
								name="message_start" 
								autoComplete="off"
								value={JSON.parse(this.state.message_start)} 
								onChange={(e) => this.handleInput(e)} /> 
					</span>

					<span className="mpQuizOption">
						<input 	placeholder="This is the winning message" 
						className="mpInputWin" 
						autoComplete="off"
						name="message_end_win" 
						value={JSON.parse(this.state.message_end_win)} 
						onChange={(e) => this.handleInput(e)} />
					</span>

					<span className="mpQuizOption">
						<input 	placeholder="This is the losing message" 
								className="mpInputLoss" 
								name="message_end_loss" 
								autoComplete="off"
								value={JSON.parse(this.state.message_end_loss)} 
								onChange={(e) => this.handleInput(e)} />
					</span>

					<span className="mpQuizOption">
						<input 	placeholder="Score needed to win" 
								min="1" 
								autoComplete="off"
								className="mpInputWinScore" 
								name="score_win" 
								type="number" 
								onChange={(e) => this.setState({score_win : parseInt(e.target.value)})} />
					</span>
				</div>
			);

			case 1: return (
				<div className="globalWrapper">
					
					<button className="globalLeftNav" onClick={() => this.setState({showStage : this.state.showStage - 1})} disabled={(this.state.showStage === 0)}>&lt;</button>
					<button className="globalRightNav" onClick={() => this.setState({showStage : this.state.showStage + 1})}>&gt;</button>
					
					<div className="mpWrapper">
						<div className="mpQuestionTitle">Question {(this.state.showQuestion)+1}</div>
		 				
		 				<input 		className="mpQuestionInput" 
					 				placeholder="Enter your question here" 
					 				name="text" 
					 				autoComplete="off" 
					 				value={JSON.parse(this.state.quizQuestions[this.state.showQuestion].text)} 
					 				onChange={(e) => this.handleQuestionInput(e,this.state.showQuestion)} 
					 	/>							
		 				<br/>

		 				<span className="mpAnswerSpan">
			 				<input 	className={(this.state.quizQuestions[this.state.showQuestion].correct === 1 ? "mpQuestionCorrect" : "mpQuestion")} 
			 						placeholder="Enter option 1 here"
			 						autoComplete="off" 
			 						name="answer1" value={JSON.parse(this.state.quizQuestions[this.state.showQuestion].answer1)} 
			 						onChange={(e) => this.handleQuestionInput(e,this.state.showQuestion)} />

			 				<button className="mpCorrect" onClick={()=>this.setCorrect(this.state.showQuestion,1)}>Correct</button>
		 					<br/>
			 			</span>

		 				<span className="mpAnswerSpan">
			 				<input 	className={(this.state.quizQuestions[this.state.showQuestion].correct === 2 ? "mpQuestionCorrect" : "mpQuestion")} 
			 						placeholder="Enter option 2 here"
			 						autoComplete="off" 
			 						name="answer2" value={JSON.parse(this.state.quizQuestions[this.state.showQuestion].answer2)} 
			 						onChange={(e) => this.handleQuestionInput(e,this.state.showQuestion)} />

			 				<button className="mpCorrect" onClick={()=>this.setCorrect(this.state.showQuestion,2)}>Correct</button>
			 				<br/>
		 				</span>

		 				<span className="mpAnswerSpan">
			 				<input 	className={(this.state.quizQuestions[this.state.showQuestion].correct === 3 ? "mpQuestionCorrect" : "mpQuestion")} 
			 						placeholder="Enter option 3 here"
			 						autoComplete="off" 
			 						name="answer3" value={JSON.parse(this.state.quizQuestions[this.state.showQuestion].answer3)} 
			 						onChange={(e) => this.handleQuestionInput(e,this.state.showQuestion)} />
			 				<button className="mpCorrect" onClick={()=>this.setCorrect(this.state.showQuestion,3)}>Correct</button>
		 					<br/>
		 				</span>
		 				
		 				<span className="mpAnswerSpan">
			 				<input 	className={(this.state.quizQuestions[this.state.showQuestion].correct === 4 ? "mpQuestionCorrect" : "mpQuestion")} 
			 						placeholder="Enter option 4 here"
			 						autoComplete="off" 
			 						name="answer4" value={JSON.parse(this.state.quizQuestions[this.state.showQuestion].answer4)} 
			 						onChange={(e) => this.handleQuestionInput(e,this.state.showQuestion)} />

			 				<button className="mpCorrect" onClick={()=>this.setCorrect(this.state.showQuestion,4)}>Correct</button>
			 				<br/>
		 				</span>
		 				
		 				<div className="mpQuestionNavigation">
			 			<button 	className="mpQuestionNavigationPrevious" 
			 						disabled={(this.state.showQuestion -1 >= 0 ? false : true)}
			 						onClick={() => this.setState({showQuestion : this.state.showQuestion -1})}>
			 						Previous
			 			</button>

			 			<button 	className="mpQuestionNavigationNew" 
			 						onClick={() => this.addQuestion()}>
			 						New Question
			 			</button>
			 			
			 			<button 	className="mpQuestionNavigationNext" 
			 						disabled={(this.state.showQuestion+1 < this.state.quizQuestions.length ? false : true)}
			 						onClick={() => this.setState({showQuestion : this.state.showQuestion+1})}>
			 						Next
			 			</button>
			 		</div>
		 				
		 			</div>

		 			
	 			</div>
			); 

			case 2: return (
				<div className="globalWrapper">
					<button className="globalLeftNav" onClick={() => this.setState({showStage : this.state.showStage - 1})} disabled={(this.state.showStage === 0)}>&lt;</button>
					<button className="globalRightNav" onClick={() => this.setState({showStage : this.state.showStage + 1})} disabled={(this.state.showStage <= 2)}>&gt;</button>
					
					<div className="mpSubmitQuiz">
						<span className="mpSubmitQuizMessage">Finished? Submit your quiz now!</span>
						<br/>
						<button className="mpSubmitQuizButton" onClick={() => this.submitQuiz()}>Submit quiz and get your link</button>
					</div>
				</div>
			);

			case 3: return (
				<div className="globalWrapper">
					<div className="submitLink"><Link to={this.state.resultLinkURL} target="_blank">Cool, click me to view your quiz</Link></div>
				</div>
			);
		}
	}
}

export default MainPage;