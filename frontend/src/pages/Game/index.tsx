import { useGame } from '@src/context/GameContext';
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GameContainer } from './styled';
import { LoadingScreen } from '@src/components/UI/LoadingScreen';
import { ColonyGrid } from '@src/components/Game/ColonyGrid';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';

export function Game() {
  const { isConnected, colony } = useGame()!;
  const [zoom, setZoom] = useState(30);
  const [cameraPosition, setCameraPosition] = useState([20, 20, 20]);

  if (!isConnected || !colony) {
    return <LoadingScreen message='Connecting to colony...' />;
  }

  return (
    <GameContainer>
      <Canvas shadows camera={{ position: [0, zoom, 0], fov: 50, near: 0.1, far: 1000 }}>
        <color attach='background' args={['#0a0a15']} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <OrthographicCamera
          makeDefault
          position={cameraPosition as [number, number, number]}
          zoom={zoom}
          near={1}
          far={1000}
        />
        <ColonyGrid colony={colony} />
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.5}
          minZoom={20}
          maxZoom={100}
          enableRotate={false}
          screenSpacePanning
          onChange={(e) => {
            setCameraPosition(e!.target.position0.toArray());
            setZoom(e!.target.zoom0);
          }}
        />
      </Canvas>
    </GameContainer>
  );
}
