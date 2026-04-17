const configs = {
    easy: {
        radius: 150,
        lives: Infinity,
        label: 'Легкий'
    },
    medium: {
        radius: 100,
        lives: 7,
        label: 'Середній'
    },
    hard: {
        radius: 75,
        lives: 5,
        label: 'Тяжкий'
    }
};
let cfg, lives, score, dot, active = false;

function startGame(mode) {
    cfg = configs[mode];
    lives = cfg.lives;
    score = 0;
    active = true;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('mode-label').textContent = cfg.label;
    document.getElementById('score').textContent = 0;
    renderHearts();
    spawnDot();
}

function renderHearts() {
    const bar = document.getElementById('score-bar');
    if (cfg.lives === Infinity) {
        bar.innerHTML = '<span>∞ життів</span>';
        return;
    }
    bar.innerHTML = '';
    for (let i = 0; i < cfg.lives; i++) {
        const h = document.createElement('span');
        h.className = 'heart';
        h.textContent = i < lives ? '❤️' : '🖤';
        bar.appendChild(h);
    }
}

function spawnDot() {
    const field = document.getElementById('field');
    const fw = field.clientWidth,
        fh = field.clientHeight;
    const margin = 20;
    const x = margin + Math.random() * (fw - 2 * margin);
    const y = margin + Math.random() * (fh - 2 * margin);
    dot = {
        x,
        y
    };
    const el = document.createElement('div');
    el.className = 'dot';
    el.id = 'dot-el';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    field.appendChild(el);
}

function removeDot() {
    const el = document.getElementById('dot-el');
    if (el) el.remove();
}

function showCross(x, y) {
    const field = document.getElementById('field');
    const c = document.createElement('div');
    c.className = 'cross';
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.textContent = '✕';
    field.appendChild(c);
    setTimeout(() => c.remove(), 600);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 1800);
}

function gameOver() {
    active = false;
    removeDot();
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('modal');
    overlay.style.display = 'flex';
    modal.innerHTML = `<h2 style="color:red">Гру закінчено!</h2>
    <p style="margin:0.75rem 0 1.25rem; font-size: 18px;">Ваш рахунок: <strong>${score}</strong></p>
    <button class="mode-btn easy" onclick="resetModal()">Грати знову</button>`;
}

function resetModal() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `<h2>Оберіть тяжкість</h2>
    <p>На карті з'явиться точка, тобі поьтрібно буде клікнути як можна ближче до неї</p>
    <button class="mode-btn easy" onclick="startGame('easy')">Легка — радіус 150px</button>
    <button class="mode-btn medium" onclick="startGame('medium')">Середня — радіус 100px, 7 життів</button>
    <button class="mode-btn hard" onclick="startGame('hard')">Тяжка — радіус 75px, 5 життів</button>`;
}

document.getElementById('field').addEventListener('click', function (e) {
    if (!active || !dot) return;
    const rect = this.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const dx = cx - dot.x,
        dy = cy - dot.y;
    const dist = Math.round(Math.sqrt(dx * dx + dy * dy));
    showCross(cx, cy);
    if (dist <= cfg.radius) {
        score++;
        document.getElementById('score').textContent = score;
        showToast('Попав! Відстань: ' + dist + 'px');
        removeDot();
        setTimeout(spawnDot, 300);
    } else {
        if (cfg.lives !== Infinity) {
            lives--;
            renderHearts();
            showToast('Мимо! Відстань: ' + dist + 'px — -1 життя');
            if (lives <= 0) {
                setTimeout(gameOver, 500);
                return;
            }
        } else {
            showToast('Мимо! Відстань: ' + dist + 'px');
        }
        removeDot();
        setTimeout(spawnDot, 400);
    }
});