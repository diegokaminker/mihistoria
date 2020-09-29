//Acceso a Servicios de Autenticacion/Autorizacion
//
const authc = require('./client_config.js');
//
// Arma el token para enviar al servidor de autenticacion y solicita el token al server
//
// scope: acceso a datos del paciente, lectoescritura para federar
// 
async function GetTokenFromAuth()
{

    tokenInicial=CreateJWTToken()
    var authRequest={
        "grantType": "client_credentials",
        "scope": "Patient/*.read,Patient/*.write",
        "clientAssertionType": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "clientAssertion": tokenInicial
    };
    c       =   authc.authConfig();
  
    const axios = require('axios');
    const urlAuth=c.urlAuth;
        try {
            let resp = await axios.post( urlAuth, authRequest);
            return resp.data.accessToken;
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    

}
function CreateJWTToken()
{
    var jwt =   require('jsonwebtoken');
    c       =   authc.authConfig();
    var myTokenContent=
    {
        iss:    c.iss,
        iat:    Date.now(),
        exp:    Date.now()  +  6000000 ,
        aud:    c.aud,
        sub:    c.sub,
        name:   c.name,
        ident:  c.ident,
        role:   c.role
    }
    var token = jwt.sign(myTokenContent, c.secretWord);
    return token;
}
module.exports = { GetTokenFromAuth }