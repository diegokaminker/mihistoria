//Acceso a Servicios de obtencion de Documentos del Bus
//
//ListaDocumentosDisponibles: obtiene lista de documentos
//                            dado un paciente y dominio
//
//ContenidoDocumento: obtiene el contenido de un IPS desde el bus
//                            a partir de la referencia 
//                          
const auth   = require('./client_auth');
const conf   = require('./client_config');
const axios   = require('axios');

async function ListaDocumentosDisponibles(MyPatientData,dominio)
{
    try
    {
     token=await auth.GetTokenFromAuth();
     var cnf=conf.fhirConfIPS();
     var urlFHIREndpoint= cnf.urlServer;
     var ResourceClass  ='DocumentReference';
     var cnd=conf.authConfig();
     var system=cnd.iss;
     var value=1000000+MyPatientData.Id;
     var MyIdentifier=system+"|" +value;
     var fullURL = urlFHIREndpoint+"/"+ResourceClass+"?subject="+MyIdentifier+"&"+"custodian="+dominio+"&type=http://loinc.org|60591-5";
     console.log(fullURL);
     console.log("hago el request");
     let response=await axios.get(fullURL, {headers : { 'Authorization' : 'Bearer jwt' }})
     console.log("hice el request");
    var data=response.data;
    console.log('datos');
    console.log(JSON.stringify(data));
    return data;
    }

    catch
    {
        
    }

}


async function ContenidoDocumento(url)
{
  
    try
    {
     token=await auth.GetTokenFromAuth();
     var cnf=conf.fhirConfIPS();
     var urlFHIREndpoint= cnf.urlServer;
     var cnd=conf.authConfig();
     var system=cnd.iss;
     var fullURL = urlFHIREndpoint+url;
     console.log(fullURL);
     console.log("hago el request");
     let response=await axios.get(fullURL, {headers : { 'Authorization' : 'Bearer jwt' }})
     console.log("hice el request");
    var data=response.data;
    console.log('datos');
    console.log(JSON.stringify(data));
    return data;
    }

    catch
    {
        
    }

}
module.exports = { ListaDocumentosDisponibles,ContenidoDocumento }