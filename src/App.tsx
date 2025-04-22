import { useEffect, useState, useRef } from 'react';
import GameBoard from './components/GameBoard';

const BOARD_SIZE = 20;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Cell = { x: number; y: number };

const App = () => {
  const [snake, setSnake] = useState<Cell[]>([{ x: 8, y: 8 }]);
  const [food, setFood] = useState<Cell>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('highScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const intervalRef = useRef<number | null>(null);

  const resetGame = () => {
    setSnake([{ x: 8, y: 8 }]);
    setFood({
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    });
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);

    clearInterval(intervalRef.current!);
    startGameLoop();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isGameOver) return;
  
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  };
  

  const startGameLoop = () => {
    intervalRef.current = window.setInterval(() => {
      setSnake((prev) => {
        if (isGameOver) return prev;
        const newSnake = [...prev];
        const head = { ...newSnake[0] };

        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Wall collision
        if (
          head.x < 0 || head.x >= BOARD_SIZE ||
          head.y < 0 || head.y >= BOARD_SIZE
        ) {
          setIsGameOver(true);
          clearInterval(intervalRef.current!);
          return prev;
        }

        // Self collision
        if (newSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setIsGameOver(true);
          clearInterval(intervalRef.current!);
          return prev;
        }

        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          let newFood: Cell;
          do {
            newFood = {
              x: Math.floor(Math.random() * BOARD_SIZE),
              y: Math.floor(Math.random() * BOARD_SIZE),
            };
          } while (newSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));

          setFood(newFood);
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('highScore', newScore.toString());
            }
            return newScore;
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    startGameLoop();
    return () => clearInterval(intervalRef.current!);
  }, [direction, food]);

  return (
    <body style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <h1>Snake Game</h1>
      <p style={{ fontSize: '18px', marginTop: '-10px' }}>
        Score: <strong>{score}</strong>
      </p>

      {isGameOver && (
        <div style={{ marginTop: '16px', fontSize: '18px', color: 'crimson' }}>
          <p><strong>Game Over!</strong></p>
          <button
            onClick={resetGame}
            style={{
              marginTop: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Restart Game
          </button>
        </div>
      )}

      <GameBoard snake={snake} food={food} boardSize={BOARD_SIZE} />
      <p style={{ fontSize: '24px', marginTop: '4px' }}>
        High Score: <strong>{highScore}</strong>
      </p>
    </div>
    </body>
  );
};

export default App;
