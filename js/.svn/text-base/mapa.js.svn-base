var mapa;
var markers = [];
var infoWindows = [];
var polylines = [];
//var coloresLineas = [];
//var imagenesAlertas = [];
var bounds;
var zindex = 0;
var datomapa;

function checkConnectionmapa() {
	if (conexiononline()){
		$.mobile.changePage("mostrarmapa.html", {transition: "fade"});
	}
	else{
		new error('Error','Debe tener conexion para visualizar el mapa','mapa').vererror();
	}
}
function inicializarmapa() {
	var mapTypeIds = [];
	mapTypeIds.push("roadmap");
	mapTypeIds.push("OSM");
	
	var opciones = {
		center : new google.maps.LatLng(5.07,-75.52056),
		zoom : 13,
		streetViewControl: false,
		backgroundColor: "#F4F3F0",
		mapTypeId: "roadmap",
		mapTypeControlOptions: {
			mapTypeIds: mapTypeIds
		}
	};
	
	mapa = new google.maps.Map(document.getElementById("map"),opciones);

	mapa.mapTypes.set("OSM", new google.maps.ImageMapType({
		getTileUrl: function(coord, zoom) {
			return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
		},
		tileSize: new google.maps.Size(256, 256),
		name: "OpenStreetMap",
		maxZoom: 18
	}));	
}
function sincronizarmapa(logins,paswords,vehiculo,nombreplaca,fecha){
	var urls ='http://www.reactiva.com.co:8097/atlas/rest/atlasWS/recorrido' ;
	var listajsonvehiculo ='{"idvehiculo":"' + vehiculo + '","fecha":"' + fecha + '"}';
	datomapa='';
	try{
		$.ajax({
			type: 'GET',
			url: urls ,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			data: {login: logins,
				   password:paswords,
				   datosVehiculo:listajsonvehiculo},
			success: success,
			error: errorws
		});
	}
	catch(err){
		new error('Error','Datos incorrectos. invocando web service mapa '+data.error).vererror();
	}
	function success(data, textStatus, jqXHR) {
		if(typeof(data.error) != "undefined"){
			new error('Error','Datos incorrectos respondiendo web service mapa'+data.error).vererror();
		}else{
		  /*alerta: "SHAKE"
			aliasAlerta: "Sacudido"
			anio: 13
			curso: "142.44"
			dia: 6
			direccion: "US50 # 1 a 38161, Manizales, Caldas, Colombia"
			distancia: 2474.84315408401
			esUltimoRegistroTabla: false
			fecha: "Feb 6, 2013 5:11:06 PM"
			hora: "17:11:06"
			id: 181
			latitud: 5.090128333333333
			longitud: -75.63956833333333
			mes: 2
			parqueo: 1662881000
			seleccionado: false
			tieneErrores: false
			velocidad: 0
			tiempoEncendido: "00:26:42"
			tiempoApagado: "00:15:35"
			*/
//			data.detalles
console.log(data);
			datomapa=data;
			generarpuntos(nombreplaca);
		}
	}
	function errorws(jqXHR, textStatus, errorThrown) {
		alert(jqXHR.responseText + " " + textStatus + " " + errorThrown);
	}
}
function generarpuntos(nombreplaca){
	limpiarMapa();
	bounds = new google.maps.LatLngBounds();
	
	if($("#mapavehiculo").is(':checked')) {  
		generarMarcadoresMapa(datomapa.tramas);	
	} 
	if($("#mapausuario").is(':checked')) {  
		generarMarcadoresMapa(datomapa.detalles);	
	}	
	mapa.fitBounds(bounds);
	creartablamapa(datomapa,nombreplaca);
}
/*function moverlatitud(tramas){
		for (var j = 0; j < tramas.length; j++) {
				tramas[j].latitud=tramas[j].latitud-0.02;
				tramas[j].longitud=tramas[j].longitud-0.02;
		}
		return tramas;
	}	*/
