const client = require('./client');
const { createReadStream } = require('fs');
const split = require('split2');
const express = require("express");
const routes = require('./routes');

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3500;


// Add documents from .json file to index 
async function addDocs(file, indexName) {
    console.log('inside add Docs')
    const stats = await client.helpers.bulk({
        datasource: createReadStream(file).pipe(split()),
        onDocument (doc) {
            return { index: { _index: indexName } }
        },
        onDrop (doc) {
            console.log(doc)
        },
        flushBytes: 1000000,
        flushInterval: 30000,
        concurrency: 10,
        retries: 3,
        wait: 3000,
        refreshOnCompletion: true
    });

    console.log(stats);
};


// Check if index exists, if not create and populate with documents
async function checkIndex(){
    try{
        console.log('Checking if index exists')
        if ((await client.indices.exists({index: "news_headlines"})).body === true) {     
            console.log('Index already exists')
        } else {
            console.log('Setting Up Index');
            await client.indices.create({index: 'news_headlines'});
            console.log('Index Created, Populating Index')
            await addDocs("./src/news_headlines.json", 'news_headlines');
        }
    } catch (error) {
        console.error(error.message);
    };
}


//
// Registers a HTTP GET route for search
//
// app.get("/news_headlines/get", async (req, res) => {
//     const searchQuery = req
//     console.log(searchQuery)
//     // try {
//     //     const result = await 
//     // } catch (error) {
        
//     // }
    
//     //     const documents = searchResults.body.hits.hits
    
//     //     // for (const doc of documents){
//     //     //     console.log(doc._source)
//     //     // }
//     //     res.json(documents)
// })


async function main(){
    // await client.indices.delete({index: 'news_headlines'});
    await checkIndex();
    app.listen(PORT, () => {
        console.log(`Microservice listening on PORT ${PORT}, point your browser at http://localhost:${PORT}/`);
    });
    
}

main();