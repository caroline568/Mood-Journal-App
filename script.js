/* =========================
   CalmSpace | Script
   ========================= */

/* --- Mood Tracker --- */
const moodForm = document.getElementById('moodForm');
const moodInput = document.getElementById('mood');
const notesInput = document.getElementById('notes');
const moodList = document.getElementById('moodHistory');

if (moodForm) {
  moodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mood = moodInput.value;
    const notes = notesInput.value;
    const date = new Date().toLocaleString();

    const moodData = { mood, notes, date };
    const moods = JSON.parse(localStorage.getItem('moods')) || [];
    moods.push(moodData);
    localStorage.setItem('moods', JSON.stringify(moods));

    moodForm.reset();
    alert('Mood saved 💚');
  });
}

/* --- Journal --- */
const journalForm = document.getElementById('journalForm');
const journalEntry = document.getElementById('entry');
const journalHistory = document.getElementById('journalHistory');

if (journalForm) {
  journalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entry = journalEntry.value.trim();
    if (!entry) return alert('Write something first 🌸');
    const date = new Date().toLocaleString();

    const journals = JSON.parse(localStorage.getItem('journals')) || [];
    journals.push({ entry, date });
    localStorage.setItem('journals', JSON.stringify(journals));

    journalForm.reset();
    alert('Journal entry saved 💕');
  });
}

/* --- History Page --- */
const lineCanvas = document.getElementById('moodChart');
const barCanvas = document.getElementById('moodBarChart');

if (lineCanvas && barCanvas && moodList) {
  const moods = JSON.parse(localStorage.getItem('moods')) || [];

  // Display mood list
  moods.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('mood-item');
    div.innerHTML = `<strong>${item.date}</strong>: ${item.mood} — ${item.notes}`;
    moodList.appendChild(div);
  });

  // Prepare data for charts
  const moodLabels = moods.map(m => m.date.split(',')[0]);
  const moodValues = moods.map(m => {
    const map = {
      "😄 Happy": 5,
      "😊 Content": 4,
      "😐 Neutral": 3,
      "😔 Sad": 2,
      "😤 Stressed": 1,
      "😡 Angry": 0,
      "😴 Tired": 2,
      "🤗 Grateful": 5,
      "😢 Overwhelmed": 1
    };
    return map[m.mood] || 3;
  });

  // Line Chart: Mood Over Time
  new Chart(lineCanvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: moodLabels,
      datasets: [{
        label: 'Mood Over Time',
        data: moodValues,
        borderColor: '#009688',
        backgroundColor: 'rgba(0,150,136,0.2)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero:true, max:5, ticks:{ stepSize:1 } }
      }
    }
  });

  // Bar Chart: Mood Frequency
  const moodCounts = moods.reduce((acc,m)=>{ acc[m.mood]=(acc[m.mood]||0)+1; return acc; },{});
  new Chart(barCanvas.getContext('2d'),{
    type:'bar',
    data:{
      labels:Object.keys(moodCounts),
      datasets:[{
        label:'Mood Frequency',
        data:Object.values(moodCounts),
        backgroundColor:['#80cbc4','#a5d6a7','#fff59d','#ffcc80','#ef9a9a','#ce93d8','#90caf9','#ffe082','#b39ddb'],
        borderColor:'#004d40',
        borderWidth:1
      }]
    },
    options:{
      indexAxis:'y',
      responsive:true,
      plugins:{
        legend:{display:false},
        title:{display:true, text:'Mood Summary 🌈', font:{size:16}}
      }
    }
  });
}

/* --- Music Player --- */
const music = document.getElementById('calmMusic');
const toggleMusic = document.getElementById('toggleMusic');
const musicSelector = document.getElementById('musicSelector');
let playing = false;

if (musicSelector) {
  musicSelector.addEventListener('change', ()=>{
    if(musicSelector.value){
      music.src = `music/${musicSelector.value}`;
      if(playing) music.play();
    }
  });
}

if (toggleMusic) {
  toggleMusic.addEventListener('click', ()=>{
    if(!playing){
      music.play();
      toggleMusic.textContent = "🔇 Pause Music";
      playing = true;
    } else {
      music.pause();
      toggleMusic.textContent = "🎵 Play Music";
      playing = false;
    }
  });
}

/* --- Breathing Exercise --- */
const startBtn = document.getElementById('startBreathing');
const circle = document.getElementById('circle');
const instruction = document.getElementById('instruction');

if(startBtn && circle && instruction){
  startBtn.addEventListener('click', ()=>{
    startBtn.disabled = true;
    if(music && !playing) { music.play(); toggleMusic.textContent="🔇 Pause Music"; playing=true; }

    instruction.textContent="Breathe In 🌿";
    circle.style.transform="scale(1.3)";
    let phase=0;
    let cycles=0;

    const breathing = setInterval(()=>{
      if(phase===0){ instruction.textContent="Hold 💫"; circle.style.transform="scale(1.3)"; phase=1; }
      else if(phase===1){ instruction.textContent="Exhale 🍃"; circle.style.transform="scale(1)"; phase=2; }
      else{ instruction.textContent="Breathe In 🌿"; circle.style.transform="scale(1.3)"; phase=0; cycles++; }

      if(cycles===5){
        clearInterval(breathing);
        instruction.textContent="Session Complete 🌸";
        circle.style.transform="scale(1)";
        // redirect to celebration page
        setTimeout(()=>{ window.location.href="celebration.html"; },1000);
      }
    },4000);
  });
}
