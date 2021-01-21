import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
	apiKey: "AIzaSyAOdPrnY-0HVvl0rbh1jSCbL-NcLk4x3Vg",
	authDomain: "quizmaker-3934d.firebaseapp.com",
	projectId: "quizmaker-3934d",
	storageBucket: "quizmaker-3934d.appspot.com",
	messagingSenderId: "25946962267",
	appId: "1:25946962267:web:38ed9dc407b1049c5cc27e"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;