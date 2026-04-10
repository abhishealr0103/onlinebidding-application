import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Grid, Box, Typography, Button, TextField, Paper, Chip,
  Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Alert,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { placeBid } from '../store/slices/auctionSlice';
import { useCountdown } from '../hooks/useCountdown';

export default function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auction = useSelector(s => s.auctions.items.find(a => a.id === Number(id)));
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState(null);
  const timeLeft = useCountdown(auction?.endTime);

  if (!auction) return <Box textAlign="center" py={10}><Typography>Auction not found</Typography></Box>;

  const isEnded = Date.now() > auction.endTime;
  const minBid = auction.currentBid + 1;

  const handleBid = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const amount = Number(bidAmount);
    if (amount < minBid) {
      setMessage({ type: 'error', text: `Bid must be at least $${minBid.toLocaleString()}` });
      return;
    }
    dispatch(placeBid({
      auctionId: auction.id,
      bid: { amount, bidder: user.name, avatar: user.avatar, time: new Date().toLocaleTimeString() },
    }));
    setMessage({ type: 'success', text: `Bid of $${amount.toLocaleString()} placed successfully!` });
    setBidAmount('');
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>Back to Auctions</Button>
        <Grid container spacing={4}>
          {/* Left */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box component="img" src={auction.image} alt={auction.title} sx={{ width: '100%', height: 400, objectFit: 'cover' }} />
              <Box p={3}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={auction.category} color="primary" variant="outlined" />
                  <Chip label={isEnded ? 'Ended' : 'Live'} color={isEnded ? 'default' : 'success'} />
                </Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>{auction.title}</Typography>
                <Typography color="text.secondary">{auction.description}</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ borderRadius: 3, p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Auction Details</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Current Bid</Typography>
                  <Typography variant="h4" color="primary" fontWeight={700}>${auction.currentBid.toLocaleString()}</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">Starting Price</Typography>
                  <Typography variant="h6">${auction.startingPrice.toLocaleString()}</Typography>
                </Box>
              </Box>
              <Box sx={{ bgcolor: '#fff3e0', borderRadius: 2, p: 2, mb: 3, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Time Remaining</Typography>
                <Typography variant="h5" color="warning.main" fontWeight={700}>{timeLeft}</Typography>
              </Box>

              {!isEnded && (
                <>
                  {message && <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>{message.text}</Alert>}
                  <TextField
                    fullWidth label={`Minimum bid: $${minBid.toLocaleString()}`}
                    type="number" value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    sx={{ mb: 2 }} inputProps={{ min: minBid }}
                  />
                  <Button fullWidth variant="contained" size="large" startIcon={<GavelIcon />}
                    onClick={handleBid}
                    sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#283593' }, py: 1.5 }}>
                    {isAuthenticated ? 'Place Bid' : 'Login to Bid'}
                  </Button>
                </>
              )}
            </Paper>

            {/* Bid History */}
            <Paper elevation={2} sx={{ borderRadius: 3, p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Bid History ({auction.bids.length})</Typography>
              {auction.bids.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={2}>No bids yet. Be the first!</Typography>
              ) : (
                <List dense>
                  {auction.bids.map((bid, i) => (
                    <Box key={i}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#1a237e', width: 32, height: 32, fontSize: 14 }}>{bid.avatar}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={bid.bidder} secondary={bid.time} />
                        <Typography fontWeight={700} color="primary">${bid.amount.toLocaleString()}</Typography>
                      </ListItem>
                      {i < auction.bids.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
