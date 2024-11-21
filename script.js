let tape = [];
let headPosition = 0;
let currentState = 'q0'; 
let steps = 0; 
const transitions = {
  q0: {
    '•': ['q0', '•', 'D'], 
    'a': ['q0', 'a', 'D'], 
    'b': ['q1', 'Y', 'D']  
  },
  q1: {
    'b': ['q2', 'Y', 'E'], 
  },
  q2: {
    'a': ['q3', 'X', 'D'],
    'X': ['q2', 'X', 'E'],
    'Y': ['q2', 'Y', 'E'],
  },
  q3: {
    'b': ['q1', 'Y', 'D'],
    'X': ['q3', 'X', 'D'],
    'Y': ['q3', 'Y', 'D'],
    'ß': ['q4', 'ß', 'E'],
  },
  q4: {
    '•': ['q5', '•', 'D'], 
    'X': ['q4', 'X', 'E'],
    'Y': ['q4', 'Y', 'E'],
  },
  q5: {
    
  }
};

function init() {
  const input = document.getElementById('tapeInput').value;
  if (input === "" || !/^[a-z]+$/.test(input)) {
    alert("Por favor, insira uma fita.");
    return;
  }

  tape = ['•', ...input.split(''), 'ß'];
  headPosition = 0;
  currentState = 'q0';
  steps = 0;
  render();
  document.getElementById('status').innerText = 'Estado Atual: q0';
  document.getElementById('headPosition').innerText = `Cabeçote na posição: 0`;
  document.getElementById('log').innerHTML = '';
  document.getElementById('startAuto').disabled = false;
  document.getElementById('stepButton').disabled = false;
  document.getElementById('stopAuto').disabled = false;
}

function render() {
  const tapeDiv = document.getElementById('tape');
  tapeDiv.innerHTML = '';
  tape.forEach((symbol, index) => {
    const cell = document.createElement('div');
    cell.className = 'tape-cell' + (index === headPosition ? ' current-cell' : '');
    cell.innerText = symbol;
    tapeDiv.appendChild(cell);
  });
}

function addToLog(message) {
  const logDiv = document.getElementById('log');
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerText = message;
  logDiv.appendChild(logEntry);
  
  logDiv.scrollTop = logDiv.scrollHeight;
}

let autoInterval = null;

function startAuto() {
  document.getElementById('stepButton').disabled = true;

  if (autoInterval === null) {
    autoInterval = setInterval(() => {
      if (currentState === 'q5') {
        stopAuto(true); 
      } else{
        step();
      }
    }, 500); 
  }
}

function stopAuto(finished) {
  if(!finished){
    document.getElementById('stepButton').disabled = false;
  }
  
  if (autoInterval !== null) {
    clearInterval(autoInterval); 
    autoInterval = null;
  }
}

function step() {
  const currentSymbol = tape[headPosition];

  if (!transitions[currentState] || !transitions[currentState][currentSymbol]) {
      addToLog('Transição inválida! Fita rejeitada.');
      alert(`Fita inválida em ${steps} passos.`);
      document.getElementById('startAuto').disabled = true;
      document.getElementById('stepButton').disabled = true;
      document.getElementById('stopAuto').disabled = true;
      stopAuto(true);
      return;
  }

  const [nextState, writeSymbol, moveDirection] = transitions[currentState][currentSymbol];

  tape[headPosition] = writeSymbol;

  if (moveDirection === 'D') {
      headPosition++;
  } else if (moveDirection === 'E') {
      headPosition--;
  }

  currentState = nextState;

  steps++;

  render();

  document.getElementById('status').innerText = `Estado Atual: ${currentState}`;
  document.getElementById('headPosition').innerText = `Cabeçote na posição: ${headPosition}`;

  addToLog(`Estado: ${currentState}, Próxima posição: ${headPosition}, Símbolo lido: ${currentSymbol}, Símbolo escrito: ${writeSymbol}, Direção: ${moveDirection}`);

  if (currentState === 'q5') {
      addToLog(`Fita válida em ${steps} passos!`);
      alert(`Cadeia aceita! Fita válida em ${steps} passos.`);
      document.getElementById('startAuto').disabled = true;
      document.getElementById('stepButton').disabled = true;
      document.getElementById('stopAuto').disabled = true;
      return; 
  }

  if (headPosition < 0 || headPosition >= tape.length) {
      addToLog('Cabeça da fita saiu dos limites! Fita rejeitada.');
      alert(`Fita rejeitada!`);
      document.getElementById('startAuto').disabled = true;
      document.getElementById('stepButton').disabled = true;
      document.getElementById('stopAuto').disabled = true;
      stopAuto(true);
      return;
  }
}

function reset() {
  document.getElementById('tapeInput').value = '';
  tape = []; 
  headPosition = 0; 
  currentState = 'q0';  
  steps = 0;
  render();
  document.getElementById('status').innerText = '';
  document.getElementById('headPosition').innerText = '';
  document.getElementById('log').innerHTML = ''; 
  document.getElementById('startAuto').disabled = true;
  document.getElementById('stepButton').disabled = true;
  document.getElementById('stopAuto').disabled = true;
}
