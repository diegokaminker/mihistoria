//Acceso a Servicios de Federacion de Pacientes
//
//MatchPaciente: obtiene lista de candidatos
//               a partir de set de datos basicos
//               Patient/$match
//          
//FederarPaciente: federa un paciente y obtiene el
//                 id de federador POST Patient
//                          
//PatientLocation: obtiene una lista de dominios
//                 que han federado a un paciente
//          
const auth   = require('./client_auth');
const conf   = require('./client_config');
const axios   = require('axios');

async function PatientLocation(MyPatientData)
{
 
    try
    {
     token=await auth.GetTokenFromAuth();
     var cnf=conf.fhirConfPatient();
     var urlFHIREndpoint= cnf.urlServer;
     var ResourceClass  ='Patient';
     var OperationName="$patient-location"
     var cnd=conf.authConfig();
     var system=cnd.iss;
     var value=1000000+MyPatientData.Id;
     var MyIdentifier=system+"|" +value;
     var fullURL = urlFHIREndpoint+"/"+OperationName+"?identifier="+MyIdentifier;
     console.log(fullURL);
     let response=await axios.get(fullURL, {headers : { 'Authorization' : 'bearer '+token }})
      var data=response.data;
      console.log('datos');
      console.log(JSON.stringify(data));
      return data;
  
    }
    catch
    {
         
    }
    
}
function GivenSep(given)
{
  
  MyGiven=given.split(" ");
  AllGiven=[];
  iGiv=0;
  MyGiven.forEach(OneGiven => {
    if (iGiv==0)
      AllGiven.push(OneGiven);
    else
      if (iGiv==1)
        AllGiven.push(OneGiven);
      else  
        AllGiven[1]=AllGiven[1]+ " "+OneGiven;
    iGiv++;
   
  });
  return AllGiven;

}
async function MatchPaciente(MyPatientData)
{
    
  try
  {
   token=await auth.GetTokenFromAuth();
   console.log('Tengo token');
  console.log(token);
  cnf=conf.fhirConfPatient();
  var urlFHIREndpoint= cnf.urlServer;
  console.log('endpoint');
  console.log(urlFHIREndpoint);
  var ResourceClass  ='Patient';
  var OperationName="$match"
  MyGiven=GivenSep(MyPatientData.Given);
  Parameters=
  {
    
    "resourceType": "Parameters",
    "id": "mymatch",
    "parameter": [
      {
        "name": "resource",
        "resource":
          {
            "resourceType": "Patient",
            "identifier": [
              {
                  "use": "usual",
                  "system": cnf.uriDNI,
                  "value": MyPatientData.DNI
              }
            ],
            "name": [
                {
                    "_family": {
                        "extension": [
                            {
                                "url": "http://hl7.org/fhir/StructureDefinition/humanname-fathers-family",
                                "valueString": MyPatientData.ApellidoPaterno
                            }
                        ]
                    },
                    "given": MyGiven
                }
            ],
            "birthDate": MyPatientData.birthDate,
            "gender": MyPatientData.Gender
          }
      },
      {
        "name": "count",
        "valueInteger": cnf.maxMatch
      }
    ]
  };
   var fullURL = urlFHIREndpoint+"/"+OperationName;
   console.log(fullURL);
   console.log(JSON.stringify(Parameters));
   let response=await axios.post(fullURL, Parameters, {headers : { 'Authorization' : 'bearer '+token }})
    var data=response.data;
    console.log('datos');
    console.log(JSON.stringify(data));
    return data;

  }
  catch
  {
    // Handle Error Here
    console.log(JSON.stringify(err));
       
  }
  
  
}

async function FederarPaciente(MyPatientData)
{
    
  try
  {
   token=await auth.GetTokenFromAuth();
   cnf=conf.fhirConfPatient();
   cnd=conf.authConfig();
   var urlFHIREndpoint= cnf.urlServer;
   var ResourceClass  ='Patient';
   var resourceText='<div xmlns=\"http://www.w3.org/1999/xhtml\">'
                +   '<table>'
                +   '<tbody> <tr><td>Identificador</td><td>'+MyPatientData.Id+'</td></tr>'
                +   '        <tr><td>Nombre</td><td>'+MyPatientData.Given+'</td></tr>'
                +   '        <tr><td>Apellido</td><td>'+MyPatientData.ApellidoPaterno+'</td></tr>'
                +   '        <tr><td>Genero</td><td>'+MyPatientData.Gender+'</td></tr>'
                +   '        <tr><td>F.Nacimiento</td><td>'+MyPatientData.birthDate+'</td></tr>'
                +   '</tbody>'
                +   '</table>'
                +   '</div>'
  MyGiven=GivenSep(MyPatientData.Given);              
  MyPatient=
          {
            "resourceType": "Patient",
            "text": {
              "status": "generated",
              "div": resourceText
            },
            "identifier": [
              {
                  "use": "usual",
                  "system": cnd.iss,
                  "value": 1000000+MyPatientData.Id
              },
              {
                "use": "usual",
                "system": cnf.uriDNI,
                "value": MyPatientData.DNI
            },
            
            ],
            "name": [
                {
                    "_family": {
                        "extension": [
                            {
                                "url": "http://hl7.org/fhir/StructureDefinition/humanname-fathers-family",
                                "valueString": MyPatientData.ApellidoPaterno
                            }
                        ]
                    },
                    "given": MyGiven,
                    "use": "official"
           
                }
            ],
            "birthDate": MyPatientData.birthDate,
            "gender": MyPatientData.Gender
          } ;
   var fullURL = urlFHIREndpoint;
   console.log(fullURL);
   console.log(JSON.stringify(MyPatient));
   let response=await axios.post(fullURL, MyPatient, {headers : { 'Authorization' : 'bearer '+token }})
   
   var data=response.headers.location
   identifier=data.replace(fullURL ,"");
   return identifier;

  }
  catch
  {
    // Handle Error Here
    console.log(JSON.stringify(err));
       
  }
  
  
}

module.exports = { MatchPaciente,FederarPaciente,PatientLocation }