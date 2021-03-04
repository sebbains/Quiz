const question = document.querySelector('#question');
const choices = [...document.querySelectorAll('.choice-text')];
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBar = document.querySelector('#progressBar');
const progressBarFull = document.querySelector('#progressBarFull');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

const selectedCategory = location.search.substring(1);
const apiUrl = `https://opentdb.com/api.php?amount=5&category=${selectedCategory}&difficulty=easy&type=multiple`;

fetch(apiUrl)
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            // create answer location (not index)
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            // insert answer into index
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
        
            answerChoices.forEach((answer, index) => {
                formattedQuestion[`choice${index + 1}`] = answer;
            })
            return formattedQuestion;
        }); 
        startGame();
    })
    .catch(err => {
        console.error(err);
    });


const startGame = () => {
    // reset
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    // hide loader & show game
    loader.classList.add('hidden');
    game.classList.remove('hidden');
}

const getNewQuestion = () => {
    // check if questions remain
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    // get question
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    // get choices
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerHTML = currentQuestion[`choice${number}`];
    })
    // update remaining questions
    availableQuestions.splice(questionIndex,1);
    acceptingAnswers = true;
}

choices.forEach(choice => {
    // check answer
    choice.addEventListener("click", (e) => {
        if(!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset["number"];
        const classToApply = selectedAnswer == currentQuestion.answer? 'correct' : 'incorrect';
        if( classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);  
    })
})

const incrementScore = num => {
    // updates score
    score += num;
    scoreText.innerText = score;
}