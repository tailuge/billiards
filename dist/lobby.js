"use strict";(()=>{var Z=globalThis,ee=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ce=Symbol(),at=new WeakMap,G=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ee&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=at.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&at.set(t,e))}return e}toString(){return this.cssText}},lt=r=>new G(typeof r=="string"?r:r+"",void 0,Ce),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new G(t,r,Ce)},ct=(r,e)=>{if(ee)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=Z.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},Te=ee?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return lt(t)})(r):r;var{is:rs,defineProperty:ns,getOwnPropertyDescriptor:os,getOwnPropertyNames:as,getOwnPropertySymbols:ls,getPrototypeOf:cs}=Object,te=globalThis,dt=te.trustedTypes,ds=dt?dt.emptyScript:"",hs=te.reactiveElementPolyfillSupport,J=(r,e)=>r,ke={toAttribute(r,e){switch(e){case Boolean:r=r?ds:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},pt=(r,e)=>!rs(r,e),ht={attribute:!0,type:String,converter:ke,reflect:!1,useDefault:!1,hasChanged:pt};Symbol.metadata??=Symbol("metadata"),te.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ht){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&ns(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=os(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ht}static _$Ei(){if(this.hasOwnProperty(J("elementProperties")))return;let e=cs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(J("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(J("properties"))){let t=this.properties,s=[...as(t),...ls(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Te(i))}else e!==void 0&&t.push(Te(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ct(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:ke).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:ke;this._$Em=i;let l=o.fromAttribute(t,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??pt)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[J("elementProperties")]=new Map,E[J("finalized")]=new Map,hs?.({ReactiveElement:E}),(te.reactiveElementVersions??=[]).push("2.1.2");var Pe=globalThis,ut=r=>r,se=Pe.trustedTypes,gt=se?se.createPolicy("lit-html",{createHTML:r=>r}):void 0,Le="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Me="?"+C,ps=`<${Me}>`,L=document,V=()=>L.createComment(""),q=r=>r===null||typeof r!="object"&&typeof r!="function",Ne=Array.isArray,xt=r=>Ne(r)||typeof r?.[Symbol.iterator]=="function",Ae=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,mt=/-->/g,bt=/>/g,A=RegExp(`>|${Ae}(?:([^\\s"'>=/]+)(${Ae}*=${Ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ft=/'/g,yt=/"/g,wt=/^(?:script|style|textarea|title)$/i,Re=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),c=Re(1),As=Re(2),Ps=Re(3),_=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),vt=new WeakMap,P=L.createTreeWalker(L,129);function $t(r,e){if(!Ne(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return gt!==void 0?gt.createHTML(e):e}var St=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=Y;for(let l=0;l<t;l++){let a=r[l],h,p,d=-1,u=0;for(;u<a.length&&(o.lastIndex=u,p=o.exec(a),p!==null);)u=o.lastIndex,o===Y?p[1]==="!--"?o=mt:p[1]!==void 0?o=bt:p[2]!==void 0?(wt.test(p[2])&&(i=RegExp("</"+p[2],"g")),o=A):p[3]!==void 0&&(o=A):o===A?p[0]===">"?(o=i??Y,d=-1):p[1]===void 0?d=-2:(d=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?A:p[3]==='"'?yt:ft):o===yt||o===ft?o=A:o===mt||o===bt?o=Y:(o=A,i=void 0);let g=o===A&&r[l+1].startsWith("/>")?" ":"";n+=o===Y?a+ps:d>=0?(s.push(h),a.slice(0,d)+Le+a.slice(d)+C+g):a+C+(d===-2?l:g)}return[$t(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},W=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,l=e.length-1,a=this.parts,[h,p]=St(e,t);if(this.el=r.createElement(h,s),P.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=P.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(Le)){let u=p[o++],g=i.getAttribute(d).split(C),y=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:y[2],strings:g,ctor:y[1]==="."?re:y[1]==="?"?ne:y[1]==="@"?oe:N}),i.removeAttribute(d)}else d.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(wt.test(i.tagName)){let d=i.textContent.split(C),u=d.length-1;if(u>0){i.textContent=se?se.emptyScript:"";for(let g=0;g<u;g++)i.append(d[g],V()),P.nextNode(),a.push({type:2,index:++n});i.append(d[u],V())}}}else if(i.nodeType===8)if(i.data===Me)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(C,d+1))!==-1;)a.push({type:7,index:n}),d+=C.length-1}n++}}static createElement(e,t){let s=L.createElement("template");return s.innerHTML=e,s}};function M(r,e,t=r,s){if(e===_)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=q(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=M(r,i._$AS(r,e.values),i,s)),e}var ie=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??L).importNode(t,!0);P.currentNode=i;let n=P.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new O(n,n.nextSibling,this,e):a.type===1?h=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(h=new ae(n,this,e)),this._$AV.push(h),a=s[++l]}o!==a?.index&&(n=P.nextNode(),o++)}return P.currentNode=L,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),q(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==_&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):xt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(L.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=W.createElement($t(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new ie(i,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=vt.get(e.strings);return t===void 0&&vt.set(e.strings,t=new W(e)),t}k(e){Ne(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(V()),this.O(V()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ut(e).nextSibling;ut(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=M(this,e,t,0),o=!q(e)||e!==this._$AH&&e!==_,o&&(this._$AH=e);else{let l=e,a,h;for(e=n[0],a=0;a<n.length-1;a++)h=M(this,l[s+a],t,a),h===_&&(h=this._$AH[a]),o||=!q(h)||h!==this._$AH[a],h===v?e=v:e!==v&&(e+=(h??"")+n[a+1]),this._$AH[a]=h}o&&!i&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},re=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},ne=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},oe=class extends N{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=M(this,e,t,0)??v)===_)return;let s=this._$AH,i=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ae=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}},_t={M:Le,P:C,A:Me,C:1,L:St,R:ie,D:xt,V:M,I:O,H:N,N:ne,U:oe,B:re,F:ae},us=Pe.litHtmlPolyfillSupport;us?.(W,O),(Pe.litHtmlVersions??=[]).push("3.3.2");var It=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new O(e.insertBefore(V(),n),n,void 0,t??{})}return i._$AI(r),i};var Ue=globalThis,f=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=It(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}};f._$litElement$=!0,f.finalized=!0,Ue.litElementHydrateSupport?.({LitElement:f});var gs=Ue.litElementPolyfillSupport;gs?.({LitElement:f});(Ue.litElementVersions??=[]).push("4.2.2");var ms=b`
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
`,Js=b`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,S=b`
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
`,Et=b`
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
`,Ct=b`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,Tt=b`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,H=b`
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
    }`,le=b`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,kt=b`
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
`,At=b`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,Pt=b`
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
`,Lt=b`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,Mt=[ms,b`
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
`];var ce=826,de=r=>`v${Math.floor(r/100)}.${String(r%100).padStart(2,"0")}`,R="https://scoreboard-tailuge.vercel.app",K=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",he=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),Oe=he?`ws://${window.location.hostname}:80`:`wss://${K}`,Nt=he?"./active.html":"https://billiards-network.onrender.com/active.html",T=typeof window<"u"&&window.location.hostname.includes("vercel"),Rt=r=>{let e=Math.floor((Date.now()-r)/1e3);if(e<60)return`${e}s ago`;let t=Math.floor(e/60);if(t<60)return`${t}m ago`;let s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`},Ut={connected:!1,users:[],challenges:{},currentMatch:null};function jt(r,e){let t={...r.challenges},s=i=>i.challengerId===e.myId?i.challengeeId:i.challengerId;switch(e.type){case"CONNECTED":return{...r,connected:e.payload};case"SETTLED":return{...r,settled:e.payload};case"USERS_UPDATE":return{...r,users:e.payload};case"CHALLENGE_SENT":return{...r,challenges:{...t,[e.payload.challengeeId]:{...e.payload,status:"pending"}}};case"CHALLENGE_MSG":{let i=e.payload,n=s(i);if(i.type==="offer"){if(r.currentMatch)return r;let o=t[i.challengerId];if(o&&o.challengerId===e.myId&&o.status==="pending"&&e.myId>i.challengerId)return r;(!t[i.challengerId]||t[i.challengerId].tableId!==i.tableId)&&(t[i.challengerId]={...i,status:"pending"})}else if(i.type==="accept"&&!r.currentMatch){let o=t[n];if(!o||o.tableId!==i.tableId)return r;let l=i.options||o.options,a=i.nextTurnId||o.nextTurnId,h=e.myId===i.challengerId,p=h?i.challengeeId:i.challengerId,d=h?i.custom||{}:o.custom||{},u=h?o.recipientName:o.challengerName;return delete t[n],{...r,challenges:t,currentMatch:{tableId:i.tableId,ruleType:i.ruleType,options:l,isFirst:a===i.challengerId||a===i.challengeeId?a===e.myId:i.challengerId===e.myId,opponentId:p,opponentName:u,opponentCustom:d}}}else i.type==="decline"?t[i.challengeeId]&&(t[i.challengeeId]={...t[i.challengeeId],status:"declined"}):i.type==="cancel"&&delete t[s(i)];return{...r,challenges:t}}case"CHALLENGE_DISMISS":return delete t[e.payload],{...r,challenges:t};default:return r}}function He(r="",e="",t="",s={}){let i={bot:{emoji:"\u{1F916}",title:"bot"},nineball:{emoji:"\u2468",title:"nineball"},eightball:{emoji:"\u{1F3B1}",title:"eightball"},snooker:{emoji:"\u{1F534}",title:"snooker"},threecushion:{emoji:"\u2462",title:"threecushion"},sagu:{emoji:"\u2463",title:"sagu"}},n=i[e],o=["5","6"].includes(String(s?.tableSize)),l=!!s?.freeaim,a=h=>{if(!o&&!l)return h;let p=h.emoji+(o?"\u{1F37C}":"")+(l?"\u2316":""),d=[o&&"mini",l&&"freeaim"].filter(Boolean).join(" ");return{emoji:p,title:d}};if(t==="spectating")return{emoji:"\u{1F52D}",title:"spectator"};if(t==="playing")return a(n??{emoji:"\u{1F3AE}",title:"playing"});if(t==="available"&&e==="replay")return{emoji:"\u{1F440}",title:"replay"};if(n)return r.includes("veli")?a({emoji:"\u{1F393}",title:"study"}):r.includes("github")?a({emoji:n.emoji+"\u{1F419}",title:"github"}):r.includes("localhost")?a({emoji:n.emoji+"\u{1F3E0}",title:"localhost"}):a(n);if(e.includes("-bot")){let h=i[e.replace("-bot","")];if(h)return a({emoji:h.emoji+"\u{1F916}",title:"bot"})}if(e.includes("-exam")){let h=i[e.replace("-exam","")];if(h)return a({emoji:h.emoji+"\u{1F4DC}",title:"exam"})}if(e.includes("-speedrun")){let h=i[e.replace("-speedrun","")];if(h)return a({emoji:h.emoji+"\u{1F45F}",title:"speedrun"})}return r.includes("github")?{emoji:"\u{1F419}",title:"github"}:r.includes("vercel")?{emoji:"\u{1F465}",title:"vercel"}:r.includes("workers")?{emoji:"\u{1F464}",title:"vercel"}:r.includes("localhost")?{emoji:"\u{1F3E0}",title:"localhost"}:i[e]??{emoji:"\u{1F3AE}",title:"external"}}var w=r=>{if(r==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!r)return{emoji:"\u{1F310}",title:""};let e=r.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},De=he?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/",ze=(r,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,r):r,Ot=(r,e,t)=>{for(let[s,i]of Object.entries(r)){let n=e?`${e}.${encodeURIComponent(s)}`:encodeURIComponent(s);i&&typeof i=="object"&&!Array.isArray(i)?Ot(i,n,t):i!=null&&t.push(`${n}=${encodeURIComponent(i)}`)}return t},je=(r,e,t)=>e&&typeof e=="object"?Ot(e,t,[]).reduce((s,i)=>s+`&${i}`,r):r,Ht=(r,e,t,s,i,n)=>{if(r.absolute)return r.url;let o=r.url?`${r.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:`${De}?ruletype=${r.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`;return he&&(o+=`&lobbyUrl=${Oe}`),i&&(o+="&flip=true"),o=je(o,n,"custom"),r.url?o:ze(o,r.options)},Be=({tableId:r,userId:e,userName:t,ruleType:s,isFirst:i,options:n,bot:o,lod:l,flip:a,custom:h,opponent:p})=>{let d=`${De}?websocketserver=${Oe}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}`;return o||(d+=`&tableId=${r}`),i&&(d+="&first=true"),o&&(d+=`&bot=${encodeURIComponent(o)}`),l!==void 0&&(d+=`&lod=${l}`),a&&(d+="&flip=true"),d=ze(d,n),d=je(d,h,"custom"),p?.userId&&(d+=`&opponent.userId=${encodeURIComponent(p.userId)}&opponent.userName=${encodeURIComponent(p.userName||"")}`,d=je(d,p.custom,"opponent.custom")),d},Dt=({tableId:r,userId:e,userName:t,ruleType:s,options:i})=>{let n=`${De}?websocketserver=${Oe}&tableId=${r}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}&spectator=true`;return ze(n,i)},bs={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},U=r=>{let e=bs[r];return e?c`<img src="assets/${e}.png" alt="${r}" title="${r}" width="18" height="18" style="vertical-align:middle">`:c`🎱`},Fe=r=>["\u{1F3C6}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F"][r]??"",pe=r=>r?.freeaim?"\u2295":Object.values(r||{})[0],Ge=(r,e,t)=>`${r}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}`;var zt=r=>{let e=(r||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},Je=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();T&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),n=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,s||(this.userName=window.name.split("-")[0]);else{let l=s||n||"",a=!l||i.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&a?i:zt(l),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=s||this.userName||n||"Anonymous",this.lod=localStorage.getItem("lod")||"2",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",o=>{if(o.key==="custom"){try{this.custom=JSON.parse(o.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():zt(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},m=new Je,I=class extends f{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),m.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),m.removeEventListener("change",this._storeListener)}};var fs=[{label:"Nine Ball",img:"assets/nineball.png",ruletype:"nineball"},{label:"Snooker 6r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"6",tableSize:"12"}},{label:"Snooker 10r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"10",tableSize:"12"}},{label:"3-Cushion 5ft",img:"assets/baby.png",ruletype:"threecushion",options:{raceTo:"15",tableSize:"5"}},{label:"Snooker",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"15",tableSize:"12"}},{label:"3-Cushion (7)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"7"}},{label:"Speedrun",img:"assets/speedrun.png",url:"speedrun/index.html"},{label:"3-Cushion analysis",img:"assets/drill.png",url:"https://velikodimov.github.io/billiards/dist/index.html?ruletype=threecushion&practice&drill",absolute:!0},{label:"Books",img:"assets/book.png",url:"book/index.html"},{label:"3-Cushion (40)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"40"}},{label:"3-Cushion (15)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"15"}},{label:"Sagu (5)",img:"assets/sagu.png",ruletype:"sagu",options:{raceTo:"5"}},{label:"Trickshot",img:"assets/practice.png",url:"https://billiards.tailuge.workers.dev/practice"},{label:"Research",img:"assets/research.png",url:"https://billiards.tailuge.workers.dev/diagrams/three"},{label:"Eight Ball",img:"assets/eightball.png",ruletype:"eightball"},{label:"Exam",img:"assets/cert.png",url:"exam/index.html",absolute:!0}],Ye=class extends I{static styles=[At,le];#e=[...fs].sort(()=>Math.random()-.5);render(){let{clientId:e,userName:t,lod:s,flip:i}=m;return c`<div class="grid">
      ${this.#e.map(n=>c` <a
            href=${Ht(n,e,t,s,i,m.getCustom())}
            title=${n.label}
            aria-label="Play ${n.label}"
          >
            <span class="icon-wrap">
              <img src=${n.img} alt=${n.label} />
              ${n.options?c`<span class="badge">${pe(n.options)}</span>`:""}
            </span>
          </a>`)}
    </div>`}};customElements.define("solo-panel",Ye);var Ve=class extends f{static properties={url:{type:String},color:{type:String},label:{type:String},prefix:{type:String},prefixTitle:{type:String}};static styles=b`
        :host {
            display: inline-block;
            vertical-align: middle;
            margin: 0;
            padding: 0;
            line-height: 0;
        }
        .pill {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
            min-width: 32px;
            height: 16px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
            border: 1px solid var(--btn-replay-border, rgba(255, 255, 255, 0.1));
            background-color: var(--btn-replay-bg, #4a90d9);
            margin: 0;
            padding: 0 4px;
            font-size: 0.7rem;
            color: white;
            font-family: inherit;
            font-weight: 600;
            text-decoration: none;
            white-space: nowrap;
        }
        .pill:hover {
            filter: brightness(1.25);
            transform: scale(1.08);
        }
        .prefix {
            font-size: 1.0rem;
            line-height: 1;
        }
        .prefix:hover {
            text-decoration: underline dotted;
        }
        svg {
            width: 10px;
            height: 10px;
            fill: white;
            flex-shrink: 0;
        }
    `;render(){let e=this.color?`background-color: ${this.color}`:"",t=this.prefix?c`<span class="prefix" title=${this.prefixTitle}>${this.prefix}</span>`:"";return c`
            <a
                class="pill"
                href=${this.url}
                style=${e}>
                ${t}
                ${this.label?c`<span>${this.label}</span>`:""}
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </a>
        `}};customElements.define("replay-button",Ve);var qe=class extends I{static styles=Pt;connectedCallback(){if(super.connectedCallback(),T){this.classList.add("loaded");return}fetch(`${R}/api/summary`,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.classList.add("loaded"),this.requestUpdate()}).catch(()=>{this._err=!0,this.classList.add("loaded"),this.requestUpdate()})}render(){if(T)return c`<span class="loading">We have moved <a href="https://billiards.tailuge.workers.dev/lobby">Play online here</a></span>`;if(this._err)return c`<span class="loading">Could not load scores.</span>`;if(!this._data)return c`<span class="loading">Connecting to server…</span>`;let{hiscores:e,topPlayers:t,recentMatches:s}=this._data,i=Object.keys(e);return c`
            <div class="group hiscores">
                <div class="group-body">
                    ${i.map(n=>c`
                        <div class="tbl${n==="sagu"?" sagu-hi":""}"><table><caption><a href="${R}/leaderboard" target="_blank" rel="noopener" style="font-weight:200;font-size:0.75rem">${U(n)} HiScore</a></caption>
                        <tr><th>Name</th><th></th></tr>
                            ${e[n].slice(0,4).map((o,l)=>c`<tr><td>${Fe(l)} ${o.name}</td><td><replay-button url="${Ge(`${R}/api/rank/${o.id}?ruletype=${n}&lod=${m.lod}`,m.clientId,m.userName)}" label="${o.score}"></replay-button></td></tr>`)}
                        </table></div>
                    `)}
                </div>
            </div>
            <div class="bottom-row">
                <div class="group recent">
                    <div class="group-body">
                        <div class="tbl"><table>
                        <tr><th>Rule</th><th>Match</th><th>Ago</th><th class="city-col">City</th><th></th></tr>
                            ${s.map(n=>c`<tr>
                                <td>${U(n.ruleType)}</td><td>${n.loser?n.freeaim===!0?"\u2316":n.tableSize!=null&&n.tableSize<10?"\u{1F37C}":"\u{1F396}\uFE0F":""}${n.winner}${n.winnerScore!=null?c`<span class="score">(${n.winnerScore})</span>`:""}${n.loser?c` vs ${n.loser}${n.loserScore!=null?c`<span class="score">(${n.loserScore})</span>`:""}`:""}</td>
                                <td class="ago">${Rt(n.timestamp)}</td>
                                <td class="city-col">${n.locationCity??""}</td>
<td class="replay-col">
                                    ${n.hasReplay?c`<replay-button prefix="${w(n.locationCountry).emoji}" prefixTitle="${w(n.locationCountry).title}" url="${Ge(`${R}/api/match-replay?id=${n.id}&lod=${m.lod}`,m.clientId,m.userName)}"></replay-button>`:w(n.locationCountry).emoji}
                                </td>
                            </tr>`)}
                        </table></div>
                    </div>
                </div>
                <div class="group top-players">
                    <div class="group-body">
                        ${i.map(n=>c`
                            <div class="tbl"><table><caption><a href="${R}/elo" target="_blank" rel="noopener">${U(n)} <span style="font-size:0.75rem;font-weight:200">Rankings</span></a></caption>
                             <tr><th>Name</th><th>Score</th><th>W</th><th>L</th></tr>
                                 ${t[n].slice(0,4).map((o,l)=>c`<tr>
                                     <td><a href="${R}/player/${encodeURIComponent(o.name)}?ruleType=${n}">${Fe(l)} ${o.name}</a></td>
                                     <td>${Math.round(o.conservativeRating)}</td>
                                 </tr>`)}
                            </table></div>
                        `)}
                    </div>
                </div>
            </div>`}};customElements.define("info-panel",qe);var D={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:r=>`/publish/table/${r}`,TABLE_SUBSCRIBE:r=>`/subscribe/table/${r}`},ue=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let n=JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let h=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(i,h))return}let o=new AbortController,l=setTimeout(()=>o.abort(),2e4),a;try{a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:s.keepalive,signal:o.signal})}finally{clearTimeout(l)}if(!a.ok)throw new Error(`Publish failed: ${a.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages}async publishPresence(e,t){return this.publish(D.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(D.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(D.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(D.TABLE_PUBLISH(e),{...t,senderId:s},i)}subscribePresence(e,t){let s=`uid=${encodeURIComponent(e)}`;typeof document<"u"&&document.referrer&&(s+=`&ref=${encodeURIComponent(document.referrer)}`);let i=`${D.PRESENCE_SUBSCRIBE}?${s}`;return this.subscribe(i,t)}subscribeTable(e,t,s,i){let n=`${D.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return i?.isSpectator&&(n+="&spectator=1"),this.subscribe(n,s)}subscribe(e,t){let s=this.getWsUrl(e),i=()=>new Date().toISOString().slice(11,23),n=null,o=!1,l=0,a=8e3,h=6e4,p=null,d=!0,u=2e4,g=null,y={stop:()=>{o=!0,p&&(clearTimeout(p),p=null),g&&(clearTimeout(g),g=null),n&&(n.close(),n=null)},ready:null},x;y.ready=new Promise($=>{x=$});let j=()=>{if(!o){if(n&&n.readyState<=WebSocket.OPEN){x();return}n=new globalThis.WebSocket(s),g&&clearTimeout(g),g=setTimeout(()=>{console.warn(`[NchanClient ${i()}] Connection to ${s} timed out after ${u}ms, forcing reconnect`),n?.close()},u),g.unref?.(),n.onmessage=$=>{this.record($.data),t($.data)},n.onopen=()=>{let $=!d;d=!1,l=0,p&&(clearTimeout(p),p=null),g&&(clearTimeout(g),g=null),x(),$&&y.onReconnect&&y.onReconnect()},n.onclose=$=>{if(g&&(clearTimeout(g),g=null),!o){if(l>=10){console.error(`[NchanClient ${i()}] Max reconnect attempts reached for ${s}, giving up`);return}let is=Math.min(Math.pow(2,l)*a,h);l++,p=setTimeout(j,is),p.unref?.()}},n.onerror=$=>{console.error(`[NchanClient ${i()}] WebSocket error on ${s}:`,$),n&&(n.onerror=null,n?.close())}}};return j(),y}};function Bt(r){return r.type==="table:leave"&&!!r.data?.isSpectator}function Ft(r,e){return r.userId!==e&&!r.tableId&&!r.seek}function Gt(r,e){return!!r.tableId&&!r.isSpectator&&r.tableId!==e}function ge(r){return r.tableId?r.isSpectator?"spectating":"playing":"available"}function me(r){let e=new Map;for(let t of r)t.tableId&&(e.has(t.tableId)||e.set(t.tableId,{tableId:t.tableId,players:[],ruleType:t.ruleType}),e.get(t.tableId).players.push({id:t.userId,name:t.userName}));return Array.from(e.values())}function be(r){if(!r||r.trim()==="")return null;try{return JSON.parse(r)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function Jt(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var We=250,Q=class r{static dedupeChallenges(e){let t=new Set;for(let s of e)s.type!=="offer"&&t.add(r.interactionKey(s));return e.filter(s=>s.type!=="offer"?!0:!t.has(r.interactionKey(s)))}static dedupePresence(e){let t=new Map;for(let s of e){let i=t.get(s.userId);if(i&&i.type!=="leave"&&s.type==="leave"&&s.meta?.origin==="internal"){let n=s.meta?.ts,o=i.meta?.ts??i.clientTs;if(n!==void 0&&o!==void 0&&n>=o&&n-o<=We)continue}t.set(s.userId,s)}return[...t.values()]}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var fe=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.joinSentinelTs=null;this.settledListeners=[];this.isSettled=!1;this.unsettledChallengeMessages=[];this.unsettledPresenceMessages=[];this.heartbeatInterval=s.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(!this.isJoined){this.subscription=this.nchan.subscribePresence(this.currentUser.userId,e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready;for(let e=1;;e++)try{let t=Date.now();this.joinSentinelTs=t,await this.nchan.publishPresence({...this.currentUser,clientTs:t});break}catch(t){let s=Math.min(Math.pow(2,e)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${e}), retrying in ${s}ms:`,t),await new Promise(i=>setTimeout(i,s))}this.startHeartbeat(),this.isJoined=!0}}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(s){console.error("Failed to send heartbeat:",s)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}async challenge(e,t,s,i,n){let o=Jt();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:o,options:s,nextTurnId:i,custom:n}),o}async acceptChallenge(e,t,s,i,n,o,l){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:n??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i,nextTurnId:o,custom:l}),await this.updatePresence({tableId:s,ruleType:t,options:i})}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=be(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledPresenceMessages.push(e),e.userId===this.currentUser.userId&&e.type==="join"&&e.clientTs===this.joinSentinelTs&&this.fireSettled();return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&this.notifyListeners()}}handleChallenge(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let s=e.meta?.ts,i=t.meta?.ts??t.clientTs;return s===void 0||i===void 0?!1:s>=i&&s-i<=We}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=Q.dedupePresence(this.unsettledPresenceMessages);for(let i of e)this.applyPresence(i);this.unsettledPresenceMessages=[];let t=Q.dedupeChallenges(this.unsettledChallengeMessages);for(let i of t)this.emitIfRelevant(i);this.unsettledChallengeMessages=[];let s=[...this.settledListeners];this.settledListeners=[];for(let i of s)i()}clearSettleState(){this.joinSentinelTs=null,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.unsettledPresenceMessages=[]}};var ye=class r{constructor(e,t,s,i,n=!1,o,l,a,h){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.isSpectator=n;this.onClosed=a;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=h?.maxSize??1e3,this.initialRetryDelayMs=h?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=h?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(p=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(u=>u()),this.preJoinQueue.splice(0).forEach(u=>this.messageListeners.forEach(g=>g(u))),p()}}),o&&this.messageListeners.push(o),l&&this.bothJoinedListeners.push(l)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((s,i)=>{this.publishQueue.push({type:e,data:t,resolve:s,reject:i}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((s,i)=>{let n=o=>{if(this.isClosed){i(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>s()).catch(l=>{if(this.isClosed){i(l);return}let a=Math.min(Math.pow(2,o+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>n(o+1),a)})};n(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=be(e);if(!t||!t.type)return;let s=t.meta?.msgId;if(typeof s=="string"){if(this.seenMsgIds.has(s))return;if(this.seenMsgIds.set(s,!0),this.seenMsgIds.size>r.MAX_SEEN_MSG_IDS){let i=this.seenMsgIds.keys().next().value;i!==void 0&&this.seenMsgIds.delete(i)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!Bt(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let n=t.data?.id||t.senderId;n&&(this.seenIds.add(n),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&n!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(o=>o())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(i=>i(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var ve=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new ue(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),n,o={...t,onReconnect:()=>{this.resumeSession().catch(a=>console.error("Session resume failed after lobby reconnect:",a)),t?.onReconnect?.()},onLeave:()=>{let a=n??i;if(a){let h=this.activeLobbies.indexOf(a);h!==-1&&this.activeLobbies.splice(h,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let l=new fe(this.nchan,e,o);return n=l,await l.join(),this.lobbyInstances.set(e.userId,l),this.activeLobbies.push(l),l}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,s){let i=s?.isSpectator??!1,n=this.tableKey(e,t,i),o=this.joiningTables.get(n);if(o)return o.promise;this.assertNoTableConflict(e,t,i);let l=this.activeTables.find(u=>u.tableId===e);if(l)return Promise.resolve(l);let a=i?void 0:this.activeLobbies.find(u=>u.currentUser.userId===t),h=new ye(this.nchan,e,t,a,i,s?.onMessage,s?.onBothJoined,()=>this.removeActiveTable(h));this.activeTables.push(h);let p=h.join().catch(u=>{console.error(`Table ${e} join handshake failed:`,u)});a&&p.then(async()=>{if(!h.closed)try{await a.updatePresence({tableId:e})}catch(u){console.error("Failed to update presence after table join:",u)}});let d=Promise.resolve(h).finally(()=>{this.joiningTables.delete(n)});return this.joiningTables.set(n,{tableId:e,userId:t,isSpectator:i,promise:d}),d}tableKey(e,t,s){return`${e}|${t}|${s?"s":"p"}`}assertNoTableConflict(e,t,s){for(let i of this.joiningTables.values())if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already being joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`);for(let i of this.activeTables)if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,s){return this.joinTable(e,t,{...s,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};function Ke(r){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname)){console.log("Skipping usage fetch for localhost.");return}let e=`https://scoreboard-tailuge.vercel.app/api/usage/${r}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}var xe=class{#e=[];#s;#t;constructor(e=3e4,t=()=>Date.now()){this.#s=e,this.#t=t}update(e){let t=new Set(e.map(s=>s.userId));for(let s of this.#e)s.status==="online"&&!t.has(s.userId)&&(s.status="offline",s.offlineSince=this.#t());for(let s of e){let i=this.#e.find(n=>n.status==="online"&&n.userId===s.userId);i?i.user=s:this.#r(s)}return this.getSlots()}getSlots(){return[...this.#e]}reset(){this.#e=[]}#r(e){let t=this.#t(),s=this.#e.find(o=>o.userId===e.userId);if(s){s.status="online",s.offlineSince=null,s.user=e;return}let i=null,n=0;for(let o of this.#e)if(o.status==="offline"){let l=t-o.offlineSince;l>this.#s&&l>n&&(i=o,n=l)}if(i){i.userId=e.userId,i.status="online",i.offlineSince=null,i.user=e;return}this.#e.push({userId:e.userId,status:"online",offlineSince:null,user:e})}};var we={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},$e=r=>(...e)=>({_$litDirective$:r,values:e}),z=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:ys}=_t,Yt=r=>r;var Vt=()=>document.createComment(""),B=(r,e,t)=>{let s=r._$AA.parentNode,i=e===void 0?r._$AB:e._$AA;if(t===void 0){let n=s.insertBefore(Vt(),i),o=s.insertBefore(Vt(),i);t=new ys(n,o,r,r.options)}else{let n=t._$AB.nextSibling,o=t._$AM,l=o!==r;if(l){let a;t._$AQ?.(r),t._$AM=r,t._$AP!==void 0&&(a=r._$AU)!==o._$AU&&t._$AP(a)}if(n!==i||l){let a=t._$AA;for(;a!==n;){let h=Yt(a).nextSibling;Yt(s).insertBefore(a,i),a=h}}}return t},k=(r,e,t=r)=>(r._$AI(e,t),r),vs={},qt=(r,e=vs)=>r._$AH=e,Wt=r=>r._$AH,Se=r=>{r._$AR(),r._$AA.remove()};var Kt=(r,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(r[i],i);return s},Qt=$e(class extends z{constructor(r){if(super(r),r.type!==we.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],n=[],o=0;for(let l of r)i[o]=s?s(l,o):o,n[o]=t(l,o),o++;return{values:n,keys:i}}render(r,e,t){return this.dt(r,e,t).values}update(r,[e,t,s]){let i=Wt(r),{values:n,keys:o}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=o,n;let l=this.ut??=[],a=[],h,p,d=0,u=i.length-1,g=0,y=n.length-1;for(;d<=u&&g<=y;)if(i[d]===null)d++;else if(i[u]===null)u--;else if(l[d]===o[g])a[g]=k(i[d],n[g]),d++,g++;else if(l[u]===o[y])a[y]=k(i[u],n[y]),u--,y--;else if(l[d]===o[y])a[y]=k(i[d],n[y]),B(r,a[y+1],i[d]),d++,y--;else if(l[u]===o[g])a[g]=k(i[u],n[g]),B(r,i[d],i[u]),u--,g++;else if(h===void 0&&(h=Kt(o,g,y),p=Kt(l,d,u)),h.has(l[d]))if(h.has(l[u])){let x=p.get(o[g]),j=x!==void 0?i[x]:null;if(j===null){let $=B(r,i[d]);k($,n[g]),a[g]=$}else a[g]=k(j,n[g]),B(r,i[d],j),i[x]=null;g++}else Se(i[u]),u--;else Se(i[d]),d++;for(;g<=y;){let x=B(r,a[y+1]);k(x,n[g]),a[g++]=x}for(;d<=u;){let x=i[d++];x!==null&&Se(x)}return this.ut=o,qt(r,a),_}});var F=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Qe=class extends f{static properties={slots:{type:Array},users:{type:Array},myId:{type:String},myName:{type:String},tableId:{type:String},isChallengePending:{type:Boolean},challenges:{type:Object},pendingChats:{type:Object}};#e=!1;static styles=[S,Et,b`
        @keyframes throb { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        li { animation: fadeIn 0.2s ease-out; }
        .btn-chat { animation: throb 2s ease-in-out infinite; font-size: 1rem; border: none; background: none; padding: 0 0.2rem; }
        .btn-spectate { background: #7c3aed; color: #fff; border: none; border-radius: 4px; padding: 0.25rem 0.6rem; cursor: pointer; }
        .btn-spectate:hover { background: #6d28d9; }
        .name-wrap { position: relative; display: inline-block; }
        .user-name { overflow: visible; }
        .loc-tip {
            position: absolute;
            left: 50%; top: 0;
            transform: translateX(-50%);
            background: #222; color: #fff;
            padding: 4px 8px; border-radius: 4px;
            font-size: 0.75rem; white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
        }
        .name-wrap:hover .loc-tip { opacity: 1; transition: opacity 0.2s ease 5s; }
    `];async autoExpandIfSupported(){if(this.#e)return;if((this.slots||[]).filter(t=>t.status==="online").length>4){await this.updateComplete;let t=this.renderRoot.querySelector(".expand-toggle");t&&getComputedStyle(t).visibility!=="hidden"&&(this.#e=!0,F(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate())}}updated(){if(!this.#e)return;let e=this.renderRoot.querySelector("ul");if(!e)return;let t=e.scrollHeight;t>0&&e.style.setProperty("--ul-expanded-height",t+"px")}#s(){this.#e=!this.#e,F(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate()}render(){let e=this.slots||[];if(e.filter(i=>i.status==="online").length===0)return c`<div class="empty">No other players online yet. Invite a friend!</div>`;let s=new Set(me(this.users||[]).filter(i=>i.players.length>1).map(i=>i.tableId));return c`
            <ul class="${this.#e?"expanded":""}" aria-label="Online players">
                ${Qt(e,(i,n)=>n,(i,n)=>this._rowSlot(i,n,s))}
            </ul>
            <div class="expand-toggle" @click=${this.#s}>
                ${this.#e?"\u25B2":"\u25BC"}
            </div>`}_rowSlot(e,t,s){if(e.status==="offline"){let i=e.user,n=He(i.meta?.origin??"",i.ruleType??"",ge(i),i.options);return c`
                <li class="is-offline" aria-label="${i.userName}">
                    <div class="user-info">
                        <span class="user-name">
                            <span title="${w(i.meta?.country).title}">${w(i.meta?.country).emoji}</span>
                            <span class="name-wrap">${i.userName}<span class="loc-tip">${i.meta?.city??""}</span></span>
                            <span aria-label="${n.title}" role="img">${n.emoji}</span>
                        </span>
                    </div>
                </li>`}return this._row(e.user,s)}_row(e,t){let s=this.pendingChats?.get(e.userId)>0,n=!(this.challenges?.[e.userId]?.challengerId===e.userId)&&(e.isBot||Ft(e,this.myId)),o=!e.isBot&&ge(e)==="playing"&&Gt(e,this.tableId)&&t.has(e.tableId),l=He(e.meta?.origin??"",e.ruleType??"",ge(e),e.options),a=s?c`<button class="btn-chat" aria-label="Unread message from ${e.userName}" @click=${()=>F(this,"open-chat",e.userId)}>💬</button>`:o?c`<button class="btn-spectate" aria-label="Spectate ${e.userName}'s game" @click=${()=>F(this,"spectate",e)}>Spectate</button>`:n?c`<button class="btn-challenge" aria-label="Challenge ${e.userName}" ?disabled=${this.isChallengePending} @click=${()=>T?window.location.href="https://billiards.tailuge.workers.dev/lobby":F(this,"challenge",e.userId)}>Challenge</button>`:c``;return c`
            <li aria-label="${e.userName}">
                <div class="user-info">
                    <span class="user-name" @click=${()=>F(this,"open-chat",e.userId)} style="cursor: pointer"><span title="${w(e.meta?.country).title}">${w(e.meta?.country).emoji}</span> <span class="name-wrap">${e.userName}<span class="loc-tip">${e.meta?.city??""}</span></span> <span aria-label="${l.title}" role="img">${l.emoji}</span></span>
                </div>
                <div class="actions">${a}</div>
            </li>`}};customElements.define("user-list",Qe);var _e=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Xe=class extends f{static properties={lobby:{type:Object},targetId:{type:String},targetName:{type:String},_messages:{state:!0},_unread:{state:!0}};static styles=[S,H,b`
        .modal { min-width: 280px; max-width: 360px; }
        .thread { display: flex; flex-direction: column; gap: 0.3rem; max-height: 220px; overflow-y: auto; padding: 0.2rem 0; scrollbar-width: none; -ms-overflow-style: none; }
        .thread::-webkit-scrollbar { display: none; }
        .msg { font-size: 0.82rem; padding: 0.25rem 0.5rem; border-radius: 6px; max-width: 85%; word-break: break-word; }
        .msg.mine { align-self: flex-end; background: #0d6efd; color: #fff; }
        .msg.theirs { align-self: flex-start; background: var(--surface); border: 1px solid var(--border); color: var(--text); }
        .compose {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 3px 3px 3px 10px;
        }
        .compose input {
            flex: 1;
            border: none;
            background: transparent;
            color: var(--text);
            font: inherit;
            font-size: 0.82rem;
            outline: none;
            padding: 0.2rem 0;
        }
        .compose button {
            background: #0d6efd;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            min-width: 24px;
            min-height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            cursor: pointer;
            font-size: 0.75rem;
            transition: background-color 0.2s;
        }
        .compose button:hover { background: #0b5ed7; }
        .empty { font-size: 0.78rem; color: var(--text-muted); text-align: center; padding: 0.5rem 0; }
    `];constructor(){super(),this._messages=new Map,this._unread=new Map,this._lobbyBound=!1}willUpdate(e){e.has("lobby")&&this.lobby&&!this._lobbyBound&&(this._lobbyBound=!0,this.lobby.onChat(t=>{let s=t.senderId,i=[...this._messages.get(s)??[],t];if(this._messages=new Map(this._messages).set(s,i),s!==this.targetId){let n=(this._unread.get(s)??0)+1;this._unread=new Map(this._unread).set(s,n),_e(this,"unread-changed",{userId:s,count:n})}this.requestUpdate()})),e.has("targetId")&&this.targetId&&this._unread.has(this.targetId)&&(this._unread=new Map(this._unread).set(this.targetId,0),_e(this,"unread-changed",{userId:this.targetId,count:0}))}_send(e){e.preventDefault();let t=this.shadowRoot.querySelector("input"),s=t.value.trim();if(!s||!this.lobby||!this.targetId)return;this.lobby.sendChat(this.targetId,s);let n={messageType:"chat",senderId:this.lobby.currentUser.userId,recipientId:this.targetId,text:s},o=[...this._messages.get(this.targetId)??[],n];this._messages=new Map(this._messages).set(this.targetId,o),t.value="",this.requestUpdate()}updated(e){if(e.has("targetId")){let t=this.shadowRoot.querySelector(".thread");t&&(t.scrollTop=t.scrollHeight);let s=this.shadowRoot.querySelector("input");s&&s.focus()}else if(e.has("_messages")){let t=e.get("_messages");if(this._messages.get(this.targetId)!==t?.get(this.targetId)){let s=this.shadowRoot.querySelector(".thread");s&&(s.scrollTop=s.scrollHeight)}}}render(){if(!this.targetId)return c``;let e=this.lobby?.currentUser?.userId,t=this._messages.get(this.targetId)??[];return c`
            <div class="backdrop" @click=${s=>s.target===s.currentTarget&&_e(this,"close")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Chat with ${this.targetName}">
                    <h3>💬 ${this.targetName}</h3>
                    <div class="thread">
                        ${t.length===0?c`<div class="empty">No messages yet</div>`:t.map(s=>c`<div class="msg ${s.senderId===e?"mine":"theirs"}">${s.text}</div>`)}
                    </div>
                    <form class="compose" @submit=${this._send}>
                        <input type="text" name="message" placeholder="Message…" autocomplete="off" aria-label="Message text">
                        <button type="submit" aria-label="Send message">➤</button>
                    </form>
                    <button class="cancel" @click=${()=>_e(this,"close")}>Close</button>
                </div>
            </div>`}};customElements.define("message-modal",Xe);var Ie=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),xs={raceTo:"Race to",reds:"Reds",shotClock:"Shot clock",collaboration:"Collaboration",practice:"Practice"},Xt=(r,e)=>r?Object.entries(r).filter(([,t])=>!(typeof t=="boolean"&&t===!1)).map(([t,s])=>{if(t.startsWith("handicap_")){let n=t.slice(9),o=e&&n===e?"Your handicap":"Handicap";return typeof s=="boolean"?o:`${o}: ${s}`}let i=xs[t]??t;return typeof s=="boolean"?i:`${i}: ${s}`}):[],Ze=class extends f{static properties={challenge:{type:Object},sent:{type:Object},myId:{type:String}};static styles=[S,Ct,Tt];render(){return this.challenge?this._incoming(this.challenge):this.sent?this._sent(this.sent):c``}_incoming(e){let t={...e.options};if(Object.keys(t).some(i=>i.startsWith("handicap_"))){let i=localStorage.getItem(`handicap_${e.ruleType}`)||"15";t["handicap_"+this.myId]=i}let s=Xt(t,this.myId);return c`
            <div class="banner">
                <div class="details">${U(e.ruleType)} ${e.ruleType}</div>
                <strong>Challenge from ${e.challengerName}</strong>
                <div class="details">${s.map(i=>c`<span>${i}</span>`)}</div>
                <div class="row">
                    <button class="btn-accept" aria-label="Accept challenge" @click=${()=>Ie(this,"accept")}>Accept</button>
                    <button class="btn-decline" aria-label="Decline challenge" @click=${()=>Ie(this,"decline")}>Decline</button>
                </div>
            </div>`}_sent(e){let t=e.status==="pending",s=Xt(e.options,this.myId);return c`
            <div class="banner ${e.status}">
                <div class="details">${U(e.ruleType)} ${e.ruleType}</div>
                ${s.length>0?c`<div class="details">${s.map(i=>c`<span>${i}</span>`)}</div>`:""}
                <strong>${t?`Waiting for ${e.recipientName} to accept.`:`${e.recipientName} declined.`}</strong>
                <div class="row">
                    ${t?c`<button class="btn-leave" @click=${()=>Ie(this,"cancel")}>Cancel</button>`:c`<button aria-label="Dismiss" @click=${()=>Ie(this,"dismiss")}>✕</button>`}
                </div>
            </div>`}};customElements.define("challenge-banner",Ze);var Ee=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),et=class r extends f{static properties={userId:{type:String},userName:{type:String},_expanded:{state:!0},_handicap:{state:!0}};static styles=[S,H,le];static SECTIONS=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",rules:[{id:"eightball",label:"Eight Ball",img:"assets/eightball.png"},{id:"eightball",label:"Eight Ball 6ft",img:"assets/eightball.png",options:{tableSize:"6"}},{id:"eightball",label:"Eight Ball (Free Aim)",img:"assets/eightball.png",options:{freeaim:"true"}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",rules:[{id:"nineball",label:"Nine Ball",img:"assets/nineball.png"},{id:"nineball",label:"Nine Ball 6ft",img:"assets/nineball.png",options:{tableSize:"6"}},{id:"nineball",label:"Nine Ball (Free Aim)",img:"assets/nineball.png",options:{freeaim:"true"}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",rules:[{id:"snooker",label:"3 reds",img:"assets/baby.png",options:{reds:"3",tableSize:"6"}},{id:"snooker",label:"6 reds",img:"assets/snooker.png",options:{reds:"6",tableSize:"12"}},{id:"snooker",label:"10 reds",img:"assets/snooker.png",options:{reds:"10",tableSize:"12"}},{id:"snooker",label:"15 reds",img:"assets/snooker.png",options:{reds:"15",tableSize:"12"}},{id:"snooker",label:"6 reds (Free Aim)",img:"assets/snooker.png",options:{freeaim:"true",reds:"6",tableSize:"12"}}]},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",rules:[{id:"threecushion",label:"Small Table (15)",img:"assets/baby.png",options:{raceTo:"15",collaboration:!0,shotClock:"60",tableSize:"5"}},{id:"threecushion",label:"Race to 7",img:"assets/threecushion.png",options:{raceTo:"7"}},{id:"threecushion",label:"Race to 25",img:"assets/threecushion.png",options:{raceTo:"25"}},{id:"threecushion",label:"Collaboration (15)",img:"assets/threecushion.png",options:{raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Race to 15 (Free Aim)",img:"assets/threecushion.png",options:{freeaim:"true",raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Traditional (10)",img:"assets/threecushion.png",options:{raceTo:"10",practice:!1,shotClock:"45"}},{id:"threecushion",label:"Handicap",img:"assets/threecushion.png",options:{handicap:!0}}]},{key:"sagu",label:"Sagu",img:"assets/sagu.png",rules:[{id:"sagu",label:"Small Table (5)",img:"assets/baby.png",options:{raceTo:"5",tableSize:"5"}},{id:"sagu",label:"Race to 11",img:"assets/sagu.png",options:{raceTo:"11"}},{id:"sagu",label:"Free Aim (5)",img:"assets/sagu.png",options:{freeaim:"true",raceTo:"5"}},{id:"sagu",label:"Handicap",img:"assets/sagu.png",options:{handicap:!0}}]}];constructor(){super(),this._expanded=null,this._handicap=15}_loadHandicap(e){let t=localStorage.getItem(`handicap_${e}`);if(t!==null){let s=parseInt(t,10);if(!isNaN(s)&&s>=5&&s<=30){this._handicap=s;return}}this._handicap=15}_onHandicapChange(e){let t=parseInt(e.target.value,10);this._handicap=t,this._expanded&&localStorage.setItem(`handicap_${this._expanded}`,String(t))}_toggle(e){let t=this._expanded===e;this._expanded=t?null:e,t||r.SECTIONS.find(i=>i.key===e)?.rules.some(i=>i.options?.handicap===!0)&&this._loadHandicap(e)}render(){return this.userId?c`
            <div class="backdrop" @click=${e=>e.target===e.currentTarget&&Ee(this,"cancel")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Select game type">
                    <h3>Challenge ${this.userName}</h3>
                    <div class="sections">
                        ${r.SECTIONS.map(e=>c`
                            <div class="section">
                                <button
                                    type="button"
                                    class="section-header${this._expanded===e.key?" active":""}"
                                    @click=${()=>this._toggle(e.key)}
                                    aria-label=${e.key}
                                    aria-expanded=${this._expanded===e.key}
                                >
                                    <img src=${e.img} alt=${e.key} />
                                    <span class="section-label">${e.label}</span>
                                </button>
                                <div class="section-body${this._expanded===e.key?" expanded":""}">
                                        ${e.rules.map(t=>c`
                                            <button class="rule btn-challenge" @click=${()=>{let s=t.options?{...t.options}:{};s.handicap===!0&&(s.handicap=String(this._handicap)),Ee(this,"confirm",{ruleType:t.id,options:s})}}>
                                                <span class="icon-wrap">
                                                    <img src=${t.img} alt=${t.label} />
                                                    ${t.options&&t.options.handicap!==!0?c`<span class="badge">${pe(t.options)}</span>`:""}
                                                </span>
                                                ${t.options?.handicap===!0?c`
                                                    <span class="handicap-label">Handicap (${this._handicap})</span>
                                                    <input
                                                        type="range"
                                                        min="5"
                                                        max="30"
                                                        step="1"
                                                        .value=${String(this._handicap)}
                                                        @input=${this._onHandicapChange}
                                                        @click=${s=>s.stopPropagation()}
                                                        class="handicap-inline-slider"
                                                        aria-label="Handicap level"
                                                    />
                                                `:c`${t.label}`}
                                            </button>`)}
                                    </div>
                            </div>`)}
                    </div>
                    <button class="msg-btn" type="button" aria-label="Send message" @click=${()=>Ee(this,"message")}>💬</button>
                    <button class="cancel" @click=${()=>Ee(this,"cancel")}>Cancel</button>
                </div>
            </div>`:c``}};customElements.define("challenge-modal",et);var Zt=[{userId:"bot-clawbreak",userName:"ClawBreak",isBot:!0,meta:{country:"BOT"}},{userId:"bot-thefarjaw",userName:"TheFarJaw",isBot:!0,meta:{country:"BOT"}}],tt=class extends f{static styles=[S,Lt];#e={...Ut,settled:!1};#s=null;#t;#r;#d;#o=null;#a=null;#u=new Map;#g=new xe;#i=null;#h=!1;constructor(){super(),this.#t=m.clientId,this.#r=m.userName;let e=new URLSearchParams(location.search),t=e.get("opponent.userId");if(t){let i={},n=e.get("tableSize")||e.get("tablesize");n&&(i.tableSize=n);let o=e.get("raceTo")||e.get("raceto");o&&(i.raceTo=o);let l=e.get("shotClock")||e.get("shotclock");l&&(i.shotClock=l);let a=e.get("reds");a&&(i.reds=a);let h=e.get("freeaim");h&&(i.freeaim=h),this.#i={opponentId:t,opponentName:e.get("opponent.userName")||t,ruleType:e.get("ruletype")||"nineball",nextTurnId:e.get("nextTurnId"),options:Object.keys(i).length>0?i:void 0};let p=new URL(location.href);p.searchParams.delete("opponent.userId"),p.searchParams.delete("opponent.userName");let d=[];for(let u of p.searchParams.keys())(u.startsWith("opponent.")||u.startsWith("custom."))&&d.push(u);for(let u of d)p.searchParams.delete(u);p.searchParams.delete("ruletype"),p.searchParams.delete("nextTurnId"),p.searchParams.delete("tableSize"),p.searchParams.delete("tablesize"),p.searchParams.delete("raceTo"),p.searchParams.delete("raceto"),p.searchParams.delete("shotClock"),p.searchParams.delete("shotclock"),p.searchParams.delete("reds"),p.searchParams.delete("freeaim"),history.replaceState(null,"",p)}let s=`https://${K}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(s=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`),this.#d=new ve({baseUrl:s}),this.#d.setVersion(de(ce))}connectedCallback(){super.connectedCallback(),this._onUserChanged=e=>{this.#t=e.detail.userId,this.#r=e.detail.userName,this.#s?this.#s.updatePresence({userId:this.#t,userName:this.#r}).catch(t=>console.error("Failed to update presence:",t)):this._connect().catch(t=>console.error("Lobby connect failed:",t))},document.addEventListener("user-name-changed",this._onUserChanged),this._connect().catch(e=>console.error("Lobby connect failed:",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onUserChanged),this.#s?.leave()}dispatch(e){this.#e=jt(this.#e,{...e,myId:this.#t}),e.type==="CHALLENGE_MSG"&&this.#S(e.payload),this.requestUpdate()}#$(){if(!this.#i||!this.#e.connected)return;let e=this.#i.opponentId;!this.#n&&this.#e.users.some(t=>t.userId===e)&&this.#w(e,this.#i.ruleType,this.#i.options,this.#i.nextTurnId)}#S(e){if(this.#i&&(e.challengerId===this.#i.opponentId||e.challengeeId===this.#i.opponentId)&&(e.type==="decline"||e.type==="cancel")&&(this.#i=null),e.type==="offer"&&e.challengeeId===this.#t&&this.#i&&this.#i.opponentId===e.challengerId){let t=this.#i.nextTurnId;this.#i=null;let s=this.#n;s&&s.challengeeId===e.challengerId&&s.status==="pending"?this.#t<e.challengerId&&this.#f(e.challengerId,t).catch(i=>console.error("Simultaneous auto-accept failed:",i)):this.#f(e.challengerId,t).catch(i=>console.error("Auto-join accept failed:",i))}}get state(){return this.#e}get#y(){return this.#e.connected}get#p(){return this.#e.users}get#m(){return this.#e.currentMatch?.tableId}get#_(){return this.#e.currentMatch?.ruleType||"standard"}get#I(){return!!this.#e.currentMatch?.isFirst}get#E(){return this.#e.currentMatch?.options}get#v(){return this.#e.currentMatch?.opponentId}get#C(){return this.#e.currentMatch?.opponentName}get#T(){return this.#e.currentMatch?.opponentCustom}get#b(){return Object.values(this.#e.challenges).find(e=>e.challengeeId===this.#t&&e.status==="pending")}get#n(){return Object.values(this.#e.challenges).find(e=>e.challengerId===this.#t)}get#l(){return[...this.#p,...Zt]}get#c(){let e=m.getCustom();if(e.emoji===void 0||e.emoji===null){let t=this.#p.find(s=>s.userId===this.#t)?.meta?.country;if(t)return{...e,emoji:w(t).emoji}}return e}get#x(){return this.#g.getSlots()}async _connect(){this.#g.reset(),this.#s=await this.#d.joinLobby({messageType:"presence",type:"join",userId:this.#t,userName:this.#r}),this.dispatch({type:"CONNECTED",payload:!0}),this.#h=!1,this.dispatch({type:"SETTLED",payload:!1}),this.#s.onUsersChange(e=>{let t=[...e,...Zt].filter(s=>s.userId!==this.#t);this.#g.update(t),this.dispatch({type:"USERS_UPDATE",payload:e})}),this.#s.onChallenge(e=>{this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#s.settled&&e.type==="offer"&&e.challengeeId===this.#t&&document.hidden&&typeof Notification<"u"&&Notification.permission==="granted"&&new Notification("Challenge received!",{body:`${e.challengerName} challenged you to ${e.ruleType}`,icon:"assets/threecushion.png"})}),this.#s.onSettled(async()=>{this.#h=!0,this.dispatch({type:"SETTLED",payload:!0}),this.#$(),await this.updateComplete,this.renderRoot.querySelector("user-list")?.autoExpandIfSupported()})}async#w(e,t,s,i){this.#i&&this.#i.opponentId===e||(this.#i=null);let o=this.#l.find(a=>a.userId===e);if(o?.isBot){let a="bot-"+Math.random().toString(36).slice(2,8),h=!0;window.location.href=Be({tableId:a,userId:this.#t,userName:this.#r,ruleType:t,isFirst:h,options:s,bot:o.userName,lod:m.lod,flip:m.flip,custom:this.#c});return}let l=this.#s?await this.#s.challenge(e,t,s,i,this.#c):"test-"+Math.random().toString(36).slice(2,7);Ke("createTable"),this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#t,challengeeId:e,recipientName:o?.userName||e,ruleType:t,options:s,tableId:l,nextTurnId:i}})}async#k(){this.#i=null;let e=this.#n;e?.status==="pending"&&(this.#s&&await this.#s.cancelChallenge(e.challengeeId,e.ruleType),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId}))}async#f(e,t){let s=e?this.#e.challenges[e]:this.#b;if(!s)return;let i={...s.options};if(Object.keys(i).some(n=>n.startsWith("handicap_"))){let n=localStorage.getItem(`handicap_${s.ruleType}`)||"15";i["handicap_"+this.#t]=n}this.#s&&await this.#s.acceptChallenge(s.challengerId,s.ruleType,s.tableId,i,s.challengerName,t,this.#c),Ke("joinTable"),this.dispatch({type:"CHALLENGE_MSG",payload:{type:"accept",challengerId:s.challengerId,challengerName:s.challengerName,challengeeId:this.#t,ruleType:s.ruleType,tableId:s.tableId,options:i,nextTurnId:t,custom:this.#c}}),this.#i=null}async#A(){this.#i=null;let e=this.#b;this.#s&&await this.#s.declineChallenge(e.challengerId,e.ruleType,e.challengerName),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId})}#P(){this.#i=null;let e=this.#n;e&&this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId})}#L(){let e=[...this.#l].filter(t=>t.meta?.country!=="BOT").map(t=>{let{meta:s={},...i}=t,{ts:n,since:o,...l}=s;return{...i,meta:l}});console.log("=== USERS ==="),console.log(JSON.stringify(e,null,2)),console.log("=== MY INFO ==="),console.log(JSON.stringify({myId:this.#t,myName:this.#r})),console.log("=== NCHAN RECORDED MESSAGES ==="),console.log(this.#d.recordedMessages),console.log("=== SLOTS ==="),console.table(this.#x.map(t=>({userId:t.userId,status:t.status,offlineSince:t.offlineSince,online:t.status==="online"?"\u2713":"\u2717"})))}_openActiveTables=()=>{let t=me(this.#p||[]).map(s=>s.tableId).map(s=>"active="+encodeURIComponent(s)).join("&");window.open(Nt+(t?"?"+t:""),"_blank","noopener")};render(){if(this.#m){let t=Be({tableId:this.#m,userId:this.#t,userName:this.#r,ruleType:this.#_,isFirst:this.#I,options:this.#E,lod:m.lod,flip:m.flip,custom:this.#c,opponent:this.#v?{userId:this.#v,userName:this.#C,custom:this.#T}:void 0});return this.#i=null,this.#e={...this.#e,currentMatch:null},window.location.href=t,c``}let e=this.#o;return c`
            <div class="panel-header">
                <span class="dot ${this.#y?this.#h?"green":"blue":""}" role="status" aria-label="${this.#y?this.#h?"Settled":"Connecting":"Disconnected"}" @click=${this._openActiveTables} style="cursor:pointer"></span>
                <span class="panel-title" @click=${()=>this.#L()}>Play Online (${this.#l.filter(t=>t.userId!==this.#t).length})</span>
            </div>
            <challenge-banner
                .challenge=${this.#b}
                .sent=${this.#n}
                myId=${this.#t}
                @accept=${()=>this.#f()}
                @decline=${()=>this.#A()}
                @cancel=${()=>this.#k()}
                @dismiss=${()=>this.#P()}>
            </challenge-banner>
            <user-list
                .slots=${this.#x}
                .users=${this.#p}
                myId=${this.#t}
                myName=${this.#r}
                tableId=${this.#m||""}
                .isChallengePending=${this.#n?.status==="pending"}
                .challenges=${this.#e.challenges}
                .pendingChats=${this.#u}
                @challenge=${t=>{let s=this.#l.find(i=>i.userId===t.detail);this.#o={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}
                @spectate=${t=>{let s=t.detail;window.location.href=Dt({tableId:s.tableId,userId:this.#t,userName:this.#r,ruleType:s.ruleType||"nineball",options:s.options})}}
                @open-chat=${t=>{let s=this.#l.find(i=>i.userId===t.detail);this.#a={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}>
            </user-list>
            <challenge-modal
                .userId=${e?.userId??null}
                .userName=${e?.userName??""}
                @confirm=${t=>{let s={...t.detail.options};s.handicap&&(s["handicap_"+this.#t]=s.handicap,delete s.handicap),this.#w(e.userId,t.detail.ruleType,s),this.#o=null}}
                @message=${()=>{this.#a={userId:e.userId,userName:e.userName},this.#o=null,this.requestUpdate()}}
                @cancel=${()=>{this.#o=null,this.requestUpdate()}}>
            </challenge-modal>
            <message-modal
                .lobby=${this.#s}
                .targetId=${this.#a?.userId??null}
                .targetName=${this.#a?.userName??""}
                @close=${()=>{this.#a=null,this.requestUpdate()}}
                @unread-changed=${t=>{this.#u=new Map(this.#u).set(t.detail.userId,t.detail.count),this.requestUpdate()}}>
            </message-modal>`}};customElements.define("online-panel",tt);var ws=[[4352,4447],[11904,42191],[44032,55203],[63744,64255],[65040,65135],[65280,65376],[65504,65510],[127744,129791],[131072,195103]],es=r=>{let e=0;for(let t of r){let s=t.codePointAt(0);e+=ws.some(([i,n])=>s>=i&&s<=n)?2:1}return Math.max(e,1)},st=class extends I{static properties={_dotColor:{state:!0}};static styles=kt;constructor(){super(),this._clientId=m.clientId,this._name=m.userName,this._dotColor=m.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,m.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return T?c``:c`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${es(this._name)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=es(e.target.value)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",st);var $s=`https://${K}/api/stats`,it=class extends f{static styles=b`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch($s,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return c`<span class="loading">Could not load stats.</span>`;if(!this._data)return c`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{});return c`
            ${e?c`<div class="uptime"><a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${s.map(([i,n])=>c`
                    <li>${w(i).emoji} <span>${i}</span> <span class="count">${n}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",it);var rt=class r extends I{static properties={_open:{state:!0},_notifEnabled:{state:!0},_showStats:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[S,H,b`
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
    `];constructor(){super(),this._open=!1,this._showStats=!1,this._copied=!1,this._picker=null,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=typeof Notification<"u"&&Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this),this._onMessage=this._onMessage.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown),window.addEventListener("message",this._onMessage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown),window.removeEventListener("message",this._onMessage)}_onMessage(e){e.data?.type==="done"&&(this._picker=null)}_onKeydown(e){e.key==="Escape"&&(this._picker?this._picker=null:this._open&&this._close())}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1,this._picker=null}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked&&typeof Notification<"u"){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return c`
            <button class="burger" aria-label="Settings" aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
            ${this._open?c`
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
                                <input type="checkbox" .checked=${m.flip} @change=${e=>m.setFlip(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span>Use proxy to connect</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${m.useProxy} @change=${e=>m.setUseProxy(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="section-title">Graphics</div>
                        <div class="row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${r.LOD_LABELS[m.lod]||m.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${m.lod} @input=${e=>m.setLod(e.target.value)}>
                        </div>

                        <div class="section-title">Links</div>
                        <div class="row"><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Support</a></div>
                        <div class="row"><a href="https://scoreboard-tailuge.vercel.app/usage.html" target="_blank" rel="noopener">Usage</a></div>
                        <div class="row">
                            <a href="#" @click=${e=>{e.preventDefault(),this._share()}}>
                                Share
                                ${this._copied?c`<span class="copied-badge">Copied!</span>`:""}
                            </a>
                        </div>
                        <div class="row"><a href="#" @click=${e=>{e.preventDefault(),this._showStats=!this._showStats}}>Stats</a></div>

                        ${this._showStats?c`<div><strong style="font-size:0.82rem">Recent visitors</strong><stats-panel></stats-panel></div>`:""}

                        <div class="section-title">Customise</div>
                        <div class="row">
                            <button class="customise-btn" @click=${()=>this._picker="cue"}>Cue</button>
                            <button class="customise-btn" @click=${()=>this._picker="wall"}>Wall</button>
                        </div>

                        <button class="cancel" @click=${this._close} style="margin-top: 0.4rem;">Close</button>
                    </div>
                </div>
                ${this._picker?c`
                    <div class="picker-backdrop" @click=${e=>e.target===e.currentTarget&&(this._picker=null)}>
                        <div class="picker-frame">
                            ${this._picker==="cue"?c`<iframe src="./cue.html" title="Cue"></iframe>`:c`<iframe src="./wall.html?userName=${encodeURIComponent(m.userName)}" title="Wall"></iframe>`}
                        </div>
                    </div>
                `:""}`:""}
        `}};customElements.define("settings-modal",rt);var X=class extends z{constructor(e){if(super(e),this.it=v,e.type!==we.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===v||e==null)return this._t=void 0,this.it=e;if(e===_)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};X.directiveName="unsafeHTML",X.resultType=1;var ts=$e(X);var Ss=['This game is free to play and open source on <a href="https://github.com/tailuge/billiards" target="_blank">GitHub</a>',"Choose graphics settings in options menu top right.",'Masse trick shot replay: <a href="https://scoreboard-tailuge.vercel.app/api/replay/534?lod=4">here</a>.','<a href="https://scoreboard-tailuge.vercel.app/api/replay/575?lod=4">Aim</a> dont <a href="https://scoreboard-tailuge.vercel.app/api/replay/578?lod=4">think</a>.',"You can change your name by clicking on your user badge at the top right of the screen.","You can flip aim direction in options menu top right.","Invite a friend to play, share link in settings panel.","Draw lines for three cushion and positional play instruction with mouse right-click.",'Do you know <a href="https://www.youtube.com/watch?v=ArNBvY1uEUo" target="_blank">Three Cushion</a> billiards rules? The ultimate game.','Thank you for playing snooker, pool and three cushion at <a href="https://github.com/tailuge/billiards" target="_blank">tailuge/billiards</a>.',"Snooker century when?"],_s=['\uC774 \uAC8C\uC784\uC740 \uBB34\uB8CC\uB85C \uD50C\uB808\uC774\uD560 \uC218 \uC788\uC73C\uBA70 <a href="https://github.com/tailuge/billiards" target="_blank">GitHub</a>\uC5D0\uC11C \uC624\uD508 \uC18C\uC2A4\uB85C \uC81C\uACF5\uB429\uB2C8\uB2E4',"\uC624\uB978\uCABD \uC0C1\uB2E8 \uC635\uC158 \uBA54\uB274\uC5D0\uC11C \uADF8\uB798\uD53D \uC124\uC815\uC744 \uC120\uD0DD\uD558\uC138\uC694.","\uC774 \uD504\uB85C\uC81D\uD2B8\uB294 \uC785\uC18C\uBB38\uC73C\uB85C \uC131\uC7A5\uD569\uB2C8\uB2E4. \uC7AC\uBBF8\uC788\uAC8C \uC990\uAE30\uC168\uB2E4\uBA74 \uB2E4\uB978 \uB2F9\uAD6C \uC120\uC218\uC5D0\uAC8C\uB3C4 \uC54C\uB824\uC8FC\uC138\uC694.","3\uCFE0\uC158 \uB3D9\uD638\uD68C\uB098 \uC628\uB77C\uC778 \uCEE4\uBBA4\uB2C8\uD2F0\uB97C \uC54C\uACE0 \uACC4\uC2E0\uAC00\uC694? \uC774 \uC6F9\uC0AC\uC774\uD2B8\uB97C \uD568\uAED8 \uACF5\uC720\uD574 \uC8FC\uC138\uC694.","\uC0C8\uB85C\uC6B4 \uD50C\uB808\uC774\uC5B4\uAC00 \uB298\uC5B4\uB0A0\uC218\uB85D \uC628\uB77C\uC778\uC5D0\uC11C \uC0C1\uB300\uB97C \uB354 \uC27D\uAC8C \uB9CC\uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB110\uB9AC \uC54C\uB824\uC8FC\uC154\uC11C \uAC10\uC0AC\uD569\uB2C8\uB2E4!","\uBB34\uB8CC \uC628\uB77C\uC778 3\uCFE0\uC158 \uCEE4\uBBA4\uB2C8\uD2F0\uB97C \uD568\uAED8 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694. \uB3D9\uD638\uD68C\uB098 \uCE5C\uAD6C\uB4E4\uC5D0\uAC8C \uC774 \uAC8C\uC784\uC744 \uC18C\uAC1C\uD574 \uBCF4\uC138\uC694.","\uD654\uBA74 \uC6B0\uCE21 \uC0C1\uB2E8\uC758 \uC0AC\uC6A9\uC790 \uC774\uB984\uC744 \uD074\uB9AD\uD558\uC5EC \uBCC0\uACBD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."],Is=new URLSearchParams(window.location.search).get("lang")==="ko"||navigator.language.startsWith("ko"),ss=Is?_s:Ss,nt=class extends f{static styles=b`
        :host {
            display: block;
            text-align: center;
            font-size: 0.75rem;
            color: var(--text-muted);
        }
        a {
            color: var(--link);
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    `;constructor(){super(),this.msg=ss[Math.floor(Math.random()*ss.length)]}render(){return c`${ts(this.msg)}`}};customElements.define("motd-panel",nt);var ot=class extends f{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_sidebarOpen:{type:Boolean}};static styles=Mt;constructor(){super(),console.log("URL:",window.location.href),console.log("Search params:",Object.fromEntries(new URLSearchParams(window.location.search))),this._theme=document.documentElement.getAttribute("theme")||"light",this._sidebarOpen=!1,this.addEventListener("user-list-toggle",e=>{this._sidebarOpen=e.detail.expanded})}get _ctrl(){return this.shadowRoot.querySelector("online-panel")}render(){return c`
            <div class="container">
                <header class="topbar">
                    <img src="assets/threecushion.png" class="logo" alt="Billiards Logo">
                    <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a><span class="version">${de(ce)}</span></h1>
                    <user-badge></user-badge>
                    <settings-modal @theme-changed=${e=>{this._theme=e.detail}}></settings-modal>
                </header>
                <main class="${this._sidebarOpen?"has-sidebar":""}">
                    <div class="solo">
                        <div class="panel">
                            <div class="panel-title">Solo Practice</div>
                            <solo-panel></solo-panel>
                        </div>
                    </div>
                    <online-panel class="panel"></online-panel>
                    <div class="motd-row panel"><motd-panel></motd-panel></div>
                    <div class="info-row"><info-panel></info-panel></div>
                </main>
                <footer style="text-align:center;font-size:0.7rem;opacity:0.7;padding:0.5rem 0">
                    Thanks for playing at <a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" style="color:inherit">tailuge/billiards</a>. Stick around and challenge online for a free game or two.
                </footer>
            </div>
        `}};customElements.define("lobby-app",ot);})();
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
lit-html/directive.js:
lit-html/directives/repeat.js:
lit-html/directives/unsafe-html.js:
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

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
