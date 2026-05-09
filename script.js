// ─── Countdown ────────────────────────────────────────────────────────────────
(function () {
    const WEDDING = new Date('2026-08-13T15:30:00+07:00');
    const elDays    = document.getElementById('cd-days');
    const elHours   = document.getElementById('cd-hours');
    const elMins    = document.getElementById('cd-minutes');
    const elSecs    = document.getElementById('cd-seconds');
    const elCaption = document.getElementById('countdown-caption');
    const elBox     = document.getElementById('countdown');

    function pad(n) { return String(n).padStart(2, '0'); }
    function animFlip(el, newVal) {
        const f = pad(newVal);
        if (el.textContent === f) return;
        el.classList.add('flip');
        setTimeout(() => { el.textContent = f; el.classList.remove('flip'); }, 150);
    }
    function tick() {
        const diff = WEDDING - new Date();
        if (diff <= 0) {
            elBox.innerHTML = '<p class="countdown-done">🎉 Сегодня мы становимся семьёй! 🎉</p>';
            elCaption.style.display = 'none';
            clearInterval(timer); return;
        }
        const s = Math.floor(diff/1000);
        animFlip(elDays,  Math.floor(s/86400));
        animFlip(elHours, Math.floor(s/3600)%24);
        animFlip(elMins,  Math.floor(s/60)%60);
        animFlip(elSecs,  s%60);
    }
    tick();
    const timer = setInterval(tick, 1000);
})();

// ─── Fade-in on scroll ────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ─── Side nav active dot ──────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navDots  = document.querySelectorAll('.nav-dot');
const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navDots.forEach(d => d.classList.remove('active'));
            const dot = document.querySelector(`.nav-dot[href="#${e.target.id}"]`);
            if (dot) dot.classList.add('active');
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => secObserver.observe(s));

// ─── Music player ─────────────────────────────────────────────────────────────
const musicBtn = document.getElementById('musicBtn');
// Use a royalty-free romantic audio (piano)
const audio = new Audio('https://www.bensound.com/bensound-music/bensound-romantic.mp3');
audio.loop = true; audio.volume = 0.3;
let playing = false;
musicBtn.addEventListener('click', () => {
    if (playing) { audio.pause(); musicBtn.classList.remove('playing'); }
    else { audio.play().catch(()=>{}); musicBtn.classList.add('playing'); }
    playing = !playing;
});

// ─── RSVP form ────────────────────────────────────────────────────────────────
const form = document.getElementById('rsvpForm');
const note = document.getElementById('rsvpNote');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name  = document.getElementById('guestName').value.trim();
        const att   = form.querySelector('input[name="attendance"]:checked');
        if (!name || !att) { note.textContent = 'Пожалуйста, заполните обязательные поля.'; note.style.color='#c0392b'; return; }
        // Save to localStorage
        const data = { name, count: document.getElementById('guestCount').value, attendance: att.value, message: document.getElementById('guestMessage').value, ts: new Date().toISOString() };
        const all = JSON.parse(localStorage.getItem('rsvp_guests') || '[]');
        all.push(data);
        localStorage.setItem('rsvp_guests', JSON.stringify(all));
        // Show thanks
        form.innerHTML = `<div class="rsvp-thanks"><p class="rsvp-thanks-icon">💌</p><p class="rsvp-thanks-text">${att.value === 'yes' ? 'Ура! Ждём вас, ' + name + '! 🎉' : 'Спасибо за ответ, ' + name + '. Будем скучать!'}</p></div>`;
        note.textContent = '';
    });
}

// ─── Floating hearts ──────────────────────────────────────────────────────────
const CHARS  = ['♡','♥','❤','💕','✨'];
const COLORS = ['#C9A882','#D4B896','#B59C82','#E8DCC9','#92A398'];
function createHeart() {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = CHARS[Math.floor(Math.random()*CHARS.length)];
    const size = Math.random()*22+12;
    h.style.cssText = `left:${Math.random()*100}vw;font-size:${size}px;color:${COLORS[Math.floor(Math.random()*COLORS.length)]};animation-duration:${Math.random()*6+6}s;animation-delay:${Math.random()*4}s;opacity:0;`;
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
}
setInterval(createHeart, 800);
for (let i=0;i<6;i++) setTimeout(createHeart, i*250);

// ─── Cursor trail ─────────────────────────────────────────────────────────────
let lastX=0, lastY=0;
document.addEventListener('mousemove', (e) => {
    if (Math.hypot(e.clientX-lastX, e.clientY-lastY) < 40) return;
    lastX=e.clientX; lastY=e.clientY;
    const s = document.createElement('div');
    s.className = 'cursor-heart';
    s.textContent = Math.random()>.5 ? '♡' : '✨';
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${COLORS[Math.floor(Math.random()*COLORS.length)]};font-size:${Math.random()*14+10}px;`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
});

// ─── Click burst ──────────────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
    for (let i=0;i<8;i++) {
        const b = document.createElement('div');
        b.className = 'burst-heart';
        b.textContent = CHARS[Math.floor(Math.random()*CHARS.length)];
        const angle = (i/8)*360, dist = Math.random()*60+30, rad = angle*Math.PI/180;
        b.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${COLORS[Math.floor(Math.random()*COLORS.length)]};font-size:${Math.random()*16+10}px;--tx:${Math.cos(rad)*dist}px;--ty:${Math.sin(rad)*dist}px;`;
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 700);
    }
});

// ─── Parallax names ───────────────────────────────────────────────────────────
const heroNames = document.querySelector('.names');
document.addEventListener('mousemove', (e) => {
    if (!heroNames) return;
    const rx = (e.clientX - window.innerWidth/2)  / window.innerWidth  * 6;
    const ry = (e.clientY - window.innerHeight/2) / window.innerHeight * -4;
    heroNames.style.transform = `perspective(600px) rotateY(${rx}deg) rotateX(${ry}deg)`;
});

// ─── Calendar highlight hover ─────────────────────────────────────────────────
document.querySelector('.highlight')?.addEventListener('mouseenter', function() { this.style.transform='scale(1.3)'; });
document.querySelector('.highlight')?.addEventListener('mouseleave', function() { this.style.transform=''; });
