
//REFORMAS PARA 3RA PRE-ENTREGA SIEMPRE BASADO EN MI PROYECTO INICIAL. LIMITADO, PERO RESPETANDO LO SOLICITADO EN CADA ENTREGA.
// AL ELEGIR ESTE MODELO DE DESARROLLO , NO SER UN E-COMMERCE O ALGO MAS ELABORADO EN SENTIDO DE COMPRA-VENTA. Se limita a ciertas cosas. Lo cual es aun mas desafiante y espero que sepan interpretarlo.


// Funcion para Obtener el valor del total a pagar y la cantidad de personas
function calcular() {
  let total = parseFloat(document.getElementById("total").value);
  let personas = parseInt(document.getElementById("personas").value);


  // Verifica si los valores ingresados son números
  if (isNaN(total) || isNaN(personas)) {
    mostrarAlerta();
    return;
  }

  let resultado = total / personas;
  let resultadoContainer = document.getElementById("resultado");
  resultadoContainer.textContent = "Cada persona debe pagar $" + resultado.toFixed(2);
}

// Muestra una alerta para el usuario
function mostrarAlerta() {
  let alerta = document.createElement("div");
  alerta.style.backgroundColor = "red";
  alerta.style.color = "white";
  alerta.style.padding = "10px";
  alerta.style.borderRadius = "5px";
  alerta.style.marginBottom = "6px";
  alerta.style.textAlign = "center";
  alerta.appendChild(
    document.createTextNode("Por favor, ingrese un valor numérico válido")
  );
  document.body.insertBefore(alerta, document.body.firstChild);

  $("#total").addClass("animated shake");

  setTimeout(function () {
    $("#total").removeClass("animated shake");
    alerta.remove();
  }, 3000);
}

function calcularConPropina() {
  const total = parseFloat(document.getElementById("total").value);
  const personas = parseInt(document.getElementById("personas").value);
  const propina = parseInt(document.getElementById("propina").value);

  if (total && personas) {
    const totalConPropina = total * (1 + propina / 100);
    const totalPorPersona = totalConPropina / personas;
    const resultado = `Cada persona debe pagar ${totalPorPersona.toFixed(2)} con propina.`;

    document.getElementById("resultado").textContent = resultado;
  }
}

