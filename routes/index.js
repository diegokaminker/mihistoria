//Lista de Pacientes / Backend
//
module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `paciente` ORDER BY id ASC";

        db.all(query, [], (err, rows) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Bienvenido a MiHistoria",
                pacientes: rows
            });

        });


    }
}