var db;
var listajson;
var pilabd = new Array();
var mi_concepto_inicial=0;
var mi_concepto_final=1;

function loading(cargar){
	if (cargar){
		$.mobile.loading( 'show', {
		text: 'cargando....',
		textVisible: true,
		theme: 'z',
		html: "<span class='ui-bar ui-overlay-c ui-corner-all'><img src='../css/images/logoAtlas.png' width='125px' height='50px'  /><h2>loading</h2></span>"
		});
	}else{
		$.mobile.hidePageLoadingMsg();		
	}
}
function reemplazarcomaspesos(cadena){
	cadena=cadena.replace('(', "-");
	cadena=cadena.replace(')', "");
	cadena=cadena.replace('$', "");
	re = /^\$|,/g;
	// remove "$" and ","
	return cadena.replace(re, "");
}
$(function() {
	$('div[data-role="dialog"]').live('pagebeforeshow', function(e, ui) {
		ui.prevPage.addClass("ui-dialog-background ");
	});
	
	$('div[data-role="dialog"]').live('pagehide', function(e, ui) {
		$(".ui-dialog-background ").removeClass("ui-dialog-background ");
	});
});
//aceptarSoloNumeros
function aceptarSoloNumeros(e){
	// MSIE hack
	if (window.event){
		e = window.event;
	}
	var num = (document.all) ? e.keyCode : e.which;
	if(num>=48 && num<=57){
		return true;
	}
	else{
		return false;
	}
}
function aceptarSoloNumerosyNegativos(e){
	// MSIE hack
	if (window.event){
		e = window.event;
	}
	var num = (document.all) ? e.keyCode : e.which;
	if((num>=48 && num<=57)||(num==45)){
		return true;
	}
	else{
		return false;
	}
}
//aceptarSoloLetras
function aceptarSoloLetras(e){
	tecla = (document.all) ? e.keyCode : e.which;
	if ((tecla>64 && tecla < 91) || (tecla > 96 && tecla < 123) || (tecla==8) || (tecla==46) || (tecla==0)){
		return true;
	}
	return false;
}
//format
function format(tipo,dato){
	if (dato == null){
		return '';	
	}
	else{
		arreglo=dato.split(' ');
		if (tipo=='fecha'){
			return arreglo[0];
		}
		else{
			return arreglo[1]+arreglo[2];
		}
	}
}
//fechaactual
function fechaactual(){
	var myDate = new Date();
	var dia = myDate.getDate();
	var mes = myDate.getMonth() + 1;
	var ano = myDate.getFullYear();
	var tiempo = myDate.getHours()>12?myDate.getHours()-12+":"+myDate.getMinutes() +' PM':myDate.getHours()+":"+myDate.getMinutes() +' AM ';
	return (dia+ '/' + mes + '/' + ano + ' ' + tiempo);	
}
function conexiononline(){
	if (((typeof(Cordova) != 'undefined' || typeof(cordova) != 'undefined') && navigator.connection))
	{
		var networkState = navigator.network.connection.type;
		
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.NONE]     = 'No network connection';
	
		if (networkState==Connection.UNKNOWN || networkState==Connection.NONE)
			return false;
		else 
			return true;
	}else {
		if (navigator.onLine)
			return true;
		else	
			return false;
	}
}
//error
function error(untitle, unerror,undiv){
	this.title = untitle;
	this.error = unerror;
	this.vererror = function (){
/*	$('body').append(	'<div data-role="page" id="dialog">'+
							'<div data-role="header"><h1 id="idtexterrortitle"></h1></div>'+
							'<div data-role="content" id="idtexterror"></div>'+
							'<div data-role="footer" align="center"><input type="button" data-inline="true" data-icon="check" data-iconpos="left" value="aceptar" data-mini="true" data-theme="a" id="butondialogcerrar"></div>'+
						'</div>'+
						'<a id="lnkDialog" href="#dialog" data-rel="dialog" data-transition="pop" style="display:none;"></a>');
	$("#idtexterrortitle").html(this.title);					  
	$("#idtexterror").html(this.error);
	$("#lnkDialog").click();*/
	
		$('body').append('<div data-role="popup" id="dialog" data-theme="d" data-overlay-theme="b" class="ui-content" style="max-width:340px;">'+
		'	<h3 id="idtexterrortitle"></h3>'+
		'	<p id="idtexterror"></p>'+
		'	<a href="#" name="'+undiv+'" id="butondialogcerrar" data-role="button" data-theme="b" data-rel="back" data-inline="true" data-mini="true">Aceptar</a>'+
		'</div>'+
		'<a href="#dialog" id="lnkDialog" data-rel="popup" data-position-to="window" data-transition="pop"></a>');

	$('body').trigger("create");	
	$("#idtexterrortitle").html(this.title);					  
	$("#idtexterror").html(this.error);
	loading(false);
	$("#lnkDialog").click();
	$('#divcontanedorforma'+undiv).trigger('expand');
	}
}
/*$('#butondialogcerrar').live('click',function(){  
//	$('#dialog').dialog("close" );
	if ($(this).attr('name')=='aprobarservicios'){
		$("#modificarservicio").click();
		//$("#modificarservicio").popup("open");
		//alert("abrirss");
	}
});*/   
function colorservicio(estado){
	//cuando se crea el registro
	if (estado=='INICIAL'){
		return ('e');//amarillo			
	}
	//se termina el registro
	else if (estado=='FINAL'){
		return ('b');//azul
	}
	//fue enviado a la bd
	else if (estado=='ENVIADO'){
		return ('d');//gris
	}
	else if (estado=='MODIFICADO'){
		return ('c');//
	}	
	else if (estado=='APROBADO'){
		return ('e');//
	}		
	//regreso de la bd
	else if (estado=='TERMINADO'){
		return ('a');//negro
	}
}


