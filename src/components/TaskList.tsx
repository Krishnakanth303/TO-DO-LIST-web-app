import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Calendar, Clock, AlertCircle, CheckCircle2, Grid, List, SortAsc } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { TaskItem } from './TaskItem';
import { Task } from '../lib/supabase';
import { isPast } from 'date-fns';

type FilterType = 'all' | 'active' | 'completed' | 'overdue' | 'today' | 'high-priority';
type ViewType = 'list' | 'grid';
type SortType = 'created' | 'due_date' | 'priority' | 'alphabetical';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onCreateTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask, onCreateTask }) => {
  const { tasks, isLoading, reorderTasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [sortBy, setSortBy] = useState<SortType>('created');

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task => 
          !task.completed && task.due_date && isPast(new Date(task.due_date))
        );
        break;
      case 'today':
        filtered = filtered.filter(task => 
          task.due_date && new Date(task.due_date).toDateString() === new Date().toDateString()
        );
        break;
      case 'high-priority':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      default:
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'created':
        default:
          return a.order_index - b.order_index;
      }
    });

    return filtered;
  }, [tasks, searchTerm, filter, sortBy]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    reorderTasks.mutate(reorderedTasks);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => !t.completed && t.due_date && isPast(new Date(t.due_date))).length;
    const today = tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === new Date().toDateString()).length;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    return { total, completed, overdue, active: total - completed, today, highPriority };
  };

  const stats = getTaskStats();

  const filterButtons = [
    { key: 'all', label: 'All Tasks', count: stats.total, icon: Calendar, color: 'text-gray-600' },
    { key: 'active', label: 'Active', count: stats.active, icon: Clock, color: 'text-blue-600' },
    { key: 'completed', label: 'Completed', count: stats.completed, icon: CheckCircle2, color: 'text-green-600' },
    { key: 'overdue', label: 'Overdue', count: stats.overdue, icon: AlertCircle, color: 'text-red-600' },
    { key: 'today', label: 'Due Today', count: stats.today, icon: Calendar, color: 'text-orange-600' },
    { key: 'high-priority', label: 'High Priority', count: stats.highPriority, icon: AlertCircle, color: 'text-purple-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Task Management</h2>
            <p className="text-gray-600">
              {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'} 
              {filter !== 'all' && ` in ${filterButtons.find(f => f.key === filter)?.label.toLowerCase()}`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewType === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewType === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-3 py-2 bg-gray-100 border-0 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="created">Sort by Created</option>
              <option value="due_date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateTask}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filter Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filterButtons.map(({ key, label, count, icon: Icon, color }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(key as FilterType)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === key
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'bg-white/50 text-gray-700 hover:bg-white/80'
              }`}
            >
              <Icon className={`h-4 w-4 ${filter === key ? 'text-white' : color}`} />
              <span className="text-sm">{label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                filter === key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="p-6">
        {filteredAndSortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium text-gray-500">
                {searchTerm || filter !== 'all' ? 'No tasks found' : 'No tasks yet'}
              </p>
              <p className="text-sm mt-2 text-gray-400">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Create your first task to get started on your productivity journey'
                }
              </p>
            </div>
            {!searchTerm && filter === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCreateTask}
                className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Create Your First Task
              </motion.button>
            )}
          </motion.div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={viewType === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                    : 'space-y-3'
                  }
                >
                  <AnimatePresence>
                    {filteredAndSortedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className={`${
                              snapshot.isDragging ? 'rotate-1 scale-105 shadow-2xl' : ''
                            } transition-transform duration-200`}
                          >
                            <TaskItem
                              task={task}
                              onEdit={() => onEditTask(task)}
                              viewType={viewType}
                            />
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </motion.div>
  );
};