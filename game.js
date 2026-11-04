(() => {
const $=id=>document.getElementById(id);
const boot=$('boot'),desktop=$('desktop'),startMenu=$('startMenu'),gameWindow=$('gameWindow'),simpleWindow=$('simpleWindow');
let audioCtx;
function beep(freq=660,duration=.12,type='sine',vol=.035){try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.stop(audioCtx.currentTime+duration)}catch(e){}}
function startupSound(){[523,659,784,1046].forEach((n,i)=>setTimeout(()=>beep(n,.25,'sine',.045),i*125))}
$('bootButton').onclick=()=>{startupSound();boot.classList.add('hidden');desktop.classList.remove('hidden');toast('Welcome to BOREDOM XP. Please do not feed the computer.');};
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.add('hidden'),2600)}
function openApp(which){startMenu.classList.add('hidden');if(which==='present'||which==='games'){gameWindow.classList.remove('hidden');$('gameOverlay').classList.remove('hidden');if(which==='games')toast('Present Panic! is currently the only installed game. More chaos coming soon.');}else{simpleWindow.classList.remove('hidden');let title='BOREDOM XP',content='';if(which==='achievements'){title='🏆 Achievements';content='<h2>Your achievements</h2><p>🏅 <b>First Day on the Job</b> — Booted BOREDOM XP.</p><p>🎁 <b>Gift Hunter</b> — Find your first present.</p><p>🏃 <b>Professional Panicker</b> — Sprint for your life.</p><p><small>Achievements are saved on this device.</small></p>'}else if(which==='notepad'){title='📝 Notepad';content='<h2>Untitled - Notepad</h2><textarea style="width:100%;height:120px;border:1px solid #9aa7b5;padding:8px;font:13px monospace" placeholder="Dear diary, today I opened a suspicious computer..."></textarea><p><small>Local notes are not saved yet. This is a very basic notepad.</small></p>'}else if(which==='recycle'){title='🗑️ Recycle Bin';content='<h2>Recycle Bin is empty</h2><p>Nothing here. Unlike your schedule, which is full of panic.</p>'}else{title='🎮 Games';content='<h2>Installed games</h2><p>🛒 <b>Present Panic!</b> — AVAILABLE NOW</p><p>More games are being assembled in a questionable basement.</p><button class="xp-button" id="launchPresent">Play Present Panic!</button>'}
$('simpleTitle').textContent=title;$('simpleContent').innerHTML=content;const launch=$('launchPresent');if(launch)launch.onclick=()=>{simpleWindow.classList.add('hidden');gameWindow.classList.remove('hidden');$('gameOverlay').classList.remove('hidden')};}}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openApp(b.dataset.open)));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).classList.add('hidden')));
document.querySelectorAll('[data-minimize]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.minimize).classList.add('hidden')));
$('startButton').onclick=()=>{startMenu.classList.toggle('hidden');beep(420,.07)};
$('shutdown').onclick=()=>{desktop.classList.add('hidden');boot.classList.remove('hidden');startMenu.classList.add('hidden')};
function updateClock(){const d=new Date();$('clock').textContent=d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}updateClock();setInterval(updateClock,10000);

// Game engine
const canvas=$('game'),ctx=canvas.getContext('2d'),W=900,H=590;
const missions=[
 {text:'Find a romantic novel for your sister ❤️',category:'LITERATURE',item:'ROMANCE NOVEL',budget:299,emoji:'📕',price:249},
 {text:'Find wireless headphones for your brother 🎧',category:'ELECTRONICS',item:'WIRELESS HEADPHONES',budget:899,emoji:'🎧',price:799},
 {text:'Find a cuddly teddy bear for your cousin 🧸',category:'TOYS',item:'TEDDY BEAR',budget:399,emoji:'🧸',price:299},
 {text:'Find a bottle of perfume for your mum 🌸',category:'COSMETICS',item:'FLOWER PERFUME',budget:599,emoji:'🧴',price:499},
 {text:'Find a ridiculous garden gnome for grandpa 🧙',category:'HOME & GARDEN',item:'GARDEN GNOME',budget:349,emoji:'🧙',price:199}
];
const sections=[
 {name:'LITERATURE',x:65,y:65,w:190,h:105,color:'#d5a76f',items:['COOKBOOK','ROMANCE NOVEL','MYSTERY BOOK']},
 {name:'ELECTRONICS',x:350,y:65,w:190,h:105,color:'#80b9d9',items:['PHONE CASE','WIRELESS HEADPHONES','USB CABLE']},
 {name:'TOYS',x:635,y:65,w:190,h:105,color:'#e9a2a2',items:['PUZZLE','TEDDY BEAR','TOY CAR']},
 {name:'COSMETICS',x:65,y:270,w:190,h:105,color:'#e7a8ce',items:['SOAP','FLOWER PERFUME','SHAMPOO']},
 {name:'HOME & GARDEN',x:350,y:270,w:190,h:105,color:'#9cce91',items:['MUG','GARDEN GNOME','FLOWER POT']},
 {name:'SPORTS',x:635,y:270,w:190,h:105,color:'#e8c66e',items:['FOOTBALL','TENNIS BALL','WATER BOTTLE']}
];
let player={x:450,y:520,r:13,speed:2.65},customers=[],mission=missions[0],mode='missions',time=180,remaining=1,found=false,running=false,won=false,lost=false,last=0,keys={},endlessScore=0;
const keysDown=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e')interact()};
const keysUp=e=>keys[e.key.toLowerCase()]=false;
window.addEventListener('keydown',keysDown);window.addEventListener('keyup',keysUp);
function setup(){player={x:450,y:520,r:13,speed:2.65};customers=[];for(let i=0;i<11;i++)customers.push({x:35+Math.random()*830,y:195+Math.random()*340,r:12,speed:.45+Math.random()*.65,dx:Math.random()>.5?1:-1,dy:Math.random()>.5?1:-1,shirt:['#f06b58','#5c91df','#d4a22e','#9a6ac7'][i%4]});time=180;found=false;won=false;lost=false;running=true;endlessScore=0;mission=missions[Math.floor(Math.random()*missions.length)];remaining=mode==='endless'?999:1;updateHUD();$('gameOverlay').classList.add('hidden');$('status').textContent='Find the '+mission.category+' section!';beep(740,.12)}
function updateHUD(){$('missionText').textContent=mode==='endless'?'Collect as many random gifts as you can!':mission.text;$('budget').textContent=mission.budget+' Kč';$('itemCount').textContent=mode==='endless'?String(endlessScore)+' collected':(found?'1 / 1':'0 / 1');}
function interact(){if(!running)return;let near=sections.find(s=>player.x>s.x-8&&player.x<s.x+s.w+8&&player.y>s.y-15&&player.y<s.y+s.h+28);if(!found&&near&&near.name===mission.category){found=true;$('status').textContent='You found it! Now get to CHECKOUT!';toast('FOUND: '+mission.item+'! Now run to checkout!');beep(880,.16,'triangle');updateHUD()}else if(!found&&near){$('status').textContent='Wrong section! This is '+near.name+'.';beep(180,.12,'sawtooth')}else if(found&&player.y>490&&player.x>360&&player.x<540){if(mode==='endless'){endlessScore++;mission=missions[Math.floor(Math.random()*missions.length)];found=false;player.x=450;player.y=520;$('status').textContent='NEXT ORDER! Find '+mission.category+'!';toast('Gift delivered! NEXT CUSTOMER!');updateHUD();beep(900,.15);setTimeout(()=>beep(1100,.18),140)}else{running=false;won=true;toast('MISSION COMPLETE! You made it!');$('status').textContent='MISSION COMPLETE!';$('gameOverlay').classList.remove('hidden');$('gameOverlay').querySelector('.overlay-card').innerHTML='<div class="big-emoji">🎉</div><h2>YOU DID IT!</h2><p>You found the present and survived the store. Your family may never know how close it was.</p><button id="again" class="xp-button">PLAY AGAIN</button>';document.getElementById('again').onclick=setup;beep(900,.2);setTimeout(()=>beep(1100,.25),180)}}else if(!near){$('status').textContent='Nothing to interact with. Find the right shelf or checkout.'}}
function draw(){ctx.clearRect(0,0,W,H);ctx.fillStyle='#e9e6d7';ctx.fillRect(0,0,W,H);
 // tiles
 for(let y=0;y<H;y+=40)for(let x=0;x<W;x+=40){ctx.fillStyle=((x+y)/40)%2?'#eeeadd':'#e8e4d5';ctx.fillRect(x,y,40,40);ctx.strokeStyle='#ded9c9';ctx.strokeRect(x,y,40,40)}
 // entrance and checkout
 ctx.fillStyle='#8fc7a2';ctx.fillRect(345,505,210,85);ctx.fillStyle='#397e52';ctx.font='bold 19px Tahoma';ctx.textAlign='center';ctx.fillText('CHECKOUT →',450,565);
 ctx.fillStyle='#a3a6ad';ctx.fillRect(350,425,200,44);ctx.fillStyle='#273b50';ctx.font='bold 13px Tahoma';ctx.fillText('QUEUE: PLEASE WAIT',450,453);
 // shelves with category signs
 sections.forEach(s=>{ctx.fillStyle='#9b8061';ctx.fillRect(s.x+5,s.y+9,s.w,s.h);ctx.fillStyle=s.color;ctx.fillRect(s.x,s.y,s.w,s.h);ctx.fillStyle='#fff';ctx.fillRect(s.x+8,s.y-23,s.w-16,21);ctx.strokeStyle='#44627c';ctx.lineWidth=2;ctx.strokeRect(s.x+8,s.y-23,s.w-16,21);ctx.fillStyle='#244c72';ctx.font='bold 12px Tahoma';ctx.textAlign='center';ctx.fillText('🪧 '+s.name,s.x+s.w/2,s.y-8);for(let j=0;j<3;j++){ctx.fillStyle=['#fff2c6','#d9e8ff','#f9d9e4'][j];ctx.fillRect(s.x+12+j*56,s.y+27,42,56);ctx.fillStyle='#765a40';ctx.fillRect(s.x+12+j*56,s.y+79,42,5);ctx.font='18px Arial';ctx.fillStyle='#6b5745';ctx.fillText(['📦','🎁','📦'][j],s.x+33+j*56,s.y+60)}});
 // random customers
 customers.forEach(c=>{ctx.fillStyle='#0002';ctx.beginPath();ctx.ellipse(c.x,c.y+12,12,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=c.shirt;ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4c7a1';ctx.beginPath();ctx.arc(c.x,c.y-7,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#252525';ctx.fillRect(c.x-4,c.y-9,2,2);ctx.fillRect(c.x+3,c.y-9,2,2);ctx.fillStyle='#67442e';ctx.fillRect(c.x-7,c.y+11,5,8);ctx.fillRect(c.x+3,c.y+11,5,8)});
 // player
 ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(player.x,player.y+14,14,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#286fd1';ctx.beginPath();ctx.arc(player.x,player.y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f0bd91';ctx.beginPath();ctx.arc(player.x,player.y-7,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#333';ctx.fillRect(player.x-5,player.y-9,3,2);ctx.fillRect(player.x+3,player.y-9,3,2);ctx.fillStyle='#17498e';ctx.fillRect(player.x-9,player.y+9,7,9);ctx.fillRect(player.x+3,player.y+9,7,9);
 // help strip
 ctx.fillStyle='#ffffffdd';ctx.fillRect(8,8,265,24);ctx.fillStyle='#263e59';ctx.font='12px Tahoma';ctx.textAlign='left';ctx.fillText(found?'PRESENT FOUND! RUN TO THE CHECKOUT':'Find '+mission.category+' • Press E at the correct shelf',16,25);
}
function tick(ts){let dt=Math.min((ts-last)/1000||0,.04);last=ts;if(running){time-=dt;if(time<=0){time=0;running=false;lost=true;$('status').textContent='TIME IS UP. THE PARTY HAS STARTED.';$('gameOverlay').classList.remove('hidden');$('gameOverlay').querySelector('.overlay-card').innerHTML='<div class="big-emoji">💀</div><h2>TOO LATE!</h2><p>The birthday party has started. You are holding absolutely nothing. Your aunt is disappointed.</p><button id="again" class="xp-button">RETRY THIS DISASTER</button>';document.getElementById('again').onclick=setup;beep(140,.5,'sawtooth')}
 let dx=0,dy=0;if(keys.w||keys.arrowup)dy--;if(keys.s||keys.arrowdown)dy++;if(keys.a||keys.arrowleft)dx--;if(keys.d||keys.arrowright)dx++;let mag=Math.hypot(dx,dy)||1;let speed=player.speed*(keys.shift?1.65:1);let nx=player.x+dx/mag*speed,ny=player.y+dy/mag*speed;
 if(nx>18&&nx<W-18)player.x=nx;if(ny>35&&ny<H-12)player.y=ny;
 customers.forEach(c=>{c.x+=c.dx*c.speed;c.y+=c.dy*c.speed;if(c.x<18||c.x>W-18)c.dx*=-1;if(c.y<190||c.y>H-35)c.dy*=-1;if(Math.hypot(c.x-player.x,c.y-player.y)<24){player.x-=dx/mag*3;player.y-=dy/mag*3;$('status').textContent='CUSTOMER COLLISION! Excuse you!';}});
 if(Math.random()<.004){customers.forEach(c=>{c.dx=(Math.random()-.5)*2;c.dy=(Math.random()-.5)*2})}
 $('timer').textContent=String(Math.floor(time/60)).padStart(2,'0')+':'+String(Math.floor(time%60)).padStart(2,'0');
 }draw();requestAnimationFrame(tick)}
requestAnimationFrame(tick);
$('playButton').onclick=setup;$('newGame').onclick=setup;$('modeSelect').onchange=e=>{mode=e.target.value;setup()};
})();
