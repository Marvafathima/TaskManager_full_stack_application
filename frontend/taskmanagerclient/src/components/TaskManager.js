
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   Container, Typography, TextField, Button, List, ListItem, ListItemText,
//   ListItemSecondaryAction, IconButton, Checkbox, FormControl, InputLabel,
//   Select, MenuItem, Grid,
// } from '@mui/material';
// import { Add, Edit, Delete } from '@mui/icons-material';
// import { fetchTasks, addTask, updateTask, deleteTask } from '../slices/taskSlice'

// const TaskManager = () => {
//   const dispatch = useDispatch();
//   const tasks = useSelector(state => state.tasks.tasks);
//   const status = useSelector(state => state.tasks.status);
//   const error = useSelector(state => state.tasks.error);

//   const [newTask, setNewTask] = useState('');
//   const [editingTask, setEditingTask] = useState(null);
//   const [sortBy, setSortBy] = useState('dueDate');
//   const [filterStatus, setFilterStatus] = useState('all');

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchTasks());
//     }
//   }, [status, dispatch]);

//   const handleAddTask = () => {
//     if (newTask.trim()) {
//       dispatch(addTask({
//         title: newTask,
//         dueDate: new Date().toISOString().split('T')[0],
//         completed: false,
//       }));
//       setNewTask('');
//     }
//   };

//   const handleDeleteTask = (id) => {
//     dispatch(deleteTask(id));
//   };

//   const handleToggleComplete = (task) => {
//     dispatch(updateTask({ ...task, completed: !task.completed }));
//   };

//   const handleStartEditing = (task) => {
//     setEditingTask({ ...task });
//   };

//   const handleSaveEdit = () => {
//     if (editingTask) {
//       dispatch(updateTask(editingTask));
//       setEditingTask(null);
//     }
//   };

//   const sortedAndFilteredTasks = tasks
//     .filter(task => {
//       if (filterStatus === 'all') return true;
//       return filterStatus === 'completed' ? task.completed : !task.completed;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'dueDate') {
//         return new Date(a.dueDate) - new Date(b.dueDate);
//       }
//       return a.title.localeCompare(b.title);
//     });

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" component="h1" gutterBottom>
//         Task Manager
//       </Typography>
      
//       <Grid container spacing={2} alignItems="center">
//         <Grid item xs={12} sm={8}>
//           <TextField
//             fullWidth
//             label="New Task"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             startIcon={<Add />}
//             onClick={handleAddTask}
//           >
//             Add Task
//           </Button>
//         </Grid>
//       </Grid>

//       <Grid container spacing={2} style={{ marginTop: '20px' }}>
//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Sort By</InputLabel>
//             <Select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <MenuItem value="dueDate">Due Date</MenuItem>
//               <MenuItem value="title">Title</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={6}>
//           <FormControl fullWidth>
//             <InputLabel>Filter</InputLabel>
//             <Select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="completed">Completed</MenuItem>
//               <MenuItem value="incomplete">Incomplete</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       <List>
//         {sortedAndFilteredTasks.map(task => (
//           <ListItem key={task.id} dense button>
//             <Checkbox
//               checked={task.completed}
//               onChange={() => handleToggleComplete(task)}
//             />
//             {editingTask && editingTask.id === task.id ? (
//               <TextField
//                 fullWidth
//                 value={editingTask.title}
//                 onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
//               />
//             ) : (
//               <ListItemText
//                 primary={task.title}
//                 secondary={`Due: ${task.dueDate}`}
//                 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
//               />
//             )}
//             <ListItemSecondaryAction>
//               {editingTask && editingTask.id === task.id ? (
//                 <Button onClick={handleSaveEdit}>Save</Button>
//               ) : (
//                 <>
//                   <IconButton edge="end" aria-label="edit" onClick={() => handleStartEditing(task)}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
//                     <Delete />
//                   </IconButton>
//                 </>
//               )}
//             </ListItemSecondaryAction>
//           </ListItem>
//         ))}
//       </List>
//     </Container>
//   );
// };

// export default TaskManager;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Checkbox, FormControl, InputLabel,
  Select, MenuItem, Grid, Modal, Box, Paper
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle } from '@mui/icons-material';
import { fetchTasks, addTask, updateTask, deleteTask } from '../slices/taskSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
 import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';

const TaskManager = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  const error = useSelector(state => state.tasks.error);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: null });
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      dispatch(addTask({
        ...newTask,
        due_date: newTask.due_date ? newTask.due_date.toISOString().split('T')[0] : null,
        completed: false,
      }));
      setNewTask({ title: '', description: '', due_date: null });
      setModalOpen(false);
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleToggleComplete = (task) => {
    dispatch(updateTask({ ...task, completed: !task.completed }));
  };

  const handleStartEditing = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      dispatch(updateTask(editingTask));
      setEditingTask(null);
    }
  };

  const sortedAndFilteredTasks = tasks
    .filter(task => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'completed' ? task.completed : !task.completed;
    })
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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Task Manager
      </Typography>
      
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
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="incomplete">Incomplete</MenuItem>
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
                    checked={task.completed}
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
                      secondary={`Due: ${task.due_date || 'Not set'}`}
                      style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
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
  );
};

export default TaskManager;