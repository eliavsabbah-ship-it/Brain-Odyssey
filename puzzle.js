/* ===== Utilities ===== */
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

/* ===== Decor (fills space subtly) ===== */
ensureDecor();
function ensureDecor(){
  if(document.querySelector('.decor')) return;
  const decor = document.createElement('div');
  decor.className = 'decor';
  for(let i=0;i<36;i++){
    const b = document.createElement('div');
    b.className = 'bubble';
    b.style.left = (Math.random()*100)+'vw';
    b.style.animationDelay = (Math.random()*18)+'s';
    b.style.opacity = (0.25 + Math.random()*0.5).toFixed(2);
    b.style.filter = `blur(${(Math.random()*1.2).toFixed(2)}px)`;
    b.style.width = b.style.height = (8 + Math.random()*18)+'px';
    decor.appendChild(b);
  }
  document.body.appendChild(decor);
}

/* ===== Modes ===== */
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

/* ===== Common helpers ===== */
function setFeedback(msg, ok){
  feedbackEl.textContent = msg||"";
  feedbackEl.style.color = ok ? "#9cff9c" : "#ffd2d2";
}
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
  // Auto-fit monospace font to square
  fitPreToSquare(pre);
  window.onresize = () => fitPreToSquare(pre);
}
function fitPreToSquare(pre){
  // binary search font-size to fit both width & height
  let low=8, high=40, best=14;
  const lines = pre.textContent.split("\n").length || 1;
  while(low<=high){
    const mid=(low+high)>>1;
    pre.style.fontSize = mid+"px";
    // heuristic check using scroll sizes
    if(pre.scrollWidth <= pre.clientWidth && pre.scrollHeight <= pre.clientHeight){
      best = mid; low = mid+1;
    }else high = mid-1;
  }
  pre.style.fontSize = best+"px";
}

/* ===== Mode: Lights Out ===== */
function buildLightsOut(){
  modeLabel.textContent = "Lights Out";
  const N = 6; // fixed for difficulty & square balance
  clearBoard();
  boardEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;

  const state = Array.from({length:N}, ()=>Array(N).fill(false));
  function toggle(r,c){
    [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr,dc])=>{
      const rr=r+dr, cc=c+dc;
      if(rr>=0 && rr<N && cc>=0 && cc<N){ state[rr][cc]=!state[rr][cc] }
    });
  }
  // scramble with random legal moves
  const moves = 16 + (rng()*16|0);
  for(let m=0;m<moves;m++){
    toggle((rng()*N)|0, (rng()*N)|0);
  }

  const cells=[];
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      const div=document.createElement('div');
      div.className="cell "+(state[r][c]?'on':'off');
      div.addEventListener('click', ()=>{
        toggle(r,c);
        refresh();
        if(isSolved()){ onSolved("Type DONE and Submit to record your streak."); }
      });
      cells.push(div); boardEl.appendChild(div);
    }
  }
  function refresh(){
    for(let r=0;r<N;r++) for(let c=0;c<N;c++){
      cells[r*N+c].className="cell "+(state[r][c]?'on':'off');
    }
  }
  function isSolved(){
    for(let r=0;r<N;r++) for(let c=0;c<N;c++){
      if(state[r][c]) return false;
    }
    return true;
  }
  instructionsEl.innerHTML = `
    <h3>Lights Out</h3>
    <p>Click a cell to toggle it and its neighbors. Goal: make <strong>all cells dark</strong>.</p>
    <div class="parityHUD">
      <div class="tag">Grid: ${N}×${N}</div>
      <div class="tag">Scramble Moves: ${moves}</div>
      <div class="tag">Difficulty: High</div>
    </div>
  `;
  submitBtn.onclick = ()=>{
    const val = norm(inputEl.value);
    if(val!=="DONE"){ setFeedback("Type DONE when the board is fully dark.", false); return; }
    if(isSolved()){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ Not solved yet.", false);
  };
}

