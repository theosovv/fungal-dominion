import { Cell } from '@src/types/cell';
import { Position } from '@src/types/position';
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CellShaderMaterial } from '@src/shaders/CellShader';
import { useFrame } from '@react-three/fiber';

const CELL_COLORS = {
  0: '#222222', // Empty
  1: '#8B4513', // Nutrient
  2: '#FFFF00', // Spore
  3: '#4daa57', // Mycelium
  4: '#9370DB', // FruitingBody
  5: '#FF4500', // Toxin
};

interface Props {
  cell: Cell;
  position: Position;
  onClick: () => void;
}

export function CellMesh(props: Props) {
  const { cell, position, onClick } = props;

  const material = useMemo(() => {
    const baseColor = new THREE.Color(CELL_COLORS[cell.type] || '#FFFFFF');

    return new CellShaderMaterial({
      cellType: cell.type,
      baseColor: baseColor,
      nutrition: cell.state.nutrition / 100,
      toxicity: cell.state.toxicity / 100,
      age: cell.state.age / 1000,
      energy: cell.state.energy / 100,
      growth: cell.state.growth,
    });
  }, [cell]);

  const height = useMemo(() => {
    if (cell.type === 0) return 0.05; // Empty
    if (cell.type === 1) return 0.2; // Nutrient
    if (cell.type === 2) return 0.3; // Spore
    if (cell.type === 3) return 0.4 + cell.state.growth * 0.3; // Mycelium
    if (cell.type === 4) return 0.7 + cell.state.growth * 0.5; // FruitingBody
    if (cell.type === 5) return 0.3 + cell.state.toxicity * 0.3; // Toxin
    return 0.1;
  }, [cell]);

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  useFrame(({ clock }) => {
    if (material) {
      material.updateTime(clock.getElapsedTime());

      material.update({
        cellType: cell.type,
        baseColor: new THREE.Color(CELL_COLORS[cell.type] || '#FFFFFF'),
        nutrition: cell.state.nutrition / 100,
        toxicity: cell.state.toxicity / 100,
        age: cell.state.age / 1000,
        energy: cell.state.energy / 100,
        growth: cell.state.growth,
      });
    }
  });

  const geometry = useMemo(() => {
    if (cell.type === 0) {
      return new THREE.BoxGeometry(0.9, height, 0.9);
    } else if (cell.type === 1) {
      return new THREE.BoxGeometry(0.9, height, 0.9, 2, 1, 2);
    } else if (cell.type === 2) {
      return new THREE.SphereGeometry(0.45, 12, 12);
    } else if (cell.type === 3) {
      return new THREE.CylinderGeometry(0.4, 0.45, height, 8, 2);
    } else if (cell.type === 4) {
      return new THREE.CylinderGeometry(0.45, 0.35, height, 12, 3);
    } else if (cell.type === 5) {
      return new THREE.OctahedronGeometry(0.45, 1);
    }

    return new THREE.BoxGeometry(0.9, height, 0.9);
  }, [cell.type, height]);

  return (
    <mesh
      position={[position.x, height / 2, position.y]}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
      geometry={geometry}
    >
      <boxGeometry args={[0.9, height, 0.9]} />
      <primitive attach='material' object={material} />
    </mesh>
  );
}
