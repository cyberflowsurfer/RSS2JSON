var Feed = require('rss-to-json')
 
Feed.load('https://morioh.com/feed', function(err, rss){
    console.log(JSON.stringify(rss, null, 3));
})
 