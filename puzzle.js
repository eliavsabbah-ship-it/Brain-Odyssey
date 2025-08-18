/* puzzle.js — updated with clear instructions + hints */

/* ===== Utilities (same as before) ===== */
function mulberry32(a){
  return function(){
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
function seedFromDate(d=new Date()){
  const s = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
  return s ^ 0x9E3779B9;
}
function choice(rng, arr){ return arr[(rng()*arr.length)|0] }
function int(rng, a, b){ return a + (rng()*((b-a)+1)|0) }
function shuffle(rng, arr){ for(let i=arr.length-1;i>0;i--){ const j=(rng()*(i+1))|0; [arr[i],arr[j]]=[arr[j],arr[i]] } return arr }
function norm(str){ return (str||"").toString().trim().toUpperCase().replace(/\s+/g,"") }

/* ===== DOM refs ===== */
const boardEl = document.getElementById('board');
const instructionsEl = document.getElementById('instructions');
const inputEl = document.getElementById('userAnswer');
const submitBtn = document.getElementById('submitAnswer');
const feedbackEl = document.getElementById('feedback');
const modeLabel = document.getElementById('modeLabel');
const seedLabel = document.getElementById('seedLabel');

/* ===== Streak ===== */
function updateStreak(){
  const today = new Date().toDateString();
  let streak = parseInt(localStorage.getItem('pq_streak')||"0",10);
  const last = localStorage.getItem('pq_last')||"";
  if(last !== today){
    streak++;
    localStorage.setItem('pq_streak', String(streak));
    localStorage.setItem('pq_last', today);
  }
  document.getElementById('streakCount').textContent = String(streak);
}
(function initStreak(){
  const s = parseInt(localStorage.getItem('pq_streak')||"0",10);
  document.getElementById('streakCount').textContent = String(s);
})();

/* ===== Small UI helpers for instructions & hints ===== */
function renderInstructionBlock(opts){
  // opts: {title, goal, steps:[], inputFormat, example, hint}
  const hintId = 'hint-' + Math.floor(Math.random()*1e9);
  instructionsEl.innerHTML = `
    <h3>${opts.title}</h3>
    <p><strong>Goal:</strong> ${opts.goal}</p>
    <div style="text-align:left; margin-top:8px;">
      <strong>How to solve (step-by-step):</strong>
      <ol>
        ${opts.steps.map(s=>`<li>${s}</li>`).join('')}
      </ol>
    </div>
    <p><strong>Input format:</strong> ${opts.inputFormat}</p>
    ${opts.example ? `<p><strong>Example:</strong> ${opts.example}</p>` : ''}
    <div style="margin-top:10px;">
      <button id="${hintId}" class="btn sm">Show Hint</button>
      <span id="${hintId}-text" style="margin-left:12px; color:#ffd; display:none"></span>
    </div>
  `;
  const hintBtn = document.getElementById(hintId);
  const hintText = document.getElementById(hintId + '-text');
  hintBtn.addEventListener('click', ()=>{
    hintText.style.display = 'inline';
    hintText.textContent = opts.hint || 'Try breaking the puzzle into smaller parts. Use parity and local moves.';
    hintBtn.disabled = true;
  });
}

/* ===== Mode list & RNG ===== */
const MODES = [
  "ASCII Maze",
  "Memory Sequence",
  "Logic Gates",
  "Lights Out",
  "Caesar Cipher",
  "Substitution",
  "Binary/Hex Decode"
];
let currentModeIndex = 0;
let rng = mulberry32(seedFromDate());

/* ===== Small display helpers (pre-fit) ===== */
function clearBoard(){
  boardEl.innerHTML = "";
  boardEl.style.display = "grid";
  boardEl.style.gridTemplateColumns = "";
  boardEl.style.alignItems = boardEl.style.justifyItems = "stretch";
}
function renderPre(text){
  clearBoard();
  const pre = document.createElement('pre');
  pre.textContent = text;
  boardEl.appendChild(pre);
  fitPreToSquare(pre);
  window.onresize = () => fitPreToSquare(pre);
}
function fitPreToSquare(pre){
  // quick font-size fit to area (binary search)
  let low=8, high=48, best=14;
  while(low<=high){
    const mid=(low+high)>>1;
    pre.style.fontSize = mid + 'px';
    if(pre.scrollWidth <= pre.clientWidth && pre.scrollHeight <= pre.clientHeight){
      best = mid; low = mid + 1;
    } else high = mid - 1;
  }
  pre.style.fontSize = best + 'px';
}
function setFeedback(msg, ok){
  feedbackEl.textContent = msg||"";
  feedbackEl.style.color = ok ? "#9cff9c" : "#ffd2d2";
}

/* ===== onSolved helper ===== */
function onSolved(note){
  instructionsEl.insertAdjacentHTML('beforeend', `<p style="color:#9cff9c;"><strong>✓ Solved!</strong> ${note||""}</p>`);
}

/* ===== Mode: Lights Out (with clear instructions) ===== */
function buildLightsOut(){
  modeLabel.textContent = "Lights Out";
  seedLabel.textContent = "daily";
  const N = 6;
  clearBoard();
  boardEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;

  const state = Array.from({length:N}, ()=>Array(N).fill(false));
  function toggle(r,c){
    [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{
      const rr=r+dr, cc=c+dc;
      if(rr>=0 && rr<N && cc>=0 && cc<N) state[rr][cc] = !state[rr][cc];
    });
  }
  const moves = 16 + (rng()*16|0);
  for(let m=0;m<moves;m++) toggle((rng()*N)|0,(rng()*N)|0);

  const cells=[];
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      const div=document.createElement('div');
      div.className="cell "+(state[r][c]?'on':'off');
      div.tabIndex = 0;
      div.addEventListener('click', ()=>{
        toggle(r,c); refresh(); if(isSolved()) onSolved("Type DONE and Submit to record your streak.");
      });
      div.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); div.click(); }});
      cells.push(div); boardEl.appendChild(div);
    }
  }
  function refresh(){ for(let r=0;r<N;r++) for(let c=0;c<N;c++) cells[r*N+c].className = 'cell ' + (state[r][c]?'on':'off'); }
  function isSolved(){ for(let r=0;r<N;r++) for(let c=0;c<N;c++) if(state[r][c]) return false; return true; }

  renderInstructionBlock({
    title: 'Lights Out',
    goal: 'Turn every cell OFF (dark).',
    steps: [
      'Click any cell: that cell and its orthogonal neighbors toggle (on↔off).',
      'Plan moves ahead — toggles affect neighbors. Try systematic patterns or linear algebra techniques if curious.',
      'When all cells are OFF, type DONE in the box and press Submit to record your streak.'
    ],
    inputFormat: 'Type DONE (case-insensitive) when all cells are off.',
    example: 'If board shows all dark squares, type DONE.',
    hint: 'Try focusing on one row at a time; toggling the same cell twice cancels the move.'
  });

  submitBtn.onclick = ()=>{
    const val = norm(inputEl.value);
    if(val !== 'DONE'){ setFeedback('Type DONE when the board is fully dark.', false); return; }
    if(isSolved()){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not solved yet.', false);
  };
}

