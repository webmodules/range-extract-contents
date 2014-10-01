
var assert = require('assert');
var extractContents = require('../');

describe('range-extract-contents', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  it('should extract a DocumentFragment from a Range', function () {
    div = document.createElement('div');
    div.innerHTML = 'hello';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild, 1);
    range.setEnd(div.firstChild, 2);

    var fragment = extractContents(range);

    // test that we have the expected HTML at this point
    assert.equal('hllo', div.innerHTML);

    // test that the fragment contains the proper values
    assert.equal(1, fragment.childNodes.length);
    assert.equal('e', fragment.firstChild.nodeValue);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div.firstChild);
    assert.equal(range.startOffset, 1);
    assert(range.endContainer === div.firstChild);
    assert.equal(range.endOffset, 1);
  });

  it('should remove empty TextNodes at Range boundaries (left side)', function () {
    div = document.createElement('div');
    div.innerHTML = 'hello';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild, 0);
    range.setEnd(div.firstChild, 1);

    var fragment = extractContents(range);

    // test that we have the expected HTML and number of child nodes at this point
    assert.equal('ello', div.innerHTML);
    assert.equal(1, div.childNodes.length);

    // test that the fragment contains the proper values
    assert.equal(1, fragment.childNodes.length);
    assert.equal('h', fragment.firstChild.nodeValue);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div.firstChild);
    assert.equal(range.startOffset, 0);
    assert(range.endContainer === div.firstChild);
    assert.equal(range.endOffset, 0);
  });

  it('should remove empty TextNodes at Range boundaries (right side)', function () {
    div = document.createElement('div');
    div.innerHTML = 'hello';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild, 4);
    range.setEnd(div.firstChild, 5);

    var fragment = extractContents(range);

    // test that we have the expected HTML and number of child nodes at this point
    assert.equal('hell', div.innerHTML);
    assert.equal(1, div.childNodes.length);

    // test that the fragment contains the proper values
    assert.equal(1, fragment.childNodes.length);
    assert.equal('o', fragment.firstChild.nodeValue);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div.firstChild);
    assert.equal(range.startOffset, 4);
    assert(range.endContainer === div.firstChild);
    assert.equal(range.endOffset, 4);
  });

  it('should remove empty TextNodes at Range boundaries (both sides)', function () {
    div = document.createElement('div');
    div.innerHTML = 'hello';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild, 0);
    range.setEnd(div.firstChild, 5);

    var fragment = extractContents(range);

    // test that we have the expected HTML and number of child nodes at this point
    assert.equal('', div.innerHTML);
    assert.equal(0, div.childNodes.length);

    // test that the fragment contains the proper values
    assert.equal(1, fragment.childNodes.length);
    assert.equal('hello', fragment.firstChild.nodeValue);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div);
    assert.equal(range.startOffset, 0);
    assert(range.endContainer === div);
    assert.equal(range.endOffset, 0);
  });

  it('should remove empty DOM elements at Range boundaries', function () {
    div = document.createElement('div');
    div.innerHTML = '<i><b>he</b></i><u>llo</u>';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild.firstChild, 0);
    range.setEnd(div.lastChild.firstChild, 3);

    var fragment = extractContents(range);

    // test that we have the expected HTML and number of child nodes at this point
    assert.equal('', div.innerHTML);

    // test that the fragment contains the proper values
    assert.equal(2, fragment.childNodes.length);
    assert.equal('I', fragment.firstChild.nodeName);
    assert.equal('<b>he</b>', fragment.firstChild.innerHTML);
    assert.equal('U', fragment.lastChild.nodeName);
    assert.equal('llo', fragment.lastChild.innerHTML);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div);
    assert.equal(range.startOffset, 0);
    assert(range.endContainer === div);
    assert.equal(range.endOffset, 0);
  });

  it('should remove empty DOM elements and empty TextNodes at Range boundaries', function () {
    div = document.createElement('div');
    div.innerHTML = '<i><b>he</b></i>llo';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild.firstChild, 0);
    range.setEnd(div.lastChild, 3);

    var fragment = extractContents(range);

    // test that we have the expected HTML and number of child nodes at this point
    assert.equal('', div.innerHTML);

    // test that the fragment contains the proper values
    assert.equal(2, fragment.childNodes.length);
    assert.equal('I', fragment.firstChild.nodeName);
    assert.equal('<b>he</b>', fragment.firstChild.innerHTML);
    assert.equal('llo', fragment.lastChild.nodeValue);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div);
    assert.equal(range.startOffset, 0);
    assert(range.endContainer === div);
    assert.equal(range.endOffset, 0);
  });

  it('should remove empty DOM elements and empty TextNodes at Range boundaries 2', function () {
    div = document.createElement('div');
    div.innerHTML = 'hel<i>lo</i>';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild, 0);
    range.setEnd(div.lastChild.firstChild, 2);

    var fragment = extractContents(range);

    // test that we have the expected HTML and number of child nodes at this point
    assert.equal('', div.innerHTML);

    // test that the fragment contains the proper values
    assert.equal(2, fragment.childNodes.length);
    assert.equal('hel', fragment.firstChild.nodeValue);
    assert.equal('I', fragment.lastChild.nodeName);
    assert.equal('lo', fragment.lastChild.innerHTML);

    // test that the Range is collapsed where the fragment used to be
    assert(range.collapsed);
    assert(range.startContainer === div);
    assert.equal(range.startOffset, 0);
    assert(range.endContainer === div);
    assert.equal(range.endOffset, 0);
  });

});
