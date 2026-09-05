"use strict";(()=>{var ee=globalThis,te=ee.ShadowRoot&&(ee.ShadyCSS===void 0||ee.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Te=Symbol(),ut=new WeakMap,Y=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(te&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ut.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ut.set(t,e))}return e}toString(){return this.cssText}},mt=n=>new Y(typeof n=="string"?n:n+"",void 0,Te),b=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Y(t,n,Te)},gt=(n,e)=>{if(te)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=ee.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},ke=te?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return mt(t)})(n):n;var{is:gs,defineProperty:bs,getOwnPropertyDescriptor:fs,getOwnPropertyNames:ys,getOwnPropertySymbols:vs,getPrototypeOf:xs}=Object,se=globalThis,bt=se.trustedTypes,_s=bt?bt.emptyScript:"",ws=se.reactiveElementPolyfillSupport,V=(n,e)=>n,Ae={toAttribute(n,e){switch(e){case Boolean:n=n?_s:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},yt=(n,e)=>!gs(n,e),ft={attribute:!0,type:String,converter:Ae,reflect:!1,useDefault:!1,hasChanged:yt};Symbol.metadata??=Symbol("metadata"),se.litPropertyMetadata??=new WeakMap;var E=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ft){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&bs(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=fs(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let c=i?.call(this);r?.call(this,a),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ft}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;let e=xs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){let t=this.properties,s=[...ys(t),...vs(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(ke(i))}else e!==void 0&&t.push(ke(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:Ae).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Ae;this._$Em=i;let c=a.fromAttribute(t,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let a=this.constructor;if(i===!1&&(r=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??yt)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),r!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:a}=r,c=this[i];a!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[V("elementProperties")]=new Map,E[V("finalized")]=new Map,ws?.({ReactiveElement:E}),(se.reactiveElementVersions??=[]).push("2.1.2");var Le=globalThis,vt=n=>n,ie=Le.trustedTypes,xt=ie?ie.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ne="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Me="?"+C,$s=`<${Me}>`,M=document,W=()=>M.createComment(""),K=n=>n===null||typeof n!="object"&&typeof n!="function",Ue=Array.isArray,Et=n=>Ue(n)||typeof n?.[Symbol.iterator]=="function",Pe=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,wt=/>/g,L=RegExp(`>|${Pe}(?:([^\\s"'>=/]+)(${Pe}*=${Pe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$t=/'/g,It=/"/g,Ct=/^(?:script|style|textarea|title)$/i,Re=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),o=Re(1),Ys=Re(2),Vs=Re(3),T=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),St=new WeakMap,N=M.createTreeWalker(M,129);function Tt(n,e){if(!Ue(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return xt!==void 0?xt.createHTML(e):e}var kt=(n,e)=>{let t=n.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",a=q;for(let c=0;c<t;c++){let l=n[c],h,d,p=-1,u=0;for(;u<l.length&&(a.lastIndex=u,d=a.exec(l),d!==null);)u=a.lastIndex,a===q?d[1]==="!--"?a=_t:d[1]!==void 0?a=wt:d[2]!==void 0?(Ct.test(d[2])&&(i=RegExp("</"+d[2],"g")),a=L):d[3]!==void 0&&(a=L):a===L?d[0]===">"?(a=i??q,p=-1):d[1]===void 0?p=-2:(p=a.lastIndex-d[2].length,h=d[1],a=d[3]===void 0?L:d[3]==='"'?It:$t):a===It||a===$t?a=L:a===_t||a===wt?a=q:(a=L,i=void 0);let g=a===L&&n[c+1].startsWith("/>")?" ":"";r+=a===q?l+$s:p>=0?(s.push(h),l.slice(0,p)+Ne+l.slice(p)+C+g):l+C+(p===-2?c:g)}return[Tt(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Q=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,a=0,c=e.length-1,l=this.parts,[h,d]=kt(e,t);if(this.el=n.createElement(h,s),N.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=N.nextNode())!==null&&l.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Ne)){let u=d[a++],g=i.getAttribute(p).split(C),y=/([.?@])?(.*)/.exec(u);l.push({type:1,index:r,name:y[2],strings:g,ctor:y[1]==="."?re:y[1]==="?"?ae:y[1]==="@"?oe:R}),i.removeAttribute(p)}else p.startsWith(C)&&(l.push({type:6,index:r}),i.removeAttribute(p));if(Ct.test(i.tagName)){let p=i.textContent.split(C),u=p.length-1;if(u>0){i.textContent=ie?ie.emptyScript:"";for(let g=0;g<u;g++)i.append(p[g],W()),N.nextNode(),l.push({type:2,index:++r});i.append(p[u],W())}}}else if(i.nodeType===8)if(i.data===Me)l.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(C,p+1))!==-1;)l.push({type:7,index:r}),p+=C.length-1}r++}}static createElement(e,t){let s=M.createElement("template");return s.innerHTML=e,s}};function U(n,e,t=n,s){if(e===T)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=K(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=U(n,i._$AS(n,e.values),i,s)),e}var ne=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);N.currentNode=i;let r=N.nextNode(),a=0,c=0,l=s[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new D(r,r.nextSibling,this,e):l.type===1?h=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(h=new le(r,this,e)),this._$AV.push(h),l=s[++c]}a!==l?.index&&(r=N.nextNode(),a++)}return N.currentNode=M,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},D=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),K(e)?e===x||e==null||e===""?(this._$AH!==x&&this._$AR(),this._$AH=x):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Et(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==x&&K(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Q.createElement(Tt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new ne(i,this),a=r.u(this.options);r.p(t),this.T(a),this._$AH=r}}_$AC(e){let t=St.get(e.strings);return t===void 0&&St.set(e.strings,t=new Q(e)),t}k(e){Ue(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new n(this.O(W()),this.O(W()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=vt(e).nextSibling;vt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=x,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(e,t=this,s,i){let r=this.strings,a=!1;if(r===void 0)e=U(this,e,t,0),a=!K(e)||e!==this._$AH&&e!==T,a&&(this._$AH=e);else{let c=e,l,h;for(e=r[0],l=0;l<r.length-1;l++)h=U(this,c[s+l],t,l),h===T&&(h=this._$AH[l]),a||=!K(h)||h!==this._$AH[l],h===x?e=x:e!==x&&(e+=(h??"")+r[l+1]),this._$AH[l]=h}a&&!i&&this.j(e)}j(e){e===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},re=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===x?void 0:e}},ae=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==x)}},oe=class extends R{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=U(this,e,t,0)??x)===T)return;let s=this._$AH,i=e===x&&s!==x||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==x&&(s===x||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},le=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}},At={M:Ne,P:C,A:Me,C:1,L:kt,R:ne,D:Et,V:U,I:D,H:R,N:ae,U:oe,B:re,F:le},Is=Le.litHtmlPolyfillSupport;Is?.(Q,D),(Le.litHtmlVersions??=[]).push("3.3.2");var Pt=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new D(e.insertBefore(W(),r),r,void 0,t??{})}return i._$AI(n),i};var je=globalThis,f=class extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Pt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};f._$litElement$=!0,f.finalized=!0,je.litElementHydrateSupport?.({LitElement:f});var Ss=je.litElementPolyfillSupport;Ss?.({LitElement:f});(je.litElementVersions??=[]).push("4.2.2");var k=b`
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
`,oi=b`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,v=b`
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
`,Lt=b`
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
`,Nt=b`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,Mt=b`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,B=b`
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
    }`,ce=b`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,Ut=b`
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
`,Rt=b`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,jt=b`
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
`,Ot=b`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,zt=[k,b`
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
`];var he=965,pe=n=>`v${Math.floor(n/100)}.${String(n%100).padStart(2,"0")}`,j="https://scoreboard-tailuge.vercel.app",O=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",ue=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),X=ue?`ws://${window.location.hostname}:80`:`wss://${O}`,Ht=ue?"./active.html":"https://billiards-network.onrender.com/active.html",A=typeof window<"u"&&window.location.hostname.includes("vercel"),Dt=n=>{let e=Math.floor((Date.now()-n)/1e3);if(e<60)return`${e}s ago`;let t=Math.floor(e/60);if(t<60)return`${t}m ago`;let s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`},Bt={connected:!1,users:[],challenges:{},currentMatch:null};function Ft(n,e){let t={...n.challenges},s=i=>i.challengerId===e.myId?i.challengeeId:i.challengerId;switch(e.type){case"CONNECTED":return{...n,connected:e.payload};case"SETTLED":return{...n,settled:e.payload};case"USERS_UPDATE":return{...n,users:e.payload};case"CHALLENGE_SENT":return{...n,challenges:{...t,[e.payload.challengeeId]:{...e.payload,status:"pending"}}};case"CHALLENGE_MSG":{let i=e.payload,r=s(i);if(i.type==="offer"){if(n.currentMatch)return n;let a=t[i.challengerId];if(a&&a.challengerId===e.myId&&a.status==="pending"&&e.myId>i.challengerId)return n;(!t[i.challengerId]||t[i.challengerId].tableId!==i.tableId)&&(t[i.challengerId]={...i,status:"pending"})}else if(i.type==="accept"&&!n.currentMatch){let a=t[r];if(!a||a.tableId!==i.tableId)return n;let c=i.options||a.options,l=i.nextTurnId||a.nextTurnId,h=e.myId===i.challengerId,d=h?i.challengeeId:i.challengerId,p=h?i.custom||{}:a.custom||{},u=h?a.recipientName:a.challengerName;return delete t[r],{...n,challenges:t,currentMatch:{tableId:i.tableId,ruleType:i.ruleType,options:c,isFirst:l===i.challengerId||l===i.challengeeId?l===e.myId:i.challengerId===e.myId,opponentId:d,opponentName:u,opponentCustom:p}}}else i.type==="decline"?t[i.challengeeId]&&(t[i.challengeeId]={...t[i.challengeeId],status:"declined"}):i.type==="cancel"&&delete t[s(i)];return{...n,challenges:t}}case"CHALLENGE_DISMISS":return delete t[e.payload],{...n,challenges:t};default:return n}}function ze(n="",e="",t="",s={},i=void 0){let r={bot:{emoji:"\u{1F916}",title:"bot"},nineball:{emoji:"\u2468",title:"nineball"},eightball:{emoji:"\u{1F3B1}",title:"eightball"},snooker:{emoji:"\u{1F534}",title:"snooker"},threecushion:{emoji:"\u2462",title:"threecushion"},sagu:{emoji:"\u2463",title:"sagu"}},a=r[e],c=["5","6"].includes(String(s?.tableSize)),l=!!s?.freeaim,h=d=>{if(!c&&!l)return d;let p=d.emoji+(c?"\u{1F37C}":"")+(l?"\u2316":""),u=[c&&"mini",l&&"freeaim"].filter(Boolean).join(" ");return{emoji:p,title:u}};if(i)return{emoji:"\u2694\uFE0F",title:"arena"};if(t==="spectating")return{emoji:"\u{1F52D}",title:"spectator"};if(t==="playing")return h(a??{emoji:"\u{1F3AE}",title:"playing"});if(t==="available"&&e==="replay")return{emoji:"\u{1F440}",title:"replay"};if(a)return n.includes("veli")?h({emoji:"\u{1F393}",title:"study"}):n.includes("github")?h({emoji:a.emoji+"\u{1F419}",title:"github"}):n.includes("localhost")?h({emoji:a.emoji+"\u{1F3E0}",title:"localhost"}):h(a);if(e.includes("-bot")){let d=r[e.replace("-bot","")];if(d)return h({emoji:d.emoji+"\u{1F916}",title:"bot"})}if(e.includes("-exam")){let d=r[e.replace("-exam","")];if(d)return h({emoji:d.emoji+"\u{1F4DC}",title:"exam"})}if(e.includes("-speedrun")){let d=r[e.replace("-speedrun","")];if(d)return h({emoji:d.emoji+"\u{1F45F}",title:"speedrun"})}return n.startsWith("/")||n.includes("workers")?{emoji:"\u{1F464}",title:"vercel"}:n.includes("github")?{emoji:"\u{1F419}",title:"github"}:n.includes("vercel")?{emoji:"\u{1F465}",title:"vercel"}:n.includes("localhost")?{emoji:"\u{1F3E0}",title:"localhost"}:r[e]??{emoji:"\u{1F3AE}",title:"external"}}var w=n=>{if(n==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!n)return{emoji:"\u{1F310}",title:""};let e=n.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},He=ue?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/",de=(n,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,n):n,Jt=(n,e,t)=>{for(let[s,i]of Object.entries(n)){let r=e?`${e}.${encodeURIComponent(s)}`:encodeURIComponent(s);i&&typeof i=="object"&&!Array.isArray(i)?Jt(i,r,t):i!=null&&t.push(`${r}=${encodeURIComponent(i)}`)}return t},Oe=(n,e,t)=>e&&typeof e=="object"?Jt(e,t,[]).reduce((s,i)=>s+`&${i}`,n):n,Gt=(n,e,t,s,i,r)=>{if(n.absolute)return n.url;let a=n.url?`${n.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:`${He}?ruletype=${n.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`;return ue&&(a+=`&lobbyUrl=${X}`),i&&(a+="&flip=true"),a=Oe(a,r,"custom"),n.url?a:de(a,n.options)},z=({tableId:n,userId:e,userName:t,ruleType:s,isFirst:i,options:r,localOptions:a,bot:c,lod:l,flip:h,custom:d,opponent:p})=>{let u=`${He}?websocketserver=${X}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}`;return c||(u+=`&tableId=${n}`),i&&(u+="&first=true"),c&&(u+=`&bot=${encodeURIComponent(c)}`),l!==void 0&&(u+=`&lod=${l}`),h&&(u+="&flip=true"),u=de(u,r),u=de(u,a),u=Oe(u,d,"custom"),p?.userId&&(u+=`&opponent.userId=${encodeURIComponent(p.userId)}&opponent.userName=${encodeURIComponent(p.userName||"")}`,u=Oe(u,p.custom,"opponent.custom")),u},Yt=({tableId:n,userId:e,userName:t,ruleType:s,options:i})=>{let r=`${He}?websocketserver=${X}&tableId=${n}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}&spectator=true`;return de(r,i)},Es={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},I=n=>{let e=Es[n];return e?o`<img src="assets/${e}.png" alt="${n}" title="${n}" width="18" height="18" style="vertical-align:middle">`:o`🎱`},Vt=(n,e={})=>o`<span title="${n}">
    ${I(n)}${e?.freeaim?"\u2316":""}${Number(e?.tableSize)<10?"\u{1F37C}":""}