/* ===== Mode: ASCII Maze (with clear instructions) ===== */
function buildAsciiMaze(){
  modeLabel.textContent = "ASCII Maze";
  seedLabel.textContent = "daily";
  // odd dims for maze structure
  const W = 21, H = 21;
  const maze = Array.from({length:H}, ()=>Array(W).fill('#'));
  function carve(x,y){
    maze[y][x] = ' ';
    const dirs = shuffle(rng, [[2,0],[-2,0],[0,2],[0,-2]]);
    for(const [dx,dy] of dirs){
      const nx=x+dx, ny=y+dy;
      if(nx>0 && nx<W-1 && ny>0 && ny<H-1 && maze[ny][nx]==='#'){
        maze[y+dy/2][x+dx/2] = ' ';
        carve(nx,ny);
      }
    }
  }
  carve(1,1);
  maze[1][1] = 'S';
  maze[H-2][W-2] = 'E';
  let px=1, py=1;

  function render(){
    const copy = maze.map(r=>r.slice());
    copy[py][px] = '@';
    renderPre(copy.map(r=>r.join('')).join('\n'));
  }
  render();

  renderInstructionBlock({
    title: 'ASCII Maze',
    goal: 'Navigate from S (start) to E (exit) using arrow keys.',
    steps: [
      'Use arrow keys to move the @ symbol through open spaces (represented by spaces).',
      'Walls are # characters — you cannot move through them.',
      'Reach the E cell. When you stand on E, type DONE and press Submit to record your streak.'
    ],
    inputFormat: 'Type DONE when your position is the exit (E).',
    example: 'If @ is on the same cell as E, type DONE.',
    hint: 'Try hugging one wall or exploring systematically (always turn right/left) to avoid getting lost.'
  });

  function handle(e){
    const key = e.key;
    let nx = px, ny = py;
    if(key === 'ArrowUp') ny--;
    else if(key === 'ArrowDown') ny++;
    else if(key === 'ArrowLeft') nx--;
    else if(key === 'ArrowRight') nx++;
    else return;
    e.preventDefault();
    if(maze[ny] && maze[ny][nx] && maze[ny][nx] !== '#'){
      px = nx; py = ny; render();
      if(maze[py][px] === 'E') onSolved("Type DONE and Submit to record your streak.");
    }
  }
  window.onkeydown = handle;

  submitBtn.onclick = ()=>{
    const val = norm(inputEl.value);
    if(val !== 'DONE'){ setFeedback('Type DONE when you stand on E.', false); return; }
    if(maze[py][px] === 'E'){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not at exit yet.', false);
  };
}

/* ===== Mode: Memory Sequence (clear instructions) ===== */
function buildMemory(){
  modeLabel.textContent = "Memory Sequence";
  seedLabel.textContent = "daily";
  clearBoard();
  const pre = document.createElement('pre'); boardEl.appendChild(pre);

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // unambiguous set
  const len = int(rng, 7, 10);
  let seq = "";
  for(let i=0;i<len;i++) seq += alphabet[(rng()*alphabet.length)|0];

  function showSeq(){ pre.textContent = "\n\n\n" + seq.split('').join(' '); fitPreToSquare(pre); }
  function hideSeq(){ pre.textContent = "\n\n\n" + "• ".repeat(len).trim(); fitPreToSquare(pre); }

  showSeq();
  setTimeout(hideSeq, 3000);

  renderInstructionBlock({
    title: 'Memory Sequence',
    goal: 'Memorize a short sequence shown for 3 seconds, then type it exactly.',
    steps: [
      `Watch the sequence for three seconds — you will then see placeholders.`,
      'Type the sequence exactly (no spaces) into the input box and press Submit.',
      'Be careful with letter order; this tests short-term memory.'
    ],
    inputFormat: 'Type the sequence exactly, e.g. ABCDEF (no spaces).',
    example: `If sequence shown was ${seq.slice(0,6)}..., type whole sequence back.`,
    hint: 'Group the sequence into chunks (3–4 characters) to remember more reliably.'
  });

  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").trim().toUpperCase().replace(/\s+/g,'');
    if(!val){ setFeedback('Enter the sequence you saw.', false); return; }
    if(val === seq){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not correct. Try again.', false);
  };
}

/* ===== Mode: Logic Gates (clear instructions) ===== */
function buildLogicGates(){
  modeLabel.textContent = "Logic Gates";
  seedLabel.textContent = "daily";
  clearBoard();
  const N = 4;
  boardEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;

  let inputs = Array.from({length:N}, ()=> (rng()<0.5?0:1));
  const labels = ['A','B','C','D'];
  function randGate(){ return choice(rng, ['AND','OR','XOR']) }
  function leaf(i){ return {var:i} }
  function combine(a,b,op){ return {op,a,b} }
  let expr = combine(
    combine(leaf(0), leaf(1), randGate()),
    combine(leaf(2), leaf(3), randGate()),
    randGate()
  );
  if(rng() < 0.4) expr = {op:'NOT', a:expr};
  function evalExpr(node){
    if(node.var !== undefined) return inputs[node.var];
    if(node.op === 'NOT') return evalExpr(node.a) ? 0 : 1;
    const L = evalExpr(node.a), R = evalExpr(node.b);
    if(node.op === 'AND') return (L & R);
    if(node.op === 'OR') return (L | R);
    if(node.op === 'XOR') return (L ^ R);
    return 0;
  }
  const target = rng() < 0.5 ? 0 : 1;

  // render toggles:
  const cells = [];
  for(let i=0;i<N;i++){
    const d = document.createElement('div');
    d.className = 'cell ' + (inputs[i] ? 'on' : 'off');
    d.textContent = labels[i] + ': ' + inputs[i];
    d.tabIndex = 0;
    d.addEventListener('click', ()=>{
      inputs[i] ^= 1;
      d.className = 'cell ' + (inputs[i] ? 'on' : 'off');
      d.textContent = labels[i] + ': ' + inputs[i];
      if(evalExpr(expr) === target) onSolved("Type DONE and Submit to record your streak.");
    });
    d.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); d.click(); }});
    cells.push(d); boardEl.appendChild(d);
  }

  function exprToText(node){
    if(node.var !== undefined) return labels[node.var];
    if(node.op === 'NOT') return 'NOT(' + exprToText(node.a) + ')';
    return '(' + exprToText(node.a) + ' ' + node.op + ' ' + exprToText(node.b) + ')';
  }

  renderInstructionBlock({
    title: 'Logic Gates',
    goal: `Toggle inputs A–D so the expression equals ${target}.`,
    steps: [
      'Click an input cell to toggle its value between 0 and 1.',
      'The expression (displayed below) updates logically; your goal is to make it equal the target.',
      'When expression evaluates to the target, type DONE and Submit to record your streak.'
    ],
    inputFormat: 'Type DONE when the expression equals the target value.',
    example: `If expression is (A AND B) XOR (C OR D) = 1, set inputs so it evaluates to 1.`,
    hint: 'Work backward: try to force sub-expressions to the needed values then set leaves accordingly.'
  });

  instructionsEl.insertAdjacentHTML('beforeend', `<p style="margin-top:8px"><strong>Expression:</strong> <code>${exprToText(expr)}</code></p>`);

  submitBtn.onclick = ()=>{
    const val = norm(inputEl.value);
    if(val !== 'DONE'){ setFeedback('Type DONE when the expression equals the target.', false); return; }
    if(evalExpr(expr) === target){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not satisfied yet.', false);
  };
}