function controlarventana(undiv){
	estado = window.localStorage.getItem("estado");
	if (!estado){ 		 
		window.localStorage.setItem("estado", "registrarservicio");       	
	}
	if (consultarseguridad('servicio')){
		$('#contenedorformaservicio').load(window.localStorage.getItem("estado")+".html",function(){
														$('#contenedorformaservicio').trigger("create");
														eval("page"+window.localStorage.getItem("estado")+"()");});
	}
	if (consultarseguridad('pagos')){
		$('#contenedorformapago').load("registrarpago.html",function(){
														$('#contenedorformapago').trigger("create");
														eval("pageregistrarpago()");});
	}
	if (consultarseguridad('mapa')){
		$('#contenedorformamapa').load("registrarmapa.html",function(){
														$('#contenedorformamapa').trigger("create");
														eval("pageregistrarmapa()");});
	}	
	$('#acordeonvisualizar').collapsibleset("refresh");	
	$('#divcontanedorforma'+undiv).trigger('expand');
	loading(false);
//	$.mobile.changePage(window.localStorage.getItem("estado")+".html", { transition: "fade"});  
}
function registrarseguridad(arreglo,idusuario,login){
	window.localStorage.setItem("seguridad", arreglo);  
	window.localStorage.setItem("idusuario", idusuario);  
	window.localStorage.setItem("login", login);  
} 
function consultarseguridad(seguridad){
	var arreglos = $.parseJSON(window.localStorage.getItem("seguridad"));
	var arreglo  = arreglos.seguridad;
	for(var i = 0; i < arreglo.length; i++){
		if (seguridad==arreglo[i]){
			return true;
		}
	}
	return false;
}



