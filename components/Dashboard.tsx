import React from 'react';
import { Task, DailyScore, Role } from '../types';
import { Crown, Sword, Scroll, CheckCircle2, Circle, Plus } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  dailyScores: Record<string, DailyScore>;
  onToggle: (id: string) => void;
  onAddClick: () => void;
}

const TODAY_KEY = new Date().toISOString().split('T')[0];

export const Dashboard: React.FC<DashboardProps> = ({ tasks, dailyScores, onToggle, onAddClick }) => {
  const todayScore = dailyScores[TODAY_KEY] || { king: 0, queen: 0 };
  
  const filterTasks = (role: Role | 'shared') => {
    return tasks.filter(t => {
      const isToday = t.dueDate === TODAY_KEY;
      // For completed tasks, show them if completed today, otherwise hide old completed ones
      const relevantDate = t.completed && t.completedAt 
        ? t.completedAt.startsWith(TODAY_KEY)
        : isToday;
      
      return t.assignedTo === role && relevantDate;
    });
  };

  return (
    <div className="space-y-8">
      {/* Scoreboard */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gold relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-king via-gold to-queen"></div>
        <div className="text-center mb-4">
           <h2 className="font-serif text-2xl text-charcoal font-bold tracking-widest uppercase">Daily Reign</h2>
        </div>
        <div className="flex justify-center items-center gap-12">
          <div className={`text-center transition-transform ${todayScore.king > todayScore.queen ? 'scale-110' : 'scale-100'}`}>
             <div className="flex flex-col items-center">
                <Crown className={`w-8 h-8 mb-2 ${todayScore.king >= todayScore.queen ? 'text-king fill-king' : 'text-gray-300'}`} />
                <span className={`text-4xl font-serif font-black ${todayScore.king > todayScore.queen ? 'text-king' : 'text-gray-400'}`}>
                  {todayScore.king}
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">The King</span>
             </div>
          </div>

          <div className="h-16 w-px bg-gray-200"></div>

          <div className={`text-center transition-transform ${todayScore.queen > todayScore.king ? 'scale-110' : 'scale-100'}`}>
             <div className="flex flex-col items-center">
                <Crown className={`w-8 h-8 mb-2 ${todayScore.queen >= todayScore.king ? 'text-queen fill-queen' : 'text-gray-300'}`} />
                <span className={`text-4xl font-serif font-black ${todayScore.queen > todayScore.king ? 'text-queen' : 'text-gray-400'}`}>
                  {todayScore.queen}
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">The Queen</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* King's Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-t-xl p-4 border-b-4 border-king shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Crown className="text-king w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-charcoal">His Majesty's Decrees</h3>
            </div>
          </div>
          <div className="flex-1 bg-white/50 rounded-b-xl min-h-[400px] p-4 space-y-3">
             {filterTasks('king').map(task => (
               <TaskCard key={task.id} task={task} onToggle={() => onToggle(task.id)} />
             ))}
             {filterTasks('king').length === 0 && <EmptyState type="king" />}
          </div>
        </div>

        {/* Shared / Quests Column (Center) */}
        <div className="flex flex-col gap-4">
           <div className="bg-white rounded-t-xl p-4 border-b-4 border-gold shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sword className="text-gold w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-charcoal">Royal Quests</h3>
            </div>
          </div>
          <div className="flex-1 bg-white/50 rounded-b-xl min-h-[400px] p-4 space-y-3">
             {filterTasks('shared').map(task => (
               <TaskCard key={task.id} task={task} onToggle={() => onToggle(task.id)} />
             ))}
             <button 
                onClick={onAddClick}
                className="w-full py-3 border-2 border-dashed border-gold/50 rounded-lg text-goldDark hover:bg-gold/10 hover:border-gold transition-all flex items-center justify-center gap-2 group"
             >
               <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
               <span className="font-serif font-bold">Add New Task</span>
             </button>
          </div>
        </div>

        {/* Queen's Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-t-xl p-4 border-b-4 border-queen shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Crown className="text-queen w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-charcoal">Her Majesty's Edicts</h3>
            </div>
          </div>
           <div className="flex-1 bg-white/50 rounded-b-xl min-h-[400px] p-4 space-y-3">
             {filterTasks('queen').map(task => (
               <TaskCard key={task.id} task={task} onToggle={() => onToggle(task.id)} />
             ))}
             {filterTasks('queen').length === 0 && <EmptyState type="queen" />}
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: Task; onToggle: () => void }> = ({ task, onToggle }) => {
  const getBorderColor = () => {
    if (task.completed) return 'border-gold bg-yellow-50 opacity-75';
    if (task.assignedTo === 'king') return 'border-l-4 border-l-king bg-white';
    if (task.assignedTo === 'queen') return 'border-l-4 border-l-queen bg-white';
    return 'border-l-4 border-l-gold bg-white';
  };

  return (
    <div 
      className={`p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 ${getBorderColor()} flex items-start gap-3 group`}
    >
      <button 
        onClick={onToggle}
        className="mt-1 focus:outline-none transition-colors"
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-gold animate-bounce-slight" />
        ) : (
          <Circle className={`w-6 h-6 text-gray-300 group-hover:text-gray-400`} />
        )}
      </button>
      <div className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-charcoal'}`}>
        <h4 className="font-medium leading-tight">{task.title}</h4>
        {task.description && <p className="text-xs text-gray-500 mt-1">{task.description}</p>}
      </div>
      {task.type === 'quest' && <Sword className="w-4 h-4 text-gold opacity-50" />}
      {task.type === 'decree' && <Scroll className="w-4 h-4 text-king opacity-50" />}
      {task.type === 'edict' && <Scroll className="w-4 h-4 text-queen opacity-50" />}
    </div>
  );
};

const EmptyState: React.FC<{ type: 'king' | 'queen' }> = ({ type }) => (
  <div className="text-center py-10 opacity-50">
    <Scroll className="w-12 h-12 mx-auto mb-2 text-gray-300" />
    <p className="font-serif text-sm text-gray-400">
      {type === 'king' ? "The King rests." : "The Queen is at leisure."}
    </p>
  </div>
);