function limpiarMapa(){
	zindex = 0;
	for (var i = 0; i < markers.length;i++) {
		markers[i].setMap(null);		
	}
	markers.length = 0;
	for (var i = 0; i < infoWindows.length;i++) {
		infoWindows[i].setMap(null);		
	}
	infoWindows.length = 0;
	for (var j = 0; j < polylines.length;j++) {
		polylines[j].setPath([]);
	}	
	polylines.length = 0;
	//stop();
}
function aleatorio(inferior,superior){
	var numPosibilidades = superior - inferior;
	var aleat = Math.random() * numPosibilidades;
	aleat = Math.floor(aleat);
	return parseInt(inferior) + aleat;
}
function obtenerColorAleatorio(){ 
	var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"); 
	var color_aleatorio = "#"; 
	for (var i=0;i<6;i++){ 
		var posarray = aleatorio(0,hexadecimal.length); 
		color_aleatorio += hexadecimal[posarray];
	} 
	return color_aleatorio ;
}
function dibujaLinea(puntoOrigen, puntoFin, colorLinea, colorFlecha){	
	var lineCoordenada;
	lineCoordenada = [puntoOrigen, puntoFin];
	var lineSymbol = {
		path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		strokeColor: colorLinea,
		//fillColor: '#F00',
		fillOpacity: 1.0
	};
	
	var line = new google.maps.Polyline({
		path:lineCoordenada,
		icons:[{
			icon:lineSymbol,
			offset:'100%'
		}],
		//strokeColor: '#aa1f03',
		strokeColor: colorLinea,		
		strokeOpacity: 1.0,
		strokeWeight: 2.0,						
		map:mapa
		
	});	
	polylines.push(line);	
}
function cerrarInfowindows(){
	for ( var i = 0; i < infoWindows.length; i++) {
		infoWindows[i].close();
	}
}
function crearUnMarcador(trama, tipo){
	//imagen para el marcador
	var image=0;
	//contenido de la ventana de informacion del marcador	
	var content = 	"Fecha: " + trama.dia + "&#47;" + trama.mes + "&#47;" + trama.anio +
					"<br/>Hora: " + trama.hora;					
	if(typeof(trama.velocidad) != "undefined"){
		content += "<br/>Velocidad: " + trama.velocidad + "Km/h" ;
	}
	if(typeof(trama.observacion) != "undefined"){
		content += "<br/>observacion: " + trama.observacion + "Km/h" ;
	}	
		content += "<br/>Direccion: " + trama.direccion;
	if(typeof(trama.tiempoEncendido) != "undefined"){
		content += "<br/>Tiempo Encendido: " + trama.tiempoEncendido;
	}else if(typeof(trama.tiempoApagado) != "undefined"){
		content += "<br/>Tiempo Apagado: " + trama.tiempoApagado;
	}

	if(typeof(trama.alerta) != "undefined"){
		content += "<br/>Alerta: " + trama.aliasAlerta;
	}
	
	image = new google.maps.MarkerImage('../css/images/'+tipo+'.png',
				new google.maps.Size(35, 35),
				new google.maps.Point(0,0),
				new google.maps.Point(17, 17));
		// latitud y longitud para crear el marcador
		var latlng = new google.maps.LatLng(trama.latitud, trama.longitud);
		// sombra necesaria para crear el marker con imagen
		var shadow = new google.maps.MarkerImage('../css/images/centro.png',
				new google.maps.Size(1,1));
		// se crea el marcador y se asocia al mapa
		var marker = new google.maps.Marker({
			map: mapa,
			position: latlng,
			icon: image,
			shadow: shadow,
			zIndex: zindex
		});
		zindex++;
		// se crea la ventana de informacion
		var infoWindow = new google.maps.InfoWindow({
			content: content,
			zIndex: trama.id,
			position: latlng
		});
		//se agrega el evento para que muestre la ventana de informacion cuando se hace click
		google.maps.event.addListener(marker, 'click', function(){		
			cerrarInfowindows();
			infoWindow.open(mapa,marker);
		//	x = marker.getZIndex();
		});		
		markers.push(marker);
		infoWindows.push(infoWindow);
		bounds.extend(latlng);
}

/*
function buscarimagenalertas(aliasAlerta){
	for(var i = 0; imagenesAlertas.length; i++){
		if(imagenesAlertas[i].aliasAlerta == aliasAlerta){
			img = imagenesAlertas[i].img;
			break;
		}
	}
	return img;
}*/
function definirtipo(j,tramas){
	if(j == 0){
		return "inicio";
	}
	if(j == tramas.length - 1){
		return "fin";
	}
	if (j > 0 && j < tramas.length -1) {
		if(typeof(tramas[j].parqueo) != "undefined"){//para saber si es el vehiculo o el detalle
			if(typeof(tramas[j].alerta) != "undefined"){
				return tramas[j].alerta;
			}
			return "centro";
		}else{
			return tramas[j].concepto;
		}
	}			
}
Array.prototype.contains = function (element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
};
/*
function crearImagenesAlertas(tramas){
	var alertas = [];
	for(var i = 0; i < tramas.length; i++) {
		if(typeof(tramas[i].alerta) != "undefined"){
			if(!alertas.contains(tramas[i].alerta)){
				alertas.push({alerta: tramas[i].alerta, aliasAlerta: tramas[i].aliasAlerta});
			}
		}
	}	
	for ( var i = 0; i < alertas.length; i++) {
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.font="bold 13px Arial";
		ctx.fillStyle = obtenerColorAleatorio();
		ctx.textAlign = 'center';
		ctx.fillText(alertas[i].aliasAlerta, 100, 35);
		imagenesAlertas.push({aliasAlerta: alertas[i].aliasAlerta, img: canvas.toDataURL("image/png")});
	}
}*/
/*
function colorLineaRGB(colorLinea){
	colorLinea = colorLinea.substring(1,7);
	coloresLineas.push("rgb("+parseInt(colorLinea.substring(0,2),16)+", "+parseInt(colorLinea.substring(2,4),16)+", "+parseInt(colorLinea.substring(4,6),16)+")");	
}*/


