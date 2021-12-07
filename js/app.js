const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const alert = document.querySelector('.alert-container');
let artitculosCarrito = [];
cargarEventListener();

function cargarEventListener() {
    // Agregar Curso
    listaCursos.addEventListener('click', agregarCurso);
    // Muestra los cursos de Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        artitculosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();

    });
    // Eliminar Curso
    carrito.addEventListener('click', eliminarCurso);
    // Vaciar carrito
    vaciarCarritoBtn.addEventListener('click', e => {
        artitculosCarrito = [];
        sincronizarStorage();
        limpiarHTML();
        ui.imprimirAlerta('Carrito vaciado correctamente.', 'danger')
    });
}

// Clases
class UI {
    imprimirAlerta(mensaje, tipo) {
        
        const divMensaje = document.createElement('div');
        const parrafo = document.createElement('p');
        parrafo.textContent = mensaje;
        divMensaje.classList.add('alert');
        divMensaje.appendChild(parrafo);
        if (tipo === 'danger') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        document.querySelector('body').insertBefore(divMensaje, alert);
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}
const ui = new UI();
// Funciones
// Agregar curso
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
        ui.imprimirAlerta('Producto añadido correctamente.', 'success');
    }
}
//Eliminar Curso
function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        artitculosCarrito = artitculosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML();
        ui.imprimirAlerta('Producto eliminado correctamente.', 'danger');
    }
}
// Mostrar alert
function mostrarAlert(message, type) {
    const alert = document.querySelector('#alert');
    const text = document.createElement('p');
    alert.classList.add(type);
    text.textContent = message;
    alert.appendChild(text);
    alert.style.opacity = '1';
    setTimeout(() => {
        alert.style.opacity = '0';
    }, 3000);
}
// Extrae la informacion del curso agregado al carrito
function leerDatosCurso(curso) {
    //Crear un objeto con el curso
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    // comprobar si ese elemento ya existe en el carrito
    const existe = artitculosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        const cursos = artitculosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            } else {
                return curso;
            }
        });
        artitculosCarrito = [...cursos]
    } else {
        // Agrega elemento al arreglo del carrito
        artitculosCarrito = [...artitculosCarrito, infoCurso];
    }

    carritoHTML();
}

// Mustra el carrito en el html
function carritoHTML() {
    // Limpiar el html
    limpiarHTML();
    // Recorre el carrito y genera el html
    artitculosCarrito.forEach(curso => {
        const { imagen, titulo, precio, id, cantidad } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" alt="${titulo}" width="100">
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> x </a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });
    // Agrega carrito al Local Storage
    sincronizarStorage();

}
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(artitculosCarrito))
}
// Elimina los cursos del html
function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}