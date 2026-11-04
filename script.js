'use strict';

const QUESTIONS_PER_ROUND = 10;
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const scoreEl = document.getElementById('score');
const progressBar = document.getElementById('progressBar');
const currentQEl = document.getElementById('currentQ');
const totalQEl = document.getElementById('totalQ');
const bgMusic = document.getElementById('bgMusic');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

if (bgMusic) bgMusic.volume = 0.12;
if (correctSound) correctSound.volume = 0.55;
if (wrongSound) wrongSound.volume = 0.4;

let allQuestionsData = null;
let allAvailableQuestions = [];
let currentRoundQuestions = [];
let currentQuestionIndex = 0;
let totalScore = 0;
let roundScore = 0;
let answeredQuestions = 0;
let playerName = 'Peregrino';
let currentMode = 'antigo';
let isAnswerLocked = false;
let questionTimer = null;

const answerLetters = ['A', 'B', 'C', 'D'];

function shuffle(array) {
  const items = [...array];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

async function loadQuestions() {
  try {
    const response = await fetch('./questions.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar as perguntas.');
    const data = await response.json();
    for (const mode of ['antigo', 'novo']) {
      if (!Array.isArray(data[mode]) || data[mode].some(q =>
        typeof q.question !== 'string' || !Array.isArray(q.options) ||
        q.options.length !== 4 || !Number.isInteger(q.answer) ||
        q.answer < 0 || q.answer > 3
      )) throw new Error('O banco de perguntas contém dados inválidos.');
    }
    allQuestionsData = data;
    document.querySelectorAll('.testament-card').forEach(button => button.disabled = false);
  } catch (error) {
    console.error(error);
    const feedback = document.getElementById('answerFeedback');
    if (feedback) {
      feedback.textContent = 'Não foi possível carregar as perguntas. Atualize a página e tente novamente.';
      feedback.className = 'answer-feedback bad';
    }
    document.querySelectorAll('.testament-card').forEach(button => button.disabled = true);
  }
}

function playSound(audio) {
  if (!audio) return;
  audio.currentTime = 0;
  const playback = audio.play();
  if (playback && typeof playback.catch === 'function') playback.catch(() => {});
}

function stopMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

function initGame(mode) {
  if (!allQuestionsData) {
    const feedback = document.getElementById('answerFeedback');
    if (feedback) feedback.textContent = 'Carregando perguntas. Tente novamente em instantes.';
    return;
  }

  currentMode = mode === 'novo' ? 'novo' : 'antigo';
  playerName = document.getElementById('playerName').value.trim().slice(0, 24) || 'Peregrino';
  document.getElementById('displayName').textContent = playerName;
  document.getElementById('modeTitle').innerHTML = currentMode === 'antigo'
    ? 'ANTIGO <span>TESTAMENTO</span>'
    : 'NOVO <span>TESTAMENTO</span>';

  allAvailableQuestions = shuffle(allQuestionsData[currentMode]);
  totalScore = 0;
  roundScore = 0;
  answeredQuestions = 0;
  scoreEl.textContent = '0';
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('roundOverScreen').style.display = 'none';
  if (bgMusic) playSound(bgMusic);
  startRound();
}

function startRound() {
  if (allAvailableQuestions.length === 0) {
    endGame();
    return;
  }

  const roundSize = Math.min(QUESTIONS_PER_ROUND, allAvailableQuestions.length);
  currentRoundQuestions = allAvailableQuestions.splice(0, roundSize);
  currentQuestionIndex = 0;
  roundScore = 0;
  isAnswerLocked = false;

  document.getElementById('roundOverScreen').style.display = 'none';
  totalQEl.textContent = String(roundSize);
  document.getElementById('remainingLabel').textContent = `${allAvailableQuestions.length} perguntas na jornada`;
  loadQuestion();
}

function loadQuestion() {
  const question = currentRoundQuestions[currentQuestionIndex];
  if (!question) {
    showRoundSummary();
    return;
  }

  isAnswerLocked = false;
  questionText.textContent = question.question;
  currentQEl.textContent = String(currentQuestionIndex + 1);
  document.getElementById('questionNumber').textContent =
    `QUESTÃO ${String(currentQuestionIndex + 1).padStart(2, '0')}`;

  const percent = (currentQuestionIndex / currentRoundQuestions.length) * 100;
  progressBar.style.width = `${percent}%`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow', String(Math.round(percent)));
  document.getElementById('answerFeedback').textContent = '';
  document.getElementById('answerFeedback').className = 'answer-feedback';
  optionsGrid.innerHTML = '';

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-btn';
    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.textContent = answerLetters[index];
    const label = document.createElement('span');
    label.textContent = option;
    button.append(letter, label);
    button.addEventListener('click', () => checkAnswer(index, question.answer, button));
    optionsGrid.appendChild(button);
  });
}

