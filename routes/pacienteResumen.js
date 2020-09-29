//Obtiene un Resumen IPS
//1-Lista de dominios que federaron
//  para pedir el resumen: viewPacienteResumenPage
//2-Lista de documentos * en principio uno solo
//  el resumen IPS en formato JSON
//  que mostramos a continuacion: viewUnResumenPage

const federadorServices = require('./federador_services');
const documentServices =  require('./document_services');

module.exports = {

    viewPacienteResumenPage: (req, res) => {

        let pacienteId = req.params.id;

        let query = "SELECT * FROM `paciente` WHERE id = '" + pacienteId + "' ";

        db.all(query, [], (err, result) => 
        {

            if (err) {
                return res.status(500).send(err);
            }
            else
            {
                var ourData = result[0];
                federadorServices.PatientLocation(ourData).then
                ( FederadoEnDominios => {
                        console.log("Tengo Resultado");
                        var entries = FederadoEnDominios.entry;
                        AllDom=[];
                        entries.forEach(entry => 
                        {
                            var Dom=entry;
                            AllDom.push(Dom);
                            
                        }
                        );
                        var ident={value:ourData.Id};
                        console.log(ident);
                        res.render(
                            'resumen-listado.ejs', 
                            {
                                title: 'Listado de Dominios',
                                dominios: AllDom,
                                ident_paciente:ident,
                                message: 'Seleccione un Dominio'
                            }
                        );
                        }    
                    
                )    
                
                }
            }
        )}
        ,
    viewUnResumenPage: (req, res) => {
    
        let pacienteId = req.query.identificador;
        let dominio    = req.query.dominio;
        let query = "SELECT * FROM `paciente` WHERE id = '" + pacienteId + "' ";

        db.all(query, [], (err, result) => 
        {

            if (err) {
                return res.status(500).send(err);
            }
            else
            {
                var ourData = result[0];
                documentServices.ListaDocumentosDisponibles(ourData,dominio)
                .then
                (  DocumentosDisponibles => {
                        console.log("Tengo Resultado");
                        var entries = DocumentosDisponibles.entry;
                        AllDoc = [];
                        entries.forEach(entry => {
                            var Doc = entry;
                            AllDoc.push(Doc);

                        }
                        );
                        if (AllDoc.length == 1) {
                            var doc=AllDoc[0];
                            var url=doc.resource.content[0].attachment.url;
                            documentServices.ContenidoDocumento(url)
                            .then
                            (  IPSCompleto => {
                                composition=IPSCompleto.entry[0].resource;
                                AllSec = [];
                                sections=composition.section;
                                sections.forEach(section => {
                                    AllSec.push(section);
                                });
                                res.render(
                                    'resumen-ver.ejs',
                                    {
                                        title: 'Ver Documento IPS',
                                        secciones: AllSec,
                                        message: 'Visualizar IPS'
                                    }
                                )}
                            )
                        }   

                    })
                
                }
            })
        }
    }


    



