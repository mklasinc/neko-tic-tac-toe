export const CustomShader = {
  uniforms: {
    tDiffuse: { value: null },
  },
  vertexShader: `
			varying vec2 vUv;

			void main() {
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				vUv = uv;
			}
		`,
  fragmentShader: `
			uniform sampler2D tDiffuse;
			varying vec2 vUv;
			
			void main() {
				vec4 color = texture2D(tDiffuse, vUv);
				color.b += 0.5; // applies blue tint
				gl_FragColor = color;
			}
		`,
}
