import React from 'react';

type Cell = {
  x: number;
  y: number;
};

type Props = {
  snake: Cell[];
  food: Cell;
  boardSize: number;
};

const GameBoard: React.FC<Props> = ({ snake, food, boardSize }) => {
  const getCellType = (x: number, y: number) => {
    if (snake.some(segment => segment.x === x && segment.y === y)) return 'snake';
    if (food.x === x && food.y === y) return 'food';
    return 'empty';
  };

  const rows = Array.from({ length: boardSize }, (_, y) => (
    <div key={y} style={{ display: 'flex' }}>
      {Array.from({ length: boardSize }, (_, x) => {
        const type = getCellType(x, y);
        const emoji = type === 'snake' ? '🐍' : type === 'food' ? '🍎' : ' ';
        return (
          <div
            key={x}
            style={{
              width: 24,
              height: 24,
              border: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              userSelect: 'none',
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  ));

  return <div style={{ display: 'inline-block', marginTop: '20px' }}>{rows}</div>;
};

export default GameBoard;
