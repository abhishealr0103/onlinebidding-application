import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { login, clearError } from '../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  if (isAuthenticated) { navigate('/'); return null; }

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <GavelIcon sx={{ fontSize: 48, color: '#1a237e' }} />
          <Typography variant="h5" fontWeight={700}>Welcome Back</Typography>
          <Typography color="text.secondary">Sign in to BidZone</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#283593' } }}>
            Sign In
          </Button>
        </Box>
        <Typography textAlign="center" mt={2} variant="body2">
          Don't have an account? <Link to="/register" style={{ color: '#1a237e' }}>Register</Link>
        </Typography>
        <Box mt={2} p={2} bgcolor="#e8eaf6" borderRadius={2}>
          <Typography variant="caption" color="text.secondary">Demo: alice@example.com / password123</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
