import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, Flag, Save, Sparkles, Clock, Target } from 'lucide-react';
import { Task } from '../lib/supabase';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  due_date: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task | null;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { createTask, updateTask } = useTasks();
  const isEditing = !!task;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      due_date: task?.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : '',
      priority: task?.priority || 'medium',
    },
  });

  const watchedPriority = watch('priority');
  const watchedTitle = watch('title');

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing) {
        await updateTask.mutateAsync({
          id: task.id,
          title: data.title,
          description: data.description || null,
          due_date: data.due_date || null,
          priority: data.priority,
        });
      } else {
        await createTask.mutateAsync({
          title: data.title,
          description: data.description || null,
          due_date: data.due_date || null,
          priority: data.priority,
          completed: false,
          order_index: 0,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'from-red-500 to-red-600',
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: '🔴',
        };
      case 'medium':
        return {
          color: 'from-yellow-500 to-yellow-600',
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: '🟡',
        };
      case 'low':
        return {
          color: 'from-green-500 to-green-600',
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: '🟢',
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: '⚪',
        };
    }
  };

  const priorityConfig = getPriorityConfig(watchedPriority);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${priorityConfig.color}`}>
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing ? 'Update your task details' : 'Add a new task to your list'}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                Task Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('title')}
                  type="text"
                  id="title"
                  placeholder="What needs to be done?"
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-xs text-gray-400">
                    {watchedTitle?.length || 0}/100
                  </span>
                </div>
              </div>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600 flex items-center gap-1"
                >
                  <span>⚠️</span>
                  {errors.title.message}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                Description (Optional)
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                placeholder="Add more details about your task..."
                className="block w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.description.message}
                </motion.p>
              )}
            </div>

            {/* Due Date and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 mb-3">
                  Due Date (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('due_date')}
                    type="date"
                    id="due_date"
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-3">
                  Priority Level
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Flag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register('priority')}
                    id="priority"
                    className={`block w-full pl-12 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none ${priorityConfig.border} ${priorityConfig.bg}`}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Priority Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl border-2 ${priorityConfig.border} ${priorityConfig.bg}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${priorityConfig.color}`}>
                  <Flag className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className={`font-medium ${priorityConfig.text}`}>
                    {watchedPriority.charAt(0).toUpperCase() + watchedPriority.slice(1)} Priority Task
                  </p>
                  <p className="text-sm text-gray-600">
                    {watchedPriority === 'high' && 'This task requires immediate attention'}
                    {watchedPriority === 'medium' && 'This task should be completed soon'}
                    {watchedPriority === 'low' && 'This task can be completed when convenient'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 text-gray-700 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={createTask.isPending || updateTask.isPending}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createTask.isPending || updateTask.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{isEditing ? 'Update Task' : 'Create Task'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};