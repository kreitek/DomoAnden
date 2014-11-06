/**/
var vectorTabs =[];
var habitaciones = {cocina:'192.168.1.3',dormitorio1:'192.168.1.4', dormitorio2:'192.168.1.5', salon:'restduino.local'};
var pin = {televisionDormitorio1:1, iluminacionDormitorio1:2, ordenadorDormitorio1:3, calefaccionDormitorio1:4,
    hornoCocina:1, iluminacionCocina:2, vitroceramicaCocina:3, neveraCocina:4,
    televisionDormitorio2:1, iluminacionDormitorio2:2, ordenadorDormitorio2:3, calefaccionDormitorio2:4,
    televisionSalon: 1, iluminacionSalon: 2, calefaccionSalon: 3};
/**/
function inicializar() {
/*evento del boton activar/desactivar sensores*/
	$("[name='my-checkbox']").bootstrapSwitch();

	$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {

	  /* Se ejecuta cuando se cambia el valor */
	  requestArduino(crearURL(buscarPadre($('#'+event.target.id)), [event.target.id, state]), event.target.id);

	  // guardamos el panel que realizo el evento
	  var sensor = document.getElementById(event.target.id + 'Panel');
	  if (state) { // si activo le añadimos la clase fo-activado que pintara verde
		if (sensor.classList.contains('fo-desactivado'))
			sensor.classList.remove('fo-desactivado')
		sensor.classList.add('fo-activado');
	  } else { // añadimos clase fo-desactivado que pintara gris
	    if (sensor.classList.contains('fo-activado'))
			sensor.classList.remove('fo-activado')
		sensor.classList.add('fo-desactivado');
	  }

	  contarSensoresActivos();

	});

	/*boton info*/
	$('button[name="my-button"]').on('click', function(event){
		var idInput = event.target.id.split('-')[0];
		requestArduino(crearURL(buscarPadre($('#'+ idInput)), [idInput]), idInput);
	});

/* recorremos todos los sensores activandolos o desactivandolos*/
	activarSensores();


/*añado las zonas */
	vectorTabs.push(document.getElementById('cocina'));
	vectorTabs.push(document.getElementById('dormitorio1'));
	vectorTabs.push(document.getElementById('dormitorio2'));
	vectorTabs.push(document.getElementById('salon'));

/*contamos los sensores activos*/
	contarSensoresActivos();
}

/* XMLHTTPRequest*/
function requestArduino(url, id) {
	var xmlrequest = new XMLHttpRequest();
	xmlrequest.onreadystatechange = function(){
		/*readystate = 4 significa que se ha terminado la petición http
		status = 200 significa que la consulta se realizó con éxito */
		if (xmlrequest.readyState == 4 && xmlrequest.status == 200) {
			if (JSON.parse(xmlrequest.response)[pin[id]] == "HIGH") {
				$('#'+ id).bootstrapSwitch('state', true, false);
				panel = document.getElementById(id + 'Panel');
				if (panel.classList.contains('fo-desactivado'))
					panel.classList.remove('fo-desactivado');
				panel.classList.add('fo-activado');
			} else {
				$(id).bootstrapSwitch('state', false, false);
				panel = document.getElementById(id + 'Panel');
				if (panel.classList.contains('fo-activado'))
					panel.classList.remove('fo-activado');
				panel.classList.add('fo-desactivado');
			}

		} else if (xmlrequest.readyState == 4) {
				alert("Error en la petición httprequest " + xmlrequest.status);
		}
	}
	xmlrequest.open('GET', url, true); // false = sincrono
	xmlrequest.send();
}
/*creación de la url*/
function crearURL(zona, vectorValores) {
	var text = "http://" + habitaciones[zona];
	/* Añadimos la parte variable ya que si se usa pin/valor se esta dando una orden
	  y si se usa solo pin se esta pidiendo el valor del sensor */
	for (var i in vectorValores) {
		if (i != 0) {
			if (vectorValores[i])
				text += "/HIGH";
			else
				text += "/LOW"
		} else {
			text += "/"+ pin[vectorValores[i]];
		}
	}
	return text;
}
/*Saber en que habitación estamos*/
function buscarPadre(objeto) {
	var padre;
	objeto.parents('.contenido').each(function(indice, elemento){
		padre = elemento.id;
	});
	return padre;
}

/*-Sensores-*/
function activarSensores() {
	$('input[name="my-checkbox"]').each(function(indice, elemento){
		$(elemento).bootstrapSwitch('state', false, true);
		panel = document.getElementById(elemento.id + 'Panel');
		if	(panel != null) {
			if (panel.classList.contains('fo-activado'))
				panel.classList.remove('fo-activado');
			panel.classList.add('fo-desactivado');
		}
	});
}
function contarSensoresActivos() {
	var contadorSCocina = 0;
	for (var i = 0 in vectorTabs) {
		//console.log(vectorTabs[i].id);
		contadorSCocina = 0;
		$('#' + vectorTabs[i].id + ' input[name="my-checkbox"]').each(function(indice, elemento){
			if (elemento.checked)
				contadorSCocina++;
			$('#' + vectorTabs[i].id + 'Badge').empty();
			$('#' + vectorTabs[i].id + 'Badge').append(contadorSCocina);
			//console.log("contador " + contadorSCocina + " valor del span " +$('#' + vectorTabs[i].id + 'Badge').val());
		});
	}
}

/*métodos de navegación*/
/*menu*/
var erMenu = false;
function expandirRegocerMenu(){
	var menu = document.getElementById('menu');
	if (!erMenu) {
		if(menu.classList.contains('fadeOutLeft'))
			menu.classList.remove('fadeOutLeft');
		menu.style.display='block';
		erMenu = true;
	} else {
		menu.classList.add('fadeOutLeft');
		erMenu = false;
	}
}
/*tabss*/
function cambiarTab(tab) {
	for (var i in vectorTabs) {
		vectorTabs[i].style.display = 'none';
	}
	tab.style.display = 'block';
	//activarSensores();
}


/*parse*/
function obtenerValores(text){
	var valores = []

	return valores;
}
