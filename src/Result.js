import React from 'react';
import "./Result.css";
import firebase from './Firebase';


class Result extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			status : 0,
			marks : [],
			quiz_answer : [],
			id : this.props.match.params.id,
			resp : this.props.match.params.res,
		}

		this.getQuizData();
	}

	async getQuizData(){
		const question_data = await firebase.firestore().collection("quiz").doc(this.state.id).collection("question").get();
		this.setState({questionData : question_data.docs.map(doc => doc.data())});
		const quiz_data = await firebase.firestore().collection("quiz").doc(this.state.id).get();
		this.setState({quizData : quiz_data.data()});
		const responce_data = await firebase.firestore().collection("quiz").doc(this.state.id).collection("response").doc(this.state.resp).get();
		
		this.setState(
			{	name : responce_data.data().name,
				quiz_answer : responce_data.data().quiz_answer,
				marks : responce_data.data().marks, 
				date : responce_data.data().time.toDate(),
				status : 1,
			});
	}

	render(){
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
						<span className="rResultName">Showing results for '{this.state.name}' on the {JSON.parse(this.state.quizData.title)}</span>
						<br/><br/>
						{this.state.marks.map((data,index) => {
								return (
									<span 	key={index} 
											className={data ? "qCorrect" : "qWrong"}>

										<span className="qResultQuestion">{JSON.parse(this.state.questionData[index].text)}</span>
										<br/>
										<span className="qResultAnswer"> {JSON.parse(this.state.questionData[index]["answer"+this.state.quiz_answer[index]])}</span>
										<br/><br/>
									</span>
									);
						})}
				</div>
			);
		}
	}
}

export default Result;