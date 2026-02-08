const feed = document.getElementById('feed');
const nextBtn = document.getElementById('next-btn');
const streakDisplay = document.getElementById('streak');
const counterDisplay = document.getElementById('counter');
const confettiCanvas = document.getElementById('confetti-canvas');
const calendarGrid = document.getElementById('calendar-grid');
const badgesDisplay = document.getElementById('badges-display');

let streak = Number(localStorage.getItem('streak') || 0);
let counter = Number(localStorage.getItem('counter') || 0);
streakDisplay.textContent = `Streak: ${streak} jours`;
counterDisplay.textContent = `${counter} phrases lues`;

const pseudo = prompt("Ton pseudo ?") || "Utilisateur";

const phrases = [
  `${pseudo}, chaque message que tu n'envoies pas te rend plus fort.`,
  `Ils pensent à toi… mais tu restes invisible.`,
  `Regarde ton téléphone… ce silence te rend libre.`,
  `Chaque jour sans message augmente ton pouvoir.`,
  `${pseudo}, tu ignores tout et tu gagnes chaque seconde.`,
];

function showPhrase() {
  const index = Math.floor(Math.random() * phrases.length);
  feed.textContent = phrases[index];
  counter++;
  localStorage.setItem('counter', counter);
  counterDisplay.textContent = `${counter} phrases lues`;
  triggerConfetti();
}

nextBtn.addEventListener('click', showPhrase);

function triggerConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  for(let i=0;i<50;i++){
    ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
    ctx.fillRect(Math.random()*confettiCanvas.width, Math.random()*confettiCanvas.height,5,10);
  }
  setTimeout(()=>ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height), 500);
}

setTimeout(() => {
  document.getElementById('splash').style.display = 'none';
}, 2000);

document.getElementById('save-mood').addEventListener('click', ()=>{
  const mood = document.getElementById('mood').value;
  const note = document.getElementById('personal-note').value;
  localStorage.setItem('mood', mood);
  localStorage.setItem('note', note);
  document.getElementById('mood-display').textContent = `Humeur: ${mood} | Note: ${note}`;
  streak++;
  localStorage.setItem('streak', streak);
  streakDisplay.textContent = `Streak: ${streak} jours`;
  updateBadges();
  updateCalendar();
});

document.getElementById('share-btn').addEventListener('click', ()=>{
  const text = `Mon streak Echo: ${streak} jours! #NoContact`;
  if(navigator.share){
    navigator.share({text});
  } else {
    alert("Copie ceci pour partager: " + text);
  }
});

function updateBadges() {
  badgesDisplay.innerHTML = '';
  if(streak >= 1) addBadge('Débutant');
  if(streak >= 3) addBadge('Persistant');
  if(streak >= 7) addBadge('Déterminé');
  if(streak >= 14) addBadge('Maître du silence');
  if(streak >= 30) addBadge('Légende du No Contact');
}

function addBadge(name){
  const b = document.createElement('div');
  b.className = 'badge';
  b.textContent = name;
  badgesDisplay.appendChild(b);
}

function updateCalendar() {
  calendarGrid.innerHTML = '';
  for(let i=1; i<=30; i++){
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;
    if(i <= streak){
      day.style.background = 'rgba(255,255,255,0.5)';
    }
    day.addEventListener('click', ()=>{
      const note = prompt("Ajouter une note pour ce jour :", localStorage.getItem(`note-${i}`) || '');
      if(note !== null){
        localStorage.setItem(`note-${i}`, note);
        day.style.background = 'rgba(255,255,255,0.7)';
      }
    });
    calendarGrid.appendChild(day);
  }
}

updateBadges();
updateCalendar();