/* ===== Mode: Caesar Cipher (clear instructions) ===== */
function buildCaesar(){
  modeLabel.textContent = "Caesar Cipher";
  seedLabel.textContent = "daily";
  clearBoard();
  const phrases = ["LOGIC","PUZZLE","BRAINPOWER","HARDMODE","GRIDSHIFT","PARITY","TOGGLE"];
  const plain = choice(rng, phrases);
  const shift = int(rng, 1, 25);
  function enc(p){ return p.replace(/[A-Z]/g, ch=> String.fromCharCode(65+((ch.charCodeAt(0)-65 + shift)%26)) ); }
  const cipher = enc(plain);
  renderPre(`Ciphertext:\n\n   ${cipher}\n\nDecode the word.`);

  renderInstructionBlock({
    title: 'Caesar Cipher',
    goal: 'Determine the original plaintext word that was shifted by a constant amount.',
    steps: [
      'A Caesar cipher shifts every letter forward by the same number of places (wrapping at Z).',
      'Try shifts systematically (e.g., shift back 1, 2, 3...) until you find a real word.',
      'Submit the plaintext (uppercase letters).'
    ],
    inputFormat: 'Type the decoded word in uppercase, e.g. PUZZLE',
    example: `Cipher QVAAMF -> shift back 1 -> PUZZLE`,
    hint: 'Start by shifting a few letters back: Q->P, V->U; does that form a real word?'
  });

  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").toUpperCase().replace(/[^A-Z]/g,"");
    if(!val){ setFeedback('Enter your plaintext guess.', false); return; }
    if(val === plain){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not correct.', false);
  };
}

