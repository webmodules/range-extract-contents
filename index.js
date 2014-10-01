
/**
 * Module dependencies.
 */

var debug = require('debug')('range-extract-contents');

/**
 * Module exports.
 */

module.exports = extractContents;

/**
 * Returns `true` if `node` is a TextNode with an empty string inside,
 * or `false` otherwise.
 *
 * @param {Node} node - DOM node to check
 * @return {Boolean}
 * @private
 */

function isEmptyTextNode (node) {
  return node &&
    node.nodeType === 3 /* Node.TEXT_NODE */ &&
    node.nodeValue === '';
}

/**
 * Returns `true` if `node` is an Element with no child nodes, an empty text node,
 * or other empty Elements.
 *
 * @param {Node} node - DOM node to check
 * @return {Boolean}
 * @private
 */

function isEmptyElement (node) {
  return node &&
    node.nodeType === 1 /* Node.ELEMENT_NODE */ &&
    (node.childNodes.length === 0 ||
     (node.childNodes.length === 1 &&
      (isEmptyTextNode(node.firstChild) || isEmptyElement(node.firstChild))
     )
    );
}

/**
 * Cross-browser polyfill for `Range#extractContents()`.
 *
 * @api public
 */

function extractContents (range) {
  var fragment = range.extractContents();

  var child;
  var left = fragment.firstChild;
  var right = fragment.lastChild;

  // check right-hand side child node
  if (right) {
    if (range.endContainer.nodeType === 3 /* Node.TEXT_NODE */) {
      child = range.endContainer;
    } else { /* Node.ELEMENT_NODE */
      child = range.endContainer.childNodes[range.endOffset];
    }
    if (child) {
      if (child.nodeType === 3 /* Node.TEXT_NODE */ && isEmptyTextNode(child)) {
        debug('removing right-hand side `nextSibling` empty TextNode');
        child.parentNode.removeChild(child);
      } else if (child.nodeType === 1 /* Node.ELEMENT_NODE */ && child.nodeName === right.nodeName && isEmptyElement(child)) {
        debug('removing right-hand side `nextSibling` empty Element %o', child);
        child.parentNode.removeChild(child);
      }
    }
  }

  // check left-hand side child node
  if (left) {
    if (range.startContainer.nodeType === 3 /* Node.TEXT_NODE */) {
      child = range.startContainer;
    } else { /* Node.ELEMENT_NODE */
      child = range.startContainer.childNodes[range.startOffset - 1];
    }
    if (child) {
      if (child.nodeType === 3 /* Node.TEXT_NODE */ && isEmptyTextNode(child)) {
        debug('removing left-hand side `previousSibling` empty TextNode');
        child.parentNode.removeChild(child);
      } else if (child.nodeType === 1 /* Node.ELEMENT_NODE */ && child.nodeName === left.nodeName && isEmptyElement(child)) {
        debug('removing left-hand side `previousSibling` empty Element %o', child);
        child.parentNode.removeChild(child);
      }
    }
  }

  return fragment;
}
