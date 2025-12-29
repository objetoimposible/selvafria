// ANIMACION DE ELEMENTOS PORTADA
// Variable que encapsula la función Math.random para acortar el código.
var MR = function (X) { return Math.random() * X },
    // Alias para TweenLite, la librería de animación.
    TwL = TweenLite,
    // Selecciona todos los elementos con la clase '.objeto'.
    G = document.querySelectorAll('.objeto');

// Función que se encarga de posicionar los elementos al centro.
function setupObjects() {
    // Obtiene las dimensiones de la ventana del navegador.
    var W = window.innerWidth,
        H = window.innerHeight;
    
    // Recorre todos los elementos '.objeto'.
    for (var i = G.length; i--;) {
        var GWidth = G[i].offsetWidth,
            GHeight = G[i].offsetHeight;
        
        // Calcula la posición central de la pantalla.
        const centerX = (W / 2) - (GWidth / 2);
        const centerY = (H / 2) - (GHeight / 2);
        
        // Mueve el elemento a la posición central de forma instantánea.
        TwL.set(G[i], { x: centerX, y: centerY });
    }
}

// Función principal de la animación.
function BTweens() {
    var W = window.innerWidth, H = window.innerHeight, C = 100;
    
    TwL.killDelayedCallsTo(BTweens);
    TwL.delayedCall(C * 4, BTweens);

    for (var i = G.length; i--;) {
        var c = C,
            BA = [],
            GWidth = G[i].offsetWidth,
            GHeight = G[i].offsetHeight;
        
        while (c--) {
            var SO = MR(1);
            BA.push({ x: MR(W - GWidth), y: MR(H - GHeight) });
        };
        
        if (G[i].T) {
            G[i].T.kill()
        }
        
        G[i].T = TweenMax.to(G[i], C * 20, {
            bezier: { timeResolution: 0, type: "soft", values: BA },
            delay: i * 0.05,
            ease: Linear.easeNone
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Llama a la función que centra los objetos al inicio.
    setupObjects();

    // Llama a la función principal de la animación.
    BTweens();
    
    // Oculta el preloader con un retraso para darle más tiempo en pantalla.
    const preloader = document.getElementById('preloader');
    
    // Define el tiempo de retraso en milisegundos (ejemplo: 2000ms = 2 segundos).
    const delay = 2000; 

    // Usa setTimeout para agregar un retraso antes de ocultar el preloader.
    setTimeout(function() {
        preloader.classList.add('hidden');
    }, delay);
});

// Escucha el evento de redimensionamiento de la ventana.
window.onresize = function () {
    TwL.killDelayedCallsTo(BTweens);
    setupObjects();
    TwL.delayedCall(0.4, BTweens);
};