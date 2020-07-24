# RSS2JSON
## Overview
This Claudia deployed lambda function fetches an RSS feed and uses the 
(rss-to-json)[https://www.npmjs.com/package/rss-to-json] library to convert it to a JSONFeed (jsonfeed.org).
It also supports several query parameters for filtering the results.

## Usage
`GET <aws-url>/feed?url=https://hnrss.org/newest`

## TODO
  1. `search` parameter to search title and description
  1. `category` parameter to restrict to one or more categories
  1. `author1 parameter to restrict to an author