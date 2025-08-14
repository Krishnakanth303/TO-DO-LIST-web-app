import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, Clock, AlertCircle, GripVertical, Flag, User } from 'lucide-react';
import { Task } from '../lib/supabase';
import { useTasks } from '../hooks/useTasks';
import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  viewType?: 'list' | 'grid';
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, viewType = 'list' }) => {
  const { updateTask, deleteTask } = useTasks();

  const handleToggleComplete = () => {
    updateTask.mutate({
      id: task.id,
      completed: !task.completed,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(task.id);
    }
  };

  const getDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getDateColor = (dateString: string) => {
    const date = new Date(dateString);
    if (isPast(date) && !task.completed) return 'text-red-600';
    if (isToday(date)) return 'text-orange-600';
    if (isTomorrow(date)) return 'text-blue-600';
    return 'text-gray-500';
  };

  const isOverdue = task.due_date && !task.completed && isPast(new Date(task.due_date));

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '🔴',
          gradient: 'from-red-500 to-red-600',
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '🟡',
          gradient: 'from-yellow-500 to-yellow-600',
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '🟢',
          gradient: 'from-green-500 to-green-600',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '⚪',
          gradient: 'from-gray-500 to-gray-600',
        };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  const cardClasses = `
    group bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border-2 transition-all duration-300 
    hover:shadow-lg hover:scale-[1.02] hover:bg-white/90
    ${task.completed ? 'opacity-75' : ''} 
    ${isOverdue ? 'border-red-200 bg-red-50/50' : 'border-gray-200 hover:border-indigo-300'}
    ${viewType === 'grid' ? 'h-full' : ''}
  `;

  return (
    <motion.div
      layout
      className={cardClasses}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-${viewType === 'grid' ? '5' : '4'}`}>
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleComplete}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
              task.completed
                ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white shadow-lg'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                ✓
              </motion.div>
            )}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold transition-all duration-200 ${
                  task.completed 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-900 group-hover:text-indigo-700'
                } ${viewType === 'grid' ? 'text-base' : 'text-lg'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mt-1 transition-all duration-200 line-clamp-2 ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {/* Priority */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
                <Flag className="h-3 w-3" />
                <span className="capitalize">{task.priority}</span>
              </div>

              {/* Due Date */}
              {task.due_date && (
                <div className={`flex items-center gap-1 text-xs font-medium ${getDateColor(task.due_date)}`}>
                  {isOverdue ? (
                    <AlertCircle className="h-3 w-3" />
                  ) : (
                    <Calendar className="h-3 w-3" />
                  )}
                  <span>{getDateDisplay(task.due_date)}</span>
                  {isOverdue && (
                    <span className="text-red-600 font-semibold">(Overdue)</span>
                  )}
                </div>
              )}

              {/* Created Time */}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            {/* Progress Bar for Grid View */}
            {viewType === 'grid' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: task.completed ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      task.completed ? 'from-green-500 to-green-600' : priorityConfig.gradient
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};