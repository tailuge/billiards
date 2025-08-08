(()=>{var e={"./node_modules/cross-fetch/dist/browser-ponyfill.js":(e,i,r)=>{var n="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==r.g&&r.g,a=function(){function e(){this.fetch=!1,this.DOMException=n.DOMException}return e.prototype=n,new e}();!function(e){!function(i){var n=void 0!==e&&e||"undefined"!=typeof self&&self||void 0!==r.g&&r.g||{},a={searchParams:"URLSearchParams"in n,iterable:"Symbol"in n&&"iterator"in Symbol,blob:"FileReader"in n&&"Blob"in n&&function(){try{return new Blob,!0}catch(e){return!1}}(),formData:"FormData"in n,arrayBuffer:"ArrayBuffer"in n};if(a.arrayBuffer)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],o=ArrayBuffer.isView||function(e){return e&&s.indexOf(Object.prototype.toString.call(e))>-1};function l(e){if("string"!=typeof e&&(e=String(e)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e)||""===e)throw TypeError('Invalid character in header field name: "'+e+'"');return e.toLowerCase()}function c(e){return"string"!=typeof e&&(e=String(e)),e}function h(e){var i={next:function(){var i=e.shift();return{done:void 0===i,value:i}}};return a.iterable&&(i[Symbol.iterator]=function(){return i}),i}function u(e){this.map={},e instanceof u?e.forEach(function(e,i){this.append(i,e)},this):Array.isArray(e)?e.forEach(function(e){if(2!=e.length)throw TypeError("Headers constructor: expected name/value pair to be length 2, found"+e.length);this.append(e[0],e[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(i){this.append(i,e[i])},this)}function d(e){if(!e._noBody){if(e.bodyUsed)return Promise.reject(TypeError("Already read"));e.bodyUsed=!0}}function p(e){return new Promise(function(i,r){e.onload=function(){i(e.result)},e.onerror=function(){r(e.error)}})}function f(e){var i=new FileReader,r=p(i);return i.readAsArrayBuffer(e),r}function m(e){if(e.slice)return e.slice(0);var i=new Uint8Array(e.byteLength);return i.set(new Uint8Array(e)),i.buffer}function g(){return this.bodyUsed=!1,this._initBody=function(e){if(this.bodyUsed=this.bodyUsed,this._bodyInit=e,e)if("string"==typeof e)this._bodyText=e;else if(a.blob&&Blob.prototype.isPrototypeOf(e))this._bodyBlob=e;else if(a.formData&&FormData.prototype.isPrototypeOf(e))this._bodyFormData=e;else if(a.searchParams&&URLSearchParams.prototype.isPrototypeOf(e))this._bodyText=e.toString();else{var i;a.arrayBuffer&&a.blob&&(i=e)&&DataView.prototype.isPrototypeOf(i)?(this._bodyArrayBuffer=m(e.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):a.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(e)||o(e))?this._bodyArrayBuffer=m(e):this._bodyText=e=Object.prototype.toString.call(e)}else this._noBody=!0,this._bodyText="";!this.headers.get("content-type")&&("string"==typeof e?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):a.searchParams&&URLSearchParams.prototype.isPrototypeOf(e)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},a.blob&&(this.blob=function(){var e=d(this);if(e)return e;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(!this._bodyFormData)return Promise.resolve(new Blob([this._bodyText]));throw Error("could not read FormData body as blob")}),this.arrayBuffer=function(){if(this._bodyArrayBuffer){var e=d(this);return e||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}if(a.blob)return this.blob().then(f);throw Error("could not read as ArrayBuffer")},this.text=function(){var e,i,r,n,a,s=d(this);if(s)return s;if(this._bodyBlob)return e=this._bodyBlob,r=p(i=new FileReader),a=(n=/charset=([A-Za-z0-9_-]+)/.exec(e.type))?n[1]:"utf-8",i.readAsText(e,a),r;if(this._bodyArrayBuffer)return Promise.resolve(function(e){for(var i=new Uint8Array(e),r=Array(i.length),n=0;n<i.length;n++)r[n]=String.fromCharCode(i[n]);return r.join("")}(this._bodyArrayBuffer));if(!this._bodyFormData)return Promise.resolve(this._bodyText);throw Error("could not read FormData body as text")},a.formData&&(this.formData=function(){return this.text().then(y)}),this.json=function(){return this.text().then(JSON.parse)},this}u.prototype.append=function(e,i){e=l(e),i=c(i);var r=this.map[e];this.map[e]=r?r+", "+i:i},u.prototype.delete=function(e){delete this.map[l(e)]},u.prototype.get=function(e){return e=l(e),this.has(e)?this.map[e]:null},u.prototype.has=function(e){return this.map.hasOwnProperty(l(e))},u.prototype.set=function(e,i){this.map[l(e)]=c(i)},u.prototype.forEach=function(e,i){for(var r in this.map)this.map.hasOwnProperty(r)&&e.call(i,this.map[r],r,this)},u.prototype.keys=function(){var e=[];return this.forEach(function(i,r){e.push(r)}),h(e)},u.prototype.values=function(){var e=[];return this.forEach(function(i){e.push(i)}),h(e)},u.prototype.entries=function(){var e=[];return this.forEach(function(i,r){e.push([r,i])}),h(e)},a.iterable&&(u.prototype[Symbol.iterator]=u.prototype.entries);var v=["CONNECT","DELETE","GET","HEAD","OPTIONS","PATCH","POST","PUT","TRACE"];function _(e,i){if(!(this instanceof _))throw TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r,a,s=(i=i||{}).body;if(e instanceof _){if(e.bodyUsed)throw TypeError("Already read");this.url=e.url,this.credentials=e.credentials,i.headers||(this.headers=new u(e.headers)),this.method=e.method,this.mode=e.mode,this.signal=e.signal,s||null==e._bodyInit||(s=e._bodyInit,e.bodyUsed=!0)}else this.url=String(e);if(this.credentials=i.credentials||this.credentials||"same-origin",(i.headers||!this.headers)&&(this.headers=new u(i.headers)),this.method=(a=(r=i.method||this.method||"GET").toUpperCase(),v.indexOf(a)>-1?a:r),this.mode=i.mode||this.mode||null,this.signal=i.signal||this.signal||function(){if("AbortController"in n)return new AbortController().signal}(),this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&s)throw TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(s),("GET"===this.method||"HEAD"===this.method)&&("no-store"===i.cache||"no-cache"===i.cache)){var o=/([?&])_=[^&]*/;o.test(this.url)?this.url=this.url.replace(o,"$1_="+new Date().getTime()):this.url+=(/\?/.test(this.url)?"&":"?")+"_="+new Date().getTime()}}function y(e){var i=new FormData;return e.trim().split("&").forEach(function(e){if(e){var r=e.split("="),n=r.shift().replace(/\+/g," "),a=r.join("=").replace(/\+/g," ");i.append(decodeURIComponent(n),decodeURIComponent(a))}}),i}function x(e,i){if(!(this instanceof x))throw TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');if(i||(i={}),this.type="default",this.status=void 0===i.status?200:i.status,this.status<200||this.status>599)throw RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");this.ok=this.status>=200&&this.status<300,this.statusText=void 0===i.statusText?"":""+i.statusText,this.headers=new u(i.headers),this.url=i.url||"",this._initBody(e)}_.prototype.clone=function(){return new _(this,{body:this._bodyInit})},g.call(_.prototype),g.call(x.prototype),x.prototype.clone=function(){return new x(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new u(this.headers),url:this.url})},x.error=function(){var e=new x(null,{status:200,statusText:""});return e.ok=!1,e.status=0,e.type="error",e};var M=[301,302,303,307,308];x.redirect=function(e,i){if(-1===M.indexOf(i))throw RangeError("Invalid status code");return new x(null,{status:i,headers:{location:e}})},i.DOMException=n.DOMException;try{new i.DOMException}catch(e){i.DOMException=function(e,i){this.message=e,this.name=i;var r=Error(e);this.stack=r.stack},i.DOMException.prototype=Object.create(Error.prototype),i.DOMException.prototype.constructor=i.DOMException}function b(e,r){return new Promise(function(s,o){var h=new _(e,r);if(h.signal&&h.signal.aborted)return o(new i.DOMException("Aborted","AbortError"));var d=new XMLHttpRequest;function p(){d.abort()}if(d.onload=function(){var e,i,r={statusText:d.statusText,headers:(e=d.getAllResponseHeaders()||"",i=new u,e.replace(/\r?\n[\t ]+/g," ").split("\r").map(function(e){return 0===e.indexOf(`
`)?e.substr(1,e.length):e}).forEach(function(e){var r=e.split(":"),n=r.shift().trim();if(n){var a=r.join(":").trim();try{i.append(n,a)}catch(e){console.warn("Response "+e.message)}}}),i)};0===h.url.indexOf("file://")&&(d.status<200||d.status>599)?r.status=200:r.status=d.status,r.url="responseURL"in d?d.responseURL:r.headers.get("X-Request-URL");var n="response"in d?d.response:d.responseText;setTimeout(function(){s(new x(n,r))},0)},d.onerror=function(){setTimeout(function(){o(TypeError("Network request failed"))},0)},d.ontimeout=function(){setTimeout(function(){o(TypeError("Network request timed out"))},0)},d.onabort=function(){setTimeout(function(){o(new i.DOMException("Aborted","AbortError"))},0)},d.open(h.method,function(e){try{return""===e&&n.location.href?n.location.href:e}catch(i){return e}}(h.url),!0),"include"===h.credentials?d.withCredentials=!0:"omit"===h.credentials&&(d.withCredentials=!1),"responseType"in d&&(a.blob?d.responseType="blob":a.arrayBuffer&&(d.responseType="arraybuffer")),r&&"object"==typeof r.headers&&!(r.headers instanceof u||n.Headers&&r.headers instanceof n.Headers)){var f=[];Object.getOwnPropertyNames(r.headers).forEach(function(e){f.push(l(e)),d.setRequestHeader(e,c(r.headers[e]))}),h.headers.forEach(function(e,i){-1===f.indexOf(i)&&d.setRequestHeader(i,e)})}else h.headers.forEach(function(e,i){d.setRequestHeader(i,e)});h.signal&&(h.signal.addEventListener("abort",p),d.onreadystatechange=function(){4===d.readyState&&h.signal.removeEventListener("abort",p)}),d.send(void 0===h._bodyInit?null:h._bodyInit)})}b.polyfill=!0,n.fetch||(n.fetch=b,n.Headers=u,n.Request=_,n.Response=x),i.Headers=u,i.Request=_,i.Response=x,i.fetch=b}({})}(a),a.fetch.ponyfill=!0,delete a.fetch.polyfill;var s=n.fetch?n:a;(i=s.fetch).default=s.fetch,i.fetch=s.fetch,i.Headers=s.Headers,i.Request=s.Request,i.Response=s.Response,e.exports=i},"./node_modules/interactjs/dist/interact.min.js":function(e,i,r){e=r.nmd(e),e.exports=function(){"use strict";function i(e,i){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);i&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),r.push.apply(r,n)}return r}function r(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach(function(i){var r,a,s;r=e,a=i,s=n[i],(a=f(a))in r?Object.defineProperty(r,a,{value:s,enumerable:!0,configurable:!0,writable:!0}):r[a]=s}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(n,i))})}return e}function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,i){if(!(e instanceof i))throw TypeError("Cannot call a class as a function")}function s(e,i){for(var r=0;r<i.length;r++){var n=i[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,f(n.key),n)}}function o(e,i,r){return i&&s(e.prototype,i),r&&s(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function l(e,i){if("function"!=typeof i&&null!==i)throw TypeError("Super expression must either be null or a function");e.prototype=Object.create(i&&i.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),i&&h(e,i)}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,i){return(h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,i){return e.__proto__=i,e})(e,i)}function u(e){if(void 0===e)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var r,n=c(e);r=i?Reflect.construct(n,arguments,c(this).constructor):n.apply(this,arguments);if(r&&("object"==typeof r||"function"==typeof r))return r;if(void 0!==r)throw TypeError("Derived constructors may only return object or undefined");return u(this)}}function p(){return(p="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,i,r){var n=function(e,i){for(;!Object.prototype.hasOwnProperty.call(e,i)&&null!==(e=c(e)););return e}(e,i);if(n){var a=Object.getOwnPropertyDescriptor(n,i);return a.get?a.get.call(arguments.length<3?e:r):a.value}}).apply(this,arguments)}function f(e){var i=function(e,i){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,i||"default");if("object"!=typeof n)return n;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===i?String:Number)(e)}(e,"string");return"symbol"==typeof i?i:i+""}var m,g,v,_=function(e){return!(!e||!e.Window)&&e instanceof e.Window},y=void 0,x=void 0;function M(e){y=e;var i=e.document.createTextNode("");i.ownerDocument!==e.document&&"function"==typeof e.wrap&&e.wrap(i)===i&&(e=e.wrap(e)),x=e}function b(e){return _(e)?e:(e.ownerDocument||e).defaultView||x.window}"undefined"!=typeof window&&window&&M(window);var S=function(e){return!!e&&"object"===n(e)},E=function(e){return"function"==typeof e},T=function(e){return e===x||_(e)},w=function(e){return S(e)&&11===e.nodeType},A=function(e){return"number"==typeof e},R=function(e){return"boolean"==typeof e},C=function(e){return"string"==typeof e},P=function(e){if(!e||"object"!==n(e))return!1;var i=b(e)||x;return/object|function/.test("undefined"==typeof Element?"undefined":n(Element))?e instanceof Element||e instanceof i.Element:1===e.nodeType&&"string"==typeof e.nodeName},I=function(e){return S(e)&&!!e.constructor&&/function Object\b/.test(e.constructor.toString())},L=function(e){return S(e)&&void 0!==e.length&&E(e.splice)};function D(e){var i=e.interaction;if("drag"===i.prepared.name){var r=i.prepared.axis;"x"===r?(i.coords.cur.page.y=i.coords.start.page.y,i.coords.cur.client.y=i.coords.start.client.y,i.coords.velocity.client.y=0,i.coords.velocity.page.y=0):"y"===r&&(i.coords.cur.page.x=i.coords.start.page.x,i.coords.cur.client.x=i.coords.start.client.x,i.coords.velocity.client.x=0,i.coords.velocity.page.x=0)}}function U(e){var i=e.iEvent,r=e.interaction;if("drag"===r.prepared.name){var n=r.prepared.axis;if("x"===n||"y"===n){var a="x"===n?"y":"x";i.page[a]=r.coords.start.page[a],i.client[a]=r.coords.start.client[a],i.delta[a]=0}}}var N={id:"actions/drag",install:function(e){var i=e.actions,r=e.Interactable,n=e.defaults;r.prototype.draggable=N.draggable,i.map.drag=N,i.methodDict.drag="draggable",n.actions.drag=N.defaults},listeners:{"interactions:before-action-move":D,"interactions:action-resume":D,"interactions:action-move":U,"auto-start:check":function(e){var i=e.interaction,r=e.interactable,n=e.buttons,a=r.options.drag;if(a&&a.enabled&&(!i.pointerIsDown||!/mouse|pointer/.test(i.pointerType)||0!=(n&r.options.drag.mouseButtons)))return e.action={name:"drag",axis:"start"===a.lockAxis?a.startAxis:a.lockAxis},!1}},draggable:function(e){return S(e)?(this.options.drag.enabled=!1!==e.enabled,this.setPerAction("drag",e),this.setOnEvents("drag",e),/^(xy|x|y|start)$/.test(e.lockAxis)&&(this.options.drag.lockAxis=e.lockAxis),/^(xy|x|y)$/.test(e.startAxis)&&(this.options.drag.startAxis=e.startAxis),this):R(e)?(this.options.drag.enabled=e,this):this.options.drag},beforeMove:D,move:U,defaults:{startAxis:"xy",lockAxis:"xy"},getCursor:function(){return"move"},filterEventType:function(e){return 0===e.search("drag")}},O={init:function(e){O.document=e.document,O.DocumentFragment=e.DocumentFragment||F,O.SVGElement=e.SVGElement||F,O.SVGSVGElement=e.SVGSVGElement||F,O.SVGElementInstance=e.SVGElementInstance||F,O.Element=e.Element||F,O.HTMLElement=e.HTMLElement||O.Element,O.Event=e.Event,O.Touch=e.Touch||F,O.PointerEvent=e.PointerEvent||e.MSPointerEvent},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function F(){}var B={init:function(e){var i=O.Element,r=e.navigator||{};B.supportsTouch="ontouchstart"in e||E(e.DocumentTouch)&&O.document instanceof e.DocumentTouch,B.supportsPointerEvent=!1!==r.pointerEnabled&&!!O.PointerEvent,B.isIOS=/iP(hone|od|ad)/.test(r.platform),B.isIOS7=/iP(hone|od|ad)/.test(r.platform)&&/OS 7[^\d]/.test(r.appVersion),B.isIe9=/MSIE 9/.test(r.userAgent),B.isOperaMobile="Opera"===r.appName&&B.supportsTouch&&/Presto/.test(r.userAgent),B.prefixedMatchesSelector="matches"in i.prototype?"matches":"webkitMatchesSelector"in i.prototype?"webkitMatchesSelector":"mozMatchesSelector"in i.prototype?"mozMatchesSelector":"oMatchesSelector"in i.prototype?"oMatchesSelector":"msMatchesSelector",B.pEventTypes=B.supportsPointerEvent?O.PointerEvent===e.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,B.wheelEvent=O.document&&"onmousewheel"in O.document?"mousewheel":"wheel"},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null};function z(e,i){if(e.contains)return e.contains(i);for(;i;){if(i===e)return!0;i=i.parentNode}return!1}function k(e,i){for(;P(e);){if(H(e,i))return e;e=V(e)}return null}function V(e){var i=e.parentNode;if(w(i))for(;(i=i.host)&&w(i););return i}function H(e,i){return x!==y&&(i=i.replace(/\/deep\//g," ")),e[B.prefixedMatchesSelector](i)}var G=function(e){return e.parentNode||e.host};function W(e,i){for(var r,n=[],a=e;(r=G(a))&&a!==i&&r!==a.ownerDocument;)n.unshift(a),a=r;return n}function X(e,i,r){for(;P(e);){if(H(e,i))return!0;if((e=V(e))===r)return H(e,i)}return!1}function j(e){return e.correspondingUseElement||e}function q(e){var i=e instanceof O.SVGElement?e.getBoundingClientRect():e.getClientRects()[0];return i&&{left:i.left,right:i.right,top:i.top,bottom:i.bottom,width:i.width||i.right-i.left,height:i.height||i.bottom-i.top}}function Y(e){var i,r=q(e);if(!B.isIOS7&&r){var n={x:(i=(i=b(e))||x).scrollX||i.document.documentElement.scrollLeft,y:i.scrollY||i.document.documentElement.scrollTop};r.left+=n.x,r.right+=n.x,r.top+=n.y,r.bottom+=n.y}return r}function K(e){for(var i=[];e;)i.push(e),e=V(e);return i}function J(e){return!!C(e)&&(O.document.querySelector(e),!0)}function Z(e,i){for(var r in i)e[r]=i[r];return e}function Q(e,i,r){return"parent"===e?V(r):"self"===e?i.getRect(r):k(r,e)}function $(e,i,r,n){var a=e;return C(a)?a=Q(a,i,r):E(a)&&(a=a.apply(void 0,n)),P(a)&&(a=Y(a)),a}function ee(e){return e&&{x:"x"in e?e.x:e.left,y:"y"in e?e.y:e.top}}function et(e){return!e||"x"in e&&"y"in e||((e=Z({},e)).x=e.left||0,e.y=e.top||0,e.width=e.width||(e.right||0)-e.x,e.height=e.height||(e.bottom||0)-e.y),e}function ei(e,i,r){e.left&&(i.left+=r.x),e.right&&(i.right+=r.x),e.top&&(i.top+=r.y),e.bottom&&(i.bottom+=r.y),i.width=i.right-i.left,i.height=i.bottom-i.top}function er(e,i,r){var n=r&&e.options[r];return ee($(n&&n.origin||e.options.origin,e,i,[e&&i]))||{x:0,y:0}}function en(e,i){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(e){return!0},n=arguments.length>3?arguments[3]:void 0;if(n=n||{},C(e)&&-1!==e.search(" ")&&(e=ea(e)),L(e))return e.forEach(function(e){return en(e,i,r,n)}),n;if(S(e)&&(i=e,e=""),E(i)&&r(e))n[e]=n[e]||[],n[e].push(i);else if(L(i))for(var a=0,s=i;a<s.length;a++){var o=s[a];en(e,o,r,n)}else if(S(i))for(var l in i)en(ea(l).map(function(i){return"".concat(e).concat(i)}),i[l],r,n);return n}function ea(e){return e.trim().split(/ +/)}var es=function(e,i){return Math.sqrt(e*e+i*i)},eo=["webkit","moz"];function el(e,i){e.__set||(e.__set={});var r=function(r){if(eo.some(function(e){return 0===r.indexOf(e)}))return 1;"function"!=typeof e[r]&&"__set"!==r&&Object.defineProperty(e,r,{get:function(){return r in e.__set?e.__set[r]:e.__set[r]=i[r]},set:function(i){e.__set[r]=i},configurable:!0})};for(var n in i)r(n);return e}function ec(e,i){e.page=e.page||{},e.page.x=i.page.x,e.page.y=i.page.y,e.client=e.client||{},e.client.x=i.client.x,e.client.y=i.client.y,e.timeStamp=i.timeStamp}function eh(e){e.page.x=0,e.page.y=0,e.client.x=0,e.client.y=0}function eu(e){return e instanceof O.Event||e instanceof O.Touch}function ed(e,i,r){return e=e||"page",(r=r||{}).x=i[e+"X"],r.y=i[e+"Y"],r}function ep(e,i){return i=i||{x:0,y:0},B.isOperaMobile&&eu(e)?(ed("screen",e,i),i.x+=window.scrollX,i.y+=window.scrollY):ed("page",e,i),i}function ef(e){return A(e.pointerId)?e.pointerId:e.identifier}function em(e){var i=[];return L(e)?(i[0]=e[0],i[1]=e[1]):"touchend"===e.type?1===e.touches.length?(i[0]=e.touches[0],i[1]=e.changedTouches[0]):0===e.touches.length&&(i[0]=e.changedTouches[0],i[1]=e.changedTouches[1]):(i[0]=e.touches[0],i[1]=e.touches[1]),i}function eg(e){for(var i={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},r=0;r<e.length;r++){var n=e[r];for(var a in i)i[a]+=n[a]}for(var s in i)i[s]/=e.length;return i}function ev(e){if(!e.length)return null;var i=em(e),r=Math.min(i[0].pageX,i[1].pageX),n=Math.min(i[0].pageY,i[1].pageY),a=Math.max(i[0].pageX,i[1].pageX),s=Math.max(i[0].pageY,i[1].pageY);return{x:r,y:n,left:r,top:n,right:a,bottom:s,width:a-r,height:s-n}}function e_(e,i){var r=i+"X",n=i+"Y",a=em(e);return es(a[0][r]-a[1][r],a[0][n]-a[1][n])}function ey(e,i){var r=i+"X",n=i+"Y",a=em(e),s=a[1][r]-a[0][r];return 180*Math.atan2(a[1][n]-a[0][n],s)/Math.PI}function ex(e){return C(e.pointerType)?e.pointerType:A(e.pointerType)?[void 0,void 0,"touch","pen","mouse"][e.pointerType]:/touch/.test(e.type||"")||e instanceof O.Touch?"touch":"mouse"}function eM(e){var i=E(e.composedPath)?e.composedPath():e.path;return[j(i?i[0]:e.target),j(e.currentTarget)]}var eb=function(){function e(i){a(this,e),this.immediatePropagationStopped=!1,this.propagationStopped=!1,this._interaction=i}return o(e,[{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),e}();Object.defineProperty(eb.prototype,"interaction",{get:function(){return this._interaction._proxy},set:function(){}});var eS=function(e,i){for(var r=0;r<i.length;r++){var n=i[r];e.push(n)}return e},eE=function(e){return eS([],e)},eT=function(e,i){for(var r=0;r<e.length;r++)if(i(e[r],r,e))return r;return -1},ew=function(e,i){return e[eT(e,i)]},eA=function(e){l(r,e);var i=d(r);function r(e,n,s){a(this,r),(o=i.call(this,n._interaction)).dropzone=void 0,o.dragEvent=void 0,o.relatedTarget=void 0,o.draggable=void 0,o.propagationStopped=!1,o.immediatePropagationStopped=!1;var o,l="dragleave"===s?e.prev:e.cur,c=l.element,h=l.dropzone;return o.type=s,o.target=c,o.currentTarget=c,o.dropzone=h,o.dragEvent=n,o.relatedTarget=n.target,o.draggable=n.interactable,o.timeStamp=n.timeStamp,o}return o(r,[{key:"reject",value:function(){var e=this,i=this._interaction.dropState;if("dropactivate"===this.type||this.dropzone&&i.cur.dropzone===this.dropzone&&i.cur.element===this.target)if(i.prev.dropzone=this.dropzone,i.prev.element=this.target,i.rejected=!0,i.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){var n=eT(i.activeDrops,function(i){var r=i.dropzone,n=i.element;return r===e.dropzone&&n===e.target});i.activeDrops.splice(n,1);var a=new r(i,this.dragEvent,"dropdeactivate");a.dropzone=this.dropzone,a.target=this.target,this.dropzone.fire(a)}else this.dropzone.fire(new r(i,this.dragEvent,"dragleave"))}},{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),r}(eb);function eR(e,i){for(var r=0,n=e.slice();r<n.length;r++){var a=n[r],s=a.dropzone,o=a.element;i.dropzone=s,i.target=o,s.fire(i),i.propagationStopped=i.immediatePropagationStopped=!1}}function eC(e,i){for(var r=function(e,i){for(var r=[],n=0,a=e.interactables.list;n<a.length;n++){var s=a[n];if(s.options.drop.enabled){var o=s.options.drop.accept;if(!(P(o)&&o!==i||C(o)&&!H(i,o)||E(o)&&!o({dropzone:s,draggableElement:i})))for(var l=0,c=s.getAllElements();l<c.length;l++){var h=c[l];h!==i&&r.push({dropzone:s,element:h,rect:s.getRect(h)})}}}return r}(e,i),n=0;n<r.length;n++){var a=r[n];a.rect=a.dropzone.getRect(a.element)}return r}function eP(e,i,r){for(var n=e.dropState,a=e.interactable,s=e.element,o=[],l=0,c=n.activeDrops;l<c.length;l++){var h=c[l],u=h.dropzone,d=h.element,p=h.rect,f=u.dropCheck(i,r,a,s,d,p);o.push(f?d:null)}var m=function(e){for(var i,r=[],n=0;n<e.length;n++){var a=e[n],s=e[i];if(a&&n!==i)if(s){var o=G(a),l=G(s);if(o!==a.ownerDocument)if(l!==a.ownerDocument)if(o!==l){r=r.length?r:W(s);var c=void 0;if(s instanceof O.HTMLElement&&a instanceof O.SVGElement&&!(a instanceof O.SVGSVGElement)){if(a===l)continue;c=a.ownerSVGElement}else c=a;for(var h=W(c,s.ownerDocument),u=0;h[u]&&h[u]===r[u];)u++;var d=[h[u-1],h[u],r[u]];if(d[0])for(var p=d[0].lastChild;p;){if(p===d[1]){i=n,r=h;break}if(p===d[2])break;p=p.previousSibling}}else(parseInt(b(a).getComputedStyle(a).zIndex,10)||0)>=(parseInt(b(s).getComputedStyle(s).zIndex,10)||0)&&(i=n);else i=n}else i=n}return i}(o);return n.activeDrops[m]||null}function eI(e,i,r){var n=e.dropState,a={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return"dragstart"===r.type&&(a.activate=new eA(n,r,"dropactivate"),a.activate.target=null,a.activate.dropzone=null),"dragend"===r.type&&(a.deactivate=new eA(n,r,"dropdeactivate"),a.deactivate.target=null,a.deactivate.dropzone=null),n.rejected||(n.cur.element!==n.prev.element&&(n.prev.dropzone&&(a.leave=new eA(n,r,"dragleave"),r.dragLeave=a.leave.target=n.prev.element,r.prevDropzone=a.leave.dropzone=n.prev.dropzone),n.cur.dropzone&&(a.enter=new eA(n,r,"dragenter"),r.dragEnter=n.cur.element,r.dropzone=n.cur.dropzone)),"dragend"===r.type&&n.cur.dropzone&&(a.drop=new eA(n,r,"drop"),r.dropzone=n.cur.dropzone,r.relatedTarget=n.cur.element),"dragmove"===r.type&&n.cur.dropzone&&(a.move=new eA(n,r,"dropmove"),r.dropzone=n.cur.dropzone)),a}function eL(e,i){var r=e.dropState,n=r.activeDrops,a=r.cur,s=r.prev;i.leave&&s.dropzone.fire(i.leave),i.enter&&a.dropzone.fire(i.enter),i.move&&a.dropzone.fire(i.move),i.drop&&a.dropzone.fire(i.drop),i.deactivate&&eR(n,i.deactivate),r.prev.dropzone=a.dropzone,r.prev.element=a.element}function eD(e,i){var r=e.interaction,n=e.iEvent,a=e.event;if("dragmove"===n.type||"dragend"===n.type){var s=r.dropState;i.dynamicDrop&&(s.activeDrops=eC(i,r.element));var o=eP(r,n,a);s.rejected=s.rejected&&!!o&&o.dropzone===s.cur.dropzone&&o.element===s.cur.element,s.cur.dropzone=o&&o.dropzone,s.cur.element=o&&o.element,s.events=eI(r,0,n)}}var eU={id:"actions/drop",install:function(e){var i=e.actions,r=e.interactStatic,n=e.Interactable,a=e.defaults;e.usePlugin(N),n.prototype.dropzone=function(e){return function(e,i){if(S(i)){if(e.options.drop.enabled=!1!==i.enabled,i.listeners){var r=en(i.listeners),n=Object.keys(r).reduce(function(e,i){return e[/^(enter|leave)/.test(i)?"drag".concat(i):/^(activate|deactivate|move)/.test(i)?"drop".concat(i):i]=r[i],e},{}),a=e.options.drop.listeners;a&&e.off(a),e.on(n),e.options.drop.listeners=n}return E(i.ondrop)&&e.on("drop",i.ondrop),E(i.ondropactivate)&&e.on("dropactivate",i.ondropactivate),E(i.ondropdeactivate)&&e.on("dropdeactivate",i.ondropdeactivate),E(i.ondragenter)&&e.on("dragenter",i.ondragenter),E(i.ondragleave)&&e.on("dragleave",i.ondragleave),E(i.ondropmove)&&e.on("dropmove",i.ondropmove),/^(pointer|center)$/.test(i.overlap)?e.options.drop.overlap=i.overlap:A(i.overlap)&&(e.options.drop.overlap=Math.max(Math.min(1,i.overlap),0)),"accept"in i&&(e.options.drop.accept=i.accept),"checker"in i&&(e.options.drop.checker=i.checker),e}return R(i)?(e.options.drop.enabled=i,e):e.options.drop}(this,e)},n.prototype.dropCheck=function(e,i,r,n,a,s){return function(e,i,r,n,a,s,o){var l=!1;if(!(o=o||e.getRect(s)))return!!e.options.drop.checker&&e.options.drop.checker(i,r,l,e,s,n,a);var c=e.options.drop.overlap;if("pointer"===c){var h=er(n,a,"drag"),u=ep(i);u.x+=h.x,u.y+=h.y;var d=u.x>o.left&&u.x<o.right,p=u.y>o.top&&u.y<o.bottom;l=d&&p}var f=n.getRect(a);if(f&&"center"===c){var m=f.left+f.width/2,g=f.top+f.height/2;l=m>=o.left&&m<=o.right&&g>=o.top&&g<=o.bottom}return f&&A(c)&&(l=Math.max(0,Math.min(o.right,f.right)-Math.max(o.left,f.left))*Math.max(0,Math.min(o.bottom,f.bottom)-Math.max(o.top,f.top))/(f.width*f.height)>=c),e.options.drop.checker&&(l=e.options.drop.checker(i,r,l,e,s,n,a)),l}(this,e,i,r,n,a,s)},r.dynamicDrop=function(i){return R(i)?(e.dynamicDrop=i,r):e.dynamicDrop},Z(i.phaselessTypes,{dragenter:!0,dragleave:!0,dropactivate:!0,dropdeactivate:!0,dropmove:!0,drop:!0}),i.methodDict.drop="dropzone",e.dynamicDrop=!1,a.actions.drop=eU.defaults},listeners:{"interactions:before-action-start":function(e){var i=e.interaction;"drag"===i.prepared.name&&(i.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:[]})},"interactions:after-action-start":function(e,i){var r=e.interaction,n=(e.event,e.iEvent);if("drag"===r.prepared.name){var a=r.dropState;a.activeDrops=[],a.events={},a.activeDrops=eC(i,r.element),a.events=eI(r,0,n),a.events.activate&&(eR(a.activeDrops,a.events.activate),i.fire("actions/drop:start",{interaction:r,dragEvent:n}))}},"interactions:action-move":eD,"interactions:after-action-move":function(e,i){var r=e.interaction,n=e.iEvent;if("drag"===r.prepared.name){var a=r.dropState;eL(r,a.events),i.fire("actions/drop:move",{interaction:r,dragEvent:n}),a.events={}}},"interactions:action-end":function(e,i){if("drag"===e.interaction.prepared.name){var r=e.interaction,n=e.iEvent;eD(e,i),eL(r,r.dropState.events),i.fire("actions/drop:end",{interaction:r,dragEvent:n})}},"interactions:stop":function(e){var i=e.interaction;if("drag"===i.prepared.name){var r=i.dropState;r&&(r.activeDrops=null,r.events=null,r.cur.dropzone=null,r.cur.element=null,r.prev.dropzone=null,r.prev.element=null,r.rejected=!1)}}},getActiveDrops:eC,getDrop:eP,getDropEvents:eI,fireDropEvents:eL,filterEventType:function(e){return 0===e.search("drag")||0===e.search("drop")},defaults:{enabled:!1,accept:null,overlap:"pointer"}};function eN(e){var i=e.interaction,r=e.iEvent,n=e.phase;if("gesture"===i.prepared.name){var a=i.pointers.map(function(e){return e.pointer}),s=i.interactable.options.deltaSource;if(r.touches=[a[0],a[1]],"start"===n)r.distance=e_(a,s),r.box=ev(a),r.scale=1,r.ds=0,r.angle=ey(a,s),r.da=0,i.gesture.startDistance=r.distance,i.gesture.startAngle=r.angle;else if("end"===n||i.pointers.length<2){var o=i.prevEvent;r.distance=o.distance,r.box=o.box,r.scale=o.scale,r.ds=0,r.angle=o.angle,r.da=0}else r.distance=e_(a,s),r.box=ev(a),r.scale=r.distance/i.gesture.startDistance,r.angle=ey(a,s),r.ds=r.scale-i.gesture.scale,r.da=r.angle-i.gesture.angle;i.gesture.distance=r.distance,i.gesture.angle=r.angle,A(r.scale)&&r.scale!==1/0&&!isNaN(r.scale)&&(i.gesture.scale=r.scale)}}var eO={id:"actions/gesture",before:["actions/drag","actions/resize"],install:function(e){var i=e.actions,r=e.Interactable,n=e.defaults;r.prototype.gesturable=function(e){return S(e)?(this.options.gesture.enabled=!1!==e.enabled,this.setPerAction("gesture",e),this.setOnEvents("gesture",e),this):R(e)?(this.options.gesture.enabled=e,this):this.options.gesture},i.map.gesture=eO,i.methodDict.gesture="gesturable",n.actions.gesture=eO.defaults},listeners:{"interactions:action-start":eN,"interactions:action-move":eN,"interactions:action-end":eN,"interactions:new":function(e){e.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0}},"auto-start:check":function(e){if(!(e.interaction.pointers.length<2)){var i=e.interactable.options.gesture;if(i&&i.enabled)return e.action={name:"gesture"},!1}}},defaults:{},getCursor:function(){return""},filterEventType:function(e){return 0===e.search("gesture")}};function eF(e){var i=e.iEvent,r=e.interaction;"resize"===r.prepared.name&&r.resizeAxes&&(r.interactable.options.resize.square?("y"===r.resizeAxes?i.delta.x=i.delta.y:i.delta.y=i.delta.x,i.axes="xy"):(i.axes=r.resizeAxes,"x"===r.resizeAxes?i.delta.y=0:"y"===r.resizeAxes&&(i.delta.x=0)))}var eB,ez,ek={id:"actions/resize",before:["actions/drag"],install:function(e){var i=e.actions,r=e.browser,n=e.Interactable,a=e.defaults;ek.cursors=r.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"},ek.defaultMargin=r.supportsTouch||r.supportsPointerEvent?20:10,n.prototype.resizable=function(i){return S(i)?(this.options.resize.enabled=!1!==i.enabled,this.setPerAction("resize",i),this.setOnEvents("resize",i),C(i.axis)&&/^x$|^y$|^xy$/.test(i.axis)?this.options.resize.axis=i.axis:null===i.axis&&(this.options.resize.axis=e.defaults.actions.resize.axis),R(i.preserveAspectRatio)?this.options.resize.preserveAspectRatio=i.preserveAspectRatio:R(i.square)&&(this.options.resize.square=i.square),this):R(i)?(this.options.resize.enabled=i,this):this.options.resize},i.map.resize=ek,i.methodDict.resize="resizable",a.actions.resize=ek.defaults},listeners:{"interactions:new":function(e){e.interaction.resizeAxes="xy"},"interactions:action-start":function(e){!function(e){var i=e.iEvent,r=e.interaction;if("resize"===r.prepared.name&&r.prepared.edges){var n=r.rect;r._rects={start:Z({},n),corrected:Z({},n),previous:Z({},n),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},i.edges=r.prepared.edges,i.rect=r._rects.corrected,i.deltaRect=r._rects.delta}}(e),eF(e)},"interactions:action-move":function(e){!function(e){var i=e.iEvent,r=e.interaction;if("resize"===r.prepared.name&&r.prepared.edges){var n=r.interactable.options.resize.invert,a=r.rect,s=r._rects,o=s.start,l=s.corrected,c=s.delta,h=s.previous;if(Z(h,l),"reposition"===n||"negate"===n){if(Z(l,a),"reposition"===n){if(l.top>l.bottom){var u=l.top;l.top=l.bottom,l.bottom=u}if(l.left>l.right){var d=l.left;l.left=l.right,l.right=d}}}else l.top=Math.min(a.top,o.bottom),l.bottom=Math.max(a.bottom,o.top),l.left=Math.min(a.left,o.right),l.right=Math.max(a.right,o.left);for(var p in l.width=l.right-l.left,l.height=l.bottom-l.top,l)c[p]=l[p]-h[p];i.edges=r.prepared.edges,i.rect=l,i.deltaRect=c}}(e),eF(e)},"interactions:action-end":function(e){var i=e.iEvent,r=e.interaction;"resize"===r.prepared.name&&r.prepared.edges&&(i.edges=r.prepared.edges,i.rect=r._rects.corrected,i.deltaRect=r._rects.delta)},"auto-start:check":function(e){var i=e.interaction,r=e.interactable,n=e.element,a=e.rect,s=e.buttons;if(a){var o=Z({},i.coords.cur.page),l=r.options.resize;if(l&&l.enabled&&(!i.pointerIsDown||!/mouse|pointer/.test(i.pointerType)||0!=(s&l.mouseButtons))){if(S(l.edges)){var c={left:!1,right:!1,top:!1,bottom:!1};for(var h in c)c[h]=function(e,i,r,n,a,s,o){if(!i)return!1;if(!0===i){var l=A(s.width)?s.width:s.right-s.left,c=A(s.height)?s.height:s.bottom-s.top;if(o=Math.min(o,Math.abs(("left"===e||"right"===e?l:c)/2)),l<0&&("left"===e?e="right":"right"===e&&(e="left")),c<0&&("top"===e?e="bottom":"bottom"===e&&(e="top")),"left"===e){var h=l>=0?s.left:s.right;return r.x<h+o}if("top"===e){var u=c>=0?s.top:s.bottom;return r.y<u+o}if("right"===e)return r.x>(l>=0?s.right:s.left)-o;if("bottom"===e)return r.y>(c>=0?s.bottom:s.top)-o}return!!P(n)&&(P(i)?i===n:X(n,i,a))}(h,l.edges[h],o,i._latestPointer.eventTarget,n,a,l.margin||ek.defaultMargin);c.left=c.left&&!c.right,c.top=c.top&&!c.bottom,(c.left||c.right||c.top||c.bottom)&&(e.action={name:"resize",edges:c})}else{var u="y"!==l.axis&&o.x>a.right-ek.defaultMargin,d="x"!==l.axis&&o.y>a.bottom-ek.defaultMargin;(u||d)&&(e.action={name:"resize",axes:(u?"x":"")+(d?"y":"")})}return!e.action&&void 0}}}},defaults:{square:!1,preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},cursors:null,getCursor:function(e){var i=e.edges,r=e.axis,n=e.name,a=ek.cursors,s=null;if(r)s=a[n+r];else if(i){for(var o="",l=0,c=["top","bottom","left","right"];l<c.length;l++){var h=c[l];i[h]&&(o+=h)}s=a[o]}return s},filterEventType:function(e){return 0===e.search("resize")},defaultMargin:null},eV=0,eH=function(e){return eB(e)},eG=function(e){return ez(e)},eW=function(e){if(eB=e.requestAnimationFrame,ez=e.cancelAnimationFrame,!eB)for(var i=["ms","moz","webkit","o"],r=0;r<i.length;r++){var n=i[r];eB=e["".concat(n,"RequestAnimationFrame")],ez=e["".concat(n,"CancelAnimationFrame")]||e["".concat(n,"CancelRequestAnimationFrame")]}eB=eB&&eB.bind(e),ez=ez&&ez.bind(e),eB||(eB=function(i){var r=Date.now(),n=Math.max(0,16-(r-eV)),a=e.setTimeout(function(){i(r+n)},n);return eV=r+n,a},ez=function(e){return clearTimeout(e)})},eX={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:0,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(e){eX.isScrolling=!0,eG(eX.i),e.autoScroll=eX,eX.interaction=e,eX.prevTime=eX.now(),eX.i=eH(eX.scroll)},stop:function(){eX.isScrolling=!1,eX.interaction&&(eX.interaction.autoScroll=null),eG(eX.i)},scroll:function(){var e=eX.interaction,i=e.interactable,r=e.element,n=e.prepared.name,a=i.options[n].autoScroll,s=ej(a.container,i,r),o=eX.now(),l=(o-eX.prevTime)/1e3,c=a.speed*l;if(c>=1){var h={x:eX.x*c,y:eX.y*c};if(h.x||h.y){var u=eq(s);T(s)?s.scrollBy(h.x,h.y):s&&(s.scrollLeft+=h.x,s.scrollTop+=h.y);var d=eq(s),p={x:d.x-u.x,y:d.y-u.y};(p.x||p.y)&&i.fire({type:"autoscroll",target:r,interactable:i,delta:p,interaction:e,container:s})}eX.prevTime=o}eX.isScrolling&&(eG(eX.i),eX.i=eH(eX.scroll))},check:function(e,i){var r;return null==(r=e.options[i].autoScroll)?void 0:r.enabled},onInteractionMove:function(e){var i=e.interaction,r=e.pointer;if(i.interacting()&&eX.check(i.interactable,i.prepared.name))if(i.simulation)eX.x=eX.y=0;else{var n,a,s,o,l=i.interactable,c=i.element,h=i.prepared.name,u=l.options[h].autoScroll,d=ej(u.container,l,c);if(T(d))o=r.clientX<eX.margin,n=r.clientY<eX.margin,a=r.clientX>d.innerWidth-eX.margin,s=r.clientY>d.innerHeight-eX.margin;else{var p=q(d);o=r.clientX<p.left+eX.margin,n=r.clientY<p.top+eX.margin,a=r.clientX>p.right-eX.margin,s=r.clientY>p.bottom-eX.margin}eX.x=a?1:o?-1:0,eX.y=s?1:n?-1:0,eX.isScrolling||(eX.margin=u.margin,eX.speed=u.speed,eX.start(i))}}};function ej(e,i,r){return(C(e)?Q(e,i,r):e)||b(r)}function eq(e){return T(e)&&(e=window.document.body),{x:e.scrollLeft,y:e.scrollTop}}var eY={id:"auto-scroll",install:function(e){var i=e.defaults,r=e.actions;e.autoScroll=eX,eX.now=function(){return e.now()},r.phaselessTypes.autoscroll=!0,i.perAction.autoScroll=eX.defaults},listeners:{"interactions:new":function(e){e.interaction.autoScroll=null},"interactions:destroy":function(e){e.interaction.autoScroll=null,eX.stop(),eX.interaction&&(eX.interaction=null)},"interactions:stop":eX.stop,"interactions:action-move":function(e){return eX.onInteractionMove(e)}}};function eK(e,i){var r=!1;return function(){return r||(x.console.warn(i),r=!0),e.apply(this,arguments)}}function eJ(e,i){return e.name=i.name,e.axis=i.axis,e.edges=i.edges,e}function eZ(e){return R(e)?(this.options.styleCursor=e,this):null===e?(delete this.options.styleCursor,this):this.options.styleCursor}function eQ(e){return E(e)?(this.options.actionChecker=e,this):null===e?(delete this.options.actionChecker,this):this.options.actionChecker}var e$={id:"auto-start/interactableMethods",install:function(e){var i=e.Interactable;i.prototype.getAction=function(i,r,n,a){var s,o,l=(s=this.getRect(a),o={action:null,interactable:this,interaction:n,element:a,rect:s,buttons:r.buttons||({0:1,1:4,3:8,4:16})[r.button]},e.fire("auto-start:check",o),o.action);return this.options.actionChecker?this.options.actionChecker(i,r,l,this,a,n):l},i.prototype.ignoreFrom=eK(function(e){return this._backCompatOption("ignoreFrom",e)},"Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),i.prototype.allowFrom=eK(function(e){return this._backCompatOption("allowFrom",e)},"Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),i.prototype.actionChecker=eQ,i.prototype.styleCursor=eZ}};function e0(e,i,r,n,a){return i.testIgnoreAllow(i.options[e.name],r,n)&&i.options[e.name].enabled&&e3(i,r,e,a)?e:null}function e1(e,i,r,n,a){var s=[],o=[],l=n;function c(e){s.push(e),o.push(l)}for(;P(l);){s=[],o=[],a.interactables.forEachMatch(l,c);var h=function(e,i,r,n,a,s,o){for(var l=0,c=n.length;l<c;l++){var h=n[l],u=a[l],d=h.getAction(i,r,e,u);if(d){var p=e0(d,h,u,s,o);if(p)return{action:p,interactable:h,element:u}}}return{action:null,interactable:null,element:null}}(e,i,r,s,o,n,a);if(h.action&&!h.interactable.options[h.action.name].manualStart)return h;l=V(l)}return{action:null,interactable:null,element:null}}function e2(e,i,r){var n=i.action,a=i.interactable,s=i.element;n=n||{name:null},e.interactable=a,e.element=s,eJ(e.prepared,n),e.rect=a&&n.name?a.getRect(s):null,e6(e,r),r.fire("autoStart:prepared",{interaction:e})}function e3(e,i,r,n){var a=e.options,s=a[r.name].max,o=a[r.name].maxPerElement,l=n.autoStart.maxInteractions,c=0,h=0,u=0;if(!(s&&o&&l))return!1;for(var d=0,p=n.interactions.list;d<p.length;d++){var f=p[d],m=f.prepared.name;if(f.interacting()&&(++c>=l||f.interactable===e&&((h+=+(m===r.name))>=s||f.element===i&&(u++,m===r.name&&u>=o))))return!1}return l>0}function e4(e,i){return A(e)?(i.autoStart.maxInteractions=e,this):i.autoStart.maxInteractions}function e5(e,i,r){var n=r.autoStart.cursorElement;n&&n!==e&&(n.style.cursor=""),e.ownerDocument.documentElement.style.cursor=i,e.style.cursor=i,r.autoStart.cursorElement=i?e:null}function e6(e,i){var r=e.interactable,n=e.element,a=e.prepared;if("mouse"===e.pointerType&&r&&r.options.styleCursor){var s="";if(a.name){var o=r.options[a.name].cursorChecker;s=E(o)?o(a,r,n,e._interacting):i.actions.map[a.name].getCursor(a)}e5(e.element,s||"",i)}else i.autoStart.cursorElement&&e5(i.autoStart.cursorElement,"",i)}var e9={id:"auto-start/base",before:["actions"],install:function(e){var i=e.interactStatic,r=e.defaults;e.usePlugin(e$),r.base.actionChecker=null,r.base.styleCursor=!0,Z(r.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),i.maxInteractions=function(i){return e4(i,e)},e.autoStart={maxInteractions:1/0,withinInteractionLimit:e3,cursorElement:null}},listeners:{"interactions:down":function(e,i){var r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget;r.interacting()||e2(r,e1(r,n,a,s,i),i)},"interactions:move":function(e,i){var r,n,a,s;r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget,"mouse"!==r.pointerType||r.pointerIsDown||r.interacting()||e2(r,e1(r,n,a,s,i),i),function(e,i){var r=e.interaction;if(r.pointerIsDown&&!r.interacting()&&r.pointerWasMoved&&r.prepared.name){i.fire("autoStart:before-start",e);var n=r.interactable,a=r.prepared.name;a&&n&&(n.options[a].manualStart||!e3(n,r.element,r.prepared,i)?r.stop():(r.start(r.prepared,n,r.element),e6(r,i)))}}(e,i)},"interactions:stop":function(e,i){var r=e.interaction,n=r.interactable;n&&n.options.styleCursor&&e5(r.element,"",i)}},maxInteractions:e4,withinInteractionLimit:e3,validateAction:e0},e8={id:"auto-start/dragAxis",listeners:{"autoStart:before-start":function(e,i){var r=e.interaction,n=e.eventTarget,a=e.dx,s=e.dy;if("drag"===r.prepared.name){var o=Math.abs(a),l=Math.abs(s),c=r.interactable.options.drag,h=c.startAxis,u=o>l?"x":o<l?"y":"xy";if(r.prepared.axis="start"===c.lockAxis?u[0]:c.lockAxis,"xy"!==u&&"xy"!==h&&h!==u){r.prepared.name=null;for(var d=n,p=function(e){if(e!==r.interactable){var a=r.interactable.options.drag;if(!a.manualStart&&e.testIgnoreAllow(a,d,n)){var s=e.getAction(r.downPointer,r.downEvent,r,d);if(s&&"drag"===s.name&&function(e,i){if(!i)return!1;var r=i.options.drag.startAxis;return"xy"===e||"xy"===r||r===e}(u,e)&&e9.validateAction(s,e,d,n,i))return e}}};P(d);){var f=i.interactables.forEachMatch(d,p);if(f){r.prepared.name="drag",r.interactable=f,r.element=d;break}d=V(d)}}}}}};function e7(e){var i=e.prepared&&e.prepared.name;if(!i)return null;var r=e.interactable.options;return r[i].hold||r[i].delay}var te={id:"auto-start/hold",install:function(e){var i=e.defaults;e.usePlugin(e9),i.perAction.hold=0,i.perAction.delay=0},listeners:{"interactions:new":function(e){e.interaction.autoStartHoldTimer=null},"autoStart:prepared":function(e){var i=e.interaction,r=e7(i);r>0&&(i.autoStartHoldTimer=setTimeout(function(){i.start(i.prepared,i.interactable,i.element)},r))},"interactions:move":function(e){var i=e.interaction,r=e.duplicate;i.autoStartHoldTimer&&i.pointerWasMoved&&!r&&(clearTimeout(i.autoStartHoldTimer),i.autoStartHoldTimer=null)},"autoStart:before-start":function(e){var i=e.interaction;e7(i)>0&&(i.prepared.name=null)}},getHoldDuration:e7},tt=function(e){return/^(always|never|auto)$/.test(e)?(this.options.preventDefault=e,this):R(e)?(this.options.preventDefault=e?"always":"never",this):this.options.preventDefault};function ti(e){var i=e.interaction,r=e.event;i.interactable&&i.interactable.checkAndPreventDefault(r)}var tr={id:"core/interactablePreventDefault",install:function(e){var i=e.Interactable;i.prototype.preventDefault=tt,i.prototype.checkAndPreventDefault=function(i){return function(e,i,r){var n=e.options.preventDefault;if("never"!==n)if("always"!==n){if(i.events.supportsPassive&&/^touch(start|move)$/.test(r.type)){var a=b(r.target).document,s=i.getDocOptions(a);if(!s||!s.events||!1!==s.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(r.type)||P(r.target)&&H(r.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||r.preventDefault()}else r.preventDefault()}(this,e,i)},e.interactions.docEvents.push({type:"dragstart",listener:function(i){for(var r=0,n=e.interactions.list;r<n.length;r++){var a=n[r];if(a.element&&(a.element===i.target||z(a.element,i.target)))return void a.interactable.checkAndPreventDefault(i)}}})},listeners:["down","move","up","cancel"].reduce(function(e,i){return e["interactions:".concat(i)]=ti,e},{})};function tn(e,i){if(i.phaselessTypes[e])return!0;for(var r in i.map)if(0===e.indexOf(r)&&e.substr(r.length)in i.phases)return!0;return!1}function ta(e){var i={};for(var r in e){var n=e[r];I(n)?i[r]=ta(n):L(n)?i[r]=eE(n):i[r]=n}return i}var ts=function(){function e(i){a(this,e),this.states=[],this.startOffset={left:0,right:0,top:0,bottom:0},this.startDelta=void 0,this.result=void 0,this.endResult=void 0,this.startEdges=void 0,this.edges=void 0,this.interaction=void 0,this.interaction=i,this.result=to(),this.edges={left:!1,right:!1,top:!1,bottom:!1}}return o(e,[{key:"start",value:function(e,i){var r,n,a,s=e.phase,o=this.interaction,l=(n=(r=o.interactable.options[o.prepared.name]).modifiers)&&n.length?n:["snap","snapSize","snapEdges","restrict","restrictEdges","restrictSize"].map(function(e){var i=r[e];return i&&i.enabled&&{options:i,methods:i._methods}}).filter(function(e){return!!e});this.prepareStates(l),this.startEdges=Z({},o.edges),this.edges=Z({},this.startEdges),this.startOffset=(a=o.rect)?{left:i.x-a.left,top:i.y-a.top,right:a.right-i.x,bottom:a.bottom-i.y}:{left:0,top:0,right:0,bottom:0},this.startDelta={x:0,y:0};var c=this.fillArg({phase:s,pageCoords:i,preEnd:!1});return this.result=to(),this.startAll(c),this.result=this.setAll(c)}},{key:"fillArg",value:function(e){var i=this.interaction;return e.interaction=i,e.interactable=i.interactable,e.element=i.element,e.rect||(e.rect=i.rect),e.edges||(e.edges=this.startEdges),e.startOffset=this.startOffset,e}},{key:"startAll",value:function(e){for(var i=0,r=this.states;i<r.length;i++){var n=r[i];n.methods.start&&(e.state=n,n.methods.start(e))}}},{key:"setAll",value:function(e){var i=e.phase,r=e.preEnd,n=e.skipModifiers,a=e.rect,s=e.edges;e.coords=Z({},e.pageCoords),e.rect=Z({},a),e.edges=Z({},s);for(var o=n?this.states.slice(n):this.states,l=to(e.coords,e.rect),c=0;c<o.length;c++){var h,u=o[c],d=u.options,p=Z({},e.coords),f=null;null!=(h=u.methods)&&h.set&&this.shouldDo(d,r,i)&&(e.state=u,f=u.methods.set(e),ei(e.edges,e.rect,{x:e.coords.x-p.x,y:e.coords.y-p.y})),l.eventProps.push(f)}Z(this.edges,e.edges),l.delta.x=e.coords.x-e.pageCoords.x,l.delta.y=e.coords.y-e.pageCoords.y,l.rectDelta.left=e.rect.left-a.left,l.rectDelta.right=e.rect.right-a.right,l.rectDelta.top=e.rect.top-a.top,l.rectDelta.bottom=e.rect.bottom-a.bottom;var m=this.result.coords,g=this.result.rect;if(m&&g){var v=l.rect.left!==g.left||l.rect.right!==g.right||l.rect.top!==g.top||l.rect.bottom!==g.bottom;l.changed=v||m.x!==l.coords.x||m.y!==l.coords.y}return l}},{key:"applyToInteraction",value:function(e){var i=this.interaction,r=e.phase,n=i.coords.cur,a=i.coords.start,s=this.result,o=this.startDelta,l=s.delta;"start"===r&&Z(this.startDelta,s.delta);for(var c=0,h=[[a,o],[n,l]];c<h.length;c++){var u=h[c],d=u[0],p=u[1];d.page.x+=p.x,d.page.y+=p.y,d.client.x+=p.x,d.client.y+=p.y}var f=this.result.rectDelta,m=e.rect||i.rect;m.left+=f.left,m.right+=f.right,m.top+=f.top,m.bottom+=f.bottom,m.width=m.right-m.left,m.height=m.bottom-m.top}},{key:"setAndApply",value:function(e){var i=this.interaction,r=e.phase,n=e.preEnd,a=e.skipModifiers,s=this.setAll(this.fillArg({preEnd:n,phase:r,pageCoords:e.modifiedCoords||i.coords.cur.page}));if(this.result=s,!s.changed&&(!a||a<this.states.length)&&i.interacting())return!1;if(e.modifiedCoords){var o=i.coords.cur.page,l={x:e.modifiedCoords.x-o.x,y:e.modifiedCoords.y-o.y};s.coords.x+=l.x,s.coords.y+=l.y,s.delta.x+=l.x,s.delta.y+=l.y}this.applyToInteraction(e)}},{key:"beforeEnd",value:function(e){var i=e.interaction,r=e.event,n=this.states;if(n&&n.length){for(var a=!1,s=0;s<n.length;s++){var o=n[s];e.state=o;var l=o.options,c=o.methods,h=c.beforeEnd&&c.beforeEnd(e);if(h)return this.endResult=h,!1;a=a||!a&&this.shouldDo(l,!0,e.phase,!0)}a&&i.move({event:r,preEnd:!0})}}},{key:"stop",value:function(e){var i=e.interaction;if(this.states&&this.states.length){var r=Z({states:this.states,interactable:i.interactable,element:i.element,rect:null},e);this.fillArg(r);for(var n=0,a=this.states;n<a.length;n++){var s=a[n];r.state=s,s.methods.stop&&s.methods.stop(r)}this.states=null,this.endResult=null}}},{key:"prepareStates",value:function(e){this.states=[];for(var i=0;i<e.length;i++){var r=e[i],n=r.options,a=r.methods,s=r.name;this.states.push({options:n,methods:a,index:i,name:s})}return this.states}},{key:"restoreInteractionCoords",value:function(e){var i=e.interaction,r=i.coords,n=i.rect,a=i.modification;if(a.result){for(var s=a.startDelta,o=a.result,l=o.delta,c=o.rectDelta,h=0,u=[[r.start,s],[r.cur,l]];h<u.length;h++){var d=u[h],p=d[0],f=d[1];p.page.x-=f.x,p.page.y-=f.y,p.client.x-=f.x,p.client.y-=f.y}n.left-=c.left,n.right-=c.right,n.top-=c.top,n.bottom-=c.bottom}}},{key:"shouldDo",value:function(e,i,r,n){return!(!e||!1===e.enabled||n&&!e.endOnly||e.endOnly&&!i||"start"===r&&!e.setStart)}},{key:"copyFrom",value:function(e){this.startOffset=e.startOffset,this.startDelta=e.startDelta,this.startEdges=e.startEdges,this.edges=e.edges,this.states=e.states.map(function(e){return ta(e)}),this.result=to(Z({},e.result.coords),Z({},e.result.rect))}},{key:"destroy",value:function(){for(var e in this)this[e]=null}}]),e}();function to(e,i){return{rect:i,coords:e,delta:{x:0,y:0},rectDelta:{left:0,right:0,top:0,bottom:0},eventProps:[],changed:!0}}function tl(e,i){var r=e.defaults,n={start:e.start,set:e.set,beforeEnd:e.beforeEnd,stop:e.stop},a=function(e){var a=e||{};for(var s in a.enabled=!1!==a.enabled,r)s in a||(a[s]=r[s]);var o={options:a,methods:n,name:i,enable:function(){return a.enabled=!0,o},disable:function(){return a.enabled=!1,o}};return o};return i&&"string"==typeof i&&(a._defaults=r,a._methods=n),a}function tc(e){var i=e.iEvent,r=e.interaction.modification.result;r&&(i.modifiers=r.eventProps)}var th={id:"modifiers/base",before:["actions"],install:function(e){e.defaults.perAction.modifiers=[]},listeners:{"interactions:new":function(e){var i=e.interaction;i.modification=new ts(i)},"interactions:before-action-start":function(e){var i=e.interaction,r=e.interaction.modification;r.start(e,i.coords.start.page),i.edges=r.edges,r.applyToInteraction(e)},"interactions:before-action-move":function(e){var i=e.interaction,r=i.modification,n=r.setAndApply(e);return i.edges=r.edges,n},"interactions:before-action-end":function(e){var i=e.interaction,r=i.modification,n=r.beforeEnd(e);return i.edges=r.startEdges,n},"interactions:action-start":tc,"interactions:action-move":tc,"interactions:action-end":tc,"interactions:after-action-start":function(e){return e.interaction.modification.restoreInteractionCoords(e)},"interactions:after-action-move":function(e){return e.interaction.modification.restoreInteractionCoords(e)},"interactions:stop":function(e){return e.interaction.modification.stop(e)}}},tu={base:{preventDefault:"auto",deltaSource:"page"},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}},td=function(e){l(r,e);var i=d(r);function r(e,n,s,o,l,c,h){a(this,r),(d=i.call(this,e)).relatedTarget=null,d.screenX=void 0,d.screenY=void 0,d.button=void 0,d.buttons=void 0,d.ctrlKey=void 0,d.shiftKey=void 0,d.altKey=void 0,d.metaKey=void 0,d.page=void 0,d.client=void 0,d.delta=void 0,d.rect=void 0,d.x0=void 0,d.y0=void 0,d.t0=void 0,d.dt=void 0,d.duration=void 0,d.clientX0=void 0,d.clientY0=void 0,d.velocity=void 0,d.speed=void 0,d.swipe=void 0,d.axes=void 0,d.preEnd=void 0,l=l||e.element;var d,p=e.interactable,f=(p&&p.options||tu).deltaSource,m=er(p,l,s),g="start"===o,v="end"===o,_=g?u(d):e.prevEvent,y=g?e.coords.start:v?{page:_.page,client:_.client,timeStamp:e.coords.cur.timeStamp}:e.coords.cur;return d.page=Z({},y.page),d.client=Z({},y.client),d.rect=Z({},e.rect),d.timeStamp=y.timeStamp,v||(d.page.x-=m.x,d.page.y-=m.y,d.client.x-=m.x,d.client.y-=m.y),d.ctrlKey=n.ctrlKey,d.altKey=n.altKey,d.shiftKey=n.shiftKey,d.metaKey=n.metaKey,d.button=n.button,d.buttons=n.buttons,d.target=l,d.currentTarget=l,d.preEnd=c,d.type=h||s+(o||""),d.interactable=p,d.t0=g?e.pointers[e.pointers.length-1].downTime:_.t0,d.x0=e.coords.start.page.x-m.x,d.y0=e.coords.start.page.y-m.y,d.clientX0=e.coords.start.client.x-m.x,d.clientY0=e.coords.start.client.y-m.y,d.delta=g||v?{x:0,y:0}:{x:d[f].x-_[f].x,y:d[f].y-_[f].y},d.dt=e.coords.delta.timeStamp,d.duration=d.timeStamp-d.t0,d.velocity=Z({},e.coords.velocity[f]),d.speed=es(d.velocity.x,d.velocity.y),d.swipe=v||"inertiastart"===o?d.getSwipe():null,d}return o(r,[{key:"getSwipe",value:function(){var e=this._interaction;if(e.prevEvent.speed<600||this.timeStamp-e.prevEvent.timeStamp>150)return null;var i=180*Math.atan2(e.prevEvent.velocityY,e.prevEvent.velocityX)/Math.PI;i<0&&(i+=360);var r=112.5<=i&&i<247.5,n=202.5<=i&&i<337.5;return{up:n,down:!n&&22.5<=i&&i<157.5,left:r,right:!r&&(292.5<=i||i<67.5),angle:i,speed:e.prevEvent.speed,velocity:{x:e.prevEvent.velocityX,y:e.prevEvent.velocityY}}}},{key:"preventDefault",value:function(){}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}}]),r}(eb);Object.defineProperties(td.prototype,{pageX:{get:function(){return this.page.x},set:function(e){this.page.x=e}},pageY:{get:function(){return this.page.y},set:function(e){this.page.y=e}},clientX:{get:function(){return this.client.x},set:function(e){this.client.x=e}},clientY:{get:function(){return this.client.y},set:function(e){this.client.y=e}},dx:{get:function(){return this.delta.x},set:function(e){this.delta.x=e}},dy:{get:function(){return this.delta.y},set:function(e){this.delta.y=e}},velocityX:{get:function(){return this.velocity.x},set:function(e){this.velocity.x=e}},velocityY:{get:function(){return this.velocity.y},set:function(e){this.velocity.y=e}}});var tp=o(function e(i,r,n,s,o){a(this,e),this.id=void 0,this.pointer=void 0,this.event=void 0,this.downTime=void 0,this.downTarget=void 0,this.id=i,this.pointer=r,this.event=n,this.downTime=s,this.downTarget=o}),tf=((m={}).interactable="",m.element="",m.prepared="",m.pointerIsDown="",m.pointerWasMoved="",m._proxy="",m),tm=((g={}).start="",g.move="",g.end="",g.stop="",g.interacting="",g),tg=0,tv=function(){function e(i){var r=this,n=i.pointerType,s=i.scopeFire;a(this,e),this.interactable=null,this.element=null,this.rect=null,this._rects=void 0,this.edges=null,this._scopeFire=void 0,this.prepared={name:null,axis:null,edges:null},this.pointerType=void 0,this.pointers=[],this.downEvent=null,this.downPointer={},this._latestPointer={pointer:null,event:null,eventTarget:null},this.prevEvent=null,this.pointerIsDown=!1,this.pointerWasMoved=!1,this._interacting=!1,this._ending=!1,this._stopped=!0,this._proxy=void 0,this.simulation=null,this.doMove=eK(function(e){this.move(e)},"The interaction.doMove() method has been renamed to interaction.move()"),this.coords={start:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},prev:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},cur:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},delta:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0},velocity:{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},this._id=tg++,this._scopeFire=s,this.pointerType=n;var o=this;this._proxy={};var l=function(e){Object.defineProperty(r._proxy,e,{get:function(){return o[e]}})};for(var c in tf)l(c);var h=function(e){Object.defineProperty(r._proxy,e,{value:function(){return o[e].apply(o,arguments)}})};for(var u in tm)h(u);this._scopeFire("interactions:new",{interaction:this})}return o(e,[{key:"pointerMoveTolerance",get:function(){return 1}},{key:"pointerDown",value:function(e,i,r){var n=this.updatePointer(e,i,r,!0),a=this.pointers[n];this._scopeFire("interactions:down",{pointer:e,event:i,eventTarget:r,pointerIndex:n,pointerInfo:a,type:"down",interaction:this})}},{key:"start",value:function(e,i,r){return!(this.interacting()||!this.pointerIsDown||this.pointers.length<("gesture"===e.name?2:1)||!i.options[e.name].enabled)&&(eJ(this.prepared,e),this.interactable=i,this.element=r,this.rect=i.getRect(r),this.edges=this.prepared.edges?Z({},this.prepared.edges):{left:!0,right:!0,top:!0,bottom:!0},this._stopped=!1,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:"start"})&&!this._stopped,this._interacting)}},{key:"pointerMove",value:function(e,i,r){this.simulation||this.modification&&this.modification.endResult||this.updatePointer(e,i,r,!1);var n,a,s=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(n=this.coords.cur.client.x-this.coords.start.client.x,a=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=es(n,a)>this.pointerMoveTolerance);var o,l,c,h=this.getPointerIndex(e),u={pointer:e,pointerIndex:h,pointerInfo:this.pointers[h],event:i,type:"move",eventTarget:r,dx:n,dy:a,duplicate:s,interaction:this};s||(o=this.coords.velocity,c=Math.max((l=this.coords.delta).timeStamp/1e3,.001),o.page.x=l.page.x/c,o.page.y=l.page.y/c,o.client.x=l.client.x/c,o.client.y=l.client.y/c,o.timeStamp=c),this._scopeFire("interactions:move",u),s||this.simulation||(this.interacting()&&(u.type=null,this.move(u)),this.pointerWasMoved&&ec(this.coords.prev,this.coords.cur))}},{key:"move",value:function(e){e&&e.event||eh(this.coords.delta),(e=Z({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this},e||{})).phase="move",this._doPhase(e)}},{key:"pointerUp",value:function(e,i,r,n){var a=this.getPointerIndex(e);-1===a&&(a=this.updatePointer(e,i,r,!1));var s=/cancel$/i.test(i.type)?"cancel":"up";this._scopeFire("interactions:".concat(s),{pointer:e,pointerIndex:a,pointerInfo:this.pointers[a],event:i,eventTarget:r,type:s,curEventTarget:n,interaction:this}),this.simulation||this.end(i),this.removePointer(e,i)}},{key:"documentBlur",value:function(e){this.end(e),this._scopeFire("interactions:blur",{event:e,type:"blur",interaction:this})}},{key:"end",value:function(e){var i;this._ending=!0,e=e||this._latestPointer.event,this.interacting()&&(i=this._doPhase({event:e,interaction:this,phase:"end"})),this._ending=!1,!0===i&&this.stop()}},{key:"currentAction",value:function(){return this._interacting?this.prepared.name:null}},{key:"interacting",value:function(){return this._interacting}},{key:"stop",value:function(){this._scopeFire("interactions:stop",{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this._stopped=!0,this.prepared.name=this.prevEvent=null}},{key:"getPointerIndex",value:function(e){var i=ef(e);return"mouse"===this.pointerType||"pen"===this.pointerType?this.pointers.length-1:eT(this.pointers,function(e){return e.id===i})}},{key:"getPointerInfo",value:function(e){return this.pointers[this.getPointerIndex(e)]}},{key:"updatePointer",value:function(e,i,r,n){var a,s,o,l,c,h,u,d,p=ef(e),f=this.getPointerIndex(e),m=this.pointers[f];return n=!1!==n&&(n||/(down|start)$/i.test(i.type)),m?m.pointer=e:(m=new tp(p,e,i,null,null),f=this.pointers.length,this.pointers.push(m)),a=this.coords.cur,s=this.pointers.map(function(e){return e.pointer}),o=this._now(),ep(l=s.length>1?eg(s):s[0],a.page),c=(c=a.client)||{},B.isOperaMobile&&eu(l)?ed("screen",l,c):ed("client",l,c),a.timeStamp=o,h=this.coords.delta,u=this.coords.prev,d=this.coords.cur,h.page.x=d.page.x-u.page.x,h.page.y=d.page.y-u.page.y,h.client.x=d.client.x-u.client.x,h.client.y=d.client.y-u.client.y,h.timeStamp=d.timeStamp-u.timeStamp,n&&(this.pointerIsDown=!0,m.downTime=this.coords.cur.timeStamp,m.downTarget=r,el(this.downPointer,e),this.interacting()||(ec(this.coords.start,this.coords.cur),ec(this.coords.prev,this.coords.cur),this.downEvent=i,this.pointerWasMoved=!1)),this._updateLatestPointer(e,i,r),this._scopeFire("interactions:update-pointer",{pointer:e,event:i,eventTarget:r,down:n,pointerInfo:m,pointerIndex:f,interaction:this}),f}},{key:"removePointer",value:function(e,i){var r=this.getPointerIndex(e);if(-1!==r){var n=this.pointers[r];this._scopeFire("interactions:remove-pointer",{pointer:e,event:i,eventTarget:null,pointerIndex:r,pointerInfo:n,interaction:this}),this.pointers.splice(r,1),this.pointerIsDown=!1}}},{key:"_updateLatestPointer",value:function(e,i,r){this._latestPointer.pointer=e,this._latestPointer.event=i,this._latestPointer.eventTarget=r}},{key:"destroy",value:function(){this._latestPointer.pointer=null,this._latestPointer.event=null,this._latestPointer.eventTarget=null}},{key:"_createPreparedEvent",value:function(e,i,r,n){return new td(this,e,this.prepared.name,i,this.element,r,n)}},{key:"_fireEvent",value:function(e){var i;null==(i=this.interactable)||i.fire(e),(!this.prevEvent||e.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=e)}},{key:"_doPhase",value:function(e){var i=e.event,r=e.phase,n=e.preEnd,a=e.type,s=this.rect;if(s&&"move"===r&&(ei(this.edges,s,this.coords.delta[this.interactable.options.deltaSource]),s.width=s.right-s.left,s.height=s.bottom-s.top),!1===this._scopeFire("interactions:before-action-".concat(r),e))return!1;var o=e.iEvent=this._createPreparedEvent(i,r,n,a);return this._scopeFire("interactions:action-".concat(r),e),"start"===r&&(this.prevEvent=o),this._fireEvent(o),this._scopeFire("interactions:after-action-".concat(r),e),!0}},{key:"_now",value:function(){return Date.now()}}]),e}();function t_(e){ty(e.interaction)}function ty(e){if(!e.offset.pending.x&&!e.offset.pending.y)return!1;var i=e.offset.pending;return tM(e.coords.cur,i),tM(e.coords.delta,i),ei(e.edges,e.rect,i),i.x=0,i.y=0,!0}function tx(e){var i=e.x,r=e.y;this.offset.pending.x+=i,this.offset.pending.y+=r,this.offset.total.x+=i,this.offset.total.y+=r}function tM(e,i){var r=e.page,n=e.client,a=i.x,s=i.y;r.x+=a,r.y+=s,n.x+=a,n.y+=s}tm.offsetBy="";var tb={id:"offset",before:["modifiers","pointer-events","actions","inertia"],install:function(e){e.Interaction.prototype.offsetBy=tx},listeners:{"interactions:new":function(e){e.interaction.offset={total:{x:0,y:0},pending:{x:0,y:0}}},"interactions:update-pointer":function(e){var i;(i=e.interaction).pointerIsDown&&(tM(i.coords.cur,i.offset.total),i.offset.pending.x=0,i.offset.pending.y=0)},"interactions:before-action-start":t_,"interactions:before-action-move":t_,"interactions:before-action-end":function(e){var i=e.interaction;if(ty(i))return i.move({offset:!0}),i.end(),!1},"interactions:stop":function(e){var i=e.interaction;i.offset.total.x=0,i.offset.total.y=0,i.offset.pending.x=0,i.offset.pending.y=0}}},tS=function(){function e(i){a(this,e),this.active=!1,this.isModified=!1,this.smoothEnd=!1,this.allowResume=!1,this.modification=void 0,this.modifierCount=0,this.modifierArg=void 0,this.startCoords=void 0,this.t0=0,this.v0=0,this.te=0,this.targetOffset=void 0,this.modifiedOffset=void 0,this.currentOffset=void 0,this.lambda_v0=0,this.one_ve_v0=0,this.timeout=void 0,this.interaction=void 0,this.interaction=i}return o(e,[{key:"start",value:function(e){var i=this.interaction,r=tE(i);if(!r||!r.enabled)return!1;var n=i.coords.velocity.client,a=es(n.x,n.y),s=this.modification||(this.modification=new ts(i));if(s.copyFrom(i.modification),this.t0=i._now(),this.allowResume=r.allowResume,this.v0=a,this.currentOffset={x:0,y:0},this.startCoords=i.coords.cur.page,this.modifierArg=s.fillArg({pageCoords:this.startCoords,preEnd:!0,phase:"inertiastart"}),this.t0-i.coords.cur.timeStamp<50&&a>r.minSpeed&&a>r.endSpeed)this.startInertia();else{if(s.result=s.setAll(this.modifierArg),!s.result.changed)return!1;this.startSmoothEnd()}return i.modification.result.rect=null,i.offsetBy(this.targetOffset),i._doPhase({interaction:i,event:e,phase:"inertiastart"}),i.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),i.modification.result.rect=null,this.active=!0,i.simulation=this,!0}},{key:"startInertia",value:function(){var e=this,i=this.interaction.coords.velocity.client,r=tE(this.interaction),n=r.resistance,a=-Math.log(r.endSpeed/this.v0)/n;this.targetOffset={x:(i.x-a)/n,y:(i.y-a)/n},this.te=a,this.lambda_v0=n/this.v0,this.one_ve_v0=1-r.endSpeed/this.v0;var s=this.modification,o=this.modifierArg;o.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},s.result=s.setAll(o),s.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+s.result.delta.x,y:this.targetOffset.y+s.result.delta.y}),this.onNextFrame(function(){return e.inertiaTick()})}},{key:"startSmoothEnd",value:function(){var e=this;this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.onNextFrame(function(){return e.smoothEndTick()})}},{key:"onNextFrame",value:function(e){var i=this;this.timeout=eH(function(){i.active&&e()})}},{key:"inertiaTick",value:function(){var e,i,r,n,a=this,s=this.interaction,o=tE(s).resistance,l=(s._now()-this.t0)/1e3;if(l<this.te){var c,h=1-(Math.exp(-o*l)-this.lambda_v0)/this.one_ve_v0;this.isModified?(e=this.targetOffset.x,i=this.targetOffset.y,r=this.modifiedOffset.x,n=this.modifiedOffset.y,c={x:tT(h,0,e,r),y:tT(h,0,i,n)}):c={x:this.targetOffset.x*h,y:this.targetOffset.y*h};var u={x:c.x-this.currentOffset.x,y:c.y-this.currentOffset.y};this.currentOffset.x+=u.x,this.currentOffset.y+=u.y,s.offsetBy(u),s.move(),this.onNextFrame(function(){return a.inertiaTick()})}else s.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end()}},{key:"smoothEndTick",value:function(){var e=this,i=this.interaction,r=i._now()-this.t0,n=tE(i).smoothEndDuration;if(r<n){var a,s,o,l,c={x:(a=r,s=this.targetOffset.x,-s*(a/=n)*(a-2)+0),y:(o=r,l=this.targetOffset.y,-l*(o/=n)*(o-2)+0)},h={x:c.x-this.currentOffset.x,y:c.y-this.currentOffset.y};this.currentOffset.x+=h.x,this.currentOffset.y+=h.y,i.offsetBy(h),i.move({skipModifiers:this.modifierCount}),this.onNextFrame(function(){return e.smoothEndTick()})}else i.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end()}},{key:"resume",value:function(e){var i=e.pointer,r=e.event,n=e.eventTarget,a=this.interaction;a.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),a.updatePointer(i,r,n,!0),a._doPhase({interaction:a,event:r,phase:"resume"}),ec(a.coords.prev,a.coords.cur),this.stop()}},{key:"end",value:function(){this.interaction.move(),this.interaction.end(),this.stop()}},{key:"stop",value:function(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,eG(this.timeout)}}]),e}();function tE(e){var i=e.interactable,r=e.prepared;return i&&i.options&&r.name&&i.options[r.name].inertia}function tT(e,i,r,n){var a=1-e;return a*a*i+2*a*e*r+e*e*n}function tw(e,i){for(var r=0;r<i.length;r++){var n=i[r];if(e.immediatePropagationStopped)break;n(e)}}var tA=function(){function e(i){a(this,e),this.options=void 0,this.types={},this.propagationStopped=!1,this.immediatePropagationStopped=!1,this.global=void 0,this.options=Z({},i||{})}return o(e,[{key:"fire",value:function(e){var i,r=this.global;(i=this.types[e.type])&&tw(e,i),!e.propagationStopped&&r&&(i=r[e.type])&&tw(e,i)}},{key:"on",value:function(e,i){var r=en(e,i);for(e in r)this.types[e]=eS(this.types[e]||[],r[e])}},{key:"off",value:function(e,i){var r=en(e,i);for(e in r){var n=this.types[e];if(n&&n.length)for(var a=0,s=r[e];a<s.length;a++){var o=s[a],l=n.indexOf(o);-1!==l&&n.splice(l,1)}}}},{key:"getRect",value:function(e){return null}}]),e}(),tR=function(){function e(i){a(this,e),this.currentTarget=void 0,this.originalEvent=void 0,this.type=void 0,this.originalEvent=i,el(this,i)}return o(e,[{key:"preventOriginalDefault",value:function(){this.originalEvent.preventDefault()}},{key:"stopPropagation",value:function(){this.originalEvent.stopPropagation()}},{key:"stopImmediatePropagation",value:function(){this.originalEvent.stopImmediatePropagation()}}]),e}();function tC(e){return S(e)?{capture:!!e.capture,passive:!!e.passive}:{capture:!!e,passive:!1}}function tP(e,i){return e===i||("boolean"==typeof e?!!i.capture===e&&!1==!!i.passive:!!e.capture==!!i.capture&&!!e.passive==!!i.passive)}var tI={id:"events",install:function(e){var i,r=[],n={},a=[],s={add:o,remove:l,addDelegate:function(e,i,r,s,l){var u=tC(l);if(!n[r]){n[r]=[];for(var d=0;d<a.length;d++){var p=a[d];o(p,r,c),o(p,r,h,!0)}}var f=n[r],m=ew(f,function(r){return r.selector===e&&r.context===i});m||(m={selector:e,context:i,listeners:[]},f.push(m)),m.listeners.push({func:s,options:u})},removeDelegate:function(e,i,r,a,s){var o,u=tC(s),d=n[r],p=!1;if(d)for(o=d.length-1;o>=0;o--){var f=d[o];if(f.selector===e&&f.context===i){for(var m=f.listeners,g=m.length-1;g>=0;g--){var v=m[g];if(v.func===a&&tP(v.options,u)){m.splice(g,1),m.length||(d.splice(o,1),l(i,r,c),l(i,r,h,!0)),p=!0;break}}if(p)break}}},delegateListener:c,delegateUseCapture:h,delegatedEvents:n,documents:a,targets:r,supportsOptions:!1,supportsPassive:!1};function o(e,i,n,a){if(e.addEventListener){var o=tC(a),l=ew(r,function(i){return i.eventTarget===e});l||(l={eventTarget:e,events:{}},r.push(l)),l.events[i]||(l.events[i]=[]),ew(l.events[i],function(e){return e.func===n&&tP(e.options,o)})||(e.addEventListener(i,n,s.supportsOptions?o:o.capture),l.events[i].push({func:n,options:o}))}}function l(e,i,n,a){if(e.addEventListener&&e.removeEventListener){var o=eT(r,function(i){return i.eventTarget===e}),c=r[o];if(c&&c.events)if("all"!==i){var h=!1,u=c.events[i];if(u){if("all"===n){for(var d=u.length-1;d>=0;d--){var p=u[d];l(e,i,p.func,p.options)}return}for(var f=tC(a),m=0;m<u.length;m++){var g=u[m];if(g.func===n&&tP(g.options,f)){e.removeEventListener(i,n,s.supportsOptions?f:f.capture),u.splice(m,1),0===u.length&&(delete c.events[i],h=!0);break}}}h&&!Object.keys(c.events).length&&r.splice(o,1)}else for(i in c.events)c.events.hasOwnProperty(i)&&l(e,i,"all")}}function c(e,i){for(var r=tC(i),a=new tR(e),s=n[e.type],o=eM(e)[0],l=o;P(l);){for(var c=0;c<s.length;c++){var h=s[c],u=h.selector,d=h.context;if(H(l,u)&&z(d,o)&&z(d,l)){var p=h.listeners;a.currentTarget=l;for(var f=0;f<p.length;f++){var m=p[f];tP(m.options,r)&&m.func(a)}}}l=V(l)}}function h(e){return c(e,!0)}return null==(i=e.document)||i.createElement("div").addEventListener("test",null,{get capture(){return s.supportsOptions=!0},get passive(){return s.supportsPassive=!0}}),e.events=s,s}},tL={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(e){for(var i=0,r=tL.methodOrder;i<r.length;i++){var n=tL[r[i]](e);if(n)return n}return null},simulationResume:function(e){var i=e.pointerType,r=e.eventType,n=e.eventTarget,a=e.scope;if(!/down|start/i.test(r))return null;for(var s=0,o=a.interactions.list;s<o.length;s++){var l=o[s],c=n;if(l.simulation&&l.simulation.allowResume&&l.pointerType===i)for(;c;){if(c===l.element)return l;c=V(c)}}return null},mouseOrPen:function(e){var i,r=e.pointerId,n=e.pointerType,a=e.eventType,s=e.scope;if("mouse"!==n&&"pen"!==n)return null;for(var o=0,l=s.interactions.list;o<l.length;o++){var c=l[o];if(c.pointerType===n){if(c.simulation&&!tD(c,r))continue;if(c.interacting())return c;i||(i=c)}}if(i)return i;for(var h=0,u=s.interactions.list;h<u.length;h++){var d=u[h];if(!(d.pointerType!==n||/down/i.test(a)&&d.simulation))return d}return null},hasPointer:function(e){for(var i=e.pointerId,r=0,n=e.scope.interactions.list;r<n.length;r++){var a=n[r];if(tD(a,i))return a}return null},idle:function(e){for(var i=e.pointerType,r=0,n=e.scope.interactions.list;r<n.length;r++){var a=n[r];if(1===a.pointers.length){var s=a.interactable;if(s&&(!s.options.gesture||!s.options.gesture.enabled))continue}else if(a.pointers.length>=2)continue;if(!a.interacting()&&i===a.pointerType)return a}return null}};function tD(e,i){return e.pointers.some(function(e){return e.id===i})}var tU=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer","windowBlur"];function tN(e,i){return function(r){var n=i.interactions.list,a=ex(r),s=eM(r),o=s[0],l=s[1],c=[];if(/^touch/.test(r.type)){i.prevTouchTime=i.now();for(var h=0,u=r.changedTouches;h<u.length;h++){var d=u[h],p={pointer:d,pointerId:ef(d),pointerType:a,eventType:r.type,eventTarget:o,curEventTarget:l,scope:i},f=tO(p);c.push([p.pointer,p.eventTarget,p.curEventTarget,f])}}else{var m=!1;if(!B.supportsPointerEvent&&/mouse/.test(r.type)){for(var g=0;g<n.length&&!m;g++)m="mouse"!==n[g].pointerType&&n[g].pointerIsDown;m=m||i.now()-i.prevTouchTime<500||0===r.timeStamp}if(!m){var v={pointer:r,pointerId:ef(r),pointerType:a,eventType:r.type,curEventTarget:l,eventTarget:o,scope:i},_=tO(v);c.push([v.pointer,v.eventTarget,v.curEventTarget,_])}}for(var y=0;y<c.length;y++){var x=c[y],M=x[0],b=x[1],S=x[2];x[3][e](M,r,b,S)}}}function tO(e){var i=e.pointerType,r=e.scope,n={interaction:tL.search(e),searchDetails:e};return r.fire("interactions:find",n),n.interaction||r.interactions.new({pointerType:i})}function tF(e,i){var r=e.doc,n=e.scope,a=e.options,s=n.interactions.docEvents,o=n.events,l=o[i];for(var c in n.browser.isIOS&&!a.events&&(a.events={passive:!1}),o.delegatedEvents)l(r,c,o.delegateListener),l(r,c,o.delegateUseCapture,!0);for(var h=a&&a.events,u=0;u<s.length;u++){var d=s[u];l(r,d.type,d.listener,h)}}var tB={id:"core/interactions",install:function(e){for(var i={},r=0;r<tU.length;r++){var n=tU[r];i[n]=tN(n,e)}var s,c=B.pEventTypes;function h(){for(var i=0,r=e.interactions.list;i<r.length;i++){var n=r[i];if(n.pointerIsDown&&"touch"===n.pointerType&&!n._interacting)for(var a=0,s=n.pointers;a<s.length;a++)!function(){var i=s[a];e.documents.some(function(e){return z(e.doc,i.downTarget)})||n.removePointer(i.pointer,i.event)}()}}(s=O.PointerEvent?[{type:c.down,listener:h},{type:c.down,listener:i.pointerDown},{type:c.move,listener:i.pointerMove},{type:c.up,listener:i.pointerUp},{type:c.cancel,listener:i.pointerUp}]:[{type:"mousedown",listener:i.pointerDown},{type:"mousemove",listener:i.pointerMove},{type:"mouseup",listener:i.pointerUp},{type:"touchstart",listener:h},{type:"touchstart",listener:i.pointerDown},{type:"touchmove",listener:i.pointerMove},{type:"touchend",listener:i.pointerUp},{type:"touchcancel",listener:i.pointerUp}]).push({type:"blur",listener:function(i){for(var r=0,n=e.interactions.list;r<n.length;r++)n[r].documentBlur(i)}}),e.prevTouchTime=0,e.Interaction=function(i){l(n,i);var r=d(n);function n(){return a(this,n),r.apply(this,arguments)}return o(n,[{key:"pointerMoveTolerance",get:function(){return e.interactions.pointerMoveTolerance},set:function(i){e.interactions.pointerMoveTolerance=i}},{key:"_now",value:function(){return e.now()}}]),n}(tv),e.interactions={list:[],new:function(i){i.scopeFire=function(i,r){return e.fire(i,r)};var r=new e.Interaction(i);return e.interactions.list.push(r),r},listeners:i,docEvents:s,pointerMoveTolerance:1},e.usePlugin(tr)},listeners:{"scope:add-document":function(e){return tF(e,"add")},"scope:remove-document":function(e){return tF(e,"remove")},"interactable:unset":function(e,i){for(var r=e.interactable,n=i.interactions.list.length-1;n>=0;n--){var a=i.interactions.list[n];a.interactable===r&&(a.stop(),i.fire("interactions:destroy",{interaction:a}),a.destroy(),i.interactions.list.length>2&&i.interactions.list.splice(n,1))}}},onDocSignal:tF,doOnInteractions:tN,methodNames:tU},tz=((v=tz||{})[v.On=0]="On",v[v.Off=1]="Off",v),tk=function(){function e(i,r,n,s){a(this,e),this.target=void 0,this.options=void 0,this._actions=void 0,this.events=new tA,this._context=void 0,this._win=void 0,this._doc=void 0,this._scopeEvents=void 0,this._actions=r.actions,this.target=i,this._context=r.context||n,this._win=b(J(i)?this._context:i),this._doc=this._win.document,this._scopeEvents=s,this.set(r)}return o(e,[{key:"_defaults",get:function(){return{base:{},perAction:{},actions:{}}}},{key:"setOnEvents",value:function(e,i){return E(i.onstart)&&this.on("".concat(e,"start"),i.onstart),E(i.onmove)&&this.on("".concat(e,"move"),i.onmove),E(i.onend)&&this.on("".concat(e,"end"),i.onend),E(i.oninertiastart)&&this.on("".concat(e,"inertiastart"),i.oninertiastart),this}},{key:"updatePerActionListeners",value:function(e,i,r){var n,a=this,s=null==(n=this._actions.map[e])?void 0:n.filterEventType,o=function(e){return(null==s||s(e))&&tn(e,a._actions)};(L(i)||S(i))&&this._onOff(tz.Off,e,i,void 0,o),(L(r)||S(r))&&this._onOff(tz.On,e,r,void 0,o)}},{key:"setPerAction",value:function(e,i){var r=this._defaults;for(var n in i){var a=this.options[e],s=i[n];"listeners"===n&&this.updatePerActionListeners(e,a.listeners,s),L(s)?a[n]=eE(s):I(s)?(a[n]=Z(a[n]||{},ta(s)),S(r.perAction[n])&&"enabled"in r.perAction[n]&&(a[n].enabled=!1!==s.enabled)):R(s)&&S(r.perAction[n])?a[n].enabled=s:a[n]=s}}},{key:"getRect",value:function(e){return e=e||(P(this.target)?this.target:null),C(this.target)&&(e=e||this._context.querySelector(this.target)),Y(e)}},{key:"rectChecker",value:function(e){var i=this;return E(e)?(this.getRect=function(r){var n=Z({},e.apply(i,r));return"width"in n||(n.width=n.right-n.left,n.height=n.bottom-n.top),n},this):null===e?(delete this.getRect,this):this.getRect}},{key:"_backCompatOption",value:function(e,i){if(J(i)||S(i)){for(var r in this.options[e]=i,this._actions.map)this.options[r][e]=i;return this}return this.options[e]}},{key:"origin",value:function(e){return this._backCompatOption("origin",e)}},{key:"deltaSource",value:function(e){return"page"===e||"client"===e?(this.options.deltaSource=e,this):this.options.deltaSource}},{key:"getAllElements",value:function(){var e=this.target;return C(e)?Array.from(this._context.querySelectorAll(e)):E(e)&&e.getAllElements?e.getAllElements():P(e)?[e]:[]}},{key:"context",value:function(){return this._context}},{key:"inContext",value:function(e){return this._context===e.ownerDocument||z(this._context,e)}},{key:"testIgnoreAllow",value:function(e,i,r){return!this.testIgnore(e.ignoreFrom,i,r)&&this.testAllow(e.allowFrom,i,r)}},{key:"testAllow",value:function(e,i,r){return!e||!!P(r)&&(C(e)?X(r,e,i):!!P(e)&&z(e,r))}},{key:"testIgnore",value:function(e,i,r){return!(!e||!P(r))&&(C(e)?X(r,e,i):!!P(e)&&z(e,r))}},{key:"fire",value:function(e){return this.events.fire(e),this}},{key:"_onOff",value:function(e,i,r,n,a){S(i)&&!L(i)&&(n=r,r=null);var s=en(i,r,a);for(var o in s){"wheel"===o&&(o=B.wheelEvent);for(var l=0,c=s[o];l<c.length;l++){var h=c[l];tn(o,this._actions)?this.events[e===tz.On?"on":"off"](o,h):C(this.target)?this._scopeEvents[e===tz.On?"addDelegate":"removeDelegate"](this.target,this._context,o,h,n):this._scopeEvents[e===tz.On?"add":"remove"](this.target,o,h,n)}}return this}},{key:"on",value:function(e,i,r){return this._onOff(tz.On,e,i,r)}},{key:"off",value:function(e,i,r){return this._onOff(tz.Off,e,i,r)}},{key:"set",value:function(e){var i=this._defaults;for(var r in S(e)||(e={}),this.options=ta(i.base),this._actions.methodDict){var n=this._actions.methodDict[r];this.options[r]={},this.setPerAction(r,Z(Z({},i.perAction),i.actions[r])),this[n](e[r])}for(var a in e)"getRect"!==a?E(this[a])&&this[a](e[a]):this.rectChecker(e.getRect);return this}},{key:"unset",value:function(){if(C(this.target))for(var e in this._scopeEvents.delegatedEvents)for(var i=this._scopeEvents.delegatedEvents[e],r=i.length-1;r>=0;r--){var n=i[r],a=n.selector,s=n.context,o=n.listeners;a===this.target&&s===this._context&&i.splice(r,1);for(var l=o.length-1;l>=0;l--)this._scopeEvents.removeDelegate(this.target,this._context,e,o[l][0],o[l][1])}else this._scopeEvents.remove(this.target,"all")}}]),e}(),tV=function(){function e(i){var r=this;a(this,e),this.list=[],this.selectorMap={},this.scope=void 0,this.scope=i,i.addListeners({"interactable:unset":function(e){var i=e.interactable,n=i.target,a=C(n)?r.selectorMap[n]:n[r.scope.id],s=eT(a,function(e){return e===i});a.splice(s,1)}})}return o(e,[{key:"new",value:function(e,i){i=Z(i||{},{actions:this.scope.actions});var r=new this.scope.Interactable(e,i,this.scope.document,this.scope.events);return this.scope.addDocument(r._doc),this.list.push(r),C(e)?(this.selectorMap[e]||(this.selectorMap[e]=[]),this.selectorMap[e].push(r)):(r.target[this.scope.id]||Object.defineProperty(e,this.scope.id,{value:[],configurable:!0}),e[this.scope.id].push(r)),this.scope.fire("interactable:new",{target:e,options:i,interactable:r,win:this.scope._win}),r}},{key:"getExisting",value:function(e,i){var r=i&&i.context||this.scope.document,n=C(e),a=n?this.selectorMap[e]:e[this.scope.id];if(a)return ew(a,function(i){return i._context===r&&(n||i.inContext(e))})}},{key:"forEachMatch",value:function(e,i){for(var r=0,n=this.list;r<n.length;r++){var a=n[r],s=void 0;if((C(a.target)?P(e)&&H(e,a.target):e===a.target)&&a.inContext(e)&&(s=i(a)),void 0!==s)return s}}}]),e}();function tH(e){return e&&e.replace(/\/.*$/,"")}var tG=new(function(){function e(){var i,r,n=this;a(this,e),this.id="__interact_scope_".concat(Math.floor(100*Math.random())),this.isInitialized=!1,this.listenerMaps=[],this.browser=B,this.defaults=ta(tu),this.Eventable=tA,this.actions={map:{},phases:{start:!0,move:!0,end:!0},methodDict:{},phaselessTypes:{}},this.interactStatic=(i=this,(r=function e(r,n){var a=i.interactables.getExisting(r,n);return a||((a=i.interactables.new(r,n)).events.global=e.globalEvents),a}).getPointerAverage=eg,r.getTouchBBox=ev,r.getTouchDistance=e_,r.getTouchAngle=ey,r.getElementRect=Y,r.getElementClientRect=q,r.matchesSelector=H,r.closest=k,r.globalEvents={},r.version="1.10.27",r.scope=i,r.use=function(e,i){return this.scope.usePlugin(e,i),this},r.isSet=function(e,i){return!!this.scope.interactables.get(e,i&&i.context)},r.on=eK(function(e,i,r){if(C(e)&&-1!==e.search(" ")&&(e=e.trim().split(/ +/)),L(e)){for(var n=0,a=e;n<a.length;n++){var s=a[n];this.on(s,i,r)}return this}if(S(e)){for(var o in e)this.on(o,e[o],i);return this}return tn(e,this.scope.actions)?this.globalEvents[e]?this.globalEvents[e].push(i):this.globalEvents[e]=[i]:this.scope.events.add(this.scope.document,e,i,{options:r}),this},"The interact.on() method is being deprecated"),r.off=eK(function(e,i,r){if(C(e)&&-1!==e.search(" ")&&(e=e.trim().split(/ +/)),L(e)){for(var n,a=0,s=e;a<s.length;a++){var o=s[a];this.off(o,i,r)}return this}if(S(e)){for(var l in e)this.off(l,e[l],i);return this}return tn(e,this.scope.actions)?e in this.globalEvents&&-1!==(n=this.globalEvents[e].indexOf(i))&&this.globalEvents[e].splice(n,1):this.scope.events.remove(this.scope.document,e,i,r),this},"The interact.off() method is being deprecated"),r.debug=function(){return this.scope},r.supportsTouch=function(){return B.supportsTouch},r.supportsPointerEvent=function(){return B.supportsPointerEvent},r.stop=function(){for(var e=0,i=this.scope.interactions.list;e<i.length;e++)i[e].stop();return this},r.pointerMoveTolerance=function(e){return A(e)?(this.scope.interactions.pointerMoveTolerance=e,this):this.scope.interactions.pointerMoveTolerance},r.addDocument=function(e,i){this.scope.addDocument(e,i)},r.removeDocument=function(e){this.scope.removeDocument(e)},r),this.InteractEvent=td,this.Interactable=void 0,this.interactables=new tV(this),this._win=void 0,this.document=void 0,this.window=void 0,this.documents=[],this._plugins={list:[],map:{}},this.onWindowUnload=function(e){return n.removeDocument(e.target)};var s=this;this.Interactable=function(e){l(r,e);var i=d(r);function r(){return a(this,r),i.apply(this,arguments)}return o(r,[{key:"_defaults",get:function(){return s.defaults}},{key:"set",value:function(e){return p(c(r.prototype),"set",this).call(this,e),s.fire("interactable:set",{options:e,interactable:this}),this}},{key:"unset",value:function(){p(c(r.prototype),"unset",this).call(this);var e=s.interactables.list.indexOf(this);e<0||(s.interactables.list.splice(e,1),s.fire("interactable:unset",{interactable:this}))}}]),r}(tk)}return o(e,[{key:"addListeners",value:function(e,i){this.listenerMaps.push({id:i,map:e})}},{key:"fire",value:function(e,i){for(var r=0,n=this.listenerMaps;r<n.length;r++){var a=n[r].map[e];if(a&&!1===a(i,this,e))return!1}}},{key:"init",value:function(e){return this.isInitialized||(this.isInitialized=!0,T(e)&&M(e),O.init(e),B.init(e),eW(e),this.window=e,this.document=e.document,this.usePlugin(tB),this.usePlugin(tI)),this}},{key:"pluginIsInstalled",value:function(e){var i=e.id;return i?!!this._plugins.map[i]:-1!==this._plugins.list.indexOf(e)}},{key:"usePlugin",value:function(e,i){if(!this.isInitialized||this.pluginIsInstalled(e))return this;if(e.id&&(this._plugins.map[e.id]=e),this._plugins.list.push(e),e.install&&e.install(this,i),e.listeners&&e.before){for(var r=0,n=this.listenerMaps.length,a=e.before.reduce(function(e,i){return e[i]=!0,e[tH(i)]=!0,e},{});r<n;r++){var s=this.listenerMaps[r].id;if(s&&(a[s]||a[tH(s)]))break}this.listenerMaps.splice(r,0,{id:e.id,map:e.listeners})}else e.listeners&&this.listenerMaps.push({id:e.id,map:e.listeners});return this}},{key:"addDocument",value:function(e,i){if(-1!==this.getDocIndex(e))return!1;var r=b(e);i=i?Z({},i):{},this.documents.push({doc:e,options:i}),this.events.documents.push(e),e!==this.document&&this.events.add(r,"unload",this.onWindowUnload),this.fire("scope:add-document",{doc:e,window:r,scope:this,options:i})}},{key:"removeDocument",value:function(e){var i=this.getDocIndex(e),r=b(e),n=this.documents[i].options;this.events.remove(r,"unload",this.onWindowUnload),this.documents.splice(i,1),this.events.documents.splice(i,1),this.fire("scope:remove-document",{doc:e,window:r,scope:this,options:n})}},{key:"getDocIndex",value:function(e){for(var i=0;i<this.documents.length;i++)if(this.documents[i].doc===e)return i;return -1}},{key:"getDocOptions",value:function(e){var i=this.getDocIndex(e);return -1===i?null:this.documents[i].options}},{key:"now",value:function(){return(this.window.Date||Date).now()}}]),e}()),tW=tG.interactStatic,tX="undefined"!=typeof globalThis?globalThis:window;tG.init(tX);var tj=Object.freeze({__proto__:null,edgeTarget:function(){},elements:function(){},grid:function(e){var i=[["x","y"],["left","top"],["right","bottom"],["width","height"]].filter(function(i){var r=i[0],n=i[1];return r in e||n in e}),r=function(r,n){for(var a=e.range,s=e.limits,o=void 0===s?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:s,l=e.offset,c=void 0===l?{x:0,y:0}:l,h={range:a,grid:e,x:null,y:null},u=0;u<i.length;u++){var d=i[u],p=d[0],f=d[1],m=Math.round((r-c.x)/e[p]),g=Math.round((n-c.y)/e[f]);h[p]=Math.max(o.left,Math.min(o.right,m*e[p]+c.x)),h[f]=Math.max(o.top,Math.min(o.bottom,g*e[f]+c.y))}return h};return r.grid=e,r.coordFields=i,r}}),tq={id:"snappers",install:function(e){var i=e.interactStatic;i.snappers=Z(i.snappers||{},tj),i.createSnapGrid=i.snappers.grid}};function tY(e,i,r){var n=e.startCoords,a=e.edgeSign;i?r.y=n.y+(r.x-n.x)*a.y:r.x=n.x+(r.y-n.y)*a.x}function tK(e,i,r,n){var a=e.startRect,s=e.startCoords,o=e.ratio,l=e.edgeSign;if(i){var c=n.width/o;r.y=s.y+(c-a.height)*l.y}else{var h=n.height*o;r.x=s.x+(h-a.width)*l.x}}var tJ=tl({start:function(e){var i=e.state,n=e.rect,a=e.edges,s=e.pageCoords,o=i.options,l=o.ratio,c=o.enabled,h=i.options,u=h.equalDelta,d=h.modifiers;"preserve"===l&&(l=n.width/n.height),i.startCoords=Z({},s),i.startRect=Z({},n),i.ratio=l,i.equalDelta=u;var p=i.linkedEdges={top:a.top||a.left&&!a.bottom,left:a.left||a.top&&!a.right,bottom:a.bottom||a.right&&!a.top,right:a.right||a.bottom&&!a.left};if(i.xIsPrimaryAxis=!(!a.left&&!a.right),i.equalDelta){var f=(p.left?1:-1)*(p.top?1:-1);i.edgeSign={x:f,y:f}}else i.edgeSign={x:p.left?-1:1,y:p.top?-1:1};if(!1!==c&&Z(a,p),null!=d&&d.length){var m=new ts(e.interaction);m.copyFrom(e.interaction.modification),m.prepareStates(d),i.subModification=m,m.startAll(r({},e))}},set:function(e){var i=e.state,n=e.rect,a=e.coords,s=i.linkedEdges,o=Z({},a),l=i.equalDelta?tY:tK;if(Z(e.edges,s),l(i,i.xIsPrimaryAxis,a,n),!i.subModification)return null;var c=Z({},n);ei(s,c,{x:a.x-o.x,y:a.y-o.y});var h=i.subModification.setAll(r(r({},e),{},{rect:c,edges:s,pageCoords:a,prevCoords:a,prevRect:c})),u=h.delta;return h.changed&&(l(i,Math.abs(u.x)>Math.abs(u.y),h.coords,h.rect),Z(a,h.coords)),h.eventProps},defaults:{ratio:"preserve",equalDelta:!1,modifiers:[],enabled:!1}},"aspectRatio"),tZ=function(){};function tQ(e,i,r){return E(e)?$(e,i.interactable,i.element,[r.x,r.y,i]):$(e,i.interactable,i.element)}tZ._defaults={};var t$={start:function(e){var i=e.rect,r=e.startOffset,n=e.state,a=e.interaction,s=e.pageCoords,o=n.options,l=o.elementRect,c=Z({left:0,top:0,right:0,bottom:0},o.offset||{});if(i&&l){var h=tQ(o.restriction,a,s);if(h){var u=h.right-h.left-i.width,d=h.bottom-h.top-i.height;u<0&&(c.left+=u,c.right+=u),d<0&&(c.top+=d,c.bottom+=d)}c.left+=r.left-i.width*l.left,c.top+=r.top-i.height*l.top,c.right+=r.right-i.width*(1-l.right),c.bottom+=r.bottom-i.height*(1-l.bottom)}n.offset=c},set:function(e){var i=e.coords,r=e.interaction,n=e.state,a=n.options,s=n.offset,o=tQ(a.restriction,r,i);if(o){var l,c=(!(l=o)||"left"in l&&"top"in l||((l=Z({},l)).left=l.x||0,l.top=l.y||0,l.right=l.right||l.left+l.width,l.bottom=l.bottom||l.top+l.height),l);i.x=Math.max(Math.min(c.right-s.right,i.x),c.left+s.left),i.y=Math.max(Math.min(c.bottom-s.bottom,i.y),c.top+s.top)}},defaults:{restriction:null,elementRect:null,offset:null,endOnly:!1,enabled:!1}},t0=tl(t$,"restrict"),t1={top:1/0,left:1/0,bottom:-1/0,right:-1/0},t2={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function t3(e,i){for(var r=0,n=["top","left","bottom","right"];r<n.length;r++){var a=n[r];a in e||(e[a]=i[a])}return e}var t4={noInner:t1,noOuter:t2,start:function(e){var i,r=e.interaction,n=e.startOffset,a=e.state,s=a.options;s&&(i=ee(tQ(s.offset,r,r.coords.start.page))),a.offset={top:(i=i||{x:0,y:0}).y+n.top,left:i.x+n.left,bottom:i.y-n.bottom,right:i.x-n.right}},set:function(e){var i=e.coords,r=e.edges,n=e.interaction,a=e.state,s=a.offset,o=a.options;if(r){var l=Z({},i),c=tQ(o.inner,n,l)||{},h=tQ(o.outer,n,l)||{};t3(c,t1),t3(h,t2),r.top?i.y=Math.min(Math.max(h.top+s.top,l.y),c.top+s.top):r.bottom&&(i.y=Math.max(Math.min(h.bottom+s.bottom,l.y),c.bottom+s.bottom)),r.left?i.x=Math.min(Math.max(h.left+s.left,l.x),c.left+s.left):r.right&&(i.x=Math.max(Math.min(h.right+s.right,l.x),c.right+s.right))}},defaults:{inner:null,outer:null,offset:null,endOnly:!1,enabled:!1}},t5=tl(t4,"restrictEdges"),t6=Z({get elementRect(){return{top:0,left:0,bottom:1,right:1}},set elementRect(t){}},t$.defaults),t9=tl({start:t$.start,set:t$.set,defaults:t6},"restrictRect"),t8={width:-1/0,height:-1/0},t7={width:1/0,height:1/0},ie=tl({start:function(e){return t4.start(e)},set:function(e){var i=e.interaction,r=e.state,n=e.rect,a=e.edges,s=r.options;if(a){var o=et(tQ(s.min,i,e.coords))||t8,l=et(tQ(s.max,i,e.coords))||t7;r.options={endOnly:s.endOnly,inner:Z({},t4.noInner),outer:Z({},t4.noOuter)},a.top?(r.options.inner.top=n.bottom-o.height,r.options.outer.top=n.bottom-l.height):a.bottom&&(r.options.inner.bottom=n.top+o.height,r.options.outer.bottom=n.top+l.height),a.left?(r.options.inner.left=n.right-o.width,r.options.outer.left=n.right-l.width):a.right&&(r.options.inner.right=n.left+o.width,r.options.outer.right=n.left+l.width),t4.set(e),r.options=s}},defaults:{min:null,max:null,endOnly:!1,enabled:!1}},"restrictSize"),it={start:function(e){var i,r,n=e.interaction,a=e.interactable,s=e.element,o=e.rect,l=e.state,c=e.startOffset,h=l.options,u=h.offsetWithOrigin?(i=e.interaction.element,ee($(e.state.options.origin,null,null,[i]))||er(e.interactable,i,e.interaction.prepared.name)):{x:0,y:0};if("startCoords"===h.offset)r={x:n.coords.start.page.x,y:n.coords.start.page.y};else{var d=$(h.offset,a,s,[n]);(r=ee(d)||{x:0,y:0}).x+=u.x,r.y+=u.y}var p=h.relativePoints;l.offsets=o&&p&&p.length?p.map(function(e,i){return{index:i,relativePoint:e,x:c.left-o.width*e.x+r.x,y:c.top-o.height*e.y+r.y}}):[{index:0,relativePoint:null,x:r.x,y:r.y}]},set:function(e){var i=e.interaction,r=e.coords,n=e.state,a=n.options,s=n.offsets,o=er(i.interactable,i.element,i.prepared.name),l=Z({},r),c=[];a.offsetWithOrigin||(l.x-=o.x,l.y-=o.y);for(var h=0;h<s.length;h++)for(var u=s[h],d=l.x-u.x,p=l.y-u.y,f=0,m=a.targets.length;f<m;f++){var g=a.targets[f],v=void 0;(v=E(g)?g(d,p,i._proxy,u,f):g)&&c.push({x:(A(v.x)?v.x:d)+u.x,y:(A(v.y)?v.y:p)+u.y,range:A(v.range)?v.range:a.range,source:g,index:f,offset:u})}for(var _={target:null,inRange:!1,distance:0,range:0,delta:{x:0,y:0}},y=0;y<c.length;y++){var x=c[y],M=x.range,b=x.x-l.x,S=x.y-l.y,T=es(b,S),w=T<=M;M===1/0&&_.inRange&&_.range!==1/0&&(w=!1),(!_.target||(w?_.inRange&&M!==1/0?T/M<_.distance/_.range:M===1/0&&_.range!==1/0||T<_.distance:!_.inRange&&T<_.distance))&&(_.target=x,_.distance=T,_.range=M,_.inRange=w,_.delta.x=b,_.delta.y=S)}return _.inRange&&(r.x=_.target.x,r.y=_.target.y),n.closest=_,_},defaults:{range:1/0,targets:null,offset:null,offsetWithOrigin:!0,origin:null,relativePoints:null,endOnly:!1,enabled:!1}},ii=tl(it,"snap"),ir={start:function(e){var i=e.state,r=e.edges,n=i.options;if(!r)return null;e.state={options:{targets:null,relativePoints:[{x:+!r.left,y:+!r.top}],offset:n.offset||"self",origin:{x:0,y:0},range:n.range}},i.targetFields=i.targetFields||[["width","height"],["x","y"]],it.start(e),i.offsets=e.state.offsets,e.state=i},set:function(e){var i=e.interaction,r=e.state,n=e.coords,a=r.options,s=r.offsets,o={x:n.x-s[0].x,y:n.y-s[0].y};r.options=Z({},a),r.options.targets=[];for(var l=0,c=a.targets||[];l<c.length;l++){var h=c[l],u=void 0;if(u=E(h)?h(o.x,o.y,i):h){for(var d=0,p=r.targetFields;d<p.length;d++){var f=p[d],m=f[0],g=f[1];if(m in u||g in u){u.x=u[m],u.y=u[g];break}}r.options.targets.push(u)}}var v=it.set(e);return r.options=a,v},defaults:{range:1/0,targets:null,offset:null,endOnly:!1,enabled:!1}},ia=tl(ir,"snapSize"),is={aspectRatio:tJ,restrictEdges:t5,restrict:t0,restrictRect:t9,restrictSize:ie,snapEdges:tl({start:function(e){var i=e.edges;return i?(e.state.targetFields=e.state.targetFields||[[i.left?"left":"right",i.top?"top":"bottom"]],ir.start(e)):null},set:ir.set,defaults:Z(ta(ir.defaults),{targets:void 0,range:void 0,offset:{x:0,y:0}})},"snapEdges"),snap:ii,snapSize:ia,spring:tZ,avoid:tZ,transform:tZ,rubberband:tZ},io=function(e){l(r,e);var i=d(r);function r(e,n,s,o,l,c){var h;if(a(this,r),el(u(h=i.call(this,l)),s),s!==n&&el(u(h),n),h.timeStamp=c,h.originalEvent=s,h.type=e,h.pointerId=ef(n),h.pointerType=ex(n),h.target=o,h.currentTarget=null,"tap"===e){var d=l.getPointerIndex(n);h.dt=h.timeStamp-l.pointers[d].downTime;var p=h.timeStamp-l.tapTime;h.double=!!l.prevTap&&"doubletap"!==l.prevTap.type&&l.prevTap.target===h.target&&p<500}else"doubletap"===e&&(h.dt=n.timeStamp-l.tapTime,h.double=!0);return h}return o(r,[{key:"_subtractOrigin",value:function(e){var i=e.x,r=e.y;return this.pageX-=i,this.pageY-=r,this.clientX-=i,this.clientY-=r,this}},{key:"_addOrigin",value:function(e){var i=e.x,r=e.y;return this.pageX+=i,this.pageY+=r,this.clientX+=i,this.clientY+=r,this}},{key:"preventDefault",value:function(){this.originalEvent.preventDefault()}}]),r}(eb),il={id:"pointer-events/base",before:["inertia","modifiers","auto-start","actions"],install:function(e){e.pointerEvents=il,e.defaults.actions.pointerEvents=il.defaults,Z(e.actions.phaselessTypes,il.types)},listeners:{"interactions:new":function(e){var i=e.interaction;i.prevTap=null,i.tapTime=0},"interactions:update-pointer":function(e){var i=e.down,r=e.pointerInfo;(i||!r.hold)&&(r.hold={duration:1/0,timeout:null})},"interactions:move":function(e,i){var r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget;e.duplicate||r.pointerIsDown&&!r.pointerWasMoved||(r.pointerIsDown&&iu(e),ic({interaction:r,pointer:n,event:a,eventTarget:s,type:"move"},i))},"interactions:down":function(e,i){!function(e,i){for(var r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget,o=e.pointerIndex,l=r.pointers[o].hold,c=K(s),h={interaction:r,pointer:n,event:a,eventTarget:s,type:"hold",targets:[],path:c,node:null},u=0;u<c.length;u++)h.node=c[u],i.fire("pointerEvents:collect-targets",h);if(h.targets.length){for(var d=1/0,p=0,f=h.targets;p<f.length;p++){var m=f[p].eventable.options.holdDuration;m<d&&(d=m)}l.duration=d,l.timeout=setTimeout(function(){ic({interaction:r,eventTarget:s,pointer:n,event:a,type:"hold"},i)},d)}}(e,i),ic(e,i)},"interactions:up":function(e,i){var r,n,a,s;iu(e),ic(e,i),r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget,r.pointerWasMoved||ic({interaction:r,eventTarget:s,pointer:n,event:a,type:"tap"},i)},"interactions:cancel":function(e,i){iu(e),ic(e,i)}},PointerEvent:io,fire:ic,collectEventTargets:ih,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:{down:!0,move:!0,up:!0,cancel:!0,tap:!0,doubletap:!0,hold:!0}};function ic(e,i){var r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget,o=e.type,l=e.targets,c=void 0===l?ih(e,i):l,h=new io(o,n,a,s,r,i.now());i.fire("pointerEvents:new",{pointerEvent:h});for(var u=0;u<c.length;u++){var d=c[u];for(var p in d.props||{})h[p]=d.props[p];var f=er(d.eventable,d.node);if(h._subtractOrigin(f),h.eventable=d.eventable,h.currentTarget=d.node,d.eventable.fire(h),h._addOrigin(f),h.immediatePropagationStopped||h.propagationStopped&&u+1<c.length&&c[u+1].node!==h.currentTarget)break}if(i.fire("pointerEvents:fired",{interaction:r,pointer:n,event:a,eventTarget:s,targets:c,type:o,pointerEvent:h}),"tap"===o){var m=h.double?ic({interaction:r,pointer:n,event:a,eventTarget:s,type:"doubletap"},i):h;r.prevTap=m,r.tapTime=m.timeStamp}return h}function ih(e,i){var r=e.interaction,n=e.pointer,a=e.event,s=e.eventTarget,o=e.type,l=r.getPointerIndex(n),c=r.pointers[l];if("tap"===o&&(r.pointerWasMoved||!c||c.downTarget!==s))return[];for(var h=K(s),u={interaction:r,pointer:n,event:a,eventTarget:s,type:o,path:h,targets:[],node:null},d=0;d<h.length;d++)u.node=h[d],i.fire("pointerEvents:collect-targets",u);return"hold"===o&&(u.targets=u.targets.filter(function(e){var i,n;return e.eventable.options.holdDuration===(null==(i=r.pointers[l])||null==(n=i.hold)?void 0:n.duration)})),u.targets}function iu(e){var i=e.interaction,r=e.pointerIndex,n=i.pointers[r].hold;n&&n.timeout&&(clearTimeout(n.timeout),n.timeout=null)}var id=Object.freeze({__proto__:null,default:il});function ip(e){var i=e.interaction;i.holdIntervalHandle&&(clearInterval(i.holdIntervalHandle),i.holdIntervalHandle=null)}var im={id:"pointer-events/holdRepeat",install:function(e){e.usePlugin(il);var i=e.pointerEvents;i.defaults.holdRepeatInterval=0,i.types.holdrepeat=e.actions.phaselessTypes.holdrepeat=!0},listeners:["move","up","cancel","endall"].reduce(function(e,i){return e["pointerEvents:".concat(i)]=ip,e},{"pointerEvents:new":function(e){var i=e.pointerEvent;"hold"===i.type&&(i.count=(i.count||0)+1)},"pointerEvents:fired":function(e,i){var r=e.interaction,n=e.pointerEvent,a=e.eventTarget,s=e.targets;if("hold"===n.type&&s.length){var o=s[0].eventable.options.holdRepeatInterval;o<=0||(r.holdIntervalHandle=setTimeout(function(){i.pointerEvents.fire({interaction:r,eventTarget:a,type:"hold",pointer:n,event:n},i)},o))}}})},ig={id:"pointer-events/interactableTargets",install:function(e){var i=e.Interactable;i.prototype.pointerEvents=function(e){return Z(this.events.options,e),this};var r=i.prototype._backCompatOption;i.prototype._backCompatOption=function(e,i){var n=r.call(this,e,i);return n===this&&(this.events.options[e]=i),n}},listeners:{"pointerEvents:collect-targets":function(e,i){var r=e.targets,n=e.node,a=e.type,s=e.eventTarget;i.interactables.forEachMatch(n,function(e){var i=e.events,o=i.options;i.types[a]&&i.types[a].length&&e.testIgnoreAllow(o,n,s)&&r.push({node:n,eventable:i,props:{interactable:e}})})},"interactable:new":function(e){var i=e.interactable;i.events.getRect=function(e){return i.getRect(e)}},"interactable:set":function(e,i){var r=e.interactable,n=e.options;Z(r.events.options,i.pointerEvents.defaults),Z(r.events.options,n.pointerEvents||{})}}};if(tW.use(tr),tW.use(tb),tW.use({id:"pointer-events",install:function(e){e.usePlugin(id),e.usePlugin(im),e.usePlugin(ig)}}),tW.use({id:"inertia",before:["modifiers","actions"],install:function(e){var i=e.defaults;e.usePlugin(tb),e.usePlugin(th),e.actions.phases.inertiastart=!0,e.actions.phases.resume=!0,i.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300}},listeners:{"interactions:new":function(e){var i=e.interaction;i.inertia=new tS(i)},"interactions:before-action-end":function(e){var i=e.interaction,r=e.event;return(!i._interacting||i.simulation||!i.inertia.start(r))&&null},"interactions:down":function(e){var i=e.interaction,r=e.eventTarget,n=i.inertia;if(n.active)for(var a=r;P(a);){if(a===i.element){n.resume(e);break}a=V(a)}},"interactions:stop":function(e){var i=e.interaction.inertia;i.active&&i.stop()},"interactions:before-action-resume":function(e){var i=e.interaction.modification;i.stop(e),i.start(e,e.interaction.coords.cur.page),i.applyToInteraction(e)},"interactions:before-action-inertiastart":function(e){return e.interaction.modification.setAndApply(e)},"interactions:action-resume":tc,"interactions:action-inertiastart":tc,"interactions:after-action-inertiastart":function(e){return e.interaction.modification.restoreInteractionCoords(e)},"interactions:after-action-resume":function(e){return e.interaction.modification.restoreInteractionCoords(e)}}}),tW.use({id:"modifiers",install:function(e){var i=e.interactStatic;for(var r in e.usePlugin(th),e.usePlugin(tq),i.modifiers=is,is){var n=is[r],a=n._defaults;a._methods=n._methods,e.defaults.perAction[r]=a}}}),tW.use({id:"auto-start",install:function(e){e.usePlugin(e9),e.usePlugin(te),e.usePlugin(e8)}}),tW.use({id:"actions",install:function(e){e.usePlugin(eO),e.usePlugin(ek),e.usePlugin(N),e.usePlugin(eU)}}),tW.use(eY),tW.use({id:"reflow",install:function(e){var i=e.Interactable;e.actions.phases.reflow=!0,i.prototype.reflow=function(i){return function(e,i,r){for(var n=e.getAllElements(),a=r.window.Promise,s=a?[]:null,o=0;o<n.length&&!function(){var l=n[o],c=e.getRect(l);if(!c)return 1;var h,u=ew(r.interactions.list,function(r){return r.interacting()&&r.interactable===e&&r.element===l&&r.prepared.name===i.name});if(u)u.move(),s&&(h=u._reflowPromise||new a(function(e){u._reflowResolve=e}));else{var d,p,f,m,g=et(c),v={coords:{page:{x:g.x,y:g.y},client:{x:g.x,y:g.y},timeStamp:r.now()},get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault:function(){}};p={interaction:d=r.interactions.new({pointerType:"reflow"}),event:v,pointer:v,eventTarget:l,phase:"reflow"},d.interactable=e,d.element=l,d.prevEvent=v,d.updatePointer(v,v,l,!0),eh(d.coords.delta),eJ(d.prepared,i),d._doPhase(p),m=(f=r.window.Promise)?new f(function(e){d._reflowResolve=e}):void 0,d._reflowPromise=m,d.start(i,e,l),d._interacting?(d.move(p),d.end(v)):(d.stop(),d._reflowResolve()),d.removePointer(v,v),h=m}s&&s.push(h)}();o++);return s&&a.all(s).then(function(){return e})}(this,i,e)}},listeners:{"interactions:stop":function(e,i){var r,n=e.interaction;"reflow"===n.pointerType&&(n._reflowResolve&&n._reflowResolve(),r=i.interactions.list,r.splice(r.indexOf(n),1))}}}),tW.default=tW,"object"===n(e)&&e)try{e.exports=tW}catch(e){}return tW.default=tW,tW}()},"./node_modules/jsoncrush/JSONCrush.js":(e,i,r)=>{"use strict";r.d(i,{A:()=>n});let n={crush:(e,i=50)=>{let r=[];for(let e=127;--e;)(e>=48&&e<=57||e>=65&&e<=90||e>=97&&e<=122||"-_.!~*'()".includes(String.fromCharCode(e)))&&r.push(String.fromCharCode(e));for(let e=32;e<255;++e){let i=String.fromCharCode(e);"\\"==i||r.includes(i)||r.unshift(i)}let n=((e,r)=>{let n=r.length,a="",s=e=>encodeURI(encodeURIComponent(e)).replace(/%../g,"i").length,o=e=>{let i=e.charCodeAt(0),r=e.charCodeAt(e.length-1);return i>=56320&&i<=57343||r>=55296&&r<=56319},l={};for(let r=2;r<i;r++)for(let i=0;i<e.length-r;++i){let n=e.substr(i,r);if(l[n]||o(n))continue;let a=1;for(let s=e.indexOf(n,i+r);s>=0;++a)s=e.indexOf(n,s+r);a>1&&(l[n]=a)}for(;;){let i;for(;n--&&e.includes(r[n]););if(n<0)break;let o=r[n],c=0,h=s(o);for(let e in l){let r=l[e],n=(r-1)*s(e)-(r+1)*h;a.length||(n-=s("\x01")),n<=0?delete l[e]:n>c&&(i=e,c=n)}if(!i)break;e=e.split(i).join(o)+o+i,a=o+a;let u={};for(let r in l){let n=r.split(i).join(o),a=0;for(let i=e.indexOf(n);i>=0;++a)i=e.indexOf(n,i+n.length);a>1&&(u[n]=a)}l=u}return{a:e,b:a}})(e=a(e=e.replace(RegExp("\x01","g"),"")),r),s=n.a;return n.b.length&&(s+="\x01"+n.b),s+="_"},uncrush:e=>{let i=(e=e.substring(0,e.length-1)).split("\x01"),r=i[0];if(i.length>1)for(let e of i[1]){let i=r.split(e);r=i.join(i.pop())}return a(r,0)}},a=(e,i=1)=>{let r=[['"',"'"],["':","!"],[",'","~"],["}",")","\\","\\"],["{","(","\\","\\"]],n=(e,i)=>{let r=RegExp(`${(i[2]?i[2]:"")+i[0]}|${(i[3]?i[3]:"")+i[1]}`,"g");return e.replace(r,e=>e===i[0]?i[1]:i[0])};if(i)for(let i=0;i<r.length;++i)e=n(e,r[i]);else for(let i=r.length;i--;)e=n(e,r[i]);return e}},"./node_modules/three/build/three.core.js":(e,i,r)=>{"use strict";let n,a,s,o;r.d(i,{$EB:()=>v,$Kf:()=>nR,$Yl:()=>V,$_I:()=>eS,$ei:()=>R,$p8:()=>su,A$4:()=>rN,AQS:()=>t2,Am1:()=>sg,B69:()=>ro,BH$:()=>ae,BKk:()=>ni,BXX:()=>eK,B_h:()=>e4,CSG:()=>aD,CVz:()=>e0,CWW:()=>tp,Cfg:()=>ex,DXC:()=>n8,Dmk:()=>eN,E0M:()=>sY,EAD:()=>nL,EZo:()=>x,EdD:()=>b,FCc:()=>n7,FFZ:()=>tU,FV:()=>ea,FXf:()=>T,Fn:()=>to,FvD:()=>ao,GJx:()=>em,GWd:()=>eB,Gwm:()=>K,H23:()=>tl,HIg:()=>eF,HO_:()=>td,HXV:()=>eQ,HgN:()=>ir,HiM:()=>so,Hit:()=>aX,Ho_:()=>ah,I46:()=>nA,I9Y:()=>tK,IE4:()=>ej,IUQ:()=>iu,Iit:()=>r9,Jnc:()=>u,K52:()=>J,KDk:()=>e2,KLL:()=>tw,KRh:()=>$,Kef:()=>th,Kwu:()=>M,Kzg:()=>sf,LAk:()=>eo,LiQ:()=>L,LlO:()=>r7,LoY:()=>rX,MBL:()=>aq,MW4:()=>rO,Mjd:()=>er,N1A:()=>n4,N5j:()=>ty,NRn:()=>iv,NTi:()=>y,Nex:()=>sK,Nt7:()=>O,Nwf:()=>sU,Nz6:()=>eq,O49:()=>tv,O9p:()=>i0,ONl:()=>aa,OUM:()=>eE,Om:()=>ef,OuU:()=>U,PJ3:()=>tm,PPD:()=>nK,PTz:()=>tJ,Pf$:()=>sE,Pq0:()=>tZ,Q1f:()=>rw,QP0:()=>d,Qev:()=>tF,Qrf:()=>e9,R3r:()=>np,RJ4:()=>tg,RQf:()=>eP,RiT:()=>aK,Riy:()=>e1,RrE:()=>k,RyA:()=>f,S$4:()=>ts,THS:()=>rU,Tap:()=>a5,TdN:()=>tO,TiK:()=>tP,TkQ:()=>eW,U3G:()=>Y,UtX:()=>sm,V3x:()=>eU,V9B:()=>rP,VCu:()=>al,VT0:()=>eV,Vb5:()=>h,VxR:()=>tT,W9U:()=>tc,WBB:()=>aR,WNZ:()=>c,Wdf:()=>tN,Wew:()=>eL,Wk7:()=>p,XG_:()=>tu,XIg:()=>_,XrR:()=>ee,Y9S:()=>a2,YJl:()=>nu,Yuy:()=>eR,Z58:()=>nf,ZLX:()=>nV,ZQM:()=>eH,Zcv:()=>nX,Zr2:()=>tE,ZyN:()=>sh,_4j:()=>aP,_QJ:()=>te,_Ut:()=>r8,a55:()=>tV,a5J:()=>e7,aEY:()=>B,aHM:()=>a$,aJ8:()=>el,aVO:()=>aU,amv:()=>tA,b4q:()=>nc,bC7:()=>tr,bCz:()=>S,bI3:()=>tx,bdM:()=>aC,bkx:()=>eC,brA:()=>j,bw0:()=>Z,c90:()=>eX,cHt:()=>eA,cZY:()=>sj,caT:()=>Q,cj9:()=>tY,czI:()=>e5,dYF:()=>ig,dcC:()=>ek,dwI:()=>t0,e0p:()=>H,eB$:()=>nm,eHc:()=>W,eHs:()=>nv,eaF:()=>r3,eoi:()=>tI,er$:()=>tS,f4X:()=>I,fBL:()=>ew,fP5:()=>sT,g7M:()=>es,gJ2:()=>eD,gO9:()=>E,gPd:()=>ih,gWB:()=>tD,ghU:()=>eg,hB5:()=>m,hdd:()=>N,hgQ:()=>z,hsX:()=>g,hxR:()=>e_,hy7:()=>eh,iNn:()=>r5,ie2:()=>D,imn:()=>rC,ix0:()=>eI,iyt:()=>iN,jR7:()=>eY,jej:()=>t9,jf0:()=>tb,jzd:()=>tL,k6Q:()=>eJ,k6q:()=>eM,kLi:()=>is,kO0:()=>tC,kRr:()=>eb,kTW:()=>ev,kTp:()=>eZ,kn4:()=>iW,kyO:()=>ei,lGu:()=>X,lGw:()=>aB,lPF:()=>t4,ljd:()=>tf,lxW:()=>r6,lyL:()=>ti,mcG:()=>t6,mrM:()=>nJ,nCl:()=>si,nNL:()=>en,nST:()=>w,nWS:()=>ip,nZQ:()=>sv,o6l:()=>nh,ojh:()=>C,ojs:()=>ta,ov9:()=>G,pBf:()=>e$,pHI:()=>ey,paN:()=>eG,ppV:()=>ie,psI:()=>e8,qUd:()=>sl,qa3:()=>e3,qad:()=>P,qq$:()=>t3,r6x:()=>sd,rFo:()=>im,rSH:()=>e6,rYR:()=>t_,sPf:()=>l,tBo:()=>sO,tJf:()=>eT,tXL:()=>aL,tcD:()=>ac,tz3:()=>aJ,uB5:()=>tt,uSd:()=>aI,uV5:()=>ep,uWO:()=>nD,ubm:()=>no,vim:()=>tR,vyJ:()=>tM,wfO:()=>ed,wn6:()=>F,wrO:()=>eO,xFO:()=>eu,xSv:()=>q,y3Z:()=>tn,y_p:()=>et,zdS:()=>ez,zgK:()=>i1,znC:()=>A});let l="179",c=0,h=1,u=2,d=1,p=2,f=3,m=0,g=1,v=2,_=0,y=1,x=2,M=3,b=4,S=5,E=100,T=101,w=102,A=103,R=104,C=200,P=201,I=202,L=203,D=204,U=205,N=206,O=207,F=208,B=209,z=210,k=211,V=212,H=213,G=214,W=0,X=1,j=2,q=3,Y=4,K=5,J=6,Z=7,Q=0,$=1,ee=2,et=0,ei=1,er=2,en=3,ea=4,es=5,eo=6,el=7,ec="attached",eh=301,eu=302,ed=303,ep=304,ef=306,em=1e3,eg=1001,ev=1002,e_=1003,ey=1004,ex=1005,eM=1006,eb=1007,eS=1008,eE=1009,eT=1010,ew=1011,eA=1012,eR=1013,eC=1014,eP=1015,eI=1016,eL=1017,eD=1018,eU=1020,eN=35902,eO=1021,eF=1022,eB=1023,ez=1026,ek=1027,eV=1028,eH=1029,eG=1030,eW=1031,eX=1033,ej=33776,eq=33777,eY=33778,eK=33779,eJ=35840,eZ=35841,eQ=35842,e$=35843,e0=36196,e1=37492,e2=37496,e3=37808,e4=37809,e5=37810,e6=37811,e9=37812,e8=37813,e7=37814,te=37815,tt=37816,ti=37817,tr=37818,tn=37819,ta=37820,ts=37821,to=36492,tl=36494,tc=36495,th=36283,tu=36284,td=36285,tp=36286,tf=2300,tm=2301,tg=0,tv=1,t_=2,ty=3201,tx=0,tM=1,tb="",tS="srgb",tE="srgb-linear",tT="linear",tw="srgb",tA=512,tR=513,tC=514,tP=515,tI=516,tL=517,tD=518,tU=519,tN="300 es",tO=2e3;class tF{addEventListener(e,i){void 0===this._listeners&&(this._listeners={});let r=this._listeners;void 0===r[e]&&(r[e]=[]),-1===r[e].indexOf(i)&&r[e].push(i)}hasEventListener(e,i){let r=this._listeners;return void 0!==r&&void 0!==r[e]&&-1!==r[e].indexOf(i)}removeEventListener(e,i){let r=this._listeners;if(void 0===r)return;let n=r[e];if(void 0!==n){let e=n.indexOf(i);-1!==e&&n.splice(e,1)}}dispatchEvent(e){let i=this._listeners;if(void 0===i)return;let r=i[e.type];if(void 0!==r){e.target=this;let i=r.slice(0);for(let r=0,n=i.length;r<n;r++)i[r].call(this,e);e.target=null}}}let tB=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],tz=1234567,tk=Math.PI/180,tV=180/Math.PI;function tH(){let e=0xffffffff*Math.random()|0,i=0xffffffff*Math.random()|0,r=0xffffffff*Math.random()|0,n=0xffffffff*Math.random()|0;return(tB[255&e]+tB[e>>8&255]+tB[e>>16&255]+tB[e>>24&255]+"-"+tB[255&i]+tB[i>>8&255]+"-"+tB[i>>16&15|64]+tB[i>>24&255]+"-"+tB[63&r|128]+tB[r>>8&255]+"-"+tB[r>>16&255]+tB[r>>24&255]+tB[255&n]+tB[n>>8&255]+tB[n>>16&255]+tB[n>>24&255]).toLowerCase()}function tG(e,i,r){return Math.max(i,Math.min(r,e))}function tW(e,i){return(e%i+i)%i}function tX(e,i,r){return(1-r)*e+r*i}function tj(e,i){switch(i.constructor){case Float32Array:return e;case Uint32Array:return e/0xffffffff;case Uint16Array:return e/65535;case Uint8Array:return e/255;case Int32Array:return Math.max(e/0x7fffffff,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error("Invalid component type.")}}function tq(e,i){switch(i.constructor){case Float32Array:return e;case Uint32Array:return Math.round(0xffffffff*e);case Uint16Array:return Math.round(65535*e);case Uint8Array:return Math.round(255*e);case Int32Array:return Math.round(0x7fffffff*e);case Int16Array:return Math.round(32767*e);case Int8Array:return Math.round(127*e);default:throw Error("Invalid component type.")}}let tY={DEG2RAD:tk,RAD2DEG:tV,generateUUID:tH,clamp:tG,euclideanModulo:tW,mapLinear:function(e,i,r,n,a){return n+(e-i)*(a-n)/(r-i)},inverseLerp:function(e,i,r){return e!==i?(r-e)/(i-e):0},lerp:tX,damp:function(e,i,r,n){return tX(e,i,1-Math.exp(-r*n))},pingpong:function(e,i=1){return i-Math.abs(tW(e,2*i)-i)},smoothstep:function(e,i,r){return e<=i?0:e>=r?1:(e=(e-i)/(r-i))*e*(3-2*e)},smootherstep:function(e,i,r){return e<=i?0:e>=r?1:(e=(e-i)/(r-i))*e*e*(e*(6*e-15)+10)},randInt:function(e,i){return e+Math.floor(Math.random()*(i-e+1))},randFloat:function(e,i){return e+Math.random()*(i-e)},randFloatSpread:function(e){return e*(.5-Math.random())},seededRandom:function(e){void 0!==e&&(tz=e);let i=tz+=0x6d2b79f5;return i=Math.imul(i^i>>>15,1|i),(((i^=i+Math.imul(i^i>>>7,61|i))^i>>>14)>>>0)/0x100000000},degToRad:function(e){return e*tk},radToDeg:function(e){return e*tV},isPowerOfTwo:function(e){return(e&e-1)==0&&0!==e},ceilPowerOfTwo:function(e){return Math.pow(2,Math.ceil(Math.log(e)/Math.LN2))},floorPowerOfTwo:function(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))},setQuaternionFromProperEuler:function(e,i,r,n,a){let s=Math.cos,o=Math.sin,l=s(r/2),c=o(r/2),h=s((i+n)/2),u=o((i+n)/2),d=s((i-n)/2),p=o((i-n)/2),f=s((n-i)/2),m=o((n-i)/2);switch(a){case"XYX":e.set(l*u,c*d,c*p,l*h);break;case"YZY":e.set(c*p,l*u,c*d,l*h);break;case"ZXZ":e.set(c*d,c*p,l*u,l*h);break;case"XZX":e.set(l*u,c*m,c*f,l*h);break;case"YXY":e.set(c*f,l*u,c*m,l*h);break;case"ZYZ":e.set(c*m,c*f,l*u,l*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}},normalize:tq,denormalize:tj};class tK{constructor(e=0,i=0){tK.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let i=this.x,r=this.y,n=e.elements;return this.x=n[0]*i+n[3]*r+n[6],this.y=n[1]*i+n[4]*r+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=tG(this.x,e.x,i.x),this.y=tG(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=tG(this.x,e,i),this.y=tG(this.y,e,i),this}clampLength(e,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(tG(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let i=Math.sqrt(this.lengthSq()*e.lengthSq());return 0===i?Math.PI/2:Math.acos(tG(this.dot(e)/i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){let r=Math.cos(i),n=Math.sin(i),a=this.x-e.x,s=this.y-e.y;return this.x=a*r-s*n+e.x,this.y=a*n+s*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class tJ{constructor(e=0,i=0,r=0,n=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=n}static slerpFlat(e,i,r,n,a,s,o){let l=r[n+0],c=r[n+1],h=r[n+2],u=r[n+3],d=a[s+0],p=a[s+1],f=a[s+2],m=a[s+3];if(0===o){e[i+0]=l,e[i+1]=c,e[i+2]=h,e[i+3]=u;return}if(1===o){e[i+0]=d,e[i+1]=p,e[i+2]=f,e[i+3]=m;return}if(u!==m||l!==d||c!==p||h!==f){let e=1-o,i=l*d+c*p+h*f+u*m,r=i>=0?1:-1,n=1-i*i;if(n>Number.EPSILON){let a=Math.sqrt(n),s=Math.atan2(a,i*r);e=Math.sin(e*s)/a,o=Math.sin(o*s)/a}let a=o*r;if(l=l*e+d*a,c=c*e+p*a,h=h*e+f*a,u=u*e+m*a,e===1-o){let e=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=e,c*=e,h*=e,u*=e}}e[i]=l,e[i+1]=c,e[i+2]=h,e[i+3]=u}static multiplyQuaternionsFlat(e,i,r,n,a,s){let o=r[n],l=r[n+1],c=r[n+2],h=r[n+3],u=a[s],d=a[s+1],p=a[s+2],f=a[s+3];return e[i]=o*f+h*u+l*p-c*d,e[i+1]=l*f+h*d+c*u-o*p,e[i+2]=c*f+h*p+o*d-l*u,e[i+3]=h*f-o*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,n){return this._x=e,this._y=i,this._z=r,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){let r=e._x,n=e._y,a=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(r/2),h=o(n/2),u=o(a/2),d=l(r/2),p=l(n/2),f=l(a/2);switch(s){case"XYZ":this._x=d*h*u+c*p*f,this._y=c*p*u-d*h*f,this._z=c*h*f+d*p*u,this._w=c*h*u-d*p*f;break;case"YXZ":this._x=d*h*u+c*p*f,this._y=c*p*u-d*h*f,this._z=c*h*f-d*p*u,this._w=c*h*u+d*p*f;break;case"ZXY":this._x=d*h*u-c*p*f,this._y=c*p*u+d*h*f,this._z=c*h*f+d*p*u,this._w=c*h*u-d*p*f;break;case"ZYX":this._x=d*h*u-c*p*f,this._y=c*p*u+d*h*f,this._z=c*h*f-d*p*u,this._w=c*h*u+d*p*f;break;case"YZX":this._x=d*h*u+c*p*f,this._y=c*p*u+d*h*f,this._z=c*h*f-d*p*u,this._w=c*h*u-d*p*f;break;case"XZY":this._x=d*h*u-c*p*f,this._y=c*p*u-d*h*f,this._z=c*h*f+d*p*u,this._w=c*h*u+d*p*f;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return!0===i&&this._onChangeCallback(),this}setFromAxisAngle(e,i){let r=i/2,n=Math.sin(r);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){let i=e.elements,r=i[0],n=i[4],a=i[8],s=i[1],o=i[5],l=i[9],c=i[2],h=i[6],u=i[10],d=r+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(h-l)*e,this._y=(a-c)*e,this._z=(s-n)*e}else if(r>o&&r>u){let e=2*Math.sqrt(1+r-o-u);this._w=(h-l)/e,this._x=.25*e,this._y=(n+s)/e,this._z=(a+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-r-u);this._w=(a-c)/e,this._x=(n+s)/e,this._y=.25*e,this._z=(l+h)/e}else{let e=2*Math.sqrt(1+u-r-o);this._w=(s-n)/e,this._x=(a+c)/e,this._y=(l+h)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0):(this._x=0,this._y=-e.z,this._z=e.y)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x),this._w=r,this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tG(this.dot(e),-1,1)))}rotateTowards(e,i){let r=this.angleTo(e);if(0===r)return this;let n=Math.min(1,i/r);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return 0===e?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){let r=e._x,n=e._y,a=e._z,s=e._w,o=i._x,l=i._y,c=i._z,h=i._w;return this._x=r*h+s*o+n*c-a*l,this._y=n*h+s*l+a*o-r*c,this._z=a*h+s*c+r*l-n*o,this._w=s*h-r*o-n*l-a*c,this._onChangeCallback(),this}slerp(e,i){if(0===i)return this;if(1===i)return this.copy(e);let r=this._x,n=this._y,a=this._z,s=this._w,o=s*e._w+r*e._x+n*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=s,this._x=r,this._y=n,this._z=a,this;let l=1-o*o;if(l<=Number.EPSILON){let e=1-i;return this._w=e*s+i*this._w,this._x=e*r+i*this._x,this._y=e*n+i*this._y,this._z=e*a+i*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-i)*h)/c,d=Math.sin(i*h)/c;return this._w=s*u+this._w*d,this._x=r*u+this._x*d,this._y=n*u+this._y*d,this._z=a*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){let e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),r=Math.random(),n=Math.sqrt(1-r),a=Math.sqrt(r);return this.set(n*Math.sin(e),n*Math.cos(e),a*Math.sin(i),a*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class tZ{constructor(e=0,i=0,r=0){tZ.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return void 0===r&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(t$.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(t$.setFromAxisAngle(e,i))}applyMatrix3(e){let i=this.x,r=this.y,n=this.z,a=e.elements;return this.x=a[0]*i+a[3]*r+a[6]*n,this.y=a[1]*i+a[4]*r+a[7]*n,this.z=a[2]*i+a[5]*r+a[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let i=this.x,r=this.y,n=this.z,a=e.elements,s=1/(a[3]*i+a[7]*r+a[11]*n+a[15]);return this.x=(a[0]*i+a[4]*r+a[8]*n+a[12])*s,this.y=(a[1]*i+a[5]*r+a[9]*n+a[13])*s,this.z=(a[2]*i+a[6]*r+a[10]*n+a[14])*s,this}applyQuaternion(e){let i=this.x,r=this.y,n=this.z,a=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*n-o*r),h=2*(o*i-a*n),u=2*(a*r-s*i);return this.x=i+l*c+s*u-o*h,this.y=r+l*h+o*c-a*u,this.z=n+l*u+a*h-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let i=this.x,r=this.y,n=this.z,a=e.elements;return this.x=a[0]*i+a[4]*r+a[8]*n,this.y=a[1]*i+a[5]*r+a[9]*n,this.z=a[2]*i+a[6]*r+a[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=tG(this.x,e.x,i.x),this.y=tG(this.y,e.y,i.y),this.z=tG(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=tG(this.x,e,i),this.y=tG(this.y,e,i),this.z=tG(this.z,e,i),this}clampLength(e,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(tG(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){let r=e.x,n=e.y,a=e.z,s=i.x,o=i.y,l=i.z;return this.x=n*l-a*o,this.y=a*s-r*l,this.z=r*o-n*s,this}projectOnVector(e){let i=e.lengthSq();if(0===i)return this.set(0,0,0);let r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return tQ.copy(this).projectOnVector(e),this.sub(tQ)}reflect(e){return this.sub(tQ.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let i=Math.sqrt(this.lengthSq()*e.lengthSq());return 0===i?Math.PI/2:Math.acos(tG(this.dot(e)/i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let i=this.x-e.x,r=this.y-e.y,n=this.z-e.z;return i*i+r*r+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){let n=Math.sin(i)*e;return this.x=n*Math.sin(r),this.y=Math.cos(i)*e,this.z=n*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){let i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){let i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=n,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,4*i)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,3*i)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,i=2*Math.random()-1,r=Math.sqrt(1-i*i);return this.x=r*Math.cos(e),this.y=i,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}let tQ=new tZ,t$=new tJ;class t0{constructor(e,i,r,n,a,s,o,l,c){t0.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],void 0!==e&&this.set(e,i,r,n,a,s,o,l,c)}set(e,i,r,n,a,s,o,l,c){let h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=i,h[4]=a,h[5]=l,h[6]=r,h[7]=s,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){let r=e.elements,n=i.elements,a=this.elements,s=r[0],o=r[3],l=r[6],c=r[1],h=r[4],u=r[7],d=r[2],p=r[5],f=r[8],m=n[0],g=n[3],v=n[6],_=n[1],y=n[4],x=n[7],M=n[2],b=n[5],S=n[8];return a[0]=s*m+o*_+l*M,a[3]=s*g+o*y+l*b,a[6]=s*v+o*x+l*S,a[1]=c*m+h*_+u*M,a[4]=c*g+h*y+u*b,a[7]=c*v+h*x+u*S,a[2]=d*m+p*_+f*M,a[5]=d*g+p*y+f*b,a[8]=d*v+p*x+f*S,this}multiplyScalar(e){let i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){let e=this.elements,i=e[0],r=e[1],n=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return i*s*h-i*o*c-r*a*h+r*o*l+n*a*c-n*s*l}invert(){let e=this.elements,i=e[0],r=e[1],n=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*s-o*c,d=o*l-h*a,p=c*a-s*l,f=i*u+r*d+n*p;if(0===f)return this.set(0,0,0,0,0,0,0,0,0);let m=1/f;return e[0]=u*m,e[1]=(n*c-h*r)*m,e[2]=(o*r-n*s)*m,e[3]=d*m,e[4]=(h*i-n*l)*m,e[5]=(n*a-o*i)*m,e[6]=p*m,e[7]=(r*l-c*i)*m,e[8]=(s*i-r*a)*m,this}transpose(){let e,i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,n,a,s,o){let l=Math.cos(a),c=Math.sin(a);return this.set(r*l,r*c,-r*(l*s+c*o)+s+e,-n*c,n*l,-n*(-c*s+l*o)+o+i,0,0,1),this}scale(e,i){return this.premultiply(t1.makeScale(e,i)),this}rotate(e){return this.premultiply(t1.makeRotation(-e)),this}translate(e,i){return this.premultiply(t1.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){let i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){let i=this.elements,r=e.elements;for(let e=0;e<9;e++)if(i[e]!==r[e])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){let r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}let t1=new t0;function t2(e){for(let i=e.length-1;i>=0;--i)if(e[i]>=65535)return!0;return!1}function t3(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function t4(){let e=t3("canvas");return e.style.display="block",e}Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array;let t5={};function t6(e){e in t5||(t5[e]=!0,console.warn(e))}function t9(e,i,r){return new Promise(function(n,a){setTimeout(function s(){switch(e.clientWaitSync(i,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:a();break;case e.TIMEOUT_EXPIRED:setTimeout(s,r);break;default:n()}},r)})}let t8=new t0().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),t7=new t0().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715),ie=function(){let e={enabled:!0,workingColorSpace:tE,spaces:{},convert:function(e,i,r){return!1!==this.enabled&&i!==r&&i&&r&&(this.spaces[i].transfer===tw&&(e.r=it(e.r),e.g=it(e.g),e.b=it(e.b)),this.spaces[i].primaries!==this.spaces[r].primaries&&(e.applyMatrix3(this.spaces[i].toXYZ),e.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===tw&&(e.r=ii(e.r),e.g=ii(e.g),e.b=ii(e.b))),e},workingToColorSpace:function(e,i){return this.convert(e,this.workingColorSpace,i)},colorSpaceToWorking:function(e,i){return this.convert(e,i,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===tb?tT:this.spaces[e].transfer},getLuminanceCoefficients:function(e,i=this.workingColorSpace){return e.fromArray(this.spaces[i].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,i,r){return e.copy(this.spaces[i].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return t6("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),e.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return t6("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),e.colorSpaceToWorking(i,r)}},i=[.64,.33,.3,.6,.15,.06],r=[.2126,.7152,.0722],n=[.3127,.329];return e.define({[tE]:{primaries:i,whitePoint:n,transfer:tT,toXYZ:t8,fromXYZ:t7,luminanceCoefficients:r,workingColorSpaceConfig:{unpackColorSpace:tS},outputColorSpaceConfig:{drawingBufferColorSpace:tS}},[tS]:{primaries:i,whitePoint:n,transfer:tw,toXYZ:t8,fromXYZ:t7,luminanceCoefficients:r,outputColorSpaceConfig:{drawingBufferColorSpace:tS}}}),e}();function it(e){return e<.04045?.0773993808*e:Math.pow(.9478672986*e+.0521327014,2.4)}function ii(e){return e<.0031308?12.92*e:1.055*Math.pow(e,.41666)-.055}class ir{static getDataURL(e,i="image/png"){let r;if(/^data:/i.test(e.src)||"undefined"==typeof HTMLCanvasElement)return e.src;if(e instanceof HTMLCanvasElement)r=e;else{void 0===n&&(n=t3("canvas")),n.width=e.width,n.height=e.height;let i=n.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),r=n}return r.toDataURL(i)}static sRGBToLinear(e){if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap){let i=t3("canvas");i.width=e.width,i.height=e.height;let r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);let n=r.getImageData(0,0,e.width,e.height),a=n.data;for(let e=0;e<a.length;e++)a[e]=255*it(a[e]/255);return r.putImageData(n,0,0),i}if(!e.data)return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e;{let i=e.data.slice(0);for(let e=0;e<i.length;e++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[e]=Math.floor(255*it(i[e]/255)):i[e]=it(i[e]);return{data:i,width:e.width,height:e.height}}}}let ia=0;class is{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ia++}),this.uuid=tH(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let i=this.data;return i instanceof HTMLVideoElement?e.set(i.videoWidth,i.videoHeight,0):i instanceof VideoFrame?e.set(i.displayHeight,i.displayWidth,0):null!==i?e.set(i.width,i.height,i.depth||0):e.set(0,0,0),e}set needsUpdate(e){!0===e&&this.version++}toJSON(e){let i=void 0===e||"string"==typeof e;if(!i&&void 0!==e.images[this.uuid])return e.images[this.uuid];let r={uuid:this.uuid,url:""},n=this.data;if(null!==n){let e;if(Array.isArray(n)){e=[];for(let i=0,r=n.length;i<r;i++)n[i].isDataTexture?e.push(io(n[i].image)):e.push(io(n[i]))}else e=io(n);r.url=e}return i||(e.images[this.uuid]=r),r}}function io(e){return"undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap?ir.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let il=0,ic=new tZ;class ih extends tF{constructor(e=ih.DEFAULT_IMAGE,i=ih.DEFAULT_MAPPING,r=eg,n=eg,a=eM,s=eS,o=eB,l=eE,c=ih.DEFAULT_ANISOTROPY,h=tb){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:il++}),this.uuid=tH(),this.name="",this.source=new is(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=n,this.magFilter=a,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new tK(0,0),this.repeat=new tK(1,1),this.center=new tK(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new t0,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!e&&!!e.depth&&e.depth>1,this.pmremVersion=0}get width(){return this.source.getSize(ic).x}get height(){return this.source.getSize(ic).y}get depth(){return this.source.getSize(ic).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let i in e){let r=e[i];if(void 0===r){console.warn(`THREE.Texture.setValues(): parameter '${i}' has value of undefined.`);continue}let n=this[i];if(void 0===n){console.warn(`THREE.Texture.setValues(): property '${i}' does not exist.`);continue}n&&r&&n.isVector2&&r.isVector2||n&&r&&n.isVector3&&r.isVector3||n&&r&&n.isMatrix3&&r.isMatrix3?n.copy(r):this[i]=r}}toJSON(e){let i=void 0===e||"string"==typeof e;if(!i&&void 0!==e.textures[this.uuid])return e.textures[this.uuid];let r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(300!==this.mapping)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case em:e.x=e.x-Math.floor(e.x);break;case eg:e.x=e.x<0?0:1;break;case ev:1===Math.abs(Math.floor(e.x)%2)?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case em:e.y=e.y-Math.floor(e.y);break;case eg:e.y=e.y<0?0:1;break;case ev:1===Math.abs(Math.floor(e.y)%2)?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){!0===e&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){!0===e&&this.pmremVersion++}}ih.DEFAULT_IMAGE=null,ih.DEFAULT_MAPPING=300,ih.DEFAULT_ANISOTROPY=1;class iu{constructor(e=0,i=0,r=0,n=1){iu.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,n){return this.x=e,this.y=i,this.z=r,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=void 0!==e.w?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let i=this.x,r=this.y,n=this.z,a=this.w,s=e.elements;return this.x=s[0]*i+s[4]*r+s[8]*n+s[12]*a,this.y=s[1]*i+s[5]*r+s[9]*n+s[13]*a,this.z=s[2]*i+s[6]*r+s[10]*n+s[14]*a,this.w=s[3]*i+s[7]*r+s[11]*n+s[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,n,a,s=e.elements,o=s[0],l=s[4],c=s[8],h=s[1],u=s[5],d=s[9],p=s[2],f=s[6],m=s[10];if(.01>Math.abs(l-h)&&.01>Math.abs(c-p)&&.01>Math.abs(d-f)){if(.1>Math.abs(l+h)&&.1>Math.abs(c+p)&&.1>Math.abs(d+f)&&.1>Math.abs(o+u+m-3))return this.set(1,0,0,0),this;i=Math.PI;let e=(o+1)/2,s=(u+1)/2,g=(m+1)/2,v=(l+h)/4,_=(c+p)/4,y=(d+f)/4;return e>s&&e>g?e<.01?(r=0,n=.707106781,a=.707106781):(n=v/(r=Math.sqrt(e)),a=_/r):s>g?s<.01?(r=.707106781,n=0,a=.707106781):(r=v/(n=Math.sqrt(s)),a=y/n):g<.01?(r=.707106781,n=.707106781,a=0):(r=_/(a=Math.sqrt(g)),n=y/a),this.set(r,n,a,i),this}let g=Math.sqrt((f-d)*(f-d)+(c-p)*(c-p)+(h-l)*(h-l));return .001>Math.abs(g)&&(g=1),this.x=(f-d)/g,this.y=(c-p)/g,this.z=(h-l)/g,this.w=Math.acos((o+u+m-1)/2),this}setFromMatrixPosition(e){let i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=tG(this.x,e.x,i.x),this.y=tG(this.y,e.y,i.y),this.z=tG(this.z,e.z,i.z),this.w=tG(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=tG(this.x,e,i),this.y=tG(this.y,e,i),this.z=tG(this.z,e,i),this.w=tG(this.w,e,i),this}clampLength(e,i){let r=this.length();return this.divideScalar(r||1).multiplyScalar(tG(r,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class id extends tF{constructor(e=1,i=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:eM,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},r),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=r.depth,this.scissor=new iu(0,0,e,i),this.scissorTest=!1,this.viewport=new iu(0,0,e,i);let n=new ih({width:e,height:i,depth:r.depth});this.textures=[];let a=r.count;for(let e=0;e<a;e++)this.textures[e]=n.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview}_setTextureOptions(e={}){let i={minFilter:eM,generateMipmaps:!1,flipY:!1,internalFormat:null};void 0!==e.mapping&&(i.mapping=e.mapping),void 0!==e.wrapS&&(i.wrapS=e.wrapS),void 0!==e.wrapT&&(i.wrapT=e.wrapT),void 0!==e.wrapR&&(i.wrapR=e.wrapR),void 0!==e.magFilter&&(i.magFilter=e.magFilter),void 0!==e.minFilter&&(i.minFilter=e.minFilter),void 0!==e.format&&(i.format=e.format),void 0!==e.type&&(i.type=e.type),void 0!==e.anisotropy&&(i.anisotropy=e.anisotropy),void 0!==e.colorSpace&&(i.colorSpace=e.colorSpace),void 0!==e.flipY&&(i.flipY=e.flipY),void 0!==e.generateMipmaps&&(i.generateMipmaps=e.generateMipmaps),void 0!==e.internalFormat&&(i.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(i)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){null!==this._depthTexture&&(this._depthTexture.renderTarget=null),null!==e&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,r=1){if(this.width!==e||this.height!==i||this.depth!==r){this.width=e,this.height=i,this.depth=r;for(let n=0,a=this.textures.length;n<a;n++)this.textures[n].image.width=e,this.textures[n].image.height=i,this.textures[n].image.depth=r,this.textures[n].isArrayTexture=this.textures[n].image.depth>1;this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;let r=Object.assign({},e.textures[i].image);this.textures[i].source=new is(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,null!==e.depthTexture&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ip extends id{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class im extends ih{constructor(e=null,i=1,r=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:n},this.magFilter=e_,this.minFilter=e_,this.wrapR=eg,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ig extends ih{constructor(e=null,i=1,r=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:n},this.magFilter=e_,this.minFilter=e_,this.wrapR=eg,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class iv{constructor(e=new tZ(Infinity,Infinity,Infinity),i=new tZ(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(iy.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(iy.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){let r=iy.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=Infinity,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);let r=e.geometry;if(void 0!==r){let n=r.getAttribute("position");if(!0===i&&void 0!==n&&!0!==e.isInstancedMesh)for(let i=0,r=n.count;i<r;i++)!0===e.isMesh?e.getVertexPosition(i,iy):iy.fromBufferAttribute(n,i),iy.applyMatrix4(e.matrixWorld),this.expandByPoint(iy);else void 0!==e.boundingBox?(null===e.boundingBox&&e.computeBoundingBox(),ix.copy(e.boundingBox)):(null===r.boundingBox&&r.computeBoundingBox(),ix.copy(r.boundingBox)),ix.applyMatrix4(e.matrixWorld),this.union(ix)}let n=e.children;for(let e=0,r=n.length;e<r;e++)this.expandByObject(n[e],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,iy),iy.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(iA),iR.subVectors(this.max,iA),iM.subVectors(e.a,iA),ib.subVectors(e.b,iA),iS.subVectors(e.c,iA),iE.subVectors(ib,iM),iT.subVectors(iS,ib),iw.subVectors(iM,iS);let i=[0,-iE.z,iE.y,0,-iT.z,iT.y,0,-iw.z,iw.y,iE.z,0,-iE.x,iT.z,0,-iT.x,iw.z,0,-iw.x,-iE.y,iE.x,0,-iT.y,iT.x,0,-iw.y,iw.x,0];return!!iI(i,iM,ib,iS,iR)&&!!iI(i=[1,0,0,0,1,0,0,0,1],iM,ib,iS,iR)&&(iC.crossVectors(iE,iT),iI(i=[iC.x,iC.y,iC.z],iM,ib,iS,iR))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,iy).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=.5*this.getSize(iy).length()),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(i_[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),i_[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),i_[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),i_[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),i_[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),i_[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),i_[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),i_[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(i_)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}let i_=[new tZ,new tZ,new tZ,new tZ,new tZ,new tZ,new tZ,new tZ],iy=new tZ,ix=new iv,iM=new tZ,ib=new tZ,iS=new tZ,iE=new tZ,iT=new tZ,iw=new tZ,iA=new tZ,iR=new tZ,iC=new tZ,iP=new tZ;function iI(e,i,r,n,a){for(let s=0,o=e.length-3;s<=o;s+=3){iP.fromArray(e,s);let o=a.x*Math.abs(iP.x)+a.y*Math.abs(iP.y)+a.z*Math.abs(iP.z),l=i.dot(iP),c=r.dot(iP),h=n.dot(iP);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}let iL=new iv,iD=new tZ,iU=new tZ;class iN{constructor(e=new tZ,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){let r=this.center;void 0!==i?r.copy(i):iL.setFromPoints(e).getCenter(r);let n=0;for(let i=0,a=e.length;i<a;i++)n=Math.max(n,r.distanceToSquared(e[i]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){let r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?e.makeEmpty():(e.set(this.center,this.center),e.expandByScalar(this.radius)),e}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;iD.subVectors(e,this.center);let i=iD.lengthSq();if(i>this.radius*this.radius){let e=Math.sqrt(i),r=(e-this.radius)*.5;this.center.addScaledVector(iD,r/e),this.radius+=r}return this}union(e){return e.isEmpty()||(this.isEmpty()?this.copy(e):!0===this.center.equals(e.center)?this.radius=Math.max(this.radius,e.radius):(iU.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(iD.copy(e.center).add(iU)),this.expandByPoint(iD.copy(e.center).sub(iU)))),this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let iO=new tZ,iF=new tZ,iB=new tZ,iz=new tZ,ik=new tZ,iV=new tZ,iH=new tZ;class iG{constructor(e=new tZ,i=new tZ(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,iO)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);let r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let i=iO.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(iO.copy(this.origin).addScaledVector(this.direction,i),iO.distanceToSquared(e))}distanceSqToSegment(e,i,r,n){let a,s,o,l;iF.copy(e).add(i).multiplyScalar(.5),iB.copy(i).sub(e).normalize(),iz.copy(this.origin).sub(iF);let c=.5*e.distanceTo(i),h=-this.direction.dot(iB),u=iz.dot(this.direction),d=-iz.dot(iB),p=iz.lengthSq(),f=Math.abs(1-h*h);if(f>0)if(a=h*d-u,s=h*u-d,l=c*f,a>=0)if(s>=-l)if(s<=l){let e=1/f;a*=e,s*=e,o=a*(a+h*s+2*u)+s*(h*a+s+2*d)+p}else o=-(a=Math.max(0,-(h*(s=c)+u)))*a+s*(s+2*d)+p;else o=-(a=Math.max(0,-(h*(s=-c)+u)))*a+s*(s+2*d)+p;else s<=-l?(s=(a=Math.max(0,-(-h*c+u)))>0?-c:Math.min(Math.max(-c,-d),c),o=-a*a+s*(s+2*d)+p):s<=l?(a=0,o=(s=Math.min(Math.max(-c,-d),c))*(s+2*d)+p):(s=(a=Math.max(0,-(h*c+u)))>0?c:Math.min(Math.max(-c,-d),c),o=-a*a+s*(s+2*d)+p);else s=h>0?-c:c,o=-(a=Math.max(0,-(h*s+u)))*a+s*(s+2*d)+p;return r&&r.copy(this.origin).addScaledVector(this.direction,a),n&&n.copy(iF).addScaledVector(iB,s),o}intersectSphere(e,i){iO.subVectors(e.center,this.origin);let r=iO.dot(this.direction),n=iO.dot(iO)-r*r,a=e.radius*e.radius;if(n>a)return null;let s=Math.sqrt(a-n),o=r-s,l=r+s;return l<0?null:o<0?this.at(l,i):this.at(o,i)}intersectsSphere(e){return!(e.radius<0)&&this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let i=e.normal.dot(this.direction);if(0===i)return 0===e.distanceToPoint(this.origin)?0:null;let r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){let r=this.distanceToPlane(e);return null===r?null:this.at(r,i)}intersectsPlane(e){let i=e.distanceToPoint(this.origin);return!!(0===i||e.normal.dot(this.direction)*i<0)}intersectBox(e,i){let r,n,a,s,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return(c>=0?(r=(e.min.x-d.x)*c,n=(e.max.x-d.x)*c):(r=(e.max.x-d.x)*c,n=(e.min.x-d.x)*c),h>=0?(a=(e.min.y-d.y)*h,s=(e.max.y-d.y)*h):(a=(e.max.y-d.y)*h,s=(e.min.y-d.y)*h),r>s||a>n||((a>r||isNaN(r))&&(r=a),(s<n||isNaN(n))&&(n=s),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),r>l||o>n||((o>r||r!=r)&&(r=o),(l<n||n!=n)&&(n=l),n<0)))?null:this.at(r>=0?r:n,i)}intersectsBox(e){return null!==this.intersectBox(e,iO)}intersectTriangle(e,i,r,n,a){let s;ik.subVectors(i,e),iV.subVectors(r,e),iH.crossVectors(ik,iV);let o=this.direction.dot(iH);if(o>0){if(n)return null;s=1}else{if(!(o<0))return null;s=-1,o=-o}iz.subVectors(this.origin,e);let l=s*this.direction.dot(iV.crossVectors(iz,iV));if(l<0)return null;let c=s*this.direction.dot(ik.cross(iz));if(c<0||l+c>o)return null;let h=-s*iz.dot(iH);return h<0?null:this.at(h/o,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class iW{constructor(e,i,r,n,a,s,o,l,c,h,u,d,p,f,m,g){iW.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],void 0!==e&&this.set(e,i,r,n,a,s,o,l,c,h,u,d,p,f,m,g)}set(e,i,r,n,a,s,o,l,c,h,u,d,p,f,m,g){let v=this.elements;return v[0]=e,v[4]=i,v[8]=r,v[12]=n,v[1]=a,v[5]=s,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=u,v[14]=d,v[3]=p,v[7]=f,v[11]=m,v[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new iW().fromArray(this.elements)}copy(e){let i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){let i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){let i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){let i=this.elements,r=e.elements,n=1/iX.setFromMatrixColumn(e,0).length(),a=1/iX.setFromMatrixColumn(e,1).length(),s=1/iX.setFromMatrixColumn(e,2).length();return i[0]=r[0]*n,i[1]=r[1]*n,i[2]=r[2]*n,i[3]=0,i[4]=r[4]*a,i[5]=r[5]*a,i[6]=r[6]*a,i[7]=0,i[8]=r[8]*s,i[9]=r[9]*s,i[10]=r[10]*s,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){let i=this.elements,r=e.x,n=e.y,a=e.z,s=Math.cos(r),o=Math.sin(r),l=Math.cos(n),c=Math.sin(n),h=Math.cos(a),u=Math.sin(a);if("XYZ"===e.order){let e=s*h,r=s*u,n=o*h,a=o*u;i[0]=l*h,i[4]=-l*u,i[8]=c,i[1]=r+n*c,i[5]=e-a*c,i[9]=-o*l,i[2]=a-e*c,i[6]=n+r*c,i[10]=s*l}else if("YXZ"===e.order){let e=l*h,r=l*u,n=c*h,a=c*u;i[0]=e+a*o,i[4]=n*o-r,i[8]=s*c,i[1]=s*u,i[5]=s*h,i[9]=-o,i[2]=r*o-n,i[6]=a+e*o,i[10]=s*l}else if("ZXY"===e.order){let e=l*h,r=l*u,n=c*h,a=c*u;i[0]=e-a*o,i[4]=-s*u,i[8]=n+r*o,i[1]=r+n*o,i[5]=s*h,i[9]=a-e*o,i[2]=-s*c,i[6]=o,i[10]=s*l}else if("ZYX"===e.order){let e=s*h,r=s*u,n=o*h,a=o*u;i[0]=l*h,i[4]=n*c-r,i[8]=e*c+a,i[1]=l*u,i[5]=a*c+e,i[9]=r*c-n,i[2]=-c,i[6]=o*l,i[10]=s*l}else if("YZX"===e.order){let e=s*l,r=s*c,n=o*l,a=o*c;i[0]=l*h,i[4]=a-e*u,i[8]=n*u+r,i[1]=u,i[5]=s*h,i[9]=-o*h,i[2]=-c*h,i[6]=r*u+n,i[10]=e-a*u}else if("XZY"===e.order){let e=s*l,r=s*c,n=o*l,a=o*c;i[0]=l*h,i[4]=-u,i[8]=c*h,i[1]=e*u+a,i[5]=s*h,i[9]=r*u-n,i[2]=n*u-r,i[6]=o*h,i[10]=a*u+e}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(iq,e,iY)}lookAt(e,i,r){let n=this.elements;return iZ.subVectors(e,i),0===iZ.lengthSq()&&(iZ.z=1),iZ.normalize(),iK.crossVectors(r,iZ),0===iK.lengthSq()&&(1===Math.abs(r.z)?iZ.x+=1e-4:iZ.z+=1e-4,iZ.normalize(),iK.crossVectors(r,iZ)),iK.normalize(),iJ.crossVectors(iZ,iK),n[0]=iK.x,n[4]=iJ.x,n[8]=iZ.x,n[1]=iK.y,n[5]=iJ.y,n[9]=iZ.y,n[2]=iK.z,n[6]=iJ.z,n[10]=iZ.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){let r=e.elements,n=i.elements,a=this.elements,s=r[0],o=r[4],l=r[8],c=r[12],h=r[1],u=r[5],d=r[9],p=r[13],f=r[2],m=r[6],g=r[10],v=r[14],_=r[3],y=r[7],x=r[11],M=r[15],b=n[0],S=n[4],E=n[8],T=n[12],w=n[1],A=n[5],R=n[9],C=n[13],P=n[2],I=n[6],L=n[10],D=n[14],U=n[3],N=n[7],O=n[11],F=n[15];return a[0]=s*b+o*w+l*P+c*U,a[4]=s*S+o*A+l*I+c*N,a[8]=s*E+o*R+l*L+c*O,a[12]=s*T+o*C+l*D+c*F,a[1]=h*b+u*w+d*P+p*U,a[5]=h*S+u*A+d*I+p*N,a[9]=h*E+u*R+d*L+p*O,a[13]=h*T+u*C+d*D+p*F,a[2]=f*b+m*w+g*P+v*U,a[6]=f*S+m*A+g*I+v*N,a[10]=f*E+m*R+g*L+v*O,a[14]=f*T+m*C+g*D+v*F,a[3]=_*b+y*w+x*P+M*U,a[7]=_*S+y*A+x*I+M*N,a[11]=_*E+y*R+x*L+M*O,a[15]=_*T+y*C+x*D+M*F,this}multiplyScalar(e){let i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){let e=this.elements,i=e[0],r=e[4],n=e[8],a=e[12],s=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],f=e[3],m=e[7];return f*(a*l*u-n*c*u-a*o*d+r*c*d+n*o*p-r*l*p)+m*(i*l*p-i*c*d+a*s*d-n*s*p+n*c*h-a*l*h)+e[11]*(i*c*u-i*o*p-a*s*u+r*s*p+a*o*h-r*c*h)+e[15]*(-n*o*h-i*l*u+i*o*d+n*s*u-r*s*d+r*l*h)}transpose(){let e,i=this.elements;return e=i[1],i[1]=i[4],i[4]=e,e=i[2],i[2]=i[8],i[8]=e,e=i[6],i[6]=i[9],i[9]=e,e=i[3],i[3]=i[12],i[12]=e,e=i[7],i[7]=i[13],i[13]=e,e=i[11],i[11]=i[14],i[14]=e,this}setPosition(e,i,r){let n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=i,n[14]=r),this}invert(){let e=this.elements,i=e[0],r=e[1],n=e[2],a=e[3],s=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],f=e[12],m=e[13],g=e[14],v=e[15],_=u*g*c-m*d*c+m*l*p-o*g*p-u*l*v+o*d*v,y=f*d*c-h*g*c-f*l*p+s*g*p+h*l*v-s*d*v,x=h*m*c-f*u*c+f*o*p-s*m*p-h*o*v+s*u*v,M=f*u*l-h*m*l-f*o*d+s*m*d+h*o*g-s*u*g,b=i*_+r*y+n*x+a*M;if(0===b)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/b;return e[0]=_*S,e[1]=(m*d*a-u*g*a-m*n*p+r*g*p+u*n*v-r*d*v)*S,e[2]=(o*g*a-m*l*a+m*n*c-r*g*c-o*n*v+r*l*v)*S,e[3]=(u*l*a-o*d*a-u*n*c+r*d*c+o*n*p-r*l*p)*S,e[4]=y*S,e[5]=(h*g*a-f*d*a+f*n*p-i*g*p-h*n*v+i*d*v)*S,e[6]=(f*l*a-s*g*a-f*n*c+i*g*c+s*n*v-i*l*v)*S,e[7]=(s*d*a-h*l*a+h*n*c-i*d*c-s*n*p+i*l*p)*S,e[8]=x*S,e[9]=(f*u*a-h*m*a-f*r*p+i*m*p+h*r*v-i*u*v)*S,e[10]=(s*m*a-f*o*a+f*r*c-i*m*c-s*r*v+i*o*v)*S,e[11]=(h*o*a-s*u*a-h*r*c+i*u*c+s*r*p-i*o*p)*S,e[12]=M*S,e[13]=(h*m*n-f*u*n+f*r*d-i*m*d-h*r*g+i*u*g)*S,e[14]=(f*o*n-s*m*n-f*r*l+i*m*l+s*r*g-i*o*g)*S,e[15]=(s*u*n-h*o*n+h*r*l-i*u*l-s*r*d+i*o*d)*S,this}scale(e){let i=this.elements,r=e.x,n=e.y,a=e.z;return i[0]*=r,i[4]*=n,i[8]*=a,i[1]*=r,i[5]*=n,i[9]*=a,i[2]*=r,i[6]*=n,i[10]*=a,i[3]*=r,i[7]*=n,i[11]*=a,this}getMaxScaleOnAxis(){let e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2];return Math.sqrt(Math.max(i,e[4]*e[4]+e[5]*e[5]+e[6]*e[6],e[8]*e[8]+e[9]*e[9]+e[10]*e[10]))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){let i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){let i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){let i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){let r=Math.cos(i),n=Math.sin(i),a=1-r,s=e.x,o=e.y,l=e.z,c=a*s,h=a*o;return this.set(c*s+r,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+r,h*l-n*s,0,c*l-n*o,h*l+n*s,a*l*l+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,n,a,s){return this.set(1,r,a,0,e,1,s,0,i,n,1,0,0,0,0,1),this}compose(e,i,r){let n=this.elements,a=i._x,s=i._y,o=i._z,l=i._w,c=a+a,h=s+s,u=o+o,d=a*c,p=a*h,f=a*u,m=s*h,g=s*u,v=o*u,_=l*c,y=l*h,x=l*u,M=r.x,b=r.y,S=r.z;return n[0]=(1-(m+v))*M,n[1]=(p+x)*M,n[2]=(f-y)*M,n[3]=0,n[4]=(p-x)*b,n[5]=(1-(d+v))*b,n[6]=(g+_)*b,n[7]=0,n[8]=(f+y)*S,n[9]=(g-_)*S,n[10]=(1-(d+m))*S,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,i,r){let n=this.elements,a=iX.set(n[0],n[1],n[2]).length(),s=iX.set(n[4],n[5],n[6]).length(),o=iX.set(n[8],n[9],n[10]).length();0>this.determinant()&&(a=-a),e.x=n[12],e.y=n[13],e.z=n[14],ij.copy(this);let l=1/a,c=1/s,h=1/o;return ij.elements[0]*=l,ij.elements[1]*=l,ij.elements[2]*=l,ij.elements[4]*=c,ij.elements[5]*=c,ij.elements[6]*=c,ij.elements[8]*=h,ij.elements[9]*=h,ij.elements[10]*=h,i.setFromRotationMatrix(ij),r.x=a,r.y=s,r.z=o,this}makePerspective(e,i,r,n,a,s,o=tO,l=!1){let c,h,u=this.elements;if(l)c=a/(s-a),h=s*a/(s-a);else if(o===tO)c=-(s+a)/(s-a),h=-2*s*a/(s-a);else if(2001===o)c=-s/(s-a),h=-s*a/(s-a);else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return u[0]=2*a/(i-e),u[4]=0,u[8]=(i+e)/(i-e),u[12]=0,u[1]=0,u[5]=2*a/(r-n),u[9]=(r+n)/(r-n),u[13]=0,u[2]=0,u[6]=0,u[10]=c,u[14]=h,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,i,r,n,a,s,o=tO,l=!1){let c,h,u=this.elements;if(l)c=1/(s-a),h=s/(s-a);else if(o===tO)c=-2/(s-a),h=-(s+a)/(s-a);else if(2001===o)c=-1/(s-a),h=-a/(s-a);else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return u[0]=2/(i-e),u[4]=0,u[8]=0,u[12]=-(i+e)/(i-e),u[1]=0,u[5]=2/(r-n),u[9]=0,u[13]=-(r+n)/(r-n),u[2]=0,u[6]=0,u[10]=c,u[14]=h,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){let i=this.elements,r=e.elements;for(let e=0;e<16;e++)if(i[e]!==r[e])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){let r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}let iX=new tZ,ij=new iW,iq=new tZ(0,0,0),iY=new tZ(1,1,1),iK=new tZ,iJ=new tZ,iZ=new tZ,iQ=new iW,i$=new tJ;class i0{constructor(e=0,i=0,r=0,n=i0.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,n=this._order){return this._x=e,this._y=i,this._z=r,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){let n=e.elements,a=n[0],s=n[4],o=n[8],l=n[1],c=n[5],h=n[9],u=n[2],d=n[6],p=n[10];switch(i){case"XYZ":this._y=Math.asin(tG(o,-1,1)),.9999999>Math.abs(o)?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-s,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tG(h,-1,1)),.9999999>Math.abs(h)?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(tG(d,-1,1)),.9999999>Math.abs(d)?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-tG(u,-1,1)),.9999999>Math.abs(u)?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(tG(l,-1,1)),.9999999>Math.abs(l)?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-tG(s,-1,1)),.9999999>Math.abs(s)?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,!0===r&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return iQ.makeRotationFromQuaternion(e),this.setFromRotationMatrix(iQ,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return i$.setFromEuler(this),this.setFromQuaternion(i$,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],void 0!==e[3]&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}i0.DEFAULT_ORDER="XYZ";class i1{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!=0}isEnabled(e){return(this.mask&1<<e)!=0}}let i2=0,i3=new tZ,i4=new tJ,i5=new iW,i6=new tZ,i9=new tZ,i8=new tZ,i7=new tJ,re=new tZ(1,0,0),rt=new tZ(0,1,0),ri=new tZ(0,0,1),rr={type:"added"},rn={type:"removed"},ra={type:"childadded",child:null},rs={type:"childremoved",child:null};class ro extends tF{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:i2++}),this.uuid=tH(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ro.DEFAULT_UP.clone();let e=new tZ,i=new i0,r=new tJ,n=new tZ(1,1,1);i._onChange(function(){r.setFromEuler(i,!1)}),r._onChange(function(){i.setFromQuaternion(r,void 0,!1)}),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new iW},normalMatrix:{value:new t0}}),this.matrix=new iW,this.matrixWorld=new iW,this.matrixAutoUpdate=ro.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ro.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new i1,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return i4.setFromAxisAngle(e,i),this.quaternion.multiply(i4),this}rotateOnWorldAxis(e,i){return i4.setFromAxisAngle(e,i),this.quaternion.premultiply(i4),this}rotateX(e){return this.rotateOnAxis(re,e)}rotateY(e){return this.rotateOnAxis(rt,e)}rotateZ(e){return this.rotateOnAxis(ri,e)}translateOnAxis(e,i){return i3.copy(e).applyQuaternion(this.quaternion),this.position.add(i3.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(re,e)}translateY(e){return this.translateOnAxis(rt,e)}translateZ(e){return this.translateOnAxis(ri,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(i5.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?i6.copy(e):i6.set(e,i,r);let n=this.parent;this.updateWorldMatrix(!0,!1),i9.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?i5.lookAt(i9,i6,this.up):i5.lookAt(i6,i9,this.up),this.quaternion.setFromRotationMatrix(i5),n&&(i5.extractRotation(n.matrixWorld),i4.setFromRotationMatrix(i5),this.quaternion.premultiply(i4.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?console.error("THREE.Object3D.add: object can't be added as a child of itself.",e):e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rr),ra.child=e,this.dispatchEvent(ra),ra.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let i=this.children.indexOf(e);return -1!==i&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(rn),rs.child=e,this.dispatchEvent(rs),rs.child=null),this}removeFromParent(){let e=this.parent;return null!==e&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),i5.copy(this.matrixWorld).invert(),null!==e.parent&&(e.parent.updateWorldMatrix(!0,!1),i5.multiply(e.parent.matrixWorld)),e.applyMatrix4(i5),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rr),ra.child=e,this.dispatchEvent(ra),ra.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,n=this.children.length;r<n;r++){let n=this.children[r].getObjectByProperty(e,i);if(void 0!==n)return n}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);let n=this.children;for(let a=0,s=n.length;a<s;a++)n[a].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(i9,e,i8),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(i9,i7,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);let i=this.children;for(let r=0,n=i.length;r<n;r++)i[r].traverse(e)}traverseVisible(e){if(!1===this.visible)return;e(this);let i=this.children;for(let r=0,n=i.length;r<n;r++)i[r].traverseVisible(e)}traverseAncestors(e){let i=this.parent;null!==i&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(!0===this.matrixWorldAutoUpdate&&(null===this.parent?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let i=this.children;for(let r=0,n=i.length;r<n;r++)i[r].updateMatrixWorld(e)}updateWorldMatrix(e,i){let r=this.parent;if(!0===e&&null!==r&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),!0===this.matrixWorldAutoUpdate&&(null===this.parent?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),!0===i){let e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateWorldMatrix(!1,!0)}}toJSON(e){let i=void 0===e||"string"==typeof e,r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let n={};function a(i,r){return void 0===i[r.uuid]&&(i[r.uuid]=r.toJSON(e)),r.uuid}if(n.uuid=this.uuid,n.type=this.type,""!==this.name&&(n.name=this.name),!0===this.castShadow&&(n.castShadow=!0),!0===this.receiveShadow&&(n.receiveShadow=!0),!1===this.visible&&(n.visible=!1),!1===this.frustumCulled&&(n.frustumCulled=!1),0!==this.renderOrder&&(n.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),!1===this.matrixAutoUpdate&&(n.matrixAutoUpdate=!1),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),null!==this.instanceColor&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(e=>({...e})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),null!==this._colorsTexture&&(n.colorsTexture=this._colorsTexture.toJSON(e)),null!==this.boundingSphere&&(n.boundingSphere=this.boundingSphere.toJSON()),null!==this.boundingBox&&(n.boundingBox=this.boundingBox.toJSON())),this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&!0!==this.environment.isRenderTargetTexture&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=a(e.geometries,this.geometry);let i=this.geometry.parameters;if(void 0!==i&&void 0!==i.shapes){let r=i.shapes;if(Array.isArray(r))for(let i=0,n=r.length;i<n;i++){let n=r[i];a(e.shapes,n)}else a(e.shapes,r)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),void 0!==this.skeleton&&(a(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),void 0!==this.material)if(Array.isArray(this.material)){let i=[];for(let r=0,n=this.material.length;r<n;r++)i.push(a(e.materials,this.material[r]));n.material=i}else n.material=a(e.materials,this.material);if(this.children.length>0){n.children=[];for(let i=0;i<this.children.length;i++)n.children.push(this.children[i].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let i=0;i<this.animations.length;i++){let r=this.animations[i];n.animations.push(a(e.animations,r))}}if(i){let i=s(e.geometries),n=s(e.materials),a=s(e.textures),o=s(e.images),l=s(e.shapes),c=s(e.skeletons),h=s(e.animations),u=s(e.nodes);i.length>0&&(r.geometries=i),n.length>0&&(r.materials=n),a.length>0&&(r.textures=a),o.length>0&&(r.images=o),l.length>0&&(r.shapes=l),c.length>0&&(r.skeletons=c),h.length>0&&(r.animations=h),u.length>0&&(r.nodes=u)}return r.object=n,r;function s(e){let i=[];for(let r in e){let n=e[r];delete n.metadata,i.push(n)}return i}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),!0===i)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}}ro.DEFAULT_UP=new tZ(0,1,0),ro.DEFAULT_MATRIX_AUTO_UPDATE=!0,ro.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;let rl=new tZ,rc=new tZ,rh=new tZ,ru=new tZ,rd=new tZ,rp=new tZ,rf=new tZ,rm=new tZ,rg=new tZ,rv=new tZ,r_=new iu,ry=new iu,rx=new iu;class rM{constructor(e=new tZ,i=new tZ,r=new tZ){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,n){n.subVectors(r,i),rl.subVectors(e,i),n.cross(rl);let a=n.lengthSq();return a>0?n.multiplyScalar(1/Math.sqrt(a)):n.set(0,0,0)}static getBarycoord(e,i,r,n,a){rl.subVectors(n,i),rc.subVectors(r,i),rh.subVectors(e,i);let s=rl.dot(rl),o=rl.dot(rc),l=rl.dot(rh),c=rc.dot(rc),h=rc.dot(rh),u=s*c-o*o;if(0===u)return a.set(0,0,0),null;let d=1/u,p=(c*l-o*h)*d,f=(s*h-o*l)*d;return a.set(1-p-f,f,p)}static containsPoint(e,i,r,n){return null!==this.getBarycoord(e,i,r,n,ru)&&ru.x>=0&&ru.y>=0&&ru.x+ru.y<=1}static getInterpolation(e,i,r,n,a,s,o,l){return null===this.getBarycoord(e,i,r,n,ru)?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,ru.x),l.addScaledVector(s,ru.y),l.addScaledVector(o,ru.z),l)}static getInterpolatedAttribute(e,i,r,n,a,s){return r_.setScalar(0),ry.setScalar(0),rx.setScalar(0),r_.fromBufferAttribute(e,i),ry.fromBufferAttribute(e,r),rx.fromBufferAttribute(e,n),s.setScalar(0),s.addScaledVector(r_,a.x),s.addScaledVector(ry,a.y),s.addScaledVector(rx,a.z),s}static isFrontFacing(e,i,r,n){return rl.subVectors(r,i),rc.subVectors(e,i),0>rl.cross(rc).dot(n)}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,n){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,i,r,n){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return rl.subVectors(this.c,this.b),rc.subVectors(this.a,this.b),.5*rl.cross(rc).length()}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return rM.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return rM.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,r,n,a){return rM.getInterpolation(e,this.a,this.b,this.c,i,r,n,a)}containsPoint(e){return rM.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return rM.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){let r,n,a=this.a,s=this.b,o=this.c;rd.subVectors(s,a),rp.subVectors(o,a),rm.subVectors(e,a);let l=rd.dot(rm),c=rp.dot(rm);if(l<=0&&c<=0)return i.copy(a);rg.subVectors(e,s);let h=rd.dot(rg),u=rp.dot(rg);if(h>=0&&u<=h)return i.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return r=l/(l-h),i.copy(a).addScaledVector(rd,r);rv.subVectors(e,o);let p=rd.dot(rv),f=rp.dot(rv);if(f>=0&&p<=f)return i.copy(o);let m=p*c-l*f;if(m<=0&&c>=0&&f<=0)return n=c/(c-f),i.copy(a).addScaledVector(rp,n);let g=h*f-p*u;if(g<=0&&u-h>=0&&p-f>=0)return rf.subVectors(o,s),n=(u-h)/(u-h+(p-f)),i.copy(s).addScaledVector(rf,n);let v=1/(g+m+d);return r=m*v,n=d*v,i.copy(a).addScaledVector(rd,r).addScaledVector(rp,n)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}let rb={aliceblue:0xf0f8ff,antiquewhite:0xfaebd7,aqua:65535,aquamarine:8388564,azure:0xf0ffff,beige:0xf5f5dc,bisque:0xffe4c4,black:0,blanchedalmond:0xffebcd,blue:255,blueviolet:9055202,brown:0xa52a2a,burlywood:0xdeb887,cadetblue:6266528,chartreuse:8388352,chocolate:0xd2691e,coral:0xff7f50,cornflowerblue:6591981,cornsilk:0xfff8dc,crimson:0xdc143c,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:0xb8860b,darkgray:0xa9a9a9,darkgreen:25600,darkgrey:0xa9a9a9,darkkhaki:0xbdb76b,darkmagenta:9109643,darkolivegreen:5597999,darkorange:0xff8c00,darkorchid:0x9932cc,darkred:9109504,darksalmon:0xe9967a,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:0xff1493,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:0xb22222,floralwhite:0xfffaf0,forestgreen:2263842,fuchsia:0xff00ff,gainsboro:0xdcdcdc,ghostwhite:0xf8f8ff,gold:0xffd700,goldenrod:0xdaa520,gray:8421504,green:32768,greenyellow:0xadff2f,grey:8421504,honeydew:0xf0fff0,hotpink:0xff69b4,indianred:0xcd5c5c,indigo:4915330,ivory:0xfffff0,khaki:0xf0e68c,lavender:0xe6e6fa,lavenderblush:0xfff0f5,lawngreen:8190976,lemonchiffon:0xfffacd,lightblue:0xadd8e6,lightcoral:0xf08080,lightcyan:0xe0ffff,lightgoldenrodyellow:0xfafad2,lightgray:0xd3d3d3,lightgreen:9498256,lightgrey:0xd3d3d3,lightpink:0xffb6c1,lightsalmon:0xffa07a,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:0xb0c4de,lightyellow:0xffffe0,lime:65280,limegreen:3329330,linen:0xfaf0e6,magenta:0xff00ff,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:0xba55d3,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:0xc71585,midnightblue:1644912,mintcream:0xf5fffa,mistyrose:0xffe4e1,moccasin:0xffe4b5,navajowhite:0xffdead,navy:128,oldlace:0xfdf5e6,olive:8421376,olivedrab:7048739,orange:0xffa500,orangered:0xff4500,orchid:0xda70d6,palegoldenrod:0xeee8aa,palegreen:0x98fb98,paleturquoise:0xafeeee,palevioletred:0xdb7093,papayawhip:0xffefd5,peachpuff:0xffdab9,peru:0xcd853f,pink:0xffc0cb,plum:0xdda0dd,powderblue:0xb0e0e6,purple:8388736,rebeccapurple:6697881,red:0xff0000,rosybrown:0xbc8f8f,royalblue:4286945,saddlebrown:9127187,salmon:0xfa8072,sandybrown:0xf4a460,seagreen:3050327,seashell:0xfff5ee,sienna:0xa0522d,silver:0xc0c0c0,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:0xfffafa,springgreen:65407,steelblue:4620980,tan:0xd2b48c,teal:32896,thistle:0xd8bfd8,tomato:0xff6347,turquoise:4251856,violet:0xee82ee,wheat:0xf5deb3,white:0xffffff,whitesmoke:0xf5f5f5,yellow:0xffff00,yellowgreen:0x9acd32},rS={h:0,s:0,l:0},rE={h:0,s:0,l:0};function rT(e,i,r){return(r<0&&(r+=1),r>1&&(r-=1),r<1/6)?e+(i-e)*6*r:r<.5?i:r<2/3?e+(i-e)*6*(2/3-r):e}class rw{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){return void 0===i&&void 0===r?e&&e.isColor?this.copy(e):"number"==typeof e?this.setHex(e):"string"==typeof e&&this.setStyle(e):this.setRGB(e,i,r),this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=tS){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(255&e)/255,ie.colorSpaceToWorking(this,i),this}setRGB(e,i,r,n=ie.workingColorSpace){return this.r=e,this.g=i,this.b=r,ie.colorSpaceToWorking(this,n),this}setHSL(e,i,r,n=ie.workingColorSpace){if(e=tW(e,1),i=tG(i,0,1),r=tG(r,0,1),0===i)this.r=this.g=this.b=r;else{let n=r<=.5?r*(1+i):r+i-r*i,a=2*r-n;this.r=rT(a,n,e+1/3),this.g=rT(a,n,e),this.b=rT(a,n,e-1/3)}return ie.colorSpaceToWorking(this,n),this}setStyle(e,i=tS){let r;function n(i){void 0!==i&&1>parseFloat(i)&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let a,s=r[1],o=r[2];switch(s){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,i);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,i);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],a=n.length;if(3===a)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,i);if(6===a)return this.setHex(parseInt(n,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=tS){let r=rb[e.toLowerCase()];return void 0!==r?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=it(e.r),this.g=it(e.g),this.b=it(e.b),this}copyLinearToSRGB(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=tS){return ie.workingToColorSpace(rA.copy(this),e),65536*Math.round(tG(255*rA.r,0,255))+256*Math.round(tG(255*rA.g,0,255))+Math.round(tG(255*rA.b,0,255))}getHexString(e=tS){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=ie.workingColorSpace){let r,n;ie.workingToColorSpace(rA.copy(this),i);let a=rA.r,s=rA.g,o=rA.b,l=Math.max(a,s,o),c=Math.min(a,s,o),h=(c+l)/2;if(c===l)r=0,n=0;else{let e=l-c;switch(n=h<=.5?e/(l+c):e/(2-l-c),l){case a:r=(s-o)/e+6*(s<o);break;case s:r=(o-a)/e+2;break;case o:r=(a-s)/e+4}r/=6}return e.h=r,e.s=n,e.l=h,e}getRGB(e,i=ie.workingColorSpace){return ie.workingToColorSpace(rA.copy(this),i),e.r=rA.r,e.g=rA.g,e.b=rA.b,e}getStyle(e=tS){ie.workingToColorSpace(rA.copy(this),e);let i=rA.r,r=rA.g,n=rA.b;return e!==tS?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(255*i)},${Math.round(255*r)},${Math.round(255*n)})`}offsetHSL(e,i,r){return this.getHSL(rS),this.setHSL(rS.h+e,rS.s+i,rS.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(rS),e.getHSL(rE);let r=tX(rS.h,rE.h,i),n=tX(rS.s,rE.s,i),a=tX(rS.l,rE.l,i);return this.setHSL(r,n,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let i=this.r,r=this.g,n=this.b,a=e.elements;return this.r=a[0]*i+a[3]*r+a[6]*n,this.g=a[1]*i+a[4]*r+a[7]*n,this.b=a[2]*i+a[5]*r+a[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}let rA=new rw;rw.NAMES=rb;let rR=0;class rC extends tF{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rR++}),this.uuid=tH(),this.name="",this.type="Material",this.blending=y,this.side=m,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=D,this.blendDst=U,this.blendEquation=E,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rw(0,0,0),this.blendAlpha=0,this.depthFunc=q,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(void 0!==e)for(let i in e){let r=e[i];if(void 0===r){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}let n=this[i];if(void 0===n){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(r):n&&n.isVector3&&r&&r.isVector3?n.copy(r):this[i]=r}}toJSON(e){let i=void 0===e||"string"==typeof e;i&&(e={textures:{},images:{}});let r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};function n(e){let i=[];for(let r in e){let n=e[r];delete n.metadata,i.push(n)}return i}if(r.uuid=this.uuid,r.type=this.type,""!==this.name&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),void 0!==this.roughness&&(r.roughness=this.roughness),void 0!==this.metalness&&(r.metalness=this.metalness),void 0!==this.sheen&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),void 0!==this.sheenRoughness&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),void 0!==this.emissiveIntensity&&1!==this.emissiveIntensity&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),void 0!==this.specularIntensity&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),void 0!==this.shininess&&(r.shininess=this.shininess),void 0!==this.clearcoat&&(r.clearcoat=this.clearcoat),void 0!==this.clearcoatRoughness&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),void 0!==this.dispersion&&(r.dispersion=this.dispersion),void 0!==this.iridescence&&(r.iridescence=this.iridescence),void 0!==this.iridescenceIOR&&(r.iridescenceIOR=this.iridescenceIOR),void 0!==this.iridescenceThicknessRange&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),void 0!==this.anisotropy&&(r.anisotropy=this.anisotropy),void 0!==this.anisotropyRotation&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,void 0!==this.combine&&(r.combine=this.combine)),void 0!==this.envMapRotation&&(r.envMapRotation=this.envMapRotation.toArray()),void 0!==this.envMapIntensity&&(r.envMapIntensity=this.envMapIntensity),void 0!==this.reflectivity&&(r.reflectivity=this.reflectivity),void 0!==this.refractionRatio&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),void 0!==this.transmission&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),void 0!==this.thickness&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),void 0!==this.attenuationDistance&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),void 0!==this.attenuationColor&&(r.attenuationColor=this.attenuationColor.getHex()),void 0!==this.size&&(r.size=this.size),null!==this.shadowSide&&(r.shadowSide=this.shadowSide),void 0!==this.sizeAttenuation&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==y&&(r.blending=this.blending),this.side!==m&&(r.side=this.side),!0===this.vertexColors&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),!0===this.transparent&&(r.transparent=!0),this.blendSrc!==D&&(r.blendSrc=this.blendSrc),this.blendDst!==U&&(r.blendDst=this.blendDst),this.blendEquation!==E&&(r.blendEquation=this.blendEquation),null!==this.blendSrcAlpha&&(r.blendSrcAlpha=this.blendSrcAlpha),null!==this.blendDstAlpha&&(r.blendDstAlpha=this.blendDstAlpha),null!==this.blendEquationAlpha&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),0!==this.blendAlpha&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==q&&(r.depthFunc=this.depthFunc),!1===this.depthTest&&(r.depthTest=this.depthTest),!1===this.depthWrite&&(r.depthWrite=this.depthWrite),!1===this.colorWrite&&(r.colorWrite=this.colorWrite),255!==this.stencilWriteMask&&(r.stencilWriteMask=this.stencilWriteMask),519!==this.stencilFunc&&(r.stencilFunc=this.stencilFunc),0!==this.stencilRef&&(r.stencilRef=this.stencilRef),255!==this.stencilFuncMask&&(r.stencilFuncMask=this.stencilFuncMask),7680!==this.stencilFail&&(r.stencilFail=this.stencilFail),7680!==this.stencilZFail&&(r.stencilZFail=this.stencilZFail),7680!==this.stencilZPass&&(r.stencilZPass=this.stencilZPass),!0===this.stencilWrite&&(r.stencilWrite=this.stencilWrite),void 0!==this.rotation&&0!==this.rotation&&(r.rotation=this.rotation),!0===this.polygonOffset&&(r.polygonOffset=!0),0!==this.polygonOffsetFactor&&(r.polygonOffsetFactor=this.polygonOffsetFactor),0!==this.polygonOffsetUnits&&(r.polygonOffsetUnits=this.polygonOffsetUnits),void 0!==this.linewidth&&1!==this.linewidth&&(r.linewidth=this.linewidth),void 0!==this.dashSize&&(r.dashSize=this.dashSize),void 0!==this.gapSize&&(r.gapSize=this.gapSize),void 0!==this.scale&&(r.scale=this.scale),!0===this.dithering&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),!0===this.alphaHash&&(r.alphaHash=!0),!0===this.alphaToCoverage&&(r.alphaToCoverage=!0),!0===this.premultipliedAlpha&&(r.premultipliedAlpha=!0),!0===this.forceSinglePass&&(r.forceSinglePass=!0),!0===this.wireframe&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),"round"!==this.wireframeLinecap&&(r.wireframeLinecap=this.wireframeLinecap),"round"!==this.wireframeLinejoin&&(r.wireframeLinejoin=this.wireframeLinejoin),!0===this.flatShading&&(r.flatShading=!0),!1===this.visible&&(r.visible=!1),!1===this.toneMapped&&(r.toneMapped=!1),!1===this.fog&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData),i){let i=n(e.textures),a=n(e.images);i.length>0&&(r.textures=i),a.length>0&&(r.images=a)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let i=e.clippingPlanes,r=null;if(null!==i){let e=i.length;r=Array(e);for(let n=0;n!==e;++n)r[n]=i[n].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){!0===e&&this.version++}}class rP extends rC{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new rw(0xffffff),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new i0,this.combine=Q,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}let rI=new tZ,rL=new tK,rD=0;class rU{constructor(e,i,r=!1){if(Array.isArray(e))throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rD++}),this.name="",this.array=e,this.itemSize=i,this.count=void 0!==e?e.length/i:0,this.normalized=r,this.usage=35044,this.updateRanges=[],this.gpuType=eP,this.version=0}onUploadCallback(){}set needsUpdate(e){!0===e&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let n=0,a=this.itemSize;n<a;n++)this.array[e+n]=i.array[r+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(2===this.itemSize)for(let i=0,r=this.count;i<r;i++)rL.fromBufferAttribute(this,i),rL.applyMatrix3(e),this.setXY(i,rL.x,rL.y);else if(3===this.itemSize)for(let i=0,r=this.count;i<r;i++)rI.fromBufferAttribute(this,i),rI.applyMatrix3(e),this.setXYZ(i,rI.x,rI.y,rI.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)rI.fromBufferAttribute(this,i),rI.applyMatrix4(e),this.setXYZ(i,rI.x,rI.y,rI.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)rI.fromBufferAttribute(this,i),rI.applyNormalMatrix(e),this.setXYZ(i,rI.x,rI.y,rI.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)rI.fromBufferAttribute(this,i),rI.transformDirection(e),this.setXYZ(i,rI.x,rI.y,rI.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=tj(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=tq(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=tj(i,this.array)),i}setX(e,i){return this.normalized&&(i=tq(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=tj(i,this.array)),i}setY(e,i){return this.normalized&&(i=tq(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=tj(i,this.array)),i}setZ(e,i){return this.normalized&&(i=tq(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=tj(i,this.array)),i}setW(e,i){return this.normalized&&(i=tq(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=tq(i,this.array),r=tq(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,n){return e*=this.itemSize,this.normalized&&(i=tq(i,this.array),r=tq(r,this.array),n=tq(n,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=n,this}setXYZW(e,i,r,n,a){return e*=this.itemSize,this.normalized&&(i=tq(i,this.array),r=tq(r,this.array),n=tq(n,this.array),a=tq(a,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=n,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return""!==this.name&&(e.name=this.name),35044!==this.usage&&(e.usage=this.usage),e}}class rN extends rU{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class rO extends rU{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class rF extends rU{constructor(e,i,r){super(new Float32Array(e),i,r)}}let rB=0,rz=new iW,rk=new ro,rV=new tZ,rH=new iv,rG=new iv,rW=new tZ;class rX extends tF{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rB++}),this.uuid=tH(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(t2(e)?rO:rN)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return void 0!==this.attributes[e]}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){let i=this.attributes.position;void 0!==i&&(i.applyMatrix4(e),i.needsUpdate=!0);let r=this.attributes.normal;if(void 0!==r){let i=new t0().getNormalMatrix(e);r.applyNormalMatrix(i),r.needsUpdate=!0}let n=this.attributes.tangent;return void 0!==n&&(n.transformDirection(e),n.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}applyQuaternion(e){return rz.makeRotationFromQuaternion(e),this.applyMatrix4(rz),this}rotateX(e){return rz.makeRotationX(e),this.applyMatrix4(rz),this}rotateY(e){return rz.makeRotationY(e),this.applyMatrix4(rz),this}rotateZ(e){return rz.makeRotationZ(e),this.applyMatrix4(rz),this}translate(e,i,r){return rz.makeTranslation(e,i,r),this.applyMatrix4(rz),this}scale(e,i,r){return rz.makeScale(e,i,r),this.applyMatrix4(rz),this}lookAt(e){return rk.lookAt(e),rk.updateMatrix(),this.applyMatrix4(rk.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rV).negate(),this.translate(rV.x,rV.y,rV.z),this}setFromPoints(e){let i=this.getAttribute("position");if(void 0===i){let i=[];for(let r=0,n=e.length;r<n;r++){let n=e[r];i.push(n.x,n.y,n.z||0)}this.setAttribute("position",new rF(i,3))}else{let r=Math.min(e.length,i.count);for(let n=0;n<r;n++){let r=e[n];i.setXYZ(n,r.x,r.y,r.z||0)}e.length>i.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new iv);let e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new tZ(-1/0,-1/0,-1/0),new tZ(Infinity,Infinity,Infinity));return}if(void 0!==e){if(this.boundingBox.setFromBufferAttribute(e),i)for(let e=0,r=i.length;e<r;e++){let r=i[e];rH.setFromBufferAttribute(r),this.morphTargetsRelative?(rW.addVectors(this.boundingBox.min,rH.min),this.boundingBox.expandByPoint(rW),rW.addVectors(this.boundingBox.max,rH.max),this.boundingBox.expandByPoint(rW)):(this.boundingBox.expandByPoint(rH.min),this.boundingBox.expandByPoint(rH.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new iN);let e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new tZ,1/0);return}if(e){let r=this.boundingSphere.center;if(rH.setFromBufferAttribute(e),i)for(let e=0,r=i.length;e<r;e++){let r=i[e];rG.setFromBufferAttribute(r),this.morphTargetsRelative?(rW.addVectors(rH.min,rG.min),rH.expandByPoint(rW),rW.addVectors(rH.max,rG.max),rH.expandByPoint(rW)):(rH.expandByPoint(rG.min),rH.expandByPoint(rG.max))}rH.getCenter(r);let n=0;for(let i=0,a=e.count;i<a;i++)rW.fromBufferAttribute(e,i),n=Math.max(n,r.distanceToSquared(rW));if(i)for(let a=0,s=i.length;a<s;a++){let s=i[a],o=this.morphTargetsRelative;for(let i=0,a=s.count;i<a;i++)rW.fromBufferAttribute(s,i),o&&(rV.fromBufferAttribute(e,i),rW.add(rV)),n=Math.max(n,r.distanceToSquared(rW))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,i=this.attributes;if(null===e||void 0===i.position||void 0===i.normal||void 0===i.uv)return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");let r=i.position,n=i.normal,a=i.uv;!1===this.hasAttribute("tangent")&&this.setAttribute("tangent",new rU(new Float32Array(4*r.count),4));let s=this.getAttribute("tangent"),o=[],l=[];for(let e=0;e<r.count;e++)o[e]=new tZ,l[e]=new tZ;let c=new tZ,h=new tZ,u=new tZ,d=new tK,p=new tK,f=new tK,m=new tZ,g=new tZ,v=this.groups;0===v.length&&(v=[{start:0,count:e.count}]);for(let i=0,n=v.length;i<n;++i){let n=v[i],s=n.start,_=n.count;for(let i=s,n=s+_;i<n;i+=3)!function(e,i,n){c.fromBufferAttribute(r,e),h.fromBufferAttribute(r,i),u.fromBufferAttribute(r,n),d.fromBufferAttribute(a,e),p.fromBufferAttribute(a,i),f.fromBufferAttribute(a,n),h.sub(c),u.sub(c),p.sub(d),f.sub(d);let s=1/(p.x*f.y-f.x*p.y);isFinite(s)&&(m.copy(h).multiplyScalar(f.y).addScaledVector(u,-p.y).multiplyScalar(s),g.copy(u).multiplyScalar(p.x).addScaledVector(h,-f.x).multiplyScalar(s),o[e].add(m),o[i].add(m),o[n].add(m),l[e].add(g),l[i].add(g),l[n].add(g))}(e.getX(i+0),e.getX(i+1),e.getX(i+2))}let _=new tZ,y=new tZ,x=new tZ,M=new tZ;function b(e){x.fromBufferAttribute(n,e),M.copy(x);let i=o[e];_.copy(i),_.sub(x.multiplyScalar(x.dot(i))).normalize(),y.crossVectors(M,i);let r=y.dot(l[e]);s.setXYZW(e,_.x,_.y,_.z,r<0?-1:1)}for(let i=0,r=v.length;i<r;++i){let r=v[i],n=r.start,a=r.count;for(let i=n,r=n+a;i<r;i+=3)b(e.getX(i+0)),b(e.getX(i+1)),b(e.getX(i+2))}}computeVertexNormals(){let e=this.index,i=this.getAttribute("position");if(void 0!==i){let r=this.getAttribute("normal");if(void 0===r)r=new rU(new Float32Array(3*i.count),3),this.setAttribute("normal",r);else for(let e=0,i=r.count;e<i;e++)r.setXYZ(e,0,0,0);let n=new tZ,a=new tZ,s=new tZ,o=new tZ,l=new tZ,c=new tZ,h=new tZ,u=new tZ;if(e)for(let d=0,p=e.count;d<p;d+=3){let p=e.getX(d+0),f=e.getX(d+1),m=e.getX(d+2);n.fromBufferAttribute(i,p),a.fromBufferAttribute(i,f),s.fromBufferAttribute(i,m),h.subVectors(s,a),u.subVectors(n,a),h.cross(u),o.fromBufferAttribute(r,p),l.fromBufferAttribute(r,f),c.fromBufferAttribute(r,m),o.add(h),l.add(h),c.add(h),r.setXYZ(p,o.x,o.y,o.z),r.setXYZ(f,l.x,l.y,l.z),r.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=i.count;e<o;e+=3)n.fromBufferAttribute(i,e+0),a.fromBufferAttribute(i,e+1),s.fromBufferAttribute(i,e+2),h.subVectors(s,a),u.subVectors(n,a),h.cross(u),r.setXYZ(e+0,h.x,h.y,h.z),r.setXYZ(e+1,h.x,h.y,h.z),r.setXYZ(e+2,h.x,h.y,h.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)rW.fromBufferAttribute(e,i),rW.normalize(),e.setXYZ(i,rW.x,rW.y,rW.z)}toNonIndexed(){function e(e,i){let r=e.array,n=e.itemSize,a=e.normalized,s=new r.constructor(i.length*n),o=0,l=0;for(let a=0,c=i.length;a<c;a++){o=e.isInterleavedBufferAttribute?i[a]*e.data.stride+e.offset:i[a]*n;for(let e=0;e<n;e++)s[l++]=r[o++]}return new rU(s,n,a)}if(null===this.index)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let i=new rX,r=this.index.array,n=this.attributes;for(let a in n){let s=e(n[a],r);i.setAttribute(a,s)}let a=this.morphAttributes;for(let n in a){let s=[],o=a[n];for(let i=0,n=o.length;i<n;i++){let n=e(o[i],r);s.push(n)}i.morphAttributes[n]=s}i.morphTargetsRelative=this.morphTargetsRelative;let s=this.groups;for(let e=0,r=s.length;e<r;e++){let r=s[e];i.addGroup(r.start,r.count,r.materialIndex)}return i}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,""!==this.name&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),void 0!==this.parameters){let i=this.parameters;for(let r in i)void 0!==i[r]&&(e[r]=i[r]);return e}e.data={attributes:{}};let i=this.index;null!==i&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});let r=this.attributes;for(let i in r){let n=r[i];e.data.attributes[i]=n.toJSON(e.data)}let n={},a=!1;for(let i in this.morphAttributes){let r=this.morphAttributes[i],s=[];for(let i=0,n=r.length;i<n;i++){let n=r[i];s.push(n.toJSON(e.data))}s.length>0&&(n[i]=s,a=!0)}a&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);let s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));let o=this.boundingSphere;return null!==o&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let i={};this.name=e.name;let r=e.index;null!==r&&this.setIndex(r.clone());let n=e.attributes;for(let e in n){let r=n[e];this.setAttribute(e,r.clone(i))}let a=e.morphAttributes;for(let e in a){let r=[],n=a[e];for(let e=0,a=n.length;e<a;e++)r.push(n[e].clone(i));this.morphAttributes[e]=r}this.morphTargetsRelative=e.morphTargetsRelative;let s=e.groups;for(let e=0,i=s.length;e<i;e++){let i=s[e];this.addGroup(i.start,i.count,i.materialIndex)}let o=e.boundingBox;null!==o&&(this.boundingBox=o.clone());let l=e.boundingSphere;return null!==l&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let rj=new iW,rq=new iG,rY=new iN,rK=new tZ,rJ=new tZ,rZ=new tZ,rQ=new tZ,r$=new tZ,r0=new tZ,r1=new tZ,r2=new tZ;class r3 extends ro{constructor(e=new rX,i=new rP){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),void 0!==e.morphTargetInfluences&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),void 0!==e.morphTargetDictionary&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let r=e[i[0]];if(void 0!==r){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,i=r.length;e<i;e++){let i=r[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[i]=e}}}}getVertexPosition(e,i){let r=this.geometry,n=r.attributes.position,a=r.morphAttributes.position,s=r.morphTargetsRelative;i.fromBufferAttribute(n,e);let o=this.morphTargetInfluences;if(a&&o){r0.set(0,0,0);for(let r=0,n=a.length;r<n;r++){let n=o[r],l=a[r];0!==n&&(r$.fromBufferAttribute(l,e),s?r0.addScaledVector(r$,n):r0.addScaledVector(r$.sub(i),n))}i.add(r0)}return i}raycast(e,i){let r=this.geometry,n=this.material,a=this.matrixWorld;if(void 0!==n)null===r.boundingSphere&&r.computeBoundingSphere(),rY.copy(r.boundingSphere),rY.applyMatrix4(a),rq.copy(e.ray).recast(e.near),!1===rY.containsPoint(rq.origin)&&(null===rq.intersectSphere(rY,rK)||rq.origin.distanceToSquared(rK)>(e.far-e.near)**2)||(rj.copy(a).invert(),rq.copy(e.ray).applyMatrix4(rj),(null===r.boundingBox||!1!==rq.intersectsBox(r.boundingBox))&&this._computeIntersections(e,i,rq))}_computeIntersections(e,i,r){let n,a=this.geometry,s=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,d=a.groups,p=a.drawRange;if(null!==o)if(Array.isArray(s))for(let a=0,l=d.length;a<l;a++){let l=d[a],f=s[l.materialIndex],m=Math.max(l.start,p.start),g=Math.min(o.count,Math.min(l.start+l.count,p.start+p.count));for(let a=m;a<g;a+=3){let s=o.getX(a);(n=r4(this,f,e,r,c,h,u,s,o.getX(a+1),o.getX(a+2)))&&(n.faceIndex=Math.floor(a/3),n.face.materialIndex=l.materialIndex,i.push(n))}}else{let a=Math.max(0,p.start),l=Math.min(o.count,p.start+p.count);for(let d=a;d<l;d+=3){let a=o.getX(d);(n=r4(this,s,e,r,c,h,u,a,o.getX(d+1),o.getX(d+2)))&&(n.faceIndex=Math.floor(d/3),i.push(n))}}else if(void 0!==l)if(Array.isArray(s))for(let a=0,o=d.length;a<o;a++){let o=d[a],f=s[o.materialIndex],m=Math.max(o.start,p.start),g=Math.min(l.count,Math.min(o.start+o.count,p.start+p.count));for(let a=m;a<g;a+=3)(n=r4(this,f,e,r,c,h,u,a,a+1,a+2))&&(n.faceIndex=Math.floor(a/3),n.face.materialIndex=o.materialIndex,i.push(n))}else{let a=Math.max(0,p.start),o=Math.min(l.count,p.start+p.count);for(let l=a;l<o;l+=3)(n=r4(this,s,e,r,c,h,u,l,l+1,l+2))&&(n.faceIndex=Math.floor(l/3),i.push(n))}}}function r4(e,i,r,n,a,s,o,l,c,h){e.getVertexPosition(l,rJ),e.getVertexPosition(c,rZ),e.getVertexPosition(h,rQ);let u=function(e,i,r,n,a,s,o,l){if(null===(i.side===g?n.intersectTriangle(o,s,a,!0,l):n.intersectTriangle(a,s,o,i.side===m,l)))return null;r2.copy(l),r2.applyMatrix4(e.matrixWorld);let c=r.ray.origin.distanceTo(r2);return c<r.near||c>r.far?null:{distance:c,point:r2.clone(),object:e}}(e,i,r,n,rJ,rZ,rQ,r1);if(u){let e=new tZ;rM.getBarycoord(r1,rJ,rZ,rQ,e),a&&(u.uv=rM.getInterpolatedAttribute(a,l,c,h,e,new tK)),s&&(u.uv1=rM.getInterpolatedAttribute(s,l,c,h,e,new tK)),o&&(u.normal=rM.getInterpolatedAttribute(o,l,c,h,e,new tZ),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let i={a:l,b:c,c:h,normal:new tZ,materialIndex:0};rM.getNormal(rJ,rZ,rQ,i.normal),u.face=i,u.barycoord=e}return u}class r5 extends rX{constructor(e=1,i=1,r=1,n=1,a=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:n,heightSegments:a,depthSegments:s};let o=this;n=Math.floor(n),a=Math.floor(a);let l=[],c=[],h=[],u=[],d=0,p=0;function f(e,i,r,n,a,s,f,m,g,v,_){let y=s/g,x=f/v,M=s/2,b=f/2,S=m/2,E=g+1,T=v+1,w=0,A=0,R=new tZ;for(let s=0;s<T;s++){let o=s*x-b;for(let l=0;l<E;l++){let d=l*y-M;R[e]=d*n,R[i]=o*a,R[r]=S,c.push(R.x,R.y,R.z),R[e]=0,R[i]=0,R[r]=m>0?1:-1,h.push(R.x,R.y,R.z),u.push(l/g),u.push(1-s/v),w+=1}}for(let e=0;e<v;e++)for(let i=0;i<g;i++){let r=d+i+E*e,n=d+i+E*(e+1),a=d+(i+1)+E*(e+1),s=d+(i+1)+E*e;l.push(r,n,s),l.push(n,a,s),A+=6}o.addGroup(p,A,_),p+=A,d+=w}f("z","y","x",-1,-1,r,i,e,s=Math.floor(s),a,0),f("z","y","x",1,-1,r,i,-e,s,a,1),f("x","z","y",1,1,e,r,i,n,s,2),f("x","z","y",1,-1,e,r,-i,n,s,3),f("x","y","z",1,-1,e,i,r,n,a,4),f("x","y","z",-1,-1,e,i,-r,n,a,5),this.setIndex(l),this.setAttribute("position",new rF(c,3)),this.setAttribute("normal",new rF(h,3)),this.setAttribute("uv",new rF(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r5(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function r6(e){let i={};for(let r in e)for(let n in i[r]={},e[r]){let a=e[r][n];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),i[r][n]=null):i[r][n]=a.clone():Array.isArray(a)?i[r][n]=a.slice():i[r][n]=a}return i}function r9(e){let i={};for(let r=0;r<e.length;r++){let n=r6(e[r]);for(let e in n)i[e]=n[e]}return i}function r8(e){let i=e.getRenderTarget();return null===i?e.outputColorSpace:!0===i.isXRRenderTarget?i.texture.colorSpace:ie.workingColorSpace}let r7={clone:r6,merge:r9};var ne=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nt=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ni extends rC{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ne,this.fragmentShader=nt,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,void 0!==e&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=r6(e.uniforms),this.uniformsGroups=function(e){let i=[];for(let r=0;r<e.length;r++)i.push(e[r].clone());return i}(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let i=super.toJSON(e);for(let r in i.glslVersion=this.glslVersion,i.uniforms={},this.uniforms){let n=this.uniforms[r].value;n&&n.isTexture?i.uniforms[r]={type:"t",value:n.toJSON(e).uuid}:n&&n.isColor?i.uniforms[r]={type:"c",value:n.getHex()}:n&&n.isVector2?i.uniforms[r]={type:"v2",value:n.toArray()}:n&&n.isVector3?i.uniforms[r]={type:"v3",value:n.toArray()}:n&&n.isVector4?i.uniforms[r]={type:"v4",value:n.toArray()}:n&&n.isMatrix3?i.uniforms[r]={type:"m3",value:n.toArray()}:n&&n.isMatrix4?i.uniforms[r]={type:"m4",value:n.toArray()}:i.uniforms[r]={value:n}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;let r={};for(let e in this.extensions)!0===this.extensions[e]&&(r[e]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class nr extends ro{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new iW,this.projectionMatrix=new iW,this.projectionMatrixInverse=new iW,this.coordinateSystem=tO,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}let nn=new tZ,na=new tK,ns=new tK;class no extends nr{constructor(e=50,i=1,r=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=n,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=null===e.view?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let i=.5*this.getFilmHeight()/e;this.fov=2*tV*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(.5*tk*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return 2*tV*Math.atan(Math.tan(.5*tk*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,r){nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(nn.x,nn.y).multiplyScalar(-e/nn.z),nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(nn.x,nn.y).multiplyScalar(-e/nn.z)}getViewSize(e,i){return this.getViewBounds(e,na,ns),i.subVectors(ns,na)}setViewOffset(e,i,r,n,a,s){this.aspect=e/i,null===this.view&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=n,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){null!==this.view&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,i=e*Math.tan(.5*tk*this.fov)/this.zoom,r=2*i,n=this.aspect*r,a=-.5*n,s=this.view;if(null!==this.view&&this.view.enabled){let e=s.fullWidth,o=s.fullHeight;a+=s.offsetX*n/e,i-=s.offsetY*r/o,n*=s.width/e,r*=s.height/o}let o=this.filmOffset;0!==o&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+n,i,i-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,null!==this.view&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}class nl extends ro{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;let n=new no(-90,1,e,i);n.layers=this.layers,this.add(n);let a=new no(-90,1,e,i);a.layers=this.layers,this.add(a);let s=new no(-90,1,e,i);s.layers=this.layers,this.add(s);let o=new no(-90,1,e,i);o.layers=this.layers,this.add(o);let l=new no(-90,1,e,i);l.layers=this.layers,this.add(l);let c=new no(-90,1,e,i);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,i=this.children.concat(),[r,n,a,s,o,l]=i;for(let e of i)this.remove(e);if(e===tO)r.up.set(0,1,0),r.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(2001===e)r.up.set(0,-1,0),r.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let e of i)this.add(e),e.updateMatrixWorld()}update(e,i){null===this.parent&&this.updateMatrixWorld();let{renderTarget:r,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[a,s,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),f=e.xr.enabled;e.xr.enabled=!1;let m=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,n),e.render(i,a),e.setRenderTarget(r,1,n),e.render(i,s),e.setRenderTarget(r,2,n),e.render(i,o),e.setRenderTarget(r,3,n),e.render(i,l),e.setRenderTarget(r,4,n),e.render(i,c),r.texture.generateMipmaps=m,e.setRenderTarget(r,5,n),e.render(i,h),e.setRenderTarget(u,d,p),e.xr.enabled=f,r.texture.needsPMREMUpdate=!0}}class nc extends ih{constructor(e=[],i=eh,r,n,a,s,o,l,c,h){super(e,i,r,n,a,s,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class nh extends ip{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;let r={width:e,height:e,depth:1};this.texture=new nc([r,r,r,r,r,r]),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;let r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new r5(5,5,5),a=new ni({name:"CubemapFromEquirect",uniforms:r6(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:g,blending:_});a.uniforms.tEquirect.value=i;let s=new r3(n,a),o=i.minFilter;return i.minFilter===eS&&(i.minFilter=eM),new nl(1,10,this).update(e,s),i.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,i=!0,r=!0,n=!0){let a=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(i,r,n);e.setRenderTarget(a)}}class nu extends ro{constructor(){super(),this.isGroup=!0,this.type="Group"}}let nd={type:"move"};class np{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return null===this._hand&&(this._hand=new nu,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return null===this._targetRay&&(this._targetRay=new nu,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new tZ,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new tZ),this._targetRay}getGripSpace(){return null===this._grip&&(this._grip=new nu,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new tZ,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new tZ),this._grip}dispatchEvent(e){return null!==this._targetRay&&this._targetRay.dispatchEvent(e),null!==this._grip&&this._grip.dispatchEvent(e),null!==this._hand&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let i=this._hand;if(i)for(let r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),null!==this._targetRay&&(this._targetRay.visible=!1),null!==this._grip&&(this._grip.visible=!1),null!==this._hand&&(this._hand.visible=!1),this}update(e,i,r){let n=null,a=null,s=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&"visible-blurred"!==i.session.visibilityState){if(c&&e.hand){for(let n of(s=!0,e.hand.values())){let e=i.getJointPose(n,r),a=this._getHandJoint(c,n);null!==e&&(a.matrix.fromArray(e.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,a.jointRadius=e.radius),a.visible=null!==e}let n=c.joints["index-finger-tip"],a=c.joints["thumb-tip"],o=n.position.distanceTo(a.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else null!==l&&e.gripSpace&&null!==(a=i.getPose(e.gripSpace,r))&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1);null!==o&&(null===(n=i.getPose(e.targetRaySpace,r))&&null!==a&&(n=a),null!==n&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nd)))}return null!==o&&(o.visible=null!==n),null!==l&&(l.visible=null!==a),null!==c&&(c.visible=null!==s),this}_getHandJoint(e,i){if(void 0===e.joints[i.jointName]){let r=new nu;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class nf extends ro{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new i0,this.environmentIntensity=1,this.environmentRotation=new i0,this.overrideMaterial=null,"undefined"!=typeof __THREE_DEVTOOLS__&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),null!==e.background&&(this.background=e.background.clone()),null!==e.environment&&(this.environment=e.environment.clone()),null!==e.fog&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),null!==e.overrideMaterial&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let i=super.toJSON(e);return null!==this.fog&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),1!==this.backgroundIntensity&&(i.object.backgroundIntensity=this.backgroundIntensity),i.object.backgroundRotation=this.backgroundRotation.toArray(),1!==this.environmentIntensity&&(i.object.environmentIntensity=this.environmentIntensity),i.object.environmentRotation=this.environmentRotation.toArray(),i}}class nm{constructor(e,i){this.isInterleavedBuffer=!0,this.array=e,this.stride=i,this.count=void 0!==e?e.length/i:0,this.usage=35044,this.updateRanges=[],this.version=0,this.uuid=tH()}onUploadCallback(){}set needsUpdate(e){!0===e&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,i,r){e*=this.stride,r*=i.stride;for(let n=0,a=this.stride;n<a;n++)this.array[e+n]=i.array[r+n];return this}set(e,i=0){return this.array.set(e,i),this}clone(e){void 0===e.arrayBuffers&&(e.arrayBuffers={}),void 0===this.array.buffer._uuid&&(this.array.buffer._uuid=tH()),void 0===e.arrayBuffers[this.array.buffer._uuid]&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let i=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(i,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return void 0===e.arrayBuffers&&(e.arrayBuffers={}),void 0===this.array.buffer._uuid&&(this.array.buffer._uuid=tH()),void 0===e.arrayBuffers[this.array.buffer._uuid]&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}let ng=new tZ;class nv{constructor(e,i,r,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=i,this.offset=r,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let i=0,r=this.data.count;i<r;i++)ng.fromBufferAttribute(this,i),ng.applyMatrix4(e),this.setXYZ(i,ng.x,ng.y,ng.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)ng.fromBufferAttribute(this,i),ng.applyNormalMatrix(e),this.setXYZ(i,ng.x,ng.y,ng.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)ng.fromBufferAttribute(this,i),ng.transformDirection(e),this.setXYZ(i,ng.x,ng.y,ng.z);return this}getComponent(e,i){let r=this.array[e*this.data.stride+this.offset+i];return this.normalized&&(r=tj(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=tq(r,this.array)),this.data.array[e*this.data.stride+this.offset+i]=r,this}setX(e,i){return this.normalized&&(i=tq(i,this.array)),this.data.array[e*this.data.stride+this.offset]=i,this}setY(e,i){return this.normalized&&(i=tq(i,this.array)),this.data.array[e*this.data.stride+this.offset+1]=i,this}setZ(e,i){return this.normalized&&(i=tq(i,this.array)),this.data.array[e*this.data.stride+this.offset+2]=i,this}setW(e,i){return this.normalized&&(i=tq(i,this.array)),this.data.array[e*this.data.stride+this.offset+3]=i,this}getX(e){let i=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(i=tj(i,this.array)),i}getY(e){let i=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(i=tj(i,this.array)),i}getZ(e){let i=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(i=tj(i,this.array)),i}getW(e){let i=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(i=tj(i,this.array)),i}setXY(e,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(i=tq(i,this.array),r=tq(r,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this}setXYZ(e,i,r,n){return e=e*this.data.stride+this.offset,this.normalized&&(i=tq(i,this.array),r=tq(r,this.array),n=tq(n,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this.data.array[e+2]=n,this}setXYZW(e,i,r,n,a){return e=e*this.data.stride+this.offset,this.normalized&&(i=tq(i,this.array),r=tq(r,this.array),n=tq(n,this.array),a=tq(a,this.array)),this.data.array[e+0]=i,this.data.array[e+1]=r,this.data.array[e+2]=n,this.data.array[e+3]=a,this}clone(e){if(void 0!==e)return void 0===e.interleavedBuffers&&(e.interleavedBuffers={}),void 0===e.interleavedBuffers[this.data.uuid]&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new nv(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized);{console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let i=0;i<this.itemSize;i++)e.push(this.data.array[r+i])}return new rU(new this.array.constructor(e),this.itemSize,this.normalized)}}toJSON(e){if(void 0!==e)return void 0===e.interleavedBuffers&&(e.interleavedBuffers={}),void 0===e.interleavedBuffers[this.data.uuid]&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized};{console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let i=0;i<this.itemSize;i++)e.push(this.data.array[r+i])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}}}let n_=new tZ,ny=new iu,nx=new iu,nM=new tZ,nb=new iW,nS=new tZ,nE=new iN,nT=new iW,nw=new iG;class nA extends r3{constructor(e,i){super(e,i),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=ec,this.bindMatrix=new iW,this.bindMatrixInverse=new iW,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;null===this.boundingBox&&(this.boundingBox=new iv),this.boundingBox.makeEmpty();let i=e.getAttribute("position");for(let e=0;e<i.count;e++)this.getVertexPosition(e,nS),this.boundingBox.expandByPoint(nS)}computeBoundingSphere(){let e=this.geometry;null===this.boundingSphere&&(this.boundingSphere=new iN),this.boundingSphere.makeEmpty();let i=e.getAttribute("position");for(let e=0;e<i.count;e++)this.getVertexPosition(e,nS),this.boundingSphere.expandByPoint(nS)}copy(e,i){return super.copy(e,i),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,null!==e.boundingBox&&(this.boundingBox=e.boundingBox.clone()),null!==e.boundingSphere&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,i){let r=this.material,n=this.matrixWorld;if(void 0!==r)null===this.boundingSphere&&this.computeBoundingSphere(),nE.copy(this.boundingSphere),nE.applyMatrix4(n),!1!==e.ray.intersectsSphere(nE)&&(nT.copy(n).invert(),nw.copy(e.ray).applyMatrix4(nT),(null===this.boundingBox||!1!==nw.intersectsBox(this.boundingBox))&&this._computeIntersections(e,i,nw))}getVertexPosition(e,i){return super.getVertexPosition(e,i),this.applyBoneTransform(e,i),i}bind(e,i){this.skeleton=e,void 0===i&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),i=this.matrixWorld),this.bindMatrix.copy(i),this.bindMatrixInverse.copy(i).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new iu,i=this.geometry.attributes.skinWeight;for(let r=0,n=i.count;r<n;r++){e.fromBufferAttribute(i,r);let n=1/e.manhattanLength();n!==1/0?e.multiplyScalar(n):e.set(1,0,0,0),i.setXYZW(r,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===ec?this.bindMatrixInverse.copy(this.matrixWorld).invert():"detached"===this.bindMode?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,i){let r=this.skeleton,n=this.geometry;ny.fromBufferAttribute(n.attributes.skinIndex,e),nx.fromBufferAttribute(n.attributes.skinWeight,e),n_.copy(i).applyMatrix4(this.bindMatrix),i.set(0,0,0);for(let e=0;e<4;e++){let n=nx.getComponent(e);if(0!==n){let a=ny.getComponent(e);nb.multiplyMatrices(r.bones[a].matrixWorld,r.boneInverses[a]),i.addScaledVector(nM.copy(n_).applyMatrix4(nb),n)}}return i.applyMatrix4(this.bindMatrixInverse)}}class nR extends ro{constructor(){super(),this.isBone=!0,this.type="Bone"}}class nC extends ih{constructor(e=null,i=1,r=1,n,a,s,o,l,c=e_,h=e_,u,d){super(null,s,o,l,c,h,n,a,u,d),this.isDataTexture=!0,this.image={data:e,width:i,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}let nP=new iW,nI=new iW;class nL{constructor(e=[],i=[]){this.uuid=tH(),this.bones=e.slice(0),this.boneInverses=i,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,i=this.boneInverses;if(this.boneMatrices=new Float32Array(16*e.length),0===i.length)this.calculateInverses();else if(e.length!==i.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let e=0,i=this.bones.length;e<i;e++)this.boneInverses.push(new iW)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,i=this.bones.length;e<i;e++){let i=new iW;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,i=this.bones.length;e<i;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,i=this.bones.length;e<i;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,i=this.boneInverses,r=this.boneMatrices,n=this.boneTexture;for(let n=0,a=e.length;n<a;n++){let a=e[n]?e[n].matrixWorld:nI;nP.multiplyMatrices(a,i[n]),nP.toArray(r,16*n)}null!==n&&(n.needsUpdate=!0)}clone(){return new nL(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(4*this.bones.length),i=new Float32Array((e=Math.max(e=4*Math.ceil(e/4),4))*e*4);i.set(this.boneMatrices);let r=new nC(i,e,e,eB,eP);return r.needsUpdate=!0,this.boneMatrices=i,this.boneTexture=r,this}getBoneByName(e){for(let i=0,r=this.bones.length;i<r;i++){let r=this.bones[i];if(r.name===e)return r}}dispose(){null!==this.boneTexture&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,i){this.uuid=e.uuid;for(let r=0,n=e.bones.length;r<n;r++){let n=e.bones[r],a=i[n];void 0===a&&(console.warn("THREE.Skeleton: No bone found with UUID:",n),a=new nR),this.bones.push(a),this.boneInverses.push(new iW().fromArray(e.boneInverses[r]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let i=this.bones,r=this.boneInverses;for(let n=0,a=i.length;n<a;n++){let a=i[n];e.bones.push(a.uuid);let s=r[n];e.boneInverses.push(s.toArray())}return e}}class nD extends rU{constructor(e,i,r,n=1){super(e,i,r),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}let nU=new iW,nN=new iW,nO=[],nF=new iv,nB=new iW,nz=new r3,nk=new iN;class nV extends r3{constructor(e,i,r){super(e,i),this.isInstancedMesh=!0,this.instanceMatrix=new nD(new Float32Array(16*r),16),this.instanceColor=null,this.morphTexture=null,this.count=r,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<r;e++)this.setMatrixAt(e,nB)}computeBoundingBox(){let e=this.geometry,i=this.count;null===this.boundingBox&&(this.boundingBox=new iv),null===e.boundingBox&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let r=0;r<i;r++)this.getMatrixAt(r,nU),nF.copy(e.boundingBox).applyMatrix4(nU),this.boundingBox.union(nF)}computeBoundingSphere(){let e=this.geometry,i=this.count;null===this.boundingSphere&&(this.boundingSphere=new iN),null===e.boundingSphere&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let r=0;r<i;r++)this.getMatrixAt(r,nU),nk.copy(e.boundingSphere).applyMatrix4(nU),this.boundingSphere.union(nk)}copy(e,i){return super.copy(e,i),this.instanceMatrix.copy(e.instanceMatrix),null!==e.morphTexture&&(this.morphTexture=e.morphTexture.clone()),null!==e.instanceColor&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,null!==e.boundingBox&&(this.boundingBox=e.boundingBox.clone()),null!==e.boundingSphere&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,i){i.fromArray(this.instanceColor.array,3*e)}getMatrixAt(e,i){i.fromArray(this.instanceMatrix.array,16*e)}getMorphAt(e,i){let r=i.morphTargetInfluences,n=this.morphTexture.source.data.data,a=e*(r.length+1)+1;for(let e=0;e<r.length;e++)r[e]=n[a+e]}raycast(e,i){let r=this.matrixWorld,n=this.count;if((nz.geometry=this.geometry,nz.material=this.material,void 0!==nz.material)&&(null===this.boundingSphere&&this.computeBoundingSphere(),nk.copy(this.boundingSphere),nk.applyMatrix4(r),!1!==e.ray.intersectsSphere(nk)))for(let a=0;a<n;a++){this.getMatrixAt(a,nU),nN.multiplyMatrices(r,nU),nz.matrixWorld=nN,nz.raycast(e,nO);for(let e=0,r=nO.length;e<r;e++){let r=nO[e];r.instanceId=a,r.object=this,i.push(r)}nO.length=0}}setColorAt(e,i){null===this.instanceColor&&(this.instanceColor=new nD(new Float32Array(3*this.instanceMatrix.count).fill(1),3)),i.toArray(this.instanceColor.array,3*e)}setMatrixAt(e,i){i.toArray(this.instanceMatrix.array,16*e)}setMorphAt(e,i){let r=i.morphTargetInfluences,n=r.length+1;null===this.morphTexture&&(this.morphTexture=new nC(new Float32Array(n*this.count),n,this.count,eV,eP));let a=this.morphTexture.source.data.data,s=0;for(let e=0;e<r.length;e++)s+=r[e];let o=this.geometry.morphTargetsRelative?1:1-s,l=n*e;a[l]=o,a.set(r,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),null!==this.morphTexture&&(this.morphTexture.dispose(),this.morphTexture=null)}}let nH=new tZ,nG=new tZ,nW=new t0;class nX{constructor(e=new tZ(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,n){return this.normal.set(e,i,r),this.constant=n,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){let n=nH.subVectors(r,i).cross(nG.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){let r=e.delta(nH),n=this.normal.dot(r);if(0===n)return 0===this.distanceToPoint(e.start)?i.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/n;return a<0||a>1?null:i.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){let r=i||nW.getNormalMatrix(e),n=this.coplanarPoint(nH).applyMatrix4(e),a=this.normal.applyMatrix3(r).normalize();return this.constant=-n.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}let nj=new iN,nq=new tK(.5,.5),nY=new tZ;class nK{constructor(e=new nX,i=new nX,r=new nX,n=new nX,a=new nX,s=new nX){this.planes=[e,i,r,n,a,s]}set(e,i,r,n,a,s){let o=this.planes;return o[0].copy(e),o[1].copy(i),o[2].copy(r),o[3].copy(n),o[4].copy(a),o[5].copy(s),this}copy(e){let i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=tO,r=!1){let n=this.planes,a=e.elements,s=a[0],o=a[1],l=a[2],c=a[3],h=a[4],u=a[5],d=a[6],p=a[7],f=a[8],m=a[9],g=a[10],v=a[11],_=a[12],y=a[13],x=a[14],M=a[15];if(n[0].setComponents(c-s,p-h,v-f,M-_).normalize(),n[1].setComponents(c+s,p+h,v+f,M+_).normalize(),n[2].setComponents(c+o,p+u,v+m,M+y).normalize(),n[3].setComponents(c-o,p-u,v-m,M-y).normalize(),r)n[4].setComponents(l,d,g,x).normalize(),n[5].setComponents(c-l,p-d,v-g,M-x).normalize();else if(n[4].setComponents(c-l,p-d,v-g,M-x).normalize(),i===tO)n[5].setComponents(c+l,p+d,v+g,M+x).normalize();else if(2001===i)n[5].setComponents(l,d,g,x).normalize();else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(void 0!==e.boundingSphere)null===e.boundingSphere&&e.computeBoundingSphere(),nj.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let i=e.geometry;null===i.boundingSphere&&i.computeBoundingSphere(),nj.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(nj)}intersectsSprite(e){return nj.center.set(0,0,0),nj.radius=.7071067811865476+nq.distanceTo(e.center),nj.applyMatrix4(e.matrixWorld),this.intersectsSphere(nj)}intersectsSphere(e){let i=this.planes,r=e.center,n=-e.radius;for(let e=0;e<6;e++)if(i[e].distanceToPoint(r)<n)return!1;return!0}intersectsBox(e){let i=this.planes;for(let r=0;r<6;r++){let n=i[r];if(nY.x=n.normal.x>0?e.max.x:e.min.x,nY.y=n.normal.y>0?e.max.y:e.min.y,nY.z=n.normal.z>0?e.max.z:e.min.z,0>n.distanceToPoint(nY))return!1}return!0}containsPoint(e){let i=this.planes;for(let r=0;r<6;r++)if(0>i[r].distanceToPoint(e))return!1;return!0}clone(){return new this.constructor().copy(this)}}class nJ extends rC{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new rw(0xffffff),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}let nZ=new tZ,nQ=new tZ,n$=new iW,n0=new iG,n1=new iN,n2=new tZ,n3=new tZ;class n4 extends ro{constructor(e=new rX,i=new nJ){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(null===e.index){let i=e.attributes.position,r=[0];for(let e=1,n=i.count;e<n;e++)nZ.fromBufferAttribute(i,e-1),nQ.fromBufferAttribute(i,e),r[e]=r[e-1],r[e]+=nZ.distanceTo(nQ);e.setAttribute("lineDistance",new rF(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,i){let r=this.geometry,n=this.matrixWorld,a=e.params.Line.threshold,s=r.drawRange;if(null===r.boundingSphere&&r.computeBoundingSphere(),n1.copy(r.boundingSphere),n1.applyMatrix4(n),n1.radius+=a,!1===e.ray.intersectsSphere(n1))return;n$.copy(n).invert(),n0.copy(e.ray).applyMatrix4(n$);let o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=r.index,u=r.attributes.position;if(null!==h){let r=Math.max(0,s.start),n=Math.min(h.count,s.start+s.count);for(let a=r,s=n-1;a<s;a+=c){let r=n5(this,e,n0,l,h.getX(a),h.getX(a+1),a);r&&i.push(r)}if(this.isLineLoop){let a=n5(this,e,n0,l,h.getX(n-1),h.getX(r),n-1);a&&i.push(a)}}else{let r=Math.max(0,s.start),n=Math.min(u.count,s.start+s.count);for(let a=r,s=n-1;a<s;a+=c){let r=n5(this,e,n0,l,a,a+1,a);r&&i.push(r)}if(this.isLineLoop){let a=n5(this,e,n0,l,n-1,r,n-1);a&&i.push(a)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let r=e[i[0]];if(void 0!==r){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,i=r.length;e<i;e++){let i=r[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[i]=e}}}}}function n5(e,i,r,n,a,s,o){let l=e.geometry.attributes.position;if(nZ.fromBufferAttribute(l,a),nQ.fromBufferAttribute(l,s),r.distanceSqToSegment(nZ,nQ,n2,n3)>n)return;n2.applyMatrix4(e.matrixWorld);let c=i.ray.origin.distanceTo(n2);if(!(c<i.near)&&!(c>i.far))return{distance:c,point:n3.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}let n6=new tZ,n9=new tZ;class n8 extends n4{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(null===e.index){let i=e.attributes.position,r=[];for(let e=0,n=i.count;e<n;e+=2)n6.fromBufferAttribute(i,e),n9.fromBufferAttribute(i,e+1),r[e]=0===e?0:r[e-1],r[e+1]=r[e]+n6.distanceTo(n9);e.setAttribute("lineDistance",new rF(r,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class n7 extends n4{constructor(e,i){super(e,i),this.isLineLoop=!0,this.type="LineLoop"}}class ae extends rC{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new rw(0xffffff),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let at=new iW,ai=new iG,ar=new iN,an=new tZ;class aa extends ro{constructor(e=new rX,i=new ae){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,i){let r=this.geometry,n=this.matrixWorld,a=e.params.Points.threshold,s=r.drawRange;if(null===r.boundingSphere&&r.computeBoundingSphere(),ar.copy(r.boundingSphere),ar.applyMatrix4(n),ar.radius+=a,!1===e.ray.intersectsSphere(ar))return;at.copy(n).invert(),ai.copy(e.ray).applyMatrix4(at);let o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=r.index,h=r.attributes.position;if(null!==c){let r=Math.max(0,s.start),a=Math.min(c.count,s.start+s.count);for(let s=r;s<a;s++){let r=c.getX(s);an.fromBufferAttribute(h,r),as(an,r,l,n,e,i,this)}}else{let r=Math.max(0,s.start),a=Math.min(h.count,s.start+s.count);for(let s=r;s<a;s++)an.fromBufferAttribute(h,s),as(an,s,l,n,e,i,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let r=e[i[0]];if(void 0!==r){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,i=r.length;e<i;e++){let i=r[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[i]=e}}}}}function as(e,i,r,n,a,s,o){let l=ai.distanceSqToPoint(e);if(l<r){let r=new tZ;ai.closestPointToPoint(e,r),r.applyMatrix4(n);let c=a.ray.origin.distanceTo(r);if(c<a.near||c>a.far)return;s.push({distance:c,distanceToRay:Math.sqrt(l),point:r,index:i,face:null,faceIndex:null,barycoord:null,object:o})}}class ao extends ih{constructor(e,i,r,n,a,s,o,l,c,h,u,d){super(null,s,o,l,c,h,n,a,u,d),this.isCompressedTexture=!0,this.image={width:i,height:r},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class al extends ih{constructor(e,i,r=eC,n,a,s,o=e_,l=e_,c,h=ez,u=1){if(h!==ez&&h!==ek)throw Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super({width:e,height:i,depth:u},n,a,s,o,l,h,r,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new is(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let i=super.toJSON(e);return null!==this.compareFunction&&(i.compareFunction=this.compareFunction),i}}class ac extends rX{constructor(e=1,i=32,r=0,n=2*Math.PI){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:i,thetaStart:r,thetaLength:n},i=Math.max(3,i);let a=[],s=[],o=[],l=[],c=new tZ,h=new tK;s.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let a=0,u=3;a<=i;a++,u+=3){let d=r+a/i*n;c.x=e*Math.cos(d),c.y=e*Math.sin(d),s.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(s[u]/e+1)/2,h.y=(s[u+1]/e+1)/2,l.push(h.x,h.y)}for(let e=1;e<=i;e++)a.push(e,e+1,0);this.setIndex(a),this.setAttribute("position",new rF(s,3)),this.setAttribute("normal",new rF(o,3)),this.setAttribute("uv",new rF(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ac(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ah extends rX{constructor(e=1,i=1,r=1,n=32,a=1,s=!1,o=0,l=2*Math.PI){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:r,radialSegments:n,heightSegments:a,openEnded:s,thetaStart:o,thetaLength:l};let c=this;n=Math.floor(n),a=Math.floor(a);let h=[],u=[],d=[],p=[],f=0,m=[],g=r/2,v=0;function _(r){let a=f,s=new tK,m=new tZ,_=0,y=!0===r?e:i,x=!0===r?1:-1;for(let e=1;e<=n;e++)u.push(0,g*x,0),d.push(0,x,0),p.push(.5,.5),f++;let M=f;for(let e=0;e<=n;e++){let i=e/n*l+o,r=Math.cos(i),a=Math.sin(i);m.x=y*a,m.y=g*x,m.z=y*r,u.push(m.x,m.y,m.z),d.push(0,x,0),s.x=.5*r+.5,s.y=.5*a*x+.5,p.push(s.x,s.y),f++}for(let e=0;e<n;e++){let i=a+e,n=M+e;!0===r?h.push(n,n+1,i):h.push(n+1,n,i),_+=3}c.addGroup(v,_,!0===r?1:2),v+=_}(function(){let s=new tZ,_=new tZ,y=0,x=(i-e)/r;for(let c=0;c<=a;c++){let h=[],v=c/a,y=v*(i-e)+e;for(let e=0;e<=n;e++){let i=e/n,a=i*l+o,c=Math.sin(a),m=Math.cos(a);_.x=y*c,_.y=-v*r+g,_.z=y*m,u.push(_.x,_.y,_.z),s.set(c,x,m).normalize(),d.push(s.x,s.y,s.z),p.push(i,1-v),h.push(f++)}m.push(h)}for(let r=0;r<n;r++)for(let n=0;n<a;n++){let s=m[n][r],o=m[n+1][r],l=m[n+1][r+1],c=m[n][r+1];(e>0||0!==n)&&(h.push(s,o,c),y+=3),(i>0||n!==a-1)&&(h.push(o,l,c),y+=3)}c.addGroup(v,y,0),v+=y})(),!1===s&&(e>0&&_(!0),i>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new rF(u,3)),this.setAttribute("normal",new rF(d,3)),this.setAttribute("uv",new rF(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ah(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class au extends ah{constructor(e=1,i=1,r=32,n=1,a=!1,s=0,o=2*Math.PI){super(0,e,i,r,n,a,s,o),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:r,heightSegments:n,openEnded:a,thetaStart:s,thetaLength:o}}static fromJSON(e){return new au(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ad extends rX{constructor(e=[],i=[],r=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:i,radius:r,detail:n};let a=[],s=[];function o(e){a.push(e.x,e.y,e.z)}function l(i,r){let n=3*i;r.x=e[n+0],r.y=e[n+1],r.z=e[n+2]}function c(e,i,r,n){n<0&&1===e.x&&(s[i]=e.x-1),0===r.x&&0===r.z&&(s[i]=n/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}(function(e){let r=new tZ,n=new tZ,a=new tZ;for(let s=0;s<i.length;s+=3)l(i[s+0],r),l(i[s+1],n),l(i[s+2],a),function(e,i,r,n){let a=n+1,s=[];for(let n=0;n<=a;n++){s[n]=[];let o=e.clone().lerp(r,n/a),l=i.clone().lerp(r,n/a),c=a-n;for(let e=0;e<=c;e++)0===e&&n===a?s[n][e]=o:s[n][e]=o.clone().lerp(l,e/c)}for(let e=0;e<a;e++)for(let i=0;i<2*(a-e)-1;i++){let r=Math.floor(i/2);i%2==0?(o(s[e][r+1]),o(s[e+1][r]),o(s[e][r])):(o(s[e][r+1]),o(s[e+1][r+1]),o(s[e+1][r]))}}(r,n,a,e)})(n),function(e){let i=new tZ;for(let r=0;r<a.length;r+=3)i.x=a[r+0],i.y=a[r+1],i.z=a[r+2],i.normalize().multiplyScalar(e),a[r+0]=i.x,a[r+1]=i.y,a[r+2]=i.z}(r),function(){let e=new tZ;for(let r=0;r<a.length;r+=3){var i;e.x=a[r+0],e.y=a[r+1],e.z=a[r+2];let n=h(e)/2/Math.PI+.5,o=Math.atan2(-(i=e).y,Math.sqrt(i.x*i.x+i.z*i.z))/Math.PI+.5;s.push(n,1-o)}(function(){let e=new tZ,i=new tZ,r=new tZ,n=new tZ,o=new tK,l=new tK,u=new tK;for(let d=0,p=0;d<a.length;d+=9,p+=6){e.set(a[d+0],a[d+1],a[d+2]),i.set(a[d+3],a[d+4],a[d+5]),r.set(a[d+6],a[d+7],a[d+8]),o.set(s[p+0],s[p+1]),l.set(s[p+2],s[p+3]),u.set(s[p+4],s[p+5]),n.copy(e).add(i).add(r).divideScalar(3);let f=h(n);c(o,p+0,e,f),c(l,p+2,i,f),c(u,p+4,r,f)}})(),function(){for(let e=0;e<s.length;e+=6){let i=s[e+0],r=s[e+2],n=s[e+4],a=Math.max(i,r,n),o=Math.min(i,r,n);a>.9&&o<.1&&(i<.2&&(s[e+0]+=1),r<.2&&(s[e+2]+=1),n<.2&&(s[e+4]+=1))}}()}(),this.setAttribute("position",new rF(a,3)),this.setAttribute("normal",new rF(a.slice(),3)),this.setAttribute("uv",new rF(s,2)),0===n?this.computeVertexNormals():this.normalizeNormals()}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ad(e.vertices,e.indices,e.radius,e.details)}}class ap{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,i){let r=this.getUtoTmapping(e);return this.getPoint(r,i)}getPoints(e=5){let i=[];for(let r=0;r<=e;r++)i.push(this.getPoint(r/e));return i}getSpacedPoints(e=5){let i=[];for(let r=0;r<=e;r++)i.push(this.getPointAt(r/e));return i}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let i=[],r,n=this.getPoint(0),a=0;i.push(0);for(let s=1;s<=e;s++)i.push(a+=(r=this.getPoint(s/e)).distanceTo(n)),n=r;return this.cacheArcLengths=i,i}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,i=null){let r,n=this.getLengths(),a=0,s=n.length;r=i||e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if((c=n[a=Math.floor(o+(l-o)/2)]-r)<0)o=a+1;else if(c>0)l=a-1;else{l=a;break}if(n[a=l]===r)return a/(s-1);let h=n[a],u=n[a+1];return(a+(r-h)/(u-h))/(s-1)}getTangent(e,i){let r=e-1e-4,n=e+1e-4;r<0&&(r=0),n>1&&(n=1);let a=this.getPoint(r),s=this.getPoint(n),o=i||(a.isVector2?new tK:new tZ);return o.copy(s).sub(a).normalize(),o}getTangentAt(e,i){let r=this.getUtoTmapping(e);return this.getTangent(r,i)}computeFrenetFrames(e,i=!1){let r=new tZ,n=[],a=[],s=[],o=new tZ,l=new iW;for(let i=0;i<=e;i++){let r=i/e;n[i]=this.getTangentAt(r,new tZ)}a[0]=new tZ,s[0]=new tZ;let c=Number.MAX_VALUE,h=Math.abs(n[0].x),u=Math.abs(n[0].y),d=Math.abs(n[0].z);h<=c&&(c=h,r.set(1,0,0)),u<=c&&(c=u,r.set(0,1,0)),d<=c&&r.set(0,0,1),o.crossVectors(n[0],r).normalize(),a[0].crossVectors(n[0],o),s[0].crossVectors(n[0],a[0]);for(let i=1;i<=e;i++){if(a[i]=a[i-1].clone(),s[i]=s[i-1].clone(),o.crossVectors(n[i-1],n[i]),o.length()>Number.EPSILON){o.normalize();let e=Math.acos(tG(n[i-1].dot(n[i]),-1,1));a[i].applyMatrix4(l.makeRotationAxis(o,e))}s[i].crossVectors(n[i],a[i])}if(!0===i){let i=Math.acos(tG(a[0].dot(a[e]),-1,1));i/=e,n[0].dot(o.crossVectors(a[0],a[e]))>0&&(i=-i);for(let r=1;r<=e;r++)a[r].applyMatrix4(l.makeRotationAxis(n[r],i*r)),s[r].crossVectors(n[r],a[r])}return{tangents:n,normals:a,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class af extends ap{constructor(e=0,i=0,r=1,n=1,a=0,s=2*Math.PI,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=i,this.xRadius=r,this.yRadius=n,this.aStartAngle=a,this.aEndAngle=s,this.aClockwise=o,this.aRotation=l}getPoint(e,i=new tK){let r=2*Math.PI,n=this.aEndAngle-this.aStartAngle,a=Math.abs(n)<Number.EPSILON;for(;n<0;)n+=r;for(;n>r;)n-=r;n<Number.EPSILON&&(n=a?0:r),!0!==this.aClockwise||a||(n===r?n=-r:n-=r);let s=this.aStartAngle+e*n,o=this.aX+this.xRadius*Math.cos(s),l=this.aY+this.yRadius*Math.sin(s);if(0!==this.aRotation){let e=Math.cos(this.aRotation),i=Math.sin(this.aRotation),r=o-this.aX,n=l-this.aY;o=r*e-n*i+this.aX,l=r*i+n*e+this.aY}return i.set(o,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}function am(){let e=0,i=0,r=0,n=0;function a(a,s,o,l){e=a,i=o,r=-3*a+3*s-2*o-l,n=2*a-2*s+o+l}return{initCatmullRom:function(e,i,r,n,s){a(i,r,s*(r-e),s*(n-i))},initNonuniformCatmullRom:function(e,i,r,n,s,o,l){let c=(i-e)/s-(r-e)/(s+o)+(r-i)/o,h=(r-i)/o-(n-i)/(o+l)+(n-r)/l;a(i,r,c*=o,h*=o)},calc:function(a){let s=a*a;return e+i*a+r*s+s*a*n}}}let ag=new tZ,av=new am,a_=new am,ay=new am;function ax(e,i,r,n,a){let s=(n-i)*.5,o=(a-r)*.5,l=e*e;return e*l*(2*r-2*n+s+o)+(-3*r+3*n-2*s-o)*l+s*e+r}function aM(e,i,r,n){return function(e,i){let r=1-e;return r*r*i}(e,i)+2*(1-e)*e*r+e*e*n}function ab(e,i,r,n,a){return function(e,i){let r=1-e;return r*r*r*i}(e,i)+function(e,i){let r=1-e;return 3*r*r*e*i}(e,r)+3*(1-e)*e*e*n+e*e*e*a}class aS extends ap{constructor(e=new tK,i=new tK,r=new tK,n=new tK){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=i,this.v2=r,this.v3=n}getPoint(e,i=new tK){let r=this.v0,n=this.v1,a=this.v2,s=this.v3;return i.set(ab(e,r.x,n.x,a.x,s.x),ab(e,r.y,n.y,a.y,s.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class aE extends ap{constructor(e=new tK,i=new tK){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=i}getPoint(e,i=new tK){return 1===e?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,i){return this.getPoint(e,i)}getTangent(e,i=new tK){return i.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,i){return this.getTangent(e,i)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class aT extends ap{constructor(e=new tK,i=new tK,r=new tK){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=i,this.v2=r}getPoint(e,i=new tK){let r=this.v0,n=this.v1,a=this.v2;return i.set(aM(e,r.x,n.x,a.x),aM(e,r.y,n.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class aw extends ap{constructor(e=new tZ,i=new tZ,r=new tZ){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=i,this.v2=r}getPoint(e,i=new tZ){let r=this.v0,n=this.v1,a=this.v2;return i.set(aM(e,r.x,n.x,a.x),aM(e,r.y,n.y,a.y),aM(e,r.z,n.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class aA extends ap{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,i=new tK){let r=this.points,n=(r.length-1)*e,a=Math.floor(n),s=n-a,o=r[0===a?a:a-1],l=r[a],c=r[a>r.length-2?r.length-1:a+1],h=r[a>r.length-3?r.length-1:a+2];return i.set(ax(s,o.x,l.x,c.x,h.x),ax(s,o.y,l.y,c.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let i=0,r=e.points.length;i<r;i++){let r=e.points[i];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let i=0,r=this.points.length;i<r;i++){let r=this.points[i];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let i=0,r=e.points.length;i<r;i++){let r=e.points[i];this.points.push(new tK().fromArray(r))}return this}}class aR extends ad{constructor(e=1,i=0){let r=(1+Math.sqrt(5))/2;super([-1,r,0,1,r,0,-1,-r,0,1,-r,0,0,-1,r,0,1,r,0,-1,-r,0,1,-r,r,0,-1,r,0,1,-r,0,-1,-r,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,i),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:i}}static fromJSON(e){return new aR(e.radius,e.detail)}}class aC extends rX{constructor(e=1,i=1,r=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:n};let a=e/2,s=i/2,o=Math.floor(r),l=Math.floor(n),c=o+1,h=l+1,u=e/o,d=i/l,p=[],f=[],m=[],g=[];for(let e=0;e<h;e++){let i=e*d-s;for(let r=0;r<c;r++){let n=r*u-a;f.push(n,-i,0),m.push(0,0,1),g.push(r/o),g.push(1-e/l)}}for(let e=0;e<l;e++)for(let i=0;i<o;i++){let r=i+c*e,n=i+c*(e+1),a=i+1+c*(e+1),s=i+1+c*e;p.push(r,n,s),p.push(n,a,s)}this.setIndex(p),this.setAttribute("position",new rF(f,3)),this.setAttribute("normal",new rF(m,3)),this.setAttribute("uv",new rF(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new aC(e.width,e.height,e.widthSegments,e.heightSegments)}}class aP extends rC{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new rw(0xffffff),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rw(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tx,this.normalScale=new tK(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new i0,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class aI extends aP{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new tK(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return tG(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new rw(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new rw(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new rw(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class aL extends rC{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new rw(0xffffff),this.specular=new rw(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rw(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tx,this.normalScale=new tK(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new i0,this.combine=Q,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class aD extends rC{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class aU extends rC{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function aN(e,i){return e&&e.constructor!==i?"number"==typeof i.BYTES_PER_ELEMENT?new i(e):Array.prototype.slice.call(e):e}function aO(e,i,r){let n=e.length,a=new e.constructor(n);for(let s=0,o=0;o!==n;++s){let n=r[s]*i;for(let r=0;r!==i;++r)a[o++]=e[n+r]}return a}function aF(e,i,r,n){let a=1,s=e[0];for(;void 0!==s&&void 0===s[n];)s=e[a++];if(void 0===s)return;let o=s[n];if(void 0!==o)if(Array.isArray(o))do void 0!==(o=s[n])&&(i.push(s.time),r.push(...o)),s=e[a++];while(void 0!==s)else if(void 0!==o.toArray)do void 0!==(o=s[n])&&(i.push(s.time),o.toArray(r,r.length)),s=e[a++];while(void 0!==s)else do void 0!==(o=s[n])&&(i.push(s.time),r.push(o)),s=e[a++];while(void 0!==s)}class aB{constructor(e,i,r,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=void 0!==n?n:new i.constructor(r),this.sampleValues=i,this.valueSize=r,this.settings=null,this.DefaultSettings_={}}evaluate(e){let i=this.parameterPositions,r=this._cachedIndex,n=i[r],a=i[r-1];e:{t:{let s;i:{r:if(!(e<n)){for(let s=r+2;;){if(void 0===n){if(e<a)break r;return r=i.length,this._cachedIndex=r,this.copySampleValue_(r-1)}if(r===s)break;if(a=n,e<(n=i[++r]))break t}s=i.length;break i}if(!(e>=a)){let o=i[1];e<o&&(r=2,a=o);for(let s=r-2;;){if(void 0===a)return this._cachedIndex=0,this.copySampleValue_(0);if(r===s)break;if(n=a,e>=(a=i[--r-1]))break t}s=r,r=0;break i}break e}for(;r<s;){let n=r+s>>>1;e<i[n]?s=n:r=n+1}if(n=i[r],void 0===(a=i[r-1]))return this._cachedIndex=0,this.copySampleValue_(0);if(void 0===n)return r=i.length,this._cachedIndex=r,this.copySampleValue_(r-1)}this._cachedIndex=r,this.intervalChanged_(r,a,n)}return this.interpolate_(r,a,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let i=this.resultBuffer,r=this.sampleValues,n=this.valueSize,a=e*n;for(let e=0;e!==n;++e)i[e]=r[a+e];return i}interpolate_(){throw Error("call to abstract method")}intervalChanged_(){}}class az extends aB{constructor(e,i,r,n){super(e,i,r,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,i,r){let n=this.parameterPositions,a=e-2,s=e+1,o=n[a],l=n[s];if(void 0===o)switch(this.getSettings_().endingStart){case 2401:a=e,o=2*i-r;break;case 2402:a=n.length-2,o=i+n[a]-n[a+1];break;default:a=e,o=r}if(void 0===l)switch(this.getSettings_().endingEnd){case 2401:s=e,l=2*r-i;break;case 2402:s=1,l=r+n[1]-n[0];break;default:s=e-1,l=i}let c=(r-i)*.5,h=this.valueSize;this._weightPrev=c/(i-o),this._weightNext=c/(l-r),this._offsetPrev=a*h,this._offsetNext=s*h}interpolate_(e,i,r,n){let a=this.resultBuffer,s=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,f=(r-i)/(n-i),m=f*f,g=m*f,v=-d*g+2*d*m-d*f,_=(1+d)*g+(-1.5-2*d)*m+(-.5+d)*f+1,y=(-1-p)*g+(1.5+p)*m+.5*f,x=p*g-p*m;for(let e=0;e!==o;++e)a[e]=v*s[h+e]+_*s[c+e]+y*s[l+e]+x*s[u+e];return a}}class ak extends aB{constructor(e,i,r,n){super(e,i,r,n)}interpolate_(e,i,r,n){let a=this.resultBuffer,s=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(r-i)/(n-i),u=1-h;for(let e=0;e!==o;++e)a[e]=s[c+e]*u+s[l+e]*h;return a}}class aV extends aB{constructor(e,i,r,n){super(e,i,r,n)}interpolate_(e){return this.copySampleValue_(e-1)}}class aH{constructor(e,i,r,n){if(void 0===e)throw Error("THREE.KeyframeTrack: track name is undefined");if(void 0===i||0===i.length)throw Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=aN(i,this.TimeBufferType),this.values=aN(r,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){let i,r=e.constructor;if(r.toJSON!==this.toJSON)i=r.toJSON(e);else{i={name:e.name,times:aN(e.times,Array),values:aN(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new aV(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ak(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new az(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let i;switch(e){case tf:i=this.InterpolantFactoryMethodDiscrete;break;case tm:i=this.InterpolantFactoryMethodLinear;break;case 2302:i=this.InterpolantFactoryMethodSmooth}if(void 0===i){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(void 0===this.createInterpolant)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=i,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return tf;case this.InterpolantFactoryMethodLinear:return tm;case this.InterpolantFactoryMethodSmooth:return 2302}}getValueSize(){return this.values.length/this.times.length}shift(e){if(0!==e){let i=this.times;for(let r=0,n=i.length;r!==n;++r)i[r]+=e}return this}scale(e){if(1!==e){let i=this.times;for(let r=0,n=i.length;r!==n;++r)i[r]*=e}return this}trim(e,i){let r=this.times,n=r.length,a=0,s=n-1;for(;a!==n&&r[a]<e;)++a;for(;-1!==s&&r[s]>i;)--s;if(++s,0!==a||s!==n){a>=s&&(a=(s=Math.max(s,1))-1);let e=this.getValueSize();this.times=r.slice(a,s),this.values=this.values.slice(a*e,s*e)}return this}validate(){var e;let i=!0,r=this.getValueSize();r-Math.floor(r)!=0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),i=!1);let n=this.times,a=this.values,s=n.length;0===s&&(console.error("THREE.KeyframeTrack: Track is empty.",this),i=!1);let o=null;for(let e=0;e!==s;e++){let r=n[e];if("number"==typeof r&&isNaN(r)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,e,r),i=!1;break}if(null!==o&&o>r){console.error("THREE.KeyframeTrack: Out of order keys.",this,e,r,o),i=!1;break}o=r}if(void 0!==a&&ArrayBuffer.isView(e=a)&&!(e instanceof DataView))for(let e=0,r=a.length;e!==r;++e){let r=a[e];if(isNaN(r)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,e,r),i=!1;break}}return i}optimize(){let e=this.times.slice(),i=this.values.slice(),r=this.getValueSize(),n=2302===this.getInterpolation(),a=e.length-1,s=1;for(let o=1;o<a;++o){let a=!1,l=e[o];if(l!==e[o+1]&&(1!==o||l!==e[0]))if(n)a=!0;else{let e=o*r,n=e-r,s=e+r;for(let o=0;o!==r;++o){let r=i[e+o];if(r!==i[n+o]||r!==i[s+o]){a=!0;break}}}if(a){if(o!==s){e[s]=e[o];let n=o*r,a=s*r;for(let e=0;e!==r;++e)i[a+e]=i[n+e]}++s}}if(a>0){e[s]=e[a];for(let e=a*r,n=s*r,o=0;o!==r;++o)i[n+o]=i[e+o];++s}return s!==e.length?(this.times=e.slice(0,s),this.values=i.slice(0,s*r)):(this.times=e,this.values=i),this}clone(){let e=this.times.slice(),i=this.values.slice(),r=new this.constructor(this.name,e,i);return r.createInterpolant=this.createInterpolant,r}}aH.prototype.ValueTypeName="",aH.prototype.TimeBufferType=Float32Array,aH.prototype.ValueBufferType=Float32Array,aH.prototype.DefaultInterpolation=tm;class aG extends aH{constructor(e,i,r){super(e,i,r)}}aG.prototype.ValueTypeName="bool",aG.prototype.ValueBufferType=Array,aG.prototype.DefaultInterpolation=tf,aG.prototype.InterpolantFactoryMethodLinear=void 0,aG.prototype.InterpolantFactoryMethodSmooth=void 0;class aW extends aH{constructor(e,i,r,n){super(e,i,r,n)}}aW.prototype.ValueTypeName="color";class aX extends aH{constructor(e,i,r,n){super(e,i,r,n)}}aX.prototype.ValueTypeName="number";class aj extends aB{constructor(e,i,r,n){super(e,i,r,n)}interpolate_(e,i,r,n){let a=this.resultBuffer,s=this.sampleValues,o=this.valueSize,l=(r-i)/(n-i),c=e*o;for(let e=c+o;c!==e;c+=4)tJ.slerpFlat(a,0,s,c-o,s,c,l);return a}}class aq extends aH{constructor(e,i,r,n){super(e,i,r,n)}InterpolantFactoryMethodLinear(e){return new aj(this.times,this.values,this.getValueSize(),e)}}aq.prototype.ValueTypeName="quaternion",aq.prototype.InterpolantFactoryMethodSmooth=void 0;class aY extends aH{constructor(e,i,r){super(e,i,r)}}aY.prototype.ValueTypeName="string",aY.prototype.ValueBufferType=Array,aY.prototype.DefaultInterpolation=tf,aY.prototype.InterpolantFactoryMethodLinear=void 0,aY.prototype.InterpolantFactoryMethodSmooth=void 0;class aK extends aH{constructor(e,i,r,n){super(e,i,r,n)}}aK.prototype.ValueTypeName="vector";class aJ{constructor(e="",i=-1,r=[],n=2500){this.name=e,this.tracks=r,this.duration=i,this.blendMode=n,this.uuid=tH(),this.duration<0&&this.resetDuration()}static parse(e){let i=[],r=e.tracks,n=1/(e.fps||1);for(let e=0,a=r.length;e!==a;++e)i.push((function(e){if(void 0===e.type)throw Error("THREE.KeyframeTrack: track type undefined, can not parse");let i=function(e){switch(e.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return aX;case"vector":case"vector2":case"vector3":case"vector4":return aK;case"color":return aW;case"quaternion":return aq;case"bool":case"boolean":return aG;case"string":return aY}throw Error("THREE.KeyframeTrack: Unsupported typeName: "+e)}(e.type);if(void 0===e.times){let i=[],r=[];aF(e.keys,i,r,"value"),e.times=i,e.values=r}return void 0!==i.parse?i.parse(e):new i(e.name,e.times,e.values,e.interpolation)})(r[e]).scale(n));let a=new this(e.name,e.duration,i,e.blendMode);return a.uuid=e.uuid,a}static toJSON(e){let i=[],r=e.tracks,n={name:e.name,duration:e.duration,tracks:i,uuid:e.uuid,blendMode:e.blendMode};for(let e=0,n=r.length;e!==n;++e)i.push(aH.toJSON(r[e]));return n}static CreateFromMorphTargetSequence(e,i,r,n){let a=i.length,s=[];for(let e=0;e<a;e++){let o=[],l=[];o.push((e+a-1)%a,e,(e+1)%a),l.push(0,1,0);let c=function(e){let i=e.length,r=Array(i);for(let e=0;e!==i;++e)r[e]=e;return r.sort(function(i,r){return e[i]-e[r]}),r}(o);o=aO(o,1,c),l=aO(l,1,c),n||0!==o[0]||(o.push(a),l.push(l[0])),s.push(new aX(".morphTargetInfluences["+i[e].name+"]",o,l).scale(1/r))}return new this(e,-1,s)}static findByName(e,i){let r=e;Array.isArray(e)||(r=e.geometry&&e.geometry.animations||e.animations);for(let e=0;e<r.length;e++)if(r[e].name===i)return r[e];return null}static CreateClipsFromMorphTargetSequences(e,i,r){let n={},a=/^([\w-]*?)([\d]+)$/;for(let i=0,r=e.length;i<r;i++){let r=e[i],s=r.name.match(a);if(s&&s.length>1){let e=s[1],i=n[e];i||(n[e]=i=[]),i.push(r)}}let s=[];for(let e in n)s.push(this.CreateFromMorphTargetSequence(e,n[e],i,r));return s}static parseAnimation(e,i){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let r=function(e,i,r,n,a){if(0!==r.length){let s=[],o=[];aF(r,s,o,n),0!==s.length&&a.push(new e(i,s,o))}},n=[],a=e.name||"default",s=e.fps||30,o=e.blendMode,l=e.length||-1,c=e.hierarchy||[];for(let e=0;e<c.length;e++){let a=c[e].keys;if(a&&0!==a.length)if(a[0].morphTargets){let e,i={};for(e=0;e<a.length;e++)if(a[e].morphTargets)for(let r=0;r<a[e].morphTargets.length;r++)i[a[e].morphTargets[r]]=-1;for(let r in i){let i=[],s=[];for(let n=0;n!==a[e].morphTargets.length;++n){let n=a[e];i.push(n.time),s.push(+(n.morphTarget===r))}n.push(new aX(".morphTargetInfluence["+r+"]",i,s))}l=i.length*s}else{let s=".bones["+i[e].name+"]";r(aK,s+".position",a,"pos",n),r(aq,s+".quaternion",a,"rot",n),r(aK,s+".scale",a,"scl",n)}}return 0===n.length?null:new this(a,l,n,o)}resetDuration(){let e=this.tracks,i=0;for(let r=0,n=e.length;r!==n;++r){let e=this.tracks[r];i=Math.max(i,e.times[e.times.length-1])}return this.duration=i,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let i=0;i<this.tracks.length;i++)e=e&&this.tracks[i].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}let aZ={enabled:!1,files:{},add:function(e,i){!1!==this.enabled&&(this.files[e]=i)},get:function(e){if(!1!==this.enabled)return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}},aQ=new class{constructor(e,i,r){let n,a=this,s=!1,o=0,l=0,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=i,this.onError=r,this.abortController=new AbortController,this.itemStart=function(e){l++,!1===s&&void 0!==a.onStart&&a.onStart(e,o,l),s=!0},this.itemEnd=function(e){o++,void 0!==a.onProgress&&a.onProgress(e,o,l),o===l&&(s=!1,void 0!==a.onLoad&&a.onLoad())},this.itemError=function(e){void 0!==a.onError&&a.onError(e)},this.resolveURL=function(e){return n?n(e):e},this.setURLModifier=function(e){return n=e,this},this.addHandler=function(e,i){return c.push(e,i),this},this.removeHandler=function(e){let i=c.indexOf(e);return -1!==i&&c.splice(i,2),this},this.getHandler=function(e){for(let i=0,r=c.length;i<r;i+=2){let r=c[i],n=c[i+1];if(r.global&&(r.lastIndex=0),r.test(e))return n}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}};class a${constructor(e){this.manager=void 0!==e?e:aQ,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,i){let r=this;return new Promise(function(n,a){r.load(e,n,i,a)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}a$.DEFAULT_MATERIAL_NAME="__DEFAULT";let a0={};class a1 extends Error{constructor(e,i){super(e),this.response=i}}class a2 extends a${constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,i,r,n){void 0===e&&(e=""),void 0!==this.path&&(e=this.path+e),e=this.manager.resolveURL(e);let a=aZ.get(`file:${e}`);if(void 0!==a)return this.manager.itemStart(e),setTimeout(()=>{i&&i(a),this.manager.itemEnd(e)},0),a;if(void 0!==a0[e])return void a0[e].push({onLoad:i,onProgress:r,onError:n});a0[e]=[],a0[e].push({onLoad:i,onProgress:r,onError:n});let s=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:"function"==typeof AbortSignal.any?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(s).then(i=>{if(200===i.status||0===i.status){if(0===i.status&&console.warn("THREE.FileLoader: HTTP Status 0 received."),"undefined"==typeof ReadableStream||void 0===i.body||void 0===i.body.getReader)return i;let r=a0[e],n=i.body.getReader(),a=i.headers.get("X-File-Size")||i.headers.get("Content-Length"),s=a?parseInt(a):0,o=0!==s,l=0;return new Response(new ReadableStream({start(e){!function i(){n.read().then(({done:n,value:a})=>{if(n)e.close();else{let n=new ProgressEvent("progress",{lengthComputable:o,loaded:l+=a.byteLength,total:s});for(let e=0,i=r.length;e<i;e++){let i=r[e];i.onProgress&&i.onProgress(n)}e.enqueue(a),i()}},i=>{e.error(i)})}()}}))}throw new a1(`fetch for "${i.url}" responded with ${i.status}: ${i.statusText}`,i)}).then(e=>{switch(l){case"arraybuffer":return e.arrayBuffer();case"blob":return e.blob();case"document":return e.text().then(e=>new DOMParser().parseFromString(e,o));case"json":return e.json();default:if(""===o)return e.text();{let i=/charset="?([^;"\s]*)"?/i.exec(o),r=new TextDecoder(i&&i[1]?i[1].toLowerCase():void 0);return e.arrayBuffer().then(e=>r.decode(e))}}}).then(i=>{aZ.add(`file:${e}`,i);let r=a0[e];delete a0[e];for(let e=0,n=r.length;e<n;e++){let n=r[e];n.onLoad&&n.onLoad(i)}}).catch(i=>{let r=a0[e];if(void 0===r)throw this.manager.itemError(e),i;delete a0[e];for(let e=0,n=r.length;e<n;e++){let n=r[e];n.onError&&n.onError(i)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let a3=new WeakMap;class a4 extends a${constructor(e){super(e)}load(e,i,r,n){void 0!==this.path&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,s=aZ.get(`image:${e}`);if(void 0!==s){if(!0===s.complete)a.manager.itemStart(e),setTimeout(function(){i&&i(s),a.manager.itemEnd(e)},0);else{let e=a3.get(s);void 0===e&&(e=[],a3.set(s,e)),e.push({onLoad:i,onError:n})}return s}let o=t3("img");function l(){h(),i&&i(this);let r=a3.get(this)||[];for(let e=0;e<r.length;e++){let i=r[e];i.onLoad&&i.onLoad(this)}a3.delete(this),a.manager.itemEnd(e)}function c(i){h(),n&&n(i),aZ.remove(`image:${e}`);let r=a3.get(this)||[];for(let e=0;e<r.length;e++){let n=r[e];n.onError&&n.onError(i)}a3.delete(this),a.manager.itemError(e),a.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),"data:"!==e.slice(0,5)&&void 0!==this.crossOrigin&&(o.crossOrigin=this.crossOrigin),aZ.add(`image:${e}`,o),a.manager.itemStart(e),o.src=e,o}}class a5 extends a${constructor(e){super(e)}load(e,i,r,n){let a=new ih,s=new a4(this.manager);return s.setCrossOrigin(this.crossOrigin),s.setPath(this.path),s.load(e,function(e){a.image=e,a.needsUpdate=!0,void 0!==i&&i(a)},r,n),a}}class a6 extends ro{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new rw(e),this.intensity=i}dispose(){}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,void 0!==this.groundColor&&(i.object.groundColor=this.groundColor.getHex()),void 0!==this.distance&&(i.object.distance=this.distance),void 0!==this.angle&&(i.object.angle=this.angle),void 0!==this.decay&&(i.object.decay=this.decay),void 0!==this.penumbra&&(i.object.penumbra=this.penumbra),void 0!==this.shadow&&(i.object.shadow=this.shadow.toJSON()),void 0!==this.target&&(i.object.target=this.target.uuid),i}}let a9=new iW,a8=new tZ,a7=new tZ;class se{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tK(512,512),this.mapType=eE,this.map=null,this.mapPass=null,this.matrix=new iW,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nK,this._frameExtents=new tK(1,1),this._viewportCount=1,this._viewports=[new iu(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let i=this.camera,r=this.matrix;a8.setFromMatrixPosition(e.matrixWorld),i.position.copy(a8),a7.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(a7),i.updateMatrixWorld(),a9.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(a9,i.coordinateSystem,i.reversedDepth),i.reversedDepth?r.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(a9)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return 1!==this.intensity&&(e.intensity=this.intensity),0!==this.bias&&(e.bias=this.bias),0!==this.normalBias&&(e.normalBias=this.normalBias),1!==this.radius&&(e.radius=this.radius),(512!==this.mapSize.x||512!==this.mapSize.y)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class st extends se{constructor(){super(new no(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let i=this.camera,r=2*tV*e.angle*this.focus,n=this.mapSize.width/this.mapSize.height*this.aspect,a=e.distance||i.far;(r!==i.fov||n!==i.aspect||a!==i.far)&&(i.fov=r,i.aspect=n,i.far=a,i.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class si extends a6{constructor(e,i,r=0,n=Math.PI/3,a=0,s=2){super(e,i),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ro.DEFAULT_UP),this.updateMatrix(),this.target=new ro,this.distance=r,this.angle=n,this.penumbra=a,this.decay=s,this.map=null,this.shadow=new st}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,i){return super.copy(e,i),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}let sr=new iW,sn=new tZ,sa=new tZ;class ss extends se{constructor(){super(new no(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tK(4,2),this._viewportCount=6,this._viewports=[new iu(2,1,1,1),new iu(0,1,1,1),new iu(3,1,1,1),new iu(1,1,1,1),new iu(3,0,1,1),new iu(1,0,1,1)],this._cubeDirections=[new tZ(1,0,0),new tZ(-1,0,0),new tZ(0,0,1),new tZ(0,0,-1),new tZ(0,1,0),new tZ(0,-1,0)],this._cubeUps=[new tZ(0,1,0),new tZ(0,1,0),new tZ(0,1,0),new tZ(0,1,0),new tZ(0,0,1),new tZ(0,0,-1)]}updateMatrices(e,i=0){let r=this.camera,n=this.matrix,a=e.distance||r.far;a!==r.far&&(r.far=a,r.updateProjectionMatrix()),sn.setFromMatrixPosition(e.matrixWorld),r.position.copy(sn),sa.copy(r.position),sa.add(this._cubeDirections[i]),r.up.copy(this._cubeUps[i]),r.lookAt(sa),r.updateMatrixWorld(),n.makeTranslation(-sn.x,-sn.y,-sn.z),sr.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sr,r.coordinateSystem,r.reversedDepth)}}class so extends a6{constructor(e,i,r=0,n=2){super(e,i),this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=n,this.shadow=new ss}get power(){return 4*this.intensity*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,i){return super.copy(e,i),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class sl extends nr{constructor(e=-1,i=1,r=1,n=-1,a=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=n,this.near=a,this.far=s,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=null===e.view?null:Object.assign({},e.view),this}setViewOffset(e,i,r,n,a,s){null===this.view&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=n,this.view.width=a,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){null!==this.view&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,n=(this.top+this.bottom)/2,a=r-e,s=r+e,o=n+i,l=n-i;if(null!==this.view&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,i=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=e*this.view.offsetX,s=a+e*this.view.width,o-=i*this.view.offsetY,l=o-i*this.view.height}this.projectionMatrix.makeOrthographic(a,s,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,null!==this.view&&(i.object.view=Object.assign({},this.view)),i}}class sc extends se{constructor(){super(new sl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class sh extends a6{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ro.DEFAULT_UP),this.updateMatrix(),this.target=new ro,this.shadow=new sc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class su extends a6{constructor(e,i){super(e,i),this.isAmbientLight=!0,this.type="AmbientLight"}}class sd{static extractUrlBase(e){let i=e.lastIndexOf("/");return -1===i?"./":e.slice(0,i+1)}static resolveURL(e,i){return"string"!=typeof e||""===e?"":(/^https?:\/\//i.test(i)&&/^\//.test(e)&&(i=i.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e))?e:i+e}}let sp=new WeakMap;class sf extends a${constructor(e){super(e),this.isImageBitmapLoader=!0,"undefined"==typeof createImageBitmap&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),"undefined"==typeof fetch&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,i,r,n){void 0===e&&(e=""),void 0!==this.path&&(e=this.path+e),e=this.manager.resolveURL(e);let a=this,s=aZ.get(`image-bitmap:${e}`);if(void 0!==s)return(a.manager.itemStart(e),s.then)?void s.then(r=>{if(!0!==sp.has(s))return i&&i(r),a.manager.itemEnd(e),r;n&&n(sp.get(s)),a.manager.itemError(e),a.manager.itemEnd(e)}):(setTimeout(function(){i&&i(s),a.manager.itemEnd(e)},0),s);let o={};o.credentials="anonymous"===this.crossOrigin?"same-origin":"include",o.headers=this.requestHeader,o.signal="function"==typeof AbortSignal.any?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,o).then(function(e){return e.blob()}).then(function(e){return createImageBitmap(e,Object.assign(a.options,{colorSpaceConversion:"none"}))}).then(function(r){return aZ.add(`image-bitmap:${e}`,r),i&&i(r),a.manager.itemEnd(e),r}).catch(function(i){n&&n(i),sp.set(l,i),aZ.remove(`image-bitmap:${e}`),a.manager.itemError(e),a.manager.itemEnd(e)});aZ.add(`image-bitmap:${e}`,l),a.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class sm{static getContext(){return void 0===a&&(a=new(window.AudioContext||window.webkitAudioContext)),a}static setContext(e){a=e}}class sg extends a${constructor(e){super(e)}load(e,i,r,n){let a=this,s=new a2(this.manager);function o(i){n?n(i):console.error(i),a.manager.itemError(e)}s.setResponseType("arraybuffer"),s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,function(e){try{let r=e.slice(0);sm.getContext().decodeAudioData(r,function(e){i(e)}).catch(o)}catch(e){o(e)}},r,n)}}class sv extends no{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class s_{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let i=performance.now();e=(i-this.oldTime)/1e3,this.oldTime=i,this.elapsedTime+=e}return e}}let sy=new tZ,sx=new tJ,sM=new tZ,sb=new tZ,sS=new tZ;class sE extends ro{constructor(){super(),this.type="AudioListener",this.context=sm.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new s_}getInput(){return this.gain}removeFilter(){return null!==this.filter&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return null!==this.filter?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);let i=this.context.listener;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(sy,sx,sM),sb.set(0,0,-1).applyQuaternion(sx),sS.set(0,1,0).applyQuaternion(sx),i.positionX){let e=this.context.currentTime+this.timeDelta;i.positionX.linearRampToValueAtTime(sy.x,e),i.positionY.linearRampToValueAtTime(sy.y,e),i.positionZ.linearRampToValueAtTime(sy.z,e),i.forwardX.linearRampToValueAtTime(sb.x,e),i.forwardY.linearRampToValueAtTime(sb.y,e),i.forwardZ.linearRampToValueAtTime(sb.z,e),i.upX.linearRampToValueAtTime(sS.x,e),i.upY.linearRampToValueAtTime(sS.y,e),i.upZ.linearRampToValueAtTime(sS.z,e)}else i.setPosition(sy.x,sy.y,sy.z),i.setOrientation(sb.x,sb.y,sb.z,sS.x,sS.y,sS.z)}}class sT extends ro{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(!0===this.isPlaying)return void console.warn("THREE.Audio: Audio is already playing.");if(!1===this.hasPlaybackControl)return void console.warn("THREE.Audio: this Audio has no playback control.");this._startedAt=this.context.currentTime+e;let i=this.context.createBufferSource();return i.buffer=this.buffer,i.loop=this.loop,i.loopStart=this.loopStart,i.loopEnd=this.loopEnd,i.onended=this.onEnded.bind(this),i.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=i,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){return!1===this.hasPlaybackControl?void console.warn("THREE.Audio: this Audio has no playback control."):(!0===this.isPlaying&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,!0===this.loop&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this)}stop(e=0){return!1===this.hasPlaybackControl?void console.warn("THREE.Audio: this Audio has no playback control."):(this._progress=0,null!==this.source&&(this.source.stop(this.context.currentTime+e),this.source.onended=null),this.isPlaying=!1,this)}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,i=this.filters.length;e<i;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(!1!==this._connected){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,i=this.filters.length;e<i;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),!0===this._connected?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){return this.detune=e,!0===this.isPlaying&&void 0!==this.source.detune&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){return!1===this.hasPlaybackControl?void console.warn("THREE.Audio: this Audio has no playback control."):(this.playbackRate=e,!0===this.isPlaying&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this)}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return!1===this.hasPlaybackControl?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){return!1===this.hasPlaybackControl?void console.warn("THREE.Audio: this Audio has no playback control."):(this.loop=e,!0===this.isPlaying&&(this.source.loop=this.loop),this)}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}copy(e,i){return(super.copy(e,i),"buffer"!==e.sourceType)?console.warn("THREE.Audio: Audio source type cannot be copied."):(this.autoplay=e.autoplay,this.buffer=e.buffer,this.detune=e.detune,this.loop=e.loop,this.loopStart=e.loopStart,this.loopEnd=e.loopEnd,this.offset=e.offset,this.duration=e.duration,this.playbackRate=e.playbackRate,this.hasPlaybackControl=e.hasPlaybackControl,this.sourceType=e.sourceType,this.filters=e.filters.slice()),this}clone(e){return new this.constructor(this.listener).copy(this,e)}}let sw="\\[\\]\\.:\\/",sA=RegExp("["+sw+"]","g"),sR="[^"+sw+"]",sC="[^"+sw.replace("\\.","")+"]",sP=/((?:WC+[\/:])*)/.source.replace("WC",sR),sI=/(WCOD+)?/.source.replace("WCOD",sC),sL=RegExp("^"+sP+sI+/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sR)+/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sR)+"$"),sD=["material","materials","bones","map"];class sU{constructor(e,i,r){this.path=i,this.parsedPath=r||sU.parseTrackName(i),this.node=sU.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,i,r){return e&&e.isAnimationObjectGroup?new sU.Composite(e,i,r):new sU(e,i,r)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(sA,"")}static parseTrackName(e){let i=sL.exec(e);if(null===i)throw Error("PropertyBinding: Cannot parse trackName: "+e);let r={nodeName:i[2],objectName:i[3],objectIndex:i[4],propertyName:i[5],propertyIndex:i[6]},n=r.nodeName&&r.nodeName.lastIndexOf(".");if(void 0!==n&&-1!==n){let e=r.nodeName.substring(n+1);-1!==sD.indexOf(e)&&(r.nodeName=r.nodeName.substring(0,n),r.objectName=e)}if(null===r.propertyName||0===r.propertyName.length)throw Error("PropertyBinding: can not parse propertyName from trackName: "+e);return r}static findNode(e,i){if(void 0===i||""===i||"."===i||-1===i||i===e.name||i===e.uuid)return e;if(e.skeleton){let r=e.skeleton.getBoneByName(i);if(void 0!==r)return r}if(e.children){let r=function(e){for(let n=0;n<e.length;n++){let a=e[n];if(a.name===i||a.uuid===i)return a;let s=r(a.children);if(s)return s}return null},n=r(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,i){e[i]=this.targetObject[this.propertyName]}_getValue_array(e,i){let r=this.resolvedProperty;for(let n=0,a=r.length;n!==a;++n)e[i++]=r[n]}_getValue_arrayElement(e,i){e[i]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,i){this.resolvedProperty.toArray(e,i)}_setValue_direct(e,i){this.targetObject[this.propertyName]=e[i]}_setValue_direct_setNeedsUpdate(e,i){this.targetObject[this.propertyName]=e[i],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,i){this.targetObject[this.propertyName]=e[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,i){let r=this.resolvedProperty;for(let n=0,a=r.length;n!==a;++n)r[n]=e[i++]}_setValue_array_setNeedsUpdate(e,i){let r=this.resolvedProperty;for(let n=0,a=r.length;n!==a;++n)r[n]=e[i++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,i){let r=this.resolvedProperty;for(let n=0,a=r.length;n!==a;++n)r[n]=e[i++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,i){this.resolvedProperty[this.propertyIndex]=e[i]}_setValue_arrayElement_setNeedsUpdate(e,i){this.resolvedProperty[this.propertyIndex]=e[i],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,i){this.resolvedProperty[this.propertyIndex]=e[i],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,i){this.resolvedProperty.fromArray(e,i)}_setValue_fromArray_setNeedsUpdate(e,i){this.resolvedProperty.fromArray(e,i),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,i){this.resolvedProperty.fromArray(e,i),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,i){this.bind(),this.getValue(e,i)}_setValue_unbound(e,i){this.bind(),this.setValue(e,i)}bind(){let e=this.node,i=this.parsedPath,r=i.objectName,n=i.propertyName,a=i.propertyIndex;if(e||(e=sU.findNode(this.rootNode,i.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e)return void console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");if(r){let n=i.objectIndex;switch(r){case"materials":if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.materials)return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);e=e.material.materials;break;case"bones":if(!e.skeleton)return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);e=e.skeleton.bones;for(let i=0;i<e.length;i++)if(e[i].name===n){n=i;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material)return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);if(!e.material.map)return void console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);e=e.material.map;break;default:if(void 0===e[r])return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);e=e[r]}if(void 0!==n){if(void 0===e[n])return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);e=e[n]}}let s=e[n];if(void 0===s)return void console.error("THREE.PropertyBinding: Trying to update property for track: "+i.nodeName+"."+n+" but it wasn't found.",e);let o=this.Versioning.None;this.targetObject=e,!0===e.isMaterial?o=this.Versioning.NeedsUpdate:!0===e.isObject3D&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(void 0!==a){if("morphTargetInfluences"===n){if(!e.geometry)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);if(!e.geometry.morphAttributes)return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);void 0!==e.morphTargetDictionary[a]&&(a=e.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=s,this.propertyIndex=a}else void 0!==s.fromArray&&void 0!==s.toArray?(l=this.BindingType.HasFromToArray,this.resolvedProperty=s):Array.isArray(s)?(l=this.BindingType.EntireArray,this.resolvedProperty=s):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}sU.Composite=class{constructor(e,i,r){let n=r||sU.parseTrackName(i);this._targetGroup=e,this._bindings=e.subscribe_(i,n)}getValue(e,i){this.bind();let r=this._targetGroup.nCachedObjects_,n=this._bindings[r];void 0!==n&&n.getValue(e,i)}setValue(e,i){let r=this._bindings;for(let n=this._targetGroup.nCachedObjects_,a=r.length;n!==a;++n)r[n].setValue(e,i)}bind(){let e=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=e.length;i!==r;++i)e[i].bind()}unbind(){let e=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=e.length;i!==r;++i)e[i].unbind()}},sU.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},sU.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},sU.prototype.GetterByBindingType=[sU.prototype._getValue_direct,sU.prototype._getValue_array,sU.prototype._getValue_arrayElement,sU.prototype._getValue_toArray],sU.prototype.SetterByBindingTypeAndVersioning=[[sU.prototype._setValue_direct,sU.prototype._setValue_direct_setNeedsUpdate,sU.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[sU.prototype._setValue_array,sU.prototype._setValue_array_setNeedsUpdate,sU.prototype._setValue_array_setMatrixWorldNeedsUpdate],[sU.prototype._setValue_arrayElement,sU.prototype._setValue_arrayElement_setNeedsUpdate,sU.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[sU.prototype._setValue_fromArray,sU.prototype._setValue_fromArray_setNeedsUpdate,sU.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],new Float32Array(1);let sN=new iW;class sO{constructor(e,i,r=0,n=1/0){this.ray=new iG(e,i),this.near=r,this.far=n,this.camera=null,this.layers=new i1,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,i){this.ray.set(e,i)}setFromCamera(e,i){i.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(i.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(i).sub(this.ray.origin).normalize(),this.camera=i):i.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(i.near+i.far)/(i.near-i.far)).unproject(i),this.ray.direction.set(0,0,-1).transformDirection(i.matrixWorld),this.camera=i):console.error("THREE.Raycaster: Unsupported camera type: "+i.type)}setFromXRController(e){return sN.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(sN),this}intersectObject(e,i=!0,r=[]){return sB(e,this,r,i),r.sort(sF),r}intersectObjects(e,i=!0,r=[]){for(let n=0,a=e.length;n<a;n++)sB(e[n],this,r,i);return r.sort(sF),r}}function sF(e,i){return e.distance-i.distance}function sB(e,i,r,n){let a=!0;if(e.layers.test(i.layers)&&!1===e.raycast(i,r)&&(a=!1),!0===a&&!0===n){let n=e.children;for(let e=0,a=n.length;e<a;e++)sB(n[e],i,r,!0)}}let sz=new tZ,sk=new tZ,sV=new tZ,sH=new tZ,sG=new tZ,sW=new tZ,sX=new tZ;class sj{constructor(e=new tZ,i=new tZ){this.start=e,this.end=i}set(e,i){return this.start.copy(e),this.end.copy(i),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,i){return this.delta(i).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,i){sz.subVectors(e,this.start),sk.subVectors(this.end,this.start);let r=sk.dot(sk),n=sk.dot(sz)/r;return i&&(n=tG(n,0,1)),n}closestPointToPoint(e,i,r){let n=this.closestPointToPointParameter(e,i);return this.delta(r).multiplyScalar(n).add(this.start)}distanceSqToLine3(e,i=sW,r=sX){let n,a,s=1e-8*1e-8,o=this.start,l=e.start,c=this.end,h=e.end;sV.subVectors(c,o),sH.subVectors(h,l),sG.subVectors(o,l);let u=sV.dot(sV),d=sH.dot(sH),p=sH.dot(sG);if(u<=s&&d<=s)return i.copy(o),r.copy(l),i.sub(r),i.dot(i);if(u<=s)n=0,a=tG(a=p/d,0,1);else{let e=sV.dot(sG);if(d<=s)a=0,n=tG(-e/u,0,1);else{let i=sV.dot(sH),r=u*d-i*i;n=0!==r?tG((i*p-e*d)/r,0,1):0,(a=(i*n+p)/d)<0?(a=0,n=tG(-e/u,0,1)):a>1&&(a=1,n=tG((i-e)/u,0,1))}}return i.copy(o).add(sV.multiplyScalar(n)),r.copy(l).add(sH.multiplyScalar(a)),i.sub(r),i.dot(i)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}let sq=new tZ;class sY extends ro{constructor(e=new tZ(0,0,1),i=new tZ(0,0,0),r=1,n=0xffff00,a=.2*r,l=.2*a){super(),this.type="ArrowHelper",void 0===s&&((s=new rX).setAttribute("position",new rF([0,0,0,0,1,0],3)),(o=new au(.5,1,5,1)).translate(0,-.5,0)),this.position.copy(i),this.line=new n4(s,new nJ({color:n,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new r3(o,new rP({color:n,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(r,a,l)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{sq.set(e.z,0,-e.x).normalize();let i=Math.acos(e.y);this.quaternion.setFromAxisAngle(sq,i)}}setLength(e,i=.2*e,r=.2*i){this.line.scale.set(1,Math.max(1e-4,e-i),1),this.line.updateMatrix(),this.cone.scale.set(r,i,r),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}function sK(e,i,r,n){let a=function(e){switch(e){case eE:case eT:return{byteLength:1,components:1};case eA:case ew:case eI:return{byteLength:2,components:1};case eL:case eD:return{byteLength:2,components:4};case eC:case eR:case eP:return{byteLength:4,components:1};case eN:return{byteLength:4,components:3}}throw Error(`Unknown texture type ${e}.`)}(n);switch(r){case eO:return e*i;case eV:case eH:return e*i/a.components*a.byteLength;case eG:case eW:return e*i*2/a.components*a.byteLength;case eF:return e*i*3/a.components*a.byteLength;case eB:case eX:return e*i*4/a.components*a.byteLength;case ej:case eq:return Math.floor((e+3)/4)*Math.floor((i+3)/4)*8;case eY:case eK:return Math.floor((e+3)/4)*Math.floor((i+3)/4)*16;case eZ:case e$:return Math.max(e,16)*Math.max(i,8)/4;case eJ:case eQ:return Math.max(e,8)*Math.max(i,8)/2;case e0:case e1:return Math.floor((e+3)/4)*Math.floor((i+3)/4)*8;case e2:case e3:return Math.floor((e+3)/4)*Math.floor((i+3)/4)*16;case e4:return Math.floor((e+4)/5)*Math.floor((i+3)/4)*16;case e5:return Math.floor((e+4)/5)*Math.floor((i+4)/5)*16;case e6:return Math.floor((e+5)/6)*Math.floor((i+4)/5)*16;case e9:return Math.floor((e+5)/6)*Math.floor((i+5)/6)*16;case e8:return Math.floor((e+7)/8)*Math.floor((i+4)/5)*16;case e7:return Math.floor((e+7)/8)*Math.floor((i+5)/6)*16;case te:return Math.floor((e+7)/8)*Math.floor((i+7)/8)*16;case tt:return Math.floor((e+9)/10)*Math.floor((i+4)/5)*16;case ti:return Math.floor((e+9)/10)*Math.floor((i+5)/6)*16;case tr:return Math.floor((e+9)/10)*Math.floor((i+7)/8)*16;case tn:return Math.floor((e+9)/10)*Math.floor((i+9)/10)*16;case ta:return Math.floor((e+11)/12)*Math.floor((i+9)/10)*16;case ts:return Math.floor((e+11)/12)*Math.floor((i+11)/12)*16;case to:case tl:case tc:return Math.ceil(e/4)*Math.ceil(i/4)*16;case th:case tu:return Math.ceil(e/4)*Math.ceil(i/4)*8;case td:case tp:return Math.ceil(e/4)*Math.ceil(i/4)*16}throw Error(`Unable to determine texture byte length for ${r} format.`)}"undefined"!=typeof __THREE_DEVTOOLS__&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:l}})),"undefined"!=typeof window&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=l)},"./node_modules/three/build/three.module.js":(e,i,r)=>{"use strict";r.d(i,{JeP:()=>tI});var n=r("./node_modules/three/build/three.core.js");function a(){let e=null,i=!1,r=null,n=null;function a(i,s){r(i,s),n=e.requestAnimationFrame(a)}return{start:function(){!0!==i&&null!==r&&(n=e.requestAnimationFrame(a),i=!0)},stop:function(){e.cancelAnimationFrame(n),i=!1},setAnimationLoop:function(e){r=e},setContext:function(i){e=i}}}function s(e){let i=new WeakMap;return{get:function(e){return e.isInterleavedBufferAttribute&&(e=e.data),i.get(e)},remove:function(r){r.isInterleavedBufferAttribute&&(r=r.data);let n=i.get(r);n&&(e.deleteBuffer(n.buffer),i.delete(r))},update:function(r,n){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){let e=i.get(r);(!e||e.version<r.version)&&i.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}let a=i.get(r);if(void 0===a)i.set(r,function(i,r){let n,a=i.array,s=i.usage,o=a.byteLength,l=e.createBuffer();if(e.bindBuffer(r,l),e.bufferData(r,a,s),i.onUploadCallback(),a instanceof Float32Array)n=e.FLOAT;else if("undefined"!=typeof Float16Array&&a instanceof Float16Array)n=e.HALF_FLOAT;else if(a instanceof Uint16Array)n=i.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(a instanceof Int16Array)n=e.SHORT;else if(a instanceof Uint32Array)n=e.UNSIGNED_INT;else if(a instanceof Int32Array)n=e.INT;else if(a instanceof Int8Array)n=e.BYTE;else if(a instanceof Uint8Array)n=e.UNSIGNED_BYTE;else if(a instanceof Uint8ClampedArray)n=e.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+a);return{buffer:l,type:n,bytesPerElement:a.BYTES_PER_ELEMENT,version:i.version,size:o}}(r,n));else if(a.version<r.version){if(a.size!==r.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");!function(i,r,n){let a=r.array,s=r.updateRanges;if(e.bindBuffer(n,i),0===s.length)e.bufferSubData(n,0,a);else{s.sort((e,i)=>e.start-i.start);let i=0;for(let e=1;e<s.length;e++){let r=s[i],n=s[e];n.start<=r.start+r.count+1?r.count=Math.max(r.count,n.start+n.count-r.start):s[++i]=n}s.length=i+1;for(let i=0,r=s.length;i<r;i++){let r=s[i];e.bufferSubData(n,r.start*a.BYTES_PER_ELEMENT,a,r.start,r.count)}r.clearUpdateRanges()}r.onUploadCallback()}(a.buffer,r,n),a.version=r.version}}}}let o={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distanceRGBA_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distanceRGBA_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},l={common:{diffuse:{value:new n.Q1f(0xffffff)},opacity:{value:1},map:{value:null},mapTransform:{value:new n.dwI},alphaMap:{value:null},alphaMapTransform:{value:new n.dwI},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new n.dwI}},envmap:{envMap:{value:null},envMapRotation:{value:new n.dwI},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new n.dwI}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new n.dwI}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new n.dwI},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new n.dwI},normalScale:{value:new n.I9Y(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new n.dwI},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new n.dwI}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new n.dwI}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new n.dwI}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new n.Q1f(0xffffff)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new n.Q1f(0xffffff)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new n.dwI},alphaTest:{value:0},uvTransform:{value:new n.dwI}},sprite:{diffuse:{value:new n.Q1f(0xffffff)},opacity:{value:1},center:{value:new n.I9Y(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new n.dwI},alphaMap:{value:null},alphaMapTransform:{value:new n.dwI},alphaTest:{value:0}}},c={basic:{uniforms:(0,n.Iit)([l.common,l.specularmap,l.envmap,l.aomap,l.lightmap,l.fog]),vertexShader:o.meshbasic_vert,fragmentShader:o.meshbasic_frag},lambert:{uniforms:(0,n.Iit)([l.common,l.specularmap,l.envmap,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.fog,l.lights,{emissive:{value:new n.Q1f(0)}}]),vertexShader:o.meshlambert_vert,fragmentShader:o.meshlambert_frag},phong:{uniforms:(0,n.Iit)([l.common,l.specularmap,l.envmap,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.fog,l.lights,{emissive:{value:new n.Q1f(0)},specular:{value:new n.Q1f(1118481)},shininess:{value:30}}]),vertexShader:o.meshphong_vert,fragmentShader:o.meshphong_frag},standard:{uniforms:(0,n.Iit)([l.common,l.envmap,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.roughnessmap,l.metalnessmap,l.fog,l.lights,{emissive:{value:new n.Q1f(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:o.meshphysical_vert,fragmentShader:o.meshphysical_frag},toon:{uniforms:(0,n.Iit)([l.common,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.gradientmap,l.fog,l.lights,{emissive:{value:new n.Q1f(0)}}]),vertexShader:o.meshtoon_vert,fragmentShader:o.meshtoon_frag},matcap:{uniforms:(0,n.Iit)([l.common,l.bumpmap,l.normalmap,l.displacementmap,l.fog,{matcap:{value:null}}]),vertexShader:o.meshmatcap_vert,fragmentShader:o.meshmatcap_frag},points:{uniforms:(0,n.Iit)([l.points,l.fog]),vertexShader:o.points_vert,fragmentShader:o.points_frag},dashed:{uniforms:(0,n.Iit)([l.common,l.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:o.linedashed_vert,fragmentShader:o.linedashed_frag},depth:{uniforms:(0,n.Iit)([l.common,l.displacementmap]),vertexShader:o.depth_vert,fragmentShader:o.depth_frag},normal:{uniforms:(0,n.Iit)([l.common,l.bumpmap,l.normalmap,l.displacementmap,{opacity:{value:1}}]),vertexShader:o.meshnormal_vert,fragmentShader:o.meshnormal_frag},sprite:{uniforms:(0,n.Iit)([l.sprite,l.fog]),vertexShader:o.sprite_vert,fragmentShader:o.sprite_frag},background:{uniforms:{uvTransform:{value:new n.dwI},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:o.background_vert,fragmentShader:o.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new n.dwI}},vertexShader:o.backgroundCube_vert,fragmentShader:o.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:o.cube_vert,fragmentShader:o.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:o.equirect_vert,fragmentShader:o.equirect_frag},distanceRGBA:{uniforms:(0,n.Iit)([l.common,l.displacementmap,{referencePosition:{value:new n.Pq0},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:o.distanceRGBA_vert,fragmentShader:o.distanceRGBA_frag},shadow:{uniforms:(0,n.Iit)([l.lights,l.fog,{color:{value:new n.Q1f(0)},opacity:{value:1}}]),vertexShader:o.shadow_vert,fragmentShader:o.shadow_frag}};c.physical={uniforms:(0,n.Iit)([c.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new n.dwI},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new n.dwI},clearcoatNormalScale:{value:new n.I9Y(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new n.dwI},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new n.dwI},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new n.dwI},sheen:{value:0},sheenColor:{value:new n.Q1f(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new n.dwI},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new n.dwI},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new n.dwI},transmissionSamplerSize:{value:new n.I9Y},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new n.dwI},attenuationDistance:{value:0},attenuationColor:{value:new n.Q1f(0)},specularColor:{value:new n.Q1f(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new n.dwI},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new n.dwI},anisotropyVector:{value:new n.I9Y},anisotropyMap:{value:null},anisotropyMapTransform:{value:new n.dwI}}]),vertexShader:o.meshphysical_vert,fragmentShader:o.meshphysical_frag};let h={r:0,b:0,g:0},u=new n.O9p,d=new n.kn4;function p(e,i,r,a,s,o,l){let p,f,m=new n.Q1f(0),g=+(!0!==o),v=null,_=0,y=null;function x(e){let n=!0===e.isScene?e.background:null;return n&&n.isTexture&&(n=(e.backgroundBlurriness>0?r:i).get(n)),n}function M(i,r){i.getRGB(h,(0,n._Ut)(e)),a.buffers.color.setClear(h.r,h.g,h.b,r,l)}return{getClearColor:function(){return m},setClearColor:function(e,i=1){m.set(e),M(m,g=i)},getClearAlpha:function(){return g},setClearAlpha:function(e){M(m,g=e)},render:function(i){let r=!1,n=x(i);null===n?M(m,g):n&&n.isColor&&(M(n,1),r=!0);let s=e.xr.getEnvironmentBlendMode();"additive"===s?a.buffers.color.setClear(0,0,0,1,l):"alpha-blend"===s&&a.buffers.color.setClear(0,0,0,0,l),(e.autoClear||r)&&(a.buffers.depth.setTest(!0),a.buffers.depth.setMask(!0),a.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))},addToRenderList:function(i,r){let a=x(r);a&&(a.isCubeTexture||a.mapping===n.Om)?(void 0===f&&((f=new n.eaF(new n.iNn(1,1,1),new n.BKk({name:"BackgroundCubeMaterial",uniforms:(0,n.lxW)(c.backgroundCube.uniforms),vertexShader:c.backgroundCube.vertexShader,fragmentShader:c.backgroundCube.fragmentShader,side:n.hsX,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1}))).geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(e,i,r){this.matrixWorld.copyPosition(r.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(f)),u.copy(r.backgroundRotation),u.x*=-1,u.y*=-1,u.z*=-1,a.isCubeTexture&&!1===a.isRenderTargetTexture&&(u.y*=-1,u.z*=-1),f.material.uniforms.envMap.value=a,f.material.uniforms.flipEnvMap.value=a.isCubeTexture&&!1===a.isRenderTargetTexture?-1:1,f.material.uniforms.backgroundBlurriness.value=r.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=r.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(d.makeRotationFromEuler(u)),f.material.toneMapped=n.ppV.getTransfer(a.colorSpace)!==n.KLL,(v!==a||_!==a.version||y!==e.toneMapping)&&(f.material.needsUpdate=!0,v=a,_=a.version,y=e.toneMapping),f.layers.enableAll(),i.unshift(f,f.geometry,f.material,0,0,null)):a&&a.isTexture&&(void 0===p&&((p=new n.eaF(new n.bdM(2,2),new n.BKk({name:"BackgroundMaterial",uniforms:(0,n.lxW)(c.background.uniforms),vertexShader:c.background.vertexShader,fragmentShader:c.background.fragmentShader,side:n.hB5,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1}))).geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(p)),p.material.uniforms.t2D.value=a,p.material.uniforms.backgroundIntensity.value=r.backgroundIntensity,p.material.toneMapped=n.ppV.getTransfer(a.colorSpace)!==n.KLL,!0===a.matrixAutoUpdate&&a.updateMatrix(),p.material.uniforms.uvTransform.value.copy(a.matrix),(v!==a||_!==a.version||y!==e.toneMapping)&&(p.material.needsUpdate=!0,v=a,_=a.version,y=e.toneMapping),p.layers.enableAll(),i.unshift(p,p.geometry,p.material,0,0,null))},dispose:function(){void 0!==f&&(f.geometry.dispose(),f.material.dispose(),f=void 0),void 0!==p&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}}}function f(e,i){let r=e.getParameter(e.MAX_VERTEX_ATTRIBS),a={},s=u(null),o=s,l=!1;function c(i){return e.bindVertexArray(i)}function h(i){return e.deleteVertexArray(i)}function u(e){let i=[],n=[],a=[];for(let e=0;e<r;e++)i[e]=0,n[e]=0,a[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:i,enabledAttributes:n,attributeDivisors:a,object:e,attributes:{},index:null}}function d(){let e=o.newAttributes;for(let i=0,r=e.length;i<r;i++)e[i]=0}function p(e){f(e,0)}function f(i,r){let n=o.newAttributes,a=o.enabledAttributes,s=o.attributeDivisors;n[i]=1,0===a[i]&&(e.enableVertexAttribArray(i),a[i]=1),s[i]!==r&&(e.vertexAttribDivisor(i,r),s[i]=r)}function m(){let i=o.newAttributes,r=o.enabledAttributes;for(let n=0,a=r.length;n<a;n++)r[n]!==i[n]&&(e.disableVertexAttribArray(n),r[n]=0)}function g(i,r,n,a,s,o,l){!0===l?e.vertexAttribIPointer(i,r,n,s,o):e.vertexAttribPointer(i,r,n,a,s,o)}function v(){_(),l=!0,o!==s&&c((o=s).object)}function _(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:function(r,s,h,v,_){let y=!1,x=function(i,r,n){let s=!0===n.wireframe,o=a[i.id];void 0===o&&(o={},a[i.id]=o);let l=o[r.id];void 0===l&&(l={},o[r.id]=l);let c=l[s];return void 0===c&&(c=u(e.createVertexArray()),l[s]=c),c}(v,h,s);o!==x&&c((o=x).object),(y=function(e,i,r,n){let a=o.attributes,s=i.attributes,l=0,c=r.getAttributes();for(let i in c)if(c[i].location>=0){let r=a[i],n=s[i];if(void 0===n&&("instanceMatrix"===i&&e.instanceMatrix&&(n=e.instanceMatrix),"instanceColor"===i&&e.instanceColor&&(n=e.instanceColor)),void 0===r||r.attribute!==n||n&&r.data!==n.data)return!0;l++}return o.attributesNum!==l||o.index!==n}(r,v,h,_))&&function(e,i,r,n){let a={},s=i.attributes,l=0,c=r.getAttributes();for(let i in c)if(c[i].location>=0){let r=s[i];void 0===r&&("instanceMatrix"===i&&e.instanceMatrix&&(r=e.instanceMatrix),"instanceColor"===i&&e.instanceColor&&(r=e.instanceColor));let n={};n.attribute=r,r&&r.data&&(n.data=r.data),a[i]=n,l++}o.attributes=a,o.attributesNum=l,o.index=n}(r,v,h,_),null!==_&&i.update(_,e.ELEMENT_ARRAY_BUFFER),(y||l)&&(l=!1,function(r,a,s,o){d();let l=o.attributes,c=s.getAttributes(),h=a.defaultAttributeValues;for(let a in c){let s=c[a];if(s.location>=0){let c=l[a];if(void 0===c&&("instanceMatrix"===a&&r.instanceMatrix&&(c=r.instanceMatrix),"instanceColor"===a&&r.instanceColor&&(c=r.instanceColor)),void 0!==c){let a=c.normalized,l=c.itemSize,h=i.get(c);if(void 0===h)continue;let u=h.buffer,d=h.type,m=h.bytesPerElement,v=d===e.INT||d===e.UNSIGNED_INT||c.gpuType===n.Yuy;if(c.isInterleavedBufferAttribute){let i=c.data,n=i.stride,h=c.offset;if(i.isInstancedInterleavedBuffer){for(let e=0;e<s.locationSize;e++)f(s.location+e,i.meshPerAttribute);!0!==r.isInstancedMesh&&void 0===o._maxInstanceCount&&(o._maxInstanceCount=i.meshPerAttribute*i.count)}else for(let e=0;e<s.locationSize;e++)p(s.location+e);e.bindBuffer(e.ARRAY_BUFFER,u);for(let e=0;e<s.locationSize;e++)g(s.location+e,l/s.locationSize,d,a,n*m,(h+l/s.locationSize*e)*m,v)}else{if(c.isInstancedBufferAttribute){for(let e=0;e<s.locationSize;e++)f(s.location+e,c.meshPerAttribute);!0!==r.isInstancedMesh&&void 0===o._maxInstanceCount&&(o._maxInstanceCount=c.meshPerAttribute*c.count)}else for(let e=0;e<s.locationSize;e++)p(s.location+e);e.bindBuffer(e.ARRAY_BUFFER,u);for(let e=0;e<s.locationSize;e++)g(s.location+e,l/s.locationSize,d,a,l*m,l/s.locationSize*e*m,v)}}else if(void 0!==h){let i=h[a];if(void 0!==i)switch(i.length){case 2:e.vertexAttrib2fv(s.location,i);break;case 3:e.vertexAttrib3fv(s.location,i);break;case 4:e.vertexAttrib4fv(s.location,i);break;default:e.vertexAttrib1fv(s.location,i)}}}}m()}(r,s,h,v),null!==_&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,i.get(_).buffer))},reset:v,resetDefaultState:_,dispose:function(){for(let e in v(),a){let i=a[e];for(let e in i){let r=i[e];for(let e in r)h(r[e].object),delete r[e];delete i[e]}delete a[e]}},releaseStatesOfGeometry:function(e){if(void 0===a[e.id])return;let i=a[e.id];for(let e in i){let r=i[e];for(let e in r)h(r[e].object),delete r[e];delete i[e]}delete a[e.id]},releaseStatesOfProgram:function(e){for(let i in a){let r=a[i];if(void 0===r[e.id])continue;let n=r[e.id];for(let e in n)h(n[e].object),delete n[e];delete r[e.id]}},initAttributes:d,enableAttribute:p,disableUnusedAttributes:m}}function m(e,i,r){let n;function a(i,a,s){0!==s&&(e.drawArraysInstanced(n,i,a,s),r.update(a,n,s))}this.setMode=function(e){n=e},this.render=function(i,a){e.drawArrays(n,i,a),r.update(a,n,1)},this.renderInstances=a,this.renderMultiDraw=function(e,a,s){if(0===s)return;i.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,e,0,a,0,s);let o=0;for(let e=0;e<s;e++)o+=a[e];r.update(o,n,1)},this.renderMultiDrawInstances=function(e,s,o,l){if(0===o)return;let c=i.get("WEBGL_multi_draw");if(null===c)for(let i=0;i<e.length;i++)a(e[i],s[i],l[i]);else{c.multiDrawArraysInstancedWEBGL(n,e,0,s,0,l,0,o);let i=0;for(let e=0;e<o;e++)i+=s[e]*l[e];r.update(i,n,1)}}}function g(e,i,r,a){let s;function o(i){if("highp"===i){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";i="mediump"}return"mediump"===i&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=void 0!==r.precision?r.precision:"highp",c=o(l);c!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",c,"instead."),l=c);let h=!0===r.logarithmicDepthBuffer,u=!0===r.reversedDepthBuffer&&i.has("EXT_clip_control"),d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),p=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=e.getParameter(e.MAX_TEXTURE_SIZE),m=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),g=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),_=e.getParameter(e.MAX_VARYING_VECTORS);return{isWebGL2:!0,getMaxAnisotropy:function(){if(void 0!==s)return s;if(!0===i.has("EXT_texture_filter_anisotropic")){let r=i.get("EXT_texture_filter_anisotropic");s=e.getParameter(r.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s},getMaxPrecision:o,textureFormatReadable:function(i){return i===n.GWd||a.convert(i)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(r){let s=r===n.ix0&&(i.has("EXT_color_buffer_half_float")||i.has("EXT_color_buffer_float"));return r===n.OUM||a.convert(r)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)||r===n.RQf||!!s},precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:f,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:v,maxVaryings:_,maxFragmentUniforms:e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),vertexTextures:p>0,maxSamples:e.getParameter(e.MAX_SAMPLES)}}function v(e){let i=this,r=null,a=0,s=!1,o=!1,l=new n.Zcv,c=new n.dwI,h={value:null,needsUpdate:!1};function u(e,r,n,a){let s=null!==e?e.length:0,o=null;if(0!==s){if(o=h.value,!0!==a||null===o){let i=n+4*s,a=r.matrixWorldInverse;c.getNormalMatrix(a),(null===o||o.length<i)&&(o=new Float32Array(i));for(let i=0,r=n;i!==s;++i,r+=4)l.copy(e[i]).applyMatrix4(a,c),l.normal.toArray(o,r),o[r+3]=l.constant}h.value=o,h.needsUpdate=!0}return i.numPlanes=s,i.numIntersection=0,o}this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(e,i){let r=0!==e.length||i||0!==a||s;return s=i,a=e.length,r},this.beginShadows=function(){o=!0,u(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(e,i){r=u(e,i,0)},this.setState=function(n,l,c){let d=n.clippingPlanes,p=n.clipIntersection,f=n.clipShadows,m=e.get(n);if(s&&null!==d&&0!==d.length&&(!o||f)){let e=o?0:a,i=4*e,n=m.clippingState||null;h.value=n,n=u(d,l,i,c);for(let e=0;e!==i;++e)n[e]=r[e];m.clippingState=n,this.numIntersection=p?this.numPlanes:0,this.numPlanes+=e}else o?u(null):(h.value!==r&&(h.value=r,h.needsUpdate=a>0),i.numPlanes=a,i.numIntersection=0)}}function _(e){let i=new WeakMap;function r(e,i){return i===n.wfO?e.mapping=n.hy7:i===n.uV5&&(e.mapping=n.xFO),e}function a(e){let r=e.target;r.removeEventListener("dispose",a);let n=i.get(r);void 0!==n&&(i.delete(r),n.dispose())}return{get:function(s){if(s&&s.isTexture){let o=s.mapping;if(o===n.wfO||o===n.uV5)if(i.has(s))return r(i.get(s).texture,s.mapping);else{let o=s.image;if(!o||!(o.height>0))return null;{let l=new n.o6l(o.height);return l.fromEquirectangularTexture(e,s),i.set(s,l),s.addEventListener("dispose",a),r(l.texture,s.mapping)}}}return s},dispose:function(){i=new WeakMap}}}let y=[.125,.215,.35,.446,.526,.582],x=new n.qUd,M=new n.Q1f,b=null,S=0,E=0,T=!1,w=(1+Math.sqrt(5))/2,A=1/w,R=[new n.Pq0(-w,A,0),new n.Pq0(w,A,0),new n.Pq0(-A,0,w),new n.Pq0(A,0,w),new n.Pq0(0,w,-A),new n.Pq0(0,w,A),new n.Pq0(-1,1,-1),new n.Pq0(1,1,-1),new n.Pq0(-1,1,1),new n.Pq0(1,1,1)],C=new n.Pq0;class P{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,n=100,a={}){let{size:s=256,position:o=C}=a;b=this._renderer.getRenderTarget(),S=this._renderer.getActiveCubeFace(),E=this._renderer.getActiveMipmapLevel(),T=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,r,n,l,o),i>0&&this._blur(l,0,0,i),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){null===this._cubemapMaterial&&(this._cubemapMaterial=U(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){null===this._equirectMaterial&&(this._equirectMaterial=D(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),null!==this._cubemapMaterial&&this._cubemapMaterial.dispose(),null!==this._equirectMaterial&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){null!==this._blurMaterial&&this._blurMaterial.dispose(),null!==this._pingPongRenderTarget&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(b,S,E),this._renderer.xr.enabled=T,e.scissorTest=!1,L(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===n.hy7||e.mapping===n.xFO?this._setSize(0===e.image.length?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),b=this._renderer.getRenderTarget(),S=this._renderer.getActiveCubeFace(),E=this._renderer.getActiveMipmapLevel(),T=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:n.k6q,minFilter:n.k6q,generateMipmaps:!1,type:n.ix0,format:n.GWd,colorSpace:n.Zr2,depthBuffer:!1},a=I(e,i,r);if(null===this._pingPongRenderTarget||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){null!==this._pingPongRenderTarget&&this._dispose(),this._pingPongRenderTarget=I(e,i,r);let{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=function(e){let i=[],r=[],a=[],s=e,o=e-4+1+y.length;for(let l=0;l<o;l++){let o=Math.pow(2,s);r.push(o);let c=1/o;l>e-4?c=y[l-e+4-1]:0===l&&(c=0),a.push(c);let h=1/(o-2),u=-h,d=1+h,p=[u,u,d,u,d,d,u,u,d,d,u,d],f=new Float32Array(108),m=new Float32Array(72),g=new Float32Array(36);for(let e=0;e<6;e++){let i=e%3*2/3-1,r=e>2?0:-1,n=[i,r,0,i+2/3,r,0,i+2/3,r+1,0,i,r,0,i+2/3,r+1,0,i,r+1,0];f.set(n,18*e),m.set(p,12*e);let a=[e,e,e,e,e,e];g.set(a,6*e)}let v=new n.LoY;v.setAttribute("position",new n.THS(f,3)),v.setAttribute("uv",new n.THS(m,2)),v.setAttribute("faceIndex",new n.THS(g,1)),i.push(v),s>4&&s--}return{lodPlanes:i,sizeLods:r,sigmas:a}}(a)),this._blurMaterial=function(e,i,r){let a=new Float32Array(20),s=new n.Pq0(0,1,0);return new n.BKk({name:"SphericalGaussianBlur",defines:{n:20,CUBEUV_TEXEL_WIDTH:1/i,CUBEUV_TEXEL_HEIGHT:1/r,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:a},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:N(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:n.XIg,depthTest:!1,depthWrite:!1})}(a,e,i)}return a}_compileMaterial(e){let i=new n.eaF(this._lodPlanes[0],e);this._renderer.compile(i,x)}_sceneToCubeUV(e,i,r,a,s){let o=new n.ubm(90,1,i,r),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(M),h.toneMapping=n.y_p,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(a),h.clearDepth(),h.setRenderTarget(null));let p=new n.V9B({name:"PMREM.Background",side:n.hsX,depthWrite:!1,depthTest:!1}),f=new n.eaF(new n.iNn,p),m=!1,g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,m=!0):(p.color.copy(M),m=!0);for(let i=0;i<6;i++){let r=i%3;0===r?(o.up.set(0,l[i],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x+c[i],s.y,s.z)):1===r?(o.up.set(0,0,l[i]),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y+c[i],s.z)):(o.up.set(0,l[i],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y,s.z+c[i]));let n=this._cubeSize;L(a,r*n,i>2?n:0,n,n),h.setRenderTarget(a),m&&h.render(f,o),h.render(e,o)}f.geometry.dispose(),f.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=g}_textureToCubeUV(e,i){let r=this._renderer,a=e.mapping===n.hy7||e.mapping===n.xFO;a?(null===this._cubemapMaterial&&(this._cubemapMaterial=U()),this._cubemapMaterial.uniforms.flipEnvMap.value=!1===e.isRenderTargetTexture?-1:1):null===this._equirectMaterial&&(this._equirectMaterial=D());let s=a?this._cubemapMaterial:this._equirectMaterial,o=new n.eaF(this._lodPlanes[0],s);s.uniforms.envMap.value=e;let l=this._cubeSize;L(i,0,0,3*l,2*l),r.setRenderTarget(i),r.render(o,x)}_applyPMREM(e){let i=this._renderer,r=i.autoClear;i.autoClear=!1;let n=this._lodPlanes.length;for(let i=1;i<n;i++){let r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=R[(n-i-1)%R.length];this._blur(e,i-1,i,r,a)}i.autoClear=r}_blur(e,i,r,n,a){let s=this._pingPongRenderTarget;this._halfBlur(e,s,i,r,n,"latitudinal",a),this._halfBlur(s,e,r,r,n,"longitudinal",a)}_halfBlur(e,i,r,a,s,o,l){let c=this._renderer,h=this._blurMaterial;"latitudinal"!==o&&"longitudinal"!==o&&console.error("blur direction must be either latitudinal or longitudinal!");let u=new n.eaF(this._lodPlanes[a],h),d=h.uniforms,p=this._sizeLods[r]-1,f=isFinite(s)?Math.PI/(2*p):2*Math.PI/39,m=s/f,g=isFinite(s)?1+Math.floor(3*m):20;g>20&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to 20`);let v=[],_=0;for(let e=0;e<20;++e){let i=e/m,r=Math.exp(-i*i/2);v.push(r),0===e?_+=r:e<g&&(_+=2*r)}for(let e=0;e<v.length;e++)v[e]=v[e]/_;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=v,d.latitudinal.value="latitudinal"===o,l&&(d.poleAxis.value=l);let{_lodMax:y}=this;d.dTheta.value=f,d.mipInt.value=y-r;let M=this._sizeLods[a],b=4*(this._cubeSize-M);L(i,3*M*(a>y-4?a-y+4:0),b,3*M,2*M),c.setRenderTarget(i),c.render(u,x)}}function I(e,i,r){let a=new n.nWS(e,i,r);return a.texture.mapping=n.Om,a.texture.name="PMREM.cubeUv",a.scissorTest=!0,a}function L(e,i,r,n,a){e.viewport.set(i,r,n,a),e.scissor.set(i,r,n,a)}function D(){return new n.BKk({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:N(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:n.XIg,depthTest:!1,depthWrite:!1})}function U(){return new n.BKk({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:N(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:n.XIg,depthTest:!1,depthWrite:!1})}function N(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function O(e){let i=new WeakMap,r=null;function a(e){let r=e.target;r.removeEventListener("dispose",a);let n=i.get(r);void 0!==n&&(i.delete(r),n.dispose())}return{get:function(s){if(s&&s.isTexture){let o=s.mapping,l=o===n.wfO||o===n.uV5,c=o===n.hy7||o===n.xFO;if(l||c){let n=i.get(s),o=void 0!==n?n.texture.pmremVersion:0;if(s.isRenderTargetTexture&&s.pmremVersion!==o)return null===r&&(r=new P(e)),(n=l?r.fromEquirectangular(s,n):r.fromCubemap(s,n)).texture.pmremVersion=s.pmremVersion,i.set(s,n),n.texture;{if(void 0!==n)return n.texture;let o=s.image;return l&&o&&o.height>0||c&&o&&function(e){let i=0;for(let r=0;r<6;r++)void 0!==e[r]&&i++;return 6===i}(o)?(null===r&&(r=new P(e)),(n=l?r.fromEquirectangular(s):r.fromCubemap(s)).texture.pmremVersion=s.pmremVersion,i.set(s,n),s.addEventListener("dispose",a),n.texture):null}}}return s},dispose:function(){i=new WeakMap,null!==r&&(r.dispose(),r=null)}}}function F(e){let i={};function r(r){let n;if(void 0!==i[r])return i[r];switch(r){case"WEBGL_depth_texture":n=e.getExtension("WEBGL_depth_texture")||e.getExtension("MOZ_WEBGL_depth_texture")||e.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":n=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":n=e.getExtension("WEBGL_compressed_texture_s3tc")||e.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":n=e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:n=e.getExtension(r)}return i[r]=n,n}return{has:function(e){return null!==r(e)},init:function(){r("EXT_color_buffer_float"),r("WEBGL_clip_cull_distance"),r("OES_texture_float_linear"),r("EXT_color_buffer_half_float"),r("WEBGL_multisampled_render_to_texture"),r("WEBGL_render_shared_exponent")},get:function(e){let i=r(e);return null===i&&(0,n.mcG)("THREE.WebGLRenderer: "+e+" extension not supported."),i}}}function B(e,i,r,a){let s={},o=new WeakMap;function l(e){let n=e.target;for(let e in null!==n.index&&i.remove(n.index),n.attributes)i.remove(n.attributes[e]);n.removeEventListener("dispose",l),delete s[n.id];let c=o.get(n);c&&(i.remove(c),o.delete(n)),a.releaseStatesOfGeometry(n),!0===n.isInstancedBufferGeometry&&delete n._maxInstanceCount,r.memory.geometries--}function c(e){let r=[],a=e.index,s=e.attributes.position,l=0;if(null!==a){let e=a.array;l=a.version;for(let i=0,n=e.length;i<n;i+=3){let n=e[i+0],a=e[i+1],s=e[i+2];r.push(n,a,a,s,s,n)}}else{if(void 0===s)return;let e=s.array;l=s.version;for(let i=0,n=e.length/3-1;i<n;i+=3){let e=i+0,n=i+1,a=i+2;r.push(e,n,n,a,a,e)}}let c=new((0,n.AQS)(r)?n.MW4:n.A$4)(r,1);c.version=l;let h=o.get(e);h&&i.remove(h),o.set(e,c)}return{get:function(e,i){return!0===s[i.id]||(i.addEventListener("dispose",l),s[i.id]=!0,r.memory.geometries++),i},update:function(r){let n=r.attributes;for(let r in n)i.update(n[r],e.ARRAY_BUFFER)},getWireframeAttribute:function(e){let i=o.get(e);if(i){let r=e.index;null!==r&&i.version<r.version&&c(e)}else c(e);return o.get(e)}}}function z(e,i,r){let n,a,s;function o(i,o,l){0!==l&&(e.drawElementsInstanced(n,o,a,i*s,l),r.update(o,n,l))}this.setMode=function(e){n=e},this.setIndex=function(e){a=e.type,s=e.bytesPerElement},this.render=function(i,o){e.drawElements(n,o,a,i*s),r.update(o,n,1)},this.renderInstances=o,this.renderMultiDraw=function(e,s,o){if(0===o)return;i.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,s,0,a,e,0,o);let l=0;for(let e=0;e<o;e++)l+=s[e];r.update(l,n,1)},this.renderMultiDrawInstances=function(e,l,c,h){if(0===c)return;let u=i.get("WEBGL_multi_draw");if(null===u)for(let i=0;i<e.length;i++)o(e[i]/s,l[i],h[i]);else{u.multiDrawElementsInstancedWEBGL(n,l,0,a,e,0,h,0,c);let i=0;for(let e=0;e<c;e++)i+=l[e]*h[e];r.update(i,n,1)}}}function k(e){let i={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:i,programs:null,autoReset:!0,reset:function(){i.calls=0,i.triangles=0,i.points=0,i.lines=0},update:function(r,n,a){switch(i.calls++,n){case e.TRIANGLES:i.triangles+=r/3*a;break;case e.LINES:i.lines+=r/2*a;break;case e.LINE_STRIP:i.lines+=a*(r-1);break;case e.LINE_LOOP:i.lines+=a*r;break;case e.POINTS:i.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",n)}}}}function V(e,i,r){let a=new WeakMap,s=new n.IUQ;return{update:function(o,l,c){let h=o.morphTargetInfluences,u=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,d=void 0!==u?u.length:0,p=a.get(l);if(void 0===p||p.count!==d){void 0!==p&&p.texture.dispose();let e=void 0!==l.morphAttributes.position,r=void 0!==l.morphAttributes.normal,o=void 0!==l.morphAttributes.color,c=l.morphAttributes.position||[],h=l.morphAttributes.normal||[],u=l.morphAttributes.color||[],f=0;!0===e&&(f=1),!0===r&&(f=2),!0===o&&(f=3);let m=l.attributes.position.count*f,g=1;m>i.maxTextureSize&&(g=Math.ceil(m/i.maxTextureSize),m=i.maxTextureSize);let v=new Float32Array(m*g*4*d),_=new n.rFo(v,m,g,d);_.type=n.RQf,_.needsUpdate=!0;let y=4*f;for(let i=0;i<d;i++){let n=c[i],a=h[i],l=u[i],d=m*g*4*i;for(let i=0;i<n.count;i++){let c=i*y;!0===e&&(s.fromBufferAttribute(n,i),v[d+c+0]=s.x,v[d+c+1]=s.y,v[d+c+2]=s.z,v[d+c+3]=0),!0===r&&(s.fromBufferAttribute(a,i),v[d+c+4]=s.x,v[d+c+5]=s.y,v[d+c+6]=s.z,v[d+c+7]=0),!0===o&&(s.fromBufferAttribute(l,i),v[d+c+8]=s.x,v[d+c+9]=s.y,v[d+c+10]=s.z,v[d+c+11]=4===l.itemSize?s.w:1)}}p={count:d,texture:_,size:new n.I9Y(m,g)},a.set(l,p),l.addEventListener("dispose",function e(){_.dispose(),a.delete(l),l.removeEventListener("dispose",e)})}if(!0===o.isInstancedMesh&&null!==o.morphTexture)c.getUniforms().setValue(e,"morphTexture",o.morphTexture,r);else{let i=0;for(let e=0;e<h.length;e++)i+=h[e];let r=l.morphTargetsRelative?1:1-i;c.getUniforms().setValue(e,"morphTargetBaseInfluence",r),c.getUniforms().setValue(e,"morphTargetInfluences",h)}c.getUniforms().setValue(e,"morphTargetsTexture",p.texture,r),c.getUniforms().setValue(e,"morphTargetsTextureSize",p.size)}}}function H(e,i,r,n){let a=new WeakMap;function s(e){let i=e.target;i.removeEventListener("dispose",s),r.remove(i.instanceMatrix),null!==i.instanceColor&&r.remove(i.instanceColor)}return{update:function(o){let l=n.render.frame,c=o.geometry,h=i.get(o,c);if(a.get(h)!==l&&(i.update(h),a.set(h,l)),o.isInstancedMesh&&(!1===o.hasEventListener("dispose",s)&&o.addEventListener("dispose",s),a.get(o)!==l&&(r.update(o.instanceMatrix,e.ARRAY_BUFFER),null!==o.instanceColor&&r.update(o.instanceColor,e.ARRAY_BUFFER),a.set(o,l))),o.isSkinnedMesh){let e=o.skeleton;a.get(e)!==l&&(e.update(),a.set(e,l))}return h},dispose:function(){a=new WeakMap}}}let G=new n.gPd,W=new n.VCu(1,1),X=new n.rFo,j=new n.dYF,q=new n.b4q,Y=[],K=[],J=new Float32Array(16),Z=new Float32Array(9),Q=new Float32Array(4);function $(e,i,r){let n=e[0];if(n<=0||n>0)return e;let a=i*r,s=Y[a];if(void 0===s&&(s=new Float32Array(a),Y[a]=s),0!==i){n.toArray(s,0);for(let n=1,a=0;n!==i;++n)a+=r,e[n].toArray(s,a)}return s}function ee(e,i){if(e.length!==i.length)return!1;for(let r=0,n=e.length;r<n;r++)if(e[r]!==i[r])return!1;return!0}function et(e,i){for(let r=0,n=i.length;r<n;r++)e[r]=i[r]}function ei(e,i){let r=K[i];void 0===r&&(r=new Int32Array(i),K[i]=r);for(let n=0;n!==i;++n)r[n]=e.allocateTextureUnit();return r}function er(e,i){let r=this.cache;r[0]!==i&&(e.uniform1f(this.addr,i),r[0]=i)}function en(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y)&&(e.uniform2f(this.addr,i.x,i.y),r[0]=i.x,r[1]=i.y);else{if(ee(r,i))return;e.uniform2fv(this.addr,i),et(r,i)}}function ea(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y||r[2]!==i.z)&&(e.uniform3f(this.addr,i.x,i.y,i.z),r[0]=i.x,r[1]=i.y,r[2]=i.z);else if(void 0!==i.r)(r[0]!==i.r||r[1]!==i.g||r[2]!==i.b)&&(e.uniform3f(this.addr,i.r,i.g,i.b),r[0]=i.r,r[1]=i.g,r[2]=i.b);else{if(ee(r,i))return;e.uniform3fv(this.addr,i),et(r,i)}}function es(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y||r[2]!==i.z||r[3]!==i.w)&&(e.uniform4f(this.addr,i.x,i.y,i.z,i.w),r[0]=i.x,r[1]=i.y,r[2]=i.z,r[3]=i.w);else{if(ee(r,i))return;e.uniform4fv(this.addr,i),et(r,i)}}function eo(e,i){let r=this.cache,n=i.elements;if(void 0===n){if(ee(r,i))return;e.uniformMatrix2fv(this.addr,!1,i),et(r,i)}else{if(ee(r,n))return;Q.set(n),e.uniformMatrix2fv(this.addr,!1,Q),et(r,n)}}function el(e,i){let r=this.cache,n=i.elements;if(void 0===n){if(ee(r,i))return;e.uniformMatrix3fv(this.addr,!1,i),et(r,i)}else{if(ee(r,n))return;Z.set(n),e.uniformMatrix3fv(this.addr,!1,Z),et(r,n)}}function ec(e,i){let r=this.cache,n=i.elements;if(void 0===n){if(ee(r,i))return;e.uniformMatrix4fv(this.addr,!1,i),et(r,i)}else{if(ee(r,n))return;J.set(n),e.uniformMatrix4fv(this.addr,!1,J),et(r,n)}}function eh(e,i){let r=this.cache;r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i)}function eu(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y)&&(e.uniform2i(this.addr,i.x,i.y),r[0]=i.x,r[1]=i.y);else{if(ee(r,i))return;e.uniform2iv(this.addr,i),et(r,i)}}function ed(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y||r[2]!==i.z)&&(e.uniform3i(this.addr,i.x,i.y,i.z),r[0]=i.x,r[1]=i.y,r[2]=i.z);else{if(ee(r,i))return;e.uniform3iv(this.addr,i),et(r,i)}}function ep(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y||r[2]!==i.z||r[3]!==i.w)&&(e.uniform4i(this.addr,i.x,i.y,i.z,i.w),r[0]=i.x,r[1]=i.y,r[2]=i.z,r[3]=i.w);else{if(ee(r,i))return;e.uniform4iv(this.addr,i),et(r,i)}}function ef(e,i){let r=this.cache;r[0]!==i&&(e.uniform1ui(this.addr,i),r[0]=i)}function em(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y)&&(e.uniform2ui(this.addr,i.x,i.y),r[0]=i.x,r[1]=i.y);else{if(ee(r,i))return;e.uniform2uiv(this.addr,i),et(r,i)}}function eg(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y||r[2]!==i.z)&&(e.uniform3ui(this.addr,i.x,i.y,i.z),r[0]=i.x,r[1]=i.y,r[2]=i.z);else{if(ee(r,i))return;e.uniform3uiv(this.addr,i),et(r,i)}}function ev(e,i){let r=this.cache;if(void 0!==i.x)(r[0]!==i.x||r[1]!==i.y||r[2]!==i.z||r[3]!==i.w)&&(e.uniform4ui(this.addr,i.x,i.y,i.z,i.w),r[0]=i.x,r[1]=i.y,r[2]=i.z,r[3]=i.w);else{if(ee(r,i))return;e.uniform4uiv(this.addr,i),et(r,i)}}function e_(e,i,r){let a,s=this.cache,o=r.allocateTextureUnit();s[0]!==o&&(e.uniform1i(this.addr,o),s[0]=o),this.type===e.SAMPLER_2D_SHADOW?(W.compareFunction=n.TiK,a=W):a=G,r.setTexture2D(i||a,o)}function ey(e,i,r){let n=this.cache,a=r.allocateTextureUnit();n[0]!==a&&(e.uniform1i(this.addr,a),n[0]=a),r.setTexture3D(i||j,a)}function ex(e,i,r){let n=this.cache,a=r.allocateTextureUnit();n[0]!==a&&(e.uniform1i(this.addr,a),n[0]=a),r.setTextureCube(i||q,a)}function eM(e,i,r){let n=this.cache,a=r.allocateTextureUnit();n[0]!==a&&(e.uniform1i(this.addr,a),n[0]=a),r.setTexture2DArray(i||X,a)}function eb(e,i){e.uniform1fv(this.addr,i)}function eS(e,i){let r=$(i,this.size,2);e.uniform2fv(this.addr,r)}function eE(e,i){let r=$(i,this.size,3);e.uniform3fv(this.addr,r)}function eT(e,i){let r=$(i,this.size,4);e.uniform4fv(this.addr,r)}function ew(e,i){let r=$(i,this.size,4);e.uniformMatrix2fv(this.addr,!1,r)}function eA(e,i){let r=$(i,this.size,9);e.uniformMatrix3fv(this.addr,!1,r)}function eR(e,i){let r=$(i,this.size,16);e.uniformMatrix4fv(this.addr,!1,r)}function eC(e,i){e.uniform1iv(this.addr,i)}function eP(e,i){e.uniform2iv(this.addr,i)}function eI(e,i){e.uniform3iv(this.addr,i)}function eL(e,i){e.uniform4iv(this.addr,i)}function eD(e,i){e.uniform1uiv(this.addr,i)}function eU(e,i){e.uniform2uiv(this.addr,i)}function eN(e,i){e.uniform3uiv(this.addr,i)}function eO(e,i){e.uniform4uiv(this.addr,i)}function eF(e,i,r){let n=this.cache,a=i.length,s=ei(r,a);ee(n,s)||(e.uniform1iv(this.addr,s),et(n,s));for(let e=0;e!==a;++e)r.setTexture2D(i[e]||G,s[e])}function eB(e,i,r){let n=this.cache,a=i.length,s=ei(r,a);ee(n,s)||(e.uniform1iv(this.addr,s),et(n,s));for(let e=0;e!==a;++e)r.setTexture3D(i[e]||j,s[e])}function ez(e,i,r){let n=this.cache,a=i.length,s=ei(r,a);ee(n,s)||(e.uniform1iv(this.addr,s),et(n,s));for(let e=0;e!==a;++e)r.setTextureCube(i[e]||q,s[e])}function ek(e,i,r){let n=this.cache,a=i.length,s=ei(r,a);ee(n,s)||(e.uniform1iv(this.addr,s),et(n,s));for(let e=0;e!==a;++e)r.setTexture2DArray(i[e]||X,s[e])}class eV{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=function(e){switch(e){case 5126:return er;case 35664:return en;case 35665:return ea;case 35666:return es;case 35674:return eo;case 35675:return el;case 35676:return ec;case 5124:case 35670:return eh;case 35667:case 35671:return eu;case 35668:case 35672:return ed;case 35669:case 35673:return ep;case 5125:return ef;case 36294:return em;case 36295:return eg;case 36296:return ev;case 35678:case 36198:case 36298:case 36306:case 35682:return e_;case 35679:case 36299:case 36307:return ey;case 35680:case 36300:case 36308:case 36293:return ex;case 36289:case 36303:case 36311:case 36292:return eM}}(i.type)}}class eH{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=function(e){switch(e){case 5126:return eb;case 35664:return eS;case 35665:return eE;case 35666:return eT;case 35674:return ew;case 35675:return eA;case 35676:return eR;case 5124:case 35670:return eC;case 35667:case 35671:return eP;case 35668:case 35672:return eI;case 35669:case 35673:return eL;case 5125:return eD;case 36294:return eU;case 36295:return eN;case 36296:return eO;case 35678:case 36198:case 36298:case 36306:case 35682:return eF;case 35679:case 36299:case 36307:return eB;case 35680:case 36300:case 36308:case 36293:return ez;case 36289:case 36303:case 36311:case 36292:return ek}}(i.type)}}class eG{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){let n=this.seq;for(let a=0,s=n.length;a!==s;++a){let s=n[a];s.setValue(e,i[s.id],r)}}}let eW=/(\w+)(\])?(\[|\.)?/g;function eX(e,i){e.seq.push(i),e.map[i.id]=i}class ej{constructor(e,i){this.seq=[],this.map={};let r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let n=0;n<r;++n){let r=e.getActiveUniform(i,n),a=e.getUniformLocation(i,r.name);!function(e,i,r){let n=e.name,a=n.length;for(eW.lastIndex=0;;){let s=eW.exec(n),o=eW.lastIndex,l=s[1],c="]"===s[2],h=s[3];if(c&&(l|=0),void 0===h||"["===h&&o+2===a){eX(r,void 0===h?new eV(l,e,i):new eH(l,e,i));break}{let e=r.map[l];void 0===e&&eX(r,e=new eG(l)),r=e}}}(r,a,this)}}setValue(e,i,r,n){let a=this.map[i];void 0!==a&&a.setValue(e,r,n)}setOptional(e,i,r){let n=i[r];void 0!==n&&this.setValue(e,r,n)}static upload(e,i,r,n){for(let a=0,s=i.length;a!==s;++a){let s=i[a],o=r[s.id];!1!==o.needsUpdate&&s.setValue(e,o.value,n)}}static seqWithValue(e,i){let r=[];for(let n=0,a=e.length;n!==a;++n){let a=e[n];a.id in i&&r.push(a)}return r}}function eq(e,i,r){let n=e.createShader(i);return e.shaderSource(n,r),e.compileShader(n),n}let eY=0,eK=new n.dwI;function eJ(e,i,r){let n=e.getShaderParameter(i,e.COMPILE_STATUS),a=(e.getShaderInfoLog(i)||"").trim();if(n&&""===a)return"";let s=/ERROR: 0:(\d+)/.exec(a);if(!s)return a;{let n=parseInt(s[1]);return r.toUpperCase()+`

`+a+`

`+function(e,i){let r=e.split(`
`),n=[],a=Math.max(i-6,0),s=Math.min(i+6,r.length);for(let e=a;e<s;e++){let a=e+1;n.push(`${a===i?">":" "} ${a}: ${r[e]}`)}return n.join(`
`)}(e.getShaderSource(i),n)}}let eZ=new n.Pq0;function eQ(e){return""!==e}function e$(e,i){let r=i.numSpotLightShadows+i.numSpotLightMaps-i.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,i.numDirLights).replace(/NUM_SPOT_LIGHTS/g,i.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,i.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,r).replace(/NUM_RECT_AREA_LIGHTS/g,i.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,i.numPointLights).replace(/NUM_HEMI_LIGHTS/g,i.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,i.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,i.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,i.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,i.numPointLightShadows)}function e0(e,i){return e.replace(/NUM_CLIPPING_PLANES/g,i.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,i.numClippingPlanes-i.numClipIntersection)}let e1=/^[ \t]*#include +<([\w\d./]+)>/gm;function e2(e){return e.replace(e1,e4)}let e3=new Map;function e4(e,i){let r=o[i];if(void 0===r){let e=e3.get(i);if(void 0!==e)r=o[e],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',i,e);else throw Error("Can not resolve #include <"+i+">")}return e2(r)}let e5=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function e6(e){return e.replace(e5,e9)}function e9(e,i,r,n){let a="";for(let e=parseInt(i);e<parseInt(r);e++)a+=n.replace(/\[\s*i\s*\]/g,"[ "+e+" ]").replace(/UNROLLED_LOOP_INDEX/g,e);return a}function e8(e){let i=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return"highp"===e.precision?i+=`
#define HIGH_PRECISION`:"mediump"===e.precision?i+=`
#define MEDIUM_PRECISION`:"lowp"===e.precision&&(i+=`
#define LOW_PRECISION`),i}function e7(e,i,r,a){let s,l,c,h,u,d,p=e.getContext(),f=r.defines,m=r.vertexShader,g=r.fragmentShader,v=(u="SHADOWMAP_TYPE_BASIC",r.shadowMapType===n.QP0?u="SHADOWMAP_TYPE_PCF":r.shadowMapType===n.Wk7?u="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===n.RyA&&(u="SHADOWMAP_TYPE_VSM"),u),_=function(e){let i="ENVMAP_TYPE_CUBE";if(e.envMap)switch(e.envMapMode){case n.hy7:case n.xFO:i="ENVMAP_TYPE_CUBE";break;case n.Om:i="ENVMAP_TYPE_CUBE_UV"}return i}(r),y=(d="ENVMAP_MODE_REFLECTION",r.envMap&&r.envMapMode===n.xFO&&(d="ENVMAP_MODE_REFRACTION"),d),x=function(e){let i="ENVMAP_BLENDING_NONE";if(e.envMap)switch(e.combine){case n.caT:i="ENVMAP_BLENDING_MULTIPLY";break;case n.KRh:i="ENVMAP_BLENDING_MIX";break;case n.XrR:i="ENVMAP_BLENDING_ADD"}return i}(r),M=function(e){let i=e.envMapCubeUVHeight;if(null===i)return null;let r=Math.log2(i)-2;return{texelWidth:1/(3*Math.max(Math.pow(2,r),112)),texelHeight:1/i,maxMip:r}}(r),b=[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(eQ).join(`
`),S=function(e){let i=[];for(let r in e){let n=e[r];!1!==n&&i.push("#define "+r+" "+n)}return i.join(`
`)}(f),E=p.createProgram(),T=r.glslVersion?"#version "+r.glslVersion+`
`:"";r.isRawShaderMaterial?((s=["#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,S].filter(eQ).join(`
`)).length>0&&(s+=`
`),(l=["#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,S].filter(eQ).join(`
`)).length>0&&(l+=`
`)):(s=[e8(r),"#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,S,r.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",r.batching?"#define USE_BATCHING":"",r.batchingColor?"#define USE_BATCHING_COLOR":"",r.instancing?"#define USE_INSTANCING":"",r.instancingColor?"#define USE_INSTANCING_COLOR":"",r.instancingMorph?"#define USE_INSTANCING_MORPH":"",r.useFog&&r.fog?"#define USE_FOG":"",r.useFog&&r.fogExp2?"#define FOG_EXP2":"",r.map?"#define USE_MAP":"",r.envMap?"#define USE_ENVMAP":"",r.envMap?"#define "+y:"",r.lightMap?"#define USE_LIGHTMAP":"",r.aoMap?"#define USE_AOMAP":"",r.bumpMap?"#define USE_BUMPMAP":"",r.normalMap?"#define USE_NORMALMAP":"",r.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",r.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",r.displacementMap?"#define USE_DISPLACEMENTMAP":"",r.emissiveMap?"#define USE_EMISSIVEMAP":"",r.anisotropy?"#define USE_ANISOTROPY":"",r.anisotropyMap?"#define USE_ANISOTROPYMAP":"",r.clearcoatMap?"#define USE_CLEARCOATMAP":"",r.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",r.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",r.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",r.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",r.specularMap?"#define USE_SPECULARMAP":"",r.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",r.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",r.roughnessMap?"#define USE_ROUGHNESSMAP":"",r.metalnessMap?"#define USE_METALNESSMAP":"",r.alphaMap?"#define USE_ALPHAMAP":"",r.alphaHash?"#define USE_ALPHAHASH":"",r.transmission?"#define USE_TRANSMISSION":"",r.transmissionMap?"#define USE_TRANSMISSIONMAP":"",r.thicknessMap?"#define USE_THICKNESSMAP":"",r.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",r.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",r.mapUv?"#define MAP_UV "+r.mapUv:"",r.alphaMapUv?"#define ALPHAMAP_UV "+r.alphaMapUv:"",r.lightMapUv?"#define LIGHTMAP_UV "+r.lightMapUv:"",r.aoMapUv?"#define AOMAP_UV "+r.aoMapUv:"",r.emissiveMapUv?"#define EMISSIVEMAP_UV "+r.emissiveMapUv:"",r.bumpMapUv?"#define BUMPMAP_UV "+r.bumpMapUv:"",r.normalMapUv?"#define NORMALMAP_UV "+r.normalMapUv:"",r.displacementMapUv?"#define DISPLACEMENTMAP_UV "+r.displacementMapUv:"",r.metalnessMapUv?"#define METALNESSMAP_UV "+r.metalnessMapUv:"",r.roughnessMapUv?"#define ROUGHNESSMAP_UV "+r.roughnessMapUv:"",r.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+r.anisotropyMapUv:"",r.clearcoatMapUv?"#define CLEARCOATMAP_UV "+r.clearcoatMapUv:"",r.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+r.clearcoatNormalMapUv:"",r.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+r.clearcoatRoughnessMapUv:"",r.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+r.iridescenceMapUv:"",r.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+r.iridescenceThicknessMapUv:"",r.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+r.sheenColorMapUv:"",r.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+r.sheenRoughnessMapUv:"",r.specularMapUv?"#define SPECULARMAP_UV "+r.specularMapUv:"",r.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+r.specularColorMapUv:"",r.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+r.specularIntensityMapUv:"",r.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+r.transmissionMapUv:"",r.thicknessMapUv?"#define THICKNESSMAP_UV "+r.thicknessMapUv:"",r.vertexTangents&&!1===r.flatShading?"#define USE_TANGENT":"",r.vertexColors?"#define USE_COLOR":"",r.vertexAlphas?"#define USE_COLOR_ALPHA":"",r.vertexUv1s?"#define USE_UV1":"",r.vertexUv2s?"#define USE_UV2":"",r.vertexUv3s?"#define USE_UV3":"",r.pointsUvs?"#define USE_POINTS_UV":"",r.flatShading?"#define FLAT_SHADED":"",r.skinning?"#define USE_SKINNING":"",r.morphTargets?"#define USE_MORPHTARGETS":"",r.morphNormals&&!1===r.flatShading?"#define USE_MORPHNORMALS":"",r.morphColors?"#define USE_MORPHCOLORS":"",r.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+r.morphTextureStride:"",r.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+r.morphTargetsCount:"",r.doubleSided?"#define DOUBLE_SIDED":"",r.flipSided?"#define FLIP_SIDED":"",r.shadowMapEnabled?"#define USE_SHADOWMAP":"",r.shadowMapEnabled?"#define "+v:"",r.sizeAttenuation?"#define USE_SIZEATTENUATION":"",r.numLightProbes>0?"#define USE_LIGHT_PROBES":"",r.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",r.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(eQ).join(`
`),l=[e8(r),"#define SHADER_TYPE "+r.shaderType,"#define SHADER_NAME "+r.shaderName,S,r.useFog&&r.fog?"#define USE_FOG":"",r.useFog&&r.fogExp2?"#define FOG_EXP2":"",r.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",r.map?"#define USE_MAP":"",r.matcap?"#define USE_MATCAP":"",r.envMap?"#define USE_ENVMAP":"",r.envMap?"#define "+_:"",r.envMap?"#define "+y:"",r.envMap?"#define "+x:"",M?"#define CUBEUV_TEXEL_WIDTH "+M.texelWidth:"",M?"#define CUBEUV_TEXEL_HEIGHT "+M.texelHeight:"",M?"#define CUBEUV_MAX_MIP "+M.maxMip+".0":"",r.lightMap?"#define USE_LIGHTMAP":"",r.aoMap?"#define USE_AOMAP":"",r.bumpMap?"#define USE_BUMPMAP":"",r.normalMap?"#define USE_NORMALMAP":"",r.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",r.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",r.emissiveMap?"#define USE_EMISSIVEMAP":"",r.anisotropy?"#define USE_ANISOTROPY":"",r.anisotropyMap?"#define USE_ANISOTROPYMAP":"",r.clearcoat?"#define USE_CLEARCOAT":"",r.clearcoatMap?"#define USE_CLEARCOATMAP":"",r.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",r.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",r.dispersion?"#define USE_DISPERSION":"",r.iridescence?"#define USE_IRIDESCENCE":"",r.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",r.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",r.specularMap?"#define USE_SPECULARMAP":"",r.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",r.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",r.roughnessMap?"#define USE_ROUGHNESSMAP":"",r.metalnessMap?"#define USE_METALNESSMAP":"",r.alphaMap?"#define USE_ALPHAMAP":"",r.alphaTest?"#define USE_ALPHATEST":"",r.alphaHash?"#define USE_ALPHAHASH":"",r.sheen?"#define USE_SHEEN":"",r.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",r.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",r.transmission?"#define USE_TRANSMISSION":"",r.transmissionMap?"#define USE_TRANSMISSIONMAP":"",r.thicknessMap?"#define USE_THICKNESSMAP":"",r.vertexTangents&&!1===r.flatShading?"#define USE_TANGENT":"",r.vertexColors||r.instancingColor||r.batchingColor?"#define USE_COLOR":"",r.vertexAlphas?"#define USE_COLOR_ALPHA":"",r.vertexUv1s?"#define USE_UV1":"",r.vertexUv2s?"#define USE_UV2":"",r.vertexUv3s?"#define USE_UV3":"",r.pointsUvs?"#define USE_POINTS_UV":"",r.gradientMap?"#define USE_GRADIENTMAP":"",r.flatShading?"#define FLAT_SHADED":"",r.doubleSided?"#define DOUBLE_SIDED":"",r.flipSided?"#define FLIP_SIDED":"",r.shadowMapEnabled?"#define USE_SHADOWMAP":"",r.shadowMapEnabled?"#define "+v:"",r.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",r.numLightProbes>0?"#define USE_LIGHT_PROBES":"",r.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",r.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",r.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",r.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",r.toneMapping!==n.y_p?"#define TONE_MAPPING":"",r.toneMapping!==n.y_p?o.tonemapping_pars_fragment:"",r.toneMapping!==n.y_p?function(e,i){let r;switch(i){case n.kyO:r="Linear";break;case n.Mjd:r="Reinhard";break;case n.nNL:r="Cineon";break;case n.FV:r="ACESFilmic";break;case n.LAk:r="AgX";break;case n.aJ8:r="Neutral";break;case n.g7M:r="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",i),r="Linear"}return"vec3 "+e+"( vec3 color ) { return "+r+"ToneMapping( color ); }"}("toneMapping",r.toneMapping):"",r.dithering?"#define DITHERING":"",r.opaque?"#define OPAQUE":"",o.colorspace_pars_fragment,function(e,i){let r=function(e){n.ppV._getMatrix(eK,n.ppV.workingColorSpace,e);let i=`mat3( ${eK.elements.map(e=>e.toFixed(4))} )`;switch(n.ppV.getTransfer(e)){case n.VxR:return[i,"LinearTransferOETF"];case n.KLL:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",e),[i,"LinearTransferOETF"]}}(i);return`vec4 ${e}( vec4 value ) {
	return ${r[1]}( vec4( value.rgb * ${r[0]}, value.a ) );
}`}("linearToOutputTexel",r.outputColorSpace),function(){n.ppV.getLuminanceCoefficients(eZ);let e=eZ.x.toFixed(4),i=eZ.y.toFixed(4),r=eZ.z.toFixed(4);return`float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( ${e}, ${i}, ${r} );
	return dot( weights, rgb );
}`}(),r.useDepthPacking?"#define DEPTH_PACKING "+r.depthPacking:"",`
`].filter(eQ).join(`
`)),m=e0(m=e$(m=e2(m),r),r),g=e0(g=e$(g=e2(g),r),r),m=e6(m),g=e6(g),!0!==r.isRawShaderMaterial&&(T=`#version 300 es
`,s=[b,`#define attribute in
#define varying out
#define texture2D texture`].join(`
`)+`
`+s,l=["#define varying in",r.glslVersion===n.Wdf?"":"layout(location = 0) out highp vec4 pc_fragColor;",r.glslVersion===n.Wdf?"":"#define gl_FragColor pc_fragColor",`#define gl_FragDepthEXT gl_FragDepth
#define texture2D texture
#define textureCube texture
#define texture2DProj textureProj
#define texture2DLodEXT textureLod
#define texture2DProjLodEXT textureProjLod
#define textureCubeLodEXT textureLod
#define texture2DGradEXT textureGrad
#define texture2DProjGradEXT textureProjGrad
#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+l);let w=T+s+m,A=T+l+g,R=eq(p,p.VERTEX_SHADER,w),C=eq(p,p.FRAGMENT_SHADER,A);function P(i){if(e.debug.checkShaderErrors){let r=p.getProgramInfoLog(E)||"",n=p.getShaderInfoLog(R)||"",a=p.getShaderInfoLog(C)||"",o=r.trim(),c=n.trim(),h=a.trim(),u=!0,d=!0;if(!1===p.getProgramParameter(E,p.LINK_STATUS))if(u=!1,"function"==typeof e.debug.onShaderError)e.debug.onShaderError(p,E,R,C);else{let e=eJ(p,R,"vertex"),r=eJ(p,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+p.getError()+" - VALIDATE_STATUS "+p.getProgramParameter(E,p.VALIDATE_STATUS)+`

Material Name: `+i.name+`
Material Type: `+i.type+`

Program Info Log: `+o+`
`+e+`
`+r)}else""!==o?console.warn("THREE.WebGLProgram: Program Info Log:",o):(""===c||""===h)&&(d=!1);d&&(i.diagnostics={runnable:u,programLog:o,vertexShader:{log:c,prefix:s},fragmentShader:{log:h,prefix:l}})}p.deleteShader(R),p.deleteShader(C),c=new ej(p,E),h=function(e,i){let r={},n=e.getProgramParameter(i,e.ACTIVE_ATTRIBUTES);for(let a=0;a<n;a++){let n=e.getActiveAttrib(i,a),s=n.name,o=1;n.type===e.FLOAT_MAT2&&(o=2),n.type===e.FLOAT_MAT3&&(o=3),n.type===e.FLOAT_MAT4&&(o=4),r[s]={type:n.type,location:e.getAttribLocation(i,s),locationSize:o}}return r}(p,E)}p.attachShader(E,R),p.attachShader(E,C),void 0!==r.index0AttributeName?p.bindAttribLocation(E,0,r.index0AttributeName):!0===r.morphTargets&&p.bindAttribLocation(E,0,"position"),p.linkProgram(E),this.getUniforms=function(){return void 0===c&&P(this),c},this.getAttributes=function(){return void 0===h&&P(this),h};let I=!1===r.rendererExtensionParallelShaderCompile;return this.isReady=function(){return!1===I&&(I=p.getProgramParameter(E,37297)),I},this.destroy=function(){a.releaseStatesOfProgram(this),p.deleteProgram(E),this.program=void 0},this.type=r.shaderType,this.name=r.shaderName,this.id=eY++,this.cacheKey=i,this.usedTimes=1,this.program=E,this.vertexShader=R,this.fragmentShader=C,this}let te=0;class tt{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let i=e.vertexShader,r=e.fragmentShader,n=this._getShaderStage(i),a=this._getShaderStage(r),s=this._getShaderCacheForMaterial(e);return!1===s.has(n)&&(s.add(n),n.usedTimes++),!1===s.has(a)&&(s.add(a),a.usedTimes++),this}remove(e){for(let i of this.materialCache.get(e))i.usedTimes--,0===i.usedTimes&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let i=this.materialCache,r=i.get(e);return void 0===r&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){let i=this.shaderCache,r=i.get(e);return void 0===r&&(r=new ti(e),i.set(e,r)),r}}class ti{constructor(e){this.id=te++,this.code=e,this.usedTimes=0}}function tr(e,i,r,a,s,o,l){let h=new n.zgK,u=new tt,d=new Set,p=[],f=s.logarithmicDepthBuffer,m=s.vertexTextures,g=s.precision,v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(e){return(d.add(e),0===e)?"uv":`uv${e}`}return{getParameters:function(o,h,p,y,x){let M,b,S,E,T=y.fog,w=x.geometry,A=o.isMeshStandardMaterial?y.environment:null,R=(o.isMeshStandardMaterial?r:i).get(o.envMap||A),C=R&&R.mapping===n.Om?R.image.height:null,P=v[o.type];null!==o.precision&&(g=s.getMaxPrecision(o.precision))!==o.precision&&console.warn("THREE.WebGLProgram.getParameters:",o.precision,"not supported, using",g,"instead.");let I=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,L=void 0!==I?I.length:0,D=0;if(void 0!==w.morphAttributes.position&&(D=1),void 0!==w.morphAttributes.normal&&(D=2),void 0!==w.morphAttributes.color&&(D=3),P){let e=c[P];M=e.vertexShader,b=e.fragmentShader}else M=o.vertexShader,b=o.fragmentShader,u.update(o),S=u.getVertexShaderID(o),E=u.getFragmentShaderID(o);let U=e.getRenderTarget(),N=e.state.buffers.depth.getReversed(),O=!0===x.isInstancedMesh,F=!0===x.isBatchedMesh,B=!!o.map,z=!!o.matcap,k=!!R,V=!!o.aoMap,H=!!o.lightMap,G=!!o.bumpMap,W=!!o.normalMap,X=!!o.displacementMap,j=!!o.emissiveMap,q=!!o.metalnessMap,Y=!!o.roughnessMap,K=o.anisotropy>0,J=o.clearcoat>0,Z=o.dispersion>0,Q=o.iridescence>0,$=o.sheen>0,ee=o.transmission>0,et=K&&!!o.anisotropyMap,ei=J&&!!o.clearcoatMap,er=J&&!!o.clearcoatNormalMap,en=J&&!!o.clearcoatRoughnessMap,ea=Q&&!!o.iridescenceMap,es=Q&&!!o.iridescenceThicknessMap,eo=$&&!!o.sheenColorMap,el=$&&!!o.sheenRoughnessMap,ec=!!o.specularMap,eh=!!o.specularColorMap,eu=!!o.specularIntensityMap,ed=ee&&!!o.transmissionMap,ep=ee&&!!o.thicknessMap,ef=!!o.gradientMap,em=!!o.alphaMap,eg=o.alphaTest>0,ev=!!o.alphaHash,e_=!!o.extensions,ey=n.y_p;o.toneMapped&&(null===U||!0===U.isXRRenderTarget)&&(ey=e.toneMapping);let ex={shaderID:P,shaderType:o.type,shaderName:o.name,vertexShader:M,fragmentShader:b,defines:o.defines,customVertexShaderID:S,customFragmentShaderID:E,isRawShaderMaterial:!0===o.isRawShaderMaterial,glslVersion:o.glslVersion,precision:g,batching:F,batchingColor:F&&null!==x._colorsTexture,instancing:O,instancingColor:O&&null!==x.instanceColor,instancingMorph:O&&null!==x.morphTexture,supportsVertexTextures:m,outputColorSpace:null===U?e.outputColorSpace:!0===U.isXRRenderTarget?U.texture.colorSpace:n.Zr2,alphaToCoverage:!!o.alphaToCoverage,map:B,matcap:z,envMap:k,envMapMode:k&&R.mapping,envMapCubeUVHeight:C,aoMap:V,lightMap:H,bumpMap:G,normalMap:W,displacementMap:m&&X,emissiveMap:j,normalMapObjectSpace:W&&o.normalMapType===n.vyJ,normalMapTangentSpace:W&&o.normalMapType===n.bI3,metalnessMap:q,roughnessMap:Y,anisotropy:K,anisotropyMap:et,clearcoat:J,clearcoatMap:ei,clearcoatNormalMap:er,clearcoatRoughnessMap:en,dispersion:Z,iridescence:Q,iridescenceMap:ea,iridescenceThicknessMap:es,sheen:$,sheenColorMap:eo,sheenRoughnessMap:el,specularMap:ec,specularColorMap:eh,specularIntensityMap:eu,transmission:ee,transmissionMap:ed,thicknessMap:ep,gradientMap:ef,opaque:!1===o.transparent&&o.blending===n.NTi&&!1===o.alphaToCoverage,alphaMap:em,alphaTest:eg,alphaHash:ev,combine:o.combine,mapUv:B&&_(o.map.channel),aoMapUv:V&&_(o.aoMap.channel),lightMapUv:H&&_(o.lightMap.channel),bumpMapUv:G&&_(o.bumpMap.channel),normalMapUv:W&&_(o.normalMap.channel),displacementMapUv:X&&_(o.displacementMap.channel),emissiveMapUv:j&&_(o.emissiveMap.channel),metalnessMapUv:q&&_(o.metalnessMap.channel),roughnessMapUv:Y&&_(o.roughnessMap.channel),anisotropyMapUv:et&&_(o.anisotropyMap.channel),clearcoatMapUv:ei&&_(o.clearcoatMap.channel),clearcoatNormalMapUv:er&&_(o.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:en&&_(o.clearcoatRoughnessMap.channel),iridescenceMapUv:ea&&_(o.iridescenceMap.channel),iridescenceThicknessMapUv:es&&_(o.iridescenceThicknessMap.channel),sheenColorMapUv:eo&&_(o.sheenColorMap.channel),sheenRoughnessMapUv:el&&_(o.sheenRoughnessMap.channel),specularMapUv:ec&&_(o.specularMap.channel),specularColorMapUv:eh&&_(o.specularColorMap.channel),specularIntensityMapUv:eu&&_(o.specularIntensityMap.channel),transmissionMapUv:ed&&_(o.transmissionMap.channel),thicknessMapUv:ep&&_(o.thicknessMap.channel),alphaMapUv:em&&_(o.alphaMap.channel),vertexTangents:!!w.attributes.tangent&&(W||K),vertexColors:o.vertexColors,vertexAlphas:!0===o.vertexColors&&!!w.attributes.color&&4===w.attributes.color.itemSize,pointsUvs:!0===x.isPoints&&!!w.attributes.uv&&(B||em),fog:!!T,useFog:!0===o.fog,fogExp2:!!T&&T.isFogExp2,flatShading:!0===o.flatShading&&!1===o.wireframe,sizeAttenuation:!0===o.sizeAttenuation,logarithmicDepthBuffer:f,reversedDepthBuffer:N,skinning:!0===x.isSkinnedMesh,morphTargets:void 0!==w.morphAttributes.position,morphNormals:void 0!==w.morphAttributes.normal,morphColors:void 0!==w.morphAttributes.color,morphTargetsCount:L,morphTextureStride:D,numDirLights:h.directional.length,numPointLights:h.point.length,numSpotLights:h.spot.length,numSpotLightMaps:h.spotLightMap.length,numRectAreaLights:h.rectArea.length,numHemiLights:h.hemi.length,numDirLightShadows:h.directionalShadowMap.length,numPointLightShadows:h.pointShadowMap.length,numSpotLightShadows:h.spotShadowMap.length,numSpotLightShadowsWithMaps:h.numSpotLightShadowsWithMaps,numLightProbes:h.numLightProbes,numClippingPlanes:l.numPlanes,numClipIntersection:l.numIntersection,dithering:o.dithering,shadowMapEnabled:e.shadowMap.enabled&&p.length>0,shadowMapType:e.shadowMap.type,toneMapping:ey,decodeVideoTexture:B&&!0===o.map.isVideoTexture&&n.ppV.getTransfer(o.map.colorSpace)===n.KLL,decodeVideoTextureEmissive:j&&!0===o.emissiveMap.isVideoTexture&&n.ppV.getTransfer(o.emissiveMap.colorSpace)===n.KLL,premultipliedAlpha:o.premultipliedAlpha,doubleSided:o.side===n.$EB,flipSided:o.side===n.hsX,useDepthPacking:o.depthPacking>=0,depthPacking:o.depthPacking||0,index0AttributeName:o.index0AttributeName,extensionClipCullDistance:e_&&!0===o.extensions.clipCullDistance&&a.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(e_&&!0===o.extensions.multiDraw||F)&&a.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:a.has("KHR_parallel_shader_compile"),customProgramCacheKey:o.customProgramCacheKey()};return ex.vertexUv1s=d.has(1),ex.vertexUv2s=d.has(2),ex.vertexUv3s=d.has(3),d.clear(),ex},getProgramCacheKey:function(i){var r,n,a,s;let o=[];if(i.shaderID?o.push(i.shaderID):(o.push(i.customVertexShaderID),o.push(i.customFragmentShaderID)),void 0!==i.defines)for(let e in i.defines)o.push(e),o.push(i.defines[e]);return!1===i.isRawShaderMaterial&&(r=o,n=i,r.push(n.precision),r.push(n.outputColorSpace),r.push(n.envMapMode),r.push(n.envMapCubeUVHeight),r.push(n.mapUv),r.push(n.alphaMapUv),r.push(n.lightMapUv),r.push(n.aoMapUv),r.push(n.bumpMapUv),r.push(n.normalMapUv),r.push(n.displacementMapUv),r.push(n.emissiveMapUv),r.push(n.metalnessMapUv),r.push(n.roughnessMapUv),r.push(n.anisotropyMapUv),r.push(n.clearcoatMapUv),r.push(n.clearcoatNormalMapUv),r.push(n.clearcoatRoughnessMapUv),r.push(n.iridescenceMapUv),r.push(n.iridescenceThicknessMapUv),r.push(n.sheenColorMapUv),r.push(n.sheenRoughnessMapUv),r.push(n.specularMapUv),r.push(n.specularColorMapUv),r.push(n.specularIntensityMapUv),r.push(n.transmissionMapUv),r.push(n.thicknessMapUv),r.push(n.combine),r.push(n.fogExp2),r.push(n.sizeAttenuation),r.push(n.morphTargetsCount),r.push(n.morphAttributeCount),r.push(n.numDirLights),r.push(n.numPointLights),r.push(n.numSpotLights),r.push(n.numSpotLightMaps),r.push(n.numHemiLights),r.push(n.numRectAreaLights),r.push(n.numDirLightShadows),r.push(n.numPointLightShadows),r.push(n.numSpotLightShadows),r.push(n.numSpotLightShadowsWithMaps),r.push(n.numLightProbes),r.push(n.shadowMapType),r.push(n.toneMapping),r.push(n.numClippingPlanes),r.push(n.numClipIntersection),r.push(n.depthPacking),a=o,s=i,h.disableAll(),s.supportsVertexTextures&&h.enable(0),s.instancing&&h.enable(1),s.instancingColor&&h.enable(2),s.instancingMorph&&h.enable(3),s.matcap&&h.enable(4),s.envMap&&h.enable(5),s.normalMapObjectSpace&&h.enable(6),s.normalMapTangentSpace&&h.enable(7),s.clearcoat&&h.enable(8),s.iridescence&&h.enable(9),s.alphaTest&&h.enable(10),s.vertexColors&&h.enable(11),s.vertexAlphas&&h.enable(12),s.vertexUv1s&&h.enable(13),s.vertexUv2s&&h.enable(14),s.vertexUv3s&&h.enable(15),s.vertexTangents&&h.enable(16),s.anisotropy&&h.enable(17),s.alphaHash&&h.enable(18),s.batching&&h.enable(19),s.dispersion&&h.enable(20),s.batchingColor&&h.enable(21),s.gradientMap&&h.enable(22),a.push(h.mask),h.disableAll(),s.fog&&h.enable(0),s.useFog&&h.enable(1),s.flatShading&&h.enable(2),s.logarithmicDepthBuffer&&h.enable(3),s.reversedDepthBuffer&&h.enable(4),s.skinning&&h.enable(5),s.morphTargets&&h.enable(6),s.morphNormals&&h.enable(7),s.morphColors&&h.enable(8),s.premultipliedAlpha&&h.enable(9),s.shadowMapEnabled&&h.enable(10),s.doubleSided&&h.enable(11),s.flipSided&&h.enable(12),s.useDepthPacking&&h.enable(13),s.dithering&&h.enable(14),s.transmission&&h.enable(15),s.sheen&&h.enable(16),s.opaque&&h.enable(17),s.pointsUvs&&h.enable(18),s.decodeVideoTexture&&h.enable(19),s.decodeVideoTextureEmissive&&h.enable(20),s.alphaToCoverage&&h.enable(21),a.push(h.mask),o.push(e.outputColorSpace)),o.push(i.customProgramCacheKey),o.join()},getUniforms:function(e){let i,r=v[e.type];if(r){let e=c[r];i=n.LlO.clone(e.uniforms)}else i=e.uniforms;return i},acquireProgram:function(i,r){let n;for(let e=0,i=p.length;e<i;e++){let i=p[e];if(i.cacheKey===r){n=i,++n.usedTimes;break}}return void 0===n&&(n=new e7(e,r,i,o),p.push(n)),n},releaseProgram:function(e){if(0==--e.usedTimes){let i=p.indexOf(e);p[i]=p[p.length-1],p.pop(),e.destroy()}},releaseShaderCache:function(e){u.remove(e)},programs:p,dispose:function(){u.dispose()}}}function tn(){let e=new WeakMap;return{has:function(i){return e.has(i)},get:function(i){let r=e.get(i);return void 0===r&&(r={},e.set(i,r)),r},remove:function(i){e.delete(i)},update:function(i,r,n){e.get(i)[r]=n},dispose:function(){e=new WeakMap}}}function ta(e,i){return e.groupOrder!==i.groupOrder?e.groupOrder-i.groupOrder:e.renderOrder!==i.renderOrder?e.renderOrder-i.renderOrder:e.material.id!==i.material.id?e.material.id-i.material.id:e.z!==i.z?e.z-i.z:e.id-i.id}function ts(e,i){return e.groupOrder!==i.groupOrder?e.groupOrder-i.groupOrder:e.renderOrder!==i.renderOrder?e.renderOrder-i.renderOrder:e.z!==i.z?i.z-e.z:e.id-i.id}function to(){let e=[],i=0,r=[],n=[],a=[];function s(r,n,a,s,o,l){let c=e[i];return void 0===c?(c={id:r.id,object:r,geometry:n,material:a,groupOrder:s,renderOrder:r.renderOrder,z:o,group:l},e[i]=c):(c.id=r.id,c.object=r,c.geometry=n,c.material=a,c.groupOrder=s,c.renderOrder=r.renderOrder,c.z=o,c.group=l),i++,c}return{opaque:r,transmissive:n,transparent:a,init:function(){i=0,r.length=0,n.length=0,a.length=0},push:function(e,i,o,l,c,h){let u=s(e,i,o,l,c,h);o.transmission>0?n.push(u):!0===o.transparent?a.push(u):r.push(u)},unshift:function(e,i,o,l,c,h){let u=s(e,i,o,l,c,h);o.transmission>0?n.unshift(u):!0===o.transparent?a.unshift(u):r.unshift(u)},finish:function(){for(let r=i,n=e.length;r<n;r++){let i=e[r];if(null===i.id)break;i.id=null,i.object=null,i.geometry=null,i.material=null,i.group=null}},sort:function(e,i){r.length>1&&r.sort(e||ta),n.length>1&&n.sort(i||ts),a.length>1&&a.sort(i||ts)}}}function tl(){let e=new WeakMap;return{get:function(i,r){let n,a=e.get(i);return void 0===a?(n=new to,e.set(i,[n])):r>=a.length?(n=new to,a.push(n)):n=a[r],n},dispose:function(){e=new WeakMap}}}function tc(){let e={};return{get:function(i){let r;if(void 0!==e[i.id])return e[i.id];switch(i.type){case"DirectionalLight":r={direction:new n.Pq0,color:new n.Q1f};break;case"SpotLight":r={position:new n.Pq0,direction:new n.Pq0,color:new n.Q1f,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":r={position:new n.Pq0,color:new n.Q1f,distance:0,decay:0};break;case"HemisphereLight":r={direction:new n.Pq0,skyColor:new n.Q1f,groundColor:new n.Q1f};break;case"RectAreaLight":r={color:new n.Q1f,position:new n.Pq0,halfWidth:new n.Pq0,halfHeight:new n.Pq0}}return e[i.id]=r,r}}}let th=0;function tu(e,i){return 2*!!i.castShadow-2*!!e.castShadow+ +!!i.map-!!e.map}function td(e){let i=new tc,r=function(){let e={};return{get:function(i){let r;if(void 0!==e[i.id])return e[i.id];switch(i.type){case"DirectionalLight":case"SpotLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new n.I9Y};break;case"PointLight":r={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new n.I9Y,shadowCameraNear:1,shadowCameraFar:1e3}}return e[i.id]=r,r}}}(),a={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)a.probe.push(new n.Pq0);let s=new n.Pq0,o=new n.kn4,c=new n.kn4;return{setup:function(n){let s=0,o=0,c=0;for(let e=0;e<9;e++)a.probe[e].set(0,0,0);let h=0,u=0,d=0,p=0,f=0,m=0,g=0,v=0,_=0,y=0,x=0;n.sort(tu);for(let e=0,l=n.length;e<l;e++){let l=n[e],M=l.color,b=l.intensity,S=l.distance,E=l.shadow&&l.shadow.map?l.shadow.map.texture:null;if(l.isAmbientLight)s+=M.r*b,o+=M.g*b,c+=M.b*b;else if(l.isLightProbe){for(let e=0;e<9;e++)a.probe[e].addScaledVector(l.sh.coefficients[e],b);x++}else if(l.isDirectionalLight){let e=i.get(l);if(e.color.copy(l.color).multiplyScalar(l.intensity),l.castShadow){let e=l.shadow,i=r.get(l);i.shadowIntensity=e.intensity,i.shadowBias=e.bias,i.shadowNormalBias=e.normalBias,i.shadowRadius=e.radius,i.shadowMapSize=e.mapSize,a.directionalShadow[h]=i,a.directionalShadowMap[h]=E,a.directionalShadowMatrix[h]=l.shadow.matrix,m++}a.directional[h]=e,h++}else if(l.isSpotLight){let e=i.get(l);e.position.setFromMatrixPosition(l.matrixWorld),e.color.copy(M).multiplyScalar(b),e.distance=S,e.coneCos=Math.cos(l.angle),e.penumbraCos=Math.cos(l.angle*(1-l.penumbra)),e.decay=l.decay,a.spot[d]=e;let n=l.shadow;if(l.map&&(a.spotLightMap[_]=l.map,_++,n.updateMatrices(l),l.castShadow&&y++),a.spotLightMatrix[d]=n.matrix,l.castShadow){let e=r.get(l);e.shadowIntensity=n.intensity,e.shadowBias=n.bias,e.shadowNormalBias=n.normalBias,e.shadowRadius=n.radius,e.shadowMapSize=n.mapSize,a.spotShadow[d]=e,a.spotShadowMap[d]=E,v++}d++}else if(l.isRectAreaLight){let e=i.get(l);e.color.copy(M).multiplyScalar(b),e.halfWidth.set(.5*l.width,0,0),e.halfHeight.set(0,.5*l.height,0),a.rectArea[p]=e,p++}else if(l.isPointLight){let e=i.get(l);if(e.color.copy(l.color).multiplyScalar(l.intensity),e.distance=l.distance,e.decay=l.decay,l.castShadow){let e=l.shadow,i=r.get(l);i.shadowIntensity=e.intensity,i.shadowBias=e.bias,i.shadowNormalBias=e.normalBias,i.shadowRadius=e.radius,i.shadowMapSize=e.mapSize,i.shadowCameraNear=e.camera.near,i.shadowCameraFar=e.camera.far,a.pointShadow[u]=i,a.pointShadowMap[u]=E,a.pointShadowMatrix[u]=l.shadow.matrix,g++}a.point[u]=e,u++}else if(l.isHemisphereLight){let e=i.get(l);e.skyColor.copy(l.color).multiplyScalar(b),e.groundColor.copy(l.groundColor).multiplyScalar(b),a.hemi[f]=e,f++}}p>0&&(!0===e.has("OES_texture_float_linear")?(a.rectAreaLTC1=l.LTC_FLOAT_1,a.rectAreaLTC2=l.LTC_FLOAT_2):(a.rectAreaLTC1=l.LTC_HALF_1,a.rectAreaLTC2=l.LTC_HALF_2)),a.ambient[0]=s,a.ambient[1]=o,a.ambient[2]=c;let M=a.hash;(M.directionalLength!==h||M.pointLength!==u||M.spotLength!==d||M.rectAreaLength!==p||M.hemiLength!==f||M.numDirectionalShadows!==m||M.numPointShadows!==g||M.numSpotShadows!==v||M.numSpotMaps!==_||M.numLightProbes!==x)&&(a.directional.length=h,a.spot.length=d,a.rectArea.length=p,a.point.length=u,a.hemi.length=f,a.directionalShadow.length=m,a.directionalShadowMap.length=m,a.pointShadow.length=g,a.pointShadowMap.length=g,a.spotShadow.length=v,a.spotShadowMap.length=v,a.directionalShadowMatrix.length=m,a.pointShadowMatrix.length=g,a.spotLightMatrix.length=v+_-y,a.spotLightMap.length=_,a.numSpotLightShadowsWithMaps=y,a.numLightProbes=x,M.directionalLength=h,M.pointLength=u,M.spotLength=d,M.rectAreaLength=p,M.hemiLength=f,M.numDirectionalShadows=m,M.numPointShadows=g,M.numSpotShadows=v,M.numSpotMaps=_,M.numLightProbes=x,a.version=th++)},setupView:function(e,i){let r=0,n=0,l=0,h=0,u=0,d=i.matrixWorldInverse;for(let i=0,p=e.length;i<p;i++){let p=e[i];if(p.isDirectionalLight){let e=a.directional[r];e.direction.setFromMatrixPosition(p.matrixWorld),s.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(s),e.direction.transformDirection(d),r++}else if(p.isSpotLight){let e=a.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(p.matrixWorld),s.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(s),e.direction.transformDirection(d),l++}else if(p.isRectAreaLight){let e=a.rectArea[h];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(d),c.identity(),o.copy(p.matrixWorld),o.premultiply(d),c.extractRotation(o),e.halfWidth.set(.5*p.width,0,0),e.halfHeight.set(0,.5*p.height,0),e.halfWidth.applyMatrix4(c),e.halfHeight.applyMatrix4(c),h++}else if(p.isPointLight){let e=a.point[n];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(d),n++}else if(p.isHemisphereLight){let e=a.hemi[u];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(d),u++}}},state:a}}function tp(e){let i=new td(e),r=[],n=[],a={lightsArray:r,shadowsArray:n,camera:null,lights:i,transmissionRenderTarget:{}};return{init:function(e){a.camera=e,r.length=0,n.length=0},state:a,setupLights:function(){i.setup(r)},setupLightsView:function(e){i.setupView(r,e)},pushLight:function(e){r.push(e)},pushShadow:function(e){n.push(e)}}}function tf(e){let i=new WeakMap;return{get:function(r,n=0){let a,s=i.get(r);return void 0===s?(a=new tp(e),i.set(r,[a])):n>=s.length?(a=new tp(e),s.push(a)):a=s[n],a},dispose:function(){i=new WeakMap}}}let tm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function tv(e,i,r){let a=new n.PPD,s=new n.I9Y,o=new n.I9Y,l=new n.IUQ,c=new n.CSG({depthPacking:n.N5j}),h=new n.aVO,u={},d=r.maxTextureSize,p={[n.hB5]:n.hsX,[n.hsX]:n.hB5,[n.$EB]:n.$EB},f=new n.BKk({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new n.I9Y},radius:{value:4}},vertexShader:tm,fragmentShader:tg}),m=f.clone();m.defines.HORIZONTAL_PASS=1;let g=new n.LoY;g.setAttribute("position",new n.THS(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new n.eaF(g,f),_=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=n.QP0;let y=this.type;function x(i,r,a,s){let o=null,l=!0===a.isPointLight?i.customDistanceMaterial:i.customDepthMaterial;if(void 0!==l)o=l;else if(o=!0===a.isPointLight?h:c,e.localClippingEnabled&&!0===r.clipShadows&&Array.isArray(r.clippingPlanes)&&0!==r.clippingPlanes.length||r.displacementMap&&0!==r.displacementScale||r.alphaMap&&r.alphaTest>0||r.map&&r.alphaTest>0||!0===r.alphaToCoverage){let e=o.uuid,i=r.uuid,n=u[e];void 0===n&&(n={},u[e]=n);let a=n[i];void 0===a&&(a=o.clone(),n[i]=a,r.addEventListener("dispose",M)),o=a}return o.visible=r.visible,o.wireframe=r.wireframe,s===n.RyA?o.side=null!==r.shadowSide?r.shadowSide:r.side:o.side=null!==r.shadowSide?r.shadowSide:p[r.side],o.alphaMap=r.alphaMap,o.alphaTest=!0===r.alphaToCoverage?.5:r.alphaTest,o.map=r.map,o.clipShadows=r.clipShadows,o.clippingPlanes=r.clippingPlanes,o.clipIntersection=r.clipIntersection,o.displacementMap=r.displacementMap,o.displacementScale=r.displacementScale,o.displacementBias=r.displacementBias,o.wireframeLinewidth=r.wireframeLinewidth,o.linewidth=r.linewidth,!0===a.isPointLight&&!0===o.isMeshDistanceMaterial&&(e.properties.get(o).light=a),o}function M(e){for(let i in e.target.removeEventListener("dispose",M),u){let r=u[i],n=e.target.uuid;n in r&&(r[n].dispose(),delete r[n])}}this.render=function(r,c,h){if(!1===_.enabled||!1===_.autoUpdate&&!1===_.needsUpdate||0===r.length)return;let u=e.getRenderTarget(),p=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),M=e.state;M.setBlending(n.XIg),M.buffers.depth.getReversed()?M.buffers.color.setClear(0,0,0,0):M.buffers.color.setClear(1,1,1,1),M.buffers.depth.setTest(!0),M.setScissorTest(!1);let b=y!==n.RyA&&this.type===n.RyA,S=y===n.RyA&&this.type!==n.RyA;for(let u=0,p=r.length;u<p;u++){let p=r[u],g=p.shadow;if(void 0===g){console.warn("THREE.WebGLShadowMap:",p,"has no shadow.");continue}if(!1===g.autoUpdate&&!1===g.needsUpdate)continue;s.copy(g.mapSize);let _=g.getFrameExtents();if(s.multiply(_),o.copy(g.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(o.x=Math.floor(d/_.x),s.x=o.x*_.x,g.mapSize.x=o.x),s.y>d&&(o.y=Math.floor(d/_.y),s.y=o.y*_.y,g.mapSize.y=o.y)),null===g.map||!0===b||!0===S){let e=this.type!==n.RyA?{minFilter:n.hxR,magFilter:n.hxR}:{};null!==g.map&&g.map.dispose(),g.map=new n.nWS(s.x,s.y,e),g.map.texture.name=p.name+".shadowMap",g.camera.updateProjectionMatrix()}e.setRenderTarget(g.map),e.clear();let y=g.getViewportCount();for(let r=0;r<y;r++){let s=g.getViewport(r);l.set(o.x*s.x,o.y*s.y,o.x*s.z,o.y*s.w),M.viewport(l),g.updateMatrices(p,r),a=g.getFrustum(),function r(s,o,l,c,h){if(!1===s.visible)return;if(s.layers.test(o.layers)&&(s.isMesh||s.isLine||s.isPoints)&&(s.castShadow||s.receiveShadow&&h===n.RyA)&&(!s.frustumCulled||a.intersectsObject(s))){s.modelViewMatrix.multiplyMatrices(l.matrixWorldInverse,s.matrixWorld);let r=i.update(s),n=s.material;if(Array.isArray(n)){let i=r.groups;for(let a=0,u=i.length;a<u;a++){let u=i[a],d=n[u.materialIndex];if(d&&d.visible){let i=x(s,d,c,h);s.onBeforeShadow(e,s,o,l,r,i,u),e.renderBufferDirect(l,null,r,i,s,u),s.onAfterShadow(e,s,o,l,r,i,u)}}}else if(n.visible){let i=x(s,n,c,h);s.onBeforeShadow(e,s,o,l,r,i,null),e.renderBufferDirect(l,null,r,i,s,null),s.onAfterShadow(e,s,o,l,r,i,null)}}let u=s.children;for(let e=0,i=u.length;e<i;e++)r(u[e],o,l,c,h)}(c,h,g.camera,p,this.type)}!0!==g.isPointLightShadow&&this.type===n.RyA&&function(r,a){let o=i.update(v);f.defines.VSM_SAMPLES!==r.blurSamples&&(f.defines.VSM_SAMPLES=r.blurSamples,m.defines.VSM_SAMPLES=r.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),null===r.mapPass&&(r.mapPass=new n.nWS(s.x,s.y)),f.uniforms.shadow_pass.value=r.map.texture,f.uniforms.resolution.value=r.mapSize,f.uniforms.radius.value=r.radius,e.setRenderTarget(r.mapPass),e.clear(),e.renderBufferDirect(a,null,o,f,v,null),m.uniforms.shadow_pass.value=r.mapPass.texture,m.uniforms.resolution.value=r.mapSize,m.uniforms.radius.value=r.radius,e.setRenderTarget(r.map),e.clear(),e.renderBufferDirect(a,null,o,m,v,null)}(g,h),g.needsUpdate=!1}y=this.type,_.needsUpdate=!1,e.setRenderTarget(u,p,g)}}let t_={[n.eHc]:n.lGu,[n.brA]:n.K52,[n.U3G]:n.bw0,[n.xSv]:n.Gwm,[n.lGu]:n.eHc,[n.K52]:n.brA,[n.bw0]:n.U3G,[n.Gwm]:n.xSv};function ty(e,i){let r=new function(){let i=!1,r=new n.IUQ,a=null,s=new n.IUQ(0,0,0,0);return{setMask:function(r){a===r||i||(e.colorMask(r,r,r,r),a=r)},setLocked:function(e){i=e},setClear:function(i,n,a,o,l){!0===l&&(i*=o,n*=o,a*=o),r.set(i,n,a,o),!1===s.equals(r)&&(e.clearColor(i,n,a,o),s.copy(r))},reset:function(){i=!1,a=null,s.set(-1,0,0,0)}}},a=new function(){let r=!1,a=!1,s=null,o=null,l=null;return{setReversed:function(e){if(a!==e){let r=i.get("EXT_clip_control");e?r.clipControlEXT(r.LOWER_LEFT_EXT,r.ZERO_TO_ONE_EXT):r.clipControlEXT(r.LOWER_LEFT_EXT,r.NEGATIVE_ONE_TO_ONE_EXT),a=e;let n=l;l=null,this.setClear(n)}},getReversed:function(){return a},setTest:function(i){i?V(e.DEPTH_TEST):H(e.DEPTH_TEST)},setMask:function(i){s===i||r||(e.depthMask(i),s=i)},setFunc:function(i){if(a&&(i=t_[i]),o!==i){switch(i){case n.eHc:e.depthFunc(e.NEVER);break;case n.lGu:e.depthFunc(e.ALWAYS);break;case n.brA:e.depthFunc(e.LESS);break;case n.xSv:e.depthFunc(e.LEQUAL);break;case n.U3G:e.depthFunc(e.EQUAL);break;case n.Gwm:e.depthFunc(e.GEQUAL);break;case n.K52:e.depthFunc(e.GREATER);break;case n.bw0:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}o=i}},setLocked:function(e){r=e},setClear:function(i){l!==i&&(a&&(i=1-i),e.clearDepth(i),l=i)},reset:function(){r=!1,s=null,o=null,l=null,a=!1}}},s=new function(){let i=!1,r=null,n=null,a=null,s=null,o=null,l=null,c=null,h=null;return{setTest:function(r){i||(r?V(e.STENCIL_TEST):H(e.STENCIL_TEST))},setMask:function(n){r===n||i||(e.stencilMask(n),r=n)},setFunc:function(i,r,o){(n!==i||a!==r||s!==o)&&(e.stencilFunc(i,r,o),n=i,a=r,s=o)},setOp:function(i,r,n){(o!==i||l!==r||c!==n)&&(e.stencilOp(i,r,n),o=i,l=r,c=n)},setLocked:function(e){i=e},setClear:function(i){h!==i&&(e.clearStencil(i),h=i)},reset:function(){i=!1,r=null,n=null,a=null,s=null,o=null,l=null,c=null,h=null}}},o=new WeakMap,l=new WeakMap,c={},h={},u=new WeakMap,d=[],p=null,f=!1,m=null,g=null,v=null,_=null,y=null,x=null,M=null,b=new n.Q1f(0,0,0),S=0,E=!1,T=null,w=null,A=null,R=null,C=null,P=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),I=!1,L=e.getParameter(e.VERSION);-1!==L.indexOf("WebGL")?I=parseFloat(/^WebGL (\d)/.exec(L)[1])>=1:-1!==L.indexOf("OpenGL ES")&&(I=parseFloat(/^OpenGL ES (\d)/.exec(L)[1])>=2);let D=null,U={},N=e.getParameter(e.SCISSOR_BOX),O=e.getParameter(e.VIEWPORT),F=new n.IUQ().fromArray(N),B=new n.IUQ().fromArray(O);function z(i,r,n,a){let s=new Uint8Array(4),o=e.createTexture();e.bindTexture(i,o),e.texParameteri(i,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(i,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<n;o++)i===e.TEXTURE_3D||i===e.TEXTURE_2D_ARRAY?e.texImage3D(r,0,e.RGBA,1,1,a,0,e.RGBA,e.UNSIGNED_BYTE,s):e.texImage2D(r+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,s);return o}let k={};function V(i){!0!==c[i]&&(e.enable(i),c[i]=!0)}function H(i){!1!==c[i]&&(e.disable(i),c[i]=!1)}k[e.TEXTURE_2D]=z(e.TEXTURE_2D,e.TEXTURE_2D,1),k[e.TEXTURE_CUBE_MAP]=z(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[e.TEXTURE_2D_ARRAY]=z(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),k[e.TEXTURE_3D]=z(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),s.setClear(0),V(e.DEPTH_TEST),a.setFunc(n.xSv),j(!1),q(n.Vb5),V(e.CULL_FACE),X(n.XIg);let G={[n.gO9]:e.FUNC_ADD,[n.FXf]:e.FUNC_SUBTRACT,[n.nST]:e.FUNC_REVERSE_SUBTRACT};G[n.znC]=e.MIN,G[n.$ei]=e.MAX;let W={[n.ojh]:e.ZERO,[n.qad]:e.ONE,[n.f4X]:e.SRC_COLOR,[n.ie2]:e.SRC_ALPHA,[n.hgQ]:e.SRC_ALPHA_SATURATE,[n.wn6]:e.DST_COLOR,[n.hdd]:e.DST_ALPHA,[n.LiQ]:e.ONE_MINUS_SRC_COLOR,[n.OuU]:e.ONE_MINUS_SRC_ALPHA,[n.aEY]:e.ONE_MINUS_DST_COLOR,[n.Nt7]:e.ONE_MINUS_DST_ALPHA,[n.RrE]:e.CONSTANT_COLOR,[n.$Yl]:e.ONE_MINUS_CONSTANT_COLOR,[n.e0p]:e.CONSTANT_ALPHA,[n.ov9]:e.ONE_MINUS_CONSTANT_ALPHA};function X(i,r,a,s,o,l,c,h,u,d){if(i===n.XIg){!0===f&&(H(e.BLEND),f=!1);return}if(!1===f&&(V(e.BLEND),f=!0),i!==n.bCz){if(i!==m||d!==E){if((g!==n.gO9||y!==n.gO9)&&(e.blendEquation(e.FUNC_ADD),g=n.gO9,y=n.gO9),d)switch(i){case n.NTi:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case n.EZo:e.blendFunc(e.ONE,e.ONE);break;case n.Kwu:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case n.EdD:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",i)}else switch(i){case n.NTi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case n.EZo:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case n.Kwu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case n.EdD:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",i)}v=null,_=null,x=null,M=null,b.set(0,0,0),S=0,m=i,E=d}return}o=o||r,l=l||a,c=c||s,(r!==g||o!==y)&&(e.blendEquationSeparate(G[r],G[o]),g=r,y=o),(a!==v||s!==_||l!==x||c!==M)&&(e.blendFuncSeparate(W[a],W[s],W[l],W[c]),v=a,_=s,x=l,M=c),(!1===h.equals(b)||u!==S)&&(e.blendColor(h.r,h.g,h.b,u),b.copy(h),S=u),m=i,E=!1}function j(i){T!==i&&(i?e.frontFace(e.CW):e.frontFace(e.CCW),T=i)}function q(i){i!==n.WNZ?(V(e.CULL_FACE),i!==w&&(i===n.Vb5?e.cullFace(e.BACK):i===n.Jnc?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):H(e.CULL_FACE),w=i}function Y(i,r,n){i?(V(e.POLYGON_OFFSET_FILL),(R!==r||C!==n)&&(e.polygonOffset(r,n),R=r,C=n)):H(e.POLYGON_OFFSET_FILL)}return{buffers:{color:r,depth:a,stencil:s},enable:V,disable:H,bindFramebuffer:function(i,r){return h[i]!==r&&(e.bindFramebuffer(i,r),h[i]=r,i===e.DRAW_FRAMEBUFFER&&(h[e.FRAMEBUFFER]=r),i===e.FRAMEBUFFER&&(h[e.DRAW_FRAMEBUFFER]=r),!0)},drawBuffers:function(i,r){let n=d,a=!1;if(i){void 0===(n=u.get(r))&&(n=[],u.set(r,n));let s=i.textures;if(n.length!==s.length||n[0]!==e.COLOR_ATTACHMENT0){for(let i=0,r=s.length;i<r;i++)n[i]=e.COLOR_ATTACHMENT0+i;n.length=s.length,a=!0}}else n[0]!==e.BACK&&(n[0]=e.BACK,a=!0);a&&e.drawBuffers(n)},useProgram:function(i){return p!==i&&(e.useProgram(i),p=i,!0)},setBlending:X,setMaterial:function(i,o){i.side===n.$EB?H(e.CULL_FACE):V(e.CULL_FACE);let l=i.side===n.hsX;o&&(l=!l),j(l),i.blending===n.NTi&&!1===i.transparent?X(n.XIg):X(i.blending,i.blendEquation,i.blendSrc,i.blendDst,i.blendEquationAlpha,i.blendSrcAlpha,i.blendDstAlpha,i.blendColor,i.blendAlpha,i.premultipliedAlpha),a.setFunc(i.depthFunc),a.setTest(i.depthTest),a.setMask(i.depthWrite),r.setMask(i.colorWrite);let c=i.stencilWrite;s.setTest(c),c&&(s.setMask(i.stencilWriteMask),s.setFunc(i.stencilFunc,i.stencilRef,i.stencilFuncMask),s.setOp(i.stencilFail,i.stencilZFail,i.stencilZPass)),Y(i.polygonOffset,i.polygonOffsetFactor,i.polygonOffsetUnits),!0===i.alphaToCoverage?V(e.SAMPLE_ALPHA_TO_COVERAGE):H(e.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:j,setCullFace:q,setLineWidth:function(i){i!==A&&(I&&e.lineWidth(i),A=i)},setPolygonOffset:Y,setScissorTest:function(i){i?V(e.SCISSOR_TEST):H(e.SCISSOR_TEST)},activeTexture:function(i){void 0===i&&(i=e.TEXTURE0+P-1),D!==i&&(e.activeTexture(i),D=i)},bindTexture:function(i,r,n){void 0===n&&(n=null===D?e.TEXTURE0+P-1:D);let a=U[n];void 0===a&&(a={type:void 0,texture:void 0},U[n]=a),(a.type!==i||a.texture!==r)&&(D!==n&&(e.activeTexture(n),D=n),e.bindTexture(i,r||k[i]),a.type=i,a.texture=r)},unbindTexture:function(){let i=U[D];void 0!==i&&void 0!==i.type&&(e.bindTexture(i.type,null),i.type=void 0,i.texture=void 0)},compressedTexImage2D:function(){try{e.compressedTexImage2D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},compressedTexImage3D:function(){try{e.compressedTexImage3D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},texImage2D:function(){try{e.texImage2D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},texImage3D:function(){try{e.texImage3D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},updateUBOMapping:function(i,r){let n=l.get(r);void 0===n&&(n=new WeakMap,l.set(r,n));let a=n.get(i);void 0===a&&(a=e.getUniformBlockIndex(r,i.name),n.set(i,a))},uniformBlockBinding:function(i,r){let n=l.get(r).get(i);o.get(r)!==n&&(e.uniformBlockBinding(r,n,i.__bindingPointIndex),o.set(r,n))},texStorage2D:function(){try{e.texStorage2D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},texStorage3D:function(){try{e.texStorage3D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},texSubImage2D:function(){try{e.texSubImage2D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},texSubImage3D:function(){try{e.texSubImage3D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},compressedTexSubImage2D:function(){try{e.compressedTexSubImage2D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},compressedTexSubImage3D:function(){try{e.compressedTexSubImage3D(...arguments)}catch(e){console.error("THREE.WebGLState:",e)}},scissor:function(i){!1===F.equals(i)&&(e.scissor(i.x,i.y,i.z,i.w),F.copy(i))},viewport:function(i){!1===B.equals(i)&&(e.viewport(i.x,i.y,i.z,i.w),B.copy(i))},reset:function(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(0xffffffff),e.stencilFunc(e.ALWAYS,0,0xffffffff),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),c={},D=null,U={},h={},u=new WeakMap,d=[],p=null,f=!1,m=null,g=null,v=null,_=null,y=null,x=null,M=null,b=new n.Q1f(0,0,0),S=0,E=!1,T=null,w=null,A=null,R=null,C=null,F.set(0,0,e.canvas.width,e.canvas.height),B.set(0,0,e.canvas.width,e.canvas.height),r.reset(),a.reset(),s.reset()}}}function tx(e,i,r,a,s,o,l){let c,h=i.has("WEBGL_multisampled_render_to_texture")?i.get("WEBGL_multisampled_render_to_texture"):null,u="undefined"!=typeof navigator&&/OculusBrowser/g.test(navigator.userAgent),d=new n.I9Y,p=new WeakMap,f=new WeakMap,m=!1;try{m="undefined"!=typeof OffscreenCanvas&&null!==new OffscreenCanvas(1,1).getContext("2d")}catch(e){}function g(e,i){return m?new OffscreenCanvas(e,i):(0,n.qq$)("canvas")}function v(e,i,r){let n=1,a=W(e);if((a.width>r||a.height>r)&&(n=r/Math.max(a.width,a.height)),n<1)if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap||"undefined"!=typeof VideoFrame&&e instanceof VideoFrame){let r=Math.floor(n*a.width),s=Math.floor(n*a.height);void 0===c&&(c=g(r,s));let o=i?g(r,s):c;return o.width=r,o.height=s,o.getContext("2d").drawImage(e,0,0,r,s),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+a.width+"x"+a.height+") to ("+r+"x"+s+")."),o}else"data"in e&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+a.width+"x"+a.height+").");return e}function _(e){return e.generateMipmaps}function y(i){e.generateMipmap(i)}function x(r,a,s,o,l=!1){if(null!==r){if(void 0!==e[r])return e[r];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+r+"'")}let c=a;if(a===e.RED&&(s===e.FLOAT&&(c=e.R32F),s===e.HALF_FLOAT&&(c=e.R16F),s===e.UNSIGNED_BYTE&&(c=e.R8)),a===e.RED_INTEGER&&(s===e.UNSIGNED_BYTE&&(c=e.R8UI),s===e.UNSIGNED_SHORT&&(c=e.R16UI),s===e.UNSIGNED_INT&&(c=e.R32UI),s===e.BYTE&&(c=e.R8I),s===e.SHORT&&(c=e.R16I),s===e.INT&&(c=e.R32I)),a===e.RG&&(s===e.FLOAT&&(c=e.RG32F),s===e.HALF_FLOAT&&(c=e.RG16F),s===e.UNSIGNED_BYTE&&(c=e.RG8)),a===e.RG_INTEGER&&(s===e.UNSIGNED_BYTE&&(c=e.RG8UI),s===e.UNSIGNED_SHORT&&(c=e.RG16UI),s===e.UNSIGNED_INT&&(c=e.RG32UI),s===e.BYTE&&(c=e.RG8I),s===e.SHORT&&(c=e.RG16I),s===e.INT&&(c=e.RG32I)),a===e.RGB_INTEGER&&(s===e.UNSIGNED_BYTE&&(c=e.RGB8UI),s===e.UNSIGNED_SHORT&&(c=e.RGB16UI),s===e.UNSIGNED_INT&&(c=e.RGB32UI),s===e.BYTE&&(c=e.RGB8I),s===e.SHORT&&(c=e.RGB16I),s===e.INT&&(c=e.RGB32I)),a===e.RGBA_INTEGER&&(s===e.UNSIGNED_BYTE&&(c=e.RGBA8UI),s===e.UNSIGNED_SHORT&&(c=e.RGBA16UI),s===e.UNSIGNED_INT&&(c=e.RGBA32UI),s===e.BYTE&&(c=e.RGBA8I),s===e.SHORT&&(c=e.RGBA16I),s===e.INT&&(c=e.RGBA32I)),a===e.RGB&&s===e.UNSIGNED_INT_5_9_9_9_REV&&(c=e.RGB9_E5),a===e.RGBA){let i=l?n.VxR:n.ppV.getTransfer(o);s===e.FLOAT&&(c=e.RGBA32F),s===e.HALF_FLOAT&&(c=e.RGBA16F),s===e.UNSIGNED_BYTE&&(c=i===n.KLL?e.SRGB8_ALPHA8:e.RGBA8),s===e.UNSIGNED_SHORT_4_4_4_4&&(c=e.RGBA4),s===e.UNSIGNED_SHORT_5_5_5_1&&(c=e.RGB5_A1)}return(c===e.R16F||c===e.R32F||c===e.RG16F||c===e.RG32F||c===e.RGBA16F||c===e.RGBA32F)&&i.get("EXT_color_buffer_float"),c}function M(i,r){let a;return i?null===r||r===n.bkx||r===n.V3x?a=e.DEPTH24_STENCIL8:r===n.RQf?a=e.DEPTH32F_STENCIL8:r===n.cHt&&(a=e.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):null===r||r===n.bkx||r===n.V3x?a=e.DEPTH_COMPONENT24:r===n.RQf?a=e.DEPTH_COMPONENT32F:r===n.cHt&&(a=e.DEPTH_COMPONENT16),a}function b(e,i){return!0===_(e)||e.isFramebufferTexture&&e.minFilter!==n.hxR&&e.minFilter!==n.k6q?Math.log2(Math.max(i.width,i.height))+1:void 0!==e.mipmaps&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?i.mipmaps.length:1}function S(e){let i=e.target;i.removeEventListener("dispose",S),function(e){let i=a.get(e);if(void 0===i.__webglInit)return;let r=e.source,n=f.get(r);if(n){let a=n[i.__cacheKey];a.usedTimes--,0===a.usedTimes&&T(e),0===Object.keys(n).length&&f.delete(r)}a.remove(e)}(i),i.isVideoTexture&&p.delete(i)}function E(i){let r=i.target;r.removeEventListener("dispose",E),function(i){let r=a.get(i);if(i.depthTexture&&(i.depthTexture.dispose(),a.remove(i.depthTexture)),i.isWebGLCubeRenderTarget)for(let i=0;i<6;i++){if(Array.isArray(r.__webglFramebuffer[i]))for(let n=0;n<r.__webglFramebuffer[i].length;n++)e.deleteFramebuffer(r.__webglFramebuffer[i][n]);else e.deleteFramebuffer(r.__webglFramebuffer[i]);r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer[i])}else{if(Array.isArray(r.__webglFramebuffer))for(let i=0;i<r.__webglFramebuffer.length;i++)e.deleteFramebuffer(r.__webglFramebuffer[i]);else e.deleteFramebuffer(r.__webglFramebuffer);if(r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer),r.__webglMultisampledFramebuffer&&e.deleteFramebuffer(r.__webglMultisampledFramebuffer),r.__webglColorRenderbuffer)for(let i=0;i<r.__webglColorRenderbuffer.length;i++)r.__webglColorRenderbuffer[i]&&e.deleteRenderbuffer(r.__webglColorRenderbuffer[i]);r.__webglDepthRenderbuffer&&e.deleteRenderbuffer(r.__webglDepthRenderbuffer)}let n=i.textures;for(let i=0,r=n.length;i<r;i++){let r=a.get(n[i]);r.__webglTexture&&(e.deleteTexture(r.__webglTexture),l.memory.textures--),a.remove(n[i])}a.remove(i)}(r)}function T(i){let r=a.get(i);e.deleteTexture(r.__webglTexture);let n=i.source,s=f.get(n);delete s[r.__cacheKey],l.memory.textures--}let w=0;function A(i,n){let s=a.get(i);if(i.isVideoTexture&&function(e){let i=l.render.frame;p.get(e)!==i&&(p.set(e,i),e.update())}(i),!1===i.isRenderTargetTexture&&!0!==i.isExternalTexture&&i.version>0&&s.__version!==i.version){let e=i.image;if(null===e)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else{if(!1!==e.complete)return void U(s,i,n);console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")}}else i.isExternalTexture&&(s.__webglTexture=i.sourceTexture?i.sourceTexture:null);r.bindTexture(e.TEXTURE_2D,s.__webglTexture,e.TEXTURE0+n)}let R={[n.GJx]:e.REPEAT,[n.ghU]:e.CLAMP_TO_EDGE,[n.kTW]:e.MIRRORED_REPEAT},C={[n.hxR]:e.NEAREST,[n.pHI]:e.NEAREST_MIPMAP_NEAREST,[n.Cfg]:e.NEAREST_MIPMAP_LINEAR,[n.k6q]:e.LINEAR,[n.kRr]:e.LINEAR_MIPMAP_NEAREST,[n.$_I]:e.LINEAR_MIPMAP_LINEAR},P={[n.amv]:e.NEVER,[n.FFZ]:e.ALWAYS,[n.vim]:e.LESS,[n.TiK]:e.LEQUAL,[n.kO0]:e.EQUAL,[n.gWB]:e.GEQUAL,[n.eoi]:e.GREATER,[n.jzd]:e.NOTEQUAL};function I(r,o){if((o.type===n.RQf&&!1===i.has("OES_texture_float_linear")&&(o.magFilter===n.k6q||o.magFilter===n.kRr||o.magFilter===n.Cfg||o.magFilter===n.$_I||o.minFilter===n.k6q||o.minFilter===n.kRr||o.minFilter===n.Cfg||o.minFilter===n.$_I)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(r,e.TEXTURE_WRAP_S,R[o.wrapS]),e.texParameteri(r,e.TEXTURE_WRAP_T,R[o.wrapT]),(r===e.TEXTURE_3D||r===e.TEXTURE_2D_ARRAY)&&e.texParameteri(r,e.TEXTURE_WRAP_R,R[o.wrapR]),e.texParameteri(r,e.TEXTURE_MAG_FILTER,C[o.magFilter]),e.texParameteri(r,e.TEXTURE_MIN_FILTER,C[o.minFilter]),o.compareFunction&&(e.texParameteri(r,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(r,e.TEXTURE_COMPARE_FUNC,P[o.compareFunction])),!0===i.has("EXT_texture_filter_anisotropic"))&&o.magFilter!==n.hxR&&(o.minFilter===n.Cfg||o.minFilter===n.$_I)&&(o.type!==n.RQf||!1!==i.has("OES_texture_float_linear"))&&(o.anisotropy>1||a.get(o).__currentAnisotropy)){let n=i.get("EXT_texture_filter_anisotropic");e.texParameterf(r,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(o.anisotropy,s.getMaxAnisotropy())),a.get(o).__currentAnisotropy=o.anisotropy}}function L(i,r){let n=!1;void 0===i.__webglInit&&(i.__webglInit=!0,r.addEventListener("dispose",S));let a=r.source,s=f.get(a);void 0===s&&(s={},f.set(a,s));let o=function(e){let i=[];return i.push(e.wrapS),i.push(e.wrapT),i.push(e.wrapR||0),i.push(e.magFilter),i.push(e.minFilter),i.push(e.anisotropy),i.push(e.internalFormat),i.push(e.format),i.push(e.type),i.push(e.generateMipmaps),i.push(e.premultiplyAlpha),i.push(e.flipY),i.push(e.unpackAlignment),i.push(e.colorSpace),i.join()}(r);if(o!==i.__cacheKey){void 0===s[o]&&(s[o]={texture:e.createTexture(),usedTimes:0},l.memory.textures++,n=!0),s[o].usedTimes++;let a=s[i.__cacheKey];void 0!==a&&(s[i.__cacheKey].usedTimes--,0===a.usedTimes&&T(r)),i.__cacheKey=o,i.__webglTexture=s[o].texture}return n}function D(e,i,r){return Math.floor(Math.floor(e/r)/i)}function U(i,l,c){let h=e.TEXTURE_2D;(l.isDataArrayTexture||l.isCompressedArrayTexture)&&(h=e.TEXTURE_2D_ARRAY),l.isData3DTexture&&(h=e.TEXTURE_3D);let u=L(i,l),d=l.source;r.bindTexture(h,i.__webglTexture,e.TEXTURE0+c);let p=a.get(d);if(d.version!==p.__version||!0===u){let i;r.activeTexture(e.TEXTURE0+c);let a=n.ppV.getPrimaries(n.ppV.workingColorSpace),f=l.colorSpace===n.jf0?null:n.ppV.getPrimaries(l.colorSpace),m=l.colorSpace===n.jf0||a===f?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,l.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,l.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,l.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,m);let g=v(l.image,!1,s.maxTextureSize);g=G(l,g);let S=o.convert(l.format,l.colorSpace),E=o.convert(l.type),T=x(l.internalFormat,S,E,l.colorSpace,l.isVideoTexture);I(h,l);let w=l.mipmaps,A=!0!==l.isVideoTexture,R=void 0===p.__version||!0===u,C=d.dataReady,P=b(l,g);if(l.isDepthTexture)T=M(l.format===n.dcC,l.type),R&&(A?r.texStorage2D(e.TEXTURE_2D,1,T,g.width,g.height):r.texImage2D(e.TEXTURE_2D,0,T,g.width,g.height,0,S,E,null));else if(l.isDataTexture)if(w.length>0){A&&R&&r.texStorage2D(e.TEXTURE_2D,P,T,w[0].width,w[0].height);for(let n=0,a=w.length;n<a;n++)i=w[n],A?C&&r.texSubImage2D(e.TEXTURE_2D,n,0,0,i.width,i.height,S,E,i.data):r.texImage2D(e.TEXTURE_2D,n,T,i.width,i.height,0,S,E,i.data);l.generateMipmaps=!1}else A?(R&&r.texStorage2D(e.TEXTURE_2D,P,T,g.width,g.height),C&&function(i,n,a,s){let o=i.updateRanges;if(0===o.length)r.texSubImage2D(e.TEXTURE_2D,0,0,0,n.width,n.height,a,s,n.data);else{o.sort((e,i)=>e.start-i.start);let l=0;for(let e=1;e<o.length;e++){let i=o[l],r=o[e],a=i.start+i.count,s=D(r.start,n.width,4),c=D(i.start,n.width,4);r.start<=a+1&&s===c&&D(r.start+r.count-1,n.width,4)===s?i.count=Math.max(i.count,r.start+r.count-i.start):o[++l]=r}o.length=l+1;let c=e.getParameter(e.UNPACK_ROW_LENGTH),h=e.getParameter(e.UNPACK_SKIP_PIXELS),u=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,n.width);for(let i=0,l=o.length;i<l;i++){let l=o[i],c=Math.floor(l.start/4),h=Math.ceil(l.count/4),u=c%n.width,d=Math.floor(c/n.width);e.pixelStorei(e.UNPACK_SKIP_PIXELS,u),e.pixelStorei(e.UNPACK_SKIP_ROWS,d),r.texSubImage2D(e.TEXTURE_2D,0,u,d,h,1,a,s,n.data)}i.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,c),e.pixelStorei(e.UNPACK_SKIP_PIXELS,h),e.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}(l,g,S,E)):r.texImage2D(e.TEXTURE_2D,0,T,g.width,g.height,0,S,E,g.data);else if(l.isCompressedTexture)if(l.isCompressedArrayTexture){A&&R&&r.texStorage3D(e.TEXTURE_2D_ARRAY,P,T,w[0].width,w[0].height,g.depth);for(let a=0,s=w.length;a<s;a++)if(i=w[a],l.format!==n.GWd)if(null!==S)if(A){if(C)if(l.layerUpdates.size>0){let s=(0,n.Nex)(i.width,i.height,l.format,l.type);for(let n of l.layerUpdates){let o=i.data.subarray(n*s/i.data.BYTES_PER_ELEMENT,(n+1)*s/i.data.BYTES_PER_ELEMENT);r.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,n,i.width,i.height,1,S,o)}l.clearLayerUpdates()}else r.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,i.width,i.height,g.depth,S,i.data)}else r.compressedTexImage3D(e.TEXTURE_2D_ARRAY,a,T,i.width,i.height,g.depth,0,i.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else A?C&&r.texSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,i.width,i.height,g.depth,S,E,i.data):r.texImage3D(e.TEXTURE_2D_ARRAY,a,T,i.width,i.height,g.depth,0,S,E,i.data)}else{A&&R&&r.texStorage2D(e.TEXTURE_2D,P,T,w[0].width,w[0].height);for(let a=0,s=w.length;a<s;a++)i=w[a],l.format!==n.GWd?null!==S?A?C&&r.compressedTexSubImage2D(e.TEXTURE_2D,a,0,0,i.width,i.height,S,i.data):r.compressedTexImage2D(e.TEXTURE_2D,a,T,i.width,i.height,0,i.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):A?C&&r.texSubImage2D(e.TEXTURE_2D,a,0,0,i.width,i.height,S,E,i.data):r.texImage2D(e.TEXTURE_2D,a,T,i.width,i.height,0,S,E,i.data)}else if(l.isDataArrayTexture)if(A){if(R&&r.texStorage3D(e.TEXTURE_2D_ARRAY,P,T,g.width,g.height,g.depth),C)if(l.layerUpdates.size>0){let i=(0,n.Nex)(g.width,g.height,l.format,l.type);for(let n of l.layerUpdates){let a=g.data.subarray(n*i/g.data.BYTES_PER_ELEMENT,(n+1)*i/g.data.BYTES_PER_ELEMENT);r.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,n,g.width,g.height,1,S,E,a)}l.clearLayerUpdates()}else r.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,g.width,g.height,g.depth,S,E,g.data)}else r.texImage3D(e.TEXTURE_2D_ARRAY,0,T,g.width,g.height,g.depth,0,S,E,g.data);else if(l.isData3DTexture)A?(R&&r.texStorage3D(e.TEXTURE_3D,P,T,g.width,g.height,g.depth),C&&r.texSubImage3D(e.TEXTURE_3D,0,0,0,0,g.width,g.height,g.depth,S,E,g.data)):r.texImage3D(e.TEXTURE_3D,0,T,g.width,g.height,g.depth,0,S,E,g.data);else if(l.isFramebufferTexture){if(R)if(A)r.texStorage2D(e.TEXTURE_2D,P,T,g.width,g.height);else{let i=g.width,n=g.height;for(let a=0;a<P;a++)r.texImage2D(e.TEXTURE_2D,a,T,i,n,0,S,E,null),i>>=1,n>>=1}}else if(w.length>0){if(A&&R){let i=W(w[0]);r.texStorage2D(e.TEXTURE_2D,P,T,i.width,i.height)}for(let n=0,a=w.length;n<a;n++)i=w[n],A?C&&r.texSubImage2D(e.TEXTURE_2D,n,0,0,S,E,i):r.texImage2D(e.TEXTURE_2D,n,T,S,E,i);l.generateMipmaps=!1}else if(A){if(R){let i=W(g);r.texStorage2D(e.TEXTURE_2D,P,T,i.width,i.height)}C&&r.texSubImage2D(e.TEXTURE_2D,0,0,0,S,E,g)}else r.texImage2D(e.TEXTURE_2D,0,T,S,E,g);_(l)&&y(h),p.__version=d.version,l.onUpdate&&l.onUpdate(l)}i.__version=l.version}function N(i,n,s,l,c,u){let d=o.convert(s.format,s.colorSpace),p=o.convert(s.type),f=x(s.internalFormat,d,p,s.colorSpace),m=a.get(n),g=a.get(s);if(g.__renderTarget=n,!m.__hasExternalTextures){let i=Math.max(1,n.width>>u),a=Math.max(1,n.height>>u);c===e.TEXTURE_3D||c===e.TEXTURE_2D_ARRAY?r.texImage3D(c,u,f,i,a,n.depth,0,d,p,null):r.texImage2D(c,u,f,i,a,0,d,p,null)}r.bindFramebuffer(e.FRAMEBUFFER,i),H(n)?h.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,c,g.__webglTexture,0,V(n)):(c===e.TEXTURE_2D||c>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&c<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,l,c,g.__webglTexture,u),r.bindFramebuffer(e.FRAMEBUFFER,null)}function O(i,r,n){if(e.bindRenderbuffer(e.RENDERBUFFER,i),r.depthBuffer){let a=r.depthTexture,s=a&&a.isDepthTexture?a.type:null,o=M(r.stencilBuffer,s),l=r.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,c=V(r);H(r)?h.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,c,o,r.width,r.height):n?e.renderbufferStorageMultisample(e.RENDERBUFFER,c,o,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,o,r.width,r.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,l,e.RENDERBUFFER,i)}else{let i=r.textures;for(let a=0;a<i.length;a++){let s=i[a],l=o.convert(s.format,s.colorSpace),c=o.convert(s.type),u=x(s.internalFormat,l,c,s.colorSpace),d=V(r);n&&!1===H(r)?e.renderbufferStorageMultisample(e.RENDERBUFFER,d,u,r.width,r.height):H(r)?h.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,d,u,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,u,r.width,r.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function F(i,s){if(s&&s.isWebGLCubeRenderTarget)throw Error("Depth Texture with cube render targets is not supported");if(r.bindFramebuffer(e.FRAMEBUFFER,i),!(s.depthTexture&&s.depthTexture.isDepthTexture))throw Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let o=a.get(s.depthTexture);o.__renderTarget=s,o.__webglTexture&&s.depthTexture.image.width===s.width&&s.depthTexture.image.height===s.height||(s.depthTexture.image.width=s.width,s.depthTexture.image.height=s.height,s.depthTexture.needsUpdate=!0),A(s.depthTexture,0);let l=o.__webglTexture,c=V(s);if(s.depthTexture.format===n.zdS)H(s)?h.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,l,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,l,0);else if(s.depthTexture.format===n.dcC)H(s)?h.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,l,0,c):e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_STENCIL_ATTACHMENT,e.TEXTURE_2D,l,0);else throw Error("Unknown depthTexture format")}function B(i){let n=a.get(i),s=!0===i.isWebGLCubeRenderTarget;if(n.__boundDepthTexture!==i.depthTexture){let e=i.depthTexture;if(n.__depthDisposeCallback&&n.__depthDisposeCallback(),e){let i=()=>{delete n.__boundDepthTexture,delete n.__depthDisposeCallback,e.removeEventListener("dispose",i)};e.addEventListener("dispose",i),n.__depthDisposeCallback=i}n.__boundDepthTexture=e}if(i.depthTexture&&!n.__autoAllocateDepthBuffer){if(s)throw Error("target.depthTexture not supported in Cube render targets");let e=i.texture.mipmaps;e&&e.length>0?F(n.__webglFramebuffer[0],i):F(n.__webglFramebuffer,i)}else if(s){n.__webglDepthbuffer=[];for(let a=0;a<6;a++)if(r.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[a]),void 0===n.__webglDepthbuffer[a])n.__webglDepthbuffer[a]=e.createRenderbuffer(),O(n.__webglDepthbuffer[a],i,!1);else{let r=i.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,s=n.__webglDepthbuffer[a];e.bindRenderbuffer(e.RENDERBUFFER,s),e.framebufferRenderbuffer(e.FRAMEBUFFER,r,e.RENDERBUFFER,s)}}else{let a=i.texture.mipmaps;if(a&&a.length>0?r.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer[0]):r.bindFramebuffer(e.FRAMEBUFFER,n.__webglFramebuffer),void 0===n.__webglDepthbuffer)n.__webglDepthbuffer=e.createRenderbuffer(),O(n.__webglDepthbuffer,i,!1);else{let r=i.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=n.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,r,e.RENDERBUFFER,a)}}r.bindFramebuffer(e.FRAMEBUFFER,null)}let z=[],k=[];function V(e){return Math.min(s.maxSamples,e.samples)}function H(e){let r=a.get(e);return e.samples>0&&!0===i.has("WEBGL_multisampled_render_to_texture")&&!1!==r.__useRenderToTexture}function G(e,i){let r=e.colorSpace,a=e.format,s=e.type;return!0===e.isCompressedTexture||!0===e.isVideoTexture||r!==n.Zr2&&r!==n.jf0&&(n.ppV.getTransfer(r)===n.KLL?(a!==n.GWd||s!==n.OUM)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",r)),i}function W(e){return"undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement?(d.width=e.naturalWidth||e.width,d.height=e.naturalHeight||e.height):"undefined"!=typeof VideoFrame&&e instanceof VideoFrame?(d.width=e.displayWidth,d.height=e.displayHeight):(d.width=e.width,d.height=e.height),d}this.allocateTextureUnit=function(){let e=w;return e>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+e+" texture units while this GPU supports only "+s.maxTextures),w+=1,e},this.resetTextureUnits=function(){w=0},this.setTexture2D=A,this.setTexture2DArray=function(i,n){let s=a.get(i);if(!1===i.isRenderTargetTexture&&i.version>0&&s.__version!==i.version)return void U(s,i,n);r.bindTexture(e.TEXTURE_2D_ARRAY,s.__webglTexture,e.TEXTURE0+n)},this.setTexture3D=function(i,n){let s=a.get(i);if(!1===i.isRenderTargetTexture&&i.version>0&&s.__version!==i.version)return void U(s,i,n);r.bindTexture(e.TEXTURE_3D,s.__webglTexture,e.TEXTURE0+n)},this.setTextureCube=function(i,l){let c=a.get(i);if(i.version>0&&c.__version!==i.version)return void function(i,l,c){if(6!==l.image.length)return;let h=L(i,l),u=l.source;r.bindTexture(e.TEXTURE_CUBE_MAP,i.__webglTexture,e.TEXTURE0+c);let d=a.get(u);if(u.version!==d.__version||!0===h){let i;r.activeTexture(e.TEXTURE0+c);let a=n.ppV.getPrimaries(n.ppV.workingColorSpace),p=l.colorSpace===n.jf0?null:n.ppV.getPrimaries(l.colorSpace),f=l.colorSpace===n.jf0||a===p?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,l.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,l.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,l.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,f);let m=l.isCompressedTexture||l.image[0].isCompressedTexture,g=l.image[0]&&l.image[0].isDataTexture,M=[];for(let e=0;e<6;e++)m||g?M[e]=g?l.image[e].image:l.image[e]:M[e]=v(l.image[e],!0,s.maxCubemapSize),M[e]=G(l,M[e]);let S=M[0],E=o.convert(l.format,l.colorSpace),T=o.convert(l.type),w=x(l.internalFormat,E,T,l.colorSpace),A=!0!==l.isVideoTexture,R=void 0===d.__version||!0===h,C=u.dataReady,P=b(l,S);if(I(e.TEXTURE_CUBE_MAP,l),m){A&&R&&r.texStorage2D(e.TEXTURE_CUBE_MAP,P,w,S.width,S.height);for(let a=0;a<6;a++){i=M[a].mipmaps;for(let s=0;s<i.length;s++){let o=i[s];l.format!==n.GWd?null!==E?A?C&&r.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,s,0,0,o.width,o.height,E,o.data):r.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,s,w,o.width,o.height,0,o.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):A?C&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,s,0,0,o.width,o.height,E,T,o.data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,s,w,o.width,o.height,0,E,T,o.data)}}}else{if(i=l.mipmaps,A&&R){i.length>0&&P++;let n=W(M[0]);r.texStorage2D(e.TEXTURE_CUBE_MAP,P,w,n.width,n.height)}for(let n=0;n<6;n++)if(g){A?C&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,0,0,M[n].width,M[n].height,E,T,M[n].data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,w,M[n].width,M[n].height,0,E,T,M[n].data);for(let a=0;a<i.length;a++){let s=i[a].image[n].image;A?C&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,a+1,0,0,s.width,s.height,E,T,s.data):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,a+1,w,s.width,s.height,0,E,T,s.data)}}else{A?C&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,0,0,E,T,M[n]):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,w,E,T,M[n]);for(let a=0;a<i.length;a++){let s=i[a];A?C&&r.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,a+1,0,0,E,T,s.image[n]):r.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,a+1,w,E,T,s.image[n])}}}_(l)&&y(e.TEXTURE_CUBE_MAP),d.__version=u.version,l.onUpdate&&l.onUpdate(l)}i.__version=l.version}(c,i,l);r.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture,e.TEXTURE0+l)},this.rebindTextures=function(i,r,n){let s=a.get(i);void 0!==r&&N(s.__webglFramebuffer,i,i.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),void 0!==n&&B(i)},this.setupRenderTarget=function(i){let n=i.texture,s=a.get(i),c=a.get(n);i.addEventListener("dispose",E);let h=i.textures,u=!0===i.isWebGLCubeRenderTarget,d=h.length>1;if(!d&&(void 0===c.__webglTexture&&(c.__webglTexture=e.createTexture()),c.__version=n.version,l.memory.textures++),u){s.__webglFramebuffer=[];for(let i=0;i<6;i++)if(n.mipmaps&&n.mipmaps.length>0){s.__webglFramebuffer[i]=[];for(let r=0;r<n.mipmaps.length;r++)s.__webglFramebuffer[i][r]=e.createFramebuffer()}else s.__webglFramebuffer[i]=e.createFramebuffer()}else{if(n.mipmaps&&n.mipmaps.length>0){s.__webglFramebuffer=[];for(let i=0;i<n.mipmaps.length;i++)s.__webglFramebuffer[i]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let i=0,r=h.length;i<r;i++){let r=a.get(h[i]);void 0===r.__webglTexture&&(r.__webglTexture=e.createTexture(),l.memory.textures++)}if(i.samples>0&&!1===H(i)){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],r.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let r=0;r<h.length;r++){let n=h[r];s.__webglColorRenderbuffer[r]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[r]);let a=o.convert(n.format,n.colorSpace),l=o.convert(n.type),c=x(n.internalFormat,a,l,n.colorSpace,!0===i.isXRRenderTarget),u=V(i);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,i.width,i.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+r,e.RENDERBUFFER,s.__webglColorRenderbuffer[r])}e.bindRenderbuffer(e.RENDERBUFFER,null),i.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),O(s.__webglDepthRenderbuffer,i,!0)),r.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){r.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),I(e.TEXTURE_CUBE_MAP,n);for(let r=0;r<6;r++)if(n.mipmaps&&n.mipmaps.length>0)for(let a=0;a<n.mipmaps.length;a++)N(s.__webglFramebuffer[r][a],i,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+r,a);else N(s.__webglFramebuffer[r],i,n,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);_(n)&&y(e.TEXTURE_CUBE_MAP),r.unbindTexture()}else if(d){for(let n=0,o=h.length;n<o;n++){let o=h[n],l=a.get(o),c=e.TEXTURE_2D;(i.isWebGL3DRenderTarget||i.isWebGLArrayRenderTarget)&&(c=i.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),r.bindTexture(c,l.__webglTexture),I(c,o),N(s.__webglFramebuffer,i,o,e.COLOR_ATTACHMENT0+n,c,0),_(o)&&y(c)}r.unbindTexture()}else{let a=e.TEXTURE_2D;if((i.isWebGL3DRenderTarget||i.isWebGLArrayRenderTarget)&&(a=i.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),r.bindTexture(a,c.__webglTexture),I(a,n),n.mipmaps&&n.mipmaps.length>0)for(let r=0;r<n.mipmaps.length;r++)N(s.__webglFramebuffer[r],i,n,e.COLOR_ATTACHMENT0,a,r);else N(s.__webglFramebuffer,i,n,e.COLOR_ATTACHMENT0,a,0);_(n)&&y(a),r.unbindTexture()}i.depthBuffer&&B(i)},this.updateRenderTargetMipmap=function(i){let n=i.textures;for(let s=0,o=n.length;s<o;s++){let o=n[s];if(_(o)){let n=i.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:i.isWebGL3DRenderTarget?e.TEXTURE_3D:i.isWebGLArrayRenderTarget||i.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D,s=a.get(o).__webglTexture;r.bindTexture(n,s),y(n),r.unbindTexture()}}},this.updateMultisampleRenderTarget=function(i){if(i.samples>0){if(!1===H(i)){let n=i.textures,s=i.width,o=i.height,l=e.COLOR_BUFFER_BIT,c=i.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,h=a.get(i),d=n.length>1;if(d)for(let i=0;i<n.length;i++)r.bindFramebuffer(e.FRAMEBUFFER,h.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.RENDERBUFFER,null),r.bindFramebuffer(e.FRAMEBUFFER,h.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.TEXTURE_2D,null,0);r.bindFramebuffer(e.READ_FRAMEBUFFER,h.__webglMultisampledFramebuffer);let p=i.texture.mipmaps;p&&p.length>0?r.bindFramebuffer(e.DRAW_FRAMEBUFFER,h.__webglFramebuffer[0]):r.bindFramebuffer(e.DRAW_FRAMEBUFFER,h.__webglFramebuffer);for(let r=0;r<n.length;r++){if(i.resolveDepthBuffer&&(i.depthBuffer&&(l|=e.DEPTH_BUFFER_BIT),i.stencilBuffer&&i.resolveStencilBuffer&&(l|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,h.__webglColorRenderbuffer[r]);let i=a.get(n[r]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0)}e.blitFramebuffer(0,0,s,o,0,0,s,o,l,e.NEAREST),!0===u&&(z.length=0,k.length=0,z.push(e.COLOR_ATTACHMENT0+r),i.depthBuffer&&!1===i.resolveDepthBuffer&&(z.push(c),k.push(c),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,k)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,z))}if(r.bindFramebuffer(e.READ_FRAMEBUFFER,null),r.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let i=0;i<n.length;i++){r.bindFramebuffer(e.FRAMEBUFFER,h.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.RENDERBUFFER,h.__webglColorRenderbuffer[i]);let s=a.get(n[i]).__webglTexture;r.bindFramebuffer(e.FRAMEBUFFER,h.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.TEXTURE_2D,s,0)}r.bindFramebuffer(e.DRAW_FRAMEBUFFER,h.__webglMultisampledFramebuffer)}else if(i.depthBuffer&&!1===i.resolveDepthBuffer&&u){let r=i.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[r])}}},this.setupDepthRenderbuffer=B,this.setupFrameBufferTexture=N,this.useMultisampledRTT=H}function tM(e,i){return{convert:function(r,a=n.jf0){let s,o=n.ppV.getTransfer(a);if(r===n.OUM)return e.UNSIGNED_BYTE;if(r===n.Wew)return e.UNSIGNED_SHORT_4_4_4_4;if(r===n.gJ2)return e.UNSIGNED_SHORT_5_5_5_1;if(r===n.Dmk)return e.UNSIGNED_INT_5_9_9_9_REV;if(r===n.tJf)return e.BYTE;if(r===n.fBL)return e.SHORT;if(r===n.cHt)return e.UNSIGNED_SHORT;if(r===n.Yuy)return e.INT;if(r===n.bkx)return e.UNSIGNED_INT;if(r===n.RQf)return e.FLOAT;if(r===n.ix0)return e.HALF_FLOAT;if(r===n.wrO)return e.ALPHA;if(r===n.HIg)return e.RGB;if(r===n.GWd)return e.RGBA;if(r===n.zdS)return e.DEPTH_COMPONENT;if(r===n.dcC)return e.DEPTH_STENCIL;if(r===n.VT0)return e.RED;if(r===n.ZQM)return e.RED_INTEGER;if(r===n.paN)return e.RG;if(r===n.TkQ)return e.RG_INTEGER;if(r===n.c90)return e.RGBA_INTEGER;if(r===n.IE4||r===n.Nz6||r===n.jR7||r===n.BXX)if(o===n.KLL){if(null===(s=i.get("WEBGL_compressed_texture_s3tc_srgb")))return null;if(r===n.IE4)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===n.Nz6)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===n.jR7)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===n.BXX)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(null===(s=i.get("WEBGL_compressed_texture_s3tc")))return null;if(r===n.IE4)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===n.Nz6)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===n.jR7)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===n.BXX)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(r===n.k6Q||r===n.kTp||r===n.HXV||r===n.pBf){if(null===(s=i.get("WEBGL_compressed_texture_pvrtc")))return null;if(r===n.k6Q)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===n.kTp)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===n.HXV)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===n.pBf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(r===n.CVz||r===n.Riy||r===n.KDk){if(null===(s=i.get("WEBGL_compressed_texture_etc")))return null;if(r===n.CVz||r===n.Riy)return o===n.KLL?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(r===n.KDk)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}if(r===n.qa3||r===n.B_h||r===n.czI||r===n.rSH||r===n.Qrf||r===n.psI||r===n.a5J||r===n._QJ||r===n.uB5||r===n.lyL||r===n.bC7||r===n.y3Z||r===n.ojs||r===n.S$4){if(null===(s=i.get("WEBGL_compressed_texture_astc")))return null;if(r===n.qa3)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===n.B_h)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===n.czI)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===n.rSH)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===n.Qrf)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===n.psI)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===n.a5J)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===n._QJ)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===n.uB5)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===n.lyL)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===n.bC7)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===n.y3Z)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===n.ojs)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===n.S$4)return o===n.KLL?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}if(r===n.Fn||r===n.H23||r===n.W9U){if(null===(s=i.get("EXT_texture_compression_bptc")))return null;if(r===n.Fn)return o===n.KLL?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===n.H23)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===n.W9U)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(r===n.Kef||r===n.XG_||r===n.HO_||r===n.CWW){if(null===(s=i.get("EXT_texture_compression_rgtc")))return null;if(r===n.Fn)return s.COMPRESSED_RED_RGTC1_EXT;if(r===n.XG_)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===n.HO_)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===n.CWW)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return r===n.V3x?e.UNSIGNED_INT_24_8:void 0!==e[r]?e[r]:null}}}class tb extends n.gPd{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}}let tS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,tE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class tT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i){if(null===this.texture){let r=new tb(e.texture);(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(null!==this.texture&&null===this.mesh){let i=e.cameras[0].viewport,r=new n.BKk({vertexShader:tS,fragmentShader:tE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new n.eaF(new n.bdM(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tw extends n.Qev{constructor(e,i){super();let r=this,s=null,o=1,l=null,c="local-floor",h=1,u=null,d=null,p=null,f=null,m=null,g=null,v=new tT,_={},y=i.getContextAttributes(),x=null,M=null,b=[],S=[],E=new n.I9Y,T=null,w=new n.ubm;w.viewport=new n.IUQ;let A=new n.ubm;A.viewport=new n.IUQ;let R=[w,A],C=new n.nZQ,P=null,I=null;function L(e){let i=S.indexOf(e.inputSource);if(-1===i)return;let r=b[i];void 0!==r&&(r.update(e.inputSource,e.frame,u||l),r.dispatchEvent({type:e.type,data:e.inputSource}))}function D(){s.removeEventListener("select",L),s.removeEventListener("selectstart",L),s.removeEventListener("selectend",L),s.removeEventListener("squeeze",L),s.removeEventListener("squeezestart",L),s.removeEventListener("squeezeend",L),s.removeEventListener("end",D),s.removeEventListener("inputsourceschange",U);for(let e=0;e<b.length;e++){let i=S[e];null!==i&&(S[e]=null,b[e].disconnect(i))}for(let e in P=null,I=null,v.reset(),_)delete _[e];e.setRenderTarget(x),m=null,f=null,p=null,s=null,M=null,z.stop(),r.isPresenting=!1,e.setPixelRatio(T),e.setSize(E.width,E.height,!1),r.dispatchEvent({type:"sessionend"})}function U(e){for(let i=0;i<e.removed.length;i++){let r=e.removed[i],n=S.indexOf(r);n>=0&&(S[n]=null,b[n].disconnect(r))}for(let i=0;i<e.added.length;i++){let r=e.added[i],n=S.indexOf(r);if(-1===n){for(let e=0;e<b.length;e++)if(e>=S.length){S.push(r),n=e;break}else if(null===S[e]){S[e]=r,n=e;break}if(-1===n)break}let a=b[n];a&&a.connect(r)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let i=b[e];return void 0===i&&(i=new n.R3r,b[e]=i),i.getTargetRaySpace()},this.getControllerGrip=function(e){let i=b[e];return void 0===i&&(i=new n.R3r,b[e]=i),i.getGripSpace()},this.getHand=function(e){let i=b[e];return void 0===i&&(i=new n.R3r,b[e]=i),i.getHandSpace()},this.setFramebufferScaleFactor=function(e){o=e,!0===r.isPresenting&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(e){c=e,!0===r.isPresenting&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||l},this.setReferenceSpace=function(e){u=e},this.getBaseLayer=function(){return null!==f?f:m},this.getBinding=function(){return p},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(a){if(null!==(s=a)){if(x=e.getRenderTarget(),s.addEventListener("select",L),s.addEventListener("selectstart",L),s.addEventListener("selectend",L),s.addEventListener("squeeze",L),s.addEventListener("squeezestart",L),s.addEventListener("squeezeend",L),s.addEventListener("end",D),s.addEventListener("inputsourceschange",U),!0!==y.xrCompatible&&await i.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(E),"undefined"!=typeof XRWebGLBinding&&(p=new XRWebGLBinding(s,i)),null!==p&&"createProjectionLayer"in XRWebGLBinding.prototype){let r=null,a=null,l=null;y.depth&&(l=y.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,r=y.stencil?n.dcC:n.zdS,a=y.stencil?n.V3x:n.bkx);let c={colorFormat:i.RGBA8,depthFormat:l,scaleFactor:o};f=p.createProjectionLayer(c),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),M=new n.nWS(f.textureWidth,f.textureHeight,{format:n.GWd,type:n.OUM,depthTexture:new n.VCu(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,r),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:4*!!y.antialias,resolveDepthBuffer:!1===f.ignoreDepthValues,resolveStencilBuffer:!1===f.ignoreDepthValues})}else{let r={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:o};m=new XRWebGLLayer(s,i,r),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new n.nWS(m.framebufferWidth,m.framebufferHeight,{format:n.GWd,type:n.OUM,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:!1===m.ignoreDepthValues,resolveStencilBuffer:!1===m.ignoreDepthValues})}M.isXRRenderTarget=!0,this.setFoveation(h),u=null,l=await s.requestReferenceSpace(c),z.setContext(s),z.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(null!==s)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};let N=new n.Pq0,O=new n.Pq0;function F(e,i){null===i?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(i.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){var i,r,a;if(null===s)return;let o=e.near,l=e.far;null!==v.texture&&(v.depthNear>0&&(o=v.depthNear),v.depthFar>0&&(l=v.depthFar)),C.near=A.near=w.near=o,C.far=A.far=w.far=l,(P!==C.near||I!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),P=C.near,I=C.far),C.layers.mask=6|e.layers.mask,w.layers.mask=3&C.layers.mask,A.layers.mask=5&C.layers.mask;let c=e.parent,h=C.cameras;F(C,c);for(let e=0;e<h.length;e++)F(h[e],c);2===h.length?function(e,i,r){N.setFromMatrixPosition(i.matrixWorld),O.setFromMatrixPosition(r.matrixWorld);let n=N.distanceTo(O),a=i.projectionMatrix.elements,s=r.projectionMatrix.elements,o=a[14]/(a[10]-1),l=a[14]/(a[10]+1),c=(a[9]+1)/a[5],h=(a[9]-1)/a[5],u=(a[8]-1)/a[0],d=(s[8]+1)/s[0],p=n/(-u+d),f=-(p*u);if(i.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(f),e.translateZ(p),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),-1===a[10])e.projectionMatrix.copy(i.projectionMatrix),e.projectionMatrixInverse.copy(i.projectionMatrixInverse);else{let i=o+p,r=l+p;e.projectionMatrix.makePerspective(o*u-f,o*d+(n-f),c*l/r*i,h*l/r*i,i,r),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}(C,w,A):C.projectionMatrix.copy(w.projectionMatrix),i=e,r=C,null===(a=c)?i.matrix.copy(r.matrixWorld):(i.matrix.copy(a.matrixWorld),i.matrix.invert(),i.matrix.multiply(r.matrixWorld)),i.matrix.decompose(i.position,i.quaternion,i.scale),i.updateMatrixWorld(!0),i.projectionMatrix.copy(r.projectionMatrix),i.projectionMatrixInverse.copy(r.projectionMatrixInverse),i.isPerspectiveCamera&&(i.fov=2*n.a55*Math.atan(1/i.projectionMatrix.elements[5]),i.zoom=1)},this.getCamera=function(){return C},this.getFoveation=function(){if(null!==f||null!==m)return h},this.setFoveation=function(e){h=e,null!==f&&(f.fixedFoveation=e),null!==m&&void 0!==m.fixedFoveation&&(m.fixedFoveation=e)},this.hasDepthSensing=function(){return null!==v.texture},this.getDepthSensingMesh=function(){return v.getMesh(C)},this.getCameraTexture=function(e){return _[e]};let B=null,z=new a;z.setAnimationLoop(function(i,a){if(d=a.getViewerPose(u||l),g=a,null!==d){let i=d.views;null!==m&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let r=!1;i.length!==C.cameras.length&&(C.cameras.length=0,r=!0);for(let a=0;a<i.length;a++){let s=i[a],o=null;if(null!==m)o=m.getViewport(s);else{let i=p.getViewSubImage(f,s);o=i.viewport,0===a&&(e.setRenderTargetTextures(M,i.colorTexture,i.depthStencilTexture),e.setRenderTarget(M))}let l=R[a];void 0===l&&((l=new n.ubm).layers.enable(a),l.viewport=new n.IUQ,R[a]=l),l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.projectionMatrix.fromArray(s.projectionMatrix),l.projectionMatrixInverse.copy(l.projectionMatrix).invert(),l.viewport.set(o.x,o.y,o.width,o.height),0===a&&(C.matrix.copy(l.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),!0===r&&C.cameras.push(l)}let a=s.enabledFeatures;if(a&&a.includes("depth-sensing")&&"gpu-optimized"==s.depthUsage&&p){let e=p.getDepthInformation(i[0]);e&&e.isValid&&e.texture&&v.init(e,s.renderState)}if(a&&a.includes("camera-access")&&(e.state.unbindTexture(),p))for(let e=0;e<i.length;e++){let r=i[e].camera;if(r){let e=_[r];e||(e=new tb,_[r]=e);let i=p.getCameraImage(r);e.sourceTexture=i}}}for(let e=0;e<b.length;e++){let i=S[e],r=b[e];null!==i&&void 0!==r&&r.update(i,a,u||l)}B&&B(i,a),a.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:a}),g=null}),this.setAnimationLoop=function(e){B=e},this.dispose=function(){}}}let tA=new n.O9p,tR=new n.kn4;function tC(e,i){function r(e,i){!0===e.matrixAutoUpdate&&e.updateMatrix(),i.value.copy(e.matrix)}function a(e,a){e.opacity.value=a.opacity,a.color&&e.diffuse.value.copy(a.color),a.emissive&&e.emissive.value.copy(a.emissive).multiplyScalar(a.emissiveIntensity),a.map&&(e.map.value=a.map,r(a.map,e.mapTransform)),a.alphaMap&&(e.alphaMap.value=a.alphaMap,r(a.alphaMap,e.alphaMapTransform)),a.bumpMap&&(e.bumpMap.value=a.bumpMap,r(a.bumpMap,e.bumpMapTransform),e.bumpScale.value=a.bumpScale,a.side===n.hsX&&(e.bumpScale.value*=-1)),a.normalMap&&(e.normalMap.value=a.normalMap,r(a.normalMap,e.normalMapTransform),e.normalScale.value.copy(a.normalScale),a.side===n.hsX&&e.normalScale.value.negate()),a.displacementMap&&(e.displacementMap.value=a.displacementMap,r(a.displacementMap,e.displacementMapTransform),e.displacementScale.value=a.displacementScale,e.displacementBias.value=a.displacementBias),a.emissiveMap&&(e.emissiveMap.value=a.emissiveMap,r(a.emissiveMap,e.emissiveMapTransform)),a.specularMap&&(e.specularMap.value=a.specularMap,r(a.specularMap,e.specularMapTransform)),a.alphaTest>0&&(e.alphaTest.value=a.alphaTest);let s=i.get(a),o=s.envMap,l=s.envMapRotation;o&&(e.envMap.value=o,tA.copy(l),tA.x*=-1,tA.y*=-1,tA.z*=-1,o.isCubeTexture&&!1===o.isRenderTargetTexture&&(tA.y*=-1,tA.z*=-1),e.envMapRotation.value.setFromMatrix4(tR.makeRotationFromEuler(tA)),e.flipEnvMap.value=o.isCubeTexture&&!1===o.isRenderTargetTexture?-1:1,e.reflectivity.value=a.reflectivity,e.ior.value=a.ior,e.refractionRatio.value=a.refractionRatio),a.lightMap&&(e.lightMap.value=a.lightMap,e.lightMapIntensity.value=a.lightMapIntensity,r(a.lightMap,e.lightMapTransform)),a.aoMap&&(e.aoMap.value=a.aoMap,e.aoMapIntensity.value=a.aoMapIntensity,r(a.aoMap,e.aoMapTransform))}return{refreshFogUniforms:function(i,r){r.color.getRGB(i.fogColor.value,(0,n._Ut)(e)),r.isFog?(i.fogNear.value=r.near,i.fogFar.value=r.far):r.isFogExp2&&(i.fogDensity.value=r.density)},refreshMaterialUniforms:function(e,s,o,l,c){var h,u,d,p,f,m,g,v,_,y,x,M,b,S,E,T,w,A,R,C,P;s.isMeshBasicMaterial||s.isMeshLambertMaterial?a(e,s):s.isMeshToonMaterial?(a(e,s),h=e,(u=s).gradientMap&&(h.gradientMap.value=u.gradientMap)):s.isMeshPhongMaterial?(a(e,s),d=e,p=s,d.specular.value.copy(p.specular),d.shininess.value=Math.max(p.shininess,1e-4)):s.isMeshStandardMaterial?(a(e,s),f=e,m=s,f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,r(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,r(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity),s.isMeshPhysicalMaterial&&(g=e,v=s,_=c,g.ior.value=v.ior,v.sheen>0&&(g.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),g.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(g.sheenColorMap.value=v.sheenColorMap,r(v.sheenColorMap,g.sheenColorMapTransform)),v.sheenRoughnessMap&&(g.sheenRoughnessMap.value=v.sheenRoughnessMap,r(v.sheenRoughnessMap,g.sheenRoughnessMapTransform))),v.clearcoat>0&&(g.clearcoat.value=v.clearcoat,g.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(g.clearcoatMap.value=v.clearcoatMap,r(v.clearcoatMap,g.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,r(v.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(g.clearcoatNormalMap.value=v.clearcoatNormalMap,r(v.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===n.hsX&&g.clearcoatNormalScale.value.negate())),v.dispersion>0&&(g.dispersion.value=v.dispersion),v.iridescence>0&&(g.iridescence.value=v.iridescence,g.iridescenceIOR.value=v.iridescenceIOR,g.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(g.iridescenceMap.value=v.iridescenceMap,r(v.iridescenceMap,g.iridescenceMapTransform)),v.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=v.iridescenceThicknessMap,r(v.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),v.transmission>0&&(g.transmission.value=v.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),v.transmissionMap&&(g.transmissionMap.value=v.transmissionMap,r(v.transmissionMap,g.transmissionMapTransform)),g.thickness.value=v.thickness,v.thicknessMap&&(g.thicknessMap.value=v.thicknessMap,r(v.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=v.attenuationDistance,g.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(g.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(g.anisotropyMap.value=v.anisotropyMap,r(v.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=v.specularIntensity,g.specularColor.value.copy(v.specularColor),v.specularColorMap&&(g.specularColorMap.value=v.specularColorMap,r(v.specularColorMap,g.specularColorMapTransform)),v.specularIntensityMap&&(g.specularIntensityMap.value=v.specularIntensityMap,r(v.specularIntensityMap,g.specularIntensityMapTransform)))):s.isMeshMatcapMaterial?(a(e,s),y=e,(x=s).matcap&&(y.matcap.value=x.matcap)):s.isMeshDepthMaterial?a(e,s):s.isMeshDistanceMaterial?(a(e,s),function(e,r){let n=i.get(r).light;e.referencePosition.value.setFromMatrixPosition(n.matrixWorld),e.nearDistance.value=n.shadow.camera.near,e.farDistance.value=n.shadow.camera.far}(e,s)):s.isMeshNormalMaterial?a(e,s):s.isLineBasicMaterial?(M=e,b=s,M.diffuse.value.copy(b.color),M.opacity.value=b.opacity,b.map&&(M.map.value=b.map,r(b.map,M.mapTransform)),s.isLineDashedMaterial&&(S=e,E=s,S.dashSize.value=E.dashSize,S.totalSize.value=E.dashSize+E.gapSize,S.scale.value=E.scale)):s.isPointsMaterial?(T=e,w=s,A=o,R=l,T.diffuse.value.copy(w.color),T.opacity.value=w.opacity,T.size.value=w.size*A,T.scale.value=.5*R,w.map&&(T.map.value=w.map,r(w.map,T.uvTransform)),w.alphaMap&&(T.alphaMap.value=w.alphaMap,r(w.alphaMap,T.alphaMapTransform)),w.alphaTest>0&&(T.alphaTest.value=w.alphaTest)):s.isSpriteMaterial?(C=e,P=s,C.diffuse.value.copy(P.color),C.opacity.value=P.opacity,C.rotation.value=P.rotation,P.map&&(C.map.value=P.map,r(P.map,C.mapTransform)),P.alphaMap&&(C.alphaMap.value=P.alphaMap,r(P.alphaMap,C.alphaMapTransform)),P.alphaTest>0&&(C.alphaTest.value=P.alphaTest)):s.isShadowMaterial?(e.color.value.copy(s.color),e.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}}}function tP(e,i,r,n){let a={},s={},o=[],l=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e){let i={boundary:0,storage:0};return"number"==typeof e||"boolean"==typeof e?(i.boundary=4,i.storage=4):e.isVector2?(i.boundary=8,i.storage=8):e.isVector3||e.isColor?(i.boundary=16,i.storage=12):e.isVector4?(i.boundary=16,i.storage=16):e.isMatrix3?(i.boundary=48,i.storage=48):e.isMatrix4?(i.boundary=64,i.storage=64):e.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",e),i}function h(i){let r=i.target;r.removeEventListener("dispose",h);let n=o.indexOf(r.__bindingPointIndex);o.splice(n,1),e.deleteBuffer(a[r.id]),delete a[r.id],delete s[r.id]}return{bind:function(e,i){let r=i.program;n.uniformBlockBinding(e,r)},update:function(r,u){let d=a[r.id];void 0===d&&(function(e){let i=e.uniforms,r=0;for(let e=0,n=i.length;e<n;e++){let n=Array.isArray(i[e])?i[e]:[i[e]];for(let e=0,i=n.length;e<i;e++){let i=n[e],a=Array.isArray(i.value)?i.value:[i.value];for(let e=0,n=a.length;e<n;e++){let n=c(a[e]),s=r%16,o=s%n.boundary,l=s+o;r+=o,0!==l&&16-l<n.storage&&(r+=16-l),i.__data=new Float32Array(n.storage/Float32Array.BYTES_PER_ELEMENT),i.__offset=r,r+=n.storage}}}let n=r%16;n>0&&(r+=16-n),e.__size=r,e.__cache={}}(r),d=function(i){let r=function(){for(let e=0;e<l;e++)if(-1===o.indexOf(e))return o.push(e),e;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}();i.__bindingPointIndex=r;let n=e.createBuffer(),a=i.__size,s=i.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,a,s),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,r,n),n}(r),a[r.id]=d,r.addEventListener("dispose",h));let p=u.program;n.updateUBOMapping(r,p);let f=i.render.frame;s[r.id]!==f&&(function(i){let r=a[i.id],n=i.uniforms,s=i.__cache;e.bindBuffer(e.UNIFORM_BUFFER,r);for(let i=0,r=n.length;i<r;i++){let r=Array.isArray(n[i])?n[i]:[n[i]];for(let n=0,a=r.length;n<a;n++){let a=r[n];if(!0===function(e,i,r,n){let a=e.value,s=i+"_"+r;if(void 0===n[s])return"number"==typeof a||"boolean"==typeof a?n[s]=a:n[s]=a.clone(),!0;{let e=n[s];if("number"==typeof a||"boolean"==typeof a){if(e!==a)return n[s]=a,!0}else if(!1===e.equals(a))return e.copy(a),!0}return!1}(a,i,n,s)){let i=a.__offset,r=Array.isArray(a.value)?a.value:[a.value],n=0;for(let s=0;s<r.length;s++){let o=r[s],l=c(o);"number"==typeof o||"boolean"==typeof o?(a.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,i+n,a.__data)):o.isMatrix3?(a.__data[0]=o.elements[0],a.__data[1]=o.elements[1],a.__data[2]=o.elements[2],a.__data[3]=0,a.__data[4]=o.elements[3],a.__data[5]=o.elements[4],a.__data[6]=o.elements[5],a.__data[7]=0,a.__data[8]=o.elements[6],a.__data[9]=o.elements[7],a.__data[10]=o.elements[8],a.__data[11]=0):(o.toArray(a.__data,n),n+=l.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,i,a.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}(r),s[r.id]=f)},dispose:function(){for(let i in a)e.deleteBuffer(a[i]);o=[],a={},s={}}}}class tI{constructor(e={}){let i,r,o,l,c,h,u,d,y,x,M,b,S,E,T,w,A,R,C,P,I,L,D,U,N,{canvas:G=(0,n.lPF)(),context:W=null,depth:X=!0,stencil:j=!1,alpha:q=!1,antialias:Y=!1,premultipliedAlpha:K=!0,preserveDrawingBuffer:J=!1,powerPreference:Z="default",failIfMajorPerformanceCaveat:Q=!1,reversedDepthBuffer:$=!1}=e;if(this.isWebGLRenderer=!0,null!==W){if("undefined"!=typeof WebGLRenderingContext&&W instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");i=W.getContextAttributes().alpha}else i=q;let ee=new Uint32Array(4),et=new Int32Array(4),ei=null,er=null,en=[],ea=[];this.domElement=G,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=n.y_p,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let es=this,eo=!1;this._outputColorSpace=n.er$;let el=0,ec=0,eh=null,eu=-1,ed=null,ep=new n.IUQ,ef=new n.IUQ,em=null,eg=new n.Q1f(0),ev=0,e_=G.width,ey=G.height,ex=1,eM=null,eb=null,eS=new n.IUQ(0,0,e_,ey),eE=new n.IUQ(0,0,e_,ey),eT=!1,ew=new n.PPD,eA=!1,eR=!1,eC=new n.kn4,eP=new n.Pq0,eI=new n.IUQ,eL={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},eD=!1;function eU(){return null===eh?ex:1}let eN=W;function eO(e,i){return G.getContext(e,i)}try{if("setAttribute"in G&&G.setAttribute("data-engine",`three.js r${n.sPf}`),G.addEventListener("webglcontextlost",ez,!1),G.addEventListener("webglcontextrestored",ek,!1),G.addEventListener("webglcontextcreationerror",eV,!1),null===eN){let e="webgl2";if(eN=eO(e,{alpha:!0,depth:X,stencil:j,antialias:Y,premultipliedAlpha:K,preserveDrawingBuffer:J,powerPreference:Z,failIfMajorPerformanceCaveat:Q}),null===eN)if(eO(e))throw Error("Error creating WebGL context with your selected attributes.");else throw Error("Error creating WebGL context.")}}catch(e){throw console.error("THREE.WebGLRenderer: "+e.message),e}function eF(){(r=new F(eN)).init(),D=new tM(eN,r),o=new g(eN,r,e,D),l=new ty(eN,r),o.reversedDepthBuffer&&$&&l.buffers.depth.setReversed(!0),c=new k(eN),h=new tn,u=new tx(eN,r,l,h,o,D,c),d=new _(es),y=new O(es),x=new s(eN),U=new f(eN,x),M=new B(eN,x,c,U),b=new H(eN,M,x,c),P=new V(eN,o,u),A=new v(h),S=new tr(es,d,y,r,o,U,A),E=new tC(es,h),T=new tl,w=new tf(r),C=new p(es,d,y,l,b,i,K),R=new tv(es,b,o),N=new tP(eN,c,o,l),I=new m(eN,r,c),L=new z(eN,r,c),c.programs=S.programs,es.capabilities=o,es.extensions=r,es.properties=h,es.renderLists=T,es.shadowMap=R,es.state=l,es.info=c}eF();let eB=new tw(es,eN);function ez(e){e.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),eo=!0}function ek(){console.log("THREE.WebGLRenderer: Context Restored."),eo=!1;let e=c.autoReset,i=R.enabled,r=R.autoUpdate,n=R.needsUpdate,a=R.type;eF(),c.autoReset=e,R.enabled=i,R.autoUpdate=r,R.needsUpdate=n,R.type=a}function eV(e){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",e.statusMessage)}function eH(e){var i;let r=e.target;r.removeEventListener("dispose",eH),function(e){let i=h.get(e).programs;void 0!==i&&(i.forEach(function(e){S.releaseProgram(e)}),e.isShaderMaterial&&S.releaseShaderCache(e))}(i=r),h.remove(i)}function eG(e,i,r){!0===e.transparent&&e.side===n.$EB&&!1===e.forceSinglePass?(e.side=n.hsX,e.needsUpdate=!0,e0(e,i,r),e.side=n.hB5,e.needsUpdate=!0,e0(e,i,r),e.side=n.$EB):e0(e,i,r)}this.xr=eB,this.getContext=function(){return eN},this.getContextAttributes=function(){return eN.getContextAttributes()},this.forceContextLoss=function(){let e=r.get("WEBGL_lose_context");e&&e.loseContext()},this.forceContextRestore=function(){let e=r.get("WEBGL_lose_context");e&&e.restoreContext()},this.getPixelRatio=function(){return ex},this.setPixelRatio=function(e){void 0!==e&&(ex=e,this.setSize(e_,ey,!1))},this.getSize=function(e){return e.set(e_,ey)},this.setSize=function(e,i,r=!0){if(eB.isPresenting)return void console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");e_=e,ey=i,G.width=Math.floor(e*ex),G.height=Math.floor(i*ex),!0===r&&(G.style.width=e+"px",G.style.height=i+"px"),this.setViewport(0,0,e,i)},this.getDrawingBufferSize=function(e){return e.set(e_*ex,ey*ex).floor()},this.setDrawingBufferSize=function(e,i,r){e_=e,ey=i,ex=r,G.width=Math.floor(e*r),G.height=Math.floor(i*r),this.setViewport(0,0,e,i)},this.getCurrentViewport=function(e){return e.copy(ep)},this.getViewport=function(e){return e.copy(eS)},this.setViewport=function(e,i,r,n){e.isVector4?eS.set(e.x,e.y,e.z,e.w):eS.set(e,i,r,n),l.viewport(ep.copy(eS).multiplyScalar(ex).round())},this.getScissor=function(e){return e.copy(eE)},this.setScissor=function(e,i,r,n){e.isVector4?eE.set(e.x,e.y,e.z,e.w):eE.set(e,i,r,n),l.scissor(ef.copy(eE).multiplyScalar(ex).round())},this.getScissorTest=function(){return eT},this.setScissorTest=function(e){l.setScissorTest(eT=e)},this.setOpaqueSort=function(e){eM=e},this.setTransparentSort=function(e){eb=e},this.getClearColor=function(e){return e.copy(C.getClearColor())},this.setClearColor=function(){C.setClearColor(...arguments)},this.getClearAlpha=function(){return C.getClearAlpha()},this.setClearAlpha=function(){C.setClearAlpha(...arguments)},this.clear=function(e=!0,i=!0,r=!0){let a=0;if(e){let e=!1;if(null!==eh){let i=eh.texture.format;e=i===n.c90||i===n.TkQ||i===n.ZQM}if(e){let e=eh.texture.type,i=e===n.OUM||e===n.bkx||e===n.cHt||e===n.V3x||e===n.Wew||e===n.gJ2,r=C.getClearColor(),a=C.getClearAlpha(),s=r.r,o=r.g,l=r.b;i?(ee[0]=s,ee[1]=o,ee[2]=l,ee[3]=a,eN.clearBufferuiv(eN.COLOR,0,ee)):(et[0]=s,et[1]=o,et[2]=l,et[3]=a,eN.clearBufferiv(eN.COLOR,0,et))}else a|=eN.COLOR_BUFFER_BIT}i&&(a|=eN.DEPTH_BUFFER_BIT),r&&(a|=eN.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(0xffffffff)),eN.clear(a)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){G.removeEventListener("webglcontextlost",ez,!1),G.removeEventListener("webglcontextrestored",ek,!1),G.removeEventListener("webglcontextcreationerror",eV,!1),C.dispose(),T.dispose(),w.dispose(),h.dispose(),d.dispose(),y.dispose(),b.dispose(),U.dispose(),N.dispose(),S.dispose(),eB.dispose(),eB.removeEventListener("sessionstart",eX),eB.removeEventListener("sessionend",eq),eY.stop()},this.renderBufferDirect=function(e,i,a,s,c,p){let f;null===i&&(i=eL);let m=c.isMesh&&0>c.matrixWorld.determinant(),g=function(e,i,r,a,s){var c,p;!0!==i.isScene&&(i=eL),u.resetTextureUnits();let f=i.fog,m=a.isMeshStandardMaterial?i.environment:null,g=null===eh?es.outputColorSpace:!0===eh.isXRRenderTarget?eh.texture.colorSpace:n.Zr2,v=(a.isMeshStandardMaterial?y:d).get(a.envMap||m),_=!0===a.vertexColors&&!!r.attributes.color&&4===r.attributes.color.itemSize,x=!!r.attributes.tangent&&(!!a.normalMap||a.anisotropy>0),M=!!r.morphAttributes.position,b=!!r.morphAttributes.normal,S=!!r.morphAttributes.color,T=n.y_p;a.toneMapped&&(null===eh||!0===eh.isXRRenderTarget)&&(T=es.toneMapping);let w=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,R=void 0!==w?w.length:0,C=h.get(a),I=er.state.lights;if(!0===eA&&(!0===eR||e!==ed)){let i=e===ed&&a.id===eu;A.setState(a,e,i)}let L=!1;a.version===C.__version?C.needsLights&&C.lightsStateVersion!==I.state.version||C.outputColorSpace!==g||s.isBatchedMesh&&!1===C.batching?L=!0:s.isBatchedMesh||!0!==C.batching?s.isBatchedMesh&&!0===C.batchingColor&&null===s.colorTexture||s.isBatchedMesh&&!1===C.batchingColor&&null!==s.colorTexture||s.isInstancedMesh&&!1===C.instancing?L=!0:s.isInstancedMesh||!0!==C.instancing?s.isSkinnedMesh&&!1===C.skinning?L=!0:s.isSkinnedMesh||!0!==C.skinning?s.isInstancedMesh&&!0===C.instancingColor&&null===s.instanceColor||s.isInstancedMesh&&!1===C.instancingColor&&null!==s.instanceColor||s.isInstancedMesh&&!0===C.instancingMorph&&null===s.morphTexture||s.isInstancedMesh&&!1===C.instancingMorph&&null!==s.morphTexture||C.envMap!==v||!0===a.fog&&C.fog!==f||void 0!==C.numClippingPlanes&&(C.numClippingPlanes!==A.numPlanes||C.numIntersection!==A.numIntersection)||C.vertexAlphas!==_||C.vertexTangents!==x||C.morphTargets!==M||C.morphNormals!==b||C.morphColors!==S||C.toneMapping!==T?L=!0:C.morphTargetsCount!==R&&(L=!0):L=!0:L=!0:L=!0:(L=!0,C.__version=a.version);let D=C.currentProgram;!0===L&&(D=e0(a,i,s));let U=!1,O=!1,F=!1,B=D.getUniforms(),z=C.uniforms;if(l.useProgram(D.program)&&(U=!0,O=!0,F=!0),a.id!==eu&&(eu=a.id,O=!0),U||ed!==e){l.buffers.depth.getReversed()&&!0!==e.reversedDepth&&(e._reversedDepth=!0,e.updateProjectionMatrix()),B.setValue(eN,"projectionMatrix",e.projectionMatrix),B.setValue(eN,"viewMatrix",e.matrixWorldInverse);let i=B.map.cameraPosition;void 0!==i&&i.setValue(eN,eP.setFromMatrixPosition(e.matrixWorld)),o.logarithmicDepthBuffer&&B.setValue(eN,"logDepthBufFC",2/(Math.log(e.far+1)/Math.LN2)),(a.isMeshPhongMaterial||a.isMeshToonMaterial||a.isMeshLambertMaterial||a.isMeshBasicMaterial||a.isMeshStandardMaterial||a.isShaderMaterial)&&B.setValue(eN,"isOrthographic",!0===e.isOrthographicCamera),ed!==e&&(ed=e,O=!0,F=!0)}if(s.isSkinnedMesh){B.setOptional(eN,s,"bindMatrix"),B.setOptional(eN,s,"bindMatrixInverse");let e=s.skeleton;e&&(null===e.boneTexture&&e.computeBoneTexture(),B.setValue(eN,"boneTexture",e.boneTexture,u))}s.isBatchedMesh&&(B.setOptional(eN,s,"batchingTexture"),B.setValue(eN,"batchingTexture",s._matricesTexture,u),B.setOptional(eN,s,"batchingIdTexture"),B.setValue(eN,"batchingIdTexture",s._indirectTexture,u),B.setOptional(eN,s,"batchingColorTexture"),null!==s._colorsTexture&&B.setValue(eN,"batchingColorTexture",s._colorsTexture,u));let k=r.morphAttributes;if((void 0!==k.position||void 0!==k.normal||void 0!==k.color)&&P.update(s,r,D),(O||C.receiveShadow!==s.receiveShadow)&&(C.receiveShadow=s.receiveShadow,B.setValue(eN,"receiveShadow",s.receiveShadow)),a.isMeshGouraudMaterial&&null!==a.envMap&&(z.envMap.value=v,z.flipEnvMap.value=v.isCubeTexture&&!1===v.isRenderTargetTexture?-1:1),a.isMeshStandardMaterial&&null===a.envMap&&null!==i.environment&&(z.envMapIntensity.value=i.environmentIntensity),O&&(B.setValue(eN,"toneMappingExposure",es.toneMappingExposure),C.needsLights&&(c=z,p=F,c.ambientLightColor.needsUpdate=p,c.lightProbe.needsUpdate=p,c.directionalLights.needsUpdate=p,c.directionalLightShadows.needsUpdate=p,c.pointLights.needsUpdate=p,c.pointLightShadows.needsUpdate=p,c.spotLights.needsUpdate=p,c.spotLightShadows.needsUpdate=p,c.rectAreaLights.needsUpdate=p,c.hemisphereLights.needsUpdate=p),f&&!0===a.fog&&E.refreshFogUniforms(z,f),E.refreshMaterialUniforms(z,a,ex,ey,er.state.transmissionRenderTarget[e.id]),ej.upload(eN,e1(C),z,u)),a.isShaderMaterial&&!0===a.uniformsNeedUpdate&&(ej.upload(eN,e1(C),z,u),a.uniformsNeedUpdate=!1),a.isSpriteMaterial&&B.setValue(eN,"center",s.center),B.setValue(eN,"modelViewMatrix",s.modelViewMatrix),B.setValue(eN,"normalMatrix",s.normalMatrix),B.setValue(eN,"modelMatrix",s.matrixWorld),a.isShaderMaterial||a.isRawShaderMaterial){let e=a.uniformsGroups;for(let i=0,r=e.length;i<r;i++){let r=e[i];N.update(r,D),N.bind(r,D)}}return D}(e,i,a,s,c);l.setMaterial(s,m);let v=a.index,_=1;if(!0===s.wireframe){if(void 0===(v=M.getWireframeAttribute(a)))return;_=2}let b=a.drawRange,S=a.attributes.position,T=b.start*_,w=(b.start+b.count)*_;null!==p&&(T=Math.max(T,p.start*_),w=Math.min(w,(p.start+p.count)*_)),null!==v?(T=Math.max(T,0),w=Math.min(w,v.count)):null!=S&&(T=Math.max(T,0),w=Math.min(w,S.count));let R=w-T;if(R<0||R===1/0)return;U.setup(c,s,g,a,v);let C=I;if(null!==v&&(f=x.get(v),(C=L).setIndex(f)),c.isMesh)!0===s.wireframe?(l.setLineWidth(s.wireframeLinewidth*eU()),C.setMode(eN.LINES)):C.setMode(eN.TRIANGLES);else if(c.isLine){let e=s.linewidth;void 0===e&&(e=1),l.setLineWidth(e*eU()),c.isLineSegments?C.setMode(eN.LINES):c.isLineLoop?C.setMode(eN.LINE_LOOP):C.setMode(eN.LINE_STRIP)}else c.isPoints?C.setMode(eN.POINTS):c.isSprite&&C.setMode(eN.TRIANGLES);if(c.isBatchedMesh)if(null!==c._multiDrawInstances)(0,n.mcG)("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),C.renderMultiDrawInstances(c._multiDrawStarts,c._multiDrawCounts,c._multiDrawCount,c._multiDrawInstances);else if(r.get("WEBGL_multi_draw"))C.renderMultiDraw(c._multiDrawStarts,c._multiDrawCounts,c._multiDrawCount);else{let e=c._multiDrawStarts,i=c._multiDrawCounts,r=c._multiDrawCount,n=v?x.get(v).bytesPerElement:1,a=h.get(s).currentProgram.getUniforms();for(let s=0;s<r;s++)a.setValue(eN,"_gl_DrawID",s),C.render(e[s]/n,i[s])}else if(c.isInstancedMesh)C.renderInstances(T,R,c.count);else if(a.isInstancedBufferGeometry){let e=void 0!==a._maxInstanceCount?a._maxInstanceCount:1/0,i=Math.min(a.instanceCount,e);C.renderInstances(T,R,i)}else C.render(T,R)},this.compile=function(e,i,r=null){null===r&&(r=e),(er=w.get(r)).init(i),ea.push(er),r.traverseVisible(function(e){e.isLight&&e.layers.test(i.layers)&&(er.pushLight(e),e.castShadow&&er.pushShadow(e))}),e!==r&&e.traverseVisible(function(e){e.isLight&&e.layers.test(i.layers)&&(er.pushLight(e),e.castShadow&&er.pushShadow(e))}),er.setupLights();let n=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i)if(Array.isArray(i))for(let a=0;a<i.length;a++){let s=i[a];eG(s,r,e),n.add(s)}else eG(i,r,e),n.add(i)}),er=ea.pop(),n},this.compileAsync=function(e,i,n=null){let a=this.compile(e,i,n);return new Promise(i=>{function n(){if(a.forEach(function(e){h.get(e).currentProgram.isReady()&&a.delete(e)}),0===a.size)return void i(e);setTimeout(n,10)}null!==r.get("KHR_parallel_shader_compile")?n():setTimeout(n,10)})};let eW=null;function eX(){eY.stop()}function eq(){eY.start()}let eY=new a;function eK(e,i,r,n){if(!1===e.visible)return;if(e.layers.test(i.layers)){if(e.isGroup)r=e.renderOrder;else if(e.isLOD)!0===e.autoUpdate&&e.update(i);else if(e.isLight)er.pushLight(e),e.castShadow&&er.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||ew.intersectsSprite(e)){n&&eI.setFromMatrixPosition(e.matrixWorld).applyMatrix4(eC);let i=b.update(e),a=e.material;a.visible&&ei.push(e,i,a,r,eI.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||ew.intersectsObject(e))){let i=b.update(e),a=e.material;if(n&&(void 0!==e.boundingSphere?(null===e.boundingSphere&&e.computeBoundingSphere(),eI.copy(e.boundingSphere.center)):(null===i.boundingSphere&&i.computeBoundingSphere(),eI.copy(i.boundingSphere.center)),eI.applyMatrix4(e.matrixWorld).applyMatrix4(eC)),Array.isArray(a)){let n=i.groups;for(let s=0,o=n.length;s<o;s++){let o=n[s],l=a[o.materialIndex];l&&l.visible&&ei.push(e,i,l,r,eI.z,o)}}else a.visible&&ei.push(e,i,a,r,eI.z,null)}}let a=e.children;for(let e=0,s=a.length;e<s;e++)eK(a[e],i,r,n)}function eJ(e,i,r,n){let a=e.opaque,s=e.transmissive,o=e.transparent;er.setupLightsView(r),!0===eA&&A.setGlobalState(es.clippingPlanes,r),n&&l.viewport(ep.copy(n)),a.length>0&&eQ(a,i,r),s.length>0&&eQ(s,i,r),o.length>0&&eQ(o,i,r),l.buffers.depth.setTest(!0),l.buffers.depth.setMask(!0),l.buffers.color.setMask(!0),l.setPolygonOffset(!1)}function eZ(e,i,a,s){if(null!==(!0===a.isScene?a.overrideMaterial:null))return;void 0===er.state.transmissionRenderTarget[s.id]&&(er.state.transmissionRenderTarget[s.id]=new n.nWS(1,1,{generateMipmaps:!0,type:r.has("EXT_color_buffer_half_float")||r.has("EXT_color_buffer_float")?n.ix0:n.OUM,minFilter:n.$_I,samples:4,stencilBuffer:j,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:n.ppV.workingColorSpace}));let o=er.state.transmissionRenderTarget[s.id],l=s.viewport||ep;o.setSize(l.z*es.transmissionResolutionScale,l.w*es.transmissionResolutionScale);let c=es.getRenderTarget(),h=es.getActiveCubeFace(),d=es.getActiveMipmapLevel();es.setRenderTarget(o),es.getClearColor(eg),(ev=es.getClearAlpha())<1&&es.setClearColor(0xffffff,.5),es.clear(),eD&&C.render(a);let p=es.toneMapping;es.toneMapping=n.y_p;let f=s.viewport;if(void 0!==s.viewport&&(s.viewport=void 0),er.setupLightsView(s),!0===eA&&A.setGlobalState(es.clippingPlanes,s),eQ(e,a,s),u.updateMultisampleRenderTarget(o),u.updateRenderTargetMipmap(o),!1===r.has("WEBGL_multisampled_render_to_texture")){let e=!1;for(let r=0,o=i.length;r<o;r++){let o=i[r],l=o.object,c=o.geometry,h=o.material,u=o.group;if(h.side===n.$EB&&l.layers.test(s.layers)){let i=h.side;h.side=n.hsX,h.needsUpdate=!0,e$(l,a,s,c,h,u),h.side=i,h.needsUpdate=!0,e=!0}}!0===e&&(u.updateMultisampleRenderTarget(o),u.updateRenderTargetMipmap(o))}es.setRenderTarget(c,h,d),es.setClearColor(eg,ev),void 0!==f&&(s.viewport=f),es.toneMapping=p}function eQ(e,i,r){let n=!0===i.isScene?i.overrideMaterial:null;for(let a=0,s=e.length;a<s;a++){let s=e[a],o=s.object,l=s.geometry,c=s.group,h=s.material;!0===h.allowOverride&&null!==n&&(h=n),o.layers.test(r.layers)&&e$(o,i,r,l,h,c)}}function e$(e,i,r,a,s,o){e.onBeforeRender(es,i,r,a,s,o),e.modelViewMatrix.multiplyMatrices(r.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),s.onBeforeRender(es,i,r,a,e,o),!0===s.transparent&&s.side===n.$EB&&!1===s.forceSinglePass?(s.side=n.hsX,s.needsUpdate=!0,es.renderBufferDirect(r,i,a,s,e,o),s.side=n.hB5,s.needsUpdate=!0,es.renderBufferDirect(r,i,a,s,e,o),s.side=n.$EB):es.renderBufferDirect(r,i,a,s,e,o),e.onAfterRender(es,i,r,a,s,o)}function e0(e,i,r){var n;!0!==i.isScene&&(i=eL);let a=h.get(e),s=er.state.lights,o=er.state.shadowsArray,l=s.state.version,c=S.getParameters(e,s.state,o,i,r),u=S.getProgramCacheKey(c),p=a.programs;a.environment=e.isMeshStandardMaterial?i.environment:null,a.fog=i.fog,a.envMap=(e.isMeshStandardMaterial?y:d).get(e.envMap||a.environment),a.envMapRotation=null!==a.environment&&null===e.envMap?i.environmentRotation:e.envMapRotation,void 0===p&&(e.addEventListener("dispose",eH),a.programs=p=new Map);let f=p.get(u);if(void 0!==f){if(a.currentProgram===f&&a.lightsStateVersion===l)return e2(e,c),f}else c.uniforms=S.getUniforms(e),e.onBeforeCompile(c,es),f=S.acquireProgram(c,u),p.set(u,f),a.uniforms=c.uniforms;let m=a.uniforms;return(e.isShaderMaterial||e.isRawShaderMaterial)&&!0!==e.clipping||(m.clippingPlanes=A.uniform),e2(e,c),a.needsLights=(n=e).isMeshLambertMaterial||n.isMeshToonMaterial||n.isMeshPhongMaterial||n.isMeshStandardMaterial||n.isShadowMaterial||n.isShaderMaterial&&!0===n.lights,a.lightsStateVersion=l,a.needsLights&&(m.ambientLightColor.value=s.state.ambient,m.lightProbe.value=s.state.probe,m.directionalLights.value=s.state.directional,m.directionalLightShadows.value=s.state.directionalShadow,m.spotLights.value=s.state.spot,m.spotLightShadows.value=s.state.spotShadow,m.rectAreaLights.value=s.state.rectArea,m.ltc_1.value=s.state.rectAreaLTC1,m.ltc_2.value=s.state.rectAreaLTC2,m.pointLights.value=s.state.point,m.pointLightShadows.value=s.state.pointShadow,m.hemisphereLights.value=s.state.hemi,m.directionalShadowMap.value=s.state.directionalShadowMap,m.directionalShadowMatrix.value=s.state.directionalShadowMatrix,m.spotShadowMap.value=s.state.spotShadowMap,m.spotLightMatrix.value=s.state.spotLightMatrix,m.spotLightMap.value=s.state.spotLightMap,m.pointShadowMap.value=s.state.pointShadowMap,m.pointShadowMatrix.value=s.state.pointShadowMatrix),a.currentProgram=f,a.uniformsList=null,f}function e1(e){if(null===e.uniformsList){let i=e.currentProgram.getUniforms();e.uniformsList=ej.seqWithValue(i.seq,e.uniforms)}return e.uniformsList}function e2(e,i){let r=h.get(e);r.outputColorSpace=i.outputColorSpace,r.batching=i.batching,r.batchingColor=i.batchingColor,r.instancing=i.instancing,r.instancingColor=i.instancingColor,r.instancingMorph=i.instancingMorph,r.skinning=i.skinning,r.morphTargets=i.morphTargets,r.morphNormals=i.morphNormals,r.morphColors=i.morphColors,r.morphTargetsCount=i.morphTargetsCount,r.numClippingPlanes=i.numClippingPlanes,r.numIntersection=i.numClipIntersection,r.vertexAlphas=i.vertexAlphas,r.vertexTangents=i.vertexTangents,r.toneMapping=i.toneMapping}eY.setAnimationLoop(function(e){eW&&eW(e)}),"undefined"!=typeof self&&eY.setContext(self),this.setAnimationLoop=function(e){eW=e,eB.setAnimationLoop(e),null===e?eY.stop():eY.start()},eB.addEventListener("sessionstart",eX),eB.addEventListener("sessionend",eq),this.render=function(e,i){if(void 0!==i&&!0!==i.isCamera)return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(!0===eo)return;if(!0===e.matrixWorldAutoUpdate&&e.updateMatrixWorld(),null===i.parent&&!0===i.matrixWorldAutoUpdate&&i.updateMatrixWorld(),!0===eB.enabled&&!0===eB.isPresenting&&(!0===eB.cameraAutoUpdate&&eB.updateCamera(i),i=eB.getCamera()),!0===e.isScene&&e.onBeforeRender(es,e,i,eh),(er=w.get(e,ea.length)).init(i),ea.push(er),eC.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),ew.setFromProjectionMatrix(eC,n.TdN,i.reversedDepth),eR=this.localClippingEnabled,eA=A.init(this.clippingPlanes,eR),(ei=T.get(e,en.length)).init(),en.push(ei),!0===eB.enabled&&!0===eB.isPresenting){let e=es.xr.getDepthSensingMesh();null!==e&&eK(e,i,-1/0,es.sortObjects)}eK(e,i,0,es.sortObjects),ei.finish(),!0===es.sortObjects&&ei.sort(eM,eb),(eD=!1===eB.enabled||!1===eB.isPresenting||!1===eB.hasDepthSensing())&&C.addToRenderList(ei,e),this.info.render.frame++,!0===eA&&A.beginShadows();let r=er.state.shadowsArray;R.render(r,e,i),!0===eA&&A.endShadows(),!0===this.info.autoReset&&this.info.reset();let a=ei.opaque,s=ei.transmissive;if(er.setupLights(),i.isArrayCamera){let r=i.cameras;if(s.length>0)for(let i=0,n=r.length;i<n;i++)eZ(a,s,e,r[i]);eD&&C.render(e);for(let i=0,n=r.length;i<n;i++){let n=r[i];eJ(ei,e,n,n.viewport)}}else s.length>0&&eZ(a,s,e,i),eD&&C.render(e),eJ(ei,e,i);null!==eh&&0===ec&&(u.updateMultisampleRenderTarget(eh),u.updateRenderTargetMipmap(eh)),!0===e.isScene&&e.onAfterRender(es,e,i),U.resetDefaultState(),eu=-1,ed=null,ea.pop(),ea.length>0?(er=ea[ea.length-1],!0===eA&&A.setGlobalState(es.clippingPlanes,er.state.camera)):er=null,en.pop(),ei=en.length>0?en[en.length-1]:null},this.getActiveCubeFace=function(){return el},this.getActiveMipmapLevel=function(){return ec},this.getRenderTarget=function(){return eh},this.setRenderTargetTextures=function(e,i,r){let n=h.get(e);n.__autoAllocateDepthBuffer=!1===e.resolveDepthBuffer,!1===n.__autoAllocateDepthBuffer&&(n.__useRenderToTexture=!1),h.get(e.texture).__webglTexture=i,h.get(e.depthTexture).__webglTexture=n.__autoAllocateDepthBuffer?void 0:r,n.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,i){let r=h.get(e);r.__webglFramebuffer=i,r.__useDefaultFramebuffer=void 0===i};let e3=eN.createFramebuffer();this.setRenderTarget=function(e,i=0,r=0){eh=e,el=i,ec=r;let n=!0,a=null,s=!1,o=!1;if(e){let c=h.get(e);if(void 0!==c.__useDefaultFramebuffer)l.bindFramebuffer(eN.FRAMEBUFFER,null),n=!1;else if(void 0===c.__webglFramebuffer)u.setupRenderTarget(e);else if(c.__hasExternalTextures)u.rebindTextures(e,h.get(e.texture).__webglTexture,h.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let i=e.depthTexture;if(c.__boundDepthTexture!==i){if(null!==i&&h.has(i)&&(e.width!==i.image.width||e.height!==i.image.height))throw Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");u.setupDepthRenderbuffer(e)}}let d=e.texture;(d.isData3DTexture||d.isDataArrayTexture||d.isCompressedArrayTexture)&&(o=!0);let p=h.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(a=Array.isArray(p[i])?p[i][r]:p[i],s=!0):a=e.samples>0&&!1===u.useMultisampledRTT(e)?h.get(e).__webglMultisampledFramebuffer:Array.isArray(p)?p[r]:p,ep.copy(e.viewport),ef.copy(e.scissor),em=e.scissorTest}else ep.copy(eS).multiplyScalar(ex).floor(),ef.copy(eE).multiplyScalar(ex).floor(),em=eT;if(0!==r&&(a=e3),l.bindFramebuffer(eN.FRAMEBUFFER,a)&&n&&l.drawBuffers(e,a),l.viewport(ep),l.scissor(ef),l.setScissorTest(em),s){let n=h.get(e.texture);eN.framebufferTexture2D(eN.FRAMEBUFFER,eN.COLOR_ATTACHMENT0,eN.TEXTURE_CUBE_MAP_POSITIVE_X+i,n.__webglTexture,r)}else if(o)for(let n=0;n<e.textures.length;n++){let a=h.get(e.textures[n]);eN.framebufferTextureLayer(eN.FRAMEBUFFER,eN.COLOR_ATTACHMENT0+n,a.__webglTexture,r,i)}else if(null!==e&&0!==r){let i=h.get(e.texture);eN.framebufferTexture2D(eN.FRAMEBUFFER,eN.COLOR_ATTACHMENT0,eN.TEXTURE_2D,i.__webglTexture,r)}eu=-1},this.readRenderTargetPixels=function(e,i,r,n,a,s,c,u=0){if(!(e&&e.isWebGLRenderTarget))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let d=h.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&void 0!==c&&(d=d[c]),d){l.bindFramebuffer(eN.FRAMEBUFFER,d);try{let l=e.textures[u],c=l.format,h=l.type;if(!o.textureFormatReadable(c))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!o.textureTypeReadable(h))return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");i>=0&&i<=e.width-n&&r>=0&&r<=e.height-a&&(e.textures.length>1&&eN.readBuffer(eN.COLOR_ATTACHMENT0+u),eN.readPixels(i,r,n,a,D.convert(c),D.convert(h),s))}finally{let e=null!==eh?h.get(eh).__webglFramebuffer:null;l.bindFramebuffer(eN.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,i,r,a,s,c,u,d=0){if(!(e&&e.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let p=h.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&void 0!==u&&(p=p[u]),p)if(i>=0&&i<=e.width-a&&r>=0&&r<=e.height-s){l.bindFramebuffer(eN.FRAMEBUFFER,p);let u=e.textures[d],f=u.format,m=u.type;if(!o.textureFormatReadable(f))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!o.textureTypeReadable(m))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let g=eN.createBuffer();eN.bindBuffer(eN.PIXEL_PACK_BUFFER,g),eN.bufferData(eN.PIXEL_PACK_BUFFER,c.byteLength,eN.STREAM_READ),e.textures.length>1&&eN.readBuffer(eN.COLOR_ATTACHMENT0+d),eN.readPixels(i,r,a,s,D.convert(f),D.convert(m),0);let v=null!==eh?h.get(eh).__webglFramebuffer:null;l.bindFramebuffer(eN.FRAMEBUFFER,v);let _=eN.fenceSync(eN.SYNC_GPU_COMMANDS_COMPLETE,0);return eN.flush(),await (0,n.jej)(eN,_,4),eN.bindBuffer(eN.PIXEL_PACK_BUFFER,g),eN.getBufferSubData(eN.PIXEL_PACK_BUFFER,0,c),eN.deleteBuffer(g),eN.deleteSync(_),c}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(e,i=null,r=0){let n=Math.pow(2,-r),a=Math.floor(e.image.width*n),s=Math.floor(e.image.height*n),o=null!==i?i.x:0,c=null!==i?i.y:0;u.setTexture2D(e,0),eN.copyTexSubImage2D(eN.TEXTURE_2D,r,0,0,o,c,a,s),l.unbindTexture()};let e4=eN.createFramebuffer(),e5=eN.createFramebuffer();this.copyTextureToTexture=function(e,i,r=null,a=null,s=0,o=null){let c,d,p,f,m,g,v,_,y,x;null===o&&(0!==s?((0,n.mcG)("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),o=s,s=0):o=0);let M=e.isCompressedTexture?e.mipmaps[o]:e.image;if(null!==r)c=r.max.x-r.min.x,d=r.max.y-r.min.y,p=r.isBox3?r.max.z-r.min.z:1,f=r.min.x,m=r.min.y,g=r.isBox3?r.min.z:0;else{let i=Math.pow(2,-s);c=Math.floor(M.width*i),d=Math.floor(M.height*i),p=e.isDataArrayTexture?M.depth:e.isData3DTexture?Math.floor(M.depth*i):1,f=0,m=0,g=0}null!==a?(v=a.x,_=a.y,y=a.z):(v=0,_=0,y=0);let b=D.convert(i.format),S=D.convert(i.type);i.isData3DTexture?(u.setTexture3D(i,0),x=eN.TEXTURE_3D):i.isDataArrayTexture||i.isCompressedArrayTexture?(u.setTexture2DArray(i,0),x=eN.TEXTURE_2D_ARRAY):(u.setTexture2D(i,0),x=eN.TEXTURE_2D),eN.pixelStorei(eN.UNPACK_FLIP_Y_WEBGL,i.flipY),eN.pixelStorei(eN.UNPACK_PREMULTIPLY_ALPHA_WEBGL,i.premultiplyAlpha),eN.pixelStorei(eN.UNPACK_ALIGNMENT,i.unpackAlignment);let E=eN.getParameter(eN.UNPACK_ROW_LENGTH),T=eN.getParameter(eN.UNPACK_IMAGE_HEIGHT),w=eN.getParameter(eN.UNPACK_SKIP_PIXELS),A=eN.getParameter(eN.UNPACK_SKIP_ROWS),R=eN.getParameter(eN.UNPACK_SKIP_IMAGES);eN.pixelStorei(eN.UNPACK_ROW_LENGTH,M.width),eN.pixelStorei(eN.UNPACK_IMAGE_HEIGHT,M.height),eN.pixelStorei(eN.UNPACK_SKIP_PIXELS,f),eN.pixelStorei(eN.UNPACK_SKIP_ROWS,m),eN.pixelStorei(eN.UNPACK_SKIP_IMAGES,g);let C=e.isDataArrayTexture||e.isData3DTexture,P=i.isDataArrayTexture||i.isData3DTexture;if(e.isDepthTexture){let r=h.get(e),n=h.get(i),a=h.get(r.__renderTarget),u=h.get(n.__renderTarget);l.bindFramebuffer(eN.READ_FRAMEBUFFER,a.__webglFramebuffer),l.bindFramebuffer(eN.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let r=0;r<p;r++)C&&(eN.framebufferTextureLayer(eN.READ_FRAMEBUFFER,eN.COLOR_ATTACHMENT0,h.get(e).__webglTexture,s,g+r),eN.framebufferTextureLayer(eN.DRAW_FRAMEBUFFER,eN.COLOR_ATTACHMENT0,h.get(i).__webglTexture,o,y+r)),eN.blitFramebuffer(f,m,c,d,v,_,c,d,eN.DEPTH_BUFFER_BIT,eN.NEAREST);l.bindFramebuffer(eN.READ_FRAMEBUFFER,null),l.bindFramebuffer(eN.DRAW_FRAMEBUFFER,null)}else if(0!==s||e.isRenderTargetTexture||h.has(e)){let r=h.get(e),n=h.get(i);l.bindFramebuffer(eN.READ_FRAMEBUFFER,e4),l.bindFramebuffer(eN.DRAW_FRAMEBUFFER,e5);for(let e=0;e<p;e++)C?eN.framebufferTextureLayer(eN.READ_FRAMEBUFFER,eN.COLOR_ATTACHMENT0,r.__webglTexture,s,g+e):eN.framebufferTexture2D(eN.READ_FRAMEBUFFER,eN.COLOR_ATTACHMENT0,eN.TEXTURE_2D,r.__webglTexture,s),P?eN.framebufferTextureLayer(eN.DRAW_FRAMEBUFFER,eN.COLOR_ATTACHMENT0,n.__webglTexture,o,y+e):eN.framebufferTexture2D(eN.DRAW_FRAMEBUFFER,eN.COLOR_ATTACHMENT0,eN.TEXTURE_2D,n.__webglTexture,o),0!==s?eN.blitFramebuffer(f,m,c,d,v,_,c,d,eN.COLOR_BUFFER_BIT,eN.NEAREST):P?eN.copyTexSubImage3D(x,o,v,_,y+e,f,m,c,d):eN.copyTexSubImage2D(x,o,v,_,f,m,c,d);l.bindFramebuffer(eN.READ_FRAMEBUFFER,null),l.bindFramebuffer(eN.DRAW_FRAMEBUFFER,null)}else P?e.isDataTexture||e.isData3DTexture?eN.texSubImage3D(x,o,v,_,y,c,d,p,b,S,M.data):i.isCompressedArrayTexture?eN.compressedTexSubImage3D(x,o,v,_,y,c,d,p,b,M.data):eN.texSubImage3D(x,o,v,_,y,c,d,p,b,S,M):e.isDataTexture?eN.texSubImage2D(eN.TEXTURE_2D,o,v,_,c,d,b,S,M.data):e.isCompressedTexture?eN.compressedTexSubImage2D(eN.TEXTURE_2D,o,v,_,M.width,M.height,b,M.data):eN.texSubImage2D(eN.TEXTURE_2D,o,v,_,c,d,b,S,M);eN.pixelStorei(eN.UNPACK_ROW_LENGTH,E),eN.pixelStorei(eN.UNPACK_IMAGE_HEIGHT,T),eN.pixelStorei(eN.UNPACK_SKIP_PIXELS,w),eN.pixelStorei(eN.UNPACK_SKIP_ROWS,A),eN.pixelStorei(eN.UNPACK_SKIP_IMAGES,R),0===o&&i.generateMipmaps&&eN.generateMipmap(x),l.unbindTexture()},this.copyTextureToTexture3D=function(e,i,r=null,a=null,s=0){return(0,n.mcG)('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(e,i,r,a,s)},this.initRenderTarget=function(e){void 0===h.get(e).__webglFramebuffer&&u.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?u.setTextureCube(e,0):e.isData3DTexture?u.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?u.setTexture2DArray(e,0):u.setTexture2D(e,0),l.unbindTexture()},this.resetState=function(){el=0,ec=0,eh=null,l.reset(),U.reset()},"undefined"!=typeof __THREE_DEVTOOLS__&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return n.TdN}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let i=this.getContext();i.drawingBufferColorSpace=n.ppV._getDrawingBufferColorSpace(e),i.unpackColorSpace=n.ppV._getUnpackColorSpace()}}}},i={};function r(n){var a=i[n];if(void 0!==a)return a.exports;var s=i[n]={id:n,loaded:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.loaded=!0,s.exports}r.m=e,(()=>{var e=[];r.O=(i,n,a,s)=>{if(n){s=s||0;for(var o=e.length;o>0&&e[o-1][2]>s;o--)e[o]=e[o-1];e[o]=[n,a,s];return}for(var l=1/0,o=0;o<e.length;o++){for(var[n,a,s]=e[o],c=!0,h=0;h<n.length;h++)(!1&s||l>=s)&&Object.keys(r.O).every(e=>r.O[e](n[h]))?n.splice(h--,1):(c=!1,s<l&&(l=s));if(c){e.splice(o--,1);var u=a();void 0!==u&&(i=u)}}return i}})(),r.n=e=>{var i=e&&e.__esModule?()=>e.default:()=>e;return r.d(i,{a:i}),i},r.d=(e,i)=>{for(var n in i)r.o(i,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:i[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,i)=>Object.prototype.hasOwnProperty.call(e,i),r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={121:0};r.O.j=i=>0===e[i];var i=(i,n)=>{var a,s,[o,l,c]=n,h=0;if(o.some(i=>0!==e[i])){for(a in l)r.o(l,a)&&(r.m[a]=l[a]);if(c)var u=c(r)}for(i&&i(n);h<o.length;h++)s=o[h],r.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return r.O(u)},n=self.webpackChunkbilliards=self.webpackChunkbilliards||[];n.forEach(i.bind(null,0)),n.push=i.bind(null,n.push.bind(n))})(),r("./node_modules/cross-fetch/dist/browser-ponyfill.js"),r("./node_modules/interactjs/dist/interact.min.js"),r("./node_modules/jsoncrush/JSONCrush.js");var n=r("./node_modules/three/build/three.module.js");n=r.O(n)})();