function generarMarcadoresMapa(tramas){
	
	if (tramas.length > 0) {		
	//	coloresLineas.length = 0;
		var colorLinea = obtenerColorAleatorio();
		//colorLineaRGB(colorLinea);
		var colorFlecha = obtenerColorAleatorio();
		var puntoTemp=0;
		var fechaTemp=0;
		var punto=0;
		var fecha=0;	
		
		if(tramas[0].latitud>0){	
			if(tramas.length != 1){
			//	crearImagenesAlertas(tramas);
				for (var j = 0; j < tramas.length; j++) {
					if(tramas[j].latitud>0){
						crearUnMarcador(tramas[j], definirtipo(j,tramas));
						puntoTemp = new google.maps.LatLng(tramas[j].latitud, tramas[j].longitud);
						fechaTemp = tramas[j].dia + "" + tramas[j].mes + "" + tramas[j].anio;
		
						if(fechaTemp.indexOf(fecha) == -1){
							colorLinea = obtenerColorAleatorio();
							//colorLineaRGB(colorLinea);
							colorFlecha = obtenerColorAleatorio();
						}
						if (j>0){ 
							dibujaLinea(punto, puntoTemp, colorLinea, colorFlecha);
						}
						punto = puntoTemp;
						fecha = fechaTemp;
					}
				}
			}else{
				crearUnMarcador(tramas[0], "fin");
			}
		}
	}
}
function creartablamapa(tramas,nombreplaca){

var mi_div = '<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e"  data-inset="true">'+
				'<li data-role="list-divider" role="heading">'+
					'<h3>'+nombreplaca+'</h3>'+	
					'<p>'+tramas.tramas[tramas.tramas.length-1].fecha+'</p>'+	
				'</li>'+
				'<li data-role="list-divider" role="heading" data-theme="a">'+
					'<h3>usuario</h3>'+	
				'</li>';

				for (var i=tramas.detalles.length-1; i>0; i--){  
				var img=definirtipo(i,tramas.detalles);
				if (img=='centro'){
					img='centroTabla';
				}
				mi_div+='<li data-theme="b"><a href="#" name="'+tramas.detalles[i].id+'" id="butonmostraposicionmapa">'+
							'<h3><img src="../css/images/'+img+'.png">'+tramas.detalles[i].hora+'</h3>'+
							'<p> concepto: '+tramas.detalles[i].concepto+'<br> observacion:'+tramas.detalles[i].observacion;
							mi_div+='</p></a>'+
						'</li>';				
				}

				mi_div +='<li data-role="list-divider" role="heading" data-theme="a">'+
							'<h3>vehiculo</h3>'+	
						 '</li>';
				for (var i=tramas.tramas.length-1; i>0; i--){  
				var img=definirtipo(i,tramas.tramas);
				if (img=='centro'){
					img='centroTabla';
				}
				mi_div+='<li><a href="#" name="'+tramas.tramas[i].id+'" id="butonmostraposicionmapa">'+
							'<h3><img src="../css/images/'+img+'.png">'+tramas.tramas[i].hora+'</h3>'+
							'<p> velocidad: '+tramas.tramas[i].velocidad;
							if(typeof(tramas.tramas[i].tiempoEncendido) != "undefined"){
									mi_div+=" Prendido: "+tramas.tramas[i].tiempoEncendido;
								}else if(typeof(tramas.tramas[i].tiempoApagado) != "undefined"){
									mi_div+=" Apagado: "+tramas.tramas[i].tiempoApagado;
								}
							mi_div+='</p></a>'+
						'</li>';				
				}
		mi_div+='</ul>';
	$("#tablamapa").append(mi_div);
	$("#tablamapa").trigger("create");	
	$("#tablamapa").trigger("refresh");			
	loading(false);
}
function mostrarMarcadorPorId(idTramaSeleccionada){
//	if(!esActivaReproduccion){
		cerrarInfowindows();
		for (var i = 0; i < infoWindows.length; i++) {
			if(infoWindows[i].getZIndex() == idTramaSeleccionada){
				infoWindows[i].open(mapa, markers[i]);
				mapa.setCenter(infoWindows[i].getPosition());
				//x = infoWindows[i].getZIndex();
				mapa.setZoom(17);
				break;
			}
		}
		loading(false);
//	}	
}
function posiciongps(concepto,valor,fecha,km,observacion,foto){	
	var options = { enableHighAccuracy: true };
	navigator.geolocation.getCurrentPosition(onSuccess, onError,options);
	function onSuccess(position) {
		/*var pos = 'Latitude: '			+ position.coords.latitude			+ '<br />' +
					'Longitude: '			+ position.coords.longitude			+ '<br />' +
					'Altitude: '			+ position.coords.altitude			+ '<br />' +
					'Accuracy: '			+ position.coords.accuracy			+ '<br />' +
					'Altitude Accuracy: '	+ position.coords.altitudeAccuracy	+ '<br />' +
					'Heading: '				+ position.coords.heading			+ '<br />' +
					'Speed: '				+ position.coords.speed				+ '<br />' +
					'Timestamp: '			+ position.timestamp				+ '<br />';
		var resp = document.getElementById('resp');
		resp.innerHTML = pos;	*/
		registrardetalleservicio(concepto,valor,fecha,km,observacion,foto,position.coords.latitude,position.coords.longitude);
		ejecutarbd();	
	}
    function onError(error) {
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }	
}