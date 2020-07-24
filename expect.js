'use strict'


module.exports.quoteEquality = function (actual, quotesList) {
  actual.forEach(a => {
    let expected = quotesList.lookupByQuote(a.quote)
    expect(expected).toBeDefined("Lookup of expected quote failed")
    // Compare actual properties that exist against expected 
    quotesList.getProperties().forEach( p => {
      if (actual[p])
        expect(actual[p]).toEqual(expected[p])
    })
  })
}


// Works around the problem that set equality is order sensitive: https://github.com/jasmine/jasmine/issues/1402
// Should be possible to create a customTester, but that doesn't seem to be working
//
module.exports.setEquality = function(actual, expected) {
  // expect(actual).toBeInstanceOf(Set)
  // expect(expected).toBeInstanceOf(Set)
  let extraItems   = new Set( [...actual].filter(  x => !expected.has(x)) )
  let missingItems = new Set( [...expected].filter(x => !actual.has(x)) )
  expect(extraItems.size).toBe(0, `Response has extra items ${JSON.stringify([...extraItems])}`) 
  expect(missingItems.size).toBe(0, `Response missing items ${JSON.stringify([...missingItems])}`) 
}
