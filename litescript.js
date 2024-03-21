// Initialize the current question index, score, quiz data, user name, and selected option
let currentQuestion = 0;
let score = 0;
let quizData = [];
let userName = "";
let selectedOption = "";

// Function to load quiz data from quizData.json file
const loadQuizData = async () => {
  const res = await fetch("quizData.json");
  quizData = await res.json();
  loadQuestion();
};

// Function to load the current question and options
const loadQuestion = () => {
  const questionObj = quizData[currentQuestion];
  document.getElementById("question").innerText = questionObj.question;
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`btn${i}`);
    btn.innerText = questionObj.options[i];
    btn.className = "option-btn";
    btn.disabled = false;
    btn.style.opacity = 1;
    btn.style.cursor = "default";
  }
  document.getElementById("skip-btn").disabled = false;
  document.getElementById("skip-btn").style.opacity = 1;
  document.getElementById("skip-btn").style.cursor = "default";
  document.getElementById("message").innerText = "";
  document.getElementById("next-btn").style.display = "none";
};

// Function to start the quiz, get the username and display the quiz container
const startQuiz = () => {
   console.log("startQuiz function called");
  document.getElementById("start-page").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  loadQuizData();
};

// Function to end the quiz, hide quiz container, and display score
const endQuiz = () => {
    document.getElementById("quiz-container").style.display = "none";
    const totalQuestions = quizData.length;
    const passThreshold = 0.7 * totalQuestions;
    const scorePercentage = (score / totalQuestions) * 100;
  
    document.getElementById("result-container").style.display = "block";
    const resultText = document.getElementById("result-text");
  
    if (scorePercentage < 30) {
      resultText.innerText = `You got ${scorePercentage.toFixed(0)}% of the questions right.\nRemarks: Learning is key.`;
      resultText.style.color = "#e74c3c"; // Red color
    } else if (scorePercentage < 50) {
      resultText.innerText = `You got ${scorePercentage.toFixed(0)}% of the questions right.\nRemarks: Fair.`;
      resultText.style.color = "#e74c3c"; // Red color
    } else if (scorePercentage >= 50 && scorePercentage < 70) {
      resultText.innerText = `You got ${scorePercentage.toFixed(0)}% of the questions right.\nRemarks: Good.`;
      resultText.style.color = "#FF8C00"; // Orange color
    } else {
      resultText.innerText = `You got ${scorePercentage.toFixed(0)}% of the questions right.\nRemarks: Excellent.`;
      resultText.style.color = "#27ae60"; // Green color
    }
  };
const restartQuiz = () => {
  currentQuestion = 0;
  score = 0;
  document.getElementById("score").innerText = "0";
  document.getElementById("failure-container").style.display = "none";
  document.getElementById("start-page").style.display = "block";
};

// Event listeners for Start Quiz button and Next Question button
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("next-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;
    document.getElementById("progress-bar-text").innerText = `${Math.round(progress)}%`;
  } else {
    endQuiz();
  }
});

// Event listeners for the option buttons, updating score and showing whether the answer is correct or not
for (let i = 0; i < 4; i++) {
  document.getElementById(`btn${i}`).addEventListener("click", (event) => {
    selectedOption = event.target;
    if (quizData[currentQuestion].options[i] === quizData[currentQuestion].answer) {
      score++;
      document.getElementById("score").innerText = score;
      selectedOption.className = "option-btn correct";
      document.getElementById("message").innerText = "Correct Answer!";
    } else {
      selectedOption.className = "option-btn wrong";
      document.getElementById("message").innerText = "Wrong Answer!";
    }
    for (let j = 0; j < 4; j++) {
      document.getElementById(`btn${j}`).disabled = true;
      document.getElementById(`btn${j}`).style.cursor = "not-allowed";
      document.getElementById(`btn${j}`).style.opacity = 0.5;
    }
    selectedOption.style.opacity = 1;

    // Disable the "Skip" button
    document.getElementById("skip-btn").disabled = true;
    document.getElementById("skip-btn").style.cursor = "not-allowed";
    document.getElementById("skip-btn").style.opacity = 0.5;

    document.getElementById("next-btn").style.display = "block";
  });
}

// Event listener for the "Skip" button
document.getElementById("skip-btn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
    const progress = (currentQuestion / quizData.length) * 100;
    document.getElementById("progress-bar-fill").style.width = `${progress}%`;
    document.getElementById("progress-bar-text").innerText = `${Math.round(progress)}%`;
  } else {
    endQuiz();
  }
});