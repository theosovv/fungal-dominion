import React, { useEffect, useRef } from 'react';
import { CellType, Colony, GameWebSocket } from '../../services/websocket';
import { GameSettings } from '../../services/storage';

interface GameCanvasProps {
  colony: Colony | null;
  websocket: GameWebSocket | null;
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
}

export function GameCanvas({ colony, websocket, settings }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !colony) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(settings.camera.x, settings.camera.y);
    ctx.scale(settings.camera.zoom, settings.camera.zoom);

    drawColony(ctx, colony);

    ctx.restore();
  }, [colony, settings]);

  const drawColony = (ctx: CanvasRenderingContext2D, colony: Colony) => {
    const cellSize = 25;

    colony.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type === CellType.Empty) return;

        const posX = x * cellSize;
        const posY = y * cellSize;

        switch (cell.type) {
          case CellType.Nutrient:
            ctx.fillStyle = `rgba(255, 165, 0, ${Math.min(cell.state.nutrition / 100, 1)})`;
            break;
          case CellType.Spore:
            ctx.fillStyle = `rgba(139, 69, 19, ${Math.min(cell.state.health / 100, 1)})`;
            break;
          case CellType.Mycelium:
            ctx.fillStyle = `rgba(34, 139, 34, ${Math.min(cell.state.health / 100, 1)})`;
            break;
          case CellType.FruitingBody:
            ctx.fillStyle = `rgba(255, 69, 0, ${Math.min(cell.state.health / 100, 1)})`;
            break;
          case CellType.Toxin:
            ctx.fillStyle = `rgba(128, 0, 128, ${Math.min(cell.state.toxicity / 100, 1)})`;
            break;
          default:
            ctx.fillStyle = '#888';
        }

        ctx.fillRect(posX, posY, cellSize - 1, cellSize - 1);

        if (cell.state.energy > 20) {
          ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
          const energyHeight = (cell.state.energy / 100) * (cellSize - 2);
          ctx.fillRect(
            posX + cellSize - 3,
            posY + cellSize - energyHeight - 1,
            2,
            energyHeight,
          );
        }

        if (cell.type === CellType.Spore && cell.state.growth > 0) {
          ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
          const growthWidth = cell.state.growth * (cellSize - 2);
          ctx.fillRect(posX + 1, posY + cellSize - 3, growthWidth, 2);
        }
      });
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!websocket || !colony) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const worldX = (x - settings.camera.x) / settings.camera.zoom;
    const worldY = (y - settings.camera.y) / settings.camera.zoom;

    const cellX = Math.floor(worldX / 25);
    const cellY = Math.floor(worldY / 25);

    websocket.sendDirective({
      type: 'cell_click',
      position: { x: cellX, y: cellY },
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        style={{
          border: '1px solid #ccc',
          cursor: 'crosshair',
        }}
      />
    </div>
  );
}
