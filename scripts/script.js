/* Efecto Matrix (lluvia de números), con caídas de "malware" en rojo */
(() => {
    const canvas = document.getElementById("matrix");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const content = document.querySelector(".content");
    const dangerOverlay = document.getElementById("danger-overlay");

    const letters = "01";
    const fontSize = 32;

    let columns = 0;
    let drops = [];

    // Columnas actualmente marcadas como "malware" (caen en rojo y más lento)
    const malwareColumns = new Set();
    const MALWARE_SPEED = 0.35; // más lento que la caída normal (1 por frame)

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => Math.random() * -100);
        malwareColumns.clear();
    }

    function draw() {
        // Fondo semitransparente para el efecto de estela
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const isMalware = malwareColumns.has(i);
            const text = letters[Math.floor(Math.random() * letters.length)];

            ctx.fillStyle = isMalware
                ? "#ff0033"
                : (Math.random() > 0.96 ? "#66ff99" : "#00ff55");

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                if (isMalware) malwareColumns.delete(i);
            }

            drops[i] += isMalware ? MALWARE_SPEED : 1;
        }
    }

    // Respeta la preferencia de menos movimiento del usuario
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Ciclo de tiempos entre caídas de malware: 10s -> 25s -> 15s -> se reinicia
    const CYCLE_DELAYS = [10000, 25000, 15000];
    let cycleIndex = 0;

    // Config por nivel: qué % de columnas cae en rojo y cuánto dura el glitch
    const LEVELS = {
        1: { percent: 0.35, glitchMs: 1100 },  // caída normal — 35% de los números
        2: { percent: 0.50, glitchMs: 2000 }, // más suspenso — 50% de los números (repite 2x)
        3: { percent: 0.90, glitchMs: 2700 }  // alarmante — 90% de los números (repite 3x)
    };

    function triggerMalware() {
        const level = cycleIndex + 1;
        const { percent, glitchMs } = LEVELS[level];
        const count = Math.max(1, Math.round(columns * percent));

        let guard = 0;
        while (malwareColumns.size < count && malwareColumns.size < columns && guard < 500) {
            malwareColumns.add(Math.floor(Math.random() * columns));
            guard++;
        }

        if (!reduceMotion) {
            if (content) {
                content.classList.add(`glitch-${level}`);
                setTimeout(() => content.classList.remove(`glitch-${level}`), glitchMs);
            }
            if (dangerOverlay && level >= 2) {
                dangerOverlay.classList.add(`level-${level}`);
                setTimeout(() => dangerOverlay.classList.remove(`level-${level}`), glitchMs);
            }
        }

        cycleIndex = (cycleIndex + 1) % CYCLE_DELAYS.length;
        scheduleMalware();
    }

    function scheduleMalware() {
        setTimeout(triggerMalware, CYCLE_DELAYS[cycleIndex]);
    }

    setup();
    if (!reduceMotion) {
        setInterval(draw, 75);
        scheduleMalware();
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setup, 150);
    });
})();
