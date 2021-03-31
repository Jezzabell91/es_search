const express = require("express");
const routes = express.Router();
const client = require('./client');
const esb = require('elastic-builder');


// Root 
routes.route("/").get(async (req, res) => {

    res.status(200).send('Index loaded. Use /news_headlines')
});


// Get All  or search with simple query
routes.route("/news_headlines").get(async (req, res) => {

    const searchQuery = req.query.q
    console.log(req.query)
    let searchResults;  

    if (searchQuery) {
        console.log(searchQuery)
        searchResults = await client.search({
            index: "news_headlines",
            body: {
                query: {
                    simple_query_string: {
                        query: searchQuery
                    }
                }
            }
        });
    } else {
        searchResults = await client.search({
            index: "news_headlines",
            body: {
                query: {
                    match_all: {
                    }
                }
            }
        });
    }
    const documents = searchResults.body.hits.hits;

    res.json(documents);
});

// Handle search params 
routes.route("/news_headlines/:q").get(async (req, res) => {

    console.log(req.params)
    const searchQuery = req.params.q
    console.log(searchQuery)

    const searchResults = await client.search({
        index: "news_headlines",
        body: {
            query: {
                simple_query_string: {
                    query: searchQuery
                }
            }
        }
    });

    const documents = searchResults.body.hits.hits;

    res.json(documents);
});


// Search By headline
routes.route("/news_headlines/search/:q").get(async (req, res) => {

    // console.log(req.params.q)
    console.log(req.params)
    const searchQuery = req.params.q
    
    requestBody = esb.requestBodySearch().query(
        esb.boolQuery()
          .must(esb.matchQuery('headline', searchQuery))
      );

    results = await client.search({
        index: 'news_headlines',
        body: requestBody.toJSON()
    });

    documents = results.body.hits.hits;

    // for (const doc of documents){
    //   console.log(doc._source)
    // }

    res.json(documents)
})



module.exports = routes;