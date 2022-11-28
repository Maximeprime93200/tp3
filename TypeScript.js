var express = require('express');
var app = express();
var port = 8000;
var unzip = require('unzip-stream');
app.get('/tp3', function (req, res) {
    var csv = require('csv-parser');
    var fs = require('fs');
    var x = 0;
    var y = 0;
    var download = require('download');
    function Launch() {
        fs.createReadStream('./data/StockEtablissementLiensSuccession_utf8.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
            var fileName = entry.path;
            var type = entry.type;
            var size = entry.size;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                    .on('data', function (data) {
                    if (data.transfertSiege == 'true') {
                        x += 1;
                    }
                    y += 1;
                })
                    .on('end', function () {
                    var percentage = x / y * 100;
                    var Final = percentage.toFixed(2);
                    res.send("".concat(Final, "% des compagnies ont transf\u00E9r\u00E9 leur si\u00E8ge social avant le 1er Novembre 2022"));
                });
            }
            else {
                entry.autodrain();
            }
        });
    }
    if (fs.existsSync('./data/StockEtablissementLiensSuccession_utf8.zip')) {
        console.log("File existing");
        Launch();
    }
    else {
        console.log("Creating the File");
        download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
            Launch();
        });
    }
});
app.listen(port, function () { return console.log("Mon TP est sur localhost:".concat(port, "/tp3")); });
