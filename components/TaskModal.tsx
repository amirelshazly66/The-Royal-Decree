import React, { useState } from 'react';
import { X, Calendar as CalIcon } from 'lucide-react';
import { Task, Role, TaskType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState<Role | 'shared'>('shared');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let type: TaskType = 'quest';
    if (assignedTo === 'king') type = 'decree';
    if (assignedTo === 'queen') type = 'edict';

    const newTask: Task = {
      id: Date.now().toString(), // Simple ID
      title,
      description: desc,
      type,
      assignedTo,
      dueDate,
      completed: false
    };

    onAdd(newTask);
    setTitle('');
    setDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-parchment p-4 border-b border-gold flex justify-between items-center">
          <h3 className="font-serif text-xl font-bold text-charcoal">Draft New Proclamation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Task Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Slay the Dust Bunnies"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Details (Optional)</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 h-20 focus:ring-2 focus:ring-gold focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Assign To</label>
               <select 
                  value={assignedTo} 
                  onChange={(e) => setAssignedTo(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-gold outline-none bg-white"
                >
                 <option value="king">The King</option>
                 <option value="queen">The Queen</option>
                 <option value="shared">Royal Quest (Shared)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
               <div className="relative">
                 <input 
                    type="date" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 pl-8 focus:ring-2 focus:ring-gold outline-none"
                 />
                 <CalIcon className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
               </div>
             </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-gold hover:bg-goldDark text-white font-serif font-bold py-3 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2">
              <span>Seal & Publish</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};