import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface PuzzlePiece {
  id: number;
  imageUrl: string;
  row: number;
  col: number;
  currentX: number;
  currentY: number;
  isCorrect: boolean;
  isDragging: boolean;
}

interface PuzzleGameProps {
  pieces: string[]; // 9 piece data URLs (3x3 grid)
  pieceWidth: number;
  pieceHeight: number;
  onComplete: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  pieces,
  pieceWidth,
  pieceHeight,
  onComplete,
}) => {
  const GRID_SIZE = 3;
  const GRID_GAP = 8;
  const SNAP_THRESHOLD = 40; // pixels

  const containerRef = useRef<HTMLDivElement>(null);
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize puzzle pieces with randomized positions at top
  useEffect(() => {
    const initialPieces = pieces.map((imageUrl, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      // Start at random position at top of container
      const randomX = Math.random() * (containerRef.current?.clientWidth || 400) - pieceWidth / 2;
      const randomY = -pieceHeight * 2;

      return {
        id: index,
        imageUrl,
        row,
        col,
        currentX: randomX,
        currentY: randomY,
        isCorrect: false,
        isDragging: false,
      };
    });

    setPuzzlePieces(initialPieces);
  }, [pieces, pieceWidth, pieceHeight]);

  // Calculate target position for a grid cell
  const getTargetPosition = useCallback((row: number, col: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const gridStartX = (containerRef.current.clientWidth - (GRID_SIZE * pieceWidth + (GRID_SIZE - 1) * GRID_GAP)) / 2;
    const gridStartY = 80;

    return {
      x: gridStartX + col * (pieceWidth + GRID_GAP),
      y: gridStartY + row * (pieceHeight + GRID_GAP),
    };
  }, [pieceWidth, pieceHeight, GRID_SIZE]);

  const handleDragStart = (pieceId: number) => {
    if (isCompleted) return;

    setPuzzlePieces((prev) =>
      prev.map((piece) =>
        piece.id === pieceId ? { ...piece, isDragging: true } : piece
      )
    );
  };

  // Handle drag end - check for snap to grid
  const handleDragEnd = (pieceId: number, info: { offset: { x: number; y: number } }) => {
    if (isCompleted) return;

    setPuzzlePieces((prev) => {
      const draggedPiece = prev.find((p) => p.id === pieceId);
      if (!draggedPiece) return prev;

      const nextX = draggedPiece.currentX + info.offset.x;
      const nextY = draggedPiece.currentY + info.offset.y;
      const targetPos = getTargetPosition(draggedPiece.row, draggedPiece.col);
      const distToTarget = Math.sqrt(
        Math.pow(nextX - targetPos.x, 2) +
          Math.pow(nextY - targetPos.y, 2)
      );

      const nextPieces = prev.map((piece) =>
        piece.id === pieceId
          ? {
              ...piece,
              currentX: distToTarget < SNAP_THRESHOLD ? targetPos.x : nextX,
              currentY: distToTarget < SNAP_THRESHOLD ? targetPos.y : nextY,
              isCorrect: distToTarget < SNAP_THRESHOLD ? true : piece.isCorrect,
              isDragging: false,
            }
          : piece
      );

      const allCorrect = nextPieces.every((piece) => piece.isCorrect);
      if (allCorrect && !isCompleted) {
        setIsCompleted(true);
        onComplete();
      }

      return nextPieces;
    });
  };

  // Animate pieces falling from top to random positions on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPuzzlePieces((prev) =>
        prev.map((piece) => ({
          ...piece,
          currentY: Math.random() * 200 + 100,
        }))
      );
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const gridContainerWidth =
    GRID_SIZE * pieceWidth + (GRID_SIZE - 1) * GRID_GAP;
  const gridContainerX = containerRef.current
    ? (containerRef.current.clientWidth - gridContainerWidth) / 2
    : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[560px] sm:h-[600px] bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden"
    >
      {/* Target grid visualization */}
      <div
        className="absolute top-20 grid gap-2 pointer-events-none"
        style={{
          left: `${gridContainerX}px`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, ${pieceWidth}px))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, ${pieceHeight}px))`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <div
            key={`grid-${index}`}
            className="border-2 border-dashed border-cosmic-glow/30 rounded"
            style={{
              width: pieceWidth,
              height: pieceHeight,
            }}
          />
        ))}
      </div>

      {/* Draggable pieces */}
      {puzzlePieces.map((piece, index) => {
        const dragZ = piece.isDragging ? 60 : piece.isCorrect ? 50 : 20;

        return (
          <motion.div
            key={`piece-${piece.id}`}
            initial={{ opacity: 0, y: -pieceHeight * 3 }}
            animate={{
              opacity: 1,
              x: piece.currentX,
              y: piece.currentY,
              scale: piece.isDragging ? 1.04 : 1,
            }}
            transition={{
              delay: index * 0.08,
              type: 'spring',
              stiffness: piece.isCorrect ? 260 : 130,
              damping: piece.isCorrect ? 24 : 18,
            }}
            drag={!piece.isCorrect && !isCompleted}
            dragMomentum={false}
            dragElastic={0.12}
            dragSnapToOrigin={false}
            onDragStart={() => handleDragStart(piece.id)}
            onDragEnd={(_, info) => handleDragEnd(piece.id, info)}
            className={`absolute rounded-lg overflow-hidden shadow-lg select-none touch-none transition-[box-shadow,filter,opacity] ${
              piece.isCorrect
                ? 'border-2 border-cosmic-glow shadow-[0_0_15px_rgba(196,181,253,0.5)] z-50'
                : 'border border-white/20 hover:border-white/40 cursor-grab active:cursor-grabbing'
            }`}
            style={{
              width: pieceWidth,
              height: pieceHeight,
              zIndex: dragZ,
            }}
          >
            <img
              src={piece.imageUrl}
              alt={`Puzzle piece ${piece.id}`}
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Glow effect when correct */}
            {piece.isCorrect && (
              <motion.div
                className="absolute inset-0 border-2 border-cosmic-glow rounded-lg"
                animate={{
                  boxShadow: [
                    '0 0 10px rgba(196, 181, 253, 0.3)',
                    '0 0 25px rgba(196, 181, 253, 0.6)',
                    '0 0 10px rgba(196, 181, 253, 0.3)',
                  ],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Completion message */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl z-[80]"
        >
          <div className="text-center">
            <motion.p
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl md:text-4xl font-heading text-cosmic-glow text-glow"
            >
              ✨ Puzzle Complete ✨
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
