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