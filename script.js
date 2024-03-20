// Initialize the current question index, score, quiz data, user name, and selected option
const sectionNames = ["Essentials", "Intermediate", "Advanced"];
let currentQuestion = 0;
let score = 0;
let quizData = [];
let currentSection = 1;
let userName = "";
let selectedOption = "";

const pathwayLinks = {
  "Essentials": "essentials-link.html",
  "Intermediate": "intermediate-link.html",
  "Advanced": "advanced-link.html"
};

// Function to load quiz data from quizData.json file
const loadQuizData = async () => {
  const quizDataFile = `quizData${currentSection}.json`;
  const res = await fetch(quizDataFile);
  quizData = await res.json();
  loadQuestion();
  document.getElementById("current-section").innerText = currentSection;
  document.getElementById("section-name").innerText = sectionNames[currentSection - 1];
  document.getElementById("progress-bar-fill").style.width = "0%";
  document.getElementById("progress-bar-text").innerText = "0%";
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
  document.getElementById("start-page").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  loadQuizData();
};

// Function to end the quiz, hide quiz container, and display score
const endQuiz = () => {
  document.getElementById("quiz-container").style.display = "none";
  const totalQuestions = quizData.length;
  const passThreshold = 0.7 * totalQuestions; // For example, 70% to pass

  if (score >= passThreshold) {
    if (currentSection === 3) {
      document.getElementById("final-success-container").style.display = "block";
    } else {
      document.getElementById("success-container").style.display = "block";
      document.getElementById("current-section").innerText = currentSection;
      const successHeading = document.getElementById("success-heading");
      successHeading.innerText = `Congratulations on passing Section ${currentSection}: ${sectionNames[currentSection - 1]}!`;
    }
  } else {
    document.getElementById("failure-container").style.display = "block";
    const recommendationText = document.getElementById("recommendation-text");
    const pathwayBtn = document.getElementById("pathway-btn");
    if (currentSection === 1) {
      recommendationText.innerText = "Based on our analysis, we suggest the Essentials pathway as the most suitable option to meet your requirements.";
      pathwayBtn.onclick = () => window.location.href = pathwayLinks["Essentials"];
    } else if (currentSection === 2) {
      recommendationText.innerText = "Our evaluation indicates that the Intermediate pathway would be the most appropriate choice for you.";
      pathwayBtn.onclick = () => window.location.href = pathwayLinks["Intermediate"];
    } else if (currentSection === 3) {
      recommendationText.innerText = "Our evaluation indicates the Advanced pathway is the most appropriate option to challenge your existing skills.";
      pathwayBtn.onclick = () => window.location.href = pathwayLinks["Advanced"];
    }
  }
};
const restartQuiz = () => {
  currentQuestion = 0;
  score = 0;
  document.getElementById("score").innerText = "0";
  document.getElementById("failure-container").style.display = "none";
  document.getElementById("start-page").style.display = "block";
  document.getElementById("progress-bar-fill").style.width = "0%";
  document.getElementById("progress-bar-text").innerText = "0%";
  loadQuizData();
};

document.getElementById("restart-btn").addEventListener("click", restartQuiz);

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
// Event Listener for the "Next Section" button
document.getElementById("next-section-btn").addEventListener("click", () => {
  currentSection++;
  document.getElementById("success-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  currentQuestion = 0;
  score = 0;
  document.getElementById("score").innerText = "0";
  loadQuizData();
});

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