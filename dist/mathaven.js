"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[893],{"./src/mathaven.ts":(t,e,n)=>{var i=n("./src/model/physics/claude/constants.ts");function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s=/*#__PURE__*/function(){var t;function e(t,n,i,s){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e),o(this,"P",0),o(this,"WzI",0),o(this,"vx",void 0),o(this,"vy",void 0),o(this,"ωx",void 0),o(this,"ωy",void 0),o(this,"ωz",void 0),o(this,"s",void 0),o(this,"φ",void 0),o(this,"sʹ",void 0),o(this,"φʹ",void 0),o(this,"i",0),o(this,"history",[]),this.vx=t*Math.cos(n),this.vy=t*Math.sin(n),this.ωx=-s*Math.sin(n),this.ωy=s*Math.cos(n),this.ωz=i,this.updateSlipSpeedsAndAngles()}return t=[{key:"updateSlipSpeedsAndAngles",value:function(){var t=this.vx+this.ωy*i.R*i.Z3-this.ωz*i.R*i.o5,e=-this.vy*i.Z3+this.ωx*i.R,n=this.vx-this.ωy*i.R,o=this.vy+this.ωx*i.R;this.s=Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),this.φ=Math.atan2(e,t),this.φ<0&&(this.φ+=2*Math.PI),this.sʹ=Math.sqrt(Math.pow(n,2)+Math.pow(o,2)),this.φʹ=Math.atan2(o,n),this.φʹ<0&&(this.φʹ+=2*Math.PI)}},{key:"compressionPhase",value:function(){for(var t=(1+i.ee)*i.M*this.vy/i.N;this.vy>0;)this.updateSingleStep(t)}},{key:"restitutionPhase",value:function(t){var e=(1+i.ee)*i.M*this.WzI/i.N;for(this.WzI=0;this.WzI<t;)this.updateSingleStep(e)}},{key:"updateSingleStep",value:function(t){if(this.updateVelocity(t),this.updateAngularVelocity(t),this.updateSlipSpeedsAndAngles(),this.updateWorkDone(t),this.history.push(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}({},this)),this.i++>10*i.N)throw"Solution not found"}},{key:"updateVelocity",value:function(t){this.vx-=1/i.M*(i._m*Math.cos(this.φ)+i.oV*Math.cos(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t,this.vy-=1/i.M*(i.o5-i._m*i.Z3*Math.sin(this.φ)+i.oV*Math.sin(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t}},{key:"updateAngularVelocity",value:function(t){this.ωx+=-(5/(2*i.M*i.R))*(i._m*Math.sin(this.φ)+i.oV*Math.sin(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t,this.ωy+=-(5/(2*i.M*i.R))*(i._m*Math.cos(this.φ)*i.Z3-i.oV*Math.cos(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t,this.ωz+=5/(2*i.M*i.R)*(i._m*Math.cos(this.φ)*i.o5)*t}},{key:"updateWorkDone",value:function(t){var e=t*Math.abs(this.vy);this.WzI+=e,this.P+=t}},{key:"solve",value:function(){this.compressionPhase();var t=this.WzI-(1-i.ee*i.ee)*this.WzI;this.restitutionPhase(t)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),r={responsive:!0,showLink:!0,plotlyServerURL:"https://chart-studio.plotly.com"},a={legend:{font:{color:"#4D5663"},bgcolor:"#e5e6F9"},xaxis:{title:"impulse",tickfont:{color:"#4D5663"},gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},yaxis:{title:"value",tickfont:{color:"#4D5663"},zeroline:!1,gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},plot_bgcolor:"#F5F6F9",paper_bgcolor:"#F2F6F9"};function h(t){return"hsl(".concat(137.5*t%360,", ").concat(70,"%, ").concat(50,"%)")}function u(t,e,n,i){return{x:t,y:e,name:n,line:{color:i,width:1.3},mode:"lines",type:"scatter"}}var l=/*#__PURE__*/function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"extractValues",value:function(t,e){return t.map(e)}},{key:"plot",value:function(){var t=this,e=new s(2,Math.PI/4,4/i.R,3/i.R);try{e.solve()}catch(t){console.error(t)}var n=function(n){return t.extractValues(e.history,n)},o=n(function(t){return t.P});window.Plotly.newPlot("mathaven-impulse",[u(o,n(function(t){return t.s}),"s",h(0)),u(o,n(function(t){return t.φ}),"φ",h(1)),u(o,n(function(t){return t.sʹ}),"s'",h(2)),u(o,n(function(t){return t.φʹ}),"φʹ",h(3)),u(o,n(function(t){return t.WzI}),"WzI",h(4)),u(o,n(function(t){return t.P}),"P",h(5))],a,r),window.Plotly.newPlot("mathaven-vel",[u(o,n(function(t){return t.vx}),"vx",h(5)),u(o,n(function(t){return t.vy}),"vy",h(6)),u(o,n(function(t){return t.WzI}),"WzI",h(4))],a,r),window.Plotly.newPlot("mathaven-spin",[u(o,n(function(t){return t.ωx}),"ωx",h(2)),u(o,n(function(t){return t.ωy}),"ωy",h(3)),u(o,n(function(t){return t.WzI}),"WzI",h(4))],a,r)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();new/*#__PURE__*/(function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"getFinalState",value:function(t,e,n,i){try{var o=new s(t,e,n,i);return o.solve(),{beta:1,speed:Math.sqrt(o.vx*o.vx+o.vy*o.vy)}}catch(t){return console.error(t),{beta:NaN,speed:NaN}}}},{key:"plot",value:function(){for(var t=[],e=[],n=-1;n<=2;n++){var o=[],s=1*n/i.R;e=[];for(var l=1;l<90;l+=20){e.push(l);var c=this.getFinalState(1,Math.PI/180*l,0,s);o.push(c.speed)}t.push(o)}var v=e;window.Plotly.newPlot("mathaven-figure9-speed",[u(v,t[0],"k=-1",h(0)),u(v,t[1],"k=0",h(1)),u(v,t[2],"k=1",h(2)),u(v,t[3],"k=2",h(3))],a,r)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}())().plot(),new l().plot()},"./src/model/physics/claude/constants.ts":(t,e,n)=>{n.d(e,{Hm:()=>h,M:()=>i,N:()=>v,R:()=>o,Z3:()=>u,_m:()=>a,ee:()=>s,o5:()=>c,oV:()=>r,ye:()=>l});var i=.1406,o=.02625,s=.98,r=.212,a=.14,h=.4,u=.4,l=Math.sqrt(21)/5,c=l,v=100}},t=>{t(t.s="./src/mathaven.ts")}]);