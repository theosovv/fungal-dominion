import { CellType } from '@src/types/cell';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  uniform float time;
  uniform float growth;
  uniform float cellType;
  uniform float energy;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    // Gradients
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    vNormal = normal;
    
    // Base position
    vec3 pos = position;
    
    // Apply different deformations based on cell type
    if (cellType == 1.0) { // Nutrient
      // Gentle undulation for nutrients
      float noise = snoise(vec3(position.xz * 2.0, time * 0.1)) * 0.05;
      pos.y += noise * growth;
    } 
    else if (cellType == 2.0) { // Spore
      // Pulsating effect for spores
      float pulse = sin(time * 2.0) * 0.05 + 0.95;
      pos *= mix(1.0, pulse, growth);
    } 
    else if (cellType == 3.0) { // Mycelium
      // Mycelium grows and sways
      float swayX = sin(time * 0.5 + position.z * 2.0) * 0.1 * growth;
      float swayZ = cos(time * 0.7 + position.x * 2.0) * 0.1 * growth;
      pos.x += swayX;
      pos.z += swayZ;
      pos.y *= (0.5 + growth * 0.5);
    } 
    else if (cellType == 4.0) { // FruitingBody
      // Fruiting body expands and has subtle movement
      float expand = 0.8 + growth * 0.4;
      float heightGrowth = 0.5 + growth * 1.0;
      pos.xz *= expand;
      pos.y *= heightGrowth;
      
      // Add some wobble
      float wobble = snoise(vec3(position.xz * 3.0, time * 0.2)) * 0.1 * growth;
      pos.xz += wobble * normalize(position.xz);
    } 
    else if (cellType == 5.0) { // Toxin
      // Toxins have a more aggressive, spiky appearance
      float spikeFactor = 0.8 + 0.4 * sin(time * 3.0 + position.x * 10.0 + position.z * 10.0);
      float distFromCenter = length(position.xz);
      float spike = sin(distFromCenter * 10.0 + time) * 0.2 * growth;
      pos += normal * spike * spikeFactor;
    }
    
    // Energy can make cells more active
    if (energy > 0.0 && cellType > 0.0) {
      float energyEffect = snoise(vec3(position.xz * 4.0, time * 0.3)) * energy * 0.1;
      pos += normal * energyEffect;
    }
    
    vPosition = pos;
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const fragmentShader = `
  uniform vec3 baseColor;
  uniform float cellType;
  uniform float nutrition;
  uniform float toxicity;
  uniform float age;
  uniform float energy;
  uniform float growth;
  uniform float time;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    // Gradients
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  // Fresnel effect for edge glow
  float fresnel(vec3 viewDirection, vec3 normal, float power) {
    return pow(1.0 - abs(dot(viewDirection, normal)), power);
  }
  
  void main() {
    // Base color
    vec3 color = baseColor;
    
    // View direction for effects
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    
    // Fresnel effect for all cell types
    float fresnelFactor = fresnel(viewDirection, vNormal, 3.0);
    
    // Common noise patterns
    float noise1 = snoise(vec3(vUv * 10.0, time * 0.1));
    float noise2 = snoise(vec3(vUv * 20.0, time * 0.2));
    float noise3 = snoise(vec3(vPosition.x * 5.0, vPosition.z * 5.0, time * 0.05));
    
    if (cellType == 0.0) { // Empty
      // Subtle dark grid pattern
      color = mix(color, vec3(0.05, 0.05, 0.1), 0.9);
      float gridPattern = step(0.95, mod(vUv.x * 10.0, 1.0)) + step(0.95, mod(vUv.y * 10.0, 1.0));
      color = mix(color, vec3(0.1, 0.1, 0.2), gridPattern * 0.5);
    } 
    else if (cellType == 1.0) { // Nutrient
      // Rich soil-like texture with organic patterns
      vec3 soilColor = mix(vec3(0.4, 0.2, 0.1), vec3(0.6, 0.3, 0.1), noise1 * 0.5 + 0.5);
      color = mix(color, soilColor, nutrition);
      
      // Add small particles/granules
      float granules = step(0.7, fract(noise2 * 5.0));
      color = mix(color, vec3(0.7, 0.4, 0.2), granules * 0.2);
      
      // Add moisture effect
      float moisture = smoothstep(0.3, 0.7, noise3);
      color = mix(color, vec3(0.3, 0.15, 0.05), moisture * 0.3);
      
      // Subtle glow for high nutrition
      color += vec3(0.2, 0.1, 0.0) * nutrition * nutrition * 0.3;
    } 
    else if (cellType == 2.0) { // Spore
      // Spores have a bioluminescent glow
      vec3 sporeColor = mix(vec3(1.0, 0.9, 0.4), vec3(0.8, 0.7, 0.2), noise1);
      color = mix(color, sporeColor, 0.8);
      
      // Pulsating glow effect
      float pulse = (sin(time * 3.0 + vPosition.x * 10.0 + vPosition.z * 10.0) * 0.5 + 0.5) * energy;
      color += vec3(1.0, 0.9, 0.5) * pulse * 0.3;
      
      // Age affects the color - older spores get darker
      float ageFactor = clamp(age / 100.0, 0.0, 1.0);
      color = mix(color, vec3(0.6, 0.5, 0.1), ageFactor * 0.5);
      
      // Add speckled pattern
      float speckles = step(0.75, noise2);
      color = mix(color, vec3(1.0, 0.95, 0.7), speckles * 0.2);
      
      // Strong fresnel for translucent edge effect
      color += vec3(1.0, 0.9, 0.4) * fresnelFactor * 0.5;
    } 
    else if (cellType == 3.0) { // Mycelium
      // Mycelium has a fibrous, network-like appearance
      vec3 myceliumColor = mix(vec3(0.7, 0.85, 0.7), vec3(0.5, 0.7, 0.5), noise1);
      color = mix(color, myceliumColor, 0.8);
      
      // Fibrous pattern
      float fibers = smoothstep(0.4, 0.6, sin(vUv.x * 20.0 + vUv.y * 20.0 + noise2 * 5.0));
      color = mix(color, vec3(0.8, 0.9, 0.8), fibers * 0.2);
      
      // Energy flow effect - moving patterns along the mycelium
      float energyFlow = sin(vUv.x * 10.0 - time * 0.5) * sin(vUv.y * 10.0 - time * 0.7) * 0.5 + 0.5;
      color += vec3(0.2, 0.4, 0.2) * energyFlow * energy * 0.3;
      
      // Growth affects brightness
      color *= (0.8 + growth * 0.4);
      
      // Subtle fresnel for edge highlighting
      color += vec3(0.5, 0.8, 0.5) * fresnelFactor * 0.3;
    } 
    else if (cellType == 4.0) { // FruitingBody
      // Fruiting bodies have rich, vibrant colors
      vec3 fruitColor = mix(vec3(0.8, 0.5, 0.8), vec3(0.6, 0.3, 0.6), noise1);
      color = mix(color, fruitColor, 0.8);
      
      // Add cap texture with spots/patterns
      float spots = smoothstep(0.4, 0.6, sin(vUv.x * 15.0) * sin(vUv.y * 15.0) + noise2 * 0.5);
      color = mix(color, vec3(0.9, 0.7, 0.9), spots * 0.3);
      
      // Gradient from stem to cap
      float heightGradient = smoothstep(0.0, 1.0, vPosition.y);
      color = mix(color, vec3(0.7, 0.4, 0.7), heightGradient * 0.3);
      
      // Gills/underside texture
      if (vNormal.y < -0.3) {
        float gillPattern = sin(vUv.x * 30.0) * 0.5 + 0.5;
        color = mix(color, vec3(0.5, 0.3, 0.5), gillPattern * 0.5);
      }
      
      // Mature fruiting bodies have spore release effect
      if (age > 50.0) {
        float sporeRelease = sin(time * 2.0 + vPosition.x * 5.0 + vPosition.z * 5.0) * 0.5 + 0.5;
        if (vNormal.y < -0.5 && sporeRelease > 0.7) {
          color += vec3(0.8, 0.7, 0.9) * 0.3;
        }
      }
      
      // Fresnel for translucent edge glow
      color += vec3(0.8, 0.5, 0.8) * fresnelFactor * 0.4;
    } 
    else if (cellType == 5.0) { // Toxin
      // Toxins have vibrant warning colors
      vec3 toxinColor = mix(vec3(0.8, 0.2, 0.1), vec3(1.0, 0.3, 0.0), noise1);
      color = mix(color, toxinColor, 0.8);
      
      // Pulsating toxic glow
      float toxicPulse = sin(time * 5.0 + vPosition.x * 8.0 + vPosition.z * 8.0) * 0.5 + 0.5;
      color += vec3(1.0, 0.3, 0.0) * toxicPulse * toxicity * 0.4;
      
      // Veiny/marbled pattern
      float veins = smoothstep(0.4, 0.6, sin(vUv.x * 10.0 + vUv.y * 8.0 + noise2 * 10.0));
      color = mix(color, vec3(1.0, 0.5, 0.0), veins * 0.3);
      
      // Crystalline/sharp edges
      if (fresnelFactor > 0.7) {
        color += vec3(1.0, 0.6, 0.0) * (fresnelFactor - 0.7) * 3.0;
      }
      
      // Toxicity level affects intensity
      color = mix(color, vec3(1.0, 0.0, 0.0), toxicity * 0.3);
    }
    
    // Apply lighting
    float diffuse = max(dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))), 0.0);
    float ambient = 0.3;
    color *= (ambient + diffuse * 0.7);
    
    // Energy makes all cells slightly glow
    if (energy > 0.0 && cellType > 0.0) {
      color += baseColor * energy * 0.2;
    }
    
    // Add fresnel rim lighting to all cells
    color += baseColor * fresnelFactor * 0.2;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface Params {
  cellType: CellType;
  baseColor: THREE.Color;
  nutrition: number;
  toxicity: number;
  age: number;
  energy: number;
  growth: number;
}

export class CellShaderMaterial extends THREE.ShaderMaterial {
  constructor(params: Params) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        baseColor: { value: params.baseColor || new THREE.Color('#FFFFFF') },
        cellType: { value: params.cellType || 0 },
        nutrition: { value: params.nutrition || 0 },
        toxicity: { value: params.toxicity || 0 },
        age: { value: params.age || 0 },
        energy: { value: params.energy || 0 },
        growth: { value: params.growth || 0 },
        time: { value: 0 },
      },
    });
  }

  update(params: Params) {
    for (const [key, value] of Object.entries(params)) {
      if (this.uniforms[key]) {
        this.uniforms[key].value = value;
      }
    }
  }

  updateTime(time: number) {
    this.uniforms.time.value = time;
  }
}