/* ===== Mode: Simple Substitution (clear instructions) ===== */
function buildSubstitution(){
  modeLabel.textContent = "Substitution";
  seedLabel.textContent = "daily";
  clearBoard();

  const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const key = shuffle(rng, alph.slice()).join("");
  const phrases = ["LOGIC GATES","MAZE RUNNER","HARD PUZZLE","DAILY CHALLENGE","TOGGLE GRID","BINARY CODE"];
  const plain = choice(rng, phrases).replace(/[^A-Z]/gi,"").toUpperCase();
  const map = {}; for(let i=0;i<26;i++){ map[String.fromCharCode(65+i)] = key[i]; }
  const cipher = plain.replace(/[A-Z]/g, ch=>map[ch]);

  renderPre(`Ciphertext:\n\n   ${cipher}\n\nMonoalphabetic substitution. Find the plaintext.`);

  renderInstructionBlock({
    title: 'Simple Substitution',
    goal: 'Replace each ciphertext letter with the correct plaintext letter (monoalphabetic).',
    steps: [
      'Each plaintext letter was consistently replaced by another letter (one-to-one mapping).',
      'Look for repeated patterns, word lengths, and letter frequencies to map ciphertext→plaintext.',
      'Submit the plaintext letters together (no spaces) in uppercase.'
    ],
    inputFormat: 'Type the plaintext (uppercase, without spaces).',
    example: 'If ciphertext maps to HELLOWORLD, type HELLOWORLD',
    hint: 'Find repeated letters in the ciphertext — they usually correspond to repeated plaintext letters (e.g., double letters).'
  });

  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").toUpperCase().replace(/[^A-Z]/g,"");
    if(!val){ setFeedback('Enter your plaintext guess (no spaces).', false); return; }
    if(val === plain.replace(/\s+/g,"")){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not correct.', false);
  };
}

