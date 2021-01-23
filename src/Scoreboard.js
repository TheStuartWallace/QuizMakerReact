import React from 'react';
import './Scoreboard.css';
import firebase from './Firebase';

class Scoreboard extends React.Component{
	constructor(props){
		super(props);



		this.state = {
			id : this.props.match.params.id,
			showStage : 0,
			responces : new Array(10).fill(undefined),
		};

		this.getQuizData();
	}

	async getQuizData(){
		const quiz_data = await firebase.firestore().collection("quiz").doc(this.state.id).get();
		
		if(!quiz_data.exists){
			this.setState({showStage : -1, errorMessage : "This quiz does not exist"});
			return;
		}else{
			this.setState({quizData : quiz_data.data()});
		}

		const question_data = await firebase.firestore().collection("quiz").doc(this.state.id).collection("question").get();
		this.setState({questionData : question_data.docs.map(doc => doc.data())});
		let a = this;
		await firebase.firestore().collection("quiz").doc(this.state.id).collection("response").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				let responceData = {
					name : doc.data().name,
					quiz_answer : doc.data().quiz_answer,
					marks : doc.data().marks, 
					score : a.mark(doc.data().marks),
					date : doc.data().time.toDate(),
				};

				let array = a.state.responces;
				array.push(responceData);

				a.setState({responces : array});
			});
		});

		let array = this.state.responces;

		array.sort(function(a,b){return b.score - a.score});
		array = array.slice(0,10);
		this.setState({showStage : 1,responces : array});
	}

	mark(score){
		let count = 0;

		for(let a=0; a<score.length; a++){
			if(score[a]) count++;
		}

		return count;
	}

	render(){
		switch(this.state.showStage){
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
					<span className="sbTitle">{JSON.parse(this.state.quizData.title)}'s Scoreboard</span>
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