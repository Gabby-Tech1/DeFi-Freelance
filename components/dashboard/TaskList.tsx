"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete DeFi Protocol Frontend',
      deadline: new Date('2024-03-20'),
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Review Smart Contract Tests',
      deadline: new Date('2024-03-22'),
      priority: 'medium',
      completed: false,
    },
    {
      id: '3',
      title: 'Submit Project Documentation',
      deadline: new Date('2024-03-25'),
      priority: 'low',
      completed: true,
    },
  ]);

  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          completed: false,
        },
      ]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <AnimatePresence>
        {tasks.map(task => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`flex items-center justify-between p-4 rounded-lg ${
              task.completed ? 'bg-gray-50' : 'bg-white'
            } border border-gray-200`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  task.completed
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}
              >
                {task.completed && (
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                )}
              </button>
              <div>
                <p className={`font-medium ${
                  task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500">
                  Due: {task.deadline.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 