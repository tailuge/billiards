"use strict";(()=>{var W=globalThis,K=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),Ve=new WeakMap,z=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(K&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Ve.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ve.set(t,e))}return e}toString(){return this.cssText}},Fe=r=>new z(typeof r=="string"?r:r+"",void 0,me),g=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new z(t,r,me)},Je=(r,e)=>{if(K)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=W.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},be=K?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Fe(t)})(r):r;var{is:Ht,defineProperty:jt,getOwnPropertyDescriptor:Bt,getOwnPropertyNames:Dt,getOwnPropertySymbols:zt,getPrototypeOf:Yt}=Object,Q=globalThis,We=Q.trustedTypes,Gt=We?We.emptyScript:"",qt=Q.reactiveElementPolyfillSupport,Y=(r,e)=>r,fe={toAttribute(r,e){switch(e){case Boolean:r=r?Gt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Qe=(r,e)=>!Ht(r,e),Ke={attribute:!0,type:String,converter:fe,reflect:!1,useDefault:!1,hasChanged:Qe};Symbol.metadata??=Symbol("metadata"),Q.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ke){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&jt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=Bt(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let c=i?.call(this);n?.call(this,a),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ke}static _$Ei(){if(this.hasOwnProperty(Y("elementProperties")))return;let e=Yt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Y("properties"))){let t=this.properties,s=[...Dt(t),...zt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(be(i))}else e!==void 0&&t.push(be(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Je(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:fe).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:fe;this._$Em=i;let c=a.fromAttribute(t,n.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let a=this.constructor;if(i===!1&&(n=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??Qe)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:a}=n,c=this[i];a!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,n,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[Y("elementProperties")]=new Map,w[Y("finalized")]=new Map,qt?.({ReactiveElement:w}),(Q.reactiveElementVersions??=[]).push("2.1.2");var ve=globalThis,Xe=r=>r,X=ve.trustedTypes,Ze=X?X.createPolicy("lit-html",{createHTML:r=>r}):void 0,$e="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+S,Vt=`<${xe}>`,A=document,q=()=>A.createComment(""),V=r=>r===null||typeof r!="object"&&typeof r!="function",_e=Array.isArray,nt=r=>_e(r)||typeof r?.[Symbol.iterator]=="function",ye=`[ 	
\f\r]`,G=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,et=/-->/g,tt=/>/g,C=RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),st=/'/g,it=/"/g,at=/^(?:script|style|textarea|title)$/i,we=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),l=we(1),os=we(2),ls=we(3),E=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),rt=new WeakMap,T=A.createTreeWalker(A,129);function ot(r,e){if(!_e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(e):e}var lt=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",a=G;for(let c=0;c<t;c++){let o=r[c],d,m,h=-1,u=0;for(;u<o.length&&(a.lastIndex=u,m=a.exec(o),m!==null);)u=a.lastIndex,a===G?m[1]==="!--"?a=et:m[1]!==void 0?a=tt:m[2]!==void 0?(at.test(m[2])&&(i=RegExp("</"+m[2],"g")),a=C):m[3]!==void 0&&(a=C):a===C?m[0]===">"?(a=i??G,h=-1):m[1]===void 0?h=-2:(h=a.lastIndex-m[2].length,d=m[1],a=m[3]===void 0?C:m[3]==='"'?it:st):a===it||a===st?a=C:a===et||a===tt?a=G:(a=C,i=void 0);let p=a===C&&r[c+1].startsWith("/>")?" ":"";n+=a===G?o+Vt:h>=0?(s.push(d),o.slice(0,h)+$e+o.slice(h)+S+p):o+S+(h===-2?c:p)}return[ot(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},F=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,a=0,c=e.length-1,o=this.parts,[d,m]=lt(e,t);if(this.el=r.createElement(d,s),T.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=T.nextNode())!==null&&o.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith($e)){let u=m[a++],p=i.getAttribute(h).split(S),y=/([.?@])?(.*)/.exec(u);o.push({type:1,index:n,name:y[2],strings:p,ctor:y[1]==="."?ee:y[1]==="?"?te:y[1]==="@"?se:P}),i.removeAttribute(h)}else h.startsWith(S)&&(o.push({type:6,index:n}),i.removeAttribute(h));if(at.test(i.tagName)){let h=i.textContent.split(S),u=h.length-1;if(u>0){i.textContent=X?X.emptyScript:"";for(let p=0;p<u;p++)i.append(h[p],q()),T.nextNode(),o.push({type:2,index:++n});i.append(h[u],q())}}}else if(i.nodeType===8)if(i.data===xe)o.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(S,h+1))!==-1;)o.push({type:7,index:n}),h+=S.length-1}n++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}};function L(r,e,t=r,s){if(e===E)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=V(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=L(r,i._$AS(r,e.values),i,s)),e}var Z=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??A).importNode(t,!0);T.currentNode=i;let n=T.nextNode(),a=0,c=0,o=s[0];for(;o!==void 0;){if(a===o.index){let d;o.type===2?d=new O(n,n.nextSibling,this,e):o.type===1?d=new o.ctor(n,o.name,o.strings,this,e):o.type===6&&(d=new ie(n,this,e)),this._$AV.push(d),o=s[++c]}a!==o?.index&&(n=T.nextNode(),a++)}return T.currentNode=A,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=L(this,e,t),V(e)?e===v||e==null||e===""?(this._$AH!==v&&this._$AR(),this._$AH=v):e!==this._$AH&&e!==E&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):nt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==v&&V(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=F.createElement(ot(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new Z(i,this),a=n.u(this.options);n.p(t),this.T(a),this._$AH=n}}_$AC(e){let t=rt.get(e.strings);return t===void 0&&rt.set(e.strings,t=new F(e)),t}k(e){_e(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(q()),this.O(q()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=Xe(e).nextSibling;Xe(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(e,t=this,s,i){let n=this.strings,a=!1;if(n===void 0)e=L(this,e,t,0),a=!V(e)||e!==this._$AH&&e!==E,a&&(this._$AH=e);else{let c=e,o,d;for(e=n[0],o=0;o<n.length-1;o++)d=L(this,c[s+o],t,o),d===E&&(d=this._$AH[o]),a||=!V(d)||d!==this._$AH[o],d===v?e=v:e!==v&&(e+=(d??"")+n[o+1]),this._$AH[o]=d}a&&!i&&this.j(e)}j(e){e===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ee=class extends P{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===v?void 0:e}},te=class extends P{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==v)}},se=class extends P{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=L(this,e,t,0)??v)===E)return;let s=this._$AH,i=e===v&&s!==v||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ie=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){L(this,e)}},ct={M:$e,P:S,A:xe,C:1,L:lt,R:Z,D:nt,V:L,I:O,H:P,N:te,U:se,B:ee,F:ie},Ft=ve.litHtmlPolyfillSupport;Ft?.(F,O),(ve.litHtmlVersions??=[]).push("3.3.2");var ht=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new O(e.insertBefore(q(),n),n,void 0,t??{})}return i._$AI(r),i};var Se=globalThis,f=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ht(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};f._$litElement$=!0,f.finalized=!0,Se.litElementHydrateSupport?.({LitElement:f});var Jt=Se.litElementPolyfillSupport;Jt?.({LitElement:f});(Se.litElementVersions??=[]).push("4.2.2");var Wt=g`
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
`,_s=g`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,$=g`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
    button { cursor: pointer; padding: 0.15rem 0.4rem; border: 1px solid var(--btn-border); border-radius: 4px; background: var(--btn-bg); color: var(--text); font: inherit; font-size: 0.75rem; transition: background-color 0.2s, opacity 0.2s; min-width: 24px; min-height: 24px; }
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
`,dt=g`
    :host { display: block; }
    ul { list-style: none; margin: 0; padding: 0; max-height: 160px; overflow-y: auto; scrollbar-width: none; }
    ul::-webkit-scrollbar { display: none; }
    li { display: flex; justify-content: space-between; align-items: center; padding: 0.08rem 0; border-bottom: none; gap: 0.25rem; }
    li:last-child { border-bottom: none; }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-weight: 500; font-size: 0.85rem; color: var(--text); }
    .user-status { font-size: 0.7rem; color: var(--text-muted); }
    .actions { display: flex; gap: 0.2rem; flex-shrink: 0; }
    .empty { padding: 1rem; text-align: center; color: var(--text-muted); font-style: italic; font-size: 0.8rem; }
`,pt=g`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,ut=g`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,H=g`
    :host { display: block; }
    .backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: var(--modal-bg); color: var(--text); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; min-width: 220px; display: flex; flex-direction: column; gap: 0.5rem; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
    h3 { margin: 0; font-size: 0.95rem; text-align: center; }
    .rules { display: flex; flex-direction: column; gap: 0.3rem; }
    button.rule { text-align: left; padding: 0.35rem 0.6rem; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; }
    button.rule img { width: 28px; height: 28px; display: block; }
    button.cancel { background: var(--modal-cancel); color: var(--text); border-color: var(--btn-border); }
    .icon-wrap { position: relative; width: 28px; height: 28px; flex-shrink: 0; }
    .icon-wrap img { width: 28px; height: 28px; display: block; }
`,re=g`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; }
`,gt=g`
    :host { display: inline-flex; align-items: center; align-self: center; font-family: 'Exo', sans-serif; font-weight: 200; }
    .badge {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 0px 12px 0px 10px; border-radius: 4px;
        background: var(--surface); border: 1px solid var(--border);
        cursor: pointer; font-size: 1.2rem; color: var(--text); font-weight: 600;
        font-family: inherit;
        transition: filter 0.15s, box-shadow 0.15s;
        box-shadow: 0 0 10px rgba(100, 255, 131, 0.2);
    }
    .badge:hover { filter: brightness(1.3); }
    .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; background: var(--dot-color, #888); }
    input {
        background: transparent; border: none; color: inherit;
        font-size: inherit; font-family: inherit; font-weight: inherit;
        outline: none; padding: 0;
        width: auto;
    }
`,mt=g`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.25rem; }
    button { border: none; background: none; cursor: pointer; padding: 0.2rem; border-radius: 4px; }
    button:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; }
    img { display: block; width: 48px; height: 48px; margin: auto; }
`,bt=g`
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
    @media (max-width: 500px) {
        .city-col { display: none; }
    }
    .loading { color: var(--text-muted); text-align: center; display: block; width: 100%; }
    .group { margin-bottom: 0.2rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.2rem; }
    .group-title { font-size: 0.75rem; font-weight: 600; color: var(--text-dim); padding: 0.1rem 0.25rem; text-align: center; }
    .group-body { display: flex; flex-wrap: wrap; justify-content: space-evenly; }
    .bottom-row { display: flex; align-items: flex-start; gap: 0.25rem; }
    .bottom-row .recent { flex: 65; min-width: 0; height: 504px; overflow-y: auto; scrollbar-width: none; }
    .bottom-row .recent::-webkit-scrollbar { display: none; }
    .bottom-row .top-players { flex: 35; min-width: 0; height: 504px; overflow-y: auto; scrollbar-width: none; }
    .bottom-row .top-players::-webkit-scrollbar { display: none; }
    .bottom-row .recent .tbl, .bottom-row .recent table { width: 100%; }
    .bottom-row .top-players .group-body { flex-direction: column; }
    .bottom-row .top-players .tbl { width: 100%; display: block; box-sizing: border-box; margin: 0.0625rem 0; }
    .bottom-row .top-players .tbl table { width: 100%; }
    .bottom-row .top-players td:last-child { text-align: right; }
    .recent td:nth-child(1) { width: 16px; text-align: center; }
    .recent td:nth-child(2) { max-width: 8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .recent td:nth-child(4) { width: 1%; white-space: nowrap; }
`,ft=g`
    :host { display: flex; flex-direction: column; height: 100%; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.on { background: #198754; }
`,yt=[Wt,g`
    :host { display: flex; flex-direction: column; min-height: 100%; font-family: 'Exo', sans-serif; font-weight: 200; font-size: 0.85rem; box-sizing: border-box; padding: 0.5rem; gap: 0.2rem; background: var(--bg); color: var(--text); overflow-y: auto; scrollbar-width: none; }
    :host::-webkit-scrollbar { display: none; }
    h1 { font-size: 1.0rem; color: var(--text-dim); text-align: left; margin: 0; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0; }
h1 a { color: inherit; text-decoration: none; }
     h1 a:hover { text-decoration: underline; }
     h1 .version { font-size: 0.65rem; color: var(--text-dim); margin-left: 0.25rem; vertical-align: super; font-weight: 200; }
    .topbar { display: flex; align-items: center; flex-shrink: 0; gap: 0.5rem; }
    .topbar .logo { width: 32px; height: 32px; flex-shrink: 0; filter: grayscale(100%); opacity: 0.7; }
    .topbar h1 { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.4rem; overflow: hidden; }
    .panel-title { font-weight: bold; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-dim); text-align: center; }
    .main-row { display: flex; gap: 0.2rem; flex-shrink: 0; margin-bottom: 3px; }
    .main-row .solo { flex: 0 0 auto; }
    .main-row .players { flex: 1; display: flex; flex-direction: column; }
    .info-row { display: flex; flex-direction: column; }
    .info-row .panel { overflow: visible; }
    .container { max-width: 900px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
`];var J=()=>"user-"+Math.random().toString(36).slice(2,7),k="https://scoreboard-tailuge.vercel.app",M=window.location.hostname.includes("vercel"),vt=r=>{let e=Math.floor((Date.now()-r)/1e3);if(e<60)return`${e}s ago`;let t=Math.floor(e/60);if(t<60)return`${t}m ago`;let s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`},$t={connected:!1,users:[],challenges:{},currentMatch:null};function xt(r,e){let t={...r.challenges},s=i=>i.challengerId===e.myId?i.challengeeId:i.challengerId;switch(e.type){case"CONNECTED":return{...r,connected:e.payload};case"USERS_UPDATE":return{...r,users:e.payload};case"CHALLENGE_SENT":return{...r,challenges:{...t,[e.payload.challengeeId]:{...e.payload,status:"pending"}}};case"CHALLENGE_MSG":{let i=e.payload,n=s(i);if(i.type==="offer")(!t[i.challengerId]||t[i.challengerId].tableId!==i.tableId)&&(t[i.challengerId]={...i,status:"pending"});else if(i.type==="accept"&&!r.currentMatch){let a=t[n];if(!a||a.tableId!==i.tableId)return r;let c=i.options||a.options;return delete t[n],{...r,challenges:t,currentMatch:{tableId:i.tableId,ruleType:i.ruleType,options:c,isFirst:i.challengerId===e.myId}}}else i.type==="decline"?t[i.challengeeId]&&(t[i.challengeeId]={...t[i.challengeeId],status:"declined"}):i.type==="cancel"&&delete t[s(i)];return{...r,challenges:t}}case"CHALLENGE_DISMISS":return delete t[e.payload],{...r,challenges:t};case"MATCH_SET":return{...r,currentMatch:e.payload};case"MATCH_LEAVE":return{...r,currentMatch:null};default:return r}}function _t(r="",e="",t=""){let s={bot:{emoji:"\u{1F916}",title:"bot"},nineball:{emoji:"\u2468",title:"nineball"},eightball:{emoji:"\u{1F3B1}",title:"eightball"},snooker:{emoji:"\u{1F534}",title:"snooker"},threecushion:{emoji:"\u2462",title:"threecushion"}},i=s[e];return t==="spectating"?{emoji:"\u{1F52D}",title:"spectator"}:t==="playing"?i??{emoji:"\u{1F3AE}",title:"playing"}:t==="available"&&e==="replay"?{emoji:"\u{1F440}",title:"replay"}:i||(r.includes("github")?{emoji:"\u{1F419}",title:"github"}:r.includes("vercel")?{emoji:"\u{1F465}",title:"vercel"}:r.includes("workers")?{emoji:"\u{1F464}",title:"vercel"}:r.includes("localhost")?{emoji:"\u{1F3E0}",title:"localhost"}:s[e]??{emoji:"\u{1F3AE}",title:"external"})}var N=r=>r==="BOT"?"\u{1F916}":r?[...r.toUpperCase()].map(e=>String.fromCodePoint(127397+e.charCodeAt(0))).join(""):"\u{1F310}",Ee="https://billiards.tailuge.workers.dev/",wt=(r,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,r):r,St=(r,e,t,s)=>r.url?`${r.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:wt(`${Ee}?ruletype=${r.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`,r.options),Ie=({tableId:r,userId:e,userName:t,ruleType:s,isFirst:i,options:n,bot:a,lod:c,rematch:o})=>{let d=`${Ee}?websocketserver=wss://billiards.onrender.com/ws&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}`;return a||(d+=`&tableId=${r}`),i&&(d+="&first=true"),a&&(d+=`&bot=${encodeURIComponent(a)}`),c!==void 0&&(d+=`&lod=${c}`),o&&(d+=`&rematch=${o}`),wt(d,n)},Et=({tableId:r,userId:e,userName:t,ruleType:s})=>`${Ee}?websocketserver=wss://billiards.onrender.com/ws&tableId=${r}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}&spectator=true`,Kt={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball"},U=r=>{let e=Kt[r];return e?l`<img src="assets/${e}.png" alt="${r}" title="${r}" width="18" height="18" style="vertical-align:middle">`:l`🎱`},Ce=r=>["\u{1F3C6}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F"][r]??"",Te=(r,e,t)=>`${r}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}`;var Ae=class extends EventTarget{constructor(){super();let e=(localStorage.getItem("userId")||"").trim();this.clientId=e.length>=2?e:J(),this.clientId!==e&&localStorage.setItem("userId",this.clientId),this.userName=localStorage.getItem("userName")||"Anonymous",this.lod=localStorage.getItem("lod")||"1"}set(e,t){this.clientId=e.trim().length>=2?e.trim():J(),this.userName=t,localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",t),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}},b=new Ae,x=class extends f{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),b.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),b.removeEventListener("change",this._storeListener)}};var Qt=[{label:"Nine Ball",img:"assets/nineball.png",ruletype:"nineball"},{label:"Snooker 6r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"6"}},{label:"Snooker",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"15"}},{label:"3-Cushion (3)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"3"}},{label:"3-Cushion (7)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"7"}},{label:"3-Cushion (15)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"15"}},{label:"Trickshot",img:"assets/practice.png",url:"https://billiards.tailuge.workers.dev/practice"},{label:"Research",img:"assets/research.png",url:"https://billiards.tailuge.workers.dev/diagrams/three"},{label:"Eight Ball",img:"assets/eightball.png",ruletype:"eightball"}],Le=class extends x{static styles=[mt,re];#e=[...Qt].sort(()=>Math.random()-.5);render(){let{clientId:e,userName:t}=b;return l`<div class="grid">${this.#e.map(s=>l`
            <button title=${s.label} aria-label="Play ${s.label}"
                @click=${()=>{window.location.href=St(s,e,t,b.lod)}}>
                <span class="icon-wrap">
                    <img src=${s.img} alt=${s.label} />
                    ${s.options?l`<span class="badge">${Object.values(s.options)[0]}</span>`:""}
                </span>
            </button>`)}
        </div>`}};customElements.define("solo-panel",Le);var Pe=class extends f{static properties={url:{type:String},color:{type:String},label:{type:String},prefix:{type:String}};static styles=g`
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
            font-size: 0.8rem;
            line-height: 1;
        }
        svg {
            width: 10px;
            height: 10px;
            fill: white;
            flex-shrink: 0;
        }
    `;render(){let e=this.color?`background-color: ${this.color}`:"";return l`
            <a
                class="pill"
                href=${this.url}
                style=${e}>
                ${this.prefix?l`<span class="prefix">${this.prefix}</span>`:""}
                ${this.label?l`<span>${this.label}</span>`:""}
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </a>
        `}};customElements.define("replay-button",Pe);var ke=class extends x{static styles=bt;connectedCallback(){super.connectedCallback(),!M&&fetch(`${k}/api/summary`,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.classList.add("loaded"),this.requestUpdate()}).catch(()=>{this._err=!0,this.classList.add("loaded"),this.requestUpdate()})}render(){if(M)return l`<span class="loading"><a href="https://billiards.tailuge.workers.dev/lobby">Play here</a></span>`;if(this._err)return l`<span class="loading">Could not load scores.</span>`;if(!this._data)return l`<span class="loading">Connecting to server…</span>`;let{hiscores:e,topPlayers:t,recentMatches:s}=this._data,i=Object.keys(e);return l`
            <div class="group hiscores">
                <div class="group-body">
                    ${i.map(n=>l`
                        <div class="tbl"><table><caption><a href="${k}/leaderboard" target="_blank" rel="noopener" style="font-weight:200;font-size:0.75rem">${U(n)} HiScore</a></caption>
                        <tr><th>Name</th><th></th></tr>
                            ${e[n].slice(0,4).map((a,c)=>l`<tr><td>${Ce(c)} ${a.name}</td><td><replay-button url="${Te(`${k}/api/rank/${a.id}?ruletype=${n}&lod=${b.lod}`,b.clientId,b.userName)}" label="${a.score}"></replay-button></td></tr>`)}
                        </table></div>
                    `)}
                </div>
            </div>
            <div class="bottom-row">
                <div class="group recent">
                    <div class="group-body">
                        <div class="tbl"><table>
                        <tr><th>Rule</th><th>Match</th><th>Ago</th><th class="city-col">City</th><th></th></tr>
                            ${s.map(n=>l`<tr>
                                <td>${U(n.ruleType)}</td><td>${n.loser?"\u{1F396}\uFE0F":""}${n.winner}${n.loser?` vs ${n.loser}`:""}</td>
                                <td class="ago">${vt(n.timestamp)}</td>
                                <td class="city-col">${n.locationCity??""}</td>
                                <td class="replay-col">
                                    ${n.hasReplay?l`<replay-button prefix="${N(n.locationCountry)}" url="${Te(`${k}/api/match-replay?id=${n.id}&lod=${b.lod}`,b.clientId,b.userName)}"></replay-button>`:N(n.locationCountry)}
                                </td>
                            </tr>`)}
                        </table></div>
                    </div>
                </div>
                <div class="group top-players">
                    <div class="group-body">
                        ${i.map(n=>l`
                            <div class="tbl"><table><caption><a href="${k}/elo" target="_blank" rel="noopener">${U(n)} <span style="font-size:0.75rem;font-weight:200">Rankings</span></a></caption>
                            <tr><th>Name</th><th>Rating</th><th>W</th><th>L</th></tr>
                                ${[...t[n]].sort((a,c)=>c.rating-a.rating).slice(0,4).map((a,c)=>l`<tr>
                                    <td><a href="${k}/player/${encodeURIComponent(a.name)}?ruleType=${n}">${Ce(c)} ${a.name}</a></td>
                                    <td>${Math.round(a.rating)}</td>
                                </tr>`)}
                            </table></div>
                        `)}
                    </div>
                </div>
            </div>`}};customElements.define("info-panel",ke);var It={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ct=r=>(...e)=>({_$litDirective$:r,values:e}),ne=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Xt}=ct,Tt=r=>r;var At=()=>document.createComment(""),j=(r,e,t)=>{let s=r._$AA.parentNode,i=e===void 0?r._$AB:e._$AA;if(t===void 0){let n=s.insertBefore(At(),i),a=s.insertBefore(At(),i);t=new Xt(n,a,r,r.options)}else{let n=t._$AB.nextSibling,a=t._$AM,c=a!==r;if(c){let o;t._$AQ?.(r),t._$AM=r,t._$AP!==void 0&&(o=r._$AU)!==a._$AU&&t._$AP(o)}if(n!==i||c){let o=t._$AA;for(;o!==n;){let d=Tt(o).nextSibling;Tt(s).insertBefore(o,i),o=d}}}return t},I=(r,e,t=r)=>(r._$AI(e,t),r),Zt={},Lt=(r,e=Zt)=>r._$AH=e,Pt=r=>r._$AH,ae=r=>{r._$AR(),r._$AA.remove()};var kt=(r,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(r[i],i);return s},Mt=Ct(class extends ne{constructor(r){if(super(r),r.type!==It.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],n=[],a=0;for(let c of r)i[a]=s?s(c,a):a,n[a]=t(c,a),a++;return{values:n,keys:i}}render(r,e,t){return this.dt(r,e,t).values}update(r,[e,t,s]){let i=Pt(r),{values:n,keys:a}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=a,n;let c=this.ut??=[],o=[],d,m,h=0,u=i.length-1,p=0,y=n.length-1;for(;h<=u&&p<=y;)if(i[h]===null)h++;else if(i[u]===null)u--;else if(c[h]===a[p])o[p]=I(i[h],n[p]),h++,p++;else if(c[u]===a[y])o[y]=I(i[u],n[y]),u--,y--;else if(c[h]===a[y])o[y]=I(i[h],n[y]),j(r,o[y+1],i[h]),h++,y--;else if(c[u]===a[p])o[p]=I(i[u],n[p]),j(r,i[h],i[u]),u--,p++;else if(d===void 0&&(d=kt(a,p,y),m=kt(c,h,u)),d.has(c[h]))if(d.has(c[u])){let _=m.get(a[p]),ge=_!==void 0?i[_]:null;if(ge===null){let qe=j(r,i[h]);I(qe,n[p]),o[p]=qe}else o[p]=I(ge,n[p]),j(r,i[h],ge),i[_]=null;p++}else ae(i[u]),u--;else ae(i[h]),h++;for(;p<=y;){let _=j(r,o[y+1]);I(_,n[p]),o[p++]=_}for(;h<=u;){let _=i[h++];_!==null&&ae(_)}return this.ut=a,Lt(r,o),E}});var B={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:r=>`/publish/table/${r}`,TABLE_SUBSCRIBE:r=>`/subscribe/table/${r}`},oe=class{constructor(e){if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e),n=JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let c=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(i,c))return}let a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:s.keepalive});if(!a.ok)throw new Error(`Publish failed: ${a.status}`)}async publishPresence(e,t){return this.publish(B.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(B.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(B.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(B.TABLE_PUBLISH(e),{...t,senderId:s},i)}subscribePresence(e){return this.subscribe(B.PRESENCE_SUBSCRIBE,e)}subscribeTable(e,t){return this.subscribe(B.TABLE_SUBSCRIBE(e),t)}subscribe(e,t){let s=this.getWsUrl(e),i=null,n=!1,a=0,c=3e4,o=null,d=!0,m={stop:()=>{n=!0,o&&(clearTimeout(o),o=null),i&&(i.close(),i=null)},ready:null},h;m.ready=new Promise(p=>{h=p});let u=()=>{if(!n){if(i&&i.readyState<=WebSocket.OPEN){h();return}i=new globalThis.WebSocket(s),i.onmessage=p=>{t(p.data)},i.onopen=()=>{let p=!d;d=!1,a=0,o&&(clearTimeout(o),o=null),h(),p&&m.onReconnect&&m.onReconnect()},i.onclose=()=>{if(!n){let p=Math.min(Math.pow(2,a)*1e3,c);a++,o=setTimeout(u,p),o.unref?.()}},i.onerror=()=>{i?.close()}}};return u(),m}};function Nt(r,e){return r.userId!==e&&!r.tableId&&!r.seek}function Ut(r,e){return!!r.tableId&&!r.isSpectator&&r.tableId!==e}function Me(r){return r.tableId?r.isSpectator?"spectating":"playing":"available"}function le(r){if(!r||r.trim()==="")return null;try{return JSON.parse(r)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}var D=class{constructor(e,t,s,i){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.subscription=null;this.isJoined=!1;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentLeft=!1;this.opponentSeen=!1;if(this.lobby){let n=a=>this.handleLobbyUsersChange(a);this.lobby.onUsersChange(n),this.lobbyUnsubscribe=()=>{this.lobby?.offUsersChange(n)}}}async join(){this.isJoined||(this.subscription=this.nchan.subscribeTable(this.tableId,e=>{this.handleIncomingMessage(e)}),await this.subscription.ready,this.isJoined=!0)}async publish(e,t){await this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId)}onMessage(e){this.messageListeners.push(e)}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.lobbyUnsubscribe?.(),this.isJoined=!1}handleIncomingMessage(e){let t=le(e);!t||!t.type||(t.type==="table:leave"&&t.senderId!==this.userId&&this.notifyOpponentLeft(),this.messageListeners.forEach(s=>s(t)))}handleLobbyUsersChange(e){let s=e.filter(i=>i.tableId===this.tableId).find(i=>i.userId!==this.userId);s&&(this.opponentSeen=!0),this.opponentSeen&&!s&&this.notifyOpponentLeft()}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};function Rt(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var ce=class{constructor(e){this.pendingOffers=new Map;this.onEmit=e}processMessage(e,t){let s=[e.challengerId,e.challengeeId].sort().join(":");if(e.type==="offer"){if(e.challengeeId===t){this.clearInteraction(s);let i=setTimeout(()=>{this.onEmit(e),this.pendingOffers.delete(s)},250);i&&typeof i=="object"&&"unref"in i&&i.unref(),this.pendingOffers.set(s,i)}}else this.clearInteraction(s),(e.type==="cancel"?e.challengeeId===t:e.challengerId===t)&&this.onEmit(e)}clearInteraction(e){let t=this.pendingOffers.get(e);t&&(clearTimeout(t),this.pendingOffers.delete(e))}clear(){for(let e of this.pendingOffers.values())clearTimeout(e);this.pendingOffers.clear()}};var he=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.heartbeatInterval=s.heartbeatInterval||6e4,this.pruneInterval=s.pruneInterval||3e4,this.staleTtl=s.staleTtl||9e4,this.deduplicator=new ce(i=>{this.pendingChallenges.push(i),this.challengeListeners.forEach(n=>n(i))})}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){this.isJoined||(this.subscription=this.nchan.subscribePresence(e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence(this.currentUser).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready,await this.nchan.publishPresence(this.currentUser),this.startHeartbeat(),this.startPruning(),this.isJoined=!0)}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat(),this.heartbeatTimer=setInterval(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(e){console.error("Failed to send heartbeat:",e)}},this.heartbeatInterval),this.heartbeatTimer.unref?.()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}startPruning(){this.stopPruning(),this.pruneTimer=setInterval(()=>{let e=Date.now(),t=!1;for(let[s,i]of this.users.entries()){if(s===this.currentUser.userId)continue;let n=i.meta.ts;e-n>this.staleTtl&&(this.users.delete(s),t=!0)}t&&this.notifyListeners()},this.pruneInterval),this.pruneTimer.unref?.()}stopPruning(){this.pruneTimer&&(clearInterval(this.pruneTimer),this.pruneTimer=void 0)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e})}async challenge(e,t,s,i){let n=Rt();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:n,rematch:s,options:i}),n}async acceptChallenge(e,t,s,i,n){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:n??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i}),await this.updatePresence({tableId:s});let a=new D(this.nchan,s,this.currentUser.userId,this);return await a.join(),a}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.stopPruning(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave"},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.deduplicator.clear(),this.presenceMessageCount=0,this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=le(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){e.type==="leave"?this.users.delete(e.userId):this.users.set(e.userId,e),this.notifyListeners()}handleChallenge(e){this.deduplicator.processMessage(e,this.currentUser.userId)}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}};var de=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=new oe(e.baseUrl)}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),n,a={...t,onReconnect:()=>{this.resumeSession().catch(o=>console.error("Session resume failed after lobby reconnect:",o)),t?.onReconnect?.()},onLeave:()=>{let o=n??i;if(o){let d=this.activeLobbies.indexOf(o);d!==-1&&this.activeLobbies.splice(d,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let c=new he(this.nchan,e,a);return n=c,await c.join(),this.lobbyInstances.set(e.userId,c),this.activeLobbies.push(c),c}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t){let s=this.activeTables.find(a=>a.tableId===e);if(s)return await s.join(),s;let i=this.activeLobbies.find(a=>a.currentUser.userId===t);if(!i)throw new Error(`Cannot join table: No active lobby found for user ${t}`);let n=new D(this.nchan,e,t,i);return await n.join(),this.activeTables.push(n),await i.updatePresence({tableId:e}),n}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};function Ne(r){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname)){console.log("Skipping usage fetch for localhost.");return}let e=`https://scoreboard-tailuge.vercel.app/api/usage/${r}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}var pe=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Ue=class extends f{static properties={lobby:{type:Object},targetId:{type:String},targetName:{type:String},_messages:{state:!0},_unread:{state:!0}};static styles=[$,H,g`
        .modal { min-width: 280px; max-width: 360px; }
        .thread { display: flex; flex-direction: column; gap: 0.3rem; max-height: 220px; overflow-y: auto; padding: 0.2rem 0; }
        .msg { font-size: 0.82rem; padding: 0.25rem 0.5rem; border-radius: 6px; max-width: 85%; word-break: break-word; }
        .msg.mine { align-self: flex-end; background: #0d6efd; color: #fff; }
        .msg.theirs { align-self: flex-start; background: var(--surface); border: 1px solid var(--border); color: var(--text); }
        .compose { display: flex; gap: 0.3rem; }
        .compose input { flex: 1; padding: 0.25rem 0.4rem; border: 1px solid var(--btn-border); border-radius: 4px; background: var(--surface); color: var(--text); font: inherit; font-size: 0.82rem; }
        .compose input:focus { outline: 2px solid #0d6efd; outline-offset: 1px; }
        .empty { font-size: 0.78rem; color: var(--text-muted); text-align: center; padding: 0.5rem 0; }
    `];constructor(){super(),this._messages=new Map,this._unread=new Map,this._lobbyBound=!1}willUpdate(e){e.has("lobby")&&this.lobby&&!this._lobbyBound&&(this._lobbyBound=!0,this.lobby.onChat(t=>{let s=t.senderId,i=[...this._messages.get(s)??[],t];if(this._messages=new Map(this._messages).set(s,i),s!==this.targetId){let n=(this._unread.get(s)??0)+1;this._unread=new Map(this._unread).set(s,n),pe(this,"unread-changed",{userId:s,count:n})}this.requestUpdate()})),e.has("targetId")&&this.targetId&&this._unread.has(this.targetId)&&(this._unread=new Map(this._unread).set(this.targetId,0),pe(this,"unread-changed",{userId:this.targetId,count:0}))}_send(e){e.preventDefault();let t=this.shadowRoot.querySelector("input"),s=t.value.trim();if(!s||!this.lobby||!this.targetId)return;this.lobby.sendChat(this.targetId,s);let n={messageType:"chat",senderId:this.lobby.currentUser.userId,recipientId:this.targetId,text:s},a=[...this._messages.get(this.targetId)??[],n];this._messages=new Map(this._messages).set(this.targetId,a),t.value="",this.requestUpdate()}updated(e){if(e.has("targetId")){let t=this.shadowRoot.querySelector(".thread");t&&(t.scrollTop=t.scrollHeight)}else if(e.has("_messages")){let t=e.get("_messages");if(this._messages.get(this.targetId)!==t?.get(this.targetId)){let s=this.shadowRoot.querySelector(".thread");s&&(s.scrollTop=s.scrollHeight)}}}render(){if(!this.targetId)return l``;let e=this.lobby?.currentUser?.userId,t=this._messages.get(this.targetId)??[];return l`
            <div class="backdrop" @click=${s=>s.target===s.currentTarget&&pe(this,"close")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Chat with ${this.targetName}">
                    <h3>💬 ${this.targetName}</h3>
                    <div class="thread">
                        ${t.length===0?l`<div class="empty">No messages yet</div>`:t.map(s=>l`<div class="msg ${s.senderId===e?"mine":"theirs"}">${s.text}</div>`)}
                    </div>
                    <form class="compose" @submit=${this._send}>
                        <input type="text" placeholder="Message…" autocomplete="off" aria-label="Message text">
                        <button type="submit" class="btn-challenge">Send</button>
                    </form>
                    <button class="cancel" @click=${()=>pe(this,"close")}>Close</button>
                </div>
            </div>`}};customElements.define("message-modal",Ue);var ue=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Re=class extends f{static properties={challenge:{type:Object},sent:{type:Object}};static styles=[$,pt,ut];render(){return this.challenge?this._incoming(this.challenge):this.sent?this._sent(this.sent):l``}_incoming(e){let t=Object.entries(e.options??{}).filter(([s])=>["raceTo","reds"].includes(s)).map(([s,i])=>`${s}: ${i}`);return l`
            <div class="banner">
                <div class="details">${U(e.ruleType)} ${e.ruleType}</div>
                <strong>Challenge from ${e.challengerName}</strong>
                <div class="details">${t.map(s=>l`<span>${s}</span>`)}</div>
                <div class="row">
                    <button class="btn-accept" aria-label="Accept challenge" @click=${()=>ue(this,"accept")}>Accept</button>
                    <button class="btn-decline" aria-label="Decline challenge" @click=${()=>ue(this,"decline")}>Decline</button>
                </div>
            </div>`}_sent(e){let t=e.status==="pending";return l`
            <div class="banner ${e.status}">
                <div class="details">${U(e.ruleType)} ${e.ruleType}</div>
                <div class="row">
                    <strong>${t?`\u23F3 Waiting for ${e.recipientName}\u2026`:`\u274C ${e.recipientName} declined.`}</strong>
                    ${t?l`<button class="btn-leave" @click=${()=>ue(this,"cancel")}>Cancel</button>`:l`<button aria-label="Dismiss" @click=${()=>ue(this,"dismiss")}>✕</button>`}
                </div>
            </div>`}};customElements.define("challenge-banner",Re);var es=[{userId:"bot-clawbreak",userName:"ClawBreak",isBot:!0,meta:{country:"BOT"}},{userId:"bot-thefarjaw",userName:"TheFarJaw",isBot:!0,meta:{country:"BOT"}}],R=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Oe=class extends f{static properties={users:{type:Array},myId:{type:String},myName:{type:String},tableId:{type:String},isChallengePending:{type:Boolean},pendingChats:{type:Object}};static styles=[$,dt,g`
        @keyframes throb { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        li { animation: fadeIn 0.4s ease-out; }
        .btn-chat { animation: throb 2s ease-in-out infinite; font-size: 1rem; border: none; background: none; padding: 0 0.2rem; }
        .btn-spectate { background: #7c3aed; color: #fff; border: none; border-radius: 4px; padding: 0.25rem 0.6rem; cursor: pointer; }
        .btn-spectate:hover { background: #6d28d9; }
    `];render(){let e=(this.users||[]).filter(t=>t.userId!==this.myId);return e.length===0?l`<div class="empty">No other players online yet. Invite a friend!</div>`:l`<ul aria-label="Online players">${Mt(e,t=>t.userId,t=>this._row(t))}</ul>`}_row(e){let t=this.pendingChats?.get(e.userId)>0,s=e.isBot||Nt(e,this.myId),i=!e.isBot&&Me(e)==="playing"&&Ut(e,this.tableId),n=_t(e.meta?.origin??"",e.ruleType??"",Me(e)),a=t?l`<button class="btn-chat" aria-label="Unread message from ${e.userName}" @click=${()=>R(this,"open-chat",e.userId)}>💬</button>`:i?l`<button class="btn-spectate" aria-label="Spectate ${e.userName}'s game" @click=${()=>R(this,"spectate",e)}>Spectate</button>`:s?l`<button class="btn-challenge" aria-label="Challenge ${e.userName}" ?disabled=${this.isChallengePending} @click=${()=>M?window.location.href="https://billiards.tailuge.workers.dev/lobby":R(this,"challenge",e.userId)}>Challenge</button>`:l``;return l`
            <li aria-label="${e.userName}">
                <div class="user-info">
                    <span class="user-name">${N(e.meta?.country)} ${e.userName} <span aria-label="${n.title}" role="img">${n.emoji}</span></span>
                </div>
                <div class="actions">${a}</div>
            </li>`}},He=class r extends f{static properties={userId:{type:String},userName:{type:String}};static styles=[$,H,re];static RULES=[{id:"eightball",label:"Eight Ball",img:"assets/eightball.png"},{id:"nineball",label:"Nine Ball",img:"assets/nineball.png"},{id:"threecushion",label:"Three Cushion (3)",img:"assets/threecushion.png",options:{raceTo:"3"}},{id:"threecushion",label:"Three Cushion (7)",img:"assets/threecushion.png",options:{raceTo:"7"}},{id:"threecushion",label:"Three Cushion (15)",img:"assets/threecushion.png",options:{raceTo:"15"}},{id:"snooker",label:"Snooker (15 reds)",img:"assets/snooker.png"},{id:"snooker",label:"Snooker (6 reds)",img:"assets/snooker.png",options:{reds:"6"}}];render(){return this.userId?l`
            <div class="backdrop" @click=${e=>e.target===e.currentTarget&&R(this,"cancel")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Select game type">
                    <h3>Challenge ${this.userName}</h3>
                    <div class="rules">
                        ${r.RULES.map(e=>l`
                            <button class="rule btn-challenge" @click=${()=>R(this,"confirm",{ruleType:e.id,options:e.options})}>
                                <span class="icon-wrap">
                                    <img src=${e.img} alt=${e.label} />
                                    ${e.options?l`<span class="badge">${Object.values(e.options)[0]}</span>`:""}
                                </span>
                                ${e.label}
                            </button>`)}
                    </div>
                    <button @click=${()=>R(this,"message")}>💬 Send message</button>
                    <button class="cancel" @click=${()=>R(this,"cancel")}>Cancel</button>
                </div>
            </div>`:l``}},je=class{constructor(e){this.info=e}get opponentId(){return this.info.opponentId}get ruleType(){return this.info.ruleType}get rematchParam(){return encodeURIComponent(JSON.stringify(this.info))}async sendChallenge(e){return e.challenge(this.opponentId,this.ruleType,this.info,this.info.options)}shouldAutoAccept(e){return e.type==="offer"&&e.challengerId===this.opponentId}},Be=class extends f{static styles=[$,ft];#e={...$t};#s=null;#t;#r;#p;#i=null;#a=null;#o=null;#c=new Map;constructor(){super();let e=new URLSearchParams(location.search),t=(e.get("userId")||"").trim();t.length<2&&(t=(localStorage.getItem("userId")||"").trim()),t.length<2&&(t=J()),this.#t=t,this.#r=e.get("userName")||localStorage.getItem("userName")||"Anonymous";let s=e.get("rematch");if(s){this.#i=new je(JSON.parse(decodeURIComponent(s)));let n=new URL(location);n.searchParams.delete("rematch"),history.replaceState(null,"",n)}else this.#i=null;let i="https://billiards-network.onrender.com";(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(i=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`),this.#p=new de({baseUrl:i})}connectedCallback(){super.connectedCallback(),this._onUserChanged=e=>{this.#t=e.detail.userId,this.#r=e.detail.userName,this.#s?this.#s.updatePresence({userId:this.#t,userName:this.#r}).catch(t=>console.error("Failed to update presence:",t)):this._connect().catch(t=>console.error("Lobby connect failed:",t))},document.addEventListener("user-name-changed",this._onUserChanged),this._connect().catch(e=>console.error("Lobby connect failed:",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onUserChanged),this.#s?.leave()}dispatch(e){this.#e=xt(this.#e,{...e,myId:this.#t}),this.requestUpdate()}get state(){return this.#e}get#u(){return this.#e.connected}get#m(){return this.#e.users}get#h(){return this.#e.currentMatch?.tableId}get#b(){return this.#e.currentMatch?.ruleType||"standard"}get#f(){return!!this.#e.currentMatch?.isFirst}get#y(){return this.#e.currentMatch?.options}get#d(){return Object.values(this.#e.challenges).find(e=>e.challengeeId===this.#t&&e.status==="pending")}get#l(){return Object.values(this.#e.challenges).find(e=>e.challengerId===this.#t)}get#n(){return[...this.#m,...es]}async _connect(){if(this.#s=await this.#p.joinLobby({messageType:"presence",type:"join",userId:this.#t,userName:this.#r}),this.dispatch({type:"CONNECTED",payload:!0}),this.#i){let e=await this.#i.sendChallenge(this.#s);this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#t,challengeeId:this.#i.opponentId,recipientName:this.#i.info.opponentName,ruleType:this.#i.ruleType,options:this.#i.info.options,tableId:e}}),this.#i=null}this.#s.onUsersChange(e=>this.dispatch({type:"USERS_UPDATE",payload:e})),this.#s.onChallenge(e=>{if(this.#i?.shouldAutoAccept(e)){this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#g().catch(t=>console.error("Auto-accept failed:",t));return}this.dispatch({type:"CHALLENGE_MSG",payload:e}),e.type==="offer"&&e.challengeeId===this.#t&&document.hidden&&Notification.permission==="granted"&&new Notification("Challenge received!",{body:`${e.challengerName} challenged you to ${e.ruleType}`,icon:"assets/threecushion.png"})})}async#v(e,t,s){let i=this.#n.find(a=>a.userId===e);if(i?.isBot){let a="bot-"+Math.random().toString(36).slice(2,8);window.location.href=Ie({tableId:a,userId:this.#t,userName:this.#r,ruleType:t,isFirst:!0,options:s,bot:i.userName,lod:b.lod,rematch:this.#i?.rematchParam});return}let n=await this.#s.challenge(e,t,void 0,s);Ne("createTable"),this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#t,challengeeId:e,recipientName:i?.userName||e,ruleType:t,options:s,tableId:n}})}async#$(){let e=this.#l;e?.status==="pending"&&(await this.#s.cancelChallenge(e.challengeeId,e.ruleType),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId}))}async#g(){let e=this.#d;await this.#s.acceptChallenge(e.challengerId,e.ruleType,e.tableId,e.options,e.challengerName),Ne("joinTable");let t=this.#i?.rematchParam??(e.rematch?encodeURIComponent(JSON.stringify(e.rematch)):void 0);this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId}),this.dispatch({type:"MATCH_SET",payload:{tableId:e.tableId,ruleType:e.ruleType,options:e.options,isFirst:!1,rematch:t}})}async#x(){let e=this.#d;await this.#s.declineChallenge(e.challengerId,e.ruleType,e.challengerName),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId})}#_(){let e=this.#l;e&&this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId})}render(){if(this.#h){let t=Ie({tableId:this.#h,userId:this.#t,userName:this.#r,ruleType:this.#b,isFirst:this.#f,options:this.#y,lod:b.lod,rematch:this.#e.currentMatch?.rematch});return this.#e={...this.#e,currentMatch:null},window.location.href=t,l``}let e=this.#a;return l`
            <div class="panel-header">
                <span class="dot ${this.#u?"on":""}" role="status" aria-label="${this.#u?"Connected":"Disconnected"}"></span>
                <span class="panel-title" @dblclick=${()=>console.log(JSON.stringify(this.#n,null,2))}>Play Online (${this.#n.filter(t=>t.userId!==this.#t).length})</span>
            </div>
            <challenge-banner
                .challenge=${this.#d}
                .sent=${this.#l}
                @accept=${()=>this.#g()}
                @decline=${()=>this.#x()}
                @cancel=${()=>this.#$()}
                @dismiss=${()=>this.#_()}>
            </challenge-banner>
            <user-list
                .users=${this.#n}
                myId=${this.#t}
                myName=${this.#r}
                tableId=${this.#h||""}
                .isChallengePending=${this.#l?.status==="pending"}
                .pendingChats=${this.#c}
                @challenge=${t=>{let s=this.#n.find(i=>i.userId===t.detail);this.#a={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}
                @spectate=${t=>{let s=t.detail;window.location.href=Et({tableId:s.tableId,userId:this.#t,userName:this.#r,ruleType:s.ruleType||"nineball"})}}
                @open-chat=${t=>{let s=this.#n.find(i=>i.userId===t.detail);this.#o={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}>
            </user-list>
            <challenge-modal
                .userId=${e?.userId??null}
                .userName=${e?.userName??""}
                @confirm=${t=>{this.#v(e.userId,t.detail.ruleType,t.detail.options),this.#a=null}}
                @message=${()=>{this.#o={userId:e.userId,userName:e.userName},this.#a=null,this.requestUpdate()}}
                @cancel=${()=>{this.#a=null,this.requestUpdate()}}>
            </challenge-modal>
            <message-modal
                .lobby=${this.#s}
                .targetId=${this.#o?.userId??null}
                .targetName=${this.#o?.userName??""}
                @close=${()=>{this.#o=null,this.requestUpdate()}}
                @unread-changed=${t=>{this.#c=new Map(this.#c).set(t.detail.userId,t.detail.count),this.requestUpdate()}}>
            </message-modal>`}};customElements.define("user-list",Oe);customElements.define("challenge-modal",He);customElements.define("online-panel",Be);function ts(){let r=new URLSearchParams(location.search),e=(r.get("userId")||"").trim(),t=r.get("userName"),s=e.length>=2?e:b.clientId,i=t||b.userName,n=e.length>=2?"#f5c518":"#4caf50";return{clientId:s,userName:i,dotColor:n}}var De=class extends x{static properties={_dotColor:{state:!0}};static styles=gt;constructor(){super();let{clientId:e,userName:t,dotColor:s}=ts();this._clientId=e,this._dotColor=s,this._name=t}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,b.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return M?l``:l`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input maxlength="12" .value=${this._name}
                    name="display-name" autocomplete="nickname"
                    style="width: ${Math.max(this._name.length,1)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Math.max(e.target.value.length,1)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",De);var ss="https://billiards-network.onrender.com/api/stats",ze=class extends f{static styles=g`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.8rem; color: var(--text-muted, #757575); margin-bottom: 0.5rem; }
        ul { list-style: none; margin: 0; padding: 0; }
        li { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; padding: 0.15rem 0; }
        .count { color: var(--text-muted, #757575); font-size: 0.8rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(ss,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return l`<span class="loading">Could not load stats.</span>`;if(!this._data)return l`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{});return l`
            ${e?l`<div class="uptime">⏱ ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${s.map(([i,n])=>l`
                    <li>${N(i)} <span>${i}</span> <span class="count">${n}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",ze);var Ye=class r extends x{static properties={_open:{state:!0},_notifEnabled:{state:!0},_showStats:{state:!0},_copied:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[$,H,g`
        .burger { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0.1rem 0.3rem; color: var(--text-muted); line-height: 1; min-width: 32px; min-height: 32px; }
        .burger:hover { color: var(--text); background: none; }
        .row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text); }
        .section-title { font-size: 0.75rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase; margin-top: 0.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 2px; }
        label { cursor: pointer; display: flex; align-items: center; gap: 0.3rem; }
        a { color: var(--link); text-decoration: none; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; }
        a:hover { text-decoration: underline; }
        .copied-badge {
            background: #198754; color: white; font-size: 0.65rem; padding: 1px 4px;
            border-radius: 4px; margin-left: 4px; animation: fadein 0.2s;
        }
        @keyframes fadein { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .lod-label { font-weight: bold; color: var(--link); }
    `];constructor(){super(),this._open=!1,this._showStats=!1,this._copied=!1,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown)}_onKeydown(e){this._open&&e.key==="Escape"&&this._close()}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return l`
            <button class="burger" aria-label="Settings" aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
            ${this._open?l`
                <div class="backdrop" @click=${e=>e.target===e.currentTarget&&this._close()}>
                    <div class="modal" role="dialog" aria-modal="true" aria-label="Settings">
                        <h3>Settings</h3>

                        <div class="section-title">Preferences</div>
                        <div class="row">
                            <label>
                                <input type="checkbox" .checked=${this._theme==="dark"} @change=${this._setTheme}>
                                Dark mode
                            </label>
                        </div>
                        <div class="row">
                            <label>
                                <input type="checkbox" .checked=${this._notifEnabled} @change=${this._toggleNotifications}>
                                Enable notifications
                            </label>
                        </div>

                        <div class="section-title">Graphics</div>
                        <div class="row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${r.LOD_LABELS[b.lod]||b.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${b.lod} @input=${e=>b.setLod(e.target.value)} style="width: 100%;">
                        </div>

                        <button class="cancel" @click=${this._close} style="margin-top: 0.5rem;">Close</button>

                        <div class="section-title">Links</div>
                        <div class="row"><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Support</a></div>
                        <div class="row"><a href="https://scoreboard-tailuge.vercel.app/usage.html" target="_blank" rel="noopener">Usage</a></div>
                        <div class="row">
                            <a href="#" @click=${e=>{e.preventDefault(),this._share()}}>
                                Share
                                ${this._copied?l`<span class="copied-badge">Copied!</span>`:""}
                            </a>
                        </div>
                        <div class="row"><a href="#" @click=${e=>{e.preventDefault(),this._showStats=!this._showStats}}>Stats</a></div>

                        ${this._showStats?l`<div><strong style="font-size:0.82rem">Recent visitors</strong><stats-panel></stats-panel></div>`:""}
                    </div>
                </div>`:""}
        `}};customElements.define("settings-modal",Ye);var Ot=127,Ge=class extends f{static properties={_theme:{type:String,reflect:!0,attribute:"theme"}};static styles=yt;constructor(){super(),console.log("URL:",window.location.href),console.log("Search params:",Object.fromEntries(new URLSearchParams(window.location.search))),this._theme=document.documentElement.getAttribute("theme")||"light"}get _ctrl(){return this.shadowRoot.querySelector("online-panel")}render(){return l`
            <div class="container">
                <header class="topbar">
                    <img src="assets/threecushion.png" class="logo" alt="Billiards Logo">
                    <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a><span class="version">v${Math.floor(Ot/100)}.${String(Ot%100).padStart(2,"0")}</span></h1>
                    <user-badge></user-badge>
                    <settings-modal @theme-changed=${e=>{this._theme=e.detail}}></settings-modal>
                </header>
                <main>
                    <div class="main-row">
                        <div class="solo">
                            <div class="panel">
                                <div class="panel-title">Solo Practice</div>
                                <solo-panel></solo-panel>
                            </div>
                        </div>
                        <div class="players panel"><online-panel></online-panel></div>
                    </div>
                    <div class="info-row"><info-panel></info-panel></div>
                </main>
                <footer style="text-align:center;font-size:0.7rem;opacity:0.7;padding:0.5rem 0">
                    Thanks for playing at <a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" style="color:inherit">tailuge/billiards</a>. Stick around and challenge online for a free game or two.
                </footer>
            </div>
        `}};customElements.define("lobby-app",Ge);})();
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