</span>`,De=n=>["\u{1F3C6}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F"][n]??"",me=n=>n?.freeaim?"\u2295":Object.values(n||{})[0],Be=(n,e,t)=>`${n}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}`;var qt=n=>{let e=(n||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},Fe=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();A&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),r=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,s||(this.userName=window.name.split("-")[0]);else{let c=s||r||"",l=!c||i.split("-")[0].slice(0,4)===c.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&l?i:qt(c),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=s||this.userName||r||"Anonymous",this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",a=>{if(a.key==="custom"){try{this.custom=JSON.parse(a.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():qt(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},m=new Fe,S=class extends f{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),m.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),m.removeEventListener("change",this._storeListener)}};var Cs=[{label:"Nine Ball",img:"assets/nineball.png",ruletype:"nineball"},{label:"Snooker 6r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"6",tableSize:"12"}},{label:"Snooker 10r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"10",tableSize:"12"}},{label:"3-Cushion 5ft",img:"assets/baby.png",ruletype:"threecushion",options:{raceTo:"15",tableSize:"5"}},{label:"Snooker",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"15",tableSize:"12"}},{label:"3-Cushion (7)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"7"}},{label:"Speedrun",img:"assets/speedrun.png",url:"speedrun/index.html"},{label:"3-Cushion analysis",img:"assets/drill.png",url:"https://velikodimov.github.io/billiards/dist/index.html?ruletype=threecushion&practice&drill",absolute:!0},{label:"Books",img:"assets/book.png",url:"book/index.html"},{label:"3-Cushion (40)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"40"}},{label:"3-Cushion (15)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"15"}},{label:"Sagu (5)",img:"assets/sagu.png",ruletype:"sagu",options:{raceTo:"5"}},{label:"Trickshot",img:"assets/practice.png",url:"https://billiards.tailuge.workers.dev/practice"},{label:"Research",img:"assets/research.png",url:"https://billiards.tailuge.workers.dev/diagrams/three"},{label:"Eight Ball",img:"assets/eightball.png",ruletype:"eightball"},{label:"Exam",img:"assets/cert.png",url:"exam/index.html",absolute:!0}],Je=class extends S{static styles=[Rt,ce];#e=[...Cs].sort(()=>Math.random()-.5);render(){let{clientId:e,userName:t,lod:s,flip:i}=m;return o`<div class="grid">
      ${this.#e.map(r=>o` <a
            href=${Gt(r,e,t,s,i,m.getCustom())}
            title=${r.label}
            aria-label="Play ${r.label}"
          >
            <span class="icon-wrap">
              <img src=${r.img} alt=${r.label} />
              ${r.options?o`<span class="badge">${me(r.options)}</span>`:""}
            </span>
          </a>`)}
    </div>`}};customElements.define("solo-panel",Je);var Ge=class extends f{static properties={url:{type:String},color:{type:String},label:{type:String},prefix:{type:String},prefixTitle:{type:String}};static styles=b`
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
    `;render(){let e=this.color?`background-color: ${this.color}`:"",t=this.prefix?o`<span class="prefix" title=${this.prefixTitle}>${this.prefix}</span>`:"";return o`
            <a
                class="pill"
                href=${this.url}
                style=${e}>
                ${t}
                ${this.label?o`<span>${this.label}</span>`:""}
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </a>
        `}};customElements.define("replay-button",Ge);var Ye=class extends S{static styles=jt;connectedCallback(){if(super.connectedCallback(),A){this.classList.add("loaded");return}fetch(`${j}/api/summary`,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.classList.add("loaded"),this.requestUpdate()}).catch(()=>{this._err=!0,this.classList.add("loaded"),this.requestUpdate()})}render(){if(A)return o`<span class="loading">We have moved <a href="https://billiards.tailuge.workers.dev/lobby">Play online here</a></span>`;if(this._err)return o`<span class="loading">Could not load scores.</span>`;if(!this._data)return o`<span class="loading">Connecting to server…</span>`;let{hiscores:e,topPlayers:t,recentMatches:s}=this._data,i=Object.keys(e);return o`
            <div class="group hiscores">
                <div class="group-body">
                    ${i.map(r=>o`
                        <div class="tbl${r==="sagu"?" sagu-hi":""}"><table><caption><a href="${j}/leaderboard" target="_blank" rel="noopener" style="font-weight:200;font-size:0.75rem">${I(r)} HiScore</a></caption>
                        <tr><th>Name</th><th></th></tr>
                            ${e[r].slice(0,4).map((a,c)=>o`<tr><td>${De(c)} ${a.name}</td><td><replay-button url="${Be(`${j}/api/rank/${a.id}?ruletype=${r}&lod=${m.lod}`,m.clientId,m.userName)}" label="${a.score}"></replay-button></td></tr>`)}
                        </table></div>
                    `)}
                </div>
            </div>
            <div class="bottom-row">
                <div class="group recent">
                    <div class="group-body">
                        <div class="tbl"><table>
                        <tr><th>Rule</th><th>Match</th><th>Ago</th><th class="city-col">City</th><th></th></tr>
                            ${s.map(r=>o`<tr>
                                <td>${I(r.ruleType)}</td><td>${r.arenaId?"\u2694\uFE0F":""}${r.loser?r.tableSize!=null&&r.tableSize<10?"\u{1F37C}":"\u{1F396}\uFE0F":""}${r.freeaim===!0?"\u2316":""}${r.beserk===!0||r.beserk==="true"?"\u{1F680}":""}${r.winner}${r.winnerScore!=null?o`<span class="score">(${r.winnerScore})</span>`:""}${r.loser?o` vs ${r.loser}${r.loserScore!=null?o`<span class="score">(${r.loserScore})</span>`:""}`:""}</td>
                                <td class="ago">${Dt(r.timestamp)}</td>
                                <td class="city-col">${r.locationCity??""}</td>
<td class="replay-col">
                                    ${r.hasReplay?o`<replay-button prefix="${w(r.locationCountry).emoji}" prefixTitle="${w(r.locationCountry).title}" url="${Be(`${j}/api/match-replay?id=${r.id}&lod=${m.lod}`,m.clientId,m.userName)}"></replay-button>`:w(r.locationCountry).emoji}
                                </td>
                            </tr>`)}
                        </table></div>
                    </div>
                </div>
                <div class="group top-players">
                    <div class="group-body">
                        ${i.map(r=>o`
                            <div class="tbl"><table><caption><a href="${j}/elo" target="_blank" rel="noopener">${I(r)} <span style="font-size:0.75rem;font-weight:200">Rankings</span></a></caption>
                             <tr><th>Name</th><th>Score</th><th>W</th><th>L</th></tr>
                                 ${t[r].slice(0,4).map((a,c)=>o`<tr>
                                     <td><a href="${j}/player/${encodeURIComponent(a.name)}?ruleType=${r}">${De(c)} ${a.name}</a></td>
                                     <td>${Math.round(a.conservativeRating)}</td>
                                 </tr>`)}
                            </table></div>
                        `)}
                    </div>
                </div>
            </div>`}};customElements.define("info-panel",Ye);var F={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:n=>`/publish/table/${n}`,TABLE_SUBSCRIBE:n=>`/subscribe/table/${n}`},ge=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let r=JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let h=new Blob([r],{type:"application/json"});if(navigator.sendBeacon(i,h))return}let a=new AbortController,c=setTimeout(()=>a.abort(),2e4),l;try{l=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:r,keepalive:s.keepalive,signal:a.signal})}finally{clearTimeout(c)}if(!l.ok)throw new Error(`Publish failed: ${l.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages}async publishPresence(e,t){return this.publish(F.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(F.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(F.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(F.TABLE_PUBLISH(e),{...t,senderId:s},i)}subscribePresence(e,t){let s=`uid=${encodeURIComponent(e)}`;typeof document<"u"&&document.referrer&&(s+=`&ref=${encodeURIComponent(document.referrer)}`);let i=`${F.PRESENCE_SUBSCRIBE}?${s}`;return this.subscribe(i,t)}subscribeTable(e,t,s,i){let r=`${F.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return i?.isSpectator&&(r+="&spectator=1"),this.subscribe(r,s)}subscribe(e,t){let s=this.getWsUrl(e),i=()=>new Date().toISOString().slice(11,23),r=null,a=!1,c=0,l=8e3,h=6e4,d=null,p=!0,u=2e4,g=null,y={stop:()=>{a=!0,d&&(clearTimeout(d),d=null),g&&(clearTimeout(g),g=null),r&&(r.close(),r=null)},ready:null},_;y.ready=new Promise($=>{_=$});let H=()=>{if(!a){if(r&&r.readyState<=WebSocket.OPEN){_();return}r=new globalThis.WebSocket(s),g&&clearTimeout(g),g=setTimeout(()=>{console.warn(`[NchanClient ${i()}] Connection to ${s} timed out after ${u}ms, forcing reconnect`),r?.close()},u),g.unref?.(),r.onmessage=$=>{this.record($.data),t($.data)},r.onopen=()=>{let $=!p;p=!1,c=0,d&&(clearTimeout(d),d=null),g&&(clearTimeout(g),g=null),_(),$&&y.onReconnect&&y.onReconnect()},r.onclose=$=>{if(g&&(clearTimeout(g),g=null),!a){if(c>=10){console.error(`[NchanClient ${i()}] Max reconnect attempts reached for ${s}, giving up`);return}let ms=Math.min(Math.pow(2,c)*l,h);c++,d=setTimeout(H,ms),d.unref?.()}},r.onerror=$=>{console.error(`[NchanClient ${i()}] WebSocket error on ${s}:`,$),r&&(r.onerror=null,r?.close())}}};return H(),y}};function Wt(n){return n.type==="table:leave"&&!!n.data?.isSpectator}function Kt(n,e){return n.userId!==e&&!n.tableId&&!n.seek}function Qt(n,e){return!!n.tableId&&!n.isSpectator&&n.tableId!==e}function be(n){return n.tableId?n.isSpectator?"spectating":"playing":"available"}function fe(n){let e=new Map;for(let t of n)t.tableId&&(e.has(t.tableId)||e.set(t.tableId,{tableId:t.tableId,players:[],ruleType:t.ruleType}),e.get(t.tableId).players.push({id:t.userId,name:t.userName}));return Array.from(e.values())}function ye(n){if(!n||n.trim()==="")return null;try{return JSON.parse(n)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function Xt(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var Ve=250,Z=class n{static dedupeChallenges(e){let t=new Set;for(let s of e)s.type!=="offer"&&t.add(n.interactionKey(s));return e.filter(s=>s.type!=="offer"?!0:!t.has(n.interactionKey(s)))}static dedupePresence(e){let t=new Map;for(let s of e){let i=t.get(s.userId);if(i&&i.type!=="leave"&&s.type==="leave"&&s.meta?.origin==="internal"){let r=s.meta?.ts,a=i.meta?.ts??i.clientTs;if(r!==void 0&&a!==void 0&&r>=a&&r-a<=Ve)continue}t.set(s.userId,s)}return[...t.values()]}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var ve=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.joinSentinelTs=null;this.settledListeners=[];this.isSettled=!1;this.unsettledChallengeMessages=[];this.unsettledPresenceMessages=[];this.heartbeatInterval=s.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(!this.isJoined){this.subscription=this.nchan.subscribePresence(this.currentUser.userId,e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready;for(let e=1;;e++)try{let t=Date.now();this.joinSentinelTs=t,await this.nchan.publishPresence({...this.currentUser,clientTs:t});break}catch(t){let s=Math.min(Math.pow(2,e)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${e}), retrying in ${s}ms:`,t),await new Promise(i=>setTimeout(i,s))}this.startHeartbeat(),this.isJoined=!0}}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(s){console.error("Failed to send heartbeat:",s)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}async challenge(e,t,s,i,r){let a=Xt();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:a,options:s,nextTurnId:i,custom:r}),a}async acceptChallenge(e,t,s,i,r,a,c){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:r??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i,nextTurnId:a,custom:c}),await this.updatePresence({tableId:s,ruleType:t,options:i})}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=ye(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledPresenceMessages.push(e),e.userId===this.currentUser.userId&&e.type==="join"&&e.clientTs===this.joinSentinelTs&&this.fireSettled();return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&this.notifyListeners()}}handleChallenge(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let s=e.meta?.ts,i=t.meta?.ts??t.clientTs;return s===void 0||i===void 0?!1:s>=i&&s-i<=Ve}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=Z.dedupePresence(this.unsettledPresenceMessages);for(let i of e)this.applyPresence(i);this.unsettledPresenceMessages=[];let t=Z.dedupeChallenges(this.unsettledChallengeMessages);for(let i of t)this.emitIfRelevant(i);this.unsettledChallengeMessages=[];let s=[...this.settledListeners];this.settledListeners=[];for(let i of s)i()}clearSettleState(){this.joinSentinelTs=null,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.unsettledPresenceMessages=[]}};var xe=class n{constructor(e,t,s,i,r=!1,a,c,l,h){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.isSpectator=r;this.onClosed=l;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=h?.maxSize??1e3,this.initialRetryDelayMs=h?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=h?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(d=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(u=>u()),this.preJoinQueue.splice(0).forEach(u=>this.messageListeners.forEach(g=>g(u))),d()}}),a&&this.messageListeners.push(a),c&&this.bothJoinedListeners.push(c)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((s,i)=>{this.publishQueue.push({type:e,data:t,resolve:s,reject:i}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((s,i)=>{let r=a=>{if(this.isClosed){i(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>s()).catch(c=>{if(this.isClosed){i(c);return}let l=Math.min(Math.pow(2,a+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>r(a+1),l)})};r(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=ye(e);if(!t||!t.type)return;let s=t.meta?.msgId;if(typeof s=="string"){if(this.seenMsgIds.has(s))return;if(this.seenMsgIds.set(s,!0),this.seenMsgIds.size>n.MAX_SEEN_MSG_IDS){let i=this.seenMsgIds.keys().next().value;i!==void 0&&this.seenMsgIds.delete(i)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!Wt(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let r=t.data?.id||t.senderId;r&&(this.seenIds.add(r),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&r!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(a=>a())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(i=>i(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var _e=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new ge(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),r,a={...t,onReconnect:()=>{this.resumeSession().catch(l=>console.error("Session resume failed after lobby reconnect:",l)),t?.onReconnect?.()},onLeave:()=>{let l=r??i;if(l){let h=this.activeLobbies.indexOf(l);h!==-1&&this.activeLobbies.splice(h,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let c=new ve(this.nchan,e,a);return r=c,await c.join(),this.lobbyInstances.set(e.userId,c),this.activeLobbies.push(c),c}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,s){let i=s?.isSpectator??!1,r=this.tableKey(e,t,i),a=this.joiningTables.get(r);if(a)return a.promise;this.assertNoTableConflict(e,t,i);let c=this.activeTables.find(u=>u.tableId===e);if(c)return Promise.resolve(c);let l=i?void 0:this.activeLobbies.find(u=>u.currentUser.userId===t),h=new xe(this.nchan,e,t,l,i,s?.onMessage,s?.onBothJoined,()=>this.removeActiveTable(h));this.activeTables.push(h);let d=h.join().catch(u=>{console.error(`Table ${e} join handshake failed:`,u)});l&&d.then(async()=>{if(!h.closed)try{await l.updatePresence({tableId:e})}catch(u){console.error("Failed to update presence after table join:",u)}});let p=Promise.resolve(h).finally(()=>{this.joiningTables.delete(r)});return this.joiningTables.set(r,{tableId:e,userId:t,isSpectator:i,promise:p}),p}tableKey(e,t,s){return`${e}|${t}|${s?"s":"p"}`}assertNoTableConflict(e,t,s){for(let i of this.joiningTables.values())if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already being joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`);for(let i of this.activeTables)if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,s){return this.joinTable(e,t,{...s,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};function qe(n){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname)){console.log("Skipping usage fetch for localhost.");return}let e=`https://scoreboard-tailuge.vercel.app/api/usage/${n}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}var we=class{#e=[];#s;#t;constructor(e=3e4,t=()=>Date.now()){this.#s=e,this.#t=t}update(e){let t=new Set(e.map(s=>s.userId));for(let s of this.#e)s.status==="online"&&!t.has(s.userId)&&(s.status="offline",s.offlineSince=this.#t());for(let s of e){let i=this.#e.find(r=>r.status==="online"&&r.userId===s.userId);i?i.user=s:this.#n(s)}return this.getSlots()}getSlots(){return[...this.#e]}reset(){this.#e=[]}#n(e){let t=this.#t(),s=this.#e.find(a=>a.userId===e.userId);if(s){s.status="online",s.offlineSince=null,s.user=e;return}let i=null,r=0;for(let a of this.#e)if(a.status==="offline"){let c=t-a.offlineSince;c>this.#s&&c>r&&(i=a,r=c)}if(i){i.userId=e.userId,i.status="online",i.offlineSince=null,i.user=e;return}this.#e.push({userId:e.userId,status:"online",offlineSince:null,user:e})}};var Zt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},es=n=>(...e)=>({_$litDirective$:n,values:e}),$e=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Ts}=At,ts=n=>n;var ss=()=>document.createComment(""),J=(n,e,t)=>{let s=n._$AA.parentNode,i=e===void 0?n._$AB:e._$AA;if(t===void 0){let r=s.insertBefore(ss(),i),a=s.insertBefore(ss(),i);t=new Ts(r,a,n,n.options)}else{let r=t._$AB.nextSibling,a=t._$AM,c=a!==n;if(c){let l;t._$AQ?.(n),t._$AM=n,t._$AP!==void 0&&(l=n._$AU)!==a._$AU&&t._$AP(l)}if(r!==i||c){let l=t._$AA;for(;l!==r;){let h=ts(l).nextSibling;ts(s).insertBefore(l,i),l=h}}}return t},P=(n,e,t=n)=>(n._$AI(e,t),n),ks={},is=(n,e=ks)=>n._$AH=e,ns=n=>n._$AH,Ie=n=>{n._$AR(),n._$AA.remove()};var rs=(n,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(n[i],i);return s},as=es(class extends $e{constructor(n){if(super(n),n.type!==Zt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],r=[],a=0;for(let c of n)i[a]=s?s(c,a):a,r[a]=t(c,a),a++;return{values:r,keys:i}}render(n,e,t){return this.dt(n,e,t).values}update(n,[e,t,s]){let i=ns(n),{values:r,keys:a}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=a,r;let c=this.ut??=[],l=[],h,d,p=0,u=i.length-1,g=0,y=r.length-1;for(;p<=u&&g<=y;)if(i[p]===null)p++;else if(i[u]===null)u--;else if(c[p]===a[g])l[g]=P(i[p],r[g]),p++,g++;else if(c[u]===a[y])l[y]=P(i[u],r[y]),u--,y--;else if(c[p]===a[y])l[y]=P(i[p],r[y]),J(n,l[y+1],i[p]),p++,y--;else if(c[u]===a[g])l[g]=P(i[u],r[g]),J(n,i[p],i[u]),u--,g++;else if(h===void 0&&(h=rs(a,g,y),d=rs(c,p,u)),h.has(c[p]))if(h.has(c[u])){let _=d.get(a[g]),H=_!==void 0?i[_]:null;if(H===null){let $=J(n,i[p]);P($,r[g]),l[g]=$}else l[g]=P(H,r[g]),J(n,i[p],H),i[_]=null;g++}else Ie(i[u]),u--;else Ie(i[p]),p++;for(;g<=y;){let _=J(n,l[y+1]);P(_,r[g]),l[g++]=_}for(;p<=u;){let _=i[p++];_!==null&&Ie(_)}return this.ut=a,is(n,l),T}});var G=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),We=class extends f{static properties={slots:{type:Array},users:{type:Array},myId:{type:String},myName:{type:String},tableId:{type:String},isChallengePending:{type:Boolean},challenges:{type:Object},pendingChats:{type:Object}};#e=!1;static styles=[v,Lt,b`
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
        .status-link { text-decoration: none; color: inherit; }
    `];_renderStatus(e){return o`<span aria-label="${e.title}" role="img">${e.emoji}</span>`}async autoExpandIfSupported(){if(this.#e)return;if((this.slots||[]).filter(t=>t.status==="online").length>4){await this.updateComplete;let t=this.renderRoot.querySelector(".expand-toggle");t&&getComputedStyle(t).visibility!=="hidden"&&(this.#e=!0,G(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate())}}updated(){if(!this.#e)return;let e=this.renderRoot.querySelector("ul");if(!e)return;let t=e.scrollHeight;t>0&&e.style.setProperty("--ul-expanded-height",t+"px")}#s(){this.#e=!this.#e,G(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate()}render(){let e=this.slots||[];if(e.filter(i=>i.status==="online").length===0)return o`<div class="empty">No other players online yet. Invite a friend!</div>`;let s=new Set(fe(this.users||[]).filter(i=>i.players.length>1).map(i=>i.tableId));return o`
            <ul class="${this.#e?"expanded":""}" aria-label="Online players">
                ${as(e,(i,r)=>r,(i,r)=>this._rowSlot(i,r,s))}
            </ul>
            <div class="expand-toggle" @click=${this.#s}>
                ${this.#e?"\u25B2":"\u25BC"}
            </div>`}_rowSlot(e,t,s){if(e.status==="offline"){let i=e.user,r=ze(i.meta?.origin??"",i.ruleType??"",be(i),i.options,i.arenaId);return o`
                <li class="is-offline" aria-label="${i.userName}">
                    <div class="user-info">
                        <span class="user-name">
                            <span title="${w(i.meta?.country).title}">${w(i.meta?.country).emoji}</span>
                            <span class="name-wrap">${i.userName}<span class="loc-tip">${i.meta?.city??""}</span></span>
                            ${this._renderStatus(r)}
                        </span>
                    </div>
                </li>`}return this._row(e.user,s)}_row(e,t){let s=this.pendingChats?.get(e.userId)>0,r=!(this.challenges?.[e.userId]?.challengerId===e.userId)&&(e.isBot||Kt(e,this.myId)),a=!e.isBot&&be(e)==="playing"&&Qt(e,this.tableId)&&t.has(e.tableId),c=ze(e.meta?.origin??"",e.ruleType??"",be(e),e.options,e.arenaId),l=s?o`<button class="btn-chat" aria-label="Unread message from ${e.userName}" @click=${()=>G(this,"open-chat",e.userId)}>💬</button>`:a?o`<button class="btn-spectate" aria-label="Spectate ${e.userName}'s game" @click=${()=>G(this,"spectate",e)}>Spectate</button>`:r?o`<button class="btn-challenge" aria-label="Challenge ${e.userName}" ?disabled=${this.isChallengePending} @click=${()=>A?window.location.href="https://billiards.tailuge.workers.dev/lobby":G(this,"challenge",e.userId)}>Challenge</button>`:o``;return o`
            <li aria-label="${e.userName}">
                <div class="user-info">
                    <span class="user-name" @click=${()=>G(this,"open-chat",e.userId)} style="cursor: pointer"><span title="${w(e.meta?.country).title}">${w(e.meta?.country).emoji}</span> <span class="name-wrap">${e.userName}<span class="loc-tip">${e.meta?.city??""}</span></span> ${this._renderStatus(c)}</span>
                </div>
                <div class="actions">${l}</div>
            </li>`}};customElements.define("user-list",We);var Se=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Ke=class extends f{static properties={lobby:{type:Object},targetId:{type:String},targetName:{type:String},_messages:{state:!0},_unread:{state:!0}};static styles=[v,B,b`
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
    `];constructor(){super(),this._messages=new Map,this._unread=new Map,this._lobbyBound=!1}willUpdate(e){e.has("lobby")&&this.lobby&&!this._lobbyBound&&(this._lobbyBound=!0,this.lobby.onChat(t=>{let s=t.senderId,i=[...this._messages.get(s)??[],t];if(this._messages=new Map(this._messages).set(s,i),s!==this.targetId){let r=(this._unread.get(s)??0)+1;this._unread=new Map(this._unread).set(s,r),Se(this,"unread-changed",{userId:s,count:r})}this.requestUpdate()})),e.has("targetId")&&this.targetId&&this._unread.has(this.targetId)&&(this._unread=new Map(this._unread).set(this.targetId,0),Se(this,"unread-changed",{userId:this.targetId,count:0}))}_send(e){e.preventDefault();let t=this.shadowRoot.querySelector("input"),s=t.value.trim();if(!s||!this.lobby||!this.targetId)return;this.lobby.sendChat(this.targetId,s);let r={messageType:"chat",senderId:this.lobby.currentUser.userId,recipientId:this.targetId,text:s},a=[...this._messages.get(this.targetId)??[],r];this._messages=new Map(this._messages).set(this.targetId,a),t.value="",this.requestUpdate()}updated(e){if(e.has("targetId")){let t=this.shadowRoot.querySelector(".thread");t&&(t.scrollTop=t.scrollHeight);let s=this.shadowRoot.querySelector("input");s&&s.focus()}else if(e.has("_messages")){let t=e.get("_messages");if(this._messages.get(this.targetId)!==t?.get(this.targetId)){let s=this.shadowRoot.querySelector(".thread");s&&(s.scrollTop=s.scrollHeight)}}}render(){if(!this.targetId)return o``;let e=this.lobby?.currentUser?.userId,t=this._messages.get(this.targetId)??[];return o`
            <div class="backdrop" @click=${s=>s.target===s.currentTarget&&Se(this,"close")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Chat with ${this.targetName}">
                    <h3>💬 ${this.targetName}</h3>
                    <div class="thread">
                        ${t.length===0?o`<div class="empty">No messages yet</div>`:t.map(s=>o`<div class="msg ${s.senderId===e?"mine":"theirs"}">${s.text}</div>`)}
                    </div>
                    <form class="compose" @submit=${this._send}>
                        <input type="text" name="message" placeholder="Message…" autocomplete="off" aria-label="Message text">
                        <button type="submit" aria-label="Send message">➤</button>
                    </form>
                    <button class="cancel" @click=${()=>Se(this,"close")}>Close</button>
                </div>
            </div>`}};customElements.define("message-modal",Ke);var Ee=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),As={raceTo:"Race to",reds:"Reds",shotClock:"Shot clock",collaboration:"Collaboration",practice:"Practice"},os=(n,e)=>n?Object.entries(n).filter(([,t])=>!(typeof t=="boolean"&&t===!1)).map(([t,s])=>{if(t.startsWith("handicap_")){let r=t.slice(9),a=e&&r===e?"Your handicap":"Handicap";return typeof s=="boolean"?a:`${a}: ${s}`}let i=As[t]??t;return typeof s=="boolean"?i:`${i}: ${s}`}):[],Qe=class extends f{static properties={challenge:{type:Object},sent:{type:Object},myId:{type:String}};static styles=[v,Nt,Mt];render(){return this.challenge?this._incoming(this.challenge):this.sent?this._sent(this.sent):o``}_incoming(e){let t={...e.options};if(Object.keys(t).some(i=>i.startsWith("handicap_"))){let i=localStorage.getItem(`handicap_${e.ruleType}`)||"15";t["handicap_"+this.myId]=i}let s=os(t,this.myId);return o`
            <div class="banner">
                <div class="details">${I(e.ruleType)} ${e.ruleType}</div>
                <strong>Challenge from ${e.challengerName}</strong>
                <div class="details">${s.map(i=>o`<span>${i}</span>`)}</div>
                <div class="row">
                    <button class="btn-accept" aria-label="Accept challenge" @click=${()=>Ee(this,"accept")}>Accept</button>
                    <button class="btn-decline" aria-label="Decline challenge" @click=${()=>Ee(this,"decline")}>Decline</button>
                </div>
            </div>`}_sent(e){let t=e.status==="pending",s=os(e.options,this.myId);return o`
            <div class="banner ${e.status}">
                <div class="details">${I(e.ruleType)} ${e.ruleType}</div>
                ${s.length>0?o`<div class="details">${s.map(i=>o`<span>${i}</span>`)}</div>`:""}
                <strong>${t?`Waiting for ${e.recipientName} to accept.`:`${e.recipientName} declined.`}</strong>
                <div class="row">
                    ${t?o`<button class="btn-leave" @click=${()=>Ee(this,"cancel")}>Cancel</button>`:o`<button aria-label="Dismiss" @click=${()=>Ee(this,"dismiss")}>✕</button>`}
                </div>
            </div>`}};customElements.define("challenge-banner",Qe);var Ce=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Xe=class n extends f{static properties={userId:{type:String},userName:{type:String},_expanded:{state:!0},_handicap:{state:!0}};static styles=[v,B,ce];static SECTIONS=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",rules:[{id:"eightball",label:"Eight Ball",img:"assets/eightball.png"},{id:"eightball",label:"Eight Ball (Free Aim)",img:"assets/eightball.png",options:{freeaim:"true"}},{id:"eightball",label:"Eight Ball Mini (Free Aim)",img:"assets/baby.png",options:{freeaim:"true",tableSize:"6"}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",rules:[{id:"nineball",label:"Nine Ball",img:"assets/nineball.png"},{id:"nineball",label:"Nine Ball (Free Aim)",img:"assets/nineball.png",options:{freeaim:"true"}},{id:"nineball",label:"Nine Ball Mini (Free Aim)",img:"assets/baby.png",options:{freeaim:"true",tableSize:"6"}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",rules:[{id:"snooker",label:"3 reds",img:"assets/baby.png",options:{reds:"3",tableSize:"6"}},{id:"snooker",label:"6 reds",img:"assets/snooker.png",options:{reds:"6",tableSize:"12"}},{id:"snooker",label:"10 reds",img:"assets/snooker.png",options:{reds:"10",tableSize:"12"}},{id:"snooker",label:"15 reds",img:"assets/snooker.png",options:{reds:"15",tableSize:"12"}},{id:"snooker",label:"6 reds (Free Aim)",img:"assets/snooker.png",options:{freeaim:"true",reds:"6",tableSize:"12"}}]},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",rules:[{id:"threecushion",label:"Small Table (15)",img:"assets/baby.png",options:{raceTo:"15",collaboration:!0,shotClock:"60",tableSize:"5"}},{id:"threecushion",label:"Race to 7",img:"assets/threecushion.png",options:{raceTo:"7"}},{id:"threecushion",label:"Race to 25",img:"assets/threecushion.png",options:{raceTo:"25"}},{id:"threecushion",label:"Collaboration (15)",img:"assets/threecushion.png",options:{raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Race to 15 (Free Aim)",img:"assets/threecushion.png",options:{freeaim:"true",raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Traditional (10)",img:"assets/threecushion.png",options:{raceTo:"10",practice:!1,shotClock:"45"}},{id:"threecushion",label:"Handicap",img:"assets/threecushion.png",options:{handicap:!0}}]},{key:"sagu",label:"Sagu",img:"assets/sagu.png",rules:[{id:"sagu",label:"Small Table (5)",img:"assets/baby.png",options:{raceTo:"5",tableSize:"5"}},{id:"sagu",label:"Race to 11",img:"assets/sagu.png",options:{raceTo:"11"}},{id:"sagu",label:"Free Aim (5)",img:"assets/sagu.png",options:{freeaim:"true",raceTo:"5"}},{id:"sagu",label:"Handicap",img:"assets/sagu.png",options:{handicap:!0}}]}];constructor(){super(),this._expanded=null,this._handicap=15}_loadHandicap(e){let t=localStorage.getItem(`handicap_${e}`);if(t!==null){let s=parseInt(t,10);if(!isNaN(s)&&s>=5&&s<=30){this._handicap=s;return}}this._handicap=15}_onHandicapChange(e){let t=parseInt(e.target.value,10);this._handicap=t,this._expanded&&localStorage.setItem(`handicap_${this._expanded}`,String(t))}_toggle(e){let t=this._expanded===e;this._expanded=t?null:e,t||n.SECTIONS.find(i=>i.key===e)?.rules.some(i=>i.options?.handicap===!0)&&this._loadHandicap(e)}render(){return this.userId?o`
            <div class="backdrop" @click=${e=>e.target===e.currentTarget&&Ce(this,"cancel")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Select game type">
                    <h3>Challenge ${this.userName}</h3>
                    <div class="sections">
                        ${n.SECTIONS.map(e=>o`
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
                                        ${e.rules.map(t=>o`
                                            <button class="rule btn-challenge" @click=${()=>{let s=t.options?{...t.options}:{};s.handicap===!0&&(s.handicap=String(this._handicap)),Ce(this,"confirm",{ruleType:t.id,options:s})}}>
                                                <span class="icon-wrap">
                                                    <img src=${t.img} alt=${t.label} />
                                                    ${t.options&&t.options.handicap!==!0?o`<span class="badge">${me(t.options)}</span>`:""}
                                                </span>
                                                ${t.options?.handicap===!0?o`
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
                                                `:o`${t.label}`}
                                            </button>`)}
                                    </div>
                            </div>`)}
                    </div>
                    <button class="msg-btn" type="button" aria-label="Send message" @click=${()=>Ce(this,"message")}>💬</button>
                    <button class="cancel" @click=${()=>Ce(this,"cancel")}>Cancel</button>
                </div>
            </div>`:o``}};customElements.define("challenge-modal",Xe);var ls=[{userId:"bot-clawbreak",userName:"ClawBreak",isBot:!0,meta:{country:"BOT"}},{userId:"bot-thefarjaw",userName:"TheFarJaw",isBot:!0,meta:{country:"BOT"}}],Ze=class extends f{static styles=[v,Ot];#e={...Bt,settled:!1};#s=null;#t;#n;#d;#a=null;#o=null;#u=new Map;#m=new we;#i=null;#h=!1;constructor(){super(),this.#t=m.clientId,this.#n=m.userName;let e=new URLSearchParams(location.search),t=e.get("opponent.userId");if(t){let i={},r=e.get("tableSize")||e.get("tablesize");r&&(i.tableSize=r);let a=e.get("raceTo")||e.get("raceto");a&&(i.raceTo=a);let c=e.get("shotClock")||e.get("shotclock");c&&(i.shotClock=c);let l=e.get("reds");l&&(i.reds=l);let h=e.get("freeaim");h&&(i.freeaim=h),this.#i={opponentId:t,opponentName:e.get("opponent.userName")||t,ruleType:e.get("ruletype")||"nineball",nextTurnId:e.get("nextTurnId"),options:Object.keys(i).length>0?i:void 0};let d=new URL(location.href);d.searchParams.delete("opponent.userId"),d.searchParams.delete("opponent.userName");let p=[];for(let u of d.searchParams.keys())(u.startsWith("opponent.")||u.startsWith("custom."))&&p.push(u);for(let u of p)d.searchParams.delete(u);d.searchParams.delete("ruletype"),d.searchParams.delete("nextTurnId"),d.searchParams.delete("tableSize"),d.searchParams.delete("tablesize"),d.searchParams.delete("raceTo"),d.searchParams.delete("raceto"),d.searchParams.delete("shotClock"),d.searchParams.delete("shotclock"),d.searchParams.delete("reds"),d.searchParams.delete("freeaim"),history.replaceState(null,"",d)}let s=`https://${O}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(s=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`),this.#d=new _e({baseUrl:s}),this.#d.setVersion(pe(he))}connectedCallback(){super.connectedCallback(),this._onUserChanged=e=>{this.#t=e.detail.userId,this.#n=e.detail.userName,this.#s?this.#s.updatePresence({userId:this.#t,userName:this.#n}).catch(t=>console.error("Failed to update presence:",t)):this._connect().catch(t=>console.error("Lobby connect failed:",t))},document.addEventListener("user-name-changed",this._onUserChanged),this._connect().catch(e=>console.error("Lobby connect failed:",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onUserChanged),this.#s?.leave()}dispatch(e){this.#e=Ft(this.#e,{...e,myId:this.#t}),e.type==="CHALLENGE_MSG"&&this.#$(e.payload),this.requestUpdate()}#w(){if(!this.#i||!this.#e.connected)return;let e=this.#i.opponentId;!this.#r&&this.#e.users.some(t=>t.userId===e)&&this.#_(e,this.#i.ruleType,this.#i.options,this.#i.nextTurnId)}#$(e){if(this.#i&&(e.challengerId===this.#i.opponentId||e.challengeeId===this.#i.opponentId)&&(e.type==="decline"||e.type==="cancel")&&(this.#i=null),e.type==="offer"&&e.challengeeId===this.#t&&this.#i&&this.#i.opponentId===e.challengerId){let t=this.#i.nextTurnId;this.#i=null;let s=this.#r;s&&s.challengeeId===e.challengerId&&s.status==="pending"?this.#t<e.challengerId&&this.#f(e.challengerId,t).catch(i=>console.error("Simultaneous auto-accept failed:",i)):this.#f(e.challengerId,t).catch(i=>console.error("Auto-join accept failed:",i))}}get state(){return this.#e}get#y(){return this.#e.connected}get#p(){return this.#e.users}get#g(){return this.#e.currentMatch?.tableId}get#I(){return this.#e.currentMatch?.ruleType||"standard"}get#S(){return!!this.#e.currentMatch?.isFirst}get#E(){return this.#e.currentMatch?.options}get#v(){return this.#e.currentMatch?.opponentId}get#C(){return this.#e.currentMatch?.opponentName}get#T(){return this.#e.currentMatch?.opponentCustom}get#b(){return Object.values(this.#e.challenges).find(e=>e.challengeeId===this.#t&&e.status==="pending")}get#r(){return Object.values(this.#e.challenges).find(e=>e.challengerId===this.#t)}get#l(){return[...this.#p,...ls]}get#c(){let e=m.getCustom();if(e.emoji===void 0||e.emoji===null){let t=this.#p.find(s=>s.userId===this.#t)?.meta?.country;if(t)return{...e,emoji:w(t).emoji}}return e}get lobby(){return this.#s}get#x(){return this.#m.getSlots()}async _connect(){this.#m.reset(),this.#s=await this.#d.joinLobby({messageType:"presence",type:"join",userId:this.#t,userName:this.#n}),this.dispatchEvent?.(new CustomEvent("lobby-ready",{detail:this.#s,bubbles:!0,composed:!0})),this.dispatch({type:"CONNECTED",payload:!0}),this.#h=!1,this.dispatch({type:"SETTLED",payload:!1}),this.#s.onUsersChange(e=>{let t=[...e,...ls].filter(s=>s.userId!==this.#t);this.#m.update(t),this.dispatch({type:"USERS_UPDATE",payload:e})}),this.#s.onChallenge(e=>{e.options?.tournamentId||(this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#s.settled&&e.type==="offer"&&e.challengeeId===this.#t&&document.hidden&&typeof Notification<"u"&&Notification.permission==="granted"&&new Notification("Challenge received!",{body:`${e.challengerName} challenged you to ${e.ruleType}`,icon:"assets/threecushion.png"}))}),this.#s.onSettled(async()=>{this.#h=!0,this.dispatch({type:"SETTLED",payload:!0}),this.#w(),await this.updateComplete,this.renderRoot.querySelector("user-list")?.autoExpandIfSupported()})}async#_(e,t,s,i){this.#i&&this.#i.opponentId===e||(this.#i=null);let a=this.#l.find(l=>l.userId===e);if(a?.isBot){let l="bot-"+Math.random().toString(36).slice(2,8),h=!0;window.location.href=z({tableId:l,userId:this.#t,userName:this.#n,ruleType:t,isFirst:h,options:s,bot:a.userName,lod:m.lod,flip:m.flip,custom:this.#c});return}let c=this.#s?await this.#s.challenge(e,t,s,i,this.#c):"test-"+Math.random().toString(36).slice(2,7);qe("createTable"),this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#t,challengeeId:e,recipientName:a?.userName||e,ruleType:t,options:s,tableId:c,nextTurnId:i}})}async#k(){this.#i=null;let e=this.#r;e?.status==="pending"&&(this.#s&&await this.#s.cancelChallenge(e.challengeeId,e.ruleType),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId}))}async#f(e,t){let s=e?this.#e.challenges[e]:this.#b;if(!s)return;let i={...s.options};if(Object.keys(i).some(r=>r.startsWith("handicap_"))){let r=localStorage.getItem(`handicap_${s.ruleType}`)||"15";i["handicap_"+this.#t]=r}this.#s&&await this.#s.acceptChallenge(s.challengerId,s.ruleType,s.tableId,i,s.challengerName,t,this.#c),qe("joinTable"),this.dispatch({type:"CHALLENGE_MSG",payload:{type:"accept",challengerId:s.challengerId,challengerName:s.challengerName,challengeeId:this.#t,ruleType:s.ruleType,tableId:s.tableId,options:i,nextTurnId:t,custom:this.#c}}),this.#i=null}async#A(){this.#i=null;let e=this.#b;this.#s&&await this.#s.declineChallenge(e.challengerId,e.ruleType,e.challengerName),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId})}#P(){this.#i=null;let e=this.#r;e&&this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId})}#L(){let e=[...this.#l].filter(t=>t.meta?.country!=="BOT").map(t=>{let{meta:s={},...i}=t,{ts:r,...a}=s;return{...i,meta:a}});console.log("=== USERS ==="),console.log(JSON.stringify(e,null,2)),console.log("=== MY INFO ==="),console.log(JSON.stringify({myId:this.#t,myName:this.#n})),console.log("=== NCHAN RECORDED MESSAGES ==="),console.log(this.#d.recordedMessages),console.log("=== SLOTS ==="),console.table(this.#x.map(t=>({userId:t.userId,status:t.status,offlineSince:t.offlineSince,online:t.status==="online"?"\u2713":"\u2717"})))}_openActiveTables=()=>{let t=fe(this.#p||[]).map(s=>s.tableId).map(s=>"active="+encodeURIComponent(s)).join("&");window.open(Ht+(t?"?"+t:""),"_blank","noopener")};render(){if(this.#g){let t=z({tableId:this.#g,userId:this.#t,userName:this.#n,ruleType:this.#I,isFirst:this.#S,options:this.#E,lod:m.lod,flip:m.flip,custom:this.#c,opponent:this.#v?{userId:this.#v,userName:this.#C,custom:this.#T}:void 0});return this.#i=null,this.#e={...this.#e,currentMatch:null},window.location.href=t,o``}let e=this.#a;return o`
            <div class="panel-header">
                <span class="dot ${this.#y?this.#h?"green":"blue":""}" role="status" aria-label="${this.#y?this.#h?"Settled":"Connecting":"Disconnected"}" @click=${this._openActiveTables} style="cursor:pointer"></span>
                <span class="panel-title" @click=${()=>this.#L()}>Play Online (${this.#l.filter(t=>t.userId!==this.#t).length})</span>
            </div>
            <challenge-banner
                .challenge=${this.#b}
                .sent=${this.#r}
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
                myName=${this.#n}
                tableId=${this.#g||""}
                .isChallengePending=${this.#r?.status==="pending"}
                .challenges=${this.#e.challenges}
                .pendingChats=${this.#u}
                @challenge=${t=>{let s=this.#l.find(i=>i.userId===t.detail);this.#a={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}
                @spectate=${t=>{let s=t.detail;window.location.href=Yt({tableId:s.tableId,userId:this.#t,userName:this.#n,ruleType:s.ruleType||"nineball",options:s.options})}}
                @open-chat=${t=>{let s=this.#l.find(i=>i.userId===t.detail);this.#o={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}>
            </user-list>
            <challenge-modal
                .userId=${e?.userId??null}
                .userName=${e?.userName??""}
                @confirm=${t=>{let s={...t.detail.options};s.handicap&&(s["handicap_"+this.#t]=s.handicap,delete s.handicap),this.#_(e.userId,t.detail.ruleType,s),this.#a=null}}
                @message=${()=>{this.#o={userId:e.userId,userName:e.userName},this.#a=null,this.requestUpdate()}}
                @cancel=${()=>{this.#a=null,this.requestUpdate()}}>
            </challenge-modal>
            <message-modal
                .lobby=${this.#s}
                .targetId=${this.#o?.userId??null}
                .targetName=${this.#o?.userName??""}
                @close=${()=>{this.#o=null,this.requestUpdate()}}
                @unread-changed=${t=>{this.#u=new Map(this.#u).set(t.detail.userId,t.detail.count),this.requestUpdate()}}>
            </message-modal>`}};customElements.define("online-panel",Ze);var Ps=[[4352,4447],[11904,42191],[44032,55203],[63744,64255],[65040,65135],[65280,65376],[65504,65510],[127744,129791],[131072,195103]],cs=n=>{let e=0;for(let t of n){let s=t.codePointAt(0);e+=Ps.some(([i,r])=>s>=i&&s<=r)?2:1}return Math.max(e,1)},et=class extends S{static properties={_dotColor:{state:!0}};static styles=Ut;constructor(){super(),this._clientId=m.clientId,this._name=m.userName,this._dotColor=m.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,m.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return A?o``:o`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${cs(this._name)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=cs(e.target.value)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",et);var Ls=`https://${O}/api/stats`,tt=class extends f{static styles=b`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(Ls,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return o`<span class="loading">Could not load stats.</span>`;if(!this._data)return o`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{});return o`
            ${e?o`<div class="uptime"><a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${s.map(([i,r])=>o`
                    <li>${w(i).emoji} <span>${i}</span> <span class="count">${r}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",tt);var st=class n extends S{static properties={_open:{state:!0},_notifEnabled:{state:!0},_showStats:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[v,B,b`
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
    `];constructor(){super(),this._open=!1,this._showStats=!1,this._copied=!1,this._picker=null,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=typeof Notification<"u"&&Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this),this._onMessage=this._onMessage.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown),window.addEventListener("message",this._onMessage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown),window.removeEventListener("message",this._onMessage)}_onMessage(e){e.data?.type==="done"&&(this._picker=null)}_onKeydown(e){e.key==="Escape"&&(this._picker?this._picker=null:this._open&&this._close())}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1,this._picker=null}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked&&typeof Notification<"u"){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return o`
            <button class="burger" aria-label="Settings" aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
            ${this._open?o`
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
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${n.LOD_LABELS[m.lod]||m.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${m.lod} @input=${e=>m.setLod(e.target.value)}>
                        </div>

                        <div class="section-title">Customise</div>
                        <div class="row">
                            <button class="customise-btn" @click=${()=>this._picker="cue"}>Cue</button>
                            <button class="customise-btn" @click=${()=>this._picker="wall"}>Wall</button>
                        </div>

                        <div class="section-title">Links</div>
                        <div class="row"><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Support</a></div>
                        <div class="row"><a href="https://scoreboard-tailuge.vercel.app/usage.html" target="_blank" rel="noopener">Usage</a></div>
                        <div class="row">
                            <a href="#" @click=${e=>{e.preventDefault(),this._share()}}>
                                Share
                                ${this._copied?o`<span class="copied-badge">Copied!</span>`:""}
                            </a>
                        </div>
                        <div class="row"><a href="./arena.html">Arena</a></div>
                        <div class="row"><a href="#" @click=${e=>{e.preventDefault(),this._showStats=!this._showStats}}>Stats</a></div>

                        ${this._showStats?o`<div><strong style="font-size:0.82rem">Recent visitors</strong><stats-panel></stats-panel></div>`:""}

                        <button class="cancel" @click=${this._close} style="margin-top: 0.4rem;">Close</button>
                    </div>
                </div>
                ${this._picker?o`
                    <div class="picker-backdrop" @click=${e=>e.target===e.currentTarget&&(this._picker=null)}>
                        <div class="picker-frame">
                            ${this._picker==="cue"?o`<iframe src="./cue.html" title="Cue"></iframe>`:o`<iframe src="./wall.html?userName=${encodeURIComponent(m.userName)}" title="Wall"></iframe>`}
                        </div>
                    </div>
                `:""}`:""}
        `}};customElements.define("settings-modal",st);var it=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"https://billiards-network.onrender.com",Ns=3e4,Ms=5,ds=1800*1e3,Us=n=>(Math.floor(n/ds)+1)*ds,hs=[{name:"Three Cushion Mini Hourly Arena",ruleType:"threecushion",options:{raceTo:"7",tableSize:"5"}},{name:"Nine Ball Mini Hourly Arena",ruleType:"nineball",options:{tableSize:"6",freeaim:"true"}},{name:"Eight Ball Mini Hourly Arena",ruleType:"eightball",options:{tableSize:"6",freeaim:"true"}},{name:"Nine Ball Hourly Arena",ruleType:"nineball",options:{}},{name:"Eight Ball Hourly Arena",ruleType:"eightball",options:{}},{name:"Snooker Mini Hourly Arena",ruleType:"snooker",options:{tableSize:"6",reds:"3",freeaim:"true"}}],Rs=b`
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
`,js=(n,e=!1,t=null,s=!0)=>{let i=`lobby.html?tournamentId=${encodeURIComponent(n.id)}`,r=a=>{t?(a.preventDefault(),a.stopPropagation(),t(n.id)):a.currentTarget instanceof HTMLButtonElement&&(a.preventDefault(),window.location.href=a.currentTarget.closest("a").href)};return o`<a class="arena-item ${e?"completed":""}" href=${i} @click=${r}>
        <div class="arena-item-main"><div class="arena-item-title"><span class="arena-item-name">${Vt(n.ruleType,n.options)}${n.creatorName?o` · ${n.creatorName}`:""}</span><span class="arena-item-meta"> 👥\uFE0E ${n.players.length} · ⏰\uFE0E ${e?"ended":"ends"} ${new Date(n.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}</span></div></div>
        ${e&&n.winner?o`<span class="arena-winner" title="Winner: ${n.winner}">🏆 ${n.winner}</span>`:""}
        ${e||!s?"":o`<button class="arena-join btn-challenge" type="button" @click=${r}>Open</button>`}
    </a>`},nt=class extends f{static properties={heading:{type:String},_arenas:{state:!0},_error:{state:!0},selectable:{type:Boolean}};static styles=[Rs,b`
        :host { display: block; }
        h2.title { margin: 0 0 .25rem; font-size: .8rem; font-weight: 600; }
        .error { color: var(--text-muted); font-size: .75rem; text-align: center; padding: .5rem 0; }
    `];constructor(){super(),this.heading="",this._arenas=[],this._error="",this.selectable=!1,this._timer=null}connectedCallback(){super.connectedCallback(),this._load(),this._timer=setInterval(()=>this._load(),Ns)}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),super.disconnectedCallback()}async load(){await this._load()}async _load(){try{let e=await fetch(`${it}/api/arena`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arenas (${e.status})`);let s=Date.now();if(!(t.arenas||[]).some(r=>r.endTime>s&&r.status!=="finished")){let r=Us(s);if(Math.floor((r-s)/6e4)>=Ms){let c=new Date(r),l=String(c.getUTCHours()).padStart(2,"0"),h=String(c.getUTCMinutes()).padStart(2,"0"),d=`${c.getUTCFullYear()}${String(c.getUTCMonth()+1).padStart(2,"0")}${String(c.getUTCDate()).padStart(2,"0")}-${l}${h}`,p=c.getUTCMinutes()>=30?1:0,u=(2*c.getUTCHours()+p)%hs.length,g=hs[u];if(await fetch(`${it}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`arena-hourly-${d}`,creatorId:"hourly-arena",creatorName:g.name,ruleType:g.ruleType,options:g.options,endTime:r})}),e=await fetch(`${it}/api/arena`),t=await e.json(),!e.ok)throw new Error(t.error||`Unable to reload Arenas (${e.status})`)}}this._arenas=(t.arenas||[]).sort((r,a)=>a.createdAt-r.createdAt),this._error="",this.dispatchEvent(new CustomEvent("arenas-loaded",{detail:{arenas:this._arenas},bubbles:!0,composed:!0}))}catch(e){this._error=e.message||"Unable to load Arenas."}}get _activeArenas(){let e=Date.now();return this._arenas.filter(t=>t.endTime>e&&t.status!=="finished")}_onSelect(e){this.dispatchEvent(new CustomEvent("arena-select",{detail:{arenaId:e},bubbles:!0,composed:!0}))}render(){let e=this._activeArenas;return o`
            ${this.heading?o`<h2 class="title">${this.heading}</h2>`:""}
            ${this._error&&!e.length?o`<div class="error">Could not load arenas.</div>`:e.length?o`<div class="arena-list" aria-label="Active Arenas">${e.map(t=>js(t,!1,this.selectable?s=>this._onSelect(s):null))}</div>`:o`<div class="empty">No active Arenas.</div>`}
        `}};customElements.define("active-arenas",nt);var rt=class extends f{static properties={arenaId:{type:String},_messages:{state:!0},_hidden:{state:!0}};static styles=[v,b`
      :host { display: block; font-size: 0.8rem; }
      .chat { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 2px; display: flex; flex-direction: column; gap: 2px; }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .title { margin: 0 0 .5rem; font-size: 1.1rem; font-weight: 600; color: var(--text); }
      .messages {
        display: flex; flex-direction: column; gap: 2px;
        height: calc(2.5 * 1.4rem); overflow-y: auto;
        scrollbar-width: thin; scrollbar-color: var(--border) transparent;
      }
      .messages::-webkit-scrollbar { width: 4px; }
      .messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
      .messages.hidden { display: none; }
      .msg { color: var(--text); white-space: pre-wrap; word-break: break-word; line-height: 1.4; }
      .input-row { display: flex; gap: 2px; }
      .input-row.hidden { display: none; }
      input { flex: 1; min-width: 0; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; color: var(--text); font: inherit; font-size: 0.8rem; padding: 0.15rem 0.3rem; }
      input:focus { outline: 2px solid #007bff; outline-offset: 1px; }
    `];constructor(){super(),this.arenaId="",this._messages=[],this._hidden=!1,this._ws=null}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._ws?.close()}updated(e){e.has("arenaId")&&this.arenaId&&(this._ws?.close(),this._messages=[],this._connect())}_connect(){let e=`${X}/subscribe/arena/${encodeURIComponent(this.arenaId)}`;this._ws=new WebSocket(e),this._ws.onmessage=t=>{try{let i=JSON.parse(t.data).message??t.data;this._messages=[...this._messages.slice(-4),String(i)]}catch{this._messages=[...this._messages.slice(-4),t.data]}}}_send(){let e=this.renderRoot.querySelector("input"),t=e.value.trim();if(!t||!this.arenaId)return;let s=location.hostname==="localhost"||location.hostname==="127.0.0.1"?`http://${location.hostname}:8080`:`https://${O}`;fetch(`${s}/publish/arena/${encodeURIComponent(this.arenaId)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})}),e.value=""}_onKeydown(e){e.key==="Enter"&&this._send()}render(){return o`
      <div class="chat">
        <div class="header">
          <button @click=${()=>this._hidden=!this._hidden} aria-label="toggle chat">
            ${this._hidden?"\u25B8":"\u25BE"}
          </button>
        </div>
        <div class="messages ${this._hidden?"hidden":""}">
          ${this._messages.map(e=>o`<div class="msg">${e}</div>`)}
        </div>
        <div class="input-row ${this._hidden?"hidden":""}">
          <input maxlength="120" placeholder="message…" @keydown=${this._onKeydown} />
          <button @click=${this._send}>send</button>
        </div>
      </div>
    `}};customElements.define("arena-chat",rt);var at=class extends f{static properties={standings:{attribute:!1}};static styles=[k,v,b`
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
    `];constructor(){super(),this.standings=[]}render(){let e=[this.standings[1],this.standings[0],this.standings[2]],t=["silver","gold","bronze"],s=["\u{1F948}","\u{1F3C6}","\u{1F949}"];return this.standings.length?o`<div class="podium" aria-label="Top three final standings">
            ${e.map((i,r)=>i?o`
                <div class="step ${t[r]}">
                    <div class="player">
                        <div class="medal" aria-hidden="true">${s[r]}</div>
                        <span class="name" title=${i.name}>${i.name}</span>
                        <span class="score">${i.points} pts</span>
                    </div>
                    <div class="block" aria-label="Place ${r===0?2:r===1?1:3}">${r===0?2:r===1?1:3}</div>
                </div>`:o`<div class="step ${t[r]}" aria-hidden="true"><div class="block"></div></div>`)}
        </div>`:o`<div class="empty">No final standings available.</div>`}};customElements.define("arena-podium",at);var ot=class extends f{static properties={standings:{attribute:!1},players:{attribute:!1},onlineUsers:{attribute:!1},expired:{type:Boolean},countdown:{type:String}};static styles=[k,b`
        :host { display: block; }
        .leaderboard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .25rem; }
        .title { margin: 0; font-size: .8rem; font-weight: 600; }
        .meta { color: var(--text-muted); font-size: .75rem; line-height: 1.7; }
        .countdown { font-size: .85rem; font-weight: 600; color: var(--text-muted); font-variant-numeric: tabular-nums; }
        .players-scroll { max-height: 14.85rem; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        .players { width: 100%; border-collapse: collapse; }
        thead { position: sticky; top: 0; background: transparent; z-index: 1; }
        th, td { height: 1.35rem; box-sizing: border-box; padding: .15rem .25rem; border-bottom: none; line-height: 1.2; text-align: right; }
        th { color: var(--text-muted); font-size: .7rem; }
        th:first-child, td:first-child, th:nth-child(2), td:nth-child(2) { text-align: left; }
        th:first-child, td:first-child { width: 2rem; }
        .online-dot { display: inline-block; width: .45rem; height: .45rem; margin-right: .3rem; border-radius: 50%; background: #198754; vertical-align: middle; }
        .empty { color: var(--text-muted); text-align: center; padding: 1rem 0; }
    `];constructor(){super(),this.standings=[],this.players=[],this.onlineUsers=[],this.expired=!1,this.countdown=""}render(){return o`
            <div class="leaderboard-header">
                <h2 class="title">${this.expired?"Final standings":"Leaderboard"}</h2>
                ${this.countdown?o`<div class="countdown" aria-label="Time remaining">${this.countdown}</div>`:""}
            </div>
            ${this.expired?o`<arena-podium .standings=${this.standings}></arena-podium>`:""}
            ${this.standings.length?o`<div class="players-scroll"><table class="players">
                    <thead><tr><th>#</th><th>Player</th><th>Points</th><th>Wins</th><th>Games</th></tr></thead>
                    <tbody>${this.standings.map((e,t)=>{let s=this.players.find(r=>r.playerId===e.playerId),i=Os(e.playerId)?!0:this.onlineUsers.some(r=>r.userId===e.playerId);return o`<tr>
                            <td>#${t+1}</td>
                            <td>
                                ${i?o`<span class="online-dot" aria-label="Online" title="Online"></span>`:""}
                                ${e.name}${s?.active===!1?" (left)":""}
                            </td>
                            <td>${e.points}</td>
                            <td>${e.wins}</td>
                            <td>${e.games}</td>
                        </tr>`})}</tbody>
                </table></div>`:o`<div class="empty">No players have joined yet.</div>`}
        `}};function Os(n){return["bot-thefarjaw","bot-clawbreak"].includes(n)}customElements.define("arena-leaderboard",ot);var ps=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"https://billiards-network.onrender.com",zs=new Set(["bot-thefarjaw","bot-clawbreak"]),Hs={"bot-thefarjaw":"TheFarJaw","bot-clawbreak":"ClawBreak"},lt=n=>zs.has(n),ct=10,Ds=5,us=2e3,dt=class extends f{static properties={arenaId:{type:String},lobby:{type:Object},theme:{type:String,reflect:!0},_arena:{state:!0},_leaderboard:{state:!0},_onlineUsers:{state:!0},_busy:{state:!0},_error:{state:!0},_pairingState:{state:!0},_pairingCountdown:{state:!0},_pairedName:{state:!0},_beserk:{state:!0}};static styles=[k,v,b`
        :host { display: block; box-sizing: border-box; background: var(--surface); color: var(--text); font-family: 'Exo', sans-serif; font-size: .85rem; }
        .container { max-width: 900px; margin: 0 auto; }
        .topbar { display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem; }
        .logo { width: 32px; height: 32px; opacity: .7; }
        h1 { flex: 1; margin: 0; font-size: 1rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); }
        h1 a { color: inherit; text-decoration: none; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 2px; margin-bottom: 2px; }
        .container > .panel:last-child { margin-bottom: 0; }
        .title { margin: 0 0 2px; font-size: .8rem; font-weight: 600; }
        .meta { color: var(--text-muted); font-size: .75rem; line-height: 1.7; white-space: nowrap; }
        .error { padding: 2px; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
        .actions { display: flex; gap: 2px; margin-top: 2px; }
        .actions button { flex: 1; padding: .25rem; }
        .countdown { font-size: .85rem; font-weight: 600; color: var(--text-muted); font-variant-numeric: tabular-nums; }

        /* Pairing overlay — sits above the table, does not replace it */
        .pairing-overlay {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2px;
            padding: 2px;
            margin-bottom: 2px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: .85rem;
        }
        .pairing-overlay.active {
            border-color: var(--accent, #0d6efd);
            box-shadow: 0 0 0 1px var(--accent, #0d6efd), 0 0 8px rgba(13, 110, 253, 0.25);
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
        .pairing-beserk {
            flex: 0 0 auto;
            padding: .35rem .5rem;
        }
        .pairing-beserk[aria-pressed="true"] {
            background: #fd7e14;
            border-color: #fd7e14;
            color: #fff;
            box-shadow: 0 0 0 1px rgba(253, 126, 20, 0.35);
        }
        .pairing-beserk[aria-pressed="true"]:hover {
            background: #e96b02;
            border-color: #e96b02;
        }
        .panel-heading { display: flex; align-items: center; gap: 2px; }
        .panel-heading .title { flex: 1; }
    `];constructor(){super(),this.arenaId="",this.lobby=null,this.theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",this._arena=null,this._leaderboard=[],this._onlineUsers=[],this._busy=!1,this._theme=this.theme,document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme,this._lobby=null,this._lobbyWired=!1,this._error="",this._timer=null,this._staleRefetchDone=!1,this._lastLoadedArenaId=null,this._pairingState=null,this._pairingCountdown=ct,this._pairedName="",this._beserk=!1,this._pairingInterval=null,this._pairingTimeout=null,this._pendingArenaChallenge=null}connectedCallback(){super.connectedCallback(),this._load(),this.lobby&&this._setupLobby(),this._timer=setInterval(()=>{this._arena&&this.requestUpdate()},1e3)}updated(e){e.has("lobby")&&this.lobby&&this._setupLobby(),e.has("arenaId")&&this.arenaId&&this.arenaId!==this._lastLoadedArenaId&&this._load()}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),this._cancelPairing(),this._pendingArenaChallenge=null,this._lobbyWired=!1,super.disconnectedCallback()}_isExpired(){return!!(this._arena&&this._arena.endTime&&Date.now()>=this._arena.endTime)}get _localCustom(){let e=m.getCustom();return(e.emoji===void 0||e.emoji===null)&&this._onlineUsers.find(s=>s.userId===m.clientId)?.meta?.country==="BOT"?{...e,emoji:"\u{1F916}"}:e}_getCountdownText(){if(!this._arena||!this._arena.endTime)return"";let e=Math.max(0,this._arena.endTime-Date.now());if(e<=0||this._arena.status==="finished")return"00:00";let t=Math.floor(e/1e3),s=Math.floor(t/60),i=t%60;if(s>=60){let r=Math.floor(s/60),a=s%60;return`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`}return`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_setupLobby(){!this.lobby||this._lobbyWired||(this._lobby=this.lobby,this._lobbyWired=!0,this._syncArenaPresence(),this._lobby.onUsersChange(e=>{this._onlineUsers=[...e,{userId:m.clientId,userName:m.userName,custom:this._localCustom}],this._checkStaleArenaPresence()}),this._lobby.onChallenge(e=>{e.type==="offer"?this._handleIncomingChallenge(e):this._handleArenaChallengeMessage(e)}))}async _handleIncomingChallenge(e){if(e.type!=="offer"||e.challengeeId!==m.clientId)return;let t=this._pairingState==="counting";if(this._cancelPairing(),!this._arena?.players?.some(i=>i.playerId===m.clientId&&i.active!==!1)||e.options?.tournamentId!==this.arenaId){t&&this.requestUpdate();return}await this._acceptArenaChallenge(e)}_handleArenaChallengeMessage(e){let t=this._pendingArenaChallenge;if(!t||e.challengerId!==m.clientId||e.challengeeId!==t.opponentId)return;if(e.type==="decline"||e.type==="cancel"){this._pendingArenaChallenge=null;return}if(e.type!=="accept")return;if(!t.tableId){t.earlyAccept=e;return}if(e.tableId!==t.tableId)return;this._pendingArenaChallenge=null;let s=e.ruleType||t.ruleType,i=e.options||t.options,r=e.nextTurnId?e.nextTurnId===m.clientId:!0,a=z({tableId:e.tableId,userId:m.clientId,userName:m.userName,ruleType:s,isFirst:r,options:i,localOptions:t.beserk?{beserk:"true"}:void 0,lod:m.lod,flip:m.flip,custom:this._localCustom,opponent:{userId:t.opponentId,userName:t.opponentName,custom:t.opponentCustom}});window.location.href=a}async _acceptArenaChallenge(e){if(!this._lobby)return;let t=e.ruleType||this._arena?.ruleType||"nineball",s=e.options||this._arena?.options||{};try{await this._lobby.acceptChallenge(e.challengerId,t,e.tableId,s,e.challengerName,void 0,this._localCustom)}catch(a){console.error("Arena auto-accept failed:",a);return}let i=e.nextTurnId?e.nextTurnId===m.clientId:!1,r=z({tableId:e.tableId,userId:m.clientId,userName:m.userName,ruleType:t,isFirst:i,options:s,localOptions:this._beserk?{beserk:"true"}:void 0,lod:m.lod,flip:m.flip,custom:this._localCustom,opponent:{userId:e.challengerId,userName:e.challengerName||"",custom:e.custom}});window.location.href=r}async _load(){if(this.arenaId){this._busy=!0,this._error="";try{let e=await fetch(`${ps}/api/arena/${encodeURIComponent(this.arenaId)}`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arena (${e.status})`);this._arena=t.arena,this._leaderboard=t.leaderboard||[],this.arenaId!==this._lastLoadedArenaId&&(this._staleRefetchDone=!1,this._lastLoadedArenaId=this.arenaId),await this._syncArenaPresence(),this._checkStaleArenaPresence()}catch(e){this._error=e.message||"Unable to load Arena."}finally{this._busy=!1}}}async _join(){let e=(m.userName||"").trim();if(/^(anonymous|anon)$/i.test(e)){window.alert("You must change name, Anonymous is not a valid arena name");return}await this._mutate("join",{playerId:m.clientId,name:e})}async _leave(){if(this._cancelPairing(),this._lobby)try{await this._lobby.updatePresence({arenaId:void 0})}catch(e){console.error("Failed to clear arena presence:",e)}await this._mutate("leave",{playerId:m.clientId})}async _syncArenaPresence(){if(!this._lobby||!this._arena)return;let e=this._arena.players?.find(t=>t.playerId===m.clientId);try{await this._lobby.updatePresence({arenaId:e?.active!==!1&&e?this.arenaId:void 0})}catch(t){console.error("Failed to update Arena presence:",t)}}_checkStaleArenaPresence(){if(!this._arena||!this._lobby)return;this._onlineUsers.some(t=>t.userId!==m.clientId&&t.arenaId===this.arenaId&&!this._arena.players?.some(s=>s.playerId===t.userId))&&this._refetchStaleArenaOnce()}_refetchStaleArenaOnce(){this._staleRefetchDone||this._busy||(this._staleRefetchDone=!0,this._load())}async _mutate(e,t){this._busy=!0,this._error="";try{let s=await fetch(`${ps}/api/arena/${encodeURIComponent(this.arenaId)}/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),i=await s.json();if(!s.ok)throw new Error(i.error||`${e} failed (${s.status})`);await this._load()}catch(s){this._error=s.message||`Unable to ${e} Arena.`,this._busy=!1}}_getPairingCandidates(){let e=m.clientId,t=[],s=[],i=[];for(let r of this._leaderboard){if(r.playerId===e)continue;let a=lt(r.playerId),c=this._arena?.players?.find(u=>u.playerId===r.playerId),l=this._onlineUsers.find(u=>u.userId===r.playerId),h=!a&&!!l?.tableId,d=c?.active!==!1&&(a||!!(l&&!h)),p={playerId:r.playerId,name:r.name,playing:h,bot:a,available:d};i.push(p),d&&(a?s.push(r):t.push(r))}return{candidates:t.length>0?t:s,diagnostics:i}}_findEligibleOpponents(){return this._getPairingCandidates().candidates}_startPairing(){this._pairingState!=="counting"&&(this._pairingState="counting",this._pairingCountdown=this._getPairingCandidates().candidates.some(e=>!lt(e.playerId))?Ds:ct,this._pairedName="",this._pairingInterval=setInterval(()=>this._onPairingTick(),1e3))}_cancelPairing(){this._pairingInterval&&(clearInterval(this._pairingInterval),this._pairingInterval=null),this._pairingTimeout&&(clearTimeout(this._pairingTimeout),this._pairingTimeout=null),this._pairingState=null,this._pairingCountdown=ct,this._pairedName="",this._beserk=!1}_onPairingTick(){let e=this._arena,t=m.clientId,s=e?.players?.some(r=>r.playerId===t&&r.active!==!1),i=e?.status==="active"&&Date.now()<(e?.endTime||0);if(!s||!i){this._cancelPairing();return}if(this._pairingCountdown-=1,this._pairingCountdown<=0){clearInterval(this._pairingInterval),this._pairingInterval=null,this._executePairing();return}this.requestUpdate()}_getOpponentHistory(){if(!this.arenaId)return[];try{let e=localStorage.getItem(`arena_opponents_${this.arenaId}`);return e?JSON.parse(e):[]}catch{return[]}}_recordOpponentHistory(e){if(!(!this.arenaId||!e))try{let t=this._getOpponentHistory();t.push(e),t.length>10&&t.shift(),localStorage.setItem(`arena_opponents_${this.arenaId}`,JSON.stringify(t))}catch(t){console.error("Failed to save opponent history:",t)}}async _executePairing(){let e=this._beserk;this._beserk=!1;let{candidates:t,diagnostics:s}=this._getPairingCandidates();if(t.length===0){console.log("[Arena pairing]",{candidates:s,choice:null}),this._pairingState="no-opponent",this._pairingTimeout=setTimeout(()=>this._cancelPairing(),us);return}let i=this._getOpponentHistory(),r={};for(let d of i)r[d]=(r[d]||0)+1;let a=1/0;for(let d of t){let p=r[d.playerId]||0;p<a&&(a=p)}let c=t.filter(d=>(r[d.playerId]||0)===a),l=c[Math.floor(Math.random()*c.length)];this._recordOpponentHistory(l.playerId);let h=s.find(d=>d.playerId===l.playerId);console.log("[Arena pairing]",{candidates:s,choice:h}),this._pairedName=l.name,this._pairingState="paired";try{await this._initiateChallenge(l,e)}catch(d){console.error("Pairing challenge failed:",d)}this._pairingTimeout=setTimeout(()=>this._cancelPairing(),us)}async _initiateChallenge(e,t=this._beserk){let s=this._arena,i=s?.ruleType||"nineball",r=s?.options||{},a=s?.id||"";if(lt(e.playerId)){let h=Hs[e.playerId]||e.name,d="arena-bot-"+Math.random().toString(36).slice(2,8),p=z({tableId:d,userId:m.clientId,userName:m.userName,ruleType:i,isFirst:!0,options:r,bot:h,lod:m.lod,custom:this._localCustom,opponent:{userId:e.playerId,userName:e.name,custom:e.custom},flip:m.flip,localOptions:t?{beserk:"true"}:void 0});window.location.href=p+`&tournamentId=${encodeURIComponent(a)}`;return}if(!this._lobby){console.error("Pairing: no lobby connection");return}let c={...r,tournamentId:a},l={opponentId:e.playerId,opponentName:e.name,opponentCustom:e.custom||this._onlineUsers.find(h=>h.userId===e.playerId)?.custom,ruleType:i,options:c,beserk:t,tableId:null,earlyAccept:null};this._pendingArenaChallenge=l;try{let h=await this._lobby.challenge(e.playerId,i,c,void 0,this._localCustom);if(l.tableId=h,l.earlyAccept){let d=l.earlyAccept;l.earlyAccept=null,this._handleArenaChallengeMessage(d)}}catch(h){throw this._pendingArenaChallenge===l&&(this._pendingArenaChallenge=null),h}}_renderPairingOverlay(){return this._pairingState==="counting"?o`
                <div class="pairing-overlay active" role="status" aria-live="polite">
                    <div class="pairing-tick" aria-label="Seconds remaining: ${this._pairingCountdown}">${this._pairingCountdown}</div>
                    <div class="pairing-label">Pairing…</div>
                    <div class="pairing-hint">Finding an opponent</div>
                    <button class="pairing-beserk" type="button" aria-pressed=${this._beserk} @click=${()=>{this._beserk=!this._beserk}}>Beserk 🚀</button>
                    <button type="button" @click=${this._cancelPairing}>Cancel</button>
                </div>`:this._pairingState==="paired"?o`
                <div class="pairing-overlay active" role="status" aria-live="assertive">
                    <div class="pairing-result">Paired with ${this._pairedName}</div>
                </div>`:this._pairingState==="no-opponent"?o`
                <div class="pairing-overlay" role="status" aria-live="assertive">
                    <div class="pairing-result">No available opponents</div>
                </div>`:null}render(){let e=this._arena,t=m.clientId,s=e?.players?.find(p=>p.playerId===t),i=!!s,r=s?.active!==!1,a=this._isExpired(),c=e?.status==="active"&&!a,l=i&&r&&c&&this._pairingState===null,h=this._pairingState!==null,d=this._renderPairingOverlay();return o`<div class="container">
            ${this._error?o`<div class="error" role="alert">${this._error}</div>`:""}
            ${!e&&!this._error?o`<section class="panel"><div class="empty">Loading Arena…</div></section>`:""}
            ${e?o`
                <section class="panel">
                    <div class="panel-heading">
                        <h2 class="title">${a?"Arena complete":"Arena"} ${I(e.ruleType)}</h2>
                    </div>
                    <div class="meta">
                        Status: ${a?"complete":e.status} · ${e.durationMinutes} minutes · ${e.players.length} participant${e.players.length===1?"":"s"} · ${a?"Ended":"Ends"}: ${new Date(e.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}
                    </div>
                    ${a?"":o`<div class="actions">
                        <button type="button" ?disabled=${this._busy||h} @click=${this._load}>Refresh</button>
                        ${i&&r?o`<button class="btn-leave" type="button" ?disabled=${this._busy} @click=${this._leave}>Leave Arena</button>`:o`<button class="btn-accept" type="button" ?disabled=${this._busy||!c} @click=${this._join}>Join Arena</button>`}
                        ${l?o`<button class="btn-challenge" type="button" @click=${this._startPairing}>Pair</button>`:""}
                    </div>`}
                </section>
                <section class="panel">
                    ${d}
                    <arena-leaderboard
                        .standings=${this._leaderboard}
                        .players=${e.players}
                        .onlineUsers=${this._onlineUsers}
                        .expired=${a}
                        countdown=${this._getCountdownText()}
                    ></arena-leaderboard>
                </section>`:""}
        </div>`}};customElements.define("arena-view",dt);var ht=class extends f{static properties={arenaId:{type:String},lobby:{type:Object},theme:{type:String,reflect:!0}};static styles=[k,v,b`
        :host { display: block; }
        .panel-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 0;
            margin-bottom: 2px;
        }
        .manage-link {
            font-size: .75rem;
            color: var(--text-muted);
            text-decoration: none;
        }
        .manage-link:hover {
            text-decoration: underline;
            color: var(--text);
        }
        .btn-close {
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 4px;
            color: var(--text);
            cursor: pointer;
            padding: .15rem .4rem;
            font: inherit;
            font-size: .8rem;
        }
        .btn-close:hover {
            background: var(--surface-hover, rgba(255, 255, 255, 0.08));
        }
        .content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
    `];constructor(){super(),this.arenaId="",this.lobby=null,this.theme=""}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return o`
            <div class="panel-bar">
                <a class="manage-link" href="arena.html">Manage Arenas ↗</a>
                <button type="button" class="btn-close" @click=${this._close} aria-label="Close Arena">✕ Close</button>
            </div>
            <div class="content">
                <arena-view .arenaId=${this.arenaId} .lobby=${this.lobby} .theme=${this.theme}></arena-view>
                <arena-chat .arenaId=${this.arenaId}></arena-chat>
            </div>
        `}};customElements.define("arena-panel",ht);var pt=class extends f{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_sidebarOpen:{type:Boolean},_activeArenaId:{state:!0},_lobby:{state:!0}};static styles=zt;constructor(){super(),console.log("URL:",window.location.href),console.log("Search params:",Object.fromEntries(new URLSearchParams(window.location.search))),this._theme=document.documentElement.getAttribute("theme")||"light",this._sidebarOpen=!1;let e=new URLSearchParams(window.location.search);this._activeArenaId=e.get("tournamentId")||e.get("arenaId")||e.get("arena")||null,this._lobby=null,this.addEventListener("user-list-toggle",t=>{this._sidebarOpen=t.detail.expanded}),this.addEventListener("arena-select",t=>{this._activeArenaId=t.detail.arenaId;let s=new URL(window.location.href);s.searchParams.set("tournamentId",t.detail.arenaId),window.history.replaceState({},"",s.pathname+s.search),this.updateComplete.then(()=>{this.shadowRoot.querySelector(".arenas-row")?.scrollIntoView({behavior:"smooth",block:"nearest"})})}),this.addEventListener("lobby-ready",t=>{this._lobby=t.detail}),window.addEventListener("popstate",()=>{let t=new URLSearchParams(window.location.search),s=t.get("tournamentId")||t.get("arenaId")||t.get("arena")||null;s!==this._activeArenaId&&(this._activeArenaId=s)})}firstUpdated(){this._activeArenaId&&this.shadowRoot.querySelector(".arenas-row")?.scrollIntoView({behavior:"smooth",block:"start"})}_closeArenaPanel=()=>{this._activeArenaId=null;let e=new URL(window.location.href);(e.searchParams.has("tournamentId")||e.searchParams.has("arenaId")||e.searchParams.has("arena"))&&(e.searchParams.delete("tournamentId"),e.searchParams.delete("arenaId"),e.searchParams.delete("arena"),window.history.replaceState({},"",e.pathname+(e.search?e.search:"")))};get _ctrl(){return this.shadowRoot.querySelector("online-panel")}render(){return o`
            <div class="container">
                <header class="topbar">
                    <img src="assets/threecushion.png" class="logo" alt="Billiards Logo">
                    <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a><span class="version">${pe(he)}</span></h1>
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
                    <div class="arenas-row panel ${this._activeArenaId?"arena-details":""}">
                        ${this._activeArenaId?o`<arena-panel
                                .arenaId=${this._activeArenaId}
                                .lobby=${this._lobby||this._ctrl?.lobby}
                                .theme=${this._theme}
                                @close=${this._closeArenaPanel}
                              ></arena-panel>`:o`<active-arenas selectable></active-arenas>`}
                    </div>
                    <div class="info-row"><info-panel></info-panel></div>
                </main>
                <footer style="text-align:center;font-size:0.7rem;opacity:0.7;padding:0.5rem 0">
                    Thanks for playing at <a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" style="color:inherit">tailuge/billiards</a>. Stick around and challenge online for a free game or two.
                </footer>
            </div>
        `}};customElements.define("lobby-app",pt);})();
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
