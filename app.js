'use strict'
/**
 * API for converting RSS feeds to JSON feeds 
 */
const Api     = require('claudia-api-builder')
const api     = new Api()
const getFeed = require('./handlers/get-feed')

api.get('/feed', getFeed)

module.exports = api 