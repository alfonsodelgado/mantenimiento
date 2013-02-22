$('#mostrarmapa').live('pagebeforeshow',function(){	
	loading(true);
	var placamapa = $('#idplacamapa').val();
	var pasword = $('#idpasword').val();
	var login = $('#idlogin').val();
	var nombreplaca = $("#idplacamapa option[value='"+$('#idplacamapa').val()+"']").text()
	inicializarmapa();
	
	var fecha = $('#iddia').val()+'/'+$('#idmes').val()+'/'+$('#idano').val();
	sincronizarmapa(login,pasword,placamapa,nombreplaca,fecha);	
});

$('#butonmostraposicionmapa').live('click',function(){
	loading(true);
	mostrarMarcadorPorId($(this).attr('name'));
});
$('#mapavehiculo').live('change',function(){
	loading(true);
	var nombreplaca = $("#idplacamapa option[value='"+$('#idplacamapa').val()+"']").text()
	generarpuntos(nombreplaca);
});
$('#mapausuario').live('change',function(){
	loading(true);
	var nombreplaca = $("#idplacamapa option[value='"+$('#idplacamapa').val()+"']").text()
	generarpuntos(nombreplaca);
});