/* ===== Mode: ASCII Maze (arrow keys to move) ===== */
function buildAsciiMaze(){
  modeLabel.textContent = "ASCII Maze";
  // dimensions should be odd for maze (walls between cells)
  const cw = 21, ch = 21; // cell grid ~10x10 + walls, fits square
  const W = cw, H = ch;
  const maze = Array.from({length:H}, ()=>Array(W).fill('#')); // walls
  // carve using randomized DFS
  function carve(x,y){
    maze[y][x]=' ';
    const dirs = shuffle(rng, [[2,0],[-2,0],[0,2],[0,-2]]);
    for(const [dx,dy] of dirs){
      const nx=x+dx, ny=y+dy;
      if(nx>0&&nx<W-1&&ny>0&&ny<H-1 && maze[ny][nx]==='#'){
        maze[y+dy/2][x+dx/2]=' ';
        carve(nx,ny);
      }
    }
  }
  carve(1,1);
  // Start & exit
  maze[1][1]='S';
  maze[H-2][W-2]='E';

  let px=1, py=1; // player pos
  function render(){
    const copy = maze.map(row=>row.slice());
    copy[py][px]='@';
    renderPre(copy.map(r=>r.join('')).join('\n'));
  }
  render();
  instructionsEl.innerHTML = `
    <h3>ASCII Maze</h3>
    <p>Use your <strong>arrow keys</strong> to reach the exit <strong>E</strong>.</p>
    <div class="parityHUD">
      <div class="tag">Size: ${W}×${H}</div>
      <div class="tag">Start: S</div>
      <div class="tag">You: @</div>
    </div>
  `;
  function handle(e){
    const key = e.key;
    let nx=px, ny=py;
    if(key==="ArrowUp") ny--;
    else if(key==="ArrowDown") ny++;
    else if(key==="ArrowLeft") nx--;
    else if(key==="ArrowRight") nx++;
    else return;
    e.preventDefault();
    if(maze[ny] && maze[ny][nx] && maze[ny][nx] !== '#'){
      px=nx; py=ny; render();
      if(maze[py][px]==='E'){ onSolved("Type DONE and Submit to record your streak."); }
    }
  }
  window.onkeydown = handle;
  submitBtn.onclick = ()=>{
    const val = norm(inputEl.value);
    if(val!=="DONE"){ setFeedback("Type DONE when you stand on E.", false); return; }
    if(maze[py][px]==='E'){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ You are not at E yet.", false);
  };
}

/* ===== Mode: Memory Sequence ===== */
function buildMemory(){
  modeLabel.textContent = "Memory Sequence";
  clearBoard();
  // draw centered big sequence inside square
  const pre = document.createElement('pre');
  boardEl.appendChild(pre);
  fitPreToSquare(pre);

  const alph = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous O/0/I/1
  const len = int(rng, 7, 10);
  let seq = "";
  for(let i=0;i<len;i++) seq += alph[(rng()*alph.length)|0];

  function showSeq(){ pre.textContent = "\n\n\n" + seq.split('').join(' '); fitPreToSquare(pre); }
  function hideSeq(){ pre.textContent = "\n\n\n" + "• ".repeat(len).trim(); fitPreToSquare(pre); }

  showSeq();
  setTimeout(hideSeq, 3000);

  instructionsEl.innerHTML = `
    <h3>Memory Sequence</h3>
    <p>Memorize the sequence shown for <strong>3 seconds</strong>, then type it exactly.</p>
    <div class="parityHUD"><div class="tag">Length: ${len}</div></div>
  `;
  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").trim().toUpperCase().replace(/\s+/g,"");
    if(val.length===0){ setFeedback("Enter the sequence you saw.", false); return; }
    if(val===seq){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ Not correct. Try again (press New Random for a different one).", false);
  };
}

/* ===== Mode: Logic Gates (toggle inputs to match target) ===== */
function buildLogicGates(){
  modeLabel.textContent = "Logic Gates";
  // expression of A,B,C,D with AND, OR, XOR, NOT
  const N = 4;
  clearBoard();
  // Create a 2xN grid of toggles for inputs and labels
  boardEl.style.gridTemplateColumns = `repeat(${N}, 1fr)`;

  let inputs = Array.from({length:N}, ()=> (rng()<0.5?0:1));
  const labels = ['A','B','C','D'];
  function randGate(){ return choice(rng, ['AND','OR','XOR']) }
  // Build a random expression tree depth 2–3
  function combine(a,b,op){ return {op, a, b} }
  function leaf(i){ return {var:i} }
  let expr = combine(
    combine(leaf(0), leaf(1), randGate()),
    combine(leaf(2), leaf(3), randGate()),
    randGate()
  );
  // occasional NOT
  if(rng()<0.4) expr = {op:'NOT', a:expr};

  function evalExpr(node){
    if(node.var!==undefined) return inputs[node.var];
    if(node.op==='NOT') return evalExpr(node.a)?0:1;
    const L = evalExpr(node.a), R=evalExpr(node.b);
    if(node.op==='AND') return (L&R);
    if(node.op==='OR')  return (L|R);
    if(node.op==='XOR') return (L^R);
    return 0;
  }
  const target = rng()<0.5?0:1;

  // render toggles
  const cells=[];
  for(let i=0;i<N;i++){
    const d=document.createElement('div');
    d.className = 'cell '+(inputs[i]?'on':'off');
    d.textContent = labels[i]+': '+inputs[i];
    d.addEventListener('click', ()=>{
      inputs[i]^=1;
      d.className='cell '+(inputs[i]?'on':'off');
      d.textContent = labels[i]+': '+inputs[i];
      if(evalExpr(expr)===target){ onSolved("Type DONE and Submit to record your streak."); }
    });
    cells.push(d); boardEl.appendChild(d);
  }
  function exprToText(node){
    if(node.var!==undefined) return labels[node.var];
    if(node.op==='NOT') return 'NOT('+exprToText(node.a)+')';
    return '('+exprToText(node.a)+' '+node.op+' '+exprToText(node.b)+')';
  }
  instructionsEl.innerHTML = `
    <h3>Logic Gates</h3>
    <p>Toggle A–D to satisfy: <code>${exprToText(expr)} = ${target}</code></p>
    <div class="parityHUD">
      <div class="tag">Target Output: ${target}</div>
      <div class="tag">Inputs: click to toggle</div>
      <div class="tag">Difficulty: High</div>
    </div>
  `;
  submitBtn.onclick = ()=>{
    const val = norm(inputEl.value);
    if(val!=="DONE"){ setFeedback("Type DONE when the expression equals the target.", false); return; }
    if(evalExpr(expr)===target){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ Not satisfied yet.", false);
  };
}

/* ===== Mode: Caesar Cipher ===== */
function buildCaesar(){
  modeLabel.textContent = "Caesar Cipher";
  clearBoard();
  const phrases = ["LOGIC", "PUZZLE", "BRAINPOWER", "HARDMODE", "GRIDSHIFT", "PARITY", "TOGGLE"];
  const plain = choice(rng, phrases);
  const shift = int(rng, 1, 25);
  function enc(p){
    return p.replace(/[A-Z]/g, ch=>{
      const c = ch.charCodeAt(0)-65;
      return String.fromCharCode(65+((c+shift)%26));
    });
  }
  const cipher = enc(plain);
  renderPre(`Ciphertext:\n\n   ${cipher}\n\nCaesar shift (unknown). Decode the word.`);
  instructionsEl.innerHTML = `
    <h3>Caesar Cipher</h3>
    <p>Decode the uppercase word. Submit the <strong>plaintext</strong>.</p>
    <div class="parityHUD"><div class="tag">Length: ${plain.length}</div></div>
  `;
  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").trim().toUpperCase().replace(/[^A-Z]/g,"");
    if(!val){ setFeedback("Enter your plaintext guess.", false); return; }
    if(val===plain){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ Not correct.", false);
  };
}

/* ===== Mode: Simple Substitution ===== */
function buildSubstitution(){
  modeLabel.textContent = "Substitution";
  clearBoard();
  const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const key = shuffle(rng, alph.slice()).join("");
  const phrases = [
    "LOGIC GATES", "MAZE RUNNER", "HARD PUZZLE", "DAILY CHALLENGE", "TOGGLE GRID", "BINARY CODE"
  ];
  const plain = choice(rng, phrases).replace(/[^A-Z]/gi,"").toUpperCase();
  const map = {}; for(let i=0;i<26;i++){ map[String.fromCharCode(65+i)] = key[i]; }
  const cipher = plain.replace(/[A-Z]/g, ch=>map[ch]);
  // frequency hint
  renderPre(`Ciphertext:\n\n   ${cipher}\n\nMonoalphabetic substitution.\n(Provide the plaintext.)`);
  instructionsEl.innerHTML = `
    <h3>Simple Substitution</h3>
    <p>Decode the uppercase phrase. Submit the <strong>plaintext without spaces</strong>.</p>
    <div class="parityHUD">
      <div class="tag">Length: ${plain.length}</div>
      <div class="tag">Unique letters: ${new Set(plain).size}</div>
    </div>
  `;
  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").toUpperCase().replace(/[^A-Z]/g,"");
    if(!val){ setFeedback("Enter your plaintext guess (no spaces).", false); return; }
    if(val===plain.replace(/\s+/g,"")){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ Not correct.", false);
  };
}

/* ===== Mode: Binary/Hex Decode ===== */
function buildBinHex(){
  modeLabel.textContent = "Binary/Hex Decode";
  clearBoard();
  const words = ["LOGIC","PUZZLE","PARITY","TOGGLE","BINARY","MAZE","CIPHER","VECTOR"];
  const plain = (choice(rng, words)+" "+choice(rng, words)).toUpperCase();
  const mode = rng()<0.5 ? "HEX" : "BIN";
  function toHex(s){ return Array.from(s).map(ch=>ch.charCodeAt(0).toString(16).padStart(2,'0')).join(' ') }
  function toBin(s){ return Array.from(s).map(ch=>ch.charCodeAt(0).toString(2).padStart(8,'0')).join(' ') }
  const coded = mode==="HEX" ? toHex(plain) : toBin(plain);
  renderPre(`${mode} string:\n\n   ${coded}\n\nDecode to ASCII (uppercase letters & space).`);
  instructionsEl.innerHTML = `
    <h3>Binary/Hex Decoding</h3>
    <p>Translate the ${mode} codes to ASCII. Submit the <strong>plaintext</strong>.</p>
    <div class="parityHUD"><div class="tag">Words: 2</div></div>
  `;
  submitBtn.onclick = ()=>{
    const val = (inputEl.value||"").toUpperCase().replace(/[^A-Z ]/g,"").trim();
    if(!val){ setFeedback("Enter the decoded text.", false); return; }
    if(val===plain){ setFeedback("✅ Correct! Streak +1.", true); updateStreak(); }
    else setFeedback("❌ Not correct.", false);
  };
}

/* ===== Build daily/random & mode switching ===== */
function loadMode(name, daily){
  seedLabel.textContent = daily ? "daily" : "random";
  instructionsEl.innerHTML = "";
  inputEl.value = ""; setFeedback("", true);

  // reset keyboard handlers
  window.onkeydown = null;

  if(name==="Lights Out") buildLightsOut();
  else if(name==="ASCII Maze") buildAsciiMaze();
  else if(name==="Memory Sequence") buildMemory();
  else if(name==="Logic Gates") buildLogicGates();
  else if(name==="Caesar Cipher") buildCaesar();
  else if(name==="Substitution") buildSubstitution();
  else if(name==="Binary/Hex Decode") buildBinHex();
}
function onSolved(note){
  instructionsEl.insertAdjacentHTML('beforeend', `<p><strong>✓ Solved!</strong> ${note||""}</p>`);
}

/* Buttons */
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

/* Initial: rotate mode by calendar day */
(function init(){
  const day = new Date().getDate();
  currentModeIndex = day % MODES.length;
  rng = mulberry32(seedFromDate());
  loadMode(MODES[currentModeIndex], true);
})();
