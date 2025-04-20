import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Welcome to TypeSpeed Battle
      </h1>
      <div className="space-y-4">
        <Link
          to="/game"
          className="block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Start Game
        </Link>
        <Link
          to="/leaderboard"
          className="block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
        >
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}

export default Home;