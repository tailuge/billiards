"use strict";(()=>{var oe=globalThis,le=oe.ShadowRoot&&(oe.ShadyCSS===void 0||oe.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Ge=Symbol(),Mt=new WeakMap,V=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(le&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Mt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Mt.set(t,e))}return e}toString(){return this.cssText}},Rt=n=>new V(typeof n=="string"?n:n+"",void 0,Ge),f=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new V(t,n,Ge)},Ut=(n,e)=>{if(le)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=oe.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},Ye=le?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Rt(t)})(n):n;var{is:qs,defineProperty:Ws,getOwnPropertyDescriptor:Vs,getOwnPropertyNames:Ks,getOwnPropertySymbols:Qs,getPrototypeOf:Xs}=Object,ce=globalThis,Ot=ce.trustedTypes,Zs=Ot?Ot.emptyScript:"",ei=ce.reactiveElementPolyfillSupport,K=(n,e)=>n,Je={toAttribute(n,e){switch(e){case Boolean:n=n?Zs:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Dt=(n,e)=>!qs(n,e),jt={attribute:!0,type:String,converter:Je,reflect:!1,useDefault:!1,hasChanged:Dt};Symbol.metadata??=Symbol("metadata"),ce.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=jt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Ws(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:r}=Vs(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let l=i?.call(this);r?.call(this,a),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??jt}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let e=Xs(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let t=this.properties,s=[...Ks(t),...Qs(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Ye(i))}else e!==void 0&&t.push(Ye(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ut(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:Je).toAttribute(t,s.type);this._$Em=e,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Je;this._$Em=i;let l=a.fromAttribute(t,r.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(e!==void 0){let a=this.constructor;if(i===!1&&(r=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??Dt)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),r!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:a}=r,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,r,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[K("elementProperties")]=new Map,A[K("finalized")]=new Map,ei?.({ReactiveElement:A}),(ce.reactiveElementVersions??=[]).push("2.1.2");var We=globalThis,zt=n=>n,de=We.trustedTypes,Ht=de?de.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ve="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ke="?"+P,ti=`<${Ke}>`,O=document,X=()=>O.createComment(""),Z=n=>n===null||typeof n!="object"&&typeof n!="function",Qe=Array.isArray,qt=n=>Qe(n)||typeof n?.[Symbol.iterator]=="function",qe=`[ 	
\f\r]`,Q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Bt=/-->/g,Ft=/>/g,R=RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Gt=/'/g,Yt=/"/g,Wt=/^(?:script|style|textarea|title)$/i,Xe=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),o=Xe(1),an=Xe(2),on=Xe(3),C=Symbol.for("lit-noChange"),x=Symbol.for("lit-nothing"),Jt=new WeakMap,U=O.createTreeWalker(O,129);function Vt(n,e){if(!Qe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ht!==void 0?Ht.createHTML(e):e}var Kt=(n,e)=>{let t=n.length-1,s=[],i,r=e===2?"<svg>":e===3?"<math>":"",a=Q;for(let l=0;l<t;l++){let c=n[l],d,h,p=-1,m=0;for(;m<c.length&&(a.lastIndex=m,h=a.exec(c),h!==null);)m=a.lastIndex,a===Q?h[1]==="!--"?a=Bt:h[1]!==void 0?a=Ft:h[2]!==void 0?(Wt.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=R):h[3]!==void 0&&(a=R):a===R?h[0]===">"?(a=i??Q,p=-1):h[1]===void 0?p=-2:(p=a.lastIndex-h[2].length,d=h[1],a=h[3]===void 0?R:h[3]==='"'?Yt:Gt):a===Yt||a===Gt?a=R:a===Bt||a===Ft?a=Q:(a=R,i=void 0);let g=a===R&&n[l+1].startsWith("/>")?" ":"";r+=a===Q?c+ti:p>=0?(s.push(d),c.slice(0,p)+Ve+c.slice(p)+P+g):c+P+(p===-2?l:g)}return[Vt(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},ee=class n{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,a=0,l=e.length-1,c=this.parts,[d,h]=Kt(e,t);if(this.el=n.createElement(d,s),U.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=U.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(Ve)){let m=h[a++],g=i.getAttribute(p).split(P),v=/([.?@])?(.*)/.exec(m);c.push({type:1,index:r,name:v[2],strings:g,ctor:v[1]==="."?pe:v[1]==="?"?ue:v[1]==="@"?me:D}),i.removeAttribute(p)}else p.startsWith(P)&&(c.push({type:6,index:r}),i.removeAttribute(p));if(Wt.test(i.tagName)){let p=i.textContent.split(P),m=p.length-1;if(m>0){i.textContent=de?de.emptyScript:"";for(let g=0;g<m;g++)i.append(p[g],X()),U.nextNode(),c.push({type:2,index:++r});i.append(p[m],X())}}}else if(i.nodeType===8)if(i.data===Ke)c.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(P,p+1))!==-1;)c.push({type:7,index:r}),p+=P.length-1}r++}}static createElement(e,t){let s=O.createElement("template");return s.innerHTML=e,s}};function j(n,e,t=n,s){if(e===C)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,r=Z(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=j(n,i._$AS(n,e.values),i,s)),e}var he=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??O).importNode(t,!0);U.currentNode=i;let r=U.nextNode(),a=0,l=0,c=s[0];for(;c!==void 0;){if(a===c.index){let d;c.type===2?d=new F(r,r.nextSibling,this,e):c.type===1?d=new c.ctor(r,c.name,c.strings,this,e):c.type===6&&(d=new ge(r,this,e)),this._$AV.push(d),c=s[++l]}a!==c?.index&&(r=U.nextNode(),a++)}return U.currentNode=O,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},F=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=x,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=j(this,e,t),Z(e)?e===x||e==null||e===""?(this._$AH!==x&&this._$AR(),this._$AH=x):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):qt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==x&&Z(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=ee.createElement(Vt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let r=new he(i,this),a=r.u(this.options);r.p(t),this.T(a),this._$AH=r}}_$AC(e){let t=Jt.get(e.strings);return t===void 0&&Jt.set(e.strings,t=new ee(e)),t}k(e){Qe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let r of e)i===t.length?t.push(s=new n(this.O(X()),this.O(X()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=zt(e).nextSibling;zt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=x,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=x}_$AI(e,t=this,s,i){let r=this.strings,a=!1;if(r===void 0)e=j(this,e,t,0),a=!Z(e)||e!==this._$AH&&e!==C,a&&(this._$AH=e);else{let l=e,c,d;for(e=r[0],c=0;c<r.length-1;c++)d=j(this,l[s+c],t,c),d===C&&(d=this._$AH[c]),a||=!Z(d)||d!==this._$AH[c],d===x?e=x:e!==x&&(e+=(d??"")+r[c+1]),this._$AH[c]=d}a&&!i&&this.j(e)}j(e){e===x?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},pe=class extends D{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===x?void 0:e}},ue=class extends D{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==x)}},me=class extends D{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=j(this,e,t,0)??x)===C)return;let s=this._$AH,i=e===x&&s!==x||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==x&&(s===x||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ge=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){j(this,e)}},Qt={M:Ve,P,A:Ke,C:1,L:Kt,R:he,D:qt,V:j,I:F,H:D,N:ue,U:me,B:pe,F:ge},si=We.litHtmlPolyfillSupport;si?.(ee,F),(We.litHtmlVersions??=[]).push("3.3.2");var Xt=(n,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let r=t?.renderBefore??null;s._$litPart$=i=new F(e.insertBefore(X(),r),r,void 0,t??{})}return i._$AI(n),i};var Ze=globalThis,b=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Xt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return C}};b._$litElement$=!0,b.finalized=!0,Ze.litElementHydrateSupport?.({LitElement:b});var ii=Ze.litElementPolyfillSupport;ii?.({LitElement:b});(Ze.litElementVersions??=[]).push("4.2.2");var te=f`
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
`,_n=f`
    :host { font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
`,_=f`
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
`,Zt=f`
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
`,es=f`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,ts=f`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,G=f`
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
    }`,fe=f`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,ss=f`
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
`,is=f`
    :host { display: block; font-family: 'Exo', 'Exo Fallback', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,ns=f`
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
`,rs=f`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,as=[te,f`
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
`];var ye=1302,ve=n=>`v${Math.floor(n/100)}.${String(n%100).padStart(2,"0")}`,Y="https://scoreboard-tailuge.vercel.app",z=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",se=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),ie=se?`ws://${window.location.hostname}:80`:`wss://${z}`,os=se?"./active.html":"https://billiards-network.onrender.com/active.html",I=se?"":"https://billiards-network.onrender.com",k=typeof window<"u"&&window.location.hostname.includes("vercel"),xe=250,et=new Map;function _e(n){if(!n)return Promise.resolve(null);let e=et.get(n);if(e)return e;let t=fetch(`${I}/api/arena/${encodeURIComponent(n)}`).then(s=>s.json().then(i=>{if(!s.ok){let r=new Error(i.error||`Unable to load Arena (${s.status})`);throw r.status=s.status,r}return i})).finally(()=>et.delete(n));return et.set(n,t),t}var ls=n=>{let e=Math.floor((Date.now()-n)/1e3);if(e<60)return`${e}s ago`;let t=Math.floor(e/60);if(t<60)return`${t}m ago`;let s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`},cs={connected:!1,users:[],challenges:{},currentMatch:null};function ds(n,e){let t={...n.challenges},s=i=>i.challengerId===e.myId?i.challengeeId:i.challengerId;switch(e.type){case"CONNECTED":return{...n,connected:e.payload};case"SETTLED":return{...n,settled:e.payload};case"USERS_UPDATE":return{...n,users:e.payload};case"CHALLENGE_SENT":return{...n,challenges:{...t,[e.payload.challengeeId]:{...e.payload,status:"pending"}}};case"CHALLENGE_MSG":{let i=e.payload,r=s(i);if(i.type==="offer"){if(n.currentMatch)return n;let a=t[i.challengerId];if(a&&a.challengerId===e.myId&&a.status==="pending"&&e.myId>i.challengerId)return n;(!t[i.challengerId]||t[i.challengerId].tableId!==i.tableId)&&(t[i.challengerId]={...i,status:"pending"})}else if(i.type==="accept"&&!n.currentMatch){let a=t[r];if(!a||a.tableId!==i.tableId)return n;let l=i.options||a.options,c=i.nextTurnId||a.nextTurnId,d=e.myId===i.challengerId,h=d?i.challengeeId:i.challengerId,p=d?i.custom||{}:a.custom||{},m=d?a.recipientName:a.challengerName;return delete t[r],{...n,challenges:t,currentMatch:{tableId:i.tableId,ruleType:i.ruleType,options:l,isFirst:c===i.challengerId||c===i.challengeeId?c===e.myId:i.challengerId===e.myId,opponentId:h,opponentName:m,opponentCustom:p}}}else i.type==="decline"?t[i.challengeeId]&&(t[i.challengeeId]={...t[i.challengeeId],status:"declined"}):i.type==="cancel"&&delete t[s(i)];return{...n,challenges:t}}case"CHALLENGE_DISMISS":return delete t[e.payload],{...n,challenges:t};default:return n}}function st(n="",e="",t="",s={},i=void 0){let r={bot:{emoji:"\u{1F916}",title:"bot"},nineball:{emoji:"\u2468",title:"nineball"},eightball:{emoji:"\u{1F3B1}",title:"eightball"},snooker:{emoji:"\u{1F534}",title:"snooker"},threecushion:{emoji:"\u2462",title:"threecushion"},sagu:{emoji:"\u2463",title:"sagu"},reveal:{emoji:"\u{1F0A1}",title:"reveal"}},a=r[e],l=["5","6"].includes(String(s?.tableSize)),c=!!s?.freeaim,d=h=>{if(!l&&!c)return h;let p=h.emoji+(l?"\u{1F37C}":"")+(c?"\u2316":""),m=[l&&"mini",c&&"freeaim"].filter(Boolean).join(" ");return{emoji:p,title:m}};if(i)return{emoji:"\u2694\uFE0F",title:"arena"};if(t==="spectating")return{emoji:"\u{1F52D}",title:"spectator"};if(t==="playing")return d(a??{emoji:"\u{1F3AE}",title:"playing"});if(t==="available"&&e==="replay")return{emoji:"\u{1F440}",title:"replay"};if(a)return n.includes("veli")?d({emoji:"\u{1F393}",title:"study"}):n.includes("github")?d({emoji:a.emoji+"\u{1F419}",title:"github"}):n.includes("localhost")?d({emoji:a.emoji+"\u{1F3E0}",title:"localhost"}):d(a);if(e.includes("-bot")){let h=r[e.replace("-bot","")];if(h)return d({emoji:h.emoji+"\u{1F916}",title:"bot"})}if(e.includes("-exam")){let h=r[e.replace("-exam","")];if(h)return d({emoji:h.emoji+"\u{1F4DC}",title:"exam"})}if(e.includes("-speedrun")){let h=r[e.replace("-speedrun","")];if(h)return d({emoji:h.emoji+"\u{1F45F}",title:"speedrun"})}if(e.includes("-club")){let h=r[e.replace("-club","")];if(h)return d({emoji:h.emoji+"\u26E9\uFE0F",title:"club"})}if(e.includes("map")){let h=r[e.replace("map","").replace(/-$/,"")];return d({emoji:(h?h.emoji:"")+"\u26E9\uFE0F",title:"map"})}return n.startsWith("/")||n.includes("workers")?{emoji:"\u{1F464}",title:"vercel"}:n.includes("github")?{emoji:"\u{1F419}",title:"github"}:n.includes("vercel")?{emoji:"\u{1F465}",title:"vercel"}:n.includes("localhost")?{emoji:"\u{1F3E0}",title:"localhost"}:r[e]??{emoji:"\u{1F3AE}",title:"external"}}var E=n=>{if(n==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!n)return{emoji:"\u{1F310}",title:""};let e=n.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},it=se?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/",be=(n,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,n):n,hs=(n,e,t)=>{for(let[s,i]of Object.entries(n)){let r=e?`${e}.${encodeURIComponent(s)}`:encodeURIComponent(s);i&&typeof i=="object"&&!Array.isArray(i)?hs(i,r,t):i!=null&&t.push(`${r}=${encodeURIComponent(i)}`)}return t},tt=(n,e,t)=>e&&typeof e=="object"?hs(e,t,[]).reduce((s,i)=>s+`&${i}`,n):n,ps=(n,e,t,s,i,r)=>{if(n.absolute)return n.url;let a=n.url?`${n.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:`${it}?ruletype=${n.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`;return se&&(a+=`&lobbyUrl=${ie}`),i&&(a+="&flip=true"),a=tt(a,r,"custom"),n.url?a:be(a,n.options)},H=({tableId:n,userId:e,userName:t,ruleType:s,isFirst:i,options:r,localOptions:a,bot:l,lod:c,flip:d,custom:h,opponent:p})=>{let m=`${it}?websocketserver=${ie}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}`;return l||(m+=`&tableId=${n}`),i&&(m+="&first=true"),l&&(m+=`&bot=${encodeURIComponent(l)}`),c!==void 0&&(m+=`&lod=${c}`),d&&(m+="&flip=true"),m=be(m,r),m=be(m,a),m=tt(m,h,"custom"),p?.userId&&(m+=`&opponent.userId=${encodeURIComponent(p.userId)}&opponent.userName=${encodeURIComponent(p.userName||"")}`,m=tt(m,p.custom,"opponent.custom")),m},us=({tableId:n,userId:e,userName:t,ruleType:s,options:i})=>{let r=`${it}?websocketserver=${ie}&tableId=${n}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}&spectator=true`;return be(r,i)};var ni={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},ri={eightball:"\u{1F3B1}",snooker:"\u{1F534}",threecushion:"\u2462",nineball:"\u2468",sagu:"\u2463"},ai={"-club":"\u26E9\uFE0F","-bot":"\u{1F916}","-exam":"\u{1F4DC}","-speedrun":"\u{1F45F}"},L=n=>{if(n==="reveal")return o`<span title="reveal" aria-label="reveal">\u{1F0A1}</span>`;for(let[t,s]of Object.entries(ai))if(n.endsWith(t)){let i=n.slice(0,-t.length),r=ri[i];if(r)return o`<span title="${n}" aria-label="${n}">${r}${s}</span>`}let e=ni[n];return e?o`<img src="assets/${e}.png" alt="${n}" title="${n}" width="18" height="18" style="vertical-align:middle">`:o`🎱`},we=(n,e={})=>o`<span title="${n}">
    ${L(n)}${e?.freeaim?"\u2316":""}${Number(e?.tableSize)<10?"\u{1F37C}":""}
</span>`,$e=n=>["\u{1F3C6}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F"][n]??"",Se=n=>n?.freeaim?"\u2295":Object.values(n||{})[0],nt=(n,e,t)=>`${n}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}`;var ms=n=>{let e=(n||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},oi={ko:"\uD55C"},at=()=>{let[n,...e]=(navigator.languages?.[0]||navigator.language||"en").split("-"),t=oi[(n||"").toLowerCase()];return t?`Anon-${t}`:`Anon-${(e.find(r=>/^[A-Za-z]{2}$/.test(r))||n||"en").toUpperCase().slice(0,2)}`},gs=n=>(n||"").slice(0,4)==="Anon",rt=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();k&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),r=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,s||(this.userName=window.name.split("-")[0]);else{let l=s||r||"",c=!l||i.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&c?i:ms(l),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=s||this.userName||r||at(),this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",a=>{if(a.key==="custom"){try{this.custom=JSON.parse(a.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():ms(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},u=new rt,S=class extends b{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),u.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),u.removeEventListener("change",this._storeListener)}};var li=[{label:"Nine Ball",img:"assets/nineball.png",ruletype:"nineball"},{label:"Snooker 6r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"6",tableSize:"12"}},{label:"Snooker 10r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"10",tableSize:"12"}},{label:"3-Cushion 5ft",img:"assets/baby.png",ruletype:"threecushion",options:{raceTo:"15",tableSize:"5"}},{label:"Snooker",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"15",tableSize:"12"}},{label:"3-Cushion (7)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"7"}},{label:"Speedrun",img:"assets/speedrun.png",url:"speedrun/index.html"},{label:"3-Cushion analysis",img:"assets/drill.png",url:"https://velikodimov.github.io/billiards/dist/index.html?ruletype=threecushion&practice&drill",absolute:!0},{label:"Books",img:"assets/book.png",url:"book/index.html"},{label:"3-Cushion (30)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"30"}},{label:"Billiard collections",img:"assets/reveal.png",url:"https://billiards.tailuge.workers.dev/reveal",absolute:!0},{label:"Sagu (5)",img:"assets/sagu.png",ruletype:"sagu",options:{raceTo:"5"}},{label:"Trickshot",img:"assets/practice.png",url:"https://billiards.tailuge.workers.dev/practice"},{label:"Research",img:"assets/research.png",url:"https://billiards.tailuge.workers.dev/diagrams/three"},{label:"Eight Ball",img:"assets/eightball.png",ruletype:"eightball"},{label:"Exam",img:"assets/cert.png",url:"exam/index.html",absolute:!0}],ot=class extends S{static styles=[is,fe];#e=[...li].sort(()=>Math.random()-.5);render(){let{clientId:e,userName:t,lod:s,flip:i}=u;return o`<div class="grid">
      ${this.#e.map(r=>o` <a
            href=${ps(r,e,t,s,i,u.getCustom())}
            title=${r.label}
            aria-label="Play ${r.label}"
          >
            <span class="icon-wrap">
              <img src=${r.img} alt=${r.label} />
              ${r.options?o`<span class="badge">${Se(r.options)}</span>`:""}
            </span>
          </a>`)}
    </div>`}};customElements.define("solo-panel",ot);var lt=class extends b{static properties={url:{type:String},color:{type:String},label:{type:String},prefix:{type:String},prefixTitle:{type:String},ariaLabel:{type:String}};static styles=f`
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
            padding: 0 3px;
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
                rel="nofollow"
                aria-label=${this.ariaLabel}
                style=${e}>
                ${t}
                ${this.label?o`<span>${this.label}</span>`:""}
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </a>
        `}};customElements.define("replay-button",lt);var Ie=null,dt=()=>(Ie||(Ie=fetch(`${I}/api/arena/winners`).then(n=>n.ok?n.json():Promise.reject(new Error(String(n.status)))).then(n=>Array.isArray(n?.winners)?n.winners.filter(e=>e&&typeof e=="object"&&typeof e.userName=="string"):[]).catch(()=>(Ie=null,null))),Ie),ct=class extends S{static styles=f`
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
    `;constructor(){super(),this._trophies=[],this._trophyCheckedFor=null,this._winners=null,this._observer=null,this._idleTimer=null,this._started=!1}connectedCallback(){super.connectedCallback(),k||this._startLazy()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,this._idleTimer&&(clearTimeout(this._idleTimer),this._idleTimer=null),super.disconnectedCallback()}_startLazy(){this._started||(this._started=!0,typeof IntersectionObserver<"u"?(this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&(this._observer.disconnect(),this._observer=null,this._load())}),this._observer.observe(this)):this._whenIdle(()=>this._load()))}_whenIdle(e){typeof requestIdleCallback=="function"?requestIdleCallback(()=>e()):this._idleTimer=setTimeout(e,200)}async _load(){this._winners=await dt(),this._recheck()}_recheck(){let e=(u.userName||"").trim();if(!e||!this._winners){this._trophies.length&&(this._trophies=[],this.requestUpdate());return}if(this._trophyCheckedFor===e)return;this._trophyCheckedFor=e;let t=this._winners.filter(s=>typeof s.userName=="string"&&s.userName.trim()===e);JSON.stringify(t)!==JSON.stringify(this._trophies)&&(this._trophies=t,this.requestUpdate())}willUpdate(){this._recheck()}render(){return k||!this._trophies.length?o``:o`
            <span class="trophy-stack">
                ${this._trophies.map(e=>o`
                    <a
                        class="trophy"
                        href="lobby?arenaId=${encodeURIComponent(e.arenaId)}"
                        title="Arena winner (${e.arenaId})"
                        aria-label="Arena trophy - view arena ${e.arenaId}"
                    >🏆</a>
                `)}
            </span>
        `}};customElements.define("trophy-item",ct);var ci=6,di=3,hi=.95,pi=6,ui=14,fs=70,mi=n=>{let e=Math.max(1,Math.min(ci,Math.floor(n))),t=[];for(let i=e%2===0?e:e-1;i>=2;i-=2)t.push(i);let s=[];for(let i=3;i<=e;i+=2)s.push(i);return[...t,1,...s].map(i=>{let r=Math.min(i-1,pi),a=Math.min((i-1)*ui,fs);return{rank:i,size:`calc(${hi}rem - ${r}px)`,zIndex:e-i+1,filter:`grayscale(${a}%)`,opacity:Number((1-a/fs*.25).toFixed(2))}})},gi=n=>{let e=new Map;for(let t of n){let s=String(t.userName).trim();if(!s)continue;let i=e.get(s)||{name:s,count:0,arenaIds:[]};i.count+=1,t.arenaId&&i.arenaIds.push(String(t.arenaId)),e.set(s,i)}return[...e.values()].sort((t,s)=>s.count-t.count||t.name.localeCompare(s.name))},ht=class extends b{static properties={limit:{type:Number},_leaderboard:{state:!0},_loaded:{state:!0}};static styles=f`
        :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
        .panel-title { font-weight: bold; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-dim); text-align: center; }
        .cabinet-list { display: flex; flex-direction: column; gap: 0.1rem; }
        .cabinet-row { display: flex; align-items: center; gap: 0.3rem; padding: 0 0.2rem; border: 1px solid var(--border); border-radius: 4px; min-height: 22px; }
        .cabinet-name { flex: 0 1 auto; max-width: 45%; font-size: 0.75rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cabinet-trophies { display: flex; align-items: center; justify-content: flex-end; flex: 1 1 auto; min-width: 0; overflow: hidden; }
        .trophy { line-height: 1; user-select: none; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35); transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease; }
        a.trophy { text-decoration: none; cursor: pointer; }
        .trophy + .trophy { margin-left: calc(-0.35em - 3px); }
        .trophy:hover { transform: translateY(-2px) scale(1.25); filter: none !important; opacity: 1 !important; z-index: 100 !important; }
        .empty { color: var(--text-muted); text-align: center; padding: 0.5rem 0; font-size: 0.75rem; }
    `;constructor(){super(),this.limit=di,this._leaderboard=[],this._loaded=!1}async connectedCallback(){super.connectedCallback();let e=await dt();e&&(this._leaderboard=gi(e),this._loaded=!0)}render(){let e=this._leaderboard.slice(0,Math.max(1,this.limit));return o`
            <div class="panel-title">Trophy Cabinet</div>
            ${e.length?o`<div class="cabinet-list" aria-label="Top trophy holders">
                    ${e.map(t=>o`
                        <div class="cabinet-row" title="${t.name}: ${t.count} arena ${t.count===1?"win":"wins"}">
                            <span class="cabinet-name">${t.name}</span>
                            <span class="cabinet-trophies">
                                ${mi(t.count).map(s=>{let i=t.arenaIds[s.rank-1],r=`font-size:${s.size};z-index:${s.zIndex};filter:${s.filter};opacity:${s.opacity}`;return i?o`<a
                                            class="trophy"
                                            style="${r}"
                                            href="lobby?tournamentId=${encodeURIComponent(i)}"
                                            title="Arena winner (${i})"
                                            aria-label="Arena trophy - view arena ${i}"
                                        >🏆</a>`:o`<span class="trophy" style="${r}">🏆</span>`})}
                            </span>
                        </div>`)}
                </div>`:this._loaded?o`<div class="empty">No trophies yet</div>`:""}
        `}};customElements.define("trophy-cabinet",ht);var Ee={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ke=n=>(...e)=>({_$litDirective$:n,values:e}),J=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var ne=class extends J{constructor(e){if(super(e),this.it=x,e.type!==Ee.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===x||e==null)return this._t=void 0,this.it=e;if(e===C)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};ne.directiveName="unsafeHTML",ne.resultType=1;var bs=ke(ne);var fi=['This game is free to play and open source on <a href="https://github.com/tailuge/billiards" target="_blank">GitHub</a>',"Choose graphics settings in options menu top right.",'Masse trick shot replay: <a href="https://scoreboard-tailuge.vercel.app/api/replay/534?lod=4" rel="nofollow">here</a>.',"You can change your name by clicking on your user badge at the top right of the screen.","You can flip aim direction in options menu top right.","Invite a friend to play, share link in settings panel.","Draw lines for three cushion and positional play instruction with mouse right-click.",'Do you know <a href="https://www.youtube.com/watch?v=ArNBvY1uEUo" target="_blank">Three Cushion</a> billiards rules? The ultimate game.','Thank you for playing snooker, pool and three cushion at <a href="https://github.com/tailuge/billiards" target="_blank">tailuge/billiards</a>.',"Snooker century when?"],bi=['\uC774 \uAC8C\uC784\uC740 \uBB34\uB8CC\uB85C \uD50C\uB808\uC774\uD560 \uC218 \uC788\uC73C\uBA70 <a href="https://github.com/tailuge/billiards" target="_blank">GitHub</a>\uC5D0\uC11C \uC624\uD508 \uC18C\uC2A4\uB85C \uC81C\uACF5\uB429\uB2C8\uB2E4',"\uC624\uB978\uCABD \uC0C1\uB2E8 \uC635\uC158 \uBA54\uB274\uC5D0\uC11C \uADF8\uB798\uD53D \uC124\uC815\uC744 \uC120\uD0DD\uD558\uC138\uC694.","\uC774 \uD504\uB85C\uC81D\uD2B8\uB294 \uC785\uC18C\uBB38\uC73C\uB85C \uC131\uC7A5\uD569\uB2C8\uB2E4. \uC7AC\uBBF8\uC788\uAC8C \uC990\uAE30\uC168\uB2E4\uBA74 \uB2E4\uB978 \uB2F9\uAD6C \uC120\uC218\uC5D0\uAC8C\uB3C4 \uC54C\uB824\uC8FC\uC138\uC694.","3\uCFE0\uC158 \uB3D9\uD638\uD68C\uB098 \uC628\uB77C\uC778 \uCEE4\uBBA4\uB2C8\uD2F0\uB97C \uC54C\uACE0 \uACC4\uC2E0\uAC00\uC694? \uC774 \uC6F9\uC0AC\uC774\uD2B8\uB97C \uD568\uAED8 \uACF5\uC720\uD574 \uC8FC\uC138\uC694.","\uC0C8\uB85C\uC6B4 \uD50C\uB808\uC774\uC5B4\uAC00 \uB298\uC5B4\uB0A0\uC218\uB85D \uC628\uB77C\uC778\uC5D0\uC11C \uC0C1\uB300\uB97C \uB354 \uC27D\uAC8C \uB9CC\uB0A0 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB110\uB9AC \uC54C\uB824\uC8FC\uC154\uC11C \uAC10\uC0AC\uD569\uB2C8\uB2E4!","\uBB34\uB8CC \uC628\uB77C\uC778 3\uCFE0\uC158 \uCEE4\uBBA4\uB2C8\uD2F0\uB97C \uD568\uAED8 \uB9CC\uB4E4\uC5B4 \uC8FC\uC138\uC694. \uB3D9\uD638\uD68C\uB098 \uCE5C\uAD6C\uB4E4\uC5D0\uAC8C \uC774 \uAC8C\uC784\uC744 \uC18C\uAC1C\uD574 \uBCF4\uC138\uC694.","\uD654\uBA74 \uC6B0\uCE21 \uC0C1\uB2E8\uC758 \uC0AC\uC6A9\uC790 \uC774\uB984\uC744 \uD074\uB9AD\uD558\uC5EC \uBCC0\uACBD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."],yi=new URLSearchParams(window.location.search).get("lang")==="ko"||navigator.language.startsWith("ko"),ys=yi?bi:fi,pt=class extends b{static styles=f`
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
    `;constructor(){super(),this.msg=ys[Math.floor(Math.random()*ys.length)]}render(){return o`${bs(this.msg)}`}};customElements.define("motd-panel",pt);var vi=n=>new Date(n).toLocaleString(void 0,{dateStyle:"medium",timeStyle:"short"}),xi=n=>{let e=t=>t!=null?` ${t}`:"";return`Replay ${n.ruleType} match: ${n.winner}${e(n.winnerScore)}`+(n.loser?` vs ${n.loser}${e(n.loserScore)}`:"")+`, ${vi(n.timestamp)}`},_i=n=>typeof n.club=="string"&&n.club?o`<span role="img" title="Map challenge at ${n.club}" aria-label="Map challenge at ${n.club}">⛩️</span>`:L(n.ruleType),vs=n=>typeof n.club=="string"&&n.club?` @ ${n.club}`:"",wi=n=>typeof n.club=="string"&&n.club?o` <a class="club-link" href="./map/" title="Show ${n.club} on the map" aria-label="Show ${n.club} on the map">@</a> ${n.club}`:"",xs=n=>typeof n.card=="string"&&n.card?` \u{1F513} ${n.card}`:"",$i=n=>typeof n.card=="string"&&n.card?o` <a class="card-lock" href="./reveal/" title="Open the reveal gallery" aria-label="Open the reveal gallery">🔓</a> ${n.card}`:"",Si=n=>{let e=t=>t!=null?` (${t})`:"";return n.winner+xs(n)+vs(n)+e(n.winnerScore)+(n.loser?` vs ${n.loser}${e(n.loserScore)}`:"")},ut=class extends S{static styles=ns;connectedCallback(){if(super.connectedCallback(),k){this.classList.add("loaded");return}let e=this._fontsReady(),t=()=>e.then(()=>{this.classList.add("loaded"),this.requestUpdate()});fetch(`${I}/api/summary`,{mode:"cors"}).then(s=>s.json()).then(s=>{this._data=s,t()}).catch(()=>{this._err=!0,t()})}_fontsReady(){let e=document.fonts;return e?.load?Promise.all([e.load("200 1rem 'Exo'"),e.load("600 1rem 'Exo'")]).catch(()=>{}):Promise.resolve()}render(){return k?o`<span class="loading">We have moved <a href="https://billiards.tailuge.workers.dev/lobby">Play online here</a></span>`:o`
            <div class="top-row">
                <div class="group cabinet"><trophy-cabinet></trophy-cabinet></div>
                <div class="group hiscores">
                    <div class="group-body">${this._hiscores()}</div>
                </div>
            </div>
            <div class="group motd-row"><motd-panel></motd-panel></div>
            ${this._bottomRow()}`}_hiscores(){if(this._err)return o`<span class="loading">Could not load scores.</span>`;if(!this._data)return o`<span class="loading">Connecting to server…</span>`;let{hiscores:e}=this._data;return Object.keys(e).filter(s=>s!=="eightball"&&s!=="sagu").map(s=>o`
            <div class="tbl${s==="sagu"?" sagu-hi":""}"><table><caption><a href="${Y}/leaderboard" target="_blank" rel="noopener" style="font-weight:200;font-size:0.75rem">${L(s)} HiScore</a></caption>
            <tr><th>Name</th><th></th></tr>
                ${e[s].slice(0,4).map((i,r)=>o`<tr><td>${$e(r)} ${i.name}</td><td><replay-button url="${nt(`${Y}/api/rank/${i.id}?ruletype=${s}&lod=${u.lod}`,u.clientId,u.userName)}" label="${i.score}" .ariaLabel=${`Replay ${s} HiScore #${r+1}: ${i.name} ${i.score}`}></replay-button></td></tr>`)}
            </table></div>
        `)}_bottomRow(){if(this._err||!this._data)return"";let{hiscores:e,topPlayers:t,recentMatches:s}=this._data,i=Object.keys(e);return o`
            <div class="bottom-row">
                <div class="group recent">
                    <div class="group-body">
                        <div class="tbl"><table>
                        <tr><th>Rule</th><th>Match</th><th>Ago</th><th class="city-col">City</th><th></th></tr>
                            ${s.map(r=>o`<tr>
                                <td>${_i(r)}</td><td title="${vs(r)||xs(r)?Si(r):""}">${r.arenaId?"\u2694\uFE0F":""}${r.loser?r.tableSize!=null&&r.tableSize<10?"\u{1F37C}":"\u{1F396}\uFE0F":""}${r.freeaim===!0?"\u2316":""}${r.berserk===!0||r.berserk==="true"?"\u{1F680}":""}${r.winner}${$i(r)}${wi(r)}${r.winnerScore!=null?o`<span class="score">(${r.winnerScore})</span>`:""}${r.loser?o` vs ${r.loser}${r.loserScore!=null?o`<span class="score">(${r.loserScore})</span>`:""}`:""}</td>
                                <td class="ago">${ls(r.timestamp)}</td>
                                <td class="city-col">${r.locationCity??""}</td>
<td class="replay-col">
                                    ${r.hasReplay?o`<replay-button prefix="${E(r.locationCountry).emoji}" prefixTitle="${E(r.locationCountry).title}" .ariaLabel=${xi(r)} url="${nt(`${Y}/api/match-replay?id=${r.id}&lod=${u.lod}`,u.clientId,u.userName)}"></replay-button>`:E(r.locationCountry).emoji}
                                </td>
                            </tr>`)}
                        </table></div>
                    </div>
                </div>
                <div class="group top-players">
                    <div class="group-body">
                        ${i.map(r=>o`
                            <div class="tbl"><table><caption><a href="${Y}/elo" target="_blank" rel="noopener">${L(r)} <span style="font-size:0.75rem;font-weight:200">Rankings</span></a></caption>
                             <tr><th>Name</th><th>Score</th></tr><!-- A player can lead several rules, which repeats the trophy and
                                      name in each table, so the link name carries the rule too.
                                      Score is the conservative rating (rating - 2*RD after
                                      inactivity decay), matching the /elo page; the fallback
                                      covers an older bundled client talking to a server that
                                      predates the field. -->
                                    ${t[r].slice(0,4).map((a,l)=>o`<tr>
                                     <td><a href="${Y}/player/${encodeURIComponent(a.name)}?ruleType=${r}" aria-label="${$e(l)} ${a.name}, ${r} rankings">${$e(l)} ${a.name}</a></td>
                                     <td>${a.conservativeRating??Math.round(a.rating)}</td>
                                 </tr>`)}
                            </table></div>
                        `)}
                    </div>
                </div>
            </div>`}};customElements.define("info-panel",ut);var _s=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),re=n=>new Map([...n].map(([e,t])=>[t,e])),ws=new Map([["messageType","m"],["type","t"],["ruleType","r"],["tableId","T"],["arenaId","A"],["options","o"],["custom","z"],["seek","s"],["isSpectator","S"],["isLeaving","L"],["clientTs","c"],["nextTurnId","w"],["text","b"]]),Ii=re(ws),Ei=new Map([["userId","u"],["challengerId","u"],["senderId","u"],["userName","n"],["challengerName","n"],["challengeeId","e"],["opponentId","e"],["recipientId","e"]]),ki=new Map([["presence",new Map([["u","userId"],["n","userName"],["e","opponentId"]])],["challenge",new Map([["u","challengerId"],["n","challengerName"],["e","challengeeId"]])],["chat",new Map([["u","senderId"],["e","recipientId"]])]]),$s=new Map([["presence","p"],["challenge","c"],["chat","m"]]),Ci=re($s),Ss=new Map([["presence",new Map([["join","j"],["heartbeat","h"],["leave","l"]])],["challenge",new Map([["offer","o"],["accept","a"],["decline","d"],["cancel","x"]])]]),Ti=new Map([...Ss].map(([n,e])=>[n,re(e)])),Is=new Map([["ts","t"],["msgId","i"],["ua","u"],["origin","o"],["country","c"],["city","y"],["version","v"]]),Ai=re(Is),Es=new Map([["tableId","T"],["ruleType","r"]]),Pi=re(Es);function Li(n,e){return Object.fromEntries(Object.entries(n).map(([t,s])=>[e.get(t)??t,s]))}function Ce(n,e){return _s(n)?Li(n,e):n}function ks(n){let e=typeof n.messageType=="string"?n.messageType:void 0,t=e!==void 0?Ss.get(e):void 0,s=Object.fromEntries(Object.entries(n).map(([i,r])=>{let a=Ei.get(i)??ws.get(i)??i,l=r;return i==="meta"?l=Ce(r,Is):i==="seek"?l=Ce(r,Es):i==="messageType"?l=$s.get(r)??r:i==="type"&&(l=t?.get(r)??r),[a,l]}));return JSON.stringify(s)}function Te(n){let e;try{e=JSON.parse(n)}catch{return n}if(!_s(e))return n;let t=e.m,s=typeof t=="string"?Ci.get(t)??t:e.messageType,i=typeof s=="string"?ki.get(s):void 0,r=typeof s=="string"?Ti.get(s):void 0,a=Object.fromEntries(Object.entries(e).map(([l,c])=>{let d=i?.get(l)??Ii.get(l)??l,h=c;return l==="meta"?h=Ce(c,Ai):l==="s"?h=Ce(c,Pi):l==="m"?h=typeof t=="string"?s:c:l==="t"&&(h=r?.get(c)??c),[d,h]}));return JSON.stringify(a)}var B={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:n=>`/publish/table/${n}`,TABLE_SUBSCRIBE:n=>`/subscribe/table/${n}`},Ae=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let r=e===B.PRESENCE_PUBLISH?ks(t):JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let d=new Blob([r],{type:"application/json"});if(navigator.sendBeacon(i,d))return}let a=new AbortController,l=setTimeout(()=>a.abort(),2e4),c;try{c=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:r,keepalive:s.keepalive,signal:a.signal})}finally{clearTimeout(l)}if(!c.ok)throw new Error(`Publish failed: ${c.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages.map(Te)}async publishPresence(e,t){return this.publish(B.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(B.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(B.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(B.TABLE_PUBLISH(e),{...t,senderId:s},i)}async fetchPresenceSnapshot(){let e=new AbortController,t=setTimeout(()=>e.abort(),3e3);try{let s=await fetch(this.getHttpUrl("/api/online/presence"),{cache:"no-store",signal:e.signal});if(!s.ok)throw new Error(`Snapshot failed: ${s.status}`);let i=await s.json();return{ts:i.ts,users:i.users.map(r=>JSON.parse(Te(JSON.stringify(r))))}}finally{clearTimeout(t)}}subscribePresence(e,t){let s=`uid=${encodeURIComponent(e)}`,i=typeof document<"u"?document.referrer:"";i&&(s+=`&ref=${encodeURIComponent(i.split(/[?#]/)[0])}`);let r=`${B.PRESENCE_SUBSCRIBE}?${s}`;return this.subscribe(r,t)}subscribeTable(e,t,s,i){let r=`${B.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return i?.isSpectator&&(r+="&spectator=1"),this.subscribe(r,s)}subscribe(e,t){let s=this.getWsUrl(e),i=()=>new Date().toISOString().slice(11,23),r=null,a=!1,l=0,c=8e3,d=6e4,h=null,p=!0,m=2e4,g=null,v={stop:()=>{a=!0,h&&(clearTimeout(h),h=null),g&&(clearTimeout(g),g=null),r&&(r.close(),r=null)},ready:null},y;v.ready=new Promise($=>{y=$});let T=()=>{if(!a){if(r&&r.readyState<=WebSocket.OPEN){y();return}r=new globalThis.WebSocket(s),g&&clearTimeout(g),g=setTimeout(()=>{console.warn(`[NchanClient ${i()}] Connection to ${s} timed out after ${m}ms, forcing reconnect`),r?.close()},m),g.unref?.(),r.onmessage=$=>{let ae=$.data;this.record(ae),t(Te(ae))},r.onopen=()=>{let $=!p;p=!1,l=0,h&&(clearTimeout(h),h=null),g&&(clearTimeout(g),g=null),y(),$&&v.onReconnect&&v.onReconnect()},r.onclose=$=>{if(g&&(clearTimeout(g),g=null),!a){if(l>=10){console.error(`[NchanClient ${i()}] Max reconnect attempts reached for ${s}, giving up`);return}let ae=Math.min(Math.pow(2,l)*c,d);l++,h=setTimeout(T,ae),h.unref?.()}},r.onerror=$=>{console.error(`[NchanClient ${i()}] WebSocket error on ${s}:`,$),r&&(r.onerror=null,r?.close())}}};return T(),v}};function Cs(n){return n.type==="table:leave"&&!!n.data?.isSpectator}function Ts(n,e){return n.userId!==e&&!n.tableId&&!n.seek}function As(n,e){return!!n.tableId&&!n.isSpectator&&n.tableId!==e}function Pe(n){return n.tableId?n.isSpectator?"spectating":"playing":"available"}function Le(n){let e=new Map;for(let t of n)t.tableId&&(e.has(t.tableId)||e.set(t.tableId,{tableId:t.tableId,players:[],ruleType:t.ruleType}),e.get(t.tableId).players.push({id:t.userId,name:t.userName}));return Array.from(e.values())}function Ne(n){if(!n||n.trim()==="")return null;try{return JSON.parse(n)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function Ps(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var Ls=250,Me=class n{static dedupeChallenges(e){let t=new Set;for(let s of e)s.type!=="offer"&&t.add(n.interactionKey(s));return e.filter(s=>s.type!=="offer"?!0:!t.has(n.interactionKey(s)))}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var Re=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.isJoining=!1;this.settledListeners=[];this.isSettled=!1;this.joinBufferedPresence=[];this.unsettledChallengeMessages=[];this.heartbeatInterval=s.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(this.isJoined)return;this.isJoining=!0,this.subscription=this.nchan.subscribePresence(this.currentUser.userId,s=>{this.handleIncomingMessage(s)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).then(()=>this.refreshSnapshot()).catch(s=>{console.error("Failed to re-broadcast presence on reconnect:",s)})},await this.subscription.ready;for(let s=1;;s++)try{await this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()});break}catch(i){let r=Math.min(Math.pow(2,s)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${s}), retrying in ${r}ms:`,i),await new Promise(a=>setTimeout(a,r))}let e=await this.fetchSnapshot();e&&this.setUsers(e.users);let t=this.joinBufferedPresence;this.joinBufferedPresence=[];for(let s of t)e&&(s.meta?.ts??0)<=e.ts||this.applyPresence(s);this.isJoining=!1,this.fireSettled(),this.startHeartbeat(),this.isJoined=!0}async refreshSnapshot(){let e=await this.fetchSnapshot();e&&this.setUsers(e.users)}async fetchSnapshot(){try{return await this.nchan.fetchPresenceSnapshot()}catch(e){return console.warn("[Lobby] Presence snapshot failed:",e),null}}setUsers(e){this.users=new Map(e.map(t=>[t.userId,t])),this.notifyListeners()}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(s){console.error("Failed to send heartbeat:",s)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=60){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}safeEmit(e,t){try{let s=t();s&&typeof s.catch=="function"&&s.catch(i=>console.error(`[Lobby] ${e} hook failed:`,i))}catch(s){console.error(`[Lobby] ${e} hook failed:`,s)}}async challenge(e,t,s,i,r){let a=Ps();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:a,options:s,nextTurnId:i,custom:r}),this.safeEmit("onChallengeSent",()=>this.options.onChallengeSent?.({challengeeId:e,ruleType:t,tableId:a})),a}async acceptChallenge(e,t,s,i,r,a,l){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:r??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i,nextTurnId:a,custom:l}),this.safeEmit("onChallengeAccepted",()=>this.options.onChallengeAccepted?.({challengerId:e,ruleType:t,tableId:s})),await this.updatePresence({tableId:s,ruleType:t,options:i})}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=Ne(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(this.isJoining){this.joinBufferedPresence.push(e);return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&this.notifyListeners()}}handleChallenge(e){if(this.isJoining){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let s=e.meta?.ts,i=t.meta?.ts??t.clientTs;return s===void 0||i===void 0?!1:s>=i&&s-i<=Ls}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=Me.dedupeChallenges(this.unsettledChallengeMessages);for(let s of e)this.emitIfRelevant(s);this.unsettledChallengeMessages=[];let t=[...this.settledListeners];this.settledListeners=[];for(let s of t)s()}clearSettleState(){this.isJoining=!1,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.joinBufferedPresence=[]}};var Ue=class n{constructor(e,t,s,i,r=!1,a,l,c,d){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.isSpectator=r;this.onClosed=c;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=d?.maxSize??1e3,this.initialRetryDelayMs=d?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=d?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(h=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(m=>m()),this.preJoinQueue.splice(0).forEach(m=>this.messageListeners.forEach(g=>g(m))),h()}}),a&&this.messageListeners.push(a),l&&this.bothJoinedListeners.push(l)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((s,i)=>{this.publishQueue.push({type:e,data:t,resolve:s,reject:i}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((s,i)=>{let r=a=>{if(this.isClosed){i(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>s()).catch(l=>{if(this.isClosed){i(l);return}let c=Math.min(Math.pow(2,a+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>r(a+1),c)})};r(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=Ne(e);if(!t||!t.type)return;let s=t.meta?.msgId;if(typeof s=="string"){if(this.seenMsgIds.has(s))return;if(this.seenMsgIds.set(s,!0),this.seenMsgIds.size>n.MAX_SEEN_MSG_IDS){let i=this.seenMsgIds.keys().next().value;i!==void 0&&this.seenMsgIds.delete(i)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!Cs(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let r=t.data?.id||t.senderId;r&&(this.seenIds.add(r),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&r!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(a=>a())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(i=>i(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var Oe=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new Ae(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),r,a={...t,onReconnect:()=>{this.resumeSession().catch(c=>console.error("Session resume failed after lobby reconnect:",c)),t?.onReconnect?.()},onLeave:()=>{let c=r??i;if(c){let d=this.activeLobbies.indexOf(c);d!==-1&&this.activeLobbies.splice(d,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let l=new Re(this.nchan,e,a);return r=l,await l.join(),this.lobbyInstances.set(e.userId,l),this.activeLobbies.push(l),l}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,s){let i=s?.isSpectator??!1,r=this.tableKey(e,t,i),a=this.joiningTables.get(r);if(a)return a.promise;this.assertNoTableConflict(e,t,i);let l=this.activeTables.find(m=>m.tableId===e);if(l)return Promise.resolve(l);let c=i?void 0:this.activeLobbies.find(m=>m.currentUser.userId===t),d=new Ue(this.nchan,e,t,c,i,s?.onMessage,s?.onBothJoined,()=>this.removeActiveTable(d));this.activeTables.push(d);let h=d.join().catch(m=>{console.error(`Table ${e} join handshake failed:`,m)});c&&h.then(async()=>{if(!d.closed)try{await c.updatePresence({tableId:e})}catch(m){console.error("Failed to update presence after table join:",m)}});let p=Promise.resolve(d).finally(()=>{this.joiningTables.delete(r)});return this.joiningTables.set(r,{tableId:e,userId:t,isSpectator:i,promise:p}),p}tableKey(e,t,s){return`${e}|${t}|${s?"s":"p"}`}assertNoTableConflict(e,t,s){for(let i of this.joiningTables.values())if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already being joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`);for(let i of this.activeTables)if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,s){return this.joinTable(e,t,{...s,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence(),await e.refreshSnapshot()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};function mt(n){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname))return;let e=`${I}/api/usage/${n}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}var je=class{#e=[];#s;#t;constructor(e=3e4,t=()=>Date.now()){this.#s=e,this.#t=t}update(e){let t=new Set(e.map(s=>s.userId));for(let s of this.#e)s.status==="online"&&!t.has(s.userId)&&(s.status="offline",s.offlineSince=this.#t());for(let s of e){let i=this.#e.find(r=>r.status==="online"&&r.userId===s.userId);i?i.user=s:this.#n(s)}return this.getSlots()}getSlots(){return[...this.#e]}reset(){this.#e=[]}#n(e){let t=this.#t(),s=this.#e.find(a=>a.userId===e.userId);if(s){s.status="online",s.offlineSince=null,s.user=e;return}let i=null,r=0;for(let a of this.#e)if(a.status==="offline"){let l=t-a.offlineSince;l>this.#s&&l>r&&(i=a,r=l)}if(i){i.userId=e.userId,i.status="online",i.offlineSince=null,i.user=e;return}this.#e.push({userId:e.userId,status:"online",offlineSince:null,user:e})}};var{I:Ni}=Qt,Ns=n=>n;var Ms=()=>document.createComment(""),q=(n,e,t)=>{let s=n._$AA.parentNode,i=e===void 0?n._$AB:e._$AA;if(t===void 0){let r=s.insertBefore(Ms(),i),a=s.insertBefore(Ms(),i);t=new Ni(r,a,n,n.options)}else{let r=t._$AB.nextSibling,a=t._$AM,l=a!==n;if(l){let c;t._$AQ?.(n),t._$AM=n,t._$AP!==void 0&&(c=n._$AU)!==a._$AU&&t._$AP(c)}if(r!==i||l){let c=t._$AA;for(;c!==r;){let d=Ns(c).nextSibling;Ns(s).insertBefore(c,i),c=d}}}return t},N=(n,e,t=n)=>(n._$AI(e,t),n),Mi={},Rs=(n,e=Mi)=>n._$AH=e,Us=n=>n._$AH,De=n=>{n._$AR(),n._$AA.remove()};var Os=(n,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(n[i],i);return s},js=ke(class extends J{constructor(n){if(super(n),n.type!==Ee.CHILD)throw Error("repeat() can only be used in text expressions")}dt(n,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],r=[],a=0;for(let l of n)i[a]=s?s(l,a):a,r[a]=t(l,a),a++;return{values:r,keys:i}}render(n,e,t){return this.dt(n,e,t).values}update(n,[e,t,s]){let i=Us(n),{values:r,keys:a}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=a,r;let l=this.ut??=[],c=[],d,h,p=0,m=i.length-1,g=0,v=r.length-1;for(;p<=m&&g<=v;)if(i[p]===null)p++;else if(i[m]===null)m--;else if(l[p]===a[g])c[g]=N(i[p],r[g]),p++,g++;else if(l[m]===a[v])c[v]=N(i[m],r[v]),m--,v--;else if(l[p]===a[v])c[v]=N(i[p],r[v]),q(n,c[v+1],i[p]),p++,v--;else if(l[m]===a[g])c[g]=N(i[m],r[g]),q(n,i[p],i[m]),m--,g++;else if(d===void 0&&(d=Os(a,g,v),h=Os(l,p,m)),d.has(l[p]))if(d.has(l[m])){let y=h.get(a[g]),T=y!==void 0?i[y]:null;if(T===null){let $=q(n,i[p]);N($,r[g]),c[g]=$}else c[g]=N(T,r[g]),q(n,i[p],T),i[y]=null;g++}else De(i[m]),m--;else De(i[p]),p++;for(;g<=v;){let y=q(n,c[v+1]);N(y,r[g]),c[g++]=y}for(;p<=m;){let y=i[p++];y!==null&&De(y)}return this.ut=a,Rs(n,c),C}});var gt=[{code:"en",label:"English"},{code:"ko",label:"\uD55C\uAD6D\uC5B4"},{code:"ja",label:"\u65E5\u672C\u8A9E"},{code:"tr",label:"T\xFCrk\xE7e"},{code:"zh",label:"\u7E41\u9AD4\u4E2D\u6587",htmlLang:"zh-Hant"}],Ri={ko:{"Play Solo":"\uD63C\uC790 \uD50C\uB808\uC774","Challenge {name}":"{name}\uC5D0\uAC8C \uB300\uACB0 \uC2E0\uCCAD",PLAY:"\uD50C\uB808\uC774",Cancel:"\uCDE8\uC18C",Accept:"\uC218\uB77D",Decline:"\uAC70\uC808",Challenge:"\uB3C4\uC804","Challenge from {name}":"{name}\uB2D8\uC758 \uB3C4\uC804","Waiting for {name} to accept.":"{name}\uB2D8\uC758 \uC218\uB77D\uC744 \uAE30\uB2E4\uB9AC\uB294 \uC911.","{name} declined.":"{name}\uB2D8\uC774 \uAC70\uC808\uD588\uC2B5\uB2C8\uB2E4.","Accept challenge":"\uB3C4\uC804 \uC218\uB77D","Decline challenge":"\uB3C4\uC804 \uAC70\uC808",Dismiss:"\uB2EB\uAE30","Select game type":"\uAC8C\uC784 \uC720\uD615 \uC120\uD0DD","Select game variant":"\uAC8C\uC784 \uBCC0\uD615 \uC120\uD0DD","Game type":"\uAC8C\uC784 \uC885\uB958","{game} variant":"{game} \uBCC0\uD615","Table:":"\uD14C\uC774\uBE14:","Full size":"\uC804\uCCB4 \uD06C\uAE30",Mini:"\uBBF8\uB2C8","Shot time:":"\uC0F7 \uC2DC\uAC04:","Rule:":"\uADDC\uCE59:","Aim:":"\uC870\uC900:",Free:"\uC790\uC720",Assist:"\uBCF4\uC870","Free aim":"\uC790\uC720 \uC870\uC900","Aim assist":"\uC870\uC900 \uBCF4\uC870","Send message":"\uBA54\uC2DC\uC9C0 \uBCF4\uB0B4\uAE30",Language:"\uC5B8\uC5B4","Eight Ball":"\uC5D0\uC774\uD2B8\uBCFC","Nine Ball":"\uB098\uC778\uBCFC",Snooker:"\uC2A4\uB204\uCEE4","Three Cushion":"\uC4F0\uB9AC\uCFE0\uC158",Sagu:"\uC0AC\uAD6C","Reds 3":"\uBE68\uAC04\uACF5 3","Reds 6":"\uBE68\uAC04\uACF5 6","Reds 10":"\uBE68\uAC04\uACF5 10","Reds 15":"\uBE68\uAC04\uACF5 15","Race to 7":"7\uC810 \uC120\uCDE8","Race to 15":"15\uC810 \uC120\uCDE8","Race to 25":"25\uC810 \uC120\uCDE8","Race to 5":"5\uC810 \uC120\uCDE8","Race to 11":"11\uC810 \uC120\uCDE8","Use these parameters":"\uC774 \uC124\uC815\uC73C\uB85C \uC2DC\uC791"},ja:{"Play Solo":"\u3072\u3068\u308A\u3067\u30D7\u30EC\u30A4","Challenge {name}":"{name}\u306B\u6311\u6226",PLAY:"\u30D7\u30EC\u30A4",Cancel:"\u30AD\u30E3\u30F3\u30BB\u30EB",Accept:"\u627F\u8A8D",Decline:"\u62D2\u5426",Challenge:"\u5BFE\u6226\u7533\u8FBC\u307F","Challenge from {name}":"{name}\u304B\u3089\u306E\u6311\u6226","Waiting for {name} to accept.":"{name}\u306E\u627F\u8A8D\u5F85\u3061\u3067\u3059\u3002","{name} declined.":"{name}\u304C\u62D2\u5426\u3057\u307E\u3057\u305F\u3002","Accept challenge":"\u6311\u6226\u3092\u627F\u8A8D","Decline challenge":"\u6311\u6226\u3092\u62D2\u5426",Dismiss:"\u9589\u3058\u308B","Select game type":"\u30B2\u30FC\u30E0\u306E\u7A2E\u985E\u3092\u9078\u629E","Select game variant":"\u30B2\u30FC\u30E0\u306E\u30D0\u30EA\u30A2\u30F3\u30C8\u3092\u9078\u629E","Game type":"\u30B2\u30FC\u30E0\u306E\u7A2E\u985E","{game} variant":"{game}\u306E\u30D0\u30EA\u30A2\u30F3\u30C8","Table:":"\u30C6\u30FC\u30D6\u30EB:","Full size":"\u30D5\u30EB\u30B5\u30A4\u30BA",Mini:"\u30DF\u30CB","Shot time:":"\u30B7\u30E7\u30C3\u30C8\u6642\u9593:","Rule:":"\u30EB\u30FC\u30EB:","Aim:":"\u30A8\u30A4\u30E0:",Free:"\u30D5\u30EA\u30FC",Assist:"\u30A2\u30B7\u30B9\u30C8","Free aim":"\u30D5\u30EA\u30FC\u30A8\u30A4\u30E0","Aim assist":"\u30A8\u30A4\u30E0\u30A2\u30B7\u30B9\u30C8","Send message":"\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u308B",Language:"\u8A00\u8A9E","Eight Ball":"\u30A8\u30A4\u30C8\u30DC\u30FC\u30EB","Nine Ball":"\u30CA\u30A4\u30F3\u30DC\u30FC\u30EB",Snooker:"\u30B9\u30CC\u30FC\u30AB\u30FC","Three Cushion":"\u30B9\u30EA\u30FC\u30AF\u30C3\u30B7\u30E7\u30F3",Sagu:"\u56DB\u7403","Reds 3":"\u8D64\u7403 3","Reds 6":"\u8D64\u7403 6","Reds 10":"\u8D64\u7403 10","Reds 15":"\u8D64\u7403 15","Race to 7":"7\u70B9\u5148\u53D6","Race to 15":"15\u70B9\u5148\u53D6","Race to 25":"25\u70B9\u5148\u53D6","Race to 5":"5\u70B9\u5148\u53D6","Race to 11":"11\u70B9\u5148\u53D6","Use these parameters":"\u3053\u306E\u8A2D\u5B9A\u3067\u958B\u59CB"},tr:{"Play Solo":"Tek Oyna","Challenge {name}":"{name} ile D\xFCello",PLAY:"OYNA",Cancel:"\u0130ptal",Accept:"Kabul Et",Decline:"Reddet",Challenge:"D\xFCello","Challenge from {name}":"{name} d\xFCello teklif etti","Waiting for {name} to accept.":"{name} kabul edene kadar bekleniyor.","{name} declined.":"{name} reddetti.","Accept challenge":"D\xFCelloyu kabul et","Decline challenge":"D\xFCelloyu reddet",Dismiss:"Kapat","Select game type":"Oyun t\xFCr\xFCn\xFC se\xE7","Select game variant":"Oyun varyant\u0131 se\xE7","Game type":"Oyun t\xFCr\xFC","{game} variant":"{game} varyant\u0131","Table:":"Masa:","Full size":"Tam boy",Mini:"Mini","Shot time:":"At\u0131\u015F s\xFCresi:","Rule:":"Kural:","Aim:":"Ni\u015Fan:",Free:"Serbest",Assist:"Yard\u0131ml\u0131","Free aim":"Serbest ni\u015Fan","Aim assist":"Ni\u015Fan yard\u0131m\u0131","Send message":"Mesaj g\xF6nder",Language:"Dil","Eight Ball":"Sekiz Top","Nine Ball":"Dokuz Top",Snooker:"Snooker","Three Cushion":"\xDC\xE7 Bant",Sagu:"Sagu","Reds 3":"3 K\u0131rm\u0131z\u0131","Reds 6":"6 K\u0131rm\u0131z\u0131","Reds 10":"10 K\u0131rm\u0131z\u0131","Reds 15":"15 K\u0131rm\u0131z\u0131","Race to 7":"7 Say\u0131ya","Race to 15":"15 Say\u0131ya","Race to 25":"25 Say\u0131ya","Race to 5":"5 Say\u0131ya","Race to 11":"11 Say\u0131ya","Use these parameters":"Bu ayarlarla ba\u015Fla"},zh:{"Play Solo":"\u55AE\u4EBA\u7DF4\u7FD2","Challenge {name}":"\u6311\u6230 {name}",PLAY:"\u958B\u59CB",Cancel:"\u53D6\u6D88",Accept:"\u63A5\u53D7",Decline:"\u62D2\u7D55",Challenge:"\u6311\u6230","Challenge from {name}":"{name} \u7684\u6311\u6230","Waiting for {name} to accept.":"\u7B49\u5F85 {name} \u63A5\u53D7\u3002","{name} declined.":"{name} \u62D2\u7D55\u4E86\u3002","Accept challenge":"\u63A5\u53D7\u6311\u6230","Decline challenge":"\u62D2\u7D55\u6311\u6230",Dismiss:"\u95DC\u9589","Select game type":"\u9078\u64C7\u7403\u985E","Select game variant":"\u9078\u64C7\u73A9\u6CD5","Game type":"\u7403\u985E","{game} variant":"{game} \u73A9\u6CD5","Table:":"\u7403\u684C\uFF1A","Full size":"\u6A19\u6E96\u684C",Mini:"\u8FF7\u4F60","Shot time:":"\u51FA\u687F\u6642\u9593\uFF1A","Rule:":"\u898F\u5247\uFF1A","Aim:":"\u7784\u6E96\uFF1A",Free:"\u81EA\u7531",Assist:"\u8F14\u52A9","Free aim":"\u81EA\u7531\u7784\u6E96","Aim assist":"\u7784\u6E96\u8F14\u52A9","Send message":"\u50B3\u9001\u8A0A\u606F",Language:"\u8A9E\u8A00","Eight Ball":"\u516B\u865F\u7403","Nine Ball":"\u4E5D\u865F\u7403",Snooker:"\u65AF\u8AFE\u514B","Three Cushion":"\u4E09\u9846\u661F",Sagu:"\u56DB\u7403","Reds 3":"\u7D05\u7403 3","Reds 6":"\u7D05\u7403 6","Reds 10":"\u7D05\u7403 10","Reds 15":"\u7D05\u7403 15","Race to 7":"\u6436 7","Race to 15":"\u6436 15","Race to 25":"\u6436 25","Race to 5":"\u6436 5","Race to 11":"\u6436 11","Use these parameters":"\u4F7F\u7528\u9019\u4E9B\u8A2D\u5B9A"}},Ds="locale",Ui=["lang","selector_lang"],Oi="locale",ze=n=>gt.some(e=>e.code===n);function ji(){if(!(typeof location>"u"))return new URLSearchParams(location.search).get(Oi)?.trim().toLowerCase()||void 0}function Di(){try{for(let n of[Ds,...Ui]){let e=localStorage.getItem(n);if(e&&ze(e))return e}return}catch{return}}function zi(){if(typeof navigator>"u")return;let n=navigator.languages?.length?navigator.languages:[navigator.language];for(let e of n){let t=String(e).toLowerCase().split("-")[0];if(ze(t))return t}}function Hi(){let n=ji();return n?ze(n)?n:"en":Di()??zi()??"en"}var ft=class{#e=Hi();#s=new Set;constructor(){this.#t()}get lang(){return this.#e}get languages(){return gt}t(e,t){let s=Ri[this.#e]?.[e]??e;if(t)for(let[i,r]of Object.entries(t))s=s.replaceAll(`{${i}}`,String(r));return s}set(e){if(!(!ze(e)||e===this.#e)){this.#e=e;try{localStorage.setItem(Ds,e)}catch{}this.#t();for(let t of this.#s)t(e)}}onChange(e){return this.#s.add(e),()=>this.#s.delete(e)}#t(){if(typeof document>"u")return;let{htmlLang:e}=gt.find(t=>t.code===this.#e)??{};document.documentElement.lang=e??this.#e}},w=new ft,M=class extends S{connectedCallback(){super.connectedCallback(),this._i18nUnsub=w.onChange(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._i18nUnsub?.()}};var W=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),zs=n=>o`
    ${n.meta?.city?o`<span class="loc-city">${n.meta.city}</span>`:""}
    ${n.meta?.ua?o`<span class="loc-ua">${n.meta.ua}</span>`:""}`,bt=class extends M{static properties={slots:{type:Array},users:{type:Array},myId:{type:String},myName:{type:String},tableId:{type:String},isChallengePending:{type:Boolean},challenges:{type:Object},pendingChats:{type:Object}};#e=!1;static styles=[_,Zt,f`
        @keyframes throb { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        li { animation: fadeIn 0.2s ease-out; anchor-scope: --user-name; }
        .btn-chat { animation: throb 2s ease-in-out infinite; font-size: 1rem; border: none; background: none; padding: 0 0.2rem; }
        .btn-spectate { background: #7c3aed; color: #fff; border: none; border-radius: 4px; padding: 0.25rem 0.6rem; cursor: pointer; }
        .btn-spectate:hover { background: #6d28d9; }
        .name-wrap {
            position: relative;
            display: inline-block;
            anchor-name: --user-name;
        }
        .user-name { overflow: visible; }
        .loc-tip {
            position: absolute;
            bottom: calc(100% + 4px);
            left: 50%;
            transform: translateX(-50%);
            background: #222; color: #fff;
            padding: 4px 8px; border-radius: 4px;
            font-size: 0.75rem;
            text-align: center;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        @supports (anchor-name: --user-name) {
            .loc-tip {
                position: fixed;
                position-anchor: --user-name;
                position-area: left center;
                position-try-fallbacks: flip-inline, flip-block;
                margin-right: 6px;
                bottom: auto;
                left: auto;
                transform: none;
            }
        }
        /* nowrap moved off the tooltip and onto its lines: the two parts stack, but neither
           wraps mid-word on a long city or a long user agent. */
        .loc-city, .loc-ua { display: block; white-space: nowrap; }
        .loc-ua { opacity: 0.75; }
        .name-wrap:hover .loc-tip { opacity: 1; transition: opacity 0.2s ease 4s; }
        .status-link { text-decoration: none; color: inherit; }
    `];_renderStatus(e){return o`<span aria-label="${e.title}" role="img">${e.emoji}</span>`}async autoExpandIfSupported(){if(this.#e)return;if((this.slots||[]).filter(t=>t.status==="online").length>4){await this.updateComplete;let t=this.renderRoot.querySelector(".expand-toggle");t&&getComputedStyle(t).visibility!=="hidden"&&(this.#e=!0,W(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate())}}updated(){if(!this.#e)return;let e=this.renderRoot.querySelector("ul");if(!e)return;let t=e.scrollHeight;t>0&&e.style.setProperty("--ul-expanded-height",t+"px")}#s(){this.#e=!this.#e,W(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate()}render(){let e=this.slots||[];if(e.filter(i=>i.status==="online").length===0)return o`<div class="empty">No other players online yet. Invite a friend!</div>`;let s=new Set(Le(this.users||[]).filter(i=>i.players.length>1).map(i=>i.tableId));return o`
            <ul class="${this.#e?"expanded":""}" aria-label="Online players">
                ${js(e,(i,r)=>r,(i,r)=>this._rowSlot(i,r,s))}
            </ul>
            <div class="expand-toggle" @click=${this.#s}>
                ${this.#e?"\u25B2":"\u25BC"}
            </div>`}_rowSlot(e,t,s){if(e.status==="offline"){let i=e.user,r=st(i.meta?.origin??"",i.ruleType??"",Pe(i),i.options,i.arenaId);return o`
                <li class="is-offline" aria-label="${i.userName}">
                    <div class="user-info">
                        <span class="user-name">
                            <span title="${E(i.meta?.country).title}">${E(i.meta?.country).emoji}</span>
                            <span class="name-wrap">${i.userName}<span class="loc-tip">${zs(i)}</span></span>
                            ${this._renderStatus(r)}
                        </span>
                    </div>
                </li>`}return this._row(e.user,s)}_row(e,t){let s=this.pendingChats?.get(e.userId)>0,r=!(this.challenges?.[e.userId]?.challengerId===e.userId)&&(e.isBot||Ts(e,this.myId)),a=!e.isBot&&Pe(e)==="playing"&&As(e,this.tableId)&&t.has(e.tableId),l=st(e.meta?.origin??"",e.ruleType??"",Pe(e),e.options,e.arenaId),c=s?o`<button class="btn-chat" aria-label="Unread message from ${e.userName}" @click=${()=>W(this,"open-chat",e.userId)}>💬</button>`:a?o`<button class="btn-spectate" aria-label="Spectate ${e.userName}'s game" @click=${()=>W(this,"spectate",e)}>Spectate</button>`:r?o`<button class="btn-challenge" aria-label=${w.t("Challenge {name}",{name:e.userName})} ?disabled=${this.isChallengePending} @click=${()=>k?window.location.href="https://billiards.tailuge.workers.dev/lobby":W(this,"challenge",e.userId)}>${w.t("Challenge")}</button>`:o``;return o`
            <li aria-label="${e.userName}">
                <div class="user-info">
                    <span class="user-name" @click=${()=>W(this,"open-chat",e.userId)} style="cursor: pointer"><span title="${E(e.meta?.country).title}">${E(e.meta?.country).emoji}</span> <span class="name-wrap">${e.userName}<span class="loc-tip">${zs(e)}</span></span> ${this._renderStatus(l)}</span>
                </div>
                <div class="actions">${c}</div>
            </li>`}};customElements.define("user-list",bt);var He=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Bi=/[.,!?;:)\]}'"»]+$/,Fi=(n="")=>{let e=String(n),t=[],s=/(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi,i=0,r;for(;(r=s.exec(e))!==null;){let a=r[0].replace(Bi,"");r.index>i&&t.push(e.slice(i,r.index)),t.push(o`<a href=${/^www\./i.test(a)?`https://${a}`:a} target="_blank" rel="noopener noreferrer">${a}</a>`),t.push(e.slice(r.index+a.length,r.index+r[0].length)),i=r.index+r[0].length}return i<e.length&&t.push(e.slice(i)),t},yt=class extends b{static properties={lobby:{type:Object},targetId:{type:String},targetName:{type:String},_messages:{state:!0},_unread:{state:!0}};static styles=[_,G,f`
        .modal { min-width: 280px; max-width: 360px; }
        .thread { display: flex; flex-direction: column; gap: 0.3rem; max-height: 220px; overflow-y: auto; padding: 0.2rem 0; scrollbar-width: none; -ms-overflow-style: none; }
        .thread::-webkit-scrollbar { display: none; }
        .msg { font-size: 0.82rem; padding: 0.25rem 0.5rem; border-radius: 6px; max-width: 85%; word-break: break-word; }
        .msg.mine { align-self: flex-end; background: #0d6efd; color: #fff; }
        .msg.theirs { align-self: flex-start; background: var(--surface); border: 1px solid var(--border); color: var(--text); }
        .msg a { text-decoration: underline; overflow-wrap: anywhere; }
        .msg.theirs a { color: var(--link); }
        /* The "mine" bubble is solid blue, so it needs its own link colour for contrast. */
        .msg.mine a { color: #cfe3ff; }
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
    `];constructor(){super(),this._messages=new Map,this._unread=new Map,this._lobbyBound=!1}willUpdate(e){e.has("lobby")&&this.lobby&&!this._lobbyBound&&(this._lobbyBound=!0,this.lobby.onChat(t=>{let s=t.senderId,i=[...this._messages.get(s)??[],t];if(this._messages=new Map(this._messages).set(s,i),s!==this.targetId){let r=(this._unread.get(s)??0)+1;this._unread=new Map(this._unread).set(s,r),He(this,"unread-changed",{userId:s,count:r})}this.requestUpdate()})),e.has("targetId")&&this.targetId&&this._unread.has(this.targetId)&&(this._unread=new Map(this._unread).set(this.targetId,0),He(this,"unread-changed",{userId:this.targetId,count:0}))}_send(e){e.preventDefault();let t=this.shadowRoot.querySelector("input"),s=t.value.trim();if(!s||!this.lobby||!this.targetId)return;this.lobby.sendChat(this.targetId,s);let r={messageType:"chat",senderId:this.lobby.currentUser.userId,recipientId:this.targetId,text:s},a=[...this._messages.get(this.targetId)??[],r];this._messages=new Map(this._messages).set(this.targetId,a),t.value="",this.requestUpdate()}updated(e){if(e.has("targetId")){let t=this.shadowRoot.querySelector(".thread");t&&(t.scrollTop=t.scrollHeight);let s=this.shadowRoot.querySelector("input");s&&s.focus()}else if(e.has("_messages")){let t=e.get("_messages");if(this._messages.get(this.targetId)!==t?.get(this.targetId)){let s=this.shadowRoot.querySelector(".thread");s&&(s.scrollTop=s.scrollHeight)}}}render(){if(!this.targetId)return o``;let e=this.lobby?.currentUser?.userId,t=this._messages.get(this.targetId)??[];return o`
            <div class="backdrop" @click=${s=>s.target===s.currentTarget&&He(this,"close")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Chat with ${this.targetName}">
                    <h3>💬 ${this.targetName}</h3>
                    <div class="thread">
                        ${t.length===0?o`<div class="empty">No messages yet</div>`:t.map(s=>o`<div class="msg ${s.senderId===e?"mine":"theirs"}">${Fi(s.text)}</div>`)}
                    </div>
                    <form class="compose" @submit=${this._send}>
                        <input type="text" name="message" placeholder="Message…" autocomplete="off" aria-label="Message text">
                        <button type="submit" aria-label="Send message">➤</button>
                    </form>
                    <button class="cancel" @click=${()=>He(this,"close")}>Close</button>
                </div>
            </div>`}};customElements.define("message-modal",yt);var Be=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Gi={raceTo:"Race to",reds:"Reds",shotClock:"Shot clock",collaboration:"Collaboration",practice:"Practice"},Hs=(n,e)=>n?Object.entries(n).filter(([,t])=>!(typeof t=="boolean"&&t===!1)).map(([t,s])=>{if(t.startsWith("handicap_")){let r=t.slice(9),a=e&&r===e?"Your handicap":"Handicap";return typeof s=="boolean"?a:`${a}: ${s}`}let i=Gi[t]??t;return typeof s=="boolean"?i:`${i}: ${s}`}):[],vt=class extends M{static properties={challenge:{type:Object},sent:{type:Object},myId:{type:String}};static styles=[_,es,ts];render(){return this.challenge?this._incoming(this.challenge):this.sent?this._sent(this.sent):o``}_incoming(e){let t={...e.options};if(Object.keys(t).some(i=>i.startsWith("handicap_"))){let i=localStorage.getItem(`handicap_${e.ruleType}`)||"15";t["handicap_"+this.myId]=i}let s=Hs(t,this.myId);return o`
            <div class="banner">
                <div class="details">${L(e.ruleType)} ${e.ruleType}</div>
                <strong>${w.t("Challenge from {name}",{name:e.challengerName})}</strong>
                <div class="details">${s.map(i=>o`<span>${i}</span>`)}</div>
                <div class="row">
                    <button class="btn-accept" aria-label=${w.t("Accept challenge")} @click=${()=>Be(this,"accept")}>${w.t("Accept")}</button>
                    <button class="btn-decline" aria-label=${w.t("Decline challenge")} @click=${()=>Be(this,"decline")}>${w.t("Decline")}</button>
                </div>
            </div>`}_sent(e){let t=e.status==="pending",s=Hs(e.options,this.myId);return o`
            <div class="banner ${e.status}">
                <div class="details">${L(e.ruleType)} ${e.ruleType}</div>
                ${s.length>0?o`<div class="details">${s.map(i=>o`<span>${i}</span>`)}</div>`:""}
                <strong>${t?w.t("Waiting for {name} to accept.",{name:e.recipientName}):w.t("{name} declined.",{name:e.recipientName})}</strong>
                <div class="row">
                    ${t?o`<button class="btn-leave" @click=${()=>Be(this,"cancel")}>${w.t("Cancel")}</button>`:o`<button aria-label=${w.t("Dismiss")} @click=${()=>Be(this,"dismiss")}>✕</button>`}
                </div>
            </div>`}};customElements.define("challenge-banner",vt);var Fe=(n,e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),xt=class n extends M{static properties={userId:{type:String},userName:{type:String},_expanded:{state:!0},_handicap:{state:!0}};static styles=[_,G,fe];static SECTIONS=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",rules:[{id:"eightball",label:"Eight Ball",img:"assets/eightball.png"},{id:"eightball",label:"Eight Ball (Free Aim)",img:"assets/eightball.png",options:{freeaim:"true"}},{id:"eightball",label:"Eight Ball Mini (Free Aim)",img:"assets/baby.png",options:{freeaim:"true",tableSize:"6"}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",rules:[{id:"nineball",label:"Nine Ball",img:"assets/nineball.png"},{id:"nineball",label:"Nine Ball (Free Aim)",img:"assets/nineball.png",options:{freeaim:"true"}},{id:"nineball",label:"Nine Ball Mini (Free Aim)",img:"assets/baby.png",options:{freeaim:"true",tableSize:"6"}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",rules:[{id:"snooker",label:"3 reds",img:"assets/baby.png",options:{reds:"3",tableSize:"6"}},{id:"snooker",label:"6 reds",img:"assets/snooker.png",options:{reds:"6",tableSize:"12"}},{id:"snooker",label:"10 reds",img:"assets/snooker.png",options:{reds:"10",tableSize:"12"}},{id:"snooker",label:"15 reds",img:"assets/snooker.png",options:{reds:"15",tableSize:"12"}},{id:"snooker",label:"6 reds (Free Aim)",img:"assets/snooker.png",options:{freeaim:"true",reds:"6",tableSize:"12"}}]},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",rules:[{id:"threecushion",label:"Small Table (15)",img:"assets/baby.png",options:{raceTo:"15",collaboration:!0,shotClock:"60",tableSize:"5"}},{id:"threecushion",label:"Race to 7",img:"assets/threecushion.png",options:{raceTo:"7"}},{id:"threecushion",label:"Race to 25",img:"assets/threecushion.png",options:{raceTo:"25"}},{id:"threecushion",label:"Collaboration (15)",img:"assets/threecushion.png",options:{raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Race to 15 (Free Aim)",img:"assets/threecushion.png",options:{freeaim:"true",raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Traditional (10)",img:"assets/threecushion.png",options:{raceTo:"10",practice:!1,shotClock:"45"}},{id:"threecushion",label:"Handicap",img:"assets/threecushion.png",options:{handicap:!0}}]},{key:"sagu",label:"Sagu",img:"assets/sagu.png",rules:[{id:"sagu",label:"Small Table (5)",img:"assets/baby.png",options:{raceTo:"5",tableSize:"5"}},{id:"sagu",label:"Race to 11",img:"assets/sagu.png",options:{raceTo:"11"}},{id:"sagu",label:"Free Aim (5)",img:"assets/sagu.png",options:{freeaim:"true",raceTo:"5"}},{id:"sagu",label:"Handicap",img:"assets/sagu.png",options:{handicap:!0}}]}];constructor(){super(),this._expanded=null,this._handicap=15}_loadHandicap(e){let t=localStorage.getItem(`handicap_${e}`);if(t!==null){let s=parseInt(t,10);if(!isNaN(s)&&s>=5&&s<=30){this._handicap=s;return}}this._handicap=15}_onHandicapChange(e){let t=parseInt(e.target.value,10);this._handicap=t,this._expanded&&localStorage.setItem(`handicap_${this._expanded}`,String(t))}_toggle(e){let t=this._expanded===e;this._expanded=t?null:e,t||n.SECTIONS.find(i=>i.key===e)?.rules.some(i=>i.options?.handicap===!0)&&this._loadHandicap(e)}render(){return this.userId?o`
            <div class="backdrop" @click=${e=>e.target===e.currentTarget&&Fe(this,"cancel")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label=${w.t("Select game type")}>
                    <h3>${w.t("Challenge {name}",{name:this.userName})}</h3>
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
                                            <button class="rule btn-challenge" @click=${()=>{let s=t.options?{...t.options}:{};s.handicap===!0&&(s.handicap=String(this._handicap)),Fe(this,"confirm",{ruleType:t.id,options:s})}}>
                                                <span class="icon-wrap">
                                                    <img src=${t.img} alt=${t.label} />
                                                    ${t.options&&t.options.handicap!==!0?o`<span class="badge">${Se(t.options)}</span>`:""}
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
                    <button class="msg-btn" type="button" aria-label=${w.t("Send message")} @click=${()=>Fe(this,"message")}>💬</button>
                    <button class="cancel" @click=${()=>Fe(this,"cancel")}>${w.t("Cancel")}</button>
                </div>
            </div>`:o``}};customElements.define("challenge-modal",xt);var Bs=[{userId:"bot-clawbreak",userName:"ClawBreak",isBot:!0,meta:{country:"BOT"}},{userId:"bot-thefarjaw",userName:"TheFarJaw",isBot:!0,meta:{country:"BOT"}}],_t=class extends b{static styles=[_,rs];#e={...cs,settled:!1};#s=null;#t;#n;#h;#a=null;#o=null;#g=new Map;#f=new je;#i=null;#p=null;#u=!1;#v=!1;constructor(){super(),this.#t=u.clientId,this.#n=u.userName;let e=new URLSearchParams(location.search),t=e.get("opponent.userId"),s=e.get("tournamentId")||e.get("arenaId")||e.get("arena");if(t&&!s){let r={},a=e.get("tableSize")||e.get("tablesize");a&&(r.tableSize=a);let l=e.get("raceTo")||e.get("raceto");l&&(r.raceTo=l);let c=e.get("shotClock")||e.get("shotclock");c&&(r.shotClock=c);let d=e.get("reds");d&&(r.reds=d);let h=e.get("freeaim");h&&(r.freeaim=h);let p=e.get("collaboration");p&&(r.collaboration=p);let m=e.get("practice");m&&(r.practice=m);let g=(e.get("acceptTableId")||"").trim(),v={opponentId:t,opponentName:e.get("opponent.userName")||t,ruleType:e.get("ruletype")||"nineball",nextTurnId:e.get("nextTurnId"),options:Object.keys(r).length>0?r:void 0};/^[\w-]{1,64}$/.test(g)?this.#p={...v,tableId:g}:this.#i=v;let y=new URL(location.href);y.searchParams.delete("opponent.userId"),y.searchParams.delete("opponent.userName");let T=[];for(let $ of y.searchParams.keys())($.startsWith("opponent.")||$.startsWith("custom."))&&T.push($);for(let $ of T)y.searchParams.delete($);y.searchParams.delete("ruletype"),y.searchParams.delete("nextTurnId"),y.searchParams.delete("tableSize"),y.searchParams.delete("tablesize"),y.searchParams.delete("raceTo"),y.searchParams.delete("raceto"),y.searchParams.delete("shotClock"),y.searchParams.delete("shotclock"),y.searchParams.delete("reds"),y.searchParams.delete("freeaim"),y.searchParams.delete("collaboration"),y.searchParams.delete("practice"),y.searchParams.delete("acceptTableId"),history.replaceState(null,"",y)}let i=`https://${z}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(i=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`),this.#h=new Oe({baseUrl:i}),this.#h.setVersion(ve(ye))}connectedCallback(){super.connectedCallback(),this._onUserChanged=e=>{this.#t=e.detail.userId,this.#n=e.detail.userName,this.#s?this.#s.updatePresence({userId:this.#t,userName:this.#n}).catch(t=>console.error("Failed to update presence:",t)):this._connect().catch(t=>console.error("Lobby connect failed:",t))},document.addEventListener("user-name-changed",this._onUserChanged),this._connect().catch(e=>console.error("Lobby connect failed:",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onUserChanged),this.#s?.leave()}dispatch(e){this.#e=ds(this.#e,{...e,myId:this.#t}),e.type==="CHALLENGE_MSG"&&this.#E(e.payload),this.requestUpdate()}#x(){if(!this.#i||!this.#e.connected)return;let e=this.#i.opponentId;!this.#r&&this.#e.users.some(t=>t.userId===e)&&this.#S(e,this.#i.ruleType,this.#i.options,this.#i.nextTurnId)}#I(){let e=this.#p;if(this.#p=null,!(!e||!this.#e.connected)){if(!this.#l.some(t=>t.userId===e.opponentId)){this.#i=e,this.#x();return}this.dispatch({type:"CHALLENGE_MSG",payload:{type:"offer",challengerId:e.opponentId,challengerName:e.opponentName,challengeeId:this.#t,ruleType:e.ruleType,tableId:e.tableId,options:e.options,nextTurnId:e.nextTurnId}}),this.#m(e.opponentId,e.nextTurnId).catch(t=>console.error("Handoff accept failed:",t))}}#E(e){if(this.#i&&(e.challengerId===this.#i.opponentId||e.challengeeId===this.#i.opponentId)&&(e.type==="decline"||e.type==="cancel")&&(this.#i=null),e.type==="offer"&&e.challengeeId===this.#t&&this.#i&&this.#i.opponentId===e.challengerId){let t=this.#i.nextTurnId;this.#i=null;let s=this.#r;s&&s.challengeeId===e.challengerId&&s.status==="pending"?this.#t<e.challengerId&&this.#m(e.challengerId,t).catch(i=>console.error("Simultaneous auto-accept failed:",i)):this.#m(e.challengerId,t).catch(i=>console.error("Auto-join accept failed:",i))}}get state(){return this.#e}get#_(){return this.#e.connected}get#l(){return this.#e.users}get#b(){return this.#e.currentMatch?.tableId}get#k(){return this.#e.currentMatch?.ruleType||"standard"}get#C(){return!!this.#e.currentMatch?.isFirst}get#T(){return this.#e.currentMatch?.options}get#w(){return this.#e.currentMatch?.opponentId}get#A(){return this.#e.currentMatch?.opponentName}get#P(){return this.#e.currentMatch?.opponentCustom}get#y(){return Object.values(this.#e.challenges).find(e=>e.challengeeId===this.#t&&e.status==="pending")}get#r(){return Object.values(this.#e.challenges).find(e=>e.challengerId===this.#t)}get#c(){return[...this.#l,...Bs]}get#d(){let e=u.getCustom();if(e.emoji===void 0||e.emoji===null){let t=this.#l.find(s=>s.userId===this.#t)?.meta?.country;if(t)return{...e,emoji:E(t).emoji}}return e}get lobby(){return this.#s}get#$(){return this.#f.getSlots()}async _connect(){this.#f.reset(),this.#s=await this.#h.joinLobby({messageType:"presence",type:"join",userId:this.#t,userName:this.#n},{onChallengeSent:()=>mt("createTable"),onChallengeAccepted:()=>mt("joinTable")}),this.dispatchEvent?.(new CustomEvent("lobby-ready",{detail:this.#s,bubbles:!0,composed:!0})),this.dispatch({type:"CONNECTED",payload:!0}),this.#u=!1,this.dispatch({type:"SETTLED",payload:!1}),this.#s.onUsersChange(e=>{let t=[...e,...Bs].filter(s=>s.userId!==this.#t);this.#f.update(t),this.dispatch({type:"USERS_UPDATE",payload:e})}),this.#s.onChallenge(e=>{e.options?.tournamentId||(this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#s.settled&&e.type==="offer"&&e.challengeeId===this.#t&&document.hidden&&typeof Notification<"u"&&Notification.permission==="granted"&&new Notification("Challenge received!",{body:`${e.challengerName} challenged you to ${e.ruleType}`,icon:"assets/threecushion.png"}))}),this.#s.onSettled(async()=>{this.#u=!0,this.dispatch({type:"SETTLED",payload:!0}),this.#p?this.#I():this.#x(),await this.updateComplete,this.renderRoot.querySelector("user-list")?.autoExpandIfSupported()})}async#S(e,t,s,i){this.#i&&this.#i.opponentId===e||(this.#i=null);let a=this.#c.find(c=>c.userId===e);if(a?.isBot){let c="bot-"+Math.random().toString(36).slice(2,8),d=!0;window.location.href=H({tableId:c,userId:this.#t,userName:this.#n,ruleType:t,isFirst:d,options:s,bot:a.userName,lod:u.lod,flip:u.flip,custom:this.#d});return}let l=this.#s?await this.#s.challenge(e,t,s,i,this.#d):"test-"+Math.random().toString(36).slice(2,7);this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#t,challengeeId:e,recipientName:a?.userName||e,ruleType:t,options:s,tableId:l,nextTurnId:i}})}async#L(){this.#i=null;let e=this.#r;e?.status==="pending"&&(this.#s&&await this.#s.cancelChallenge(e.challengeeId,e.ruleType),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId}))}async#m(e,t){let s=e?this.#e.challenges[e]:this.#y;if(!s)return;let i={...s.options};if(Object.keys(i).some(r=>r.startsWith("handicap_"))){let r=localStorage.getItem(`handicap_${s.ruleType}`)||"15";i["handicap_"+this.#t]=r}this.#s&&await this.#s.acceptChallenge(s.challengerId,s.ruleType,s.tableId,i,s.challengerName,t,this.#d),this.dispatch({type:"CHALLENGE_MSG",payload:{type:"accept",challengerId:s.challengerId,challengerName:s.challengerName,challengeeId:this.#t,ruleType:s.ruleType,tableId:s.tableId,options:i,nextTurnId:t,custom:this.#d}}),this.#i=null}async#N(){this.#i=null;let e=this.#y;this.#s&&await this.#s.declineChallenge(e.challengerId,e.ruleType,e.challengerName),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId})}#M(){this.#i=null;let e=this.#r;e&&this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId})}#R(){let e=[...this.#c].filter(t=>t.meta?.country!=="BOT").map(t=>{let{meta:s={},...i}=t,{ts:r,...a}=s;return{...i,meta:a}});console.log("=== USERS ==="),console.log(JSON.stringify(e,null,2)),console.log("=== MY INFO ==="),console.log(JSON.stringify({myId:this.#t,myName:this.#n})),console.log("=== NCHAN RECORDED MESSAGES ==="),console.log(this.#h.recordedMessages),console.log("=== SLOTS ==="),console.table(this.#$.map(t=>({userId:t.userId,status:t.status,offlineSince:t.offlineSince,online:t.status==="online"?"\u2713":"\u2717"})))}_openActiveTables=()=>{let t=Le(this.#l||[]).map(s=>s.tableId).map(s=>"active="+encodeURIComponent(s)).join("&");window.open(os+(t?"?"+t:""),"_blank","noopener")};#U(){if(this.#v)return;this.#v=!0;let e=H({tableId:this.#b,userId:this.#t,userName:this.#n,ruleType:this.#k,isFirst:this.#C,options:this.#T,lod:u.lod,flip:u.flip,custom:this.#d,opponent:this.#w?{userId:this.#w,userName:this.#A,custom:this.#P}:void 0});this.#i=null,this.#e={...this.#e,currentMatch:null},setTimeout(()=>{window.location.href=e},xe)}render(){if(this.#b)return this.#U(),o``;let e=this.#a;return o`
            <div class="panel-header">
                <span class="dot ${this.#_?this.#u?"green":"blue":""}" role="status" aria-label="${this.#_?this.#u?"Settled":"Connecting":"Disconnected"}" @click=${this._openActiveTables} style="cursor:pointer"></span>
                <span class="panel-title" @click=${()=>this.#R()}>Play Online (${this.#c.filter(t=>t.userId!==this.#t).length})</span>
            </div>
            <challenge-banner
                .challenge=${this.#y}
                .sent=${this.#r}
                myId=${this.#t}
                @accept=${()=>this.#m()}
                @decline=${()=>this.#N()}
                @cancel=${()=>this.#L()}
                @dismiss=${()=>this.#M()}>
            </challenge-banner>
            <user-list
                .slots=${this.#$}
                .users=${this.#l}
                myId=${this.#t}
                myName=${this.#n}
                tableId=${this.#b||""}
                .isChallengePending=${this.#r?.status==="pending"}
                .challenges=${this.#e.challenges}
                .pendingChats=${this.#g}
                @challenge=${t=>{let s=this.#c.find(i=>i.userId===t.detail);this.#a={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}
                @spectate=${t=>{let s=t.detail;window.location.href=us({tableId:s.tableId,userId:this.#t,userName:this.#n,ruleType:s.ruleType||"nineball",options:s.options})}}
                @open-chat=${t=>{let s=this.#c.find(i=>i.userId===t.detail);this.#o={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}>
            </user-list>
            <challenge-modal
                .userId=${e?.userId??null}
                .userName=${e?.userName??""}
                @confirm=${t=>{let s={...t.detail.options};s.handicap&&(s["handicap_"+this.#t]=s.handicap,delete s.handicap),this.#S(e.userId,t.detail.ruleType,s),this.#a=null}}
                @message=${()=>{this.#o={userId:e.userId,userName:e.userName},this.#a=null,this.requestUpdate()}}
                @cancel=${()=>{this.#a=null,this.requestUpdate()}}>
            </challenge-modal>
            <message-modal
                .lobby=${this.#s}
                .targetId=${this.#o?.userId??null}
                .targetName=${this.#o?.userName??""}
                @close=${()=>{this.#o=null,this.requestUpdate()}}
                @unread-changed=${t=>{this.#g=new Map(this.#g).set(t.detail.userId,t.detail.count),this.requestUpdate()}}>
            </message-modal>`}};customElements.define("online-panel",_t);var Yi=[[4352,4447,1],[11904,42191,1],[44032,55203,1],[63744,64255,1],[65040,65135,1],[65280,65376,1],[65504,65510,1],[127744,129791,1.25],[131072,195103,1]],Fs=n=>{let e=0,t=0;for(let s of n){let i=s.codePointAt(0),r=Yi.find(([a,l])=>i>=a&&i<=l);r?t+=r[2]:e++}return!e&&!t&&(e=1),`calc(${e}ch + ${+t.toFixed(2)}em)`},wt=class extends S{static properties={_dotColor:{state:!0}};static styles=ss;constructor(){super(),this._clientId=u.clientId,this._name=u.userName,this._dotColor=u.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||at();this._name=t,u.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return k?o``:o`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${Fs(this._name)}"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Fs(e.target.value)}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",wt);var Ji=`https://${z}/api/stats`,$t=class extends b{static styles=f`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(Ji,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return o`<span class="loading">Could not load stats.</span>`;if(!this._data)return o`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{}),i=s.reduce((r,[,a])=>r+a,0);return o`
            <div class="uptime">${i} unique visitors${e?o` in <a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}`:""}</div>
            <ul>
                ${s.map(([r,a])=>o`
                    <li>${E(r).emoji} <span>${r}</span> <span class="count">${a}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",$t);var St=class n extends S{static properties={_open:{state:!0},_notifEnabled:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[_,G,f`
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
    `];constructor(){super(),this._open=!1,this._copied=!1,this._picker=null,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=typeof Notification<"u"&&Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this),this._onMessage=this._onMessage.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown),window.addEventListener("message",this._onMessage)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown),window.removeEventListener("message",this._onMessage)}_onMessage(e){e.data?.type==="done"&&(this._picker=null)}_onKeydown(e){e.key==="Escape"&&(this._picker?this._picker=null:this._open&&this._close())}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1,this._picker=null}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked&&typeof Notification<"u"){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return o`
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
                                <input type="checkbox" .checked=${u.flip} @change=${e=>u.setFlip(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="row">
                            <span>Use proxy to connect</span>
                            <label class="switch">
                                <input type="checkbox" .checked=${u.useProxy} @change=${e=>u.setUseProxy(e.target.checked)}>
                                <span class="slider"></span>
                            </label>
                        </div>

                        <div class="section-title">Graphics</div>
                        <div class="row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${n.LOD_LABELS[u.lod]||u.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${u.lod} @input=${e=>u.setLod(e.target.value)}>
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
                                ${this._copied?o`<span class="copied-badge">Copied!</span>`:""}
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
                ${this._picker?o`
                    <div class="picker-backdrop" @click=${e=>e.target===e.currentTarget&&(this._picker=null)}>
                        <div class="picker-frame">
                            ${this._picker==="cue"?o`<iframe src="./cue.html" title="Cue"></iframe>`:o`<iframe src="./wall.html?userName=${encodeURIComponent(u.userName)}" title="Wall"></iframe>`}
                        </div>
                    </div>
                `:""}`:""}
        `}};customElements.define("settings-modal",St);var qi=5,Gs=1800*1e3,Wi=n=>(Math.floor(n/Gs)+1)*Gs,Ys=[{name:"Nine Ball Mini Hourly Arena",ruleType:"nineball",options:{tableSize:"6",freeaim:"true"}},{name:"Eight Ball Mini Hourly Arena",ruleType:"eightball",options:{tableSize:"6",freeaim:"true"}},{name:"Snooker Mini Hourly Arena",ruleType:"snooker",options:{tableSize:"6",reds:"3",freeaim:"true"}}],Vi=f`
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
`,Ki=(n,e=!1,t=null,s=!0)=>{let i=`lobby.html?tournamentId=${encodeURIComponent(n.id)}`,r=a=>{t?(a.preventDefault(),a.stopPropagation(),t(n.id)):a.currentTarget instanceof HTMLButtonElement&&(a.preventDefault(),window.location.href=a.currentTarget.closest("a").href)};return o`<a class="arena-item ${e?"completed":""}" href=${i} @click=${r}>
        <div class="arena-item-main"><div class="arena-item-title"><span class="arena-item-name">${we(n.ruleType,n.options)}${n.creatorName?o` · ${n.creatorName}`:""}</span><span class="arena-item-meta"> 👥\uFE0E ${n.players.length} · ⏰\uFE0E ${e?"ended":"ends"} ${new Date(n.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}</span></div></div>
        ${e&&n.winner?o`<span class="arena-winner" title="Winner: ${n.winner}">🏆 ${n.winner}</span>`:""}
        ${e||!s?"":o`<button class="arena-join btn-challenge" type="button" @click=${r}>Open</button>`}
    </a>`},It=class extends b{static properties={heading:{type:String},_arenas:{state:!0},_error:{state:!0},selectable:{type:Boolean}};static styles=[Vi,f`
        :host { display: block; }
        h2.title { margin: 0 0 .25rem; font-size: .8rem; font-weight: 600; }
        .error { color: var(--text-muted); font-size: .75rem; text-align: center; padding: .5rem 0; }
    `];constructor(){super(),this.heading="",this._arenas=[],this._error="",this.selectable=!1}connectedCallback(){super.connectedCallback(),this._load()}async load(){await this._load()}async _load(){try{let e=await fetch(`${I}/api/arena`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arenas (${e.status})`);let s=Date.now();if(!(t.arenas||[]).some(r=>r.endTime>s&&r.status!=="finished")){let r=Wi(s);if(Math.floor((r-s)/6e4)>=qi){let l=new Date(r),c=String(l.getUTCHours()).padStart(2,"0"),d=String(l.getUTCMinutes()).padStart(2,"0"),h=`${l.getUTCFullYear()}${String(l.getUTCMonth()+1).padStart(2,"0")}${String(l.getUTCDate()).padStart(2,"0")}-${c}${d}`,p=l.getUTCMinutes()>=30?1:0,m=(2*l.getUTCHours()+p)%Ys.length,g=Ys[m];if(await fetch(`${I}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`arena-hourly-${h}`,creatorId:"hourly-arena",creatorName:g.name,ruleType:g.ruleType,options:g.options,endTime:r})}),e=await fetch(`${I}/api/arena`),t=await e.json(),!e.ok)throw new Error(t.error||`Unable to reload Arenas (${e.status})`)}}this._arenas=(t.arenas||[]).sort((r,a)=>a.createdAt-r.createdAt),this._error="",this.dispatchEvent(new CustomEvent("arenas-loaded",{detail:{arenas:this._arenas},bubbles:!0,composed:!0}))}catch(e){this._error=e.message||"Unable to load Arenas."}}get _activeArenas(){let e=Date.now();return this._arenas.filter(t=>t.endTime>e&&t.status!=="finished")}_onSelect(e){this.dispatchEvent(new CustomEvent("arena-select",{detail:{arenaId:e},bubbles:!0,composed:!0}))}render(){let e=this._activeArenas;return o`
            ${this.heading?o`<h2 class="title">${this.heading}</h2>`:""}
            ${this._error&&!e.length?o`<div class="error">Could not load arenas.</div>`:e.length?o`<div class="arena-list" aria-label="Active Arenas">${e.map(t=>Ki(t,!1,this.selectable?s=>this._onSelect(s):null))}</div>`:o`<div class="empty">No active Arenas.</div>`}
        `}};customElements.define("active-arenas",It);var Et=class extends b{static properties={arenaId:{type:String},_messages:{state:!0},_hidden:{state:!0}};static styles=[_,f`
      :host { display: block; font-size: 0.8rem; }
      .chat { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 2px; display: flex; flex-direction: column; gap: 2px; }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .title { margin: 0 0 .5rem; font-size: 1.1rem; font-weight: 600; color: var(--text); }
      .chat { contain: layout style; }
      .messages {
        display: flex; flex-direction: column; gap: 2px;
        flex: 1 1 auto; min-height: 3rem; max-height: 10rem;
        overflow-y: auto;
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
    `];constructor(){super(),this.arenaId="",this._messages=[],this._hidden=!1,this._ws=null}connectedCallback(){super.connectedCallback()}updated(e){e.has("arenaId")&&this.arenaId&&(this._ws?.close(),this._messages=[],this._connect()),(e.has("_messages")||e.has("_hidden")&&!this._hidden)&&this._scheduleScrollToBottom()}_scheduleScrollToBottom(){this._scrollRaf||(this._scrollRaf=requestAnimationFrame(()=>{this._scrollRaf=0,this._scrollToBottom()}))}_scrollToBottom(){if(this._hidden)return;let e=this.renderRoot.querySelector(".messages");e&&(e.scrollTop=e.scrollHeight)}disconnectedCallback(){super.disconnectedCallback(),this._ws?.close(),this._scrollRaf&&(cancelAnimationFrame(this._scrollRaf),this._scrollRaf=0)}_connect(){let e=`${ie}/subscribe/arena/${encodeURIComponent(this.arenaId)}`;this._ws=new WebSocket(e),this._ws.onmessage=t=>{try{let i=JSON.parse(t.data).message??t.data;this._messages=[...this._messages.slice(-4),String(i)]}catch{this._messages=[...this._messages.slice(-4),t.data]}}}_send(){let e=this.renderRoot.querySelector("input"),t=e.value.trim();if(!t||!this.arenaId)return;let s=location.hostname==="localhost"||location.hostname==="127.0.0.1"?`http://${location.hostname}:8080`:`https://${z}`;fetch(`${s}/publish/arena/${encodeURIComponent(this.arenaId)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})}),e.value=""}_onKeydown(e){e.key==="Enter"&&this._send()}_onInput(){this._scrollToBottom()}render(){return o`
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
          <input maxlength="120" placeholder="message…" @keydown=${this._onKeydown} @input=${this._onInput} />
          <button @click=${this._send}>send</button>
        </div>
      </div>
    `}};customElements.define("arena-chat",Et);var kt=class extends b{static properties={standings:{attribute:!1}};static styles=[_,f`
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
        </div>`:o`<div class="empty">No final standings available.</div>`}};customElements.define("arena-podium",kt);var Ct=class extends b{static properties={standings:{attribute:!1},players:{attribute:!1},onlineUsers:{attribute:!1},expired:{type:Boolean},countdown:{type:String}};static styles=[f`
        :host { display: block; }
        .leaderboard-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: .25rem; }
        .title { margin: 0; font-size: .8rem; font-weight: 600; }
        .meta { color: var(--text-dim); font-size: .75rem; line-height: 1.7; }
        .countdown { font-size: .85rem; font-weight: 600; color: var(--text-dim); font-variant-numeric: tabular-nums; }
        .players-scroll { max-height: 14.85rem; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        .players { width: 100%; border-collapse: collapse; }
        thead { position: sticky; top: 0; background: transparent; z-index: 1; }
        th, td { height: 1.35rem; box-sizing: border-box; padding: .15rem .25rem; border-bottom: none; line-height: 1.2; text-align: right; }
        th { color: var(--text); font-size: .7rem; }
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
                    <tbody>${this.standings.map((e,t)=>{let s=this.players.find(r=>r.playerId===e.playerId),i=Qi(e.playerId)?!0:this.onlineUsers.some(r=>r.userId===e.playerId);return o`<tr>
                            <td>#${t+1}</td>
                            <td>
                                ${i?o`<span class="online-dot" role="img" aria-label="Online" title="Online"></span>`:""}
                                ${e.name}${s?.active===!1?" (left)":""}
                            </td>
                            <td>${e.points}</td>
                            <td>${e.wins}</td>
                            <td>${e.games}</td>
                        </tr>`})}</tbody>
                </table></div>`:o`<div class="empty">No players have joined yet.</div>`}
        `}};function Qi(n){return["bot-thefarjaw","bot-clawbreak"].includes(n)}customElements.define("arena-leaderboard",Ct);var Xi=new Set(["bot-thefarjaw","bot-clawbreak"]),Zi={"bot-thefarjaw":"TheFarJaw","bot-clawbreak":"ClawBreak"},Tt=n=>Xi.has(n),At=10,en=5,Js=2e3,Pt=class extends b{static properties={arenaId:{type:String},lobby:{type:Object},theme:{type:String,reflect:!0},_arena:{state:!0},_leaderboard:{state:!0},_onlineUsers:{state:!0},_busy:{state:!0},_error:{state:!0},_pairingState:{state:!0},_pairingCountdown:{state:!0},_pairedName:{state:!0},_berserk:{state:!0}};static styles=[te,_,f`
        :host { display: block; box-sizing: border-box; background: var(--surface); color: var(--text); font-family: 'Exo', sans-serif; font-size: .85rem; }
        .container { max-width: 900px; margin: 0 auto; }
        .topbar { display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem; }
        .logo { width: 32px; height: 32px; opacity: .7; }
        h1 { flex: 1; margin: 0; font-size: 1rem; letter-spacing: .1em; text-transform: uppercase; color: var(--text-dim); }
        h1 a { color: inherit; text-decoration: none; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 2px; margin-bottom: 2px; }
        .container > .panel:last-child { margin-bottom: 0; }
        .title { margin: 0 0 2px; font-size: .8rem; font-weight: 600; }
        .meta { color: var(--text-dim); font-size: .75rem; line-height: 1.7; white-space: nowrap; }
        .error { padding: 2px; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; }
        .actions { display: flex; gap: 2px; margin-top: 2px; }
        .actions button { flex: 1; padding: .25rem; }
        .countdown { font-size: .85rem; font-weight: 600; color: var(--text-dim); font-variant-numeric: tabular-nums; }

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
        .pairing-berserk {
            flex: 0 0 auto;
            padding: .35rem .5rem;
        }
        .pairing-berserk[aria-pressed="true"] {
            background: #fd7e14;
            border-color: #fd7e14;
            color: #fff;
            box-shadow: 0 0 0 1px rgba(253, 126, 20, 0.35);
        }
        .pairing-berserk[aria-pressed="true"]:hover {
            background: #e96b02;
            border-color: #e96b02;
        }
        .panel-heading { display: flex; align-items: center; gap: 2px; }
        .panel-heading .title { flex: 1; }
    `];constructor(){super(),this.arenaId="",this.lobby=null,this.theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",this._arena=null,this._leaderboard=[],this._onlineUsers=[],this._busy=!1,this._theme=this.theme,document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme,this._lobby=null,this._lobbyWired=!1,this._error="",this._timer=null,this._staleRefetchedPlayers=new Set,this._lastLoadedArenaId=null,this._pairingState=null,this._pairingCountdown=At,this._pairedName="",this._berserk=!1,this._pairingInterval=null,this._pairingTimeout=null,this._pendingArenaChallenge=null}connectedCallback(){super.connectedCallback(),this._load(),this.lobby&&this._setupLobby(),this._timer=setInterval(()=>{this._arena&&this.requestUpdate()},1e3)}updated(e){e.has("lobby")&&this.lobby&&this._setupLobby(),e.has("arenaId")&&this.arenaId&&this.arenaId!==this._lastLoadedArenaId&&this._load()}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),this._cancelPairing(),this._pendingArenaChallenge=null,this._lobbyWired=!1,super.disconnectedCallback()}_isExpired(){return!!(this._arena&&this._arena.endTime&&Date.now()>=this._arena.endTime)}get _localCustom(){let e=u.getCustom();return(e.emoji===void 0||e.emoji===null)&&this._onlineUsers.find(s=>s.userId===u.clientId)?.meta?.country==="BOT"?{...e,emoji:"\u{1F916}"}:e}_getCountdownText(){if(!this._arena||!this._arena.endTime)return"";let e=Math.max(0,this._arena.endTime-Date.now());if(e<=0||this._arena.status==="finished")return"00:00";let t=Math.floor(e/1e3),s=Math.floor(t/60),i=t%60;if(s>=60){let r=Math.floor(s/60),a=s%60;return`${String(r).padStart(2,"0")}:${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`}return`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_setupLobby(){!this.lobby||this._lobbyWired||(this._lobby=this.lobby,this._lobbyWired=!0,this._syncArenaPresence(),this._lobby.onUsersChange(e=>{this._onlineUsers=[...e,{userId:u.clientId,userName:u.userName,custom:this._localCustom}],this._checkStaleArenaPresence()}),this._lobby.onChallenge(e=>{e.type==="offer"?this._handleIncomingChallenge(e):this._handleArenaChallengeMessage(e)}))}_isArenaReturnRedirect(){let e=new URLSearchParams(window.location.search);return e.get("opponent.userId")?!!(e.get("tournamentId")||e.get("arenaId")||e.get("arena")):!1}async _handleIncomingChallenge(e){if(e.type!=="offer"||e.challengeeId!==u.clientId)return;let t=this._berserk,s=this._isArenaReturnRedirect();if(s)try{t||(t=localStorage.getItem("arenaBerserk")==="true"),localStorage.removeItem("arenaBerserk")}catch{}let i=this._pairingState==="counting";if(this._cancelPairing(),e.options?.tournamentId!==this.arenaId){i&&this.requestUpdate();return}let r=this._arena?.players?.some(a=>a.playerId===u.clientId&&a.active!==!1);if(!r&&s){if(this._arena||await this._load(),!this._arena?.players?.some(l=>l.playerId===u.clientId&&l.active!==!1)){let l=(u.userName||"").trim();if(!l||/^(anonymous|anon)$/i.test(l)){i&&this.requestUpdate();return}try{await this._mutate("join",{playerId:u.clientId,name:l})}catch(d){console.error("Arena auto-join failed:",d),i&&this.requestUpdate();return}if(!this._arena?.players?.some(d=>d.playerId===u.clientId&&d.active!==!1)){i&&this.requestUpdate();return}}}else if(!r){i&&this.requestUpdate();return}await this._acceptArenaChallenge(e,t)}_handleArenaChallengeMessage(e){let t=this._pendingArenaChallenge;if(!t||e.challengerId!==u.clientId||e.challengeeId!==t.opponentId)return;if(e.type==="decline"||e.type==="cancel"){this._pendingArenaChallenge=null;return}if(e.type!=="accept")return;if(!t.tableId){t.earlyAccept=e;return}if(e.tableId!==t.tableId)return;this._pendingArenaChallenge=null;let s=e.ruleType||t.ruleType,i=e.options||t.options,r=e.nextTurnId?e.nextTurnId===u.clientId:!0,a=H({tableId:e.tableId,userId:u.clientId,userName:u.userName,ruleType:s,isFirst:r,options:i,localOptions:t.berserk?{berserk:"true"}:void 0,lod:u.lod,flip:u.flip,custom:this._localCustom,opponent:{userId:t.opponentId,userName:t.opponentName,custom:t.opponentCustom}});window.location.href=a}async _acceptArenaChallenge(e,t=this._berserk){if(!this._lobby)return;let s=e.ruleType||this._arena?.ruleType||"nineball",i=e.options||this._arena?.options||{};try{t?localStorage.setItem("arenaBerserk","true"):localStorage.removeItem("arenaBerserk")}catch{}try{await this._lobby.acceptChallenge(e.challengerId,s,e.tableId,i,e.challengerName,void 0,this._localCustom)}catch(l){console.error("Arena auto-accept failed:",l);return}let r=e.nextTurnId?e.nextTurnId===u.clientId:!1,a=H({tableId:e.tableId,userId:u.clientId,userName:u.userName,ruleType:s,isFirst:r,options:i,localOptions:t?{berserk:"true"}:void 0,lod:u.lod,flip:u.flip,custom:this._localCustom,opponent:{userId:e.challengerId,userName:e.challengerName||"",custom:e.custom}});setTimeout(()=>{window.location.href=a},xe)}async _load(){if(this.arenaId){this._busy=!0,this._error="";try{let e=await _e(this.arenaId);this._arena=e.arena,this._leaderboard=e.leaderboard||[],this.arenaId!==this._lastLoadedArenaId&&(this._staleRefetchedPlayers.clear(),this._lastLoadedArenaId=this.arenaId),await this._syncArenaPresence()}catch(e){this._error=e.message||"Unable to load Arena."}finally{this._busy=!1,this._checkStaleArenaPresence()}}}async _join(){let e=(u.userName||"").trim();if(gs(e)){window.alert("You must change name, Anonymous is not a valid arena name");return}await this._mutate("join",{playerId:u.clientId,name:e})}async _leave(){if(this._cancelPairing(),this._lobby)try{await this._lobby.updatePresence({arenaId:void 0})}catch(e){console.error("Failed to clear arena presence:",e)}await this._mutate("leave",{playerId:u.clientId})}async _syncArenaPresence(){if(!this._lobby||!this._arena)return;let e=this._arena.players?.find(t=>t.playerId===u.clientId);try{await this._lobby.updatePresence({arenaId:e?.active!==!1&&e?this.arenaId:void 0,type:"heartbeat"})}catch(t){console.error("Failed to update Arena presence:",t)}}_checkStaleArenaPresence(){if(!this._arena||!this._lobby)return;let e=this._onlineUsers.find(t=>t.userId!==u.clientId&&t.arenaId===this.arenaId&&!this._staleRefetchedPlayers.has(t.userId)&&!this._arena.players?.some(s=>s.playerId===t.userId));e&&this._refetchArenaFor(e.userId)}_refetchArenaFor(e){this._busy||this._staleRefetchedPlayers.has(e)||(this._staleRefetchedPlayers.add(e),this._load())}async _mutate(e,t){this._busy=!0,this._error="";try{let s=await fetch(`${I}/api/arena/${encodeURIComponent(this.arenaId)}/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),i=await s.json();if(!s.ok)throw new Error(i.error||`${e} failed (${s.status})`);await this._load()}catch(s){this._error=s.message||`Unable to ${e} Arena.`,this._busy=!1,this._checkStaleArenaPresence()}}_getPairingCandidates(){let e=u.clientId,t=[],s=[],i=[];for(let r of this._leaderboard){if(r.playerId===e)continue;let a=Tt(r.playerId),l=this._arena?.players?.find(m=>m.playerId===r.playerId),c=this._onlineUsers.find(m=>m.userId===r.playerId),d=!a&&!!c?.tableId,h=l?.active!==!1&&(a||!!(c&&!d)),p={playerId:r.playerId,name:r.name,playing:d,bot:a,available:h};i.push(p),h&&(a?s.push(r):t.push(r))}return{candidates:t.length>0?t:s,diagnostics:i}}_findEligibleOpponents(){return this._getPairingCandidates().candidates}_startPairing(){this._pairingState!=="counting"&&(this._pairingState="counting",this._pairingCountdown=this._getPairingCandidates().candidates.some(e=>!Tt(e.playerId))?en:At,this._pairedName="",this._pairingInterval=setInterval(()=>this._onPairingTick(),1e3))}_cancelPairing(){this._pairingInterval&&(clearInterval(this._pairingInterval),this._pairingInterval=null),this._pairingTimeout&&(clearTimeout(this._pairingTimeout),this._pairingTimeout=null),this._pairingState=null,this._pairingCountdown=At,this._pairedName="",this._berserk=!1}_onPairingTick(){let e=this._arena,t=u.clientId,s=e?.players?.some(r=>r.playerId===t&&r.active!==!1),i=e?.status==="active"&&Date.now()<(e?.endTime||0);if(!s||!i){this._cancelPairing();return}if(this._pairingCountdown-=1,this._pairingCountdown<=0){clearInterval(this._pairingInterval),this._pairingInterval=null,this._executePairing();return}this.requestUpdate()}_getOpponentHistory(){if(!this.arenaId)return[];try{let e=localStorage.getItem(`arena_opponents_${this.arenaId}`);return e?JSON.parse(e):[]}catch{return[]}}_recordOpponentHistory(e){if(!(!this.arenaId||!e))try{let t=this._getOpponentHistory();t.push(e),t.length>10&&t.shift(),localStorage.setItem(`arena_opponents_${this.arenaId}`,JSON.stringify(t))}catch(t){console.error("Failed to save opponent history:",t)}}async _executePairing(){let e=this._berserk;this._berserk=!1;let{candidates:t,diagnostics:s}=this._getPairingCandidates();if(t.length===0){console.log("[Arena pairing]",{candidates:s,choice:null}),this._pairingState="no-opponent",this._pairingTimeout=setTimeout(()=>this._cancelPairing(),Js);return}let i=this._getOpponentHistory(),r={};for(let h of i)r[h]=(r[h]||0)+1;let a=1/0;for(let h of t){let p=r[h.playerId]||0;p<a&&(a=p)}let l=t.filter(h=>(r[h.playerId]||0)===a),c=l[Math.floor(Math.random()*l.length)];this._recordOpponentHistory(c.playerId);let d=s.find(h=>h.playerId===c.playerId);console.log("[Arena pairing]",{candidates:s,choice:d}),this._pairedName=c.name,this._pairingState="paired";try{await this._initiateChallenge(c,e)}catch(h){console.error("Pairing challenge failed:",h)}this._pairingTimeout=setTimeout(()=>this._cancelPairing(),Js)}async _initiateChallenge(e,t=this._berserk){let s=this._arena,i=s?.ruleType||"nineball",r=s?.options||{},a=s?.id||"";if(Tt(e.playerId)){let d=Zi[e.playerId]||e.name,h="arena-bot-"+Math.random().toString(36).slice(2,8),p=H({tableId:h,userId:u.clientId,userName:u.userName,ruleType:i,isFirst:!0,options:r,bot:d,lod:u.lod,custom:this._localCustom,opponent:{userId:e.playerId,userName:e.name,custom:e.custom},flip:u.flip,localOptions:t?{berserk:"true"}:void 0});window.location.href=p+`&tournamentId=${encodeURIComponent(a)}`;return}if(!this._lobby){console.error("Pairing: no lobby connection");return}let l={...r,tournamentId:a},c={opponentId:e.playerId,opponentName:e.name,opponentCustom:e.custom||this._onlineUsers.find(d=>d.userId===e.playerId)?.custom,ruleType:i,options:l,berserk:t,tableId:null,earlyAccept:null};this._pendingArenaChallenge=c;try{let d=await this._lobby.challenge(e.playerId,i,l,void 0,this._localCustom);if(c.tableId=d,c.earlyAccept){let h=c.earlyAccept;c.earlyAccept=null,this._handleArenaChallengeMessage(h)}}catch(d){throw this._pendingArenaChallenge===c&&(this._pendingArenaChallenge=null),d}}_renderPairingOverlay(){return this._pairingState==="counting"?o`
                <div class="pairing-overlay active" role="status" aria-live="polite">
                    <div class="pairing-tick" aria-label="Seconds remaining: ${this._pairingCountdown}">${this._pairingCountdown}</div>
                    <div class="pairing-label">Pairing…</div>
                    <div class="pairing-hint">Finding an opponent</div>
                    <button class="pairing-berserk" type="button" title="Half shot time for DOUBLE points" aria-pressed=${this._berserk} @click=${()=>{this._berserk=!this._berserk}}>Berserk 🚀</button>
                    <button type="button" @click=${this._cancelPairing}>Cancel</button>
                </div>`:this._pairingState==="paired"?o`
                <div class="pairing-overlay active" role="status" aria-live="assertive">
                    <div class="pairing-result">Paired with ${this._pairedName}</div>
                </div>`:this._pairingState==="no-opponent"?o`
                <div class="pairing-overlay" role="status" aria-live="assertive">
                    <div class="pairing-result">No available opponents</div>
                </div>`:null}render(){let e=this._arena,t=u.clientId,s=e?.players?.find(p=>p.playerId===t),i=!!s,r=s?.active!==!1,a=this._isExpired(),l=e?.status==="active"&&!a,c=i&&r&&l&&this._pairingState===null,d=this._pairingState!==null,h=this._renderPairingOverlay();return o`<div class="container">
            ${this._error?o`<div class="error" role="alert">${this._error}</div>`:""}
            ${!e&&!this._error?o`<section class="panel"><div class="empty">Loading Arena…</div></section>`:""}
            ${e?o`
                <section class="panel">
                    <div class="meta">
                        Status: ${a?"complete":e.status} · ${e.durationMinutes} minutes · ${e.players.length} participant${e.players.length===1?"":"s"} · ${a?"Ended":"Ends"}: ${new Date(e.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}
                    </div>
                    ${a?"":o`<div class="actions">
                        <button type="button" ?disabled=${this._busy||d} @click=${this._load}>Refresh</button>
                        ${i&&r?o`<button class="btn-leave" type="button" ?disabled=${this._busy} @click=${this._leave}>Leave Arena</button>`:o`<button class="btn-accept" type="button" ?disabled=${this._busy||!l} title="Joining arena makes you available for pairing" @click=${this._join}>Join Arena</button>`}
                        ${c?o`<button class="btn-challenge" type="button" title="Seek available opponent" @click=${this._startPairing}>Pair</button>`:""}
                    </div>`}
                </section>
                <section class="panel">
                    ${h}
                    <arena-leaderboard
                        .standings=${this._leaderboard}
                        .players=${e.players}
                        .onlineUsers=${this._onlineUsers}
                        .expired=${a}
                        countdown=${this._getCountdownText()}
                    ></arena-leaderboard>
                </section>`:""}
        </div>`}};customElements.define("arena-view",Pt);var Lt=class extends b{static properties={arenaId:{type:String},lobby:{type:Object},theme:{type:String,reflect:!0},_arenaName:{state:!0}};static styles=[te,_,f`
        :host { display: block; }
        .panel-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 0;
            margin-bottom: 2px;
            gap: .5rem;
        }
        .arena-title {
            display: flex;
            align-items: center;
            gap: .4rem;
            font-size: .85rem;
            font-weight: 600;
            color: var(--text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            min-width: 0;
        }
        .loading {
            color: var(--text-muted);
            font-size: .75rem;
        }
        .manage-link {
            font-size: .75rem;
            color: var(--text-muted);
            text-decoration: none;
            flex-shrink: 0;
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
            flex-shrink: 0;
        }
        .btn-close:hover {
            background: var(--surface-hover, rgba(255, 255, 255, 0.08));
        }
        .content {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
    `];constructor(){super(),this.arenaId="",this.lobby=null,this.theme="",this._arenaName=""}connectedCallback(){super.connectedCallback(),this._loadArenaName()}updated(e){e.has("arenaId")&&this.arenaId&&this._loadArenaName()}async _loadArenaName(){if(this.arenaId)try{let e=await _e(this.arenaId);if(e.arena){let t=e.arena,s=t.creatorName?o`${we(t.ruleType,t.options)} ${t.creatorName}`:"Arena";this._arenaName=s}}catch(e){e.status?this._arenaName="Arena no longer available":console.error("Failed to load arena name:",e)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return o`
            <div class="panel-bar">
                <div class="arena-title">${this._arenaName||o`<span class="loading">Loading...</span>`}</div>
                <a class="manage-link" href="arena.html">Manage Arenas ↗</a>
                <button type="button" class="btn-close" @click=${this._close} aria-label="Close Arena">✕ Close</button>
            </div>
            <div class="content">
                <arena-view .arenaId=${this.arenaId} .lobby=${this.lobby} .theme=${this.theme}></arena-view>
                <arena-chat .arenaId=${this.arenaId}></arena-chat>
            </div>
        `}};customElements.define("arena-panel",Lt);var Nt=class extends b{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_sidebarOpen:{type:Boolean},_activeArenaId:{state:!0},_lobby:{state:!0}};static styles=as;constructor(){super(),console.log("URL:",window.location.href),console.log("Search params:",Object.fromEntries(new URLSearchParams(window.location.search))),this._theme=document.documentElement.getAttribute("theme")||"light",this._sidebarOpen=!1;let e=new URLSearchParams(window.location.search);this._activeArenaId=e.get("tournamentId")||e.get("arenaId")||e.get("arena")||null,this._lobby=null,this.addEventListener("user-list-toggle",t=>{this._sidebarOpen=t.detail.expanded}),this.addEventListener("arena-select",t=>{this._activeArenaId=t.detail.arenaId;let s=new URL(window.location.href);s.searchParams.set("tournamentId",t.detail.arenaId),window.history.replaceState({},"",s.pathname+s.search),this._scrollToArenaPanel("nearest")}),this.addEventListener("lobby-ready",t=>{this._lobby=t.detail}),window.addEventListener("popstate",()=>{let t=new URLSearchParams(window.location.search),s=t.get("tournamentId")||t.get("arenaId")||t.get("arena")||null;s!==this._activeArenaId&&(this._activeArenaId=s)})}firstUpdated(){super.firstUpdated(),this._activeArenaId&&this._scrollToArenaPanel("start")}_scrollToArenaPanel(e){requestAnimationFrame(()=>{this.shadowRoot.querySelector(".arenas-row")?.scrollIntoView({behavior:"smooth",block:e})})}_closeArenaPanel=()=>{this._activeArenaId=null;let e=new URL(window.location.href);(e.searchParams.has("tournamentId")||e.searchParams.has("arenaId")||e.searchParams.has("arena"))&&(e.searchParams.delete("tournamentId"),e.searchParams.delete("arenaId"),e.searchParams.delete("arena"),e.searchParams.delete("opponent.userId"),e.searchParams.delete("opponent.userName"),e.searchParams.delete("ruletype"),e.searchParams.delete("nextTurnId"),window.history.replaceState({},"",e.pathname+(e.search?e.search:"")))};get _ctrl(){return this.shadowRoot.querySelector("online-panel")}render(){return o`
            <div class="container">
                <header class="topbar">
                    <a href="https://billiards.tailuge.workers.dev/lobby" class="topbrand" aria-label="Billiards lobby"><img src="assets/threecushion.png" class="logo" alt=""></a>
                    <h1><a href="https://billiards.tailuge.workers.dev/lobby">Billiards</a><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" class="version">${ve(ye)}</a></h1>
                    <trophy-item></trophy-item>
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
                    <div class="arenas-row">
                        <div class="arena-col panel">
                            ${this._activeArenaId?o`<arena-panel
                                    .arenaId=${this._activeArenaId}
                                    .lobby=${this._lobby||this._ctrl?.lobby}
                                    .theme=${this._theme}
                                    @close=${this._closeArenaPanel}
                                  ></arena-panel>`:o`<active-arenas selectable></active-arenas>`}
                        </div>
                    </div>
                    <div class="info-row"><info-panel></info-panel></div>
                </main>
            </div>
        `}};customElements.define("lobby-app",Nt);})();
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
lit-html/directives/unsafe-html.js:
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
