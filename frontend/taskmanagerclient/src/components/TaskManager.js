
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar, Toolbar, Typography, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Checkbox, FormControl, InputLabel,
  Select, MenuItem, Grid, Modal, Box, Paper, Container
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Search, Logout } from '@mui/icons-material';
import { fetchTasks, addTask, updateTask, deleteTask } from '../slices/taskSlice';
import { logout } from '../slices/AuthSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const TaskManager = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  const error = useSelector(state => state.tasks.error);
  const navigate=useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: null, status: 'To Do' });
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);
  useEffect(() => {
        if (!isAuthenticated) {
          navigate(''); // Redirect to login page if not authenticated
        }
      }, [isAuthenticated, navigate]);
  useEffect(() => {
    const checkExpiredTasks = () => {
      const today = dayjs();
      const updatedTasks = tasks.map(task => {
        if (task.status !== 'Done' && task.status !== 'Expired' && dayjs(task.due_date).isBefore(today, 'day')) {
          return { ...task, status: 'Expired' };
        }
        return task;
      });

      const tasksToUpdate = updatedTasks.filter((task, index) => task !== tasks[index]);
      tasksToUpdate.forEach(task => dispatch(updateTask(task)));
    };

    checkExpiredTasks();
    // Set up an interval to check for expired tasks every hour
    const intervalId = setInterval(checkExpiredTasks, 3600000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      dispatch(addTask({
        ...newTask,
        due_date: newTask.due_date ? newTask.due_date.toISOString().split('T')[0] : null,
      }));
      setNewTask({ title: '', description: '', due_date: null, status: 'To Do' });
      setModalOpen(false);
      toast.success("Task added successfully");
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
    toast.error("Task deleted successfully");
  };

  const handleToggleComplete = (task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    dispatch(updateTask({ ...task, status: newStatus }));
    toast.info(`Task marked as ${newStatus}`);
  };

  const handleStartEditing = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      dispatch(updateTask(editingTask));
      setEditingTask(null);
      toast.success("Task updated successfully");
    }
  };

 
    const handleLogout = () => {
        dispatch(logout());
        toast.info("Logged out successfully");
        navigate('');
      };
  

  // Rest of the component remains the same...
  const sortedAndFilteredTasks = tasks
    .filter(task => {
      if (filterStatus === 'all') return true;
      return task.status === filterStatus;
    })
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      return a.title.localeCompare(b.title);
    });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <TextField 
            placeholder="Search tasks..." 
            variant="outlined" 
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
            }}
            sx={{ mr: 2, backgroundColor: 'white' }}
          />
          <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => setModalOpen(true)}
                style={{ marginBottom: '20px' }}
              >
                Add New Task
              </Button>
              <FormControl fullWidth style={{ marginBottom: '20px' }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <List>
              {sortedAndFilteredTasks.map(task => (
                <Paper elevation={2} style={{ margin: '10px 0', padding: '10px' }} key={task.id}>
                  <ListItem dense>
                    <Checkbox
                      checked={task.status === 'Done'}
                      onChange={() => handleToggleComplete(task)}
                      icon={<CheckCircle />}
                      checkedIcon={<CheckCircle color="primary" />}
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
                        secondary={`Due: ${task.due_date || 'Not set'} | Status: ${task.status}`}
                        style={{ textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}
                      />
                    )}
                    <ListItemSecondaryAction>
                      {editingTask && editingTask.id === task.id ? (
                        <Button onClick={handleSaveEdit}>Save</Button>
                      ) : (
                        <>
                          <IconButton edge="end" aria-label="edit" onClick={() => handleStartEditing(task)}>
                            <Edit />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Grid>
        </Grid>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="add-task-modal"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Add New Task
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Due Date"
                value={newTask.due_date}
                onChange={(newValue) => setNewTask({ ...newTask, due_date: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              style={{ marginTop: '20px' }}
            >
              Add Task
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default TaskManager;