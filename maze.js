const COLS = 20;
const ROWS = 10;
const CELL_SIZE = 48;
const HEART_PATH = [
  [0,4],[1,4],[2,5],[3,6],[4,6],[5,7],[6,7],[7,8],[8,8],
  [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8]
];
const PLAYER_START = { x:0, y:4 };
const VAISH_POS = { x:19, y:8 };

let player = {...PLAYER_START};
let foundVaish = false;
let codeUnlocked = false;

// Sparkle animation
let sparkleAlpha = 0.3;
let sparkleDirection = 1;

const canvas = document.getElementById('maze');
canvas.width = COLS*CELL_SIZE;
canvas.height = ROWS*CELL_SIZE;
const ctx = canvas.getContext('2d');

const mazeContainer = document.getElementById('maze-container');
canvas.focus();

function drawMaze(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Draw cells
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      ctx.strokeStyle = '#fbb1cf';
      ctx.strokeRect(x*CELL_SIZE,y*CELL_SIZE,CELL_SIZE,CELL_SIZE);
    }
  }

  // Draw hearts
  HEART_PATH.forEach(([hx,hy])=>{
    drawHeart(hx*CELL_SIZE+CELL_SIZE/2, hy*CELL_SIZE+CELL_SIZE/2, CELL_SIZE/2.6, '#ff4f93');
  });

  // Draw Vaish sparkle if not yet found
  if(!foundVaish) drawVaish(VAISH_POS.x*CELL_SIZE+CELL_SIZE/2, VAISH_POS.y*CELL_SIZE+CELL_SIZE/2);

  // Draw Vaish if found
  if(foundVaish) drawVaish(VAISH_POS.x*CELL_SIZE+CELL_SIZE/2, VAISH_POS.y*CELL_SIZE+CELL_SIZE/2);

  // Draw player
  drawPlayer(player.x*CELL_SIZE+CELL_SIZE/2, player.y*CELL_SIZE+CELL_SIZE/2);
}

function drawHeart(cx,cy,size,color){
  ctx.save();
  ctx.translate(cx,cy);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.bezierCurveTo(-size/2,-size/2,-size,size/3,0,size);
  ctx.bezierCurveTo(size,size/3,size/2,-size/2,0,0);
  ctx.fillStyle=color;
  ctx.fill();
  ctx.restore();
}

function drawPlayer(cx,cy){
  ctx.save();
  ctx.translate(cx,cy);
  // Head
  ctx.beginPath();
  ctx.arc(0,0,15,0,Math.PI*2);
  ctx.fillStyle="#ffe6b3";
  ctx.fill();
  // Hair
  ctx.beginPath();
  ctx.arc(0,-8,13,Math.PI*1.1,Math.PI*1.9);
  ctx.fillStyle="#5d4037";
  ctx.fill();
  // Eyes
  ctx.beginPath();
  ctx.arc(-5,-4,2,0,Math.PI*2);
  ctx.arc(5,-4,2,0,Math.PI*2);
  ctx.fillStyle="#333";
  ctx.fill();
  // Smile
  ctx.beginPath();
  ctx.arc(0,5,7,0,Math.PI,false);
  ctx.strokeStyle="#c97d1f";
  ctx.lineWidth=2;
  ctx.stroke();
  // Shirt
  ctx.beginPath();
  ctx.arc(0,22,13,Math.PI*0.8,Math.PI*0.2,false);
  ctx.fillStyle="#4fc3f7";
  ctx.fill();
  ctx.restore();
}

function drawVaish(cx,cy){
  ctx.save();
  ctx.translate(cx,cy);

  // Sparkle glow
  ctx.beginPath();
  ctx.arc(0,0,25,0,Math.PI*2);
  ctx.fillStyle = `rgba(255,150,200,${sparkleAlpha})`;
  ctx.fill();

  sparkleAlpha += 0.02 * sparkleDirection;
  if(sparkleAlpha >= 0.6 || sparkleAlpha <= 0.3) sparkleDirection *= -1;

  // Face
  ctx.beginPath();
  ctx.arc(0,0,15,0,Math.PI*2);
  ctx.fillStyle="#ffe6e6";
  ctx.fill();
  // Hair
  ctx.beginPath();
  ctx.arc(0,-8,13,Math.PI*1.1,Math.PI*1.9);
  ctx.fillStyle="#d72660";
  ctx.fill();
  // Bow
  ctx.beginPath();
  ctx.ellipse(6,-12,3,5,Math.PI/6,0,Math.PI*2);
  ctx.ellipse(12,-10,3,5,-Math.PI/6,0,Math.PI*2);
  ctx.fillStyle="#ff69b4";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(9,-11,2,0,Math.PI*2);
  ctx.fillStyle="#fff";
  ctx.fill();
  // Eyes
  ctx.beginPath();
  ctx.arc(-5,-4,2,0,Math.PI*2);
  ctx.arc(5,-4,2,0,Math.PI*2);
  ctx.fillStyle="#333";
  ctx.fill();
  // Smile
  ctx.beginPath();
  ctx.arc(0,7,7,0,Math.PI,false);
  ctx.strokeStyle="#d72660";
  ctx.lineWidth=2;
  ctx.stroke();
  // Dress
  ctx.beginPath();
  ctx.arc(0,22,13,Math.PI*0.8,Math.PI*0.2,false);
  ctx.fillStyle="#fbb1cf";
  ctx.fill();
  ctx.restore();
}

function movePlayer(dx,dy){
  if(foundVaish || codeUnlocked) return;

  let nx=player.x+dx;
  let ny=player.y+dy;
  if(nx<0||nx>=COLS||ny<0||ny>=ROWS) return;

  player.x=nx;
  player.y=ny;

  if(player.x===VAISH_POS.x && player.y===VAISH_POS.y){
    foundVaish=true;
    showCodeEntry();
    showMessage("You found Vaish! 💖");
  } else if(HEART_PATH.some(([hx,hy])=>hx===player.x && hy===player.y)){
    showMessage("A heart! You're on the right path...");
  } else{
    showMessage("");
  }
}

canvas.addEventListener('keydown', (e)=>{
  switch(e.key){
    case 'ArrowUp': movePlayer(0,-1); break;
    case 'ArrowDown': movePlayer(0,1); break;
    case 'ArrowLeft': movePlayer(-1,0); break;
    case 'ArrowRight': movePlayer(1,0); break;
  }
});

canvas.addEventListener('click', ()=>canvas.focus());

function showMessage(msg){
  document.getElementById('message').textContent = msg;
}

function showCodeEntry(){
  const codeDiv=document.getElementById('code-entry');
  codeDiv.style.display="block";
  document.getElementById('secret-code').focus();
}

document.getElementById('submit-code').onclick = function(){
  const code=document.getElementById('secret-code').value.trim().toLowerCase();
  if(code==="i love you"){
    document.getElementById('code-entry').style.display="none";
    const gift=document.getElementById('gift');
    gift.style.display="block";
    gift.classList.add('show');
    codeUnlocked=true;
    showMessage("");
  } else{
    document.getElementById('code-feedback').textContent="That's not the code! Try again 💡";
  }
};

document.getElementById('secret-code').addEventListener('keydown', function(e){
  if(e.key==='Enter') document.getElementById('submit-code').click();
});

// Animation loop
function animate(){
  drawMaze();
  requestAnimationFrame(animate);
}
animate();

canvas.focus();
