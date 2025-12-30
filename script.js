document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let audioCtx;
    let particles = [];

    // --- Sound Synthesis ---
    function playPop() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100 + Math.random() * 200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }

    // --- Fireworks Logic ---
    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            this.vel = { x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 };
            this.alpha = 1;
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.alpha;
            ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
        }
        update() { this.x += this.vel.x; this.y += this.vel.y; this.alpha -= 0.015; }
    }

    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6);
        playPop();
        for (let i = 0; i < 30; i++) particles.push(new Particle(x, y, '#ff85a1'));
    }

    function animate() {
        ctx.fillStyle = 'rgba(8, 8, 10, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (Math.random() < 0.08) createFirework();
        particles.forEach((p, i) => {
            if (p.alpha <= 0) particles.splice(i, 1);
            else { p.update(); p.draw(); }
        });
        requestAnimationFrame(animate);
    }

    // --- Journey Logic ---
    document.getElementById('start-btn').addEventListener('click', () => {
        // Unlock Audio
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Switch to Fireworks
        document.getElementById('audio-gate').classList.remove('active');
        document.getElementById('stage-1').classList.add('active');
        animate();

        // Title Transition
        const title = document.getElementById('main-title');
        setTimeout(() => {
            title.style.opacity = '0';
            setTimeout(() => {
                title.innerText = "HAPPY NEW YEAR, CJ!";
                title.style.opacity = '1';
            }, 1000);
        }, 4000);

        // Move to Challenge
        setTimeout(() => {
            document.getElementById('stage-1').classList.remove('active');
            document.getElementById('stage-2').classList.add('active');
            initChallenge();
        }, 10000);
    });

    function initChallenge() {
        const field = document.getElementById('star-field');
        let count = 0;
        field.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const star = document.createElement('div');
            star.className = 'clickable-star';
            star.style.left = Math.random() * 80 + 10 + '%';
            star.style.top = Math.random() * 80 + 10 + '%';
            star.onclick = function() {
                if (!this.classList.contains('found')) {
                    this.classList.add('found');
                    count++;
                    document.getElementById('count').innerText = count;
                    if (count === 4) {
                        setTimeout(() => {
                            document.getElementById('stage-2').classList.remove('active');
                            document.getElementById('stage-3').classList.add('active');
                        }, 800);
                    }
                }
            };
            field.appendChild(star);
        }
    }
});