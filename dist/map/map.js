"use strict";(()=>{var J=globalThis,G=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),Ne=new WeakMap,N=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(G&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Ne.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ne.set(t,e))}return e}toString(){return this.cssText}},Ue=n=>new N(typeof n=="string"?n:n+"",void 0,ce),f=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new N(t,n,ce)},je=(n,e)=>{if(G)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=J.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},he=G?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Ue(t)})(n):n;var{is:vt,defineProperty:xt,getOwnPropertyDescriptor:wt,getOwnPropertyNames:_t,getOwnPropertySymbols:St,getPrototypeOf:$t}=Object,Y=globalThis,Oe=Y.trustedTypes,Et=Oe?Oe.emptyScript:"",Ct=Y.reactiveElementPolyfillSupport,U=(n,e)=>n,de={toAttribute(n,e){switch(e){case Boolean:n=n?Et:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},ze=(n,e)=>!vt(n,e),De={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:ze};Symbol.metadata??=Symbol("metadata"),Y.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=De){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&xt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=wt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let a=i?.call(this);r?.call(this,o),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??De}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let e=$t(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let t=this.properties,s=[..._t(t),...St(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(he(i))}else e!==void 0&&t.push(he(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return je(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:de).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:de;this._$Em=i;let a=o.fromAttribute(t,r.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let o=this.constructor;if(i===!1&&(r=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??ze)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:o}=r,a=this[i];o!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,r,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[U("elementProperties")]=new Map,x[U("finalized")]=new Map,Ct?.({ReactiveElement:x}),(Y.reactiveElementVersions??=[]).push("2.1.2");var ye=globalThis,He=n=>n,W=ye.trustedTypes,Be=W?W.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ke="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,Ve="?"+_,kt=`<${Ve}>`,E=document,O=()=>E.createComment(""),D=n=>n===null||typeof n!="object"&&typeof n!="function",ve=Array.isArray,It=n=>ve(n)||typeof n?.[Symbol.iterator]=="function",pe=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Je=/>/g,S=RegExp(`>|${pe}(?:([^\\s"'>=/]+)(${pe}*=${pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Ye=/"/g,qe=/^(?:script|style|textarea|title)$/i,xe=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),u=xe(1),ls=xe(2),cs=xe(3),C=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),We=new WeakMap,$=E.createTreeWalker(E,129);function Qe(n,e){if(!ve(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(e):e}var At=(n,e)=>{let t=n.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",o=j;for(let a=0;a<t;a++){let l=n[a],c,h,d=-1,m=0;for(;m<l.length&&(o.lastIndex=m,h=o.exec(l),h!==null);)m=o.lastIndex,o===j?h[1]==="!--"?o=Fe:h[1]!==void 0?o=Je:h[2]!==void 0?(qe.test(h[2])&&(i=RegExp("</"+h[2],"g")),o=S):h[3]!==void 0&&(o=S):o===S?h[0]===">"?(o=i??j,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,c=h[1],o=h[3]===void 0?S:h[3]==='"'?Ye:Ge):o===Ye||o===Ge?o=S:o===Fe||o===Je?o=j:(o=S,i=void 0);let g=o===S&&n[a+1].startsWith("/>")?" ":"";r+=o===j?l+kt:d>=0?(s.push(c),l.slice(0,d)+Ke+l.slice(d)+_+g):l+_+(d===-2?a:g)}return[Qe(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},z=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0,a=e.length-1,l=this.parts,[c,h]=At(e,t);if(this.el=n.createElement(c,s),$.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=$.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(Ke)){let m=h[o++],g=i.getAttribute(d).split(_),v=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:v[2],strings:g,ctor:v[1]==="."?me:v[1]==="?"?ge:v[1]==="@"?fe:T}),i.removeAttribute(d)}else d.startsWith(_)&&(l.push({type:6,index:r}),i.removeAttribute(d));if(qe.test(i.tagName)){let d=i.textContent.split(_),m=d.length-1;if(m>0){i.textContent=W?W.emptyScript:"";for(let g=0;g<m;g++)i.append(d[g],O()),$.nextNode(),l.push({type:2,index:++r});i.append(d[m],O())}}}else if(i.nodeType===8)if(i.data===Ve)l.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(_,d+1))!==-1;)l.push({type:7,index:r}),d+=_.length-1}r++}}static createElement(e,t){let s=E.createElement("template");return s.innerHTML=e,s}};function P(n,e,t=n,s){if(e===C)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=D(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=P(n,i._$AS(n,e.values),i,s)),e}var ue=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??E).importNode(t,!0);$.currentNode=i;let r=$.nextNode(),o=0,a=0,l=s[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new H(r,r.nextSibling,this,e):l.type===1?c=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(c=new be(r,this,e)),this._$AV.push(c),l=s[++a]}o!==l?.index&&(r=$.nextNode(),o++)}return $.currentNode=E,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},H=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),D(e)?e===b||e==null||e===""?(this._$AH!==b&&this._$AR(),this._$AH=b):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):It(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==b&&D(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=z.createElement(Qe(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new ue(i,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=We.get(e.strings);return t===void 0&&We.set(e.strings,t=new z(e)),t}k(e){ve(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new n(this.O(O()),this.O(O()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=He(e).nextSibling;He(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},T=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=b,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(e,t=this,s,i){let r=this.strings,o=!1;if(r===void 0)e=P(this,e,t,0),o=!D(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let a=e,l,c;for(e=r[0],l=0;l<r.length-1;l++)c=P(this,a[s+l],t,l),c===C&&(c=this._$AH[l]),o||=!D(c)||c!==this._$AH[l],c===b?e=b:e!==b&&(e+=(c??"")+r[l+1]),this._$AH[l]=c}o&&!i&&this.j(e)}j(e){e===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},me=class extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===b?void 0:e}},ge=class extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==b)}},fe=class extends T{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??b)===C)return;let s=this._$AH,i=e===b&&s!==b||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},be=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var Pt=ye.litHtmlPolyfillSupport;Pt?.(z,H),(ye.litHtmlVersions??=[]).push("3.3.2");var Xe=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new H(e.insertBefore(O(),r),r,void 0,t??{})}return i._$AI(n),i};var we=globalThis,y=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Xe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};y._$litElement$=!0,y.finalized=!0,we.litElementHydrateSupport?.({LitElement:y});var Tt=we.litElementPolyfillSupport;Tt?.({LitElement:y});(we.litElementVersions??=[]).push("4.2.2");var Ze=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),B=n=>new Map([...n].map(([e,t])=>[t,e])),et=new Map([["messageType","m"],["type","t"],["ruleType","r"],["tableId","T"],["arenaId","A"],["options","o"],["custom","z"],["seek","s"],["isSpectator","S"],["isLeaving","L"],["nextTurnId","w"],["text","b"]]),Mt=B(et),Lt=new Map([["userId","u"],["challengerId","u"],["senderId","u"],["userName","n"],["challengerName","n"],["challengeeId","e"],["opponentId","e"],["recipientId","e"]]),Rt=new Map([["presence",new Map([["u","userId"],["n","userName"],["e","opponentId"]])],["challenge",new Map([["u","challengerId"],["n","challengerName"],["e","challengeeId"]])],["chat",new Map([["u","senderId"],["e","recipientId"]])]]),tt=new Map([["presence","p"],["challenge","c"],["chat","m"]]),Nt=B(tt),st=new Map([["presence",new Map([["join","j"],["heartbeat","h"],["leave","l"]])],["challenge",new Map([["offer","o"],["accept","a"],["decline","d"],["cancel","x"]])]]),Ut=new Map([...st].map(([n,e])=>[n,B(e)])),it=new Map([["ts","t"],["msgId","i"],["ua","u"],["origin","o"],["country","c"],["city","y"],["version","v"]]),jt=B(it),nt=new Map([["tableId","T"],["ruleType","r"]]),Ot=B(nt);function Dt(n,e){return Object.fromEntries(Object.entries(n).map(([t,s])=>[e.get(t)??t,s]))}function K(n,e){return Ze(n)?Dt(n,e):n}function rt(n){let e=typeof n.messageType=="string"?n.messageType:void 0,t=e!==void 0?st.get(e):void 0,s=Object.fromEntries(Object.entries(n).map(([i,r])=>{let o=Lt.get(i)??et.get(i)??i,a=r;return i==="meta"?a=K(r,it):i==="seek"?a=K(r,nt):i==="messageType"?a=tt.get(r)??r:i==="type"&&(a=t?.get(r)??r),[o,a]}));return JSON.stringify(s)}function V(n){let e;try{e=JSON.parse(n)}catch{return n}if(!Ze(e))return n;let t=e.m,s=typeof t=="string"?Nt.get(t)??t:e.messageType,i=typeof s=="string"?Rt.get(s):void 0,r=typeof s=="string"?Ut.get(s):void 0,o=Object.fromEntries(Object.entries(e).map(([a,l])=>{let c=i?.get(a)??Mt.get(a)??a,h=l;return a==="meta"?h=K(l,jt):a==="s"?h=K(l,Ot):a==="m"?h=typeof t=="string"?s:l:a==="t"&&(h=r?.get(l)??l),[c,h]}));return JSON.stringify(o)}var k={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:n=>`/publish/table/${n}`,TABLE_SUBSCRIBE:n=>`/subscribe/table/${n}`},q=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let r=e===k.PRESENCE_PUBLISH?rt(t):JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let c=new Blob([r],{type:"application/json"});if(navigator.sendBeacon(i,c))return}let o=new AbortController,a=setTimeout(()=>o.abort(),2e4),l;try{l=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:r,keepalive:s.keepalive,signal:o.signal})}finally{clearTimeout(a)}if(!l.ok)throw new Error(`Publish failed: ${l.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages.map(V)}async publishPresence(e,t){return this.publish(k.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(k.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(k.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(k.TABLE_PUBLISH(e),{...t,senderId:s},i)}async fetchPresenceSnapshot(){let e=new AbortController,t=setTimeout(()=>e.abort(),3e3);try{let s=await fetch(this.getHttpUrl("/api/online/presence"),{cache:"no-store",signal:e.signal});if(!s.ok)throw new Error(`Snapshot failed: ${s.status}`);let i=await s.json();return{ts:i.ts,users:i.users.map(r=>JSON.parse(V(JSON.stringify(r))))}}finally{clearTimeout(t)}}subscribePresence(e,t){let s=`uid=${encodeURIComponent(e)}`,i=typeof document<"u"?document.referrer:"";i&&(s+=`&ref=${encodeURIComponent(i.split(/[?#]/)[0])}`);let r=`${k.PRESENCE_SUBSCRIBE}?${s}`;return this.subscribe(r,t)}subscribeTable(e,t,s,i){let r=`${k.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return i?.isSpectator&&(r+="&spectator=1"),this.subscribe(r,s)}subscribe(e,t){let s=this.getWsUrl(e),i=()=>new Date().toISOString().slice(11,23),r=null,o=!1,a=0,l=8e3,c=6e4,h=null,d=!0,m=2e4,g=null,v={stop:()=>{o=!0,h&&(clearTimeout(h),h=null),g&&(clearTimeout(g),g=null),r&&(r.close(),r=null)},ready:null},le;v.ready=new Promise(w=>{le=w});let Re=()=>{if(!o){if(r&&r.readyState<=WebSocket.OPEN){le();return}r=new globalThis.WebSocket(s),g&&clearTimeout(g),g=setTimeout(()=>{console.warn(`[NchanClient ${i()}] Connection to ${s} timed out after ${m}ms, forcing reconnect`),r?.close()},m),g.unref?.(),r.onmessage=w=>{let F=w.data;this.record(F),t(V(F))},r.onopen=()=>{let w=!d;d=!1,a=0,h&&(clearTimeout(h),h=null),g&&(clearTimeout(g),g=null),le(),w&&v.onReconnect&&v.onReconnect()},r.onclose=w=>{if(g&&(clearTimeout(g),g=null),!o){if(a>=10){console.error(`[NchanClient ${i()}] Max reconnect attempts reached for ${s}, giving up`);return}let F=Math.min(Math.pow(2,a)*l,c);a++,h=setTimeout(Re,F),h.unref?.()}},r.onerror=w=>{console.error(`[NchanClient ${i()}] WebSocket error on ${s}:`,w),r&&(r.onerror=null,r?.close())}}};return Re(),v}};function ot(n){return n.type==="table:leave"&&!!n.data?.isSpectator}function Q(n){if(!n||n.trim()==="")return null;try{return JSON.parse(n)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function at(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var lt=250,X=class n{static dedupeChallenges(e){let t=new Set;for(let s of e)s.type!=="offer"&&t.add(n.interactionKey(s));return e.filter(s=>s.type!=="offer"?!0:!t.has(n.interactionKey(s)))}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var Z=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.isJoining=!1;this.settledListeners=[];this.isSettled=!1;this.joinBufferedPresence=[];this.unsettledChallengeMessages=[];this.heartbeatInterval=s.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(this.isJoined)return;this.isJoining=!0,this.subscription=this.nchan.subscribePresence(this.currentUser.userId,s=>{this.handleIncomingMessage(s)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser}).then(()=>this.refreshSnapshot()).catch(s=>{console.error("Failed to re-broadcast presence on reconnect:",s)})},await this.subscription.ready;for(let s=1;;s++)try{await this.nchan.publishPresence({...this.currentUser});break}catch(i){let r=Math.min(Math.pow(2,s)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${s}), retrying in ${r}ms:`,i),await new Promise(o=>setTimeout(o,r))}let e=await this.fetchSnapshot();e&&this.setUsers(e.users);let t=this.joinBufferedPresence;this.joinBufferedPresence=[];for(let s of t)e&&(s.meta?.ts??0)<=e.ts||this.applyPresence(s);this.isJoining=!1,this.fireSettled(),this.startHeartbeat(),this.isJoined=!0}async refreshSnapshot(){let e=await this.fetchSnapshot();e&&this.setUsers(e.users)}async fetchSnapshot(){try{return await this.nchan.fetchPresenceSnapshot()}catch(e){return console.warn("[Lobby] Presence snapshot failed:",e),null}}setUsers(e){this.users=new Map(e.map(t=>[t.userId,t])),this.notifyListeners()}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(s){console.error("Failed to send heartbeat:",s)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=60){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e})}safeEmit(e,t){try{let s=t();s&&typeof s.catch=="function"&&s.catch(i=>console.error(`[Lobby] ${e} hook failed:`,i))}catch(s){console.error(`[Lobby] ${e} hook failed:`,s)}}async challenge(e,t,s,i,r){let o=at();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:o,options:s,nextTurnId:i,custom:r}),this.safeEmit("onChallengeSent",()=>this.options.onChallengeSent?.({challengeeId:e,ruleType:t,tableId:o})),o}async acceptChallenge(e,t,s,i,r,o,a){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:r??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i,nextTurnId:o,custom:a}),this.safeEmit("onChallengeAccepted",()=>this.options.onChallengeAccepted?.({challengerId:e,ruleType:t,tableId:s})),await this.updatePresence({tableId:s,ruleType:t,options:i})}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave"},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=Q(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(this.isJoining){this.joinBufferedPresence.push(e);return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&this.notifyListeners()}}handleChallenge(e){if(this.isJoining){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let s=e.meta?.ts,i=t.meta?.ts;return s===void 0||i===void 0?!1:s>=i&&s-i<=lt}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=X.dedupeChallenges(this.unsettledChallengeMessages);for(let s of e)this.emitIfRelevant(s);this.unsettledChallengeMessages=[];let t=[...this.settledListeners];this.settledListeners=[];for(let s of t)s()}clearSettleState(){this.isJoining=!1,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.joinBufferedPresence=[]}};var ee=class n{constructor(e,t,s,i,r=!1,o,a,l,c){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.isSpectator=r;this.onClosed=l;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=c?.maxSize??1e3,this.initialRetryDelayMs=c?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=c?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(h=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(m=>m()),this.preJoinQueue.splice(0).forEach(m=>this.messageListeners.forEach(g=>g(m))),h()}}),o&&this.messageListeners.push(o),a&&this.bothJoinedListeners.push(a)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((s,i)=>{this.publishQueue.push({type:e,data:t,resolve:s,reject:i}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((s,i)=>{let r=o=>{if(this.isClosed){i(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>s()).catch(a=>{if(this.isClosed){i(a);return}let l=Math.min(Math.pow(2,o+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>r(o+1),l)})};r(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=Q(e);if(!t||!t.type)return;let s=t.meta?.msgId;if(typeof s=="string"){if(this.seenMsgIds.has(s))return;if(this.seenMsgIds.set(s,!0),this.seenMsgIds.size>n.MAX_SEEN_MSG_IDS){let i=this.seenMsgIds.keys().next().value;i!==void 0&&this.seenMsgIds.delete(i)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!ot(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let r=t.data?.id||t.senderId;r&&(this.seenIds.add(r),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&r!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(o=>o())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(i=>i(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var te=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new q(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),r,o={...t,onReconnect:()=>{this.resumeSession().catch(l=>console.error("Session resume failed after lobby reconnect:",l)),t?.onReconnect?.()},onLeave:()=>{let l=r??i;if(l){let c=this.activeLobbies.indexOf(l);c!==-1&&this.activeLobbies.splice(c,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let a=new Z(this.nchan,e,o);return r=a,await a.join(),this.lobbyInstances.set(e.userId,a),this.activeLobbies.push(a),a}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,s){let i=s?.isSpectator??!1,r=this.tableKey(e,t,i),o=this.joiningTables.get(r);if(o)return o.promise;this.assertNoTableConflict(e,t,i);let a=this.activeTables.find(m=>m.tableId===e);if(a)return Promise.resolve(a);let l=i?void 0:this.activeLobbies.find(m=>m.currentUser.userId===t),c=new ee(this.nchan,e,t,l,i,s?.onMessage,s?.onBothJoined,()=>this.removeActiveTable(c));this.activeTables.push(c);let h=c.join().catch(m=>{console.error(`Table ${e} join handshake failed:`,m)});l&&h.then(async()=>{if(!c.closed)try{await l.updatePresence({tableId:e})}catch(m){console.error("Failed to update presence after table join:",m)}});let d=Promise.resolve(c).finally(()=>{this.joiningTables.delete(r)});return this.joiningTables.set(r,{tableId:e,userId:t,isSpectator:i,promise:d}),d}tableKey(e,t,s){return`${e}|${t}|${s?"s":"p"}`}assertNoTableConflict(e,t,s){for(let i of this.joiningTables.values())if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already being joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`);for(let i of this.activeTables)if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,s){return this.joinTable(e,t,{...s,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence(),await e.refreshSnapshot()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};var _e=f`
    :host, :host([theme="light"]) {
        --bg:           #f5f5f5;
        --surface:      #ffffff;
        --border:       #dddddd;
        --border-light: #f0f0f0;
        --text:         #212121;
        --text-muted:   #757575;
        --text-dim:     #555555;
        --text-faint:   #bbbbbb;
        --btn-bg:       #ffffff;
        --btn-border:   #cccccc;
        --btn-hover:    #f0f0f0;
        --btn-active:   #e0e0e0;
        --table-head:   #f5f5f5;
        --banner-warn-bg:      #fff3cd;
        --banner-warn-border:  #ffc107;
        --banner-warn-text:    #595959;
        --banner-decline-bg:   #f8d7da;
        --banner-decline-border: #f5c6cb;
        --banner-decline-text: #721c24;
        --modal-bg:     #ffffff;
        --modal-cancel: #f8f9fa;
        --link:         #0055cc;
        --btn-replay-bg:     #4a90d9;
        --btn-replay-border: rgba(255, 255, 255, 0.1);
    }
    :host([theme="dark"]) {
        --bg:           #1a1a1a;
        --surface:      #2a2a2a;
        --border:       #444444;
        --border-light: #333333;
        --text:         #e0e0e0;
        --text-muted:   #aaaaaa;
        --text-dim:     #aaaaaa;
        --text-faint:   #555555;
        --btn-bg:       #3a3a3a;
        --btn-border:   #555555;
        --btn-hover:    #444444;
        --btn-active:   #505050;
        --table-head:   #333333;
        --banner-warn-bg:      #3a2e00;
        --banner-warn-border:  #ffc107;
        --banner-warn-text:    #cccccc;
        --banner-decline-bg:   #3a0a0e;
        --banner-decline-border: #7a3a3e;
        --banner-decline-text: #f5c6cb;
        --modal-bg:     #2a2a2a;
        --modal-cancel: #3a3a3a;
        --link:         #6ba3f5;
        --btn-replay-bg:     #3a3a3a;
        --btn-replay-border: rgba(255, 255, 255, 0.2);
    }
`,Xs=f`
    :host { font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
`,se=f`
    :host { font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
    button { cursor: pointer; padding: 0.15rem 0.2rem; border: 1px solid var(--btn-border); border-radius: 4px; background: var(--btn-bg); color: var(--text); font: inherit; font-size: 0.75rem; transition: background-color 0.2s, opacity 0.2s; min-width: 24px; min-height: 24px; }
    button:hover { background-color: var(--btn-hover); }
    button:active { background-color: var(--btn-active); }
    button:focus-visible { outline: 2px solid #007bff; outline-offset: 2px; }
    .btn-challenge { background: #0d6efd; color: #fff; border-color: #0d6efd; }
    .btn-challenge:hover { background: #0b5ed7; border-color: #0a58ca; }
    .btn-accept    { background: #198754; color: #fff; border-color: #198754; }
    .btn-accept:hover { background: #157347; border-color: #146c43; }
    .btn-decline   { background: #bb2d3b; color: #fff; border-color: #bb2d3b; }
    .btn-decline:hover { background: #a52834; border-color: #9b2531; }
    .btn-leave     { background: #6c757d; color: #fff; border-color: #6c757d; }
    .btn-leave:hover { background: #5a6268; border-color: #545b62; }
`,Zs=f`
    :host { display: block; }
    ul {
        list-style: none; margin: 0; padding: 1px;
        max-height: 148px;
        display: flex; flex-direction: column;
        row-gap: 2px;
        overflow-y: auto; overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--border) transparent;
        transition: max-height 0.3s ease;
    }
    ul::-webkit-scrollbar { width: 6px; }
    ul::-webkit-scrollbar-track { background: transparent; }
    ul::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    ul.expanded {
        max-height: var(--ul-expanded-height);
        overflow: hidden;
    }
    li {
        display: flex; justify-content: space-between; align-items: center;
        padding: 1px 1px;
        width: 100%; box-sizing: border-box;
        border: 0.25px solid var(--border-light);
        border-radius: 4px;
        min-height: 28px;
    }
    li:not(.is-offline):hover { background: var(--btn-hover); }
    .user-info { display: flex; flex-direction: column; min-width: 0; }
    .user-name {
        font-weight: 500; font-size: 0.8rem; color: var(--text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .user-status { font-size: 0.7rem; color: var(--text-muted); }
    .actions { display: flex; gap: 0.2rem; flex-shrink: 0; }
    .empty { padding: 1rem; text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.8rem; }
    .is-leaving { filter: grayscale(1); opacity: 0.6; pointer-events: none; }
    .is-offline { filter: grayscale(1); opacity: 0.35; transition: opacity 0.3s ease-out; animation: none; pointer-events: none; }
    .expand-toggle {
        display: flex; justify-content: center; align-items: center;
        padding: 2px; cursor: pointer;
        font-size: 0.8rem; color: var(--text-dim);
        border-radius: 4px;
        user-select: none;
        transition: background-color 0.15s;
    }
    .expand-toggle:hover {
        background: var(--btn-hover);
    }
    @media (max-width: 730px) {
        .expand-toggle { visibility: hidden; pointer-events: none; }
    }
`,ei=f`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,ti=f`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,ct=f`
    :host { display: block; }
    .backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(1px); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: var(--modal-bg); color: var(--text); border: 1px solid var(--border); border-radius: 12px; padding: 0.75rem 1rem; min-width: 240px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); }
    h3 { margin: 0; font-size: 0.95rem; text-align: center; }
    .sections { display: flex; flex-direction: column; gap: 2px; }
    .section { display: flex; flex-direction: column; }
    .section-header {
        display: flex; align-items: center; justify-content: flex-start;
        gap: 0.4rem;
        padding: 0.15rem; cursor: pointer;
        background: var(--btn-bg); border: 1px solid var(--btn-border);
        border-radius: 4px; min-width: 24px; min-height: 24px;
        transition: background-color 0.15s, filter 0.15s;
    }
    .section-header:hover { background: var(--btn-hover); }
    .section-header.active { background: var(--btn-active); filter: brightness(1.1); }
    .section-header img { width: 32px; height: 32px; display: block; }
    .section-label { font-size: 0.8rem; color: var(--text); }
    .section-body {
        display: flex; flex-direction: column; gap: 3px;
        max-height: 0; opacity: 0; visibility: hidden;
        padding: 0;
        overflow: hidden;
        transition: max-height 0.25s ease, opacity 0.2s ease, padding 0.25s ease, visibility 0.25s ease;
    }
    .section-body.expanded {
        max-height: 500px;
        opacity: 1; visibility: visible;
        padding: 0.25rem 0 0.25rem 0;
    }
    button.rule { text-align: left; padding: 3px 0.6rem; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; margin-left: 2.4rem; }
    button.rule img { width: 28px; height: 28px; display: block; }
    button.cancel { background: var(--modal-cancel); color: var(--text); border-color: var(--btn-border); padding: 0.15rem; }
    button.msg-btn {
        display: flex; align-items: center; justify-content: center;
        padding: 0.15rem;
        background: var(--btn-bg); border: 1px solid var(--btn-border);
        border-radius: 4px; min-width: 24px; min-height: 24px;
    }
    button.msg-btn:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; width: 28px; height: 28px; flex-shrink: 0; }
    .icon-wrap img { width: 28px; height: 28px; display: block; }

    .handicap-label {
        font-size: 0.78rem; white-space: nowrap; flex-shrink: 0;
    }
    .handicap-inline-slider {
        -webkit-appearance: none;
        appearance: none;
        flex: 1;
        height: 4px;
        min-width: 50px;
        background: var(--border);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        margin: 0 0.2rem;
    }
    .handicap-inline-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px; height: 12px;
        border-radius: 50%;
        background: #0d6efd;
        border: 2px solid #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        cursor: pointer;
    }
    .handicap-inline-slider::-moz-range-thumb {
        width: 12px; height: 12px;
        border-radius: 50%;
        background: #0d6efd;
        border: 2px solid #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        cursor: pointer;
    }`,si=f`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,ht=f`
    :host { display: inline-flex; align-items: center; align-self: center; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; min-width: 0; overflow: hidden; }
    .badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 0px 4px 0px 2px; border-radius: 4px;
        background: var(--surface); border: 1px solid var(--border);
        cursor: pointer; font-size: 1.2rem; color: var(--text); font-weight: 600;
        font-family: inherit;
        transition: filter 0.15s, box-shadow 0.15s;
        box-shadow: 0 0 10px rgba(100, 255, 131, 0.2);
        min-width: 0;
        overflow: hidden;
        max-width: 100%;
    }
    .badge:hover { filter: brightness(1.3); }
    .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: var(--dot-color, #888); }
    input {
        background: transparent; border: none; color: inherit;
        font-size: inherit; font-family: inherit; font-weight: inherit;
        outline: none; padding: 0;
        width: auto;
        min-width: 0;
    }
    .pencil {
        font-size: 0.95rem;
        line-height: 1;
        opacity: 0.8;
        user-select: none;
        flex-shrink: 0;
    }
`,ii=f`
    :host { display: block; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,ni=f`
    :host { display: block; overflow-y: hidden; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; font-size: 0.75rem; color: var(--text); max-height: 40px; opacity: 0; transition: max-height 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out 0.15s; }
    /* Capped rather than auto so the reveal can animate. Must clear the tallest
       layout (a 393px phone: 108px cabinet/HiScore row + 26px MOTD + 413px
       history/rankings = 547px), otherwise the bottom of the match history
       boxes is cut off by overflow-y: hidden. */
    :host(.loaded) { max-height: 640px; opacity: 1; }
    .tbl { display: inline-block; vertical-align: top; border-radius: 4px; margin: 0.0625rem; overflow: hidden; }
    table { border-collapse: collapse; width: auto; }
    th, td { border-bottom: 1px solid var(--border); padding: 0.05rem 0.15rem; text-align: left; }
    th { display: none; }
    caption { font-size: 0.8rem; line-height: 1.1; font-weight: 600; text-align: center; padding: 0; color: var(--text-dim); }
    a { color: var(--link); text-decoration: none; }
    .ago { text-align: right; font-size: 0.65em; color: var(--text-muted); white-space: nowrap; width: 1%; }
    .city-col { font-size: 0.65em; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 5rem; }
    .replay-col { text-align: right; width: 1%; white-space: nowrap; font-size: 0.8rem; }
    @media (max-width: 600px) {
        .sagu-hi { display: none; }
    }
    @media (max-width: 500px) {
        .city-col { display: none; }
    }
    .loading { color: var(--text-muted); text-align: center; display: block; width: 100%; }
    .group { margin-bottom: 0.14rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.1rem; }
    .group-title { font-size: 0.75rem; font-weight: 600; color: var(--text-dim); padding: 0.1rem 0.25rem; text-align: center; }
    .group-body { display: flex; flex-wrap: wrap; justify-content: space-evenly; }
    /* The trophy cabinet and the HiScore tables share the top row; stretch keeps
       their bottom borders level. The match history / rankings row below spans
       the full width. */
    .top-row { display: flex; align-items: stretch; gap: 0.1rem; }
    .top-row .cabinet { flex: 0 0 calc(230px * 0.75 - 10px); min-width: 0; }
    .top-row .hiscores { flex: 1 1 auto; min-width: 0; }
    /* Narrow screens keep the cabinet beside the HiScores rather than stacking
       it above; the cabinet shrinks so the tables still get room. */
    @media (max-width: 640px) {
        .top-row .cabinet { flex: 0 0 calc(230px * 0.5 - 10px); }
    }
    /* The HiScore tables must always sit three-across. A wrapping flex line
       breaks each item at its max-content width, which varies by engine (table
       intrinsic sizing, emoji advances) and by reload (the names are live), so
       the third table randomly folds under on Blink/WebKit. A fixed 3-column
       grid decides the count up front instead of leaving it to measurement. */
    .top-row .hiscores .group-body { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); justify-content: space-evenly; justify-items: center; }
    .top-row .hiscores .tbl { min-width: 0; max-width: 120px; margin: 0.0625rem 0.05rem; }
    /* Fixed layout lets the columns shrink to the grid track instead of forcing
       the table out to its max-content width. On a 393px phone each table is
       88px, so once the trophy emoji and the 40px score column (sized for three
       digits) have taken their share the name has ~39px - not enough for "AOM"
       beside a trophy. Rows must stay on one line whatever the name, so the
       name is left to run a few pixels into the score pill instead of wrapping;
       the pill paints over the overlap, and the .tbl radius clip trims only a
       very long name. vertical-align stays middle so the name and its medal sit
       level with the score pill, which is what the cell default gives for a
       single-line row. */
    .top-row .hiscores .tbl table { width: 100%; table-layout: fixed; }
    .top-row .hiscores td:first-child { white-space: nowrap; vertical-align: middle; }
    .top-row .hiscores td:last-child { width: 40px; }
    /* Message of the day, full width under the cabinet and HiScore groups. A
       touch more vertical padding than .group so a single line of text does not
       sit against the border. */
    .motd-row { padding: 0.25rem 0.4rem; }
    .bottom-row { display: flex; align-items: flex-start; gap: 0.1rem; }
    /* The bottom-row groups are the last thing in the panel; their .group
       margin-bottom left a ~2px gap that made the stretched online-panel
       appear to protrude below them. */
    .bottom-row .group { margin-bottom: 0; }
    .bottom-row .recent { flex: 65; min-width: 0; height: 408px; overflow-y: auto; scrollbar-width: none; }
    .bottom-row .recent::-webkit-scrollbar { display: none; }
    .bottom-row .top-players { flex: 35; min-width: 0; height: 408px; overflow-y: auto; scrollbar-width: none; }
    .bottom-row .top-players::-webkit-scrollbar { display: none; }
    .bottom-row .recent .tbl, .bottom-row .recent table { width: 100%; }
    .bottom-row .top-players .group-body { flex-direction: column; }
    .bottom-row .top-players .tbl { width: 100%; display: block; box-sizing: border-box; margin: 0.0625rem 0; }
    .bottom-row .top-players .tbl table { width: 100%; }
    .bottom-row .top-players td:last-child { text-align: right; }
    .recent td:nth-child(1) { width: 16px; text-align: center; }
    .recent td:nth-child(2) { max-width: 8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .recent td:nth-child(4) { width: 1%; white-space: nowrap; }
    .score { color: var(--text-muted); font-size: 0.85em; }
`,ri=f`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,oi=[_e,f`
    /* No min-height: 100%: the app hugs its content so the site-links line in
       lobby.html sits directly under it instead of below a full-viewport box. */
    :host { display: flex; flex-direction: column; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; font-size: 0.85rem; box-sizing: border-box; padding: 0.25rem; gap: 0.2rem; background: var(--bg); color: var(--text); overflow-y: auto; scrollbar-width: none; }
    :host::-webkit-scrollbar { display: none; }
    h1 { font-size: 1.0rem; color: var(--text-dim); text-align: left; margin: 0; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0; }
    h1 a { color: inherit; text-decoration: none; }
    h1 a:hover { text-decoration: underline; }
    h1 .version { font-size: 0.65rem; color: var(--text-dim); margin-left: 0.25rem; vertical-align: super; font-weight: 200; }
    .topbar { display: flex; align-items: center; flex-shrink: 0; gap: 0.4rem; }
    .topbar .logo { width: 32px; height: 32px; flex-shrink: 0; filter: grayscale(100%); opacity: 0.7; }
    .topbrand { display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; color: inherit; flex-shrink: 0; }
    .topbrand:hover { opacity: 0.85; }
    .topbrand .logo { opacity: 1; transition: opacity 0.2s; }
    .topbar h1 { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;}
    .topbar settings-modal { flex-shrink: 0; }
    .topbar user-badge { min-width: 0; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.4rem; overflow: hidden; }
    .panel-title { font-weight: bold; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-dim); text-align: center; }
    .info-row { display: flex; flex-direction: column; }
    .info-row .panel { overflow: visible; }

    main {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 230px;
        column-gap: 0.1rem;
        row-gap: 0.14rem;
        align-items: start;
    }

    .solo           { grid-area: 1 / 1 / 2 / 2; }
    online-panel    { grid-area: 1 / 2 / 2 / 3; }
    online-panel.panel { overflow-y: auto; max-height: calc(100vh - 6rem); align-self: stretch; }
    .arenas-row     { grid-area: 2 / 1 / 3 / 3; display: flex; flex-direction: column; }
    .arenas-row .arena-col { min-width: 0; padding: 3px; }
    .info-row       { grid-area: 3 / 1 / 4 / 3; }

    @media (max-width: 640px) {
        .info-row { flex-direction: column; }
    }

    main.has-sidebar {
        grid-template-columns: 1fr 250px;
    }
    main.has-sidebar .solo {
        grid-area: 1 / 1 / 2 / 2;
    }
    main.has-sidebar online-panel {
        grid-area: 1 / 2 / 4 / 3;
        overflow-y: auto;
        align-self: stretch;
        max-height: none;
    }
    main.has-sidebar .arenas-row {
        grid-area: 2 / 1 / 3 / 2;
    }
    main.has-sidebar .info-row {
        grid-area: 3 / 1 / 4 / 2;
    }
    .container { max-width: 900px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
`];var Se=1341,$e=n=>`v${Math.floor(n/100)}.${String(n%100).padStart(2,"0")}`;var I=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",ie=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),zt=ie?`ws://${window.location.hostname}:80`:`wss://${I}`;var ne=ie?"":"https://billiards-network.onrender.com",A=typeof window<"u"&&window.location.hostname.includes("vercel");var dt=n=>{if(n==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!n)return{emoji:"\u{1F310}",title:""};let e=n.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},Ht=ie?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/",Bt=(n,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,n):n,pt=(n,e,t)=>{for(let[s,i]of Object.entries(n)){let r=e?`${e}.${encodeURIComponent(s)}`:encodeURIComponent(s);i&&typeof i=="object"&&!Array.isArray(i)?pt(i,r,t):i!=null&&t.push(`${r}=${encodeURIComponent(i)}`)}return t},Ft=(n,e,t)=>e&&typeof e=="object"?pt(e,t,[]).reduce((s,i)=>s+`&${i}`,n):n,ut=(n,e,t,s,i,r)=>{if(n.absolute)return n.url;let o=n.url?`${n.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:`${Ht}?ruletype=${n.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`;return ie&&(o+=`&lobbyUrl=${zt}`),i&&(o+="&flip=true"),o=Ft(o,r,"custom"),n.url?o:Bt(o,n.options)};var mt=n=>{let e=(n||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,6)},Jt={ko:"\uD55C"},Ce=()=>{let[n,...e]=(navigator.languages?.[0]||navigator.language||"en").split("-"),t=Jt[(n||"").toLowerCase()];return t?`Anon-${t}`:`Anon-${(e.find(r=>/^[A-Za-z]{2}$/.test(r))||n||"en").toUpperCase().slice(0,2)}`},gt=n=>(n||"").slice(0,4)==="Anon",Ee=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();A&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),r=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,s||(this.userName=window.name.split("-")[0]);else{let a=s||r||"",l=!a||i.split("-")[0].slice(0,4)===a.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&l?i:mt(a),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=s||this.userName||r||Ce(),this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",o=>{if(o.key==="custom"){try{this.custom=JSON.parse(o.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():mt(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},p=new Ee,M=class extends y{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),p.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),p.removeEventListener("change",this._storeListener)}};var ke=[{code:"en",label:"English"},{code:"ko",label:"\uD55C\uAD6D\uC5B4"},{code:"ja",label:"\u65E5\u672C\u8A9E"},{code:"tr",label:"T\xFCrk\xE7e"},{code:"zh",label:"\u7E41\u9AD4\u4E2D\u6587",htmlLang:"zh-Hant"}],Gt={ko:{"Play Solo":"\uD63C\uC790 \uD50C\uB808\uC774","Challenge {name}":"{name}\uC5D0\uAC8C \uB300\uACB0 \uC2E0\uCCAD",PLAY:"\uD50C\uB808\uC774",Cancel:"\uCDE8\uC18C",Accept:"\uC218\uB77D",Decline:"\uAC70\uC808",Challenge:"\uB3C4\uC804","Challenge from {name}":"{name}\uB2D8\uC758 \uB3C4\uC804","Waiting for {name} to accept.":"{name}\uB2D8\uC758 \uC218\uB77D\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911.","{name} declined.":"{name}\uB2D8\uC774 \uAC70\uC808\uD588\uC2B5\uB2C8\uB2E4.","Accept challenge":"\uB3C4\uC804 \uC218\uB77D","Decline challenge":"\uB3C4\uC804 \uAC70\uC808",Dismiss:"\uB2EB\uAE30","Select game type":"\uAC8C\uC784 \uC720\uD615 \uC120\uD0DD","Select game variant":"\uAC8C\uC784 \uBCC0\uD615 \uC120\uD0DD","Game type":"\uAC8C\uC784 \uC885\uB958","{game} variant":"{game} \uBCC0\uD615","Table:":"\uD14C\uC774\uBE14:","Full size":"\uC804\uCCB4 \uD06C\uAE30",Mini:"\uBBF8\uB2C8","Shot time:":"\uC0F7 \uC2DC\uAC04:","Rule:":"\uADDC\uCE59:","Aim:":"\uC870\uC900:",Free:"\uC790\uC720",Assist:"\uBCF4\uC870","Free aim":"\uC790\uC720 \uC870\uC900","Aim assist":"\uC870\uC900 \uBCF4\uC870","Send message":"\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30",Language:"\uC5B8\uC5B4","Eight Ball":"\uC5D0\uC774\uD2B8\uBCFC","Nine Ball":"\uB098\uC778\uBCFC",Snooker:"\uC2A4\uB204\uCEE4","Three Cushion":"\uC4F0\uB9AC\uCFE0\uC158",Sagu:"\uC0AC\uAD6C","Reds 3":"\uBE68\uAC04\uACF5 3","Reds 6":"\uBE68\uAC04\uACF5 6","Reds 10":"\uBE68\uAC04\uACF5 10","Reds 15":"\uBE68\uAC04\uACF5 15","Race to 7":"7\uC810 \uC120\uCDE8","Race to 15":"15\uC810 \uC120\uCDE8","Race to 25":"25\uC810 \uC120\uCDE8","Race to 5":"5\uC810 \uC120\uCDE8","Race to 11":"11\uC810 \uC120\uCDE8","Use these parameters":"\uC774 \uC124\uC815\uC73C\uB85C \uC2DC\uC791","Click to change name":"\uD074\uB9AD\uD558\uC5EC \uC774\uB984 \uBCC0\uACBD","Customise settings":"\uC124\uC815 \uB9DE\uCDA4\uC124\uC815"},ja:{"Play Solo":"\u3072\u3068\u308A\u3067\u30D7\u30EC\u30A4","Challenge {name}":"{name}\u306B\u6311\u6226",PLAY:"\u30D7\u30EC\u30A4",Cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",Accept:"\u627F\u8A8D",Decline:"\u62D2\u5426",Challenge:"\u5BFE\u6226\u7533\u8FBC\u307F","Challenge from {name}":"{name}\u304B\u3089\u306E\u6311\u6226","Waiting for {name} to accept.":"{name}\u306E\u627F\u8A8D\u5F85\u3061\u3067\u3059\u3002","{name} declined.":"{name}\u304C\u62D2\u5426\u3057\u307E\u3057\u305F\u3002","Accept challenge":"\u6311\u6226\u3092\u627F\u8A8D","Decline challenge":"\u6311\u6226\u3092\u62D2\u5426",Dismiss:"\u9589\u3058\u308B","Select game type":"\u30B2\u30FC\u30E0\u306E\u7A2E\u985E\u3092\u9078\u629E","Select game variant":"\u30B2\u30FC\u30E0\u306E\u30D0\u30EA\u30A2\u30F3\u30C8\u3092\u9078\u629E","Game type":"\u30B2\u30FC\u30E0\u306E\u7A2E\u985E","{game} variant":"{game}\u306E\u30D0\u30EA\u30A2\u30F3\u30C8","Table:":"\u30C6\u30FC\u30D6\u30EB:","Full size":"\u30D5\u30EB\u30B5\u30A4\u30BA",Mini:"\u30DF\u30CB","Shot time:":"\u30B7\u30E7\u30C3\u30C8\u6642\u9593:","Rule:":"\u30EB\u30FC\u30EB:","Aim:":"\u30A8\u30A4\u30E0:",Free:"\u30D5\u30EA\u30FC",Assist:"\u30A2\u30B7\u30B9\u30C8","Free aim":"\u30D5\u30EA\u30FC\u30A8\u30A4\u30E0","Aim assist":"\u30A8\u30A4\u30E0\u30A2\u30B7\u30B9\u30C8","Send message":"\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u308B",Language:"\u8A00\u8A9E","Eight Ball":"\u30A8\u30A4\u30C8\u30DC\u30FC\u30EB","Nine Ball":"\u30CA\u30A4\u30F3\u30DC\u30FC\u30EB",Snooker:"\u30B9\u30CC\u30FC\u30AB\u30FC","Three Cushion":"\u30B9\u30EA\u30FC\u30AF\u30C3\u30B7\u30E7\u30F3",Sagu:"\u56DB\u7403","Reds 3":"\u8D64\u7403 3","Reds 6":"\u8D64\u7403 6","Reds 10":"\u8D64\u7403 10","Reds 15":"\u8D64\u7403 15","Race to 7":"7\u70B9\u5148\u53D6","Race to 15":"15\u70B9\u5148\u53D6","Race to 25":"25\u70B9\u5148\u53D6","Race to 5":"5\u70B9\u5148\u53D6","Race to 11":"11\u70B9\u5148\u53D6","Use these parameters":"\u3053\u306E\u8A2D\u5B9A\u3067\u958B\u59CB","Click to change name":"\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u540D\u524D\u3092\u5909\u66F4","Customise settings":"\u8A2D\u5B9A\u3092\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA"},tr:{"Play Solo":"Tek Oyna","Challenge {name}":"{name} ile D\xFCello",PLAY:"OYNA",Cancel:"\u0130ptal",Accept:"Kabul Et",Decline:"Reddet",Challenge:"D\xFCello","Challenge from {name}":"{name} d\xFCello teklif etti","Waiting for {name} to accept.":"{name} kabul edene kadar bekleniyor.","{name} declined.":"{name} reddetti.","Accept challenge":"D\xFCelloyu kabul et","Decline challenge":"D\xFCelloyu reddet",Dismiss:"Kapat","Select game type":"Oyun t\xFCr\xFCn\xFC se\xE7","Select game variant":"Oyun varyant\u0131 se\xE7","Game type":"Oyun t\xFCr\xFC","{game} variant":"{game} varyant\u0131","Table:":"Masa:","Full size":"Tam boy",Mini:"Mini","Shot time:":"At\u0131\u015F s\xFCresi:","Rule:":"Kural:","Aim:":"Ni\u015Fan:",Free:"Serbest",Assist:"Yard\u0131ml\u0131","Free aim":"Serbest ni\u015Fan","Aim assist":"Ni\u015Fan yard\u0131m\u0131","Send message":"Mesaj g\xF6nder",Language:"Dil","Eight Ball":"Sekiz Top","Nine Ball":"Dokuz Top",Snooker:"Snooker","Three Cushion":"\xDC\xE7 Bant",Sagu:"Sagu","Reds 3":"3 K\u0131rm\u0131z\u0131","Reds 6":"6 K\u0131rm\u0131z\u0131","Reds 10":"10 K\u0131rm\u0131z\u0131","Reds 15":"15 K\u0131rm\u0131z\u0131","Race to 7":"7 Say\u0131ya","Race to 15":"15 Say\u0131ya","Race to 25":"25 Say\u0131ya","Race to 5":"5 Say\u0131ya","Race to 11":"11 Say\u0131ya","Use these parameters":"Bu ayarlarla ba\u015Fla","Click to change name":"\u0130smi de\u011Fi\u015Ftirmek i\xE7in t\u0131klay\u0131n","Customise settings":"Ayarlar\u0131 \xF6zelle\u015Ftir"},zh:{"Play Solo":"\u55AE\u4EBA\u7DF4\u7FD2","Challenge {name}":"\u6311\u6230 {name}",PLAY:"\u958B\u59CB",Cancel:"\u53D6\u6D88",Accept:"\u63A5\u53D7",Decline:"\u62D2\u7D55",Challenge:"\u6311\u6230","Challenge from {name}":"{name} \u7684\u6311\u6230","Waiting for {name} to accept.":"\u7B49\u5F85 {name} \u63A5\u53D7\u3002","{name} declined.":"{name} \u62D2\u7D55\u4E86\u3002","Accept challenge":"\u63A5\u53D7\u6311\u6230","Decline challenge":"\u62D2\u7D55\u6311\u6230",Dismiss:"\u95DC\u9589","Select game type":"\u9078\u64C7\u7403\u985E","Select game variant":"\u9078\u64C7\u73A9\u6CD5","Game type":"\u7403\u985E","{game} variant":"{game} \u73A9\u6CD5","Table:":"\u7403\u684C\uFF1A","Full size":"\u6A19\u6E96\u684C",Mini:"\u8FF7\u4F60","Shot time:":"\u51FA\u687F\u6642\u9593\uFF1A","Rule:":"\u898F\u5247\uFF1A","Aim:":"\u7784\u6E96\uFF1A",Free:"\u81EA\u7531",Assist:"\u8F14\u52A9","Free aim":"\u81EA\u7531\u7784\u6E96","Aim assist":"\u7784\u6E96\u8F14\u52A9","Send message":"\u50B3\u9001\u8A0A\u606F",Language:"\u8A9E\u8A00","Eight Ball":"\u516B\u865F\u7403","Nine Ball":"\u4E5D\u865F\u7403",Snooker:"\u65AF\u8AFE\u514B","Three Cushion":"\u4E09\u9846\u661F",Sagu:"\u56DB\u7403","Reds 3":"\u7D05\u7403 3","Reds 6":"\u7D05\u7403 6","Reds 10":"\u7D05\u7403 10","Reds 15":"\u7D05\u7403 15","Race to 7":"\u6436 7","Race to 15":"\u6436 15","Race to 25":"\u6436 25","Race to 5":"\u6436 5","Race to 11":"\u6436 11","Use these parameters":"\u4F7F\u7528\u9019\u4E9B\u8A2D\u5B9A","Click to change name":"\u9EDE\u64CA\u4FEE\u6539\u540D\u7A31","Customise settings":"\u81EA\u8A02\u8A2D\u5B9A"}},ft="locale",Yt=["lang","selector_lang"],Wt="locale",re=n=>ke.some(e=>e.code===n);function Kt(){if(!(typeof location>"u"))return new URLSearchParams(location.search).get(Wt)?.trim().toLowerCase()||void 0}function Vt(){try{for(let n of[ft,...Yt]){let e=localStorage.getItem(n);if(e&&re(e))return e}return}catch{return}}function qt(){if(typeof navigator>"u")return;let n=navigator.languages?.length?navigator.languages:[navigator.language];for(let e of n){let t=String(e).toLowerCase().split("-")[0];if(re(t))return t}}function Qt(){let n=Kt();return n?re(n)?n:"en":Vt()??qt()??"en"}var Ie=class{#e=Qt();#t=new Set;constructor(){this.#s()}get lang(){return this.#e}get languages(){return ke}t(e,t){let s=Gt[this.#e]?.[e]??e;if(t)for(let[i,r]of Object.entries(t))s=s.replaceAll(`{${i}}`,String(r));return s}set(e){if(!(!re(e)||e===this.#e)){this.#e=e;try{localStorage.setItem(ft,e)}catch{}this.#s();for(let t of this.#t)t(e)}}onChange(e){return this.#t.add(e),()=>this.#t.delete(e)}#s(){if(typeof document>"u")return;let{htmlLang:e}=ke.find(t=>t.code===this.#e)??{};document.documentElement.lang=e??this.#e}},R=new Ie,L=class extends M{connectedCallback(){super.connectedCallback(),this._i18nUnsub=R.onChange(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._i18nUnsub?.()}};var Xt=[[4352,4447,1],[11904,42191,1],[44032,55203,1],[63744,64255,1],[65040,65135,1],[65280,65376,1],[65504,65510,1],[127744,129791,1.25],[131072,195103,1]],bt=n=>{let e=0,t=0;for(let s of n){let i=s.codePointAt(0),r=Xt.find(([o,a])=>i>=o&&i<=a);r?t+=r[2]:e++}return!e&&!t&&(e=1),`calc(${e}ch + ${+t.toFixed(2)}em)`},Ae=class extends L{static properties={_dotColor:{state:!0}};static styles=ht;constructor(){super(),this._clientId=p.clientId,this._name=p.userName,this._dotColor=p.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||Ce();this._name=t,p.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}_onBadgeClick(e){let t=this.renderRoot?.querySelector("input");t&&e.target!==t&&t.focus()}render(){if(A)return u``;let e=p.userName,t=gt(e),s=t?R.t("Click to change name"):void 0;return u`
            <div class="badge" style="--dot-color:${this._dotColor}" title=${s} @click=${this._onBadgeClick}>
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${e}
                    name="name" autocomplete="nickname"
                    style="width: ${bt(e)}"
                    aria-label="Display name"
                    @input=${i=>i.target.style.width=bt(i.target.value)}
                    @change=${i=>this._commit(i.target.value)}
                    @keydown=${i=>i.key==="Enter"&&i.target.blur()}>
                ${t?u`<span class="pencil">✎</span>`:""}
            </div>`}};customElements.define("user-badge",Ae);var oe=null,Zt=()=>(oe||(oe=fetch(`${ne}/api/arena/winners`).then(n=>n.ok?n.json():Promise.reject(new Error(String(n.status)))).then(n=>Array.isArray(n?.winners)?n.winners.filter(e=>e&&typeof e=="object"&&typeof e.userName=="string"):[]).catch(()=>(oe=null,null))),oe),Pe=class extends M{static styles=f`
        :host { position: relative; display: inline-flex; width: 0; min-width: 0; }
        .trophy-stack {
            position: absolute;
            right: -0.1rem;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: row;
            gap: 0.05rem;
            /* stack grows leftward from the badge */
            flex-direction: row-reverse;
        }
        .trophy {
            font-size: 0.95rem; line-height: 1;
            user-select: none;
            text-decoration: none;
            cursor: pointer;
        }
        .trophy:hover { opacity: 0.8; }
    `;constructor(){super(),this._trophies=[],this._trophyCheckedFor=null,this._winners=null,this._observer=null,this._idleTimer=null,this._started=!1}connectedCallback(){super.connectedCallback(),A||this._startLazy()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,this._idleTimer&&(clearTimeout(this._idleTimer),this._idleTimer=null),super.disconnectedCallback()}_startLazy(){this._started||(this._started=!0,typeof IntersectionObserver<"u"?(this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&(this._observer.disconnect(),this._observer=null,this._load())}),this._observer.observe(this)):this._whenIdle(()=>this._load()))}_whenIdle(e){typeof requestIdleCallback=="function"?requestIdleCallback(()=>e()):this._idleTimer=setTimeout(e,200)}async _load(){this._winners=await Zt(),this._recheck()}_recheck(){let e=(p.userName||"").trim();if(!e||!this._winners){this._trophies.length&&(this._trophies=[],this.requestUpdate());return}if(this._trophyCheckedFor===e)return;this._trophyCheckedFor=e;let t=this._winners.filter(s=>typeof s.userName=="string"&&s.userName.trim()===e);JSON.stringify(t)!==JSON.stringify(this._trophies)&&(this._trophies=t,this.requestUpdate())}willUpdate(){this._recheck()}render(){return A||!this._trophies.length?u``:u`
            <span class="trophy-stack">
                ${this._trophies.map(e=>u`
                    <a
                        class="trophy"
                        href="lobby?arenaId=${encodeURIComponent(e.arenaId)}"
                        title="Arena winner (${e.arenaId})"
                        aria-label="Arena trophy - view arena ${e.arenaId}"
                    >🏆</a>
                `)}
            </span>
        `}};customElements.define("trophy-item",Pe);var es=`https://${I}/api/stats`,Te=class extends y{static styles=f`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(es,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return u`<span class="loading">Could not load stats.</span>`;if(!this._data)return u`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{}),i=s.reduce((r,[,o])=>r+o,0);return u`
            <div class="uptime">${i} unique visitors${e?u` in <a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}`:""}</div>
            <ul>
                ${s.map(([r,o])=>u`
                    <li>${dt(r).emoji} <span>${r}</span> <span class="count">${o}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",Te);var Me=class n extends L{static properties={_open:{state:!0},_notifEnabled:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[se,ct,f`
        .modal { padding: 0.7rem 1rem; gap: 0.3rem; }
        h3 { margin: 0 0 0.1rem; font-size: 0.9rem; }
        .burger { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0.0rem 0.1rem; color: var(--text-muted); line-height: 1; min-width: 28px; min-height: 32px; }
        .burger:hover { color: var(--text); background: none; }
        .row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text); line-height: 1.3; }
        .section-title { font-size: 0.7rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase; margin-top: 0.3rem; margin-bottom: 0.1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1px; }
        label { cursor: pointer; display: flex; align-items: center; gap: 0.3rem; }
        a { color: var(--link); text-decoration: none; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; }
        a:hover { text-decoration: underline; }
        .copied-badge {
            background: #198754; color: white; font-size: 0.65rem; padding: 1px 4px;
            border-radius: 4px; margin-left: 4px; animation: fadein 0.2s;
        }
        @keyframes fadein { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .lod-label { font-weight: bold; color: var(--link); }

        /* Toggle Switch CSS */
        .switch {
            position: relative;
            display: inline-block !important;
            width: 30px;
            height: 16px;
            margin-left: auto;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: var(--btn-border);
            transition: 0.2s;
            border-radius: 16px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 10px;
            width: 10px;
            left: 3px;
            bottom: 3px;
            background-color: var(--surface);
            transition: 0.2s;
            border-radius: 50%;
        }
        input:checked + .slider { background-color: #0d6efd; }
        input:checked + .slider:before { transform: translateX(14px); }

        /* Styled Quality Range Slider */
        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            background: var(--border);
            border-radius: 2px;
            outline: none;
            margin: 0.15rem 0;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #0d6efd;
            cursor: pointer;
            transition: transform 0.1s;
        }
        input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); }
        input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border: none;
            border-radius: 50%;
            background: #0d6efd;
            cursor: pointer;
            transition: transform 0.1s;
        }
        input[type="range"]::-moz-range-thumb:hover { transform: scale(1.2); }

        /* Customisation picker iframe overlay (80% of screen) */
        .picker-backdrop {
            position: fixed; inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 200;
        }
        .picker-frame {
            width: 80vw; height: 80vh;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }
        .picker-frame iframe { width: 100%; height: 100%; border: none; display: block; }
        .customise-btn { width: 4.5rem; }
    `];constructor(){super(),this._open=!1,this._copied=!1,this._picker=null,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=typeof Notification<"u"&&Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this),this._onMessage=this._onMessage.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown),window.addEventListener("message",this._onMessage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown),window.removeEventListener("message",this._onMessage)}_onMessage(e){e.data?.type==="done"&&(this._picker=null)}_onKeydown(e){e.key==="Escape"&&(this._picker?this._picker=null:this._open&&this._close())}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1,this._picker=null}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked&&typeof Notification<"u"){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return u`
            <button class="burger" aria-label=${R.t("Customise settings")} title=${R.t("Customise settings")} aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
            ${this._open?u`
                <div class="backdrop" @click=${e=>e.target===e.currentTarget&&this._close()}>
                    <div class="modal" role="dialog" aria-modal="true" aria-label="Settings">
                        <h3>Settings</h3>

                        <div class="section-title">Preferences</div>
                        <div class="row">
                            <span>Dark mode</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${this._theme==="dark"} @change=${this._setTheme}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span>Enable notifications</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${this._notifEnabled} @change=${this._toggleNotifications}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span>Flip X Axis</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${p.flip} @change=${e=>p.setFlip(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span>Use proxy to connect</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${p.useProxy} @change=${e=>p.setUseProxy(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="section-title">Graphics</div>
                        <div class="row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${n.LOD_LABELS[p.lod]||p.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${p.lod} @input=${e=>p.setLod(e.target.value)}>
                        </div>

                        <div class="section-title">Customise</div>
                        <div class="row">
                            <button class="customise-btn" @click=${()=>this._picker="cue"}>Cue</button>
                            <button class="customise-btn" @click=${()=>this._picker="wall"}>Wall</button>
                        </div>

                        <div class="section-title">Links</div>
                        <div class="row"><a href="https://github.com/tailuge/wbilliards/releases/latest" target="_blank" rel="noopener">Download for Android</a></div>
                        <div class="row"><a href="https://github.com/tailuge/tbilliards/releases/latest" target="_blank" rel="noopener">Download for Mac / Windows / Linux</a></div>
                        <div class="row">
                            <a href="#" @click=${e=>{e.preventDefault(),this._share()}}>
                                Share
                                ${this._copied?u`<span class="copied-badge">Copied!</span>`:""}
                            </a>
                        </div>
                        <div class="row"><a href="./arena.html">Arenas</a></div>
                        <div class="row"><a href="https://github.com/tailuge/billiards/issues" target="_blank" rel="noopener">Support</a></div>
                        <div class="row"><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Contribute</a></div>
                        <div class="row"><a href="https://billiards-network.onrender.com/usage.html" target="_blank" rel="noopener">Usage</a></div>

                        <div><strong style="font-size:0.82rem">Recent visitors</strong><stats-panel></stats-panel></div>

                        <button class="cancel" @click=${this._close} style="margin-top: 0.4rem;">Close</button>
                    </div>
                </div>
                ${this._picker?u`
                    <div class="picker-backdrop" @click=${e=>e.target===e.currentTarget&&(this._picker=null)}>
                        <div class="picker-frame">
                            ${this._picker==="cue"?u`<iframe src="./cue.html" title="Cue"></iframe>`:u`<iframe src="./wall.html?userName=${encodeURIComponent(p.userName)}" title="Wall"></iframe>`}
                        </div>
                    </div>
                `:""}`:""}
        `}};customElements.define("settings-modal",Me);var ae="../lobby.html",ts="../assets/threecushion.png",ss=()=>{try{return localStorage.getItem("theme")||"dark"}catch{return"dark"}},Le=class extends y{static properties={theme:{type:String,reflect:!0,attribute:"theme"},ruleType:{type:String,attribute:"rule-type"},_hasMessage:{state:!0},_pendingChats:{state:!0},_popoverOpen:{state:!0}};static styles=[_e,se,f`
      :host {
        display: block;
        background: var(--bg);
        color: var(--text);
        font-family: Exo, "Exo Fallback", sans-serif;
        font-weight: 200;
        font-size: 0.85rem;
      }
      .topbar {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex-shrink: 0;
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 0.25rem 0;
        background: var(--bg);
      }
      .topbar .logo {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        filter: grayscale(100%);
        opacity: 0.7;
      }
      .topbrand {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        text-decoration: none;
        color: inherit;
        flex-shrink: 0;
      }
      .topbrand:hover {
        opacity: 0.85;
      }
      .topbrand .logo {
        opacity: 1;
        transition: opacity 0.2s;
      }
      h1.title {
        flex: 1;
        min-width: 0;
        margin: 0;
        font-size: 1rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-dim);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      h1.title a {
        color: inherit;
        text-decoration: none;
      }
      h1.title a:hover {
        text-decoration: underline;
      }
      h1.title .version {
        font-size: 0.65rem;
        color: var(--text-dim);
        margin-left: 0.25rem;
        vertical-align: super;
        font-weight: 200;
      }
      .topbar user-badge {
        min-width: 0;
      }
      .topbar settings-modal {
        flex-shrink: 0;
      }
      /* Always shown, centred over the top bar (absolute, out of the flex flow) so it never
         shoves or overlaps the trophy cups and other header controls. By default it is the
         only route back to the lobby; when a chat message or challenge arrives it swaps to
         a pulsing icon. Either state is just a link to the lobby, which owns the chat window
         and challenge banner and knows how to present them. */
      .top-link {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        height: 28px;
        padding: 0 0.55rem;
        background: var(--bg);
        font-size: 0.72rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        line-height: 1;
        text-decoration: none;
        border: 1px solid var(--border);
        border-radius: 6px;
        color: inherit;
      }
      .top-link:hover {
        border-color: var(--text-dim);
      }
      .top-link:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
      /* Message/challenge state: the width collapses back to a square icon. */
      .top-link--alert {
        width: 28px;
        min-width: 0;
        padding: 0;
        font-size: 1rem;
        animation: msg-pulse 2s ease-in-out infinite;
      }
      @keyframes msg-pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.45;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .top-link--alert {
          animation: none;
        }
      }
      /* Chat popover: a compact, read-only summary of messages that arrived while the player
         was on this page (they have no chat UI here). Each line is "sender: text"; the Lobby
         button navigates back so the conversation can be continued there. Clicking outside
         (or Escape) dismisses it while leaving the pulsing icon as the reminder. */
      .chat-popover {
        position: absolute;
        top: calc(50% + 20px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 3;
        width: min(20rem, calc(100vw - 2rem));
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 0.5rem 0.6rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        font-size: 0.78rem;
        line-height: 1.35;
      }
      .chat-popover ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        max-height: 10rem;
        overflow-y: auto;
      }
      .chat-popover-sender {
        font-weight: 600;
      }
      .chat-popover-text {
        color: var(--text-muted);
        overflow-wrap: anywhere;
      }
      .chat-popover-actions {
        display: flex;
        justify-content: flex-end;
      }
      .chat-popover-lobby {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        padding: 0.25rem 0.6rem;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: inherit;
        text-decoration: none;
        font-size: 0.72rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .chat-popover-lobby:hover {
        border-color: var(--text-dim);
      }
      .chat-popover-lobby:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
    `];constructor(){super(),this.theme=ss(),this._hasMessage=!1,this._pendingChats=[],this._popoverOpen=!1,this._lobby=null,this._client=null}connectedCallback(){super.connectedCallback(),this._applyTheme(this.theme),this._onNameChanged=e=>this._updatePresence(e),document.addEventListener("user-name-changed",this._onNameChanged),this._onDocPointerDown=e=>this._handleDocPointerDown(e),document.addEventListener("pointerdown",this._onDocPointerDown),this._onDocKeyDown=e=>{e.key==="Escape"&&this._popoverOpen&&this._dismissPopover()},document.addEventListener("keydown",this._onDocKeyDown),this._connectPresence().catch(e=>console.error("topbar presence failed",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onNameChanged),document.removeEventListener("pointerdown",this._onDocPointerDown),document.removeEventListener("keydown",this._onDocKeyDown);try{this._lobby?.leave()}catch{}try{this._client?.stop()}catch{}}_applyTheme(e){let t=e||"dark";this.theme=t,document.documentElement.setAttribute("theme",t),document.documentElement.style.colorScheme=t}_onThemeChanged(e){this._applyTheme(e.detail),this.dispatchEvent(new CustomEvent("theme-changed",{detail:this.theme,bubbles:!0,composed:!0}))}async _connectPresence(){let t=`https://${typeof I<"u"&&I?I:"billiards-network.onrender.com"}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(t=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`);let s=new te({baseUrl:t});s.setVersion($e(Se)),this._client=s;let i=await s.joinLobby({messageType:"presence",type:"join",userId:p.clientId,userName:p.userName,...this.ruleType?{ruleType:this.ruleType}:{}});this._lobby=i,i.onChat(r=>this._onIncomingChat(r)),i.onChallenge(r=>{r.type==="offer"&&this._flagPendingMessage()})}_updatePresence(e){if(!this._lobby)return;let t=e.detail||{},s=t.userName||p.userName,i=t.userId||p.clientId;this._lobby.updatePresence({userId:i,userName:s}).catch(r=>console.error("topbar: updatePresence failed",r))}_flagPendingMessage(){this._hasMessage||(this._hasMessage=!0)}_onIncomingChat(e){if(!e?.text)return;let t=this._lobby?.getUsers?.().find(s=>s.userId===e.senderId)?.userName||e.senderId;this._pendingChats=[...this._pendingChats,{sender:t,text:e.text}].slice(-5),this._hasMessage=!0,this._popoverOpen=!0}_dismissPopover(){this._popoverOpen&&(this._popoverOpen=!1)}_handleDocPointerDown(e){!this._popoverOpen||(e.composedPath?.()??[]).some(s=>s?.classList?.contains?.("chat-popover"))||this._dismissPopover()}render(){return u`
      <header class="topbar">
        <a href=${ae} class="topbrand" aria-label="Billiards lobby"
          ><img src=${ts} class="logo" alt=""
        /></a>
        <h1 class="title">
          <a href=${ae}>Billiards</a
          ><a
            href="https://github.com/tailuge/billiards"
            target="_blank"
            rel="noopener"
            class="version"
            >${$e(Se)}</a
          >
        </h1>
        <a
          class="top-link ${this._hasMessage?"top-link--alert":""}"
          href=${ae}
          aria-label=${this._hasMessage?"New message \u2014 open the lobby":"Back to the lobby"}
          title=${this._hasMessage?"New message":"Back to the lobby"}
          >${this._hasMessage?"\u{1F4AC}":"Lobby"}</a
        >
        ${this._popoverOpen&&this._pendingChats.length?u`
              <div
                class="chat-popover"
                role="dialog"
                aria-label="New chat messages"
              >
                <ul>
                  ${this._pendingChats.map(e=>u`
                      <li>
                        <span class="chat-popover-sender">${e.sender}:</span>
                        <span class="chat-popover-text">${e.text}</span>
                      </li>
                    `)}
                </ul>
                <div class="chat-popover-actions">
                  <a class="chat-popover-lobby" href=${ae}>Lobby</a>
                </div>
              </div>
            `:""}
        <trophy-item></trophy-item>
        <user-badge></user-badge>
        <settings-modal
          @theme-changed=${e=>this._onThemeChanged(e)}
        ></settings-modal>
      </header>
    `}};customElements.define("app-topbar",Le);function yt(n){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname))return;let e=`${ne}/api/usage/${n}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}yt("map");function is({raceTo:n,clubId:e,clubJapaneseName:t,emoji:s,tableSize:i}={}){let r={...p.getCustom(),emoji:s||"\u{1F1EF}\u{1F1F5}"},o={raceTo:n,club:e,clubName:t};return i&&(o.tableSize=i),ut({ruletype:"threecushion",options:o},p.clientId,p.userName,p.lod,p.flip,r)}window.mapGameUrl=is;})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
