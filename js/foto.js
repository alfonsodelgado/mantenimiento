function capturarFoto() 
{
	var cameraOptions = {
							quality : 50,
							destinationType : Camera.DestinationType.DATA_URL,
							sourceType : Camera.PictureSourceType.CAMERA,
							encodingType: Camera.EncodingType.JPEG,
							targetWidth: 100,
							targetHeight: 100,
	};
	navigator.camera.getPicture(mostrarFoto, errorFoto, cameraOptions);

	function mostrarFoto(ubicacion){
		var photo = document.getElementById("iddetalleserviciofoto");
		photo.src = "data:image/jpeg;base64," + ubicacion;		
	}

	function errorFoto(error){
		alert('Error al generar foto: '+error);	
	}
}
$('#butonmostrarfotovisor').live('click',function(){
	var pasword = $('#idpasword').val();
	var login = $('#idlogin').val();
	sincronizarFoto(login,pasword,$(this).attr('name'));
});


function sincronizarFoto(logins,paswords,idDetalleServicios){
	var urls ='http://www.reactiva.com.co:8097/atlas/rest/atlasWS/foto';
//var urls= 'http://192.168.10.64:8097/atlas/rest/atlasWS/sincronizar' ;
	try{
		$.ajax({
			type: 'GET',
			url: urls ,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			data: {login: logins,
				   password:paswords,
				   idDetalleServicio:idDetalleServicios},
			success: successFoto,
			error: errorws
		});
	}
	catch(err){
		new error('Error','Datos incorrectos. invocando web service').vererror();
	}
	function successFoto(data, textStatus, jqXHR) {
		var photo = document.getElementById("idmostrarfoto");
		photo.src = data.foto;	
	//	$('#responseImg').attr('src', data.foto);
		$("#popupPhoto").popup( "open" );		
	}

	function errorws(jqXHR, textStatus, errorThrown) {
		alert(jqXHR.responseText + " " + textStatus + " " + errorThrown);
	}
}

