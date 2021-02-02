import firebase from './Firebase.js';

class QuizMaker{
	static async getQuizOptions(id){
		const quiz_data = await firebase.firestore().collection("quiz").doc(id).get();
		
		if(!quiz_data.exists){
			return undefined;
		}else{
			return quiz_data.data();
		}
	}

	static async getQuizQuestions(id){
		const data = await firebase.firestore().collection("quiz").doc(id).collection("question").get();
		if(data.docs.length <= 0) return undefined;
		return data.docs.map(doc => doc.data());
	}

	static async getQuizResponce(quiz,resp){
		const responce_data = await firebase.firestore().collection("quiz").doc(quiz).collection("response").doc(resp).get();

		if(!responce_data.exists) return undefined;

		return {
			name : responce_data.data().name,
			quiz_answer : responce_data.data().quiz_answer,
			marks : responce_data.data().marks,
			date : responce_data.data().time.toDate(),
		}
	}

	static async getQuizTop10(id){
		let a = this;
		
		a.responces = new Array(10).fill(undefined);

		await firebase.firestore().collection("quiz").doc(id).collection("response").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
			let responceData = {
				name : doc.data().name,
				quiz_answer : doc.data().quiz_answer,
				marks : doc.data().marks, 
				score : doc.data().marks.filter(Boolean).length,
				date : doc.data().time.toDate(),
			};

			let array = a.responces;
			array.push(responceData);
				a.responces = array;
			});
		});

		let array = a.responces;

		array.sort(function(a,b){return b.score - a.score});
		array = array.slice(0,10);
		return array;
	}

	static async createQuiz(data){
		let id;
		await firebase.firestore().collection("quiz").add({
			title : 			JSON.stringify(data.title),
			score_win : 		data.score_win,
			message_start : 	JSON.stringify(data.message_start),
			message_end_win : 	JSON.stringify(data.message_end_win),
			message_end_loss : 	JSON.stringify(data.message_end_loss),	
		}).then(function(docRef){
			id = docRef.id;
			let batch = firebase.firestore().batch();

			data.question.forEach((doc,index) => {
				let data = {
					text:JSON.stringify(doc.text),
					answer1:JSON.stringify(doc.answer1),
					answer2:JSON.stringify(doc.answer2),
					answer3:JSON.stringify(doc.answer3),
					answer4:JSON.stringify(doc.answer4),
					correct:doc.correct,
				};

				batch.set(firebase.firestore().collection("quiz").doc(docRef.id).collection("question").doc(""+index),data);
			});

			batch.commit();
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
			return undefined;
		});

		return id;
	}

	static async createResult(id,data){
		let a = this;
		await firebase.firestore().collection("quiz").doc(id).collection("response").add({
			name : 			data.name,
			quiz_answer : 	data.quiz_answer,
			marks : 		data.marks,
			time : 			firebase.firestore.FieldValue.serverTimestamp(),
		}).then(function(docRef) {
			a.resultLinkURL = "r/"+docRef.id;
		})
		.catch(function(error) {
			alert("Something went wrong '"+error+"')");
			console.error("Error adding document: ", error);
		});

		return a.resultLinkURL;
	}
}

export default QuizMaker;