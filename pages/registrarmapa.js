function pageregistrarmapa(){
	if (document.getElementById("idplacamapa").options.length==1) { 
		tanquearlistplaca("#idplacamapa");	
		tanquearlistfecha("#iddia","#idmes","#idano");
		ejecutarbd();
		var str=format("fecha",fechaactual());
		var arreglo=str.split("/");
		$('#iddia').val(arreglo[0]);
		$('#iddia').selectmenu('refresh');
		$('#idmes').val(arreglo[1]);
		$('#idmes').selectmenu('refresh');
		$('#idano').val(arreglo[2]);
		$('#idano').selectmenu('refresh');
	}else{
		document.getElementById("idplacamapa").selectedIndex=0;
	    document.getElementById("idplacamapa").value=null;
		$("#idplacamapa").selectmenu("refresh");
	}
}

$('#butonmostrarmapa').live('click',function(){
	var placamapa = $('#idplacamapa').val();
	if (!placamapa||placamapa == 'seleccionar') { 
		new error('Error','Por favor seleccione la placa del vehiculo','mapa').vererror();
		return false;
	}
	loading(true);
	checkConnectionmapa();
});

$('#butonmostrarmapavisor').live('click',function(){
	var str=$(this).attr('name');
	var arreglo=str.split("*");
	$('#idplacamapa').val(arreglo[1]);
	$('#idplacamapa').selectmenu('refresh');
	var str=format("fecha",arreglo[0]);
	var arreglofecha=str.split("/");
	$('#iddia').val(parseInt(arreglofecha[0]));
	$('#iddia').selectmenu('refresh');
	$('#idmes').val(parseInt(arreglofecha[1]));
	$('#idmes').selectmenu('refresh');
	$('#idano').val(parseInt(arreglofecha[2]));
	$('#idano').selectmenu('refresh');	
	checkConnectionmapa();
});
