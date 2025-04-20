import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Game() {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wpm, setWpm] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('https://typing-speed-battle-game-backend.vercel.app/api/game/words')
      .then(res => res.json())
      .then(data => setWords(data.words))
      .catch(err => console.error('Error fetching words:', err));
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (gameStarted && !gameEnded && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  const endGame = () => {
    setGameEnded(true);
    setGameStarted(false);

    const timeTaken = 30 - timeLeft; // Calculate the time taken in seconds
    const wordsPerMinute = timeTaken > 0 ? Math.round((correctWords * 60) / timeTaken) : 0; // Correct WPM formula
    setWpm(wordsPerMinute);

    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch('https://typing-speed-battle-game-backend.vercel.app/api/game/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId,
          wpm: wordsPerMinute,
          accuracy,
        }),
      });
    }
  };

  const handleInputChange = (e) => {
    if (!gameStarted || gameEnded) return;

    const value = e.target.value;
    setInputValue(value);

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const currentWord = words[currentWordIndex];
      const isCorrect = typedWord === currentWord;

      setCorrectWords(prev => {
        const updatedCorrectWords = isCorrect ? prev + 1 : prev;
        const newAccuracy = Math.round((updatedCorrectWords / (currentWordIndex + 1)) * 100);
        setAccuracy(Math.max(0, newAccuracy));
        return updatedCorrectWords;
      });

      if (!isCorrect) {
        setMistakes(prev => prev + 1);
      }

      setCurrentWordIndex(prev => prev + 1);
      setInputValue('');
    }
  };

  const startGame = () => {
    setGameStarted(true); // Start the game when the button is clicked
    setGameEnded(false);
    setStartTime(Date.now());
    setTimeLeft(60); // Timer starts from 60 seconds
    setCurrentWordIndex(0);
    setWpm(0);
    setProgress(0);
    setAccuracy(100);
    setMistakes(0);
    setCorrectWords(0);
    setInputValue('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        {!gameStarted && !gameEnded ? (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Typing Speed Test
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Test your typing speed with a 60-second challenge
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Start Game
            </button>
          </div>
        ) : gameEnded ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Game Over!</h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{correctWords}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{accuracy}%</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Time: {timeLeft}s
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                WPM: {Math.round((correctWords / ((30 - timeLeft) / 60)) || 0)}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg min-h-[100px] flex items-center justify-center">
              <div className="text-2xl font-mono">
                {words.slice(currentWordIndex, currentWordIndex + 3).map((word, index) => (
                  <span
                    key={index}
                    className={`mx-2 ${
                      index === 0 ? 'bg-yellow-200 dark:bg-yellow-500 px-2 py-1 rounded' : 
                      'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full p-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
              placeholder="Type here..."
              autoFocus
            />

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Accuracy: {accuracy}%</span>
              <span>Words: {correctWords}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
