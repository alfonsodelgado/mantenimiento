function pageregistrardetalleservicio(){
	if (document.getElementById("idconcepto").options.length==1) { 
		tanquearlistconcepto("#idconcepto");
		ejecutarbd();		
	}else{
		document.getElementById("idconcepto").selectedIndex=0;
	    document.getElementById("idvalor").value=null;
		$("#idconcepto").selectmenu("refresh");
		$("#divdetalleservicio").html('');
		$("#divdetalleservicio").trigger("create")
	}
	$('#butonregistrardetalleservicio').removeAttr("disabled");
}

$("#idvalor").live('keypress',function(e){
	return aceptarSoloNumeros(e);
});

$('#idconcepto').live('change',function(){
	var concepto = $('#idconcepto').val();
	if(concepto != 'seleccionar'){
		cargardetalleservicioconcepto(concepto,'#divdetalleservicio');
		ejecutarbd();	
	}
});

$('#butonregistrardetalleservicio').live('click',function(){
	$('#butonregistrardetalleservicio').attr("disabled", true);
	alert("apagando aque");	
	var concepto = $('#idconcepto').val();
	if (!concepto||concepto == 'seleccionar') { 
		new error('Error','Por favor escoja el concepto.','servicio').vererror();
		return false;
	}
	var valor = $('#idvalor').val();
	if (!valor) { 
		new error('Error','Por favor digite el valor del concepto.','servicio').vererror();
		return false;
	}
	arreglos = $.parseJSON($("#iddetalleconceptos").val());
	var foto='';
	var km='';
	var observacion='';
	var arreglo  = arreglos.conceptoatributos;
	for(var i = 0; i < arreglo.length; i++){
		if (arreglo[i]=='foto'){
			if (typeof(Cordova) != 'undefined' || typeof(cordova) != 'undefined'){	
				foto = $('#iddetalleservicio'+arreglo[i]).attr('src');
				if (!foto) { 
					new error('Error','Por favor realice la foto.','servicio').vererror();
					return false;
				}
			}
		}else if(arreglo[i]=='km'){
			km = $('#iddetalleservicio'+arreglo[i]).val();
			if (!km) { 
				new error('Error','Por favor digite el valor del kilometraje.','servicio').vererror();
				return false;
			}
		}else if(arreglo[i]=='observacion'){
			observacion = $('#iddetalleservicio'+arreglo[i]).val();
			if (!observacion) { 
				new error('Error','Por favor digite el valor de la observacion.','servicio').vererror();
				return false;
			}
		}	
	}
	if (typeof(Cordova) != 'undefined' || typeof(cordova) != 'undefined'){	
		posiciongps(concepto,reemplazarcomaspesos(valor),fechaactual(),km,observacion,foto);
	}else{	
		registrardetalleservicio(concepto,reemplazarcomaspesos(valor),fechaactual(),km,observacion,foto,0,0);
		ejecutarbd();	
	}
});

$('#butonfinalizardetalleserviciovalidar').live('click',function(){
	var concepto = $('#idconcepto').val();
	var valor = $('#idvalor').val();
	if (valor||concepto != 'seleccionar' ) { 
		new error('Error','Por favor guardar los datos antes de finalizar el servicio.','servicio').vererror();
		return false;
	}
});

function cargardetalleservicioconcepto(mi_concepto,un_div){
	cadena = "SELECT id,foto,km,observacion FROM concepto WHERE id=?;";
	parametros = [mi_concepto];

	function resultado(results){
		var mi_div ='<div data-role="fieldcontain">'+
						'<fieldset data-role="controlgroup">'+
							'	<label for="idvalor" title="Valor de los detalles">Valor:</label>'+
							'	<input name="valor" id="idvalor" type="text" />'+
						'</fieldset>'+
					'</div>';
		var midetallesconceptos='{"conceptoatributos":[ ';
		if (typeof(Cordova) != 'undefined' || typeof(cordova) != 'undefined'){	
			if(results.rows.item(0).foto=='true'){
				mi_div +='<div data-role="fieldcontain">'+
							'<fieldset data-role="controlgroup">'+
								'<label for="iddetalleserviciofoto">foto:</label>'+
								'	<img width="100px" height="150px" id="iddetalleserviciofoto" title="clic para tomar la foto" />'+
							'</fieldset>'+
						 '</div>';
				midetallesconceptos+='"foto",';		
			}
		}
		if(results.rows.item(0).km=='true'){
			mi_div +='<div data-role="fieldcontain">'+
						'<fieldset data-role="controlgroup">'+
							'	<label for="iddetalleserviciokm">km:</label>'+
							'	<input name="detalleserviciokm" id="iddetalleserviciokm" type="text" />'+
						'</fieldset>'+
					'</div>';
			midetallesconceptos+='"km",';							
		}
		if(results.rows.item(0).observacion=='true'){
			mi_div +='<div data-role="fieldcontain">'+
						'	<fieldset data-role="controlgroup">'+
							'	<label for="iddetalleservicioobservacion">observacion:</label>'+
							'	<input name="detalleservicioobservacion" id="iddetalleservicioobservacion" type="text" />'+
						'</fieldset>'+
					'</div>';
			midetallesconceptos+='"observacion",';							
		}
  
		midetallesconceptos=midetallesconceptos.substring(0,midetallesconceptos.length-1)+']}';	
		mi_div+="<input name='iddetalleconceptos' id='iddetalleconceptos' value='"+midetallesconceptos+"' type='hidden' />"
		$(un_div).html(mi_div);
		$(un_div).trigger("create");		
	}
	agregarbd(cadena, parametros, resultado, errorCB);
}	 
$("#iddetalleserviciokm").live('keypress',function(e){
	return aceptarSoloNumeros(e);
});

$('#butonfinalizardetalleservicio').live('click',function(){
	finalizardetalleservicio();
});
	
$('#idvalor').live('blur',function(){
	$('#idvalor').formatCurrency({region:'es-CO',roundToDecimalPlace:-1,symbol:''});
});
$('#iddetalleserviciofoto').live('click',function(){
	capturarFoto();
});
	