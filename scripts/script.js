/* MATRIX PRO */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Letras Matrix
const letters = "01";

// Tamaño de los números (más grandes)
const fontSize = 32; // <-- AJUSTADO

// Número de columnas según tamaño de pantalla
let columns = Math.floor(canvas.width / fontSize);

// Posición inicial de cada columna
let drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
}

function draw() {
    // Fondo con transparencia para efecto de estela
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];

        // Color aleatorio para brillo
        ctx.fillStyle = Math.random() > 0.96 ? "#66ff99" : "#00ff55";
        ctx.font = fontSize + "px monospace";

        // Dibujar número
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reiniciar columna cuando llega al final
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

// Velocidad más lenta (antes 40ms)
setInterval(draw, 75); // <-- AJUSTADO

// Recalcular columnas al cambiar tamaño de pantalla
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);
    drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
});
