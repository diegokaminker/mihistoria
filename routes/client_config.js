// Contiene la configuracion de autenticacion y acceso
//
// authConfig: Configuracion de autenticacion: 
//
// urlAuth      -> url para obtener token a partir de nuestro token
// secret       -> palabra clave
// urlDominio   -> url del dominio
// urlAud       -> url de nuestro sitio
// subject      -> identificacion de usuario
// MyName       -> nombre de usuario
// MyIdent      -> identificador de usuario / medico en rol *refes
// MyRole       -> rol del usuario
//
function authConfig
()
    {
        urlAut    = "https://testapp.hospitalitaliano.org.ar/bus-auth/auth";
        secret    = "federar";
        urlDominio= "http://www.msal.gov.ar";
        urlAud    = "http://www.mihospital.gov.ar";
        subject   = "medico@hospital.gov.ar";
        MyName    = "Suarez Hernán Pablo";
        MyIdent   = "http://refes.gov.ar|102910";
        MyRole    = "MEDICO CLINICO";

        authConfig=
        {
            
            iss:        urlDominio,
            aud:        urlAud,
            sub:        subject,
            name:       MyName,
            ident:      MyIdent,
            role:       MyRole,
            urlAuth:    urlAut,
            secretWord: secret
        }
    return authConfig;
}
//
// fhirConfPatient: Configuracion de acceso a federador
//
// urlServer: url endpoint FHIR del federador
// uriDNI:    uri para busqueda de DNI x System
// maxMatch:  cantidad de candidatos en operacion $match
function fhirConfPatient
()
{

        fhirConfig=
        {
            urlServer:"https://testapp.hospitalitaliano.org.ar/masterfile-federacion-service/fhir/Patient/",
            uriDNI:"http://www.renaper.gob.ar/dni",
            maxMatch:5
        }
        return fhirConfig;
}
//
// fhirConfPatient: Configuracion de acceso a documentos IPS
//
// urlServer: url endpoint FHIR para obtener IPS

function fhirConfIPS
()
{

        fhirConfig=
        {
            urlServer:"http://mhd.sisa.msal.gov.ar/fhir"
        }
        return fhirConfig;
}

module.exports = { authConfig, fhirConfPatient,fhirConfIPS }