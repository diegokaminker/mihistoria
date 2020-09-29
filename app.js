const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(bodyParser.json({ type: '*' }));
const { getHomePage } = require('./routes/index');
const { addPacientePage, addPaciente, deletePaciente, editPaciente, editPacientePage} = require('./routes/paciente');
const { viewPacienteMatchPage } = require('./routes/pacienteMatch');
const { viewPacienteFederarPage } = require('./routes/pacienteFederar');
const { viewPacienteResumenPage,viewUnResumenPage } = require('./routes/pacienteResumen');
const port = 5000;

//Conexion a nuestra base local
let db = new sqlite.Database('./data/MiHistoria.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la Base de Datos');
});

global.db = db;

// configura middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine


// rutas para la app: CRUD: agregar,editar,borrar
//                    FHIR: federar,match,lista de resumenes,un resumen
//
app.get('/', getHomePage);
app.get('/add', addPacientePage);
app.get('/edit/:id', editPacientePage);
app.get('/delete/:id', deletePaciente);
app.get('/match/:id', viewPacienteMatchPage);
app.get('/federar/:id', viewPacienteFederarPage);
app.get('/resumen/:id', viewPacienteResumenPage);
app.get('/unresumen', viewUnResumenPage);

app.post('/add', addPaciente);
app.post('/edit/:id', editPaciente);

// levanta la aplicacion
app.listen(port, () => {
    console.log(`Servidor en puerto: ${port}`);
});