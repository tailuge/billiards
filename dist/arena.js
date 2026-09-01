"use strict";(()=>{var D=globalThis,H=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),Se=new WeakMap,M=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(H&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Se.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Se.set(t,e))}return e}toString(){return this.cssText}},Ce=n=>new M(typeof n=="string"?n:n+"",void 0,Z),g=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new M(t,n,Z)},Te=(n,e)=>{if(H)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=D.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},ee=H?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Ce(t)})(n):n;var{is:nt,defineProperty:at,getOwnPropertyDescriptor:ot,getOwnPropertyNames:lt,getOwnPropertySymbols:ct,getPrototypeOf:dt}=Object,B=globalThis,Ae=B.trustedTypes,ht=Ae?Ae.emptyScript:"",pt=B.reactiveElementPolyfillSupport,L=(n,e)=>n,te={toAttribute(n,e){switch(e){case Boolean:n=n?ht:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Pe=(n,e)=>!nt(n,e),Ee={attribute:!0,type:String,converter:te,reflect:!1,useDefault:!1,hasChanged:Pe};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ee){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&at(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=ot(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:s,set(a){let l=s?.call(this);r?.call(this,a),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ee}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let e=dt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,i=[...lt(t),...ct(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(ee(s))}else e!==void 0&&t.push(ee(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Te(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:te).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:te;this._$Em=s;let l=a.fromAttribute(t,r.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let a=this.constructor;if(s===!1&&(r=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??Pe)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),r!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:a}=r,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,r,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[L("elementProperties")]=new Map,_[L("finalized")]=new Map,pt?.({ReactiveElement:_}),(B.reactiveElementVersions??=[]).push("2.1.2");var le=globalThis,ke=n=>n,F=le.trustedTypes,Me=F?F.createPolicy("lit-html",{createHTML:n=>n}):void 0,Oe="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,ze="?"+$,ut=`<${ze}>`,C=document,R=()=>C.createComment(""),U=n=>n===null||typeof n!="object"&&typeof n!="function",ce=Array.isArray,mt=n=>ce(n)||typeof n?.[Symbol.iterator]=="function",ie=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Le=/-->/g,Ne=/>/g,I=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Re=/'/g,Ue=/"/g,De=/^(?:script|style|textarea|title)$/i,de=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),d=de(1),Pt=de(2),kt=de(3),T=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),je=new WeakMap,S=C.createTreeWalker(C,129);function He(n,e){if(!ce(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Me!==void 0?Me.createHTML(e):e}var gt=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",a=N;for(let l=0;l<t;l++){let o=n[l],h,p,c=-1,m=0;for(;m<o.length&&(a.lastIndex=m,p=a.exec(o),p!==null);)m=a.lastIndex,a===N?p[1]==="!--"?a=Le:p[1]!==void 0?a=Ne:p[2]!==void 0?(De.test(p[2])&&(s=RegExp("</"+p[2],"g")),a=I):p[3]!==void 0&&(a=I):a===I?p[0]===">"?(a=s??N,c=-1):p[1]===void 0?c=-2:(c=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?I:p[3]==='"'?Ue:Re):a===Ue||a===Re?a=I:a===Le||a===Ne?a=N:(a=I,s=void 0);let b=a===I&&n[l+1].startsWith("/>")?" ":"";r+=a===N?o+ut:c>=0?(i.push(h),o.slice(0,c)+Oe+o.slice(c)+$+b):o+$+(c===-2?l:b)}return[He(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},j=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,a=0,l=e.length-1,o=this.parts,[h,p]=gt(e,t);if(this.el=n.createElement(h,i),S.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=S.nextNode())!==null&&o.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Oe)){let m=p[a++],b=s.getAttribute(c).split($),y=/([.?@])?(.*)/.exec(m);o.push({type:1,index:r,name:y[2],strings:b,ctor:y[1]==="."?re:y[1]==="?"?ne:y[1]==="@"?ae:E}),s.removeAttribute(c)}else c.startsWith($)&&(o.push({type:6,index:r}),s.removeAttribute(c));if(De.test(s.tagName)){let c=s.textContent.split($),m=c.length-1;if(m>0){s.textContent=F?F.emptyScript:"";for(let b=0;b<m;b++)s.append(c[b],R()),S.nextNode(),o.push({type:2,index:++r});s.append(c[m],R())}}}else if(s.nodeType===8)if(s.data===ze)o.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf($,c+1))!==-1;)o.push({type:7,index:r}),c+=$.length-1}r++}}static createElement(e,t){let i=C.createElement("template");return i.innerHTML=e,i}};function A(n,e,t=n,i){if(e===T)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=U(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=A(n,s._$AS(n,e.values),s,i)),e}var se=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??C).importNode(t,!0);S.currentNode=s;let r=S.nextNode(),a=0,l=0,o=i[0];for(;o!==void 0;){if(a===o.index){let h;o.type===2?h=new O(r,r.nextSibling,this,e):o.type===1?h=new o.ctor(r,o.name,o.strings,this,e):o.type===6&&(h=new oe(r,this,e)),this._$AV.push(h),o=i[++l]}a!==o?.index&&(r=S.nextNode(),a++)}return S.currentNode=C,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},O=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=A(this,e,t),U(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):mt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=j.createElement(He(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new se(s,this),a=r.u(this.options);r.p(t),this.T(a),this._$AH=r}}_$AC(e){let t=je.get(e.strings);return t===void 0&&je.set(e.strings,t=new j(e)),t}k(e){ce(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(R()),this.O(R()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ke(e).nextSibling;ke(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=v}_$AI(e,t=this,i,s){let r=this.strings,a=!1;if(r===void 0)e=A(this,e,t,0),a=!U(e)||e!==this._$AH&&e!==T,a&&(this._$AH=e);else{let l=e,o,h;for(e=r[0],o=0;o<r.length-1;o++)h=A(this,l[i+o],t,o),h===T&&(h=this._$AH[o]),a||=!U(h)||h!==this._$AH[o],h===v?e=v:e!==v&&(e+=(h??"")+r[o+1]),this._$AH[o]=h}a&&!s&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},re=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},ne=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},ae=class extends E{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=A(this,e,t,0)??v)===T)return;let i=this._$AH,s=e===v&&i!==v||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==v&&(i===v||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){A(this,e)}};var bt=le.litHtmlPolyfillSupport;bt?.(j,O),(le.litHtmlVersions??=[]).push("3.3.2");var Be=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new O(e.insertBefore(R(),r),r,void 0,t??{})}return s._$AI(n),s};var he=globalThis,f=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Be(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};f._$litElement$=!0,f.finalized=!0,he.litElementHydrateSupport?.({LitElement:f});var ft=he.litElementPolyfillSupport;ft?.({LitElement:f});(he.litElementVersions??=[]).push("4.2.2");var w=g`
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
`,Gt=g`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,P=g`
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
`,Vt=g`
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
`,Wt=g`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,Yt=g`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,qt=g`
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
    }`,Qt=g`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,Fe=g`
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
`,Kt=g`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,Xt=g`
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
`,Zt=g`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,ei=[w,g`
    :host { display: flex; flex-direction: column; min-height: 100%; font-family: 'Exo', sans-serif; font-weight: 200; font-size: 0.85rem; box-sizing: border-box; padding: 0.5rem; gap: 0.2rem; background: var(--bg); color: var(--text); overflow-y: auto; scrollbar-width: none; }
    :host::-webkit-scrollbar { display: none; }
    h1 { font-size: 1.0rem; color: var(--text-dim); text-align: left; margin: 0; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0; }
    h1 a { color: inherit; text-decoration: none; }
    h1 a:hover { text-decoration: underline; }
    h1 .version { font-size: 0.65rem; color: var(--text-dim); margin-left: 0.25rem; vertical-align: super; font-weight: 200; }
    .topbar { display: flex; align-items: center; flex-shrink: 0; gap: 0.4rem; }
    .topbar .logo { width: 32px; height: 32px; flex-shrink: 0; filter: grayscale(100%); opacity: 0.7; }
    .topbar h1 { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;}
    .topbar settings-modal { flex-shrink: 0; }
    .topbar user-badge { min-width: 0; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.4rem; overflow: hidden; }
    .panel-title { font-weight: bold; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-dim); text-align: center; }
    .motd-row { display: flex; flex-direction: column; }
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
    .motd-row       { grid-area: 2 / 1 / 3 / 3; }
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
    main.has-sidebar .motd-row {
        grid-area: 2 / 1 / 3 / 2;
    }
    main.has-sidebar .info-row {
        grid-area: 3 / 1 / 4 / 2;
    }
    .container { max-width: 900px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
`];var Ge=911,Ve=n=>`v${Math.floor(n/100)}.${String(n%100).padStart(2,"0")}`;var pe=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",We=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),vt=We?`ws://${window.location.hostname}:80`:`wss://${pe}`;var J=typeof window<"u"&&window.location.hostname.includes("vercel");var yt=We?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/",xt=(n,e)=>e?Object.entries(e).reduce((t,[i,s])=>t+`&${encodeURIComponent(i)}=${encodeURIComponent(s)}`,n):n,Ye=(n,e,t)=>{for(let[i,s]of Object.entries(n)){let r=e?`${e}.${encodeURIComponent(i)}`:encodeURIComponent(i);s&&typeof s=="object"&&!Array.isArray(s)?Ye(s,r,t):s!=null&&t.push(`${r}=${encodeURIComponent(s)}`)}return t},Je=(n,e,t)=>e&&typeof e=="object"?Ye(e,t,[]).reduce((i,s)=>i+`&${s}`,n):n;var G=({tableId:n,userId:e,userName:t,ruleType:i,isFirst:s,options:r,bot:a,lod:l,flip:o,custom:h,opponent:p})=>{let c=`${yt}?websocketserver=${vt}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${i}`;return a||(c+=`&tableId=${n}`),s&&(c+="&first=true"),a&&(c+=`&bot=${encodeURIComponent(a)}`),l!==void 0&&(c+=`&lod=${l}`),o&&(c+="&flip=true"),c=xt(c,r),c=Je(c,h,"custom"),p?.userId&&(c+=`&opponent.userId=${encodeURIComponent(p.userId)}&opponent.userName=${encodeURIComponent(p.userName||"")}`,c=Je(c,p.custom,"opponent.custom")),c};var _t={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},qe=n=>{let e=_t[n];return e?d`<img src="assets/${e}.png" alt="${n}" title="${n}" width="18" height="18" style="vertical-align:middle">`:d`🎱`};var Qe=n=>{let e=(n||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},ue=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),i=(e.get("userName")||"").trim();J&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let s=(localStorage.getItem("userId")||"").trim(),r=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,i||(this.userName=window.name.split("-")[0]);else{let l=i||r||"",o=!l||s.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=s.length>2&&!s.startsWith("user-")&&o?s:Qe(l),this.isForcedId=!1,this.clientId!==s&&localStorage.setItem("userId",this.clientId)}this.userName=i||this.userName||r||"Anonymous",this.lod=localStorage.getItem("lod")||"2",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",a=>{if(a.key==="custom"){try{this.custom=JSON.parse(a.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():Qe(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},u=new ue,V=class extends f{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),u.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),u.removeEventListener("change",this._storeListener)}};var wt=[[4352,4447],[11904,42191],[44032,55203],[63744,64255],[65040,65135],[65280,65376],[65504,65510],[127744,129791],[131072,195103]],Ke=n=>{let e=0;for(let t of n){let i=t.codePointAt(0);e+=wt.some(([s,r])=>i>=s&&i<=r)?2:1}return Math.max(e,1)},me=class extends V{static properties={_dotColor:{state:!0}};static styles=Fe;constructor(){super(),this._clientId=u.clientId,this._name=u.userName,this._dotColor=u.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,u.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return J?d``:d`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${Ke(this._name)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Ke(e.target.value)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",me);var k={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:n=>`/publish/table/${n}`,TABLE_SUBSCRIBE:n=>`/subscribe/table/${n}`},W=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,i={}){let s=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let r=JSON.stringify(t);if(i.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let h=new Blob([r],{type:"application/json"});if(navigator.sendBeacon(s,h))return}let a=new AbortController,l=setTimeout(()=>a.abort(),2e4),o;try{o=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:r,keepalive:i.keepalive,signal:a.signal})}finally{clearTimeout(l)}if(!o.ok)throw new Error(`Publish failed: ${o.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages}async publishPresence(e,t){return this.publish(k.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(k.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(k.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,i,s){return this.publish(k.TABLE_PUBLISH(e),{...t,senderId:i},s)}subscribePresence(e,t){let i=`uid=${encodeURIComponent(e)}`;typeof document<"u"&&document.referrer&&(i+=`&ref=${encodeURIComponent(document.referrer)}`);let s=`${k.PRESENCE_SUBSCRIBE}?${i}`;return this.subscribe(s,t)}subscribeTable(e,t,i,s){let r=`${k.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return s?.isSpectator&&(r+="&spectator=1"),this.subscribe(r,i)}subscribe(e,t){let i=this.getWsUrl(e),s=()=>new Date().toISOString().slice(11,23),r=null,a=!1,l=0,o=8e3,h=6e4,p=null,c=!0,m=2e4,b=null,y={stop:()=>{a=!0,p&&(clearTimeout(p),p=null),b&&(clearTimeout(b),b=null),r&&(r.close(),r=null)},ready:null},X;y.ready=new Promise(x=>{X=x});let Ie=()=>{if(!a){if(r&&r.readyState<=WebSocket.OPEN){X();return}r=new globalThis.WebSocket(i),b&&clearTimeout(b),b=setTimeout(()=>{console.warn(`[NchanClient ${s()}] Connection to ${i} timed out after ${m}ms, forcing reconnect`),r?.close()},m),b.unref?.(),r.onmessage=x=>{this.record(x.data),t(x.data)},r.onopen=()=>{let x=!c;c=!1,l=0,p&&(clearTimeout(p),p=null),b&&(clearTimeout(b),b=null),X(),x&&y.onReconnect&&y.onReconnect()},r.onclose=x=>{if(b&&(clearTimeout(b),b=null),!a){if(l>=10){console.error(`[NchanClient ${s()}] Max reconnect attempts reached for ${i}, giving up`);return}let rt=Math.min(Math.pow(2,l)*o,h);l++,p=setTimeout(Ie,rt),p.unref?.()}},r.onerror=x=>{console.error(`[NchanClient ${s()}] WebSocket error on ${i}:`,x),r&&(r.onerror=null,r?.close())}}};return Ie(),y}};function Xe(n){return n.type==="table:leave"&&!!n.data?.isSpectator}function Y(n){if(!n||n.trim()==="")return null;try{return JSON.parse(n)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function Ze(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var ge=250,z=class n{static dedupeChallenges(e){let t=new Set;for(let i of e)i.type!=="offer"&&t.add(n.interactionKey(i));return e.filter(i=>i.type!=="offer"?!0:!t.has(n.interactionKey(i)))}static dedupePresence(e){let t=new Map;for(let i of e){let s=t.get(i.userId);if(s&&s.type!=="leave"&&i.type==="leave"&&i.meta?.origin==="internal"){let r=i.meta?.ts,a=s.meta?.ts??s.clientTs;if(r!==void 0&&a!==void 0&&r>=a&&r-a<=ge)continue}t.set(i.userId,i)}return[...t.values()]}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var q=class{constructor(e,t,i={}){this.nchan=e;this.currentUser=t;this.options=i;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.joinSentinelTs=null;this.settledListeners=[];this.isSettled=!1;this.unsettledChallengeMessages=[];this.unsettledPresenceMessages=[];this.heartbeatInterval=i.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(!this.isJoined){this.subscription=this.nchan.subscribePresence(this.currentUser.userId,e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready;for(let e=1;;e++)try{let t=Date.now();this.joinSentinelTs=t,await this.nchan.publishPresence({...this.currentUser,clientTs:t});break}catch(t){let i=Math.min(Math.pow(2,e)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${e}), retrying in ${i}ms:`,t),await new Promise(s=>setTimeout(s,i))}this.startHeartbeat(),this.isJoined=!0}}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(i){console.error("Failed to send heartbeat:",i)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}async challenge(e,t,i,s,r){let a=Ze();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:a,options:i,nextTurnId:s,custom:r}),a}async acceptChallenge(e,t,i,s,r,a,l){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:r??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:i,options:s,nextTurnId:a,custom:l}),await this.updatePresence({tableId:i,ruleType:t,options:s})}async declineChallenge(e,t,i){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:i??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=Y(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledPresenceMessages.push(e),e.userId===this.currentUser.userId&&e.type==="join"&&e.clientTs===this.joinSentinelTs&&this.fireSettled();return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let i=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),i&&this.notifyListeners()}}handleChallenge(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let i=e.meta?.ts,s=t.meta?.ts??t.clientTs;return i===void 0||s===void 0?!1:i>=s&&i-s<=ge}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=z.dedupePresence(this.unsettledPresenceMessages);for(let s of e)this.applyPresence(s);this.unsettledPresenceMessages=[];let t=z.dedupeChallenges(this.unsettledChallengeMessages);for(let s of t)this.emitIfRelevant(s);this.unsettledChallengeMessages=[];let i=[...this.settledListeners];this.settledListeners=[];for(let s of i)s()}clearSettleState(){this.joinSentinelTs=null,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.unsettledPresenceMessages=[]}};var Q=class n{constructor(e,t,i,s,r=!1,a,l,o,h){this.nchan=e;this.tableId=t;this.userId=i;this.lobby=s;this.isSpectator=r;this.onClosed=o;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=h?.maxSize??1e3,this.initialRetryDelayMs=h?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=h?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(p=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(m=>m()),this.preJoinQueue.splice(0).forEach(m=>this.messageListeners.forEach(b=>b(m))),p()}}),a&&this.messageListeners.push(a),l&&this.bothJoinedListeners.push(l)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((i,s)=>{this.publishQueue.push({type:e,data:t,resolve:i,reject:s}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((i,s)=>{let r=a=>{if(this.isClosed){s(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>i()).catch(l=>{if(this.isClosed){s(l);return}let o=Math.min(Math.pow(2,a+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>r(a+1),o)})};r(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=Y(e);if(!t||!t.type)return;let i=t.meta?.msgId;if(typeof i=="string"){if(this.seenMsgIds.has(i))return;if(this.seenMsgIds.set(i,!0),this.seenMsgIds.size>n.MAX_SEEN_MSG_IDS){let s=this.seenMsgIds.keys().next().value;s!==void 0&&this.seenMsgIds.delete(s)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!Xe(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let r=t.data?.id||t.senderId;r&&(this.seenIds.add(r),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&r!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(a=>a())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(s=>s(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var K=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new W(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(s=>s.leave(e)));let i=[...this.activeTables];this.activeTables=[],await Promise.all(i.map(s=>s.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let i=(async()=>{try{let s=this.lobbyInstances.get(e.userId),r,a={...t,onReconnect:()=>{this.resumeSession().catch(o=>console.error("Session resume failed after lobby reconnect:",o)),t?.onReconnect?.()},onLeave:()=>{let o=r??s;if(o){let h=this.activeLobbies.indexOf(o);h!==-1&&this.activeLobbies.splice(h,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),s)return s.currentUser=e,await s.join(),s.resumeHeartbeat(),this.activeLobbies.includes(s)||this.activeLobbies.push(s),s;let l=new q(this.nchan,e,a);return r=l,await l.join(),this.lobbyInstances.set(e.userId,l),this.activeLobbies.push(l),l}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,i),i}async leaveLobby(e){let t=this.activeLobbies.findIndex(i=>i.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,i){let s=i?.isSpectator??!1,r=this.tableKey(e,t,s),a=this.joiningTables.get(r);if(a)return a.promise;this.assertNoTableConflict(e,t,s);let l=this.activeTables.find(m=>m.tableId===e);if(l)return Promise.resolve(l);let o=s?void 0:this.activeLobbies.find(m=>m.currentUser.userId===t),h=new Q(this.nchan,e,t,o,s,i?.onMessage,i?.onBothJoined,()=>this.removeActiveTable(h));this.activeTables.push(h);let p=h.join().catch(m=>{console.error(`Table ${e} join handshake failed:`,m)});o&&p.then(async()=>{if(!h.closed)try{await o.updatePresence({tableId:e})}catch(m){console.error("Failed to update presence after table join:",m)}});let c=Promise.resolve(h).finally(()=>{this.joiningTables.delete(r)});return this.joiningTables.set(r,{tableId:e,userId:t,isSpectator:s,promise:c}),c}tableKey(e,t,i){return`${e}|${t}|${i?"s":"p"}`}assertNoTableConflict(e,t,i){for(let s of this.joiningTables.values())if(s.tableId===e&&(s.userId!==t||s.isSpectator!==i))throw new Error(`Table ${e} is already being joined as ${s.isSpectator?"spectator":"player"} ${s.userId}; cannot also join as ${i?"spectator":"player"} ${t}`);for(let s of this.activeTables)if(s.tableId===e&&(s.userId!==t||s.isSpectator!==i))throw new Error(`Table ${e} is already joined as ${s.isSpectator?"spectator":"player"} ${s.userId}; cannot also join as ${i?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,i){return this.joinTable(e,t,{...i,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};var be=class extends f{static properties={standings:{attribute:!1}};static styles=[w,P,g`
        :host { display: block; }
        .podium { display: flex; align-items: flex-end; justify-content: center; gap: .35rem; height: 148px; padding: .25rem .5rem 0; }
        .step { min-width: 0; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; }
        .player { width: 100%; min-width: 0; text-align: center; margin-bottom: .3rem; }
        .medal { font-size: 1.25rem; line-height: 1; }
        .name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .72rem; font-weight: 600; }
        .score { display: block; color: var(--text-muted); font-size: .65rem; white-space: nowrap; }
        .block { width: 100%; border-radius: 5px 5px 0 0; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1rem; font-weight: 800; text-shadow: 0 1px 2px rgba(0, 0, 0, .25); box-shadow: inset 0 2px 4px rgba(255, 255, 255, .35); }
        .gold .block { height: 76px; background: linear-gradient(180deg, #ffe066, #ffb703); }
        .silver .block { height: 54px; background: linear-gradient(180deg, #e2e8f0, #94a3b8); }
        .bronze .block { height: 38px; background: linear-gradient(180deg, #fde68a, #cd7f32); }
        .empty { color: var(--text-muted); font-size: .75rem; text-align: center; padding: 1rem; }
    `];constructor(){super(),this.standings=[]}render(){let e=[this.standings[1],this.standings[0],this.standings[2]],t=["silver","gold","bronze"],i=["\u{1F948}","\u{1F947}","\u{1F949}"];return this.standings.length?d`<div class="podium" aria-label="Top three final standings">
            ${e.map((s,r)=>s?d`
                <div class="step ${t[r]}">
                    <div class="player">
                        <div class="medal" aria-hidden="true">${i[r]}</div>
                        <span class="name" title=${s.name}>${s.name}</span>
                        <span class="score">${s.points} pts</span>
                    </div>
                    <div class="block" aria-label="Place ${r===0?2:r===1?1:3}">${r===0?2:r===1?1:3}</div>
                </div>`:d`<div class="step ${t[r]}" aria-hidden="true"><div class="block"></div></div>`)}
        </div>`:d`<div class="empty">No final standings available.</div>`}};customElements.define("arena-podium",be);var fe=class extends f{static properties={standings:{attribute:!1},players:{attribute:!1},onlineUsers:{attribute:!1},expired:{type:Boolean},countdown:{type:String}};static styles=[w,g`
        :host { display: block; }
        .leaderboard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .5rem; }
        .title { margin: 0; font-size: 1.1rem; font-weight: 600; }
        .meta { color: var(--text-muted); font-size: .75rem; line-height: 1.7; }
        .countdown { font-size: .85rem; font-weight: 600; color: var(--text-muted); font-variant-numeric: tabular-nums; }
        .players { width: 100%; border-collapse: collapse; }
        th, td { padding: .4rem .25rem; border-bottom: 1px solid var(--border); text-align: left; }
        th { color: var(--text-muted); font-size: .7rem; }
        th:not(:first-child), td:not(:first-child) { text-align: right; }
        .inactive { color: var(--text-muted); opacity: .65; }
        .online-dot { display: inline-block; width: .45rem; height: .45rem; margin-right: .3rem; border-radius: 50%; background: #198754; vertical-align: middle; }
        .empty { color: var(--text-muted); text-align: center; padding: 1rem 0; }
    `];constructor(){super(),this.standings=[],this.players=[],this.onlineUsers=[],this.expired=!1,this.countdown=""}render(){return d`
            <div class="leaderboard-header">
                <h2 class="title">${this.expired?"Final standings":"Leaderboard"}</h2>
                ${this.countdown?d`<div class="countdown" aria-label="Time remaining">${this.countdown}</div>`:""}
            </div>
            ${this.expired?d`<arena-podium .standings=${this.standings}></arena-podium>`:""}
            ${this.standings.length?d`<table class="players">
                    <thead><tr><th>Player</th><th>Points</th><th>Wins</th><th>Games</th></tr></thead>
                    <tbody>${this.standings.map(e=>{let t=this.players.find(s=>s.playerId===e.playerId),i=$t(e.playerId)?!0:this.onlineUsers.some(s=>s.userId===e.playerId);return d`<tr class=${t?.active===!1?"inactive":""}>
                            <td>
                                ${i?d`<span class="online-dot" aria-label="Online" title="Online"></span>`:""}
                                ${e.name}${t?.active===!1?" (left)":""}
                            </td>
                            <td>${e.points}</td>
                            <td>${e.wins}</td>
                            <td>${e.games}</td>
                        </tr>`})}</tbody>
                </table>`:d`<div class="empty">No players have joined yet.</div>`}
        `}};function $t(n){return["bot-thefarjaw","bot-clawbreak"].includes(n)}customElements.define("arena-leaderboard",fe);var et=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"https://billiards-network.onrender.com",It=new Set(["bot-thefarjaw","bot-clawbreak"]),St={"bot-thefarjaw":"TheFarJaw","bot-clawbreak":"ClawBreak"},tt=n=>It.has(n),ve=10,it=2e3,ye=class extends f{static properties={arenaId:{type:String},theme:{type:String,reflect:!0},_arena:{state:!0},_leaderboard:{state:!0},_onlineUsers:{state:!0},_busy:{state:!0},_error:{state:!0},_pairingState:{state:!0},_pairingCountdown:{state:!0},_pairedName:{state:!0}};static styles=[w,P,g`
        :host { display: block; min-height: 100vh; box-sizing: border-box; padding: .5rem; background: var(--bg); color: var(--text); font-family: 'Exo', sans-serif; font-size: .85rem; }
        .container { max-width: 900px; margin: 0 auto; }
        .topbar { display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem; }
        .logo { width: 32px; height: 32px; opacity: .7; }
        h1 { flex: 1; margin: 0; font-size: 1rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); }
        h1 a { color: inherit; text-decoration: none; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: .7rem; margin-bottom: .5rem; }
        .title { margin: 0 0 .5rem; font-size: 1.1rem; font-weight: 600; }
        .meta { color: var(--text-muted); font-size: .75rem; line-height: 1.7; }
        .error { padding: .45rem; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
        .actions { display: flex; gap: .35rem; margin-top: .6rem; }
        .actions button { flex: 1; padding: .5rem; }
        .countdown { font-size: .85rem; font-weight: 600; color: var(--text-muted); font-variant-numeric: tabular-nums; }

        /* Pairing overlay — sits above the table, does not replace it */
        .pairing-overlay {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: .75rem;
            padding: .45rem .6rem;
            margin-bottom: .5rem;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: .85rem;
        }
        .pairing-tick {
            font-size: 1.4rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            color: var(--accent, #4a9eff);
            min-width: 1.6rem;
            text-align: center;
            line-height: 1;
        }
        .pairing-label {
            flex: 1;
            font-weight: 600;
        }
        .pairing-hint {
            color: var(--text-muted);
            font-size: .75rem;
        }
        .pairing-result {
            font-weight: 600;
        }
        .panel-heading { display: flex; align-items: center; gap: .4rem; }
        .panel-heading .title { flex: 1; }
    `];constructor(){super(),this.arenaId="",this.theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",this._arena=null,this._leaderboard=[],this._onlineUsers=[],this._busy=!1,this._theme=this.theme,document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme,this._presenceClient=null,this._lobby=null,this._error="",this._timer=null,this._staleRefetchDone=!1,this._lastLoadedArenaId=null,this._pairingState=null,this._pairingCountdown=ve,this._pairedName="",this._pairingInterval=null,this._pairingTimeout=null,this._pendingArenaChallenge=null}connectedCallback(){super.connectedCallback(),this._load(),this._connectPresence(),this._timer=setInterval(()=>{this._arena&&this.requestUpdate()},1e3)}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),this._cancelPairing(),this._pendingArenaChallenge=null,this._lobby?.leave(),this._presenceClient?.stop(),super.disconnectedCallback()}_isExpired(){return!!(this._arena&&this._arena.endTime&&Date.now()>=this._arena.endTime)}_getCountdownText(){if(!this._arena||!this._arena.endTime)return"";let e=Math.max(0,this._arena.endTime-Date.now());if(e<=0||this._arena.status==="finished")return"00:00";let t=Math.floor(e/1e3),i=Math.floor(t/60),s=t%60;if(i>=60){let r=Math.floor(i/60),a=i%60;return`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}:${String(s).padStart(2,"0")}`}return`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")}`}async _connectPresence(){let e=window.location.protocol==="https:"?"https:":"http:",t=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?`${e}//${window.location.host}`:`https://${pe}`;this._presenceClient=new K({baseUrl:t}),this._presenceClient.setVersion(Ve(Ge));try{this._lobby=await this._presenceClient.joinLobby({messageType:"presence",type:"join",userId:u.clientId,userName:u.userName}),await this._syncArenaPresence(),this._lobby.onUsersChange(i=>{this._onlineUsers=[...i,{userId:u.clientId,userName:u.userName}],this._checkStaleArenaPresence()}),this._lobby.onChallenge(i=>{i.type==="offer"?this._handleIncomingChallenge(i):this._handleArenaChallengeMessage(i)})}catch(i){console.error("Arena presence connection failed:",i)}}async _handleIncomingChallenge(e){if(e.type!=="offer"||e.challengeeId!==u.clientId)return;let t=this._pairingState==="counting";if(this._cancelPairing(),!this._arena?.players?.some(s=>s.playerId===u.clientId&&s.active!==!1)||e.options?.tournamentId!==this.arenaId){t&&this.requestUpdate();return}await this._acceptArenaChallenge(e)}_handleArenaChallengeMessage(e){let t=this._pendingArenaChallenge;if(!t||e.challengerId!==u.clientId||e.challengeeId!==t.opponentId)return;if(e.type==="decline"||e.type==="cancel"){this._pendingArenaChallenge=null;return}if(e.type!=="accept")return;if(!t.tableId){t.earlyAccept=e;return}if(e.tableId!==t.tableId)return;this._pendingArenaChallenge=null;let i=e.ruleType||t.ruleType,s=e.options||t.options,r=e.nextTurnId?e.nextTurnId===u.clientId:!0,a=G({tableId:e.tableId,userId:u.clientId,userName:u.userName,ruleType:i,isFirst:r,options:s,lod:u.lod,flip:u.flip,opponent:{userId:t.opponentId,userName:t.opponentName}});window.location.href=a}async _acceptArenaChallenge(e){if(!this._lobby)return;let t=e.ruleType||this._arena?.ruleType||"nineball",i=e.options||this._arena?.options||{};try{await this._lobby.acceptChallenge(e.challengerId,t,e.tableId,i,e.challengerName)}catch(a){console.error("Arena auto-accept failed:",a);return}let s=e.nextTurnId?e.nextTurnId===u.clientId:!1,r=G({tableId:e.tableId,userId:u.clientId,userName:u.userName,ruleType:t,isFirst:s,options:i,lod:u.lod,flip:u.flip,opponent:{userId:e.challengerId,userName:e.challengerName||""}});window.location.href=r}async _load(){this._busy=!0,this._error="";try{let e=await fetch(`${et}/api/arena/${encodeURIComponent(this.arenaId)}`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arena (${e.status})`);this._arena=t.arena,this._leaderboard=t.leaderboard||[],this.arenaId!==this._lastLoadedArenaId&&(this._staleRefetchDone=!1,this._lastLoadedArenaId=this.arenaId),await this._syncArenaPresence(),this._checkStaleArenaPresence()}catch(e){this._error=e.message||"Unable to load Arena."}finally{this._busy=!1}}async _join(){await this._mutate("join",{playerId:u.clientId,name:u.userName||"Anonymous"})}async _leave(){this._cancelPairing(),await this._mutate("leave",{playerId:u.clientId})}async _syncArenaPresence(){if(!this._lobby||!this._arena)return;let e=this._arena.players?.find(t=>t.playerId===u.clientId);try{await this._lobby.updatePresence({arenaId:e?.active!==!1&&e?this.arenaId:void 0})}catch(t){console.error("Failed to update Arena presence:",t)}}_checkStaleArenaPresence(){if(!this._arena||!this._lobby)return;this._onlineUsers.some(t=>t.userId!==u.clientId&&t.arenaId===this.arenaId&&!this._arena.players?.some(i=>i.playerId===t.userId))&&this._refetchStaleArenaOnce()}_refetchStaleArenaOnce(){this._staleRefetchDone||this._busy||(this._staleRefetchDone=!0,this._load())}async _mutate(e,t){this._busy=!0,this._error="";try{let i=await fetch(`${et}/api/arena/${encodeURIComponent(this.arenaId)}/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),s=await i.json();if(!i.ok)throw new Error(s.error||`${e} failed (${i.status})`);await this._load()}catch(i){this._error=i.message||`Unable to ${e} Arena.`,this._busy=!1}}_getPairingCandidates(){let e=u.clientId,t=[],i=[],s=[];for(let r of this._leaderboard){if(r.playerId===e)continue;let a=tt(r.playerId),l=this._arena?.players?.find(m=>m.playerId===r.playerId),o=this._onlineUsers.find(m=>m.userId===r.playerId),h=!a&&!!o?.tableId,p=l?.active!==!1&&(a||!!(o&&!h)),c={playerId:r.playerId,name:r.name,playing:h,bot:a,available:p};s.push(c),p&&(a?i.push(r):t.push(r))}return{candidates:t.length>0?t:i,diagnostics:s}}_findEligibleOpponents(){return this._getPairingCandidates().candidates}_startPairing(){this._pairingState!=="counting"&&(this._pairingState="counting",this._pairingCountdown=ve,this._pairedName="",this._pairingInterval=setInterval(()=>this._onPairingTick(),1e3))}_cancelPairing(){this._pairingInterval&&(clearInterval(this._pairingInterval),this._pairingInterval=null),this._pairingTimeout&&(clearTimeout(this._pairingTimeout),this._pairingTimeout=null),this._pairingState=null,this._pairingCountdown=ve,this._pairedName=""}_onPairingTick(){let e=this._arena,t=u.clientId,i=e?.players?.some(r=>r.playerId===t&&r.active!==!1),s=e?.status==="active"&&Date.now()<(e?.endTime||0);if(!i||!s){this._cancelPairing();return}if(this._pairingCountdown-=1,this._pairingCountdown<=0){clearInterval(this._pairingInterval),this._pairingInterval=null,this._executePairing();return}this.requestUpdate()}async _executePairing(){let{candidates:e,diagnostics:t}=this._getPairingCandidates();if(e.length===0){console.log("[Arena pairing]",{candidates:t,choice:null}),this._pairingState="no-opponent",this._pairingTimeout=setTimeout(()=>this._cancelPairing(),it);return}let i=e[Math.floor(Math.random()*e.length)],s=t.find(r=>r.playerId===i.playerId);console.log("[Arena pairing]",{candidates:t,choice:s}),this._pairedName=i.name,this._pairingState="paired";try{await this._initiateChallenge(i)}catch(r){console.error("Pairing challenge failed:",r)}this._pairingTimeout=setTimeout(()=>this._cancelPairing(),it)}async _initiateChallenge(e){let t=this._arena,i=t?.ruleType||"nineball",s=t?.options||{},r=t?.id||"";if(tt(e.playerId)){let o=St[e.playerId]||e.name,h="arena-bot-"+Math.random().toString(36).slice(2,8),p=G({tableId:h,userId:u.clientId,userName:u.userName,ruleType:i,isFirst:!0,options:s,bot:o,lod:u.lod,flip:u.flip});window.location.href=p+`&tournamentId=${encodeURIComponent(r)}`;return}if(!this._lobby){console.error("Pairing: no lobby connection");return}let a={...s,tournamentId:r},l={opponentId:e.playerId,opponentName:e.name,ruleType:i,options:a,tableId:null,earlyAccept:null};this._pendingArenaChallenge=l;try{let o=await this._lobby.challenge(e.playerId,i,a);if(l.tableId=o,l.earlyAccept){let h=l.earlyAccept;l.earlyAccept=null,this._handleArenaChallengeMessage(h)}}catch(o){throw this._pendingArenaChallenge===l&&(this._pendingArenaChallenge=null),o}}_renderPairingOverlay(){return this._pairingState==="counting"?d`
                <div class="pairing-overlay" role="status" aria-live="polite">
                    <div class="pairing-tick" aria-label="Seconds remaining: ${this._pairingCountdown}">${this._pairingCountdown}</div>
                    <div class="pairing-label">Pairing…</div>
                    <div class="pairing-hint">Finding an opponent</div>
                    <button type="button" @click=${this._cancelPairing}>Cancel</button>
                </div>`:this._pairingState==="paired"?d`
                <div class="pairing-overlay" role="status" aria-live="assertive">
                    <div class="pairing-result">Paired with ${this._pairedName}</div>
                </div>`:this._pairingState==="no-opponent"?d`
                <div class="pairing-overlay" role="status" aria-live="assertive">
                    <div class="pairing-result">No available opponents</div>
                </div>`:null}render(){let e=this._arena,t=u.clientId,i=e?.players?.find(c=>c.playerId===t),s=!!i,r=i?.active!==!1,a=this._isExpired(),l=e?.status==="active"&&!a,o=s&&r&&l&&this._pairingState===null,h=this._pairingState!==null,p=this._renderPairingOverlay();return d`<div class="container">
            <header class="topbar">
                <img src="assets/threecushion.png" class="logo" alt="" />
                <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a></h1>
                <user-badge></user-badge>
            </header>
            ${this._error?d`<div class="error" role="alert">${this._error}</div>`:""}
            ${!e&&!this._error?d`<section class="panel"><div class="empty">Loading Arena…</div></section>`:""}
            ${e?d`
                <section class="panel">
                    <div class="panel-heading">
                        <h2 class="title">${a?"Arena complete":"Arena"} ${qe(e.ruleType)}</h2>
                    </div>
                    <div class="meta">
                        Status: ${a?"complete":e.status} · Duration: ${e.durationMinutes} minutes<br />
                        ${e.players.length} participant${e.players.length===1?"":"s"} · ${a?"Ended":"Ends"}: ${new Date(e.endTime).toLocaleString([],{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit"})}
                    </div>
                    ${a?"":d`<div class="actions">
                        <button type="button" ?disabled=${this._busy||h} @click=${this._load}>Refresh</button>
                        ${s&&r?d`<button class="btn-leave" type="button" ?disabled=${this._busy} @click=${this._leave}>Leave Arena</button>`:d`<button class="btn-accept" type="button" ?disabled=${this._busy||!l} @click=${this._join}>Join Arena</button>`}
                        ${o?d`<button class="btn-challenge" type="button" @click=${this._startPairing}>Pair</button>`:""}
                    </div>`}
                </section>
                <section class="panel">
                    ${p}
                    <arena-leaderboard
                        .standings=${this._leaderboard}
                        .players=${e.players}
                        .onlineUsers=${this._onlineUsers}
                        .expired=${a}
                        countdown=${this._getCountdownText()}
                    ></arena-leaderboard>
                </section>`:""}
        </div>`}};customElements.define("arena-view",ye);var xe=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",variants:[{id:"std",label:"Standard",options:{}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",variants:[{id:"std",label:"Standard",options:{}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",variants:[{id:"3",label:"Reds 3",options:{reds:"3"}},{id:"6",label:"Reds 6",options:{reds:"6"}},{id:"10",label:"Reds 10",options:{reds:"10"}},{id:"15",label:"Reds 15",options:{reds:"15"}}]},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",variants:[{id:"7",label:"Race to 7",options:{raceTo:"7"}},{id:"15",label:"Race to 15",options:{raceTo:"15"}},{id:"25",label:"Race to 25",options:{raceTo:"25"}}]},{key:"sagu",label:"Sagu",img:"assets/sagu.png",variants:[{id:"5",label:"Race to 5",options:{raceTo:"5"}},{id:"11",label:"Race to 11",options:{raceTo:"11"}}]}],_e=class extends f{static properties={open:{type:Boolean,reflect:!0},_game:{state:!0},_variant:{state:!0},_size:{state:!0},_freeaim:{state:!0}};static styles=g`
    :host { display: block; color: var(--text, #e0e0e0); font-family: 'Exo', sans-serif; }
    :host(:not([open])) { display: none; }
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.3); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { width: 320px; max-width: calc(100vw - 1.5rem); padding: .75rem; background: var(--surface, #2a2a2a); border: 1px solid var(--border, #444); border-radius: 10px; display: flex; flex-direction: column; gap: .45rem; }
    h3 { margin: 0; text-align: center; font-size: .95rem; }
    button { font: inherit; cursor: pointer; border: 1px solid var(--btn-border, #555); border-radius: 4px; background: var(--btn-bg, #3a3a3a); color: inherit; min-height: 28px; }
    button:focus-visible { outline: 2px solid var(--accent, #0d6efd); outline-offset: 2px; }
    .tiles, .choices { display: flex; flex-wrap: wrap; gap: .3rem; justify-content: center; }
    .tile { width: 58px; padding: .2rem; font-size: .6rem; }
    .tile img { width: 42px; height: 42px; display: block; margin: auto; }
    .selected { border-color: var(--accent, #0d6efd); box-shadow: 0 0 0 1px var(--accent, #0d6efd); }
    .choice { padding: .15rem .45rem; font-size: .72rem; }
    .choice.selected { background: var(--accent, #0d6efd); color: #fff; }
    .label { width: 100%; text-align: center; color: var(--text-muted, #aaa); font-size: .7rem; }
    .action { width: 100%; background: var(--accent, #0d6efd); color: #fff; border: 0; font-size: 1rem; }
    .cancel { width: 100%; }
  `;constructor(){super(),this.open=!1,this._game="threecushion",this._variant="15",this._size="full",this._freeaim=!1}show(){this.open=!0}hide(){this.open=!1}_selectGame(e){this._game=e;let t=this._currentGame;this._variant=t.variants[0].id}get _currentGame(){return xe.find(e=>e.key===this._game)||xe[0]}_confirm(){let e=this._currentGame,i={...(e.variants.find(s=>s.id===this._variant)||e.variants[0]).options};this._size==="mini"?i.tableSize=["snooker","nineball","eightball"].includes(e.key)?"6":"5":e.key==="snooker"&&(i.tableSize="12"),this._freeaim&&(i.freeaim="true"),this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0,detail:{ruleType:e.key,options:i}})),this.hide()}render(){let e=this._currentGame;return d`<div class="backdrop" @click=${t=>t.target===t.currentTarget&&this.hide()}><div class="modal" role="dialog" aria-modal="true" aria-label="Select game parameters"><h3>Select game parameters</h3><div class="tiles" role="radiogroup" aria-label="Game type">${xe.map(t=>d`<button class="tile ${t.key===this._game?"selected":""}" @click=${()=>this._selectGame(t.key)}><img src=${t.img} alt="" /><span>${t.label}</span></button>`)}</div><div class="label">Rule</div><div class="choices">${e.variants.map(t=>d`<button class="choice ${t.id===this._variant?"selected":""}" @click=${()=>{this._variant=t.id}}>${t.label}</button>`)}</div><div class="label">Table size</div><div class="choices"><button class="choice ${this._size==="full"?"selected":""}" @click=${()=>{this._size="full"}}>Full</button><button class="choice ${this._size==="mini"?"selected":""}" @click=${()=>{this._size="mini"}}>Mini</button></div><div class="label">Aim</div><div class="choices"><button class="choice ${this._freeaim?"":"selected"}" @click=${()=>{this._freeaim=!1}}>Assist</button><button class="choice ${this._freeaim?"selected":""}" @click=${()=>{this._freeaim=!0}}>Free</button></div><button class="action" @click=${this._confirm}>Use these parameters</button><button class="cancel" @click=${this.hide}>Cancel</button></div></div>`}};customElements.define("proto2-modal",_e);var we=class extends f{static properties={ruleType:{type:String},options:{attribute:!1},durationMinutes:{type:Number},busy:{type:Boolean},error:{type:String}};static styles=g`
        :host { display: block; color: var(--text); }
        .field { margin: .6rem 0; }
        label { display: block; margin-bottom: .25rem; color: var(--text-muted); font-size: .75rem; }
        select { width: 100%; box-sizing: border-box; padding: .45rem; background: var(--btn-bg); color: var(--text); border: 1px solid var(--btn-border); border-radius: 4px; font: inherit; }
        .config { display: flex; align-items: center; justify-content: center; gap: .3rem; padding: .45rem; border: 1px dashed var(--border); border-radius: 4px; }
        .config-actions { display: flex; align-items: center; gap: .3rem; flex-shrink: 0; }
        .btn-preset { display: flex; align-items: center; gap: .25rem; padding: .25rem .4rem; background: var(--btn-bg); color: var(--text); border: 1px solid var(--btn-border); border-radius: 4px; cursor: pointer; font: inherit; font-size: .75rem; }
        .btn-preset:hover { background: var(--btn-hover, #444); }
        .btn-preset img { width: 18px; height: 18px; display: block; }
        .create { width: 100%; padding: .55rem; font-size: .95rem; }
        .error { padding: .45rem; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
    `;constructor(){super(),this.ruleType="",this.options={},this.durationMinutes=10,this.busy=!1,this.error=""}_openChooser(){this.renderRoot.querySelector("proto2-modal").show()}_selectPreset(e,t,i=10){this.ruleType=e,this.options=t,this.durationMinutes=i,this._notifyChange(),this._create()}_onParameters(e){this.ruleType=e.detail.ruleType,this.options=e.detail.options||{},this._notifyChange(),this._create()}_notifyChange(){this.dispatchEvent(new CustomEvent("parameters-change",{bubbles:!0,composed:!0,detail:{ruleType:this.ruleType,options:this.options,durationMinutes:this.durationMinutes}}))}_onDurationChange(e){this.durationMinutes=Number(e.target.value),this._notifyChange()}_create(){this.dispatchEvent(new CustomEvent("create-arena",{bubbles:!0,composed:!0}))}render(){return d`<div class="field"><label for="duration">Duration</label><select id="duration" .value=${String(this.durationMinutes)} @change=${this._onDurationChange}><option value="10">10 minutes</option><option value="30">30 minutes</option></select></div><div class="field"><label>Game type</label><div class="config"><div class="config-actions"><button type="button" class="btn-preset" title="10 mins Three Cushion (mini, race to 7)" @click=${()=>this._selectPreset("threecushion",{raceTo:"7",tableSize:"5"},10)}><img src="assets/threecushion.png" alt="" /><span>3-Cushion</span></button><button type="button" class="btn-preset" title="10 mins Nine Ball (mini, freeaim)" @click=${()=>this._selectPreset("nineball",{tableSize:"6",freeaim:"true"},10)}><img src="assets/nineball.png" alt="" /><span>9-Ball</span></button><button type="button" class="btn-preset" title="10 mins Eight Ball (mini, freeaim)" @click=${()=>this._selectPreset("eightball",{tableSize:"6",freeaim:"true"},10)}><img src="assets/eightball.png" alt="" /><span>8-Ball</span></button><button type="button" class="btn-preset" @click=${this._openChooser}>Custom</button></div></div></div>${this.error?d`<div class="error" role="alert">${this.error}</div>`:""}<proto2-modal @confirm=${this._onParameters}></proto2-modal>`}};customElements.define("arena-create-form",we);var st=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"https://billiards-network.onrender.com",$e=class extends f{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_id:{state:!0},_ruleType:{state:!0},_options:{state:!0},_durationMinutes:{state:!0},_createdArena:{state:!0},_arenas:{state:!0},_loadingArenas:{state:!0},_busy:{state:!0},_error:{state:!0}};static styles=[w,P,g`
        :host { display: block; min-height: 100vh; box-sizing: border-box; padding: .5rem; background: var(--bg); color: var(--text); font-family: 'Exo', sans-serif; font-size: .85rem; }
        .container { max-width: 900px; margin: 0 auto; }
        .topbar { display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem; position: sticky; top: 0; z-index: 2; padding: .25rem 0; background: var(--bg); }
        .logo { width: 32px; height: 32px; flex-shrink: 0; opacity: .7; }
        h1 { flex: 1; margin: 0; font-size: 1rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); }
        h1 a { color: inherit; text-decoration: none; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: .7rem; margin-bottom: .5rem; }
        .title { margin: 0 0 .5rem; font-size: 1.1rem; font-weight: 600; }
        .error { padding: .45rem; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
        .success { color: #198754; }
        .url { display: flex; gap: .3rem; }
        .url input { flex: 1; min-width: 0; padding: .35rem; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: 4px; font: inherit; font-size: .7rem; }
        .meta { color: var(--text-muted); font-size: .75rem; line-height: 1.6; }
        .empty { color: var(--text-muted); text-align: center; padding: 1rem 0; }
        .arena-list { display: flex; flex-direction: column; gap: .35rem; }
        .arena-item { display: flex; align-items: center; gap: .5rem; padding: .45rem; border: 1px solid var(--border); border-radius: 4px; }
        .arena-item-main { min-width: 0; flex: 1; }
        .arena-item-title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .arena-item-meta { color: var(--text-muted); font-size: .72rem; margin-top: .15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .refresh { float: right; }
        .completed { opacity: .8; }
        .back-lobby { margin-left: auto; }
    `];constructor(){super(),this._theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme;let e=new URLSearchParams(window.location.search);this._id=e.get("id")||e.get("tournamentId")||"",this._ruleType="",this._options={},this._durationMinutes=10,this._createdArena=null,this._arenas=[],this._loadingArenas=!1,this._busy=!1,this._error=""}connectedCallback(){super.connectedCallback(),this._id||this._loadArenas()}async _loadArenas(){this._loadingArenas=!0;try{let e=await fetch(`${st}/api/arena`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arenas (${e.status})`);this._arenas=(t.arenas||[]).sort((i,s)=>s.createdAt-i.createdAt)}catch(e){this._error=e.message||"Unable to load Arenas."}finally{this._loadingArenas=!1}}async _create(){if(!this._ruleType){this._error="Choose game parameters first.";return}this._busy=!0,this._error="";try{let e=await fetch(`${st}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({creatorId:u.clientId,creatorName:u.userName||"Anonymous",ruleType:this._ruleType,options:this._options,durationMinutes:this._durationMinutes})}),t=await e.json();if(!e.ok)throw new Error(t.error||`Create failed (${e.status})`);this._createdArena=t.arena,await this._loadArenas()}catch(e){this._error=e.message||"Unable to create Arena."}finally{this._busy=!1}}_backToLobby(){window.location.href="./lobby.html"}_renderHeader(){return d`<header class="topbar">
            <img src="assets/threecushion.png" class="logo" alt="" />
            <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a></h1>
            <user-badge></user-badge>
            <button class="back-lobby" type="button" @click=${this._backToLobby}>Back to lobby</button>
        </header>`}_arenaUrl(){return this._createdArena?`${window.location.origin}${window.location.pathname}?tournamentId=${encodeURIComponent(this._createdArena.id)}`:""}async _copy(){let e=this._arenaUrl();try{await navigator.clipboard.writeText(e)}catch{let i=this.renderRoot.querySelector(".url input");i&&(i.focus(),i.select())}}_renderArenaList(e,t=!1){return e.length?d`<div class="arena-list" aria-label=${t?"Completed Arenas":"Active Arenas"}>
            ${e.map(i=>d`<a class="arena-item ${t?"completed":""}" href="${this._arenaUrlFor(i)}">
                <div class="arena-item-main"><div class="arena-item-title">${i.ruleType} · ${i.players.length} participant${i.players.length===1?"":"s"} · ${t?"ended":"ends"} ${new Date(i.endTime).toLocaleTimeString()}</div></div><span aria-hidden="true">→</span>
            </a>`)}
        </div>`:d`<div class="empty">No ${t?"completed":"active"} Arenas.</div>`}_renderActiveArenas(){let e=Date.now(),t=this._arenas.filter(s=>s.endTime>e&&s.status!=="finished"),i=this._arenas.filter(s=>s.endTime<=e||s.status==="finished");return d`
            <section class="panel">
                <h2 class="title">Active Arenas <button class="refresh" type="button" ?disabled=${this._loadingArenas} @click=${this._loadArenas}>${this._loadingArenas?"Refreshing\u2026":"Refresh"}</button></h2>
                ${this._renderArenaList(t)}
            </section>
            <section class="panel">
                <h2 class="title">Completed Arenas</h2>
                ${this._renderArenaList(i,!0)}
            </section>`}_arenaUrlFor(e){return`${window.location.pathname}?tournamentId=${encodeURIComponent(e.id)}`}render(){if(this._id)return d`<div class="container">${this._renderHeader()}<arena-view arenaId=${this._id} theme=${this._theme}></arena-view></div>`;let e=this._createdArena;return d`<div class="container">
            ${this._renderHeader()}
            ${this._renderActiveArenas()}
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
            ${e?d`<section class="panel"><h2 class="title success">Arena created</h2><div class="meta">${e.ruleType} · ${e.durationMinutes} minutes · ${e.status}</div><div class="url"><input readonly value=${this._arenaUrl()} aria-label="Arena URL" @focus=${t=>t.target.select()} /><button type="button" @click=${this._copy}>Copy</button></div><p class="empty">Share this URL to invite players.</p></section>`:""}
        </div>`}};customElements.define("arena-app",$e);})();
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
