import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Checkbox, FormControl, InputLabel,
  Select, MenuItem, Grid, Paper
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const initialTasks = [
  { id: 1, title: 'Complete project proposal', dueDate: '2024-10-15', completed: false },
  { id: 2, title: 'Review team performance', dueDate: '2024-10-20', completed: true },
  { id: 3, title: 'Prepare presentation', dueDate: '2024-10-25', completed: false },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const sortedAndFilteredTasks = tasks
    .filter(task => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'completed' ? task.completed : !task.completed;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return a.title.localeCompare(b.title);
    });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Task Manager
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={addTask}
          >
            Add Task
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="incomplete">Incomplete</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <List>
        {sortedAndFilteredTasks.map(task => (
          <ListItem key={task.id} dense button>
            <Checkbox
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            {editingTask && editingTask.id === task.id ? (
              <TextField
                fullWidth
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              />
            ) : (
              <ListItemText
                primary={task.title}
                secondary={`Due: ${task.dueDate}`}
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
              />
            )}
            <ListItemSecondaryAction>
              {editingTask && editingTask.id === task.id ? (
                <Button onClick={saveEdit}>Save</Button>
              ) : (
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => startEditing(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                    <Delete />
                  </IconButton>
                </>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TaskManager;