window.addEventListener("scroll", function () {
  let header = document.getElementById("header");
  if (window.pageYOffset > 0) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* Una animación al cargar la página muy copada. Para agregar algooooo que no sea super estatica */
window.addEventListener("load", function () {
  let instrucciones = document.querySelector(".instrucciones");
  instrucciones.style.opacity = "1";
});

window.onload = function() {
  window.datos = [];
}

function agregarElemento() {
  let dato = document.getElementById('texto').value;
  datos.push(dato);
}

function mostrarArreglo() {
  let resultado = document.getElementById('resultado');
  resultado.innerHTML = '';

  for (const dato of datos) {
    let datoParrafo = document.createElement('p');
    datoParrafo.innerText = dato;

    resultado.appendChild(datoParrafo);
  }
}

const formulario = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');

eventListeners();

function eventListeners(){
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
    actualizarLocalStorage();
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
    actualizarLocalStorage();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce((total, gasto) => total + Number(gasto.cantidad), 0);
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
    actualizarLocalStorage();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }
    divMensaje.textContent = mensaje;
    document.querySelector('.primario').insertBefore(divMensaje, formulario);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {
    this.limpiarHTML();

    gastos.forEach(gasto => {
      const { nombre, cantidad, id } = gasto;

      const nuevoGasto = document.createElement('li');
      nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;

      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = 'Borrar &times;';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      listaGastos.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (listaGastos.firstChild) {
      listaGastos.removeChild(listaGastos.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector('.restante');

    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-danger');
      restanteDiv.classList.add('alert-warning');
    } else {
      restanteDiv.classList.remove('alert-danger', 'alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

const ui = new UI();
let presupuesto;

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');

  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector('#gasto').value;
  const cantidad = document.querySelector('#cantidad').value;

  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  } else if (isNaN(cantidad) || cantidad <= 0) {
    ui.imprimirAlerta('Cantidad no válida', 'error');
    return;
  }

  const gasto = { nombre, cantidad, id: Date.now() };
  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta('Gasto agregado correctamente');

  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);

  formulario.reset();
}

function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);

  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}

function actualizarLocalStorage() {
  localStorage.setItem('presupuesto', JSON.stringify(presupuesto));
}

document.addEventListener('DOMContentLoaded', () => {
  presupuesto = JSON.parse(localStorage.getItem('presupuesto')) || null;
  if (presupuesto) {
    ui.insertarPresupuesto(presupuesto);
    ui.mostrarGastos(presupuesto.gastos);
    ui.comprobarPresupuesto(presupuesto);
  }
});


//BUSQUE COMO CREAR UN FORMULARIO SEGUN LO INDICADO EN GUIA DE ACTIVIDADES Y ESTA OPCION ES GENIAL . 100% FUNCIONAL . 
const btn = document.getElementById('button');

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_ogl1f5s';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      alert('Sent!');
    }, (err) => {
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});

//REFORMAS PARA ENTREGA FINAL API 
const api = {
  key: '9e122cd782b2d0333f5fe4e7fa192062',
  url: `https://api.openweathermap.org/data/2.5/weather`
}

const card = document.getElementById('card')

const city = document.getElementById('city');
const date = document.getElementById('date');
const tempImg = document.getElementById('temp-img');
const temp = document.getElementById('temp');
const weather = document.getElementById('weather');
const range = document.getElementById('range');

function updateImages(data) {
  const temp = toCelsius(data.main.temp);
  let src = 'imagenes/temp-mid.png';
  if (temp > 26) {
    src = 'imagenes/temp-high.png';
  } else if (temp < 20) {
    src = 'imagenes/temp-low.png';
  }
  tempImg.src = src;
}

async function search(query) {
  try {
    const response = await fetch(`${api.url}?q=${query}&appid=${api.key}&lang=es`);
    const data = await response.json();
    card.style.display = 'block';
    city.innerHTML = `${data.name}, ${data.sys.country}`;
    data.innerHTML = (new Date()).toLocaleDateString();
    temp.innerHTML = `${toCelsius(data.main.temp)}c`;
    weather.innerHTML = data.weather[0].description;
    range.innerHTML = `${toCelsius(data.main.temp_min)}c / ${toCelsius(data.main.temp_max)}c`;
    updateImages(data);
  } catch (err) {
    console.log(err);
    alert('Hubo un error');
  }
}

function toCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

function onSubmit(event) {
  event.preventDefault();
  search(searchbox.value);
}

const searchform = document.getElementById('search-form');
const searchbox = document.getElementById('searchbox');
searchform.addEventListener('submit', onSubmit, true);



//reformas proyecto entrega Final

//La función "calcular" obtiene los valores del total a pagar y la cantidad de personas. Verifica si los valores ingresados son números y muestra una alerta en caso contrario.
//La función "mostrarAlerta" crea una alerta visual para el usuario cuando se ingresa un valor no numérico válido. También utiliza animaciones CSS para resaltar el campo de entrada incorrecto.
//La función "calcularConPropina" calcula el total a pagar por persona, incluyendo una propina opcional.
//Se agrega un evento de desplazamiento (scroll) al objeto window para cambiar el estilo del encabezado ("header") cuando se hace scroll en la página.
//Se agrega un evento de carga (load) al objeto window para animar las instrucciones al cargar la página.
//Se define un arreglo llamado "datos" y se proporcionan funciones para agregar elementos a dicho arreglo y mostrarlo en la interfaz.
//Se crea una clase "Presupuesto" para gestionar un presupuesto, incluyendo gastos y el cálculo del restante.
//Se crea una clase "UI" para interactuar con la interfaz, mostrando alertas, gastos y actualizando elementos HTML.
//Se agregan event listeners para capturar eventos como la carga del contenido, el envío de un formulario y el click en un botón de borrado.
//Se implementa la integración con el servicio EmailJS para enviar un correo electrónico al completar un formulario.
//Se realiza una llamada a la API de OpenWeatherMap para obtener datos meteorológicos y se actualizan elementos HTML en consecuencia.

//Ya en la 3RA PRE-ENTREGA . el código utilizaba el DOM (Document Object Model) para manipular elementos HTML y realizar acciones como mostrar alertas, agregar elementos a una lista y actualizar contenido dinámicamente en la página.

//También utiliza el Local Storage para almacenar el presupuesto y los gastos en el navegador, de manera que los datos persistan aunque se recargue la página.

//Además, se utiliza JSON (JavaScript Object Notation) para convertir los objetos JavaScript en formato JSON y almacenarlos en el Local Storage, así como para recuperar y parsear los datos almacenados en formato JSON.