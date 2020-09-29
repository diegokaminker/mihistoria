//Obtiene lista de candidatos dado un id

const federadorServices = require('./federador_services');


module.exports = {

    viewPacienteMatchPage: (req, res) => {

        let pacienteId = req.params.id;

        let query = "SELECT * FROM `paciente` WHERE id = '" + pacienteId + "' ";

        db.all(query, [], (err, result) => {

            if (err) {

                return res.status(500).send(err);
            }
            else
            {
                
                DatosPaciente=result[0];
                federadorServices.MatchPaciente(DatosPaciente).then
                (
                    
                   PatientList => {
                    console.log("Tengo Resultado");
                    var entries = PatientList.entry;
                    AllPat=[];
                    entries.forEach(entry => 
                        {
                            var Pat=entry;
                            AllPat.push(Pat);
                            
                        }
                        );
                    res.render(
                        'match-listado.ejs', 
                        {
                            title: 'Listado de Candidatos',
                            pacientes: AllPat,
                            message: 'Seleccione un paciente'
                        });
                 

                    }
                )
                 .catch(
                     e => {
                         console.log(JSON.stringify(e)); 
                         return res.status(500).send(e) });
            }
        })
    
    }
}