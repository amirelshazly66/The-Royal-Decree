import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { 
  Crown, 
  Scroll, 
  Coins, 
  Home, 
  Calendar, 
  Settings, 
  CheckCircle2, 
  Menu, 
  X,
  HeartHandshake,
  Bird
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { TaskModal } from './components/TaskModal';
import { Treasury } from './components/Treasury';
import { CarrierPigeon } from './components/CarrierPigeon';
import { Task, AppState, Role, DailyScore } from './types';

// --- Constants & Helpers ---
const STORAGE_KEY = 'royal_decree_data';
const TODAY = new Date().toISOString().split('T')[0];

const INITIAL_STATE: AppState = {
  tasks: [
    { id: '1', title: 'Conquer the Grocery List', type: 'decree', assignedTo: 'king', dueDate: TODAY, completed: false },
    { id: '2', title: 'Organize the Royal Wardrobe', type: 'edict', assignedTo: 'queen', dueDate: TODAY, completed: false },
    { id: '3', title: 'Plan the Summer Ball', type: 'quest', assignedTo: 'shared', dueDate: TODAY, completed: false },
  ],
  coins: 100,
  dailyScores: {}
};

// --- Main Layout Component ---
const Layout: React.FC<{ 
  children: React.ReactNode; 
  reigningMonarch: Role | 'neutral'; 
  onOpenPigeon: () => void;
}> = ({ children, reigningMonarch, onOpenPigeon }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const themeColors = {
    king: 'border-king text-king',
    queen: 'border-queen text-queen',
    neutral: 'border-gold text-charcoal'
  };
  
  const bgAccent = {
    king: 'bg-blue-50',
    queen: 'bg-pink-50',
    neutral: 'bg-parchment'
  };

  const navItems = [
    { path: '/', label: 'Throne Room', icon: Home },
    { path: '/treasury', label: 'Royal Treasury', icon: Coins },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${bgAccent[reigningMonarch]}`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b-4 ${reigningMonarch === 'king' ? 'border-king' : reigningMonarch === 'queen' ? 'border-queen' : 'border-gold'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Crown className={`h-8 w-8 mr-2 ${reigningMonarch === 'king' ? 'text-king fill-king' : reigningMonarch === 'queen' ? 'text-queen fill-queen' : 'text-gold fill-gold'}`} />
              <span className="font-serif font-bold text-xl text-charcoal tracking-wider">The Royal Decree</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-charcoal font-bold underline decoration-2 underline-offset-4 decoration-gold' : 'text-gray-500 hover:text-charcoal'}`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
              <button 
                onClick={onOpenPigeon}
                className="ml-4 bg-gold hover:bg-goldDark text-white px-4 py-2 rounded-full font-serif text-sm shadow-md transition-transform transform hover:scale-105 flex items-center"
              >
                <Bird className="w-4 h-4 mr-2" />
                Send Raven
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-gray-900">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3 text-gold" />
                    {item.label}
                  </div>
                </Link>
              ))}
              <button 
                onClick={() => {
                  onOpenPigeon();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-base font-medium text-charcoal bg-gold/20"
              >
                <Bird className="w-5 h-5 mr-3" />
                Send Raven
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// --- Logic Hooks ---
const useRoyalData = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTask = (task: Task) => {
    setState(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const toggleTask = (taskId: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (!task) return prev;
      
      const isCompleting = !task.completed;
      const newTasks = prev.tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: isCompleting, completedAt: isCompleting ? new Date().toISOString() : undefined } 
          : t
      );

      // Coin logic: +10 for completion, -10 for uncheck (to prevent farming)
      let coinDiff = isCompleting ? 10 : -10;
      if (task.assignedTo === 'shared' && isCompleting) coinDiff = 15; // Bonus for quests

      // Daily Score Logic
      const todayKey = new Date().toISOString().split('T')[0];
      const currentScore = prev.dailyScores[todayKey] || { king: 0, queen: 0 };
      let newScore = { ...currentScore };

      if (task.assignedTo === 'king') {
        newScore.king += isCompleting ? 1 : -1;
      } else if (task.assignedTo === 'queen') {
        newScore.queen += isCompleting ? 1 : -1;
      } else if (task.assignedTo === 'shared' && isCompleting) {
        // Shared tasks give points to both!
        newScore.king += 0.5;
        newScore.queen += 0.5;
      }

      return {
        ...prev,
        tasks: newTasks,
        coins: Math.max(0, prev.coins + coinDiff),
        dailyScores: {
          ...prev.dailyScores,
          [todayKey]: newScore
        }
      };
    });
  };

  const spendCoins = (amount: number) => {
    setState(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
  };

  // Calculate reigning monarch based on YESTERDAY's score
  const reigningMonarch = useMemo((): Role | 'neutral' => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    const scores = state.dailyScores[yesterdayKey];

    if (!scores) return 'neutral';
    if (scores.king > scores.queen) return 'king';
    if (scores.queen > scores.king) return 'queen';
    return 'neutral';
  }, [state.dailyScores]);

  return { state, addTask, toggleTask, spendCoins, reigningMonarch };
};


export default function App() {
  const { state, addTask, toggleTask, spendCoins, reigningMonarch } = useRoyalData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPigeonOpen, setIsPigeonOpen] = useState(false);

  return (
    <HashRouter>
      <Layout reigningMonarch={reigningMonarch} onOpenPigeon={() => setIsPigeonOpen(true)}>
        {/* Theme Banner */}
        {reigningMonarch !== 'neutral' && (
          <div className={`mb-8 p-4 rounded-lg text-center shadow-sm border ${reigningMonarch === 'king' ? 'bg-blue-100 border-blue-300 text-blue-900' : 'bg-pink-100 border-pink-300 text-pink-900'}`}>
            <p className="font-serif font-bold text-lg flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              {reigningMonarch === 'king' 
                ? "The King's diligence has won the day! The kingdom is draped in Royal Blue!" 
                : "Her Majesty, the Queen, reigns today! All the kingdom celebrates in Pink!"}
              <Crown className="w-5 h-5" />
            </p>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <Dashboard 
              tasks={state.tasks} 
              dailyScores={state.dailyScores} 
              onToggle={toggleTask} 
              onAddClick={() => setIsModalOpen(true)} 
            />
          } />
          <Route path="/treasury" element={
            <Treasury coins={state.coins} onSpend={spendCoins} />
          } />
          {/* Simple Calendar Placeholder for demo */}
          <Route path="/calendar" element={
            <div className="bg-white p-10 rounded-xl shadow-lg text-center">
              <Calendar className="w-16 h-16 text-gold mx-auto mb-4" />
              <h2 className="text-3xl font-serif text-charcoal mb-2">The Royal Calendar</h2>
              <p className="text-gray-500">The scribes are still charting the stars for this month.</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                 {['Today', 'Tomorrow', 'Next Week'].map(d => (
                   <div key={d} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-charcoal">{d}</h3>
                     <p className="text-xs text-gray-400 mt-1">No events scheduled</p>
                   </div>
                 ))}
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addTask} 
        />

        <CarrierPigeon 
          isOpen={isPigeonOpen} 
          onClose={() => setIsPigeonOpen(false)} 
        />

      </Layout>
    </HashRouter>
  );
}