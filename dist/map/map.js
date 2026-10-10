"use strict";(()=>{var H=globalThis,B=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ee=Symbol(),ke=new WeakMap,L=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==ee)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(B&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ke.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ke.set(t,e))}return e}toString(){return this.cssText}},Ce=r=>new L(typeof r=="string"?r:r+"",void 0,ee),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new L(t,r,ee)},Ie=(r,e)=>{if(B)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=H.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},te=B?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Ce(t)})(r):r;var{is:Ze,defineProperty:et,getOwnPropertyDescriptor:tt,getOwnPropertyNames:st,getOwnPropertySymbols:it,getPrototypeOf:rt}=Object,F=globalThis,Pe=F.trustedTypes,nt=Pe?Pe.emptyScript:"",ot=F.reactiveElementPolyfillSupport,N=(r,e)=>r,se={toAttribute(r,e){switch(e){case Boolean:r=r?nt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Ae=(r,e)=>!Ze(r,e),Te={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:Ae};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Te){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&et(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=tt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Te}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let e=rt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let t=this.properties,s=[...st(t),...it(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(te(i))}else e!==void 0&&t.push(te(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ie(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:se).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:se;this._$Em=i;let l=o.fromAttribute(t,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??Ae)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[N("elementProperties")]=new Map,w[N("finalized")]=new Map,ot?.({ReactiveElement:w}),(F.reactiveElementVersions??=[]).push("2.1.2");var ce=globalThis,Me=r=>r,J=ce.trustedTypes,Le=J?J.createPolicy("lit-html",{createHTML:r=>r}):void 0,ze="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,De="?"+_,at=`<${De}>`,k=document,R=()=>k.createComment(""),j=r=>r===null||typeof r!="object"&&typeof r!="function",he=Array.isArray,lt=r=>he(r)||typeof r?.[Symbol.iterator]=="function",ie=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,Ue=/>/g,S=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Re=/'/g,je=/"/g,He=/^(?:script|style|textarea|title)$/i,de=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),p=de(1),_t=de(2),$t=de(3),C=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),Oe=new WeakMap,E=k.createTreeWalker(k,129);function Be(r,e){if(!he(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Le!==void 0?Le.createHTML(e):e}var ct=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=U;for(let l=0;l<t;l++){let a=r[l],c,d,h=-1,u=0;for(;u<a.length&&(o.lastIndex=u,d=o.exec(a),d!==null);)u=o.lastIndex,o===U?d[1]==="!--"?o=Ne:d[1]!==void 0?o=Ue:d[2]!==void 0?(He.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=S):d[3]!==void 0&&(o=S):o===S?d[0]===">"?(o=i??U,h=-1):d[1]===void 0?h=-2:(h=o.lastIndex-d[2].length,c=d[1],o=d[3]===void 0?S:d[3]==='"'?je:Re):o===je||o===Re?o=S:o===Ne||o===Ue?o=U:(o=S,i=void 0);let m=o===S&&r[l+1].startsWith("/>")?" ":"";n+=o===U?a+at:h>=0?(s.push(c),a.slice(0,h)+ze+a.slice(h)+_+m):a+_+(h===-2?l:m)}return[Be(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},O=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,l=e.length-1,a=this.parts,[c,d]=ct(e,t);if(this.el=r.createElement(c,s),E.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=E.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(ze)){let u=d[o++],m=i.getAttribute(h).split(_),y=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:y[2],strings:m,ctor:y[1]==="."?ne:y[1]==="?"?oe:y[1]==="@"?ae:A}),i.removeAttribute(h)}else h.startsWith(_)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(He.test(i.tagName)){let h=i.textContent.split(_),u=h.length-1;if(u>0){i.textContent=J?J.emptyScript:"";for(let m=0;m<u;m++)i.append(h[m],R()),E.nextNode(),a.push({type:2,index:++n});i.append(h[u],R())}}}else if(i.nodeType===8)if(i.data===De)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(_,h+1))!==-1;)a.push({type:7,index:n}),h+=_.length-1}n++}}static createElement(e,t){let s=k.createElement("template");return s.innerHTML=e,s}};function T(r,e,t=r,s){if(e===C)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=j(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=T(r,i._$AS(r,e.values),i,s)),e}var re=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??k).importNode(t,!0);E.currentNode=i;let n=E.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new z(n,n.nextSibling,this,e):a.type===1?c=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(c=new le(n,this,e)),this._$AV.push(c),a=s[++l]}o!==a?.index&&(n=E.nextNode(),o++)}return E.currentNode=k,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=T(this,e,t),j(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):lt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(k.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=O.createElement(Be(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new re(i,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Oe.get(e.strings);return t===void 0&&Oe.set(e.strings,t=new O(e)),t}k(e){he(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(R()),this.O(R()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Me(e).nextSibling;Me(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=T(this,e,t,0),o=!j(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let l=e,a,c;for(e=n[0],a=0;a<n.length-1;a++)c=T(this,l[s+a],t,a),c===C&&(c=this._$AH[a]),o||=!j(c)||c!==this._$AH[a],c===f?e=f:e!==f&&(e+=(c??"")+n[a+1]),this._$AH[a]=c}o&&!i&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ne=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},oe=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},ae=class extends A{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=T(this,e,t,0)??f)===C)return;let s=this._$AH,i=e===f&&s!==f||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==f&&(s===f||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},le=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){T(this,e)}};var ht=ce.litHtmlPolyfillSupport;ht?.(O,z),(ce.litHtmlVersions??=[]).push("3.3.2");var Fe=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new z(e.insertBefore(R(),n),n,void 0,t??{})}return i._$AI(r),i};var pe=globalThis,v=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Fe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};v._$litElement$=!0,v.finalized=!0,pe.litElementHydrateSupport?.({LitElement:v});var dt=pe.litElementPolyfillSupport;dt?.({LitElement:v});(pe.litElementVersions??=[]).push("4.2.2");var M={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:r=>`/publish/table/${r}`,TABLE_SUBSCRIBE:r=>`/subscribe/table/${r}`},V=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let n=JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let c=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(i,c))return}let o=new AbortController,l=setTimeout(()=>o.abort(),2e4),a;try{a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:s.keepalive,signal:o.signal})}finally{clearTimeout(l)}if(!a.ok)throw new Error(`Publish failed: ${a.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages}async publishPresence(e,t){return this.publish(M.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(M.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(M.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(M.TABLE_PUBLISH(e),{...t,senderId:s},i)}subscribePresence(e,t){let s=`uid=${encodeURIComponent(e)}`;typeof document<"u"&&document.referrer&&(s+=`&ref=${encodeURIComponent(document.referrer)}`);let i=`${M.PRESENCE_SUBSCRIBE}?${s}`;return this.subscribe(i,t)}subscribeTable(e,t,s,i){let n=`${M.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return i?.isSpectator&&(n+="&spectator=1"),this.subscribe(n,s)}subscribe(e,t){let s=this.getWsUrl(e),i=()=>new Date().toISOString().slice(11,23),n=null,o=!1,l=0,a=8e3,c=6e4,d=null,h=!0,u=2e4,m=null,y={stop:()=>{o=!0,d&&(clearTimeout(d),d=null),m&&(clearTimeout(m),m=null),n&&(n.close(),n=null)},ready:null},Z;y.ready=new Promise(x=>{Z=x});let Ee=()=>{if(!o){if(n&&n.readyState<=WebSocket.OPEN){Z();return}n=new globalThis.WebSocket(s),m&&clearTimeout(m),m=setTimeout(()=>{console.warn(`[NchanClient ${i()}] Connection to ${s} timed out after ${u}ms, forcing reconnect`),n?.close()},u),m.unref?.(),n.onmessage=x=>{this.record(x.data),t(x.data)},n.onopen=()=>{let x=!h;h=!1,l=0,d&&(clearTimeout(d),d=null),m&&(clearTimeout(m),m=null),Z(),x&&y.onReconnect&&y.onReconnect()},n.onclose=x=>{if(m&&(clearTimeout(m),m=null),!o){if(l>=10){console.error(`[NchanClient ${i()}] Max reconnect attempts reached for ${s}, giving up`);return}let Xe=Math.min(Math.pow(2,l)*a,c);l++,d=setTimeout(Ee,Xe),d.unref?.()}},n.onerror=x=>{console.error(`[NchanClient ${i()}] WebSocket error on ${s}:`,x),n&&(n.onerror=null,n?.close())}}};return Ee(),y}};function Je(r){return r.type==="table:leave"&&!!r.data?.isSpectator}function G(r){if(!r||r.trim()==="")return null;try{return JSON.parse(r)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function Ve(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var ue=250,D=class r{static dedupeChallenges(e){let t=new Set;for(let s of e)s.type!=="offer"&&t.add(r.interactionKey(s));return e.filter(s=>s.type!=="offer"?!0:!t.has(r.interactionKey(s)))}static dedupePresence(e){let t=new Map;for(let s of e){let i=t.get(s.userId);if(i&&i.type!=="leave"&&s.type==="leave"&&s.meta?.origin==="internal"){let n=s.meta?.ts,o=i.meta?.ts??i.clientTs;if(n!==void 0&&o!==void 0&&n>=o&&n-o<=ue)continue}t.set(s.userId,s)}return[...t.values()]}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var q=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.joinSentinelTs=null;this.settledListeners=[];this.isSettled=!1;this.unsettledChallengeMessages=[];this.unsettledPresenceMessages=[];this.heartbeatInterval=s.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(!this.isJoined){this.subscription=this.nchan.subscribePresence(this.currentUser.userId,e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready;for(let e=1;;e++)try{let t=Date.now();this.joinSentinelTs=t,await this.nchan.publishPresence({...this.currentUser,clientTs:t});break}catch(t){let s=Math.min(Math.pow(2,e)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${e}), retrying in ${s}ms:`,t),await new Promise(i=>setTimeout(i,s))}this.startHeartbeat(),this.isJoined=!0}}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(s){console.error("Failed to send heartbeat:",s)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}async challenge(e,t,s,i,n){let o=Ve();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:o,options:s,nextTurnId:i,custom:n}),o}async acceptChallenge(e,t,s,i,n,o,l){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:n??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i,nextTurnId:o,custom:l}),await this.updatePresence({tableId:s,ruleType:t,options:i})}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=G(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledPresenceMessages.push(e),e.userId===this.currentUser.userId&&e.type==="join"&&e.clientTs===this.joinSentinelTs&&this.fireSettled();return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&this.notifyListeners()}}handleChallenge(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let s=e.meta?.ts,i=t.meta?.ts??t.clientTs;return s===void 0||i===void 0?!1:s>=i&&s-i<=ue}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=D.dedupePresence(this.unsettledPresenceMessages);for(let i of e)this.applyPresence(i);this.unsettledPresenceMessages=[];let t=D.dedupeChallenges(this.unsettledChallengeMessages);for(let i of t)this.emitIfRelevant(i);this.unsettledChallengeMessages=[];let s=[...this.settledListeners];this.settledListeners=[];for(let i of s)i()}clearSettleState(){this.joinSentinelTs=null,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.unsettledPresenceMessages=[]}};var W=class r{constructor(e,t,s,i,n=!1,o,l,a,c){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.isSpectator=n;this.onClosed=a;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=c?.maxSize??1e3,this.initialRetryDelayMs=c?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=c?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(d=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(u=>u()),this.preJoinQueue.splice(0).forEach(u=>this.messageListeners.forEach(m=>m(u))),d()}}),o&&this.messageListeners.push(o),l&&this.bothJoinedListeners.push(l)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((s,i)=>{this.publishQueue.push({type:e,data:t,resolve:s,reject:i}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((s,i)=>{let n=o=>{if(this.isClosed){i(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>s()).catch(l=>{if(this.isClosed){i(l);return}let a=Math.min(Math.pow(2,o+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>n(o+1),a)})};n(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=G(e);if(!t||!t.type)return;let s=t.meta?.msgId;if(typeof s=="string"){if(this.seenMsgIds.has(s))return;if(this.seenMsgIds.set(s,!0),this.seenMsgIds.size>r.MAX_SEEN_MSG_IDS){let i=this.seenMsgIds.keys().next().value;i!==void 0&&this.seenMsgIds.delete(i)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!Je(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let n=t.data?.id||t.senderId;n&&(this.seenIds.add(n),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&n!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(o=>o())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(i=>i(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var Y=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new V(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),n,o={...t,onReconnect:()=>{this.resumeSession().catch(a=>console.error("Session resume failed after lobby reconnect:",a)),t?.onReconnect?.()},onLeave:()=>{let a=n??i;if(a){let c=this.activeLobbies.indexOf(a);c!==-1&&this.activeLobbies.splice(c,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let l=new q(this.nchan,e,o);return n=l,await l.join(),this.lobbyInstances.set(e.userId,l),this.activeLobbies.push(l),l}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,s){let i=s?.isSpectator??!1,n=this.tableKey(e,t,i),o=this.joiningTables.get(n);if(o)return o.promise;this.assertNoTableConflict(e,t,i);let l=this.activeTables.find(u=>u.tableId===e);if(l)return Promise.resolve(l);let a=i?void 0:this.activeLobbies.find(u=>u.currentUser.userId===t),c=new W(this.nchan,e,t,a,i,s?.onMessage,s?.onBothJoined,()=>this.removeActiveTable(c));this.activeTables.push(c);let d=c.join().catch(u=>{console.error(`Table ${e} join handshake failed:`,u)});a&&d.then(async()=>{if(!c.closed)try{await a.updatePresence({tableId:e})}catch(u){console.error("Failed to update presence after table join:",u)}});let h=Promise.resolve(c).finally(()=>{this.joiningTables.delete(n)});return this.joiningTables.set(n,{tableId:e,userId:t,isSpectator:i,promise:h}),h}tableKey(e,t,s){return`${e}|${t}|${s?"s":"p"}`}assertNoTableConflict(e,t,s){for(let i of this.joiningTables.values())if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already being joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`);for(let i of this.activeTables)if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,s){return this.joinTable(e,t,{...s,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};var me=b`
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
`,hs=b`
    :host { font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
`,K=b`
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
`,ds=b`
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
`,ps=b`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,us=b`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,Ge=b`
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
    }`,ms=b`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,qe=b`
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
`,gs=b`
    :host { display: block; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,bs=b`
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
`,fs=b`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,vs=[me,b`
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
`];var ge=1215,be=r=>`v${Math.floor(r/100)}.${String(r%100).padStart(2,"0")}`;var I=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",fe=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),ws=fe?`ws://${window.location.hostname}:80`:`wss://${I}`;var We=fe?"":"https://billiards-network.onrender.com",P=typeof window<"u"&&window.location.hostname.includes("vercel");var Ye=r=>{if(r==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!r)return{emoji:"\u{1F310}",title:""};let e=r.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},_s=fe?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/";var Ke=r=>{let e=(r||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},pt={ko:"\uD55C"},ye=()=>{let[r,...e]=(navigator.languages?.[0]||navigator.language||"en").split("-"),t=pt[(r||"").toLowerCase()];return t?`Anon-${t}`:`Anon-${(e.find(n=>/^[A-Za-z]{2}$/.test(n))||r||"en").toUpperCase().slice(0,2)}`};var ve=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();P&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),n=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,s||(this.userName=window.name.split("-")[0]);else{let l=s||n||"",a=!l||i.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&a?i:Ke(l),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=s||this.userName||n||ye(),this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",o=>{if(o.key==="custom"){try{this.custom=JSON.parse(o.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():Ke(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},g=new ve,$=class extends v{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),g.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),g.removeEventListener("change",this._storeListener)}};var ut=[[4352,4447,1],[11904,42191,1],[44032,55203,1],[63744,64255,1],[65040,65135,1],[65280,65376,1],[65504,65510,1],[127744,129791,1.25],[131072,195103,1]],Qe=r=>{let e=0,t=0;for(let s of r){let i=s.codePointAt(0),n=ut.find(([o,l])=>i>=o&&i<=l);n?t+=n[2]:e++}return!e&&!t&&(e=1),`calc(${e}ch + ${+t.toFixed(2)}em)`},xe=class extends ${static properties={_dotColor:{state:!0}};static styles=qe;constructor(){super(),this._clientId=g.clientId,this._name=g.userName,this._dotColor=g.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||ye();this._name=t,g.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return P?p``:p`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${Qe(this._name)}"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Qe(e.target.value)}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",xe);var Q=null,mt=()=>(Q||(Q=fetch(`${We}/api/arena/winners`).then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status)))).then(r=>Array.isArray(r?.winners)?r.winners.filter(e=>e&&typeof e=="object"&&typeof e.userName=="string"):[]).catch(()=>(Q=null,null))),Q),we=class extends ${static styles=b`
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
    `;constructor(){super(),this._trophies=[],this._trophyCheckedFor=null,this._winners=null,this._observer=null,this._idleTimer=null,this._started=!1}connectedCallback(){super.connectedCallback(),P||this._startLazy()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,this._idleTimer&&(clearTimeout(this._idleTimer),this._idleTimer=null),super.disconnectedCallback()}_startLazy(){this._started||(this._started=!0,typeof IntersectionObserver<"u"?(this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&(this._observer.disconnect(),this._observer=null,this._load())}),this._observer.observe(this)):this._whenIdle(()=>this._load()))}_whenIdle(e){typeof requestIdleCallback=="function"?requestIdleCallback(()=>e()):this._idleTimer=setTimeout(e,200)}async _load(){this._winners=await mt(),this._recheck()}_recheck(){let e=(g.userName||"").trim();if(!e||!this._winners){this._trophies.length&&(this._trophies=[],this.requestUpdate());return}if(this._trophyCheckedFor===e)return;this._trophyCheckedFor=e;let t=this._winners.filter(s=>typeof s.userName=="string"&&s.userName.trim()===e);JSON.stringify(t)!==JSON.stringify(this._trophies)&&(this._trophies=t,this.requestUpdate())}willUpdate(){this._recheck()}render(){return P||!this._trophies.length?p``:p`
            <span class="trophy-stack">
                ${this._trophies.map(e=>p`
                    <a
                        class="trophy"
                        href="lobby?arenaId=${encodeURIComponent(e.arenaId)}"
                        title="Arena winner (${e.arenaId})"
                        aria-label="Arena trophy - view arena ${e.arenaId}"
                    >🏆</a>
                `)}
            </span>
        `}};customElements.define("trophy-item",we);var gt=`https://${I}/api/stats`,_e=class extends v{static styles=b`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(gt,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return p`<span class="loading">Could not load stats.</span>`;if(!this._data)return p`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{});return p`
            ${e?p`<div class="uptime"><a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${s.map(([i,n])=>p`
                    <li>${Ye(i).emoji} <span>${i}</span> <span class="count">${n}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",_e);var $e=class r extends ${static properties={_open:{state:!0},_notifEnabled:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[K,Ge,b`
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
    `];constructor(){super(),this._open=!1,this._copied=!1,this._picker=null,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=typeof Notification<"u"&&Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this),this._onMessage=this._onMessage.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown),window.addEventListener("message",this._onMessage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown),window.removeEventListener("message",this._onMessage)}_onMessage(e){e.data?.type==="done"&&(this._picker=null)}_onKeydown(e){e.key==="Escape"&&(this._picker?this._picker=null:this._open&&this._close())}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1,this._picker=null}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked&&typeof Notification<"u"){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return p`
            <button class="burger" aria-label="Settings" aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
            ${this._open?p`
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
                                <input type="checkbox" .checked=${g.flip} @change=${e=>g.setFlip(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span>Use proxy to connect</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${g.useProxy} @change=${e=>g.setUseProxy(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="section-title">Graphics</div>
                        <div class="row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${r.LOD_LABELS[g.lod]||g.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${g.lod} @input=${e=>g.setLod(e.target.value)}>
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
                                ${this._copied?p`<span class="copied-badge">Copied!</span>`:""}
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
                ${this._picker?p`
                    <div class="picker-backdrop" @click=${e=>e.target===e.currentTarget&&(this._picker=null)}>
                        <div class="picker-frame">
                            ${this._picker==="cue"?p`<iframe src="./cue.html" title="Cue"></iframe>`:p`<iframe src="./wall.html?userName=${encodeURIComponent(g.userName)}" title="Wall"></iframe>`}
                        </div>
                    </div>
                `:""}`:""}
        `}};customElements.define("settings-modal",$e);var X="../lobby.html",bt="../assets/threecushion.png",ft=()=>{try{return localStorage.getItem("theme")||"dark"}catch{return"dark"}},Se=class extends v{static properties={theme:{type:String,reflect:!0,attribute:"theme"},ruleType:{type:String,attribute:"rule-type"},_hasMessage:{state:!0},_pendingChats:{state:!0},_popoverOpen:{state:!0}};static styles=[me,K,b`
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
    `];constructor(){super(),this.theme=ft(),this._hasMessage=!1,this._pendingChats=[],this._popoverOpen=!1,this._lobby=null,this._client=null}connectedCallback(){super.connectedCallback(),this._applyTheme(this.theme),this._onNameChanged=e=>this._updatePresence(e),document.addEventListener("user-name-changed",this._onNameChanged),this._onDocPointerDown=e=>this._handleDocPointerDown(e),document.addEventListener("pointerdown",this._onDocPointerDown),this._onDocKeyDown=e=>{e.key==="Escape"&&this._popoverOpen&&this._dismissPopover()},document.addEventListener("keydown",this._onDocKeyDown),this._connectPresence().catch(e=>console.error("topbar presence failed",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onNameChanged),document.removeEventListener("pointerdown",this._onDocPointerDown),document.removeEventListener("keydown",this._onDocKeyDown);try{this._lobby?.leave()}catch{}try{this._client?.stop()}catch{}}_applyTheme(e){let t=e||"dark";this.theme=t,document.documentElement.setAttribute("theme",t),document.documentElement.style.colorScheme=t}_onThemeChanged(e){this._applyTheme(e.detail),this.dispatchEvent(new CustomEvent("theme-changed",{detail:this.theme,bubbles:!0,composed:!0}))}async _connectPresence(){let t=`https://${typeof I<"u"&&I?I:"billiards-network.onrender.com"}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(t=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`);let s=new Y({baseUrl:t});s.setVersion(be(ge)),this._client=s;let i=await s.joinLobby({messageType:"presence",type:"join",userId:g.clientId,userName:g.userName,...this.ruleType?{ruleType:this.ruleType}:{}});this._lobby=i,i.onChat(n=>this._onIncomingChat(n)),i.onChallenge(n=>{n.type==="offer"&&this._flagPendingMessage()})}_updatePresence(e){if(!this._lobby)return;let t=e.detail||{},s=t.userName||g.userName,i=t.userId||g.clientId;this._lobby.updatePresence({userId:i,userName:s}).catch(n=>console.error("topbar: updatePresence failed",n))}_flagPendingMessage(){this._hasMessage||(this._hasMessage=!0)}_onIncomingChat(e){if(!e?.text)return;let t=this._lobby?.getUsers?.().find(s=>s.userId===e.senderId)?.userName||e.senderId;this._pendingChats=[...this._pendingChats,{sender:t,text:e.text}].slice(-5),this._hasMessage=!0,this._popoverOpen=!0}_dismissPopover(){this._popoverOpen&&(this._popoverOpen=!1)}_handleDocPointerDown(e){!this._popoverOpen||(e.composedPath?.()??[]).some(s=>s?.classList?.contains?.("chat-popover"))||this._dismissPopover()}render(){return p`
      <header class="topbar">
        <a href=${X} class="topbrand" aria-label="Billiards lobby"
          ><img src=${bt} class="logo" alt=""
        /></a>
        <h1 class="title">
          <a href=${X}>Billiards</a
          ><a
            href="https://github.com/tailuge/billiards"
            target="_blank"
            rel="noopener"
            class="version"
            >${be(ge)}</a
          >
        </h1>
        <a
          class="top-link ${this._hasMessage?"top-link--alert":""}"
          href=${X}
          aria-label=${this._hasMessage?"New message \u2014 open the lobby":"Back to the lobby"}
          title=${this._hasMessage?"New message":"Back to the lobby"}
          >${this._hasMessage?"\u{1F4AC}":"Lobby"}</a
        >
        ${this._popoverOpen&&this._pendingChats.length?p`
              <div
                class="chat-popover"
                role="dialog"
                aria-label="New chat messages"
              >
                <ul>
                  ${this._pendingChats.map(e=>p`
                      <li>
                        <span class="chat-popover-sender">${e.sender}:</span>
                        <span class="chat-popover-text">${e.text}</span>
                      </li>
                    `)}
                </ul>
                <div class="chat-popover-actions">
                  <a class="chat-popover-lobby" href=${X}>Lobby</a>
                </div>
              </div>
            `:""}
        <trophy-item></trophy-item>
        <user-badge></user-badge>
        <settings-modal
          @theme-changed=${e=>this._onThemeChanged(e)}
        ></settings-modal>
      </header>
    `}};customElements.define("app-topbar",Se);})();
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
