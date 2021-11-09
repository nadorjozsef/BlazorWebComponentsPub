/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./BlazorCustomElements.ts":
/*!*********************************!*\
  !*** ./BlazorCustomElements.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BlazorCustomElement\": () => (/* binding */ BlazorCustomElement)\n/* harmony export */ });\n// This function is called by the framework because RegisterAsCustomElement sets it as the initializer function\r\nwindow.registerBlazorCustomElement = function defaultRegisterCustomElement(elementName, parameters) {\r\n    customElements.define(elementName, class ConfiguredBlazorCustomElement extends BlazorCustomElement {\r\n        static get observedAttributes() {\r\n            return BlazorCustomElement.getObservedAttributes(parameters);\r\n        }\r\n        constructor() {\r\n            super(parameters);\r\n        }\r\n    });\r\n};\r\nclass BlazorCustomElement extends HTMLElement {\r\n    constructor(parameters) {\r\n        super();\r\n        this._parameterValues = {};\r\n        this._hasPendingSetParameters = true; // The constructor will call setParameters, so it starts true\r\n        this._isDisposed = false;\r\n        this.renderIntoElement = this;\r\n        // Keep track of how we'll map the attributes to parameters\r\n        this._attributeMappings = {};\r\n        parameters.forEach(parameter => {\r\n            const attributeName = dasherize(parameter.name);\r\n            this._attributeMappings[attributeName] = parameter;\r\n        });\r\n        // Defer until end of execution cycle so that (1) we know the heap is unlocked, and (2) the initial parameter\r\n        // values will be populated from the initial attributes before we send them to .NET\r\n        this._addRootComponentPromise = Promise.resolve().then(() => {\r\n            this._hasPendingSetParameters = false;\r\n            return Blazor.rootComponents.add(this.renderIntoElement, this.localName, this._parameterValues);\r\n        });\r\n        // Also allow assignment of parameters via properties. This is the only way to set complex-typed values.\r\n        for (const [attributeName, parameterInfo] of Object.entries(this._attributeMappings)) {\r\n            const dotNetName = parameterInfo.name;\r\n            Object.defineProperty(this, camelCase(dotNetName), {\r\n                get: () => this._parameterValues[dotNetName],\r\n                set: newValue => {\r\n                    if (this.hasAttribute(attributeName)) {\r\n                        // It's nice to keep the DOM in sync with the properties. This set a string representation\r\n                        // of the value, but this will get overwritten with the original typed value before we send it to .NET\r\n                        this.setAttribute(attributeName, newValue);\r\n                    }\r\n                    this._parameterValues[dotNetName] = newValue;\r\n                    this._supplyUpdatedParameters();\r\n                }\r\n            });\r\n        }\r\n    }\r\n    // Subclasses will need to call this if they want to retain the built-in behavior for knowing which\r\n    // attribute names to observe, since they have to return it from a static function\r\n    static getObservedAttributes(parameters) {\r\n        return parameters.map(p => dasherize(p.name));\r\n    }\r\n    connectedCallback() {\r\n        if (this._isDisposed) {\r\n            throw new Error(`Cannot connect component ${this.localName} to the document after it has been disposed.`);\r\n        }\r\n        clearTimeout(this._disposalTimeoutHandle);\r\n    }\r\n    disconnectedCallback() {\r\n        this._disposalTimeoutHandle = setTimeout(async () => {\r\n            this._isDisposed = true;\r\n            const rootComponent = await this._addRootComponentPromise;\r\n            rootComponent.dispose();\r\n        }, 1000);\r\n    }\r\n    attributeChangedCallback(name, oldValue, newValue) {\r\n        const parameterInfo = this._attributeMappings[name];\r\n        if (parameterInfo) {\r\n            this._parameterValues[parameterInfo.name] = BlazorCustomElement.parseAttributeValue(newValue, parameterInfo.type, parameterInfo.name);\r\n            this._supplyUpdatedParameters();\r\n        }\r\n    }\r\n    async _supplyUpdatedParameters() {\r\n        if (!this._hasPendingSetParameters) {\r\n            this._hasPendingSetParameters = true;\r\n            // Continuation from here will always be async, so at the earliest it will be at\r\n            // the end of the current JS execution cycle\r\n            const rootComponent = await this._addRootComponentPromise;\r\n            if (!this._isDisposed) {\r\n                const setParametersPromise = rootComponent.setParameters(this._parameterValues);\r\n                this._hasPendingSetParameters = false; // We just snapshotted _parameterValues, so we need to start allowing new calls in case it changes further\r\n                await setParametersPromise;\r\n            }\r\n        }\r\n    }\r\n    static parseAttributeValue(attributeValue, type, parameterName) {\r\n        switch (type) {\r\n            case 'string':\r\n                return attributeValue;\r\n            case 'boolean':\r\n                switch (attributeValue) {\r\n                    case 'true':\r\n                    case 'True':\r\n                        return true;\r\n                    case 'false':\r\n                    case 'False':\r\n                        return false;\r\n                    default:\r\n                        throw new Error(`Invalid boolean value '${attributeValue}' for parameter '${parameterName}'`);\r\n                }\r\n            case 'number':\r\n                const number = Number(attributeValue);\r\n                if (Number.isNaN(number)) {\r\n                    throw new Error(`Invalid number value '${attributeValue}' for parameter '${parameterName}'`);\r\n                }\r\n                else {\r\n                    return number;\r\n                }\r\n            case 'boolean?':\r\n                return attributeValue ? BlazorCustomElement.parseAttributeValue(attributeValue, 'boolean', parameterName) : null;\r\n            case 'number?':\r\n                return attributeValue ? BlazorCustomElement.parseAttributeValue(attributeValue, 'number', parameterName) : null;\r\n            case 'object':\r\n                throw new Error(`The parameter '${parameterName}' accepts a complex-typed object so it cannot be set using an attribute. Try setting it as a element property instead.`);\r\n            default:\r\n                throw new Error(`Unknown type '${type}' for parameter '${parameterName}'`);\r\n        }\r\n    }\r\n}\r\nfunction dasherize(value) {\r\n    return camelCase(value).replace(/([A-Z])/g, \"-$1\").toLowerCase();\r\n}\r\nfunction camelCase(value) {\r\n    return value[0].toLowerCase() + value.substr(1);\r\n}\r\n\n\n//# sourceURL=webpack:///./BlazorCustomElements.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./BlazorCustomElements.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;