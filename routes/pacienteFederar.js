//Federa un paciente sabiendo nuestro id
//

const federadorServices = require('./federador_services');

module.exports = {

    viewPacienteFederarPage: (req, res) => {

        let pacienteId = req.params.id;

        let query = "SELECT * FROM `paciente` WHERE id = '" + pacienteId + "' ";

        db.all(query, [], (err, result) => {

            if (err) {
                return res.status(500).send(err);
            }
            
            var ourData = result[0];
                
                federadorServices.FederarPaciente(ourData).then
                (
                
                    FederatedIdentifier => {
                        var query = "UPDATE `paciente` SET `Identifier` = '"+FederatedIdentifier+"' WHERE `paciente`.`Id` = '"+pacienteId+"'";
                        console.log(query);
                        db.all(query, (err, updateresult) => {
                            if (err) {

                                return res.status(500).send(err);
                            }
                            else
                            {
                            
                        
                        result[0].identifier=pacienteId;
                        res.render('edit-paciente.ejs', {
                            title: 'Registro de Paciente Federado',
                            paciente: result[0],
                            message: ''
                            });
                        }    
                    }
                     
                )
                }
                ).catch(e => { return res.status(500).send(e) });
          
        })
    }

}