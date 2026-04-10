import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography, Box, Button, TextField,
  Tab, Tabs, Avatar, Chip, Card, CardContent, CardActions, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GavelIcon from '@mui/icons-material/Gavel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { addAuction } from '../store/slices/auctionSlice';

const CATEGORIES = ['Watches', 'Art', 'Electronics', 'Home & Decor', 'Sports', 'Music'];

export default function Dashboard() {
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const auctions = useSelector(s => s.auctions.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Electronics', startingPrice: '', image: '', hours: '' });

  if (!isAuthenticated) { navigate('/login'); return null; }

  const myBids = auctions.filter(a => a.bids.some(b => b.bidder === user.name));
  const myAuctions = auctions.filter(a => a.sellerId === user.id);
  const totalBidValue = myBids.reduce((sum, a) => {
    const myBid = a.bids.find(b => b.bidder === user.name);
    return sum + (myBid?.amount || 0);
  }, 0);

  const handleCreate = () => {
    if (!form.title || !form.startingPrice) return;
    dispatch(addAuction({
      id: Date.now(), title: form.title, description: form.description,
      category: form.category, startingPrice: Number(form.startingPrice),
      currentBid: Number(form.startingPrice), sellerId: user.id,
      image: form.image || `https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400`,
      endTime: Date.now() + Number(form.hours || 24) * 3600000,
      status: 'active', bids: [],
    }));
    setOpen(false);
    setForm({ title: '', description: '', category: 'Electronics', startingPrice: '', image: '', hours: '' });
  };

  const StatCard = ({ icon, label, value, color }) => (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
      <Box sx={{ color, mb: 1 }}>{icon}</Box>
      <Typography variant="h4" fontWeight={700}>{value}</Typography>
      <Typography color="text.secondary">{label}</Typography>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3, background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#ff6f00', width: 56, height: 56, fontSize: 24 }}>{user.avatar}</Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
                <Typography sx={{ opacity: 0.8 }}>{user.email}</Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
              sx={{ bgcolor: '#ff6f00', '&:hover': { bgcolor: '#e65100' } }}>
              Create Auction
            </Button>
          </Box>
        </Paper>

        {/* Stats */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<GavelIcon fontSize="large" />} label="Active Bids" value={myBids.length} color="#1a237e" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<TrendingUpIcon fontSize="large" />} label="My Auctions" value={myAuctions.length} color="#ff6f00" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard icon={<Typography variant="h5">$</Typography>} label="Total Bid Value" value={`$${totalBidValue.toLocaleString()}`} color="#2e7d32" />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tab label={`My Bids (${myBids.length})`} />
            <Tab label={`My Auctions (${myAuctions.length})`} />
          </Tabs>
          <Box p={3}>
            {tab === 0 && (
              <Grid container spacing={2}>
                {myBids.length === 0 ? (
                  <Grid item xs={12}><Typography color="text.secondary" textAlign="center" py={4}>No bids placed yet</Typography></Grid>
                ) : myBids.map(a => {
                  const myBid = a.bids.find(b => b.bidder === user.name);
                  const isWinning = a.bids[0]?.bidder === user.name;
                  return (
                    <Grid item xs={12} sm={6} key={a.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography fontWeight={600} noWrap>{a.title}</Typography>
                            <Chip label={isWinning ? 'Winning' : 'Outbid'} size="small" color={isWinning ? 'success' : 'error'} />
                          </Box>
                          <Typography color="text.secondary">Your bid: <strong>${myBid?.amount.toLocaleString()}</strong></Typography>
                          <Typography color="primary">Current: <strong>${a.currentBid.toLocaleString()}</strong></Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => navigate(`/auction/${a.id}`)}>View Auction</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
            {tab === 1 && (
              <Grid container spacing={2}>
                {myAuctions.length === 0 ? (
                  <Grid item xs={12}><Typography color="text.secondary" textAlign="center" py={4}>No auctions created yet</Typography></Grid>
                ) : myAuctions.map(a => (
                  <Grid item xs={12} sm={6} key={a.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography fontWeight={600} noWrap gutterBottom>{a.title}</Typography>
                        <Typography color="text.secondary">Current Bid: <strong>${a.currentBid.toLocaleString()}</strong></Typography>
                        <Typography color="text.secondary">Total Bids: <strong>{a.bids.length}</strong></Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => navigate(`/auction/${a.id}`)}>View</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Create Auction Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Auction</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextField label="Description" multiline rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <TextField select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} SelectProps={{ native: true }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </TextField>
          <TextField label="Starting Price ($)" type="number" required value={form.startingPrice} onChange={e => setForm({ ...form, startingPrice: e.target.value })} />
          <TextField label="Duration (hours)" type="number" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} placeholder="24" />
          <TextField label="Image URL (optional)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} sx={{ bgcolor: '#1a237e' }}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