function tanquearlistplaca(idlist,mi_valor){
	cadena = "SELECT id,placa FROM vehiculo ;";
	parametros = [];
	
	function resultado(results){
		var selectindex=0;
		for (var i=0; i<results.rows.length; i++){   
			$(idlist).append('<option value="'+results.rows.item(i).id+'">'+results.rows.item(i).placa+'</option>');  
		}
		$(idlist).val(mi_valor);
		$(idlist).selectmenu('refresh');
	}
	agregarbd(cadena, parametros, resultado, errorCB);
} 
function tanquearlistempresa(idlist,mi_valor){
	cadena = "SELECT id,nombre FROM empresa ;";
	parametros = [];
	function resultado(results){
		for (var i=0; i<results.rows.length; i++){     
			$(idlist).append('<option value='+results.rows.item(i).id+'>'+results.rows.item(i).nombre+'</option>');  
		}
		$(idlist).val(mi_valor);
		$(idlist).selectmenu('refresh');
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}
function tanquearlistconcepto(idlist,mi_valor){
	cadena = "SELECT id,descripcion FROM concepto WHERE concepto.visible='true';";
	parametros = [];
	function resultado(results){
		for (var i=0; i<results.rows.length; i++){     
			$(idlist).append('<option value='+results.rows.item(i).id+'>'+results.rows.item(i).descripcion+'</option>');  
		}
		$(idlist).val(mi_valor);
		$(idlist).selectmenu('refresh');
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}	 
function tanquearlistusuario(idlist){
	var cadena = "SELECT id,login FROM usuario ;";
	parametros = [];
	function resultado(results){
		for (var i=0; i<results.rows.length; i++){   
				$(idlist).append('<option value='+results.rows.item(i).id+'>'+results.rows.item(i).login+'</option>');  
		}
	}
	agregarbd(cadena,parametros,resultado,errorCB);
}
function tanquearcheckusuario(idcheck){
	var cadena = "SELECT id,login FROM usuario ;";
	parametros = [];
	function resultado(results){
		var mi_div=	'<fieldset data-role="controlgroup" data-mini="true">'+
                '<legend>Usuarios:</legend>';
		for (var i=0; i<results.rows.length; i++){   
				mi_div+='<input type="checkbox" name="sincronizar[]" id="sincronizar'+i+'"   data-theme="e" class="custom" value="'+results.rows.item(i).id+'"/>'+
                		'<label for="sincronizar'+i+'">'+results.rows.item(i).login+'</label>';
		}
            mi_div+='</fieldset>';
			$(idcheck).html(mi_div);
			$(idcheck).trigger("create");					
	}
	agregarbd(cadena,parametros,resultado,errorCB);
}
function tanquearlistfecha(idlistdia,idlistmes,idlistano){
	for (var i=1; i<32; i++){   
			$(idlistdia).append('<option value='+i+'>'+i+'</option>');  
	}
	for (var i=1; i<13; i++){   
			$(idlistmes).append('<option value='+i+'>'+i+'</option>');  		
	}
	for (var i=2013; i<2016; i++){   
			$(idlistano).append('<option value='+i+'>'+i+'</option>');  		
	}
}
		


function registrarservicio(fecha,placa,kminicio,empresa){
	cadena= "INSERT INTO servicio (idusuario,fecha,idvehiculo,idempresa,kminicio,estado) VALUES (?,?,?,?,?,?);";
	parametros = [window.localStorage.getItem("idusuario"),fecha,placa,empresa,kminicio,'INICIAL'];
	function resultadoservicio(results){
		window.localStorage.setItem("idservicio", results.insertId);  
		window.localStorage.setItem("estado", "registrardetalleservicio"); 
		if (typeof(Cordova) != 'undefined' || typeof(cordova) != 'undefined'){	
			posiciongps(mi_concepto_inicial,0,fecha,'','','');
		}else{	
			registrardetalleservicio(mi_concepto_inicial,0,fecha,'','','',0,0);
		}
		controlarventana(); 
	} 
	function errorCB(){
		new error('Error','Datos incorrectos.').vererror();
	}
	agregarbd(cadena, parametros, resultadoservicio, errorCB);
}
function registrardetalleservicio(concepto,valor,fecha,km,observacion,foto,altitud,longitud){
	
	cadena= "INSERT INTO detalleservicio (idservicio,idconcepto,valor,fecha,coordenadalatitud,coordenadalongitud,km,observacion,foto) VALUES (?,?,?,?,?,?,?,?,?);";
	parametros = [window.localStorage.getItem("idservicio"),concepto,valor,fecha,altitud,longitud,km,observacion,foto];

	function resultado(results){
		if (concepto!=mi_concepto_inicial && concepto!=mi_concepto_final){//if para guardar el concepto inicial y final
			new error('Informacion','Se registro el concepto por valor de '+ valor,'servicio').vererror(); 
			pageregistrardetalleservicio();
		}
	}
	function errorCB(){
		new error('Error','Datos incorrectos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}
function finalizardetalleservicio(){
	window.localStorage.setItem("estado", "finalizarservicio");
	controlarventana();   
}  
function registrarfinalizarservicio(kmfinal,recorrido,fecha,observacion){
	loading(true);
	cadena= "UPDATE servicio SET kmfinal=?,recorrido=?,estado=?,fechafinal=?,observacion=? where id = ?;";
	parametros = [kmfinal,recorrido,'FINAL',fecha,observacion,window.localStorage.getItem("idservicio")];
	function resultado(results){
		window.localStorage.setItem("estado", "registrarservicio");

		if (typeof(Cordova) != 'undefined' || typeof(cordova) != 'undefined'){	
			posiciongps(mi_concepto_final,0,fecha,'','','');
		}else{	
			registrardetalleservicio(mi_concepto_final,0,fecha,'','','',0,0);
		}
			
		new error('Informacion','Se termino con exito el servicio','servicio').vererror(); 
		visualizarpagebeforeshow('servicio');
	}
	function errorCB(){
		new error('Error','Datos incorrectos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}
function registrarpago(usuario,valor,observacionpago,fecha){
	loading(true);
	cadena= "INSERT INTO pago (idusuario,fecha,observacion,idusuarioregistro,valor,estado) VALUES (?,?,?,?,?,?);";
	parametros = [usuario,fecha,observacionpago,window.localStorage.getItem("idusuario"),valor,'FINAL'];
	function resultado(results){
		visualizarpagebeforeshow('pago');   
		new error('Informacion','Se registro el pago por valor de '+ valor,'pago').vererror(); 
	}
	function errorCB(){
		new error('Error','Datos incorrectos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorCB);	
}
function sqlsincronizarBD(login,pasword,inicializar,sincronizardatos){
	cadena= "";
	parametros = [];
	function resultado(results){
		new error('Informacion','Se corre sincronizarbd por valor de '+ valor).vererror(); 
	}
	function errorCB(){
		sincronizarBD(login,pasword,inicializar,sincronizardatos);	
	}
	agregarbd(cadena, parametros, resultado, errorCB);	
}	
function sqlcontrolarventana(undiv){
	cadena= "";
	parametros = [];
	function resultado(results){
		new error('Informacion','Se registro el pago por valor de '+ valor).vererror(); 
	}
	function errorCB(){
		controlarventana(undiv);   
	}
	agregarbd(cadena, parametros, resultado, errorCB);	
}
function aprobarservicio(idservicio){
	loading(true);
	cadena= "";
	parametros = [];
	var aprobarservicios = new Array();
	for (var i=0; i<idservicio.length; i++){  
		aprobarservicios.unshift("UPDATE servicio SET estado='APROBADO' where id = "+idservicio[i]+";");
	}
	ejecutartablas(aprobarservicios);
	visualizarpagebeforeshow('aprobarservicios');
	function resultado(results){
	}
	function errorCB(){
		new error('Informacion','Se aprobaron con exito.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}
function registrarmodificarservicio(kminicial,kmfinal,placa,empresa,idservicio){
	cadena= "UPDATE servicio SET kminicio=?,kmfinal=?,idvehiculo=?,idempresa=?,estado=? where id = ?;";
	parametros = [kminicial,kmfinal,placa,empresa,'MODIFICADO',idservicio];
	
	function resultado(results){
		new error('Informacion','Se modifico con exito el servicio').vererror(); 
	}
	function errorCB(){
		new error('Error','Datos incorrectos. registrar modificar servicio').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}
function registrarmodificardetalleservicio(idconcepto,valor,iddetalleservicio){
	cadena= "UPDATE detalleservicio SET idconcepto=?,valor=? where id = ?;";
	parametros = [idconcepto,valor,iddetalleservicio];
	
	function resultado(results){
		//new error('Informacion','Se modifico con exito el detalleservicio').vererror(); 
	}
	function errorCB(){
		new error('Error','Datos incorrectos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}

