"use strict";(()=>{var j=globalThis,O=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),fe=new WeakMap,I=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(O&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=fe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&fe.set(t,e))}return e}toString(){return this.cssText}},be=i=>new I(typeof i=="string"?i:i+"",void 0,G),h=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,o,s)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+i[s+1],i[0]);return new I(t,i,G)},xe=(i,e)=>{if(O)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),o=j.litNonce;o!==void 0&&r.setAttribute("nonce",o),r.textContent=t.cssText,i.appendChild(r)}},V=O?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return be(t)})(i):i;var{is:We,defineProperty:Ke,getOwnPropertyDescriptor:qe,getOwnPropertyNames:Je,getOwnPropertySymbols:Ze,getPrototypeOf:Qe}=Object,H=globalThis,ve=H.trustedTypes,Xe=ve?ve.emptyScript:"",et=H.reactiveElementPolyfillSupport,T=(i,e)=>i,W={toAttribute(i,e){switch(e){case Boolean:i=i?Xe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},_e=(i,e)=>!We(i,e),ye={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??=Symbol("metadata"),H.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ye){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),o=this.getPropertyDescriptor(e,r,t);o!==void 0&&Ke(this.prototype,e,o)}}static getPropertyDescriptor(e,t,r){let{get:o,set:s}=qe(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:o,set(n){let c=o?.call(this);s?.call(this,n),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ye}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let e=Qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let t=this.properties,r=[...Je(t),...Ze(t)];for(let o of r)this.createProperty(o,t[o])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,o]of t)this.elementProperties.set(r,o)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let o=this._$Eu(t,r);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let o of r)t.unshift(V(o))}else e!==void 0&&t.push(V(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(o!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:W).toAttribute(t,r.type);this._$Em=e,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){let r=this.constructor,o=r._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let s=r.getPropertyOptions(o),n=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:W;this._$Em=o;let c=n.fromAttribute(t,s.type);this[o]=c??this._$Ej?.get(o)??c,this._$Em=null}}requestUpdate(e,t,r,o=!1,s){if(e!==void 0){let n=this.constructor;if(o===!1&&(s=this[e]),r??=n.getPropertyOptions(e),!((r.hasChanged??_e)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:o,wrapped:s},n){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),s!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[o,s]of r){let{wrapped:n}=s,c=this[o];n!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,s,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[T("elementProperties")]=new Map,y[T("finalized")]=new Map,et?.({ReactiveElement:y}),(H.reactiveElementVersions??=[]).push("2.1.2");var ee=globalThis,$e=i=>i,B=ee.trustedTypes,we=B?B.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ie="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+_,tt=`<${Te}>`,S=document,N=()=>S.createComment(""),z=i=>i===null||typeof i!="object"&&typeof i!="function",te=Array.isArray,rt=i=>te(i)||typeof i?.[Symbol.iterator]=="function",K=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Se=/-->/g,Ae=/>/g,$=RegExp(`>|${K}(?:([^\\s"'>=/]+)(${K}*=${K}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ke=/'/g,Ee=/"/g,Re=/^(?:script|style|textarea|title)$/i,re=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),a=re(1),vt=re(2),yt=re(3),A=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Ce=new WeakMap,w=S.createTreeWalker(S,129);function Ne(i,e){if(!te(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return we!==void 0?we.createHTML(e):e}var it=(i,e)=>{let t=i.length-1,r=[],o,s=e===2?"<svg>":e===3?"<math>":"",n=R;for(let c=0;c<t;c++){let l=i[c],p,u,d=-1,b=0;for(;b<l.length&&(n.lastIndex=b,u=n.exec(l),u!==null);)b=n.lastIndex,n===R?u[1]==="!--"?n=Se:u[1]!==void 0?n=Ae:u[2]!==void 0?(Re.test(u[2])&&(o=RegExp("</"+u[2],"g")),n=$):u[3]!==void 0&&(n=$):n===$?u[0]===">"?(n=o??R,d=-1):u[1]===void 0?d=-2:(d=n.lastIndex-u[2].length,p=u[1],n=u[3]===void 0?$:u[3]==='"'?Ee:ke):n===Ee||n===ke?n=$:n===Se||n===Ae?n=R:(n=$,o=void 0);let f=n===$&&i[c+1].startsWith("/>")?" ":"";s+=n===R?l+tt:d>=0?(r.push(p),l.slice(0,d)+Ie+l.slice(d)+_+f):l+_+(d===-2?c:f)}return[Ne(i,s+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},L=class i{constructor({strings:e,_$litType$:t},r){let o;this.parts=[];let s=0,n=0,c=e.length-1,l=this.parts,[p,u]=it(e,t);if(this.el=i.createElement(p,r),w.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(o=w.nextNode())!==null&&l.length<c;){if(o.nodeType===1){if(o.hasAttributes())for(let d of o.getAttributeNames())if(d.endsWith(Ie)){let b=u[n++],f=o.getAttribute(d).split(_),M=/([.?@])?(.*)/.exec(b);l.push({type:1,index:s,name:M[2],strings:f,ctor:M[1]==="."?J:M[1]==="?"?Z:M[1]==="@"?Q:C}),o.removeAttribute(d)}else d.startsWith(_)&&(l.push({type:6,index:s}),o.removeAttribute(d));if(Re.test(o.tagName)){let d=o.textContent.split(_),b=d.length-1;if(b>0){o.textContent=B?B.emptyScript:"";for(let f=0;f<b;f++)o.append(d[f],N()),w.nextNode(),l.push({type:2,index:++s});o.append(d[b],N())}}}else if(o.nodeType===8)if(o.data===Te)l.push({type:2,index:s});else{let d=-1;for(;(d=o.data.indexOf(_,d+1))!==-1;)l.push({type:7,index:s}),d+=_.length-1}s++}}static createElement(e,t){let r=S.createElement("template");return r.innerHTML=e,r}};function E(i,e,t=i,r){if(e===A)return e;let o=r!==void 0?t._$Co?.[r]:t._$Cl,s=z(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(i),o._$AT(i,t,r)),r!==void 0?(t._$Co??=[])[r]=o:t._$Cl=o),o!==void 0&&(e=E(i,o._$AS(i,e.values),o,r)),e}var q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,o=(e?.creationScope??S).importNode(t,!0);w.currentNode=o;let s=w.nextNode(),n=0,c=0,l=r[0];for(;l!==void 0;){if(n===l.index){let p;l.type===2?p=new U(s,s.nextSibling,this,e):l.type===1?p=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(p=new X(s,this,e)),this._$AV.push(p),l=r[++c]}n!==l?.index&&(s=w.nextNode(),n++)}return w.currentNode=S,o}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},U=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,o){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),z(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):rt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,o=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=L.createElement(Ne(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(t);else{let s=new q(o,this),n=s.u(this.options);s.p(t),this.T(n),this._$AH=s}}_$AC(e){let t=Ce.get(e.strings);return t===void 0&&Ce.set(e.strings,t=new L(e)),t}k(e){te(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,o=0;for(let s of e)o===t.length?t.push(r=new i(this.O(N()),this.O(N()),this,this.options)):r=t[o],r._$AI(s),o++;o<t.length&&(this._$AR(r&&r._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=$e(e).nextSibling;$e(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,o,s){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(e,t=this,r,o){let s=this.strings,n=!1;if(s===void 0)e=E(this,e,t,0),n=!z(e)||e!==this._$AH&&e!==A,n&&(this._$AH=e);else{let c=e,l,p;for(e=s[0],l=0;l<s.length-1;l++)p=E(this,c[r+l],t,l),p===A&&(p=this._$AH[l]),n||=!z(p)||p!==this._$AH[l],p===m?e=m:e!==m&&(e+=(p??"")+s[l+1]),this._$AH[l]=p}n&&!o&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},J=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},Z=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},Q=class extends C{constructor(e,t,r,o,s){super(e,t,r,o,s),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??m)===A)return;let r=this._$AH,o=e===m&&r!==m||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==m&&(r===m||o);o&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},X=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var ot=ee.litHtmlPolyfillSupport;ot?.(L,U),(ee.litHtmlVersions??=[]).push("3.3.2");var ze=(i,e,t)=>{let r=t?.renderBefore??e,o=r._$litPart$;if(o===void 0){let s=t?.renderBefore??null;r._$litPart$=o=new U(e.insertBefore(N(),s),s,void 0,t??{})}return o._$AI(i),o};var ie=globalThis,g=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ze(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};g._$litElement$=!0,g.finalized=!0,ie.litElementHydrateSupport?.({LitElement:g});var st=ie.litElementPolyfillSupport;st?.({LitElement:g});(ie.litElementVersions??=[]).push("4.2.2");var oe=h`
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
`,Lt=h`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,Le=h`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
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
`,Ut=h`
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
`,Pt=h`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,Mt=h`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,jt=h`
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
    }`,Ot=h`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,Ue=h`
    :host { display: inline-flex; align-items: center; align-self: center; font-family: 'Exo', sans-serif; font-weight: 200; min-width: 0; overflow: hidden; }
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
`,Ht=h`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,Bt=h`
    :host { display: block; overflow-y: hidden; font-family: 'Exo', sans-serif; font-weight: 200; font-size: 0.75rem; color: var(--text); max-height: 40px; opacity: 0; transition: max-height 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out 0.15s; }
    :host(.loaded) { max-height: 640px; opacity: 1; }
    .tbl { display: inline-block; vertical-align: top; border-radius: 4px; margin: 0.0625rem; overflow: hidden; }
    table { border-collapse: collapse; width: auto; }
    th, td { border-bottom: 1px solid var(--border); padding: 0.05rem 0.15rem; text-align: left; }
    th { display: none; }
    caption { font-size: 1.4rem; font-weight: 600; text-align: center; padding: 0.0rem 0; color: var(--text-dim); }
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
    .group { margin-bottom: 0.14rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.2rem; }
    .group-title { font-size: 0.75rem; font-weight: 600; color: var(--text-dim); padding: 0.1rem 0.25rem; text-align: center; }
    .group-body { display: flex; flex-wrap: wrap; justify-content: space-evenly; }
    .bottom-row { display: flex; align-items: flex-start; gap: 0.1rem; }
    .bottom-row .recent { flex: 65; min-width: 0; height: 508px; overflow-y: auto; scrollbar-width: none; }
    .bottom-row .recent::-webkit-scrollbar { display: none; }
    .bottom-row .top-players { flex: 35; min-width: 0; height: 508px; overflow-y: auto; scrollbar-width: none; }
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
`,Ft=h`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,Dt=[oe,h`
    :host { display: flex; flex-direction: column; min-height: 100%; font-family: 'Exo', sans-serif; font-weight: 200; font-size: 0.85rem; box-sizing: border-box; padding: 0.5rem; gap: 0.2rem; background: var(--bg); color: var(--text); overflow-y: auto; scrollbar-width: none; }
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
    .arenas-row     { grid-area: 2 / 1 / 3 / 3; }
    .arenas-row.arena-details { padding: 2px; }
    .info-row       { grid-area: 3 / 1 / 4 / 3; }

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
`];var Pe=1e3,Me=i=>`v${Math.floor(i/100)}.${String(i%100).padStart(2,"0")}`;var nt=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",se=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),Vt=se?`ws://${window.location.hostname}:80`:`wss://${nt}`;var k=se?"":"https://billiards-network.onrender.com",F=typeof window<"u"&&window.location.hostname.includes("vercel");var Wt=se?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/";var at={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},lt=i=>{let e=at[i];return e?a`<img src="assets/${e}.png" alt="${i}" title="${i}" width="18" height="18" style="vertical-align:middle">`:a`🎱`},je=(i,e={})=>a`<span title="${i}">
    ${lt(i)}${e?.freeaim?"\u2316":""}${Number(e?.tableSize)<10?"\u{1F37C}":""}
</span>`;var Oe=i=>{let e=(i||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},ne=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),r=(e.get("userName")||"").trim();F&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let o=(localStorage.getItem("userId")||"").trim(),s=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,r||(this.userName=window.name.split("-")[0]);else{let c=r||s||"",l=!c||o.split("-")[0].slice(0,4)===c.slice(0,4);this.clientId=o.length>2&&!o.startsWith("user-")&&l?o:Oe(c),this.isForcedId=!1,this.clientId!==o&&localStorage.setItem("userId",this.clientId)}this.userName=r||this.userName||s||"Anonymous",this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",n=>{if(n.key==="custom"){try{this.custom=JSON.parse(n.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():Oe(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},v=new ne,D=class extends g{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),v.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),v.removeEventListener("change",this._storeListener)}};var ct=3e4,dt=5,He=1800*1e3,ht=i=>(Math.floor(i/He)+1)*He,Be=[{name:"Nine Ball Mini Hourly Arena",ruleType:"nineball",options:{tableSize:"6",freeaim:"true"}},{name:"Eight Ball Mini Hourly Arena",ruleType:"eightball",options:{tableSize:"6",freeaim:"true"}},{name:"Snooker Mini Hourly Arena",ruleType:"snooker",options:{tableSize:"6",reds:"3",freeaim:"true"}}],le=h`
    .arena-list { display: flex; flex-direction: column; gap: .2rem; }
    .arena-item { display: flex; align-items: center; gap: .35rem; padding: .25rem; border: 1px solid var(--border); border-radius: 4px; text-decoration: none; color: var(--text); }
    .arena-item.completed { opacity: .8; padding-top: .25rem; padding-bottom: .25rem; }
    .arena-item-main { min-width: 0; flex: 1; }
    .arena-item-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .arena-item-name { font-weight: 400; }
    .arena-item-meta { color: var(--text-muted); font-size: .72rem; font-weight: 400; white-space: nowrap; }
    .arena-winner { margin-left: auto; max-width: 35%; overflow: hidden; text-overflow: ellipsis; color: var(--text-muted); font-size: .72rem; white-space: nowrap; flex-shrink: 0; }
    .arena-join { cursor: pointer; border: 1px solid #0d6efd; border-radius: 4px; background: #0d6efd; color: #fff; font: inherit; font-size: .75rem; padding: .15rem .4rem; flex-shrink: 0; }
    .arena-join:hover { background-color: #0b5ed7; border-color: #0a58ca; }
    .arena-join:active { background-color: #0a58ca; }
    .arena-join:focus-visible { outline: 2px solid #007bff; outline-offset: 1px; }
    .empty { color: var(--text-muted); text-align: center; padding: .5rem 0; }
`,ce=(i,e=!1,t=null,r=!0)=>{let o=`lobby.html?tournamentId=${encodeURIComponent(i.id)}`,s=n=>{t?(n.preventDefault(),n.stopPropagation(),t(i.id)):n.currentTarget instanceof HTMLButtonElement&&(n.preventDefault(),window.location.href=n.currentTarget.closest("a").href)};return a`<a class="arena-item ${e?"completed":""}" href=${o} @click=${s}>
        <div class="arena-item-main"><div class="arena-item-title"><span class="arena-item-name">${je(i.ruleType,i.options)}${i.creatorName?a` · ${i.creatorName}`:""}</span><span class="arena-item-meta"> 👥\uFE0E ${i.players.length} · ⏰\uFE0E ${e?"ended":"ends"} ${new Date(i.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}</span></div></div>
        ${e&&i.winner?a`<span class="arena-winner" title="Winner: ${i.winner}">🏆 ${i.winner}</span>`:""}
        ${e||!r?"":a`<button class="arena-join btn-challenge" type="button" @click=${s}>Open</button>`}
    </a>`},ae=class extends g{static properties={heading:{type:String},_arenas:{state:!0},_error:{state:!0},selectable:{type:Boolean}};static styles=[le,h`
        :host { display: block; }
        h2.title { margin: 0 0 .25rem; font-size: .8rem; font-weight: 600; }
        .error { color: var(--text-muted); font-size: .75rem; text-align: center; padding: .5rem 0; }
    `];constructor(){super(),this.heading="",this._arenas=[],this._error="",this.selectable=!1,this._timer=null}connectedCallback(){super.connectedCallback(),this._load(),this._timer=setInterval(()=>this._load(),ct)}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),super.disconnectedCallback()}async load(){await this._load()}async _load(){try{let e=await fetch(`${k}/api/arena`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arenas (${e.status})`);let r=Date.now();if(!(t.arenas||[]).some(s=>s.endTime>r&&s.status!=="finished")){let s=ht(r);if(Math.floor((s-r)/6e4)>=dt){let c=new Date(s),l=String(c.getUTCHours()).padStart(2,"0"),p=String(c.getUTCMinutes()).padStart(2,"0"),u=`${c.getUTCFullYear()}${String(c.getUTCMonth()+1).padStart(2,"0")}${String(c.getUTCDate()).padStart(2,"0")}-${l}${p}`,d=c.getUTCMinutes()>=30?1:0,b=(2*c.getUTCHours()+d)%Be.length,f=Be[b];if(await fetch(`${k}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`arena-hourly-${u}`,creatorId:"hourly-arena",creatorName:f.name,ruleType:f.ruleType,options:f.options,endTime:s})}),e=await fetch(`${k}/api/arena`),t=await e.json(),!e.ok)throw new Error(t.error||`Unable to reload Arenas (${e.status})`)}}this._arenas=(t.arenas||[]).sort((s,n)=>n.createdAt-s.createdAt),this._error="",this.dispatchEvent(new CustomEvent("arenas-loaded",{detail:{arenas:this._arenas},bubbles:!0,composed:!0}))}catch(e){this._error=e.message||"Unable to load Arenas."}}get _activeArenas(){let e=Date.now();return this._arenas.filter(t=>t.endTime>e&&t.status!=="finished")}_onSelect(e){this.dispatchEvent(new CustomEvent("arena-select",{detail:{arenaId:e},bubbles:!0,composed:!0}))}render(){let e=this._activeArenas;return a`
            ${this.heading?a`<h2 class="title">${this.heading}</h2>`:""}
            ${this._error&&!e.length?a`<div class="error">Could not load arenas.</div>`:e.length?a`<div class="arena-list" aria-label="Active Arenas">${e.map(t=>ce(t,!1,this.selectable?r=>this._onSelect(r):null))}</div>`:a`<div class="empty">No active Arenas.</div>`}
        `}};customElements.define("active-arenas",ae);var pt=[[4352,4447],[11904,42191],[44032,55203],[63744,64255],[65040,65135],[65280,65376],[65504,65510],[127744,129791],[131072,195103]],Fe=i=>{let e=0;for(let t of i){let r=t.codePointAt(0);e+=pt.some(([o,s])=>r>=o&&r<=s)?2:1}return Math.max(e,1)},de=class extends D{static properties={_dotColor:{state:!0}};static styles=Ue;constructor(){super(),this._clientId=v.clientId,this._name=v.userName,this._dotColor=v.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,v.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return F?a``:a`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${Fe(this._name)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Fe(e.target.value)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",de);var Y=[{code:"en",label:"English"},{code:"ko",label:"\uD55C\uAD6D\uC5B4"},{code:"ja",label:"\u65E5\u672C\u8A9E"},{code:"tr",label:"T\xFCrk\xE7e"}],ut={ko:{"Play Solo":"\uD63C\uC790 \uD50C\uB808\uC774","Challenge {name}":"{name}\uC5D0\uAC8C \uB300\uACB0 \uC2E0\uCCAD",PLAY:"\uD50C\uB808\uC774",Cancel:"\uCDE8\uC18C","Select game variant":"\uAC8C\uC784 \uBCC0\uD615 \uC120\uD0DD","Game type":"\uAC8C\uC784 \uC885\uB958","{game} variant":"{game} \uBCC0\uD615","Table:":"\uD14C\uC774\uBE14:","Full size":"\uC804\uCCB4 \uD06C\uAE30",Mini:"\uBBF8\uB2C8","Shot time:":"\uC0F7 \uC2DC\uAC04:","Rule:":"\uADDC\uCE59:","Aim:":"\uC870\uC900:",Free:"\uC790\uC720",Assist:"\uBCF4\uC870","Free aim":"\uC790\uC720 \uC870\uC900","Aim assist":"\uC870\uC900 \uBCF4\uC870","Send message":"\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30",Language:"\uC5B8\uC5B4","Eight Ball":"\uC5D0\uC774\uD2B8\uBCFC","Nine Ball":"\uB098\uC778\uBCFC",Snooker:"\uC2A4\uB204\uCEE4","Three Cushion":"\uC4F0\uB9AC\uCFE0\uC158",Sagu:"\uC0AC\uAD6C","Reds 3":"\uBE68\uAC04\uACF5 3","Reds 6":"\uBE68\uAC04\uACF5 6","Reds 10":"\uBE68\uAC04\uACF5 10","Reds 15":"\uBE68\uAC04\uACF5 15","Race to 7":"7\uC810 \uC120\uCDE8","Race to 15":"15\uC810 \uC120\uCDE8","Race to 25":"25\uC810 \uC120\uCDE8","Race to 5":"5\uC810 \uC120\uCDE8","Race to 11":"11\uC810 \uC120\uCDE8","Use these parameters":"\uC774 \uC124\uC815\uC73C\uB85C \uC2DC\uC791"},ja:{"Play Solo":"\u3072\u3068\u308A\u3067\u30D7\u30EC\u30A4","Challenge {name}":"{name}\u306B\u6311\u6226",PLAY:"\u30D7\u30EC\u30A4",Cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB","Select game variant":"\u30B2\u30FC\u30E0\u306E\u30D0\u30EA\u30A2\u30F3\u30C8\u3092\u9078\u629E","Game type":"\u30B2\u30FC\u30E0\u306E\u7A2E\u985E","{game} variant":"{game}\u306E\u30D0\u30EA\u30A2\u30F3\u30C8","Table:":"\u30C6\u30FC\u30D6\u30EB:","Full size":"\u30D5\u30EB\u30B5\u30A4\u30BA",Mini:"\u30DF\u30CB","Shot time:":"\u30B7\u30E7\u30C3\u30C8\u6642\u9593:","Rule:":"\u30EB\u30FC\u30EB:","Aim:":"\u30A8\u30A4\u30E0:",Free:"\u30D5\u30EA\u30FC",Assist:"\u30A2\u30B7\u30B9\u30C8","Free aim":"\u30D5\u30EA\u30FC\u30A8\u30A4\u30E0","Aim assist":"\u30A8\u30A4\u30E0\u30A2\u30B7\u30B9\u30C8","Send message":"\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u308B",Language:"\u8A00\u8A9E","Eight Ball":"\u30A8\u30A4\u30C8\u30DC\u30FC\u30EB","Nine Ball":"\u30CA\u30A4\u30F3\u30DC\u30FC\u30EB",Snooker:"\u30B9\u30CC\u30FC\u30AB\u30FC","Three Cushion":"\u30B9\u30EA\u30FC\u30AF\u30C3\u30B7\u30E7\u30F3",Sagu:"\u56DB\u7403","Reds 3":"\u8D64\u7403 3","Reds 6":"\u8D64\u7403 6","Reds 10":"\u8D64\u7403 10","Reds 15":"\u8D64\u7403 15","Race to 7":"7\u70B9\u5148\u53D6","Race to 15":"15\u70B9\u5148\u53D6","Race to 25":"25\u70B9\u5148\u53D6","Race to 5":"5\u70B9\u5148\u53D6","Race to 11":"11\u70B9\u5148\u53D6","Use these parameters":"\u3053\u306E\u8A2D\u5B9A\u3067\u958B\u59CB"},tr:{"Play Solo":"Tek Oyna","Challenge {name}":"{name} ile D\xFCello",PLAY:"OYNA",Cancel:"\u0130ptal","Select game variant":"Oyun varyant\u0131 se\xE7","Game type":"Oyun t\xFCr\xFC","{game} variant":"{game} varyant\u0131","Table:":"Masa:","Full size":"Tam boy",Mini:"Mini","Shot time:":"At\u0131\u015F s\xFCresi:","Rule:":"Kural:","Aim:":"Ni\u015Fan:",Free:"Serbest",Assist:"Yard\u0131ml\u0131","Free aim":"Serbest ni\u015Fan","Aim assist":"Ni\u015Fan yard\u0131m\u0131","Send message":"Mesaj g\xF6nder",Language:"Dil","Eight Ball":"Sekiz Top","Nine Ball":"Dokuz Top",Snooker:"Snooker","Three Cushion":"\xDC\xE7 Bant",Sagu:"Sagu","Reds 3":"3 K\u0131rm\u0131z\u0131","Reds 6":"6 K\u0131rm\u0131z\u0131","Reds 10":"10 K\u0131rm\u0131z\u0131","Reds 15":"15 K\u0131rm\u0131z\u0131","Race to 7":"7 Say\u0131ya","Race to 15":"15 Say\u0131ya","Race to 25":"25 Say\u0131ya","Race to 5":"5 Say\u0131ya","Race to 11":"11 Say\u0131ya","Use these parameters":"Bu ayarlarla ba\u015Fla"}},De="selector_lang";function mt(){try{let e=localStorage.getItem(De);if(e&&Y.some(t=>t.code===e))return e}catch{}let i=typeof navigator<"u"&&navigator.languages?.length?navigator.languages:typeof navigator<"u"&&navigator.language?[navigator.language]:[];for(let e of i){let t=String(e).toLowerCase().split("-")[0],r=Y.find(o=>o.code===t);if(r)return r.code}return"en"}var he=class{#t="en";#r=new Set;constructor(){this.#t=mt()}get lang(){return this.#t}get languages(){return Y}t(e,t){let r=ut[this.#t]?.[e]??e;if(t)for(let[o,s]of Object.entries(t))r=r.replaceAll(`{${o}}`,String(s));return r}set(e){if(!(!Y.some(t=>t.code===e)||e===this.#t)){this.#t=e;try{localStorage.setItem(De,e)}catch{}for(let t of this.#r)t(e)}}onChange(e){return this.#r.add(e),()=>this.#r.delete(e)}},Ye=new he;var P=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",freeaim:!0,variants:[{id:"std",short:"",label:"Eight Ball",options:{}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",freeaim:!0,variants:[{id:"std",short:"",label:"Nine Ball",options:{}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",freeaim:!0,variants:[{id:"3",short:"Reds 3",label:"Reds 3",options:{reds:"3"}},{id:"6",short:"Reds 6",label:"Reds 6",options:{reds:"6"}},{id:"10",short:"Reds 10",label:"Reds 10",options:{reds:"10"}},{id:"15",short:"Reds 15",label:"Reds 15",options:{reds:"15"}}],sizes:!0},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",freeaim:!0,variants:[{id:"7",short:"Race to 7",label:"Race to 7",options:{raceTo:"7"}},{id:"15",short:"Race to 15",label:"Race to 15",options:{raceTo:"15"}},{id:"25",short:"Race to 25",label:"Race to 25",options:{raceTo:"25"}}],sizes:!0},{key:"sagu",label:"Sagu",img:"assets/sagu.png",freeaim:!0,variants:[{id:"5",short:"Race to 5",label:"Race to 5",options:{raceTo:"5"}},{id:"11",short:"Race to 11",label:"Race to 11",options:{raceTo:"11"}}],sizes:!0}];for(let i of P)i.sizes=!0;var Ge=["10","20","60"],Ve="20",x={get(i,e){let t=localStorage.getItem(`selector_${i}`);return t===null?e:t},set(i,e){localStorage.setItem(`selector_${i}`,e)}},pe=(i,e,t)=>i.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),ue=class extends g{static properties={mode:{type:String},opponent:{type:String},open:{type:Boolean,reflect:!0},heading:{type:String},actionLabel:{type:String},_sel:{state:!0},_freeaim:{state:!0},_vid:{state:!0},_size:{state:!0},_shotClock:{state:!0},_lang:{state:!0}};#t=Ye;#r;static styles=h`
    :host {
      display: block;
      font-family: 'Exo', sans-serif;
      font-weight: 200;
      color: var(--text);
    }
    :host(:not([open])) { display: none; }
    button { font: inherit; cursor: pointer; border-radius: 4px; box-sizing: border-box; }
    button:focus-visible, input:focus-visible {
      outline: 2px solid var(--accent, #4a9eff);
      outline-offset: 2px;
    }

    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(1px);
      display: flex; align-items: center; justify-content: center;
      z-index: 100;
    }
    .modal {
      box-sizing: border-box;
      background: var(--modal-bg, #2a2a2a);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.65rem 0.75rem;
      width: 320px;
      max-width: calc(100vw - 1.5rem);
      display: flex; flex-direction: column; gap: 6px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }
    h3 { margin: 0 0 2px; font-size: 0.9rem; text-align: center; font-weight: 600; }

    .tiles { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
    .tile {
      position: relative;
      width: 54px;
      padding: 3px 3px 2px;
      background: var(--btn-bg);
      border: 1px solid var(--btn-border);
      transition: border-color 0.12s, box-shadow 0.12s, transform 0.12s;
    }
    .tile:hover { background: var(--btn-hover); transform: translateY(-1px); }
    .tile.selected { border-color: var(--accent, #4a9eff); box-shadow: 0 0 0 1px var(--accent, #4a9eff); }
    .tile img { display: block; width: 46px; height: 46px; object-fit: contain; }
    .tile .tile-label {
      display: block;
      font-size: 0.53rem;
      text-align: center;
      color: var(--text-muted);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tile.selected .tile-label { color: var(--accent, #4a9eff); font-weight: 600; }
    .variants {
      display: flex; flex-wrap: wrap; gap: 3px;
      justify-content: center;
      min-height: 22px;
    }
    .choice-group {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }
    .choice-label {
      color: var(--text-muted);
      font-size: 0.66rem;
      margin-right: 2px;
    }
    .chip {
      min-height: 22px;
      padding: 1px 9px;
      font-size: 0.72rem;
      background: var(--btn-bg);
      border: 1px solid var(--btn-border);
      color: var(--text);
      transition: all 0.1s;
    }
    .chip:hover { background: var(--btn-hover); border-color: var(--accent, #4a9eff); }
    .chip.selected {
      background: var(--accent, #4a9eff);
      border-color: var(--accent, #4a9eff);
      color: #fff;
      font-weight: 600;
    }
    .chip.toggle { font-size: 0.66rem; }
    .aim-group {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }
    .chip.toggle.on { background: var(--accent, #4a9eff); border-color: var(--accent, #4a9eff); color: #fff; }

    .hint {
      text-align: center;
      font-size: 0.62rem;
      color: var(--text-muted);
      min-height: 1em;
    }
    .languages {
      text-align: center;
      font-size: 0.62rem;
    }
    .languages a {
      color: var(--text-muted);
      text-decoration: underline;
      cursor: pointer;
      margin: 0 0.2rem;
    }
    .languages a.active {
      color: var(--accent, #4a9eff);
      font-weight: 600;
      text-decoration: none;
    }

    .action {
      width: 100%;
      min-height: 42px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: var(--accent, #4a9eff);
      border: none;
      color: #fff;
      font-size: 1.25rem;
      font-weight: 200;
      letter-spacing: 0.12em;
      transition: background 0.12s, transform 0.05s;
    }
    .action:hover { background: var(--accent-hover, var(--accent, #4a9eff)); }
    .action:active { transform: scale(0.985); }

    .footer { display: flex; gap: 4px; }
    .footer .msg-btn {
      flex-shrink: 0;
      min-width: 30px;
      background: var(--btn-bg);
      border: 1px solid var(--btn-border);
    }
    .footer .msg-btn:hover { background: var(--btn-hover); }
    .footer .cancel {
      flex: 1;
      background: var(--modal-cancel, #3a3a3a);
      color: var(--text);
      border: 1px solid var(--btn-border);
    }
    .footer .cancel:hover { background: var(--btn-hover); }
  `;constructor(){super(),this.mode="solo",this.opponent="",this.open=!1,this.heading="",this.actionLabel="",this._size=x.get("size","full");let e=x.get("shotClock",Ve);this._shotClock=Ge.includes(e)?e:Ve,this._sel=x.get("game","threecushion"),P.some(t=>t.key===this._sel)||(this._sel="threecushion"),this.#i(this._sel),this._lang=this.#t.lang,this.#r=this.#t.onChange(t=>{this._lang=t})}disconnectedCallback(){super.disconnectedCallback(),this.#r?.()}#e(e,t){return this.#t.t(e,t)}get game(){return P.find(e=>e.key===this._sel)}get variant(){let e=this.game;return e.variants.find(t=>t.id===this._vid[this._sel])??e.variants[0]}#i(e){let t=P.find(o=>o.key===e),r=x.get(`v_${e}`,null);this._vid={...this._vid,[e]:t.variants.some(o=>o.id===r)?r:t.variants[0].id},this._freeaim=x.get("freeaim","false")==="true"&&!!t.freeaim,this._size=x.get(`size_${e}`,"full")}show(){this.open=!0}hide(){this.open=!1}_selectGame(e){this._sel!==e&&(this._sel=e,x.set("game",e),this.#i(e))}_selectVariant(e){this._vid={...this._vid,[this._sel]:e},x.set(`v_${this._sel}`,e)}_selectSize(e){this._size=e,x.set(`size_${this._sel}`,e),this._sel==="snooker"&&e==="mini"&&!["3","6"].includes(this._vid[this._sel])&&this._selectVariant("3")}_selectShotClock(e){this._shotClock=e,x.set("shotClock",e)}_toggleFreeaim(){this._freeaim=!this._freeaim,x.set("freeaim",String(this._freeaim))}_confirm(){let e={...this.variant.options};this._size==="mini"?e.tableSize=["snooker","nineball","eightball"].includes(this.game.key)?"6":"5":this.game.key==="snooker"&&(e.tableSize="12"),this.game.freeaim&&this._freeaim&&(e.freeaim="true"),e.shotClock=this._shotClock,pe(this,"confirm",{mode:this.mode,ruleType:this.game.key,options:e,opponent:this.opponent||void 0}),this.hide()}#o(e){let t=this.#e(e.label);return t==="Three Cushion"?"3-Cush.":t}_actionLabel(){return this.#e(this.actionLabel||"PLAY")}_title(){return this.heading?this.#e(this.heading):this.mode==="challenge"?this.#e("Challenge {name}",{name:this.opponent}):this.#e("Play Solo")}render(){if(!this.open)return a``;let e=this.game;return a`
      <div class="backdrop" @click=${t=>t.target===t.currentTarget&&this.hide()}>
        <div class="modal" role="dialog" aria-modal="true" aria-label=${this.#e("Select game variant")}>
          <h3>${this._title()}</h3>

          <div class="tiles" role="radiogroup" aria-label=${this.#e("Game type")}>
            ${P.map(t=>a`
              <button
                class="tile ${t.key===this._sel?"selected":""}"
                role="radio"
                aria-checked=${t.key===this._sel}
                title=${this.#e(t.label)}
                @click=${()=>this._selectGame(t.key)}
              >
                <img src=${t.img} alt="" />
                <span class="tile-label">${this.#o(t)}</span>
              </button>
            `)}
          </div>

          ${e.variants.length>1||e.freeaim||e.sizes?a`
            <div class="variants" role="radiogroup" aria-label=${this.#e("{game} variant",{game:this.#e(e.label)})}>
              ${e.sizes?a`
                <div class="choice-group">
                  <span class="choice-label">${this.#e("Table:")}</span>
                  <button
                    class="chip ${this._size==="full"?"selected":""}"
                    role="radio"
                    aria-checked=${this._size==="full"}
                    @click=${()=>this._selectSize("full")}
                  >${this.#e("Full size")}</button>
                  <button
                    class="chip ${this._size==="mini"?"selected":""}"
                    role="radio"
                    aria-checked=${this._size==="mini"}
                    @click=${()=>this._selectSize("mini")}
                  >${this.#e("Mini")}</button>
                </div>
              `:""}
              <div class="choice-group">
                <span class="choice-label">${this.#e("Shot time:")}</span>
                ${Ge.map(t=>a`
                  <button
                    class="chip ${this._shotClock===t?"selected":""}"
                    role="radio"
                    aria-checked=${this._shotClock===t}
                    @click=${()=>this._selectShotClock(t)}
                  >${t}s</button>
                `)}
              </div>
              ${e.variants.length>1?a`
                <div class="choice-group">
                  <span class="choice-label">${this.#e("Rule:")}</span>
                  ${e.variants.filter(t=>e.key!=="snooker"||this._size!=="mini"||["3","6"].includes(t.id)).map(t=>a`
                    <button
                      class="chip ${this.variant.id===t.id?"selected":""}"
                      role="radio"
                      aria-checked=${this.variant.id===t.id}
                      title=${t.label}
                      @click=${()=>this._selectVariant(t.id)}
                    >${this.#e(t.short||t.label)}</button>
                  `)}
                </div>
              `:""}
              ${e.freeaim?a`
                <div class="aim-group">
                  <span class="choice-label">${this.#e("Aim:")}</span>
                  <button
                    class="chip toggle ${this._freeaim?"on":""}"
                    aria-pressed=${this._freeaim}
                    title=${this.#e("Free aim")}
                    @click=${()=>this._toggleFreeaim()}
                  >${this.#e("Free")}</button>
                  <button
                    class="chip toggle ${this._freeaim?"":"on"}"
                    aria-pressed=${!this._freeaim}
                    title=${this.#e("Aim assist")}
                    @click=${()=>this._toggleFreeaim()}
                  >${this.#e("Assist")}</button>
                </div>
              `:""}
            </div>
          `:""}

          <button class="action" @click=${()=>this._confirm()}>
            ${this._actionLabel()}
          </button>

          <div class="footer">
            ${this.mode==="challenge"?a`<button class="msg-btn" type="button" aria-label=${this.#e("Send message")}
                  @click=${()=>{pe(this,"message"),this.hide()}}>💬</button>`:""}
            <button class="cancel" @click=${()=>{pe(this,"cancel"),this.hide()}}>
              ${this.#e("Cancel")}
            </button>
          </div>

          <div class="languages" aria-label=${this.#e("Language")}>
            ${this.#t.languages.map(t=>a`
              <a
                href="#"
                class=${t.code===this._lang?"active":""}
                aria-current=${t.code===this._lang?"true":"false"}
                @click=${r=>{r.preventDefault(),this.#t.set(t.code)}}
              >${t.label}</a>
            `)}
          </div>
        </div>
      </div>`}};customElements.define("selector-modal",ue);var me=class extends g{static properties={ruleType:{type:String},options:{attribute:!1},durationMinutes:{type:Number},busy:{type:Boolean},error:{type:String}};static styles=h`
        :host { display: block; color: var(--text); }
        .field { margin: .3rem 0; }
        label { display: block; margin-bottom: .25rem; color: var(--text-muted); font-size: .75rem; }
        select { width: 100%; box-sizing: border-box; padding: .25rem; background: var(--btn-bg); color: var(--text); border: 1px solid var(--btn-border); border-radius: 4px; font: inherit; }
        .config { display: flex; align-items: center; justify-content: center; gap: .3rem; padding: .25rem; border: 1px dashed var(--border); border-radius: 4px; }
        .config-actions { display: flex; align-items: center; gap: .3rem; flex-shrink: 0; }
        .btn-preset { display: flex; align-items: center; gap: .25rem; padding: .25rem .4rem; background: var(--btn-bg); color: var(--text); border: 1px solid var(--btn-border); border-radius: 4px; cursor: pointer; font: inherit; font-size: .75rem; }
        .btn-preset:hover { background: var(--btn-hover, #444); }
        .btn-preset img { width: 18px; height: 18px; display: block; }
        .create { width: 100%; padding: .35rem; font-size: .9rem; }
        .error { padding: .45rem; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
    `;constructor(){super(),this.ruleType="",this.options={},this.durationMinutes=10,this.busy=!1,this.error=""}_openChooser(){this.renderRoot.querySelector("selector-modal").show()}_selectPreset(e,t,r=10){this.ruleType=e,this.options=t,this.durationMinutes=r,this._notifyChange(),this._create()}_onParameters(e){this.ruleType=e.detail.ruleType,this.options=e.detail.options||{},this._notifyChange(),this._create()}_notifyChange(){this.dispatchEvent(new CustomEvent("parameters-change",{bubbles:!0,composed:!0,detail:{ruleType:this.ruleType,options:this.options,durationMinutes:this.durationMinutes}}))}_onDurationChange(e){this.durationMinutes=Number(e.target.value),this._notifyChange()}_create(){this.dispatchEvent(new CustomEvent("create-arena",{bubbles:!0,composed:!0}))}render(){return a`<div class="field"><label for="duration">Duration</label><select id="duration" .value=${String(this.durationMinutes)} @change=${this._onDurationChange}><option value="10">10 minutes</option><option value="30">30 minutes</option></select></div><div class="field"><label>Game type</label><div class="config"><div class="config-actions"><button type="button" class="btn-preset" title="10 mins Three Cushion (mini, race to 7)" @click=${()=>this._selectPreset("threecushion",{raceTo:"7",tableSize:"5"},10)}><img src="assets/threecushion.png" alt="" /><span>3-Cushion</span></button><button type="button" class="btn-preset" title="10 mins Nine Ball (mini, freeaim)" @click=${()=>this._selectPreset("nineball",{tableSize:"6",freeaim:"true"},10)}><img src="assets/nineball.png" alt="" /><span>9-Ball</span></button><button type="button" class="btn-preset" title="10 mins Eight Ball (mini, freeaim)" @click=${()=>this._selectPreset("eightball",{tableSize:"6",freeaim:"true"},10)}><img src="assets/eightball.png" alt="" /><span>8-Ball</span></button><button type="button" class="btn-preset" @click=${this._openChooser}>Custom</button></div></div></div>${this.error?a`<div class="error" role="alert">${this.error}</div>`:""}<selector-modal heading="Select game variant" actionLabel="Use these parameters" @confirm=${this._onParameters}></selector-modal>`}};customElements.define("arena-create-form",me);var ge=class extends g{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_id:{state:!0},_ruleType:{state:!0},_options:{state:!0},_durationMinutes:{state:!0},_createdArena:{state:!0},_arenas:{state:!0},_completedArenas:{state:!0},_busy:{state:!0},_error:{state:!0}};static styles=[oe,Le,le,h`
        :host { display: block; min-height: 100vh; box-sizing: border-box; padding: .5rem; background: var(--bg); color: var(--text); font-family: 'Exo', sans-serif; font-size: .85rem; }
        .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem; position: sticky; top: 0; z-index: 2; padding: .25rem 0; background: var(--bg); }
        .logo { width: 32px; height: 32px; flex-shrink: 0; opacity: .7; }
        .topbrand { display: inline-flex; align-items: center; gap: .4rem; text-decoration: none; color: inherit; flex-shrink: 0; }
        .topbrand:hover { opacity: 0.85; }
        .topbrand .logo { opacity: 1; transition: opacity 0.2s; }
        h1 { flex: 1; margin: 0; font-size: 1rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); }
        h1 a { color: inherit; text-decoration: none; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: .4rem; margin-bottom: .25rem; }
        .title { margin: 0 0 .25rem; font-size: .8rem; font-weight: 600; }
        .error { padding: .45rem; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
        .success { color: #198754; }
        .url { display: flex; gap: .3rem; }
        .url input { flex: 1; min-width: 0; padding: .35rem; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: 4px; font: inherit; font-size: .7rem; }
        .meta { color: var(--text-muted); font-size: .75rem; line-height: 1.6; }
        .back-lobby { margin-left: auto; }
    `];constructor(){super(),this._theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme;let e=new URLSearchParams(window.location.search),t=e.get("id")||e.get("tournamentId");if(t){let r=new URL("./lobby.html",window.location.href);r.searchParams.set("tournamentId",t),window.location.replace(r.href);return}this._ruleType="",this._options={},this._durationMinutes=10,this._createdArena=null,this._arenas=[],this._completedArenas=[],this._busy=!1,this._error=""}connectedCallback(){super.connectedCallback(),this._loadCompletedArenas()}async _loadCompletedArenas(){try{let e=await fetch(`${k}/api/arena/results`),t=await e.json();e.ok&&Array.isArray(t.results)&&(this._completedArenas=t.results)}catch{this._completedArenas=[]}}async _create(){if(!this._ruleType){this._error="Choose game parameters first.";return}this._busy=!0,this._error="";try{let e=await fetch(`${k}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({creatorId:v.clientId,creatorName:v.userName||"Anonymous",ruleType:this._ruleType,options:this._options,durationMinutes:this._durationMinutes})}),t=await e.json();if(!e.ok)throw new Error(t.error||`Create failed (${e.status})`);this._createdArena=t.arena,await this._refreshActiveArenas(),await this._loadCompletedArenas()}catch(e){this._error=e.message||"Unable to create Arena."}finally{this._busy=!1}}_backToLobby(){window.location.href="./lobby.html"}_renderHeader(){return a`<header class="topbar">
            <a href="https://billiards.tailuge.workers.dev/lobby" class="topbrand" aria-label="Billiards lobby"><img src="assets/threecushion.png" class="logo" alt="" /></a>
            <h1><a href="https://billiards.tailuge.workers.dev/lobby">Billiards</a><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" class="version">${Me(Pe)}</a></h1>
            <user-badge></user-badge>
            <button class="back-lobby" type="button" @click=${this._backToLobby}>Back to lobby</button>
        </header>`}_arenaUrl(){if(!this._createdArena)return"";let e=window.location.origin,t=window.location.pathname.replace(/\/tournament\/[^/]*$/,"/lobby.html");return`${e}${t}?tournamentId=${encodeURIComponent(this._createdArena.id)}`}async _copy(){let e=this._arenaUrl();try{await navigator.clipboard.writeText(e)}catch{let t=this.renderRoot.querySelector(".url input");t&&(t.focus(),t.select())}}_onArenasLoaded(e){this._arenas=e.detail.arenas||[],this._loadCompletedArenas()}async _refreshActiveArenas(){let e=this.renderRoot.querySelector("active-arenas");e&&await e.load()}_renderCompletedArenas(){return this._completedArenas.length?a`<div class="arena-list" aria-label="Completed Arenas">${this._completedArenas.map(e=>ce(e,!0))}</div>`:a`<div class="empty">No completed Arenas.</div>`}_renderArenaSections(){return a`
            <section class="panel">
                <active-arenas heading="Active Arenas" @arenas-loaded=${this._onArenasLoaded}></active-arenas>
            </section>
            <section class="panel">
                <h2 class="title">Completed Arenas</h2>
                ${this._renderCompletedArenas()}
            </section>`}render(){let e=this._createdArena;return a`<div class="container">
            ${this._renderHeader()}
            <section class="panel">
                <h2 class="title">Create Arena</h2>
                <arena-create-form
                    .ruleType=${this._ruleType}
                    .options=${this._options}
                    .durationMinutes=${this._durationMinutes}
                    .busy=${this._busy}
                    .error=${this._error}
                    @parameters-change=${t=>{this._ruleType=t.detail.ruleType,this._options=t.detail.options,this._durationMinutes=t.detail.durationMinutes}}
                    @create-arena=${this._create}
                ></arena-create-form>
            </section>
            ${e?a`<section class="panel"><h2 class="title success">Arena created</h2><div class="meta">${e.ruleType} · ${e.durationMinutes} minutes · ${e.status}</div><div class="url"><input readonly value=${this._arenaUrl()} aria-label="Arena URL" @focus=${t=>t.target.select()} /><button type="button" @click=${this._copy}>Copy</button></div><p class="empty">Share this URL to invite players.</p></section>`:""}
            ${this._renderArenaSections()}
        </div>`}};customElements.define("arena-app",ge);})();
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
