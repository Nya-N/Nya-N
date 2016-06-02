(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (plugin) {
  /* istanbul ignore next: differing implementations */
  if (typeof module !== 'undefined' && module !== null && module.exports) {
    module.exports = plugin
  } else if (typeof define === 'function' && define.amd) {
    define(['mithril'], plugin)
  } else if (typeof window !== 'undefined') {
    plugin(m)
  }
})(function MithrilValidator (m) {
  if (m.validator) {
    return m
  }

  /**
   * Validates mithril models and objects through validation functions
   * mapped to specific model properties.
   *
   * Example
   *
   *     Validator({
   *       name: function (name) {
   *         if (!name) {
   *           return "Name is required."
   *         }
   *       }
   *     }).validate({})
   *
   * @param  {Object} validations Map consisting of model properties to validation functions
   *
   * @return {Validator}
   */
  function Validator (validations) {
    this.errors = {}
    this.validations = validations
  }

  /**
   * Returns length of error map
   *
   * @return {Number}
   */
  Validator.prototype.hasErrors = function () {
    return Object.keys(this.errors).length
  }

  /**
   * Returns the element associated with the specified key
   *
   * @param  {String}  key
   * @return {Boolean}
   */
  Validator.prototype.hasError = function (key) {
    return this.errors[key]
  }

  /**
   * Removes all of the elements from the error list
   */
  Validator.prototype.clearErrors = function () {
    this.errors = {}
  }

  /**
   * Validates the specified model against the validations mapping in this instance.
   *
   * Each (shallow) property is iterated over and cross-checked against the given model for value,
   * then the validation function is invoked passing the model as context and value as the first argument.
   *
   * On a truthy result from a validation function the result is placed on the error object with the
   * property name as the identifier.
   *
   * @param  {Object} model       Key-value map of property to `m.prop` values
   *
   * @return {Validator}
   */
  Validator.prototype.validate = function (model) {
    var self = this

    this.clearErrors()

    Object.keys(this.validations).forEach(function (key, index) {
      validator = self.validations[key]
      value = model[key] ? (typeof model[key] === 'function' ? model[key]() : model[key]) : undefined
      result = validator.bind(model)(value)

      if (result) {
        self.errors[key] = result
      }
    })

    return this
  }

  // Export
  m.validator = Validator

  // Return patched mithril
  return m
})
},{}],2:[function(require,module,exports){
;(function (global, factory) { // eslint-disable-line
	"use strict"
	/* eslint-disable no-undef */
	var m = factory(global)
	if (typeof module === "object" && module != null && module.exports) {
		module.exports = m
	} else if (typeof define === "function" && define.amd) {
		define(function () { return m })
	} else {
		global.m = m
	}
	/* eslint-enable no-undef */
})(typeof window !== "undefined" ? window : this, function (global, undefined) { // eslint-disable-line
	"use strict"

	m.version = function () {
		return "v0.2.3"
	}

	var hasOwn = {}.hasOwnProperty
	var type = {}.toString

	function isFunction(object) {
		return typeof object === "function"
	}

	function isObject(object) {
		return type.call(object) === "[object Object]"
	}

	function isString(object) {
		return type.call(object) === "[object String]"
	}

	var isArray = Array.isArray || function (object) {
		return type.call(object) === "[object Array]"
	}

	function noop() {}

	var voidElements = {
		AREA: 1,
		BASE: 1,
		BR: 1,
		COL: 1,
		COMMAND: 1,
		EMBED: 1,
		HR: 1,
		IMG: 1,
		INPUT: 1,
		KEYGEN: 1,
		LINK: 1,
		META: 1,
		PARAM: 1,
		SOURCE: 1,
		TRACK: 1,
		WBR: 1
	}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame

	// self invoking function needed because of the way mocks work
	function initialize(mock) {
		$document = mock.document
		$location = mock.location
		$cancelAnimationFrame = mock.cancelAnimationFrame || mock.clearTimeout
		$requestAnimationFrame = mock.requestAnimationFrame || mock.setTimeout
	}

	// testing API
	m.deps = function (mock) {
		initialize(global = mock || window)
		return global
	}

	m.deps(global)

	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	function parseTagAttrs(cell, tag) {
		var classes = []
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g
		var match

		while ((match = parser.exec(tag))) {
			if (match[1] === "" && match[2]) {
				cell.tag = match[2]
			} else if (match[1] === "#") {
				cell.attrs.id = match[2]
			} else if (match[1] === ".") {
				classes.push(match[2])
			} else if (match[3][0] === "[") {
				var pair = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/.exec(match[3])
				cell.attrs[pair[1]] = pair[3] || ""
			}
		}

		return classes
	}

	function getVirtualChildren(args, hasAttrs) {
		var children = hasAttrs ? args.slice(1) : args

		if (children.length === 1 && isArray(children[0])) {
			return children[0]
		} else {
			return children
		}
	}

	function assignAttrs(target, attrs, classes) {
		var classAttr = "class" in attrs ? "class" : "className"

		for (var attrName in attrs) {
			if (hasOwn.call(attrs, attrName)) {
				if (attrName === classAttr &&
						attrs[attrName] != null &&
						attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					// create key in correct iteration order
					target[attrName] = ""
				} else {
					target[attrName] = attrs[attrName]
				}
			}
		}

		if (classes.length) target[classAttr] = classes.join(" ")
	}

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array,
	 *                      or splat (optional)
	 */
	function m(tag, pairs) {
		var args = []

		for (var i = 1, length = arguments.length; i < length; i++) {
			args[i - 1] = arguments[i]
		}

		if (isObject(tag)) return parameterize(tag, args)

		if (!isString(tag)) {
			throw new Error("selector in m(selector, attrs, children) should " +
				"be a string")
		}

		var hasAttrs = pairs != null && isObject(pairs) &&
			!("tag" in pairs || "view" in pairs || "subtree" in pairs)

		var attrs = hasAttrs ? pairs : {}
		var cell = {
			tag: "div",
			attrs: {},
			children: getVirtualChildren(args, hasAttrs)
		}

		assignAttrs(cell.attrs, attrs, parseTagAttrs(cell, tag))
		return cell
	}

	function forEach(list, f) {
		for (var i = 0; i < list.length && !f(list[i], i++);) {
			// function called in condition
		}
	}

	function forKeys(list, f) {
		forEach(list, function (attrs, i) {
			return (attrs = attrs && attrs.attrs) &&
				attrs.key != null &&
				f(attrs, i)
		})
	}
	// This function was causing deopts in Chrome.
	function dataToString(data) {
		// data.toString() might throw or return null if data is the return
		// value of Console.log in some versions of Firefox (behavior depends on
		// version)
		try {
			if (data != null && data.toString() != null) return data
		} catch (e) {
			// silently ignore errors
		}
		return ""
	}

	// This function was causing deopts in Chrome.
	function injectTextNode(parentElement, first, index, data) {
		try {
			insertNode(parentElement, first, index)
			first.nodeValue = data
		} catch (e) {
			// IE erroneously throws error when appending an empty text node
			// after a null
		}
	}

	function flatten(list) {
		// recursively flatten array
		for (var i = 0; i < list.length; i++) {
			if (isArray(list[i])) {
				list = list.concat.apply([], list)
				// check current index again and flatten until there are no more
				// nested arrays at that index
				i--
			}
		}
		return list
	}

	function insertNode(parentElement, node, index) {
		parentElement.insertBefore(node,
			parentElement.childNodes[index] || null)
	}

	var DELETION = 1
	var INSERTION = 2
	var MOVE = 3

	function handleKeysDiffer(data, existing, cached, parentElement) {
		forKeys(data, function (key, i) {
			existing[key = key.key] = existing[key] ? {
				action: MOVE,
				index: i,
				from: existing[key].index,
				element: cached.nodes[existing[key].index] ||
					$document.createElement("div")
			} : {action: INSERTION, index: i}
		})

		var actions = []
		for (var prop in existing) {
			if (hasOwn.call(existing, prop)) {
				actions.push(existing[prop])
			}
		}

		var changes = actions.sort(sortChanges)
		var newCached = new Array(cached.length)

		newCached.nodes = cached.nodes.slice()

		forEach(changes, function (change) {
			var index = change.index
			if (change.action === DELETION) {
				clear(cached[index].nodes, cached[index])
				newCached.splice(index, 1)
			}
			if (change.action === INSERTION) {
				var dummy = $document.createElement("div")
				dummy.key = data[index].attrs.key
				insertNode(parentElement, dummy, index)
				newCached.splice(index, 0, {
					attrs: {key: data[index].attrs.key},
					nodes: [dummy]
				})
				newCached.nodes[index] = dummy
			}

			if (change.action === MOVE) {
				var changeElement = change.element
				var maybeChanged = parentElement.childNodes[index]
				if (maybeChanged !== changeElement && changeElement !== null) {
					parentElement.insertBefore(changeElement,
						maybeChanged || null)
				}
				newCached[index] = cached[change.from]
				newCached.nodes[index] = changeElement
			}
		})

		return newCached
	}

	function diffKeys(data, cached, existing, parentElement) {
		var keysDiffer = data.length !== cached.length

		if (!keysDiffer) {
			forKeys(data, function (attrs, i) {
				var cachedCell = cached[i]
				return keysDiffer = cachedCell &&
					cachedCell.attrs &&
					cachedCell.attrs.key !== attrs.key
			})
		}

		if (keysDiffer) {
			return handleKeysDiffer(data, existing, cached, parentElement)
		} else {
			return cached
		}
	}

	function diffArray(data, cached, nodes) {
		// diff the array itself

		// update the list of DOM nodes by collecting the nodes from each item
		forEach(data, function (_, i) {
			if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
		})
		// remove items from the end of the array if the new array is shorter
		// than the old one. if errors ever happen here, the issue is most
		// likely a bug in the construction of the `cached` data structure
		// somewhere earlier in the program
		forEach(cached.nodes, function (node, i) {
			if (node.parentNode != null && nodes.indexOf(node) < 0) {
				clear([node], [cached[i]])
			}
		})

		if (data.length < cached.length) cached.length = data.length
		cached.nodes = nodes
	}

	function buildArrayKeys(data) {
		var guid = 0
		forKeys(data, function () {
			forEach(data, function (attrs) {
				if ((attrs = attrs && attrs.attrs) && attrs.key == null) {
					attrs.key = "__mithril__" + guid++
				}
			})
			return 1
		})
	}

	function isDifferentEnough(data, cached, dataAttrKeys) {
		if (data.tag !== cached.tag) return true

		if (dataAttrKeys.sort().join() !==
				Object.keys(cached.attrs).sort().join()) {
			return true
		}

		if (data.attrs.id !== cached.attrs.id) {
			return true
		}

		if (data.attrs.key !== cached.attrs.key) {
			return true
		}

		if (m.redraw.strategy() === "all") {
			return !cached.configContext || cached.configContext.retain !== true
		}

		if (m.redraw.strategy() === "diff") {
			return cached.configContext && cached.configContext.retain === false
		}

		return false
	}

	function maybeRecreateObject(data, cached, dataAttrKeys) {
		// if an element is different enough from the one in cache, recreate it
		if (isDifferentEnough(data, cached, dataAttrKeys)) {
			if (cached.nodes.length) clear(cached.nodes)

			if (cached.configContext &&
					isFunction(cached.configContext.onunload)) {
				cached.configContext.onunload()
			}

			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (controller.onunload) {
						controller.onunload({preventDefault: noop})
					}
				})
			}
		}
	}

	function getObjectNamespace(data, namespace) {
		if (data.attrs.xmlns) return data.attrs.xmlns
		if (data.tag === "svg") return "http://www.w3.org/2000/svg"
		if (data.tag === "math") return "http://www.w3.org/1998/Math/MathML"
		return namespace
	}

	var pendingRequests = 0
	m.startComputation = function () { pendingRequests++ }
	m.endComputation = function () {
		if (pendingRequests > 1) {
			pendingRequests--
		} else {
			pendingRequests = 0
			m.redraw()
		}
	}

	function unloadCachedControllers(cached, views, controllers) {
		if (controllers.length) {
			cached.views = views
			cached.controllers = controllers
			forEach(controllers, function (controller) {
				if (controller.onunload && controller.onunload.$old) {
					controller.onunload = controller.onunload.$old
				}

				if (pendingRequests && controller.onunload) {
					var onunload = controller.onunload
					controller.onunload = noop
					controller.onunload.$old = onunload
				}
			})
		}
	}

	function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
		// schedule configs to be called. They are called after `build` finishes
		// running
		if (isFunction(data.attrs.config)) {
			var context = cached.configContext = cached.configContext || {}

			// bind
			configs.push(function () {
				return data.attrs.config.call(data, node, !isNew, context,
					cached)
			})
		}
	}

	function buildUpdatedNode(
		cached,
		data,
		editable,
		hasKeys,
		namespace,
		views,
		configs,
		controllers
	) {
		var node = cached.nodes[0]

		if (hasKeys) {
			setAttributes(node, data.tag, data.attrs, cached.attrs, namespace)
		}

		cached.children = build(
			node,
			data.tag,
			undefined,
			undefined,
			data.children,
			cached.children,
			false,
			0,
			data.attrs.contenteditable ? node : editable,
			namespace,
			configs
		)

		cached.nodes.intact = true

		if (controllers.length) {
			cached.views = views
			cached.controllers = controllers
		}

		return node
	}

	function handleNonexistentNodes(data, parentElement, index) {
		var nodes
		if (data.$trusted) {
			nodes = injectHTML(parentElement, index, data)
		} else {
			nodes = [$document.createTextNode(data)]
			if (!(parentElement.nodeName in voidElements)) {
				insertNode(parentElement, nodes[0], index)
			}
		}

		var cached

		if (typeof data === "string" ||
				typeof data === "number" ||
				typeof data === "boolean") {
			cached = new data.constructor(data)
		} else {
			cached = data
		}

		cached.nodes = nodes
		return cached
	}

	function reattachNodes(
		data,
		cached,
		parentElement,
		editable,
		index,
		parentTag
	) {
		var nodes = cached.nodes
		if (!editable || editable !== $document.activeElement) {
			if (data.$trusted) {
				clear(nodes, cached)
				nodes = injectHTML(parentElement, index, data)
			} else if (parentTag === "textarea") {
				// <textarea> uses `value` instead of `nodeValue`.
				parentElement.value = data
			} else if (editable) {
				// contenteditable nodes use `innerHTML` instead of `nodeValue`.
				editable.innerHTML = data
			} else {
				// was a trusted string
				if (nodes[0].nodeType === 1 || nodes.length > 1 ||
						(nodes[0].nodeValue.trim &&
							!nodes[0].nodeValue.trim())) {
					clear(cached.nodes, cached)
					nodes = [$document.createTextNode(data)]
				}

				injectTextNode(parentElement, nodes[0], index, data)
			}
		}
		cached = new data.constructor(data)
		cached.nodes = nodes
		return cached
	}

	function handleTextNode(
		cached,
		data,
		index,
		parentElement,
		shouldReattach,
		editable,
		parentTag
	) {
		if (!cached.nodes.length) {
			return handleNonexistentNodes(data, parentElement, index)
		} else if (cached.valueOf() !== data.valueOf() || shouldReattach) {
			return reattachNodes(data, cached, parentElement, editable, index,
				parentTag)
		} else {
			return (cached.nodes.intact = true, cached)
		}
	}

	function getSubArrayCount(item) {
		if (item.$trusted) {
			// fix offset of next element if item was a trusted string w/ more
			// than one html element
			// the first clause in the regexp matches elements
			// the second clause (after the pipe) matches text nodes
			var match = item.match(/<[^\/]|\>\s*[^<]/g)
			if (match != null) return match.length
		} else if (isArray(item)) {
			return item.length
		}
		return 1
	}

	function buildArray(
		data,
		cached,
		parentElement,
		index,
		parentTag,
		shouldReattach,
		editable,
		namespace,
		configs
	) {
		data = flatten(data)
		var nodes = []
		var intact = cached.length === data.length
		var subArrayCount = 0

		// keys algorithm: sort elements without recreating them if keys are
		// present
		//
		// 1) create a map of all existing keys, and mark all for deletion
		// 2) add new keys to map and mark them for addition
		// 3) if key exists in new list, change action from deletion to a move
		// 4) for each key, handle its corresponding action as marked in
		//    previous steps

		var existing = {}
		var shouldMaintainIdentities = false

		forKeys(cached, function (attrs, i) {
			shouldMaintainIdentities = true
			existing[cached[i].attrs.key] = {action: DELETION, index: i}
		})

		buildArrayKeys(data)
		if (shouldMaintainIdentities) {
			cached = diffKeys(data, cached, existing, parentElement)
		}
		// end key algorithm

		var cacheCount = 0
		// faster explicitly written
		for (var i = 0, len = data.length; i < len; i++) {
			// diff each item in the array
			var item = build(
				parentElement,
				parentTag,
				cached,
				index,
				data[i],
				cached[cacheCount],
				shouldReattach,
				index + subArrayCount || subArrayCount,
				editable,
				namespace,
				configs)

			if (item !== undefined) {
				intact = intact && item.nodes.intact
				subArrayCount += getSubArrayCount(item)
				cached[cacheCount++] = item
			}
		}

		if (!intact) diffArray(data, cached, nodes)
		return cached
	}

	function makeCache(data, cached, index, parentIndex, parentCache) {
		if (cached != null) {
			if (type.call(cached) === type.call(data)) return cached

			if (parentCache && parentCache.nodes) {
				var offset = index - parentIndex
				var end = offset + (isArray(data) ? data : cached.nodes).length
				clear(
					parentCache.nodes.slice(offset, end),
					parentCache.slice(offset, end))
			} else if (cached.nodes) {
				clear(cached.nodes, cached)
			}
		}

		cached = new data.constructor()
		// if constructor creates a virtual dom element, use a blank object as
		// the base cached node instead of copying the virtual el (#277)
		if (cached.tag) cached = {}
		cached.nodes = []
		return cached
	}

	function constructNode(data, namespace) {
		if (data.attrs.is) {
			if (namespace == null) {
				return $document.createElement(data.tag, data.attrs.is)
			} else {
				return $document.createElementNS(namespace, data.tag,
					data.attrs.is)
			}
		} else if (namespace == null) {
			return $document.createElement(data.tag)
		} else {
			return $document.createElementNS(namespace, data.tag)
		}
	}

	function constructAttrs(data, node, namespace, hasKeys) {
		if (hasKeys) {
			return setAttributes(node, data.tag, data.attrs, {}, namespace)
		} else {
			return data.attrs
		}
	}

	function constructChildren(
		data,
		node,
		cached,
		editable,
		namespace,
		configs
	) {
		if (data.children != null && data.children.length > 0) {
			return build(
				node,
				data.tag,
				undefined,
				undefined,
				data.children,
				cached.children,
				true,
				0,
				data.attrs.contenteditable ? node : editable,
				namespace,
				configs)
		} else {
			return data.children
		}
	}

	function reconstructCached(
		data,
		attrs,
		children,
		node,
		namespace,
		views,
		controllers
	) {
		var cached = {
			tag: data.tag,
			attrs: attrs,
			children: children,
			nodes: [node]
		}

		unloadCachedControllers(cached, views, controllers)

		if (cached.children && !cached.children.nodes) {
			cached.children.nodes = []
		}

		// edge case: setting value on <select> doesn't work before children
		// exist, so set it again after children have been created
		if (data.tag === "select" && "value" in data.attrs) {
			setAttributes(node, data.tag, {value: data.attrs.value}, {},
				namespace)
		}

		return cached
	}

	function getController(views, view, cachedControllers, controller) {
		var controllerIndex

		if (m.redraw.strategy() === "diff" && views) {
			controllerIndex = views.indexOf(view)
		} else {
			controllerIndex = -1
		}

		if (controllerIndex > -1) {
			return cachedControllers[controllerIndex]
		} else if (isFunction(controller)) {
			return new controller()
		} else {
			return {}
		}
	}

	var unloaders = []

	function updateLists(views, controllers, view, controller) {
		if (controller.onunload != null &&
				unloaders.map(function (u) { return u.handler })
					.indexOf(controller.onunload) < 0) {
			unloaders.push({
				controller: controller,
				handler: controller.onunload
			})
		}

		views.push(view)
		controllers.push(controller)
	}

	var forcing = false
	function checkView(
		data,
		view,
		cached,
		cachedControllers,
		controllers,
		views
	) {
		var controller = getController(
			cached.views,
			view,
			cachedControllers,
			data.controller)

		var key = data && data.attrs && data.attrs.key

		if (pendingRequests === 0 ||
				forcing ||
				cachedControllers &&
					cachedControllers.indexOf(controller) > -1) {
			data = data.view(controller)
		} else {
			data = {tag: "placeholder"}
		}

		if (data.subtree === "retain") return data
		data.attrs = data.attrs || {}
		data.attrs.key = key
		updateLists(views, controllers, view, controller)
		return data
	}

	function markViews(data, cached, views, controllers) {
		var cachedControllers = cached && cached.controllers

		while (data.view != null) {
			data = checkView(
				data,
				data.view.$original || data.view,
				cached,
				cachedControllers,
				controllers,
				views)
		}

		return data
	}

	function buildObject( // eslint-disable-line max-statements
		data,
		cached,
		editable,
		parentElement,
		index,
		shouldReattach,
		namespace,
		configs
	) {
		var views = []
		var controllers = []

		data = markViews(data, cached, views, controllers)

		if (data.subtree === "retain") return cached

		if (!data.tag && controllers.length) {
			throw new Error("Component template must return a virtual " +
				"element, not an array, string, etc.")
		}

		data.attrs = data.attrs || {}
		cached.attrs = cached.attrs || {}

		var dataAttrKeys = Object.keys(data.attrs)
		var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)

		maybeRecreateObject(data, cached, dataAttrKeys)

		if (!isString(data.tag)) return

		var isNew = cached.nodes.length === 0

		namespace = getObjectNamespace(data, namespace)

		var node
		if (isNew) {
			node = constructNode(data, namespace)
			// set attributes first, then create children
			var attrs = constructAttrs(data, node, namespace, hasKeys)

			var children = constructChildren(data, node, cached, editable,
				namespace, configs)

			cached = reconstructCached(
				data,
				attrs,
				children,
				node,
				namespace,
				views,
				controllers)
		} else {
			node = buildUpdatedNode(
				cached,
				data,
				editable,
				hasKeys,
				namespace,
				views,
				configs,
				controllers)
		}

		if (isNew || shouldReattach === true && node != null) {
			insertNode(parentElement, node, index)
		}

		// The configs are called after `build` finishes running
		scheduleConfigsToBeCalled(configs, data, node, isNew, cached)

		return cached
	}

	function build(
		parentElement,
		parentTag,
		parentCache,
		parentIndex,
		data,
		cached,
		shouldReattach,
		index,
		editable,
		namespace,
		configs
	) {
		/*
		 * `build` is a recursive function that manages creation/diffing/removal
		 * of DOM elements based on comparison between `data` and `cached` the
		 * diff algorithm can be summarized as this:
		 *
		 * 1 - compare `data` and `cached`
		 * 2 - if they are different, copy `data` to `cached` and update the DOM
		 *     based on what the difference is
		 * 3 - recursively apply this algorithm for every array and for the
		 *     children of every virtual element
		 *
		 * The `cached` data structure is essentially the same as the previous
		 * redraw's `data` data structure, with a few additions:
		 * - `cached` always has a property called `nodes`, which is a list of
		 *    DOM elements that correspond to the data represented by the
		 *    respective virtual element
		 * - in order to support attaching `nodes` as a property of `cached`,
		 *    `cached` is *always* a non-primitive object, i.e. if the data was
		 *    a string, then cached is a String instance. If data was `null` or
		 *    `undefined`, cached is `new String("")`
		 * - `cached also has a `configContext` property, which is the state
		 *    storage object exposed by config(element, isInitialized, context)
		 * - when `cached` is an Object, it represents a virtual element; when
		 *    it's an Array, it represents a list of elements; when it's a
		 *    String, Number or Boolean, it represents a text node
		 *
		 * `parentElement` is a DOM element used for W3C DOM API calls
		 * `parentTag` is only used for handling a corner case for textarea
		 * values
		 * `parentCache` is used to remove nodes in some multi-node cases
		 * `parentIndex` and `index` are used to figure out the offset of nodes.
		 * They're artifacts from before arrays started being flattened and are
		 * likely refactorable
		 * `data` and `cached` are, respectively, the new and old nodes being
		 * diffed
		 * `shouldReattach` is a flag indicating whether a parent node was
		 * recreated (if so, and if this node is reused, then this node must
		 * reattach itself to the new parent)
		 * `editable` is a flag that indicates whether an ancestor is
		 * contenteditable
		 * `namespace` indicates the closest HTML namespace as it cascades down
		 * from an ancestor
		 * `configs` is a list of config functions to run after the topmost
		 * `build` call finishes running
		 *
		 * there's logic that relies on the assumption that null and undefined
		 * data are equivalent to empty strings
		 * - this prevents lifecycle surprises from procedural helpers that mix
		 *   implicit and explicit return statements (e.g.
		 *   function foo() {if (cond) return m("div")}
		 * - it simplifies diffing code
		 */
		data = dataToString(data)
		if (data.subtree === "retain") return cached
		cached = makeCache(data, cached, index, parentIndex, parentCache)

		if (isArray(data)) {
			return buildArray(
				data,
				cached,
				parentElement,
				index,
				parentTag,
				shouldReattach,
				editable,
				namespace,
				configs)
		} else if (data != null && isObject(data)) {
			return buildObject(
				data,
				cached,
				editable,
				parentElement,
				index,
				shouldReattach,
				namespace,
				configs)
		} else if (!isFunction(data)) {
			return handleTextNode(
				cached,
				data,
				index,
				parentElement,
				shouldReattach,
				editable,
				parentTag)
		} else {
			return cached
		}
	}

	function sortChanges(a, b) {
		return a.action - b.action || a.index - b.index
	}

	function copyStyleAttrs(node, dataAttr, cachedAttr) {
		for (var rule in dataAttr) {
			if (hasOwn.call(dataAttr, rule)) {
				if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) {
					node.style[rule] = dataAttr[rule]
				}
			}
		}

		for (rule in cachedAttr) {
			if (hasOwn.call(cachedAttr, rule)) {
				if (!hasOwn.call(dataAttr, rule)) node.style[rule] = ""
			}
		}
	}

	var shouldUseSetAttribute = {
		list: 1,
		style: 1,
		form: 1,
		type: 1,
		width: 1,
		height: 1
	}

	function setSingleAttr(
		node,
		attrName,
		dataAttr,
		cachedAttr,
		tag,
		namespace
	) {
		if (attrName === "config" || attrName === "key") {
			// `config` isn't a real attribute, so ignore it
			return true
		} else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
			// hook event handlers to the auto-redrawing system
			node[attrName] = autoredraw(dataAttr, node)
		} else if (attrName === "style" && dataAttr != null &&
				isObject(dataAttr)) {
			// handle `style: {...}`
			copyStyleAttrs(node, dataAttr, cachedAttr)
		} else if (namespace != null) {
			// handle SVG
			if (attrName === "href") {
				node.setAttributeNS("http://www.w3.org/1999/xlink",
					"href", dataAttr)
			} else {
				node.setAttribute(
					attrName === "className" ? "class" : attrName,
					dataAttr)
			}
		} else if (attrName in node && !shouldUseSetAttribute[attrName]) {
			// handle cases that are properties (but ignore cases where we
			// should use setAttribute instead)
			//
			// - list and form are typically used as strings, but are DOM
			//   element references in js
			//
			// - when using CSS selectors (e.g. `m("[style='']")`), style is
			//   used as a string, but it's an object in js
			//
			// #348 don't set the value if not needed - otherwise, cursor
			// placement breaks in Chrome
			try {
				if (tag !== "input" || node[attrName] !== dataAttr) {
					node[attrName] = dataAttr
				}
			} catch (e) {
				node.setAttribute(attrName, dataAttr)
			}
		}
		else node.setAttribute(attrName, dataAttr)
	}

	function trySetAttr(
		node,
		attrName,
		dataAttr,
		cachedAttr,
		cachedAttrs,
		tag,
		namespace
	) {
		if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
			cachedAttrs[attrName] = dataAttr
			try {
				return setSingleAttr(
					node,
					attrName,
					dataAttr,
					cachedAttr,
					tag,
					namespace)
			} catch (e) {
				// swallow IE's invalid argument errors to mimic HTML's
				// fallback-to-doing-nothing-on-invalid-attributes behavior
				if (e.message.indexOf("Invalid argument") < 0) throw e
			}
		} else if (attrName === "value" && tag === "input" &&
				node.value !== dataAttr) {
			// #348 dataAttr may not be a string, so use loose comparison
			node.value = dataAttr
		}
	}

	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			if (hasOwn.call(dataAttrs, attrName)) {
				if (trySetAttr(
						node,
						attrName,
						dataAttrs[attrName],
						cachedAttrs[attrName],
						cachedAttrs,
						tag,
						namespace)) {
					continue
				}
			}
		}
		return cachedAttrs
	}

	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {
					nodes[i].parentNode.removeChild(nodes[i])
				} catch (e) {
					/* eslint-disable max-len */
					// ignore if this fails due to order of events (see
					// http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					/* eslint-enable max-len */
				}
				cached = [].concat(cached)
				if (cached[i]) unload(cached[i])
			}
		}
		// release memory if nodes is an array. This check should fail if nodes
		// is a NodeList (see loop above)
		if (nodes.length) {
			nodes.length = 0
		}
	}

	function unload(cached) {
		if (cached.configContext && isFunction(cached.configContext.onunload)) {
			cached.configContext.onunload()
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			forEach(cached.controllers, function (controller) {
				if (isFunction(controller.onunload)) {
					controller.onunload({preventDefault: noop})
				}
			})
		}
		if (cached.children) {
			if (isArray(cached.children)) forEach(cached.children, unload)
			else if (cached.children.tag) unload(cached.children)
		}
	}

	function appendTextFragment(parentElement, data) {
		try {
			parentElement.appendChild(
				$document.createRange().createContextualFragment(data))
		} catch (e) {
			parentElement.insertAdjacentHTML("beforeend", data)
		}
	}

	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index]
		if (nextSibling) {
			var isElement = nextSibling.nodeType !== 1
			var placeholder = $document.createElement("span")
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null)
				placeholder.insertAdjacentHTML("beforebegin", data)
				parentElement.removeChild(placeholder)
			} else {
				nextSibling.insertAdjacentHTML("beforebegin", data)
			}
		} else {
			appendTextFragment(parentElement, data)
		}

		var nodes = []

		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index])
			index++
		}

		return nodes
	}

	function autoredraw(callback, object) {
		return function (e) {
			e = e || event
			m.redraw.strategy("diff")
			m.startComputation()
			try {
				return callback.call(object, e)
			} finally {
				endFirstComputation()
			}
		}
	}

	var html
	var documentNode = {
		appendChild: function (node) {
			if (html === undefined) html = $document.createElement("html")
			if ($document.documentElement &&
					$document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			} else {
				$document.appendChild(node)
			}

			this.childNodes = $document.childNodes
		},

		insertBefore: function (node) {
			this.appendChild(node)
		},

		childNodes: []
	}

	var nodeCache = []
	var cellCache = {}

	m.render = function (root, cell, forceRecreation) {
		if (!root) {
			throw new Error("Ensure the DOM element being passed to " +
				"m.route/m.mount/m.render is not undefined.")
		}
		var configs = []
		var id = getCellCacheKey(root)
		var isDocumentRoot = root === $document
		var node

		if (isDocumentRoot || root === $document.documentElement) {
			node = documentNode
		} else {
			node = root
		}

		if (isDocumentRoot && cell.tag !== "html") {
			cell = {tag: "html", attrs: {}, children: cell}
		}

		if (cellCache[id] === undefined) clear(node.childNodes)
		if (forceRecreation === true) reset(root)

		cellCache[id] = build(
			node,
			null,
			undefined,
			undefined,
			cell,
			cellCache[id],
			false,
			0,
			null,
			undefined,
			configs)

		forEach(configs, function (config) { config() })
	}

	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element)
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function (value) {
		value = new String(value) // eslint-disable-line no-new-wrappers
		value.$trusted = true
		return value
	}

	function gettersetter(store) {
		function prop() {
			if (arguments.length) store = arguments[0]
			return store
		}

		prop.toJSON = function () {
			return store
		}

		return prop
	}

	m.prop = function (store) {
		if ((store != null && isObject(store) || isFunction(store)) &&
				isFunction(store.then)) {
			return propify(store)
		}

		return gettersetter(store)
	}

	var roots = []
	var components = []
	var controllers = []
	var lastRedrawId = null
	var lastRedrawCallTime = 0
	var computePreRedrawHook = null
	var computePostRedrawHook = null
	var topComponent
	var FRAME_BUDGET = 16 // 60 frames per second = 1 call per 16 ms

	function parameterize(component, args) {
		function controller() {
			/* eslint-disable no-invalid-this */
			return (component.controller || noop).apply(this, args) || this
			/* eslint-enable no-invalid-this */
		}

		if (component.controller) {
			controller.prototype = component.controller.prototype
		}

		function view(ctrl) {
			var currentArgs = [ctrl].concat(args)
			for (var i = 1; i < arguments.length; i++) {
				currentArgs.push(arguments[i])
			}

			return component.view.apply(component, currentArgs)
		}

		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}

	m.component = function (component) {
		var args = new Array(arguments.length - 1)

		for (var i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i]
		}

		return parameterize(component, args)
	}

	function checkPrevented(component, root, index, isPrevented) {
		if (!isPrevented) {
			m.redraw.strategy("all")
			m.startComputation()
			roots[index] = root
			var currentComponent

			if (component) {
				currentComponent = topComponent = component
			} else {
				currentComponent = topComponent = component = {controller: noop}
			}

			var controller = new (component.controller || noop)()

			// controllers may call m.mount recursively (via m.route redirects,
			// for example)
			// this conditional ensures only the last recursive m.mount call is
			// applied
			if (currentComponent === topComponent) {
				controllers[index] = controller
				components[index] = component
			}
			endFirstComputation()
			if (component === null) {
				removeRootElement(root, index)
			}
			return controllers[index]
		} else if (component == null) {
			removeRootElement(root, index)
		}
	}

	m.mount = m.module = function (root, component) {
		if (!root) {
			throw new Error("Please ensure the DOM element exists before " +
				"rendering a template into it.")
		}

		var index = roots.indexOf(root)
		if (index < 0) index = roots.length

		var isPrevented = false
		var event = {
			preventDefault: function () {
				isPrevented = true
				computePreRedrawHook = computePostRedrawHook = null
			}
		}

		forEach(unloaders, function (unloader) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		})

		if (isPrevented) {
			forEach(unloaders, function (unloader) {
				unloader.controller.onunload = unloader.handler
			})
		} else {
			unloaders = []
		}

		if (controllers[index] && isFunction(controllers[index].onunload)) {
			controllers[index].onunload(event)
		}

		return checkPrevented(component, root, index, isPrevented)
	}

	function removeRootElement(root, index) {
		roots.splice(index, 1)
		controllers.splice(index, 1)
		components.splice(index, 1)
		reset(root)
		nodeCache.splice(getCellCacheKey(root), 1)
	}

	var redrawing = false
	m.redraw = function (force) {
		if (redrawing) return
		redrawing = true
		if (force) forcing = true

		try {
			// lastRedrawId is a positive number if a second redraw is requested
			// before the next animation frame
			// lastRedrawId is null if it's the first redraw and not an event
			// handler
			if (lastRedrawId && !force) {
				// when setTimeout: only reschedule redraw if time between now
				// and previous redraw is bigger than a frame, otherwise keep
				// currently scheduled timeout
				// when rAF: always reschedule redraw
				if ($requestAnimationFrame === global.requestAnimationFrame ||
						new Date() - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId)
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
				}
			} else {
				redraw()
				lastRedrawId = $requestAnimationFrame(function () {
					lastRedrawId = null
				}, FRAME_BUDGET)
			}
		} finally {
			redrawing = forcing = false
		}
	}

	m.redraw.strategy = m.prop()
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		forEach(roots, function (root, i) {
			var component = components[i]
			if (controllers[i]) {
				var args = [controllers[i]]
				m.render(root,
					component.view ? component.view(controllers[i], args) : "")
			}
		})
		// after rendering within a routed context, we need to scroll back to
		// the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook()
			computePostRedrawHook = null
		}
		lastRedrawId = null
		lastRedrawCallTime = new Date()
		m.redraw.strategy("diff")
	}

	function endFirstComputation() {
		if (m.redraw.strategy() === "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		} else {
			m.endComputation()
		}
	}

	m.withAttr = function (prop, withAttrCallback, callbackThis) {
		return function (e) {
			e = e || window.event
			/* eslint-disable no-invalid-this */
			var currentTarget = e.currentTarget || this
			var _this = callbackThis || this
			/* eslint-enable no-invalid-this */
			var target = prop in currentTarget ?
				currentTarget[prop] :
				currentTarget.getAttribute(prop)
			withAttrCallback.call(_this, target)
		}
	}

	// routing
	var modes = {pathname: "", hash: "#", search: "?"}
	var redirect = noop
	var isDefaultRoute = false
	var routeParams, currentRoute

	m.route = function (root, arg1, arg2, vdom) { // eslint-disable-line
		// m.route()
		if (arguments.length === 0) return currentRoute
		// m.route(el, defaultRoute, routes)
		if (arguments.length === 3 && isString(arg1)) {
			redirect = function (source) {
				var path = currentRoute = normalizeRoute(source)
				if (!routeByValue(root, arg2, path)) {
					if (isDefaultRoute) {
						throw new Error("Ensure the default route matches " +
							"one of the routes defined in m.route")
					}

					isDefaultRoute = true
					m.route(arg1, true)
					isDefaultRoute = false
				}
			}

			var listener = m.route.mode === "hash" ?
				"onhashchange" :
				"onpopstate"

			global[listener] = function () {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute !== normalizeRoute(path)) redirect(path)
			}

			computePreRedrawHook = setScroll
			global[listener]()

			return
		}

		// config: m.route
		if (root.addEventListener || root.attachEvent) {
			var base = m.route.mode !== "pathname" ? $location.pathname : ""
			root.href = base + modes[m.route.mode] + vdom.attrs.href
			if (root.addEventListener) {
				root.removeEventListener("click", routeUnobtrusive)
				root.addEventListener("click", routeUnobtrusive)
			} else {
				root.detachEvent("onclick", routeUnobtrusive)
				root.attachEvent("onclick", routeUnobtrusive)
			}

			return
		}
		// m.route(route, params, shouldReplaceHistoryEntry)
		if (isString(root)) {
			var oldRoute = currentRoute
			currentRoute = root

			var args = arg1 || {}
			var queryIndex = currentRoute.indexOf("?")
			var params

			if (queryIndex > -1) {
				params = parseQueryString(currentRoute.slice(queryIndex + 1))
			} else {
				params = {}
			}

			for (var i in args) {
				if (hasOwn.call(args, i)) {
					params[i] = args[i]
				}
			}

			var querystring = buildQueryString(params)
			var currentPath

			if (queryIndex > -1) {
				currentPath = currentRoute.slice(0, queryIndex)
			} else {
				currentPath = currentRoute
			}

			if (querystring) {
				currentRoute = currentPath +
					(currentPath.indexOf("?") === -1 ? "?" : "&") +
					querystring
			}

			var replaceHistory =
				(arguments.length === 3 ? arg2 : arg1) === true ||
				oldRoute === root

			if (global.history.pushState) {
				var method = replaceHistory ? "replaceState" : "pushState"
				computePreRedrawHook = setScroll
				computePostRedrawHook = function () {
					global.history[method](null, $document.title,
						modes[m.route.mode] + currentRoute)
				}
				redirect(modes[m.route.mode] + currentRoute)
			} else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	}

	m.route.param = function (key) {
		if (!routeParams) {
			throw new Error("You must call m.route(element, defaultRoute, " +
				"routes) before calling m.route.param()")
		}

		if (!key) {
			return routeParams
		}

		return routeParams[key]
	}

	m.route.mode = "search"

	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}

	function routeByValue(root, router, path) {
		routeParams = {}

		var queryStart = path.indexOf("?")
		if (queryStart !== -1) {
			routeParams = parseQueryString(
				path.substr(queryStart + 1, path.length))
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router)
		var index = keys.indexOf(path)

		if (index !== -1){
			m.mount(root, router[keys [index]])
			return true
		}

		for (var route in router) {
			if (hasOwn.call(router, route)) {
				if (route === path) {
					m.mount(root, router[route])
					return true
				}

				var matcher = new RegExp("^" + route
					.replace(/:[^\/]+?\.{3}/g, "(.*?)")
					.replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")

				if (matcher.test(path)) {
					/* eslint-disable no-loop-func */
					path.replace(matcher, function () {
						var keys = route.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						forEach(keys, function (key, i) {
							routeParams[key.replace(/:|\./g, "")] =
								decodeURIComponent(values[i])
						})
						m.mount(root, router[route])
					})
					/* eslint-enable no-loop-func */
					return true
				}
			}
		}
	}

	function routeUnobtrusive(e) {
		e = e || event
		if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return

		if (e.preventDefault) {
			e.preventDefault()
		} else {
			e.returnValue = false
		}

		var currentTarget = e.currentTarget || e.srcElement
		var args

		if (m.route.mode === "pathname" && currentTarget.search) {
			args = parseQueryString(currentTarget.search.slice(1))
		} else {
			args = {}
		}

		while (currentTarget && !/a/i.test(currentTarget.nodeName)) {
			currentTarget = currentTarget.parentNode
		}

		// clear pendingRequests because we want an immediate route change
		pendingRequests = 0
		m.route(currentTarget[m.route.mode]
			.slice(modes[m.route.mode].length), args)
	}

	function setScroll() {
		if (m.route.mode !== "hash" && $location.hash) {
			$location.hash = $location.hash
		} else {
			global.scrollTo(0, 0)
		}
	}

	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []

		for (var prop in object) {
			if (hasOwn.call(object, prop)) {
				var key = prefix ? prefix + "[" + prop + "]" : prop
				var value = object[prop]

				if (value === null) {
					str.push(encodeURIComponent(key))
				} else if (isObject(value)) {
					str.push(buildQueryString(value, key))
				} else if (isArray(value)) {
					var keys = []
					duplicates[key] = duplicates[key] || {}
					/* eslint-disable no-loop-func */
					forEach(value, function (item) {
						/* eslint-enable no-loop-func */
						if (!duplicates[key][item]) {
							duplicates[key][item] = true
							keys.push(encodeURIComponent(key) + "=" +
								encodeURIComponent(item))
						}
					})
					str.push(keys.join("&"))
				} else if (value !== undefined) {
					str.push(encodeURIComponent(key) + "=" +
						encodeURIComponent(value))
				}
			}
		}

		return str.join("&")
	}

	function parseQueryString(str) {
		if (str === "" || str == null) return {}
		if (str.charAt(0) === "?") str = str.slice(1)

		var pairs = str.split("&")
		var params = {}

		forEach(pairs, function (string) {
			var pair = string.split("=")
			var key = decodeURIComponent(pair[0])
			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (!isArray(params[key])) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		})

		return params
	}

	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString

	function reset(root) {
		var cacheKey = getCellCacheKey(root)
		clear(root.childNodes, cellCache[cacheKey])
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred()
		deferred.promise = propify(deferred.promise)
		return deferred
	}

	function propify(promise, initialValue) {
		var prop = m.prop(initialValue)
		promise.then(prop)
		prop.then = function (resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		}

		prop.catch = prop.then.bind(null, null)
		return prop
	}
	// Promiz.mithril.js | Zolmeister | MIT
	// a modified version of Promiz.js, which does not conform to Promises/A+
	// for two reasons:
	//
	// 1) `then` callbacks are called synchronously (because setTimeout is too
	//    slow, and the setImmediate polyfill is too big
	//
	// 2) throwing subclasses of Error cause the error to be bubbled up instead
	//    of triggering rejection (because the spec does not account for the
	//    important use case of default browser error handling, i.e. message w/
	//    line number)

	var RESOLVING = 1
	var REJECTING = 2
	var RESOLVED = 3
	var REJECTED = 4

	function Deferred(onSuccess, onFailure) {
		var self = this
		var state = 0
		var promiseValue = 0
		var next = []

		self.promise = {}

		self.resolve = function (value) {
			if (!state) {
				promiseValue = value
				state = RESOLVING

				fire()
			}

			return self
		}

		self.reject = function (value) {
			if (!state) {
				promiseValue = value
				state = REJECTING

				fire()
			}

			return self
		}

		self.promise.then = function (onSuccess, onFailure) {
			var deferred = new Deferred(onSuccess, onFailure)

			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			} else if (state === REJECTED) {
				deferred.reject(promiseValue)
			} else {
				next.push(deferred)
			}

			return deferred.promise
		}

		function finish(type) {
			state = type || REJECTED
			next.map(function (deferred) {
				if (state === RESOLVED) {
					deferred.resolve(promiseValue)
				} else {
					deferred.reject(promiseValue)
				}
			})
		}

		function thennable(then, success, failure, notThennable) {
			if (((promiseValue != null && isObject(promiseValue)) ||
					isFunction(promiseValue)) && isFunction(then)) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0
					then.call(promiseValue, function (value) {
						if (count++) return
						promiseValue = value
						success()
					}, function (value) {
						if (count++) return
						promiseValue = value
						failure()
					})
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					failure()
				}
			} else {
				notThennable()
			}
		}

		function fire() {
			// check if it's a thenable
			var then
			try {
				then = promiseValue && promiseValue.then
			} catch (e) {
				m.deferred.onerror(e)
				promiseValue = e
				state = REJECTING
				return fire()
			}

			if (state === REJECTING) {
				m.deferred.onerror(promiseValue)
			}

			thennable(then, function () {
				state = RESOLVING
				fire()
			}, function () {
				state = REJECTING
				fire()
			}, function () {
				try {
					if (state === RESOLVING && isFunction(onSuccess)) {
						promiseValue = onSuccess(promiseValue)
					} else if (state === REJECTING && isFunction(onFailure)) {
						promiseValue = onFailure(promiseValue)
						state = RESOLVING
					}
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError()
					finish()
				} else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}

	m.deferred.onerror = function (e) {
		if (type.call(e) === "[object Error]" &&
				!/ Error/.test(e.constructor.toString())) {
			pendingRequests = 0
			throw e
		}
	}

	m.sync = function (args) {
		var deferred = m.deferred()
		var outstanding = args.length
		var results = []
		var method = "resolve"

		function synchronizer(pos, resolved) {
			return function (value) {
				results[pos] = value
				if (!resolved) method = "reject"
				if (--outstanding === 0) {
					deferred.promise(results)
					deferred[method](results)
				}
				return value
			}
		}

		if (args.length > 0) {
			forEach(args, function (arg, i) {
				arg.then(synchronizer(i, true), synchronizer(i, false))
			})
		} else {
			deferred.resolve([])
		}

		return deferred.promise
	}

	function identity(value) { return value }

	function handleJsonp(options) {
		var callbackKey = "mithril_callback_" +
			new Date().getTime() + "_" +
			(Math.round(Math.random() * 1e16)).toString(36)

		var script = $document.createElement("script")

		global[callbackKey] = function (resp) {
			script.parentNode.removeChild(script)
			options.onload({
				type: "load",
				target: {
					responseText: resp
				}
			})
			global[callbackKey] = undefined
		}

		script.onerror = function () {
			script.parentNode.removeChild(script)

			options.onerror({
				type: "error",
				target: {
					status: 500,
					responseText: JSON.stringify({
						error: "Error making jsonp request"
					})
				}
			})
			global[callbackKey] = undefined

			return false
		}

		script.onload = function () {
			return false
		}

		script.src = options.url +
			(options.url.indexOf("?") > 0 ? "&" : "?") +
			(options.callbackKey ? options.callbackKey : "callback") +
			"=" + callbackKey +
			"&" + buildQueryString(options.data || {})

		$document.body.appendChild(script)
	}

	function createXhr(options) {
		var xhr = new global.XMLHttpRequest()
		xhr.open(options.method, options.url, true, options.user,
			options.password)

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					options.onload({type: "load", target: xhr})
				} else {
					options.onerror({type: "error", target: xhr})
				}
			}
		}

		if (options.serialize === JSON.stringify &&
				options.data &&
				options.method !== "GET") {
			xhr.setRequestHeader("Content-Type",
				"application/json; charset=utf-8")
		}

		if (options.deserialize === JSON.parse) {
			xhr.setRequestHeader("Accept", "application/json, text/*")
		}

		if (isFunction(options.config)) {
			var maybeXhr = options.config(xhr, options)
			if (maybeXhr != null) xhr = maybeXhr
		}

		var data = options.method === "GET" || !options.data ? "" : options.data

		if (data && !isString(data) && data.constructor !== global.FormData) {
			throw new Error("Request data should be either be a string or " +
				"FormData. Check the `serialize` option in `m.request`")
		}

		xhr.send(data)
		return xhr
	}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			return handleJsonp(options)
		} else {
			return createXhr(options)
		}
	}

	function bindData(options, data, serialize) {
		if (options.method === "GET" && options.dataType !== "jsonp") {
			var prefix = options.url.indexOf("?") < 0 ? "?" : "&"
			var querystring = buildQueryString(data)
			options.url += (querystring ? prefix + querystring : "")
		} else {
			options.data = serialize(data)
		}
	}

	function parameterizeUrl(url, data) {
		if (data) {
			url = url.replace(/:[a-z]\w+/gi, function (token){
				var key = token.slice(1)
				var value = data[key]
				delete data[key]
				return value
			})
		}
		return url
	}

	m.request = function (options) {
		if (options.background !== true) m.startComputation()
		var deferred = new Deferred()
		var isJSONP = options.dataType &&
			options.dataType.toLowerCase() === "jsonp"

		var serialize, deserialize, extract

		if (isJSONP) {
			serialize = options.serialize =
			deserialize = options.deserialize = identity

			extract = function (jsonp) { return jsonp.responseText }
		} else {
			serialize = options.serialize = options.serialize || JSON.stringify

			deserialize = options.deserialize =
				options.deserialize || JSON.parse
			extract = options.extract || function (xhr) {
				if (xhr.responseText.length || deserialize !== JSON.parse) {
					return xhr.responseText
				} else {
					return null
				}
			}
		}

		options.method = (options.method || "GET").toUpperCase()
		options.url = parameterizeUrl(options.url, options.data)
		bindData(options, options.data, serialize)
		options.onload = options.onerror = function (ev) {
			try {
				ev = ev || event
				var response = deserialize(extract(ev.target, options))
				if (ev.type === "load") {
					if (options.unwrapSuccess) {
						response = options.unwrapSuccess(response, ev.target)
					}

					if (isArray(response) && options.type) {
						forEach(response, function (res, i) {
							response[i] = new options.type(res)
						})
					} else if (options.type) {
						response = new options.type(response)
					}

					deferred.resolve(response)
				} else {
					if (options.unwrapError) {
						response = options.unwrapError(response, ev.target)
					}

					deferred.reject(response)
				}
			} catch (e) {
				deferred.reject(e)
				m.deferred.onerror(e)
			} finally {
				if (options.background !== true) m.endComputation()
			}
		}

		ajax(options)
		deferred.promise = propify(deferred.promise, options.initialValue)
		return deferred.promise
	}

	return m
}); // eslint-disable-line

},{}],3:[function(require,module,exports){
'use strict';

var m = require('./mithril');

// TOPページ
var Top = require('./component/top.js');

// イベント作成ページ
var EventCreate = require('./component/event/create.js');
// イベント一覧ページ
var EventList = require('./component/event/list.js');
// イベント詳細ページ
var EventDetail = require('./component/event/detail.js');
// イベント編集ページ
var EventEdit = require('./component/event/edit.js');





m.route.mode = "hash";

//HTML要素にコンポーネントをマウント
m.route(document.getElementById("root"), "/", {
	"/": Top,
	"/event/detail/:id": EventDetail,
	"/event/create": EventCreate,
	"/event/edit/:id": EventEdit,
	"/event": EventList,
});

},{"./component/event/create.js":5,"./component/event/detail.js":6,"./component/event/edit.js":7,"./component/event/list.js":8,"./component/top.js":12,"./mithril":13}],4:[function(require,module,exports){
/* global $ */
'use strict';

/*
 * エラーが発生した時のモーダル コンポーネント
 */

// error_code => エラーメッセージ
var error_code_to_message = {
	1:   "アプリケーションが更新されました。ブラウザのリロードをおねがいします。",
	100: "満員になってしまいました。"
};

var m = require('../mithril');

module.exports = {
	// ErrorCode を ViewModelに引き渡すメソッド
	handleErrorToViewModel: function(vm) {
		// TODO: vm の型チェック

		return function(ErrorObject) {
			// ViewModel にエラーコードを保存
			vm.error_code = Number(ErrorObject.message);
		};
	},
	controller: function(vm) {
		// 呼び出し元のViewModel
		this.vm = vm;
	},
	view: function(ctrl, vm) {
		// エラーコードがセットされていればエラーモーダルを表示する
		if(ctrl.vm.error_code) {
			$('#ErrorModal').modal('show');
		}

		return {tag: "div", attrs: {id:"ErrorModal", class:"modal fade", role:"dialog"}, children: [
			/* BEGIN: エラーの表示モーダル */
			{tag: "div", attrs: {class:"modal-dialog"}, children: [

				{tag: "div", attrs: {class:"modal-content"}, children: [
					{tag: "div", attrs: {class:"modal-header"}, children: [
						/* 閉じるボタン */
						{tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal"}, children: ["×"]}, 
						{tag: "h4", attrs: {}, children: ["エラー"]}
					]}, 
					{tag: "div", attrs: {class:"modal-body"}, children: [
						/* エラーメッセージ */
						 vm.error_code in error_code_to_message ? error_code_to_message[vm.error_code] : "エラーが発生しました。エラーコード: " + vm.error_code
					]}, 
					{tag: "div", attrs: {class:"modal-footer"}, children: [
						{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-info", "data-dismiss":"modal"}, children: ["閉じる"]}
					]}
				]}
			]}
			/* END: エラーの表示モーダル */
		]};
	}
};

},{"../mithril":13}],5:[function(require,module,exports){
/* global $ */
'use strict';

/*
 * ATND イベント作成ページ
 *
 */

var m = require('../../mithril');

// アプリケーションの状態
var state = require('../../state');

// navbar
var Navbar = require('../navbar');

// form input
var FormInputComponent = require('../form/input');

// form textarea
var FormTextAreaComponent = require('../form/textarea');




module.exports = {
	controller: function() {
		var self = this;
		// ViewModel
		self.vm = state.make_event_create();

		self.validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "イベント名を入力してください";
				}
				if(name.length > 50) {
					return "イベント名は50文字以内でお願いします";
				}
			},
			admin: function (admin) {
				if (!admin.name()) {
					return "主催者を入力してください";
				}
				if(admin.name().length > 20) {
					return "主催者は20文字以内でお願いします";
				}
			},
			start_date: function (start_date) {
				if (!start_date) {
					return "日時を入力してください";
				}
			},
			capacity: function (capacity) {
				if (!capacity) {
					return "定員を入力してください";
				}
				if (!capacity.toString().match(/^[0-9]+$/)) {
					return "定員を半角数字で入力してください";
				}

			},
			place: function (place) {
				if (!place.name()) {
					return "場所を入力してください";
				}
				if(place.name().length > 50) {
					return "場所は50文字以内でお願いします";
				}
			},
			description: function (description) {
				if (!description) {
					return "詳細を入力してください";
				}
				if(description.length > 5000) {
					return "詳細は5000文字以内でお願いします";
				}
			},
		});

		// イベント作成ボタンの確認が押下された時
		self.onconfirm = function(e) {
			// 入力値チェック
			self.validator.validate(self.vm.model);

			if (self.validator.hasErrors()) {
				return;
			}

			// 確認画面モーダルを表示
			$('#ConfirmModal').modal('show');

		};
		// イベント作成ボタンが押下された時
		self.onsubmit = function(e) {
			// イベント登録
			self.vm.model.save()
			.then(function(id) {
				// TODO: イベント一覧をクリア

				// 入力された内容をクリア
				self.vm.clear();

				// イベント詳細画面に遷移
				m.route('/event/detail/' + id);
			});
		};
	},
	view: function(ctrl) {
		var model = ctrl.vm.model;

		return {tag: "div", attrs: {}, children: [
			/*navbar*/
			{tag: "div", attrs: {}, children: [ m.component(Navbar) ]}, 

			{tag: "div", attrs: {class:"container", style:"padding-top:30px", id:"root"}, children: [
				{tag: "h1", attrs: {}, children: ["イベントを新規作成"]}, 

			/* イベント登録フォーム */
			{tag: "form", attrs: {}, children: [
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventName"}, children: ["イベント名"]}, 
					 m.component(FormInputComponent, {
						prop:  ctrl.vm.model.name,
						error: ctrl.validator.hasError('name'),
						placeholder: "イベント名",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventAdmin"}, children: ["主催者"]}, 
					 m.component(FormInputComponent, {
						prop:  ctrl.vm.model.admin.name,
						error: ctrl.validator.hasError('admin'),
						placeholder: "主催者",
					}) 

				]}, 

				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventDate"}, children: ["日時"]}, 
					 m.component(FormInputComponent, {
						prop:  ctrl.vm.model.start_date,
						error: ctrl.validator.hasError('start_date'),
						placeholder: "日時",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventCapacity"}, children: ["定員"]}, 
					 m.component(FormInputComponent, {
						prop:  ctrl.vm.model.capacity,
						error: ctrl.validator.hasError('capacity'),
						placeholder: "定員",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventPlace"}, children: ["開催場所"]}, 
					 m.component(FormInputComponent, {
						prop:  ctrl.vm.model.place.name,
						error: ctrl.validator.hasError('place'),
						placeholder: "開催場所",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventDetail"}, children: ["詳細"]}, 
					 m.component(FormTextAreaComponent, {
						prop:  ctrl.vm.model.description,
						error: ctrl.validator.hasError('description'),
						placeholder: "詳細",
						rows: 10,
					}) 

				]}, 

				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventImage"}, children: ["イベント画像"]}, 
					{tag: "input", attrs: {type:"file", id:"EventImage"}}, 
					{tag: "p", attrs: {class:"help-block"}, children: ["イベント画像をアップロードする"]}
				]}, 

				{tag: "div", attrs: {}, children: [
					{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", onclick: ctrl.onconfirm}, children: ["イベントを新規作成"]}
				]}, 

				/* BEGIN: 確認画面モーダル */
				{tag: "div", attrs: {id:"ConfirmModal", class:"modal fade", role:"dialog"}, children: [
					{tag: "div", attrs: {class:"modal-dialog"}, children: [

						{tag: "div", attrs: {class:"modal-content"}, children: [
							{tag: "div", attrs: {class:"modal-header"}, children: [
								/* 閉じるボタン */
								{tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal"}, children: ["×"]}, 
								{tag: "h4", attrs: {class:"modal-title"}, children: ["確認画面"]}
							]}, 
							{tag: "div", attrs: {class:"modal-body"}, children: [
								/* モーダル本文 */
								{tag: "form", attrs: {}, children: [
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["イベント名"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.name() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["主催者"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.admin.name() ]}
									]}, 

									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["日時"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.start_date() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["定員"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.capacity() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["開催場所"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.place.name() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["詳細"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ m.trust(model.description()) ]}
									]}
								]}
							]}, 
							{tag: "div", attrs: {class:"modal-footer"}, children: [
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", "data-dismiss":"modal", onclick:ctrl.onsubmit}, children: ["送信"]}, 
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-warning", "data-dismiss":"modal"}, children: ["修正"]}
							]}
						]}

					]}
				]}
				/* END: 確認画面モーダル */
			]}

			]}
		]};
	}
};

},{"../../mithril":13,"../../state":18,"../form/input":9,"../form/textarea":10,"../navbar":11}],6:[function(require,module,exports){
/* global $ */
'use strict';

/*
 * ATND イベント詳細ページ
 *
 */

var m = require('../../mithril');


// navbar
var NavbarComponent = require('../navbar');

// error
var ErrorComponent = require('../error');

// form input
var FormInputComponent = require('../form/input');

// form textarea
var FormTextAreaComponent = require('../form/textarea');




// アプリケーションの状態
var state = require('../../state');

module.exports = {
	controller: function() {
		var self = this;

		// イベントID
		self.id = m.route.param("id");

		// TODO: IDが存在しなかった場合のエラー処理

		// ViewModel
		self.vm = state.make_event_detail(self.id);

		// Validator
		self.comment_validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "名前を入力してください";
				}
				if(name.length > 20) {
					return "名前は20文字以内でお願いします";
				}
			},
			body: function (body) {
				if (!body) {
					return "コメントを入力してください";
				}
				if(body.length > 500) {
					return "コメントは500文字以内でお願いします";
				}
			}
		});
		self.join_validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "名前を入力してください";
				}
				if(name.length > 20) {
					return "名前は20文字以内でお願いします";
				}
			}
		});

		// コメントの追加ボタンが押下された時
		self.onsubmit_comment = function(e) {
			// 入力値チェック
			self.comment_validator.validate(self.vm.comment);

			if (self.comment_validator.hasErrors()) {
				return;
			}

			// event_id
			self.vm.comment.event_id(self.vm.model().id());

			// サーバーに保存
			self.vm.comment.save()
			.then(function(id) {
				// 生成されたコメントIDを保存
				self.vm.comment.id(id);

				// コメント一覧に新しく追加したコメントを移動
				self.vm.model().comments.push(self.vm.comment);

				// コメント件数を +1
				self.vm.model().comment_num(self.vm.model().comment_num() + 1);

				// コメント欄を空にする
				self.vm.clear_comment();
			});
		};

		// イベントに参加ボタンが押下された時
		self.onsubmit_join = function(e) {
			// 入力値チェック
			self.join_validator.validate(self.vm.join);

			if (self.join_validator.hasErrors()) {
				return;
			}

			// event_id
			self.vm.join.event_id(self.vm.model().id());

			// サーバーに保存
			self.vm.join.save()
			.then(function(id) {
				// 生成された参加IDを保存
				self.vm.join.id(id);

				// 参加者一覧に新しく参加した人を移動
				self.vm.model().members.push(self.vm.join);

				// 参加者数を +1
				self.vm.model().attend_num(self.vm.model().attend_num() + 1);

				// 参加者名の入力欄を空にする
				self.vm.clear_join();

				// モーダルを閉じる
				$('#AttendModal').modal('hide');
			}, ErrorComponent.handleErrorToViewModel(self.vm));
		};

		// イベントの削除の確認ボタンが押された時
		self.onconfirm_destroy = function(e) {
				// 確認モーダルを表示
				$('#DeleteModal').modal('show');
		};

		// イベントの削除ボタンが押された時
		self.onsubmit_destroy = function(e) {
				self.vm.model().destroy()
				.then(function() {
					// TODO: イベントリストのViewModelキャッシュを更新

					// イベント一覧に遷移
					m.route('/event');
				});
		};
		// イベントの編集ボタンが押された時
		self.onedit = function(e) {
			m.route('/event/edit/' + self.vm.model().id());
		};


		self.ondestroy_comment_function = function(model, i) {
			// コメントの削除ボタンが押された時
			return function(e) {
				// サーバー上から削除
				model.destroy()
				.then(function() {
					// コメント件数を -1
					self.vm.model().comment_num(self.vm.model().comment_num() - 1);

					// viewmodelからも削除
					self.vm.model().comments.splice(i, 1);
				});
			};
		};

		self.ondestroy_member_function = function(model, i) {
			// 参加者の削除ボタンが押された時
			return function(e) {
				// サーバー上から削除
				model.destroy()
				.then(function() {
					// 参加者件数を -1
					self.vm.model().attend_num(self.vm.model().attend_num() - 1);

					// viewmodelからも削除
					self.vm.model().members.splice(i, 1);
				});
			};
		};
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();
		// HTML
		return {tag: "div", attrs: {}, children: [
			/*navbar*/
			{tag: "div", attrs: {}, children: [ m.component(NavbarComponent) ]}, 

			{tag: "div", attrs: {class:"container", style:"padding-top:30px", id:"root"}, children: [
				{tag: "div", attrs: {class:"row"}, children: [
					{tag: "div", attrs: {class:"col-md-12"}, children: [
						/* イベント名 */
						{tag: "h1", attrs: {}, children: [model.name()]}
					]}
				]}, 

				{tag: "div", attrs: {class:"row"}, children: [
					/* BEGIN: 左本文 */
					{tag: "div", attrs: {class:"col-md-9"}, children: [
						/* TODO: イベント画像 */

						{tag: "table", attrs: {class:"table"}, children: [
							{tag: "tbody", attrs: {}, children: [
								{tag: "tr", attrs: {}, children: [
									{tag: "td", attrs: {}, children: ["日時"]}, 
									{tag: "td", attrs: {}, children: [ model.start_date() + "から"]}
								]}, 
								{tag: "tr", attrs: {}, children: [
									{tag: "td", attrs: {}, children: ["主催者"]}, 
									{tag: "td", attrs: {}, children: [model.admin.name()]}
								]}, 
								{tag: "tr", attrs: {}, children: [
									{tag: "td", attrs: {}, children: ["開催場所"]}, 
									{tag: "td", attrs: {}, children: [model.place.name()]}
								]}
							]}
						]}, 

						{tag: "div", attrs: {class:"panel panel-default"}, children: [
							{tag: "div", attrs: {class:"panel-body"}, children: [
								/* イベント詳細 */
								 m.trust(model.description()) 
							]}
						]}, 

						{tag: "div", attrs: {class:"panel panel-default"}, children: [
							{tag: "div", attrs: {class:"panel-heading"}, children: [
								/* コメント数 */
								"コメント一覧(",  model.comment_num(), ")"
							]}, 
							{tag: "div", attrs: {class:"panel-body"}, children: [
								/* コメント一覧 */
								
									model.comments.map(function(comment, i) {
										return {tag: "div", attrs: {}, children: [
											/* 削除ボタン */
											{tag: "div", attrs: {class:"pull-right", onclick: ctrl.ondestroy_comment_function(comment, i) }, children: [
												{tag: "span", attrs: {class:"glyphicon glyphicon-remove-sign"}}
											]}, 
											/* コメント投稿者 */
											 comment.name(), {tag: "br", attrs: {}}, 
											/* コメント本文 */
											 comment.body(), {tag: "hr", attrs: {}}
										]};
									}), 
								
								/* コメント投稿フォーム */
								{tag: "form", attrs: {}, children: [
									/* コメントの名前入力 */
									 m.component(FormInputComponent, {
										prop:  ctrl.vm.comment.name,
										error: ctrl.comment_validator.hasError('name'),
										placeholder: "名前",
									}), 
									/* コメントの内容入力 */
									 m.component(FormTextAreaComponent, {
										prop:  ctrl.vm.comment.body,
										error: ctrl.comment_validator.hasError('body'),
										placeholder: "コメント内容",
										rows: 4,
									}), 
									{tag: "div", attrs: {}, children: [
										{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", onclick:ctrl.onsubmit_comment}, children: ["コメントを投稿"]}
									]}
								]}
							]}
						]}
					]}, 
					/* END: 左本文 */

					/* BEGIN: 右サイドバー */
					{tag: "div", attrs: {class:"col-md-3"}, children: [
						{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", "data-toggle":"modal", "data-target":"#AttendModal"}, children: [
							"イベントに参加する"
						]}, 
						{tag: "h3", attrs: {}, children: ["参加人数 ", model.attend_num(), " / ", model.capacity()]}, 

						{tag: "div", attrs: {class:"panel panel-default"}, children: [
							{tag: "div", attrs: {class:"panel-heading"}, children: [
									/* 参加者数 */
									"参加者一覧"
							]}, 
							{tag: "div", attrs: {class:"panel-body"}, children: [
								/* 参加者が一人もいなければ"なし"と表示 */
								 model.members.length === 0 ? "なし" : "", 
								
									model.members.map(function(member, i) {
										return {tag: "span", attrs: {}, children: [
											/* 削除ボタン */
											{tag: "div", attrs: {class:"pull-right", onclick: ctrl.ondestroy_member_function(member, i) }, children: [
												{tag: "span", attrs: {class:"glyphicon glyphicon-remove-circle"}}
											]}, 

											 member.name(), " さん", {tag: "br", attrs: {}}
										]};
									})
								
							]}
						]}, 

						{tag: "button", attrs: {type:"button", class:"btn btn-sm btn-warning", onclick: ctrl.onedit}, children: ["イベントを編集"]}, 
						{tag: "button", attrs: {type:"button", class:"btn btn-sm btn-danger", onclick: ctrl.onconfirm_destroy}, children: ["イベントを削除"]}

					]}
					/* END: 右サイドバー */
				]}, 

				/* BEGIN: イベント参加 入力モーダル */
				{tag: "div", attrs: {id:"AttendModal", class:"modal fade", role:"dialog"}, children: [
					{tag: "div", attrs: {class:"modal-dialog"}, children: [

						{tag: "div", attrs: {class:"modal-content"}, children: [
							{tag: "div", attrs: {class:"modal-header"}, children: [
								/* 閉じるボタン */
								{tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal"}, children: ["×"]}, 
								{tag: "h4", attrs: {class:"modal-title"}, children: ["イベントに参加する"]}
							]}, 
							{tag: "div", attrs: {class:"modal-body"}, children: [
								/* イベント参加に必要な各入力項目 */
								{tag: "form", attrs: {}, children: [
									/* 名前入力 */
									{tag: "label", attrs: {}, children: ["名前"]}, 
									 m.component(FormInputComponent, {
										prop:  ctrl.vm.join.name,
										error: ctrl.join_validator.hasError('name'),
										placeholder: "名前",
									}) 
								]}
							]}, 
							{tag: "div", attrs: {class:"modal-footer"}, children: [
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", onclick: ctrl.onsubmit_join}, children: ["参加"]}, 
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-warning", "data-dismiss":"modal"}, children: ["閉じる"]}
							]}
						]}
					]}
				]}, 
				/* END: イベント参加 入力モーダル */

				/* BEGIN: イベント削除 確認モーダル */
				{tag: "div", attrs: {id:"DeleteModal", class:"modal fade", role:"dialog"}, children: [
					{tag: "div", attrs: {class:"modal-dialog"}, children: [

						{tag: "div", attrs: {class:"modal-content"}, children: [
							{tag: "div", attrs: {class:"modal-header"}, children: [
								/* 閉じるボタン */
								{tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal"}, children: ["×"]}, 
								{tag: "h4", attrs: {class:"modal-title"}, children: ["イベントを削除します"]}
							]}, 
							{tag: "div", attrs: {class:"modal-body"}, children: [
							"「",  model.name(), "」を削除します。", {tag: "br", attrs: {}}, 
							"本当によろしいですか？"
							]}, 
							{tag: "div", attrs: {class:"modal-footer"}, children: [
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-danger", "data-dismiss":"modal", onclick: ctrl.onsubmit_destroy}, children: ["削除"]}, 
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", "data-dismiss":"modal"}, children: ["閉じる"]}
							]}
						]}
					]}
				]}, 
				/* END: イベント参加 入力モーダル */


				/* エラーモーダル */
				 m.component(ErrorComponent, ctrl.vm) 
			]}
		]};
	}
};

},{"../../mithril":13,"../../state":18,"../error":4,"../form/input":9,"../form/textarea":10,"../navbar":11}],7:[function(require,module,exports){
/* global $ */
'use strict';

/*
 * ATND イベント作成ページ
 *
 */

var m = require('../../mithril');

// アプリケーションの状態
var state = require('../../state');

// navbar
var Navbar = require('../navbar');

// form input
var FormInputComponent = require('../form/input');

// form textarea
var FormTextAreaComponent = require('../form/textarea');




module.exports = {
	controller: function() {
		var self = this;

		// イベントID
		self.id = m.route.param("id");

		// TODO: IDが存在しなかった場合のエラー処理

		// ViewModel
		self.vm = state.make_event_detail(self.id);

		self.validator = new m.validator({
			name: function (name) {
				if (!name) {
					return "イベント名を入力してください";
				}
				if(name.length > 50) {
					return "イベント名は50文字以内でお願いします";
				}
			},
			admin: function (admin) {
				if (!admin.name()) {
					return "主催者を入力してください";
				}
				if(admin.name().length > 20) {
					return "主催者は20文字以内でお願いします";
				}
			},
			start_date: function (start_date) {
				if (!start_date) {
					return "日時を入力してください";
				}
			},
			capacity: function (capacity) {
				if (!capacity) {
					return "定員を入力してください";
				}
				if (!capacity.toString().match(/^[0-9]+$/)) {
					return "定員を半角数字で入力してください";
				}

			},
			place: function (place) {
				if (!place.name()) {
					return "場所を入力してください";
				}
				if(place.name().length > 50) {
					return "場所は50文字以内でお願いします";
				}
			},
			description: function (description) {
				if (!description) {
					return "詳細を入力してください";
				}
				if(description.length > 5000) {
					return "詳細は5000文字以内でお願いします";
				}
			},
		});

		// イベント作成ボタンの確認が押下された時
		self.onconfirm = function(e) {
			// 入力値チェック
			self.validator.validate(self.vm.model());

			if (self.validator.hasErrors()) {
				return;
			}

			// 確認画面モーダルを表示
			$('#ConfirmModal').modal('show');

		};
		// イベント作成ボタンが押下された時
		self.onsubmit = function(e) {
			// イベント登録
			self.vm.model().save()
			.then(function(id) {
				// TODO: イベント一覧をクリア

				// イベント詳細画面に遷移
				m.route('/event/detail/' + id);
			});
		};
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();

		return {tag: "div", attrs: {}, children: [
			/*navbar*/
			{tag: "div", attrs: {}, children: [ m.component(Navbar) ]}, 

			{tag: "div", attrs: {class:"container", style:"padding-top:30px", id:"root"}, children: [
				{tag: "h1", attrs: {}, children: ["イベント編集"]}, 

			/* イベント編集フォーム */
			{tag: "form", attrs: {}, children: [
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventName"}, children: ["イベント名"]}, 
					 m.component(FormInputComponent, {
						prop:  model.name,
						error: ctrl.validator.hasError('name'),
						placeholder: "イベント名",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventAdmin"}, children: ["主催者"]}, 
					 m.component(FormInputComponent, {
						prop:  model.admin.name,
						error: ctrl.validator.hasError('admin'),
						placeholder: "主催者",
					}) 

				]}, 

				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventDate"}, children: ["日時"]}, 
					 m.component(FormInputComponent, {
						prop:  model.start_date,
						error: ctrl.validator.hasError('start_date'),
						placeholder: "日時",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventCapacity"}, children: ["定員"]}, 
					 m.component(FormInputComponent, {
						prop:  model.capacity,
						error: ctrl.validator.hasError('capacity'),
						placeholder: "定員",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventPlace"}, children: ["開催場所"]}, 
					 m.component(FormInputComponent, {
						prop:  model.place.name,
						error: ctrl.validator.hasError('place'),
						placeholder: "開催場所",
					}) 

				]}, 
				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventDetail"}, children: ["詳細"]}, 
					 m.component(FormTextAreaComponent, {
						prop:  model.description,
						error: ctrl.validator.hasError('description'),
						placeholder: "詳細",
						rows: 10,
					}) 

				]}, 

				{tag: "div", attrs: {class:"form-group"}, children: [
					{tag: "label", attrs: {for:"EventImage"}, children: ["イベント画像"]}, 
					{tag: "input", attrs: {type:"file", id:"EventImage"}}, 
					{tag: "p", attrs: {class:"help-block"}, children: ["イベント画像をアップロードする"]}
				]}, 

				{tag: "div", attrs: {}, children: [
					{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", onclick: ctrl.onconfirm}, children: ["編集"]}
				]}, 

				/* BEGIN: 確認画面モーダル */
				{tag: "div", attrs: {id:"ConfirmModal", class:"modal fade", role:"dialog"}, children: [
					{tag: "div", attrs: {class:"modal-dialog"}, children: [

						{tag: "div", attrs: {class:"modal-content"}, children: [
							{tag: "div", attrs: {class:"modal-header"}, children: [
								/* 閉じるボタン */
								{tag: "button", attrs: {type:"button", class:"close", "data-dismiss":"modal"}, children: ["×"]}, 
								{tag: "h4", attrs: {class:"modal-title"}, children: ["確認画面"]}
							]}, 
							{tag: "div", attrs: {class:"modal-body"}, children: [
								/* モーダル本文 */
								{tag: "form", attrs: {}, children: [
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["イベント名"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.name() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["主催者"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.admin.name() ]}
									]}, 

									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["日時"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.start_date() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["定員"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.capacity() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["開催場所"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ model.place.name() ]}
									]}, 
									{tag: "div", attrs: {class:"form-group"}, children: [
										{tag: "label", attrs: {}, children: ["詳細"]}, 
										{tag: "div", attrs: {class:"form-control-static"}, children: [ m.trust(model.description()) ]}
									]}
								]}
							]}, 
							{tag: "div", attrs: {class:"modal-footer"}, children: [
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-success", "data-dismiss":"modal", onclick:ctrl.onsubmit}, children: ["送信"]}, 
								{tag: "button", attrs: {type:"button", class:"btn btn-lg btn-warning", "data-dismiss":"modal"}, children: ["修正"]}
							]}
						]}

					]}
				]}
				/* END: 確認画面モーダル */
			]}

			]}
		]};
	}
};

},{"../../mithril":13,"../../state":18,"../form/input":9,"../form/textarea":10,"../navbar":11}],8:[function(require,module,exports){
'use strict';

/*
 * ATND イベント一覧
 *
 */

// mithril
var m = require('../../mithril');

// アプリケーションの状態
var state = require('../../state');

// navbar
var Navbar = require('../navbar');

module.exports = {
	controller: function() {
		var p = m.route.param('p');

		// ViewModel
		this.vm = state.make_event_list(p);
	},
	view: function(ctrl) {
		var model = ctrl.vm.model();

		// 前へ
		var prev_id = model.prev_id;
		// 次へ
		var next_id = model.next_id;

		// イベント一覧
		var events = model.events;

		// HTML
		return {tag: "div", attrs: {}, children: [
			/*navbar*/
			{tag: "div", attrs: {}, children: [ m.component(Navbar) ]}, 

			{tag: "div", attrs: {class:"container", style:"padding-top:30px", id:"root"}, children: [
				
					events.map(function(event, i) {
						return {tag: "div", attrs: {class:"panel panel-default"}, children: [
							{tag: "div", attrs: {class:"panel-heading"}, children: [
								/* イベント名 */
								{tag: "a", attrs: {href:"/event/detail/" + event.id, config:m.route}, children: [ event.name]}
							]}, 
							{tag: "div", attrs: {class:"panel-body"}, children: [
								{tag: "div", attrs: {class:"pull-left"}, children: [
									/* イベント画像 */
									{tag: "img", attrs: {src: event.image_path, height:"150", width:"150"}}
								]}, 
								
									/* イベント詳細 */
									event.description
								
							]}, 
							{tag: "div", attrs: {class:"panel-footer"}, children: [
								{tag: "div", attrs: {class:"pull-right"}, children: [
									/* イベント開始時刻 */
									 event.start_date + "から"
								]}, 
								/* 参加人数／定員 */
								 event.attend_num + " / " + event.capacity + "人"
							]}
						]};

					}), 
				
				/* ページャー */
				{tag: "nav", attrs: {}, children: [
					{tag: "ul", attrs: {class:"pager"}, children: [
				  		/*<li class="previous disabled"><a href=""><span aria-hidden="true">&larr;</span> Older</a></li>*/
				  		{tag: "li", attrs: {class:"previous"}, children: [{tag: "a", attrs: {href:"/event?p=" + prev_id, config:m.route}, children: [{tag: "span", attrs: {"aria-hidden":"true"}, children: ["←"]}, " Older"]}]}, 
						{tag: "li", attrs: {class:"next"}, children: [{tag: "a", attrs: {href:"/event?p=" + next_id, config:m.route}, children: ["Newer ", {tag: "span", attrs: {"aria-hidden":"true"}, children: ["→"]}]}]}
				  	]}
				]}
			]}
		]};
	}
};

},{"../../mithril":13,"../../state":18,"../navbar":11}],9:[function(require,module,exports){
'use strict';

/*
 * input タグ
 *
 */

var m = require('../../mithril');

module.exports = {
	controller: function() {},
	view: function(ctrl, args) {
		// プロパティ
		var prop = args.prop;
		// エラーメッセージ
		var error = args.error;
		// placeholder
		var placeholder = args.placeholder;

		return {tag: "div", attrs: {class: error ? "form-group has-error has-feedback" : "form-group"}, children: [
			{tag: "input", attrs: {type:"text", class:"form-control", placeholder: placeholder, onchange:m.withAttr("value", prop), value: prop() }}, 
			 error ? {tag: "span", attrs: {class:"glyphicon glyphicon-remove form-control-feedback", "aria-hidden":"true"}} : "", 
			{tag: "span", attrs: {class:"help-block"}, children: [ error ]}
		]};
	}
};

},{"../../mithril":13}],10:[function(require,module,exports){
'use strict';

/*
 * textarea タグ
 *
 */

var m = require('../../mithril');

module.exports = {
	controller: function() {},
	view: function(ctrl, args) {
		// プロパティ
		var prop = args.prop;
		// エラーメッセージ
		var error = args.error;
		// placeholder
		var placeholder = args.placeholder;
		// rows
		var rows = args.rows || 4;


		return {tag: "div", attrs: {class: error ? "form-group has-error has-feedback" : "form-group"}, children: [
			{tag: "textarea", attrs: {class:"form-control", rows:rows, onchange:m.withAttr("value", prop), placeholder: placeholder }, children: [ prop() ]}, 
			 error ? {tag: "span", attrs: {class:"glyphicon glyphicon-remove form-control-feedback", "aria-hidden":"true"}} : "", 
			{tag: "span", attrs: {class:"help-block"}, children: [ error ]}
		]};
	}
};

},{"../../mithril":13}],11:[function(require,module,exports){
'use strict';
var m = require('../mithril');

module.exports = {
	controller: function() {},
	view: function(ctrl, args) {
		// 現在のURL
		var active_url = m.route();

		return {tag: "div", attrs: {}, children: [
			{tag: "nav", attrs: {class:"navbar navbar-default"}, children: [
				{tag: "div", attrs: {class:"container-fluid"}, children: [
					{tag: "div", attrs: {class:"navbar-header"}, children: [
						{tag: "button", attrs: {type:"button", class:"navbar-toggle collapsed", "data-toggle":"collapse", "data-target":"#bs-example-navbar-collapse-1", "aria-expanded":"false"}, children: [
							{tag: "span", attrs: {class:"sr-only"}, children: ["Toggle navigation"]}, 
							{tag: "span", attrs: {class:"icon-bar"}, children: [" "]}, 
							{tag: "span", attrs: {class:"icon-bar"}, children: [" "]}, 
							{tag: "span", attrs: {class:"icon-bar"}, children: [" "]}
						]}, 
						{tag: "span", attrs: {class:"navbar-brand"}, children: ["Go ATND"]}
					]}, 
					{tag: "div", attrs: {class:"collapse navbar-collapse", id:"bs-example-navbar-collapse-1"}, children: [
						{tag: "ul", attrs: {class:"nav navbar-nav"}, children: [
							{tag: "li", attrs: {class: active_url === "/" ? "active" : ""}, children: [{tag: "a", attrs: {href:"/", config:m.route}, children: ["TOP"]}]}, 
							{tag: "li", attrs: {class: active_url === "/event" ? "active" : ""}, children: [{tag: "a", attrs: {href:"/event", config:m.route}, children: ["イベント一覧"]}]}, 
							{tag: "li", attrs: {class: active_url === "/event/create" ? "active" : ""}, children: [{tag: "a", attrs: {href:"/event/create", config:m.route}, children: ["新しくイベントを作る"]}]}
						]}
					]}
				]}
			]}
		]};
	}
};

},{"../mithril":13}],12:[function(require,module,exports){
'use strict';

/*
 * ATND TOP
 *
 */

var m = require('../mithril');

// navbar
var Navbar = require('./navbar');


module.exports = {
	controller: function() {
	},
	view: function(ctrl) {
		return {tag: "div", attrs: {}, children: [
			/*navbar*/
			{tag: "div", attrs: {}, children: [ m.component(Navbar) ]}, 

			/*jumbotron*/
			{tag: "div", attrs: {class:"container", style:"padding-top:30px", id:"root"}, children: [
				{tag: "div", attrs: {class:"jumbotron", style:"background-color: rgba(255, 255, 255, 0.7);"}, children: [
					{tag: "div", attrs: {class:"container"}, children: [
						{tag: "h1", attrs: {}, children: ["Go ATND"]}, 
						{tag: "p", attrs: {}, children: [
							"イベントの告知・運営管理がすべて無料で出来ます。", {tag: "br", attrs: {}}, 
							"仲間内の飲み会から勉強会まで", {tag: "br", attrs: {}}, 
							"色んなイベントで色んな人に会いましょう。", {tag: "br", attrs: {}}
						]}, 
						{tag: "p", attrs: {}, children: [
							{tag: "a", attrs: {class:"btn btn-success btn-lg", href:"/event/create", config:m.route, role:"button"}, children: [
								{tag: "span", attrs: {class:"glyphicon glyphicon-log-in"}, children: ["　"]}, 
								"新しいイベントを作る"
							]}
						]}
					]}
				]}
			]}
		]};
	}
};

},{"../mithril":13,"./navbar":11}],13:[function(require,module,exports){
'use strict';

/*********************************************
 * mithril フレームワークを拡張する
 *********************************************/

// クライアントのバージョン番号
var version = 1;

var m = require('mithril');

/*********************************************
 * mithril-validator
 *********************************************/
require('mithril-validator')(m);

/*********************************************
 * m.request 拡張
 *********************************************/

// 上書き前の m.request
var request = m.request;

// node 環境では document にモックを指定
var document = (typeof window === 'object') ? window.document : { querySelectorAll: function(){ return []; }}; 

// サーバから取得したデータを parse する関数
var unwrapSuccess = function(res) {
	// status が success でなければ
	if(res.status !== 'success') {
		throw new Error(res.error_code);
	}

	// 新しいAPIのバージョンがリリースされてれば
	if(res.version > version) {
		// バージョンアップエラー番号
		throw new Error(1);
	}

	// response の中身がサーバから受け取るデータの本質
	return res.response;
};

// m.request を上書き
m.request = function(args) {
	// ローディング画面
	var loaders = document.querySelectorAll(".loader");

	// サーバと通信中はローディング画面を表示
	for (var i = 0; i < loaders.length; i++) {
		loaders[i].style.display = "block";
	}

	// サーバから取得したデータを parse
	if(!args.unwrapSuccess) {
		args.unwrapSuccess = unwrapSuccess;
	}

	return request(args)
	.then(function(value) {
		// 通信成功後はローディング画面を隠す
		for (var i = 0; i < loaders.length; i++) {
			loaders[i].style.display = "none";
		}
		return value;
	}, function(ErrorObject) {
		// 通信失敗時はローディング画面を隠す
		for (var i = 0; i < loaders.length; i++) {
			loaders[i].style.display = "none";
		}

		throw ErrorObject;
	});
};

module.exports = m;

},{"mithril":2,"mithril-validator":1}],14:[function(require,module,exports){
'use strict';

/*
 * イベントに付随するコメント モデル
 *
 */

// API URL
var api_url = "api/comment";


var m = require('../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	if( ! data) {
		data = {};
	}
	// コメントID
	this.id = m.prop(data.id);
	// イベントID
	this.event_id = m.prop(data.event_id);
	// コメントした人の名前
	this.name = m.prop(data.name || "");
	// コメント内容
	this.body = m.prop(data.body || "");
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + '/' + id,
		type: Model
	});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	return m.request({method: "POST", url: api_url, data: {
		event_id: this.event_id(),
		name:     this.name(),
		body:     this.body()
	}})
	.then(function(res) {
		// 生成されたコメントID
		return res.id;
	});
};

