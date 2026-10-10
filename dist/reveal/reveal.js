"use strict";(()=>{var V=globalThis,Y=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,le=Symbol(),je=new WeakMap,j=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Y&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=je.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&je.set(t,e))}return e}toString(){return this.cssText}},Oe=r=>new j(typeof r=="string"?r:r+"",void 0,le),f=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((i,s,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new j(t,r,le)},ze=(r,e)=>{if(Y)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=V.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}},ce=Y?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Oe(t)})(r):r;var{is:yt,defineProperty:xt,getOwnPropertyDescriptor:wt,getOwnPropertyNames:_t,getOwnPropertySymbols:kt,getPrototypeOf:$t}=Object,G=globalThis,De=G.trustedTypes,St=De?De.emptyScript:"",It=G.reactiveElementPolyfillSupport,O=(r,e)=>r,de={toAttribute(r,e){switch(e){case Boolean:r=r?St:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Fe=(r,e)=>!yt(r,e),He={attribute:!0,type:String,converter:de,reflect:!1,useDefault:!1,hasChanged:Fe};Symbol.metadata??=Symbol("metadata"),G.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=He){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&xt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:n}=wt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let l=s?.call(this);n?.call(this,o),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??He}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;let e=$t(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){let t=this.properties,i=[..._t(t),...kt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(ce(s))}else e!==void 0&&t.push(ce(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ze(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:de).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let n=i.getPropertyOptions(s),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:de;this._$Em=s;let l=o.fromAttribute(t,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,i,s=!1,n){if(e!==void 0){let o=this.constructor;if(s===!1&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??Fe)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,n]of i){let{wrapped:o}=n,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[O("elementProperties")]=new Map,_[O("finalized")]=new Map,It?.({ReactiveElement:_}),(G.reactiveElementVersions??=[]).push("2.1.2");var be=globalThis,Be=r=>r,K=be.trustedTypes,Je=K?K.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ke="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Qe="?"+k,Et=`<${Qe}>`,C=document,D=()=>C.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",ve=Array.isArray,Ct=r=>ve(r)||typeof r?.[Symbol.iterator]=="function",he=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,We=/-->/g,qe=/>/g,I=RegExp(`>|${he}(?:([^\\s"'>=/]+)(${he}*=${he}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,Ye=/"/g,Xe=/^(?:script|style|textarea|title)$/i,ye=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),u=ye(1),ei=ye(2),ti=ye(3),P=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ge=new WeakMap,E=C.createTreeWalker(C,129);function Ze(r,e){if(!ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Je!==void 0?Je.createHTML(e):e}var Pt=(r,e)=>{let t=r.length-1,i=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=z;for(let l=0;l<t;l++){let a=r[l],d,h,c=-1,m=0;for(;m<a.length&&(o.lastIndex=m,h=o.exec(a),h!==null);)m=o.lastIndex,o===z?h[1]==="!--"?o=We:h[1]!==void 0?o=qe:h[2]!==void 0?(Xe.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=I):h[3]!==void 0&&(o=I):o===I?h[0]===">"?(o=s??z,c=-1):h[1]===void 0?c=-2:(c=o.lastIndex-h[2].length,d=h[1],o=h[3]===void 0?I:h[3]==='"'?Ye:Ve):o===Ye||o===Ve?o=I:o===We||o===qe?o=z:(o=I,s=void 0);let p=o===I&&r[l+1].startsWith("/>")?" ":"";n+=o===z?a+Et:c>=0?(i.push(d),a.slice(0,c)+Ke+a.slice(c)+k+p):a+k+(c===-2?l:p)}return[Ze(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},F=class r{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let n=0,o=0,l=e.length-1,a=this.parts,[d,h]=Pt(e,t);if(this.el=r.createElement(d,i),E.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=E.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Ke)){let m=h[o++],p=s.getAttribute(c).split(k),b=/([.?@])?(.*)/.exec(m);a.push({type:1,index:n,name:b[2],strings:p,ctor:b[1]==="."?ue:b[1]==="?"?me:b[1]==="@"?ge:L}),s.removeAttribute(c)}else c.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(c));if(Xe.test(s.tagName)){let c=s.textContent.split(k),m=c.length-1;if(m>0){s.textContent=K?K.emptyScript:"";for(let p=0;p<m;p++)s.append(c[p],D()),E.nextNode(),a.push({type:2,index:++n});s.append(c[m],D())}}}else if(s.nodeType===8)if(s.data===Qe)a.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf(k,c+1))!==-1;)a.push({type:7,index:n}),c+=k.length-1}n++}}static createElement(e,t){let i=C.createElement("template");return i.innerHTML=e,i}};function M(r,e,t=r,i){if(e===P)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,n=H(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=M(r,s._$AS(r,e.values),s,i)),e}var pe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??C).importNode(t,!0);E.currentNode=s;let n=E.nextNode(),o=0,l=0,a=i[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new B(n,n.nextSibling,this,e):a.type===1?d=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(d=new fe(n,this,e)),this._$AV.push(d),a=i[++l]}o!==a?.index&&(n=E.nextNode(),o++)}return E.currentNode=C,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},B=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),H(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==P&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ct(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=F.createElement(Ze(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let n=new pe(s,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Ge.get(e.strings);return t===void 0&&Ge.set(e.strings,t=new F(e)),t}k(e){ve(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let n of e)s===t.length?t.push(i=new r(this.O(D()),this.O(D()),this,this.options)):i=t[s],i._$AI(n),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=Be(e).nextSibling;Be(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},L=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=v}_$AI(e,t=this,i,s){let n=this.strings,o=!1;if(n===void 0)e=M(this,e,t,0),o=!H(e)||e!==this._$AH&&e!==P,o&&(this._$AH=e);else{let l=e,a,d;for(e=n[0],a=0;a<n.length-1;a++)d=M(this,l[i+a],t,a),d===P&&(d=this._$AH[a]),o||=!H(d)||d!==this._$AH[a],d===v?e=v:e!==v&&(e+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ue=class extends L{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},me=class extends L{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},ge=class extends L{constructor(e,t,i,s,n){super(e,t,i,s,n),this.type=5}_$AI(e,t=this){if((e=M(this,e,t,0)??v)===P)return;let i=this._$AH,s=e===v&&i!==v||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==v&&(i===v||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},fe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}};var Tt=be.litHtmlPolyfillSupport;Tt?.(F,B),(be.litHtmlVersions??=[]).push("3.3.2");var et=(r,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let n=t?.renderBefore??null;i._$litPart$=s=new B(e.insertBefore(D(),n),n,void 0,t??{})}return s._$AI(r),s};var xe=globalThis,y=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=et(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};y._$litElement$=!0,y.finalized=!0,xe.litElementHydrateSupport?.({LitElement:y});var At=xe.litElementPolyfillSupport;At?.({LitElement:y});(xe.litElementVersions??=[]).push("4.2.2");var J=f`
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
`,gi=f`
    :host { font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
`,U=f`
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
`,fi=f`
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
`,bi=f`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,vi=f`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,tt=f`
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
    }`,yi=f`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,it=f`
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
`,xi=f`
    :host { display: block; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,wi=f`
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
`,_i=f`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,ki=[J,f`
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
`];var we=1234,_e=r=>`v${Math.floor(r/100)}.${String(r%100).padStart(2,"0")}`,Mt="https://scoreboard-tailuge.vercel.app",T=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",Q=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),Lt=Q?`ws://${window.location.hostname}:80`:`wss://${T}`;var st=Q?"":"https://billiards-network.onrender.com",A=typeof window<"u"&&window.location.hostname.includes("vercel");var rt=r=>{if(r==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!r)return{emoji:"\u{1F310}",title:""};let e=r.toUpperCase();return{emoji:[...e].map(i=>String.fromCodePoint(127397+i.charCodeAt(0))).join(""),title:e}},nt=Q?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/";var ot=(r,e,t)=>{for(let[i,s]of Object.entries(r)){let n=e?`${e}.${encodeURIComponent(i)}`:encodeURIComponent(i);s&&typeof s=="object"&&!Array.isArray(s)?ot(s,n,t):s!=null&&t.push(`${n}=${encodeURIComponent(s)}`)}return t},Ut=(r,e,t)=>e&&typeof e=="object"?ot(e,t,[]).reduce((i,s)=>i+`&${s}`,r):r;var at=({imageUrl:r,userId:e,userName:t,lod:i,flip:s,rating:n,stars:o,custom:l})=>{let a=Math.min(1,Math.max(0,Number.isFinite(n)?n:0)),d=Math.min(15,Math.max(1,Math.round(a*15))),h=o??Math.min(5,Math.max(1,Math.ceil(a*5))),c=`${nt}?ruletype=reveal&image=${encodeURIComponent(r)}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${i}&reds=${d}`;return h===1?c+="&tableSize=6":h===2?c+="&tableSize=6&freeaim=true":h===5&&(c+="&freeaim=true"),Q&&(c+=`&lobbyUrl=${Lt}`),s&&(c+="&flip=true"),c=Ut(c,l,"custom"),c},W=({imageUrl:r,state:e})=>{if(!e)return"";let t=`${nt}?ruletype=reveal&state=${encodeURIComponent(e)}`;return r&&(t+=`&image=${encodeURIComponent(r)}`),t},lt=(r,e=document.title)=>navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:e,url:r}).then(()=>"shared").catch(()=>"dismissed"):navigator.clipboard.writeText(r).then(()=>"copied").catch(()=>"dismissed"),ct=async r=>{try{return(await(await fetch(`${Mt}/api/shorten`,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({input:new URL(r).search})})).json()).shortUrl||r}catch(e){return console.error("reveal: could not shorten url",r,e),r}};var dt=r=>{let e=(r||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},Rt={ko:"\uD55C"},$e=()=>{let[r,...e]=(navigator.languages?.[0]||navigator.language||"en").split("-"),t=Rt[(r||"").toLowerCase()];return t?`Anon-${t}`:`Anon-${(e.find(n=>/^[A-Za-z]{2}$/.test(n))||r||"en").toUpperCase().slice(0,2)}`};var ke=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),i=(e.get("userName")||"").trim();A&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let s=(localStorage.getItem("userId")||"").trim(),n=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,i||(this.userName=window.name.split("-")[0]);else{let l=i||n||"",a=!l||s.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=s.length>2&&!s.startsWith("user-")&&a?s:dt(l),this.isForcedId=!1,this.clientId!==s&&localStorage.setItem("userId",this.clientId)}this.userName=i||this.userName||n||$e(),this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",o=>{if(o.key==="custom"){try{this.custom=JSON.parse(o.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():dt(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},g=new ke,$=class extends y{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),g.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),g.removeEventListener("change",this._storeListener)}};var R={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:r=>`/publish/table/${r}`,TABLE_SUBSCRIBE:r=>`/subscribe/table/${r}`},X=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,i={}){let s=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let n=JSON.stringify(t);if(i.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let d=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(s,d))return}let o=new AbortController,l=setTimeout(()=>o.abort(),2e4),a;try{a=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:i.keepalive,signal:o.signal})}finally{clearTimeout(l)}if(!a.ok)throw new Error(`Publish failed: ${a.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages}async publishPresence(e,t){return this.publish(R.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(R.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(R.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,i,s){return this.publish(R.TABLE_PUBLISH(e),{...t,senderId:i},s)}subscribePresence(e,t){let i=`uid=${encodeURIComponent(e)}`;typeof document<"u"&&document.referrer&&(i+=`&ref=${encodeURIComponent(document.referrer)}`);let s=`${R.PRESENCE_SUBSCRIBE}?${i}`;return this.subscribe(s,t)}subscribeTable(e,t,i,s){let n=`${R.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return s?.isSpectator&&(n+="&spectator=1"),this.subscribe(n,i)}subscribe(e,t){let i=this.getWsUrl(e),s=()=>new Date().toISOString().slice(11,23),n=null,o=!1,l=0,a=8e3,d=6e4,h=null,c=!0,m=2e4,p=null,b={stop:()=>{o=!0,h&&(clearTimeout(h),h=null),p&&(clearTimeout(p),p=null),n&&(n.close(),n=null)},ready:null},N;b.ready=new Promise(w=>{N=w});let Ne=()=>{if(!o){if(n&&n.readyState<=WebSocket.OPEN){N();return}n=new globalThis.WebSocket(i),p&&clearTimeout(p),p=setTimeout(()=>{console.warn(`[NchanClient ${s()}] Connection to ${i} timed out after ${m}ms, forcing reconnect`),n?.close()},m),p.unref?.(),n.onmessage=w=>{this.record(w.data),t(w.data)},n.onopen=()=>{let w=!c;c=!1,l=0,h&&(clearTimeout(h),h=null),p&&(clearTimeout(p),p=null),N(),w&&b.onReconnect&&b.onReconnect()},n.onclose=w=>{if(p&&(clearTimeout(p),p=null),!o){if(l>=10){console.error(`[NchanClient ${s()}] Max reconnect attempts reached for ${i}, giving up`);return}let vt=Math.min(Math.pow(2,l)*a,d);l++,h=setTimeout(Ne,vt),h.unref?.()}},n.onerror=w=>{console.error(`[NchanClient ${s()}] WebSocket error on ${i}:`,w),n&&(n.onerror=null,n?.close())}}};return Ne(),b}};function ht(r){return r.type==="table:leave"&&!!r.data?.isSpectator}function Z(r){if(!r||r.trim()==="")return null;try{return JSON.parse(r)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function pt(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var Se=250,q=class r{static dedupeChallenges(e){let t=new Set;for(let i of e)i.type!=="offer"&&t.add(r.interactionKey(i));return e.filter(i=>i.type!=="offer"?!0:!t.has(r.interactionKey(i)))}static dedupePresence(e){let t=new Map;for(let i of e){let s=t.get(i.userId);if(s&&s.type!=="leave"&&i.type==="leave"&&i.meta?.origin==="internal"){let n=i.meta?.ts,o=s.meta?.ts??s.clientTs;if(n!==void 0&&o!==void 0&&n>=o&&n-o<=Se)continue}t.set(i.userId,i)}return[...t.values()]}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var ee=class{constructor(e,t,i={}){this.nchan=e;this.currentUser=t;this.options=i;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.joinSentinelTs=null;this.settledListeners=[];this.isSettled=!1;this.unsettledChallengeMessages=[];this.unsettledPresenceMessages=[];this.heartbeatInterval=i.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(!this.isJoined){this.subscription=this.nchan.subscribePresence(this.currentUser.userId,e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready;for(let e=1;;e++)try{let t=Date.now();this.joinSentinelTs=t,await this.nchan.publishPresence({...this.currentUser,clientTs:t});break}catch(t){let i=Math.min(Math.pow(2,e)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${e}), retrying in ${i}ms:`,t),await new Promise(s=>setTimeout(s,i))}this.startHeartbeat(),this.isJoined=!0}}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(i){console.error("Failed to send heartbeat:",i)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}async challenge(e,t,i,s,n){let o=pt();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:o,options:i,nextTurnId:s,custom:n}),o}async acceptChallenge(e,t,i,s,n,o,l){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:n??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:i,options:s,nextTurnId:o,custom:l}),await this.updatePresence({tableId:i,ruleType:t,options:s})}async declineChallenge(e,t,i){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:i??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=Z(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledPresenceMessages.push(e),e.userId===this.currentUser.userId&&e.type==="join"&&e.clientTs===this.joinSentinelTs&&this.fireSettled();return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let i=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),i&&this.notifyListeners()}}handleChallenge(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let i=e.meta?.ts,s=t.meta?.ts??t.clientTs;return i===void 0||s===void 0?!1:i>=s&&i-s<=Se}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=q.dedupePresence(this.unsettledPresenceMessages);for(let s of e)this.applyPresence(s);this.unsettledPresenceMessages=[];let t=q.dedupeChallenges(this.unsettledChallengeMessages);for(let s of t)this.emitIfRelevant(s);this.unsettledChallengeMessages=[];let i=[...this.settledListeners];this.settledListeners=[];for(let s of i)s()}clearSettleState(){this.joinSentinelTs=null,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.unsettledPresenceMessages=[]}};var te=class r{constructor(e,t,i,s,n=!1,o,l,a,d){this.nchan=e;this.tableId=t;this.userId=i;this.lobby=s;this.isSpectator=n;this.onClosed=a;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=d?.maxSize??1e3,this.initialRetryDelayMs=d?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=d?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(h=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(m=>m()),this.preJoinQueue.splice(0).forEach(m=>this.messageListeners.forEach(p=>p(m))),h()}}),o&&this.messageListeners.push(o),l&&this.bothJoinedListeners.push(l)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((i,s)=>{this.publishQueue.push({type:e,data:t,resolve:i,reject:s}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((i,s)=>{let n=o=>{if(this.isClosed){s(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>i()).catch(l=>{if(this.isClosed){s(l);return}let a=Math.min(Math.pow(2,o+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>n(o+1),a)})};n(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=Z(e);if(!t||!t.type)return;let i=t.meta?.msgId;if(typeof i=="string"){if(this.seenMsgIds.has(i))return;if(this.seenMsgIds.set(i,!0),this.seenMsgIds.size>r.MAX_SEEN_MSG_IDS){let s=this.seenMsgIds.keys().next().value;s!==void 0&&this.seenMsgIds.delete(s)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!ht(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let n=t.data?.id||t.senderId;n&&(this.seenIds.add(n),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&n!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(o=>o())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(s=>s(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var ie=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new X(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(s=>s.leave(e)));let i=[...this.activeTables];this.activeTables=[],await Promise.all(i.map(s=>s.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let i=(async()=>{try{let s=this.lobbyInstances.get(e.userId),n,o={...t,onReconnect:()=>{this.resumeSession().catch(a=>console.error("Session resume failed after lobby reconnect:",a)),t?.onReconnect?.()},onLeave:()=>{let a=n??s;if(a){let d=this.activeLobbies.indexOf(a);d!==-1&&this.activeLobbies.splice(d,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),s)return s.currentUser=e,await s.join(),s.resumeHeartbeat(),this.activeLobbies.includes(s)||this.activeLobbies.push(s),s;let l=new ee(this.nchan,e,o);return n=l,await l.join(),this.lobbyInstances.set(e.userId,l),this.activeLobbies.push(l),l}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,i),i}async leaveLobby(e){let t=this.activeLobbies.findIndex(i=>i.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,i){let s=i?.isSpectator??!1,n=this.tableKey(e,t,s),o=this.joiningTables.get(n);if(o)return o.promise;this.assertNoTableConflict(e,t,s);let l=this.activeTables.find(m=>m.tableId===e);if(l)return Promise.resolve(l);let a=s?void 0:this.activeLobbies.find(m=>m.currentUser.userId===t),d=new te(this.nchan,e,t,a,s,i?.onMessage,i?.onBothJoined,()=>this.removeActiveTable(d));this.activeTables.push(d);let h=d.join().catch(m=>{console.error(`Table ${e} join handshake failed:`,m)});a&&h.then(async()=>{if(!d.closed)try{await a.updatePresence({tableId:e})}catch(m){console.error("Failed to update presence after table join:",m)}});let c=Promise.resolve(d).finally(()=>{this.joiningTables.delete(n)});return this.joiningTables.set(n,{tableId:e,userId:t,isSpectator:s,promise:c}),c}tableKey(e,t,i){return`${e}|${t}|${i?"s":"p"}`}assertNoTableConflict(e,t,i){for(let s of this.joiningTables.values())if(s.tableId===e&&(s.userId!==t||s.isSpectator!==i))throw new Error(`Table ${e} is already being joined as ${s.isSpectator?"spectator":"player"} ${s.userId}; cannot also join as ${i?"spectator":"player"} ${t}`);for(let s of this.activeTables)if(s.tableId===e&&(s.userId!==t||s.isSpectator!==i))throw new Error(`Table ${e} is already joined as ${s.isSpectator?"spectator":"player"} ${s.userId}; cannot also join as ${i?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,i){return this.joinTable(e,t,{...i,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};var Nt=[[4352,4447,1],[11904,42191,1],[44032,55203,1],[63744,64255,1],[65040,65135,1],[65280,65376,1],[65504,65510,1],[127744,129791,1.25],[131072,195103,1]],ut=r=>{let e=0,t=0;for(let i of r){let s=i.codePointAt(0),n=Nt.find(([o,l])=>s>=o&&s<=l);n?t+=n[2]:e++}return!e&&!t&&(e=1),`calc(${e}ch + ${+t.toFixed(2)}em)`},Ie=class extends ${static properties={_dotColor:{state:!0}};static styles=it;constructor(){super(),this._clientId=g.clientId,this._name=g.userName,this._dotColor=g.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||$e();this._name=t,g.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return A?u``:u`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${ut(this._name)}"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=ut(e.target.value)}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",Ie);var se=null,jt=()=>(se||(se=fetch(`${st}/api/arena/winners`).then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status)))).then(r=>Array.isArray(r?.winners)?r.winners.filter(e=>e&&typeof e=="object"&&typeof e.userName=="string"):[]).catch(()=>(se=null,null))),se),Ee=class extends ${static styles=f`
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
    `;constructor(){super(),this._trophies=[],this._trophyCheckedFor=null,this._winners=null,this._observer=null,this._idleTimer=null,this._started=!1}connectedCallback(){super.connectedCallback(),A||this._startLazy()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,this._idleTimer&&(clearTimeout(this._idleTimer),this._idleTimer=null),super.disconnectedCallback()}_startLazy(){this._started||(this._started=!0,typeof IntersectionObserver<"u"?(this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&(this._observer.disconnect(),this._observer=null,this._load())}),this._observer.observe(this)):this._whenIdle(()=>this._load()))}_whenIdle(e){typeof requestIdleCallback=="function"?requestIdleCallback(()=>e()):this._idleTimer=setTimeout(e,200)}async _load(){this._winners=await jt(),this._recheck()}_recheck(){let e=(g.userName||"").trim();if(!e||!this._winners){this._trophies.length&&(this._trophies=[],this.requestUpdate());return}if(this._trophyCheckedFor===e)return;this._trophyCheckedFor=e;let t=this._winners.filter(i=>typeof i.userName=="string"&&i.userName.trim()===e);JSON.stringify(t)!==JSON.stringify(this._trophies)&&(this._trophies=t,this.requestUpdate())}willUpdate(){this._recheck()}render(){return A||!this._trophies.length?u``:u`
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
        `}};customElements.define("trophy-item",Ee);var Ot=`https://${T}/api/stats`,Ce=class extends y{static styles=f`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(Ot,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let i of Object.values(e)){let s=i.split("|")[0]||"XX";t[s]=(t[s]??0)+1}return Object.entries(t).sort((i,s)=>s[1]-i[1])}render(){if(this._err)return u`<span class="loading">Could not load stats.</span>`;if(!this._data)return u`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,i=this._countryCounts(t??{});return u`
            ${e?u`<div class="uptime"><a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${i.map(([s,n])=>u`
                    <li>${rt(s).emoji} <span>${s}</span> <span class="count">${n}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",Ce);var Pe=class r extends ${static properties={_open:{state:!0},_notifEnabled:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[U,tt,f`
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
            <button class="burger" aria-label="Settings" aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
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
                            ${this._picker==="cue"?u`<iframe src="./cue.html" title="Cue"></iframe>`:u`<iframe src="./wall.html?userName=${encodeURIComponent(g.userName)}" title="Wall"></iframe>`}
                        </div>
                    </div>
                `:""}`:""}
        `}};customElements.define("settings-modal",Pe);var re="../lobby.html",zt="../assets/threecushion.png",Dt=()=>{try{return localStorage.getItem("theme")||"dark"}catch{return"dark"}},Te=class extends y{static properties={theme:{type:String,reflect:!0,attribute:"theme"},ruleType:{type:String,attribute:"rule-type"},_hasMessage:{state:!0},_pendingChats:{state:!0},_popoverOpen:{state:!0}};static styles=[J,U,f`
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
    `];constructor(){super(),this.theme=Dt(),this._hasMessage=!1,this._pendingChats=[],this._popoverOpen=!1,this._lobby=null,this._client=null}connectedCallback(){super.connectedCallback(),this._applyTheme(this.theme),this._onNameChanged=e=>this._updatePresence(e),document.addEventListener("user-name-changed",this._onNameChanged),this._onDocPointerDown=e=>this._handleDocPointerDown(e),document.addEventListener("pointerdown",this._onDocPointerDown),this._onDocKeyDown=e=>{e.key==="Escape"&&this._popoverOpen&&this._dismissPopover()},document.addEventListener("keydown",this._onDocKeyDown),this._connectPresence().catch(e=>console.error("topbar presence failed",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onNameChanged),document.removeEventListener("pointerdown",this._onDocPointerDown),document.removeEventListener("keydown",this._onDocKeyDown);try{this._lobby?.leave()}catch{}try{this._client?.stop()}catch{}}_applyTheme(e){let t=e||"dark";this.theme=t,document.documentElement.setAttribute("theme",t),document.documentElement.style.colorScheme=t}_onThemeChanged(e){this._applyTheme(e.detail),this.dispatchEvent(new CustomEvent("theme-changed",{detail:this.theme,bubbles:!0,composed:!0}))}async _connectPresence(){let t=`https://${typeof T<"u"&&T?T:"billiards-network.onrender.com"}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(t=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`);let i=new ie({baseUrl:t});i.setVersion(_e(we)),this._client=i;let s=await i.joinLobby({messageType:"presence",type:"join",userId:g.clientId,userName:g.userName,...this.ruleType?{ruleType:this.ruleType}:{}});this._lobby=s,s.onChat(n=>this._onIncomingChat(n)),s.onChallenge(n=>{n.type==="offer"&&this._flagPendingMessage()})}_updatePresence(e){if(!this._lobby)return;let t=e.detail||{},i=t.userName||g.userName,s=t.userId||g.clientId;this._lobby.updatePresence({userId:s,userName:i}).catch(n=>console.error("topbar: updatePresence failed",n))}_flagPendingMessage(){this._hasMessage||(this._hasMessage=!0)}_onIncomingChat(e){if(!e?.text)return;let t=this._lobby?.getUsers?.().find(i=>i.userId===e.senderId)?.userName||e.senderId;this._pendingChats=[...this._pendingChats,{sender:t,text:e.text}].slice(-5),this._hasMessage=!0,this._popoverOpen=!0}_dismissPopover(){this._popoverOpen&&(this._popoverOpen=!1)}_handleDocPointerDown(e){!this._popoverOpen||(e.composedPath?.()??[]).some(i=>i?.classList?.contains?.("chat-popover"))||this._dismissPopover()}render(){return u`
      <header class="topbar">
        <a href=${re} class="topbrand" aria-label="Billiards lobby"
          ><img src=${zt} class="logo" alt=""
        /></a>
        <h1 class="title">
          <a href=${re}>Billiards</a
          ><a
            href="https://github.com/tailuge/billiards"
            target="_blank"
            rel="noopener"
            class="version"
            >${_e(we)}</a
          >
        </h1>
        <a
          class="top-link ${this._hasMessage?"top-link--alert":""}"
          href=${re}
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
                  <a class="chat-popover-lobby" href=${re}>Lobby</a>
                </div>
              </div>
            `:""}
        <trophy-item></trophy-item>
        <user-badge></user-badge>
        <settings-modal
          @theme-changed=${e=>this._onThemeChanged(e)}
        ></settings-modal>
      </header>
    `}};customElements.define("app-topbar",Te);var oe="reveal:collection",Re="reveal:removed",ft="reveal:deck",x=[{id:"kids",label:"K-idols",title:"K-Pot Idol",mode:"k-idols",dataId:"challenge-data"},{id:"taipei",label:"Taipei",title:"Taipei",mode:"taipei",dataId:"taipei-data"},{id:"cars",label:"SuperCars",title:"SuperCars",mode:"supercars",dataId:"cars-data"},{id:"pokemon",label:"Pokemon",title:"Pok\xE9pot",mode:"pokepot",dataId:"pokemon-data"},{id:"starwars",label:"Star Wars",title:"Star Wars",mode:"starwars",dataId:"starwars-data"},{id:"anime",label:"\u30A2\u30CB\u30E1",title:"\u30A2\u30CB\u30E1",mode:"anime",dataId:"anime-data"},{id:"manga",label:"\u6F2B\u753B",title:"\u6F2B\u753B",mode:"manga",dataId:"manga-data"}],ae=x.reduce((r,e)=>r+ne(e.dataId).length,0)||20;function bt(r){return r.toLowerCase().replace(/[()]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48)}function ne(r="challenge-data"){let e=document.getElementById(r);return e?[...e.querySelectorAll("a[data-image]")].map(i=>{let s=i.textContent.trim(),n=i.getAttribute("data-image")||"",o=i.getAttribute("href")||"",l=Number.parseFloat(i.getAttribute("data-rating")||""),a=Number.isFinite(l)?Math.min(1,Math.max(0,l)):0;return{name:s,imageUrl:n.trim(),wikipediaUrl:o.trim(),rating:a,id:bt(s),pokeType:i.getAttribute("data-type")||void 0,pokeNature:i.getAttribute("data-nature")||void 0}}).filter(i=>i.imageUrl):[]}function Ht(r){return()=>{r|=0,r=r+1831565813|0;let e=Math.imul(r^r>>>15,1|r);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Ft(r){let e=0;for(let t=0;t<r.length;t++)e=Math.imul(31,e)+r.charCodeAt(t)|0;return e>>>0}function Ae(r){if(!r.length)return r;let e=r.length,t=r.map((s,n)=>{let o=(n+1)/e;return{...s,normRating:o,stars:Math.min(5,Math.max(1,Math.ceil(o*5)))}}),i=Ht(Ft(r[0].imageUrl));for(let s=t.length-1;s>0;s--){let n=Math.floor(i()*(s+1));[t[s],t[n]]=[t[n],t[s]]}return t}function Me(){try{let r=localStorage.getItem(oe);if(!r)return[];let e=JSON.parse(r);return Array.isArray(e)?e:[]}catch{return[]}}function Le(r){try{localStorage.setItem(oe,JSON.stringify(r.slice(0,ae)))}catch(e){if(e&&e.name==="QuotaExceededError"){console.log("reveal: localStorage quota exceeded, evicting oldest");try{r.pop(),localStorage.setItem(oe,JSON.stringify(r.slice(0,ae)))}catch{console.log("reveal: still over quota after eviction")}}else console.log("reveal: saveCollection failed",e)}}function Bt(){try{localStorage.removeItem(oe),localStorage.removeItem(Re)}catch(r){console.log("reveal: clearCollection failed",r)}}function Jt(){try{let r=localStorage.getItem(Re);if(!r)return[];let e=JSON.parse(r);return Array.isArray(e)?e.filter(t=>typeof t=="string"):[]}catch{return[]}}function mt(r){try{localStorage.setItem(Re,JSON.stringify(r))}catch(e){console.log("reveal: saveRemovedIds failed",e)}}function Wt(){try{let r=localStorage.getItem(ft);return x.some(e=>e.id===r)?r:x[0].id}catch{return x[0].id}}function qt(r){try{localStorage.setItem(ft,r)}catch(e){console.log("reveal: saveDeckId failed",e)}}function Vt(){let r;try{r=new URLSearchParams(window.location.search).get("mode")}catch{return null}if(!r)return null;let e=r.trim().toLowerCase();return x.find(t=>t.mode===e)?.id??null}var Yt={normal:"#9fa19f",fire:"#e62829",water:"#2980ef",electric:"#fac000",grass:"#3fa129",ice:"#3dcef3",fighting:"#ff8000",poison:"#9141cb",ground:"#915121",flying:"#81b9ef",psychic:"#ef4179",bug:"#91a119",rock:"#afa981",ghost:"#704170",dragon:"#5060e1",dark:"#624d4e",steel:"#60a1b8",fairy:"#ef70ef"};function gt(r,e=42,t=22){let i=Number.parseInt(r.replace("#",""),16),s=(i>>16&255)/255,n=(i>>8&255)/255,o=(i&255)/255,l=Math.max(s,n,o),a=l-Math.min(s,n,o),d=0;a&&(l===s?d=((n-o)/a+6)%6:l===n?d=(o-s)/a+2:d=(s-n)/a+4,d*=60);let h=Math.min(1,a/.35);return`${d.toFixed(1)} ${(e*h).toFixed(1)}% ${t}%`}async function Gt(r,{targetEdge:e=180,type:t=""}={}){let i=new Image;i.crossOrigin="anonymous";let n=await new Promise((b,N)=>{i.onload=()=>b(i),i.onerror=()=>N(new Error("image load failed")),i.src=r}),o=Math.max(n.naturalWidth,n.naturalHeight);if(!o)throw new Error("zero size image");let l=Math.min(1,e/o),a=Math.max(1,Math.round(n.naturalWidth*l)),d=Math.max(1,Math.round(n.naturalHeight*l)),h=document.createElement("canvas");h.width=a,h.height=d;let c=h.getContext("2d");if(!c)throw new Error("no 2d context");c.imageSmoothingQuality="high";let m=Yt[t];if(m){let b=c.createRadialGradient(a/2,d/2,0,a/2,d/2,Math.hypot(a,d)/2);b.addColorStop(0,`hsl(${gt(m)})`),b.addColorStop(1,`hsl(${gt(m,32,8)})`),c.fillStyle=b,c.fillRect(0,0,a,d)}c.drawImage(n,0,0,a,d);let p;try{p=h.toDataURL("image/webp",.6),p.startsWith("data:image/webp")||(p=h.toDataURL("image/jpeg",.7))}catch(b){throw console.log("reveal: thumb toDataURL failed (taint?)",b),b}return p}function S(r){return r.id||bt(r.name)}var Ue=class extends y{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_flippedId:{state:!0},_sharingId:{state:!0},_sharedId:{state:!0},_completedIds:{state:!0},_removedIds:{state:!0},_collection:{state:!0},_challenges:{state:!0},_deckId:{state:!0}};static styles=[J,U,f`
      :host {
        display: block;
        box-sizing: border-box;
        padding: 0.25rem;
        background: var(--bg);
        color: var(--text);
        font-family: Exo, "Exo Fallback", sans-serif;
        font-weight: 200;
        font-size: 0.85rem;
      }
      .container {
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .intro {
        padding: 0.1rem 0 0.15rem;
        text-align: center;
      }
      .intro h2 {
        margin: 0 0 0.15rem;
        font-size: 1rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-dim);
        font-weight: 600;
      }
      .intro p {
        margin: 0;
        font-size: 0.78rem;
        color: var(--text-muted);
        line-height: 1.35;
      }
      .intro-head {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin: 0 0 0.15rem;
      }
      .intro-head h2 {
        margin: 0;
      }
      /* Deck chooser sits above the wall of cards, to the left of Reset deck. */
      .deck-switch {
        display: inline-flex;
        gap: 0.25rem;
      }
      .deck-btn {
        font: inherit;
        font-size: 0.72rem;
        line-height: 1.5;
        padding: 0.15rem 0.4rem;
        border: 1px solid var(--btn-border);
        border-radius: 4px;
        background: var(--btn-bg);
        color: var(--text-muted);
        cursor: pointer;
      }
      .deck-btn:hover {
        border-color: #0d6efd;
      }
      .deck-btn[aria-pressed="true"] {
        background: #0d6efd;
        border-color: #0d6efd;
        color: #fff;
      }
      .deck-btn:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
      .panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 0.4rem;
        /* Cards cast shadows outward — clipping them at the panel edge would flatten the deck */
        overflow: visible;
      }
      /* Deck chooser and reset, above the wall of cards */
      .deck-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.35rem;
      }
      .reset-btn {
        padding: 0.15rem 0.4rem;
        border: 1px solid var(--btn-border);
        border-radius: 4px;
        background: var(--btn-bg);
        color: var(--text-muted);
        font-size: 0.72rem;
      }
      .reset-btn:hover {
        background: var(--btn-hover);
        color: var(--text);
      }
      .reset-btn:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
      /* Dense card grid — the central element */
      .card-grid {
        display: grid;
        grid-template-columns: repeat(
          auto-fill,
          minmax(max(88px, calc((100% - 42px) / 8)), 1fr)
        );
        /* Just wide enough for the card shadows to read between neighbours */
        gap: 6px;
      }
      @media (width <= 380px) {
        .card-grid {
          grid-template-columns: repeat(
            auto-fill,
            minmax(max(76px, calc((100% - 35px) / 8)), 1fr)
          );
          gap: 5px;
        }
      }
      /* Single 3:4 flip card — front shows '?' or the picture, back shows the actions */
      .card {
        position: relative;
        aspect-ratio: 3 / 4;
        border: 1px solid var(--border);
        border-radius: 6px;
        overflow: hidden;
        background: var(--surface);
        padding: 0;
        cursor: pointer;
        perspective: 600px;
        font: inherit;
        color: inherit;
        /* Layered drop shadow + a hairline top highlight, so the wall reads as a deck of
           physical cards rather than a flat grid. Works in both themes. */
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.45),
          0 3px 7px rgba(0, 0, 0, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
        transition:
          box-shadow 160ms ease,
          transform 160ms ease;
      }
      .card:hover {
        z-index: 1;
        transform: translateY(-1px);
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.5),
          0 8px 18px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      .card:active {
        transform: translateY(0);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.5),
          0 2px 5px rgba(0, 0, 0, 0.32);
      }
      /* An open card sits proud of the wall, so it shades harder than its neighbours */
      .card.is-flipped,
      .card:focus-visible {
        z-index: 1;
        box-shadow:
          0 2px 5px rgba(0, 0, 0, 0.5),
          0 10px 22px rgba(0, 0, 0, 0.42);
      }
      .card:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
      .flip-inner {
        position: absolute;
        inset: 0;
        transform-style: preserve-3d;
        transition: transform 220ms ease;
      }
      .card.is-flipped .flip-inner {
        transform: rotateY(180deg);
      }
      @media (prefers-reduced-motion: reduce) {
        .flip-inner,
        .card {
          transition: none;
        }
        .card:hover {
          transform: none;
        }
      }
      /* The isolation below is load-bearing, not cosmetic: the front face's hint spans carry
         z-index 1 (to sit above the completed card's thumbnail and the inner vignette), and
         without a stacking context of their own those indices leak past the sibling back face.
         On a flipped card the front face is turned away — invisible, but its spans still won
         hit-testing over the Play button, so taps in the middle of that button flipped the card
         shut instead of playing. Isolating each face keeps its children's z-index inside it, and
         hit-testing then resolves to whichever face is actually towards the viewer. Probed across
         the Play button's own rectangle: every point used to resolve to the rating stars, type
         pill or nature pill on the hidden face; with this, all of them resolve to the button. */
      .face {
        position: absolute;
        inset: 0;
        isolation: isolate;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
        box-sizing: border-box;
      }
      .face-front {
        background: var(--surface);
        color: var(--text-faint);
      }
      .face-front .q {
        font-size: 1.6rem;
        font-weight: 200;
        line-height: 1;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      }
      .rating {
        margin-top: 0.2rem;
        color: #f5c451;
        font-size: 0.62rem;
        line-height: 1;
        letter-spacing: 0.04rem;
        white-space: nowrap;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
        z-index: 1;
      }
      /* ── Pokémon type / nature hint pills ─────────────────────────────── */
      .poke-pills {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        margin-top: 0.28rem;
        z-index: 1;
      }
      /* Both pills bias their padding downward. The font's ascent/descent box is symmetric, but
         a short label like "fire" or "Jolly" has no descenders, so the visible ink rides above
         the middle of the pill. Equal padding measured 2.75px above the text against 3.75px
         below; taken from the top and given to the bottom, the ink sits on the centreline. */
      .type-pill {
        padding: 0.15rem 0.32rem 0.02rem;
        border-radius: 99px;
        font-size: 0.52rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: capitalize;
        line-height: 1.55;
        opacity: 0.82;
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
      }
      /* No opacity on the pill itself: fading the whole element composited --text-dim down to
         ~2.6:1 against the card surface, failing WCAG 1.4.3 (needs 4.5:1). It stays visually
         quiet via its low-alpha background instead, so the text keeps its full colour. */
      .nature-pill {
        padding: 0.1rem 0.3rem 0.02rem;
        border-radius: 99px;
        font-size: 0.48rem;
        font-weight: 400;
        line-height: 1.55;
        background: rgba(128, 128, 128, 0.18);
        color: var(--text-dim);
        border: 1px solid rgba(128, 128, 128, 0.25);
        white-space: nowrap;
        max-width: 5.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      /* Authentic Pokémon type colours */
      .type-pill[data-t="normal"] {
        background: #9fa19f;
      }
      .type-pill[data-t="fire"] {
        background: #e62829;
      }
      .type-pill[data-t="water"] {
        background: #2980ef;
      }
      .type-pill[data-t="electric"] {
        background: #fac000;
        color: #222;
        text-shadow: none;
      }
      .type-pill[data-t="grass"] {
        background: #3fa129;
      }
      .type-pill[data-t="ice"] {
        background: #3dcef3;
        color: #222;
        text-shadow: none;
      }
      .type-pill[data-t="fighting"] {
        background: #ff8000;
      }
      .type-pill[data-t="poison"] {
        background: #9141cb;
      }
      .type-pill[data-t="ground"] {
        background: #915121;
      }
      .type-pill[data-t="flying"] {
        background: #81b9ef;
        color: #222;
        text-shadow: none;
      }
      .type-pill[data-t="psychic"] {
        background: #ef4179;
      }
      .type-pill[data-t="bug"] {
        background: #91a119;
      }
      .type-pill[data-t="rock"] {
        background: #afa981;
      }
      .type-pill[data-t="ghost"] {
        background: #704170;
      }
      .type-pill[data-t="dragon"] {
        background: #5060e1;
      }
      .type-pill[data-t="dark"] {
        background: #624d4e;
      }
      .type-pill[data-t="steel"] {
        background: #60a1b8;
      }
      .type-pill[data-t="fairy"] {
        background: #ef70ef;
      }
      .face-front img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      /* Inner shading on the thumbnail: a hairline inner border plus a bottom vignette,
         so the picture looks set into the card. Painted over the image. */
      .face-front::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 0.18),
          inset 0 -10px 18px rgba(0, 0, 0, 0.3);
      }
      .face-back {
        background: var(--surface);
        transform: rotateY(180deg);
        box-shadow: inset 0 0 14px rgba(0, 0, 0, 0.2);
      }
      /* Solved back face: name centred between the four corner buttons.
         min-height/min-width are the WCAG 2.5.8 Target Size (Minimum) floor of 24px. The link
         reads as plain text -- no background or border, the padding alone carries the hit area
         -- but the box is large enough to tap. inline-block is load-bearing: padding does not
         grow the line box of an inline anchor, so without it the target stays one text line
         tall. A miss here lands on the card, which flips the card shut. */
      .back-name {
        display: inline-block;
        min-width: 24px;
        min-height: 24px;
        max-width: 100%;
        box-sizing: border-box;
        padding: 0.3rem 0.4rem;
        font-size: 0.68rem;
        line-height: 1.15;
        color: var(--link);
        text-decoration: none;
        text-align: center;
        overflow-wrap: anywhere;
        max-height: 3.4em;
        overflow: hidden;
        cursor: pointer;
      }
      .back-name:hover {
        text-decoration: underline;
      }
      .back-name:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
      /* Primary action on a flipped card. It is the only way out of the wall into a game, so it
         is sized to be hit reliably on a phone: full card width (capped) and 32px tall, against
         the 24px minimum of WCAG 2.5.8. A miss lands on the card underneath, which flips the
         card shut — so a small target costs the player their opened card, not just a second tap. */
      .play-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        width: 100%;
        max-width: 5.5rem;
        min-height: 2rem;
        padding: 0.3rem 0.5rem;
        border-radius: 6px;
        border: 1px solid #0a58ca;
        background: #0d6efd;
        color: #fff;
        font: inherit;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        transition:
          background-color 120ms ease,
          box-shadow 120ms ease,
          transform 80ms ease;
      }
      /* Hover has to read at a glance on a 90px-wide card: a clearly lighter blue, plus a lift.
         The previous #0b5ed7 was within a hair of the resting #0d6efd, so hovering looked like
         nothing was happening. */
      .play-btn:hover {
        background: #2b7bff;
        border-color: #2b7bff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
        transform: translateY(-1px);
      }
      .play-btn:active {
        background: #0a53c4;
        border-color: #0a53c4;
        box-shadow: none;
        transform: translateY(1px) scale(0.98);
      }
      /* Outline sits on the card surface, not the blue fill, so it uses the body text colour
         (high contrast in both themes) rather than another shade of blue. */
      .play-btn:focus-visible {
        outline: 2px solid var(--text);
        outline-offset: 1px;
      }
      @media (prefers-reduced-motion: reduce) {
        .play-btn {
          transition: none;
        }
        .play-btn:hover,
        .play-btn:active {
          transform: none;
        }
      }
      /* Share/Delete/Replay sit in the top-right, bottom-left and bottom-right corners; the
         top-left stays free. */
      .corner-btn {
        position: absolute;
        width: 22px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--text);
        font-size: 0.65rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
      .corner-btn:hover {
        background: var(--bg);
      }
      .corner-btn:focus-visible {
        outline: 2px solid #007bff;
        outline-offset: 1px;
      }
      .corner-btn[disabled] {
        opacity: 0.4;
        cursor: default;
      }
      /* Share confirmed: the button tints and shows a tick for two seconds */
      .corner-btn.shared {
        border-color: #198754;
        color: #198754;
      }
      .shared-tick {
        font-size: 0.8rem;
        line-height: 1;
      }
      /* Inline SVG glyphs (no icon font) sit on the button's own text colour */
      .corner-btn svg {
        width: 13px;
        height: 13px;
        display: block;
        fill: currentColor;
      }
      .corner-tr {
        top: 3px;
        right: 3px;
      }
      .corner-bl {
        bottom: 3px;
        left: 3px;
      }
      .corner-br {
        bottom: 3px;
        right: 3px;
      }
      /* The explanatory prose lives once, in the light DOM (index.html .seo-fallback). */
    `];constructor(){super(),this._theme=document.documentElement.getAttribute("theme")||"dark",this._flippedId=null,this._completedIds=new Set,this._removedIds=new Set,this._collection=[],this._challenges=[],this._deckId=x[0].id}connectedCallback(){super.connectedCallback();try{let e=localStorage.getItem("theme")||this._theme||"dark";this._theme=e,document.documentElement.setAttribute("theme",e),document.documentElement.style.colorScheme=e}catch{}this._deckId=Vt()??Wt(),this._challenges=Ae(ne(this._deck().dataId)),this._collection=Me(),this._completedIds=new Set(this._collection.map(e=>e.id)),this._removedIds=new Set(Jt()),this._handleReturnParam().catch(e=>console.log("reveal: handleReturnParam error",e))}_deck(){return x.find(e=>e.id===this._deckId)??x[0]}_setDeck(e){let t=x.find(s=>s.id===e)??x[0];qt(t.id);let i=new URLSearchParams(window.location.search);i.set("mode",t.mode),this._replaceQuery(i.toString()),(t.id!==this._deckId||!this._challenges.length)&&(this._deckId=t.id,this._challenges=Ae(ne(t.dataId)),this._flippedId=null),this.requestUpdate()}_matchChallenge(e){for(let t of x){let i=t.id===this._deckId&&this._challenges.length?this._challenges:Ae(ne(t.dataId)),s=i.find(n=>n.imageUrl===e)||i.find(n=>decodeURIComponent(n.imageUrl)===e);if(s)return{ch:s,deck:t}}return null}async _handleReturnParam(){let e=new URLSearchParams(window.location.search),t=e.get("image");if(!t)return;this._stripReturnParams();let i;try{i=decodeURIComponent(t)}catch{i=t}let s=this._matchChallenge(i);if(!s){console.log("reveal: ?image= did not match any challenge, ignoring",i.slice(0,120));return}s.deck.id!==this._deckId&&this._setDeck(s.deck.id);let n=s.ch,o=S(n),l=e.get("state")||"";if(this._completedIds.has(o)){console.log("reveal: already completed",o);let c=Me(),m=c.findIndex(p=>p.id===o);if(m>=0){let[p]=c.splice(m,1);p.completedAt=Date.now(),l&&(p.state=l,p.replayUrl=W({imageUrl:p.imageUrl,state:l})),c.unshift(p),Le(c),this._collection=c,this.requestUpdate()}return}let a="";try{a=await Gt(n.imageUrl,{type:n.pokeType})}catch(c){console.log("reveal: thumb generation failed, card stays unsolved",c);return}let d={id:o,name:n.name,imageUrl:n.imageUrl,wikipediaUrl:n.wikipediaUrl,thumb:a,completedAt:Date.now(),state:l,replayUrl:W({imageUrl:n.imageUrl,state:l})},h=Me();if(h.unshift(d),h.length>ae&&(h.length=ae),Le(h),this._collection=h,this._completedIds=new Set(h.map(c=>c.id)),this._removedIds.has(o)){let c=new Set(this._removedIds);c.delete(o),mt([...c]),this._removedIds=c}this.requestUpdate()}_replaceQuery(e){history.replaceState(null,"",location.pathname+(e?`?${e}`:"")+location.hash)}_stripReturnParams(){let e=new URLSearchParams(window.location.search);!e.has("image")&&!e.has("state")||(e.delete("image"),e.delete("state"),this._replaceQuery(e.toString()))}_entryFor(e){let t=S(e);return this._collection.find(i=>i.id===t||i.imageUrl===e.imageUrl)}_replayUrlFor(e){return e?e.replayUrl||(e.state?W({imageUrl:e.imageUrl,state:e.state}):""):""}_onFlip(e){let t=S(e);this._flippedId=this._flippedId===t?null:t}_onPlay(e,t){e.stopPropagation();let i=at({imageUrl:t.imageUrl,userId:g.clientId,userName:g.userName,lod:g.lod,flip:g.flip,rating:t.normRating??t.rating,stars:t.stars,custom:g.getCustom()});window.location.href=i}async _onShare(e,t){e.stopPropagation();let i=this._entryFor(t)?.state;if(!i)return;let s=S(t);this._sharingId=s;let n=await ct(W({state:i}));this._sharingId=null,await lt(n)==="copied"&&(this._sharedId=s,setTimeout(()=>{this._sharedId=null},2e3))}_onReplay(e,t){e.stopPropagation();let i=this._replayUrlFor(this._entryFor(t));i&&window.open(i,"_blank","noopener")}_onResetClick(){let e=this._collection.length,t=this._removedIds.size;if(!e&&!t)return;let i=[];e&&i.push(`${e} revealed card${e===1?"":"s"}`),t&&i.push(`${t} deleted picture${t===1?"":"s"}`),window.confirm(`Reset deck? This clears ${i.join(" and ")}, setting every card back to unsolved.`)&&(Bt(),this._collection=[],this._completedIds=new Set,this._removedIds=new Set,this._flippedId=null,console.log("reveal: deck reset"),this.requestUpdate())}_onDelete(e,t){e.stopPropagation();let i=S(t),s=this._collection.filter(o=>o.id!==i);Le(s),this._collection=s,this._completedIds=new Set(s.map(o=>o.id));let n=new Set(this._removedIds);n.add(i),mt([...n]),this._removedIds=n,this._flippedId===i&&(this._flippedId=null),console.log("reveal: deleted",i),this.requestUpdate()}_renderCard(e,t){let i=S(e),s=!!t,n=this._flippedId===i,o=["card",s?"completed":"",n?"is-flipped":""].filter(Boolean).join(" "),l=s&&!!this._replayUrlFor(t),a=e.stars,d=e.pokeNature?e.pokeNature.split(" ")[0]:"",h=[e.pokeType,d].filter(Boolean),c=h.length?`${h.join(" ")} \u2014 `:"",m=s?`${e.name} \u2014 completed, tap for actions`:`Mystery picture \u2014 ${c}play to reveal, ${a} star rating, tap to flip`;return u`
      <button
        class="${o}"
        role="button"
        aria-label="${m}"
        aria-pressed="${n?"true":"false"}"
        title="${s?e.name:"Mystery picture"}"
        @click=${()=>this._onFlip(e)}
      >
        <div class="flip-inner">
          ${s?u`<div class="face face-front">
                  <img src="${t.thumb}" alt="" loading="lazy" />
                </div>`:u`<div class="face face-front">
                  <span class="q" aria-hidden="true">?</span>
                  <span
                    class="rating"
                    role="img"
                    aria-label="${a} out of 5 stars"
                    >${"\u2605".repeat(a)}</span
                  >
                  ${e.pokeType?u`<div class="poke-pills" aria-hidden="true">
                          <span class="type-pill" data-t="${e.pokeType}"
                            >${e.pokeType}</span
                          >
                          ${d?u`<span
                                  class="nature-pill"
                                  title="${e.pokeNature}"
                                  >${d}</span
                                >`:""}
                        </div>`:""}
                </div>`}
          <div class="face face-back">
            ${s?u`
                    <a
                      class="back-name"
                      href="${e.wikipediaUrl}"
                      target="_blank"
                      rel="noopener"
                      title="View ${e.name} on Wikipedia"
                      @click=${p=>p.stopPropagation()}
                      >${e.name}</a
                    >
                    <button
                      class="corner-btn corner-tr ${this._sharedId===i?"shared":""}"
                      type="button"
                      title="Share"
                      aria-label="Share ${e.name}"
                      ?disabled=${this._sharingId===i}
                      @click=${p=>this._onShare(p,e)}
                    >
                      ${this._sharedId===i?u`<span class="shared-tick" aria-hidden="true"
                              >✓</span
                            >`:u`<svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
                              />
                            </svg>`}
                    </button>
                    <button
                      class="corner-btn corner-bl"
                      type="button"
                      title="Remove from collection"
                      aria-label="Remove ${e.name} from collection"
                      @click=${p=>this._onDelete(p,e)}
                    >
                      ✕
                    </button>
                    <button
                      class="corner-btn corner-br"
                      type="button"
                      title="Replay"
                      aria-label="Replay ${e.name}"
                      ?disabled=${!l}
                      @click=${p=>this._onReplay(p,e)}
                    >
                      ▶
                    </button>
                  `:u`
                    <button
                      class="play-btn"
                      type="button"
                      aria-label="Play ${e.name}"
                      @click=${p=>this._onPlay(p,e)}
                    >
                      ▶ Play
                    </button>
                  `}
          </div>
        </div>
      </button>
    `}render(){let e=new Map(this._collection.map(s=>[s.id,s])),t=!!document.getElementById(this._deck().dataId),i=this._challenges.filter(s=>!this._removedIds.has(S(s)));return u`
      <div class="container">
        <app-topbar
          @theme-changed=${s=>{this._theme=s.detail}}
        ></app-topbar>

        <section class="intro">
          <div class="intro-head">
            <h2>${this._deck().title}</h2>
          </div>
          <p>
            Play billiards to uncover hidden pictures. Each successful pot
            reveals another part of the mystery image.
          </p>
        </section>

        <section class="panel" aria-labelledby="collection-heading">
          <h2 id="collection-heading" hidden>Picture collection</h2>
          <div class="deck-footer">
            <div class="deck-switch" role="group" aria-label="Deck">
              ${x.map(s=>u`
                  <button
                    class="deck-btn"
                    type="button"
                    aria-pressed="${s.id===this._deckId?"true":"false"}"
                    title="Show the ${s.label} deck"
                    @click=${()=>this._setDeck(s.id)}
                  >
                    ${s.label}
                  </button>
                `)}
            </div>
            ${this._collection.length||this._removedIds.size?u`<button
                    class="reset-btn"
                    type="button"
                    title="Clear all revealed cards and restore deleted pictures"
                    aria-label="Reset deck — clear all revealed cards and restore the full deck"
                    @click=${this._onResetClick}
                  >
                    Reset decks
                  </button>`:""}
          </div>
          <div class="card-grid">
            ${i.length?i.map(s=>{let n=S(s),o=e.get(n);return this._renderCard(s,o)}):u`<p style="color:var(--text-muted);font-size:0.78rem">
                    ${this._challenges.length?"No pictures left \u2014 press Reset deck to restore the wall.":t?"No pictures in this deck yet.":"Loading pictures\u2026"}
                  </p>`}
          </div>
        </section>
      </div>
    `}};customElements.define("reveal-app",Ue);})();
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