function checkAnswer(selectedIndex, correctIndex, selectedButton) {
  if (isAnswerLocked) return;
  isAnswerLocked = true;
  answeredQuestions++;

  const buttons = [...optionsGrid.querySelectorAll('.option-btn')];
  buttons.forEach(button => button.disabled = true);

  const feedback = document.getElementById('answerFeedback');
  if (selectedIndex === correctIndex) {
    selectedButton.classList.add('correct');
    totalScore += 10;
    roundScore++;
    scoreEl.textContent = String(totalScore);
    feedback.textContent = 'Muito bem! Você acertou. Continue sua jornada!';
    feedback.className = 'answer-feedback good';
    playSound(correctSound);
  } else {
    selectedButton.classList.add('wrong');
    buttons[correctIndex]?.classList.add('correct');
    feedback.textContent = `Não foi dessa vez. A resposta correta é: ${currentRoundQuestions[currentQuestionIndex].options[correctIndex]}.`;
    feedback.className = 'answer-feedback bad';
    playSound(wrongSound);
  }

  questionTimer = window.setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentRoundQuestions.length) {
      loadQuestion();
    } else {
      showRoundSummary();
    }
  }, 1500);
}

function showRoundSummary() {
  if (questionTimer) window.clearTimeout(questionTimer);
  const roundTotal = currentRoundQuestions.length;
  const percentage = Math.round((roundScore / roundTotal) * 100);
  document.getElementById('roundScoreText').textContent =
    `Você acertou ${roundScore} de ${roundTotal} perguntas nesta rodada.`;
  document.getElementById('roundDetails').textContent =
    `${percentage}% de aproveitamento · +${roundScore * 10} pontos nesta etapa · ${allAvailableQuestions.length} perguntas restantes.`;
  document.getElementById('roundTitle').textContent =
    percentage >= 80 ? 'Excelente jornada!' : percentage >= 50 ? 'Você está avançando!' : 'Continue aprendendo!';
  document.getElementById('roundOverScreen').style.display = 'flex';
}

function nextRound() {
  startRound();
}

function stopGame() {
  endGame();
}

function endGame() {
  if (questionTimer) window.clearTimeout(questionTimer);
  stopMusic();
  document.getElementById('roundOverScreen').style.display = 'none';
  const accuracy = answeredQuestions ? Math.round((totalScore / (answeredQuestions * 10)) * 100) : 0;
  document.getElementById('endTitle').textContent = `Jornada concluída, ${playerName}!`;
  const final = document.getElementById('finalScore');
  final.textContent = '';
  const scoreLine = document.createElement('p');
  scoreLine.append('Sua pontuação: ');
  const scoreStrong = document.createElement('strong');
  scoreStrong.textContent = String(totalScore);
  scoreLine.append(scoreStrong, ' pontos');
  const accuracyLine = document.createElement('p');
  accuracyLine.className = 'result-highlight';
  accuracyLine.textContent = `${accuracy}% de aproveitamento`;
  const countLine = document.createElement('p');
  countLine.textContent = `${answeredQuestions} perguntas respondidas`;
  final.append(scoreLine, accuracyLine, countLine);
  document.getElementById('gameOverScreen').style.display = 'flex';
  progressBar.style.width = '100%';
  document.querySelector('.progress-track').setAttribute('aria-valuenow', '100');
}

function restartGame() {
  document.getElementById('gameOverScreen').style.display = 'none';
  allAvailableQuestions = shuffle(allQuestionsData[currentMode]);
  totalScore = 0;
  answeredQuestions = 0;
  scoreEl.textContent = '0';
  if (bgMusic) playSound(bgMusic);
  startRound();
}

function backToMenu() {
  if (questionTimer) window.clearTimeout(questionTimer);
  stopMusic();
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('roundOverScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
  optionsGrid.innerHTML = '';
  questionText.textContent = 'Carregando pergunta...';
  progressBar.style.width = '0%';
  document.querySelector('.progress-track').setAttribute('aria-valuenow', '0');
}

loadQuestions();
