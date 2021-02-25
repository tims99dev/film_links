const axios = require('axios')
const normalizeUrl = require('normalize-url');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/geturl', (req, res) => {
    axios.get(req.body.url)
        .then((response) => {
            let url = []
            let result = response.data.match(/\[(2|3).+mp4/gi)[0]
            result = result.split(/,| or /)

            result.forEach(e => {
                if (/^http/i.test(e)) {
                    url.push(normalizeUrl(new URL(e).href))
                }
            });
            res.render('result', {
                links: url
            });
        }).catch(function (e) {
            console.log(e);
            res.status(500).send(e)
        });

});

const PORT = process.env.PORT || 3000;

app.listen({ port: PORT }, () =>
    console.log(`Server starts at ${PORT}`)
);