// サーバからJSONを破棄
Model.prototype.destroy = function () {
	return m.request({
		method: "DELETE",
		url: api_url + "/" + this.id(),
		data: {}
	});
};


module.exports = Model;


},{"../mithril":13}],15:[function(require,module,exports){
'use strict';

/*
 * イベント詳細 モデル
 *
 */

// API URL
var api_url = "api/event";


var m = require('../mithril');

// コメント モデル
var CommentModel = require('./comment');

// コメント モデル
var JoinModel = require('./join');



// コンストラクタ
var Model = function (data, isInitial) {
	var self = this;
	
	if( ! data) {
		data = {};
	}
	self.id          = m.prop(data.id);
	self.name        = m.prop(data.name        || "");
	self.place       = m.prop(data.place       || "");
	self.image_path  = m.prop(data.image_path);
	self.capacity    = m.prop(data.capacity    || "");
	self.attend_num  = m.prop(data.attend_num  || 0);
	self.start_date  = m.prop(data.start_date  || "");
	self.description = m.prop(data.description || "");
	self.comment_num = m.prop(data.comment_num || 0);

	// TODO: リファクタ
	// 主催者
	if(data.admin) {
		self.admin = {
			name:m.prop(data.admin.name),
		}
	} else {
		self.admin = {
			name:m.prop(""),
		}
	}
	//data.members.forEach(function(member) {
	//	if (member.status === 1) {
	//		self.admin = {name: m.prop(member.name)};
	//	} 
	//	
	//});

	// 場所
	if(data.place) {
		self.place = {
			name: m.prop(data.place),
		};
	}
	else {
		self.place = {
			name: m.prop(""),
		};
	}

	// 参加者一覧
	if(data.members) {
		self.members = [];
		data.members.forEach(function(member) {
			self.members.push(new JoinModel(member));
		});
	}
	
	// コメント一覧
	if(data.comments) {
		self.comments = [];
		data.comments.forEach(function(comment) {
			self.comments.push(new CommentModel(comment));
		});
	}
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + "/" + id,
		type: Model
	});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	var self = this;

	return m.request({method: "POST", url: api_url, data: {
		name:        self.name(),
		admin:       self.admin.name(),
		start_date:  self.start_date(),
		capacity:    Number(self.capacity()), // int
		place:       self.place.name(),
		description: self.description(),
		// TODO: image_path: self.image_path
	}})
	.then(function(res) {
		// 生成されたイベントID
		return res.id;
	});
};

