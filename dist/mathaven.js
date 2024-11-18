"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[893],{"./src/mathaven.ts":(t,e,n)=>{var i=n("./src/model/physics/claude/constants.ts");function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s=/*#__PURE__*/function(){var t;function e(t,n,i,s){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e),o(this,"P",0),o(this,"WzI",0),o(this,"vx",void 0),o(this,"vy",void 0),o(this,"ωx",void 0),o(this,"ωy",void 0),o(this,"ωz",void 0),o(this,"s",void 0),o(this,"φ",void 0),o(this,"sʹ",void 0),o(this,"φʹ",void 0),o(this,"i",0),o(this,"history",[]),this.vx=t*Math.cos(n),this.vy=t*Math.sin(n),this.ωx=-s*Math.sin(n),this.ωy=s*Math.cos(n),this.ωz=i,this.updateSlipSpeedsAndAngles()}return t=[{key:"updateSlipSpeedsAndAngles",value:function(){var t=this.vx+this.ωy*i.R*i.Z3-this.ωz*i.R*i.o5,e=-this.vy*i.Z3+this.ωx*i.R,n=this.vx-this.ωy*i.R,o=this.vy+this.ωx*i.R;this.s=Math.sqrt(Math.pow(t,2)+Math.pow(e,2)),this.φ=Math.atan2(e,t),this.φ<0&&(this.φ+=2*Math.PI),this.sʹ=Math.sqrt(Math.pow(n,2)+Math.pow(o,2)),this.φʹ=Math.atan2(o,n),this.φʹ<0&&(this.φʹ+=2*Math.PI)}},{key:"compressionPhase",value:function(){var t=Math.max(i.M*this.vy/i.N,.001);for(console.log(t);this.vy>0;)this.updateSingleStep(t)}},{key:"restitutionPhase",value:function(t){var e=Math.max(t/i.N,.001);for(this.WzI=0;this.WzI<t;)this.updateSingleStep(e)}},{key:"updateSingleStep",value:function(t){if(this.updateVelocity(t),this.updateAngularVelocity(t),this.updateSlipSpeedsAndAngles(),this.updateWorkDone(t),this.history.push(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}({},this)),this.i++>10*i.N)throw"Solution not found"}},{key:"updateVelocity",value:function(t){this.vx-=1/i.M*(i._m*Math.cos(this.φ)+i.oV*Math.cos(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t,this.vy-=1/i.M*(i.o5-i._m*i.Z3*Math.sin(this.φ)+i.oV*Math.sin(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t}},{key:"updateAngularVelocity",value:function(t){this.ωx+=-(5/(2*i.M*i.R))*(i._m*Math.sin(this.φ)+i.oV*Math.sin(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t,this.ωy+=-(5/(2*i.M*i.R))*(i._m*Math.cos(this.φ)*i.Z3-i.oV*Math.cos(this.φʹ)*(i.Z3+i._m*Math.sin(this.φ)*i.o5))*t,this.ωz+=5/(2*i.M*i.R)*(i._m*Math.cos(this.φ)*i.o5)*t}},{key:"updateWorkDone",value:function(t){var e=t*Math.abs(this.vy);this.WzI+=e,this.P+=t}},{key:"solve",value:function(){this.compressionPhase();var t=this.WzI-(1-i.ee*i.ee)*this.WzI;this.restitutionPhase(t)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),r={responsive:!0,showLink:!0,plotlyServerURL:"https://chart-studio.plotly.com"},a={legend:{font:{color:"#4D5663"},bgcolor:"#e5e6F9"},title:{text:"",font:{size:11}},xaxis:{title:"impulse",tickfont:{color:"#4D5663"},gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},yaxis:{title:"value",tickfont:{color:"#4D5663"},zeroline:!1,gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},plot_bgcolor:"#F5F6F9",paper_bgcolor:"#F2F6F9"};function h(t){return"hsl(".concat(137.5*t%360,", ").concat(70,"%, ").concat(50,"%)")}function l(t,e,n,i){return{x:t,y:e,name:n,line:{color:i,width:1.3},mode:"lines",type:"scatter"}}var u=/*#__PURE__*/function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"extractValues",value:function(t,e){return t.map(e)}},{key:"plot",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Math.PI/4,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2*e/i.R,u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1.5*e/i.R,c=new s(e,n,o,u);try{c.solve()}catch(t){console.error(t)}var f=function(e){return t.extractValues(c.history,e)},v=f(function(t){return t.P});a.title.text="<b>Figure.12</b> Slip–impulse curves \nfor V0 = 2 m/s, α = 45◦,ωS0 = 2V0/R, and ωT0 = 1.5V0/R \n<br>(s and φ are for the slip at the cushion, \nand sʹ and φʹ are for the slip at the table)",window.Plotly.newPlot("mathaven-impulse",[l(v,f(function(t){return t.s}),"s",h(0)),l(v,f(function(t){return t.φ}),"φ",h(1)),l(v,f(function(t){return t.sʹ}),"s'",h(2)),l(v,f(function(t){return t.φʹ}),"φʹ",h(3)),l(v,f(function(t){return t.WzI}),"WzI",h(4)),l(v,f(function(t){return t.P}),"P",h(5))],a,r),a.title.text="";var p=f(function(t){return t.i});window.Plotly.newPlot("mathaven-vel",[l(p,f(function(t){return t.vy}),"vy",h(6)),l(p,f(function(t){return t.WzI}),"WzI",h(4)),l(p,f(function(t){return t.P}),"P",h(5))],a,r)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),c=/*#__PURE__*/function(){var t;function e(){!function(t,e){if(!(t instanceof e))throw TypeError("Cannot call a class as a function")}(this,e)}return t=[{key:"getFinalState",value:function(t,e,n,i){try{var o=new s(t,e,n,i);return o.solve(),{beta:1,speed:Math.sqrt(o.vx*o.vx+o.vy*o.vy)}}catch(t){return console.error(t),{beta:NaN,speed:NaN}}}},{key:"plot",value:function(t,e){for(var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(t){return 0},o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(t){return t/i.R},s=[],u=[],c=-1;c<=2;c++){var f=[];u=[];for(var v=1;v<90;v+=9){u.push(v);var p=this.getFinalState(1,Math.PI/180*v,n(c),o(c));f.push(p.speed)}s.push(f)}var d=u;a.title.text=e,window.Plotly.newPlot(t,[l(d,s[0],"k=-1",h(0)),l(d,s[1],"k=0",h(1)),l(d,s[2],"k=1",h(2)),l(d,s[3],"k=2",h(3))],a,r)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();new u().plot(),new c().plot("mathaven-figure9-speed","<b>Figure.9</b> Rebound speed and rebound angle versus incident angle <br>\n    for different topspins of the ball, ωT0 = kV0/R and V0 = 1 m/s with no sidespin"),new c().plot("mathaven-figure10-speed","<b>Figure.10</b> Rebound speed and rebound angle versus incident angle <br>\nfor different sidespins of the ball,ωS0 = kV0/R and V0 = 1 m/s with the ball rolling (ωT0 = V0/R)",function(t){return t/i.R},function(t){return 1/i.R})},"./src/model/physics/claude/constants.ts":(t,e,n)=>{n.d(e,{Hm:()=>h,M:()=>i,N:()=>f,R:()=>o,Z3:()=>l,_m:()=>a,ee:()=>s,o5:()=>c,oV:()=>r,ye:()=>u});var i=.1406,o=.02625,s=.98,r=.212,a=.14,h=.4,l=.4,u=Math.sqrt(21)/5,c=u,f=100}},t=>{t(t.s="./src/mathaven.ts")}]);