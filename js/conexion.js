function conexionbd(){
    try {
        if (!window.openDatabase) {
            alert('No es soportada');
        } else {
            db = window.openDatabase("atlasmantenimiento", "1.0", "atlas mantenimiento", 65536); 
        }
    } catch(e) {        
        if (e == 2) {            
            alert("Invalida vesion de base de datos.");
        } else {
            alert("Error desconocido "+e+".");
        }
        return;
    }
}
function existebd(){
	cadena= "SELECT * FROM usuario";
	parametros = [];
	function siexiste(){
		alert("existe la bd");
	}
	function noexiste(){
		alert("no existe la bd");
		ejecutartablas(tablasborrar);
		ejecutartablas(tablas);  
		ejecutarbd();	   
	}
	agregarbd(cadena,parametros,siexiste,noexiste);	  
}
function agregarbd(cadena,parametros,resultados,error){
	var pilita = {};
	pilita.cadena = cadena;
	pilita.parametros = parametros;
	pilita.resultados = resultados;
	pilita.error = error;
	pilabd.unshift(pilita);
}
function ejecutarbd(){
	db.transaction(ejecutar, errorCB);
	function ejecutar(tx){
		if(pilabd.length>0){  
			console.log(pilabd[pilabd.length-1].cadena);
			//console.log(pilabd[pilabd.length-1].parametros);
			tx.executeSql(pilabd[pilabd.length-1].cadena, pilabd[pilabd.length-1].parametros, resultado, error);
		}
	}
	function resultado(tx, results){
		pilabd[pilabd.length-1].resultados(results);
		pilabd.pop();
		if(pilabd.length>0){
			db.transaction(ejecutar, errorCB);
		}
	}
	function error(err){
		pilabd[pilabd.length-1].error(err);
		pilabd.pop();
	}
}
function ejecutartablas(cadena){
	while(cadena.length>0){   
		agregarbd(cadena[cadena.length-1],[],successCB,errorCB);    
			cadena.pop();
	}
	function successCB(){
		console.log("Fue correcta la ejecucion");    
	}
	function errorCB(err){
		console.log("Error procesando SQL en llenar tablas: "+err.code+ " mesage= "+err.message);    
	}	
}
function checkConnection(login,pasword,inicializar,sincronizardatos) {
	loading(true);
	if (conexiononline()){
		//organizar lista
		listajson='';
		tanquearlistajsonservicio('final');
		tanquearlistajsonservicio('modificado');
		tanquearlistajsonpago();
		estado = window.localStorage.getItem("estado")
		var loginestore = window.localStorage.getItem("login")
		if (!estado){
			inicializar=true;
		}else{
			if ((loginestore)&&(loginestore!=login)){
			  if(estado=='registrarservicio'){
			  	inicializar=true;
			  } else {
				 new error('Error','Debe terminar el registro del anterior usuario').vererror();
				 return false;
			  }
			}
		}
		if (inicializar){
			tablasborrar=llenartablasborrar();
			ejecutartablas(tablasborrar);
		}
		sqlsincronizarBD(login,pasword,inicializar,sincronizardatos);
		ejecutarbd();
		//agregarbd(cadena, parametros, resultado, errorjson);
		
	}
	else{
		registrarlogin(login,pasword);
		ejecutarbd();
	}
}
function tanquearlistajsonservicio(estado){
	if (estado=='modificado'){
		cadena =    "SELECT servicio.id,"+	  
					" servicio.idservidor,"+
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" servicio.idusuario,"+
					" servicio.idvehiculo,"+
					" servicio.idempresa,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" detalleservicio.fecha fechadetalle,"+
					" detalleservicio.id iddetalleservicio,"+					
					" detalleservicio.idservidor idservidordetalleservicio,"+										
					" detalleservicio.idconcepto,"+
					" detalleservicio.valor, "+
					" detalleservicio.coordenadalatitud,"+
					" detalleservicio.coordenadalongitud,"+
					" detalleservicio.foto,"+
					" detalleservicio.km,"+
					" detalleservicio.observacion,"+												 
					" servicio.estado"+
			   " FROM servicio,detalleservicio"+
			  " WHERE servicio.idservidor = detalleservicio.idservicio "+			   
			    " AND servicio.estado in ('MODIFICADO','APROBADO');";			 
	}else{		  
	cadena =  "SELECT servicio.id,"+	  
					" servicio.idservidor,"+
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" servicio.idusuario,"+
					" servicio.idvehiculo,"+
					" servicio.idempresa,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" detalleservicio.fecha fechadetalle,"+
					" detalleservicio.id iddetalleservicio,"+					
					" detalleservicio.idservidor idservidordetalleservicio,"+										
					" detalleservicio.idconcepto,"+
					" detalleservicio.valor, "+
					" detalleservicio.coordenadalatitud,"+
					" detalleservicio.coordenadalongitud,"+
					" detalleservicio.foto,"+
					" detalleservicio.km,"+
					" detalleservicio.observacion,"+												 
					" servicio.estado"+
			   " FROM servicio,detalleservicio "+
			  " WHERE servicio.id = detalleservicio.idservicio "+			   
			    " AND servicio.estado in ('FINAL');";			   
	}
	parametros = [];

	function resultado(results){
		transmisionupdate = new Array();
		if ((estado=='modificado') && (listajson.length>0)){
			var cadenajson =',';
		}else {
			var cadenajson ='';
		}
		var miid = null;
		for (var i=0; i<results.rows.length; i++){     
			if (i>0){
				cadenajson+=",";
			}
		//	transmisionupdate.unshift('UPDATE servicio SET estado="ENVIADO" where id = '+results.rows.item(i).id+';');
			
			cadenajson+='{"id":"'+results.rows.item(i).id+'",'+
						'"idservidor":"'+results.rows.item(i).idservidor+'",'+
						'"fecha":"'+results.rows.item(i).fecha+'",'+
						'"fechafinal":"'+results.rows.item(i).fechafinal+'",'+
						'"idusuario":"'+results.rows.item(i).idusuario+'",'+						
						'"idvehiculo":"'+results.rows.item(i).idvehiculo+'",'+
						'"idempresa":"'+results.rows.item(i).idempresa+'",'+
						'"kminicio":"'+results.rows.item(i).kminicio+'",'+
						'"kmfinal":"'+results.rows.item(i).kmfinal+'",'+
						'"recorrido":"'+results.rows.item(i).recorrido+'",'+
						'"observacion":"'+results.rows.item(i).observacion+'",'+
						'"estado":"'+results.rows.item(i).estado+'",';
			miid = results.rows.item(i).id;		 
			cadenajson+='"detalleservicio" : [';		 
			for (var j=i; j<results.rows.length; j++){     
				if (miid==results.rows.item(j).id) {
					if (i!=j){
						cadenajson+=",";
					}
					if (results.rows.item(j).idconcepto != null){
						cadenajson+='{"id":"'+results.rows.item(j).iddetalleservicio+'",'+										
									  '"idservidor":"'+results.rows.item(j).idservidordetalleservicio+'",'+										
									  '"concepto":"'+results.rows.item(j).idconcepto+'",'+
						  			  '"fecha":"'+results.rows.item(j).fechadetalle+'",'+
									  '"valor":"'+results.rows.item(j).valor+'",'+
									  '"coordenadalatitud":"'+results.rows.item(j).coordenadalatitud+'",'+
									  '"coordenadalongitud":"'+results.rows.item(j).coordenadalongitud+'",'+
									  '"foto":"'+results.rows.item(j).foto+'",'+ 
									  '"km":"'+results.rows.item(j).km+'",'+
									  '"observacion":"'+results.rows.item(j).observacion+'"}';
					}
				}
				else{
					break;
				}
			}
			i=j-1;
			cadenajson+="]}";		 
		}
		if (estado=='modificado'){
			listajson='{"servicio": ['+listajson+cadenajson+']';
		}else{
			listajson+=cadenajson;
		}
		console.log("json="+cadenajson);
	}
	function errorjson(error){
		new error('Error','Erorr en la sincronizacion de datos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorjson);
} 
function tanquearlistajsonpago(){
	cadena =  "SELECT pago.id,"+	
					" pago.idservidor,"+  
					" pago.fecha,"+
					" pago.idusuario,"+
					" pago.idusuarioregistro,"+
					" pago.valor,"+
					" pago.observacion,"+
					" pago.estado "+
			   " FROM pago "+
			  " WHERE pago.estado='FINAL';";
	parametros = [];
	  
	function resultado(results){
		var cadenajson = ',"pago": ['
		for (var i=0; i<results.rows.length; i++){   
			if (i>0){
				cadenajson+=",";
			}  
			//transmisionupdate.unshift('UPDATE pago SET estado="ENVIADO" where id = '+results.rows.item(i).id+';');

			cadenajson+='{"id":"'+results.rows.item(i).id+'",'+
						'"idservidor":"'+results.rows.item(i).idservidor+'",'+
						'"fecha":"'+results.rows.item(i).fecha+'",'+
						'"idusuario":"'+results.rows.item(i).idusuario+'",'+
						'"idusuarioregistro":"'+results.rows.item(i).idusuarioregistro+'",'+
						'"valor":"'+results.rows.item(i).valor+'",'+
						'"observacion":"'+results.rows.item(i).observacion+'",'+
						'"estado":"'+results.rows.item(i).estado+'"'+						
						'}';		 
		}
		cadenajson+= "]}";
		listajson+=cadenajson;
		console.log("json="+cadenajson);
		console.log("total="+listajson);
	}
	function errorjson(error){
		new error('Error','Erorr en la sincronizacion de datos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorjson);
} 
function sincronizarBD(logins,paswords,inicializarse,sincronizardatos){
	var urls ='http://www.reactiva.com.co:8097/atlas/rest/atlasWS/sincronizar' ;
//var urls= 'http://192.168.10.64:8097/atlas/rest/atlasWS/sincronizar' ;
	try{
		$.ajax({
			type: 'POST',
			url: urls ,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			data: {login: logins,
				   password:paswords,
				   datosPlanilla:listajson,
				   inicializar:inicializarse,
				   usuarios:sincronizardatos},
			success: success,
			error: errorws
		});
	}
	catch(err){
		new error('Error','Datos incorrectos. invocando web service '+data.error).vererror();
	}
	function success(data, textStatus, jqXHR) {
		if(typeof(data.error) != "undefined"){
			new error('Error','Datos incorrectos').vererror();
		}else{
			console.log(data);
			crearTablas(logins,paswords,data);
			console.log("transmisioninsert");
			ejecutartablas(transmisioninsert);
			console.log("transmisionupdate");
			ejecutartablas(transmisionupdate);
			registrarlogin(logins,paswords);
			ejecutarbd();
		}
	}
	function errorws(jqXHR, textStatus, errorThrown) {
		alert(jqXHR.responseText + " " + textStatus + " " + errorThrown);
	}
}
function crearTablas(login,password,datosTablasJson){
	transmisioninsert = new Array();	
	var usuario   = datosTablasJson.datos[0].usuario;
	var vehiculos = datosTablasJson.datos[1].vehiculos;
	var empresas  = datosTablasJson.datos[2].empresas;
	var conceptos = datosTablasJson.datos[3].conceptos;
	var servicios = datosTablasJson.datos[4].servicios;
	var pagos 	  = datosTablasJson.datos[5].pagos;
	
	for(var i = 0; i < usuario.length; i++){
		if (usuario[i].sql=='INSERT'){
			newpassword=(login==usuario[i].login)?password:'';
			transmisioninsert.unshift("INSERT INTO usuario (id,login,password,permisos) VALUES ("+usuario[i].consecutivo+",'"+usuario[i].login+"','"+newpassword+"','"+JSON.stringify(usuario[i].permisos[0])+"');");		
		}
	}
	for(var i = 0; i < vehiculos.length; i++){
		if (vehiculos[i].sql=='INSERT'){
			transmisioninsert.unshift('INSERT INTO vehiculo (id,placa) VALUES ('+vehiculos[i].consecutivo+',"'+vehiculos[i].placa+'");');
		} else if (vehiculos[i].sql=='UPDATE'){
			transmisioninsert.unshift('UPDATE vehiculo SET placa="'+vehiculos[i].placa+'" WHERE id='+vehiculos[i].consecutivo+';');
		} else if (vehiculos[i].sql=='DELETE'){
			transmisioninsert.unshift('DELETE FROM vehiculo WHERE id='+vehiculos[i].consecutivo+';');
		}
	}
	for(var i = 0; i < empresas.length; i++){
		if(empresas[i].sql=='INSERT'){
			transmisioninsert.unshift('INSERT INTO empresa (id,nombre) VALUES ('+empresas[i].consecutivo+',"'+empresas[i].nombre+'");');
		} else if(empresas[i].sql=='UPDATE'){
			transmisioninsert.unshift('UPDATE empresa SET nombre="'+empresas[i].nombre+'" WHERE id='+empresas[i].consecutivo+';');
		} else if(empresas[i].sql=='DELETE'){
			transmisioninsert.unshift('DELETE FROM empresa WHERE id='+empresas[i].consecutivo+';');
		}
	}
 	for(var i = 0; i < conceptos.length; i++){
		if(conceptos[i].sql=='INSERT'){
			transmisioninsert.unshift('INSERT INTO concepto (id,descripcion,foto,km,observacion,visible) VALUES ('+conceptos[i].consecutivo+',"'+conceptos[i].descripcion+'","'+conceptos[i].foto+'","'+conceptos[i].km+'","'+conceptos[i].observacion+'","'+conceptos[i].visible+'");');
		} else if(conceptos[i].sql=='UPDATE'){
			transmisioninsert.unshift('UPDATE concepto SET descripcion="'+conceptos[i].descripcion+'",coordenadas='+conceptos[i].coordenada+',foto='+conceptos[i].foto+',km='+conceptos[i].km+',visible="'+conceptos[i].visible+'" WHERE id ='+conceptos[i].consecutivo+';');
		} else if(conceptos[i].sql=='DELETE'){
			transmisioninsert.unshift('DELETE FROM concepto WHERE id='+conceptos[i].consecutivo+';');
		}
	}
	for(var i = 0; i < servicios.length; i++){
		if(servicios[i].sql=='INSERT'){
			transmisioninsert.unshift('INSERT INTO servicio (idservidor,idusuario,fecha,fechafinal,idvehiculo,idempresa,kminicio,kmfinal,recorrido,observacion,saldoanterior,valorpago,valordetalleservicio,total,estado) VALUES ('+servicios[i].idservidor+','+servicios[i].idusuario+',"'+servicios[i].fecha+'","'+servicios[i].fechafinal+'",'+servicios[i].idvehiculo+','+servicios[i].idempresa+','+servicios[i].kminicio+','+servicios[i].kmfinal+',"'+servicios[i].recorrido+'","'+servicios[i].observacion+'",'+servicios[i].saldoanterior+','+servicios[i].valorpago+','+servicios[i].valordetalleservicio+','+servicios[i].total+',"'+servicios[i].estado+'");');				
			var arraydetalleservicio=servicios[i].detalleservicio;
			for(var j = 0; j < arraydetalleservicio.length; j++){
				transmisioninsert.unshift('INSERT INTO detalleservicio (idservidor,idservicio,fecha,idconcepto,valor,coordenadalatitud,coordenadalongitud) VALUES ('+arraydetalleservicio[j].idservidor+','+arraydetalleservicio[j].idservicio+',"'+arraydetalleservicio[j].fecha+'",'+arraydetalleservicio[j].idconcepto+','+arraydetalleservicio[j].valor+','+arraydetalleservicio[j].coordenadalatitud+','+arraydetalleservicio[j].coordenadalongitud+');');	
			}
		} else if(servicios[i].sql=='UPDATE'){
			alert("esto no esta implementado");
			console.log("no se implemento el update en la sicronizacion de servicio");
			//transmisioninsert.unshift('UPDATE concepto SET descripcion="'+conceptos[i].descripcion+'" WHERE id ='+conceptos[i].consecutivo+';');
		} else if(servicios[i].sql=='DELETE'){
			var arraydetalleservicio=servicios[i].detalleservicio;
			for(var j = 0; j < arraydetalleservicio.length; j++){
				if(typeof(servicios[i].id) == "undefined"){
					transmisioninsert.unshift('DELETE FROM detalleservicio WHERE idservidor='+arraydetalleservicio[j].idservidor+';');
				}else{
					transmisioninsert.unshift('DELETE FROM detalleservicio WHERE id='+arraydetalleservicio[j].id+';');	
				}
			}
			if(typeof(servicios[i].id) == "undefined"){
				transmisioninsert.unshift('DELETE FROM servicio WHERE idservidor='+servicios[i].idservidor+';');
			}else{
				transmisioninsert.unshift('DELETE FROM servicio WHERE id='+servicios[i].id+';');
			}
		}
	}	
	for(var i = 0; i < pagos.length; i++){
		if(pagos[i].sql=='INSERT'){
			transmisioninsert.unshift('INSERT INTO pago (idservidor,idusuario,fecha,observacion,idusuarioregistro,valor,estado) VALUES ('+pagos[i].idservidor+','+pagos[i].idusuario+',"'+pagos[i].fecha+'","'+pagos[i].observacion+'",'+pagos[i].idusuarioregistro+','+pagos[i].valor+',"'+pagos[i].estado+'");');
		} else if(pagos[i].sql=='UPDATE'){
			transmisioninsert.unshift('UPDATE pago SET idservidor='+pagos[i].idservidor+',idusuario='+pagos[i].idusuario+',fecha="'+pagos[i].fecha+'",observacion="'+pagos[i].observacion+'",idusuarioregistro='+pagos[i].idusuarioregistro+',valor='+pagos[i].valor+',estado="'+pagos[i].estado+'" WHERE id ='+pagos[i].id+';');
		} else if(pagos[i].sql=='DELETE'){
			if(typeof(pagos[i].id) == "undefined"){
				transmisioninsert.unshift('DELETE FROM pago WHERE idservidor='+pagos[i].idservidor+';');
			}else{
				transmisioninsert.unshift('DELETE FROM pago WHERE id='+pagos[i].id+';');
			}
		}
	}	
}
function registrarlogin(login,pasword){
	cadena= "SELECT id,login,password,permisos FROM usuario WHERE login = ? AND password = ? ;";
	parametros = [login,pasword];
	
	function resultado(results){
		if (results.rows.length==1){
			//'{"seguridad":["pagos","visor","servicio"]}'
			registrarseguridad(results.rows.item(0).permisos,results.rows.item(0).id,results.rows.item(0).login);
//			visualizarpagebeforeshow();
			$.mobile.changePage("visualizarcargar.html", {transition: "fade"});
			$.mobile.changePage("visualizar.html", {transition: "fade"});
		} else{
			new error('Error logear','Datos incorrectos aqui.').vererror();
		}
	}
	function noexiste(){
		new error('Error','Debe tener al menos una primera conexion.').vererror();
	}	  
	agregarbd(cadena, parametros, resultado, noexiste);
}
function visualizarservicios(idacordeonvisualizarservicios,estado){
	if (estado=='final'){
	var cadena =  "SELECT servicio.id,"+	
					" servicio.idservidor,"+  
					" usuario.login usuario,"+  
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" vehiculo.placa,"+
					" servicio.idvehiculo,"+					
					" empresa.nombre,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" concepto.descripcion as concepto,"+
					" concepto.visible,"+	
					" concepto.foto,"+	
					" detalleservicio.valor, "+
    				" detalleservicio.fecha as fechadetalleservicio, "+	
    				" detalleservicio.idservidor as detalleservicioidservidor, "+													
					" servicio.saldoanterior,"+
					" servicio.valorpago,"+
					" servicio.valordetalleservicio,"+															
					" servicio.total,"+					
					" servicio.estado "+
			   " FROM servicio,detalleservicio,empresa,vehiculo,concepto,usuario "+
			   " WHERE servicio.id = detalleservicio.idservicio"+
			   " AND empresa.id = servicio.idempresa "+
			   " AND vehiculo.id = servicio.idvehiculo "+
			   " AND detalleservicio.idconcepto=concepto.id "+
			   " AND servicio.idusuario=usuario.id "+
			   " AND (servicio.estado IN ('FINAL'));";
	}else{
	 var  cadena =  "SELECT servicio.id,"+	
					" servicio.idservidor,"+  
					" usuario.login usuario,"+  
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" vehiculo.placa,"+
					" servicio.idvehiculo,"+
					" empresa.nombre,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" concepto.descripcion as concepto,"+
					" concepto.visible,"+	
					" concepto.foto,"+	
					" detalleservicio.valor, "+
    				" detalleservicio.fecha as fechadetalleservicio, "+	
    				" detalleservicio.idservidor as detalleservicioidservidor, "+													
					" servicio.saldoanterior,"+
					" servicio.valorpago,"+
					" servicio.valordetalleservicio,"+															
					" servicio.total,"+					
					" servicio.estado "+					
			   " FROM servicio,detalleservicio,empresa,vehiculo,concepto,usuario "+
			   " WHERE servicio.idservidor = detalleservicio.idservicio"+
			   " AND empresa.id = servicio.idempresa "+
			   " AND vehiculo.id = servicio.idvehiculo "+
			   " AND detalleservicio.idconcepto=concepto.id "+
			   " AND servicio.idusuario=usuario.id "+
			   " AND (servicio.estado NOT IN ('INICIAL','FINAL'))"+
			   " ORDER BY servicio.idservidor desc;";
	}
	  parametros = [];
	  
	function resultado(results){
		if (results.rows.length > 0){
		var mi_div='';
		if (estado!='final'){
			mi_div+='<div id="divcontanedorformavisorserviciosgrande" data-role="collapsible">'+
					'<h3>Historico Servicios</h3>'+
					'<div id="divcontanedorformavisorservicios" data-role="collapsible-set" >';
		}
		for (var i=0; i<results.rows.length; i++){     
			var sumadetalles=0;
			var mi_idservicio = (!results.rows.item(i).idservidor)?'':results.rows.item(i).idservidor;   
			
			
			mi_div+= '<div data-role="collapsible" data-theme="'+colorservicio(results.rows.item(i).estado)+'">'+
						'<h3>'+mi_idservicio+'.		'+format("fecha",results.rows.item(i).fecha)+'				'+results.rows.item(i).nombre+'</h3>'+
						'<div class="ui-grid-b">'+
							'<div class="ui-block-a"><strong>'+results.rows.item(i).placa+' - '+results.rows.item(i).usuario+'</strong></div>'+
							'<div class="ui-block-b"><strong>INICIAL</strong></div>'+
							'<div class="ui-block-c"><strong>FINAL</strong></div>'+
							'<div class="ui-block-a"><strong>HORA</strong></div>'+
							'<div class="ui-block-b">'+format("hora",results.rows.item(i).fecha)+'</div>'+
							'<div class="ui-block-c">'+format("hora",results.rows.item(i).fechafinal)+'</div>'+
							'<div class="ui-block-a"><strong>KM</strong></div>'+
							'<div class="ui-block-b"><div class="valor">'+results.rows.item(i).kminicio+'</div></div>'+
							'<div class="ui-block-c"><div class="valor">'+results.rows.item(i).kmfinal+'</div></div>'+                            
						'</div>'+
						'<div data-role="fieldcontain">'+
							'<fieldset data-role="controlgroup">'+
								'<label for="textareadestino">Destino</label>'+
								'	<textarea id="textareadestino" disabled="disabled" >'+results.rows.item(i).recorrido+'</textarea>'+
							'</fieldset>'+
						'</div>'+
						'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="'+colorservicio(results.rows.item(i).estado)+'" data-inset="true">'+
							'<li data-role="list-divider" role="heading">'+
								'<div class="ui-grid-b">'+
									'<div class="ui-block-a"><strong>CONCEPTO</strong></div>'+
									'<div class="ui-block-b"><strong>VALOR</strong></div>'+
									'<div class="ui-block-c"><strong>HORA</strong></div>'+											
								'</div>'+	
							'</li>';

			miid = results.rows.item(i).id;		 
			for (var j=i; j<results.rows.length; j++){     
				if (miid==results.rows.item(j).id){
					if(results.rows.item(j).concepto!=null&&results.rows.item(j).visible=='true'){
						mi_div+='<li>'+
									'<div class="ui-grid-b">'+
										'<div class="ui-block-a">'+results.rows.item(j).concepto+'</div>'+
										'<div class="ui-block-b"><div class="pesos">'+results.rows.item(j).valor+'</div></div>'+
										'<div class="ui-block-c">'+format("hora",results.rows.item(j).fechadetalleservicio);
											if ((conexiononline()) && (results.rows.item(j).estado=='TERMINADO')&&(results.rows.item(j).foto=='true')){											
         mi_div+='<a href="#" name="'+results.rows.item(j).detalleservicioidservidor+'" id="butonmostrarfotovisor" data-rel="popup" data-position-to="window" data-mini="true" data-role="button" data-inline="true" data-transition="pop" data-iconpos="notext" data-icon="info">Mostrar Foto</a>';											
											}
								mi_div+='</div>'+											
									'</div>'+
								'</li>';
						sumadetalles+=results.rows.item(j).valor;
					}
				}
				else{
					break;
				}
			}
				mi_div+=		'<li data-theme="e">'+
									'<div class="ui-grid-c">'+
										'<div class="ui-block-a"><strong>TOTAL</strong></div>'+
										'<div class="ui-block-b"><strong><div class="pesos">'+sumadetalles+'</div></strong></div>'+	        								'<div class="ui-block-c"></div>'+
									'</div>'+
								'</li>'+
								'</ul>';
				if ((consultarseguridad('visoraprobar')) && (results.rows.item(i).estado=='TERMINADO'))	{								
					mi_div+=	'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="'+colorservicio(results.rows.item(i).estado)+'" data-inset="true" data-split-icon="grid" data-split-theme="d">'+							
									'<li><a href="#">'+
										'<h3>Totales</h3>'+
										'</a>'+
										'<a href="#" name="'+results.rows.item(i).fecha+'*'+results.rows.item(i).idvehiculo+'" id="butonmostrarmapavisor" data-rel="popup" data-position-to="window" data-transition="pop">Mostrar Mapa</a>'+
									'</li>'+
									'<li>'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>saldo anterior:</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).saldoanterior+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+	
									'<li>'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>valor pago:</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).valorpago+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+	
									'<li>'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>valor servicio</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).valordetalleservicio+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+	
									'<li data-theme="e">'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>TOTAL</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).total+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+																																
								'</ul>';
				}
						mi_div+='<div data-role="fieldcontain">'+
							'<fieldset data-role="controlgroup">'+
								'<label for="txtobs">Observaciones</label>'+
								'	<textarea id="txtobs" disabled="disabled" >'+results.rows.item(i).observacion+'</textarea>'+
							'</fieldset>'+
						'</div>'+
				'</div>';
			i=j-1;
		}
		if (estado!='final'){
			mi_div+='</div>'+
				'</div>';
		}		
		$(idacordeonvisualizarservicios).append(mi_div);
		$('.pesos').formatCurrency({region:'es-CO',roundToDecimalPlace:-1});
		$('.valor').formatCurrency({region:'es-CO',roundToDecimalPlace:-1,symbol:''});
		$(idacordeonvisualizarservicios).trigger("create");		
//		$(idacordeonvisualizarservicios).collapsibleset("refresh");
//		$('#divcontanedorformavisorservicios').collapsibleset("refresh");

		}
	}
	function errorjson(error){
	   new error('Error','Erorr en la sincronizacion de datos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorjson);
} 
function visualizarpagos(idacordeonvisualizarservicios){
	cadena =  "SELECT pago.id,"+	
					" pago.idservidor,"+  
					" pago.fecha,"+
					" usuario.login usuario,"+
					" usuarioregistro.login usuarioregistro,"+
					" pago.valor,"+
					" pago.observacion,"+
					" pago.estado "+
			   " FROM pago,usuario,usuario usuarioregistro "+
			  " WHERE pago.idusuario=usuario.id"+
				" AND pago.idusuarioregistro=usuarioregistro.id"+
				" AND (pago.estado <> 'INICIAL') "+
			   " ORDER BY pago.id desc,pago.idservidor desc;";
	
	parametros = [];
		  
	function resultado(results){
		if (results.rows.length > 0){
			var mi_div= '<div data-role="collapsible" data-collapsed="false">'+
						'<h3>Visor Pagos</h3>'+
						'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e"  data-inset="true">';				
			for (var i=0; i<results.rows.length; i++){  
					var mi_idpago = (!results.rows.item(i).idservidor)?'':results.rows.item(i).idservidor;   
					mi_div+='<li data-role="list-divider" role="heading">'+mi_idpago+'. '+results.rows.item(i).fecha+' - '+results.rows.item(i).usuarioregistro+ '<br>'+
							'</li>'+
							'<li data-theme="'+colorservicio(results.rows.item(i).estado)+'">'+
								'<div>'+
									results.rows.item(i).usuario+'<br>'+
									'<div class="pesos"><strong>'+results.rows.item(i).valor+'</strong></div><br>'+
									results.rows.item(i).observacion+
								'</div>'+
							'</li>';
			}
				mi_div+='</ul>'+
					'</div>';
		}
		$(idacordeonvisualizarservicios).append(mi_div);
		$('.pesos').formatCurrency({region:'es-CO',roundToDecimalPlace:-1});
		$(idacordeonvisualizarservicios).trigger("create");		
//			$(idacordeonvisualizarservicios).collapsibleset("refresh");
//			$('#divcontanedorformaservicio').trigger('expand');		
	}
	function errorjson(error){
	   new error('Error','Erorr en la sincronizacion de datos visor pagos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorjson);
} 
function visualizaraprobarservicios(idacordeonvisualizarservicios){
	cadena =  "SELECT servicio.id,"+
					" servicio.idservidor,"+	
					" usuario.login usuario,"+  
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" vehiculo.placa,"+
					" servicio.idvehiculo,"+					
					" empresa.nombre,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" concepto.descripcion as concepto,"+
					" concepto.visible,"+
					" concepto.foto,"+						
					" detalleservicio.valor, "+
					" detalleservicio.fecha as fechadetalleservicio, "+	
     				" detalleservicio.idservidor as detalleservicioidservidor, "+												
					" servicio.saldoanterior,"+
					" servicio.valorpago,"+
					" servicio.valordetalleservicio,"+															
					" servicio.total,"+							
					" servicio.estado "+
			   " FROM servicio,detalleservicio,empresa,vehiculo,concepto,usuario "+
			   " WHERE servicio.idservidor = detalleservicio.idservicio"+
			   " AND empresa.id = servicio.idempresa "+
			   " AND vehiculo.id = servicio.idvehiculo "+
			   " AND detalleservicio.idconcepto=concepto.id "+
			   " AND servicio.idusuario=usuario.id "+
			   " AND servicio.estado IN ('ENVIADO') "+
			   " ORDER BY usuario.login,servicio.idservidor asc;";
			   			   
	  parametros = [];
	  
	function resultado(results){
		if (results.rows.length > 0){
			var mi_usuario=results.rows.item(0).usuario;
			var mi_div= '<div id="divcontanedorformaaprobarservicios" data-role="collapsible">'+
						'<h3>Visor Aprobacion</h3>'+
						'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e" data-inset="true" data-split-icon="alert" data-split-theme="d">'+
							'<div id="divcontanedorformaaprobarserviciosusuariogrande" data-role="collapsible-set">'+
							'<div id="divcontanedorformaaprobarserviciosusuario" data-role="collapsible">'+
							'<h3>'+results.rows.item(0).usuario+'</h3>'+
							'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e" data-inset="true" data-split-icon="alert" data-split-theme="d">';
			for (var i=0; i<results.rows.length; i++){     
				var sumadetalles=0;
				if (mi_usuario!=results.rows.item(i).usuario){
					mi_div+='</ul>'+
							'</div>'+	
							'<div id="divcontanedorformaaprobarserviciosusuario" data-role="collapsible">'+
							'<h3>'+results.rows.item(i).usuario+'</h3>'+
							'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e" data-inset="true" data-split-icon="alert" data-split-theme="d">';	
					mi_usuario=results.rows.item(i).usuario;												
				}
				mi_div+='<li><a href="#">'+
							'<h3>'+results.rows.item(i).idservidor+'. '+format("fecha",results.rows.item(i).fecha)+'</h3>'+
							'<p>'+results.rows.item(i).nombre+' - '+results.rows.item(i).usuario+'</p>'+
							'</a>'+
							'<a href="#" name="'+results.rows.item(i).id+'" id="butonmodificarservicio" data-rel="popup" data-position-to="window" data-transition="pop">Modificar Servicio</a>'+
						'</li>'+
						'<li>'+
								'<div class="ui-grid-b">'+
								'<div class="ui-block-a"><strong>'+results.rows.item(i).placa+'</strong></div>'+
								'<div class="ui-block-b"><strong>INICIAL</strong></div>'+
								'<div class="ui-block-c"><strong>FINAL</strong></div>'+
								'<div class="ui-block-a"><strong>HORA</strong></div>'+
								'<div class="ui-block-b">'+format("hora",results.rows.item(i).fecha)+'</div>'+
								'<div class="ui-block-c">'+format("hora",results.rows.item(i).fechafinal)+'</div>'+
								'<div class="ui-block-a"><strong>KM</strong></div>'+
								'<div class="ui-block-b"><div class="valor">'+results.rows.item(i).kminicio+'</div></div>'+
								'<div class="ui-block-c"><div class="valor">'+results.rows.item(i).kmfinal+'</div></div>'+
							'</div>'+
							'<div class="ui-grid-a">'+
								'<div class="ui-block-a"><strong>Destino</strong></div>'+
								'<div class="ui-block-b">'+results.rows.item(i).recorrido+'</div>'+
							'</div>'+
							'<div class="ui-grid-a">'+
								'<div class="ui-block-a"><strong>Observaciones</strong></div>'+
								'<div class="ui-block-b">'+results.rows.item(i).observacion+'</div>'+
							'</div>'+
							'<div>'+
								'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e"  data-inset="true">'+
									'<li data-role="list-divider" role="heading">'+
										'<div class="ui-grid-b">'+
											'<div class="ui-block-a"><strong>CONCEPTO</strong></div>'+
											'<div class="ui-block-b"><strong>VALOR</strong></div>'+
											'<div class="ui-block-c"><strong>HORA</strong></div>'+											
										'</div>'+	
									'</li>';
				miid = results.rows.item(i).id;		 
				for (var j=i; j<results.rows.length; j++){     
					if (miid==results.rows.item(j).id){
						if(results.rows.item(j).concepto!=null&&results.rows.item(j).visible=='true'){							
							mi_div+='<li>'+
										'<div class="ui-grid-b">'+
											'<div class="ui-block-a">'+results.rows.item(j).concepto+'</div>'+
											'<div class="ui-block-b"><div class="pesos">'+results.rows.item(j).valor+'</div></div>'+
											'<div class="ui-block-c">'+format("hora",results.rows.item(j).fechadetalleservicio);
											if ((conexiononline()) &&(results.rows.item(j).foto=='true')){											
         mi_div+='<a href="#" name="'+results.rows.item(j).detalleservicioidservidor+'" id="butonmostrarfotovisor" data-rel="popup" data-position-to="window" data-mini="true" data-role="button" data-inline="true" data-transition="pop" data-iconpos="notext" data-icon="info">Mostrar Foto</a>';											
											}
									mi_div+='</div>'+
										'</div>'+
									'</li>';
							sumadetalles+=results.rows.item(j).valor;
						}
					}
					else{
						break;
					}
				}
				i=j-1;
					mi_div+=		'<li data-theme="e">'+
										'<div class="ui-grid-b">'+
											'<div class="ui-block-a"><strong>TOTAL</strong></div>'+
											'<div class="ui-block-b"><strong><div class="pesos">'+sumadetalles+'</div></strong></div>'+			    			                            '<div class="ui-block-c"></div>'+
										'</div>'+
									'</li>'+
								'</ul>'+
								'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="'+colorservicio(results.rows.item(i).estado)+'" data-inset="true" data-split-icon="grid" data-split-theme="d">'+		
									'<li><a href="#">'+
										'<h3>Totales</h3>'+
										'</a>'+
										'<a href="#" name="'+results.rows.item(i).fecha+'*'+results.rows.item(i).idvehiculo+'" id="butonmostrarmapavisor" data-rel="popup" data-position-to="window" data-transition="pop">Mostrar Mapa</a>'+
									'</li>'+													
									'<li>'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>saldo anterior:</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).saldoanterior+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+	
									'<li>'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>valor pago:</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).valorpago+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+	
									'<li>'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>valor servicio</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).valordetalleservicio+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+	
									'<li data-theme="e">'+
											'<div class="ui-grid-a">'+
												'<div class="ui-block-a"><strong>TOTAL</strong></div>'+
												'<div class="ui-block-b"><strong><div class="pesos">'+results.rows.item(i).total+'</div>											</strong></div>'+	                    
												'</div>'+
									'</li>'+																																
								'</ul>'+
							'</div>'+
						'<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true" align="right">'+
							'<input type="checkbox" name="aprobar[]" id="aprobar" class="custom" value="'+results.rows.item(i).id+'"/>'+
							'<label for="aprobar">Aprobado</label>'+
						'</fieldset>'+
					'</li>';
			}
		mi_div+='</ul>'+
				'</div>'+				
				'</ul>'+			
				'<ul data-role="listview">'+
				'<input  name="butonaprobar" id="butonaprobar" data-inline="true" type="button" data-theme="e" data-icon="check" data-iconpos="left" value="aprobar" />'+	
				'</ul>'+
				'</div>'+	
			'</div>';
		$(idacordeonvisualizarservicios).append(mi_div);
		$('.pesos').formatCurrency({region:'es-CO',roundToDecimalPlace:-1});
		$('.valor').formatCurrency({region:'es-CO',roundToDecimalPlace:-1,symbol:''});
		$(idacordeonvisualizarservicios).trigger("create");		
//		$(idacordeonvisualizarservicios).collapsibleset("refresh");
//		$('#divcontanedorformaservicio').trigger('expand');		
		}
	}
	function errorjson(error){
	   new error('Error','Erorr en la sincronizacion de datos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorjson);
} 
function modificarservicio(idservicio){
	cadena =  "SELECT servicio.id,"+	  
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" vehiculo.placa,"+
					" servicio.idvehiculo,"+
					" servicio.idempresa,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" detalleservicio.id as iddetalleservicio,"+
					" detalleservicio.idconcepto,"+
					" concepto.visible, "+					
					" detalleservicio.valor, "+
					" servicio.estado "+
			   " FROM servicio,detalleservicio,vehiculo,concepto "+
			   " WHERE servicio.idservidor = detalleservicio.idservicio"+
			   " AND vehiculo.id = servicio.idvehiculo "+
			   " AND detalleservicio.idconcepto=concepto.id "+
			   " AND (servicio.estado <> 'INICIAL' "+
			   " AND servicio.id="+idservicio+")"+
			   " ORDER BY servicio.id desc;";
/*
	cadena =  "SELECT servicio.id,"+	  
					" servicio.fecha,"+
					" servicio.fechafinal,"+
					" vehiculo.placa,"+
					" servicio.idvehiculo,"+
					" servicio.idempresa,"+
					" servicio.kminicio,"+
					" servicio.kmfinal,"+
					" servicio.recorrido,"+
					" servicio.observacion,"+
					" detalleservicio.id iddetalleservicio,"+
					" detalleservicio.idconcepto,"+
					" concepto.visible "					
					" detalleservicio.valor, "+
					" servicio.estado "+
			   " FROM servicio,detalleservicio,empresa,vehiculo,concepto "+
			   " WHERE servicio.idservidor = detalleservicio.idservicio"+
			   " AND empresa.id = servicio.idempresa "+
			   " AND vehiculo.id = servicio.idvehiculo "+
			   " AND detalleservicio.idconcepto=concepto.id "+
			   " AND (servicio.estado <> 'INICIAL' "+
			   " AND servicio.id="+idservicio+")"+
			   " ORDER BY servicio.id desc;";
*/			   

	  parametros = [];
	  
	function resultado(results){

		if (results.rows.length > 0){
				var mi_div='';	
				var mi_placa='';
			    var mi_empresa='';
				var mi_concepto= new Array();
			for (var i=0; i<results.rows.length; i++){     
				mi_placa=results.rows.item(i).idvehiculo;
				mi_empresa=results.rows.item(i).idempresa;
				
 mi_div+='<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>'+
	'<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e"  data-inset="true">'+
        '<li data-role="list-divider" role="heading">'+
			'<input type="hidden" name="modidservicio" id="modidservicio" value="'+idservicio+'"/>'+		
        '</li>'+
        '<li data-role="fieldcontain">'+
        	'<div class="ui-grid-a">'+
				'<div class="ui-block-a"><label for="modkminicio">km inicio:</label></div>'+
				'<div class="ui-block-b"><input type="text" name="modkminicio" id="modkminicio" value="'+results.rows.item(i).kminicio+'"/></div>'+
			'</div>'+
        '</li>'+
	    '<li data-role="fieldcontain">'+
            '<div class="ui-grid-a">'+
				'<div class="ui-block-a"><label for="modkmfinal">km final:</label></div>'+
				'<div class="ui-block-b"><input type="text" name="modkmfinal" id="modkmfinal" value="'+results.rows.item(i).kmfinal+'"/></div>'+
			'</div>'+
        '</li>'+
        '<li data-role="fieldcontain">'+
            '<div class="ui-grid-a">'+
				'<div class="ui-block-a"><label for="modidplaca">Placa:</label></div>'+
				'<div class="ui-block-b"><select name="modidplaca" id="modidplaca">'+
							               '<option value="">seleccionar</option>'+
            							'</select>'+
                '</div>'+
			'</div>'+
        '</li>'+
        '<li data-role="fieldcontain">'+
            '<div class="ui-grid-a">'+
				'<div class="ui-block-a"><label for="modidempresa">Empresa:</label></div>'+
				'<div class="ui-block-b"><select name="modidempresa" id="modidempresa">'+
							                '<option value="">seleccionar</option>'+
            							'</select>'+
                '</div>'+
			'</div>'+
        '</li>'+
        '<li>'+
        	'<div>'+
                '<ul data-role="listview" data-theme="ui-content ui-body-e" data-divider-theme="e"  data-inset="true">'+
                    '<li data-role="list-divider" role="heading">'+
                        '<div class="ui-grid-a">'+
                            '<div class="ui-block-a"><strong>CONCEPTO</strong></div>'+
                            '<div class="ui-block-b"><strong>VALOR</strong></div>'+
                        '</div>'+
                    '</li>';
   					
				miid = results.rows.item(i).id;		 
				for (var j=i; j<results.rows.length; j++){     
					if (miid==results.rows.item(j).id){
						if(results.rows.item(j).idconcepto!=null){
						mi_concepto.unshift(results.rows.item(j).idconcepto);
						mi_div+='<li data-role="fieldcontain">'+
								'<div class="ui-grid-a">'+
									'<div class="ui-block-a">'+
										'<select name="modidconcepto[]" id="modidconcepto'+j+'">'+
											'<option value="">seleccionar</option>'+
										'</select>'+
									'</div>'+
									'<div class="ui-block-b">'+
										'<input type="text" name="modidvalor[]" id="modidvalor" value="'+results.rows.item(j).valor+'"/>'+
										'<input type="hidden" name="modiddetalleservicio[]" id="modiddetalleservicio" value="'+results.rows.item(j).iddetalleservicio+'"/>'+
									'</div>'+
								'</div>'+
							'</li>';     
						}
					}
					else{
						break;
					}
				}
				i=j-1;
		mi_div+=		'</ul>'+                            
					'</div>'+        
				'</li>'+          
				'<li>'+          							
					'<div class="ui-grid-a">'+
						'<div class="ui-block-a">'+
							'<a href="#" id="aceptarmodificacion" data-role="button" data-rel="back" data-theme="b" data-icon="check" data-inline="true" data-mini="true">Aceptar</a>'+
						'</div>'+
						'<div class="ui-block-b">'+
							'<a href="#" data-role="button" data-rel="back" data-inline="true" data-mini="true">Cancelar</a>'+
						'</div>'+
					'</div>'+

				'</li>'+          
			'</ul>';
			}
		}
		$("#modificarservicio").html(mi_div);
		$('.pesos').formatCurrency({region:'es-CO',roundToDecimalPlace:-1});
		$('.valor').formatCurrency({region:'es-CO',roundToDecimalPlace:-1,symbol:''});

		tanquearlistplaca("#modidplaca",mi_placa);
	    tanquearlistempresa("#modidempresa",mi_empresa);
		var j=0;
		$.each($("select[name='modidconcepto[]']"), function(){
			tanquearlistconcepto('#'+this.id,mi_concepto[j]);
			j++;
		});
		$("#modificarservicio").trigger("create");		
		$("#modificarservicio").popup( "open" );
	}
	function errorjson(error){
	   new error('Error','Erorr en la sincronizacion de datos.').vererror();
	}
	agregarbd(cadena, parametros, resultado, errorjson);
} 

function errorCB(err) {
	console.log("Error procesando SQL: "+err.code+ " mesage= "+err.message);    
}	


