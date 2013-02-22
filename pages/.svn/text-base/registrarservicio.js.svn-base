function pageregistrarservicio(){
	if (document.getElementById("idplaca").options.length==1) { 
		tanquearlistplaca("#idplaca");
		tanquearlistempresa("#idempresa");
		ejecutarbd();	
	}else{
		document.getElementById("idplaca").selectedIndex=0;
		document.getElementById("idkminicio").value=null;
		document.getElementById("idempresa").selectedIndex=0;
		$("#idplaca").selectmenu("refresh");
		$("#idempresa").selectmenu("refresh");
	}
}

$("#idkminicio").live('keypress',function(e){
      return aceptarSoloNumeros(e);
});


$('#butonregistrarservicio').live('click',function(){
	/*var fecha = $('#idfecha').val();
	if (!fecha) { 
		new error('Error','Por favor digite la fecha.').vererror();
		return false;
	}*/
	var placa = $('#idplaca').val();
	if (!placa||placa == 'seleccionar') { 
		new error('Error','Por favor seleccione la placa de su vehiculo.','servicio').vererror();
		return false;
	}
	var kminicio = $('#idkminicio').val();
	if (!kminicio) { 
		new error('Error','Por favor digite el km inicio.','servicio').vererror();
		return false;
	}
	var empresa = $('#idempresa').val();
	if (!empresa||empresa == 'seleccionar') { 
		new error('Error','Por favor digite su empresa.','servicio').vererror();
		return false;
	}

	registrarservicio(fechaactual(),placa,reemplazarcomaspesos(kminicio),empresa);
	ejecutarbd();
});

$('#idkminicio').live('blur',function(){
	$('#idkminicio').formatCurrency({region:'es-CO',roundToDecimalPlace:-1,symbol:''});
});