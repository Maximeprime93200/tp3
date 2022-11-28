const express = require('express')
const app = express()
const port = 8000
const unzip = require('unzip-stream')


app.get('/tp3', (req, res) => {
    const csv = require('csv-parser')
    const fs = require('fs')
    var x = 0;
    var y = 0; 
    const download = require('download');

    function Launch(){
        fs.createReadStream('./data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const fileName = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                .on('data', (data) => {
                    if(data.transfertSiege == 'true'){
                        x += 1;
                    }
                    y += 1; 
                })
                .on('end', () => {
                    const percentage = x / y * 100;
                    const Final = percentage.toFixed(2);
                    res.send(`${Final}% des compagnies ont transféré leur siège social avant le 1er Novembre 2022`)
                } )
            } else {
                entry.autodrain();
            }
        });
    }

    if (fs.existsSync('./data/StockEtablissementLiensSuccession_utf8.zip')){
        console.log("File existing");
        Launch();
    } else {
        console.log("Creating the File");
        download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
            Launch();
        });
    }

})

app.listen(port, () => console.log(`Mon TP est sur localhost:${port}/tp3`))