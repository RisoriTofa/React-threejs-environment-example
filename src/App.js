import * as THREE from 'three'
import { Box, Plane } from "@react-three/drei";
import React, { Suspense, useMemo }  from "react";
import { Canvas, useLoader } from "react-three-fiber";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import niceColors from 'nice-color-palettes';
import "./styles.css";

function PhyPlane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props }));

  return (
    <Plane args={[1000, 1000]} ref={ref}>
      <meshStandardMaterial color={color} />
    </Plane>
  );
}

function PhyBox(props) {
  const [ref, api] = useBox(() => ({ args: [1, 1, 1], mass: 1, ...props }));

  return (
    <Box
      args={[1, 1, 1]}
      ref={ref}
      onClick={() =>

        api.applyImpulse([0, 5, -10], [0, 0, 0])
&&
        api.velocity.set(0, 2, 0)

      }
    >
      <meshNormalMaterial />
    </Box>
  );
}

function InstancedSpheres({ number = 100 }) {
    const map = useLoader(THREE.TextureLoader, '/carbon_normal.jpg')
    const [ref] = useSphere(index => ({
        mass: 1,
        position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
        args:1
    }))
    const colors = useMemo(() => {
        const array = new Float32Array(number * 3)
        const color = new THREE.Color()
        for (let i = 0; i < number; i++)
            color
                .set(niceColors[17][Math.floor(Math.random() * 5)])
                .convertSRGBToLinear()
                .toArray(array, i * 3)
        return array
    }, [number])
    return (
        <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, number]}>
            <sphereBufferGeometry attach="geometry" args={[1, 16, 16]}>
                <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colors, 3]} />
            </sphereBufferGeometry>
            <meshPhongMaterial
                attach="material"
                vertexColors={THREE.VertexColors}
                normalMap={map}
                normalScale={[1, 1]}
                normalMap-wrapS={THREE.RepeatWrapping}
                normalMap-wrapT={THREE.RepeatWrapping}
                normalMap-repeat={[10, 10]}
            />
        </instancedMesh>
    )
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 0], near: 0.1, far: 1000 }}>
      <Physics gravity={[0, -10, 0]}>
        <PhyPlane
          color={niceColors[17][5]}
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <PhyPlane color={niceColors[17][2]} position={[0, 0, -10]} />
          <PhyPlane color={niceColors[17][3]} position={[-6, 0, -10]} rotation={[0, 2, 0]} />
          <PhyPlane color={niceColors[17][1]} position={[6, 0, -10]} rotation={[0, -2, 0]} />

        <PhyBox position={[2, 0, -5]} />
        <PhyBox position={[0, 0, -5]} />
        <PhyBox position={[-2, 0, -5]} />
          <Suspense fallback={null}>
              <InstancedSpheres number={10} />
          </Suspense>
      </Physics>
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.8} position={[5, 0, 5]} />
    </Canvas>
  );
}

export default App;
