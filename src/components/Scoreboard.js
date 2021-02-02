import React from 'react';
import '../style/Scoreboard.css';
import QuizMaker from '../QuizMaker';

class Scoreboard extends React.Component{
	constructor(props){
		super(props);



		this.state = {
			id : this.props.match.params.id,
			status : 0,
			responces : new Array(10).fill(undefined),
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
			}
		});

		QuizMaker.getQuizTop10(this.state.id).then((data) => {
			this.setState({quiz : quiz,responces : data, status : 1});
		});
	}

	mark(score){
		let count = 0;

		for(let a=0; a<score.length; a++){
			if(score[a]) count++;
		}

		return count;
	}

	render(){
		switch(this.state.status){
			case -1:return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Error! ({this.state.errorMessage})</span>
				</div>
			);

			default: case 0: return (
				<div className="globalWrapper">
					<span className="globalLoadingMessage">Loading...</span>
				</div>
			);

			case 1: return (
				<div className="globalWrapper">
					<span className="sbTitle">{JSON.parse(this.state.quiz.option.title)}'s Scoreboard</span>
					{
						this.state.responces.map((data,index) => {
							if(data === undefined){
								return (<div className="sbEntry" key={index}>
									<span><span className="sbEntryPos">#{index+1}</span> <span className="sbEntryName">No Entry</span></span>
								</div>);
							}else{
								return (<div className="sbEntry" key={index}>	
										<span><span className="sbEntryPos">#{index+1}</span> <span className="sbEntryName">{data.name}</span></span>
										<span className="sbEntryScore">Score: {data.score}</span>
								</div>);
							}							
						})
					}
				</div>
			);

		}
	}
}

export default Scoreboard;