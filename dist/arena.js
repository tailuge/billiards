"use strict";(()=>{var L=globalThis,M=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,B=Symbol(),he=new WeakMap,k=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==B)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(M&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=he.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&he.set(t,e))}return e}toString(){return this.cssText}},pe=o=>new k(typeof o=="string"?o:o+"",void 0,B),h=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((r,i,n)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[n+1],o[0]);return new k(t,o,B)},ue=(o,e)=>{if(M)o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),i=L.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,o.appendChild(r)}},D=M?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return pe(t)})(o):o;var{is:je,defineProperty:Oe,getOwnPropertyDescriptor:He,getOwnPropertyNames:Be,getOwnPropertySymbols:De,getPrototypeOf:Fe}=Object,P=globalThis,me=P.trustedTypes,Ge=me?me.emptyScript:"",Ye=P.reactiveElementPolyfillSupport,C=(o,e)=>o,F={toAttribute(o,e){switch(e){case Boolean:o=o?Ge:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},fe=(o,e)=>!je(o,e),be={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:fe};Symbol.metadata??=Symbol("metadata"),P.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=be){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&Oe(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){let{get:i,set:n}=He(this.prototype,e)??{get(){return this[t]},set(s){this[t]=s}};return{get:i,set(s){let l=i?.call(this);n?.call(this,s),this.requestUpdate(e,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??be}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let e=Fe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let t=this.properties,r=[...Be(t),...De(t)];for(let i of r)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)t.unshift(D(i))}else e!==void 0&&t.push(D(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ue(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){let n=(r.converter?.toAttribute!==void 0?r.converter:F).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=r.getPropertyOptions(i),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:F;this._$Em=i;let l=s.fromAttribute(t,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,r,i=!1,n){if(e!==void 0){let s=this.constructor;if(i===!1&&(n=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??fe)(n,t)||r.useDefault&&r.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:n},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),n!==!0||s!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,n]of r){let{wrapped:s}=n,l=this[i];s!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[C("elementProperties")]=new Map,y[C("finalized")]=new Map,Ye?.({ReactiveElement:y}),(P.reactiveElementVersions??=[]).push("2.1.2");var K=globalThis,ge=o=>o,j=K.trustedTypes,xe=j?j.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ae="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,Se="?"+v,Ve=`<${Se}>`,$=document,T=()=>$.createComment(""),N=o=>o===null||typeof o!="object"&&typeof o!="function",Z=Array.isArray,We=o=>Z(o)||typeof o?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ye=/-->/g,ve=/>/g,_=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_e=/'/g,we=/"/g,Ee=/^(?:script|style|textarea|title)$/i,Q=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),c=Q(1),lt=Q(2),ct=Q(3),A=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),$e=new WeakMap,w=$.createTreeWalker($,129);function ke(o,e){if(!Z(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return xe!==void 0?xe.createHTML(e):e}var qe=(o,e)=>{let t=o.length-1,r=[],i,n=e===2?"<svg>":e===3?"<math>":"",s=I;for(let l=0;l<t;l++){let a=o[l],p,u,d=-1,g=0;for(;g<a.length&&(s.lastIndex=g,u=s.exec(a),u!==null);)g=s.lastIndex,s===I?u[1]==="!--"?s=ye:u[1]!==void 0?s=ve:u[2]!==void 0?(Ee.test(u[2])&&(i=RegExp("</"+u[2],"g")),s=_):u[3]!==void 0&&(s=_):s===_?u[0]===">"?(s=i??I,d=-1):u[1]===void 0?d=-2:(d=s.lastIndex-u[2].length,p=u[1],s=u[3]===void 0?_:u[3]==='"'?we:_e):s===we||s===_e?s=_:s===ye||s===ve?s=I:(s=_,i=void 0);let f=s===_&&o[l+1].startsWith("/>")?" ":"";n+=s===I?a+Ve:d>=0?(r.push(p),a.slice(0,d)+Ae+a.slice(d)+v+f):a+v+(d===-2?l:f)}return[ke(o,n+(o[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},R=class o{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let n=0,s=0,l=e.length-1,a=this.parts,[p,u]=qe(e,t);if(this.el=o.createElement(p,r),w.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=w.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(Ae)){let g=u[s++],f=i.getAttribute(d).split(v),z=/([.?@])?(.*)/.exec(g);a.push({type:1,index:n,name:z[2],strings:f,ctor:z[1]==="."?V:z[1]==="?"?W:z[1]==="@"?q:E}),i.removeAttribute(d)}else d.startsWith(v)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(Ee.test(i.tagName)){let d=i.textContent.split(v),g=d.length-1;if(g>0){i.textContent=j?j.emptyScript:"";for(let f=0;f<g;f++)i.append(d[f],T()),w.nextNode(),a.push({type:2,index:++n});i.append(d[g],T())}}}else if(i.nodeType===8)if(i.data===Se)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(v,d+1))!==-1;)a.push({type:7,index:n}),d+=v.length-1}n++}}static createElement(e,t){let r=$.createElement("template");return r.innerHTML=e,r}};function S(o,e,t=o,r){if(e===A)return e;let i=r!==void 0?t._$Co?.[r]:t._$Cl,n=N(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(o),i._$AT(o,t,r)),r!==void 0?(t._$Co??=[])[r]=i:t._$Cl=i),i!==void 0&&(e=S(o,i._$AS(o,e.values),i,r)),e}var Y=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,i=(e?.creationScope??$).importNode(t,!0);w.currentNode=i;let n=w.nextNode(),s=0,l=0,a=r[0];for(;a!==void 0;){if(s===a.index){let p;a.type===2?p=new U(n,n.nextSibling,this,e):a.type===1?p=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(p=new J(n,this,e)),this._$AV.push(p),a=r[++l]}s!==a?.index&&(n=w.nextNode(),s++)}return w.currentNode=$,i}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},U=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),N(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):We(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T($.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=R.createElement(ke(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new Y(i,this),s=n.u(this.options);n.p(t),this.T(s),this._$AH=n}}_$AC(e){let t=$e.get(e.strings);return t===void 0&&$e.set(e.strings,t=new R(e)),t}k(e){Z(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,i=0;for(let n of e)i===t.length?t.push(r=new o(this.O(T()),this.O(T()),this,this.options)):r=t[i],r._$AI(n),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=ge(e).nextSibling;ge(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(e,t=this,r,i){let n=this.strings,s=!1;if(n===void 0)e=S(this,e,t,0),s=!N(e)||e!==this._$AH&&e!==A,s&&(this._$AH=e);else{let l=e,a,p;for(e=n[0],a=0;a<n.length-1;a++)p=S(this,l[r+a],t,a),p===A&&(p=this._$AH[a]),s||=!N(p)||p!==this._$AH[a],p===m?e=m:e!==m&&(e+=(p??"")+n[a+1]),this._$AH[a]=p}s&&!i&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},V=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},W=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},q=class extends E{constructor(e,t,r,i,n){super(e,t,r,i,n),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??m)===A)return;let r=this._$AH,i=e===m&&r!==m||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==m&&(r===m||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},J=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}};var Je=K.litHtmlPolyfillSupport;Je?.(R,U),(K.litHtmlVersions??=[]).push("3.3.2");var Ce=(o,e,t)=>{let r=t?.renderBefore??e,i=r._$litPart$;if(i===void 0){let n=t?.renderBefore??null;r._$litPart$=i=new U(e.insertBefore(T(),n),n,void 0,t??{})}return i._$AI(o),i};var X=globalThis,b=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ce(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};b._$litElement$=!0,b.finalized=!0,X.litElementHydrateSupport?.({LitElement:b});var Ke=X.litElementPolyfillSupport;Ke?.({LitElement:b});(X.litElementVersions??=[]).push("4.2.2");var ee=h`
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
`,$t=h`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,Ie=h`
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
`,At=h`
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
`,St=h`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,Et=h`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,kt=h`
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
    }`,Ct=h`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,Te=h`
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
`,It=h`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,Tt=h`
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
`,Nt=h`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,Rt=[ee,h`
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
`];var Ze=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",Ne=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),Lt=Ne?`ws://${window.location.hostname}:80`:`wss://${Ze}`;var O=typeof window<"u"&&window.location.hostname.includes("vercel");var Mt=Ne?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/";var Qe={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},Xe=o=>{let e=Qe[o];return e?c`<img src="assets/${e}.png" alt="${o}" title="${o}" width="18" height="18" style="vertical-align:middle">`:c`🎱`},Re=(o,e={})=>c`<span title="${o}">
    ${Xe(o)}${e?.freeaim?"\u2316":""}${Number(e?.tableSize)<10?"\u{1F37C}":""}
</span>`;var Ue=o=>{let e=(o||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},te=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),r=(e.get("userName")||"").trim();O&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),n=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,r||(this.userName=window.name.split("-")[0]);else{let l=r||n||"",a=!l||i.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&a?i:Ue(l),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=r||this.userName||n||"Anonymous",this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",s=>{if(s.key==="custom"){try{this.custom=JSON.parse(s.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():Ue(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},x=new te,H=class extends b{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),x.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),x.removeEventListener("change",this._storeListener)}};var re=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"https://billiards-network.onrender.com",et=3e4,tt=5,ze=1800*1e3,rt=o=>(Math.floor(o/ze)+1)*ze,Le=[{name:"Three Cushion Mini Hourly Arena",ruleType:"threecushion",options:{raceTo:"7",tableSize:"5"}},{name:"Nine Ball Mini Hourly Arena",ruleType:"nineball",options:{tableSize:"6",freeaim:"true"}},{name:"Eight Ball Mini Hourly Arena",ruleType:"eightball",options:{tableSize:"6",freeaim:"true"}},{name:"Nine Ball Hourly Arena",ruleType:"nineball",options:{}},{name:"Eight Ball Hourly Arena",ruleType:"eightball",options:{}},{name:"Snooker Mini Hourly Arena",ruleType:"snooker",options:{tableSize:"6",reds:"3",freeaim:"true"}}],oe=h`
    .arena-list { display: flex; flex-direction: column; gap: .2rem; }
    .arena-item { display: flex; align-items: center; gap: .35rem; padding: .25rem; border: 1px solid var(--border); border-radius: 4px; text-decoration: none; color: var(--text); }
    .arena-item.completed { opacity: .8; padding-top: .25rem; padding-bottom: .25rem; }
    .arena-item-main { min-width: 0; flex: 1; }
    .arena-item-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .arena-item-name { font-weight: 400; }
    .arena-item-meta { color: var(--text-muted); font-size: .72rem; font-weight: 400; white-space: nowrap; }
    .arena-join { cursor: pointer; border: 1px solid #0d6efd; border-radius: 4px; background: #0d6efd; color: #fff; font: inherit; font-size: .75rem; padding: .15rem .4rem; flex-shrink: 0; }
    .arena-join:hover { background-color: #0b5ed7; border-color: #0a58ca; }
    .arena-join:active { background-color: #0a58ca; }
    .arena-join:focus-visible { outline: 2px solid #007bff; outline-offset: 1px; }
    .empty { color: var(--text-muted); text-align: center; padding: .5rem 0; }
`,ne=(o,e=!1,t=null,r=!0)=>{let i=`lobby.html?tournamentId=${encodeURIComponent(o.id)}`,n=s=>{t?(s.preventDefault(),s.stopPropagation(),t(o.id)):s.currentTarget instanceof HTMLButtonElement&&(s.preventDefault(),window.location.href=s.currentTarget.closest("a").href)};return c`<a class="arena-item ${e?"completed":""}" href=${i} @click=${n}>
        <div class="arena-item-main"><div class="arena-item-title"><span class="arena-item-name">${Re(o.ruleType,o.options)}${o.creatorName?c` · ${o.creatorName}`:""}</span><span class="arena-item-meta"> 👥\uFE0E ${o.players.length} · ⏰\uFE0E ${e?"ended":"ends"} ${new Date(o.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}</span></div></div>
        ${e||!r?"":c`<button class="arena-join btn-challenge" type="button" @click=${n}>Open</button>`}
    </a>`},ie=class extends b{static properties={heading:{type:String},_arenas:{state:!0},_error:{state:!0},selectable:{type:Boolean}};static styles=[oe,h`
        :host { display: block; }
        h2.title { margin: 0 0 .25rem; font-size: .8rem; font-weight: 600; }
        .error { color: var(--text-muted); font-size: .75rem; text-align: center; padding: .5rem 0; }
    `];constructor(){super(),this.heading="",this._arenas=[],this._error="",this.selectable=!1,this._timer=null}connectedCallback(){super.connectedCallback(),this._load(),this._timer=setInterval(()=>this._load(),et)}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),super.disconnectedCallback()}async load(){await this._load()}async _load(){try{let e=await fetch(`${re}/api/arena`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arenas (${e.status})`);let r=Date.now();if(!(t.arenas||[]).some(n=>n.endTime>r&&n.status!=="finished")){let n=rt(r);if(Math.floor((n-r)/6e4)>=tt){let l=new Date(n),a=String(l.getUTCHours()).padStart(2,"0"),p=String(l.getUTCMinutes()).padStart(2,"0"),u=`${l.getUTCFullYear()}${String(l.getUTCMonth()+1).padStart(2,"0")}${String(l.getUTCDate()).padStart(2,"0")}-${a}${p}`,d=l.getUTCMinutes()>=30?1:0,g=(2*l.getUTCHours()+d)%Le.length,f=Le[g];if(await fetch(`${re}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`arena-hourly-${u}`,creatorId:"hourly-arena",creatorName:f.name,ruleType:f.ruleType,options:f.options,endTime:n})}),e=await fetch(`${re}/api/arena`),t=await e.json(),!e.ok)throw new Error(t.error||`Unable to reload Arenas (${e.status})`)}}this._arenas=(t.arenas||[]).sort((n,s)=>s.createdAt-n.createdAt),this._error="",this.dispatchEvent(new CustomEvent("arenas-loaded",{detail:{arenas:this._arenas},bubbles:!0,composed:!0}))}catch(e){this._error=e.message||"Unable to load Arenas."}}get _activeArenas(){let e=Date.now();return this._arenas.filter(t=>t.endTime>e&&t.status!=="finished")}_onSelect(e){this.dispatchEvent(new CustomEvent("arena-select",{detail:{arenaId:e},bubbles:!0,composed:!0}))}render(){let e=this._activeArenas;return c`
            ${this.heading?c`<h2 class="title">${this.heading}</h2>`:""}
            ${this._error&&!e.length?c`<div class="error">Could not load arenas.</div>`:e.length?c`<div class="arena-list" aria-label="Active Arenas">${e.map(t=>ne(t,!1,this.selectable?r=>this._onSelect(r):null))}</div>`:c`<div class="empty">No active Arenas.</div>`}
        `}};customElements.define("active-arenas",ie);var it=[[4352,4447],[11904,42191],[44032,55203],[63744,64255],[65040,65135],[65280,65376],[65504,65510],[127744,129791],[131072,195103]],Me=o=>{let e=0;for(let t of o){let r=t.codePointAt(0);e+=it.some(([i,n])=>r>=i&&r<=n)?2:1}return Math.max(e,1)},se=class extends H{static properties={_dotColor:{state:!0}};static styles=Te;constructor(){super(),this._clientId=x.clientId,this._name=x.userName,this._dotColor=x.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,x.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return O?c``:c`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${Me(this._name)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Me(e.target.value)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",se);var ae=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",variants:[{id:"std",label:"Standard",options:{}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",variants:[{id:"std",label:"Standard",options:{}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",variants:[{id:"3",label:"Reds 3",options:{reds:"3"}},{id:"6",label:"Reds 6",options:{reds:"6"}},{id:"10",label:"Reds 10",options:{reds:"10"}},{id:"15",label:"Reds 15",options:{reds:"15"}}]},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",variants:[{id:"7",label:"Race to 7",options:{raceTo:"7"}},{id:"15",label:"Race to 15",options:{raceTo:"15"}},{id:"25",label:"Race to 25",options:{raceTo:"25"}}]},{key:"sagu",label:"Sagu",img:"assets/sagu.png",variants:[{id:"5",label:"Race to 5",options:{raceTo:"5"}},{id:"11",label:"Race to 11",options:{raceTo:"11"}}]}],le=class extends b{static properties={open:{type:Boolean,reflect:!0},_game:{state:!0},_variant:{state:!0},_size:{state:!0},_freeaim:{state:!0}};static styles=h`
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
  `;constructor(){super(),this.open=!1,this._game="threecushion",this._variant="15",this._size="full",this._freeaim=!1}show(){this.open=!0}hide(){this.open=!1}_selectGame(e){this._game=e;let t=this._currentGame;this._variant=t.variants[0].id}get _currentGame(){return ae.find(e=>e.key===this._game)||ae[0]}_confirm(){let e=this._currentGame,r={...(e.variants.find(i=>i.id===this._variant)||e.variants[0]).options};this._size==="mini"?r.tableSize=["snooker","nineball","eightball"].includes(e.key)?"6":"5":e.key==="snooker"&&(r.tableSize="12"),this._freeaim&&(r.freeaim="true"),this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0,detail:{ruleType:e.key,options:r}})),this.hide()}render(){let e=this._currentGame;return c`<div class="backdrop" @click=${t=>t.target===t.currentTarget&&this.hide()}><div class="modal" role="dialog" aria-modal="true" aria-label="Select game parameters"><h3>Select game parameters</h3><div class="tiles" role="radiogroup" aria-label="Game type">${ae.map(t=>c`<button class="tile ${t.key===this._game?"selected":""}" @click=${()=>this._selectGame(t.key)}><img src=${t.img} alt="" /><span>${t.label}</span></button>`)}</div><div class="label">Rule</div><div class="choices">${e.variants.map(t=>c`<button class="choice ${t.id===this._variant?"selected":""}" @click=${()=>{this._variant=t.id}}>${t.label}</button>`)}</div><div class="label">Table size</div><div class="choices"><button class="choice ${this._size==="full"?"selected":""}" @click=${()=>{this._size="full"}}>Full</button><button class="choice ${this._size==="mini"?"selected":""}" @click=${()=>{this._size="mini"}}>Mini</button></div><div class="label">Aim</div><div class="choices"><button class="choice ${this._freeaim?"":"selected"}" @click=${()=>{this._freeaim=!1}}>Assist</button><button class="choice ${this._freeaim?"selected":""}" @click=${()=>{this._freeaim=!0}}>Free</button></div><button class="action" @click=${this._confirm}>Use these parameters</button><button class="cancel" @click=${this.hide}>Cancel</button></div></div>`}};customElements.define("proto2-modal",le);var ce=class extends b{static properties={ruleType:{type:String},options:{attribute:!1},durationMinutes:{type:Number},busy:{type:Boolean},error:{type:String}};static styles=h`
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
    `;constructor(){super(),this.ruleType="",this.options={},this.durationMinutes=10,this.busy=!1,this.error=""}_openChooser(){this.renderRoot.querySelector("proto2-modal").show()}_selectPreset(e,t,r=10){this.ruleType=e,this.options=t,this.durationMinutes=r,this._notifyChange(),this._create()}_onParameters(e){this.ruleType=e.detail.ruleType,this.options=e.detail.options||{},this._notifyChange(),this._create()}_notifyChange(){this.dispatchEvent(new CustomEvent("parameters-change",{bubbles:!0,composed:!0,detail:{ruleType:this.ruleType,options:this.options,durationMinutes:this.durationMinutes}}))}_onDurationChange(e){this.durationMinutes=Number(e.target.value),this._notifyChange()}_create(){this.dispatchEvent(new CustomEvent("create-arena",{bubbles:!0,composed:!0}))}render(){return c`<div class="field"><label for="duration">Duration</label><select id="duration" .value=${String(this.durationMinutes)} @change=${this._onDurationChange}><option value="10">10 minutes</option><option value="30">30 minutes</option></select></div><div class="field"><label>Game type</label><div class="config"><div class="config-actions"><button type="button" class="btn-preset" title="10 mins Three Cushion (mini, race to 7)" @click=${()=>this._selectPreset("threecushion",{raceTo:"7",tableSize:"5"},10)}><img src="assets/threecushion.png" alt="" /><span>3-Cushion</span></button><button type="button" class="btn-preset" title="10 mins Nine Ball (mini, freeaim)" @click=${()=>this._selectPreset("nineball",{tableSize:"6",freeaim:"true"},10)}><img src="assets/nineball.png" alt="" /><span>9-Ball</span></button><button type="button" class="btn-preset" title="10 mins Eight Ball (mini, freeaim)" @click=${()=>this._selectPreset("eightball",{tableSize:"6",freeaim:"true"},10)}><img src="assets/eightball.png" alt="" /><span>8-Ball</span></button><button type="button" class="btn-preset" @click=${this._openChooser}>Custom</button></div></div></div>${this.error?c`<div class="error" role="alert">${this.error}</div>`:""}<proto2-modal @confirm=${this._onParameters}></proto2-modal>`}};customElements.define("arena-create-form",ce);var Pe=window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"https://billiards-network.onrender.com",de=class extends b{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_id:{state:!0},_ruleType:{state:!0},_options:{state:!0},_durationMinutes:{state:!0},_createdArena:{state:!0},_arenas:{state:!0},_completedArenas:{state:!0},_busy:{state:!0},_error:{state:!0}};static styles=[ee,Ie,oe,h`
        :host { display: block; min-height: 100vh; box-sizing: border-box; padding: .5rem; background: var(--bg); color: var(--text); font-family: 'Exo', sans-serif; font-size: .85rem; }
        .container { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; }
        .topbar { display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem; position: sticky; top: 0; z-index: 2; padding: .25rem 0; background: var(--bg); }
        .logo { width: 32px; height: 32px; flex-shrink: 0; opacity: .7; }
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
    `];constructor(){super(),this._theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme;let e=new URLSearchParams(window.location.search),t=e.get("id")||e.get("tournamentId");if(t){let r=new URL("./lobby.html",window.location.href);r.searchParams.set("tournamentId",t),window.location.replace(r.href);return}this._ruleType="",this._options={},this._durationMinutes=10,this._createdArena=null,this._arenas=[],this._completedArenas=[],this._busy=!1,this._error=""}connectedCallback(){super.connectedCallback(),this._loadCompletedArenas()}async _loadCompletedArenas(){try{let e=await fetch(`${Pe}/api/arena/results`),t=await e.json();e.ok&&Array.isArray(t.results)&&(this._completedArenas=t.results)}catch{this._completedArenas=[]}}async _create(){if(!this._ruleType){this._error="Choose game parameters first.";return}this._busy=!0,this._error="";try{let e=await fetch(`${Pe}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({creatorId:x.clientId,creatorName:x.userName||"Anonymous",ruleType:this._ruleType,options:this._options,durationMinutes:this._durationMinutes})}),t=await e.json();if(!e.ok)throw new Error(t.error||`Create failed (${e.status})`);this._createdArena=t.arena,await this._refreshActiveArenas(),await this._loadCompletedArenas()}catch(e){this._error=e.message||"Unable to create Arena."}finally{this._busy=!1}}_backToLobby(){window.location.href="./lobby.html"}_renderHeader(){return c`<header class="topbar">
            <img src="assets/threecushion.png" class="logo" alt="" />
            <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a></h1>
            <user-badge></user-badge>
            <button class="back-lobby" type="button" @click=${this._backToLobby}>Back to lobby</button>
        </header>`}_arenaUrl(){if(!this._createdArena)return"";let e=window.location.origin,t=window.location.pathname.replace(/\/tournament\/[^/]*$/,"/lobby.html");return`${e}${t}?tournamentId=${encodeURIComponent(this._createdArena.id)}`}async _copy(){let e=this._arenaUrl();try{await navigator.clipboard.writeText(e)}catch{let t=this.renderRoot.querySelector(".url input");t&&(t.focus(),t.select())}}_onArenasLoaded(e){this._arenas=e.detail.arenas||[],this._loadCompletedArenas()}async _refreshActiveArenas(){let e=this.renderRoot.querySelector("active-arenas");e&&await e.load()}_renderCompletedArenas(){return this._completedArenas.length?c`<div class="arena-list" aria-label="Completed Arenas">${this._completedArenas.map(e=>ne(e,!0))}</div>`:c`<div class="empty">No completed Arenas.</div>`}_renderArenaSections(){return c`
            <section class="panel">
                <active-arenas heading="Active Arenas" @arenas-loaded=${this._onArenasLoaded}></active-arenas>
            </section>
            <section class="panel">
                <h2 class="title">Completed Arenas</h2>
                ${this._renderCompletedArenas()}
            </section>`}render(){let e=this._createdArena;return c`<div class="container">
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
            ${e?c`<section class="panel"><h2 class="title success">Arena created</h2><div class="meta">${e.ruleType} · ${e.durationMinutes} minutes · ${e.status}</div><div class="url"><input readonly value=${this._arenaUrl()} aria-label="Arena URL" @focus=${t=>t.target.select()} /><button type="button" @click=${this._copy}>Copy</button></div><p class="empty">Share this URL to invite players.</p></section>`:""}
            ${this._renderArenaSections()}
        </div>`}};customElements.define("arena-app",de);})();
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
