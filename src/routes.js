const express = require("express");
// const controller = require("../controllers");
const routes = express.Router();
const client = require('./client');


// Root 
routes.route("/").get(async (req, res) => {
    res.status(200).send('Index loaded. Use /news_headlines')
});


// Get All 
routes.route("/news_headlines").get(async (req, res) => {
    const searchResults = await client.search({
        index: "news_headlines",
        body: {
            query: {
                match_all: {}
            }
        }
    });

    const documents = searchResults.body.hits.hits;

    // for (const doc of documents){
    //     console.log(doc._source)
    // }

    res.json(documents);
});



module.exports = routes;