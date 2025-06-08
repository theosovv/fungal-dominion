import { useGame } from '@src/context/GameContext';
import { Colony } from '@src/types/colony';
import { DirectiveType } from '@src/types/directive';
import React, { useCallback, useMemo } from 'react';
import { CellMesh } from './CellMesh';

interface Props {
  colony: Colony;
}

export function ColonyGrid({ colony }: Props) {
  const { ws } = useGame()!;

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      ws?.sendDirective({
        type: DirectiveType.CellClick,
        position: { x, y },
        timestamp: new Date().toISOString(),
      });
    },
    [ws],
  );

  const grid = useMemo(() => {
    if (!colony || !colony.cells) return null;

    const cells = [];

    for (let y = 0; y < colony.height; y++) {
      for (let x = 0; x < colony.width; x++) {
        const cell = colony.cells[y][x];

        cells.push(
          <CellMesh
            key={`cell-${x}-${y}`}
            cell={cell}
            position={{ x, y }}
            onClick={() => handleCellClick(x, y)}
          />,
        );
      }
    }

    return cells;
  }, [colony, handleCellClick]);

  return (
    <group position={[0, 0, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[colony.width / 2 - 0.5, -0.05, colony.height / 2 - 0.5]}
        receiveShadow
      >
        <planeGeometry args={[colony.width, colony.height]} />
        <meshStandardMaterial color={'#0a0a15'} />
      </mesh>
      {grid}
    </group>
  );
}
