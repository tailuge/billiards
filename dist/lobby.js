"use strict";(()=>{var se=globalThis,ie=se.ShadowRoot&&(se.ShadyCSS===void 0||se.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Pe=Symbol(),yt=new WeakMap,G=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ie&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=yt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&yt.set(t,e))}return e}toString(){return this.cssText}},vt=r=>new G(typeof r=="string"?r:r+"",void 0,Pe),b=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new G(t,r,Pe)},_t=(r,e)=>{if(ie)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=se.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},Ne=ie?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return vt(t)})(r):r;var{is:vs,defineProperty:_s,getOwnPropertyDescriptor:xs,getOwnPropertyNames:ws,getOwnPropertySymbols:$s,getPrototypeOf:Is}=Object,re=globalThis,xt=re.trustedTypes,Ss=xt?xt.emptyScript:"",Es=re.reactiveElementPolyfillSupport,Y=(r,e)=>r,Le={toAttribute(r,e){switch(e){case Boolean:r=r?Ss:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},$t=(r,e)=>!vs(r,e),wt={attribute:!0,type:String,converter:Le,reflect:!1,useDefault:!1,hasChanged:$t};Symbol.metadata??=Symbol("metadata"),re.litPropertyMetadata??=new WeakMap;var k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=wt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&_s(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=xs(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:i,set(a){let l=i?.call(this);n?.call(this,a),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??wt}static _$Ei(){if(this.hasOwnProperty(Y("elementProperties")))return;let e=Is(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(Y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Y("properties"))){let t=this.properties,s=[...ws(t),...$s(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Ne(i))}else e!==void 0&&t.push(Ne(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:Le).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),a=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Le;this._$Em=i;let l=a.fromAttribute(t,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let a=this.constructor;if(i===!1&&(n=this[e]),s??=a.getPropertyOptions(e),!((s.hasChanged??$t)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},a){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),n!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:a}=n,l=this[i];a!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[Y("elementProperties")]=new Map,k[Y("finalized")]=new Map,Es?.({ReactiveElement:k}),(re.reactiveElementVersions??=[]).push("2.1.2");var Re=globalThis,It=r=>r,ne=Re.trustedTypes,St=ne?ne.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ue="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,je="?"+C,ks=`<${je}>`,M=document,W=()=>M.createComment(""),K=r=>r===null||typeof r!="object"&&typeof r!="function",Oe=Array.isArray,Pt=r=>Oe(r)||typeof r?.[Symbol.iterator]=="function",Me=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,kt=/>/g,N=RegExp(`>|${Me}(?:([^\\s"'>=/]+)(${Me}*=${Me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,Tt=/"/g,Nt=/^(?:script|style|textarea|title)$/i,ze=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),o=ze(1),ii=ze(2),ri=ze(3),T=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),At=new WeakMap,L=M.createTreeWalker(M,129);function Lt(r,e){if(!Oe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return St!==void 0?St.createHTML(e):e}var Mt=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",a=V;for(let l=0;l<t;l++){let c=r[l],h,p,d=-1,m=0;for(;m<c.length&&(a.lastIndex=m,p=a.exec(c),p!==null);)m=a.lastIndex,a===V?p[1]==="!--"?a=Et:p[1]!==void 0?a=kt:p[2]!==void 0?(Nt.test(p[2])&&(i=RegExp("</"+p[2],"g")),a=N):p[3]!==void 0&&(a=N):a===N?p[0]===">"?(a=i??V,d=-1):p[1]===void 0?d=-2:(d=a.lastIndex-p[2].length,h=p[1],a=p[3]===void 0?N:p[3]==='"'?Tt:Ct):a===Tt||a===Ct?a=N:a===Et||a===kt?a=V:(a=N,i=void 0);let g=a===N&&r[l+1].startsWith("/>")?" ":"";n+=a===V?c+ks:d>=0?(s.push(h),c.slice(0,d)+Ue+c.slice(d)+C+g):c+C+(d===-2?l:g)}return[Lt(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Q=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,a=0,l=e.length-1,c=this.parts,[h,p]=Mt(e,t);if(this.el=r.createElement(h,s),L.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=L.nextNode())!==null&&c.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(Ue)){let m=p[a++],g=i.getAttribute(d).split(C),y=/([.?@])?(.*)/.exec(m);c.push({type:1,index:n,name:y[2],strings:g,ctor:y[1]==="."?oe:y[1]==="?"?le:y[1]==="@"?ce:U}),i.removeAttribute(d)}else d.startsWith(C)&&(c.push({type:6,index:n}),i.removeAttribute(d));if(Nt.test(i.tagName)){let d=i.textContent.split(C),m=d.length-1;if(m>0){i.textContent=ne?ne.emptyScript:"";for(let g=0;g<m;g++)i.append(d[g],W()),L.nextNode(),c.push({type:2,index:++n});i.append(d[m],W())}}}else if(i.nodeType===8)if(i.data===je)c.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(C,d+1))!==-1;)c.push({type:7,index:n}),d+=C.length-1}n++}}static createElement(e,t){let s=M.createElement("template");return s.innerHTML=e,s}};function R(r,e,t=r,s){if(e===T)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=K(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=R(r,i._$AS(r,e.values),i,s)),e}var ae=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??M).importNode(t,!0);L.currentNode=i;let n=L.nextNode(),a=0,l=0,c=s[0];for(;c!==void 0;){if(a===c.index){let h;c.type===2?h=new D(n,n.nextSibling,this,e):c.type===1?h=new c.ctor(n,c.name,c.strings,this,e):c.type===6&&(h=new de(n,this,e)),this._$AV.push(h),c=s[++l]}a!==c?.index&&(n=L.nextNode(),a++)}return L.currentNode=M,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},D=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=R(this,e,t),K(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Pt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&K(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Q.createElement(Lt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new ae(i,this),a=n.u(this.options);n.p(t),this.T(a),this._$AH=n}}_$AC(e){let t=At.get(e.strings);return t===void 0&&At.set(e.strings,t=new Q(e)),t}k(e){Oe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(W()),this.O(W()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=It(e).nextSibling;It(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,i){let n=this.strings,a=!1;if(n===void 0)e=R(this,e,t,0),a=!K(e)||e!==this._$AH&&e!==T,a&&(this._$AH=e);else{let l=e,c,h;for(e=n[0],c=0;c<n.length-1;c++)h=R(this,l[s+c],t,c),h===T&&(h=this._$AH[c]),a||=!K(h)||h!==this._$AH[c],h===_?e=_:e!==_&&(e+=(h??"")+n[c+1]),this._$AH[c]=h}a&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},oe=class extends U{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},le=class extends U{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},ce=class extends U{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=R(this,e,t,0)??_)===T)return;let s=this._$AH,i=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},de=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){R(this,e)}},Rt={M:Ue,P:C,A:je,C:1,L:Mt,R:ae,D:Pt,V:R,I:D,H:U,N:le,U:ce,B:oe,F:de},Cs=Re.litHtmlPolyfillSupport;Cs?.(Q,D),(Re.litHtmlVersions??=[]).push("3.3.2");var Ut=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new D(e.insertBefore(W(),n),n,void 0,t??{})}return i._$AI(r),i};var He=globalThis,f=class extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ut(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};f._$litElement$=!0,f.finalized=!0,He.litElementHydrateSupport?.({LitElement:f});var Ts=He.litElementPolyfillSupport;Ts?.({LitElement:f});(He.litElementVersions??=[]).push("4.2.2");var X=b`
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
`,yi=b`
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
`,jt=b`
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
`,Ot=b`
    :host { display: block; }
    .banner { background: var(--banner-warn-bg); border: 1px solid var(--banner-warn-border); border-radius: 6px; padding: 0.4rem 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; }
    .banner .row { display: flex; gap: 0.3rem; justify-content: flex-end; }
    .details { font-size: 0.72rem; color: var(--banner-warn-text); display: flex; flex-wrap: wrap; gap: 0.4rem; }
`,zt=b`
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
    }`,he=b`
    .badge { position: absolute; bottom: -3px; right: -3px; background: #7a0f1a; color: #fff; font-size: 11px; font-weight: normal; border-radius: 3px; padding: 0 2px; line-height: 1.3; border: 1px solid #fff; min-width: 0;}
`,Ht=b`
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
`,Dt=b`
    :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 48px)); gap: 0.1rem; justify-content: center; }
    a { border: none; background: none; cursor: pointer; padding: 0.1rem; border-radius: 4px; display: inline-block; text-decoration: none; color: inherit; width: 100%; box-sizing: border-box; }
    a:hover { background: var(--btn-hover); }
    .icon-wrap { position: relative; display: block; width: 100%; }
    img { display: block; width: 100%; height: auto; margin: auto; }
`,Bt=b`
    :host { display: block; overflow-y: hidden; font-family: 'Exo', sans-serif; font-weight: 200; font-size: 0.75rem; color: var(--text); max-height: 40px; opacity: 0; transition: max-height 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out 0.15s; }
    :host(.loaded) { max-height: 540px; opacity: 1; }
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
    .group { margin-bottom: 0.14rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 0.2rem; }
    .group-title { font-size: 0.75rem; font-weight: 600; color: var(--text-dim); padding: 0.1rem 0.25rem; text-align: center; }
    .group-body { display: flex; flex-wrap: wrap; justify-content: space-evenly; }
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
`,Ft=b`
    :host { display: flex; flex-direction: column; }
    .panel-header { display: flex; align-items: center; justify-content: center; gap: 0.4rem; margin-bottom: 0.25rem; }
    .panel-title { font-weight: bold; font-size: 0.8rem; color: var(--text-dim); }
    .user-name { font-size: 0.75rem; font-weight: 500; white-space: nowrap; color: var(--text); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #dc3545; flex-shrink: 0; }
    .dot.blue { background: #3b82f6; }
    .dot.green { background: #22c55e; }
    .dot.on { background: #198754; }
`,Jt=[X,b`
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
    .arenas-row     { grid-area: 2 / 1 / 3 / 3; display: grid; grid-template-columns: minmax(0, 230px) minmax(0, 1fr); column-gap: 0.1rem; align-items: stretch; }
    .arenas-row .cabinet-col, .arenas-row .arena-col { min-width: 0; padding: 3px; }
    .arenas-row.arena-details .arena-col { padding: 3px; }
    .info-row       { grid-area: 3 / 1 / 4 / 3; }

    @media (max-width: 640px) {
        .arenas-row { grid-template-columns: minmax(0, 1fr); row-gap: 0.1rem; }
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
`];var ue=1013,me=r=>`v${Math.floor(r/100)}.${String(r%100).padStart(2,"0")}`,j="https://scoreboard-tailuge.vercel.app",O=typeof localStorage<"u"&&localStorage.getItem("useProxy")==="true"?"nchanproxy.tailuge.workers.dev":"billiards-network.onrender.com",Z=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),ee=Z?`ws://${window.location.hostname}:80`:`wss://${O}`,qt=Z?"./active.html":"https://billiards-network.onrender.com/active.html",E=Z?"":"https://billiards-network.onrender.com",I=typeof window<"u"&&window.location.hostname.includes("vercel"),Gt=r=>{let e=Math.floor((Date.now()-r)/1e3);if(e<60)return`${e}s ago`;let t=Math.floor(e/60);if(t<60)return`${t}m ago`;let s=Math.floor(t/60);return s<24?`${s}h ago`:`${Math.floor(s/24)}d ago`},Yt={connected:!1,users:[],challenges:{},currentMatch:null};function Vt(r,e){let t={...r.challenges},s=i=>i.challengerId===e.myId?i.challengeeId:i.challengerId;switch(e.type){case"CONNECTED":return{...r,connected:e.payload};case"SETTLED":return{...r,settled:e.payload};case"USERS_UPDATE":return{...r,users:e.payload};case"CHALLENGE_SENT":return{...r,challenges:{...t,[e.payload.challengeeId]:{...e.payload,status:"pending"}}};case"CHALLENGE_MSG":{let i=e.payload,n=s(i);if(i.type==="offer"){if(r.currentMatch)return r;let a=t[i.challengerId];if(a&&a.challengerId===e.myId&&a.status==="pending"&&e.myId>i.challengerId)return r;(!t[i.challengerId]||t[i.challengerId].tableId!==i.tableId)&&(t[i.challengerId]={...i,status:"pending"})}else if(i.type==="accept"&&!r.currentMatch){let a=t[n];if(!a||a.tableId!==i.tableId)return r;let l=i.options||a.options,c=i.nextTurnId||a.nextTurnId,h=e.myId===i.challengerId,p=h?i.challengeeId:i.challengerId,d=h?i.custom||{}:a.custom||{},m=h?a.recipientName:a.challengerName;return delete t[n],{...r,challenges:t,currentMatch:{tableId:i.tableId,ruleType:i.ruleType,options:l,isFirst:c===i.challengerId||c===i.challengeeId?c===e.myId:i.challengerId===e.myId,opponentId:p,opponentName:m,opponentCustom:d}}}else i.type==="decline"?t[i.challengeeId]&&(t[i.challengeeId]={...t[i.challengeeId],status:"declined"}):i.type==="cancel"&&delete t[s(i)];return{...r,challenges:t}}case"CHALLENGE_DISMISS":return delete t[e.payload],{...r,challenges:t};default:return r}}function Be(r="",e="",t="",s={},i=void 0){let n={bot:{emoji:"\u{1F916}",title:"bot"},nineball:{emoji:"\u2468",title:"nineball"},eightball:{emoji:"\u{1F3B1}",title:"eightball"},snooker:{emoji:"\u{1F534}",title:"snooker"},threecushion:{emoji:"\u2462",title:"threecushion"},sagu:{emoji:"\u2463",title:"sagu"}},a=n[e],l=["5","6"].includes(String(s?.tableSize)),c=!!s?.freeaim,h=p=>{if(!l&&!c)return p;let d=p.emoji+(l?"\u{1F37C}":"")+(c?"\u2316":""),m=[l&&"mini",c&&"freeaim"].filter(Boolean).join(" ");return{emoji:d,title:m}};if(i)return{emoji:"\u2694\uFE0F",title:"arena"};if(t==="spectating")return{emoji:"\u{1F52D}",title:"spectator"};if(t==="playing")return h(a??{emoji:"\u{1F3AE}",title:"playing"});if(t==="available"&&e==="replay")return{emoji:"\u{1F440}",title:"replay"};if(a)return r.includes("veli")?h({emoji:"\u{1F393}",title:"study"}):r.includes("github")?h({emoji:a.emoji+"\u{1F419}",title:"github"}):r.includes("localhost")?h({emoji:a.emoji+"\u{1F3E0}",title:"localhost"}):h(a);if(e.includes("-bot")){let p=n[e.replace("-bot","")];if(p)return h({emoji:p.emoji+"\u{1F916}",title:"bot"})}if(e.includes("-exam")){let p=n[e.replace("-exam","")];if(p)return h({emoji:p.emoji+"\u{1F4DC}",title:"exam"})}if(e.includes("-speedrun")){let p=n[e.replace("-speedrun","")];if(p)return h({emoji:p.emoji+"\u{1F45F}",title:"speedrun"})}return r.startsWith("/")||r.includes("workers")?{emoji:"\u{1F464}",title:"vercel"}:r.includes("github")?{emoji:"\u{1F419}",title:"github"}:r.includes("vercel")?{emoji:"\u{1F465}",title:"vercel"}:r.includes("localhost")?{emoji:"\u{1F3E0}",title:"localhost"}:n[e]??{emoji:"\u{1F3AE}",title:"external"}}var w=r=>{if(r==="BOT")return{emoji:"\u{1F916}",title:"BOT"};if(!r)return{emoji:"\u{1F310}",title:""};let e=r.toUpperCase();return{emoji:[...e].map(s=>String.fromCodePoint(127397+s.charCodeAt(0))).join(""),title:e}},Fe=Z?`http://${window.location.hostname}:8080/`:"https://billiards.tailuge.workers.dev/",pe=(r,e)=>e?Object.entries(e).reduce((t,[s,i])=>t+`&${encodeURIComponent(s)}=${encodeURIComponent(i)}`,r):r,Wt=(r,e,t)=>{for(let[s,i]of Object.entries(r)){let n=e?`${e}.${encodeURIComponent(s)}`:encodeURIComponent(s);i&&typeof i=="object"&&!Array.isArray(i)?Wt(i,n,t):i!=null&&t.push(`${n}=${encodeURIComponent(i)}`)}return t},De=(r,e,t)=>e&&typeof e=="object"?Wt(e,t,[]).reduce((s,i)=>s+`&${i}`,r):r,Kt=(r,e,t,s,i,n)=>{if(r.absolute)return r.url;let a=r.url?`${r.url}?userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`:`${Fe}?ruletype=${r.ruletype}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}&lod=${s}`;return Z&&(a+=`&lobbyUrl=${ee}`),i&&(a+="&flip=true"),a=De(a,n,"custom"),r.url?a:pe(a,r.options)},z=({tableId:r,userId:e,userName:t,ruleType:s,isFirst:i,options:n,localOptions:a,bot:l,lod:c,flip:h,custom:p,opponent:d})=>{let m=`${Fe}?websocketserver=${ee}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}`;return l||(m+=`&tableId=${r}`),i&&(m+="&first=true"),l&&(m+=`&bot=${encodeURIComponent(l)}`),c!==void 0&&(m+=`&lod=${c}`),h&&(m+="&flip=true"),m=pe(m,n),m=pe(m,a),m=De(m,p,"custom"),d?.userId&&(m+=`&opponent.userId=${encodeURIComponent(d.userId)}&opponent.userName=${encodeURIComponent(d.userName||"")}`,m=De(m,d.custom,"opponent.custom")),m},Qt=({tableId:r,userId:e,userName:t,ruleType:s,options:i})=>{let n=`${Fe}?websocketserver=${ee}&tableId=${r}&userName=${encodeURIComponent(t)}&userId=${e}&ruletype=${s}&spectator=true`;return pe(n,i)},As={eightball:"eightball",snooker:"snooker",threecushion:"threecushion",nineball:"nineball",sagu:"sagu"},A=r=>{let e=As[r];return e?o`<img src="assets/${e}.png" alt="${r}" title="${r}" width="18" height="18" style="vertical-align:middle">`:o`🎱`},ge=(r,e={})=>o`<span title="${r}">
    ${A(r)}${e?.freeaim?"\u2316":""}${Number(e?.tableSize)<10?"\u{1F37C}":""}
</span>`,Je=r=>["\u{1F3C6}","\u{1F948}","\u{1F949}","\u{1F396}\uFE0F"][r]??"",be=r=>r?.freeaim?"\u2295":Object.values(r||{})[0],qe=(r,e,t)=>`${r}&userId=${encodeURIComponent(e)}&userName=${encodeURIComponent(t)}`;var Xt=r=>{let e=(r||"user").slice(0,4),t=/Tauri/i.test(navigator.userAgent)?"-t-":"-";return e+t+Math.random().toString(36).slice(2,7)},Ge=class extends EventTarget{constructor(){super();let e=new URLSearchParams(window.location.search),t=(e.get("userId")||"").trim(),s=(e.get("userName")||"").trim();I&&(localStorage.removeItem("userId"),localStorage.removeItem("userName"),localStorage.removeItem("custom"));let i=(localStorage.getItem("userId")||"").trim(),n=(localStorage.getItem("userName")||"").trim();if(t.length>2)this.clientId=t,this.isForcedId=!0;else if(window.self!==window.top&&(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&window.name.includes("-"))this.clientId=window.name,this.isForcedId=!0,s||(this.userName=window.name.split("-")[0]);else{let l=s||n||"",c=!l||i.split("-")[0].slice(0,4)===l.slice(0,4);this.clientId=i.length>2&&!i.startsWith("user-")&&c?i:Xt(l),this.isForcedId=!1,this.clientId!==i&&localStorage.setItem("userId",this.clientId)}this.userName=s||this.userName||n||"Anonymous",this.lod=localStorage.getItem("lod")||"4",this.flip=localStorage.getItem("flip")==="true",this.useProxy=localStorage.getItem("useProxy")==="true";try{this.custom=JSON.parse(localStorage.getItem("custom"))||{}}catch{this.custom={}}window.addEventListener("storage",a=>{if(a.key==="custom"){try{this.custom=JSON.parse(a.newValue)||{}}catch{this.custom={}}this.dispatchEvent(new Event("change"))}}),console.log("UserStore identity:",this.userName,this.clientId)}setUseProxy(e){this.useProxy=!!e,localStorage.setItem("useProxy",this.useProxy),this.dispatchEvent(new Event("change")),window.location.reload()}set(e,t){this.clientId=e.trim().length>2?e.trim():Xt(t),this.userName=t.trim(),localStorage.setItem("userId",this.clientId),localStorage.setItem("userName",this.userName),this.dispatchEvent(new Event("change"))}setLod(e){this.lod=e,localStorage.setItem("lod",e),this.dispatchEvent(new Event("change"))}setFlip(e){this.flip=!!e,localStorage.setItem("flip",this.flip),this.dispatchEvent(new Event("change"))}getCustom(){return{...this.custom}}setCustom(e,t){this.custom={...this.custom,[e]:t},localStorage.setItem("custom",JSON.stringify(this.custom)),this.dispatchEvent(new Event("change"))}},u=new Ge,S=class extends f{connectedCallback(){super.connectedCallback(),this._storeListener=()=>this.requestUpdate(),u.addEventListener("change",this._storeListener)}disconnectedCallback(){super.disconnectedCallback(),u.removeEventListener("change",this._storeListener)}};var Ps=[{label:"Nine Ball",img:"assets/nineball.png",ruletype:"nineball"},{label:"Snooker 6r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"6",tableSize:"12"}},{label:"Snooker 10r",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"10",tableSize:"12"}},{label:"3-Cushion 5ft",img:"assets/baby.png",ruletype:"threecushion",options:{raceTo:"15",tableSize:"5"}},{label:"Snooker",img:"assets/snooker.png",ruletype:"snooker",options:{reds:"15",tableSize:"12"}},{label:"3-Cushion (7)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"7"}},{label:"Speedrun",img:"assets/speedrun.png",url:"speedrun/index.html"},{label:"3-Cushion analysis",img:"assets/drill.png",url:"https://velikodimov.github.io/billiards/dist/index.html?ruletype=threecushion&practice&drill",absolute:!0},{label:"Books",img:"assets/book.png",url:"book/index.html"},{label:"3-Cushion (40)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"40"}},{label:"3-Cushion (15)",img:"assets/threecushion.png",ruletype:"threecushion",options:{raceTo:"15"}},{label:"Sagu (5)",img:"assets/sagu.png",ruletype:"sagu",options:{raceTo:"5"}},{label:"Trickshot",img:"assets/practice.png",url:"https://billiards.tailuge.workers.dev/practice"},{label:"Research",img:"assets/research.png",url:"https://billiards.tailuge.workers.dev/diagrams/three"},{label:"Eight Ball",img:"assets/eightball.png",ruletype:"eightball"},{label:"Exam",img:"assets/cert.png",url:"exam/index.html",absolute:!0}],Ye=class extends S{static styles=[Dt,he];#e=[...Ps].sort(()=>Math.random()-.5);render(){let{clientId:e,userName:t,lod:s,flip:i}=u;return o`<div class="grid">
      ${this.#e.map(n=>o` <a
            href=${Kt(n,e,t,s,i,u.getCustom())}
            title=${n.label}
            aria-label="Play ${n.label}"
          >
            <span class="icon-wrap">
              <img src=${n.img} alt=${n.label} />
              ${n.options?o`<span class="badge">${be(n.options)}</span>`:""}
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
    `;render(){let e=this.color?`background-color: ${this.color}`:"",t=this.prefix?o`<span class="prefix" title=${this.prefixTitle}>${this.prefix}</span>`:"";return o`
            <a
                class="pill"
                href=${this.url}
                style=${e}>
                ${t}
                ${this.label?o`<span>${this.label}</span>`:""}
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </a>
        `}};customElements.define("replay-button",Ve);var We=class extends S{static styles=Bt;connectedCallback(){if(super.connectedCallback(),I){this.classList.add("loaded");return}fetch(`${j}/api/summary`,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.classList.add("loaded"),this.requestUpdate()}).catch(()=>{this._err=!0,this.classList.add("loaded"),this.requestUpdate()})}render(){if(I)return o`<span class="loading">We have moved <a href="https://billiards.tailuge.workers.dev/lobby">Play online here</a></span>`;if(this._err)return o`<span class="loading">Could not load scores.</span>`;if(!this._data)return o`<span class="loading">Connecting to server…</span>`;let{hiscores:e,topPlayers:t,recentMatches:s}=this._data,i=Object.keys(e),n=i.filter(a=>a!=="eightball"&&a!=="sagu");return o`
            <div class="group hiscores">
                <div class="group-body">
                    ${n.map(a=>o`
                        <div class="tbl${a==="sagu"?" sagu-hi":""}"><table><caption><a href="${j}/leaderboard" target="_blank" rel="noopener" style="font-weight:200;font-size:0.75rem">${A(a)} HiScore</a></caption>
                        <tr><th>Name</th><th></th></tr>
                            ${e[a].slice(0,4).map((l,c)=>o`<tr><td>${Je(c)} ${l.name}</td><td><replay-button url="${qe(`${j}/api/rank/${l.id}?ruletype=${a}&lod=${u.lod}`,u.clientId,u.userName)}" label="${l.score}"></replay-button></td></tr>`)}
                        </table></div>
                    `)}
                </div>
            </div>
            <div class="bottom-row">
                <div class="group recent">
                    <div class="group-body">
                        <div class="tbl"><table>
                        <tr><th>Rule</th><th>Match</th><th>Ago</th><th class="city-col">City</th><th></th></tr>
                            ${s.map(a=>o`<tr>
                                <td>${A(a.ruleType)}</td><td>${a.arenaId?"\u2694\uFE0F":""}${a.loser?a.tableSize!=null&&a.tableSize<10?"\u{1F37C}":"\u{1F396}\uFE0F":""}${a.freeaim===!0?"\u2316":""}${a.berserk===!0||a.berserk==="true"?"\u{1F680}":""}${a.winner}${a.winnerScore!=null?o`<span class="score">(${a.winnerScore})</span>`:""}${a.loser?o` vs ${a.loser}${a.loserScore!=null?o`<span class="score">(${a.loserScore})</span>`:""}`:""}</td>
                                <td class="ago">${Gt(a.timestamp)}</td>
                                <td class="city-col">${a.locationCity??""}</td>
<td class="replay-col">
                                    ${a.hasReplay?o`<replay-button prefix="${w(a.locationCountry).emoji}" prefixTitle="${w(a.locationCountry).title}" url="${qe(`${j}/api/match-replay?id=${a.id}&lod=${u.lod}`,u.clientId,u.userName)}"></replay-button>`:w(a.locationCountry).emoji}
                                </td>
                            </tr>`)}
                        </table></div>
                    </div>
                </div>
                <div class="group top-players">
                    <div class="group-body">
                        ${i.map(a=>o`
                            <div class="tbl"><table><caption><a href="${j}/elo" target="_blank" rel="noopener">${A(a)} <span style="font-size:0.75rem;font-weight:200">Rankings</span></a></caption>
                             <tr><th>Name</th><th>Score</th><th>W</th><th>L</th></tr>
                                 ${t[a].slice(0,4).map((l,c)=>o`<tr>
                                     <td><a href="${j}/player/${encodeURIComponent(l.name)}?ruleType=${a}">${Je(c)} ${l.name}</a></td>
                                     <td>${Math.round(l.conservativeRating)}</td>
                                 </tr>`)}
                            </table></div>
                        `)}
                    </div>
                </div>
            </div>`}};customElements.define("info-panel",We);var F={PRESENCE_PUBLISH:"/publish/presence/lobby",PRESENCE_SUBSCRIBE:"/subscribe/presence/lobby",TABLE_PUBLISH:r=>`/publish/table/${r}`,TABLE_SUBSCRIBE:r=>`/subscribe/table/${r}`},fe=class{constructor(e){this._recordedMessages=[];if(this.server=e.replace(/\/$/,""),!this.server.includes("://"))if(typeof window<"u"){let t=window.location.protocol;this.server=`${t}//${this.server}`}else this.server=`http://${this.server}`}setVersion(e){this.version=e}getWsUrl(e){return this.server.replace(/^http/,"ws")+e}getHttpUrl(e){return this.server+e}async publish(e,t,s={}){let i=this.getHttpUrl(e);this.version&&(t.meta={...t.meta,version:this.version});let n=JSON.stringify(t);if(s.keepalive&&typeof navigator<"u"&&navigator.sendBeacon){let h=new Blob([n],{type:"application/json"});if(navigator.sendBeacon(i,h))return}let a=new AbortController,l=setTimeout(()=>a.abort(),2e4),c;try{c=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:s.keepalive,signal:a.signal})}finally{clearTimeout(l)}if(!c.ok)throw new Error(`Publish failed: ${c.status}`)}record(e){this._recordedMessages.push(e)}get recordedMessages(){return this._recordedMessages}async publishPresence(e,t){return this.publish(F.PRESENCE_PUBLISH,{...e,messageType:"presence"},t)}async publishChallenge(e,t){return this.publish(F.PRESENCE_PUBLISH,{...e,messageType:"challenge"},t)}async publishChat(e,t){return this.publish(F.PRESENCE_PUBLISH,{...e,messageType:"chat"},t)}async publishTable(e,t,s,i){return this.publish(F.TABLE_PUBLISH(e),{...t,senderId:s},i)}subscribePresence(e,t){let s=`uid=${encodeURIComponent(e)}`;typeof document<"u"&&document.referrer&&(s+=`&ref=${encodeURIComponent(document.referrer)}`);let i=`${F.PRESENCE_SUBSCRIBE}?${s}`;return this.subscribe(i,t)}subscribeTable(e,t,s,i){let n=`${F.TABLE_SUBSCRIBE(e)}?uid=${encodeURIComponent(t)}`;return i?.isSpectator&&(n+="&spectator=1"),this.subscribe(n,s)}subscribe(e,t){let s=this.getWsUrl(e),i=()=>new Date().toISOString().slice(11,23),n=null,a=!1,l=0,c=8e3,h=6e4,p=null,d=!0,m=2e4,g=null,y={stop:()=>{a=!0,p&&(clearTimeout(p),p=null),g&&(clearTimeout(g),g=null),n&&(n.close(),n=null)},ready:null},x;y.ready=new Promise($=>{x=$});let H=()=>{if(!a){if(n&&n.readyState<=WebSocket.OPEN){x();return}n=new globalThis.WebSocket(s),g&&clearTimeout(g),g=setTimeout(()=>{console.warn(`[NchanClient ${i()}] Connection to ${s} timed out after ${m}ms, forcing reconnect`),n?.close()},m),g.unref?.(),n.onmessage=$=>{this.record($.data),t($.data)},n.onopen=()=>{let $=!d;d=!1,l=0,p&&(clearTimeout(p),p=null),g&&(clearTimeout(g),g=null),x(),$&&y.onReconnect&&y.onReconnect()},n.onclose=$=>{if(g&&(clearTimeout(g),g=null),!a){if(l>=10){console.error(`[NchanClient ${i()}] Max reconnect attempts reached for ${s}, giving up`);return}let ys=Math.min(Math.pow(2,l)*c,h);l++,p=setTimeout(H,ys),p.unref?.()}},n.onerror=$=>{console.error(`[NchanClient ${i()}] WebSocket error on ${s}:`,$),n&&(n.onerror=null,n?.close())}}};return H(),y}};function Zt(r){return r.type==="table:leave"&&!!r.data?.isSpectator}function es(r,e){return r.userId!==e&&!r.tableId&&!r.seek}function ts(r,e){return!!r.tableId&&!r.isSpectator&&r.tableId!==e}function ye(r){return r.tableId?r.isSpectator?"spectating":"playing":"available"}function ve(r){let e=new Map;for(let t of r)t.tableId&&(e.has(t.tableId)||e.set(t.tableId,{tableId:t.tableId,players:[],ruleType:t.ruleType}),e.get(t.tableId).players.push({id:t.userId,name:t.userName}));return Array.from(e.values())}function _e(r){if(!r||r.trim()==="")return null;try{return JSON.parse(r)}catch(e){return console.error("Failed to parse Nchan message:",e),null}}function ss(){return"xxxxxxxx".replace(/x/g,()=>Math.floor(Math.random()*16).toString(16))}var Ke=250,te=class r{static dedupeChallenges(e){let t=new Set;for(let s of e)s.type!=="offer"&&t.add(r.interactionKey(s));return e.filter(s=>s.type!=="offer"?!0:!t.has(r.interactionKey(s)))}static dedupePresence(e){let t=new Map;for(let s of e){let i=t.get(s.userId);if(i&&i.type!=="leave"&&s.type==="leave"&&s.meta?.origin==="internal"){let n=s.meta?.ts,a=i.meta?.ts??i.clientTs;if(n!==void 0&&a!==void 0&&n>=a&&n-a<=Ke)continue}t.set(s.userId,s)}return[...t.values()]}static interactionKey(e){return[e.challengerId,e.challengeeId].sort().join(":")}};var xe=class{constructor(e,t,s={}){this.nchan=e;this.currentUser=t;this.options=s;this.users=new Map;this.listeners=[];this.challengeListeners=[];this.chatListeners=[];this.pendingChallenges=[];this.subscription=null;this.isJoined=!1;this.presenceMessageCount=0;this.joinSentinelTs=null;this.settledListeners=[];this.isSettled=!1;this.unsettledChallengeMessages=[];this.unsettledPresenceMessages=[];this.heartbeatInterval=s.heartbeatInterval||6e4}onChat(e){this.chatListeners.push(e)}async sendChat(e,t){await this.nchan.publishChat({senderId:this.currentUser.userId,recipientId:e,text:t})}async join(){if(!this.isJoined){this.subscription=this.nchan.subscribePresence(this.currentUser.userId,e=>{this.handleIncomingMessage(e)}),this.subscription.onReconnect=()=>{this.resumeHeartbeat(),this.options.onReconnect?this.options.onReconnect():this.nchan.publishPresence({...this.currentUser,clientTs:Date.now()}).catch(e=>{console.error("Failed to re-broadcast presence on reconnect:",e)})},await this.subscription.ready;for(let e=1;;e++)try{let t=Date.now();this.joinSentinelTs=t,await this.nchan.publishPresence({...this.currentUser,clientTs:t});break}catch(t){let s=Math.min(Math.pow(2,e)*4e3,3e4);console.warn(`[Lobby] Initial presence publish failed (attempt ${e}), retrying in ${s}ms:`,t),await new Promise(i=>setTimeout(i,s))}this.startHeartbeat(),this.isJoined=!0}}pauseHeartbeat(){this.stopHeartbeat()}resumeHeartbeat(){this.startHeartbeat()}startHeartbeat(){this.stopHeartbeat();let e=!0,t=()=>{this.heartbeatTimer=setTimeout(async()=>{try{await this.syncPresence({type:"heartbeat"})}catch(s){console.error("Failed to send heartbeat:",s)}this.heartbeatTimer!==void 0&&t()},e?3e3:this.heartbeatInterval),this.heartbeatTimer.unref?.(),e=!1};t()}stopHeartbeat(){this.heartbeatTimer&&(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0)}get settled(){return this.isSettled}onSettled(e){this.isSettled?e():this.settledListeners.push(e)}onUsersChange(e){this.listeners.push(e),e(this.getUsersList())}getUsers(){return this.getUsersList()}offUsersChange(e){this.listeners=this.listeners.filter(t=>t!==e)}async updatePresence(e){this.currentUser={...this.currentUser,...e},await this.syncPresence()}async syncPresence(e={}){if(this.presenceMessageCount++,this.presenceMessageCount>=120){await this.leave();return}await this.nchan.publishPresence({...this.currentUser,...e,clientTs:Date.now()})}async challenge(e,t,s,i,n){let a=ss();return await this.nchan.publishChallenge({type:"offer",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t,tableId:a,options:s,nextTurnId:i,custom:n}),a}async acceptChallenge(e,t,s,i,n,a,l){await this.nchan.publishChallenge({type:"accept",challengerId:e,challengerName:n??e,challengeeId:this.currentUser.userId,ruleType:t,tableId:s,options:i,nextTurnId:a,custom:l}),await this.updatePresence({tableId:s,ruleType:t,options:i})}async declineChallenge(e,t,s){await this.nchan.publishChallenge({type:"decline",challengerId:e,challengerName:s??e,challengeeId:this.currentUser.userId,ruleType:t})}async cancelChallenge(e,t){await this.nchan.publishChallenge({type:"cancel",challengerId:this.currentUser.userId,challengerName:this.currentUser.userName,challengeeId:e,ruleType:t})}onChallenge(e){this.challengeListeners.push(e),this.pendingChallenges.forEach(t=>e(t))}async leave(e={}){this.stopHeartbeat(),this.subscription?.stop();try{await this.nchan.publishPresence({...this.currentUser,type:"leave",clientTs:Date.now()},{keepalive:e.isTeardown})}catch(t){console.error("Error leaving lobby:",t)}this.users.clear(),this.pendingChallenges=[],this.presenceMessageCount=0,this.clearSettleState(),this.notifyListeners(),this.isJoined=!1,this.options.onLeave?.()}handleIncomingMessage(e){let t=_e(e);t&&(t.messageType==="presence"?this.handlePresenceUpdate(t):t.messageType==="challenge"?this.handleChallenge(t):t.messageType==="chat"&&this.handleChat(t))}handlePresenceUpdate(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledPresenceMessages.push(e),e.userId===this.currentUser.userId&&e.type==="join"&&e.clientTs===this.joinSentinelTs&&this.fireSettled();return}this.applyPresence(e)}applyPresence(e){let t=this.users.get(e.userId);if(e.type==="leave"){if(this.shouldIgnoreAutoLeave(e,t))return;t&&(this.users.delete(e.userId),this.notifyListeners())}else if(e.type==="join")(!this.users.has(e.userId)||this.users.get(e.userId)?.type==="leave")&&(this.users.set(e.userId,e),this.notifyListeners());else{let s=!t||this.hasMeaningfulChange(t,e);this.users.set(e.userId,e),s&&this.notifyListeners()}}handleChallenge(e){if(!this.isSettled&&this.joinSentinelTs!==null){this.unsettledChallengeMessages.push(e);return}this.emitIfRelevant(e)}emitIfRelevant(e){e.type==="offer"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.type==="cancel"?e.challengeeId===this.currentUser.userId&&this.emitChallenge(e):e.challengerId===this.currentUser.userId&&this.emitChallenge(e)}emitChallenge(e){this.pendingChallenges.push(e),this.challengeListeners.forEach(t=>t(e))}handleChat(e){e.recipientId===this.currentUser.userId&&this.chatListeners.forEach(t=>t(e))}notifyListeners(){let e=this.getUsersList();this.listeners.forEach(t=>t(e))}getUsersList(){return Array.from(this.users.values()).sort((e,t)=>e.userName.localeCompare(t.userName))}shouldIgnoreAutoLeave(e,t){if(!t||e.type!=="leave"||e.meta?.origin!=="internal"||t.type==="leave")return!1;let s=e.meta?.ts,i=t.meta?.ts??t.clientTs;return s===void 0||i===void 0?!1:s>=i&&s-i<=Ke}hasMeaningfulChange(e,t){return e.userName!==t.userName||e.tableId!==t.tableId||e.arenaId!==t.arenaId||e.ruleType!==t.ruleType||e.opponentId!==t.opponentId||JSON.stringify(e.seek)!==JSON.stringify(t.seek)||JSON.stringify(e.options)!==JSON.stringify(t.options)}fireSettled(){if(this.isSettled)return;this.isSettled=!0;let e=te.dedupePresence(this.unsettledPresenceMessages);for(let i of e)this.applyPresence(i);this.unsettledPresenceMessages=[];let t=te.dedupeChallenges(this.unsettledChallengeMessages);for(let i of t)this.emitIfRelevant(i);this.unsettledChallengeMessages=[];let s=[...this.settledListeners];this.settledListeners=[];for(let i of s)i()}clearSettleState(){this.joinSentinelTs=null,this.isSettled=!1,this.settledListeners=[],this.unsettledChallengeMessages=[],this.unsettledPresenceMessages=[]}};var we=class r{constructor(e,t,s,i,n=!1,a,l,c,h){this.nchan=e;this.tableId=t;this.userId=s;this.lobby=i;this.isSpectator=n;this.onClosed=c;this.subscription=null;this.isJoined=!1;this.isClosed=!1;this.socketEstablished=!1;this.publishQueue=[];this.flushing=!1;this.flushPromise=null;this.retryAttempt=0;this.joinPromise=null;this.messageListeners=[];this.spectatorListeners=[];this.opponentLeftListeners=[];this.opponentRejoinedListeners=[];this.opponentLeft=!1;this.bothJoinedListeners=[];this.bothJoinedResolved=!1;this.seenIds=new Set;this.preJoinQueue=[];this.seenMsgIds=new Map;this.maxOutboxSize=h?.maxSize??1e3,this.initialRetryDelayMs=h?.initialRetryDelayMs??4e3,this.maxRetryDelayMs=h?.maxRetryDelayMs??3e4,this.bothJoined=new Promise(p=>{this.resolveBothJoined=()=>{if(this.bothJoinedResolved)return;this.bothJoinedResolved=!0,this.bothJoinedListeners.forEach(m=>m()),this.preJoinQueue.splice(0).forEach(m=>this.messageListeners.forEach(g=>g(m))),p()}}),a&&this.messageListeners.push(a),l&&this.bothJoinedListeners.push(l)}static{this.MAX_SEEN_MSG_IDS=8192}get closed(){return this.isClosed}join(){return this.isClosed?Promise.reject(new Error(`Cannot join table ${this.tableId}: table is closed`)):this.isJoined?Promise.resolve():this.joinPromise?this.joinPromise:(this.joinPromise=this.doJoin().finally(()=>{this.joinPromise=null}),this.joinPromise)}async doJoin(){if(!this.isClosed){this.subscription=this.nchan.subscribeTable(this.tableId,this.userId,e=>{this.handleIncomingMessage(e)},{isSpectator:this.isSpectator}),this.subscription.onReconnect=()=>this.handleReconnect();try{await this.subscription.ready}catch(e){throw this.subscription.stop(),e}if(this.socketEstablished=!0,this.isClosed){this.subscription.stop();return}if(!this.isSpectator)try{await this.publishControl("joined",{id:this.userId})}catch(e){throw this.subscription.stop(),e}if(this.isClosed){this.subscription?.stop();return}this.isJoined=!0}}publish(e,t){return this.isClosed?Promise.reject(new Error(`Cannot publish to table ${this.tableId}: table is closed`)):this.publishQueue.length>=this.maxOutboxSize?Promise.reject(new Error(`Table ${this.tableId} publish queue is full (max ${this.maxOutboxSize})`)):new Promise((s,i)=>{this.publishQueue.push({type:e,data:t,resolve:s,reject:i}),this.flush()})}handleReconnect(){this.isClosed||!this.isJoined||(this.isSpectator||this.publishControl("joined",{id:this.userId}).catch(e=>{console.error(`Table ${this.tableId} re-announced joined failed:`,e)}),this.flush())}publishControl(e,t){return new Promise((s,i)=>{let n=a=>{if(this.isClosed){i(new Error(`Cannot publish control message to closed table ${this.tableId}`));return}this.nchan.publishTable(this.tableId,{type:e,data:t},this.userId).then(()=>s()).catch(l=>{if(this.isClosed){i(l);return}let c=Math.min(Math.pow(2,a+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);setTimeout(()=>n(a+1),c)})};n(0)})}flush(){return this.flushing&&this.flushPromise?this.flushPromise:(this.flushing=!0,this.flushPromise=this.runFlush().finally(()=>{this.flushing=!1,this.flushPromise=null,this.publishQueue.length>0&&!this.isClosed&&this.flush()}),this.flushPromise)}async runFlush(){for(;this.publishQueue.length>0&&!this.isClosed;){if(!this.socketEstablished&&this.joinPromise)try{await this.joinPromise}catch{}if(this.isClosed)break;let e=this.publishQueue.shift();try{await this.nchan.publishTable(this.tableId,{type:e.type,data:e.data},this.userId),this.retryAttempt=0,e.resolve()}catch(t){if(this.isClosed){e.reject(t);return}this.publishQueue.unshift(e),await this.delay(this.nextRetryDelay())}}}nextRetryDelay(){let e=Math.min(Math.pow(2,this.retryAttempt+1)*this.initialRetryDelayMs,this.maxRetryDelayMs);return this.retryAttempt++,e}delay(e){return new Promise(t=>setTimeout(t,e))}onOpponentLeft(e){this.opponentLeftListeners.push(e),this.opponentLeft&&e()}onOpponentRejoined(e){this.opponentRejoinedListeners.push(e)}onSpectatorChange(e){this.spectatorListeners.push(e)}async leave(e={}){if(!this.isClosed){if(this.isClosed=!0,!e.isTeardown)try{await this.nchan.publishTable(this.tableId,{type:"table:leave",data:this.isSpectator?{isSpectator:!0}:{}},this.userId),await new Promise(t=>setTimeout(t,100))}catch(t){console.error("Error leaving table:",t)}this.lobby&&await this.lobby.updatePresence({tableId:void 0}),this.socketEstablished&&this.subscription?.stop(),this.messageListeners=[],this.spectatorListeners=[],this.opponentLeftListeners=[],this.opponentRejoinedListeners=[],this.isJoined=!1,this.joinPromise=null,this.rejectQueuedPublishes(),this.onClosed?.()}}rejectQueuedPublishes(){for(;this.publishQueue.length>0;)this.publishQueue.shift().reject(new Error(`Table ${this.tableId} publish cancelled: table closed`))}handleIncomingMessage(e){let t=_e(e);if(!t||!t.type)return;let s=t.meta?.msgId;if(typeof s=="string"){if(this.seenMsgIds.has(s))return;if(this.seenMsgIds.set(s,!0),this.seenMsgIds.size>r.MAX_SEEN_MSG_IDS){let i=this.seenMsgIds.keys().next().value;i!==void 0&&this.seenMsgIds.delete(i)}}if(t.type==="table:leave"){t.senderId!==this.userId&&!Zt(t)&&this.notifyOpponentLeft();return}if(t.type==="joined"){let n=t.data?.id||t.senderId;n&&(this.seenIds.add(n),this.seenIds.size>=2&&this.resolveBothJoined(),this.bothJoinedResolved&&n!==this.userId&&this.opponentLeft&&(this.opponentLeft=!1,this.opponentRejoinedListeners.forEach(a=>a())));return}if(!this.isSpectator&&!this.bothJoinedResolved){this.preJoinQueue.push(t);return}this.messageListeners.forEach(i=>i(t))}notifyOpponentLeft(){this.opponentLeft||(this.opponentLeft=!0,this.opponentLeftListeners.forEach(e=>e()))}};var $e=class{constructor(e){this.activeLobbies=[];this.lobbyInstances=new Map;this.activeTables=[];this.joiningTables=new Map;this.lobbyConfigs=new Map;this.isStopping=!1;this.isStarted=!1;this.listenersAttached=!1;this.resumePromise=null;this.stopPromise=null;this.joiningLobbies=new Map;this.handlePageHide=()=>{this.stop({isTeardown:!0})};this.handlePageShow=async e=>{e.persisted&&await this.resumeSession()};this.handleVisibilityChange=async()=>{document.visibilityState==="hidden"?this.activeLobbies.forEach(e=>e.pauseHeartbeat()):document.visibilityState==="visible"&&await this.resumeSession()};this.nchan=e.nchan??new fe(e.baseUrl)}setVersion(e){this.nchan.setVersion(e)}get recordedMessages(){return this.nchan.recordedMessages}start(){typeof window<"u"&&!this.listenersAttached&&(window.addEventListener("pagehide",this.handlePageHide),window.addEventListener("pageshow",this.handlePageShow),document.addEventListener("visibilitychange",this.handleVisibilityChange),this.listenersAttached=!0),!this.isStarted&&(this.isStarted=!0)}async stop(e={}){return this.stopPromise?this.stopPromise:(this.stopPromise=(async()=>{this.isStopping=!0;try{this.isStarted=!1;let t=[...this.activeLobbies];this.activeLobbies=[],await Promise.all(t.map(i=>i.leave(e)));let s=[...this.activeTables];this.activeTables=[],await Promise.all(s.map(i=>i.leave(e)))}finally{this.isStopping=!1,this.stopPromise=null}})(),this.stopPromise)}async joinLobby(e,t){if(this.start(),this.joiningLobbies.has(e.userId))return this.joiningLobbies.get(e.userId);let s=(async()=>{try{let i=this.lobbyInstances.get(e.userId),n,a={...t,onReconnect:()=>{this.resumeSession().catch(c=>console.error("Session resume failed after lobby reconnect:",c)),t?.onReconnect?.()},onLeave:()=>{let c=n??i;if(c){let h=this.activeLobbies.indexOf(c);h!==-1&&this.activeLobbies.splice(h,1)}}};if(this.lobbyConfigs.set(e.userId,{user:e,options:t}),i)return i.currentUser=e,await i.join(),i.resumeHeartbeat(),this.activeLobbies.includes(i)||this.activeLobbies.push(i),i;let l=new xe(this.nchan,e,a);return n=l,await l.join(),this.lobbyInstances.set(e.userId,l),this.activeLobbies.push(l),l}finally{this.joiningLobbies.delete(e.userId)}})();return this.joiningLobbies.set(e.userId,s),s}async leaveLobby(e){let t=this.activeLobbies.findIndex(s=>s.currentUser.userId===e);t!==-1&&(await this.activeLobbies[t].leave(),this.activeLobbies.splice(t,1)),this.lobbyInstances.delete(e),this.lobbyConfigs.delete(e)}async joinTable(e,t,s){let i=s?.isSpectator??!1,n=this.tableKey(e,t,i),a=this.joiningTables.get(n);if(a)return a.promise;this.assertNoTableConflict(e,t,i);let l=this.activeTables.find(m=>m.tableId===e);if(l)return Promise.resolve(l);let c=i?void 0:this.activeLobbies.find(m=>m.currentUser.userId===t),h=new we(this.nchan,e,t,c,i,s?.onMessage,s?.onBothJoined,()=>this.removeActiveTable(h));this.activeTables.push(h);let p=h.join().catch(m=>{console.error(`Table ${e} join handshake failed:`,m)});c&&p.then(async()=>{if(!h.closed)try{await c.updatePresence({tableId:e})}catch(m){console.error("Failed to update presence after table join:",m)}});let d=Promise.resolve(h).finally(()=>{this.joiningTables.delete(n)});return this.joiningTables.set(n,{tableId:e,userId:t,isSpectator:i,promise:d}),d}tableKey(e,t,s){return`${e}|${t}|${s?"s":"p"}`}assertNoTableConflict(e,t,s){for(let i of this.joiningTables.values())if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already being joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`);for(let i of this.activeTables)if(i.tableId===e&&(i.userId!==t||i.isSpectator!==s))throw new Error(`Table ${e} is already joined as ${i.isSpectator?"spectator":"player"} ${i.userId}; cannot also join as ${s?"spectator":"player"} ${t}`)}removeActiveTable(e){let t=this.activeTables.indexOf(e);t!==-1&&this.activeTables.splice(t,1)}async spectateTable(e,t,s){return this.joinTable(e,t,{...s,isSpectator:!0})}async resumeSession(){return this.resumePromise?this.resumePromise:(this.resumePromise=(async()=>{try{if(this.stopPromise&&await this.stopPromise,!this.isStarted&&this.lobbyConfigs.size>0){this.isStarted=!0;let e=Array.from(this.lobbyConfigs.values());await Promise.all(e.map(t=>this.joinLobby(t.user,t.options)));return}await Promise.all(this.activeLobbies.map(async e=>{e.resumeHeartbeat();try{await e.syncPresence()}catch(t){console.error("Failed to refresh presence during session resume:",t)}}))}finally{this.resumePromise=null}})(),this.resumePromise)}};function Qe(r){if(["localhost","127.0.0.1"].includes(globalThis.location?.hostname)){console.log("Skipping usage fetch for localhost.");return}let e=`https://scoreboard-tailuge.vercel.app/api/usage/${r}`;fetch(e,{method:"PUT",mode:"cors"}).then(t=>{t.ok||console.error("HTTP error:",t.status,t.statusText)}).catch(t=>console.error("Fetch error for",e,t))}var Ie=class{#e=[];#s;#t;constructor(e=3e4,t=()=>Date.now()){this.#s=e,this.#t=t}update(e){let t=new Set(e.map(s=>s.userId));for(let s of this.#e)s.status==="online"&&!t.has(s.userId)&&(s.status="offline",s.offlineSince=this.#t());for(let s of e){let i=this.#e.find(n=>n.status==="online"&&n.userId===s.userId);i?i.user=s:this.#r(s)}return this.getSlots()}getSlots(){return[...this.#e]}reset(){this.#e=[]}#r(e){let t=this.#t(),s=this.#e.find(a=>a.userId===e.userId);if(s){s.status="online",s.offlineSince=null,s.user=e;return}let i=null,n=0;for(let a of this.#e)if(a.status==="offline"){let l=t-a.offlineSince;l>this.#s&&l>n&&(i=a,n=l)}if(i){i.userId=e.userId,i.status="online",i.offlineSince=null,i.user=e;return}this.#e.push({userId:e.userId,status:"online",offlineSince:null,user:e})}};var is={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},rs=r=>(...e)=>({_$litDirective$:r,values:e}),Se=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,s){this._$Ct=e,this._$AM=t,this._$Ci=s}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var{I:Ns}=Rt,ns=r=>r;var as=()=>document.createComment(""),J=(r,e,t)=>{let s=r._$AA.parentNode,i=e===void 0?r._$AB:e._$AA;if(t===void 0){let n=s.insertBefore(as(),i),a=s.insertBefore(as(),i);t=new Ns(n,a,r,r.options)}else{let n=t._$AB.nextSibling,a=t._$AM,l=a!==r;if(l){let c;t._$AQ?.(r),t._$AM=r,t._$AP!==void 0&&(c=r._$AU)!==a._$AU&&t._$AP(c)}if(n!==i||l){let c=t._$AA;for(;c!==n;){let h=ns(c).nextSibling;ns(s).insertBefore(c,i),c=h}}}return t},P=(r,e,t=r)=>(r._$AI(e,t),r),Ls={},os=(r,e=Ls)=>r._$AH=e,ls=r=>r._$AH,Ee=r=>{r._$AR(),r._$AA.remove()};var cs=(r,e,t)=>{let s=new Map;for(let i=e;i<=t;i++)s.set(r[i],i);return s},ds=rs(class extends Se{constructor(r){if(super(r),r.type!==is.CHILD)throw Error("repeat() can only be used in text expressions")}dt(r,e,t){let s;t===void 0?t=e:e!==void 0&&(s=e);let i=[],n=[],a=0;for(let l of r)i[a]=s?s(l,a):a,n[a]=t(l,a),a++;return{values:n,keys:i}}render(r,e,t){return this.dt(r,e,t).values}update(r,[e,t,s]){let i=ls(r),{values:n,keys:a}=this.dt(e,t,s);if(!Array.isArray(i))return this.ut=a,n;let l=this.ut??=[],c=[],h,p,d=0,m=i.length-1,g=0,y=n.length-1;for(;d<=m&&g<=y;)if(i[d]===null)d++;else if(i[m]===null)m--;else if(l[d]===a[g])c[g]=P(i[d],n[g]),d++,g++;else if(l[m]===a[y])c[y]=P(i[m],n[y]),m--,y--;else if(l[d]===a[y])c[y]=P(i[d],n[y]),J(r,c[y+1],i[d]),d++,y--;else if(l[m]===a[g])c[g]=P(i[m],n[g]),J(r,i[d],i[m]),m--,g++;else if(h===void 0&&(h=cs(a,g,y),p=cs(l,d,m)),h.has(l[d]))if(h.has(l[m])){let x=p.get(a[g]),H=x!==void 0?i[x]:null;if(H===null){let $=J(r,i[d]);P($,n[g]),c[g]=$}else c[g]=P(H,n[g]),J(r,i[d],H),i[x]=null;g++}else Ee(i[m]),m--;else Ee(i[d]),d++;for(;g<=y;){let x=J(r,c[y+1]);P(x,n[g]),c[g++]=x}for(;d<=m;){let x=i[d++];x!==null&&Ee(x)}return this.ut=a,os(r,c),T}});var q=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Xe=class extends f{static properties={slots:{type:Array},users:{type:Array},myId:{type:String},myName:{type:String},tableId:{type:String},isChallengePending:{type:Boolean},challenges:{type:Object},pendingChats:{type:Object}};#e=!1;static styles=[v,jt,b`
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
    `];_renderStatus(e){return o`<span aria-label="${e.title}" role="img">${e.emoji}</span>`}async autoExpandIfSupported(){if(this.#e)return;if((this.slots||[]).filter(t=>t.status==="online").length>4){await this.updateComplete;let t=this.renderRoot.querySelector(".expand-toggle");t&&getComputedStyle(t).visibility!=="hidden"&&(this.#e=!0,q(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate())}}updated(){if(!this.#e)return;let e=this.renderRoot.querySelector("ul");if(!e)return;let t=e.scrollHeight;t>0&&e.style.setProperty("--ul-expanded-height",t+"px")}#s(){this.#e=!this.#e,q(this,"user-list-toggle",{expanded:this.#e}),this.requestUpdate()}render(){let e=this.slots||[];if(e.filter(i=>i.status==="online").length===0)return o`<div class="empty">No other players online yet. Invite a friend!</div>`;let s=new Set(ve(this.users||[]).filter(i=>i.players.length>1).map(i=>i.tableId));return o`
            <ul class="${this.#e?"expanded":""}" aria-label="Online players">
                ${ds(e,(i,n)=>n,(i,n)=>this._rowSlot(i,n,s))}
            </ul>
            <div class="expand-toggle" @click=${this.#s}>
                ${this.#e?"\u25B2":"\u25BC"}
            </div>`}_rowSlot(e,t,s){if(e.status==="offline"){let i=e.user,n=Be(i.meta?.origin??"",i.ruleType??"",ye(i),i.options,i.arenaId);return o`
                <li class="is-offline" aria-label="${i.userName}">
                    <div class="user-info">
                        <span class="user-name">
                            <span title="${w(i.meta?.country).title}">${w(i.meta?.country).emoji}</span>
                            <span class="name-wrap">${i.userName}<span class="loc-tip">${i.meta?.city??""}</span></span>
                            ${this._renderStatus(n)}
                        </span>
                    </div>
                </li>`}return this._row(e.user,s)}_row(e,t){let s=this.pendingChats?.get(e.userId)>0,n=!(this.challenges?.[e.userId]?.challengerId===e.userId)&&(e.isBot||es(e,this.myId)),a=!e.isBot&&ye(e)==="playing"&&ts(e,this.tableId)&&t.has(e.tableId),l=Be(e.meta?.origin??"",e.ruleType??"",ye(e),e.options,e.arenaId),c=s?o`<button class="btn-chat" aria-label="Unread message from ${e.userName}" @click=${()=>q(this,"open-chat",e.userId)}>💬</button>`:a?o`<button class="btn-spectate" aria-label="Spectate ${e.userName}'s game" @click=${()=>q(this,"spectate",e)}>Spectate</button>`:n?o`<button class="btn-challenge" aria-label="Challenge ${e.userName}" ?disabled=${this.isChallengePending} @click=${()=>I?window.location.href="https://billiards.tailuge.workers.dev/lobby":q(this,"challenge",e.userId)}>Challenge</button>`:o``;return o`
            <li aria-label="${e.userName}">
                <div class="user-info">
                    <span class="user-name" @click=${()=>q(this,"open-chat",e.userId)} style="cursor: pointer"><span title="${w(e.meta?.country).title}">${w(e.meta?.country).emoji}</span> <span class="name-wrap">${e.userName}<span class="loc-tip">${e.meta?.city??""}</span></span> ${this._renderStatus(l)}</span>
                </div>
                <div class="actions">${c}</div>
            </li>`}};customElements.define("user-list",Xe);var ke=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Ze=class extends f{static properties={lobby:{type:Object},targetId:{type:String},targetName:{type:String},_messages:{state:!0},_unread:{state:!0}};static styles=[v,B,b`
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
    `];constructor(){super(),this._messages=new Map,this._unread=new Map,this._lobbyBound=!1}willUpdate(e){e.has("lobby")&&this.lobby&&!this._lobbyBound&&(this._lobbyBound=!0,this.lobby.onChat(t=>{let s=t.senderId,i=[...this._messages.get(s)??[],t];if(this._messages=new Map(this._messages).set(s,i),s!==this.targetId){let n=(this._unread.get(s)??0)+1;this._unread=new Map(this._unread).set(s,n),ke(this,"unread-changed",{userId:s,count:n})}this.requestUpdate()})),e.has("targetId")&&this.targetId&&this._unread.has(this.targetId)&&(this._unread=new Map(this._unread).set(this.targetId,0),ke(this,"unread-changed",{userId:this.targetId,count:0}))}_send(e){e.preventDefault();let t=this.shadowRoot.querySelector("input"),s=t.value.trim();if(!s||!this.lobby||!this.targetId)return;this.lobby.sendChat(this.targetId,s);let n={messageType:"chat",senderId:this.lobby.currentUser.userId,recipientId:this.targetId,text:s},a=[...this._messages.get(this.targetId)??[],n];this._messages=new Map(this._messages).set(this.targetId,a),t.value="",this.requestUpdate()}updated(e){if(e.has("targetId")){let t=this.shadowRoot.querySelector(".thread");t&&(t.scrollTop=t.scrollHeight);let s=this.shadowRoot.querySelector("input");s&&s.focus()}else if(e.has("_messages")){let t=e.get("_messages");if(this._messages.get(this.targetId)!==t?.get(this.targetId)){let s=this.shadowRoot.querySelector(".thread");s&&(s.scrollTop=s.scrollHeight)}}}render(){if(!this.targetId)return o``;let e=this.lobby?.currentUser?.userId,t=this._messages.get(this.targetId)??[];return o`
            <div class="backdrop" @click=${s=>s.target===s.currentTarget&&ke(this,"close")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Chat with ${this.targetName}">
                    <h3>💬 ${this.targetName}</h3>
                    <div class="thread">
                        ${t.length===0?o`<div class="empty">No messages yet</div>`:t.map(s=>o`<div class="msg ${s.senderId===e?"mine":"theirs"}">${s.text}</div>`)}
                    </div>
                    <form class="compose" @submit=${this._send}>
                        <input type="text" name="message" placeholder="Message…" autocomplete="off" aria-label="Message text">
                        <button type="submit" aria-label="Send message">➤</button>
                    </form>
                    <button class="cancel" @click=${()=>ke(this,"close")}>Close</button>
                </div>
            </div>`}};customElements.define("message-modal",Ze);var Ce=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),Ms={raceTo:"Race to",reds:"Reds",shotClock:"Shot clock",collaboration:"Collaboration",practice:"Practice"},hs=(r,e)=>r?Object.entries(r).filter(([,t])=>!(typeof t=="boolean"&&t===!1)).map(([t,s])=>{if(t.startsWith("handicap_")){let n=t.slice(9),a=e&&n===e?"Your handicap":"Handicap";return typeof s=="boolean"?a:`${a}: ${s}`}let i=Ms[t]??t;return typeof s=="boolean"?i:`${i}: ${s}`}):[],et=class extends f{static properties={challenge:{type:Object},sent:{type:Object},myId:{type:String}};static styles=[v,Ot,zt];render(){return this.challenge?this._incoming(this.challenge):this.sent?this._sent(this.sent):o``}_incoming(e){let t={...e.options};if(Object.keys(t).some(i=>i.startsWith("handicap_"))){let i=localStorage.getItem(`handicap_${e.ruleType}`)||"15";t["handicap_"+this.myId]=i}let s=hs(t,this.myId);return o`
            <div class="banner">
                <div class="details">${A(e.ruleType)} ${e.ruleType}</div>
                <strong>Challenge from ${e.challengerName}</strong>
                <div class="details">${s.map(i=>o`<span>${i}</span>`)}</div>
                <div class="row">
                    <button class="btn-accept" aria-label="Accept challenge" @click=${()=>Ce(this,"accept")}>Accept</button>
                    <button class="btn-decline" aria-label="Decline challenge" @click=${()=>Ce(this,"decline")}>Decline</button>
                </div>
            </div>`}_sent(e){let t=e.status==="pending",s=hs(e.options,this.myId);return o`
            <div class="banner ${e.status}">
                <div class="details">${A(e.ruleType)} ${e.ruleType}</div>
                ${s.length>0?o`<div class="details">${s.map(i=>o`<span>${i}</span>`)}</div>`:""}
                <strong>${t?`Waiting for ${e.recipientName} to accept.`:`${e.recipientName} declined.`}</strong>
                <div class="row">
                    ${t?o`<button class="btn-leave" @click=${()=>Ce(this,"cancel")}>Cancel</button>`:o`<button aria-label="Dismiss" @click=${()=>Ce(this,"dismiss")}>✕</button>`}
                </div>
            </div>`}};customElements.define("challenge-banner",et);var Te=(r,e,t)=>r.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0})),tt=class r extends f{static properties={userId:{type:String},userName:{type:String},_expanded:{state:!0},_handicap:{state:!0}};static styles=[v,B,he];static SECTIONS=[{key:"eightball",label:"Eight Ball",img:"assets/eightball.png",rules:[{id:"eightball",label:"Eight Ball",img:"assets/eightball.png"},{id:"eightball",label:"Eight Ball (Free Aim)",img:"assets/eightball.png",options:{freeaim:"true"}},{id:"eightball",label:"Eight Ball Mini (Free Aim)",img:"assets/baby.png",options:{freeaim:"true",tableSize:"6"}}]},{key:"nineball",label:"Nine Ball",img:"assets/nineball.png",rules:[{id:"nineball",label:"Nine Ball",img:"assets/nineball.png"},{id:"nineball",label:"Nine Ball (Free Aim)",img:"assets/nineball.png",options:{freeaim:"true"}},{id:"nineball",label:"Nine Ball Mini (Free Aim)",img:"assets/baby.png",options:{freeaim:"true",tableSize:"6"}}]},{key:"snooker",label:"Snooker",img:"assets/snooker.png",rules:[{id:"snooker",label:"3 reds",img:"assets/baby.png",options:{reds:"3",tableSize:"6"}},{id:"snooker",label:"6 reds",img:"assets/snooker.png",options:{reds:"6",tableSize:"12"}},{id:"snooker",label:"10 reds",img:"assets/snooker.png",options:{reds:"10",tableSize:"12"}},{id:"snooker",label:"15 reds",img:"assets/snooker.png",options:{reds:"15",tableSize:"12"}},{id:"snooker",label:"6 reds (Free Aim)",img:"assets/snooker.png",options:{freeaim:"true",reds:"6",tableSize:"12"}}]},{key:"threecushion",label:"Three Cushion",img:"assets/threecushion.png",rules:[{id:"threecushion",label:"Small Table (15)",img:"assets/baby.png",options:{raceTo:"15",collaboration:!0,shotClock:"60",tableSize:"5"}},{id:"threecushion",label:"Race to 7",img:"assets/threecushion.png",options:{raceTo:"7"}},{id:"threecushion",label:"Race to 25",img:"assets/threecushion.png",options:{raceTo:"25"}},{id:"threecushion",label:"Collaboration (15)",img:"assets/threecushion.png",options:{raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Race to 15 (Free Aim)",img:"assets/threecushion.png",options:{freeaim:"true",raceTo:"15",collaboration:!0,shotClock:"60"}},{id:"threecushion",label:"Traditional (10)",img:"assets/threecushion.png",options:{raceTo:"10",practice:!1,shotClock:"45"}},{id:"threecushion",label:"Handicap",img:"assets/threecushion.png",options:{handicap:!0}}]},{key:"sagu",label:"Sagu",img:"assets/sagu.png",rules:[{id:"sagu",label:"Small Table (5)",img:"assets/baby.png",options:{raceTo:"5",tableSize:"5"}},{id:"sagu",label:"Race to 11",img:"assets/sagu.png",options:{raceTo:"11"}},{id:"sagu",label:"Free Aim (5)",img:"assets/sagu.png",options:{freeaim:"true",raceTo:"5"}},{id:"sagu",label:"Handicap",img:"assets/sagu.png",options:{handicap:!0}}]}];constructor(){super(),this._expanded=null,this._handicap=15}_loadHandicap(e){let t=localStorage.getItem(`handicap_${e}`);if(t!==null){let s=parseInt(t,10);if(!isNaN(s)&&s>=5&&s<=30){this._handicap=s;return}}this._handicap=15}_onHandicapChange(e){let t=parseInt(e.target.value,10);this._handicap=t,this._expanded&&localStorage.setItem(`handicap_${this._expanded}`,String(t))}_toggle(e){let t=this._expanded===e;this._expanded=t?null:e,t||r.SECTIONS.find(i=>i.key===e)?.rules.some(i=>i.options?.handicap===!0)&&this._loadHandicap(e)}render(){return this.userId?o`
            <div class="backdrop" @click=${e=>e.target===e.currentTarget&&Te(this,"cancel")}>
                <div class="modal" role="dialog" aria-modal="true" aria-label="Select game type">
                    <h3>Challenge ${this.userName}</h3>
                    <div class="sections">
                        ${r.SECTIONS.map(e=>o`
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
                                            <button class="rule btn-challenge" @click=${()=>{let s=t.options?{...t.options}:{};s.handicap===!0&&(s.handicap=String(this._handicap)),Te(this,"confirm",{ruleType:t.id,options:s})}}>
                                                <span class="icon-wrap">
                                                    <img src=${t.img} alt=${t.label} />
                                                    ${t.options&&t.options.handicap!==!0?o`<span class="badge">${be(t.options)}</span>`:""}
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
                    <button class="msg-btn" type="button" aria-label="Send message" @click=${()=>Te(this,"message")}>💬</button>
                    <button class="cancel" @click=${()=>Te(this,"cancel")}>Cancel</button>
                </div>
            </div>`:o``}};customElements.define("challenge-modal",tt);var ps=[{userId:"bot-clawbreak",userName:"ClawBreak",isBot:!0,meta:{country:"BOT"}},{userId:"bot-thefarjaw",userName:"TheFarJaw",isBot:!0,meta:{country:"BOT"}}],st=class extends f{static styles=[v,Ft];#e={...Yt,settled:!1};#s=null;#t;#r;#d;#a=null;#o=null;#u=new Map;#m=new Ie;#i=null;#h=!1;constructor(){super(),this.#t=u.clientId,this.#r=u.userName;let e=new URLSearchParams(location.search),t=e.get("opponent.userId"),s=e.get("tournamentId")||e.get("arenaId")||e.get("arena");if(t&&!s){let n={},a=e.get("tableSize")||e.get("tablesize");a&&(n.tableSize=a);let l=e.get("raceTo")||e.get("raceto");l&&(n.raceTo=l);let c=e.get("shotClock")||e.get("shotclock");c&&(n.shotClock=c);let h=e.get("reds");h&&(n.reds=h);let p=e.get("freeaim");p&&(n.freeaim=p),this.#i={opponentId:t,opponentName:e.get("opponent.userName")||t,ruleType:e.get("ruletype")||"nineball",nextTurnId:e.get("nextTurnId"),options:Object.keys(n).length>0?n:void 0};let d=new URL(location.href);d.searchParams.delete("opponent.userId"),d.searchParams.delete("opponent.userName");let m=[];for(let g of d.searchParams.keys())(g.startsWith("opponent.")||g.startsWith("custom."))&&m.push(g);for(let g of m)d.searchParams.delete(g);d.searchParams.delete("ruletype"),d.searchParams.delete("nextTurnId"),d.searchParams.delete("tableSize"),d.searchParams.delete("tablesize"),d.searchParams.delete("raceTo"),d.searchParams.delete("raceto"),d.searchParams.delete("shotClock"),d.searchParams.delete("shotclock"),d.searchParams.delete("reds"),d.searchParams.delete("freeaim"),history.replaceState(null,"",d)}let i=`https://${O}`;(location.hostname==="localhost"||location.hostname==="127.0.0.1")&&(i=`${location.protocol==="https:"?"https:":"http:"}//${location.host}`),this.#d=new $e({baseUrl:i}),this.#d.setVersion(me(ue))}connectedCallback(){super.connectedCallback(),this._onUserChanged=e=>{this.#t=e.detail.userId,this.#r=e.detail.userName,this.#s?this.#s.updatePresence({userId:this.#t,userName:this.#r}).catch(t=>console.error("Failed to update presence:",t)):this._connect().catch(t=>console.error("Lobby connect failed:",t))},document.addEventListener("user-name-changed",this._onUserChanged),this._connect().catch(e=>console.error("Lobby connect failed:",e))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("user-name-changed",this._onUserChanged),this.#s?.leave()}dispatch(e){this.#e=Vt(this.#e,{...e,myId:this.#t}),e.type==="CHALLENGE_MSG"&&this.#$(e.payload),this.requestUpdate()}#w(){if(!this.#i||!this.#e.connected)return;let e=this.#i.opponentId;!this.#n&&this.#e.users.some(t=>t.userId===e)&&this.#x(e,this.#i.ruleType,this.#i.options,this.#i.nextTurnId)}#$(e){if(this.#i&&(e.challengerId===this.#i.opponentId||e.challengeeId===this.#i.opponentId)&&(e.type==="decline"||e.type==="cancel")&&(this.#i=null),e.type==="offer"&&e.challengeeId===this.#t&&this.#i&&this.#i.opponentId===e.challengerId){let t=this.#i.nextTurnId;this.#i=null;let s=this.#n;s&&s.challengeeId===e.challengerId&&s.status==="pending"?this.#t<e.challengerId&&this.#f(e.challengerId,t).catch(i=>console.error("Simultaneous auto-accept failed:",i)):this.#f(e.challengerId,t).catch(i=>console.error("Auto-join accept failed:",i))}}get state(){return this.#e}get#y(){return this.#e.connected}get#p(){return this.#e.users}get#g(){return this.#e.currentMatch?.tableId}get#I(){return this.#e.currentMatch?.ruleType||"standard"}get#S(){return!!this.#e.currentMatch?.isFirst}get#E(){return this.#e.currentMatch?.options}get#v(){return this.#e.currentMatch?.opponentId}get#k(){return this.#e.currentMatch?.opponentName}get#C(){return this.#e.currentMatch?.opponentCustom}get#b(){return Object.values(this.#e.challenges).find(e=>e.challengeeId===this.#t&&e.status==="pending")}get#n(){return Object.values(this.#e.challenges).find(e=>e.challengerId===this.#t)}get#l(){return[...this.#p,...ps]}get#c(){let e=u.getCustom();if(e.emoji===void 0||e.emoji===null){let t=this.#p.find(s=>s.userId===this.#t)?.meta?.country;if(t)return{...e,emoji:w(t).emoji}}return e}get lobby(){return this.#s}get#_(){return this.#m.getSlots()}async _connect(){this.#m.reset(),this.#s=await this.#d.joinLobby({messageType:"presence",type:"join",userId:this.#t,userName:this.#r}),this.dispatchEvent?.(new CustomEvent("lobby-ready",{detail:this.#s,bubbles:!0,composed:!0})),this.dispatch({type:"CONNECTED",payload:!0}),this.#h=!1,this.dispatch({type:"SETTLED",payload:!1}),this.#s.onUsersChange(e=>{let t=[...e,...ps].filter(s=>s.userId!==this.#t);this.#m.update(t),this.dispatch({type:"USERS_UPDATE",payload:e})}),this.#s.onChallenge(e=>{e.options?.tournamentId||(this.dispatch({type:"CHALLENGE_MSG",payload:e}),this.#s.settled&&e.type==="offer"&&e.challengeeId===this.#t&&document.hidden&&typeof Notification<"u"&&Notification.permission==="granted"&&new Notification("Challenge received!",{body:`${e.challengerName} challenged you to ${e.ruleType}`,icon:"assets/threecushion.png"}))}),this.#s.onSettled(async()=>{this.#h=!0,this.dispatch({type:"SETTLED",payload:!0}),this.#w(),await this.updateComplete,this.renderRoot.querySelector("user-list")?.autoExpandIfSupported()})}async#x(e,t,s,i){this.#i&&this.#i.opponentId===e||(this.#i=null);let a=this.#l.find(c=>c.userId===e);if(a?.isBot){let c="bot-"+Math.random().toString(36).slice(2,8),h=!0;window.location.href=z({tableId:c,userId:this.#t,userName:this.#r,ruleType:t,isFirst:h,options:s,bot:a.userName,lod:u.lod,flip:u.flip,custom:this.#c});return}let l=this.#s?await this.#s.challenge(e,t,s,i,this.#c):"test-"+Math.random().toString(36).slice(2,7);Qe("createTable"),this.dispatch({type:"CHALLENGE_SENT",payload:{challengerId:this.#t,challengeeId:e,recipientName:a?.userName||e,ruleType:t,options:s,tableId:l,nextTurnId:i}})}async#T(){this.#i=null;let e=this.#n;e?.status==="pending"&&(this.#s&&await this.#s.cancelChallenge(e.challengeeId,e.ruleType),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId}))}async#f(e,t){let s=e?this.#e.challenges[e]:this.#b;if(!s)return;let i={...s.options};if(Object.keys(i).some(n=>n.startsWith("handicap_"))){let n=localStorage.getItem(`handicap_${s.ruleType}`)||"15";i["handicap_"+this.#t]=n}this.#s&&await this.#s.acceptChallenge(s.challengerId,s.ruleType,s.tableId,i,s.challengerName,t,this.#c),Qe("joinTable"),this.dispatch({type:"CHALLENGE_MSG",payload:{type:"accept",challengerId:s.challengerId,challengerName:s.challengerName,challengeeId:this.#t,ruleType:s.ruleType,tableId:s.tableId,options:i,nextTurnId:t,custom:this.#c}}),this.#i=null}async#A(){this.#i=null;let e=this.#b;this.#s&&await this.#s.declineChallenge(e.challengerId,e.ruleType,e.challengerName),this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengerId})}#P(){this.#i=null;let e=this.#n;e&&this.dispatch({type:"CHALLENGE_DISMISS",payload:e.challengeeId})}#N(){let e=[...this.#l].filter(t=>t.meta?.country!=="BOT").map(t=>{let{meta:s={},...i}=t,{ts:n,...a}=s;return{...i,meta:a}});console.log("=== USERS ==="),console.log(JSON.stringify(e,null,2)),console.log("=== MY INFO ==="),console.log(JSON.stringify({myId:this.#t,myName:this.#r})),console.log("=== NCHAN RECORDED MESSAGES ==="),console.log(this.#d.recordedMessages),console.log("=== SLOTS ==="),console.table(this.#_.map(t=>({userId:t.userId,status:t.status,offlineSince:t.offlineSince,online:t.status==="online"?"\u2713":"\u2717"})))}_openActiveTables=()=>{let t=ve(this.#p||[]).map(s=>s.tableId).map(s=>"active="+encodeURIComponent(s)).join("&");window.open(qt+(t?"?"+t:""),"_blank","noopener")};render(){if(this.#g){let t=z({tableId:this.#g,userId:this.#t,userName:this.#r,ruleType:this.#I,isFirst:this.#S,options:this.#E,lod:u.lod,flip:u.flip,custom:this.#c,opponent:this.#v?{userId:this.#v,userName:this.#k,custom:this.#C}:void 0});return this.#i=null,this.#e={...this.#e,currentMatch:null},window.location.href=t,o``}let e=this.#a;return o`
            <div class="panel-header">
                <span class="dot ${this.#y?this.#h?"green":"blue":""}" role="status" aria-label="${this.#y?this.#h?"Settled":"Connecting":"Disconnected"}" @click=${this._openActiveTables} style="cursor:pointer"></span>
                <span class="panel-title" @click=${()=>this.#N()}>Play Online (${this.#l.filter(t=>t.userId!==this.#t).length})</span>
            </div>
            <challenge-banner
                .challenge=${this.#b}
                .sent=${this.#n}
                myId=${this.#t}
                @accept=${()=>this.#f()}
                @decline=${()=>this.#A()}
                @cancel=${()=>this.#T()}
                @dismiss=${()=>this.#P()}>
            </challenge-banner>
            <user-list
                .slots=${this.#_}
                .users=${this.#p}
                myId=${this.#t}
                myName=${this.#r}
                tableId=${this.#g||""}
                .isChallengePending=${this.#n?.status==="pending"}
                .challenges=${this.#e.challenges}
                .pendingChats=${this.#u}
                @challenge=${t=>{let s=this.#l.find(i=>i.userId===t.detail);this.#a={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}
                @spectate=${t=>{let s=t.detail;window.location.href=Qt({tableId:s.tableId,userId:this.#t,userName:this.#r,ruleType:s.ruleType||"nineball",options:s.options})}}
                @open-chat=${t=>{let s=this.#l.find(i=>i.userId===t.detail);this.#o={userId:t.detail,userName:s?.userName??t.detail},this.requestUpdate()}}>
            </user-list>
            <challenge-modal
                .userId=${e?.userId??null}
                .userName=${e?.userName??""}
                @confirm=${t=>{let s={...t.detail.options};s.handicap&&(s["handicap_"+this.#t]=s.handicap,delete s.handicap),this.#x(e.userId,t.detail.ruleType,s),this.#a=null}}
                @message=${()=>{this.#o={userId:e.userId,userName:e.userName},this.#a=null,this.requestUpdate()}}
                @cancel=${()=>{this.#a=null,this.requestUpdate()}}>
            </challenge-modal>
            <message-modal
                .lobby=${this.#s}
                .targetId=${this.#o?.userId??null}
                .targetName=${this.#o?.userName??""}
                @close=${()=>{this.#o=null,this.requestUpdate()}}
                @unread-changed=${t=>{this.#u=new Map(this.#u).set(t.detail.userId,t.detail.count),this.requestUpdate()}}>
            </message-modal>`}};customElements.define("online-panel",st);var Rs=[[4352,4447],[11904,42191],[44032,55203],[63744,64255],[65040,65135],[65280,65376],[65504,65510],[127744,129791],[131072,195103]],us=r=>{let e=0;for(let t of r){let s=t.codePointAt(0);e+=Rs.some(([i,n])=>s>=i&&s<=n)?2:1}return Math.max(e,1)},it=class extends S{static properties={_dotColor:{state:!0}};static styles=Ht;constructor(){super(),this._clientId=u.clientId,this._name=u.userName,this._dotColor=u.isForcedId?"#9fca10ff":"#4caf50"}_commit(e){let t=e.trim().slice(0,12)||"Anonymous";this._name=t,u.set(this._clientId,t),this.dispatchEvent(new CustomEvent("user-name-changed",{bubbles:!0,composed:!0,detail:{userId:this._clientId,userName:t}}))}render(){return I?o``:o`
            <div class="badge" style="--dot-color:${this._dotColor}">
                <span class="dot"></span>
                <input size="1" maxlength="12" .value=${this._name}
                    name="name" autocomplete="nickname"
                    style="width: ${us(this._name)}ch"
                    aria-label="Display name"
                    @input=${e=>e.target.style.width=us(e.target.value)+"ch"}
                    @change=${e=>this._commit(e.target.value)}
                    @keydown=${e=>e.key==="Enter"&&e.target.blur()}>
            </div>`}};customElements.define("user-badge",it);var Ae=null,nt=()=>(Ae||(Ae=fetch(`${E}/api/arena/winners`).then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status)))).then(r=>Array.isArray(r?.winners)?r.winners.filter(e=>e&&typeof e=="object"&&typeof e.userName=="string"):[]).catch(()=>(Ae=null,null))),Ae),rt=class extends S{static styles=b`
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
    `;constructor(){super(),this._trophies=[],this._trophyCheckedFor=null,this._winners=null,this._observer=null,this._idleTimer=null,this._started=!1}connectedCallback(){super.connectedCallback(),I||this._startLazy()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,this._idleTimer&&(clearTimeout(this._idleTimer),this._idleTimer=null),super.disconnectedCallback()}_startLazy(){this._started||(this._started=!0,typeof IntersectionObserver<"u"?(this._observer=new IntersectionObserver(e=>{e.some(t=>t.isIntersecting)&&(this._observer.disconnect(),this._observer=null,this._load())}),this._observer.observe(this)):this._whenIdle(()=>this._load()))}_whenIdle(e){typeof requestIdleCallback=="function"?requestIdleCallback(()=>e()):this._idleTimer=setTimeout(e,200)}async _load(){this._winners=await nt(),this._recheck()}_recheck(){let e=(u.userName||"").trim();if(!e||!this._winners){this._trophies.length&&(this._trophies=[],this.requestUpdate());return}if(this._trophyCheckedFor===e)return;this._trophyCheckedFor=e;let t=this._winners.filter(s=>typeof s.userName=="string"&&s.userName.trim()===e);JSON.stringify(t)!==JSON.stringify(this._trophies)&&(this._trophies=t,this.requestUpdate())}willUpdate(){this._recheck()}render(){return I||!this._trophies.length?o``:o`
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
        `}};customElements.define("trophy-item",rt);var Us=`https://${O}/api/stats`,at=class extends f{static styles=b`
        :host { display: block; font-family: inherit; }
        .loading { color: var(--text-muted, #757575); font-size: 0.85rem; }
        .uptime { font-size: 0.78rem; color: var(--text-muted, #757575); margin: 0 0 0.2rem; line-height: 1.3; }
        ul { list-style: none; margin: 0; padding: 0; columns: 3; }
        li { display: flex; align-items: center; gap: 0.1rem; font-size: 0.88rem; padding: 0.02rem 0; line-height: 1.25; }
        .count { color: var(--text-muted, #757575); font-size: 0.78rem; }
    `;connectedCallback(){super.connectedCallback(),fetch(Us,{mode:"cors"}).then(e=>e.json()).then(e=>{this._data=e,this.requestUpdate()}).catch(()=>{this._err=!0,this.requestUpdate()})}_formatUptime(e){if(!e)return"";let t=[];return e.days&&t.push(`${e.days}d`),e.hours&&t.push(`${e.hours}h`),e.mins!==void 0&&t.push(`${e.mins}m`),t.join(" ")}_countryCounts(e){let t={};for(let s of Object.values(e)){let i=s.split("|")[0]||"XX";t[i]=(t[i]??0)+1}return Object.entries(t).sort((s,i)=>i[1]-s[1])}render(){if(this._err)return o`<span class="loading">Could not load stats.</span>`;if(!this._data)return o`<span class="loading">Loading…</span>`;let{uptime:e,ip_cache:t}=this._data,s=this._countryCounts(t??{});return o`
            ${e?o`<div class="uptime"><a href="https://billiards-network.onrender.com/dashboard.html" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">⏱</a> ${this._formatUptime(e)}</div>`:""}
            <ul>
                ${s.map(([i,n])=>o`
                    <li>${w(i).emoji} <span>${i}</span> <span class="count">${n}</span></li>
                `)}
            </ul>`}};customElements.define("stats-panel",at);var ot=class r extends S{static properties={_open:{state:!0},_notifEnabled:{state:!0},_showStats:{state:!0},_copied:{state:!0},_picker:{state:!0}};static LOD_LABELS=["pixelated","polygons","high poly","shaders","antialiased"];static styles=[v,B,b`
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
                            <label for="quality-range" style="font-size: 0.75rem;">Quality: <span class="lod-label">${r.LOD_LABELS[u.lod]||u.lod}</span></label>
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
                        <div class="row"><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener">Support</a></div>
                        <div class="row"><a href="https://scoreboard-tailuge.vercel.app/usage.html" target="_blank" rel="noopener">Usage</a></div>
                        <div class="row"><a href="#" @click=${e=>{e.preventDefault(),this._showStats=!this._showStats}}>Stats</a></div>

                        ${this._showStats?o`<div><strong style="font-size:0.82rem">Recent visitors</strong><stats-panel></stats-panel></div>`:""}

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
        `}};customElements.define("settings-modal",ot);var js=3e4,Os=5,ms=1800*1e3,zs=r=>(Math.floor(r/ms)+1)*ms,gs=[{name:"Nine Ball Mini Hourly Arena",ruleType:"nineball",options:{tableSize:"6",freeaim:"true"}},{name:"Eight Ball Mini Hourly Arena",ruleType:"eightball",options:{tableSize:"6",freeaim:"true"}},{name:"Snooker Mini Hourly Arena",ruleType:"snooker",options:{tableSize:"6",reds:"3",freeaim:"true"}}],Hs=b`
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
`,Ds=(r,e=!1,t=null,s=!0)=>{let i=`lobby.html?tournamentId=${encodeURIComponent(r.id)}`,n=a=>{t?(a.preventDefault(),a.stopPropagation(),t(r.id)):a.currentTarget instanceof HTMLButtonElement&&(a.preventDefault(),window.location.href=a.currentTarget.closest("a").href)};return o`<a class="arena-item ${e?"completed":""}" href=${i} @click=${n}>
        <div class="arena-item-main"><div class="arena-item-title"><span class="arena-item-name">${ge(r.ruleType,r.options)}${r.creatorName?o` · ${r.creatorName}`:""}</span><span class="arena-item-meta"> 👥\uFE0E ${r.players.length} · ⏰\uFE0E ${e?"ended":"ends"} ${new Date(r.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}</span></div></div>
        ${e&&r.winner?o`<span class="arena-winner" title="Winner: ${r.winner}">🏆 ${r.winner}</span>`:""}
        ${e||!s?"":o`<button class="arena-join btn-challenge" type="button" @click=${n}>Open</button>`}
    </a>`},lt=class extends f{static properties={heading:{type:String},_arenas:{state:!0},_error:{state:!0},selectable:{type:Boolean}};static styles=[Hs,b`
        :host { display: block; }
        h2.title { margin: 0 0 .25rem; font-size: .8rem; font-weight: 600; }
        .error { color: var(--text-muted); font-size: .75rem; text-align: center; padding: .5rem 0; }
    `];constructor(){super(),this.heading="",this._arenas=[],this._error="",this.selectable=!1,this._timer=null}connectedCallback(){super.connectedCallback(),this._load(),this._timer=setInterval(()=>this._load(),js)}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),super.disconnectedCallback()}async load(){await this._load()}async _load(){try{let e=await fetch(`${E}/api/arena`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arenas (${e.status})`);let s=Date.now();if(!(t.arenas||[]).some(n=>n.endTime>s&&n.status!=="finished")){let n=zs(s);if(Math.floor((n-s)/6e4)>=Os){let l=new Date(n),c=String(l.getUTCHours()).padStart(2,"0"),h=String(l.getUTCMinutes()).padStart(2,"0"),p=`${l.getUTCFullYear()}${String(l.getUTCMonth()+1).padStart(2,"0")}${String(l.getUTCDate()).padStart(2,"0")}-${c}${h}`,d=l.getUTCMinutes()>=30?1:0,m=(2*l.getUTCHours()+d)%gs.length,g=gs[m];if(await fetch(`${E}/api/arena`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:`arena-hourly-${p}`,creatorId:"hourly-arena",creatorName:g.name,ruleType:g.ruleType,options:g.options,endTime:n})}),e=await fetch(`${E}/api/arena`),t=await e.json(),!e.ok)throw new Error(t.error||`Unable to reload Arenas (${e.status})`)}}this._arenas=(t.arenas||[]).sort((n,a)=>a.createdAt-n.createdAt),this._error="",this.dispatchEvent(new CustomEvent("arenas-loaded",{detail:{arenas:this._arenas},bubbles:!0,composed:!0}))}catch(e){this._error=e.message||"Unable to load Arenas."}}get _activeArenas(){let e=Date.now();return this._arenas.filter(t=>t.endTime>e&&t.status!=="finished")}_onSelect(e){this.dispatchEvent(new CustomEvent("arena-select",{detail:{arenaId:e},bubbles:!0,composed:!0}))}render(){let e=this._activeArenas;return o`
            ${this.heading?o`<h2 class="title">${this.heading}</h2>`:""}
            ${this._error&&!e.length?o`<div class="error">Could not load arenas.</div>`:e.length?o`<div class="arena-list" aria-label="Active Arenas">${e.map(t=>Ds(t,!1,this.selectable?s=>this._onSelect(s):null))}</div>`:o`<div class="empty">No active Arenas.</div>`}
        `}};customElements.define("active-arenas",lt);var Bs=20,Fs=3,Js=.95,qs=6,Gs=14,bs=70,Ys=r=>{let e=Math.max(1,Math.min(Bs,Math.floor(r))),t=[];for(let i=e%2===0?e:e-1;i>=2;i-=2)t.push(i);let s=[];for(let i=3;i<=e;i+=2)s.push(i);return[...t,1,...s].map(i=>{let n=Math.min(i-1,qs),a=Math.min((i-1)*Gs,bs);return{rank:i,size:`calc(${Js}rem - ${n}px)`,zIndex:e-i+1,filter:`grayscale(${a}%)`,opacity:Number((1-a/bs*.25).toFixed(2))}})},Vs=r=>{let e=new Map;for(let t of r){let s=String(t.userName).trim();s&&e.set(s,(e.get(s)||0)+1)}return[...e.entries()].map(([t,s])=>({name:t,count:s})).sort((t,s)=>s.count-t.count||t.name.localeCompare(s.name))},ct=class extends f{static properties={limit:{type:Number},_leaderboard:{state:!0},_loaded:{state:!0}};static styles=b`
        :host { display: block; font-family: 'Exo', sans-serif; font-weight: 200; }
        .panel-title { font-weight: bold; margin-bottom: 0.25rem; font-size: 0.8rem; color: var(--text-dim); text-align: center; }
        .cabinet-list { display: flex; flex-direction: column; gap: 0.1rem; }
        .cabinet-row { display: flex; align-items: center; gap: 0.3rem; padding: 0 0.2rem; border: 1px solid var(--border); border-radius: 4px; min-height: 22px; }
        .cabinet-name { flex: 0 1 auto; max-width: 45%; font-size: 0.75rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cabinet-trophies { display: flex; align-items: center; justify-content: flex-end; flex: 1 1 auto; min-width: 0; overflow: hidden; }
        .trophy { line-height: 1; user-select: none; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35); transition: transform 0.15s ease, filter 0.15s ease, opacity 0.15s ease; }
        .trophy + .trophy { margin-left: -0.35em; }
        .trophy:hover { transform: translateY(-2px) scale(1.25); filter: none !important; opacity: 1 !important; z-index: 100 !important; }
        .empty { color: var(--text-muted); text-align: center; padding: 0.5rem 0; font-size: 0.75rem; }
    `;constructor(){super(),this.limit=Fs,this._leaderboard=[],this._loaded=!1}async connectedCallback(){super.connectedCallback();let e=await nt();e&&(this._leaderboard=Vs(e),this._loaded=!0)}render(){let e=this._leaderboard.slice(0,Math.max(1,this.limit));return o`
            <div class="panel-title">Trophy Cabinet</div>
            ${e.length?o`<div class="cabinet-list" aria-label="Top trophy holders">
                    ${e.map(t=>o`
                        <div class="cabinet-row" title="${t.name}: ${t.count} arena ${t.count===1?"win":"wins"}">
                            <span class="cabinet-name">${t.name}</span>
                            <span class="cabinet-trophies" aria-hidden="true">
                                ${Ys(t.count).map(s=>o`<span
                                    class="trophy"
                                    style="font-size:${s.size};z-index:${s.zIndex};filter:${s.filter};opacity:${s.opacity}"
                                >🏆</span>`)}
                            </span>
                        </div>`)}
                </div>`:this._loaded?o`<div class="empty">No trophies yet</div>`:""}
        `}};customElements.define("trophy-cabinet",ct);var dt=class extends f{static properties={arenaId:{type:String},_messages:{state:!0},_hidden:{state:!0}};static styles=[v,b`
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
    `];constructor(){super(),this.arenaId="",this._messages=[],this._hidden=!1,this._ws=null}connectedCallback(){super.connectedCallback()}updated(e){e.has("arenaId")&&this.arenaId&&(this._ws?.close(),this._messages=[],this._connect()),(e.has("_messages")||e.has("_hidden")&&!this._hidden)&&this._scheduleScrollToBottom()}_scheduleScrollToBottom(){this._scrollRaf||(this._scrollRaf=requestAnimationFrame(()=>{this._scrollRaf=0,this._scrollToBottom()}))}_scrollToBottom(){if(this._hidden)return;let e=this.renderRoot.querySelector(".messages");e&&(e.scrollTop=e.scrollHeight)}disconnectedCallback(){super.disconnectedCallback(),this._ws?.close(),this._scrollRaf&&(cancelAnimationFrame(this._scrollRaf),this._scrollRaf=0)}_connect(){let e=`${ee}/subscribe/arena/${encodeURIComponent(this.arenaId)}`;this._ws=new WebSocket(e),this._ws.onmessage=t=>{try{let i=JSON.parse(t.data).message??t.data;this._messages=[...this._messages.slice(-4),String(i)]}catch{this._messages=[...this._messages.slice(-4),t.data]}}}_send(){let e=this.renderRoot.querySelector("input"),t=e.value.trim();if(!t||!this.arenaId)return;let s=location.hostname==="localhost"||location.hostname==="127.0.0.1"?`http://${location.hostname}:8080`:`https://${O}`;fetch(`${s}/publish/arena/${encodeURIComponent(this.arenaId)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:t})}),e.value=""}_onKeydown(e){e.key==="Enter"&&this._send()}_onInput(){this._scrollToBottom()}render(){return o`
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
    `}};customElements.define("arena-chat",dt);var ht=class extends f{static properties={standings:{attribute:!1}};static styles=[v,b`
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
            ${e.map((i,n)=>i?o`
                <div class="step ${t[n]}">
                    <div class="player">
                        <div class="medal" aria-hidden="true">${s[n]}</div>
                        <span class="name" title=${i.name}>${i.name}</span>
                        <span class="score">${i.points} pts</span>
                    </div>
                    <div class="block" aria-label="Place ${n===0?2:n===1?1:3}">${n===0?2:n===1?1:3}</div>
                </div>`:o`<div class="step ${t[n]}" aria-hidden="true"><div class="block"></div></div>`)}
        </div>`:o`<div class="empty">No final standings available.</div>`}};customElements.define("arena-podium",ht);var pt=class extends f{static properties={standings:{attribute:!1},players:{attribute:!1},onlineUsers:{attribute:!1},expired:{type:Boolean},countdown:{type:String}};static styles=[b`
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
                    <tbody>${this.standings.map((e,t)=>{let s=this.players.find(n=>n.playerId===e.playerId),i=Ws(e.playerId)?!0:this.onlineUsers.some(n=>n.userId===e.playerId);return o`<tr>
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
        `}};function Ws(r){return["bot-thefarjaw","bot-clawbreak"].includes(r)}customElements.define("arena-leaderboard",pt);var Ks=new Set(["bot-thefarjaw","bot-clawbreak"]),Qs={"bot-thefarjaw":"TheFarJaw","bot-clawbreak":"ClawBreak"},ut=r=>Ks.has(r),mt=10,Xs=5,fs=2e3,gt=class extends f{static properties={arenaId:{type:String},lobby:{type:Object},theme:{type:String,reflect:!0},_arena:{state:!0},_leaderboard:{state:!0},_onlineUsers:{state:!0},_busy:{state:!0},_error:{state:!0},_pairingState:{state:!0},_pairingCountdown:{state:!0},_pairedName:{state:!0},_berserk:{state:!0}};static styles=[X,v,b`
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
    `];constructor(){super(),this.arenaId="",this.lobby=null,this.theme=document.documentElement.getAttribute("theme")||localStorage.getItem("theme")||"dark",this._arena=null,this._leaderboard=[],this._onlineUsers=[],this._busy=!1,this._theme=this.theme,document.documentElement.setAttribute("theme",this._theme),document.documentElement.style.colorScheme=this._theme,this._lobby=null,this._lobbyWired=!1,this._error="",this._timer=null,this._staleRefetchDone=!1,this._lastLoadedArenaId=null,this._pairingState=null,this._pairingCountdown=mt,this._pairedName="",this._berserk=!1,this._pairingInterval=null,this._pairingTimeout=null,this._pendingArenaChallenge=null}connectedCallback(){super.connectedCallback(),this._load(),this.lobby&&this._setupLobby(),this._timer=setInterval(()=>{this._arena&&this.requestUpdate()},1e3)}updated(e){e.has("lobby")&&this.lobby&&this._setupLobby(),e.has("arenaId")&&this.arenaId&&this.arenaId!==this._lastLoadedArenaId&&this._load()}disconnectedCallback(){this._timer&&(clearInterval(this._timer),this._timer=null),this._cancelPairing(),this._pendingArenaChallenge=null,this._lobbyWired=!1,super.disconnectedCallback()}_isExpired(){return!!(this._arena&&this._arena.endTime&&Date.now()>=this._arena.endTime)}get _localCustom(){let e=u.getCustom();return(e.emoji===void 0||e.emoji===null)&&this._onlineUsers.find(s=>s.userId===u.clientId)?.meta?.country==="BOT"?{...e,emoji:"\u{1F916}"}:e}_getCountdownText(){if(!this._arena||!this._arena.endTime)return"";let e=Math.max(0,this._arena.endTime-Date.now());if(e<=0||this._arena.status==="finished")return"00:00";let t=Math.floor(e/1e3),s=Math.floor(t/60),i=t%60;if(s>=60){let n=Math.floor(s/60),a=s%60;return`${String(n).padStart(2,"0")}:${String(a).padStart(2,"0")}:${String(i).padStart(2,"0")}`}return`${String(s).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_setupLobby(){!this.lobby||this._lobbyWired||(this._lobby=this.lobby,this._lobbyWired=!0,this._syncArenaPresence(),this._lobby.onUsersChange(e=>{this._onlineUsers=[...e,{userId:u.clientId,userName:u.userName,custom:this._localCustom}],this._checkStaleArenaPresence()}),this._lobby.onChallenge(e=>{e.type==="offer"?this._handleIncomingChallenge(e):this._handleArenaChallengeMessage(e)}))}_isArenaReturnRedirect(){let e=new URLSearchParams(window.location.search);return e.get("opponent.userId")?!!(e.get("tournamentId")||e.get("arenaId")||e.get("arena")):!1}async _handleIncomingChallenge(e){if(e.type!=="offer"||e.challengeeId!==u.clientId)return;let t=this._berserk,s=this._isArenaReturnRedirect();if(s)try{t||(t=localStorage.getItem("arenaBerserk")==="true"),localStorage.removeItem("arenaBerserk")}catch{}let i=this._pairingState==="counting";if(this._cancelPairing(),e.options?.tournamentId!==this.arenaId){i&&this.requestUpdate();return}let n=this._arena?.players?.some(a=>a.playerId===u.clientId&&a.active!==!1);if(!n&&s){if(this._arena||await this._load(),!this._arena?.players?.some(l=>l.playerId===u.clientId&&l.active!==!1)){let l=(u.userName||"").trim();if(!l||/^(anonymous|anon)$/i.test(l)){i&&this.requestUpdate();return}try{await this._mutate("join",{playerId:u.clientId,name:l})}catch(h){console.error("Arena auto-join failed:",h),i&&this.requestUpdate();return}if(!this._arena?.players?.some(h=>h.playerId===u.clientId&&h.active!==!1)){i&&this.requestUpdate();return}}}else if(!n){i&&this.requestUpdate();return}await this._acceptArenaChallenge(e,t)}_handleArenaChallengeMessage(e){let t=this._pendingArenaChallenge;if(!t||e.challengerId!==u.clientId||e.challengeeId!==t.opponentId)return;if(e.type==="decline"||e.type==="cancel"){this._pendingArenaChallenge=null;return}if(e.type!=="accept")return;if(!t.tableId){t.earlyAccept=e;return}if(e.tableId!==t.tableId)return;this._pendingArenaChallenge=null;let s=e.ruleType||t.ruleType,i=e.options||t.options,n=e.nextTurnId?e.nextTurnId===u.clientId:!0,a=z({tableId:e.tableId,userId:u.clientId,userName:u.userName,ruleType:s,isFirst:n,options:i,localOptions:t.berserk?{berserk:"true"}:void 0,lod:u.lod,flip:u.flip,custom:this._localCustom,opponent:{userId:t.opponentId,userName:t.opponentName,custom:t.opponentCustom}});window.location.href=a}async _acceptArenaChallenge(e,t=this._berserk){if(!this._lobby)return;let s=e.ruleType||this._arena?.ruleType||"nineball",i=e.options||this._arena?.options||{};try{t?localStorage.setItem("arenaBerserk","true"):localStorage.removeItem("arenaBerserk")}catch{}try{await this._lobby.acceptChallenge(e.challengerId,s,e.tableId,i,e.challengerName,void 0,this._localCustom)}catch(l){console.error("Arena auto-accept failed:",l);return}let n=e.nextTurnId?e.nextTurnId===u.clientId:!1,a=z({tableId:e.tableId,userId:u.clientId,userName:u.userName,ruleType:s,isFirst:n,options:i,localOptions:t?{berserk:"true"}:void 0,lod:u.lod,flip:u.flip,custom:this._localCustom,opponent:{userId:e.challengerId,userName:e.challengerName||"",custom:e.custom}});window.location.href=a}async _load(){if(this.arenaId){this._busy=!0,this._error="";try{let e=await fetch(`${E}/api/arena/${encodeURIComponent(this.arenaId)}`),t=await e.json();if(!e.ok)throw new Error(t.error||`Unable to load Arena (${e.status})`);this._arena=t.arena,this._leaderboard=t.leaderboard||[],this.arenaId!==this._lastLoadedArenaId&&(this._staleRefetchDone=!1,this._lastLoadedArenaId=this.arenaId),await this._syncArenaPresence(),this._checkStaleArenaPresence()}catch(e){this._error=e.message||"Unable to load Arena."}finally{this._busy=!1}}}async _join(){let e=(u.userName||"").trim();if(/^(anonymous|anon)$/i.test(e)){window.alert("You must change name, Anonymous is not a valid arena name");return}await this._mutate("join",{playerId:u.clientId,name:e})}async _leave(){if(this._cancelPairing(),this._lobby)try{await this._lobby.updatePresence({arenaId:void 0})}catch(e){console.error("Failed to clear arena presence:",e)}await this._mutate("leave",{playerId:u.clientId})}async _syncArenaPresence(){if(!this._lobby||!this._arena)return;let e=this._arena.players?.find(t=>t.playerId===u.clientId);try{await this._lobby.updatePresence({arenaId:e?.active!==!1&&e?this.arenaId:void 0})}catch(t){console.error("Failed to update Arena presence:",t)}}_checkStaleArenaPresence(){if(!this._arena||!this._lobby)return;this._onlineUsers.some(t=>t.userId!==u.clientId&&t.arenaId===this.arenaId&&!this._arena.players?.some(s=>s.playerId===t.userId))&&this._refetchStaleArenaOnce()}_refetchStaleArenaOnce(){this._staleRefetchDone||this._busy||(this._staleRefetchDone=!0,this._load())}async _mutate(e,t){this._busy=!0,this._error="";try{let s=await fetch(`${E}/api/arena/${encodeURIComponent(this.arenaId)}/${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),i=await s.json();if(!s.ok)throw new Error(i.error||`${e} failed (${s.status})`);await this._load()}catch(s){this._error=s.message||`Unable to ${e} Arena.`,this._busy=!1}}_getPairingCandidates(){let e=u.clientId,t=[],s=[],i=[];for(let n of this._leaderboard){if(n.playerId===e)continue;let a=ut(n.playerId),l=this._arena?.players?.find(m=>m.playerId===n.playerId),c=this._onlineUsers.find(m=>m.userId===n.playerId),h=!a&&!!c?.tableId,p=l?.active!==!1&&(a||!!(c&&!h)),d={playerId:n.playerId,name:n.name,playing:h,bot:a,available:p};i.push(d),p&&(a?s.push(n):t.push(n))}return{candidates:t.length>0?t:s,diagnostics:i}}_findEligibleOpponents(){return this._getPairingCandidates().candidates}_startPairing(){this._pairingState!=="counting"&&(this._pairingState="counting",this._pairingCountdown=this._getPairingCandidates().candidates.some(e=>!ut(e.playerId))?Xs:mt,this._pairedName="",this._pairingInterval=setInterval(()=>this._onPairingTick(),1e3))}_cancelPairing(){this._pairingInterval&&(clearInterval(this._pairingInterval),this._pairingInterval=null),this._pairingTimeout&&(clearTimeout(this._pairingTimeout),this._pairingTimeout=null),this._pairingState=null,this._pairingCountdown=mt,this._pairedName="",this._berserk=!1}_onPairingTick(){let e=this._arena,t=u.clientId,s=e?.players?.some(n=>n.playerId===t&&n.active!==!1),i=e?.status==="active"&&Date.now()<(e?.endTime||0);if(!s||!i){this._cancelPairing();return}if(this._pairingCountdown-=1,this._pairingCountdown<=0){clearInterval(this._pairingInterval),this._pairingInterval=null,this._executePairing();return}this.requestUpdate()}_getOpponentHistory(){if(!this.arenaId)return[];try{let e=localStorage.getItem(`arena_opponents_${this.arenaId}`);return e?JSON.parse(e):[]}catch{return[]}}_recordOpponentHistory(e){if(!(!this.arenaId||!e))try{let t=this._getOpponentHistory();t.push(e),t.length>10&&t.shift(),localStorage.setItem(`arena_opponents_${this.arenaId}`,JSON.stringify(t))}catch(t){console.error("Failed to save opponent history:",t)}}async _executePairing(){let e=this._berserk;this._berserk=!1;let{candidates:t,diagnostics:s}=this._getPairingCandidates();if(t.length===0){console.log("[Arena pairing]",{candidates:s,choice:null}),this._pairingState="no-opponent",this._pairingTimeout=setTimeout(()=>this._cancelPairing(),fs);return}let i=this._getOpponentHistory(),n={};for(let p of i)n[p]=(n[p]||0)+1;let a=1/0;for(let p of t){let d=n[p.playerId]||0;d<a&&(a=d)}let l=t.filter(p=>(n[p.playerId]||0)===a),c=l[Math.floor(Math.random()*l.length)];this._recordOpponentHistory(c.playerId);let h=s.find(p=>p.playerId===c.playerId);console.log("[Arena pairing]",{candidates:s,choice:h}),this._pairedName=c.name,this._pairingState="paired";try{await this._initiateChallenge(c,e)}catch(p){console.error("Pairing challenge failed:",p)}this._pairingTimeout=setTimeout(()=>this._cancelPairing(),fs)}async _initiateChallenge(e,t=this._berserk){let s=this._arena,i=s?.ruleType||"nineball",n=s?.options||{},a=s?.id||"";if(ut(e.playerId)){let h=Qs[e.playerId]||e.name,p="arena-bot-"+Math.random().toString(36).slice(2,8),d=z({tableId:p,userId:u.clientId,userName:u.userName,ruleType:i,isFirst:!0,options:n,bot:h,lod:u.lod,custom:this._localCustom,opponent:{userId:e.playerId,userName:e.name,custom:e.custom},flip:u.flip,localOptions:t?{berserk:"true"}:void 0});window.location.href=d+`&tournamentId=${encodeURIComponent(a)}`;return}if(!this._lobby){console.error("Pairing: no lobby connection");return}let l={...n,tournamentId:a},c={opponentId:e.playerId,opponentName:e.name,opponentCustom:e.custom||this._onlineUsers.find(h=>h.userId===e.playerId)?.custom,ruleType:i,options:l,berserk:t,tableId:null,earlyAccept:null};this._pendingArenaChallenge=c;try{let h=await this._lobby.challenge(e.playerId,i,l,void 0,this._localCustom);if(c.tableId=h,c.earlyAccept){let p=c.earlyAccept;c.earlyAccept=null,this._handleArenaChallengeMessage(p)}}catch(h){throw this._pendingArenaChallenge===c&&(this._pendingArenaChallenge=null),h}}_renderPairingOverlay(){return this._pairingState==="counting"?o`
                <div class="pairing-overlay active" role="status" aria-live="polite">
                    <div class="pairing-tick" aria-label="Seconds remaining: ${this._pairingCountdown}">${this._pairingCountdown}</div>
                    <div class="pairing-label">Pairing…</div>
                    <div class="pairing-hint">Finding an opponent</div>
                    <button class="pairing-berserk" type="button" aria-pressed=${this._berserk} @click=${()=>{this._berserk=!this._berserk}}>Berserk 🚀</button>
                    <button type="button" @click=${this._cancelPairing}>Cancel</button>
                </div>`:this._pairingState==="paired"?o`
                <div class="pairing-overlay active" role="status" aria-live="assertive">
                    <div class="pairing-result">Paired with ${this._pairedName}</div>
                </div>`:this._pairingState==="no-opponent"?o`
                <div class="pairing-overlay" role="status" aria-live="assertive">
                    <div class="pairing-result">No available opponents</div>
                </div>`:null}render(){let e=this._arena,t=u.clientId,s=e?.players?.find(d=>d.playerId===t),i=!!s,n=s?.active!==!1,a=this._isExpired(),l=e?.status==="active"&&!a,c=i&&n&&l&&this._pairingState===null,h=this._pairingState!==null,p=this._renderPairingOverlay();return o`<div class="container">
            ${this._error?o`<div class="error" role="alert">${this._error}</div>`:""}
            ${!e&&!this._error?o`<section class="panel"><div class="empty">Loading Arena…</div></section>`:""}
            ${e?o`
                <section class="panel">
                    <div class="meta">
                        Status: ${a?"complete":e.status} · ${e.durationMinutes} minutes · ${e.players.length} participant${e.players.length===1?"":"s"} · ${a?"Ended":"Ends"}: ${new Date(e.endTime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}
                    </div>
                    ${a?"":o`<div class="actions">
                        <button type="button" ?disabled=${this._busy||h} @click=${this._load}>Refresh</button>
                        ${i&&n?o`<button class="btn-leave" type="button" ?disabled=${this._busy} @click=${this._leave}>Leave Arena</button>`:o`<button class="btn-accept" type="button" ?disabled=${this._busy||!l} @click=${this._join}>Join Arena</button>`}
                        ${c?o`<button class="btn-challenge" type="button" @click=${this._startPairing}>Pair</button>`:""}
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
        </div>`}};customElements.define("arena-view",gt);var bt=class extends f{static properties={arenaId:{type:String},lobby:{type:Object},theme:{type:String,reflect:!0},_arenaName:{state:!0}};static styles=[X,v,b`
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
    `];constructor(){super(),this.arenaId="",this.lobby=null,this.theme="",this._arenaName=""}connectedCallback(){super.connectedCallback(),this._loadArenaName()}updated(e){e.has("arenaId")&&this.arenaId&&this._loadArenaName()}async _loadArenaName(){if(this.arenaId)try{let e=await fetch(`${E}/api/arena/${encodeURIComponent(this.arenaId)}`);if(e.ok){let t=await e.json();if(t.arena){let s=t.arena,i=s.creatorName?o`${ge(s.ruleType,s.options)} ${s.creatorName}`:"Arena";this._arenaName=i}}}catch(e){console.error("Failed to load arena name:",e)}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){return o`
            <div class="panel-bar">
                <div class="arena-title">${this._arenaName||o`<span class="loading">Loading...</span>`}</div>
                <a class="manage-link" href="arena.html">Manage Arenas ↗</a>
                <button type="button" class="btn-close" @click=${this._close} aria-label="Close Arena">✕ Close</button>
            </div>
            <div class="content">
                <arena-view .arenaId=${this.arenaId} .lobby=${this.lobby} .theme=${this.theme}></arena-view>
                <arena-chat .arenaId=${this.arenaId}></arena-chat>
            </div>
        `}};customElements.define("arena-panel",bt);var ft=class extends f{static properties={_theme:{type:String,reflect:!0,attribute:"theme"},_sidebarOpen:{type:Boolean},_activeArenaId:{state:!0},_lobby:{state:!0}};static styles=Jt;constructor(){super(),console.log("URL:",window.location.href),console.log("Search params:",Object.fromEntries(new URLSearchParams(window.location.search))),this._theme=document.documentElement.getAttribute("theme")||"light",this._sidebarOpen=!1;let e=new URLSearchParams(window.location.search);this._activeArenaId=e.get("tournamentId")||e.get("arenaId")||e.get("arena")||null,this._lobby=null,this.addEventListener("user-list-toggle",t=>{this._sidebarOpen=t.detail.expanded}),this.addEventListener("arena-select",t=>{this._activeArenaId=t.detail.arenaId;let s=new URL(window.location.href);s.searchParams.set("tournamentId",t.detail.arenaId),window.history.replaceState({},"",s.pathname+s.search),this._scrollToArenaPanel("nearest")}),this.addEventListener("lobby-ready",t=>{this._lobby=t.detail}),window.addEventListener("popstate",()=>{let t=new URLSearchParams(window.location.search),s=t.get("tournamentId")||t.get("arenaId")||t.get("arena")||null;s!==this._activeArenaId&&(this._activeArenaId=s)})}firstUpdated(){super.firstUpdated(),this._activeArenaId&&this._scrollToArenaPanel("start")}_scrollToArenaPanel(e){requestAnimationFrame(()=>{this.shadowRoot.querySelector(".arenas-row")?.scrollIntoView({behavior:"smooth",block:e})})}_closeArenaPanel=()=>{this._activeArenaId=null;let e=new URL(window.location.href);(e.searchParams.has("tournamentId")||e.searchParams.has("arenaId")||e.searchParams.has("arena"))&&(e.searchParams.delete("tournamentId"),e.searchParams.delete("arenaId"),e.searchParams.delete("arena"),e.searchParams.delete("opponent.userId"),e.searchParams.delete("opponent.userName"),e.searchParams.delete("ruletype"),e.searchParams.delete("nextTurnId"),window.history.replaceState({},"",e.pathname+(e.search?e.search:"")))};get _ctrl(){return this.shadowRoot.querySelector("online-panel")}render(){return o`
            <div class="container">
                <header class="topbar">
                    <a href="https://billiards.tailuge.workers.dev/lobby" class="topbrand" aria-label="Billiards lobby"><img src="assets/threecushion.png" class="logo" alt=""></a>
                    <h1><a href="https://billiards.tailuge.workers.dev/lobby">Billiards</a><a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" class="version">${me(ue)}</a></h1>
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
                    <div class="arenas-row ${this._activeArenaId?"arena-details":""}">
                        <div class="cabinet-col panel"><trophy-cabinet .limit=${this._activeArenaId?8:3}></trophy-cabinet></div>
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
                <footer style="text-align:center;font-size:0.7rem;opacity:0.7;padding:0.5rem 0">
                    Thanks for playing at <a href="https://github.com/tailuge/billiards" target="_blank" rel="noopener" style="color:inherit">tailuge/billiards</a>. Stick around and challenge online for a free game or two.
                </footer>
            </div>
        `}};customElements.define("lobby-app",ft);})();
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
