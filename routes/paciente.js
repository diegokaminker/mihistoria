//CRUD Local de Pacientes: add, edit, delete
//
module.exports = {

    addPacientePage: (req, res) => {
        res.render('add-paciente.ejs', {
            title: 'Bienvenido a MiHistoria | Agregar Paciente',
            message: ''
        });
    },

    addPaciente: function (req, res) {
        let message = '';
        let Given = req.body.Given;
        let Family = req.body.Family;
        let Identifier = req.body.Identifier;
        let Gender = req.body.Gender;
        let birthDate = req.body.birthDate;
        let ApellidoPaterno = req.body.ApellidoPaterno;
        let DNI = req.body.DNI;

        let usernameQuery = "SELECT * FROM `paciente` WHERE DNI = '" + DNI + "'";
        console.log(usernameQuery);
        db.all(usernameQuery, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Ya existe DNI';
                res.render('add-paciente.ejs', {
                    message,
                    title: 'Bienvenido a MiHistoria | Agregar Paciente'
                });
            } else {
                // send the paciente's details to the database
                let query = "INSERT INTO `paciente` (Family, Given, Identifier, birthDate, Gender, ApellidoPaterno, DNI) VALUES ('" +
                    Family + "', '" + Given + "', '" + Identifier + "', '" + birthDate + "', '" + Gender + "', '" + ApellidoPaterno + "', '" + DNI + "')";
                console.log(query);
                db.run(query, [], (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            };
        });
    },

    editPacientePage: (req, res) => {

        let pacienteId = req.params.id;
        let query = "SELECT * FROM `paciente` WHERE id = '" + pacienteId + "' ";
        db.all(query, [], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-paciente.ejs', {
                title: 'Editar Paciente',
                paciente: result[0],
                message: ''
            });
        });
    },
    editPaciente: (req, res) => {
        console.log(req);
        let pacienteId = req.params.id;
        let Given = req.body.Given;
        let Family = req.body.Family;
        let Identifier = req.body.Identifier;
        let Gender = req.body.Gender;
        let birthDate = req.body.birthDate;
        let ApellidoPaterno = req.body.ApellidoPaterno;
        let DNI = req.body.DNI;

        let query = "UPDATE `paciente` SET `Given` = '" + Given + "', `Family` = '" + Family + "', `Identifier` = '" + Identifier + "'" +
            ",`Gender` = '" + Gender + "', `birthDate` = '" + birthDate + "', `ApellidoPaterno` = '" + ApellidoPaterno + "', `DNI` = '" + DNI +
            "' WHERE `paciente`.`Id` = '" + pacienteId + "'";
        console.log(query);
        db.all(query, [], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletePaciente: (req, res) => {
        let pacienteId = req.params.id;
        let deleteUserQuery = 'DELETE FROM paciente WHERE Id = "' + pacienteId + '"';

        db.all(deleteUserQuery, [], (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    }
};