"use strict";(()=>{var X=globalThis,Q=X.ShadowRoot&&(X.ShadyCSS===void 0||X.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Ze=new WeakMap,Y=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Q&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Ze.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Ze.set(t,e))}return e}toString(){return this.cssText}},et=r=>new Y(typeof r=="string"?r:r+"",void 0,$e),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Y(t,r,$e)},tt=(r,e)=>{if(Q)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=X.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},we=Q?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return et(t)})(r):r;var{is:Gt,defineProperty:Vt,getOwnPropertyDescriptor:qt,getOwnPropertyNames:Ft,getOwnPropertySymbols:Jt,getPrototypeOf:Wt}=Object,Z=globalThis,st=Z.trustedTypes,Kt=st?st.emptyScript:"",Xt=Z.reactiveElementPolyfillSupport,G=(r,e)=>r,_e={toAttribute(r,e){switch(e){case Boolean:r=r?Kt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},rt=(r,e)=>!Gt(r,e),it={attribute:!0,type:String,converter:_e,reflect:!1,useDefault:!1,hasChanged:rt};Symbol.metadata??=Symbol("metadata"),Z.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=it){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Vt(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=qt(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let c=i?.call(this);n?.call(this,a),this.requestUpdate(e,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??it}static _$Ei(){if(this.hasOwnProperty(G("elementProperties")))return;let e=Wt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(G("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(G("properties"))){let t=this.properties,s=[...Ft(t),...Jt(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(we(i))}else e!==void 0&&t.push(we(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return tt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:_e).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:_e;this._$Em=i;let c=a.fromAttribute(t,n.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let a=this.constructor;if(i===!1&&(n=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??rt)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:a}=n,c=this[i];a!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,n,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[G("elementProperties")]=new Map,S[G("finalized")]=new Map,Xt?.({ReactiveElement:S}),(Z.reactiveElementVersions??=[]).push("2.1.2");var Ie=globalThis,nt=r=>r,ee=Ie.trustedTypes,at=ee?ee.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ee="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+I,Qt=`<${Te}>`,N=document,q=()=>N.createComment(""),F=r=>r===null||typeof r!="object"&&typeof r!="function",Ce=Array.isArray,pt=r=>Ce(r)||typeof r?.[Symbol.iterator]=="function",Se=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ot=/-->/g,lt=/>/g,k=RegExp(`>|${Se}(?:([^\\s"'>=/]+)(${Se}*=${Se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ct=/'/g,ht=/"/g,ut=/^(?:script|style|textarea|title)$/i,Ae=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),l=Ae(1),ps=Ae(2),us=Ae(3),x=Symbol.for("lit-noChange"),y=Symbol.for("lit-nothing"),dt=new WeakMap,P=N.createTreeWalker(N,129);function gt(r,e){if(!Ce(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return at!==void 0?at.createHTML(e):e}var mt=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",a=V;for(let c=0;c<t;c++){let o=r[c],p,u,h=-1,m=0;for(;m<o.length&&(a.lastIndex=m,u=a.exec(o),u!==null);)m=a.lastIndex,a===V?u[1]==="!--"?a=ot:u[1]!==void 0?a=lt:u[2]!==void 0?(ut.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=k):u[3]!==void 0&&(a=k):a===k?u[0]===">"?(a=i??V,h=-1):u[1]===void 0?h=-2:(h=a.lastIndex-u[2].length,p=u[1],a=u[3]===void 0?k:u[3]==='"'?ht:ct):a===ht||a===ct?a=k:a===ot||a===lt?a=V:(a=k,i=void 0);let d=a===k&&r[c+1].startsWith("/>")?" ":"";n+=a===V?o+Qt:h>=0?(s.push(p),o.slice(0,h)+Ee+o.slice(h)+I+d):o+I+(h===-2?c:d)}return[gt(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},J=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,a=0,c=e.length-1,o=this.parts,[p,u]=mt(e,t);if(this.el=r.createElement(p,s),P.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=P.nextNode())!==null&&o.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Ee)){let m=u[a++],d=i.getAttribute(h).split(I),v=/([.?@])?(.*)/.exec(m);o.push({type:1,index:n,name:v[2],strings:d,ctor:v[1]==="."?se:v[1]==="?"?ie:v[1]==="@"?re:U}),i.removeAttribute(h)}else h.startsWith(I)&&(o.push({type:6,index:n}),i.removeAttribute(h));if(ut.test(i.tagName)){let h=i.textContent.split(I),m=h.length-1;if(m>0){i.textContent=ee?ee.emptyScript:"";for(let d=0;d<m;d++)i.append(h[d],q()),P.nextNode(),o.push({type:2,index:++n});i.append(h[m],q())}}}else if(i.nodeType===8)if(i.data===Te)o.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(I,h+1))!==-1;)o.push({type:7,index:n}),h+=I.length-1}n++}}static createElement(e,t){let s=N.createElement("template");return s.innerHTML=e,s}};function M(r,e,t=r,s){if(e===x)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=F(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=M(r,i._$AS(r,e.values),i,s)),e}var te=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??N).importNode(t,!0);P.currentNode=i;let n=P.nextNode(),a=0,c=0,o=s[0];for(;o!==void 0;){if(a===o.index){let p;o.type===2?p=new O(n,n.nextSibling,this,e):o.type===1?p=new o.ctor(n,o.name,o.strings,this,e):o.type===6&&(p=new ne(n,this,e)),this._$AV.push(p),o=s[++c]}a!==o?.index&&(n=P.nextNode(),a++)}return P.currentNode=N,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),F(e)?e===y||e==null||e===""?(this._$AH!==y&&this._$AR(),this._$AH=y):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):pt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==y&&F(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=J.createElement(gt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new te(i,this),a=n.u(this.options);n.p(t),this.T(a),this._$AH=n}}_$AC(e){let t=dt.get(e.strings);return t===void 0&&dt.set(e.strings,t=new J(e)),t}k(e){Ce(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(q()),this.O(q()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=nt(e).nextSibling;nt(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=y}_$AI(e,t=this,s,i){let n=this.strings,a=!1;if(n===void 0)e=M(this,e,t,0),a=!F(e)||e!==this._$AH&&e!==x,a&&(this._$AH=e);else{let c=e,o,p;for(e=n[0],o=0;o<n.length-1;o++)p=M(this,c[s+o],t,o),p===x&&(p=this._$AH[o]),a||=!F(p)||p!==this._$AH[o],p===y?e=y:e!==y&&(e+=(p??"")+n[o+1]),this._$AH[o]=p}a&&!i&&this.j(e)}j(e){e===y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},se=class extends U{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===y?void 0:e}},ie=class extends U{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==y)}},re=class extends U{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=M(this,e,t,0)??y)===x)return;let s=this._$AH,i=e===y&&s!==y||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==y&&(s===y||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ne=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}},bt={M:Ee,P:I,A:Te,C:1,L:mt,R:te,D:pt,V:M,I:O,H:U,N:ie,U:re,B:se,F:ne},Zt=Ie.litHtmlPolyfillSupport;Zt?.(J,O),(Ie.litHtmlVersions??=[]).push("3.3.2");var ft=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new O(e.insertBefore(q(),n),n,void 0,t??{})}return i._$AI(r),i};var Le=globalThis,f=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ft(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};f._$litElement$=!0,f.finalized=!0,Le.litElementHydrateSupport?.({LitElement:f});var es=Le.litElementPolyfillSupport;es?.({LitElement:f});(Le.litElementVersions??=[]).push("4.2.2");var ts=b`
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
`,Ts=b`
    :host { font-family: 'Exo', sans-serif; font-weight: 200; }
`,$=b`
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
`,yt=b`
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
`,vt=b`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,xt=b`
    :host { display: block; }
    .banner { border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; border: 1px solid; }
    .pending { background: var(--banner-warn-bg); border-color: var(--banner-warn-border); color: var(--text); }
    .declined { background: var(--banner-decline-bg); border-color: var(--banner-decline-border); color: var(--banner-decline-text); }
    .row { display: flex; gap: 0.3rem; align-items: center; justify-content: space-between; }
    .details { font-size: 0.72rem; }
`,j=b`
    :host { display: block; }
    .backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 100; }
    .modal { background: var(--modal-bg); color: var(--text); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; min-width: 240px; display: flex; flex-direction: column; gap: 0.6rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); }
    h3 { margin: 0; font-size: 0.95rem; text-align: center; }
    .rules { display: flex; flex-direction: column; gap: 0.3rem; }
    button.rule { text-align: left; padding: 0.35rem 0.6rem; font-size: 0.82rem; display: flex; align-items: center; gap: 0.4rem; }
    button.rule img { width: 28px; height: 28px; display: block; }
    button.cancel { background: var(--modal-cancel); color: var(--text); border-color: var(--btn-border); }
    .icon-wrap { position: relative; width: 28px; height: 28px; flex-shrink: 0; }
    .icon-wrap img { width: 28px; height: 28px; display: block; }
`,ae=b`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; }
`,$t=b`
    :host { display: inline-flex; align-items: center; align-self: center; font-family: 'Exo', sans-serif; font-weight: 200; }
    .badge {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 0px 4px 0px 2px; border-radius: 4px;
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
`,wt=b`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.25rem; }
    button { border: none; background: none; cursor: pointer; padding: 0.2rem; border-radius: 4px; }
    button:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; }
    img { display: block; width: 48px; height: 48px; margin: auto; }
`,_t=b`
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
`,St=b`
    :host { display: flex; flex-direction: column; height: 100%; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.on { background: #198754; }
`,It=[ts,b`
    :host { display: flex; flex-direction: column; min-height: 100%; font-family: 'Exo', sans-serif; font-weight: 200; font-size: 0.85rem; box-sizing: border-box; padding: 0.5rem; gap: 0.2rem; background: var(--bg); color: var(--text); overflow-y: auto; scrollbar-width: none; }
    :host::-webkit-scrollbar { display: none; }
    h1 { font-size: 1.0rem; color: var(--text-dim); text-align: left; margin: 0; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0; }
h1 a { color: inherit; text-decoration: none; }
     h1 a:hover { text-decoration: underline; }
     h1 .version { font-size: 0.65rem; color: var(--text-dim); margin-left: 0.25rem; vertical-align: super; font-weight: 200; }
    .topbar { display: flex; align-items: center; flex-shrink: 0; gap: 0.4rem; }
    .topbar .logo { width: 32px; height: 32px; flex-shrink: 0; filter: grayscale(100%); opacity: 0.7; }
    .topbar h1 { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.4rem; overflow: hidden; }
    .panel-title { font-weight: bold; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-dim); text-align: center; }
    .main-row { display: flex; gap: 0.2rem; flex-shrink: 0; margin-bottom: 3px; }
    .main-row .solo { flex: 0 0 auto; }
    .main-row .players { flex: 1; display: flex; flex-direction: column; }
    .motd-row { display: flex; flex-direction: column; margin-bottom: 3px; }
    @media (max-width: 500px) {
        .motd-row { display: none; }
    }
    .info-row { display: flex; flex-direction: column; }
    .info-row .panel { overflow: visible; }
    .container { max-width: 900px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
`];var oe=193,le=r=>`v${Math.floor(r/100)}.${String(r%100).padStart(2,"0")}`,ke=()=>"user-"+Math.random().toString(36).slice(2,7),R="https://scoreboard-tailuge.vercel.app",E=typeof window<"u"&&window.location.hostname.includes("vercel"),Et=r=>{let e=Math.floor((Date.now()-r)/1e3);if(e<60)return`${e}s ago`;let t=Math.floor(e/60);if(t<60)return`${t}m ago`;let s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`},Tt={connected:!1,users:[],challenges:{},currentMatch:null};function ce(r,e,t){return t?.nextTurnId?t.nextTurnId===r:e===r}function Ct(r,e){let t={...r.challenges},s=i=>i.challengerId===e.myId?i.challengeeId:i.challengerId;switch(e.type){case"CONNECTED":return{...r,connected:e.payload};case"USERS_UPDATE":return{...r,users:e.payload};case"CHALLENGE_SENT":return{...r,challenges:{...t,[e.payload.challengeeId]:{...e.payload,status:"pending"}}};case"CHALLENGE_MSG":{let i=e.payload,n=s(i);if(i.type==="offer"){if(r.currentMatch)return r;(!t[i.challengerId]||t[i.challengerId].tableId!==i.tableId)&&(t[i.challengerId]={...i,status:"pending"})}else if(i.type==="accept"&&!r.currentMatch){let a=t[n];if(!a||a.tableId!==i.tableId)return r;let c=i.options||a.options,o=i.rematch||a.rematch;return delete t[n],{...r,challenges:t,currentMatch:{tableId:i.tableId,ruleType:i.ruleType,options:c,isFirst:ce(e.myId,i.challengerId,o),rematch:o?encodeURIComponent(JSON.stringify(o)):void 0}}}else i.type==="decline"?t[i.challengeeId]&&(t[i.challengeeId]={...t[i.challengeeId],status:"declined"}):i.type==="cancel"&&delete t[s(i)];return{...r,challenges:t}}case"CHALLENGE_DISMISS":return delete t[e.payload],{...r,challenges:t};case"MATCH_SET":return{...r,currentMatch:e.payload};case"MATCH_LEAVE":return{...r,currentMatch:null};default:return r}}function At(r="",e="",t=""){let s={bot:{emoji:"\u{1F916}",title:"bot"},nineball:{emoji:"\u2468",title:"nineball"},eightball:{emoji:"\u{1F3B1}",title:"eightball"},snooker:{emoji:"\u{1F534}",title:"snooker"},threecushion:{emoji:"\u2462",title:"threecushion"}},i=s[e];return t==="spectating"?{emoji:"\u{1F52D}",title:"spectator"}:t==="playing"?i??{emoji:"\u{1F3AE}",title:"playing"}:t==="available"&&e==="replay"?{emoji:"\u{1F440}",title:"replay"}:i?r.includes("github")?{emoji:i.emoji+"\u{1F419}",title:"github"}:r.includes("localhost")?{emoji:i.emoji+"\u{1F3E0}",title:"localhost"}:i:e.includes("-bot")?{emoji:s[e.replace("-bot","")].emoji+"\u{1F916}",title:"bot"}:r.includes("github")?{emoji:"\u{1F419}",title:"github"}:r.includes("vercel")?{emoji:"\u{1F465}",title:"vercel"}:r.includes("workers")?{emoji:"\u{1F464}",title:"vercel"}:r.includes("localhost")?{emoji:"\u{1F3E0}",title:"localhost"}:s[e]??{emoji:"\u{1F3AE}",title:"external"}}var T=r=>{if(r==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!r)return{emoji:"\u{1F310}",title:""};let e=r.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},Pe="https://billiards.tailuge.workers.dev/",Lt=(r,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,r):r,kt=(r,e,t,s,i)=>{let n=r.url?`${r.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:`${Pe}?ruletype=${r.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`;return i&&(n+="&flip=true"),r.url?n:Lt(n,r.options)},Ne=({tableId:r,userId:e,userName:t,ruleType:s,isFirst:i,options:n,bot:a,lod:c,rematch:o,flip:p})=>{let u=`${Pe}?websocketserver=wss://billiards-network.onrender.com&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}`;return a||(u+=`&tableId=${r}`),i&&(u+="&first=true"),a&&(u+=`&bot=${encodeURIComponent(a)}`),c!==void 0&&(u+=`&lod=${c}`),o&&(u+=`&rematch=${o}`),p&&(u+="&flip=true"),Lt(u,n)},Pt=({tableId:r,userId:e,userName:t,ruleType:s})=>`${Pe}?websocketserver=wss://billiards-network.onrender.com&tableId=${r}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}&spectator=true`,ss={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball"},C=r=>{let e=ss[r];return e?l`<img src="assets/${e}.png" alt="${r}" title="${r}" width="18" height="18" style="vertical-align:middle">`:l`🎱`},Me=r=>["\u{1F3C6}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F"][r]??"",Ue=(r,e,t)=>`${r}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}`;var Re=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();E&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"));let i=(localStorage.getItem("userId")||"").trim(),n=(localStorage.getItem("userName")||"").trim();t.length>2?(this.clientId=t,this.isForcedId=!0):(this.clientId=i.length>2?i:ke(),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)),this.userName=s||n||"Anonymous",this.lod=localStorage.getItem("lod")||"2",this.flip=localStorage.getItem("flip")==="true"}set(e,t){this.clientId=e.trim().length>2?e.trim():ke(),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}},g=new Re,w=class extends f{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),g.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),g.removeEventListener("change",this._storeListener)}};var is=[{label:"Nine Ball",img:"assets/nineball.png",ruletype:"nineball"},{label:"Snooker 6r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"6"}},{label:"Snooker",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"15"}},{label:"3-Cushion (3)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"3"}},{label:"3-Cushion (7)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"7"}},{label:"3-Cushion (15)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"15"}},{label:"Trickshot",img:"assets/practice.png",url:"https://billiards.tailuge.workers.dev/practice"},{label:"Research",img:"assets/research.png",url:"https://billiards.tailuge.workers.dev/diagrams/three"},{label:"Eight Ball",img:"assets/eightball.png",ruletype:"eightball"}],Oe=class extends w{static styles=[wt,ae];#s=[...is].sort(()=>Math.random()-.5);render(){let{clientId:e,userName:t,lod:s,flip:i}=g;return l`<div class="grid">${this.#s.map(n=>l`
            <button title=${n.label} aria-label="Play ${n.label}"
                @click=${()=>{window.location.href=kt(n,e,t,s,i)}}>
                <span class="icon-wrap">
                    <img src=${n.img} alt=${n.label} />
                    ${n.options?l`<span class="badge">${Object.values(n.options)[0]}</span>`:""}
                </span>
            </button>`)}
        </div>`}};customElements.define("solo-panel",Oe);var je=class extends f{static properties={url:{type:String},color:{type:String},label:{type:String},prefix:{type:String},prefixTitle:{type:String}};static styles=b`
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
    `;render(){let e=this.color?`background-color: ${this.color}`:"",t=this.prefix?l`<span class="prefix" title=${this.prefixTitle}>${this.prefix}</span>`:"";return l`
            <a
                class="pill"
                href=${this.url}
                style=${e}>
                ${t}
                ${this.label?l`<span>${this.label}</span>`:""}
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </a>
        `}};customElements.define("replay-button",je);var He=class extends w{static styles=_t;connectedCallback(){if(super.connectedCallback(),E){this.classList.add("loaded");return}fetch(`${R}/api/summary`,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.classList.add("loaded"),this.requestUpdate()}).catch(()=>{this._err=!0,this.classList.add("loaded"),this.requestUpdate()})}render(){if(E)return l`<span class="loading">We have moved <a href="https://billiards.tailuge.workers.dev/lobby">Play online here</a></span>`;if(this._err)return l`<span class="loading">Could not load scores.</span>`;if(!this._data)return l`<span class="loading">Connecting to server…</span>`;let{hiscores:e,topPlayers:t,recentMatches:s}=this._data,i=Object.keys(e);return l`
            <div class="group hiscores">
                <div class="group-body">
                    ${i.map(n=>l`
                        <div class="tbl"><table><caption><a href="${R}/leaderboard" target="_blank" rel="noopener" style="font-weight:200;font-size:0.75rem">${C(n)} HiScore</a></caption>
                        <tr><th>Name</th><th></th></tr>
                            ${e[n].slice(0,4).map((a,c)=>l`<tr><td>${Me(c)} ${a.name}</td><td><replay-button url="${Ue(`${R}/api/rank/${a.id}?ruletype=${n}&lod=${g.lod}`,g.clientId,g.userName)}" label="${a.score}"></replay-button></td></tr>`)}
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
                                <td>${C(n.ruleType)}</td><td>${n.loser?"\u{1F396}\uFE0F":""}${n.winner}${n.loser?` vs ${n.loser}`:""}</td>
                                <td class="ago">${Et(n.timestamp)}</td>
                                <td class="city-col">${n.locationCity??""}</td>
<td class="replay-col">
                                    ${n.hasReplay?l`<replay-button prefix="${T(n.locationCountry).emoji}" prefixTitle="${T(n.locationCountry).title}" url="${Ue(`${R}/api/match-replay?id=${n.id}&lod=${g.lod}`,g.clientId,g.userName)}"></replay-button>`:T(n.locationCountry).emoji}
                                </td>
                            </tr>`)}
                        </table></div>
                    </div>
                </div>
                <div class="group top-players">
                    <div class="group-body">
                        ${i.map(n=>l`
                            <div class="tbl"><table><caption><a href="${R}/elo" target="_blank" rel="noopener">${C(n)} <span style="font-size:0.75rem;font-weight:200">Rankings</span></a></caption>
                            <tr><th>Name</th><th>Rating</th><th>W</th><th>L</th></tr>
                                ${[...t[n]].sort((a,c)=>c.rating-a.rating).slice(0,4).map((a,c)=>l`<tr>
                                    <td><a href="${R}/player/${encodeURIComponent(a.name)}?ruleType=${n}">${Me(c)} ${a.name}</a></td>
                                    <td>${Math.round(a.rating)}</td>
                                </tr>`)}
                            </table></div>
                        `)}
                    </div>
                </div>
            </div>`}};customElements.define("info-panel",He);var he={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},de=r=>(...e)=>({_$litDirective$:r,values:e}),H=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:rs}=bt,Nt=r=>r;var Mt=()=>document.createComment(""),B=(r,e,t)=>{let s=r._$AA.parentNode,i=e===void 0?r._$AB:e._$AA;if(t===void 0){let n=s.insertBefore(Mt(),i),a=s.insertBefore(Mt(),i);t=new rs(n,a,r,r.options)}else{let n=t._$AB.nextSibling,a=t._$AM,c=a!==r;if(c){let o;t._$AQ?.(r),t._$AM=r,t._$AP!==void 0&&(o=r._$AU)!==a._$AU&&t._$AP(o)}if(n!==i||c){let o=t._$AA;for(;o!==n;){let p=Nt(o).nextSibling;Nt(s).insertBefore(o,i),o=p}}}return t},A=(r,e,t=r)=>(r._$AI(e,t),r),ns={},Ut=(r,e=ns)=>r._$AH=e,Rt=r=>r._$AH,pe=r=>{r._$AR(),r._$AA.remove()};var Ot=(r,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(r[i],i);return s},jt=de(class extends H{constructor(r){if(super(r),r.type!==he.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],n=[],a=0;for(let c of r)i[a]=s?s(c,a):a,n[a]=t(c,a),a++;return{values:n,keys:i}}render(r,e,t){return this.dt(r,e,t).values}update(r,[e,t,s]){let i=Rt(r),{values:n,keys:a}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=a,n;let c=this.ut??=[],o=[],p,u,h=0,m=i.length-1,d=0,v=n.length-1;for(;h<=m&&d<=v;)if(i[h]===null)h++;else if(i[m]===null)m--;else if(c[h]===a[d])o[d]=A(i[h],n[d]),h++,d++;else if(c[m]===a[v])o[v]=A(i[m],n[v]),m--,v--;else if(c[h]===a[v])o[v]=A(i[h],n[v]),B(r,o[v+1],i[h]),h++,v--;else if(c[m]===a[d])o[d]=A(i[m],n[d]),B(r,i[h],i[m]),m--,d++;else if(p===void 0&&(p=Ot(a,d,v),u=Ot(c,h,m)),p.has(c[h]))if(p.has(c[m])){let _=u.get(a[d]),xe=_!==void 0?i[_]:null;if(xe===null){let Qe=B(r,i[h]);A(Qe,n[d]),o[d]=Qe}else o[d]=A(xe,n[d]),B(r,i[h],xe),i[_]=null;d++}else pe(i[m]),m--;else pe(i[h]),h++;for(;d<=v;){let _=B(r,o[v+1]);A(_,n[d]),o[d++]=_}for(;h<=m;){let _=i[h++];_!==null&&pe(_)}return this.ut=a,Ut(r,o),x}});var D={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:r=>`/publish/table/${r}`,TABLE_SUBSCRIBE:r=>`/subscribe/table/${r}`},ue=class{constructor(e){if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let n=JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let c=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(i,c))return}let a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:s.keepalive});if(!a.ok)throw new Error(`Publish failed: ${a.status}`)}async publishPresence(e,t){return this.publish(D.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(D.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(D.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(D.TABLE_PUBLISH(e),{...t,senderId:s},i)}subscribePresence(e){return this.subscribe(D.PRESENCE_SUBSCRIBE,e)}subscribeTable(e,t){return this.subscribe(D.TABLE_SUBSCRIBE(e),t)}subscribe(e,t){let s=this.getWsUrl(e),i=null,n=!1,a=0,c=3e4,o=null,p=!0,u={stop:()=>{n=!0,o&&(clearTimeout(o),o=null),i&&(i.close(),i=null)},ready:null},h;u.ready=new Promise(d=>{h=d});let m=()=>{if(!n){if(i&&i.readyState<=WebSocket.OPEN){h();return}i=new globalThis.WebSocket(s),i.onmessage=d=>{t(d.data)},i.onopen=()=>{let d=!p;p=!1,a=0,o&&(clearTimeout(o),o=null),h(),d&&u.onReconnect&&u.onReconnect()},i.onclose=()=>{if(!n){let d=Math.min(Math.pow(2,a)*1e3,c);a++,o=setTimeout(m,d),o.unref?.()}},i.onerror=()=>{i?.close()}}};return m(),u}};function Ht(r,e){return r.userId!==e&&!r.tableId&&!r.seek}function Bt(r,e){return!!r.tableId&&!r.isSpectator&&r.tableId!==e}function Be(r){return r.tableId?r.isSpectator?"spectating":"playing":"available"}function ge(r){if(!r||r.trim()==="")return null;try{return JSON.parse(r)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}var z=class{constructor(e,t,s,i){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.subscription=null;this.isJoined=!1;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentLeft=!1;this.opponentSeen=!1;if(this.lobby){let n=a=>this.handleLobbyUsersChange(a);this.lobby.onUsersChange(n),this.lobbyUnsubscribe=()=>{this.lobby?.offUsersChange(n)}}}async join(){this.isJoined||(this.subscription=this.nchan.subscribeTable(this.tableId,e=>{this.handleIncomingMessage(e)}),await this.subscription.ready,this.isJoined=!0)}async publish(e,t){await this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId)}onMessage(e){this.messageListeners.push(e)}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.lobbyUnsubscribe?.(),this.isJoined=!1}handleIncomingMessage(e){let t=ge(e);!t||!t.type||(t.type==="table:leave"&&t.senderId!==this.userId&&this.notifyOpponentLeft(),this.messageListeners.forEach(s=>s(t)))}handleLobbyUsersChange(e){let s=e.filter(i=>i.tableId===this.tableId).find(i=>i.userId!==this.userId);s&&(this.opponentSeen=!0),this.opponentSeen&&!s&&this.notifyOpponentLeft()}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};function Dt(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var me=class{constructor(e){this.pendingOffers=new Map;this.onEmit=e}processMessage(e,t){let s=[e.challengerId,e.challengeeId].sort().join(":");if(e.type==="offer"){if(e.challengeeId===t){this.clearInteraction(s);let i=setTimeout(()=>{this.onEmit(e),this.pendingOffers.delete(s)},250);i&&typeof i=="object"&&"unref"in i&&i.unref(),this.pendingOffers.set(s,i)}}else this.clearInteraction(s),(e.type==="cancel"?e.challengeeId===t:e.challengerId===t)&&this.onEmit(e)}clearInteraction(e){let t=this.pendingOffers.get(e);t&&(clearTimeout(t),this.pendingOffers.delete(e))}clear(){for(let e of this.pendingOffers.values())clearTimeout(e);this.pendingOffers.clear()}};var be=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.cachedUsersList=null;this.presenceMessageCount=0;this.heartbeatInterval=s.heartbeatInterval||6e4,this.pruneInterval=s.pruneInterval||3e4,this.staleTtl=s.staleTtl||9e4,this.deduplicator=new me(i=>{this.pendingChallenges.push(i),this.challengeListeners.forEach(n=>n(i))})}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){this.isJoined||(this.subscription=this.nchan.subscribePresence(e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence(this.currentUser).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready,await this.nchan.publishPresence(this.currentUser),this.startHeartbeat(),this.startPruning(),this.isJoined=!0)}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat(),this.heartbeatTimer=setInterval(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(e){console.error("Failed to send heartbeat:",e)}},this.heartbeatInterval),this.heartbeatTimer.unref?.()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}startPruning(){this.stopPruning(),this.pruneTimer=setInterval(()=>{let e=Date.now(),t=!1;for(let[s,i]of this.users.entries()){if(s===this.currentUser.userId)continue;let n=i.meta?.ts||0;e-n>this.staleTtl&&(this.users.delete(s),t=!0)}t&&(this.cachedUsersList=null,this.notifyListeners())},this.pruneInterval),this.pruneTimer.unref?.()}stopPruning(){this.pruneTimer&&(clearInterval(this.pruneTimer),this.pruneTimer=void 0)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e})}async challenge(e,t,s,i){let n=Dt();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:n,rematch:s,options:i}),n}async acceptChallenge(e,t,s,i,n){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:n??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i}),await this.updatePresence({tableId:s});let a=new z(this.nchan,s,this.currentUser.userId,this);return await a.join(),a}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.stopPruning(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave"},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.cachedUsersList=null,this.pendingChallenges=[],this.deduplicator.clear(),this.presenceMessageCount=0,this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=ge(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){let t=this.users.get(e.userId);if(e.type==="leave")t&&(this.users.delete(e.userId),this.cachedUsersList=null,this.notifyListeners());else if(e.type==="join")this.users.set(e.userId,e),this.cachedUsersList=null,this.notifyListeners();else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&(this.cachedUsersList=null,this.notifyListeners())}}handleChallenge(e){this.deduplicator.processMessage(e,this.currentUser.userId)}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return this.cachedUsersList?this.cachedUsersList:(this.cachedUsersList=Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName)),this.cachedUsersList)}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)}};var fe=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=new ue(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),n,a={...t,onReconnect:()=>{this.resumeSession().catch(o=>console.error("Session resume failed after lobby reconnect:",o)),t?.onReconnect?.()},onLeave:()=>{let o=n??i;if(o){let p=this.activeLobbies.indexOf(o);p!==-1&&this.activeLobbies.splice(p,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let c=new be(this.nchan,e,a);return n=c,await c.join(),this.lobbyInstances.set(e.userId,c),this.activeLobbies.push(c),c}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t){let s=this.activeTables.find(a=>a.tableId===e);if(s)return await s.join(),s;let i=this.activeLobbies.find(a=>a.currentUser.userId===t);if(!i)throw new Error(`Cannot join table: No active lobby found for user ${t}`);let n=new z(this.nchan,e,t,i);return await n.join(),this.activeTables.push(n),await i.updatePresence({tableId:e}),n}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};var ye=class{constructor(e){this.info=e}get opponentId(){return this.info.opponentId}get ruleType(){return this.info.ruleType}get rematchParam(){return encodeURIComponent(JSON.stringify(this.info))}shouldChallenge(e){return this.info.nextTurnId?this.info.nextTurnId===e:e<this.opponentId}async sendChallenge(e){return e.challenge(this.opponentId,this.ruleType,this.info,this.info.options)}shouldAutoAccept(e){return e.type==="offer"&&e.challengerId===this.opponentId}};function De(r){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname)){console.log("Skipping usage fetch for localhost.");return}let e=`https://scoreboard-tailuge.vercel.app/api/usage/${r}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}var ve=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),ze=class extends f{static properties={lobby:{type:Object},targetId:{type:String},targetName:{type:String},_messages:{state:!0},_unread:{state:!0}};static styles=[$,j,b`
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
    `];constructor(){super(),this._messages=new Map,this._unread=new Map,this._lobbyBound=!1}willUpdate(e){e.has("lobby")&&this.lobby&&!this._lobbyBound&&(this._lobbyBound=!0,this.lobby.onChat(t=>{let s=t.senderId,i=[...this._messages.get(s)??[],t];if(this._messages=new Map(this._messages).set(s,i),s!==this.targetId){let n=(this._unread.get(s)??0)+1;this._unread=new Map(this._unread).set(s,n),ve(this,"unread-changed",{userId:s,count:n})}this.requestUpdate()})),e.has("targetId")&&this.targetId&&this._unread.has(this.targetId)&&(this._unread=new Map(this._unread).set(this.targetId,0),ve(this,"unread-changed",{userId:this.targetId,count:0}))}_send(e){e.preventDefault();let t=this.shadowRoot.querySelector("input"),s=t.value.trim();if(!s||!this.lobby||!this.targetId)return;this.lobby.sendChat(this.targetId,s);let n={messageType:"chat",senderId:this.lobby.currentUser.userId,recipientId:this.targetId,text:s},a=[...this._messages.get(this.targetId)??[],n];this._messages=new Map(this._messages).set(this.targetId,a),t.value="",this.requestUpdate()}updated(e){if(e.has("targetId")){let t=this.shadowRoot.querySelector(".thread");t&&(t.scrollTop=t.scrollHeight);let s=this.shadowRoot.querySelector("input");s&&s.focus()}else if(e.has("_messages")){let t=e.get("_messages");if(this._messages.get(this.targetId)!==t?.get(this.targetId)){let s=this.shadowRoot.querySelector(".thread");s&&(s.scrollTop=s.scrollHeight)}}}render(){if(!this.targetId)return l``;let e=this.lobby?.currentUser?.userId,t=this._messages.get(this.targetId)??[];return l`
            <div class="backdrop" @click=${s=>s.target===s.currentTarget&&ve(this,"close")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Chat with ${this.targetName}">
                    <h3>💬 ${this.targetName}</h3>
                    <div class="thread">
                        ${t.length===0?l`<div class="empty">No messages yet</div>`:t.map(s=>l`<div class="msg ${s.senderId===e?"mine":"theirs"}">${s.text}</div>`)}
                    </div>
                    <form class="compose" @submit=${this._send}>
                        <input type="text" name="message" placeholder="Message…" autocomplete="off" aria-label="Message text">
                        <button type="submit" aria-label="Send message">➤</button>
                    </form>
                    <button class="cancel" @click=${()=>ve(this,"close")}>Close</button>
                </div>
            </div>`}};customElements.define("message-modal",ze);var W=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Ye=class extends f{static properties={challenge:{type:Object},sent:{type:Object},waitingRematch:{type:Object}};static styles=[$,vt,xt];render(){return this.challenge?this._incoming(this.challenge):this.sent?this._sent(this.sent):this.waitingRematch?this._waitingRematch(this.waitingRematch):l``}_waitingRematch(e){return l`
            <div class="banner pending">
                <div class="details">${C(e.ruleType)} ${e.ruleType}</div>
                <div class="row">
                    <strong>Waiting for ${e.opponentName} to accept.</strong>
                    <button class="btn-leave" @click=${()=>W(this,"cancel")}>Cancel</button>
                </div>
            </div>`}_incoming(e){let t=Object.entries(e.options??{}).filter(([s])=>["raceTo","reds"].includes(s)).map(([s,i])=>`${s}: ${i}`);return l`
            <div class="banner">
                <div class="details">${C(e.ruleType)} ${e.ruleType}</div>
                <strong>Challenge from ${e.challengerName}</strong>
                <div class="details">${t.map(s=>l`<span>${s}</span>`)}</div>
                <div class="row">
                    <button class="btn-accept" aria-label="Accept challenge" @click=${()=>W(this,"accept")}>Accept</button>
                    <button class="btn-decline" aria-label="Decline challenge" @click=${()=>W(this,"decline")}>Decline</button>
                </div>
            </div>`}_sent(e){let t=e.status==="pending";return l`
            <div class="banner ${e.status}">
                <div class="details">${C(e.ruleType)} ${e.ruleType}</div>
                <div class="row">
                    <strong>${t?`Waiting for ${e.recipientName} to accept.`:`${e.recipientName} declined.`}</strong>
                    ${t?l`<button class="btn-leave" @click=${()=>W(this,"cancel")}>Cancel</button>`:l`<button aria-label="Dismiss" @click=${()=>W(this,"dismiss")}>✕</button>`}
                </div>
            </div>`}};customElements.define("challenge-banner",Ye);var as=[{userId:"bot-clawbreak",userName:"ClawBreak",isBot:!0,meta:{country:"BOT"}},{userId:"bot-thefarjaw",userName:"TheFarJaw",isBot:!0,meta:{country:"BOT"}}],L=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Ge=class extends f{static properties={users:{type:Array},myId:{type:String},myName:{type:String},tableId:{type:String},isChallengePending:{type:Boolean},challenges:{type:Object},pendingChats:{type:Object}};static styles=[$,yt,b`
        @keyframes throb { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        li { animation: fadeIn 0.4s ease-out; }
        .btn-chat { animation: throb 2s ease-in-out infinite; font-size: 1rem; border: none; background: none; padding: 0 0.2rem; }
        .btn-spectate { background: #7c3aed; color: #fff; border: none; border-radius: 4px; padding: 0.25rem 0.6rem; cursor: pointer; }
        .btn-spectate:hover { background: #6d28d9; }
    `];render(){let e=(this.users||[]).filter(t=>t.userId!==this.myId);return e.length===0?l`<div class="empty">No other players online yet. Invite a friend!</div>`:l`<ul aria-label="Online players">${jt(e,t=>t.userId,t=>this._row(t))}</ul>`}_row(e){let t=this.pendingChats?.get(e.userId)>0,i=!(this.challenges?.[e.userId]?.challengerId===e.userId)&&(e.isBot||Ht(e,this.myId)),n=!e.isBot&&Be(e)==="playing"&&Bt(e,this.tableId),a=At(e.meta?.origin??"",e.ruleType??"",Be(e)),c=t?l`<button class="btn-chat" aria-label="Unread message from ${e.userName}" @click=${()=>L(this,"open-chat",e.userId)}>💬</button>`:n?l`<button class="btn-spectate" aria-label="Spectate ${e.userName}'s game" @click=${()=>L(this,"spectate",e)}>Spectate</button>`:i?l`<button class="btn-challenge" aria-label="Challenge ${e.userName}" ?disabled=${this.isChallengePending} @click=${()=>E?window.location.href="https://billiards.tailuge.workers.dev/lobby":L(this,"challenge",e.userId)}>Challenge</button>`:l``;return l`
            <li aria-label="${e.userName}">
                <div class="user-info">
                    <span class="user-name" @click=${()=>L(this,"open-chat",e.userId)} style="cursor: pointer"><span title="${T(e.meta?.country).title}">${T(e.meta?.country).emoji}</span> ${e.userName} <span aria-label="${a.title}" role="img">${a.emoji}</span></span>
                </div>
                <div class="actions">${c}</div>
            </li>`}},Ve=class r extends f{static properties={userId:{type:String},userName:{type:String}};static styles=[$,j,ae];static RULES=[{id:"eightball",label:"Eight Ball",img:"assets/eightball.png"},{id:"nineball",label:"Nine Ball",img:"assets/nineball.png"},{id:"threecushion",label:"Three Cushion (3)",img:"assets/threecushion.png",options:{raceTo:"3"}},{id:"threecushion",label:"Three Cushion (7)",img:"assets/threecushion.png",options:{raceTo:"7"}},{id:"threecushion",label:"Three Cushion (15)",img:"assets/threecushion.png",options:{raceTo:"15"}},{id:"snooker",label:"Snooker (15 reds)",img:"assets/snooker.png"},{id:"snooker",label:"Snooker (6 reds)",img:"assets/snooker.png",options:{reds:"6"}}];render(){return this.userId?l`
            <div class="backdrop" @click=${e=>e.target===e.currentTarget&&L(this,"cancel")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Select game type">
                    <h3>Challenge ${this.userName}</h3>
                    <div class="rules">
                        ${r.RULES.map(e=>l`
                            <button class="rule btn-challenge" @click=${()=>L(this,"confirm",{ruleType:e.id,options:e.options})}>
                                <span class="icon-wrap">
                                    <img src=${e.img} alt=${e.label} />
                                    ${e.options?l`<span class="badge">${Object.values(e.options)[0]}</span>`:""}
                                </span>
                                ${e.label}
                            </button>`)}
                    </div>
                    <button @click=${()=>L(this,"message")}>💬 Send message</button>
                    <button class="cancel" @click=${()=>L(this,"cancel")}>Cancel</button>
                </div>
            </div>`:l``}},qe=class extends f{static styles=[$,St];#s={...Tt};#i=null;#e;#r;#d;#t=null;#o=null;#l=null;#p=new Map;#n=null;constructor(){super(),this.#e=g.clientId,this.#r=g.userName;let e=new URLSearchParams(location.search),t=e.get("rematch");t?this.#t=new ye(JSON.parse(decodeURIComponent(t))):this.#t=null;let s=e.get("action");if(s==="join"&&(this.#n={opponentId:e.get("opponentId"),opponentName:e.get("opponentName"),ruleType:e.get("ruletype")}),t||s==="join"){let n=new URL(location);n.searchParams.delete("rematch"),n.searchParams.delete("action"),n.searchParams.delete("opponentId"),n.searchParams.delete("opponentName"),n.searchParams.delete("ruletype"),history.replaceState(null,"",n)}let i="https://billiards-network.onrender.com";(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(i=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`),this.#d=new fe({baseUrl:i}),this.#d.setVersion(le(oe))}connectedCallback(){super.connectedCallback(),this._onUserChanged=e=>{this.#e=e.detail.userId,this.#r=e.detail.userName,this.#i?this.#i.updatePresence({userId:this.#e,userName:this.#r}).catch(t=>console.error("Failed to update presence:",t)):this._connect().catch(t=>console.error("Lobby connect failed:",t))},document.addEventListener("user-name-changed",this._onUserChanged),this._connect().catch(e=>console.error("Lobby connect failed:",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onUserChanged),this.#i?.leave()}dispatch(e){this.#s=Ct(this.#s,{...e,myId:this.#e}),this.requestUpdate()}get state(){return this.#s}get#m(){return this.#s.connected}get#b(){return this.#s.users}get#u(){return this.#s.currentMatch?.tableId}get#f(){return this.#s.currentMatch?.ruleType||"standard"}get#y(){return!!this.#s.currentMatch?.isFirst}get#v(){return this.#s.currentMatch?.options}get#g(){return Object.values(this.#s.challenges).find(e=>e.challengeeId===this.#e&&e.status==="pending")}get#c(){return Object.values(this.#s.challenges).find(e=>e.challengerId===this.#e)}get#a(){return[...this.#b,...as]}async _connect(){if(this.#i=await this.#d.joinLobby({messageType:"presence",type:"join",userId:this.#e,userName:this.#r}),this.dispatch({type:"CONNECTED",payload:!0}),this.#t&&this.#t.shouldChallenge(this.#e)){let e=this.#t.info,t=await this.#t.sendChallenge(this.#i);this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#e,challengeeId:this.#t.opponentId,recipientName:e.opponentName,ruleType:this.#t.ruleType,options:e.options,tableId:t,rematch:e}}),this.#t=null}this.#i.onUsersChange(e=>this.dispatch({type:"USERS_UPDATE",payload:e})),this.#i.onChallenge(e=>{if(e.type==="offer"&&e.challengeeId===this.#e){if(this.#t?.shouldAutoAccept(e)){this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#h().catch(s=>console.error("Auto-accept failed:",s));return}if(this.#n&&this.#n.opponentId===e.challengerId){this.#n=null,this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#h(e.challengerId).catch(s=>{console.error("Auto-join accept failed:",s)});return}let t=this.#c;if(t&&t.challengeeId===e.challengerId&&t.status==="pending"){this.#e<e.challengerId&&(this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#h().catch(s=>console.error("Simultaneous auto-accept failed:",s)));return}}this.dispatch({type:"CHALLENGE_MSG",payload:e}),e.type==="offer"&&e.challengeeId===this.#e&&document.hidden&&Notification.permission==="granted"&&new Notification("Challenge received!",{body:`${e.challengerName} challenged you to ${e.ruleType}`,icon:"assets/threecushion.png"})})}async#x(e,t,s){this.#n=null;let i=this.#a.find(a=>a.userId===e);if(i?.isBot){let a="bot-"+Math.random().toString(36).slice(2,8),c=ce(this.#e,this.#e,this.#t?.info);window.location.href=Ne({tableId:a,userId:this.#e,userName:this.#r,ruleType:t,isFirst:c,options:s,bot:i.userName,lod:g.lod,flip:g.flip,rematch:this.#t?.rematchParam});return}let n=await this.#i.challenge(e,t,void 0,s);De("createTable"),this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#e,challengeeId:e,recipientName:i?.userName||e,ruleType:t,options:s,tableId:n}})}async#$(){if(this.#t&&!this.#t.shouldChallenge(this.#e)){this.#t=null,this.requestUpdate();return}let e=this.#c;e?.status==="pending"&&(await this.#i.cancelChallenge(e.challengeeId,e.ruleType),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId}))}async#h(e){this.#n=null;let t=e?this.#s.challenges[e]:this.#g;if(!t)return;await this.#i.acceptChallenge(t.challengerId,t.ruleType,t.tableId,t.options,t.challengerName),De("joinTable");let s=this.#t?.rematchParam??(t.rematch?encodeURIComponent(JSON.stringify(t.rematch)):void 0);this.dispatch({type:"CHALLENGE_DISMISS",payload:t.challengerId}),this.dispatch({type:"MATCH_SET",payload:{tableId:t.tableId,ruleType:t.ruleType,options:t.options,isFirst:ce(this.#e,t.challengerId,t.rematch),rematch:s}})}async#w(){this.#n=null;let e=this.#g;await this.#i.declineChallenge(e.challengerId,e.ruleType,e.challengerName),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId})}#_(){let e=this.#c;e&&this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId})}#S(){let e=[...this.#a].filter(t=>t.meta?.country!=="BOT").map(t=>{let{meta:s={},...i}=t,{ts:n,since:a,...c}=s;return{...i,meta:c}});console.log(JSON.stringify(e,null,2)),console.log(JSON.stringify({myId:this.#e,myName:this.#r}))}render(){if(this.#u){let t=Ne({tableId:this.#u,userId:this.#e,userName:this.#r,ruleType:this.#f,isFirst:this.#y,options:this.#v,lod:g.lod,flip:g.flip,rematch:this.#s.currentMatch?.rematch});return this.#s={...this.#s,currentMatch:null},window.location.href=t,l``}let e=this.#o;return l`
            <div class="panel-header">
                <span class="dot ${this.#m?"on":""}" role="status" aria-label="${this.#m?"Connected":"Disconnected"}"></span>
                <span class="panel-title" @click=${()=>this.#S()}>Play Online (${this.#a.filter(t=>t.userId!==this.#e).length})</span>
            </div>
            <challenge-banner
                .challenge=${this.#g}
                .sent=${this.#c}
                .waitingRematch=${this.#t&&!this.#t.shouldChallenge(this.#e)?this.#t.info:null}
                @accept=${()=>this.#h()}
                @decline=${()=>this.#w()}
                @cancel=${()=>this.#$()}
                @dismiss=${()=>this.#_()}>
            </challenge-banner>
            <user-list
                .users=${this.#a}
                myId=${this.#e}
                myName=${this.#r}
                tableId=${this.#u||""}
                .isChallengePending=${this.#c?.status==="pending"}
                .challenges=${this.#s.challenges}
                .pendingChats=${this.#p}
                @challenge=${t=>{let s=this.#a.find(i=>i.userId===t.detail);this.#o={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}
                @spectate=${t=>{let s=t.detail;window.location.href=Pt({tableId:s.tableId,userId:this.#e,userName:this.#r,ruleType:s.ruleType||"nineball"})}}
                @open-chat=${t=>{let s=this.#a.find(i=>i.userId===t.detail);this.#l={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}>
            </user-list>
            <challenge-modal
                .userId=${e?.userId??null}
                .userName=${e?.userName??""}
                @confirm=${t=>{this.#x(e.userId,t.detail.ruleType,t.detail.options),this.#o=null}}
                @message=${()=>{this.#l={userId:e.userId,userName:e.userName},this.#o=null,this.requestUpdate()}}
                @cancel=${()=>{this.#o=null,this.requestUpdate()}}>
            </challenge-modal>
            <message-modal
                .lobby=${this.#i}
                .targetId=${this.#l?.userId??null}
                .targetName=${this.#l?.userName??""}
                @close=${()=>{this.#l=null,this.requestUpdate()}}
                @unread-changed=${t=>{this.#p=new Map(this.#p).set(t.detail.userId,t.detail.count),this.requestUpdate()}}>
            </message-modal>`}};customElements.define("user-list",Ge);customElements.define("challenge-modal",Ve);customElements.define("online-panel",qe);var Fe=class extends w{static properties={_dotColor:{state:!0}};static styles=$t;constructor(){super(),this._clientId=g.clientId,this._name=g.userName,this._dotColor=g.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,g.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return E?l``:l`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${Math.max(this._name.length,1)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=Math.max(e.target.value.length,1)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",Fe);var os="https://billiards-network.onrender.com/api/stats",Je=class extends f{static styles=b`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.8rem; color: var(--text-muted, #757575); margin-bottom: 0.5rem; }
        ul { list-style: none; margin: 0; padding: 0; }
        li { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; padding: 0.15rem 0; }
        .count { color: var(--text-muted, #757575); font-size: 0.8rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(os,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return l`<span class="loading">Could not load stats.</span>`;if(!this._data)return l`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{});return l`
            ${e?l`<div class="uptime">⏱ ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${s.map(([i,n])=>l`
                    <li>${T(i).emoji} <span>${i}</span> <span class="count">${n}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",Je);var We=class r extends w{static properties={_open:{state:!0},_notifEnabled:{state:!0},_showStats:{state:!0},_copied:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[$,j,b`
        .burger { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0.0rem 0.1rem; color: var(--text-muted); line-height: 1; min-width: 28px; min-height: 32px; }
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
            margin: 0.4rem 0;
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
    `];constructor(){super(),this._open=!1,this._showStats=!1,this._copied=!1,this._theme=document.documentElement.getAttribute("theme")||"light",this._notifEnabled=Notification.permission==="granted",this._onKeydown=this._onKeydown.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeydown)}_onKeydown(e){this._open&&e.key==="Escape"&&this._close()}_toggle(e){e.stopPropagation(),this._open=!this._open}_close(){this._open=!1}_setTheme(e){let t=e.target.checked?"dark":"light";this._theme=t,document.documentElement.setAttribute("theme",t),localStorage.setItem("theme",t),this.dispatchEvent(new CustomEvent("theme-changed",{detail:t,bubbles:!0,composed:!0}))}_share(){navigator.share&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href).then(()=>{this._copied=!0,setTimeout(()=>{this._copied=!1},2e3)})}async _toggleNotifications(e){if(e.target.checked){let t=await Notification.requestPermission();this._notifEnabled=t==="granted"}else this._notifEnabled=!1;this.requestUpdate()}render(){return l`
            <button class="burger" aria-label="Settings" aria-expanded="${this._open}" @click=${this._toggle}>&#9776;</button>
            ${this._open?l`
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

                        <div class="section-title">Graphics</div>
                        <div class="row" style="flex-direction: column; align-items: flex-start; gap: 2px;">
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${r.LOD_LABELS[g.lod]||g.lod}</span></label>
                            <input id="quality-range" type="range" min="0" max="4" step="1" .value=${g.lod} @input=${e=>g.setLod(e.target.value)}>
                        </div>

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

                        <button class="cancel" @click=${this._close} style="margin-top: 0.8rem;">Close</button>
                    </div>
                </div>`:""}
        `}};customElements.define("settings-modal",We);var K=class extends H{constructor(e){if(super(e),this.it=y,e.type!==he.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===y||e==null)return this._t=void 0,this.it=e;if(e===x)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};K.directiveName="unsafeHTML",K.resultType=1;var zt=de(K);var Yt=['This game is free to play and open source on <a href="https://github.com/tailuge/billiards" target="_blank">GitHub</a>',"Choose graphics settings in options menu.",'Masse trick shot replay: <a href="https://scoreboard-tailuge.vercel.app/api/replay/534?lod=4">here</a>.',"You can change your name by clicking on the user badge.","You can flip aim direction in options menu.",'Do you know <a href="https://www.youtube.com/watch?v=ArNBvY1uEUo" target="_blank">Three Cushion</a> billiards rules? The ultimate game.','Thank you for playing snooker, pool and three cushion at <a href="https://github.com/tailuge/billiards" target="_blank">tailuge/billiards</a>.','A great three cushion <a href="https://scoreboard-tailuge.vercel.app/api/rank/24872636?ruletype=threecushion&lod=4">break</a>','Snooker half century <a href="https://scoreboard-tailuge.vercel.app/api/rank/eab7be6a?ruletype=snooker&lod=4">break</a>. When 147?'],Ke=class extends f{static styles=b`
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
    `;constructor(){super(),this.msg=Yt[Math.floor(Math.random()*Yt.length)]}render(){return l`${zt(this.msg)}`}};customElements.define("motd-panel",Ke);var Xe=class extends f{static properties={_theme:{type:String,reflect:!0,attribute:"theme"}};static styles=It;constructor(){super(),console.log("URL:",window.location.href),console.log("Search params:",Object.fromEntries(new URLSearchParams(window.location.search))),this._theme=document.documentElement.getAttribute("theme")||"light"}get _ctrl(){return this.shadowRoot.querySelector("online-panel")}render(){return l`
            <div class="container">
                <header class="topbar">
                    <img src="assets/threecushion.png" class="logo" alt="Billiards Logo">
                    <h1><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Billiards</a><span class="version">${le(oe)}</span></h1>
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
                    <div class="motd-row panel"><motd-panel></motd-panel></div>
                    <div class="info-row"><info-panel></info-panel></div>
                </main>
                <footer style="text-align:center;font-size:0.7rem;opacity:0.7;padding:0.5rem 0">
                    Thanks for playing at <a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" style="color:inherit">tailuge/billiards</a>. Stick around and challenge online for a free game or two.
                </footer>
            </div>
        `}};customElements.define("lobby-app",Xe);})();
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
