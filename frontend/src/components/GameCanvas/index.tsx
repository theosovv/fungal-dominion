import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Container } from './styled';

function CellField() {
  return (
    <group>
      {/* TODO: Рендер клеток */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='green' />
      </mesh>
    </group>
  );
}

export function GameCanvas() {
  return (
    <Container>
      <Canvas camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <CellField />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </Container>
  );
}
