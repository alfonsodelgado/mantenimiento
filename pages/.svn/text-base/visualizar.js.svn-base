$('#visualizar').live('pagebeforeshow',function(){
	loading(true);
	visualizarpagebeforeshow();
	$("#idtxtheadervisualizar").html(window.localStorage.getItem("login")+' Atlas Visualizar Servicios');
});
 
function visualizarpagebeforeshow(undiv){
	$('div[data-role="collapsible"]').remove();
	if (consultarseguridad('servicio')){
		$("#acordeonvisualizar").append('<div id="divcontanedorformaservicio" data-role="collapsible" data-collapsed="true">'+
											'<h3>Registro Servicios</h3>'+
											'<div id="contenedorformaservicio"></div>'+
										'</div>');
		$("#acordeonvisualizar").trigger("create");												
	}
	if (consultarseguridad('pagos')){
		$("#acordeonvisualizar").append('<div id="divcontanedorformapago" data-role="collapsible" data-collapsed="true">'+
											'<h3>Registro Pagos</h3>'+
											'<div id="contenedorformapago"></div>'+
										'</div>');
		$("#acordeonvisualizar").trigger("create");												
	}	
	if (consultarseguridad('visor')){
		visualizarservicios("#acordeonvisualizar",'final');
		visualizarservicios("#acordeonvisualizar",'todos');
	}
	if (consultarseguridad('visorpago')){
		visualizarpagos("#acordeonvisualizar");
	}
	if (consultarseguridad('visoraprobar')){
		tanquearcheckusuario("#divsincronizarusuarios");
		visualizaraprobarservicios("#acordeonvisualizar");
	}	
	if (consultarseguridad('mapa')){
		$("#acordeonvisualizar").append('<div id="divcontanedorformamapa" data-role="collapsible" data-collapsed="true">'+
											'<h3>Visor mapa</h3>'+
											'<div id="contenedorformamapa"></div>'+
										'</div>');
		$("#acordeonvisualizar").trigger("create");												
	}	
	sqlcontrolarventana(undiv);
	ejecutarbd();
}
$('#butonenviodatos').live('click',function(){
		var pasword = $('#idpasword').val();
		var login = $('#idlogin').val();
		var sincronizar='';
		$.each($("input[name='sincronizar[]']:checked"), function() {
			sincronizar += $(this).attr('value')+',';
		});
		sincronizar='{"usuarios": ['+sincronizar.substring(0,sincronizar.length-1)+']}';
		checkConnection(login,pasword,false,sincronizar);
});

$('#butonaprobar').live('click',function(){
	var servicios = new Array();
	$.each($("input[name='aprobar[]']:checked"), function() {
		servicios.unshift($(this).attr('value'));
	});
	if (servicios.length <= 0){
		new error('Error','Favor seleecione un servicio a aprobar','aprobarservicios').vererror();
		return false;		
	} else {
		aprobarservicio(servicios);
		ejecutarbd();
	}
});
$('#butonmodificarservicio').live('click',function(){
	modificarservicio($(this).attr('name'));
	ejecutarbd();
});
$('#aceptarmodificacion').live('click',function(){
	var idservicio= $('#modidservicio').val();
	var kminicio = $('#modkminicio').val();
	if (!kminicio) { 
		new error('Error','Por favor digite el kminicio.','aprobarservicios').vererror();
		//new $("#modificarservicio").popup("open");
	  //  $("#butonmodificarservicio").click();
		//alert("nosedd");		
		return false;
	}
	var kmfinal = $('#modkmfinal').val();
	if (!kmfinal) { 
		new error('Error','Por favor digite el kmfinal.','aprobarservicios').vererror();
		return false;
	}
	var placa = $('#modidplaca').val();
	if (!placa||placa == 'seleccionar') { 
		new error('Error','Por favor digite la placa de su vehiculo.','aprobarservicios').vererror();
		return false;
	}
	var empresa = $('#modidempresa').val();
	if (!empresa||empresa == 'seleccionar') { 
		new error('Error','Por favor digite su empresa.','aprobarservicios').vererror();
		return false;
	}
	registrarmodificarservicio(kminicio,kmfinal,placa,empresa,idservicio);

	mi_iddetalleservicio=document.getElementsByName("modiddetalleservicio[]");
	mi_idconcepto=document.getElementsByName("modidconcepto[]");
	mi_valor=document.getElementsByName("modidvalor[]");
	for (var i=0; i<mi_iddetalleservicio.length; i++){     
		registrarmodificardetalleservicio(mi_idconcepto[i].value,mi_valor[i].value,mi_iddetalleservicio[i].value);
	}
	visualizarpagebeforeshow('aprobarservicios');
	ejecutarbd();
});

