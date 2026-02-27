"use strict";(self.webpackChunkbilliards=self.webpackChunkbilliards||[]).push([[910],{9437(e,t,i){i.d(t,{JeP:()=>tG});var r=i(4922);function a(){let e=null,t=!1,i=null,r=null;function a(t,n){i(t,n),r=e.requestAnimationFrame(a)}return{start:function(){!0===t||null!==i&&(r=e.requestAnimationFrame(a),t=!0)},stop:function(){e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){i=e},setContext:function(t){e=t}}}function n(e){let t=new WeakMap;return{get:function(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)},remove:function(i){i.isInterleavedBufferAttribute&&(i=i.data);let r=t.get(i);r&&(e.deleteBuffer(r.buffer),t.delete(i))},update:function(i,r){if(i.isInterleavedBufferAttribute&&(i=i.data),i.isGLBufferAttribute){let e=t.get(i);(!e||e.version<i.version)&&t.set(i,{buffer:i.buffer,type:i.type,bytesPerElement:i.elementSize,version:i.version});return}let a=t.get(i);if(void 0===a)t.set(i,function(t,i){let r,a=t.array,n=t.usage,o=a.byteLength,l=e.createBuffer();if(e.bindBuffer(i,l),e.bufferData(i,a,n),t.onUploadCallback(),a instanceof Float32Array)r=e.FLOAT;else if("u">typeof Float16Array&&a instanceof Float16Array)r=e.HALF_FLOAT;else if(a instanceof Uint16Array)r=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(a instanceof Int16Array)r=e.SHORT;else if(a instanceof Uint32Array)r=e.UNSIGNED_INT;else if(a instanceof Int32Array)r=e.INT;else if(a instanceof Int8Array)r=e.BYTE;else if(a instanceof Uint8Array)r=e.UNSIGNED_BYTE;else if(a instanceof Uint8ClampedArray)r=e.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+a);return{buffer:l,type:r,bytesPerElement:a.BYTES_PER_ELEMENT,version:t.version,size:o}}(i,r));else if(a.version<i.version){if(a.size!==i.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");!function(t,i,r){let a=i.array,n=i.updateRanges;if(e.bindBuffer(r,t),0===n.length)e.bufferSubData(r,0,a);else{n.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<n.length;e++){let i=n[t],r=n[e];r.start<=i.start+i.count+1?i.count=Math.max(i.count,r.start+r.count-i.start):n[++t]=r}n.length=t+1;for(let t=0,i=n.length;t<i;t++){let i=n[t];e.bufferSubData(r,i.start*a.BYTES_PER_ELEMENT,a,i.start,i.count)}i.clearUpdateRanges()}i.onUploadCallback()}(a.buffer,i,r),a.version=i.version}}}}let o={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT )
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN )
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:"gl_FragColor = linearToOutputTexel( gl_FragColor );",colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS

		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN

		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );

		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );

		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );

		irradiance *= sheenEnergyComp;

	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER

		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {

	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif

				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN

		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;

	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},l={common:{diffuse:{value:new r.Q1f(0xffffff)},opacity:{value:1},map:{value:null},mapTransform:{value:new r.dwI},alphaMap:{value:null},alphaMapTransform:{value:new r.dwI},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new r.dwI}},envmap:{envMap:{value:null},envMapRotation:{value:new r.dwI},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new r.dwI}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new r.dwI}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new r.dwI},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new r.dwI},normalScale:{value:new r.I9Y(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new r.dwI},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new r.dwI}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new r.dwI}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new r.dwI}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new r.Q1f(0xffffff)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new r.Q1f(0xffffff)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new r.dwI},alphaTest:{value:0},uvTransform:{value:new r.dwI}},sprite:{diffuse:{value:new r.Q1f(0xffffff)},opacity:{value:1},center:{value:new r.I9Y(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new r.dwI},alphaMap:{value:null},alphaMapTransform:{value:new r.dwI},alphaTest:{value:0}}},s={basic:{uniforms:(0,r.Iit)([l.common,l.specularmap,l.envmap,l.aomap,l.lightmap,l.fog]),vertexShader:o.meshbasic_vert,fragmentShader:o.meshbasic_frag},lambert:{uniforms:(0,r.Iit)([l.common,l.specularmap,l.envmap,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.fog,l.lights,{emissive:{value:new r.Q1f(0)},envMapIntensity:{value:1}}]),vertexShader:o.meshlambert_vert,fragmentShader:o.meshlambert_frag},phong:{uniforms:(0,r.Iit)([l.common,l.specularmap,l.envmap,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.fog,l.lights,{emissive:{value:new r.Q1f(0)},specular:{value:new r.Q1f(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:o.meshphong_vert,fragmentShader:o.meshphong_frag},standard:{uniforms:(0,r.Iit)([l.common,l.envmap,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.roughnessmap,l.metalnessmap,l.fog,l.lights,{emissive:{value:new r.Q1f(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:o.meshphysical_vert,fragmentShader:o.meshphysical_frag},toon:{uniforms:(0,r.Iit)([l.common,l.aomap,l.lightmap,l.emissivemap,l.bumpmap,l.normalmap,l.displacementmap,l.gradientmap,l.fog,l.lights,{emissive:{value:new r.Q1f(0)}}]),vertexShader:o.meshtoon_vert,fragmentShader:o.meshtoon_frag},matcap:{uniforms:(0,r.Iit)([l.common,l.bumpmap,l.normalmap,l.displacementmap,l.fog,{matcap:{value:null}}]),vertexShader:o.meshmatcap_vert,fragmentShader:o.meshmatcap_frag},points:{uniforms:(0,r.Iit)([l.points,l.fog]),vertexShader:o.points_vert,fragmentShader:o.points_frag},dashed:{uniforms:(0,r.Iit)([l.common,l.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:o.linedashed_vert,fragmentShader:o.linedashed_frag},depth:{uniforms:(0,r.Iit)([l.common,l.displacementmap]),vertexShader:o.depth_vert,fragmentShader:o.depth_frag},normal:{uniforms:(0,r.Iit)([l.common,l.bumpmap,l.normalmap,l.displacementmap,{opacity:{value:1}}]),vertexShader:o.meshnormal_vert,fragmentShader:o.meshnormal_frag},sprite:{uniforms:(0,r.Iit)([l.sprite,l.fog]),vertexShader:o.sprite_vert,fragmentShader:o.sprite_frag},background:{uniforms:{uvTransform:{value:new r.dwI},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:o.background_vert,fragmentShader:o.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new r.dwI}},vertexShader:o.backgroundCube_vert,fragmentShader:o.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:o.cube_vert,fragmentShader:o.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:o.equirect_vert,fragmentShader:o.equirect_frag},distance:{uniforms:(0,r.Iit)([l.common,l.displacementmap,{referencePosition:{value:new r.Pq0},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:o.distance_vert,fragmentShader:o.distance_frag},shadow:{uniforms:(0,r.Iit)([l.lights,l.fog,{color:{value:new r.Q1f(0)},opacity:{value:1}}]),vertexShader:o.shadow_vert,fragmentShader:o.shadow_frag}};s.physical={uniforms:(0,r.Iit)([s.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new r.dwI},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new r.dwI},clearcoatNormalScale:{value:new r.I9Y(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new r.dwI},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new r.dwI},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new r.dwI},sheen:{value:0},sheenColor:{value:new r.Q1f(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new r.dwI},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new r.dwI},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new r.dwI},transmissionSamplerSize:{value:new r.I9Y},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new r.dwI},attenuationDistance:{value:0},attenuationColor:{value:new r.Q1f(0)},specularColor:{value:new r.Q1f(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new r.dwI},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new r.dwI},anisotropyVector:{value:new r.I9Y},anisotropyMap:{value:null},anisotropyMapTransform:{value:new r.dwI}}]),vertexShader:o.meshphysical_vert,fragmentShader:o.meshphysical_frag};let c={r:0,b:0,g:0},d=new r.O9p,u=new r.kn4;function f(e,t,i,a,n,o){let l,f,p=new r.Q1f(0),m=+(!0!==n),h=null,_=0,g=null;function v(e){let i=!0===e.isScene?e.background:null;if(i&&i.isTexture){let r=e.backgroundBlurriness>0;i=t.get(i,r)}return i}function E(t,a){t.getRGB(c,(0,r._Ut)(e)),i.buffers.color.setClear(c.r,c.g,c.b,a,o)}return{getClearColor:function(){return p},setClearColor:function(e,t=1){p.set(e),E(p,m=t)},getClearAlpha:function(){return m},setClearAlpha:function(e){E(p,m=e)},render:function(t){let r=!1,a=v(t);null===a?E(p,m):a&&a.isColor&&(E(a,1),r=!0);let n=e.xr.getEnvironmentBlendMode();"additive"===n?i.buffers.color.setClear(0,0,0,1,o):"alpha-blend"===n&&i.buffers.color.setClear(0,0,0,0,o),(e.autoClear||r)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))},addToRenderList:function(t,i){let n=v(i);n&&(n.isCubeTexture||n.mapping===r.Om)?(void 0===f&&((f=new r.eaF(new r.iNn(1,1,1),new r.BKk({name:"BackgroundCubeMaterial",uniforms:(0,r.lxW)(s.backgroundCube.uniforms),vertexShader:s.backgroundCube.vertexShader,fragmentShader:s.backgroundCube.fragmentShader,side:r.hsX,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1}))).geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(e,t,i){this.matrixWorld.copyPosition(i.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(f)),d.copy(i.backgroundRotation),d.x*=-1,d.y*=-1,d.z*=-1,n.isCubeTexture&&!1===n.isRenderTargetTexture&&(d.y*=-1,d.z*=-1),f.material.uniforms.envMap.value=n,f.material.uniforms.flipEnvMap.value=n.isCubeTexture&&!1===n.isRenderTargetTexture?-1:1,f.material.uniforms.backgroundBlurriness.value=i.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=i.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(u.makeRotationFromEuler(d)),f.material.toneMapped=r.ppV.getTransfer(n.colorSpace)!==r.KLL,(h!==n||_!==n.version||g!==e.toneMapping)&&(f.material.needsUpdate=!0,h=n,_=n.version,g=e.toneMapping),f.layers.enableAll(),t.unshift(f,f.geometry,f.material,0,0,null)):n&&n.isTexture&&(void 0===l&&((l=new r.eaF(new r.bdM(2,2),new r.BKk({name:"BackgroundMaterial",uniforms:(0,r.lxW)(s.background.uniforms),vertexShader:s.background.vertexShader,fragmentShader:s.background.fragmentShader,side:r.hB5,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1}))).geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(l)),l.material.uniforms.t2D.value=n,l.material.uniforms.backgroundIntensity.value=i.backgroundIntensity,l.material.toneMapped=r.ppV.getTransfer(n.colorSpace)!==r.KLL,!0===n.matrixAutoUpdate&&n.updateMatrix(),l.material.uniforms.uvTransform.value.copy(n.matrix),(h!==n||_!==n.version||g!==e.toneMapping)&&(l.material.needsUpdate=!0,h=n,_=n.version,g=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null))},dispose:function(){void 0!==f&&(f.geometry.dispose(),f.material.dispose(),f=void 0),void 0!==l&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}}}function p(e,t){let i=e.getParameter(e.MAX_VERTEX_ATTRIBS),a={},n=d(null),o=n,l=!1;function s(t){return e.bindVertexArray(t)}function c(t){return e.deleteVertexArray(t)}function d(e){let t=[],r=[],a=[];for(let e=0;e<i;e++)t[e]=0,r[e]=0,a[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:a,object:e,attributes:{},index:null}}function u(){let e=o.newAttributes;for(let t=0,i=e.length;t<i;t++)e[t]=0}function f(e){p(e,0)}function p(t,i){let r=o.newAttributes,a=o.enabledAttributes,n=o.attributeDivisors;r[t]=1,0===a[t]&&(e.enableVertexAttribArray(t),a[t]=1),n[t]!==i&&(e.vertexAttribDivisor(t,i),n[t]=i)}function m(){let t=o.newAttributes,i=o.enabledAttributes;for(let r=0,a=i.length;r<a;r++)i[r]!==t[r]&&(e.disableVertexAttribArray(r),i[r]=0)}function h(t,i,r,a,n,o,l){!0===l?e.vertexAttribIPointer(t,i,r,n,o):e.vertexAttribPointer(t,i,r,a,n,o)}function _(){g(),l=!0,o!==n&&s((o=n).object)}function g(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:function(i,n,c,_,g){var v,E,S;let M,T,x,R,A,b,C=!1,P=(v=i,E=_,S=c,M=!0===n.wireframe,void 0===(T=a[E.id])&&(T={},a[E.id]=T),void 0===(R=T[x=!0===v.isInstancedMesh?v.id:0])&&(R={},T[x]=R),void 0===(A=R[S.id])&&(A={},R[S.id]=A),void 0===(b=A[M])&&(b=d(e.createVertexArray()),A[M]=b),b);o!==P&&s((o=P).object),(C=function(e,t,i,r){let a=o.attributes,n=t.attributes,l=0,s=i.getAttributes();for(let t in s)if(s[t].location>=0){let i=a[t],r=n[t];if(void 0===r&&("instanceMatrix"===t&&e.instanceMatrix&&(r=e.instanceMatrix),"instanceColor"===t&&e.instanceColor&&(r=e.instanceColor)),void 0===i||i.attribute!==r||r&&i.data!==r.data)return!0;l++}return o.attributesNum!==l||o.index!==r}(i,_,c,g))&&function(e,t,i,r){let a={},n=t.attributes,l=0,s=i.getAttributes();for(let t in s)if(s[t].location>=0){let i=n[t];void 0===i&&("instanceMatrix"===t&&e.instanceMatrix&&(i=e.instanceMatrix),"instanceColor"===t&&e.instanceColor&&(i=e.instanceColor));let r={};r.attribute=i,i&&i.data&&(r.data=i.data),a[t]=r,l++}o.attributes=a,o.attributesNum=l,o.index=r}(i,_,c,g),null!==g&&t.update(g,e.ELEMENT_ARRAY_BUFFER),(C||l)&&(l=!1,function(i,a,n,o){u();let l=o.attributes,s=n.getAttributes(),c=a.defaultAttributeValues;for(let a in s){let n=s[a];if(n.location>=0){let s=l[a];if(void 0===s&&("instanceMatrix"===a&&i.instanceMatrix&&(s=i.instanceMatrix),"instanceColor"===a&&i.instanceColor&&(s=i.instanceColor)),void 0!==s){let a=s.normalized,l=s.itemSize,c=t.get(s);if(void 0===c)continue;let d=c.buffer,u=c.type,m=c.bytesPerElement,_=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===r.Yuy;if(s.isInterleavedBufferAttribute){let t=s.data,r=t.stride,c=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<n.locationSize;e++)p(n.location+e,t.meshPerAttribute);!0!==i.isInstancedMesh&&void 0===o._maxInstanceCount&&(o._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<n.locationSize;e++)f(n.location+e);e.bindBuffer(e.ARRAY_BUFFER,d);for(let e=0;e<n.locationSize;e++)h(n.location+e,l/n.locationSize,u,a,r*m,(c+l/n.locationSize*e)*m,_)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<n.locationSize;e++)p(n.location+e,s.meshPerAttribute);!0!==i.isInstancedMesh&&void 0===o._maxInstanceCount&&(o._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<n.locationSize;e++)f(n.location+e);e.bindBuffer(e.ARRAY_BUFFER,d);for(let e=0;e<n.locationSize;e++)h(n.location+e,l/n.locationSize,u,a,l*m,l/n.locationSize*e*m,_)}}else if(void 0!==c){let t=c[a];if(void 0!==t)switch(t.length){case 2:e.vertexAttrib2fv(n.location,t);break;case 3:e.vertexAttrib3fv(n.location,t);break;case 4:e.vertexAttrib4fv(n.location,t);break;default:e.vertexAttrib1fv(n.location,t)}}}}m()}(i,n,c,_),null!==g&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(g).buffer))},reset:_,resetDefaultState:g,dispose:function(){for(let e in _(),a){let t=a[e];for(let e in t){let i=t[e];for(let e in i){let t=i[e];for(let e in t)c(t[e].object),delete t[e];delete i[e]}}delete a[e]}},releaseStatesOfGeometry:function(e){if(void 0===a[e.id])return;let t=a[e.id];for(let e in t){let i=t[e];for(let e in i){let t=i[e];for(let e in t)c(t[e].object),delete t[e];delete i[e]}}delete a[e.id]},releaseStatesOfObject:function(e){for(let t in a){let i=a[t],r=!0===e.isInstancedMesh?e.id:0,n=i[r];if(void 0!==n){for(let e in n){let t=n[e];for(let e in t)c(t[e].object),delete t[e];delete n[e]}delete i[r],0===Object.keys(i).length&&delete a[t]}}},releaseStatesOfProgram:function(e){for(let t in a){let i=a[t];for(let t in i){let r=i[t];if(void 0===r[e.id])continue;let a=r[e.id];for(let e in a)c(a[e].object),delete a[e];delete r[e.id]}}},initAttributes:u,enableAttribute:f,disableUnusedAttributes:m}}function m(e,t,i){let r;function a(t,a,n){0!==n&&(e.drawArraysInstanced(r,t,a,n),i.update(a,r,n))}this.setMode=function(e){r=e},this.render=function(t,a){e.drawArrays(r,t,a),i.update(a,r,1)},this.renderInstances=a,this.renderMultiDraw=function(e,a,n){if(0===n)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,e,0,a,0,n);let o=0;for(let e=0;e<n;e++)o+=a[e];i.update(o,r,1)},this.renderMultiDrawInstances=function(e,n,o,l){if(0===o)return;let s=t.get("WEBGL_multi_draw");if(null===s)for(let t=0;t<e.length;t++)a(e[t],n[t],l[t]);else{s.multiDrawArraysInstancedWEBGL(r,e,0,n,0,l,0,o);let t=0;for(let e=0;e<o;e++)t+=n[e]*l[e];i.update(t,r,1)}}}function h(e,t,i,a){let n;function o(t){if("highp"===t){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";t="mediump"}return"mediump"===t&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=void 0!==i.precision?i.precision:"highp",s=o(l);return s!==l&&((0,r.R8M)("WebGLRenderer:",l,"not supported, using",s,"instead."),l=s),{isWebGL2:!0,getMaxAnisotropy:function(){if(void 0!==n)return n;if(!0===t.has("EXT_texture_filter_anisotropic")){let i=t.get("EXT_texture_filter_anisotropic");n=e.getParameter(i.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n},getMaxPrecision:o,textureFormatReadable:function(t){return t===r.GWd||a.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)},textureTypeReadable:function(i){let n=i===r.ix0&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return i===r.OUM||a.convert(i)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)||i===r.RQf||!!n},precision:l,logarithmicDepthBuffer:!0===i.logarithmicDepthBuffer,reversedDepthBuffer:!0===i.reversedDepthBuffer&&t.has("EXT_clip_control"),maxTextures:e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),maxVertexTextures:e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),maxTextureSize:e.getParameter(e.MAX_TEXTURE_SIZE),maxCubemapSize:e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),maxAttributes:e.getParameter(e.MAX_VERTEX_ATTRIBS),maxVertexUniforms:e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),maxVaryings:e.getParameter(e.MAX_VARYING_VECTORS),maxFragmentUniforms:e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),maxSamples:e.getParameter(e.MAX_SAMPLES),samples:e.getParameter(e.SAMPLES)}}function _(e){let t=this,i=null,a=0,n=!1,o=!1,l=new r.Zcv,s=new r.dwI,c={value:null,needsUpdate:!1};function d(e,i,r,a){let n=null!==e?e.length:0,o=null;if(0!==n){if(o=c.value,!0!==a||null===o){let t=r+4*n,a=i.matrixWorldInverse;s.getNormalMatrix(a),(null===o||o.length<t)&&(o=new Float32Array(t));for(let t=0,i=r;t!==n;++t,i+=4)l.copy(e[t]).applyMatrix4(a,s),l.normal.toArray(o,i),o[i+3]=l.constant}c.value=o,c.needsUpdate=!0}return t.numPlanes=n,t.numIntersection=0,o}this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let i=0!==e.length||t||0!==a||n;return n=t,a=e.length,i},this.beginShadows=function(){o=!0,d(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(e,t){i=d(e,t,0)},this.setState=function(r,l,s){let u=r.clippingPlanes,f=r.clipIntersection,p=r.clipShadows,m=e.get(r);if(n&&null!==u&&0!==u.length&&(!o||p)){let e=o?0:a,t=4*e,r=m.clippingState||null;c.value=r,r=d(u,l,t,s);for(let e=0;e!==t;++e)r[e]=i[e];m.clippingState=r,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}else o?d(null):(c.value!==i&&(c.value=i,c.needsUpdate=a>0),t.numPlanes=a,t.numIntersection=0)}}let g=893!=i.j?[.125,.215,.35,.446,.526,.582]:null,v=new r.qUd,E=new r.Q1f,S=null,M=0,T=0,x=!1,R=new r.Pq0;class A{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,a={}){let{size:n=256,position:o=R}=a;S=this._renderer.getRenderTarget(),M=this._renderer.getActiveCubeFace(),T=this._renderer.getActiveMipmapLevel(),x=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(n);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){null===this._cubemapMaterial&&(this._cubemapMaterial=L(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){null===this._equirectMaterial&&(this._equirectMaterial=P(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),null!==this._cubemapMaterial&&this._cubemapMaterial.dispose(),null!==this._equirectMaterial&&this._equirectMaterial.dispose(),null!==this._backgroundBox&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){null!==this._blurMaterial&&this._blurMaterial.dispose(),null!==this._ggxMaterial&&this._ggxMaterial.dispose(),null!==this._pingPongRenderTarget&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(S,M,T),this._renderer.xr.enabled=x,e.scissorTest=!1,C(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===r.hy7||e.mapping===r.xFO?this._setSize(0===e.image.length?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),S=this._renderer.getRenderTarget(),M=this._renderer.getActiveCubeFace(),T=this._renderer.getActiveMipmapLevel(),x=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:r.k6q,minFilter:r.k6q,generateMipmaps:!1,type:r.ix0,format:r.GWd,colorSpace:r.Zr2,depthBuffer:!1},a=b(e,t,i);if(null===this._pingPongRenderTarget||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){var n,o,l,s,c,d;let a,u;null!==this._pingPongRenderTarget&&this._dispose(),this._pingPongRenderTarget=b(e,t,i);let{_lodMax:f}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=function(e){let t=[],i=[],a=[],n=e,o=e-4+1+g.length;for(let l=0;l<o;l++){let o=Math.pow(2,n);t.push(o);let s=1/o;l>e-4?s=g[l-e+4-1]:0===l&&(s=0),i.push(s);let c=1/(o-2),d=-c,u=1+c,f=[d,d,u,d,u,u,d,d,u,u,d,u],p=new Float32Array(108),m=new Float32Array(72),h=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,i=e>2?0:-1,r=[t,i,0,t+2/3,i,0,t+2/3,i+1,0,t,i,0,t+2/3,i+1,0,t,i+1,0];p.set(r,18*e),m.set(f,12*e);let a=[e,e,e,e,e,e];h.set(a,6*e)}let _=new r.LoY;_.setAttribute("position",new r.THS(p,3)),_.setAttribute("uv",new r.THS(m,2)),_.setAttribute("faceIndex",new r.THS(h,1)),a.push(new r.eaF(_,null)),n>4&&n--}return{lodMeshes:a,sizeLods:t,sigmas:i}}(f)),this._blurMaterial=(n=f,o=e,l=t,a=new Float32Array(20),u=new r.Pq0(0,1,0),new r.BKk({name:"SphericalGaussianBlur",defines:{n:20,CUBEUV_TEXEL_WIDTH:1/o,CUBEUV_TEXEL_HEIGHT:1/l,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:a},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:u}},vertexShader:U(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:r.XIg,depthTest:!1,depthWrite:!1})),this._ggxMaterial=(s=f,c=e,d=t,new r.BKk({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:256,CUBEUV_TEXEL_WIDTH:1/c,CUBEUV_TEXEL_HEIGHT:1/d,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:U(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:r.XIg,depthTest:!1,depthWrite:!1}))}return a}_compileMaterial(e){let t=new r.eaF(new r.LoY,e);this._renderer.compile(t,v)}_sceneToCubeUV(e,t,i,a,n){let o=new r.ubm(90,1,t,i),l=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,d=c.autoClear,u=c.toneMapping;c.getClearColor(E),c.toneMapping=r.y_p,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(a),c.clearDepth(),c.setRenderTarget(null)),null===this._backgroundBox&&(this._backgroundBox=new r.eaF(new r.iNn,new r.V9B({name:"PMREM.Background",side:r.hsX,depthWrite:!1,depthTest:!1})));let f=this._backgroundBox,p=f.material,m=!1,h=e.background;h?h.isColor&&(p.color.copy(h),e.background=null,m=!0):(p.color.copy(E),m=!0);for(let t=0;t<6;t++){let i=t%3;0===i?(o.up.set(0,l[t],0),o.position.set(n.x,n.y,n.z),o.lookAt(n.x+s[t],n.y,n.z)):1===i?(o.up.set(0,0,l[t]),o.position.set(n.x,n.y,n.z),o.lookAt(n.x,n.y+s[t],n.z)):(o.up.set(0,l[t],0),o.position.set(n.x,n.y,n.z),o.lookAt(n.x,n.y,n.z+s[t]));let r=this._cubeSize;C(a,i*r,t>2?r:0,r,r),c.setRenderTarget(a),m&&c.render(f,o),c.render(e,o)}c.toneMapping=u,c.autoClear=d,e.background=h}_textureToCubeUV(e,t){let i=this._renderer,a=e.mapping===r.hy7||e.mapping===r.xFO;a?(null===this._cubemapMaterial&&(this._cubemapMaterial=L()),this._cubemapMaterial.uniforms.flipEnvMap.value=!1===e.isRenderTargetTexture?-1:1):null===this._equirectMaterial&&(this._equirectMaterial=P());let n=a?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=n,n.uniforms.envMap.value=e;let l=this._cubeSize;C(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,v)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=i}_applyGGXFilter(e,t,i){let r=this._renderer,a=this._pingPongRenderTarget,n=this._ggxMaterial,o=this._lodMeshes[i];o.material=n;let l=n.uniforms,s=i/(this._lodMeshes.length-1),c=t/(this._lodMeshes.length-1),d=Math.sqrt(s*s-c*c),{_lodMax:u}=this,f=this._sizeLods[i],p=3*f*(i>u-4?i-u+4:0),m=4*(this._cubeSize-f);l.envMap.value=e.texture,l.roughness.value=d*(0+1.25*s),l.mipInt.value=u-t,C(a,p,m,3*f,2*f),r.setRenderTarget(a),r.render(o,v),l.envMap.value=a.texture,l.roughness.value=0,l.mipInt.value=u-i,C(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,v)}_blur(e,t,i,r,a){let n=this._pingPongRenderTarget;this._halfBlur(e,n,t,i,r,"latitudinal",a),this._halfBlur(n,e,i,i,r,"longitudinal",a)}_halfBlur(e,t,i,a,n,o,l){let s=this._renderer,c=this._blurMaterial;"latitudinal"!==o&&"longitudinal"!==o&&(0,r.z3S)("blur direction must be either latitudinal or longitudinal!");let d=this._lodMeshes[a];d.material=c;let u=c.uniforms,f=this._sizeLods[i]-1,p=isFinite(n)?Math.PI/(2*f):2*Math.PI/39,m=n/p,h=isFinite(n)?1+Math.floor(3*m):20;h>20&&(0,r.R8M)(`sigmaRadians, ${n}, is too large and will clip, as it requested ${h} samples when the maximum is set to 20`);let _=[],g=0;for(let e=0;e<20;++e){let t=e/m,i=Math.exp(-t*t/2);_.push(i),0===e?g+=i:e<h&&(g+=2*i)}for(let e=0;e<_.length;e++)_[e]=_[e]/g;u.envMap.value=e.texture,u.samples.value=h,u.weights.value=_,u.latitudinal.value="latitudinal"===o,l&&(u.poleAxis.value=l);let{_lodMax:E}=this;u.dTheta.value=p,u.mipInt.value=E-i;let S=this._sizeLods[a],M=4*(this._cubeSize-S);C(t,3*S*(a>E-4?a-E+4:0),M,3*S,2*S),s.setRenderTarget(t),s.render(d,v)}}function b(e,t,i){let a=new r.nWS(e,t,i);return a.texture.mapping=r.Om,a.texture.name="PMREM.cubeUv",a.scissorTest=!0,a}function C(e,t,i,r,a){e.viewport.set(t,i,r,a),e.scissor.set(t,i,r,a)}function P(){return new r.BKk({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:U(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:r.XIg,depthTest:!1,depthWrite:!1})}function L(){return new r.BKk({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:U(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:r.XIg,depthTest:!1,depthWrite:!1})}function U(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class w extends r.nWS{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1};this.texture=new r.b4q([i,i,i,i,i,i]),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new r.iNn(5,5,5),n=new r.BKk({name:"CubemapFromEquirect",uniforms:(0,r.lxW)(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:r.hsX,blending:r.XIg});n.uniforms.tEquirect.value=t;let o=new r.eaF(a,n),l=t.minFilter;return t.minFilter===r.$_I&&(t.minFilter=r.k6q),new r.F1T(1,10,this).update(e,o),t.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let a=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(a)}}function D(e){let t=new WeakMap,i=new WeakMap,a=null;function n(e,t){return t===r.wfO?e.mapping=r.hy7:t===r.uV5&&(e.mapping=r.xFO),e}function o(e){let i=e.target;i.removeEventListener("dispose",o);let r=t.get(i);void 0!==r&&(t.delete(i),r.dispose())}function l(e){let t=e.target;t.removeEventListener("dispose",l);let r=i.get(t);void 0!==r&&(i.delete(t),r.dispose())}return{get:function(s,c=!1){return null==s?null:c?function(t){if(t&&t.isTexture){let n=t.mapping,o=n===r.wfO||n===r.uV5,s=n===r.hy7||n===r.xFO;if(o||s){let r=i.get(t),n=void 0!==r?r.texture.pmremVersion:0;if(t.isRenderTargetTexture&&t.pmremVersion!==n)return null===a&&(a=new A(e)),(r=o?a.fromEquirectangular(t,r):a.fromCubemap(t,r)).texture.pmremVersion=t.pmremVersion,i.set(t,r),r.texture;{if(void 0!==r)return r.texture;let n=t.image;return o&&n&&n.height>0||s&&n&&function(e){let t=0;for(let i=0;i<6;i++)void 0!==e[i]&&t++;return 6===t}(n)?(null===a&&(a=new A(e)),(r=o?a.fromEquirectangular(t):a.fromCubemap(t)).texture.pmremVersion=t.pmremVersion,i.set(t,r),t.addEventListener("dispose",l),r.texture):null}}}return t}(s):function(i){if(i&&i.isTexture){let a=i.mapping;if(a===r.wfO||a===r.uV5)if(t.has(i))return n(t.get(i).texture,i.mapping);else{let r=i.image;if(!r||!(r.height>0))return null;{let a=new w(r.height);return a.fromEquirectangularTexture(e,i),t.set(i,a),i.addEventListener("dispose",o),n(a.texture,i.mapping)}}}return i}(s)},dispose:function(){t=new WeakMap,i=new WeakMap,null!==a&&(a.dispose(),a=null)}}}function I(e){let t={};function i(i){if(void 0!==t[i])return t[i];let r=e.getExtension(i);return t[i]=r,r}return{has:function(e){return null!==i(e)},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(e){let t=i(e);return null===t&&(0,r.mcG)("WebGLRenderer: "+e+" extension not supported."),t}}}function N(e,t,i,a){let n={},o=new WeakMap;function l(e){let r=e.target;for(let e in null!==r.index&&t.remove(r.index),r.attributes)t.remove(r.attributes[e]);r.removeEventListener("dispose",l),delete n[r.id];let s=o.get(r);s&&(t.remove(s),o.delete(r)),a.releaseStatesOfGeometry(r),!0===r.isInstancedBufferGeometry&&delete r._maxInstanceCount,i.memory.geometries--}function s(e){let i=[],a=e.index,n=e.attributes.position,l=0;if(void 0===n)return;if(null!==a){let e=a.array;l=a.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],a=e[t+1],n=e[t+2];i.push(r,a,a,n,n,r)}}else{let e=n.array;l=n.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,a=t+2;i.push(e,r,r,a,a,e)}}let s=new(n.count>=65535?r.MW4:r.A$4)(i,1);s.version=l;let c=o.get(e);c&&t.remove(c),o.set(e,s)}return{get:function(e,t){return!0===n[t.id]||(t.addEventListener("dispose",l),n[t.id]=!0,i.memory.geometries++),t},update:function(i){let r=i.attributes;for(let i in r)t.update(r[i],e.ARRAY_BUFFER)},getWireframeAttribute:function(e){let t=o.get(e);if(t){let i=e.index;null!==i&&t.version<i.version&&s(e)}else s(e);return o.get(e)}}}function y(e,t,i){let r,a,n;function o(t,o,l){0!==l&&(e.drawElementsInstanced(r,o,a,t*n,l),i.update(o,r,l))}this.setMode=function(e){r=e},this.setIndex=function(e){a=e.type,n=e.bytesPerElement},this.render=function(t,o){e.drawElements(r,o,a,t*n),i.update(o,r,1)},this.renderInstances=o,this.renderMultiDraw=function(e,n,o){if(0===o)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,n,0,a,e,0,o);let l=0;for(let e=0;e<o;e++)l+=n[e];i.update(l,r,1)},this.renderMultiDrawInstances=function(e,l,s,c){if(0===s)return;let d=t.get("WEBGL_multi_draw");if(null===d)for(let t=0;t<e.length;t++)o(e[t]/n,l[t],c[t]);else{d.multiDrawElementsInstancedWEBGL(r,l,0,a,e,0,c,0,s);let t=0;for(let e=0;e<s;e++)t+=l[e]*c[e];i.update(t,r,1)}}}function O(e){let t={frame:0,calls:0,triangles:0,points:0,lines:0};return{memory:{geometries:0,textures:0},render:t,programs:null,autoReset:!0,reset:function(){t.calls=0,t.triangles=0,t.points=0,t.lines=0},update:function(i,a,n){switch(t.calls++,a){case e.TRIANGLES:t.triangles+=i/3*n;break;case e.LINES:t.lines+=i/2*n;break;case e.LINE_STRIP:t.lines+=n*(i-1);break;case e.LINE_LOOP:t.lines+=n*i;break;case e.POINTS:t.points+=n*i;break;default:(0,r.z3S)("WebGLInfo: Unknown draw mode:",a)}}}}function F(e,t,i){let a=new WeakMap,n=new r.IUQ;return{update:function(o,l,s){let c=o.morphTargetInfluences,d=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,u=void 0!==d?d.length:0,f=a.get(l);if(void 0===f||f.count!==u){void 0!==f&&f.texture.dispose();let e=void 0!==l.morphAttributes.position,i=void 0!==l.morphAttributes.normal,o=void 0!==l.morphAttributes.color,s=l.morphAttributes.position||[],c=l.morphAttributes.normal||[],d=l.morphAttributes.color||[],p=0;!0===e&&(p=1),!0===i&&(p=2),!0===o&&(p=3);let m=l.attributes.position.count*p,h=1;m>t.maxTextureSize&&(h=Math.ceil(m/t.maxTextureSize),m=t.maxTextureSize);let _=new Float32Array(m*h*4*u),g=new r.rFo(_,m,h,u);g.type=r.RQf,g.needsUpdate=!0;let v=4*p;for(let t=0;t<u;t++){let r=s[t],a=c[t],l=d[t],u=m*h*4*t;for(let t=0;t<r.count;t++){let s=t*v;!0===e&&(n.fromBufferAttribute(r,t),_[u+s+0]=n.x,_[u+s+1]=n.y,_[u+s+2]=n.z,_[u+s+3]=0),!0===i&&(n.fromBufferAttribute(a,t),_[u+s+4]=n.x,_[u+s+5]=n.y,_[u+s+6]=n.z,_[u+s+7]=0),!0===o&&(n.fromBufferAttribute(l,t),_[u+s+8]=n.x,_[u+s+9]=n.y,_[u+s+10]=n.z,_[u+s+11]=4===l.itemSize?n.w:1)}}f={count:u,texture:g,size:new r.I9Y(m,h)},a.set(l,f),l.addEventListener("dispose",function e(){g.dispose(),a.delete(l),l.removeEventListener("dispose",e)})}if(!0===o.isInstancedMesh&&null!==o.morphTexture)s.getUniforms().setValue(e,"morphTexture",o.morphTexture,i);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let i=l.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,"morphTargetBaseInfluence",i),s.getUniforms().setValue(e,"morphTargetInfluences",c)}s.getUniforms().setValue(e,"morphTargetsTexture",f.texture,i),s.getUniforms().setValue(e,"morphTargetsTextureSize",f.size)}}}function B(e,t,i,r,a){let n=new WeakMap;function o(e){let t=e.target;t.removeEventListener("dispose",o),r.releaseStatesOfObject(t),i.remove(t.instanceMatrix),null!==t.instanceColor&&i.remove(t.instanceColor)}return{update:function(r){let l=a.render.frame,s=r.geometry,c=t.get(r,s);if(n.get(c)!==l&&(t.update(c),n.set(c,l)),r.isInstancedMesh&&(!1===r.hasEventListener("dispose",o)&&r.addEventListener("dispose",o),n.get(r)!==l&&(i.update(r.instanceMatrix,e.ARRAY_BUFFER),null!==r.instanceColor&&i.update(r.instanceColor,e.ARRAY_BUFFER),n.set(r,l))),r.isSkinnedMesh){let e=r.skeleton;n.get(e)!==l&&(e.update(),n.set(e,l))}return c},dispose:function(){n=new WeakMap}}}let G={[r.kyO]:"LINEAR_TONE_MAPPING",[r.Mjd]:"REINHARD_TONE_MAPPING",[r.nNL]:"CINEON_TONE_MAPPING",[r.FV]:"ACES_FILMIC_TONE_MAPPING",[r.LAk]:"AGX_TONE_MAPPING",[r.aJ8]:"NEUTRAL_TONE_MAPPING",[r.g7M]:"CUSTOM_TONE_MAPPING"};function H(e,t,i,a,n){let o,l=new r.nWS(t,i,{type:e,depthBuffer:a,stencilBuffer:n}),s=new r.nWS(t,i,{type:r.ix0,depthBuffer:!1,stencilBuffer:!1}),c=new r.LoY;c.setAttribute("position",new r.qtW([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new r.qtW([0,2,0,0,2,0],2));let d=new r.D$Q({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new r.eaF(c,d),f=new r.qUd(-1,1,1,-1,0,1),p=null,m=null,h=!1,_=null,g=[],v=!1;this.setSize=function(e,t){l.setSize(e,t),s.setSize(e,t);for(let i=0;i<g.length;i++){let r=g[i];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=(g=e).length>0&&!0===g[0].isRenderPass;let t=l.width,i=l.height;for(let e=0;e<g.length;e++){let r=g[e];r.setSize&&r.setSize(t,i)}},this.begin=function(e,t){if(h||e.toneMapping===r.y_p&&0===g.length)return!1;if(_=t,null!==t){let e=t.width,i=t.height;(l.width!==e||l.height!==i)&&this.setSize(e,i)}return!1===v&&e.setRenderTarget(l),o=e.toneMapping,e.toneMapping=r.y_p,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=o,h=!0;let i=l,a=s;for(let r=0;r<g.length;r++){let n=g[r];if(!1!==n.enabled&&(n.render(e,a,i,t),!1!==n.needsSwap)){let e=i;i=a,a=e}}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,d.defines={},r.ppV.getTransfer(p)===r.KLL&&(d.defines.SRGB_TRANSFER="");let t=G[m];t&&(d.defines[t]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=i.texture,e.setRenderTarget(_),e.render(u,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){l.dispose(),s.dispose(),c.dispose(),d.dispose()}}let V=new r.gPd,W=new r.VCu(1,1),k=new r.rFo,z=new r.dYF,X=new r.b4q,q=893!=i.j?[]:null,K=893!=i.j?[]:null,Y=new Float32Array(16),j=new Float32Array(9),Z=new Float32Array(4);function Q(e,t,i){let r=e[0];if(r<=0||r>0)return e;let a=t*i,n=q[a];if(void 0===n&&(n=new Float32Array(a),q[a]=n),0!==t){r.toArray(n,0);for(let r=1,a=0;r!==t;++r)a+=i,e[r].toArray(n,a)}return n}function $(e,t){if(e.length!==t.length)return!1;for(let i=0,r=e.length;i<r;i++)if(e[i]!==t[i])return!1;return!0}function J(e,t){for(let i=0,r=t.length;i<r;i++)e[i]=t[i]}function ee(e,t){let i=K[t];void 0===i&&(i=new Int32Array(t),K[t]=i);for(let r=0;r!==t;++r)i[r]=e.allocateTextureUnit();return i}function et(e,t){let i=this.cache;i[0]!==t&&(e.uniform1f(this.addr,t),i[0]=t)}function ei(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if($(i,t))return;e.uniform2fv(this.addr,t),J(i,t)}}function er(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else if(void 0!==t.r)(i[0]!==t.r||i[1]!==t.g||i[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),i[0]=t.r,i[1]=t.g,i[2]=t.b);else{if($(i,t))return;e.uniform3fv(this.addr,t),J(i,t)}}function ea(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if($(i,t))return;e.uniform4fv(this.addr,t),J(i,t)}}function en(e,t){let i=this.cache,r=t.elements;if(void 0===r){if($(i,t))return;e.uniformMatrix2fv(this.addr,!1,t),J(i,t)}else{if($(i,r))return;Z.set(r),e.uniformMatrix2fv(this.addr,!1,Z),J(i,r)}}function eo(e,t){let i=this.cache,r=t.elements;if(void 0===r){if($(i,t))return;e.uniformMatrix3fv(this.addr,!1,t),J(i,t)}else{if($(i,r))return;j.set(r),e.uniformMatrix3fv(this.addr,!1,j),J(i,r)}}function el(e,t){let i=this.cache,r=t.elements;if(void 0===r){if($(i,t))return;e.uniformMatrix4fv(this.addr,!1,t),J(i,t)}else{if($(i,r))return;Y.set(r),e.uniformMatrix4fv(this.addr,!1,Y),J(i,r)}}function es(e,t){let i=this.cache;i[0]!==t&&(e.uniform1i(this.addr,t),i[0]=t)}function ec(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if($(i,t))return;e.uniform2iv(this.addr,t),J(i,t)}}function ed(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if($(i,t))return;e.uniform3iv(this.addr,t),J(i,t)}}function eu(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if($(i,t))return;e.uniform4iv(this.addr,t),J(i,t)}}function ef(e,t){let i=this.cache;i[0]!==t&&(e.uniform1ui(this.addr,t),i[0]=t)}function ep(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),i[0]=t.x,i[1]=t.y);else{if($(i,t))return;e.uniform2uiv(this.addr,t),J(i,t)}}function em(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),i[0]=t.x,i[1]=t.y,i[2]=t.z);else{if($(i,t))return;e.uniform3uiv(this.addr,t),J(i,t)}}function eh(e,t){let i=this.cache;if(void 0!==t.x)(i[0]!==t.x||i[1]!==t.y||i[2]!==t.z||i[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=t.w);else{if($(i,t))return;e.uniform4uiv(this.addr,t),J(i,t)}}function e_(e,t,i){let a,n=this.cache,o=i.allocateTextureUnit();n[0]!==o&&(e.uniform1i(this.addr,o),n[0]=o),this.type===e.SAMPLER_2D_SHADOW?(W.compareFunction=i.isReversedDepthBuffer()?r.gWB:r.TiK,a=W):a=V,i.setTexture2D(t||a,o)}function eg(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture3D(t||z,a)}function ev(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTextureCube(t||X,a)}function eE(e,t,i){let r=this.cache,a=i.allocateTextureUnit();r[0]!==a&&(e.uniform1i(this.addr,a),r[0]=a),i.setTexture2DArray(t||k,a)}function eS(e,t){e.uniform1fv(this.addr,t)}function eM(e,t){let i=Q(t,this.size,2);e.uniform2fv(this.addr,i)}function eT(e,t){let i=Q(t,this.size,3);e.uniform3fv(this.addr,i)}function ex(e,t){let i=Q(t,this.size,4);e.uniform4fv(this.addr,i)}function eR(e,t){let i=Q(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,i)}function eA(e,t){let i=Q(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,i)}function eb(e,t){let i=Q(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,i)}function eC(e,t){e.uniform1iv(this.addr,t)}function eP(e,t){e.uniform2iv(this.addr,t)}function eL(e,t){e.uniform3iv(this.addr,t)}function eU(e,t){e.uniform4iv(this.addr,t)}function ew(e,t){e.uniform1uiv(this.addr,t)}function eD(e,t){e.uniform2uiv(this.addr,t)}function eI(e,t){e.uniform3uiv(this.addr,t)}function eN(e,t){e.uniform4uiv(this.addr,t)}function ey(e,t,i){let r,a=this.cache,n=t.length,o=ee(i,n);$(a,o)||(e.uniform1iv(this.addr,o),J(a,o)),r=this.type===e.SAMPLER_2D_SHADOW?W:V;for(let e=0;e!==n;++e)i.setTexture2D(t[e]||r,o[e])}function eO(e,t,i){let r=this.cache,a=t.length,n=ee(i,a);$(r,n)||(e.uniform1iv(this.addr,n),J(r,n));for(let e=0;e!==a;++e)i.setTexture3D(t[e]||z,n[e])}function eF(e,t,i){let r=this.cache,a=t.length,n=ee(i,a);$(r,n)||(e.uniform1iv(this.addr,n),J(r,n));for(let e=0;e!==a;++e)i.setTextureCube(t[e]||X,n[e])}function eB(e,t,i){let r=this.cache,a=t.length,n=ee(i,a);$(r,n)||(e.uniform1iv(this.addr,n),J(r,n));for(let e=0;e!==a;++e)i.setTexture2DArray(t[e]||k,n[e])}class eG{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=function(e){switch(e){case 5126:return et;case 35664:return ei;case 35665:return er;case 35666:return ea;case 35674:return en;case 35675:return eo;case 35676:return el;case 5124:case 35670:return es;case 35667:case 35671:return ec;case 35668:case 35672:return ed;case 35669:case 35673:return eu;case 5125:return ef;case 36294:return ep;case 36295:return em;case 36296:return eh;case 35678:case 36198:case 36298:case 36306:case 35682:return e_;case 35679:case 36299:case 36307:return eg;case 35680:case 36300:case 36308:case 36293:return ev;case 36289:case 36303:case 36311:case 36292:return eE}}(t.type)}}class eH{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=function(e){switch(e){case 5126:return eS;case 35664:return eM;case 35665:return eT;case 35666:return ex;case 35674:return eR;case 35675:return eA;case 35676:return eb;case 5124:case 35670:return eC;case 35667:case 35671:return eP;case 35668:case 35672:return eL;case 35669:case 35673:return eU;case 5125:return ew;case 36294:return eD;case 36295:return eI;case 36296:return eN;case 35678:case 36198:case 36298:case 36306:case 35682:return ey;case 35679:case 36299:case 36307:return eO;case 35680:case 36300:case 36308:case 36293:return eF;case 36289:case 36303:case 36311:case 36292:return eB}}(t.type)}}class eV{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let a=0,n=r.length;a!==n;++a){let n=r[a];n.setValue(e,t[n.id],i)}}}let eW=/(\w+)(\])?(\[|\.)?/g;function ek(e,t){e.seq.push(t),e.map[t.id]=t}class ez{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const i=e.getActiveUniform(t,r),a=e.getUniformLocation(t,i.name);!function(e,t,i){let r=e.name,a=r.length;for(eW.lastIndex=0;;){let n=eW.exec(r),o=eW.lastIndex,l=n[1],s="]"===n[2],c=n[3];if(s&&(l|=0),void 0===c||"["===c&&o+2===a){ek(i,void 0===c?new eG(l,e,t):new eH(l,e,t));break}{let e=i.map[l];void 0===e&&ek(i,e=new eV(l)),i=e}}}(i,a,this)}const r=[],a=[];for(const t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):a.push(t);r.length>0&&(this.seq=r.concat(a))}setValue(e,t,i,r){let a=this.map[t];void 0!==a&&a.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];void 0!==r&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let a=0,n=t.length;a!==n;++a){let n=t[a],o=i[n.id];!1!==o.needsUpdate&&n.setValue(e,o.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,a=e.length;r!==a;++r){let a=e[r];a.id in t&&i.push(a)}return i}}function eX(e,t,i){let r=e.createShader(t);return e.shaderSource(r,i),e.compileShader(r),r}let eq=0,eK=new r.dwI;function eY(e,t,i){let r=e.getShaderParameter(t,e.COMPILE_STATUS),a=(e.getShaderInfoLog(t)||"").trim();if(r&&""===a)return"";let n=/ERROR: 0:(\d+)/.exec(a);if(!n)return a;{let r=parseInt(n[1]);return i.toUpperCase()+`

`+a+`

`+function(e,t){let i=e.split(`
`),r=[],a=Math.max(t-6,0),n=Math.min(t+6,i.length);for(let e=a;e<n;e++){let a=e+1;r.push(`${a===t?">":" "} ${a}: ${i[e]}`)}return r.join(`
`)}(e.getShaderSource(t),r)}}let ej={[r.kyO]:"Linear",[r.Mjd]:"Reinhard",[r.nNL]:"Cineon",[r.FV]:"ACESFilmic",[r.LAk]:"AgX",[r.aJ8]:"Neutral",[r.g7M]:"Custom"},eZ=new r.Pq0;function eQ(e){return""!==e}function e$(e,t){let i=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function eJ(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}let e0=/^[ \t]*#include +<([\w\d./]+)>/gm;function e1(e){return e.replace(e0,e2)}let e3=new Map;function e2(e,t){let i=o[t];if(void 0===i){let e=e3.get(t);if(void 0!==e)i=o[e],(0,r.R8M)('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,e);else throw Error("Can not resolve #include <"+t+">")}return e1(i)}let e4=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function e5(e){return e.replace(e4,e6)}function e6(e,t,i,r){let a="";for(let e=parseInt(t);e<parseInt(i);e++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+e+" ]").replace(/UNROLLED_LOOP_INDEX/g,e);return a}function e8(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return"highp"===e.precision?t+=`
#define HIGH_PRECISION`:"mediump"===e.precision?t+=`
#define MEDIUM_PRECISION`:"lowp"===e.precision&&(t+=`
#define LOW_PRECISION`),t}let e9={[r.QP0]:"SHADOWMAP_TYPE_PCF",[r.RyA]:"SHADOWMAP_TYPE_VSM"},e7={[r.hy7]:"ENVMAP_TYPE_CUBE",[r.xFO]:"ENVMAP_TYPE_CUBE",[r.Om]:"ENVMAP_TYPE_CUBE_UV"},te={[r.xFO]:"ENVMAP_MODE_REFRACTION"},tt={[r.caT]:"ENVMAP_BLENDING_MULTIPLY",[r.KRh]:"ENVMAP_BLENDING_MIX",[r.XrR]:"ENVMAP_BLENDING_ADD"};function ti(e,t,i,a){var n,l;let s,c,d,u,f=e.getContext(),p=i.defines,m=i.vertexShader,h=i.fragmentShader,_=e9[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC",g=!1===i.envMap?"ENVMAP_TYPE_CUBE":e7[i.envMapMode]||"ENVMAP_TYPE_CUBE",v=!1===i.envMap?"ENVMAP_MODE_REFLECTION":te[i.envMapMode]||"ENVMAP_MODE_REFLECTION",E=!1===i.envMap?"ENVMAP_BLENDING_NONE":tt[i.combine]||"ENVMAP_BLENDING_NONE",S=function(e){let t=e.envMapCubeUVHeight;if(null===t)return null;let i=Math.log2(t)-2;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:1/t,maxMip:i}}(i),M=[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(eQ).join(`
`),T=function(e){let t=[];for(let i in e){let r=e[i];!1!==r&&t.push("#define "+i+" "+r)}return t.join(`
`)}(p),x=f.createProgram(),R=i.glslVersion?"#version "+i.glslVersion+`
`:"";if(i.isRawShaderMaterial)(s=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(eQ).join(`
`)).length>0&&(s+=`
`),(c=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T].filter(eQ).join(`
`)).length>0&&(c+=`
`);else{let e,t,a,d,u;s=[e8(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+v:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&!1===i.flatShading?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&!1===i.flatShading?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+_:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(eQ).join(`
`),c=[e8(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,T,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.envMap?"#define "+v:"",i.envMap?"#define "+E:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&!1===i.flatShading?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+_:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==r.y_p?"#define TONE_MAPPING":"",i.toneMapping!==r.y_p?o.tonemapping_pars_fragment:"",i.toneMapping!==r.y_p?(n="toneMapping",void 0===(e=ej[l=i.toneMapping])?((0,r.R8M)("WebGLProgram: Unsupported toneMapping:",l),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",o.colorspace_pars_fragment,(t=function(e){r.ppV._getMatrix(eK,r.ppV.workingColorSpace,e);let t=`mat3( ${eK.elements.map(e=>e.toFixed(4))} )`;switch(r.ppV.getTransfer(e)){case r.VxR:return[t,"LinearTransferOETF"];case r.KLL:return[t,"sRGBTransferOETF"];default:return(0,r.R8M)("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}(i.outputColorSpace),`vec4 linearToOutputTexel( vec4 value ) {
	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );
}`),(r.ppV.getLuminanceCoefficients(eZ),a=eZ.x.toFixed(4),d=eZ.y.toFixed(4),u=eZ.z.toFixed(4),`float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( ${a}, ${d}, ${u} );
	return dot( weights, rgb );
}`),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(eQ).join(`
`)}m=eJ(m=e$(m=e1(m),i),i),h=eJ(h=e$(h=e1(h),i),i),m=e5(m),h=e5(h),!0!==i.isRawShaderMaterial&&(R=`#version 300 es
`,s=[M,`#define attribute in
#define varying out
#define texture2D texture`].join(`
`)+`
`+s,c=["#define varying in",i.glslVersion===r.Wdf?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===r.Wdf?"":"#define gl_FragColor pc_fragColor",`#define gl_FragDepthEXT gl_FragDepth
#define texture2D texture
#define textureCube texture
#define texture2DProj textureProj
#define texture2DLodEXT textureLod
#define texture2DProjLodEXT textureProjLod
#define textureCubeLodEXT textureLod
#define texture2DGradEXT textureGrad
#define texture2DProjGradEXT textureProjGrad
#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+c);let A=R+s+m,b=R+c+h,C=eX(f,f.VERTEX_SHADER,A),P=eX(f,f.FRAGMENT_SHADER,b);function L(t){if(e.debug.checkShaderErrors){let i=f.getProgramInfoLog(x)||"",a=f.getShaderInfoLog(C)||"",n=f.getShaderInfoLog(P)||"",o=i.trim(),l=a.trim(),d=n.trim(),u=!0,p=!0;if(!1===f.getProgramParameter(x,f.LINK_STATUS))if(u=!1,"function"==typeof e.debug.onShaderError)e.debug.onShaderError(f,x,C,P);else{let e=eY(f,C,"vertex"),i=eY(f,P,"fragment");(0,r.z3S)("THREE.WebGLProgram: Shader Error "+f.getError()+" - VALIDATE_STATUS "+f.getProgramParameter(x,f.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+i)}else""!==o?(0,r.R8M)("WebGLProgram: Program Info Log:",o):(""===l||""===d)&&(p=!1);p&&(t.diagnostics={runnable:u,programLog:o,vertexShader:{log:l,prefix:s},fragmentShader:{log:d,prefix:c}})}f.deleteShader(C),f.deleteShader(P),d=new ez(f,x),u=function(e,t){let i={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){let r=e.getActiveAttrib(t,a),n=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),i[n]={type:r.type,location:e.getAttribLocation(t,n),locationSize:o}}return i}(f,x)}f.attachShader(x,C),f.attachShader(x,P),void 0!==i.index0AttributeName?f.bindAttribLocation(x,0,i.index0AttributeName):!0===i.morphTargets&&f.bindAttribLocation(x,0,"position"),f.linkProgram(x),this.getUniforms=function(){return void 0===d&&L(this),d},this.getAttributes=function(){return void 0===u&&L(this),u};let U=!1===i.rendererExtensionParallelShaderCompile;return this.isReady=function(){return!1===U&&(U=f.getProgramParameter(x,37297)),U},this.destroy=function(){a.releaseStatesOfProgram(this),f.deleteProgram(x),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=eq++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=P,this}let tr=0;class ta{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(i),n=this._getShaderCacheForMaterial(e);return!1===n.has(r)&&(n.add(r),r.usedTimes++),!1===n.has(a)&&(n.add(a),a.usedTimes++),this}remove(e){for(let t of this.materialCache.get(e))t.usedTimes--,0===t.usedTimes&&this.shaderCache.delete(t.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return void 0===i&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return void 0===i&&(i=new tn(e),t.set(e,i)),i}}class tn{constructor(e){this.id=tr++,this.code=e,this.usedTimes=0}}function to(e,t,i,a,n,o){let l=new r.zgK,c=new ta,d=new Set,u=[],f=new Map,p=a.logarithmicDepthBuffer,m=a.precision,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(e){return(d.add(e),0===e)?"uv":`uv${e}`}return{getParameters:function(n,l,u,f,g){let v,E,S,M,T=f.fog,x=g.geometry,R=n.isMeshStandardMaterial||n.isMeshLambertMaterial||n.isMeshPhongMaterial?f.environment:null,A=n.isMeshStandardMaterial||n.isMeshLambertMaterial&&!n.envMap||n.isMeshPhongMaterial&&!n.envMap,b=t.get(n.envMap||R,A),C=b&&b.mapping===r.Om?b.image.height:null,P=h[n.type];null!==n.precision&&(m=a.getMaxPrecision(n.precision))!==n.precision&&(0,r.R8M)("WebGLProgram.getParameters:",n.precision,"not supported, using",m,"instead.");let L=x.morphAttributes.position||x.morphAttributes.normal||x.morphAttributes.color,U=void 0!==L?L.length:0,w=0;if(void 0!==x.morphAttributes.position&&(w=1),void 0!==x.morphAttributes.normal&&(w=2),void 0!==x.morphAttributes.color&&(w=3),P){let e=s[P];v=e.vertexShader,E=e.fragmentShader}else v=n.vertexShader,E=n.fragmentShader,c.update(n),S=c.getVertexShaderID(n),M=c.getFragmentShaderID(n);let D=e.getRenderTarget(),I=e.state.buffers.depth.getReversed(),N=!0===g.isInstancedMesh,y=!0===g.isBatchedMesh,O=!!n.map,F=!!n.matcap,B=!!b,G=!!n.aoMap,H=!!n.lightMap,V=!!n.bumpMap,W=!!n.normalMap,k=!!n.displacementMap,z=!!n.emissiveMap,X=!!n.metalnessMap,q=!!n.roughnessMap,K=n.anisotropy>0,Y=n.clearcoat>0,j=n.dispersion>0,Z=n.iridescence>0,Q=n.sheen>0,$=n.transmission>0,J=K&&!!n.anisotropyMap,ee=Y&&!!n.clearcoatMap,et=Y&&!!n.clearcoatNormalMap,ei=Y&&!!n.clearcoatRoughnessMap,er=Z&&!!n.iridescenceMap,ea=Z&&!!n.iridescenceThicknessMap,en=Q&&!!n.sheenColorMap,eo=Q&&!!n.sheenRoughnessMap,el=!!n.specularMap,es=!!n.specularColorMap,ec=!!n.specularIntensityMap,ed=$&&!!n.transmissionMap,eu=$&&!!n.thicknessMap,ef=!!n.gradientMap,ep=!!n.alphaMap,em=n.alphaTest>0,eh=!!n.alphaHash,e_=!!n.extensions,eg=r.y_p;n.toneMapped&&(null===D||!0===D.isXRRenderTarget)&&(eg=e.toneMapping);let ev={shaderID:P,shaderType:n.type,shaderName:n.name,vertexShader:v,fragmentShader:E,defines:n.defines,customVertexShaderID:S,customFragmentShaderID:M,isRawShaderMaterial:!0===n.isRawShaderMaterial,glslVersion:n.glslVersion,precision:m,batching:y,batchingColor:y&&null!==g._colorsTexture,instancing:N,instancingColor:N&&null!==g.instanceColor,instancingMorph:N&&null!==g.morphTexture,outputColorSpace:null===D?e.outputColorSpace:!0===D.isXRRenderTarget?D.texture.colorSpace:r.Zr2,alphaToCoverage:!!n.alphaToCoverage,map:O,matcap:F,envMap:B,envMapMode:B&&b.mapping,envMapCubeUVHeight:C,aoMap:G,lightMap:H,bumpMap:V,normalMap:W,displacementMap:k,emissiveMap:z,normalMapObjectSpace:W&&n.normalMapType===r.vyJ,normalMapTangentSpace:W&&n.normalMapType===r.bI3,metalnessMap:X,roughnessMap:q,anisotropy:K,anisotropyMap:J,clearcoat:Y,clearcoatMap:ee,clearcoatNormalMap:et,clearcoatRoughnessMap:ei,dispersion:j,iridescence:Z,iridescenceMap:er,iridescenceThicknessMap:ea,sheen:Q,sheenColorMap:en,sheenRoughnessMap:eo,specularMap:el,specularColorMap:es,specularIntensityMap:ec,transmission:$,transmissionMap:ed,thicknessMap:eu,gradientMap:ef,opaque:!1===n.transparent&&n.blending===r.NTi&&!1===n.alphaToCoverage,alphaMap:ep,alphaTest:em,alphaHash:eh,combine:n.combine,mapUv:O&&_(n.map.channel),aoMapUv:G&&_(n.aoMap.channel),lightMapUv:H&&_(n.lightMap.channel),bumpMapUv:V&&_(n.bumpMap.channel),normalMapUv:W&&_(n.normalMap.channel),displacementMapUv:k&&_(n.displacementMap.channel),emissiveMapUv:z&&_(n.emissiveMap.channel),metalnessMapUv:X&&_(n.metalnessMap.channel),roughnessMapUv:q&&_(n.roughnessMap.channel),anisotropyMapUv:J&&_(n.anisotropyMap.channel),clearcoatMapUv:ee&&_(n.clearcoatMap.channel),clearcoatNormalMapUv:et&&_(n.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ei&&_(n.clearcoatRoughnessMap.channel),iridescenceMapUv:er&&_(n.iridescenceMap.channel),iridescenceThicknessMapUv:ea&&_(n.iridescenceThicknessMap.channel),sheenColorMapUv:en&&_(n.sheenColorMap.channel),sheenRoughnessMapUv:eo&&_(n.sheenRoughnessMap.channel),specularMapUv:el&&_(n.specularMap.channel),specularColorMapUv:es&&_(n.specularColorMap.channel),specularIntensityMapUv:ec&&_(n.specularIntensityMap.channel),transmissionMapUv:ed&&_(n.transmissionMap.channel),thicknessMapUv:eu&&_(n.thicknessMap.channel),alphaMapUv:ep&&_(n.alphaMap.channel),vertexTangents:!!x.attributes.tangent&&(W||K),vertexColors:n.vertexColors,vertexAlphas:!0===n.vertexColors&&!!x.attributes.color&&4===x.attributes.color.itemSize,pointsUvs:!0===g.isPoints&&!!x.attributes.uv&&(O||ep),fog:!!T,useFog:!0===n.fog,fogExp2:!!T&&T.isFogExp2,flatShading:!1===n.wireframe&&(!0===n.flatShading||void 0===x.attributes.normal&&!1===W&&(n.isMeshLambertMaterial||n.isMeshPhongMaterial||n.isMeshStandardMaterial||n.isMeshPhysicalMaterial)),sizeAttenuation:!0===n.sizeAttenuation,logarithmicDepthBuffer:p,reversedDepthBuffer:I,skinning:!0===g.isSkinnedMesh,morphTargets:void 0!==x.morphAttributes.position,morphNormals:void 0!==x.morphAttributes.normal,morphColors:void 0!==x.morphAttributes.color,morphTargetsCount:U,morphTextureStride:w,numDirLights:l.directional.length,numPointLights:l.point.length,numSpotLights:l.spot.length,numSpotLightMaps:l.spotLightMap.length,numRectAreaLights:l.rectArea.length,numHemiLights:l.hemi.length,numDirLightShadows:l.directionalShadowMap.length,numPointLightShadows:l.pointShadowMap.length,numSpotLightShadows:l.spotShadowMap.length,numSpotLightShadowsWithMaps:l.numSpotLightShadowsWithMaps,numLightProbes:l.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:n.dithering,shadowMapEnabled:e.shadowMap.enabled&&u.length>0,shadowMapType:e.shadowMap.type,toneMapping:eg,decodeVideoTexture:O&&!0===n.map.isVideoTexture&&r.ppV.getTransfer(n.map.colorSpace)===r.KLL,decodeVideoTextureEmissive:z&&!0===n.emissiveMap.isVideoTexture&&r.ppV.getTransfer(n.emissiveMap.colorSpace)===r.KLL,premultipliedAlpha:n.premultipliedAlpha,doubleSided:n.side===r.$EB,flipSided:n.side===r.hsX,useDepthPacking:n.depthPacking>=0,depthPacking:n.depthPacking||0,index0AttributeName:n.index0AttributeName,extensionClipCullDistance:e_&&!0===n.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(e_&&!0===n.extensions.multiDraw||y)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:n.customProgramCacheKey()};return ev.vertexUv1s=d.has(1),ev.vertexUv2s=d.has(2),ev.vertexUv3s=d.has(3),d.clear(),ev},getProgramCacheKey:function(t){var i,r,a,n;let o=[];if(t.shaderID?o.push(t.shaderID):(o.push(t.customVertexShaderID),o.push(t.customFragmentShaderID)),void 0!==t.defines)for(let e in t.defines)o.push(e),o.push(t.defines[e]);return!1===t.isRawShaderMaterial&&(i=o,r=t,i.push(r.precision),i.push(r.outputColorSpace),i.push(r.envMapMode),i.push(r.envMapCubeUVHeight),i.push(r.mapUv),i.push(r.alphaMapUv),i.push(r.lightMapUv),i.push(r.aoMapUv),i.push(r.bumpMapUv),i.push(r.normalMapUv),i.push(r.displacementMapUv),i.push(r.emissiveMapUv),i.push(r.metalnessMapUv),i.push(r.roughnessMapUv),i.push(r.anisotropyMapUv),i.push(r.clearcoatMapUv),i.push(r.clearcoatNormalMapUv),i.push(r.clearcoatRoughnessMapUv),i.push(r.iridescenceMapUv),i.push(r.iridescenceThicknessMapUv),i.push(r.sheenColorMapUv),i.push(r.sheenRoughnessMapUv),i.push(r.specularMapUv),i.push(r.specularColorMapUv),i.push(r.specularIntensityMapUv),i.push(r.transmissionMapUv),i.push(r.thicknessMapUv),i.push(r.combine),i.push(r.fogExp2),i.push(r.sizeAttenuation),i.push(r.morphTargetsCount),i.push(r.morphAttributeCount),i.push(r.numDirLights),i.push(r.numPointLights),i.push(r.numSpotLights),i.push(r.numSpotLightMaps),i.push(r.numHemiLights),i.push(r.numRectAreaLights),i.push(r.numDirLightShadows),i.push(r.numPointLightShadows),i.push(r.numSpotLightShadows),i.push(r.numSpotLightShadowsWithMaps),i.push(r.numLightProbes),i.push(r.shadowMapType),i.push(r.toneMapping),i.push(r.numClippingPlanes),i.push(r.numClipIntersection),i.push(r.depthPacking),a=o,n=t,l.disableAll(),n.instancing&&l.enable(0),n.instancingColor&&l.enable(1),n.instancingMorph&&l.enable(2),n.matcap&&l.enable(3),n.envMap&&l.enable(4),n.normalMapObjectSpace&&l.enable(5),n.normalMapTangentSpace&&l.enable(6),n.clearcoat&&l.enable(7),n.iridescence&&l.enable(8),n.alphaTest&&l.enable(9),n.vertexColors&&l.enable(10),n.vertexAlphas&&l.enable(11),n.vertexUv1s&&l.enable(12),n.vertexUv2s&&l.enable(13),n.vertexUv3s&&l.enable(14),n.vertexTangents&&l.enable(15),n.anisotropy&&l.enable(16),n.alphaHash&&l.enable(17),n.batching&&l.enable(18),n.dispersion&&l.enable(19),n.batchingColor&&l.enable(20),n.gradientMap&&l.enable(21),a.push(l.mask),l.disableAll(),n.fog&&l.enable(0),n.useFog&&l.enable(1),n.flatShading&&l.enable(2),n.logarithmicDepthBuffer&&l.enable(3),n.reversedDepthBuffer&&l.enable(4),n.skinning&&l.enable(5),n.morphTargets&&l.enable(6),n.morphNormals&&l.enable(7),n.morphColors&&l.enable(8),n.premultipliedAlpha&&l.enable(9),n.shadowMapEnabled&&l.enable(10),n.doubleSided&&l.enable(11),n.flipSided&&l.enable(12),n.useDepthPacking&&l.enable(13),n.dithering&&l.enable(14),n.transmission&&l.enable(15),n.sheen&&l.enable(16),n.opaque&&l.enable(17),n.pointsUvs&&l.enable(18),n.decodeVideoTexture&&l.enable(19),n.decodeVideoTextureEmissive&&l.enable(20),n.alphaToCoverage&&l.enable(21),a.push(l.mask),o.push(e.outputColorSpace)),o.push(t.customProgramCacheKey),o.join()},getUniforms:function(e){let t,i=h[e.type];if(i){let e=s[i];t=r.LlO.clone(e.uniforms)}else t=e.uniforms;return t},acquireProgram:function(t,i){let r=f.get(i);return void 0!==r?++r.usedTimes:(r=new ti(e,i,t,n),u.push(r),f.set(i,r)),r},releaseProgram:function(e){if(0==--e.usedTimes){let t=u.indexOf(e);u[t]=u[u.length-1],u.pop(),f.delete(e.cacheKey),e.destroy()}},releaseShaderCache:function(e){c.remove(e)},programs:u,dispose:function(){c.dispose()}}}function tl(){let e=new WeakMap;return{has:function(t){return e.has(t)},get:function(t){let i=e.get(t);return void 0===i&&(i={},e.set(t,i)),i},remove:function(t){e.delete(t)},update:function(t,i,r){e.get(t)[i]=r},dispose:function(){e=new WeakMap}}}function ts(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;if(e.material.id!==t.material.id)return e.material.id-t.material.id;if(e.materialVariant!==t.materialVariant)return e.materialVariant-t.materialVariant;if(e.z!==t.z)return e.z-t.z;else return e.id-t.id}function tc(e,t){return e.groupOrder!==t.groupOrder?e.groupOrder-t.groupOrder:e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.z!==t.z?t.z-e.z:e.id-t.id}function td(){let e=[],t=0,i=[],r=[],a=[];function n(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function o(i,r,a,o,l,s){let c=e[t];return void 0===c?(c={id:i.id,object:i,geometry:r,material:a,materialVariant:n(i),groupOrder:o,renderOrder:i.renderOrder,z:l,group:s},e[t]=c):(c.id=i.id,c.object=i,c.geometry=r,c.material=a,c.materialVariant=n(i),c.groupOrder=o,c.renderOrder=i.renderOrder,c.z=l,c.group=s),t++,c}return{opaque:i,transmissive:r,transparent:a,init:function(){t=0,i.length=0,r.length=0,a.length=0},push:function(e,t,n,l,s,c){let d=o(e,t,n,l,s,c);n.transmission>0?r.push(d):!0===n.transparent?a.push(d):i.push(d)},unshift:function(e,t,n,l,s,c){let d=o(e,t,n,l,s,c);n.transmission>0?r.unshift(d):!0===n.transparent?a.unshift(d):i.unshift(d)},finish:function(){for(let i=t,r=e.length;i<r;i++){let t=e[i];if(null===t.id)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}},sort:function(e,t){i.length>1&&i.sort(e||ts),r.length>1&&r.sort(t||tc),a.length>1&&a.sort(t||tc)}}}function tu(){let e=new WeakMap;return{get:function(t,i){let r,a=e.get(t);return void 0===a?(r=new td,e.set(t,[r])):i>=a.length?(r=new td,a.push(r)):r=a[i],r},dispose:function(){e=new WeakMap}}}function tf(){let e={};return{get:function(t){let i;if(void 0!==e[t.id])return e[t.id];switch(t.type){case"DirectionalLight":i={direction:new r.Pq0,color:new r.Q1f};break;case"SpotLight":i={position:new r.Pq0,direction:new r.Pq0,color:new r.Q1f,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new r.Pq0,color:new r.Q1f,distance:0,decay:0};break;case"HemisphereLight":i={direction:new r.Pq0,skyColor:new r.Q1f,groundColor:new r.Q1f};break;case"RectAreaLight":i={color:new r.Q1f,position:new r.Pq0,halfWidth:new r.Pq0,halfHeight:new r.Pq0}}return e[t.id]=i,i}}}let tp=0;function tm(e,t){return 2*!!t.castShadow-2*!!e.castShadow+ +!!t.map-!!e.map}function th(e){let t,i=new tf,a=(t={},{get:function(e){let i;if(void 0!==t[e.id])return t[e.id];switch(e.type){case"DirectionalLight":case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new r.I9Y};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new r.I9Y,shadowCameraNear:1,shadowCameraFar:1e3}}return t[e.id]=i,i}}),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)n.probe.push(new r.Pq0);let o=new r.Pq0,s=new r.kn4,c=new r.kn4;return{setup:function(t){let o=0,s=0,c=0;for(let e=0;e<9;e++)n.probe[e].set(0,0,0);let d=0,u=0,f=0,p=0,m=0,h=0,_=0,g=0,v=0,E=0,S=0;t.sort(tm);for(let e=0,l=t.length;e<l;e++){let l=t[e],M=l.color,T=l.intensity,x=l.distance,R=null;if(l.shadow&&l.shadow.map&&(R=l.shadow.map.texture.format===r.paN?l.shadow.map.texture:l.shadow.map.depthTexture||l.shadow.map.texture),l.isAmbientLight)o+=M.r*T,s+=M.g*T,c+=M.b*T;else if(l.isLightProbe){for(let e=0;e<9;e++)n.probe[e].addScaledVector(l.sh.coefficients[e],T);S++}else if(l.isDirectionalLight){let e=i.get(l);if(e.color.copy(l.color).multiplyScalar(l.intensity),l.castShadow){let e=l.shadow,t=a.get(l);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,n.directionalShadow[d]=t,n.directionalShadowMap[d]=R,n.directionalShadowMatrix[d]=l.shadow.matrix,h++}n.directional[d]=e,d++}else if(l.isSpotLight){let e=i.get(l);e.position.setFromMatrixPosition(l.matrixWorld),e.color.copy(M).multiplyScalar(T),e.distance=x,e.coneCos=Math.cos(l.angle),e.penumbraCos=Math.cos(l.angle*(1-l.penumbra)),e.decay=l.decay,n.spot[f]=e;let t=l.shadow;if(l.map&&(n.spotLightMap[v]=l.map,v++,t.updateMatrices(l),l.castShadow&&E++),n.spotLightMatrix[f]=t.matrix,l.castShadow){let e=a.get(l);e.shadowIntensity=t.intensity,e.shadowBias=t.bias,e.shadowNormalBias=t.normalBias,e.shadowRadius=t.radius,e.shadowMapSize=t.mapSize,n.spotShadow[f]=e,n.spotShadowMap[f]=R,g++}f++}else if(l.isRectAreaLight){let e=i.get(l);e.color.copy(M).multiplyScalar(T),e.halfWidth.set(.5*l.width,0,0),e.halfHeight.set(0,.5*l.height,0),n.rectArea[p]=e,p++}else if(l.isPointLight){let e=i.get(l);if(e.color.copy(l.color).multiplyScalar(l.intensity),e.distance=l.distance,e.decay=l.decay,l.castShadow){let e=l.shadow,t=a.get(l);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,n.pointShadow[u]=t,n.pointShadowMap[u]=R,n.pointShadowMatrix[u]=l.shadow.matrix,_++}n.point[u]=e,u++}else if(l.isHemisphereLight){let e=i.get(l);e.skyColor.copy(l.color).multiplyScalar(T),e.groundColor.copy(l.groundColor).multiplyScalar(T),n.hemi[m]=e,m++}}p>0&&(!0===e.has("OES_texture_float_linear")?(n.rectAreaLTC1=l.LTC_FLOAT_1,n.rectAreaLTC2=l.LTC_FLOAT_2):(n.rectAreaLTC1=l.LTC_HALF_1,n.rectAreaLTC2=l.LTC_HALF_2)),n.ambient[0]=o,n.ambient[1]=s,n.ambient[2]=c;let M=n.hash;(M.directionalLength!==d||M.pointLength!==u||M.spotLength!==f||M.rectAreaLength!==p||M.hemiLength!==m||M.numDirectionalShadows!==h||M.numPointShadows!==_||M.numSpotShadows!==g||M.numSpotMaps!==v||M.numLightProbes!==S)&&(n.directional.length=d,n.spot.length=f,n.rectArea.length=p,n.point.length=u,n.hemi.length=m,n.directionalShadow.length=h,n.directionalShadowMap.length=h,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=g,n.spotShadowMap.length=g,n.directionalShadowMatrix.length=h,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=g+v-E,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=S,M.directionalLength=d,M.pointLength=u,M.spotLength=f,M.rectAreaLength=p,M.hemiLength=m,M.numDirectionalShadows=h,M.numPointShadows=_,M.numSpotShadows=g,M.numSpotMaps=v,M.numLightProbes=S,n.version=tp++)},setupView:function(e,t){let i=0,r=0,a=0,l=0,d=0,u=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=n.directional[i];e.direction.setFromMatrixPosition(f.matrixWorld),o.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(o),e.direction.transformDirection(u),i++}else if(f.isSpotLight){let e=n.spot[a];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(u),e.direction.setFromMatrixPosition(f.matrixWorld),o.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(o),e.direction.transformDirection(u),a++}else if(f.isRectAreaLight){let e=n.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(u),c.identity(),s.copy(f.matrixWorld),s.premultiply(u),c.extractRotation(s),e.halfWidth.set(.5*f.width,0,0),e.halfHeight.set(0,.5*f.height,0),e.halfWidth.applyMatrix4(c),e.halfHeight.applyMatrix4(c),l++}else if(f.isPointLight){let e=n.point[r];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(u),r++}else if(f.isHemisphereLight){let e=n.hemi[d];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(u),d++}}},state:n}}function t_(e){let t=new th(e),i=[],r=[],a={lightsArray:i,shadowsArray:r,camera:null,lights:t,transmissionRenderTarget:{}};return{init:function(e){a.camera=e,i.length=0,r.length=0},state:a,setupLights:function(){t.setup(i)},setupLightsView:function(e){t.setupView(i,e)},pushLight:function(e){i.push(e)},pushShadow:function(e){r.push(e)}}}function tg(e){let t=new WeakMap;return{get:function(i,r=0){let a,n=t.get(i);return void 0===n?(a=new t_(e),t.set(i,[a])):r>=n.length?(a=new t_(e),n.push(a)):a=n[r],a},dispose:function(){t=new WeakMap}}}let tv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,tS=[new r.Pq0(1,0,0),new r.Pq0(-1,0,0),new r.Pq0(0,1,0),new r.Pq0(0,-1,0),new r.Pq0(0,0,1),new r.Pq0(0,0,-1)],tM=[new r.Pq0(0,-1,0),new r.Pq0(0,-1,0),new r.Pq0(0,0,1),new r.Pq0(0,0,-1),new r.Pq0(0,-1,0),new r.Pq0(0,-1,0)],tT=new r.kn4,tx=new r.Pq0,tR=new r.Pq0;function tA(e,t,i){let a=new r.PPD,n=new r.I9Y,o=new r.I9Y,l=new r.IUQ,s=new r.CSG,c=new r.aVO,d={},u=i.maxTextureSize,f={[r.hB5]:r.hsX,[r.hsX]:r.hB5,[r.$EB]:r.$EB},p=new r.BKk({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new r.I9Y},radius:{value:4}},vertexShader:tv,fragmentShader:tE}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new r.LoY;h.setAttribute("position",new r.THS(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new r.eaF(h,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=r.QP0;let v=this.type;function E(t,i,a,n){let o=null,l=!0===a.isPointLight?t.customDistanceMaterial:t.customDepthMaterial;if(void 0!==l)o=l;else if(o=!0===a.isPointLight?c:s,e.localClippingEnabled&&!0===i.clipShadows&&Array.isArray(i.clippingPlanes)&&0!==i.clippingPlanes.length||i.displacementMap&&0!==i.displacementScale||i.alphaMap&&i.alphaTest>0||i.map&&i.alphaTest>0||!0===i.alphaToCoverage){let e=o.uuid,t=i.uuid,r=d[e];void 0===r&&(r={},d[e]=r);let a=r[t];void 0===a&&(a=o.clone(),r[t]=a,i.addEventListener("dispose",S)),o=a}return o.visible=i.visible,o.wireframe=i.wireframe,n===r.RyA?o.side=null!==i.shadowSide?i.shadowSide:i.side:o.side=null!==i.shadowSide?i.shadowSide:f[i.side],o.alphaMap=i.alphaMap,o.alphaTest=!0===i.alphaToCoverage?.5:i.alphaTest,o.map=i.map,o.clipShadows=i.clipShadows,o.clippingPlanes=i.clippingPlanes,o.clipIntersection=i.clipIntersection,o.displacementMap=i.displacementMap,o.displacementScale=i.displacementScale,o.displacementBias=i.displacementBias,o.wireframeLinewidth=i.wireframeLinewidth,o.linewidth=i.linewidth,!0===a.isPointLight&&!0===o.isMeshDistanceMaterial&&(e.properties.get(o).light=a),o}function S(e){for(let t in e.target.removeEventListener("dispose",S),d){let i=d[t],r=e.target.uuid;r in i&&(i[r].dispose(),delete i[r])}}this.render=function(i,s,c){if(!1===g.enabled||!1===g.autoUpdate&&!1===g.needsUpdate||0===i.length)return;this.type===r.Wk7&&((0,r.R8M)("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=r.QP0);let d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),S=e.state;S.setBlending(r.XIg),!0===S.buffers.depth.getReversed()?S.buffers.color.setClear(0,0,0,0):S.buffers.color.setClear(1,1,1,1),S.buffers.depth.setTest(!0),S.setScissorTest(!1);let M=v!==this.type;M&&s.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let d=0,f=i.length;d<f;d++){let f=i[d],h=f.shadow;if(void 0===h){(0,r.R8M)("WebGLShadowMap:",f,"has no shadow.");continue}if(!1===h.autoUpdate&&!1===h.needsUpdate)continue;n.copy(h.mapSize);let g=h.getFrameExtents();n.multiply(g),o.copy(h.mapSize),(n.x>u||n.y>u)&&(n.x>u&&(o.x=Math.floor(u/g.x),n.x=o.x*g.x,h.mapSize.x=o.x),n.y>u&&(o.y=Math.floor(u/g.y),n.y=o.y*g.y,h.mapSize.y=o.y));let v=e.state.buffers.depth.getReversed();if(h.camera._reversedDepth=v,null===h.map||!0===M){if(null!==h.map&&(null!==h.map.depthTexture&&(h.map.depthTexture.dispose(),h.map.depthTexture=null),h.map.dispose()),this.type===r.RyA){if(f.isPointLight){(0,r.R8M)("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}h.map=new r.nWS(n.x,n.y,{format:r.paN,type:r.ix0,minFilter:r.k6q,magFilter:r.k6q,generateMipmaps:!1}),h.map.texture.name=f.name+".shadowMap",h.map.depthTexture=new r.VCu(n.x,n.y,r.RQf),h.map.depthTexture.name=f.name+".shadowMapDepth",h.map.depthTexture.format=r.zdS,h.map.depthTexture.compareFunction=null,h.map.depthTexture.minFilter=r.hxR,h.map.depthTexture.magFilter=r.hxR}else f.isPointLight?(h.map=new w(n.x),h.map.depthTexture=new r.Gc6(n.x,r.bkx)):(h.map=new r.nWS(n.x,n.y),h.map.depthTexture=new r.VCu(n.x,n.y,r.bkx)),h.map.depthTexture.name=f.name+".shadowMap",h.map.depthTexture.format=r.zdS,this.type===r.QP0?(h.map.depthTexture.compareFunction=v?r.gWB:r.TiK,h.map.depthTexture.minFilter=r.k6q,h.map.depthTexture.magFilter=r.k6q):(h.map.depthTexture.compareFunction=null,h.map.depthTexture.minFilter=r.hxR,h.map.depthTexture.magFilter=r.hxR);h.camera.updateProjectionMatrix()}let T=h.map.isWebGLCubeRenderTarget?6:1;for(let i=0;i<T;i++){if(h.map.isWebGLCubeRenderTarget)e.setRenderTarget(h.map,i),e.clear();else{0===i&&(e.setRenderTarget(h.map),e.clear());let t=h.getViewport(i);l.set(o.x*t.x,o.y*t.y,o.x*t.z,o.y*t.w),S.viewport(l)}if(f.isPointLight){let e=h.camera,t=h.matrix,r=f.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),tx.setFromMatrixPosition(f.matrixWorld),e.position.copy(tx),tR.copy(e.position),tR.add(tS[i]),e.up.copy(tM[i]),e.lookAt(tR),e.updateMatrixWorld(),t.makeTranslation(-tx.x,-tx.y,-tx.z),tT.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),h._frustum.setFromProjectionMatrix(tT,e.coordinateSystem,e.reversedDepth)}else h.updateMatrices(f);a=h.getFrustum(),function i(n,o,l,s,c){if(!1===n.visible)return;if(n.layers.test(o.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===r.RyA)&&(!n.frustumCulled||a.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(l.matrixWorldInverse,n.matrixWorld);let i=t.update(n),r=n.material;if(Array.isArray(r)){let t=i.groups;for(let a=0,d=t.length;a<d;a++){let d=t[a],u=r[d.materialIndex];if(u&&u.visible){let t=E(n,u,s,c);n.onBeforeShadow(e,n,o,l,i,t,d),e.renderBufferDirect(l,null,i,t,n,d),n.onAfterShadow(e,n,o,l,i,t,d)}}}else if(r.visible){let t=E(n,r,s,c);n.onBeforeShadow(e,n,o,l,i,t,null),e.renderBufferDirect(l,null,i,t,n,null),n.onAfterShadow(e,n,o,l,i,t,null)}}let d=n.children;for(let e=0,t=d.length;e<t;e++)i(d[e],o,l,s,c)}(s,c,h.camera,f,this.type)}!0!==h.isPointLightShadow&&this.type===r.RyA&&function(i,a){let o=t.update(_);p.defines.VSM_SAMPLES!==i.blurSamples&&(p.defines.VSM_SAMPLES=i.blurSamples,m.defines.VSM_SAMPLES=i.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),null===i.mapPass&&(i.mapPass=new r.nWS(n.x,n.y,{format:r.paN,type:r.ix0})),p.uniforms.shadow_pass.value=i.map.depthTexture,p.uniforms.resolution.value=i.mapSize,p.uniforms.radius.value=i.radius,e.setRenderTarget(i.mapPass),e.clear(),e.renderBufferDirect(a,null,o,p,_,null),m.uniforms.shadow_pass.value=i.mapPass.texture,m.uniforms.resolution.value=i.mapSize,m.uniforms.radius.value=i.radius,e.setRenderTarget(i.map),e.clear(),e.renderBufferDirect(a,null,o,m,_,null)}(h,c),h.needsUpdate=!1}v=this.type,g.needsUpdate=!1,e.setRenderTarget(d,f,h)}}function tb(e,t){let i=new function(){let t=!1,i=new r.IUQ,a=null,n=new r.IUQ(0,0,0,0);return{setMask:function(i){a===i||t||(e.colorMask(i,i,i,i),a=i)},setLocked:function(e){t=e},setClear:function(t,r,a,o,l){!0===l&&(t*=o,r*=o,a*=o),i.set(t,r,a,o),!1===n.equals(i)&&(e.clearColor(t,r,a,o),n.copy(i))},reset:function(){t=!1,a=null,n.set(-1,0,0,0)}}},a=new function(){let i=!1,a=!1,n=null,o=null,l=null;return{setReversed:function(e){if(a!==e){let i=t.get("EXT_clip_control");e?i.clipControlEXT(i.LOWER_LEFT_EXT,i.ZERO_TO_ONE_EXT):i.clipControlEXT(i.LOWER_LEFT_EXT,i.NEGATIVE_ONE_TO_ONE_EXT),a=e;let r=l;l=null,this.setClear(r)}},getReversed:function(){return a},setTest:function(t){t?H(e.DEPTH_TEST):V(e.DEPTH_TEST)},setMask:function(t){n===t||i||(e.depthMask(t),n=t)},setFunc:function(t){if(a&&(t=r.ri6[t]),o!==t){switch(t){case r.eHc:e.depthFunc(e.NEVER);break;case r.lGu:e.depthFunc(e.ALWAYS);break;case r.brA:e.depthFunc(e.LESS);break;case r.xSv:e.depthFunc(e.LEQUAL);break;case r.U3G:e.depthFunc(e.EQUAL);break;case r.Gwm:e.depthFunc(e.GEQUAL);break;case r.K52:e.depthFunc(e.GREATER);break;case r.bw0:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}o=t}},setLocked:function(e){i=e},setClear:function(t){l!==t&&(l=t,a&&(t=1-t),e.clearDepth(t))},reset:function(){i=!1,n=null,o=null,l=null,a=!1}}},n=new function(){let t=!1,i=null,r=null,a=null,n=null,o=null,l=null,s=null,c=null;return{setTest:function(i){t||(i?H(e.STENCIL_TEST):V(e.STENCIL_TEST))},setMask:function(r){i===r||t||(e.stencilMask(r),i=r)},setFunc:function(t,i,o){(r!==t||a!==i||n!==o)&&(e.stencilFunc(t,i,o),r=t,a=i,n=o)},setOp:function(t,i,r){(o!==t||l!==i||s!==r)&&(e.stencilOp(t,i,r),o=t,l=i,s=r)},setLocked:function(e){t=e},setClear:function(t){c!==t&&(e.clearStencil(t),c=t)},reset:function(){t=!1,i=null,r=null,a=null,n=null,o=null,l=null,s=null,c=null}}},o=new WeakMap,l=new WeakMap,s={},c={},d=new WeakMap,u=[],f=null,p=!1,m=null,h=null,_=null,g=null,v=null,E=null,S=null,M=new r.Q1f(0,0,0),T=0,x=!1,R=null,A=null,b=null,C=null,P=null,L=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),U=!1,w=e.getParameter(e.VERSION);-1!==w.indexOf("WebGL")?U=parseFloat(/^WebGL (\d)/.exec(w)[1])>=1:-1!==w.indexOf("OpenGL ES")&&(U=parseFloat(/^OpenGL ES (\d)/.exec(w)[1])>=2);let D=null,I={},N=e.getParameter(e.SCISSOR_BOX),y=e.getParameter(e.VIEWPORT),O=new r.IUQ().fromArray(N),F=new r.IUQ().fromArray(y);function B(t,i,r,a){let n=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(i,0,e.RGBA,1,1,a,0,e.RGBA,e.UNSIGNED_BYTE,n):e.texImage2D(i+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,n);return o}let G={};function H(t){!0!==s[t]&&(e.enable(t),s[t]=!0)}function V(t){!1!==s[t]&&(e.disable(t),s[t]=!1)}G[e.TEXTURE_2D]=B(e.TEXTURE_2D,e.TEXTURE_2D,1),G[e.TEXTURE_CUBE_MAP]=B(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),G[e.TEXTURE_2D_ARRAY]=B(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),G[e.TEXTURE_3D]=B(e.TEXTURE_3D,e.TEXTURE_3D,1,1),i.setClear(0,0,0,1),a.setClear(1),n.setClear(0),H(e.DEPTH_TEST),a.setFunc(r.xSv),X(!1),q(r.Vb5),H(e.CULL_FACE),z(r.XIg);let W={[r.gO9]:e.FUNC_ADD,[r.FXf]:e.FUNC_SUBTRACT,[r.nST]:e.FUNC_REVERSE_SUBTRACT};W[r.znC]=e.MIN,W[r.$ei]=e.MAX;let k={[r.ojh]:e.ZERO,[r.qad]:e.ONE,[r.f4X]:e.SRC_COLOR,[r.ie2]:e.SRC_ALPHA,[r.hgQ]:e.SRC_ALPHA_SATURATE,[r.wn6]:e.DST_COLOR,[r.hdd]:e.DST_ALPHA,[r.LiQ]:e.ONE_MINUS_SRC_COLOR,[r.OuU]:e.ONE_MINUS_SRC_ALPHA,[r.aEY]:e.ONE_MINUS_DST_COLOR,[r.Nt7]:e.ONE_MINUS_DST_ALPHA,[r.RrE]:e.CONSTANT_COLOR,[r.$Yl]:e.ONE_MINUS_CONSTANT_COLOR,[r.e0p]:e.CONSTANT_ALPHA,[r.ov9]:e.ONE_MINUS_CONSTANT_ALPHA};function z(t,i,a,n,o,l,s,c,d,u){if(t===r.XIg){!0===p&&(V(e.BLEND),p=!1);return}if(!1===p&&(H(e.BLEND),p=!0),t!==r.bCz){if(t!==m||u!==x){if((h!==r.gO9||v!==r.gO9)&&(e.blendEquation(e.FUNC_ADD),h=r.gO9,v=r.gO9),u)switch(t){case r.NTi:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case r.EZo:e.blendFunc(e.ONE,e.ONE);break;case r.Kwu:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case r.EdD:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:(0,r.z3S)("WebGLState: Invalid blending: ",t)}else switch(t){case r.NTi:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case r.EZo:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case r.Kwu:(0,r.z3S)("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case r.EdD:(0,r.z3S)("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:(0,r.z3S)("WebGLState: Invalid blending: ",t)}_=null,g=null,E=null,S=null,M.set(0,0,0),T=0,m=t,x=u}return}o=o||i,l=l||a,s=s||n,(i!==h||o!==v)&&(e.blendEquationSeparate(W[i],W[o]),h=i,v=o),(a!==_||n!==g||l!==E||s!==S)&&(e.blendFuncSeparate(k[a],k[n],k[l],k[s]),_=a,g=n,E=l,S=s),(!1===c.equals(M)||d!==T)&&(e.blendColor(c.r,c.g,c.b,d),M.copy(c),T=d),m=t,x=!1}function X(t){R!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),R=t)}function q(t){t!==r.WNZ?(H(e.CULL_FACE),t!==A&&(t===r.Vb5?e.cullFace(e.BACK):t===r.Jnc?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):V(e.CULL_FACE),A=t}function K(t,i,r){t?(H(e.POLYGON_OFFSET_FILL),(C!==i||P!==r)&&(C=i,P=r,a.getReversed()&&(i=-i),e.polygonOffset(i,r))):V(e.POLYGON_OFFSET_FILL)}return{buffers:{color:i,depth:a,stencil:n},enable:H,disable:V,bindFramebuffer:function(t,i){return c[t]!==i&&(e.bindFramebuffer(t,i),c[t]=i,t===e.DRAW_FRAMEBUFFER&&(c[e.FRAMEBUFFER]=i),t===e.FRAMEBUFFER&&(c[e.DRAW_FRAMEBUFFER]=i),!0)},drawBuffers:function(t,i){let r=u,a=!1;if(t){void 0===(r=d.get(i))&&(r=[],d.set(i,r));let n=t.textures;if(r.length!==n.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,i=n.length;t<i;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=n.length,a=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,a=!0);a&&e.drawBuffers(r)},useProgram:function(t){return f!==t&&(e.useProgram(t),f=t,!0)},setBlending:z,setMaterial:function(t,o){t.side===r.$EB?V(e.CULL_FACE):H(e.CULL_FACE);let l=t.side===r.hsX;o&&(l=!l),X(l),t.blending===r.NTi&&!1===t.transparent?z(r.XIg):z(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),a.setFunc(t.depthFunc),a.setTest(t.depthTest),a.setMask(t.depthWrite),i.setMask(t.colorWrite);let s=t.stencilWrite;n.setTest(s),s&&(n.setMask(t.stencilWriteMask),n.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),n.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),K(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),!0===t.alphaToCoverage?H(e.SAMPLE_ALPHA_TO_COVERAGE):V(e.SAMPLE_ALPHA_TO_COVERAGE)},setFlipSided:X,setCullFace:q,setLineWidth:function(t){t!==b&&(U&&e.lineWidth(t),b=t)},setPolygonOffset:K,setScissorTest:function(t){t?H(e.SCISSOR_TEST):V(e.SCISSOR_TEST)},activeTexture:function(t){void 0===t&&(t=e.TEXTURE0+L-1),D!==t&&(e.activeTexture(t),D=t)},bindTexture:function(t,i,r){void 0===r&&(r=null===D?e.TEXTURE0+L-1:D);let a=I[r];void 0===a&&(a={type:void 0,texture:void 0},I[r]=a),(a.type!==t||a.texture!==i)&&(D!==r&&(e.activeTexture(r),D=r),e.bindTexture(t,i||G[t]),a.type=t,a.texture=i)},unbindTexture:function(){let t=I[D];void 0!==t&&void 0!==t.type&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)},compressedTexImage2D:function(){try{e.compressedTexImage2D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},compressedTexImage3D:function(){try{e.compressedTexImage3D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},texImage2D:function(){try{e.texImage2D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},texImage3D:function(){try{e.texImage3D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},updateUBOMapping:function(t,i){let r=l.get(i);void 0===r&&(r=new WeakMap,l.set(i,r));let a=r.get(t);void 0===a&&(a=e.getUniformBlockIndex(i,t.name),r.set(t,a))},uniformBlockBinding:function(t,i){let r=l.get(i).get(t);o.get(i)!==r&&(e.uniformBlockBinding(i,r,t.__bindingPointIndex),o.set(i,r))},texStorage2D:function(){try{e.texStorage2D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},texStorage3D:function(){try{e.texStorage3D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},texSubImage2D:function(){try{e.texSubImage2D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},texSubImage3D:function(){try{e.texSubImage3D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},compressedTexSubImage2D:function(){try{e.compressedTexSubImage2D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},compressedTexSubImage3D:function(){try{e.compressedTexSubImage3D(...arguments)}catch(e){(0,r.z3S)("WebGLState:",e)}},scissor:function(t){!1===O.equals(t)&&(e.scissor(t.x,t.y,t.z,t.w),O.copy(t))},viewport:function(t){!1===F.equals(t)&&(e.viewport(t.x,t.y,t.z,t.w),F.copy(t))},reset:function(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(0xffffffff),e.stencilFunc(e.ALWAYS,0,0xffffffff),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),s={},D=null,I={},c={},d=new WeakMap,u=[],f=null,p=!1,m=null,h=null,_=null,g=null,v=null,E=null,S=null,M=new r.Q1f(0,0,0),T=0,x=!1,R=null,A=null,b=null,C=null,P=null,O.set(0,0,e.canvas.width,e.canvas.height),F.set(0,0,e.canvas.width,e.canvas.height),i.reset(),a.reset(),n.reset()}}}function tC(e,t,i,a,n,o,l){let s,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,d="u">typeof navigator&&/OculusBrowser/g.test(navigator.userAgent),u=new r.I9Y,f=new WeakMap,p=new WeakMap,m=!1;try{m="u">typeof OffscreenCanvas&&null!==new OffscreenCanvas(1,1).getContext("2d")}catch(e){}function h(e,t){return m?new OffscreenCanvas(e,t):(0,r.qq$)("canvas")}function _(e,t,i){let a=1,n=k(e);if((n.width>i||n.height>i)&&(a=i/Math.max(n.width,n.height)),a<1)if("u">typeof HTMLImageElement&&e instanceof HTMLImageElement||"u">typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"u">typeof ImageBitmap&&e instanceof ImageBitmap||"u">typeof VideoFrame&&e instanceof VideoFrame){let i=Math.floor(a*n.width),o=Math.floor(a*n.height);void 0===s&&(s=h(i,o));let l=t?h(i,o):s;return l.width=i,l.height=o,l.getContext("2d").drawImage(e,0,0,i,o),(0,r.R8M)("WebGLRenderer: Texture has been resized from ("+n.width+"x"+n.height+") to ("+i+"x"+o+")."),l}else"data"in e&&(0,r.R8M)("WebGLRenderer: Image in DataTexture is too big ("+n.width+"x"+n.height+").");return e}function g(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function E(i,a,n,o,l=!1){if(null!==i){if(void 0!==e[i])return e[i];(0,r.R8M)("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+i+"'")}let s=a;if(a===e.RED&&(n===e.FLOAT&&(s=e.R32F),n===e.HALF_FLOAT&&(s=e.R16F),n===e.UNSIGNED_BYTE&&(s=e.R8)),a===e.RED_INTEGER&&(n===e.UNSIGNED_BYTE&&(s=e.R8UI),n===e.UNSIGNED_SHORT&&(s=e.R16UI),n===e.UNSIGNED_INT&&(s=e.R32UI),n===e.BYTE&&(s=e.R8I),n===e.SHORT&&(s=e.R16I),n===e.INT&&(s=e.R32I)),a===e.RG&&(n===e.FLOAT&&(s=e.RG32F),n===e.HALF_FLOAT&&(s=e.RG16F),n===e.UNSIGNED_BYTE&&(s=e.RG8)),a===e.RG_INTEGER&&(n===e.UNSIGNED_BYTE&&(s=e.RG8UI),n===e.UNSIGNED_SHORT&&(s=e.RG16UI),n===e.UNSIGNED_INT&&(s=e.RG32UI),n===e.BYTE&&(s=e.RG8I),n===e.SHORT&&(s=e.RG16I),n===e.INT&&(s=e.RG32I)),a===e.RGB_INTEGER&&(n===e.UNSIGNED_BYTE&&(s=e.RGB8UI),n===e.UNSIGNED_SHORT&&(s=e.RGB16UI),n===e.UNSIGNED_INT&&(s=e.RGB32UI),n===e.BYTE&&(s=e.RGB8I),n===e.SHORT&&(s=e.RGB16I),n===e.INT&&(s=e.RGB32I)),a===e.RGBA_INTEGER&&(n===e.UNSIGNED_BYTE&&(s=e.RGBA8UI),n===e.UNSIGNED_SHORT&&(s=e.RGBA16UI),n===e.UNSIGNED_INT&&(s=e.RGBA32UI),n===e.BYTE&&(s=e.RGBA8I),n===e.SHORT&&(s=e.RGBA16I),n===e.INT&&(s=e.RGBA32I)),a===e.RGB&&(n===e.UNSIGNED_INT_5_9_9_9_REV&&(s=e.RGB9_E5),n===e.UNSIGNED_INT_10F_11F_11F_REV&&(s=e.R11F_G11F_B10F)),a===e.RGBA){let t=l?r.VxR:r.ppV.getTransfer(o);n===e.FLOAT&&(s=e.RGBA32F),n===e.HALF_FLOAT&&(s=e.RGBA16F),n===e.UNSIGNED_BYTE&&(s=t===r.KLL?e.SRGB8_ALPHA8:e.RGBA8),n===e.UNSIGNED_SHORT_4_4_4_4&&(s=e.RGBA4),n===e.UNSIGNED_SHORT_5_5_5_1&&(s=e.RGB5_A1)}return(s===e.R16F||s===e.R32F||s===e.RG16F||s===e.RG32F||s===e.RGBA16F||s===e.RGBA32F)&&t.get("EXT_color_buffer_float"),s}function S(t,i){let a;return t?null===i||i===r.bkx||i===r.V3x?a=e.DEPTH24_STENCIL8:i===r.RQf?a=e.DEPTH32F_STENCIL8:i===r.cHt&&(a=e.DEPTH24_STENCIL8,(0,r.R8M)("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):null===i||i===r.bkx||i===r.V3x?a=e.DEPTH_COMPONENT24:i===r.RQf?a=e.DEPTH_COMPONENT32F:i===r.cHt&&(a=e.DEPTH_COMPONENT16),a}function M(e,t){return!0===g(e)||e.isFramebufferTexture&&e.minFilter!==r.hxR&&e.minFilter!==r.k6q?Math.log2(Math.max(t.width,t.height))+1:void 0!==e.mipmaps&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=e.target;t.removeEventListener("dispose",T),function(e){let t=a.get(e);if(void 0===t.__webglInit)return;let i=e.source,r=p.get(i);if(r){let a=r[t.__cacheKey];a.usedTimes--,0===a.usedTimes&&R(e),0===Object.keys(r).length&&p.delete(i)}a.remove(e)}(t),t.isVideoTexture&&f.delete(t)}function x(t){let i=t.target;i.removeEventListener("dispose",x),function(t){let i=a.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),a.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(i.__webglFramebuffer[t]))for(let r=0;r<i.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(i.__webglFramebuffer[t][r]);else e.deleteFramebuffer(i.__webglFramebuffer[t]);i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer[t])}else{if(Array.isArray(i.__webglFramebuffer))for(let t=0;t<i.__webglFramebuffer.length;t++)e.deleteFramebuffer(i.__webglFramebuffer[t]);else e.deleteFramebuffer(i.__webglFramebuffer);if(i.__webglDepthbuffer&&e.deleteRenderbuffer(i.__webglDepthbuffer),i.__webglMultisampledFramebuffer&&e.deleteFramebuffer(i.__webglMultisampledFramebuffer),i.__webglColorRenderbuffer)for(let t=0;t<i.__webglColorRenderbuffer.length;t++)i.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(i.__webglColorRenderbuffer[t]);i.__webglDepthRenderbuffer&&e.deleteRenderbuffer(i.__webglDepthRenderbuffer)}let r=t.textures;for(let t=0,i=r.length;t<i;t++){let i=a.get(r[t]);i.__webglTexture&&(e.deleteTexture(i.__webglTexture),l.memory.textures--),a.remove(r[t])}a.remove(t)}(i)}function R(t){let i=a.get(t);e.deleteTexture(i.__webglTexture);let r=t.source,n=p.get(r);delete n[i.__cacheKey],l.memory.textures--}let A=0;function b(t,n){var o;let s,c=a.get(t);if(t.isVideoTexture&&(o=t,s=l.render.frame,f.get(o)!==s&&(f.set(o,s),o.update())),!1===t.isRenderTargetTexture&&!0!==t.isExternalTexture&&t.version>0&&c.__version!==t.version){let e=t.image;if(null===e)(0,r.R8M)("WebGLRenderer: Texture marked for update but no image data found.");else{if(!1!==e.complete)return void I(c,t,n);(0,r.R8M)("WebGLRenderer: Texture marked for update but image is incomplete")}}else t.isExternalTexture&&(c.__webglTexture=t.sourceTexture?t.sourceTexture:null);i.bindTexture(e.TEXTURE_2D,c.__webglTexture,e.TEXTURE0+n)}let C={[r.GJx]:e.REPEAT,[r.ghU]:e.CLAMP_TO_EDGE,[r.kTW]:e.MIRRORED_REPEAT},P={[r.hxR]:e.NEAREST,[r.pHI]:e.NEAREST_MIPMAP_NEAREST,[r.Cfg]:e.NEAREST_MIPMAP_LINEAR,[r.k6q]:e.LINEAR,[r.kRr]:e.LINEAR_MIPMAP_NEAREST,[r.$_I]:e.LINEAR_MIPMAP_LINEAR},L={[r.amv]:e.NEVER,[r.FFZ]:e.ALWAYS,[r.vim]:e.LESS,[r.TiK]:e.LEQUAL,[r.kO0]:e.EQUAL,[r.gWB]:e.GEQUAL,[r.eoi]:e.GREATER,[r.jzd]:e.NOTEQUAL};function U(i,o){if((o.type===r.RQf&&!1===t.has("OES_texture_float_linear")&&(o.magFilter===r.k6q||o.magFilter===r.kRr||o.magFilter===r.Cfg||o.magFilter===r.$_I||o.minFilter===r.k6q||o.minFilter===r.kRr||o.minFilter===r.Cfg||o.minFilter===r.$_I)&&(0,r.R8M)("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(i,e.TEXTURE_WRAP_S,C[o.wrapS]),e.texParameteri(i,e.TEXTURE_WRAP_T,C[o.wrapT]),(i===e.TEXTURE_3D||i===e.TEXTURE_2D_ARRAY)&&e.texParameteri(i,e.TEXTURE_WRAP_R,C[o.wrapR]),e.texParameteri(i,e.TEXTURE_MAG_FILTER,P[o.magFilter]),e.texParameteri(i,e.TEXTURE_MIN_FILTER,P[o.minFilter]),o.compareFunction&&(e.texParameteri(i,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(i,e.TEXTURE_COMPARE_FUNC,L[o.compareFunction])),!0===t.has("EXT_texture_filter_anisotropic"))&&o.magFilter!==r.hxR&&(o.minFilter===r.Cfg||o.minFilter===r.$_I)&&(o.type!==r.RQf||!1!==t.has("OES_texture_float_linear"))&&(o.anisotropy>1||a.get(o).__currentAnisotropy)){let r=t.get("EXT_texture_filter_anisotropic");e.texParameterf(i,r.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(o.anisotropy,n.getMaxAnisotropy())),a.get(o).__currentAnisotropy=o.anisotropy}}function w(t,i){let r,a=!1;void 0===t.__webglInit&&(t.__webglInit=!0,i.addEventListener("dispose",T));let n=i.source,o=p.get(n);void 0===o&&(o={},p.set(n,o));let s=((r=[]).push(i.wrapS),r.push(i.wrapT),r.push(i.wrapR||0),r.push(i.magFilter),r.push(i.minFilter),r.push(i.anisotropy),r.push(i.internalFormat),r.push(i.format),r.push(i.type),r.push(i.generateMipmaps),r.push(i.premultiplyAlpha),r.push(i.flipY),r.push(i.unpackAlignment),r.push(i.colorSpace),r.join());if(s!==t.__cacheKey){void 0===o[s]&&(o[s]={texture:e.createTexture(),usedTimes:0},l.memory.textures++,a=!0),o[s].usedTimes++;let r=o[t.__cacheKey];void 0!==r&&(o[t.__cacheKey].usedTimes--,0===r.usedTimes&&R(i)),t.__cacheKey=s,t.__webglTexture=o[s].texture}return a}function D(e,t,i){return Math.floor(Math.floor(e/i)/t)}function I(t,l,s){let c=e.TEXTURE_2D;(l.isDataArrayTexture||l.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),l.isData3DTexture&&(c=e.TEXTURE_3D);let d=w(t,l),u=l.source;i.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=a.get(u);if(u.version!==f.__version||!0===d){let t;i.activeTexture(e.TEXTURE0+s);let a=r.ppV.getPrimaries(r.ppV.workingColorSpace),p=l.colorSpace===r.jf0?null:r.ppV.getPrimaries(l.colorSpace),m=l.colorSpace===r.jf0||a===p?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,l.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,l.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,l.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,m);let h=_(l.image,!1,n.maxTextureSize);h=W(l,h);let T=o.convert(l.format,l.colorSpace),x=o.convert(l.type),R=E(l.internalFormat,T,x,l.colorSpace,l.isVideoTexture);U(c,l);let A=l.mipmaps,b=!0!==l.isVideoTexture,C=void 0===f.__version||!0===d,P=u.dataReady,L=M(l,h);if(l.isDepthTexture)R=S(l.format===r.dcC,l.type),C&&(b?i.texStorage2D(e.TEXTURE_2D,1,R,h.width,h.height):i.texImage2D(e.TEXTURE_2D,0,R,h.width,h.height,0,T,x,null));else if(l.isDataTexture)if(A.length>0){b&&C&&i.texStorage2D(e.TEXTURE_2D,L,R,A[0].width,A[0].height);for(let r=0,a=A.length;r<a;r++)t=A[r],b?P&&i.texSubImage2D(e.TEXTURE_2D,r,0,0,t.width,t.height,T,x,t.data):i.texImage2D(e.TEXTURE_2D,r,R,t.width,t.height,0,T,x,t.data);l.generateMipmaps=!1}else b?(C&&i.texStorage2D(e.TEXTURE_2D,L,R,h.width,h.height),P&&function(t,r,a,n){let o=t.updateRanges;if(0===o.length)i.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,a,n,r.data);else{o.sort((e,t)=>e.start-t.start);let l=0;for(let e=1;e<o.length;e++){let t=o[l],i=o[e],a=t.start+t.count,n=D(i.start,r.width,4),s=D(t.start,r.width,4);i.start<=a+1&&n===s&&D(i.start+i.count-1,r.width,4)===n?t.count=Math.max(t.count,i.start+i.count-t.start):o[++l]=i}o.length=l+1;let s=e.getParameter(e.UNPACK_ROW_LENGTH),c=e.getParameter(e.UNPACK_SKIP_PIXELS),d=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,l=o.length;t<l;t++){let l=o[t],s=Math.floor(l.start/4),c=Math.ceil(l.count/4),d=s%r.width,u=Math.floor(s/r.width);e.pixelStorei(e.UNPACK_SKIP_PIXELS,d),e.pixelStorei(e.UNPACK_SKIP_ROWS,u),i.texSubImage2D(e.TEXTURE_2D,0,d,u,c,1,a,n,r.data)}t.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,s),e.pixelStorei(e.UNPACK_SKIP_PIXELS,c),e.pixelStorei(e.UNPACK_SKIP_ROWS,d)}}(l,h,T,x)):i.texImage2D(e.TEXTURE_2D,0,R,h.width,h.height,0,T,x,h.data);else if(l.isCompressedTexture)if(l.isCompressedArrayTexture){b&&C&&i.texStorage3D(e.TEXTURE_2D_ARRAY,L,R,A[0].width,A[0].height,h.depth);for(let a=0,n=A.length;a<n;a++)if(t=A[a],l.format!==r.GWd)if(null!==T)if(b){if(P)if(l.layerUpdates.size>0){let n=(0,r.Nex)(t.width,t.height,l.format,l.type);for(let r of l.layerUpdates){let o=t.data.subarray(r*n/t.data.BYTES_PER_ELEMENT,(r+1)*n/t.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,r,t.width,t.height,1,T,o)}l.clearLayerUpdates()}else i.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,t.width,t.height,h.depth,T,t.data)}else i.compressedTexImage3D(e.TEXTURE_2D_ARRAY,a,R,t.width,t.height,h.depth,0,t.data,0,0);else(0,r.R8M)("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else b?P&&i.texSubImage3D(e.TEXTURE_2D_ARRAY,a,0,0,0,t.width,t.height,h.depth,T,x,t.data):i.texImage3D(e.TEXTURE_2D_ARRAY,a,R,t.width,t.height,h.depth,0,T,x,t.data)}else{b&&C&&i.texStorage2D(e.TEXTURE_2D,L,R,A[0].width,A[0].height);for(let a=0,n=A.length;a<n;a++)t=A[a],l.format!==r.GWd?null!==T?b?P&&i.compressedTexSubImage2D(e.TEXTURE_2D,a,0,0,t.width,t.height,T,t.data):i.compressedTexImage2D(e.TEXTURE_2D,a,R,t.width,t.height,0,t.data):(0,r.R8M)("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):b?P&&i.texSubImage2D(e.TEXTURE_2D,a,0,0,t.width,t.height,T,x,t.data):i.texImage2D(e.TEXTURE_2D,a,R,t.width,t.height,0,T,x,t.data)}else if(l.isDataArrayTexture)if(b){if(C&&i.texStorage3D(e.TEXTURE_2D_ARRAY,L,R,h.width,h.height,h.depth),P)if(l.layerUpdates.size>0){let t=(0,r.Nex)(h.width,h.height,l.format,l.type);for(let r of l.layerUpdates){let a=h.data.subarray(r*t/h.data.BYTES_PER_ELEMENT,(r+1)*t/h.data.BYTES_PER_ELEMENT);i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,r,h.width,h.height,1,T,x,a)}l.clearLayerUpdates()}else i.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,h.width,h.height,h.depth,T,x,h.data)}else i.texImage3D(e.TEXTURE_2D_ARRAY,0,R,h.width,h.height,h.depth,0,T,x,h.data);else if(l.isData3DTexture)b?(C&&i.texStorage3D(e.TEXTURE_3D,L,R,h.width,h.height,h.depth),P&&i.texSubImage3D(e.TEXTURE_3D,0,0,0,0,h.width,h.height,h.depth,T,x,h.data)):i.texImage3D(e.TEXTURE_3D,0,R,h.width,h.height,h.depth,0,T,x,h.data);else if(l.isFramebufferTexture){if(C)if(b)i.texStorage2D(e.TEXTURE_2D,L,R,h.width,h.height);else{let t=h.width,r=h.height;for(let a=0;a<L;a++)i.texImage2D(e.TEXTURE_2D,a,R,t,r,0,T,x,null),t>>=1,r>>=1}}else if(A.length>0){if(b&&C){let t=k(A[0]);i.texStorage2D(e.TEXTURE_2D,L,R,t.width,t.height)}for(let r=0,a=A.length;r<a;r++)t=A[r],b?P&&i.texSubImage2D(e.TEXTURE_2D,r,0,0,T,x,t):i.texImage2D(e.TEXTURE_2D,r,R,T,x,t);l.generateMipmaps=!1}else if(b){if(C){let t=k(h);i.texStorage2D(e.TEXTURE_2D,L,R,t.width,t.height)}P&&i.texSubImage2D(e.TEXTURE_2D,0,0,0,T,x,h)}else i.texImage2D(e.TEXTURE_2D,0,R,T,x,h);g(l)&&v(c),f.__version=u.version,l.onUpdate&&l.onUpdate(l)}t.__version=l.version}function N(t,r,n,l,s,d){let u=o.convert(n.format,n.colorSpace),f=o.convert(n.type),p=E(n.internalFormat,u,f,n.colorSpace),m=a.get(r),h=a.get(n);if(h.__renderTarget=r,!m.__hasExternalTextures){let t=Math.max(1,r.width>>d),a=Math.max(1,r.height>>d);s===e.TEXTURE_3D||s===e.TEXTURE_2D_ARRAY?i.texImage3D(s,d,p,t,a,r.depth,0,u,f,null):i.texImage2D(s,d,p,t,a,0,u,f,null)}i.bindFramebuffer(e.FRAMEBUFFER,t),V(r)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,l,s,h.__webglTexture,0,H(r)):(s===e.TEXTURE_2D||s>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&s<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,l,s,h.__webglTexture,d),i.bindFramebuffer(e.FRAMEBUFFER,null)}function y(t,i,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),i.depthBuffer){let a=i.depthTexture,n=a&&a.isDepthTexture?a.type:null,o=S(i.stencilBuffer,n),l=i.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;V(i)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,H(i),o,i.width,i.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,H(i),o,i.width,i.height):e.renderbufferStorage(e.RENDERBUFFER,o,i.width,i.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,l,e.RENDERBUFFER,t)}else{let t=i.textures;for(let a=0;a<t.length;a++){let n=t[a],l=o.convert(n.format,n.colorSpace),s=o.convert(n.type),d=E(n.internalFormat,l,s,n.colorSpace);V(i)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,H(i),d,i.width,i.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,H(i),d,i.width,i.height):e.renderbufferStorage(e.RENDERBUFFER,d,i.width,i.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function O(t,n,l){let s=!0===n.isWebGLCubeRenderTarget;if(i.bindFramebuffer(e.FRAMEBUFFER,t),!(n.depthTexture&&n.depthTexture.isDepthTexture))throw Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let d=a.get(n.depthTexture);if(d.__renderTarget=n,d.__webglTexture&&n.depthTexture.image.width===n.width&&n.depthTexture.image.height===n.height||(n.depthTexture.image.width=n.width,n.depthTexture.image.height=n.height,n.depthTexture.needsUpdate=!0),s){if(void 0===d.__webglInit&&(d.__webglInit=!0,n.depthTexture.addEventListener("dispose",T)),void 0===d.__webglTexture){let t;d.__webglTexture=e.createTexture(),i.bindTexture(e.TEXTURE_CUBE_MAP,d.__webglTexture),U(e.TEXTURE_CUBE_MAP,n.depthTexture);let a=o.convert(n.depthTexture.format),l=o.convert(n.depthTexture.type);n.depthTexture.format===r.zdS?t=e.DEPTH_COMPONENT24:n.depthTexture.format===r.dcC&&(t=e.DEPTH24_STENCIL8);for(let i=0;i<6;i++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,t,n.width,n.height,0,a,l,null)}}else b(n.depthTexture,0);let u=d.__webglTexture,f=H(n),p=s?e.TEXTURE_CUBE_MAP_POSITIVE_X+l:e.TEXTURE_2D,m=n.depthTexture.format===r.dcC?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(n.depthTexture.format===r.zdS)V(n)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,m,p,u,0,f):e.framebufferTexture2D(e.FRAMEBUFFER,m,p,u,0);else if(n.depthTexture.format===r.dcC)V(n)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,m,p,u,0,f):e.framebufferTexture2D(e.FRAMEBUFFER,m,p,u,0);else throw Error("Unknown depthTexture format")}function F(t){let r=a.get(t),n=!0===t.isWebGLCubeRenderTarget;if(r.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),e){let t=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,e.removeEventListener("dispose",t)};e.addEventListener("dispose",t),r.__depthDisposeCallback=t}r.__boundDepthTexture=e}if(t.depthTexture&&!r.__autoAllocateDepthBuffer)if(n)for(let e=0;e<6;e++)O(r.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?O(r.__webglFramebuffer[0],t,0):O(r.__webglFramebuffer,t,0)}else if(n){r.__webglDepthbuffer=[];for(let a=0;a<6;a++)if(i.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[a]),void 0===r.__webglDepthbuffer[a])r.__webglDepthbuffer[a]=e.createRenderbuffer(),y(r.__webglDepthbuffer[a],t,!1);else{let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,n=r.__webglDepthbuffer[a];e.bindRenderbuffer(e.RENDERBUFFER,n),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,n)}}else{let a=t.texture.mipmaps;if(a&&a.length>0?i.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):i.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),void 0===r.__webglDepthbuffer)r.__webglDepthbuffer=e.createRenderbuffer(),y(r.__webglDepthbuffer,t,!1);else{let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,i,e.RENDERBUFFER,a)}}i.bindFramebuffer(e.FRAMEBUFFER,null)}let B=[],G=[];function H(e){return Math.min(n.maxSamples,e.samples)}function V(e){let i=a.get(e);return e.samples>0&&!0===t.has("WEBGL_multisampled_render_to_texture")&&!1!==i.__useRenderToTexture}function W(e,t){let i=e.colorSpace,a=e.format,n=e.type;return!0===e.isCompressedTexture||!0===e.isVideoTexture||i!==r.Zr2&&i!==r.jf0&&(r.ppV.getTransfer(i)===r.KLL?(a!==r.GWd||n!==r.OUM)&&(0,r.R8M)("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):(0,r.z3S)("WebGLTextures: Unsupported texture color space:",i)),t}function k(e){return"u">typeof HTMLImageElement&&e instanceof HTMLImageElement?(u.width=e.naturalWidth||e.width,u.height=e.naturalHeight||e.height):"u">typeof VideoFrame&&e instanceof VideoFrame?(u.width=e.displayWidth,u.height=e.displayHeight):(u.width=e.width,u.height=e.height),u}this.allocateTextureUnit=function(){let e=A;return e>=n.maxTextures&&(0,r.R8M)("WebGLTextures: Trying to use "+e+" texture units while this GPU supports only "+n.maxTextures),A+=1,e},this.resetTextureUnits=function(){A=0},this.setTexture2D=b,this.setTexture2DArray=function(t,r){let n=a.get(t);!1===t.isRenderTargetTexture&&t.version>0&&n.__version!==t.version?I(n,t,r):(t.isExternalTexture&&(n.__webglTexture=t.sourceTexture?t.sourceTexture:null),i.bindTexture(e.TEXTURE_2D_ARRAY,n.__webglTexture,e.TEXTURE0+r))},this.setTexture3D=function(t,r){let n=a.get(t);!1===t.isRenderTargetTexture&&t.version>0&&n.__version!==t.version?I(n,t,r):i.bindTexture(e.TEXTURE_3D,n.__webglTexture,e.TEXTURE0+r)},this.setTextureCube=function(t,l){let s=a.get(t);!0!==t.isCubeDepthTexture&&t.version>0&&s.__version!==t.version?function(t,l,s){if(6!==l.image.length)return;let c=w(t,l),d=l.source;i.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=a.get(d);if(d.version!==u.__version||!0===c){let t;i.activeTexture(e.TEXTURE0+s);let a=r.ppV.getPrimaries(r.ppV.workingColorSpace),f=l.colorSpace===r.jf0?null:r.ppV.getPrimaries(l.colorSpace),p=l.colorSpace===r.jf0||a===f?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,l.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,l.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,l.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,p);let m=l.isCompressedTexture||l.image[0].isCompressedTexture,h=l.image[0]&&l.image[0].isDataTexture,S=[];for(let e=0;e<6;e++)m||h?S[e]=h?l.image[e].image:l.image[e]:S[e]=_(l.image[e],!0,n.maxCubemapSize),S[e]=W(l,S[e]);let T=S[0],x=o.convert(l.format,l.colorSpace),R=o.convert(l.type),A=E(l.internalFormat,x,R,l.colorSpace),b=!0!==l.isVideoTexture,C=void 0===u.__version||!0===c,P=d.dataReady,L=M(l,T);if(U(e.TEXTURE_CUBE_MAP,l),m){b&&C&&i.texStorage2D(e.TEXTURE_CUBE_MAP,L,A,T.width,T.height);for(let a=0;a<6;a++){t=S[a].mipmaps;for(let n=0;n<t.length;n++){let o=t[n];l.format!==r.GWd?null!==x?b?P&&i.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,n,0,0,o.width,o.height,x,o.data):i.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,n,A,o.width,o.height,0,o.data):(0,r.R8M)("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):b?P&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,n,0,0,o.width,o.height,x,R,o.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+a,n,A,o.width,o.height,0,x,R,o.data)}}}else{if(t=l.mipmaps,b&&C){t.length>0&&L++;let r=k(S[0]);i.texStorage2D(e.TEXTURE_CUBE_MAP,L,A,r.width,r.height)}for(let r=0;r<6;r++)if(h){b?P&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,0,0,S[r].width,S[r].height,x,R,S[r].data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,A,S[r].width,S[r].height,0,x,R,S[r].data);for(let a=0;a<t.length;a++){let n=t[a].image[r].image;b?P&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,a+1,0,0,n.width,n.height,x,R,n.data):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,a+1,A,n.width,n.height,0,x,R,n.data)}}else{b?P&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,0,0,x,R,S[r]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,A,x,R,S[r]);for(let a=0;a<t.length;a++){let n=t[a];b?P&&i.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,a+1,0,0,x,R,n.image[r]):i.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+r,a+1,A,x,R,n.image[r])}}}g(l)&&v(e.TEXTURE_CUBE_MAP),u.__version=d.version,l.onUpdate&&l.onUpdate(l)}t.__version=l.version}(s,t,l):i.bindTexture(e.TEXTURE_CUBE_MAP,s.__webglTexture,e.TEXTURE0+l)},this.rebindTextures=function(t,i,r){let n=a.get(t);void 0!==i&&N(n.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),void 0!==r&&F(t)},this.setupRenderTarget=function(t){let r=t.texture,n=a.get(t),s=a.get(r);t.addEventListener("dispose",x);let c=t.textures,d=!0===t.isWebGLCubeRenderTarget,u=c.length>1;if(!u&&(void 0===s.__webglTexture&&(s.__webglTexture=e.createTexture()),s.__version=r.version,l.memory.textures++),d){n.__webglFramebuffer=[];for(let t=0;t<6;t++)if(r.mipmaps&&r.mipmaps.length>0){n.__webglFramebuffer[t]=[];for(let i=0;i<r.mipmaps.length;i++)n.__webglFramebuffer[t][i]=e.createFramebuffer()}else n.__webglFramebuffer[t]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){n.__webglFramebuffer=[];for(let t=0;t<r.mipmaps.length;t++)n.__webglFramebuffer[t]=e.createFramebuffer()}else n.__webglFramebuffer=e.createFramebuffer();if(u)for(let t=0,i=c.length;t<i;t++){let i=a.get(c[t]);void 0===i.__webglTexture&&(i.__webglTexture=e.createTexture(),l.memory.textures++)}if(t.samples>0&&!1===V(t)){n.__webglMultisampledFramebuffer=e.createFramebuffer(),n.__webglColorRenderbuffer=[],i.bindFramebuffer(e.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let i=0;i<c.length;i++){let r=c[i];n.__webglColorRenderbuffer[i]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,n.__webglColorRenderbuffer[i]);let a=o.convert(r.format,r.colorSpace),l=o.convert(r.type),s=E(r.internalFormat,a,l,r.colorSpace,!0===t.isXRRenderTarget),d=H(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,d,s,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.RENDERBUFFER,n.__webglColorRenderbuffer[i])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(n.__webglDepthRenderbuffer=e.createRenderbuffer(),y(n.__webglDepthRenderbuffer,t,!0)),i.bindFramebuffer(e.FRAMEBUFFER,null)}}if(d){i.bindTexture(e.TEXTURE_CUBE_MAP,s.__webglTexture),U(e.TEXTURE_CUBE_MAP,r);for(let i=0;i<6;i++)if(r.mipmaps&&r.mipmaps.length>0)for(let a=0;a<r.mipmaps.length;a++)N(n.__webglFramebuffer[i][a],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,a);else N(n.__webglFramebuffer[i],t,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+i,0);g(r)&&v(e.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(u){for(let r=0,o=c.length;r<o;r++){let o=c[r],l=a.get(o),s=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(s=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(s,l.__webglTexture),U(s,o),N(n.__webglFramebuffer,t,o,e.COLOR_ATTACHMENT0+r,s,0),g(o)&&v(s)}i.unbindTexture()}else{let a=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(a=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),i.bindTexture(a,s.__webglTexture),U(a,r),r.mipmaps&&r.mipmaps.length>0)for(let i=0;i<r.mipmaps.length;i++)N(n.__webglFramebuffer[i],t,r,e.COLOR_ATTACHMENT0,a,i);else N(n.__webglFramebuffer,t,r,e.COLOR_ATTACHMENT0,a,0);g(r)&&v(a),i.unbindTexture()}t.depthBuffer&&F(t)},this.updateRenderTargetMipmap=function(t){let r=t.textures;for(let n=0,o=r.length;n<o;n++){let o=r[n];if(g(o)){let r=t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D,n=a.get(o).__webglTexture;i.bindTexture(r,n),v(r),i.unbindTexture()}}},this.updateMultisampleRenderTarget=function(t){if(t.samples>0){if(!1===V(t)){let r=t.textures,n=t.width,o=t.height,l=e.COLOR_BUFFER_BIT,s=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,c=a.get(t),u=r.length>1;if(u)for(let t=0;t<r.length;t++)i.bindFramebuffer(e.FRAMEBUFFER,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),i.bindFramebuffer(e.FRAMEBUFFER,c.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);i.bindFramebuffer(e.READ_FRAMEBUFFER,c.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?i.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglFramebuffer[0]):i.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglFramebuffer);for(let i=0;i<r.length;i++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(l|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(l|=e.STENCIL_BUFFER_BIT)),u){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,c.__webglColorRenderbuffer[i]);let t=a.get(r[i]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,n,o,0,0,n,o,l,e.NEAREST),!0===d&&(B.length=0,G.length=0,B.push(e.COLOR_ATTACHMENT0+i),t.depthBuffer&&!1===t.resolveDepthBuffer&&(B.push(s),G.push(s),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,G)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,B))}if(i.bindFramebuffer(e.READ_FRAMEBUFFER,null),i.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),u)for(let t=0;t<r.length;t++){i.bindFramebuffer(e.FRAMEBUFFER,c.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,c.__webglColorRenderbuffer[t]);let n=a.get(r[t]).__webglTexture;i.bindFramebuffer(e.FRAMEBUFFER,c.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,n,0)}i.bindFramebuffer(e.DRAW_FRAMEBUFFER,c.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&!1===t.resolveDepthBuffer&&d){let i=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[i])}}},this.setupDepthRenderbuffer=F,this.setupFrameBufferTexture=N,this.useMultisampledRTT=V,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function tP(e,t){return{convert:function(i,a=r.jf0){let n,o=r.ppV.getTransfer(a);if(i===r.OUM)return e.UNSIGNED_BYTE;if(i===r.Wew)return e.UNSIGNED_SHORT_4_4_4_4;if(i===r.gJ2)return e.UNSIGNED_SHORT_5_5_5_1;if(i===r.Dmk)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===r.yT7)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===r.tJf)return e.BYTE;if(i===r.fBL)return e.SHORT;if(i===r.cHt)return e.UNSIGNED_SHORT;if(i===r.Yuy)return e.INT;if(i===r.bkx)return e.UNSIGNED_INT;if(i===r.RQf)return e.FLOAT;if(i===r.ix0)return e.HALF_FLOAT;if(i===r.wrO)return e.ALPHA;if(i===r.HIg)return e.RGB;if(i===r.GWd)return e.RGBA;if(i===r.zdS)return e.DEPTH_COMPONENT;if(i===r.dcC)return e.DEPTH_STENCIL;if(i===r.VT0)return e.RED;if(i===r.ZQM)return e.RED_INTEGER;if(i===r.paN)return e.RG;if(i===r.TkQ)return e.RG_INTEGER;if(i===r.c90)return e.RGBA_INTEGER;if(i===r.IE4||i===r.Nz6||i===r.jR7||i===r.BXX)if(o===r.KLL){if(null===(n=t.get("WEBGL_compressed_texture_s3tc_srgb")))return null;if(i===r.IE4)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===r.Nz6)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===r.jR7)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===r.BXX)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else{if(null===(n=t.get("WEBGL_compressed_texture_s3tc")))return null;if(i===r.IE4)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===r.Nz6)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===r.jR7)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===r.BXX)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}if(i===r.k6Q||i===r.kTp||i===r.HXV||i===r.pBf){if(null===(n=t.get("WEBGL_compressed_texture_pvrtc")))return null;if(i===r.k6Q)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===r.kTp)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===r.HXV)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===r.pBf)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}if(i===r.CVz||i===r.Riy||i===r.KDk||i===r.BVL||i===r.gZr||i===r.OtU||i===r.jSS){if(null===(n=t.get("WEBGL_compressed_texture_etc")))return null;if(i===r.CVz||i===r.Riy)return o===r.KLL?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===r.KDk)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC;if(i===r.BVL)return n.COMPRESSED_R11_EAC;if(i===r.gZr)return n.COMPRESSED_SIGNED_R11_EAC;if(i===r.OtU)return n.COMPRESSED_RG11_EAC;if(i===r.jSS)return n.COMPRESSED_SIGNED_RG11_EAC}if(i===r.qa3||i===r.B_h||i===r.czI||i===r.rSH||i===r.Qrf||i===r.psI||i===r.a5J||i===r._QJ||i===r.uB5||i===r.lyL||i===r.bC7||i===r.y3Z||i===r.ojs||i===r.S$4){if(null===(n=t.get("WEBGL_compressed_texture_astc")))return null;if(i===r.qa3)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===r.B_h)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===r.czI)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===r.rSH)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===r.Qrf)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===r.psI)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===r.a5J)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===r._QJ)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===r.uB5)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===r.lyL)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===r.bC7)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===r.y3Z)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===r.ojs)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===r.S$4)return o===r.KLL?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}if(i===r.Fn||i===r.H23||i===r.W9U){if(null===(n=t.get("EXT_texture_compression_bptc")))return null;if(i===r.Fn)return o===r.KLL?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===r.H23)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===r.W9U)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}if(i===r.Kef||i===r.XG_||i===r.HO_||i===r.CWW){if(null===(n=t.get("EXT_texture_compression_rgtc")))return null;if(i===r.Kef)return n.COMPRESSED_RED_RGTC1_EXT;if(i===r.XG_)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===r.HO_)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===r.CWW)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}return i===r.V3x?e.UNSIGNED_INT_24_8:void 0!==e[i]?e[i]:null}}}let tL=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,tU=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class tw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(null===this.texture){let i=new r.rjZ(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(null!==this.texture&&null===this.mesh){let t=e.cameras[0].viewport,i=new r.BKk({vertexShader:tL,fragmentShader:tU,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new r.eaF(new r.bdM(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class tD extends r.Qev{constructor(e,t){super();const i=this;let n=null,o=1,l=null,s="local-floor",c=1,d=null,u=null,f=null,p=null,m=null,h=null;const _="u">typeof XRWebGLBinding,g=new tw,v={},E=t.getContextAttributes();let S=null,M=null;const T=[],x=[],R=new r.I9Y;let A=null;const b=new r.ubm;b.viewport=new r.IUQ;const C=new r.ubm;C.viewport=new r.IUQ;const P=[b,C],L=new r.nZQ;let U=null,w=null;function D(e){let t=x.indexOf(e.inputSource);if(-1===t)return;let i=T[t];void 0!==i&&(i.update(e.inputSource,e.frame,d||l),i.dispatchEvent({type:e.type,data:e.inputSource}))}function I(){n.removeEventListener("select",D),n.removeEventListener("selectstart",D),n.removeEventListener("selectend",D),n.removeEventListener("squeeze",D),n.removeEventListener("squeezestart",D),n.removeEventListener("squeezeend",D),n.removeEventListener("end",I),n.removeEventListener("inputsourceschange",N);for(let e=0;e<T.length;e++){let t=x[e];null!==t&&(x[e]=null,T[e].disconnect(t))}for(let e in U=null,w=null,g.reset(),v)delete v[e];e.setRenderTarget(S),m=null,p=null,f=null,n=null,M=null,G.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}function N(e){for(let t=0;t<e.removed.length;t++){let i=e.removed[t],r=x.indexOf(i);r>=0&&(x[r]=null,T[r].disconnect(i))}for(let t=0;t<e.added.length;t++){let i=e.added[t],r=x.indexOf(i);if(-1===r){for(let e=0;e<T.length;e++)if(e>=x.length){x.push(i),r=e;break}else if(null===x[e]){x[e]=i,r=e;break}if(-1===r)break}let a=T[r];a&&a.connect(i)}}this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=T[e];return void 0===t&&(t=new r.R3r,T[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=T[e];return void 0===t&&(t=new r.R3r,T[e]=t),t.getGripSpace()},this.getHand=function(e){let t=T[e];return void 0===t&&(t=new r.R3r,T[e]=t),t.getHandSpace()},this.setFramebufferScaleFactor=function(e){o=e,!0===i.isPresenting&&(0,r.R8M)("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(e){s=e,!0===i.isPresenting&&(0,r.R8M)("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||l},this.setReferenceSpace=function(e){d=e},this.getBaseLayer=function(){return null!==p?p:m},this.getBinding=function(){return null===f&&_&&(f=new XRWebGLBinding(n,t)),f},this.getFrame=function(){return h},this.getSession=function(){return n},this.setSession=async function(a){if(null!==(n=a)){if(S=e.getRenderTarget(),n.addEventListener("select",D),n.addEventListener("selectstart",D),n.addEventListener("selectend",D),n.addEventListener("squeeze",D),n.addEventListener("squeezestart",D),n.addEventListener("squeezeend",D),n.addEventListener("end",I),n.addEventListener("inputsourceschange",N),!0!==E.xrCompatible&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let i=null,a=null,l=null;E.depth&&(l=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,i=E.stencil?r.dcC:r.zdS,a=E.stencil?r.V3x:r.bkx);let s={colorFormat:t.RGBA8,depthFormat:l,scaleFactor:o};p=(f=this.getBinding()).createProjectionLayer(s),n.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),M=new r.nWS(p.textureWidth,p.textureHeight,{format:r.GWd,type:r.OUM,depthTexture:new r.VCu(p.textureWidth,p.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,i),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:4*!!E.antialias,resolveDepthBuffer:!1===p.ignoreDepthValues,resolveStencilBuffer:!1===p.ignoreDepthValues})}else{let i={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:o};m=new XRWebGLLayer(n,t,i),n.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),M=new r.nWS(m.framebufferWidth,m.framebufferHeight,{format:r.GWd,type:r.OUM,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:!1===m.ignoreDepthValues,resolveStencilBuffer:!1===m.ignoreDepthValues})}M.isXRRenderTarget=!0,this.setFoveation(c),d=null,l=await n.requestReferenceSpace(s),G.setContext(n),G.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(null!==n)return n.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};const y=new r.Pq0,O=new r.Pq0;function F(e,t){null===t?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){var t,i,a;if(null===n)return;let o=e.near,l=e.far;null!==g.texture&&(g.depthNear>0&&(o=g.depthNear),g.depthFar>0&&(l=g.depthFar)),L.near=C.near=b.near=o,L.far=C.far=b.far=l,(U!==L.near||w!==L.far)&&(n.updateRenderState({depthNear:L.near,depthFar:L.far}),U=L.near,w=L.far),L.layers.mask=6|e.layers.mask,b.layers.mask=-5&L.layers.mask,C.layers.mask=-3&L.layers.mask;let s=e.parent,c=L.cameras;F(L,s);for(let e=0;e<c.length;e++)F(c[e],s);2===c.length?function(e,t,i){y.setFromMatrixPosition(t.matrixWorld),O.setFromMatrixPosition(i.matrixWorld);let r=y.distanceTo(O),a=t.projectionMatrix.elements,n=i.projectionMatrix.elements,o=a[14]/(a[10]-1),l=a[14]/(a[10]+1),s=(a[9]+1)/a[5],c=(a[9]-1)/a[5],d=(a[8]-1)/a[0],u=(n[8]+1)/n[0],f=r/(-d+u),p=-(f*d);if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(p),e.translateZ(f),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),-1===a[10])e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+f,i=l+f;e.projectionMatrix.makePerspective(o*d-p,o*u+(r-p),s*l/i*t,c*l/i*t,t,i),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}(L,b,C):L.projectionMatrix.copy(b.projectionMatrix),t=e,i=L,null===(a=s)?t.matrix.copy(i.matrixWorld):(t.matrix.copy(a.matrixWorld),t.matrix.invert(),t.matrix.multiply(i.matrixWorld)),t.matrix.decompose(t.position,t.quaternion,t.scale),t.updateMatrixWorld(!0),t.projectionMatrix.copy(i.projectionMatrix),t.projectionMatrixInverse.copy(i.projectionMatrixInverse),t.isPerspectiveCamera&&(t.fov=2*r.a55*Math.atan(1/t.projectionMatrix.elements[5]),t.zoom=1)},this.getCamera=function(){return L},this.getFoveation=function(){if(null!==p||null!==m)return c},this.setFoveation=function(e){c=e,null!==p&&(p.fixedFoveation=e),null!==m&&void 0!==m.fixedFoveation&&(m.fixedFoveation=e)},this.hasDepthSensing=function(){return null!==g.texture},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function(e){return v[e]};let B=null;const G=new a;G.setAnimationLoop(function(t,a){if(u=a.getViewerPose(d||l),h=a,null!==u){let t=u.views;null!==m&&(e.setRenderTargetFramebuffer(M,m.framebuffer),e.setRenderTarget(M));let a=!1;t.length!==L.cameras.length&&(L.cameras.length=0,a=!0);for(let i=0;i<t.length;i++){let n=t[i],o=null;if(null!==m)o=m.getViewport(n);else{let t=f.getViewSubImage(p,n);o=t.viewport,0===i&&(e.setRenderTargetTextures(M,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(M))}let l=P[i];void 0===l&&((l=new r.ubm).layers.enable(i),l.viewport=new r.IUQ,P[i]=l),l.matrix.fromArray(n.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.projectionMatrix.fromArray(n.projectionMatrix),l.projectionMatrixInverse.copy(l.projectionMatrix).invert(),l.viewport.set(o.x,o.y,o.width,o.height),0===i&&(L.matrix.copy(l.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),!0===a&&L.cameras.push(l)}let o=n.enabledFeatures;if(o&&o.includes("depth-sensing")&&"gpu-optimized"==n.depthUsage&&_){let e=(f=i.getBinding()).getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,n.renderState)}if(o&&o.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let e=0;e<t.length;e++){let i=t[e].camera;if(i){let e=v[i];e||(e=new r.rjZ,v[i]=e);let t=f.getCameraImage(i);e.sourceTexture=t}}}}for(let e=0;e<T.length;e++){let t=x[e],i=T[e];null!==t&&void 0!==i&&i.update(t,a,d||l)}B&&B(t,a),a.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:a}),h=null}),this.setAnimationLoop=function(e){B=e},this.dispose=function(){}}}let tI=new r.O9p,tN=new r.kn4;function ty(e,t){function i(e,t){!0===e.matrixAutoUpdate&&e.updateMatrix(),t.value.copy(e.matrix)}function a(e,a){e.opacity.value=a.opacity,a.color&&e.diffuse.value.copy(a.color),a.emissive&&e.emissive.value.copy(a.emissive).multiplyScalar(a.emissiveIntensity),a.map&&(e.map.value=a.map,i(a.map,e.mapTransform)),a.alphaMap&&(e.alphaMap.value=a.alphaMap,i(a.alphaMap,e.alphaMapTransform)),a.bumpMap&&(e.bumpMap.value=a.bumpMap,i(a.bumpMap,e.bumpMapTransform),e.bumpScale.value=a.bumpScale,a.side===r.hsX&&(e.bumpScale.value*=-1)),a.normalMap&&(e.normalMap.value=a.normalMap,i(a.normalMap,e.normalMapTransform),e.normalScale.value.copy(a.normalScale),a.side===r.hsX&&e.normalScale.value.negate()),a.displacementMap&&(e.displacementMap.value=a.displacementMap,i(a.displacementMap,e.displacementMapTransform),e.displacementScale.value=a.displacementScale,e.displacementBias.value=a.displacementBias),a.emissiveMap&&(e.emissiveMap.value=a.emissiveMap,i(a.emissiveMap,e.emissiveMapTransform)),a.specularMap&&(e.specularMap.value=a.specularMap,i(a.specularMap,e.specularMapTransform)),a.alphaTest>0&&(e.alphaTest.value=a.alphaTest);let n=t.get(a),o=n.envMap,l=n.envMapRotation;o&&(e.envMap.value=o,tI.copy(l),tI.x*=-1,tI.y*=-1,tI.z*=-1,o.isCubeTexture&&!1===o.isRenderTargetTexture&&(tI.y*=-1,tI.z*=-1),e.envMapRotation.value.setFromMatrix4(tN.makeRotationFromEuler(tI)),e.flipEnvMap.value=o.isCubeTexture&&!1===o.isRenderTargetTexture?-1:1,e.reflectivity.value=a.reflectivity,e.ior.value=a.ior,e.refractionRatio.value=a.refractionRatio),a.lightMap&&(e.lightMap.value=a.lightMap,e.lightMapIntensity.value=a.lightMapIntensity,i(a.lightMap,e.lightMapTransform)),a.aoMap&&(e.aoMap.value=a.aoMap,e.aoMapIntensity.value=a.aoMapIntensity,i(a.aoMap,e.aoMapTransform))}return{refreshFogUniforms:function(t,i){i.color.getRGB(t.fogColor.value,(0,r._Ut)(e)),i.isFog?(t.fogNear.value=i.near,t.fogFar.value=i.far):i.isFogExp2&&(t.fogDensity.value=i.density)},refreshMaterialUniforms:function(e,n,o,l,s){var c,d,u,f,p,m,h,_,g,v,E,S,M,T,x,R,A,b,C,P,L,U,w;let D;n.isMeshBasicMaterial?a(e,n):n.isMeshLambertMaterial?(a(e,n),n.envMap&&(e.envMapIntensity.value=n.envMapIntensity)):n.isMeshToonMaterial?(a(e,n),c=e,(d=n).gradientMap&&(c.gradientMap.value=d.gradientMap)):n.isMeshPhongMaterial?(a(e,n),u=e,f=n,u.specular.value.copy(f.specular),u.shininess.value=Math.max(f.shininess,1e-4),n.envMap&&(e.envMapIntensity.value=n.envMapIntensity)):n.isMeshStandardMaterial?(a(e,n),p=e,m=n,p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,i(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,i(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity),n.isMeshPhysicalMaterial&&(h=e,_=n,g=s,h.ior.value=_.ior,_.sheen>0&&(h.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),h.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(h.sheenColorMap.value=_.sheenColorMap,i(_.sheenColorMap,h.sheenColorMapTransform)),_.sheenRoughnessMap&&(h.sheenRoughnessMap.value=_.sheenRoughnessMap,i(_.sheenRoughnessMap,h.sheenRoughnessMapTransform))),_.clearcoat>0&&(h.clearcoat.value=_.clearcoat,h.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(h.clearcoatMap.value=_.clearcoatMap,i(_.clearcoatMap,h.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(h.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,i(_.clearcoatRoughnessMap,h.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(h.clearcoatNormalMap.value=_.clearcoatNormalMap,i(_.clearcoatNormalMap,h.clearcoatNormalMapTransform),h.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===r.hsX&&h.clearcoatNormalScale.value.negate())),_.dispersion>0&&(h.dispersion.value=_.dispersion),_.iridescence>0&&(h.iridescence.value=_.iridescence,h.iridescenceIOR.value=_.iridescenceIOR,h.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],h.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(h.iridescenceMap.value=_.iridescenceMap,i(_.iridescenceMap,h.iridescenceMapTransform)),_.iridescenceThicknessMap&&(h.iridescenceThicknessMap.value=_.iridescenceThicknessMap,i(_.iridescenceThicknessMap,h.iridescenceThicknessMapTransform))),_.transmission>0&&(h.transmission.value=_.transmission,h.transmissionSamplerMap.value=g.texture,h.transmissionSamplerSize.value.set(g.width,g.height),_.transmissionMap&&(h.transmissionMap.value=_.transmissionMap,i(_.transmissionMap,h.transmissionMapTransform)),h.thickness.value=_.thickness,_.thicknessMap&&(h.thicknessMap.value=_.thicknessMap,i(_.thicknessMap,h.thicknessMapTransform)),h.attenuationDistance.value=_.attenuationDistance,h.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(h.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(h.anisotropyMap.value=_.anisotropyMap,i(_.anisotropyMap,h.anisotropyMapTransform))),h.specularIntensity.value=_.specularIntensity,h.specularColor.value.copy(_.specularColor),_.specularColorMap&&(h.specularColorMap.value=_.specularColorMap,i(_.specularColorMap,h.specularColorMapTransform)),_.specularIntensityMap&&(h.specularIntensityMap.value=_.specularIntensityMap,i(_.specularIntensityMap,h.specularIntensityMapTransform)))):n.isMeshMatcapMaterial?(a(e,n),v=e,(E=n).matcap&&(v.matcap.value=E.matcap)):n.isMeshDepthMaterial?a(e,n):n.isMeshDistanceMaterial?(a(e,n),S=e,M=n,D=t.get(M).light,S.referencePosition.value.setFromMatrixPosition(D.matrixWorld),S.nearDistance.value=D.shadow.camera.near,S.farDistance.value=D.shadow.camera.far):n.isMeshNormalMaterial?a(e,n):n.isLineBasicMaterial?(T=e,x=n,T.diffuse.value.copy(x.color),T.opacity.value=x.opacity,x.map&&(T.map.value=x.map,i(x.map,T.mapTransform)),n.isLineDashedMaterial&&(R=e,A=n,R.dashSize.value=A.dashSize,R.totalSize.value=A.dashSize+A.gapSize,R.scale.value=A.scale)):n.isPointsMaterial?(b=e,C=n,P=o,L=l,b.diffuse.value.copy(C.color),b.opacity.value=C.opacity,b.size.value=C.size*P,b.scale.value=.5*L,C.map&&(b.map.value=C.map,i(C.map,b.uvTransform)),C.alphaMap&&(b.alphaMap.value=C.alphaMap,i(C.alphaMap,b.alphaMapTransform)),C.alphaTest>0&&(b.alphaTest.value=C.alphaTest)):n.isSpriteMaterial?(U=e,w=n,U.diffuse.value.copy(w.color),U.opacity.value=w.opacity,U.rotation.value=w.rotation,w.map&&(U.map.value=w.map,i(w.map,U.mapTransform)),w.alphaMap&&(U.alphaMap.value=w.alphaMap,i(w.alphaMap,U.alphaMapTransform)),w.alphaTest>0&&(U.alphaTest.value=w.alphaTest)):n.isShadowMaterial?(e.color.value.copy(n.color),e.opacity.value=n.opacity):n.isShaderMaterial&&(n.uniformsNeedUpdate=!1)}}}function tO(e,t,i,a){let n={},o={},l=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e){let t={boundary:0,storage:0};return"number"==typeof e||"boolean"==typeof e?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?(0,r.R8M)("WebGLRenderer: Texture samplers can not be part of an uniforms group."):(0,r.R8M)("WebGLRenderer: Unsupported uniform value type.",e),t}function d(t){let i=t.target;i.removeEventListener("dispose",d);let r=l.indexOf(i.__bindingPointIndex);l.splice(r,1),e.deleteBuffer(n[i.id]),delete n[i.id],delete o[i.id]}return{bind:function(e,t){let i=t.program;a.uniformBlockBinding(e,i)},update:function(i,u){var f;let p,m,h,_,g=n[i.id];void 0===g&&(function(e){let t=e.uniforms,i=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],a=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=a.length;e<r;e++){let r=c(a[e]),n=i%16,o=n%r.boundary,l=n+o;i+=o,0!==l&&16-l<r.storage&&(i+=16-l),t.__data=new Float32Array(r.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=i,i+=r.storage}}}let r=i%16;r>0&&(i+=16-r),e.__size=i,e.__cache={}}(i),(f=i).__bindingPointIndex=p=function(){for(let e=0;e<s;e++)if(-1===l.indexOf(e))return l.push(e),e;return(0,r.z3S)("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}(),m=e.createBuffer(),h=f.__size,_=f.usage,e.bindBuffer(e.UNIFORM_BUFFER,m),e.bufferData(e.UNIFORM_BUFFER,h,_),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,p,m),g=m,n[i.id]=g,i.addEventListener("dispose",d));let v=u.program;a.updateUBOMapping(i,v);let E=t.render.frame;o[i.id]!==E&&(function(t){let i=n[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,i);for(let t=0,i=r.length;t<i;t++){let i=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,n=i.length;r<n;r++){let n=i[r];if(!0===function(e,t,i,r){let a=e.value,n=t+"_"+i;if(void 0===r[n])return"number"==typeof a||"boolean"==typeof a?r[n]=a:r[n]=a.clone(),!0;{let e=r[n];if("number"==typeof a||"boolean"==typeof a){if(e!==a)return r[n]=a,!0}else if(!1===e.equals(a))return e.copy(a),!0}return!1}(n,t,r,a)){let t=n.__offset,i=Array.isArray(n.value)?n.value:[n.value],r=0;for(let a=0;a<i.length;a++){let o=i[a],l=c(o);"number"==typeof o||"boolean"==typeof o?(n.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,n.__data)):o.isMatrix3?(n.__data[0]=o.elements[0],n.__data[1]=o.elements[1],n.__data[2]=o.elements[2],n.__data[3]=0,n.__data[4]=o.elements[3],n.__data[5]=o.elements[4],n.__data[6]=o.elements[5],n.__data[7]=0,n.__data[8]=o.elements[6],n.__data[9]=o.elements[7],n.__data[10]=o.elements[8],n.__data[11]=0):(o.toArray(n.__data,r),r+=l.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,n.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}(i),o[i.id]=E)},dispose:function(){for(let t in n)e.deleteBuffer(n[t]);l=[],n={},o={}}}}let tF=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),tB=null;class tG{constructor(e={}){let t,i,o,l,s,c,d,u,g,v,E,S,M,T,x,R,A,b,C,P,L,U,w,G;const{canvas:V=(0,r.lPF)(),context:W=null,depth:k=!0,stencil:z=!1,alpha:X=!1,antialias:q=!1,premultipliedAlpha:K=!0,preserveDrawingBuffer:Y=!1,powerPreference:j="default",failIfMajorPerformanceCaveat:Z=!1,reversedDepthBuffer:Q=!1,outputBufferType:$=r.OUM}=e;if(this.isWebGLRenderer=!0,null!==W){if("u">typeof WebGLRenderingContext&&W instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");t=W.getContextAttributes().alpha}else t=X;const J=new Set([r.c90,r.TkQ,r.ZQM]),ee=new Set([r.OUM,r.bkx,r.cHt,r.V3x,r.Wew,r.gJ2]),et=new Uint32Array(4),ei=new Int32Array(4);let er=null,ea=null;const en=[],eo=[];let el=null;this.domElement=V,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=r.y_p,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const es=this;let ec=!1;this._outputColorSpace=r.er$;let ed=0,eu=0,ef=null,ep=-1,em=null;const eh=new r.IUQ,e_=new r.IUQ;let eg=null;const ev=new r.Q1f(0);let eE=0,eS=V.width,eM=V.height,eT=1,ex=null,eR=null;const eA=new r.IUQ(0,0,eS,eM),eb=new r.IUQ(0,0,eS,eM);let eC=!1;const eP=new r.PPD;let eL=!1,eU=!1;const ew=new r.kn4,eD=new r.Pq0,eI=new r.IUQ,eN={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ey=!1;function eO(){return null===ef?eT:1}let eF=W;function eB(e,t){return V.getContext(e,t)}try{if("setAttribute"in V&&V.setAttribute("data-engine",`three.js r${r.sPf}`),V.addEventListener("webglcontextlost",eV,!1),V.addEventListener("webglcontextrestored",eW,!1),V.addEventListener("webglcontextcreationerror",ek,!1),null===eF){const e="webgl2";if(eF=eB(e,{alpha:!0,depth:k,stencil:z,antialias:q,premultipliedAlpha:K,preserveDrawingBuffer:Y,powerPreference:j,failIfMajorPerformanceCaveat:Z}),null===eF)if(eB(e))throw Error("Error creating WebGL context with your selected attributes.");else throw Error("Error creating WebGL context.")}}catch(e){throw(0,r.z3S)("WebGLRenderer: "+e.message),e}function eG(){(i=new I(eF)).init(),U=new tP(eF,i),o=new h(eF,i,e,U),l=new tb(eF,i),o.reversedDepthBuffer&&Q&&l.buffers.depth.setReversed(!0),s=new O(eF),c=new tl,d=new tC(eF,i,l,c,o,U,s),u=new D(es),g=new n(eF),w=new p(eF,g),v=new N(eF,g,s,w),E=new B(eF,v,g,w,s),C=new F(eF,o,d),R=new _(c),S=new to(es,u,i,o,w,R),M=new ty(es,c),T=new tu,x=new tg(i),b=new f(es,u,l,E,t,K),A=new tA(es,E,o),G=new tO(eF,s,o,l),P=new m(eF,i,s),L=new y(eF,i,s),s.programs=S.programs,es.capabilities=o,es.extensions=i,es.properties=c,es.renderLists=T,es.shadowMap=A,es.state=l,es.info=s}eG(),$!==r.OUM&&(el=new H($,V.width,V.height,k,z));const eH=new tD(es,eF);function eV(e){e.preventDefault(),(0,r.Rm2)("WebGLRenderer: Context Lost."),ec=!0}function eW(){(0,r.Rm2)("WebGLRenderer: Context Restored."),ec=!1;let e=s.autoReset,t=A.enabled,i=A.autoUpdate,a=A.needsUpdate,n=A.type;eG(),s.autoReset=e,A.enabled=t,A.autoUpdate=i,A.needsUpdate=a,A.type=n}function ek(e){(0,r.z3S)("WebGLRenderer: A WebGL context could not be created. Reason: ",e.statusMessage)}function eX(e){var t,i;let r,a=e.target;a.removeEventListener("dispose",eX),i=t=a,void 0!==(r=c.get(i).programs)&&(r.forEach(function(e){S.releaseProgram(e)}),i.isShaderMaterial&&S.releaseShaderCache(i)),c.remove(t)}function eq(e,t,i){!0===e.transparent&&e.side===r.$EB&&!1===e.forceSinglePass?(e.side=r.hsX,e.needsUpdate=!0,e3(e,t,i),e.side=r.hB5,e.needsUpdate=!0,e3(e,t,i),e.side=r.$EB):e3(e,t,i)}this.xr=eH,this.getContext=function(){return eF},this.getContextAttributes=function(){return eF.getContextAttributes()},this.forceContextLoss=function(){let e=i.get("WEBGL_lose_context");e&&e.loseContext()},this.forceContextRestore=function(){let e=i.get("WEBGL_lose_context");e&&e.restoreContext()},this.getPixelRatio=function(){return eT},this.setPixelRatio=function(e){void 0!==e&&(eT=e,this.setSize(eS,eM,!1))},this.getSize=function(e){return e.set(eS,eM)},this.setSize=function(e,t,i=!0){eH.isPresenting?(0,r.R8M)("WebGLRenderer: Can't change size while VR device is presenting."):(eS=e,eM=t,V.width=Math.floor(e*eT),V.height=Math.floor(t*eT),!0===i&&(V.style.width=e+"px",V.style.height=t+"px"),null!==el&&el.setSize(V.width,V.height),this.setViewport(0,0,e,t))},this.getDrawingBufferSize=function(e){return e.set(eS*eT,eM*eT).floor()},this.setDrawingBufferSize=function(e,t,i){eS=e,eM=t,eT=i,V.width=Math.floor(e*i),V.height=Math.floor(t*i),this.setViewport(0,0,e,t)},this.setEffects=function(e){if($===r.OUM)return void console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");if(e){for(let t=0;t<e.length;t++)if(!0===e[t].isOutputPass){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}el.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(eh)},this.getViewport=function(e){return e.copy(eA)},this.setViewport=function(e,t,i,r){e.isVector4?eA.set(e.x,e.y,e.z,e.w):eA.set(e,t,i,r),l.viewport(eh.copy(eA).multiplyScalar(eT).round())},this.getScissor=function(e){return e.copy(eb)},this.setScissor=function(e,t,i,r){e.isVector4?eb.set(e.x,e.y,e.z,e.w):eb.set(e,t,i,r),l.scissor(e_.copy(eb).multiplyScalar(eT).round())},this.getScissorTest=function(){return eC},this.setScissorTest=function(e){l.setScissorTest(eC=e)},this.setOpaqueSort=function(e){ex=e},this.setTransparentSort=function(e){eR=e},this.getClearColor=function(e){return e.copy(b.getClearColor())},this.setClearColor=function(){b.setClearColor(...arguments)},this.getClearAlpha=function(){return b.getClearAlpha()},this.setClearAlpha=function(){b.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,i=!0){let r=0;if(e){let e=!1;if(null!==ef){let t=ef.texture.format;e=J.has(t)}if(e){let e=ef.texture.type,t=ee.has(e),i=b.getClearColor(),r=b.getClearAlpha(),a=i.r,n=i.g,o=i.b;t?(et[0]=a,et[1]=n,et[2]=o,et[3]=r,eF.clearBufferuiv(eF.COLOR,0,et)):(ei[0]=a,ei[1]=n,ei[2]=o,ei[3]=r,eF.clearBufferiv(eF.COLOR,0,ei))}else r|=eF.COLOR_BUFFER_BIT}t&&(r|=eF.DEPTH_BUFFER_BIT),i&&(r|=eF.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(0xffffffff)),0!==r&&eF.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){V.removeEventListener("webglcontextlost",eV,!1),V.removeEventListener("webglcontextrestored",eW,!1),V.removeEventListener("webglcontextcreationerror",ek,!1),b.dispose(),T.dispose(),x.dispose(),c.dispose(),u.dispose(),E.dispose(),w.dispose(),G.dispose(),S.dispose(),eH.dispose(),eH.removeEventListener("sessionstart",eY),eH.removeEventListener("sessionend",ej),eZ.stop()},this.renderBufferDirect=function(e,t,a,n,s,f){let p;null===t&&(t=eN);let m=s.isMesh&&0>s.matrixWorld.determinant(),h=function(e,t,i,a,n){var s,f;!0!==t.isScene&&(t=eN),d.resetTextureUnits();let p=t.fog,m=a.isMeshStandardMaterial||a.isMeshLambertMaterial||a.isMeshPhongMaterial?t.environment:null,h=null===ef?es.outputColorSpace:!0===ef.isXRRenderTarget?ef.texture.colorSpace:r.Zr2,_=a.isMeshStandardMaterial||a.isMeshLambertMaterial&&!a.envMap||a.isMeshPhongMaterial&&!a.envMap,g=u.get(a.envMap||m,_),v=!0===a.vertexColors&&!!i.attributes.color&&4===i.attributes.color.itemSize,E=!!i.attributes.tangent&&(!!a.normalMap||a.anisotropy>0),S=!!i.morphAttributes.position,T=!!i.morphAttributes.normal,x=!!i.morphAttributes.color,A=r.y_p;a.toneMapped&&(null===ef||!0===ef.isXRRenderTarget)&&(A=es.toneMapping);let b=i.morphAttributes.position||i.morphAttributes.normal||i.morphAttributes.color,P=void 0!==b?b.length:0,L=c.get(a),U=ea.state.lights;if(!0===eL&&(!0===eU||e!==em)){let t=e===em&&a.id===ep;R.setState(a,e,t)}let w=!1;a.version===L.__version?L.needsLights&&L.lightsStateVersion!==U.state.version||L.outputColorSpace!==h||n.isBatchedMesh&&!1===L.batching?w=!0:n.isBatchedMesh||!0!==L.batching?n.isBatchedMesh&&!0===L.batchingColor&&null===n.colorTexture||n.isBatchedMesh&&!1===L.batchingColor&&null!==n.colorTexture||n.isInstancedMesh&&!1===L.instancing?w=!0:n.isInstancedMesh||!0!==L.instancing?n.isSkinnedMesh&&!1===L.skinning?w=!0:n.isSkinnedMesh||!0!==L.skinning?n.isInstancedMesh&&!0===L.instancingColor&&null===n.instanceColor||n.isInstancedMesh&&!1===L.instancingColor&&null!==n.instanceColor||n.isInstancedMesh&&!0===L.instancingMorph&&null===n.morphTexture||n.isInstancedMesh&&!1===L.instancingMorph&&null!==n.morphTexture||L.envMap!==g||!0===a.fog&&L.fog!==p||void 0!==L.numClippingPlanes&&(L.numClippingPlanes!==R.numPlanes||L.numIntersection!==R.numIntersection)||L.vertexAlphas!==v||L.vertexTangents!==E||L.morphTargets!==S||L.morphNormals!==T||L.morphColors!==x||L.toneMapping!==A?w=!0:L.morphTargetsCount!==P&&(w=!0):w=!0:w=!0:w=!0:(w=!0,L.__version=a.version);let D=L.currentProgram;!0===w&&(D=e3(a,t,n));let I=!1,N=!1,y=!1,O=D.getUniforms(),F=L.uniforms;if(l.useProgram(D.program)&&(I=!0,N=!0,y=!0),a.id!==ep&&(ep=a.id,N=!0),I||em!==e){l.buffers.depth.getReversed()&&!0!==e.reversedDepth&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(eF,"projectionMatrix",e.projectionMatrix),O.setValue(eF,"viewMatrix",e.matrixWorldInverse);let t=O.map.cameraPosition;void 0!==t&&t.setValue(eF,eD.setFromMatrixPosition(e.matrixWorld)),o.logarithmicDepthBuffer&&O.setValue(eF,"logDepthBufFC",2/(Math.log(e.far+1)/Math.LN2)),(a.isMeshPhongMaterial||a.isMeshToonMaterial||a.isMeshLambertMaterial||a.isMeshBasicMaterial||a.isMeshStandardMaterial||a.isShaderMaterial)&&O.setValue(eF,"isOrthographic",!0===e.isOrthographicCamera),em!==e&&(em=e,N=!0,y=!0)}if(L.needsLights&&(U.state.directionalShadowMap.length>0&&O.setValue(eF,"directionalShadowMap",U.state.directionalShadowMap,d),U.state.spotShadowMap.length>0&&O.setValue(eF,"spotShadowMap",U.state.spotShadowMap,d),U.state.pointShadowMap.length>0&&O.setValue(eF,"pointShadowMap",U.state.pointShadowMap,d)),n.isSkinnedMesh){O.setOptional(eF,n,"bindMatrix"),O.setOptional(eF,n,"bindMatrixInverse");let e=n.skeleton;e&&(null===e.boneTexture&&e.computeBoneTexture(),O.setValue(eF,"boneTexture",e.boneTexture,d))}n.isBatchedMesh&&(O.setOptional(eF,n,"batchingTexture"),O.setValue(eF,"batchingTexture",n._matricesTexture,d),O.setOptional(eF,n,"batchingIdTexture"),O.setValue(eF,"batchingIdTexture",n._indirectTexture,d),O.setOptional(eF,n,"batchingColorTexture"),null!==n._colorsTexture&&O.setValue(eF,"batchingColorTexture",n._colorsTexture,d));let B=i.morphAttributes;if((void 0!==B.position||void 0!==B.normal||void 0!==B.color)&&C.update(n,i,D),(N||L.receiveShadow!==n.receiveShadow)&&(L.receiveShadow=n.receiveShadow,O.setValue(eF,"receiveShadow",n.receiveShadow)),(a.isMeshStandardMaterial||a.isMeshLambertMaterial||a.isMeshPhongMaterial)&&null===a.envMap&&null!==t.environment&&(F.envMapIntensity.value=t.environmentIntensity),void 0!==F.dfgLUT&&(F.dfgLUT.value=(null===tB&&((tB=new r.GYF(tF,16,16,r.paN,r.ix0)).name="DFG_LUT",tB.minFilter=r.k6q,tB.magFilter=r.k6q,tB.wrapS=r.ghU,tB.wrapT=r.ghU,tB.generateMipmaps=!1,tB.needsUpdate=!0),tB)),N&&(O.setValue(eF,"toneMappingExposure",es.toneMappingExposure),L.needsLights&&(s=F,f=y,s.ambientLightColor.needsUpdate=f,s.lightProbe.needsUpdate=f,s.directionalLights.needsUpdate=f,s.directionalLightShadows.needsUpdate=f,s.pointLights.needsUpdate=f,s.pointLightShadows.needsUpdate=f,s.spotLights.needsUpdate=f,s.spotLightShadows.needsUpdate=f,s.rectAreaLights.needsUpdate=f,s.hemisphereLights.needsUpdate=f),p&&!0===a.fog&&M.refreshFogUniforms(F,p),M.refreshMaterialUniforms(F,a,eT,eM,ea.state.transmissionRenderTarget[e.id]),ez.upload(eF,e2(L),F,d)),a.isShaderMaterial&&!0===a.uniformsNeedUpdate&&(ez.upload(eF,e2(L),F,d),a.uniformsNeedUpdate=!1),a.isSpriteMaterial&&O.setValue(eF,"center",n.center),O.setValue(eF,"modelViewMatrix",n.modelViewMatrix),O.setValue(eF,"normalMatrix",n.normalMatrix),O.setValue(eF,"modelMatrix",n.matrixWorld),a.isShaderMaterial||a.isRawShaderMaterial){let e=a.uniformsGroups;for(let t=0,i=e.length;t<i;t++){let i=e[t];G.update(i,D),G.bind(i,D)}}return D}(e,t,a,n,s);l.setMaterial(n,m);let _=a.index,E=1;if(!0===n.wireframe){if(void 0===(_=v.getWireframeAttribute(a)))return;E=2}let S=a.drawRange,T=a.attributes.position,x=S.start*E,A=(S.start+S.count)*E;null!==f&&(x=Math.max(x,f.start*E),A=Math.min(A,(f.start+f.count)*E)),null!==_?(x=Math.max(x,0),A=Math.min(A,_.count)):null!=T&&(x=Math.max(x,0),A=Math.min(A,T.count));let b=A-x;if(b<0||b===1/0)return;w.setup(s,n,h,a,_);let U=P;if(null!==_&&(p=g.get(_),(U=L).setIndex(p)),s.isMesh)!0===n.wireframe?(l.setLineWidth(n.wireframeLinewidth*eO()),U.setMode(eF.LINES)):U.setMode(eF.TRIANGLES);else if(s.isLine){let e=n.linewidth;void 0===e&&(e=1),l.setLineWidth(e*eO()),s.isLineSegments?U.setMode(eF.LINES):s.isLineLoop?U.setMode(eF.LINE_LOOP):U.setMode(eF.LINE_STRIP)}else s.isPoints?U.setMode(eF.POINTS):s.isSprite&&U.setMode(eF.TRIANGLES);if(s.isBatchedMesh)if(null!==s._multiDrawInstances)(0,r.mcG)("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),U.renderMultiDrawInstances(s._multiDrawStarts,s._multiDrawCounts,s._multiDrawCount,s._multiDrawInstances);else if(i.get("WEBGL_multi_draw"))U.renderMultiDraw(s._multiDrawStarts,s._multiDrawCounts,s._multiDrawCount);else{let e=s._multiDrawStarts,t=s._multiDrawCounts,i=s._multiDrawCount,r=_?g.get(_).bytesPerElement:1,a=c.get(n).currentProgram.getUniforms();for(let n=0;n<i;n++)a.setValue(eF,"_gl_DrawID",n),U.render(e[n]/r,t[n])}else if(s.isInstancedMesh)U.renderInstances(x,b,s.count);else if(a.isInstancedBufferGeometry){let e=void 0!==a._maxInstanceCount?a._maxInstanceCount:1/0,t=Math.min(a.instanceCount,e);U.renderInstances(x,b,t)}else U.render(x,b)},this.compile=function(e,t,i=null){null===i&&(i=e),(ea=x.get(i)).init(t),eo.push(ea),i.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(ea.pushLight(e),e.castShadow&&ea.pushShadow(e))}),e!==i&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(ea.pushLight(e),e.castShadow&&ea.pushShadow(e))}),ea.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t)if(Array.isArray(t))for(let a=0;a<t.length;a++){let n=t[a];eq(n,i,e),r.add(n)}else eq(t,i,e),r.add(t)}),ea=eo.pop(),r},this.compileAsync=function(e,t,r=null){let a=this.compile(e,t,r);return new Promise(t=>{function r(){(a.forEach(function(e){c.get(e).currentProgram.isReady()&&a.delete(e)}),0===a.size)?t(e):setTimeout(r,10)}null!==i.get("KHR_parallel_shader_compile")?r():setTimeout(r,10)})};let eK=null;function eY(){eZ.stop()}function ej(){eZ.start()}const eZ=new a;function eQ(e,t,i,r){if(!1===e.visible)return;if(e.layers.test(t.layers)){if(e.isGroup)i=e.renderOrder;else if(e.isLOD)!0===e.autoUpdate&&e.update(t);else if(e.isLight)ea.pushLight(e),e.castShadow&&ea.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||eP.intersectsSprite(e)){r&&eI.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ew);let t=E.update(e),a=e.material;a.visible&&er.push(e,t,a,i,eI.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||eP.intersectsObject(e))){let t=E.update(e),a=e.material;if(r&&(void 0!==e.boundingSphere?(null===e.boundingSphere&&e.computeBoundingSphere(),eI.copy(e.boundingSphere.center)):(null===t.boundingSphere&&t.computeBoundingSphere(),eI.copy(t.boundingSphere.center)),eI.applyMatrix4(e.matrixWorld).applyMatrix4(ew)),Array.isArray(a)){let r=t.groups;for(let n=0,o=r.length;n<o;n++){let o=r[n],l=a[o.materialIndex];l&&l.visible&&er.push(e,t,l,i,eI.z,o)}}else a.visible&&er.push(e,t,a,i,eI.z,null)}}let a=e.children;for(let e=0,n=a.length;e<n;e++)eQ(a[e],t,i,r)}function e$(e,t,i,r){let{opaque:a,transmissive:n,transparent:o}=e;ea.setupLightsView(i),!0===eL&&R.setGlobalState(es.clippingPlanes,i),r&&l.viewport(eh.copy(r)),a.length>0&&e0(a,t,i),n.length>0&&e0(n,t,i),o.length>0&&e0(o,t,i),l.buffers.depth.setTest(!0),l.buffers.depth.setMask(!0),l.buffers.color.setMask(!0),l.setPolygonOffset(!1)}function eJ(e,t,a,n){if(null!==(!0===a.isScene?a.overrideMaterial:null))return;if(void 0===ea.state.transmissionRenderTarget[n.id]){let e=i.has("EXT_color_buffer_half_float")||i.has("EXT_color_buffer_float");ea.state.transmissionRenderTarget[n.id]=new r.nWS(1,1,{generateMipmaps:!0,type:e?r.ix0:r.OUM,minFilter:r.$_I,samples:o.samples,stencilBuffer:z,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:r.ppV.workingColorSpace})}let l=ea.state.transmissionRenderTarget[n.id],s=n.viewport||eh;l.setSize(s.z*es.transmissionResolutionScale,s.w*es.transmissionResolutionScale);let c=es.getRenderTarget(),u=es.getActiveCubeFace(),f=es.getActiveMipmapLevel();es.setRenderTarget(l),es.getClearColor(ev),(eE=es.getClearAlpha())<1&&es.setClearColor(0xffffff,.5),es.clear(),ey&&b.render(a);let p=es.toneMapping;es.toneMapping=r.y_p;let m=n.viewport;if(void 0!==n.viewport&&(n.viewport=void 0),ea.setupLightsView(n),!0===eL&&R.setGlobalState(es.clippingPlanes,n),e0(e,a,n),d.updateMultisampleRenderTarget(l),d.updateRenderTargetMipmap(l),!1===i.has("WEBGL_multisampled_render_to_texture")){let e=!1;for(let i=0,o=t.length;i<o;i++){let{object:o,geometry:l,material:s,group:c}=t[i];if(s.side===r.$EB&&o.layers.test(n.layers)){let t=s.side;s.side=r.hsX,s.needsUpdate=!0,e1(o,a,n,l,s,c),s.side=t,s.needsUpdate=!0,e=!0}}!0===e&&(d.updateMultisampleRenderTarget(l),d.updateRenderTargetMipmap(l))}es.setRenderTarget(c,u,f),es.setClearColor(ev,eE),void 0!==m&&(n.viewport=m),es.toneMapping=p}function e0(e,t,i){let r=!0===t.isScene?t.overrideMaterial:null;for(let a=0,n=e.length;a<n;a++){let n=e[a],{object:o,geometry:l,group:s}=n,c=n.material;!0===c.allowOverride&&null!==r&&(c=r),o.layers.test(i.layers)&&e1(o,t,i,l,c,s)}}function e1(e,t,i,a,n,o){e.onBeforeRender(es,t,i,a,n,o),e.modelViewMatrix.multiplyMatrices(i.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),n.onBeforeRender(es,t,i,a,e,o),!0===n.transparent&&n.side===r.$EB&&!1===n.forceSinglePass?(n.side=r.hsX,n.needsUpdate=!0,es.renderBufferDirect(i,t,a,n,e,o),n.side=r.hB5,n.needsUpdate=!0,es.renderBufferDirect(i,t,a,n,e,o),n.side=r.$EB):es.renderBufferDirect(i,t,a,n,e,o),e.onAfterRender(es,t,i,a,n,o)}function e3(e,t,i){var r;!0!==t.isScene&&(t=eN);let a=c.get(e),n=ea.state.lights,o=ea.state.shadowsArray,l=n.state.version,s=S.getParameters(e,n.state,o,t,i),d=S.getProgramCacheKey(s),f=a.programs;a.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,a.fog=t.fog;let p=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;a.envMap=u.get(e.envMap||a.environment,p),a.envMapRotation=null!==a.environment&&null===e.envMap?t.environmentRotation:e.envMapRotation,void 0===f&&(e.addEventListener("dispose",eX),a.programs=f=new Map);let m=f.get(d);if(void 0!==m){if(a.currentProgram===m&&a.lightsStateVersion===l)return e4(e,s),m}else s.uniforms=S.getUniforms(e),e.onBeforeCompile(s,es),m=S.acquireProgram(s,d),f.set(d,m),a.uniforms=s.uniforms;let h=a.uniforms;return(e.isShaderMaterial||e.isRawShaderMaterial)&&!0!==e.clipping||(h.clippingPlanes=R.uniform),e4(e,s),a.needsLights=(r=e).isMeshLambertMaterial||r.isMeshToonMaterial||r.isMeshPhongMaterial||r.isMeshStandardMaterial||r.isShadowMaterial||r.isShaderMaterial&&!0===r.lights,a.lightsStateVersion=l,a.needsLights&&(h.ambientLightColor.value=n.state.ambient,h.lightProbe.value=n.state.probe,h.directionalLights.value=n.state.directional,h.directionalLightShadows.value=n.state.directionalShadow,h.spotLights.value=n.state.spot,h.spotLightShadows.value=n.state.spotShadow,h.rectAreaLights.value=n.state.rectArea,h.ltc_1.value=n.state.rectAreaLTC1,h.ltc_2.value=n.state.rectAreaLTC2,h.pointLights.value=n.state.point,h.pointLightShadows.value=n.state.pointShadow,h.hemisphereLights.value=n.state.hemi,h.directionalShadowMatrix.value=n.state.directionalShadowMatrix,h.spotLightMatrix.value=n.state.spotLightMatrix,h.spotLightMap.value=n.state.spotLightMap,h.pointShadowMatrix.value=n.state.pointShadowMatrix),a.currentProgram=m,a.uniformsList=null,m}function e2(e){if(null===e.uniformsList){let t=e.currentProgram.getUniforms();e.uniformsList=ez.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function e4(e,t){let i=c.get(e);i.outputColorSpace=t.outputColorSpace,i.batching=t.batching,i.batchingColor=t.batchingColor,i.instancing=t.instancing,i.instancingColor=t.instancingColor,i.instancingMorph=t.instancingMorph,i.skinning=t.skinning,i.morphTargets=t.morphTargets,i.morphNormals=t.morphNormals,i.morphColors=t.morphColors,i.morphTargetsCount=t.morphTargetsCount,i.numClippingPlanes=t.numClippingPlanes,i.numIntersection=t.numClipIntersection,i.vertexAlphas=t.vertexAlphas,i.vertexTangents=t.vertexTangents,i.toneMapping=t.toneMapping}eZ.setAnimationLoop(function(e){eK&&eK(e)}),"u">typeof self&&eZ.setContext(self),this.setAnimationLoop=function(e){eK=e,eH.setAnimationLoop(e),null===e?eZ.stop():eZ.start()},eH.addEventListener("sessionstart",eY),eH.addEventListener("sessionend",ej),this.render=function(e,t){if(void 0!==t&&!0!==t.isCamera)return void(0,r.z3S)("WebGLRenderer.render: camera is not an instance of THREE.Camera.");if(!0===ec)return;let i=!0===eH.enabled&&!0===eH.isPresenting,a=null!==el&&(null===ef||i)&&el.begin(es,ef);if(!0===e.matrixWorldAutoUpdate&&e.updateMatrixWorld(),null===t.parent&&!0===t.matrixWorldAutoUpdate&&t.updateMatrixWorld(),!0===eH.enabled&&!0===eH.isPresenting&&(null===el||!1===el.isCompositing())&&(!0===eH.cameraAutoUpdate&&eH.updateCamera(t),t=eH.getCamera()),!0===e.isScene&&e.onBeforeRender(es,e,t,ef),(ea=x.get(e,eo.length)).init(t),eo.push(ea),ew.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),eP.setFromProjectionMatrix(ew,r.TdN,t.reversedDepth),eU=this.localClippingEnabled,eL=R.init(this.clippingPlanes,eU),(er=T.get(e,en.length)).init(),en.push(er),!0===eH.enabled&&!0===eH.isPresenting){let e=es.xr.getDepthSensingMesh();null!==e&&eQ(e,t,-1/0,es.sortObjects)}eQ(e,t,0,es.sortObjects),er.finish(),!0===es.sortObjects&&er.sort(ex,eR),(ey=!1===eH.enabled||!1===eH.isPresenting||!1===eH.hasDepthSensing())&&b.addToRenderList(er,e),this.info.render.frame++,!0===eL&&R.beginShadows();let n=ea.state.shadowsArray;if(A.render(n,e,t),!0===eL&&R.endShadows(),!0===this.info.autoReset&&this.info.reset(),!1===(a&&el.hasRenderPass())){let i=er.opaque,r=er.transmissive;if(ea.setupLights(),t.isArrayCamera){let a=t.cameras;if(r.length>0)for(let t=0,n=a.length;t<n;t++)eJ(i,r,e,a[t]);ey&&b.render(e);for(let t=0,i=a.length;t<i;t++){let i=a[t];e$(er,e,i,i.viewport)}}else r.length>0&&eJ(i,r,e,t),ey&&b.render(e),e$(er,e,t)}null!==ef&&0===eu&&(d.updateMultisampleRenderTarget(ef),d.updateRenderTargetMipmap(ef)),a&&el.end(es),!0===e.isScene&&e.onAfterRender(es,e,t),w.resetDefaultState(),ep=-1,em=null,eo.pop(),eo.length>0?(ea=eo[eo.length-1],!0===eL&&R.setGlobalState(es.clippingPlanes,ea.state.camera)):ea=null,en.pop(),er=en.length>0?en[en.length-1]:null},this.getActiveCubeFace=function(){return ed},this.getActiveMipmapLevel=function(){return eu},this.getRenderTarget=function(){return ef},this.setRenderTargetTextures=function(e,t,i){let r=c.get(e);r.__autoAllocateDepthBuffer=!1===e.resolveDepthBuffer,!1===r.__autoAllocateDepthBuffer&&(r.__useRenderToTexture=!1),c.get(e.texture).__webglTexture=t,c.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:i,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let i=c.get(e);i.__webglFramebuffer=t,i.__useDefaultFramebuffer=void 0===t};const e5=eF.createFramebuffer();this.setRenderTarget=function(e,t=0,i=0){ef=e,ed=t,eu=i;let r=null,a=!1,n=!1;if(e){let o=c.get(e);if(void 0!==o.__useDefaultFramebuffer){l.bindFramebuffer(eF.FRAMEBUFFER,o.__webglFramebuffer),eh.copy(e.viewport),e_.copy(e.scissor),eg=e.scissorTest,l.viewport(eh),l.scissor(e_),l.setScissorTest(eg),ep=-1;return}if(void 0===o.__webglFramebuffer)d.setupRenderTarget(e);else if(o.__hasExternalTextures)d.rebindTextures(e,c.get(e.texture).__webglTexture,c.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(null!==t&&c.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");d.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(n=!0);let u=c.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(u[t])?u[t][i]:u[t],a=!0):r=e.samples>0&&!1===d.useMultisampledRTT(e)?c.get(e).__webglMultisampledFramebuffer:Array.isArray(u)?u[i]:u,eh.copy(e.viewport),e_.copy(e.scissor),eg=e.scissorTest}else eh.copy(eA).multiplyScalar(eT).floor(),e_.copy(eb).multiplyScalar(eT).floor(),eg=eC;if(0!==i&&(r=e5),l.bindFramebuffer(eF.FRAMEBUFFER,r)&&l.drawBuffers(e,r),l.viewport(eh),l.scissor(e_),l.setScissorTest(eg),a){let r=c.get(e.texture);eF.framebufferTexture2D(eF.FRAMEBUFFER,eF.COLOR_ATTACHMENT0,eF.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,i)}else if(n)for(let r=0;r<e.textures.length;r++){let a=c.get(e.textures[r]);eF.framebufferTextureLayer(eF.FRAMEBUFFER,eF.COLOR_ATTACHMENT0+r,a.__webglTexture,i,t)}else if(null!==e&&0!==i){let t=c.get(e.texture);eF.framebufferTexture2D(eF.FRAMEBUFFER,eF.COLOR_ATTACHMENT0,eF.TEXTURE_2D,t.__webglTexture,i)}ep=-1},this.readRenderTargetPixels=function(e,t,i,a,n,s,d,u=0){if(!(e&&e.isWebGLRenderTarget))return void(0,r.z3S)("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let f=c.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&void 0!==d&&(f=f[d]),f){l.bindFramebuffer(eF.FRAMEBUFFER,f);try{let l=e.textures[u],c=l.format,d=l.type;if(e.textures.length>1&&eF.readBuffer(eF.COLOR_ATTACHMENT0+u),!o.textureFormatReadable(c))return void(0,r.z3S)("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");if(!o.textureTypeReadable(d))return void(0,r.z3S)("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");t>=0&&t<=e.width-a&&i>=0&&i<=e.height-n&&eF.readPixels(t,i,a,n,U.convert(c),U.convert(d),s)}finally{let e=null!==ef?c.get(ef).__webglFramebuffer:null;l.bindFramebuffer(eF.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,i,a,n,s,d,u=0){if(!(e&&e.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let f=c.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&void 0!==d&&(f=f[d]),f)if(t>=0&&t<=e.width-a&&i>=0&&i<=e.height-n){l.bindFramebuffer(eF.FRAMEBUFFER,f);let d=e.textures[u],p=d.format,m=d.type;if(e.textures.length>1&&eF.readBuffer(eF.COLOR_ATTACHMENT0+u),!o.textureFormatReadable(p))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!o.textureTypeReadable(m))throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let h=eF.createBuffer();eF.bindBuffer(eF.PIXEL_PACK_BUFFER,h),eF.bufferData(eF.PIXEL_PACK_BUFFER,s.byteLength,eF.STREAM_READ),eF.readPixels(t,i,a,n,U.convert(p),U.convert(m),0);let _=null!==ef?c.get(ef).__webglFramebuffer:null;l.bindFramebuffer(eF.FRAMEBUFFER,_);let g=eF.fenceSync(eF.SYNC_GPU_COMMANDS_COMPLETE,0);return eF.flush(),await (0,r.jej)(eF,g,4),eF.bindBuffer(eF.PIXEL_PACK_BUFFER,h),eF.getBufferSubData(eF.PIXEL_PACK_BUFFER,0,s),eF.deleteBuffer(h),eF.deleteSync(g),s}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(e,t=null,i=0){let r=Math.pow(2,-i),a=Math.floor(e.image.width*r),n=Math.floor(e.image.height*r),o=null!==t?t.x:0,s=null!==t?t.y:0;d.setTexture2D(e,0),eF.copyTexSubImage2D(eF.TEXTURE_2D,i,0,0,o,s,a,n),l.unbindTexture()};const e6=eF.createFramebuffer(),e8=eF.createFramebuffer();this.copyTextureToTexture=function(e,t,i=null,r=null,a=0,n=0){let o,s,u,f,p,m,h,_,g,v,E=e.isCompressedTexture?e.mipmaps[n]:e.image;if(null!==i)o=i.max.x-i.min.x,s=i.max.y-i.min.y,u=i.isBox3?i.max.z-i.min.z:1,f=i.min.x,p=i.min.y,m=i.isBox3?i.min.z:0;else{let t=Math.pow(2,-a);o=Math.floor(E.width*t),s=Math.floor(E.height*t),u=e.isDataArrayTexture?E.depth:e.isData3DTexture?Math.floor(E.depth*t):1,f=0,p=0,m=0}null!==r?(h=r.x,_=r.y,g=r.z):(h=0,_=0,g=0);let S=U.convert(t.format),M=U.convert(t.type);t.isData3DTexture?(d.setTexture3D(t,0),v=eF.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(d.setTexture2DArray(t,0),v=eF.TEXTURE_2D_ARRAY):(d.setTexture2D(t,0),v=eF.TEXTURE_2D),eF.pixelStorei(eF.UNPACK_FLIP_Y_WEBGL,t.flipY),eF.pixelStorei(eF.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),eF.pixelStorei(eF.UNPACK_ALIGNMENT,t.unpackAlignment);let T=eF.getParameter(eF.UNPACK_ROW_LENGTH),x=eF.getParameter(eF.UNPACK_IMAGE_HEIGHT),R=eF.getParameter(eF.UNPACK_SKIP_PIXELS),A=eF.getParameter(eF.UNPACK_SKIP_ROWS),b=eF.getParameter(eF.UNPACK_SKIP_IMAGES);eF.pixelStorei(eF.UNPACK_ROW_LENGTH,E.width),eF.pixelStorei(eF.UNPACK_IMAGE_HEIGHT,E.height),eF.pixelStorei(eF.UNPACK_SKIP_PIXELS,f),eF.pixelStorei(eF.UNPACK_SKIP_ROWS,p),eF.pixelStorei(eF.UNPACK_SKIP_IMAGES,m);let C=e.isDataArrayTexture||e.isData3DTexture,P=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let i=c.get(e),r=c.get(t),d=c.get(i.__renderTarget),v=c.get(r.__renderTarget);l.bindFramebuffer(eF.READ_FRAMEBUFFER,d.__webglFramebuffer),l.bindFramebuffer(eF.DRAW_FRAMEBUFFER,v.__webglFramebuffer);for(let i=0;i<u;i++)C&&(eF.framebufferTextureLayer(eF.READ_FRAMEBUFFER,eF.COLOR_ATTACHMENT0,c.get(e).__webglTexture,a,m+i),eF.framebufferTextureLayer(eF.DRAW_FRAMEBUFFER,eF.COLOR_ATTACHMENT0,c.get(t).__webglTexture,n,g+i)),eF.blitFramebuffer(f,p,o,s,h,_,o,s,eF.DEPTH_BUFFER_BIT,eF.NEAREST);l.bindFramebuffer(eF.READ_FRAMEBUFFER,null),l.bindFramebuffer(eF.DRAW_FRAMEBUFFER,null)}else if(0!==a||e.isRenderTargetTexture||c.has(e)){let i=c.get(e),r=c.get(t);l.bindFramebuffer(eF.READ_FRAMEBUFFER,e6),l.bindFramebuffer(eF.DRAW_FRAMEBUFFER,e8);for(let e=0;e<u;e++)C?eF.framebufferTextureLayer(eF.READ_FRAMEBUFFER,eF.COLOR_ATTACHMENT0,i.__webglTexture,a,m+e):eF.framebufferTexture2D(eF.READ_FRAMEBUFFER,eF.COLOR_ATTACHMENT0,eF.TEXTURE_2D,i.__webglTexture,a),P?eF.framebufferTextureLayer(eF.DRAW_FRAMEBUFFER,eF.COLOR_ATTACHMENT0,r.__webglTexture,n,g+e):eF.framebufferTexture2D(eF.DRAW_FRAMEBUFFER,eF.COLOR_ATTACHMENT0,eF.TEXTURE_2D,r.__webglTexture,n),0!==a?eF.blitFramebuffer(f,p,o,s,h,_,o,s,eF.COLOR_BUFFER_BIT,eF.NEAREST):P?eF.copyTexSubImage3D(v,n,h,_,g+e,f,p,o,s):eF.copyTexSubImage2D(v,n,h,_,f,p,o,s);l.bindFramebuffer(eF.READ_FRAMEBUFFER,null),l.bindFramebuffer(eF.DRAW_FRAMEBUFFER,null)}else P?e.isDataTexture||e.isData3DTexture?eF.texSubImage3D(v,n,h,_,g,o,s,u,S,M,E.data):t.isCompressedArrayTexture?eF.compressedTexSubImage3D(v,n,h,_,g,o,s,u,S,E.data):eF.texSubImage3D(v,n,h,_,g,o,s,u,S,M,E):e.isDataTexture?eF.texSubImage2D(eF.TEXTURE_2D,n,h,_,o,s,S,M,E.data):e.isCompressedTexture?eF.compressedTexSubImage2D(eF.TEXTURE_2D,n,h,_,E.width,E.height,S,E.data):eF.texSubImage2D(eF.TEXTURE_2D,n,h,_,o,s,S,M,E);eF.pixelStorei(eF.UNPACK_ROW_LENGTH,T),eF.pixelStorei(eF.UNPACK_IMAGE_HEIGHT,x),eF.pixelStorei(eF.UNPACK_SKIP_PIXELS,R),eF.pixelStorei(eF.UNPACK_SKIP_ROWS,A),eF.pixelStorei(eF.UNPACK_SKIP_IMAGES,b),0===n&&t.generateMipmaps&&eF.generateMipmap(v),l.unbindTexture()},this.initRenderTarget=function(e){void 0===c.get(e).__webglFramebuffer&&d.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?d.setTextureCube(e,0):e.isData3DTexture?d.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?d.setTexture2DArray(e,0):d.setTexture2D(e,0),l.unbindTexture()},this.resetState=function(){ed=0,eu=0,ef=null,l.reset(),w.reset()},"u">typeof __THREE_DEVTOOLS__&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return r.TdN}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=r.ppV._getDrawingBufferColorSpace(e),t.unpackColorSpace=r.ppV._getUnpackColorSpace()}}}}]);