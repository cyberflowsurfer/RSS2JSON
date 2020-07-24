'use strict'
/**
 * Handler to fetch an RSS feed and convert it to a JSONFeed (https://jsonfeed.org/) 
 * 
 * Copyright (c) 2020 Seth G Hawthorne
 */
const Feed = require('rss-to-json')

/*
 * Lambda function to fetch an RSS feed identified by a 'url' query parameter
 * and convert it to a JsonFeed.  The following query parameters can be used
 * to filter the results
 *    author
 *    category
 *    search    - return items with a title or description containing the search value
 */
module.exports = function getFeed(request, test_rss_data)  {
  if (!test_rss_data && (!request || !request.queryString.url)) {
    throw new Error(`Invalid request: missing url`)
  }

  // Define any filters
  let filters = [] 

  const itemFilter = item => {
    for (let i = 0; i < filters.length; i++) { 
      if (filters[i](item)) {
        return true
      }
    } 
    return filters.length === 0
  }

  if (request.queryString.author) {
    filters.push( item => item.author === request.queryString.author)
  }
  if (request.queryString.category) {
    filters.push( item => item.category.includes(request.queryString.category) )
  }
  if (request.queryString.search) {
    filters.push( item => item.title.includes(request.queryString.search) || item.description.includes(request.queryString.search) )  
  }

  // Create promise (either for URL fetch or parse of RSS)
  let p
  if (test_rss_data) {
    console.log('Using rss_test_data')
    p = new Promise((resolve, reject) => {
      try {
        resolve(Feed.parser(test_rss_data))
      } catch (err) {
        reject(err)
      }
    }) 
 } else {
   const feedURL = request.queryString.url
   console.log(`getFeed ${feedURL}`)
   p = Feed.load(feedURL)
 }

  // Wait for resolution and filter results
  return p
  .then(res => {                 
    const fetchCount = res.items.length
    res.items = res.items.filter(itemFilter)  
    console.log(`fetched ${fetchCount}; filters ${filters.length}; returned ${res.items.length}`)
    return res
  })
  .catch(err => console.log(err))
}

