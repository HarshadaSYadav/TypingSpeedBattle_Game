import { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/game/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaderboard(data.leaderboard);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load leaderboard');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Players</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {leaderboard.map((player, index) => (
            <div
              key={player._id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <span className={`
                  w-8 h-8 flex items-center justify-center rounded-full
                  ${index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}
                `}>
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">{player.username}</span>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">High Score</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{player.highScore} WPM</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Games</div>
                  <div className="font-semibold text-gray-900 dark:text-white">{player.gamesPlayed}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;