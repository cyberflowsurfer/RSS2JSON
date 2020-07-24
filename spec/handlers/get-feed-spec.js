'use strict'

/**
 * Integration test for get-feeds
 * 
 * Copyright (c) 2020 Seth G Hawthorne
 */
const AWS      = require('aws-sdk')
AWS.config.update({region: process.env.AWS_REGION || 'us-west-1'});

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000 

const getFeed     = require('../../handlers/get-feed') 
const request     = require('../helpers/request')
const hacker_news = require('../fixtures/hacker-news.js')
const morioh      = require('../fixtures/morioh.js')


describe('getFeed', () => { 
  it('should return a live RSS feed', done => { 
    getFeed(request.create({url: "https://hnrss.org/newest" }))
    .then(res => {
      expect(res.title).toBe('Hacker News: Newest') 
      done()
    })
  })

  it('should return all items from a static morioh news RSS feed', done => { 
    getFeed(request.create({url: "http://example.com" }), morioh.feed)
    .then(res => {
      expectIds(res, morioh.all_ids)
      done()
    })
  })

  it('should return all items for an author from a static morioh RSS feed', done => { 
    const author = "Louie Perry"
    getFeed(request.create({url: "http://example.com", author}), morioh.feed)
    .then(res => {
      expectIds(res, morioh.ids_by_author[author])
      done()
    })
  })

  it('should return no items for a non-existent author from a static morioh RSS feed', done => { 
    const author = "nonexistent"
    getFeed(request.create({url: "http://example.com", author}), morioh.feed)
    .then(res => {
      expect(res.items.length).toBe(0, 'unexpected items returned') 
      done()
    })
  })

  it('should return items for category machine-learning from a static morioh RSS feed', done => { 
    const category = "machine-learning"
    getFeed(request.create({url: "http://example.com", category}), morioh.feed)
    .then(res => {
      expectIds(res, morioh.ids_by_category[category])
      done()
    })
  })

  it('should return no items for non-existent category from a static morioh RSS feed', done => { 
    const category = "non-existent-category"
    getFeed(request.create({url: "http://example.com", category}), morioh.feed)
    .then(res => {
      expect(res.items.length).toBe(0, 'unexpected items returned') 
      done()
    })
  })

  it('should return items matching search term from a static morioh RSS feed', done => { 
    const search = "CSS"
    getFeed(request.create({url: "http://example.com", search}), morioh.feed)
    .then(res => {
      expectIds(res, morioh.ids_by_search[search])
      done()
    })
  })

})


function expectIds(response, expected_ids) {
  let actual_ids       = response.items.map(item => item.id)
  let actual_ids_set   = new Set(actual_ids)
  let expected_ids_set = new Set(expected_ids )

  let extraItems   = new Set( [...actual_ids].filter(  x => !expected_ids_set.has(x)) )
  let missingItems = new Set( [...expected_ids].filter(x => !actual_ids_set.has(x)) )
  expect(extraItems.size).toBe(0,   `Response has extra items ${JSON.stringify([...extraItems])}`) 
  expect(missingItems.size).toBe(0, `Response missing items ${JSON.stringify([...missingItems])}`) 
}
