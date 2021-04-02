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




// New document 
routes.route("/news_headlines/new").post(async (req, res) => {
    try {
        const newDoc = await client.index({
             index: "news_headlines",
             type: "_doc",
             body: {
                 category: "TRAVEL",
                 headline: "This is a test, search for MaroonSleepyGorilla",
                 authors: "Test User",
                 link: "https://www.huffingtonpost.com/entry/volcano-smiling-hawaii_us_579bda86e14b0e2e15eb5fd73",
                 short_description: "This is a test, RedDancingGiraffe",
                 date: "2020-07-30"
             }
         })
     
         console.log(res.json(newDoc))
        
    } catch (error) {
        console.error(res.json(error));
    }
})


// Update document 
routes.route("/news_headlines/update/:id").patch(async (req, res) => {
    try {       
        const updatedDoc = await client.update({
             index: "news_headlines",
             id: req.params.id,
            body: {
                doc: {
                    headline: "This is a test to update, search for TealSleepyGorilla"
                }
            }
         })
     
         console.log(res.json(updatedDoc))
        
    } catch (error) {
        console.error(res.json(error));
    }
 })


// Delete document 
routes.route("/news_headlines/remove/:id").delete(async (req, res) => {
    try {       
        const deletedDoc = await client.delete({
             index: "news_headlines",
             id: req.params.id,
         })
     
         console.log(res.json(deletedDoc))
        
    } catch (error) {
        console.error(res.json(error));
    }
 })

module.exports = routes;
//