function pageregistrarpago(){
	if (document.getElementById("idusuario").options.length==1) { 
		tanquearlistusuario("#idusuario");	
		ejecutarbd();
	}else{
		document.getElementById("idusuario").selectedIndex=0;
	    document.getElementById("idvalorpago").value=null;
		document.getElementById("textareaobservacionpago").value=null;
		$("#idusuario").selectmenu("refresh");
	}
}

$("#idvalorpago").live('keypress',function(e){
	return aceptarSoloNumerosyNegativos(e);
});
$('#idvalorpago').live('blur',function(){
	$('#idvalorpago').formatCurrency({region:'es-CO',roundToDecimalPlace:-1});
});

$('#butonrealizarpago').live('click',function(){
	var usuario = $('#idusuario').val();
	if (!usuario||usuario == 'seleccionar') { 
		new error('Error','Por favor escoja el usuario.','pago').vererror();
		return false;
	}
	var valor = $('#idvalorpago').val();
	if (!valor) { 
		new error('Error','Por favor digite el valor del pago.','pago').vererror();
		return false;
	}
	var observacionpago = $('#textareaobservacionpago').val();
	registrarpago(usuario,reemplazarcomaspesos(valor),observacionpago,fechaactual());
	ejecutarbd();
});

