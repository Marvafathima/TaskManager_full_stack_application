
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn,signUp } from '../slices/AuthSlice';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Box,
  Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username:''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      email: formData.email,
      password: formData.password,
      username:formData.username
    };

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match!");
        return;
      }
      const result= await dispatch(signUp(userData));
      if (signUp.fulfilled.match(result)){
        toast.success('User created and signed up successfully!');
        navigate('/home')
      }
    } else {
      const signinresult=await dispatch(signIn(userData));
      if (signIn.fulfilled.match(signinresult)){
        toast.success('Signed up successfully!');
        navigate('/home')
      }
    }
  };
  // const handleSubmit = async (formData) => {
  //   if (isSignUp) {
  //     if (formData.password !== formData.confirmPassword) {
  //       toast.error("Passwords don't match!");
  //       return;
  //     }
  //     const result = await dispatch(signUp(formData));
  //     if (signUp.fulfilled.match(result)) {
  //       toast.success('Signed up successfully!');
  //       navigate('/home');
  //     } else if (signUp.rejected.match(result)) {
  //       toast.error(result.payload?.error || 'Sign up failed');
  //     }
  //   } else {
  //     const signinResult = await dispatch(signIn(formData));
  //     if (signIn.fulfilled.match(signinResult)) {
  //       toast.success('Logged in successfully!');
  //       navigate('/home');
  //     } else if (signIn.rejected.match(signinResult)) {
  //       toast.error(signinResult.payload?.error || 'Login failed');
  //     }
  //   }
  // };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h5">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            {isSignUp && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={toggleMode}>
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthForm;