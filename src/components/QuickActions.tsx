import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, Calendar, Filter, Search } from 'lucide-react';

interface QuickActionsProps {
  onCreateTask: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onCreateTask }) => {
  const quickActions = [
    {
      title: 'New Task',
      description: 'Create a new task',
      icon: Plus,
      color: 'from-indigo-500 to-indigo-600',
      action: onCreateTask,
    },
    {
      title: 'Quick Add',
      description: 'Add with AI assist',
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        // Future AI integration
        onCreateTask();
      },
    },
    {
      title: 'Schedule',
      description: 'Plan your day',
      icon: Calendar,
      color: 'from-cyan-500 to-cyan-600',
      action: () => {
        // Future calendar integration
        onCreateTask();
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r hover:shadow-md transition-all duration-200 group"
            style={{
              background: `linear-gradient(135deg, ${action.color.split(' ')[0].replace('from-', '')} 0%, ${action.color.split(' ')[1].replace('to-', '')} 100%)`,
            }}
          >
            <div className="p-2 bg-white/20 rounded-lg">
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-white">{action.title}</p>
              <p className="text-sm text-white/80">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Additional Features */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Tools</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
            <Search className="h-4 w-4" />
            Search
          </button>
          <button className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>
    </motion.div>
  );
};