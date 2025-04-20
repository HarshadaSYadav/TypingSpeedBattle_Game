import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar({ darkMode, setDarkMode }) {
  const [username, setUsername] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUsername = () => {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername || '');
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkUsername();
    window.addEventListener('storage', checkUsername);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('storage', checkUsername);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUsername('');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg' 
        : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              TypeSpeed Battle
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to="/leaderboard" 
              className="nav-link group"
            >
              <span className="relative">
                Leaderboard
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </span>
            </Link>
            {username ? (
              <div className="flex items-center space-x-6">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Welcome, <span className="text-blue-600 dark:text-blue-400">{username}</span>!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;