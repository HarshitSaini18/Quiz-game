// localStorage.removeItem("leaderboard");
const startScreen = document.getElementById("start-screen");
const nameScreen = document.getElementById("name-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const answerScreen = document.getElementById("answer-screen");
const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answerContainer = document.getElementById("answer-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maximumScoreSpan = document.getElementById("maximum-score");
const progressBar = document.getElementById("progress");
const resultMessage = document.getElementById("result-message");
const checkAnsBtn = document.getElementById("checkans-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const endBtn = document.getElementById("end-btn");
const nameBtn = document.getElementById("name-btn");
const playerName = document.getElementById("player-name");
const leaderboardList = document.getElementById("leaderboard-list");

const quizQuestions = [
  {
    question: "What is 2*2",
    answer: [
      { text: 2, index: 0, correct: false },
      { text: 4, index: 1, correct: true },
      { text: 1, index: 2, correct: false },
      { text: 0, index: 3, correct: false },
    ],
  },
  {
    question: "What is 9*9",
    answer: [
      { text: 9, index: 0, correct: false },
      { text: 18, index: 1, correct: false },
      { text: 1, index: 2, correct: false },
      { text: 81, index: 3, correct: true },
    ],
  },
  {
    question: "What is 1+1?",
    answer: [
      { text: 1, index: 0, correct: false },
      { text: 2, index: 1, correct: true },
      { text: 3, index: 2, correct: false },
      { text: 4, index: 3, correct: false },
    ],
  },
];

// variables

let currentQuestionIndex = 0;
let score = 0;
let answerDisabled = false;
let reviewMode = false;
let userAnswer = [];
totalQuestionSpan.textContent = quizQuestions.length;
maximumScoreSpan.textContent = quizQuestions.length;

//event listner

nameBtn.addEventListener("click", askName);
startBtn.addEventListener("click", startQuiz);
checkAnsBtn.addEventListener("click", checkAns);
nextBtn.addEventListener("click", nextques);
prevBtn.addEventListener("click", prevques);
endBtn.addEventListener("click", showResults);

function askName() {
  startScreen.classList.remove("active");
  nameScreen.classList.add("active");
}

function startQuiz() {
  const playerNameInput = playerName.value.trim();
  if (playerNameInput === "") {
    playerName.placeholder = " 😡Enter your name😡";
    askName();
    return;
  }
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = score;
  prevBtn.style.display = "none";
  nameScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function nextques() {
  currentQuestionIndex++;
  prevBtn.style.display = "inline-block";
  if (currentQuestionIndex < quizQuestions.length) {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      nextBtn.style.display = "none";
    }
    showQuestion();
  }
}

function prevques() {
  currentQuestionIndex--;
  nextBtn.style.display = "inline-block";
  if (currentQuestionIndex >= 0) {
    if (currentQuestionIndex === 0) {
      prevBtn.style.display = "none";
    }
    showQuestion();
  }
}

function showQuestion() {
  answerDisabled = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  questionText.textContent = currentQuestion.question;
  answerContainer.innerHTML = "";

  currentQuestion.answer.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.index = answer.index;
    button.dataset.correct = answer.correct;
    if (Number(button.dataset.index) === userAnswer[currentQuestionIndex]) {
      button.classList.add("selected");
    } else {
      button.classList.add("answer-btn");
    }
    button.addEventListener("click", selectAnswer);
    answerContainer.appendChild(button);
  });

  if (reviewMode) {
    Array.from(answerContainer.children).forEach((button) => {
      if (userAnswer[currentQuestionIndex] === Number(button.dataset.index)) {
        if (button.dataset.correct === "true") {
          button.classList.add("correct");
        } else {
          button.classList.add("incorrect");
        }
      }
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      }
    });
  }
}

function selectAnswer(event) {
  if (answerDisabled) return;
  if (reviewMode) return;
  answerDisabled = true;
  const selectedButton = event.target;
  const selcetedIndex = selectedButton.dataset.index;
  const isCorrect = selectedButton.dataset.correct === "true";
  selectedButton.classList.add("selected");
  userAnswer[currentQuestionIndex] = Number(selcetedIndex);
  showQuestion();

  // setTimeout(() => {
  //     // currentQuestionIndex++;
  //     if(currentQuestionIndex < quizQuestions.length){
  //         showQuestion()}
  //         else{
  //             showResults();
  //         }
  // },)
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  userAnswer.forEach((finalIndex, i) => {
    const answer1 = quizQuestions[i].answer[finalIndex];
    if (answer1 && answer1.correct) {
      score++;
    }
  });
  finalScoreSpan.textContent = score;
  const playerNameInput = playerName.value.trim();
  const playerData = {
    name: playerNameInput,
    score: score,
  };
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push(playerData);
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  showLeaderboard();
}

function showLeaderboard() {
  leaderboardList.innerHTML = "";
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard"));

  leaderboard.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = player.name + "-" + player.score+"points";
    leaderboardList.appendChild(li);
  });
}

function checkAns() {
  reviewMode = true;
  currentQuestionIndex = 0;
  prevBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
  endBtn.style.display = "none";

  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuestion();
}
