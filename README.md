#Quiz Maker (React)

## About this Project
This is a simple quiz maker project, which allows the user to view and share their scores on different quizes that can be created using the app. This project is mainly to show my knowledge of React, ReactRouter and use of Firebase.

## How it works

### Making a new quiz
The main page takes in the quiz title, starting message, the messages if the player wins or loses and the score needed to win, clicking the next arrow leads you to the question input page.

This allows the user to input a question, four options and select which answer is right and add more questions.

Finally the submission page checks for any blank values or questions without correct options selected, if there is any it will show an error alert, if not, the information is submitted to firebase and a new link to the quiz is shown, which is the firebase document ID.

### Viewing an existing quiz
Inputting the link to the quiz will load the quiz information and question data from Firebase, if, however this information is not found, an error message is displayed.

A valid quiz will show the quiz title, starting message and let the player start the quiz and mark their answers at the end.

At the end of the quiz the user is allowed to save their answers to the quiz and share it via a genorated link

### Viewing saved results
This simply displays the users name and their responces to the quiz, along with whether the answers were correct or not.

## Running this project
This project should simply be run using npm start