// サーバからJSONを破棄
Model.prototype.destroy = function () {
	return m.request({
		method: "DELETE",
		url: api_url + "/" + this.id(),
		data: {}
	});
};

module.exports = Model;


},{"../mithril":13,"./comment":14,"./join":17}],16:[function(require,module,exports){
'use strict';

/*
 * イベント一覧 モデル
 *
 */

// API URL
var api_url = "api/event";


var m = require('../../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	this.p = m.prop(data.p);

	// 前へ
	this.prev_id = data.prev_id;
	// 次へ
	this.next_id = data.next_id;

	// イベント一覧
	this.events = data.events;
};

// サーバからJSONを読み込む
Model.read = function (p) {
	var url = api_url;

	if(p) {
		url += "?p=" + p;
	}

	return m.request({method: "GET", url: url, type: Model});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	return m.request({method: "POST", url: api_url, data: {

	}});
};

module.exports = Model;


},{"../../mithril":13}],17:[function(require,module,exports){
'use strict';

/*
 * イベントに付随する参加者 モデル
 *
 */

// API URL
var api_url = "api/join";


var m = require('../mithril');


// コンストラクタ
var Model = function (data, isInitial) {
	if( ! data) {
		data = {};
	}
	// JOIN ID
	this.id = m.prop(data.id);
	// イベントID
	this.event_id = m.prop(data.event_id);
	// 参加者の名前
	this.name = m.prop(data.name || "");
};

// サーバからJSONを読み込む
Model.read = function (id) {
	return m.request({
		method: "GET",
		url: api_url + '/' + id,
		type: Model
	});
};

// サーバにJSONを保存
Model.prototype.save = function () {
	return m.request({method: "POST", url: api_url, data: {
		event_id: this.event_id(),
		name:     this.name(),
	}})
	.then(function(res) {
		// 生成されたコメントID
		return res.id;
	});
};

// サーバからJSONを破棄
Model.prototype.destroy = function () {
	return m.request({
		method: "DELETE",
		url: api_url + "/" + this.id(),
		data: {}
	});
};

module.exports = Model;


},{"../mithril":13}],18:[function(require,module,exports){
'use strict';

/*
 * アプリケーションの状態を管理するクラス
 * ViewModel を生成する Singleton な Factory
 */

var m = require('./mithril');

// イベント一覧
var EventListViewModel = require('./viewmodel/event/list');

// イベント詳細
var EventDetailViewModel = require('./viewmodel/event/detail');

// イベント作成
var EventCreateViewModel = require('./viewmodel/event/create');

// コンストラクタ
var State = function() {
	// イベント一覧
	this.event_list = null;
	// イベント登録フォーム
	this.event_create = null;
	// イベント詳細
	this.event_detail = null;
};

// イベント一覧
State.prototype.make_event_list = function(p) {
	p = Number(p);
	// キャッシュしてた ViewModel と同じ p ならば使い回す
	if(this.event_list && p === this.event_list.model().p()) {
		return this.event_list;
	}

	this.event_list = new EventListViewModel(p);

	return this.event_list;
};

// イベント詳細
State.prototype.make_event_detail = function(id) {
	id = Number(id);
	// キャッシュしてた ViewModel と同じ id ならば使い回す
	if(this.event_detail && id === this.event_detail.model().id()) {
		return this.event_detail;
	}

	this.event_detail = new EventDetailViewModel(id);
	return this.event_detail;
};

// イベント作成
State.prototype.make_event_create = function() {
	if( ! this.event_create) {
		this.event_create = new EventCreateViewModel();
	}

	return this.event_create;
};

module.exports = new State();

},{"./mithril":13,"./viewmodel/event/create":19,"./viewmodel/event/detail":20,"./viewmodel/event/list":21}],19:[function(require,module,exports){
'use strict';

/*
 * ATND イベント作成 ViewModel
 *
 */


var m = require('../../mithril');

// イベント詳細 Model
var EventModel = require('../../model/event');


// ビューモデル
var ViewModel = function(id) {
	var self = this;

	// 入力したイベントデータ
	self.model = new EventModel();
};

// 入力されたイベントデータをクリア
ViewModel.prototype.clear = function() {
	var self = this;
	self.model = new EventModel();
};

module.exports = ViewModel;

},{"../../mithril":13,"../../model/event":15}],20:[function(require,module,exports){
'use strict';

/*
 * ATND イベント詳細 ViewModel
 *
 */


var m = require('../../mithril');

// イベント詳細 Model
var EventModel = require('../../model/event');

// コメントモデル
var CommentModel = require('../../model/comment');

// コメントモデル
var JoinModel = require('../../model/join');



// ビューモデル
var ViewModel = function(id) {
	var self = this;
	// イベント詳細 Model
	self.model = EventModel.read(id);

	// 入力したコメント
	self.comment = new CommentModel();

	// 入力した参加登録
	self.join = new JoinModel();

	// エラーが発生した時のエラーコード
	self.error_code = null;
};

// 入力されたコメントをクリア
ViewModel.prototype.clear_comment = function() {
	var self = this;
	self.comment = new CommentModel();
};

// 入力された参加登録をクリア
ViewModel.prototype.clear_join = function() {
	var self = this;
	self.join = new JoinModel();
};

module.exports = ViewModel;

},{"../../mithril":13,"../../model/comment":14,"../../model/event":15,"../../model/join":17}],21:[function(require,module,exports){
'use strict';

/*
 * ATND イベント一覧 ViewModel
 *
 */


var m = require('../../mithril');

var Model = require('../../model/event/list');

// ビューモデル
var ViewModel = function(p) {
	// モデル
	this.model = Model.read(p);
};

module.exports = ViewModel;

},{"../../mithril":13,"../../model/event/list":16}]},{},[3]);
