const configs = {
    easy: {
        radius: 30,
        lives: Infinity,
        label: 'Легкий'
    },
    medium: {
        radius: 20,
        lives: 7,
        label: 'Середній'
    },
    hard: {
        radius: 10,
        lives: 5,
        label: 'Тяжкий'
    }
};
const easyBtn = document.querySelector(".easy"),
    mediumBtn = document.querySelector(".medium"),
    hardBtn = document.querySelector(".hard");

let cfg, dot, active = false;

let score = 0, 
    lives = 0;

function startGame(mode) {
    cfg = configs[mode];
    console.log(cfg + " Config")
    lives = cfg.lives;
    // let score = 0;
    active = true;
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal').style.display = 'none'
    document.getElementById('mode-label').textContent = cfg.label;
    document.getElementById('score').textContent = 0;
    let cross = document.querySelectorAll(".cross")
    if (cross) {
        cross.forEach(item => {
            removeCross(item)
        });
    }
    renderHearts(lives);
    spawnDot();
    console.log(cfg)

    
}
easyBtn.addEventListener("click", () => startGame('easy'))
mediumBtn.addEventListener("click", () => startGame('medium'))
hardBtn.addEventListener("click", () => startGame('hard'))

function renderHearts(lives) {
    const bar = document.getElementById('score-bar');
    if (lives === Infinity) {
        bar.innerHTML = '<span>∞ життів</span>';
        return;
    }
    bar.innerHTML = '';
    for (let i = 0; i < lives; i++) {
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
    const c = document.createElement("span");
    c.classList.add("cross")
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.textContent = '✕';
    field.appendChild(c);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.classList.remove('show'), 1800);
}

function removeCross(c) {
    if (c) {
        console.log(c)
        c.remove()
    }
}

function gameOver() {
    active = false;
    removeDot();
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('modal');
    modal.style.display = "block"
    overlay.style.display = 'flex';
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
            renderHearts(lives);
            showToast('Мимо! Відстань: ' + dist + 'px — -1 життя');
            if (lives <= 0) {
                setTimeout(gameOver, 500);
                return;
            }
        } else {
            showToast('Мимо! Відстань: ' + dist + 'px');
        }
    }
});

//кнопка виходу просто показувати попап з скор, зміна тексту на гейм овер