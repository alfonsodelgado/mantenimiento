
var tablasborrar = new Array();

tablasborrar[0]=   "DROP TABLE IF EXISTS usuario";
tablasborrar[1]=   "DROP TABLE IF EXISTS vehiculo";
tablasborrar[2]=   "DROP TABLE IF EXISTS empresa";
tablasborrar[3]=   "DROP TABLE IF EXISTS concepto";

var tablas = new Array();
 
 
tablas[0]=   "CREATE TABLE IF NOT EXISTS usuario (id INTEGER NOT NULL PRIMARY KEY,"+
						     				    " login NVARCHAR(10), "+
    							             	" password NVARCHAR(10), "+
												" permisos NVARCHAR(100));";
												   
tablas[1]=   "CREATE TABLE IF NOT EXISTS vehiculo (id INTEGER NOT NULL PRIMARY KEY,"+
						     				     " placa NVARCHAR(10));";												   

tablas[2]=   "CREATE TABLE IF NOT EXISTS empresa (id INTEGER NOT NULL PRIMARY KEY,"+
						     				    " nombre NVARCHAR(10));";												   												

tablas[3]=   "CREATE TABLE IF NOT EXISTS servicio (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
												 " idservidor INTEGER,"+
												 " idusuario NVARCHAR(10), "+
						     				     " fecha NVARCHAR(10),"+
												 " fechafinal NVARCHAR(10),"+
												 " idvehiculo INTEGER NOT NULL,"+
												 " idempresa INTEGER NOT NULL,"+
												 " kminicio INTEGER,"+
												 " kmfinal INTEGER,"+
												 " recorrido TEXT,"+
												 " observacion TEXT,"+
												 " saldoanterior INTEGER,"+
												 " valorpago INTEGER,"+
												 " valordetalleservicio INTEGER,"+
												 " total INTEGER,"+
												 " estado NVARCHAR(10))";										   																								
												 
tablas[4]=   "CREATE TABLE IF NOT EXISTS detalleservicio (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
												 " idservidor INTEGER,"+
						     				     " idservicio INTEGER NOT NULL,"+
												 " fecha NVARCHAR(10),"+
												 " idconcepto INTEGER NOT NULL,"+
												 " coordenadalatitud NVARCHAR(10),"+
												 " coordenadalongitud NVARCHAR(10),"+
												 " foto TEXT,"+
												 " km INTEGER,"+
												 " observacion TEXT,"+												 
												 " valor INTEGER NOT NULL)";										   																																				

tablas[5]=   "CREATE TABLE IF NOT EXISTS concepto (id INTEGER NOT NULL PRIMARY KEY,"+
						     				      "descripcion NVARCHAR(10),"+
												  "visible boolean,"+
												  "foto boolean,"+
												  "km boolean,"+
												  "observacion boolean);";			

tablas[6]=   "CREATE TABLE IF NOT EXISTS pago (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
												" idservidor INTEGER,"+
						     				    " idusuario NVARCHAR(10), "+
												" fecha NVARCHAR(10),"+
												" observacion TEXT,"+
 												" idusuarioregistro NVARCHAR(10), "+
												" valor INTEGER NOT NULL, "+
								                " estado NVARCHAR(10))";

function llenartablasborrar(){
	tablasborrardatos= new Array();

	tablasborrardatos[0]=   "DELETE FROM usuario";
	tablasborrardatos[1]=   "DELETE FROM vehiculo";
	tablasborrardatos[2]=   "DELETE FROM empresa";
	tablasborrardatos[3]=   "DELETE FROM concepto";
	tablasborrardatos[4]=   "DELETE FROM detalleservicio WHERE detalleservicio.idservidor is not null";
	tablasborrardatos[5]=   "DELETE FROM servicio WHERE servicio.idservidor is not null";
	tablasborrardatos[6]=   "DELETE FROM pago WHERE pago.estado in ('TERMINADO','ENVIADO')";
	return tablasborrardatos;
}
var transmisioninsert = new Array();	
var transmisionupdate = new Array();	
				
/*
						   
insert[0] = 'INSERT INTO usuario (login,password )VALUES ("ads","ads");';												   
insert[1] = 'INSERT INTO usuario (login,password )VALUES ("1","1");';												   
insert[2] = 'INSERT INTO usuario (login,password )VALUES ("2","2");';												   

insert[3] = 'INSERT INTO vehiculo (placa) VALUES ("stp191");';												   
insert[4] = 'INSERT INTO vehiculo (placa) VALUES ("stp086");';												   
insert[5] = 'INSERT INTO vehiculo (placa) VALUES ("sto973");';												   
insert[6] = 'INSERT INTO vehiculo (placa) VALUES ("sto974");';												   
insert[7] = 'INSERT INTO vehiculo (placa) VALUES ("tmp073");';												   
insert[8] = 'INSERT INTO vehiculo (placa) VALUES ("tmp099");';												   
insert[9] = 'INSERT INTO vehiculo (placa) VALUES ("tmp860");';												   

insert[10] = 'INSERT INTO empresa (nombre) VALUES ("Proing");';												   
insert[11] = 'INSERT INTO empresa (nombre) VALUES ("Sypel");';												   
insert[12] = 'INSERT INTO empresa (nombre) VALUES ("Morelco");';												   
insert[13] = 'INSERT INTO empresa (nombre) VALUES ("Une");';												   
insert[14] = 'INSERT INTO empresa (nombre) VALUES ("Icbf");';												   
insert[15] = 'INSERT INTO empresa (nombre) VALUES ("Inpec");';												   
insert[16] = 'INSERT INTO empresa (nombre) VALUES ("Corpocaldas");';	

insert[17] = 'INSERT INTO concepto (nombre) VALUES ("desayuno");';	
insert[18] = 'INSERT INTO concepto (nombre) VALUES ("almuerzo");';	
insert[19] = 'INSERT INTO concepto (nombre) VALUES ("comida");';	
insert[20] = 'INSERT INTO concepto (nombre) VALUES ("lavada");';	
insert[21] = 'INSERT INTO concepto (nombre) VALUES ("pinchada");';	
insert[22] = 'INSERT INTO concepto (nombre) VALUES ("aceite");';												   
insert[23] = 'INSERT INTO concepto (nombre) VALUES ("llantas");';												   

*/