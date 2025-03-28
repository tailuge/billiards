"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[893],{"./src/mathaven.ts":(t,e,n)=>{var i=n("./src/model/physics/mathaven.ts");function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t,e,n){return(r="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var i=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=a(t)););return t}(t,e);if(i){var o=Object.getOwnPropertyDescriptor(i,e);return o.get?o.get.call(n||t):o.value}})(t,e,n||t)}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(){try{var t=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch(t){}return(l=function(){return!!t})()}var u=function(t){var e;if("function"!=typeof t&&null!==t)throw TypeError("Super expression must either be null or a function");function n(){var t,e,i;if(!(this instanceof n))throw TypeError("Cannot call a class as a function");return e=n,i=arguments,e=a(e),o(t=function(t,e){var n;if(e&&("object"==((n=e)&&"undefined"!=typeof Symbol&&n.constructor===Symbol?"symbol":typeof n)||"function"==typeof e))return e;if(void 0===t)throw ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(this,l()?Reflect.construct(e,i||[],a(this).constructor):e.apply(this,i)),"h",[]),o(t,"extractValues",function(e){return t.h.map(e).map(function(t){return null!=t?t:0})}),t}return n.prototype=Object.create(t&&t.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),t&&s(n,t),e=[{key:"updateSingleStep",value:function(t){r(a(n.prototype),"updateSingleStep",this).call(this,t),this.h.push(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){o(t,e,n[e])})}return t}({},this))}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(n.prototype,e),n}(i.z),c={responsive:!0,showLink:!0,plotlyServerURL:"https://chart-studio.plotly.com"},h={legend:{font:{color:"#4D5663"},bgcolor:"#e5e6F9"},title:{text:"",font:{size:11}},xaxis:{title:"impulse",tickfont:{color:"#4D5663"},gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},yaxis:{title:"value",tickfont:{color:"#4D5663"},zeroline:!1,gridcolor:"#E1E5ED",titlefont:{color:"#4D5663"},zerolinecolor:"#E1E5ED"},plot_bgcolor:"#F5F6F9",paper_bgcolor:"#F2F6F9"};function f(t){return"hsl(".concat(137.5*t%360,", ").concat(70,"%, ").concat(50,"%)")}function v(t,e,n,i){return{x:t,y:e,name:n,line:{color:i,width:1.3},mode:"lines",type:"scatter"}}var p=function(){var t;function e(){if(!(this instanceof e))throw TypeError("Cannot call a class as a function")}return t=[{key:"plot",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Math.PI/4,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:2*t/.02625,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1.5*t/.02625,o=new u(.1406,.02625,.98,.212,.14);try{o.solvePaper(t,e,n,i)}catch(t){console.error(t)}var r=o.extractValues,a=r(function(t){return t.P});h.title.text="<b>Figure.12</b> Slip–impulse curves \nfor V0 = 2 m/s, α = 45◦,ωS0 = 2V0/R, and ωT0 = 1.5V0/R \n<br>(s and φ are for the slip at the cushion, \nand sʹ and φʹ are for the slip at the table)",window.Plotly.newPlot("mathaven-impulse",[v(a,r(function(t){return t.s}),"s",f(0)),v(a,r(function(t){return t.φ}),"φ",f(1)),v(a,r(function(t){return t.sʹ}),"s'",f(2)),v(a,r(function(t){return t.φʹ}),"φʹ",f(3)),v(a,r(function(t){return t.WzI}),"WzI",f(4)),v(a,r(function(t){return t.P}),"P",f(5))],h,c)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),d=function(){var t;function e(){if(!(this instanceof e))throw TypeError("Cannot call a class as a function")}return t=[{key:"getFinalState",value:function(t,e,n,o){try{var r=new i.z(.1406,.02625,.98,.212,.14);r.solvePaper(t,e,n,o);var a=r.vy,s=r.vx;return{beta:180/Math.PI*Math.atan2(-a,s),speed:Math.sqrt(s*s+a*a)}}catch(t){return console.error(t),{beta:NaN,speed:NaN}}}},{key:"plot",value:function(t,e,n){for(var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(t){return 0},o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(t){return t/.02625},r=[],a=[],s=[],l=-1;l<=2;l++){var u=[],p=[];s=[];for(var d=1;d<90;d+=9){s.push(d);var y=this.getFinalState(1,Math.PI/180*d,i(l),o(l));u.push(y.speed),p.push(y.beta)}r.push(u),a.push(p)}var b=s;h.title.text=n,window.Plotly.newPlot(t,[v(b,r[0],"k=-1",f(0)),v(b,r[1],"k=0",f(1)),v(b,r[2],"k=1",f(2)),v(b,r[3],"k=2",f(3))],h,c),window.Plotly.newPlot(e,[v(b,a[0],"k=-1",f(0)),v(b,a[1],"k=0",f(1)),v(b,a[2],"k=1",f(2)),v(b,a[3],"k=2",f(3))],h,c)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),y=n("./node_modules/three/build/three.core.js"),b=n("./src/model/ball.ts"),g=n("./src/utils/utils.ts"),m=n("./src/model/physics/collision.ts");function w(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var P=function(){var t;function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){};if(!(this instanceof e))throw TypeError("Cannot call a class as a function");w(this,"log",void 0),this.log=t}return t=[{key:"dynamicFriction",value:function(t){return e.a+e.b*Math.exp(-e.c*t)}},{key:"relativeVelocity",value:function(t,n,i,o){return Math.sqrt(Math.pow(t*Math.sin(o)-i*e.R,2)+Math.pow(Math.cos(o)*n*e.R,2))}},{key:"throwAngle",value:function(t,n,i,o){var r=this.relativeVelocity(t,n,i,o),a=this.dynamicFriction(r),s=Math.min(a*t*Math.cos(o)/r,1/7)*(t*Math.sin(o)-e.R*i),l=t*Math.cos(o);return this.log("inputs:v=".concat(t,", ωx=").concat(n,", ωz=").concat(i,", ϕ=").concat(o)),this.log("   v * Math.sin(ϕ) =".concat(t*Math.sin(o))),this.log("   CollisionThrow.R * ωz =".concat(e.R*i)),this.log("   Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) =".concat(Math.min(a*t*Math.cos(o)/r,1/7))),this.log("   (v * Math.sin(ϕ) - CollisionThrow.R * ωz) =".concat(t*Math.sin(o)-e.R*i)),this.log(""),this.log("vRel = ",r),this.log("μ = ",a),this.log("numerator = ",s),this.log("denominator = ",l),this.log("throw = ",Math.atan2(s,l)),Math.atan2(s,l)}},{key:"plot",value:function(t,n,i,o){var r=new b.c(g.v_);r.vel.copy(new y.Pq0(0,t,0)),r.rvel.copy(new y.Pq0(n,0,i));var a=new y.Pq0(0,2*e.R).applyAxisAngle(g.up,o),s=new b.c(a);return m.F.model.updateVelocities(r,s),Math.atan2(m.F.model.tangentialImpulse,-m.F.model.normalImpulse)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();w(P,"R",.029),w(P,"a",.01),w(P,"b",.108),w(P,"c",1.088);function M(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(e){var i;i=n[e],e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i})}return t}var k=function(){var t;function e(){if(!(this instanceof e))throw TypeError("Cannot call a class as a function")}return t=[{key:"degToRad",value:function(t){return Math.PI/180*t}},{key:"radToDeg",value:function(t){return 180/Math.PI*t}},{key:"plotCutAngle",value:function(){var t=P.R;this.plot("collision-throw-roll",[.447,1.341,3.129],function(e){return e/t}),this.plot("collision-throw-stun",[.447,1.341,3.129],function(t){return 0}),this.plotRolls("collision-throw-varying-roll",[0,.25,.5,1],function(e){return e/t},function(t){return 0},function(t){return t}),this.plotRolls("collision-throw-varying-side",[0,.25,.5,1],function(e){return e/t},function(e){return 1/t*(e-45)/45},function(t){return 0}),new P(console.log).plot(.5,-15,-10,Math.PI/8)}},{key:"plot",value:function(t,e,n){var i=this,o=[],r=[];e.forEach(function(t){var e=[];r=[];for(var a=1;a<90;a+=1){r.push(a);var s=new P().plot(t,n(t),0,i.degToRad(a));e.push(i.radToDeg(s))}o.push(e)});var a=M({},h);a.title.text="Throw effect (WIP)\n    <br>throw vs. cut angle for various-speed ".concat(t," shots\n    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf"),window.Plotly.newPlot(t,[v(r,o[0],"slow",f(4)),v(r,o[1],"medium",f(5)),v(r,o[2],"fast",f(6))],a,c)}},{key:"plotRolls",value:function(t,e,n,i,o){var r=this,a=[],s=[];e.forEach(function(t){var e=[];s=[];for(var l=1;l<90;l+=1){s.push(l);var u=new P().plot(1,n(t),i(l),r.degToRad(o(l)));e.push(r.radToDeg(u))}a.push(e)});var l=M({},h);l.title.text="Throw effect (WIP)\n    <br>throw vs. cut angle for various-speed ".concat(t," shots\n    <br>from https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf"),window.Plotly.newPlot(t,[v(s,a[0],"0",f(4)),v(s,a[1],"0.25",f(5)),v(s,a[2],"0.5",f(6)),v(s,a[3],"1.0",f(7))],l,c)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();new p().plot(),new d().plot("mathaven-figure9-speed","mathaven-figure9-angle","<b>Figure.9</b> Rebound speed and rebound angle versus incident angle <br>\n    for different topspins of the ball, ωT0 = kV0/R and V0 = 1 m/s with no sidespin"),new d().plot("mathaven-figure10-speed","mathaven-figure10-angle","<b>Figure.10</b> Rebound speed and rebound angle versus incident angle <br>\nfor different sidespins of the ball,ωS0 = kV0/R and V0 = 1 m/s with the ball rolling (ωT0 = V0/R)",function(t){return t/.02625},function(t){return 38.095238095238095}),new k().plotCutAngle()},"./src/model/ball.ts":(t,e,n)=>{n.d(e,{c:()=>p,U:()=>v});var i=n("./src/utils/utils.ts"),o=n("./src/model/physics/physics.ts"),r=n("./node_modules/three/build/three.core.js"),a=n("./src/model/physics/constants.ts");function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var l=function(){var t;function e(t,n){if(!(this instanceof e))throw TypeError("Cannot call a class as a function");s(this,"line",void 0),s(this,"geometry",void 0),s(this,"positions",void 0),s(this,"lastPos",new r.Pq0),s(this,"lastVel",new r.Pq0),this.geometry=new r.LoY,this.positions=new Float32Array(3*t),this.geometry.setAttribute("position",new r.THS(this.positions,3)),this.reset();var i=new r.mrM({color:n,opacity:.25,linewidth:3,transparent:!0});this.line=new r.N1A(this.geometry,i),this.line.visible=!1}return t=[{key:"reset",value:function(){this.geometry.setDrawRange(0,0),this.lastVel.setZ(1)}},{key:"forceTrace",value:function(t){this.lastVel.z=1,this.addTraceGiven(t,this.lastVel,1,.1,1)}},{key:"addTrace",value:function(t,e){if(0!==e.length()){var n=this.lastVel.angleTo(e),i=n>Math.PI/32?.01*a.R:a.R,o=this.lastPos.distanceTo(t);this.addTraceGiven(t,e,o,i,n)}}},{key:"addTraceGiven",value:function(t,e,n,i,o){var r=this.geometry.drawRange.count;0!==r&&n<i||(r>1&&o<1e-4&&r--,this.lastPos.copy(t),this.lastVel.copy(e),this.addPoint(t,r))}},{key:"addPoint",value:function(t,e){var n=3*e;n>this.positions.length||(this.positions[n++]=t.x,this.positions[n++]=t.y,this.positions[n]=t.z,this.geometry.setDrawRange(0,e+1),this.line.geometry.attributes.position.needsUpdate=!0)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();function u(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c=function(){var t;function e(t){if(!(this instanceof e))throw TypeError("Cannot call a class as a function");u(this,"mesh",void 0),u(this,"shadow",void 0),u(this,"spinAxisArrow",void 0),u(this,"trace",void 0),u(this,"color",void 0),u(this,"m",new r.kn4),this.color=new r.Q1f(t),this.initialiseMesh(t)}return t=[{key:"updateAll",value:function(t,e){this.updatePosition(t.pos),this.updateArrows(t.pos,t.rvel,t.state),0!==t.rvel.lengthSq()&&(this.updateRotation(t.rvel,e),this.trace.addTrace(t.pos,t.vel))}},{key:"updatePosition",value:function(t){this.mesh.position.copy(t),this.shadow.position.copy(t)}},{key:"updateRotation",value:function(t,e){var n=t.length()*e;this.mesh.rotateOnWorldAxis((0,i.xb)(t),n)}},{key:"updateArrows",value:function(t,e,n){this.spinAxisArrow.setLength(a.R+a.R*e.length()/2,a.R,a.R),this.spinAxisArrow.position.copy(t),this.spinAxisArrow.setDirection((0,i.xb)(e)),n==v.Rolling?this.spinAxisArrow.setColor(0xcc0000):this.spinAxisArrow.setColor(52224)}},{key:"initialiseMesh",value:function(t){var e=new r.WBB(a.R,1),n=new r.tXL({emissive:0,flatShading:!0,vertexColors:!0,forceSinglePass:!0,shininess:25,specular:5592371});this.addDots(e,t),this.mesh=new r.eaF(e,n),this.mesh.name="ball",this.updateRotation(new r.Pq0().random(),100);var o=new r.tcD(.9*a.R,9);o.applyMatrix4(new r.kn4().identity().makeTranslation(0,0,-(.99*a.R)));var s=new r.V9B({color:1118498});this.shadow=new r.eaF(o,s),this.spinAxisArrow=new r.E0M(i.up,i.v_,2,0,.01,.01),this.spinAxisArrow.visible=!1,this.trace=new l(500,t)}},{key:"addDots",value:function(t,e){var n=this,i=t.attributes.position.count,o=new r.Q1f(e),a=new r.Q1f(0xaa2222);t.setAttribute("color",new r.THS(new Float32Array(3*i),3));for(var s=t.attributes.color,l=0;l<i/3;l++)this.colorVerticesForFace(l,s,this.scaleNoise(o.r),this.scaleNoise(o.g),this.scaleNoise(o.b));[0,96,111,156,186,195].forEach(function(t){n.colorVerticesForFace(t/3,s,a.r,a.g,a.b)})}},{key:"addToScene",value:function(t){t.add(this.mesh),t.add(this.shadow),t.add(this.spinAxisArrow),t.add(this.trace.line)}},{key:"colorVerticesForFace",value:function(t,e,n,i,o){e.setXYZ(3*t+0,n,i,o),e.setXYZ(3*t+1,n,i,o),e.setXYZ(3*t+2,n,i,o)}},{key:"scaleNoise",value:function(t){return(1-.25*Math.random())*t}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}();function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function f(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var v=function(t){return t.Stationary="Stationary",t.Rolling="Rolling",t.Sliding="Sliding",t.Falling="Falling",t.InPocket="InPocket",t}({}),p=function(){var t,e;function n(t,e){if(!(this instanceof n))throw TypeError("Cannot call a class as a function");f(this,"pos",void 0),f(this,"vel",i.v_.clone()),f(this,"rvel",i.v_.clone()),f(this,"futurePos",i.v_.clone()),f(this,"ballmesh",void 0),f(this,"state","Stationary"),f(this,"pocket",void 0),f(this,"id",n.id++),this.pos=t.clone(),this.ballmesh=new c(e||0xeeeeee*Math.random())}return t=[{key:"update",value:function(t){this.updatePosition(t),"Falling"==this.state?this.pocket.updateFall(this,t):this.updateVelocity(t)}},{key:"updateMesh",value:function(t){this.ballmesh.updateAll(this,t)}},{key:"updatePosition",value:function(t){this.pos.addScaledVector(this.vel,t)}},{key:"updateVelocity",value:function(t){this.inMotion()&&(this.isRolling()?(this.state="Rolling",(0,o.lx)(this.vel,this.rvel),this.addDelta(t,(0,o.JD)(this.rvel))):(this.state="Sliding",this.addDelta(t,(0,o.p2)(this.vel,this.rvel))))}},{key:"addDelta",value:function(t,e){e.v.multiplyScalar(t),e.w.multiplyScalar(t),this.passesZero(e)||(this.vel.add(e.v),this.rvel.add(e.w))}},{key:"passesZero",value:function(t){var e=(0,i.rq)(this.vel,t.v),n=(0,i.rq)(this.rvel,t.w);return!!(("Rolling"===this.state?e||n:e&&n)&&.01>Math.abs(this.rvel.z))&&(this.setStationary(),!0)}},{key:"setStationary",value:function(){this.vel.copy(i.v_),this.rvel.copy(i.v_),this.state="Stationary"}},{key:"isRolling",value:function(){return 0!==this.vel.lengthSq()&&0!==this.rvel.lengthSq()&&(0,o.Mq)(this.vel,this.rvel).length()<n.transition}},{key:"onTable",value:function(){return"Falling"!==this.state&&"InPocket"!==this.state}},{key:"inMotion",value:function(){return"Rolling"===this.state||"Sliding"===this.state||this.isFalling()}},{key:"isFalling",value:function(){return"Falling"===this.state}},{key:"futurePosition",value:function(t){return this.futurePos.copy(this.pos).addScaledVector(this.vel,t),this.futurePos}},{key:"fround",value:function(){this.pos.x=Math.fround(this.pos.x),this.pos.y=Math.fround(this.pos.y),this.vel.x=Math.fround(this.vel.x),this.vel.y=Math.fround(this.vel.y),this.rvel.x=Math.fround(this.rvel.x),this.rvel.y=Math.fround(this.rvel.y),this.rvel.z=Math.fround(this.rvel.z)}},{key:"serialise",value:function(){return{pos:this.pos.clone(),id:this.id}}}],e=[{key:"fromSerialised",value:function(t){return n.updateFromSerialised(new n((0,i.t6)(t.pos)),t)}},{key:"updateFromSerialised",value:function(t,e){var n,o;return t.pos.copy(e.pos),t.vel.copy(null!==(n=null==e?void 0:e.vel)&&void 0!==n?n:i.v_),t.rvel.copy(null!==(o=null==e?void 0:e.rvel)&&void 0!==o?o:i.v_),t.state="Stationary",t}}],t&&h(n.prototype,t),e&&h(n,e),n}();f(p,"id",0),f(p,"transition",.05)},"./src/model/physics/collision.ts":(t,e,n)=>{n.d(e,{F:()=>u});var i=n("./src/model/ball.ts"),o=n("./node_modules/three/build/three.core.js"),r=n("./src/model/physics/constants.ts"),a=n("./src/utils/utils.ts");function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var l=function(){var t;function e(){if(!(this instanceof e))throw TypeError("Cannot call a class as a function");s(this,"normalImpulse",void 0),s(this,"tangentialImpulse",void 0)}return t=[{key:"dynamicFriction",value:function(t){return .01+.108*(0,a.oN)(-1.088*t)}},{key:"updateVelocities",value:function(t,e){var n=u.positionsAtContact(t,e);t.ballmesh.trace.forceTrace(n.a),e.ballmesh.trace.forceTrace(n.b);var i=n.b.sub(n.a).normalize(),a=new o.Pq0(-i.y,i.x,0),s=t.vel.clone().sub(e.vel).add(i.clone().multiplyScalar(-r.R).cross(t.rvel).sub(i.clone().multiplyScalar(r.R).cross(e.rvel))),l=i.dot(s),c=s.addScaledVector(i,-l),h=c.length(),f=a.dot(c),v=this.dynamicFriction(h);this.normalImpulse=-1.99*l/(2/r.m),this.tangentialImpulse=-(.25*Math.min(v*Math.abs(this.normalImpulse)/h,1/7)*f);var p=i.clone().multiplyScalar(this.normalImpulse),d=a.clone().multiplyScalar(this.tangentialImpulse);t.vel.addScaledVector(p,1/r.m).addScaledVector(d,1/r.m),e.vel.addScaledVector(p,-1/r.m).addScaledVector(d,-1/r.m);var y=i.clone().multiplyScalar(-r.R).cross(d),b=i.clone().multiplyScalar(r.R).cross(d);return t.rvel.addScaledVector(y,1/r.I),e.rvel.addScaledVector(b,1/r.I),l}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}(),u=function(){var t;function e(){if(!(this instanceof e))throw TypeError("Cannot call a class as a function")}return t=[{key:"willCollide",value:function(t,e,n){return(t.inMotion()||e.inMotion())&&t.onTable()&&e.onTable()&&t.futurePosition(n).distanceToSquared(e.futurePosition(n))<4*r.R*r.R}},{key:"collide",value:function(t,n){return e.updateVelocities(t,n)}},{key:"positionsAtContact",value:function(t,e){var n=t.pos.distanceTo(e.pos),i=t.vel.clone().sub(e.vel),o=(n-2*r.R)/i.length()||0;return{a:t.pos.clone().addScaledVector(t.vel,o),b:e.pos.clone().addScaledVector(e.vel,o)}}},{key:"updateVelocities",value:function(t,n){var o=e.model.updateVelocities(t,n);return t.state=i.U.Sliding,n.state=i.U.Sliding,o}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e,t),e}();!function(t,e,n){e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n}(u,"model",new l)},"./src/model/physics/constants.ts":(t,e,n)=>{n.d(e,{I:()=>r,Mz:()=>i,PX:()=>O,Qg:()=>P,R:()=>f,Wv:()=>k,Ys:()=>R,Z3:()=>b,_m:()=>y,cM:()=>x,e:()=>v,ee:()=>p,g:()=>a,gT:()=>u,gf:()=>l,jG:()=>w,kL:()=>c,kM:()=>S,ki:()=>F,ko:()=>A,m:()=>h,mu:()=>s,o5:()=>g,oV:()=>d,x3:()=>o,xO:()=>M});var i,o,r,a=9.8,s=.00985,l=.16,u=.85,c=.034,h=.23,f=.03275,v=.86,p=.98,d=.212,y=.14,b=.4,g=Math.sqrt(21)/5;function m(){i=s*h*a*2/3*c,o=7/(5*Math.sqrt(2))*f*s*h*a,r=.4*h*f*f}function w(t){f=t,m()}function P(t){h=t,m()}function M(t){s=t,m()}function k(t){c=t,m()}function R(t){l=t}function x(t){v=t}function S(t){u=t}function A(t){d=t}function F(t){y=t}function O(t){p=t}m()},"./src/model/physics/mathaven.ts":(t,e,n)=>{n.d(e,{z:()=>a});var i=n("./src/utils/utils.ts"),o=n("./src/model/physics/constants.ts");function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var a=function(){var t;function e(t,n,i,o,a){if(!(this instanceof e))throw TypeError("Cannot call a class as a function");r(this,"P",0),r(this,"WzI",0),r(this,"vx",void 0),r(this,"vy",void 0),r(this,"ωx",void 0),r(this,"ωy",void 0),r(this,"ωz",void 0),r(this,"s",void 0),r(this,"φ",void 0),r(this,"sʹ",void 0),r(this,"φʹ",void 0),r(this,"i",0),r(this,"N",100),r(this,"M",void 0),r(this,"R",void 0),r(this,"μs",void 0),r(this,"μw",void 0),r(this,"ee",void 0),this.M=t,this.R=n,this.ee=i,this.μs=o,this.μw=a}return t=[{key:"updateSlipSpeedsAndAngles",value:function(){var t=this.R,e=this.vx+this.ωy*t*o.Z3-this.ωz*t*o.o5,n=-this.vy*o.Z3+this.ωx*t,r=this.vx-this.ωy*t,a=this.vy+this.ωx*t;this.s=(0,i.RZ)((0,i.n7)(e,2)+(0,i.n7)(n,2)),this.φ=(0,i.FP)(n,e),this.φ<0&&(this.φ+=2*Math.PI),this.sʹ=(0,i.RZ)((0,i.n7)(r,2)+(0,i.n7)(a,2)),this.φʹ=(0,i.FP)(a,r),this.φʹ<0&&(this.φʹ+=2*Math.PI)}},{key:"compressionPhase",value:function(){for(var t=Math.max(this.M*this.vy/this.N,.001);this.vy>0;)this.updateSingleStep(t)}},{key:"restitutionPhase",value:function(t){var e=Math.max(t/this.N,.001);for(this.WzI=0;this.WzI<t;)this.updateSingleStep(e)}},{key:"updateSingleStep",value:function(t){if(this.updateSlipSpeedsAndAngles(),this.updateVelocity(t),this.updateAngularVelocity(t),this.updateWorkDone(t),this.i++>10*this.N)throw Error("Solution not found")}},{key:"updateVelocity",value:function(t){var e=this.μs,n=this.μw,r=this.M;this.vx-=1/r*(n*(0,i.gn)(this.φ)+e*(0,i.gn)(this.φʹ)*(o.Z3+n*(0,i.F8)(this.φ)*o.o5))*t,this.vy-=1/r*(o.o5-n*o.Z3*(0,i.F8)(this.φ)+e*(0,i.F8)(this.φʹ)*(o.Z3+n*(0,i.F8)(this.φ)*o.o5))*t}},{key:"updateAngularVelocity",value:function(t){var e=this.μs,n=this.μw,r=this.M,a=this.R;this.ωx+=-(5/(2*r*a))*(n*(0,i.F8)(this.φ)+e*(0,i.F8)(this.φʹ)*(o.Z3+n*(0,i.F8)(this.φ)*o.o5))*t,this.ωy+=-(5/(2*r*a))*(n*(0,i.gn)(this.φ)*o.Z3-e*(0,i.gn)(this.φʹ)*(o.Z3+n*(0,i.F8)(this.φ)*o.o5))*t,this.ωz+=5/(2*r*a)*(n*(0,i.gn)(this.φ)*o.o5)*t}},{key:"updateWorkDone",value:function(t){var e=t*Math.abs(this.vy);this.WzI+=e,this.P+=t}},{key:"solvePaper",value:function(t,e,n,o){this.solve(t*(0,i.gn)(e),t*(0,i.F8)(e),-o*(0,i.F8)(e),o*(0,i.gn)(e),n)}},{key:"solve",value:function(t,e,n,i,o){this.vx=t,this.vy=e,this.ωx=n,this.ωy=i,this.ωz=o,this.WzI=0,this.P=0,this.i=0,this.compressionPhase();var r=this.ee*this.ee*this.WzI;this.restitutionPhase(r)}}],function(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}(e.prototype,t),e}()},"./src/model/physics/physics.ts":(t,e,n)=>{n.d(e,{$8:()=>S,Gp:()=>w,JD:()=>h,Mq:()=>l,QK:()=>v,QV:()=>x,Qy:()=>O,Un:()=>m,c0:()=>g,lx:()=>f,p2:()=>c,s0:()=>b,t6:()=>T,yO:()=>P});var i=n("./node_modules/three/build/three.core.js"),o=n("./src/utils/utils.ts"),r=n("./src/model/physics/constants.ts"),a=n("./src/model/physics/mathaven.ts"),s=new i.Pq0;function l(t,e){return s.copy(t).addScaledVector((0,o.KM)(e),r.R)}var u={v:new i.Pq0,w:new i.Pq0};function c(t,e){var n=l(t,e).setZ(0);return u.v.copy((0,o.xb)(n).multiplyScalar(-r.gf*r.g)),u.w.copy((0,o.xb)((0,o.KM)(n)).multiplyScalar(2.5*r.gf*r.g/r.R)),u.w.setZ(-2.5*(r.Mz/(r.m*r.R*r.R))*Math.sign(e.z)),u}function h(t){var e=new i.Pq0(t.x,t.y,0).length(),n=5/7*r.x3/(r.m*r.R)/e,o=5/7*r.x3/(r.m*r.R*r.R)/e;return u.v.set(-n*t.y,n*t.x,0),u.w.set(-o*t.x,-o*t.y,-2.5*(r.Mz/(r.m*r.R*r.R))*Math.sign(t.z)),u}function f(t,e){var n=e.z;e.copy((0,o.KM)(t).multiplyScalar(1/r.R)),e.setZ(n)}function v(t,e,n,i){var r=i(e.clone().applyAxisAngle(o.up,t),n.clone().applyAxisAngle(o.up,t));return r.v.applyAxisAngle(o.up,-t),r.w.applyAxisAngle(o.up,-t),r}Object.freeze(u);var p=Math.asin(.1*r.R/r.R),d=(0,o.F8)(p),y=(0,o.gn)(p);function b(t,e){return new i.Pq0(t.x*d-t.z*y+r.R*e.y,-t.y-r.R*e.z*y+r.R*e.x*d)}function g(t){return t.x*y}function m(t){var e=3.5/r.m;return t.length()/e}function w(t){var e,n=1/r.m,o=.39+.257*(e=new i.Pq0(t/y,0,0)).x-.044*e.x*e.x;return r.gT*((1+o)*t)/n}function P(t,e){var n=w(g(t));return m(b(t,e))<=n}function M(t,e){return{c:g(t),s:b(t,e),A:3.5/r.m,B:1/r.m}}function k(t,e){var n=M(t,e),i=n.c,o=n.s,a=n.A,s=n.B,l=(1+r.e)*(i/s);return A(-o.x/a*d-l*y,o.y/a,o.x/a*y-l*d)}function R(t,e){var n,i=M(t,e),o=i.c,a=i.B,s=(1+r.e)*(o/a),l=.471-.241*Math.atan2(Math.abs((n=t).y),n.x),u=Math.atan2(t.y,t.x),c=Math.cos(u);return A(-l*s*c*y-s*y,l*s*Math.sin(u),l*s*c*y-s*d)}function x(t,e){return P(t,e)?k(t,e):R(t,e)}function S(t,e){var n=k(t,e),i=R(t,e),o=Math.sign(t.y)===Math.sign(e.z)?Math.cos(Math.atan2(t.y,t.x)):1;return{v:i.v.lerp(n.v,o),w:i.w.lerp(n.w,o)}}function A(t,e,n){return{v:new i.Pq0(t/r.m,e/r.m),w:new i.Pq0(-r.R/r.I*e*d,r.R/r.I*(t*d-n*y),r.R/r.I*e*y)}}function F(t,e){var n=new a.z(r.m,r.R,r.ee,r.oV,r._m+.1);n.solve(t.x,t.y,e.x,e.y,e.z);var o=new i.Pq0(n.vx,n.vy,0),s=new i.Pq0(n.ωx,n.ωy,n.ωz);return{v:o.sub(t),w:s.sub(e)}}function O(t,e){return v(Math.PI/2,t,e,F)}function T(t,e){var n=Math.atan2(-t.x,t.y),i=2.5*e.length()*(t.length()*r.R)/(r.R*r.R),a=e.clone().normalize();return(0,o.KM)(a).applyAxisAngle(a,n).multiplyScalar(i)}},"./src/utils/utils.ts":(t,e,n)=>{n.d(e,{Dz:()=>v,F8:()=>g,FP:()=>y,KM:()=>l,RZ:()=>w,gn:()=>m,ld:()=>d,n7:()=>b,oN:()=>P,rq:()=>f,t6:()=>a,up:()=>r,v_:()=>o,xb:()=>c});var i=n("./node_modules/three/build/three.core.js"),o=new i.Pq0(0,0,0),r=new i.Pq0(0,0,1);function a(t){return new i.Pq0(t.x,t.y,t.z)}var s=new i.Pq0;function l(t){return s.copy(r).cross(t)}var u=new i.Pq0;function c(t){return u.copy(t).normalize()}var h=new i.Pq0;function f(t,e){return 0>=h.copy(t).add(e).dot(t)}function v(t){return new i.Pq0(1,0,0).applyAxisAngle(r,t)}function p(t){return Math.sign(t)*Math.floor((Math.abs(t)+Number.EPSILON)*1e4)/1e4}function d(t){return t.x=p(t.x),t.y=p(t.y),t.z=p(t.z),t}function y(t,e){return Math.fround(Math.atan2(t,e))}function b(t,e){return Math.fround(Math.pow(t,e))}function g(t){return Math.fround(Math.sin(t))}function m(t){return Math.fround(Math.cos(t))}function w(t){return Math.fround(Math.sqrt(t))}function P(t){return Math.fround(Math.exp(t))}}},t=>{t(t.s="./src/mathaven.ts")}]);