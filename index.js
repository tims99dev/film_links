const axios = require("axios");
const normalizeUrl = require("normalize-url");

const express = require("express");
const app = express();

const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.104 Safari/537.36' }

app.use(express.urlencoded({ extended: false }));
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/geturl", (req, res) => {
  axios
    .get(req.body.url, { headers })
    .then((response) => {
      let url = [];
      let result = response.data.match(/\[(2|3).+mp4/gi)[0];
      result = result.split(/,| or /);

      result.forEach((e) => {
        if (/^http/i.test(e)) {
          url.push(normalizeUrl(new URL(e).href));
        }
      });
      res.render("result", {
        links: url,
      });
    })
    .catch(function (e) {
      console.log(e);
      res.status(500).send(e);
    });
});

const PORT = process.env.PORT || 3000;

app.listen({ port: PORT }, () => console.log(`Server starts at ${PORT}`));
