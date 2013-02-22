$('#pagelogin').live('pagebeforeshow',function(){
	document.getElementById("idlogin").value=null;
	document.getElementById("idpasword").value=null;
});
$('#butonlogear').live('click',function(){
	validarlogin("logear");
});
$('#butonsincronizar').live('click',function(){
	validarlogin("sincronizar");
});
function validarlogin(page){
	var login = $('#idlogin').val();
	if (!login) { 
		new error('Error','Por favor digite su usuario.').vererror();
		return false;
	}
	var pasword = $('#idpasword').val();
	if (!pasword) {
		new error('Error','Por favor digite su password.').vererror();
		return false;
	} 
	  
	var inicializar=(page=="sincronizar")?true:false;

	checkConnection(login,pasword,inicializar,'{"usuarios": []}');
}
	