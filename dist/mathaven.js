"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[893],{"./src/mathaven.ts":(t,i,e)=>{var n=e("./src/model/physics/claude/constants.ts");function o(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}var s=new/*#__PURE__*/(function(){var t;function i(t,e,n,s){!function(t,i){if(!(t instanceof i))throw TypeError("Cannot call a class as a function")}(this,i),o(this,"P",0),o(this,"WzI",0),o(this,"vx",void 0),o(this,"vy",void 0),o(this,"ωx",void 0),o(this,"ωy",void 0),o(this,"ωz",void 0),o(this,"s",void 0),o(this,"φ",void 0),o(this,"sʹ",void 0),o(this,"φʹ",void 0),o(this,"i",0),o(this,"history",[]),this.vx=t*Math.cos(e),this.vy=t*Math.sin(e),this.ωx=-s*Math.sin(e),this.ωy=s*Math.cos(e),this.ωz=n,this.updateSlipSpeedsAndAngles()}return t=[{key:"updateSlipSpeedsAndAngles",value:function(){var t=this.vx+this.ωy*n.R*n.Z3-this.ωz*n.R*n.o5,i=-this.vy*n.Z3+this.ωx*n.R,e=this.vx-this.ωy*n.R,o=this.vy+this.ωx*n.R;this.s=Math.sqrt(Math.pow(t,2)+Math.pow(i,2)),this.φ=Math.atan2(i,t),this.φ<0&&(this.φ+=2*Math.PI),this.sʹ=Math.sqrt(Math.pow(e,2)+Math.pow(o,2)),this.φʹ=Math.atan2(o,e),this.φʹ<0&&(this.φʹ+=2*Math.PI)}},{key:"compressionPhase",value:function(){for(var t=(1+n.ee)*n.M*this.vy/n.N;this.vy>0;)this.updateSingleStep(t)}},{key:"restitutionPhase",value:function(t){var i=(1+n.ee)*n.M*this.WzI/n.N;for(this.WzI=0;this.WzI<t;)this.updateSingleStep(i)}},{key:"updateSingleStep",value:function(t){if(this.updateVelocity(t),this.updateAngularVelocity(t),this.updateSlipSpeedsAndAngles(),this.updateWorkDone(t),this.history.push(function(t){for(var i=1;i<arguments.length;i++){var e=null!=arguments[i]?arguments[i]:{},n=Object.keys(e);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(e).filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.forEach(function(i){o(t,i,e[i])})}return t}({},this)),this.i++>10*n.N)throw"Solution not found"}},{key:"updateVelocity",value:function(t){this.vx-=1/n.M*(n._m*Math.cos(this.φ)+n.oV*Math.cos(this.φʹ)*(n.Z3+n._m*Math.sin(this.φ)*n.o5))*t,this.vy-=1/n.M*(n.o5-n._m*n.Z3*Math.sin(this.φ)+n.oV*Math.sin(this.φʹ)*(n.Z3+n._m*Math.sin(this.φ)*n.o5))*t}},{key:"updateAngularVelocity",value:function(t){this.ωx+=-(5/(2*n.M*n.R))*(n._m*Math.sin(this.φ)+n.oV*Math.sin(this.φʹ)*(n.Z3+n._m*Math.sin(this.φ)*n.o5))*t,this.ωy+=-(5/(2*n.M*n.R))*(n._m*Math.cos(this.φ)*n.Z3-n.oV*Math.cos(this.φʹ)*(n.Z3+n._m*Math.sin(this.φ)*n.o5))*t,this.ωz+=5/(2*n.M*n.R)*(n._m*Math.cos(this.φ)*n.o5)*t}},{key:"updateWorkDone",value:function(t){var i=t*Math.abs(this.vy);this.WzI+=i,this.P+=t}},{key:"solve",value:function(){this.compressionPhase();var t=this.WzI-(1-n.ee*n.ee)*this.WzI;this.restitutionPhase(t)}}],function(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}(i.prototype,t),i}())(2,Math.PI/4,4/n.R,3/n.R);try{s.solve()}catch(t){console.error(t)}var r={responsive:!0,showLink:!0,plotlyServerURL:"https://chart-studio.plotly.com"},h={legend:{font:{color:"#4D5663"},bgcolor:"#e5e6F9"},xaxis:{title:"impulse",tickfont:{color:"#4D5663"},gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},yaxis:{title:"value",tickfont:{color:"#4D5663"},zeroline:!1,gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},plot_bgcolor:"#F5F6F9",paper_bgcolor:"#F2F6F9"};function a(t){return"hsl(".concat(137.5*t%360,", ").concat(70,"%, ").concat(50,"%)")}function c(t,i,e,n){return{x:t,y:i,name:e,line:{color:n,width:1.3},mode:"lines",type:"scatter"}}var u=function(t){return s.history.map(t)},l=u(function(t){return t.P});window.Plotly.newPlot("mathaven-impulse",[c(l,u(function(t){return t.s}),"s",a(0)),c(l,u(function(t){return t.φ}),"φ",a(1)),c(l,u(function(t){return t.sʹ}),"s'",a(2)),c(l,u(function(t){return t.φʹ}),"φʹ",a(3)),c(l,u(function(t){return t.WzI}),"WzI",a(4)),c(l,u(function(t){return t.P}),"P",a(5))],h,r);var v=u(function(t){return t.i});window.Plotly.newPlot("mathaven-vel",[c(v,u(function(t){return t.vx}),"vx",a(5)),c(v,u(function(t){return t.vy}),"vy",a(6)),c(v,u(function(t){return t.WzI}),"WzI",a(4))],h,r),window.Plotly.newPlot("mathaven-spin",[c(v,u(function(t){return t.ωx}),"ωx",a(2)),c(v,u(function(t){return t.ωy}),"ωy",a(3)),c(l,u(function(t){return t.WzI}),"WzI",a(4))],h,r)},"./src/model/physics/claude/constants.ts":(t,i,e)=>{e.d(i,{Hm:()=>a,M:()=>n,N:()=>v,R:()=>o,Z3:()=>c,_m:()=>h,ee:()=>s,o5:()=>l,oV:()=>r,ye:()=>u});var n=.1406,o=.02625,s=.98,r=.212,h=.14,a=.4,c=.4,u=Math.sqrt(21)/5,l=u,v=1e3}},t=>{t(t.s="./src/mathaven.ts")}]);