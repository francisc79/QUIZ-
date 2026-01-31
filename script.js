// --- ELEMENTOS DO DOM ---
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const scoreEl = document.getElementById('score');
const progressBar = document.getElementById('progressBar');
const currentQEl = document.getElementById('currentQ');
const totalQEl = document.getElementById('totalQ');

// --- SONS ---
const bgMusic = document.getElementById('bgMusic'); 
if(bgMusic) bgMusic.volume = 0.05; // Volume da música (30%)

const correctSound = document.getElementById('correctSound');
if(correctSound) correctSound.volume = 0.6; // Volume do acerto

const wrongSound = document.getElementById('wrongSound');
if(wrongSound) wrongSound.volume = 0.5; // Volume do erro
// --- VARIÁVEIS DE CONTROLE ---
let currentQuestionIndex = 0; // Índice dentro da rodada (0 a 9)
let totalScore = 0;           // Pontuação total do jogo
let roundScore = 0;           // Pontuação apenas desta rodada
let playerName = "";

let allAvailableQuestions = []; // Todas as perguntas do modo escolhido (ex: 150 perguntas)
let currentRoundQuestions = []; // As 10 perguntas da rodada atual
let allQuestionsData = {};      // JSON bruto

const QUESTIONS_PER_ROUND = 10;

// --- CARREGAMENTO DO JSON ---
fetch('./questions.json')
    .then(response => response.json())
    .then(data => {
        allQuestionsData = data;
        console.log("Perguntas carregadas!");
    })
    .catch(error => console.error("Erro JSON:", error));


// --- FUNÇÕES DO JOGO ---

function initGame(mode) {
    if (!allQuestionsData.antigo && !allQuestionsData.novo) {
        alert("Aguarde o carregamento das perguntas...");
        return;
    }
    
// TOCA A MÚSICA DE FUNDO
    if(bgMusic) {
        bgMusic.currentTime = 0; // Reinicia a música do começo
        bgMusic.play().catch(e => console.log("Erro ao tocar música:", e));
    }

    playerName = document.getElementById('playerName').value || "Peregrino";
    document.getElementById('displayName').innerText = playerName;
    // 1. Carrega TODAS as perguntas do modo escolhido
    if (mode === 'antigo') {
        allAvailableQuestions = [...allQuestionsData.antigo];
        document.body.style.background = "linear-gradient(135deg, #e67e22 0%, #f1c40f 100%)"; 
    } else {
        allAvailableQuestions = [...allQuestionsData.novo];
        document.body.style.background = "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)"; 
    }

    // 2. Embaralha tudo uma vez só no começo
    allAvailableQuestions.sort(() => Math.random() - 0.5);

    // 3. Reseta pontuação
    totalScore = 0;
    scoreEl.innerText = totalScore;

    // 4. Prepara a tela
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('roundOverScreen').style.display = 'none';
    
    if(bgMusic) bgMusic.play().catch(e => console.log(e));
   // Função para forçar Tela Cheia (Android)
function enterFullScreen() {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
        doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) { /* Firefox */
        doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) { /* IE/Edge */
        doc.msRequestFullscreen();
    }
}

    // 5. Inicia a primeira rodada
    startRound();
}

function startRound() {
    // Verifica se ainda tem perguntas suficientes
    if (allAvailableQuestions.length < QUESTIONS_PER_ROUND) {
        // Se tiver menos de 10 sobrando, fim de jogo (ou joga o resto)
        endGame();
        return;
    }

    // Pega as próximas 10 perguntas da lista grande
    // O comando splice remove elas da lista original, para não repetirem
    currentRoundQuestions = allAvailableQuestions.splice(0, QUESTIONS_PER_ROUND);

    // Reseta controles da rodada
    currentQuestionIndex = 0;
    roundScore = 0;
    
    document.getElementById('totalQ').innerText = QUESTIONS_PER_ROUND;
    document.getElementById('roundOverScreen').style.display = 'none';
    
    loadQuestion();
}

function loadQuestion() {
    const qData = currentRoundQuestions[currentQuestionIndex];
    
    questionText.innerText = qData.question;
    currentQEl.innerText = currentQuestionIndex + 1;
    
    // Barra de progresso baseada nas 10 perguntas
    const progressPercent = ((currentQuestionIndex) / QUESTIONS_PER_ROUND) * 100;
    progressBar.style.width = `${progressPercent}%`;

    optionsGrid.innerHTML = '';

    qData.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, qData.answer, btn);
        optionsGrid.appendChild(btn);
    });
}
function checkAnswer(selectedIndex, correctIndex, btnElement) {
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.classList.add('no-click'));

    if (selectedIndex === correctIndex) {
        // ACERTOU
        btnElement.classList.add('correct');
        
        // ♫ TOCA SOM DE ACERTO
        if(correctSound) { 
            correctSound.currentTime = 0; // Reinicia o som
            correctSound.play(); 
        }
        
        totalScore += 10;
        roundScore += 1;
        scoreEl.innerText = totalScore;
    } else {
        // ERROU
        btnElement.classList.add('wrong');
        
        // ♫ TOCA SOM DE ERRO
        if(wrongSound) { 
            wrongSound.currentTime = 0; // Reinicia o som
            wrongSound.play(); 
        }
        
        if (allButtons[correctIndex]) {
            allButtons[correctIndex].classList.add('correct');
        }
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentRoundQuestions.length) {
            loadQuestion();
        } else {
            showRoundSummary();
        }
    }, 1500);
}

function showRoundSummary() {
    // Mostra a tela intermediária
    document.getElementById('roundOverScreen').style.display = 'flex';
    document.getElementById('roundScoreText').innerText = 
        `Nesta rodada você acertou ${roundScore} de ${QUESTIONS_PER_ROUND}!`;
}

function nextRound() {
    // O botão "Continuar" chama essa função
    startRound();
}

function stopGame() {
    // O botão "Parar" chama o fim de jogo real
    endGame();
}

function endGame() {
    document.getElementById('roundOverScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('endTitle').innerText = `Fim da Jornada, ${playerName}!`;
    
    // Mensagem final baseada no total acumulado
    document.getElementById('finalScore').innerHTML = `
        Pontuação Final: <strong>${totalScore}</strong> pontos.<br>
        <span style="font-size: 0.9rem; color: #666;">Obrigado por jogar!</span>
    `;
    
    progressBar.style.width = '100%';
    if(bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
}

function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    // Recarrega a cor original
    document.body.style.background = "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)";
}

// Função para forçar Tela Cheia (Android)
function enterFullScreen() {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
        doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) { /* Firefox */
        doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) { /* IE/Edge */
        doc.msRequestFullscreen();
    }
}

// Função para parar sons
function stopMusic() {
    if(bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

function endGame() {
    // ... (código existente de mostrar tela final) ...
    document.getElementById('roundOverScreen').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'flex';
    document.getElementById('endTitle').innerText = `Fim da Jornada, ${playerName}!`;
    
    document.getElementById('finalScore').innerHTML = `
        Pontuação Final: <strong>${totalScore}</strong> pontos.<br>
        <span style="font-size: 0.9rem; color: #666;">Obrigado por jogar!</span>
    `;
    
    progressBar.style.width = '100%';

    // PARA A MÚSICA AQUI
    stopMusic();
}