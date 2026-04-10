import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem,
  IconButton, Box, Chip,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}>
      <Toolbar>
        <GavelIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          BidZone
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">Auctions</Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Chip
                avatar={<Avatar sx={{ bgcolor: '#ff6f00' }}>{user.avatar}</Avatar>}
                label={user.name.split(' ')[0]}
                onClick={e => setAnchor(e.currentTarget)}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                variant="outlined"
              />
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                <MenuItem onClick={() => { setAnchor(null); navigate('/dashboard'); }}>My Dashboard</MenuItem>
                <MenuItem onClick={() => { dispatch(logout()); setAnchor(null); navigate('/'); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button variant="contained" sx={{ bgcolor: '#ff6f00', '&:hover': { bgcolor: '#e65100' } }} component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
