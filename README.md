# ElasticSearch for News Headlines

## WSL2 instructions

1. Run Docker Desktop in windows
2. In linux terminal run the command ```sysctl -w vm.max_map_count=262144``` , you may need to use sudo if you're not the root user
3. Then do docker-compose up to start the elasticsearch server and kibana 
4. Do ```npm install```
5. Start with ```npm start```

All Services Should Be working now. 

Test by going to ```localhost:3500```

## Sample Queries

### **Route = "/news_headlines/"**

Simple Query
```http://localhost:3500/news_headlines/?q=volcano```

Simple Query With And 
```http://localhost:3500/news_headlines/?q=volcano+lava```

Simple Query With Exclusion
```http://localhost:3500/news_headlines/?q=Ecuador+-Volcano```


**We can also search without the ?q= in the url**

Using '?q=' gives us the search query in the request which we get with 
```req.query.q``` whereas without it, the query is stored in the request params ```req.params```


### **Route = "/news_headlines/:q"**

Search With AND operator
```http://localhost:3500/news_headlines/Ecuador+Volcano/```

Search with OR operator
```http://localhost:3500/news_headlines/Ecuador|Volcano/```


### **Route = "/news_headlines/search/:q"**
Search headlines field without using simple query
```http://localhost:3500/news_headlines/search/netflix+amazon```