import { Box, Plane } from "@react-three/drei";
import React from "react";
import { Canvas } from "react-three-fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";

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
        /*api.applyImpulse([0, 5, -10], [0, 0, 0])}*/
        api.velocity.set(0, 2, 0)
      }
    >
      <meshNormalMaterial />
    </Box>
  );
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 0], near: 0.1, far: 1000 }}>
      <Physics gravity={[0, -10, 0]}>
        <PhyPlane
          color="hotpink"
          position={[0, -2, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <PhyPlane color="lightblue" position={[0, 0, -10]} />
        <PhyBox position={[2, 0, -5]} />
        <PhyBox position={[0, 0, -5]} />
        <PhyBox position={[-2, 0, -5]} />
      </Physics>
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.8} position={[5, 0, 5]} />
    </Canvas>
  );
}

export default App;
