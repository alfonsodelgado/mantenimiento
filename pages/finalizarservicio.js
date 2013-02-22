function pagefinalizarservicio(){
	document.getElementById("idkmfinal").value=null;
	document.getElementById("idrecorrido").value=null;
}

$("#idkmfinal").live('keypress',function(e){
	return aceptarSoloNumeros(e);
});

$('#butonfinalizarservicio').live('click',function(){
	var kmfinal = $('#idkmfinal').val();
	if (!kmfinal) { 
		new error('Error','Por favor digitar el km final.','servicio').vererror();
		return false;
	}
	var recorrido = $('#idrecorrido').val();
	if (!recorrido) { 
		new error('Error','Por favor digitar el recorrido.','servicio').vererror();
		return false;
	}
	var textareaobser = $('#textareaobservacion').val();
	registrarfinalizarservicio(reemplazarcomaspesos(kmfinal),recorrido,fechaactual(),textareaobser);
	ejecutarbd();
});
$('#idkmfinal').live('blur',function(){
	$('#idkmfinal').formatCurrency({region:'es-CO',roundToDecimalPlace:-1,symbol:''});
});