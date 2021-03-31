const { Client } = require('@elastic/elasticsearch');

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || "http://localhost:9200/";

const client = new Client({
    node: ELASTICSEARCH_URL
});

module.exports = client;

//