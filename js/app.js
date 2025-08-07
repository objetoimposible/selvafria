$(document).foundation();

// SMOOTH SCROLL

const lenis = new Lenis()
lenis.on('scroll', (e) => {
    console.log(e)
})
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

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

// FILTRO DE CATEGORIAS (LEGACY)

var classes = ["tag-gato", "tag-perro", "tag-pollo"];
var elms = {};
var n = {}, nclasses = classes.length;
function changeColor(classname, color) {
    var curN = n[classname];
    for (var i = 0; i < curN; i++) {
        elms[classname][i].style.color = color;
    }
}
for (var k = 0; k < nclasses; k++) {
    var curClass = classes[k];
    elms[curClass] = document.getElementsByClassName(curClass);
    n[curClass] = elms[curClass].length;
    var curN = n[curClass];
    for (var i = 0; i < curN; i++) {
        elms[curClass][i].onmouseout = function () {
            changeColor(this.className, "DimGray");
        };
        elms[curClass][i].onmouseover = function () {
            changeColor(this.className, "white");
        };
    }
};

// CARGA DINAMICA DE CONTENIDOS 

// Espera a que el documento esté completamente cargado y parseado.
// Esto asegura que todos los elementos HTML que se van a manipular ya existan en el DOM.
document.addEventListener('DOMContentLoaded', function () {

    $(document).foundation();

    // Selecciona todos los elementos en el documento que tienen la clase '.objeto'.
    const objetos = document.querySelectorAll('.objeto');
    
    // Selecciona el contenedor donde se cargará el contenido dinámicamente.
    const offcanvasContent = document.getElementById('offcanvas-content');

    // Variable para mantener una referencia al último objeto que fue clicado.
    // Esto es necesario para poder manipular su estado cuando el off-canvas se cierre.
    let lastClickedObject = null;

    // Itera sobre cada elemento '.objeto' para añadir un 'event listener' de 'click'.
    objetos.forEach(objeto => {
        objeto.addEventListener('click', function (event) {
            
            // Previene el comportamiento por defecto del enlace <a>, que sería navegar
            // a una nueva página. Con esto, el control del evento pasa a JavaScript.
            event.preventDefault();

            // Si ya hay un objeto activo (uno que fue clicado anteriormente y no se ha cerrado),
            // se le quita la clase 'is-active' para que solo uno esté "encendido" a la vez.
            if (lastClickedObject) {
                lastClickedObject.classList.remove('is-active');
            }

            // Añade la clase 'is-active' al elemento que se acaba de hacer clic.
            // Esta clase contendrá los mismos estilos que el :hover, forzando
            // que el elemento se vea "activado" de forma permanente.
            this.classList.add('is-active');

            // Almacena una referencia al elemento actual como el último clicado.
            // La variable `this` se refiere al elemento que disparó el evento.
            lastClickedObject = this;

            // Desenfoca el elemento para eliminar el estado :focus.
            this.blur();
            
            // Obtiene la URL del archivo de contenido del atributo 'data-url' del elemento.
            const url = this.getAttribute('data-url');

            // Si el atributo 'data-url' existe, procede con la carga del contenido.
            if (url) {
                // Inicia una solicitud HTTP usando la API Fetch para obtener el contenido.
                fetch(url)
                    // Primera parte de la promesa: maneja la respuesta de la solicitud.
                    .then(response => {
                        // Verifica si la respuesta de la red fue exitosa (código de estado 200).
                        if (!response.ok) {
                            // Si no fue exitosa, lanza un error.
                            throw new Error('Network response was not ok');
                        }
                        // Convierte el cuerpo de la respuesta a texto plano (HTML).
                        return response.text();
                    })
                    // Segunda parte de la promesa: maneja el contenido de la respuesta.
                    .then(html => {
                        // Inserta el HTML cargado dentro del div 'offcanvas-content'.
                        // Esto reemplaza cualquier contenido previo.
                        offcanvasContent.innerHTML = html;
                        
                        // Reinicializa Foundation, pero solo en el nuevo contenido insertado.
                        // Esto es vital para que los componentes de Foundation (como los acordeones)
                        // que se cargaron dinámicamente, funcionen correctamente.
                        $(offcanvasContent).foundation();
                    })
                    // Maneja cualquier error que pueda ocurrir durante el fetch o el procesamiento.
                    .catch(error => {
                        // Muestra el error en la consola del navegador para depuración.
                        console.error('There has been a problem with your fetch operation:', error);
                        // Muestra un mensaje de error en el div del off-canvas para el usuario.
                        offcanvasContent.innerHTML = '<p>Error al cargar el contenido.</p>';
                    });
            }
        });
    });

    // Escucha el evento 'closed.zf.offcanvas' que se dispara cuando el off-canvas se cierra.
    // Esto es crucial para restablecer el estado de la interfaz de usuario.
    $(document).on('closed.zf.offcanvas', function(event, offCanvas) {
        // Si hay un último objeto clicado (es decir, el off-canvas se está cerrando después
        // de que se ha abierto un objeto), le quitamos la clase 'is-active'.
        if (lastClickedObject) {
            lastClickedObject.classList.remove('is-active');
            // Resetea la variable a null, indicando que no hay ningún objeto activo.
            lastClickedObject = null;
        }
    });
});