/* ===== Mode: Binary/Hex Decode (clear instructions) ===== */
function buildBinHex(){
  modeLabel.textContent = "Binary/Hex Decode";
  seedLabel.textContent = "daily";
  clearBoard();

  const words = ["LOGIC","PUZZLE","PARITY","TOGGLE","BINARY","MAZE","CIPHER","VECTOR"];
  const plain = (choice(rng, words) + " " + choice(rng, words)).toUpperCase();
  const mode = rng() < 0.5 ? "HEX" : "BIN";
  function toHex(s){ return Array.from(s).map(ch=>ch.charCodeAt(0).toString(16).padStart(2,'0')).join(' ') }
  function toBin(s){ return Array.from(s).map(ch=>ch.charCodeAt(0).toString(2).padStart(8,'0')).join(' ') }
  const coded = mode === "HEX" ? toHex(plain) : toBin(plain);
  renderPre(`${mode} string:\n\n   ${coded}\n\nDecode to ASCII (uppercase letters & space).`);

  renderInstructionBlock({
    title: 'Binary/Hex Decoding',
    goal: 'Translate a series of binary or hex values into their ASCII plaintext.',
    steps: [
      'Split the string into bytes (8-bit) if binary, or pairs of hex digits.',
      'Convert each chunk to its decimal ASCII code and map to characters.',
      'Submit the resulting plaintext (uppercase with a space between words).'
    ],
    inputFormat: 'Type the decoded plaintext (e.g., HELLO WORLD).',
    example: mode==='HEX' ? 'E.g., 48 45 4C 4C 4F -> HELLO' : 'E.g., 01001000 01000101 -> HE',
    hint: 'For BIN, split every 8 bits. For HEX, split by 2 digits. Use a quick ASCII reference if needed.'
  });

  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").toUpperCase().replace(/[^A-Z ]/g,"").trim();
    if(!val){ setFeedback('Enter the decoded text.', false); return; }
    if(val === plain){ setFeedback('✅ Correct! Streak +1.', true); updateStreak(); } else setFeedback('❌ Not correct.', false);
  };
}

/* ===== Top-level loader: picks mode and loads ===== */
function loadMode(name, daily){
  seedLabel.textContent = daily ? "daily" : "random";
  instructionsEl.innerHTML = "";
  inputEl.value = ""; setFeedback("", true);
  window.onkeydown = null;

  // route to builder functions:
  if(name === "Lights Out") buildLightsOut();
  else if(name === "ASCII Maze") buildAsciiMaze();
  else if(name === "Memory Sequence") buildMemory();
  else if(name === "Logic Gates") buildLogicGates();
  else if(name === "Caesar Cipher") buildCaesar();
  else if(name === "Substitution") buildSubstitution();
  else if(name === "Binary/Hex Decode") buildBinHex();

  modeLabel.textContent = name;
}

/* Controls (buttons hooked in HTML) */
document.getElementById('newDaily').addEventListener('click', ()=>{
  rng = mulberry32(seedFromDate());
  loadMode(MODES[currentModeIndex], true);
});
document.getElementById('newRandom').addEventListener('click', ()=>{
  rng = mulberry32((Math.random()*1e9|0) ^ Date.now());
  loadMode(MODES[currentModeIndex], false);
});
document.getElementById('switchMode').addEventListener('click', ()=>{
  currentModeIndex = (currentModeIndex + 1) % MODES.length;
  loadMode(MODES[currentModeIndex], true);
});

/* Initial: rotate by calendar day for variety */
(function init(){
  const day = new Date().getDate();
  currentModeIndex = day % MODES.length;
  rng = mulberry32(seedFromDate());
  loadMode(MODES[currentModeIndex], true);
})();
