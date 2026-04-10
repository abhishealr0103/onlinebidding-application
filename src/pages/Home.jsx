import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Typography, TextField, Box, ToggleButton, ToggleButtonGroup, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AuctionCard from '../components/AuctionCard';

const CATEGORIES = ['All', 'Watches', 'Art', 'Electronics', 'Home & Decor', 'Sports', 'Music'];

export default function Home() {
  const auctions = useSelector(s => s.auctions.items);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState('all');

  const filtered = auctions.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    const isEnded = Date.now() > a.endTime;
    const matchFilter = filter === 'all' || (filter === 'active' && !isEnded) || (filter === 'ended' && isEnded);
    return matchSearch && matchCat && matchFilter;
  });

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', color: 'white', py: 8, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>Find & Win Amazing Auctions</Typography>
        <Typography variant="h6" sx={{ opacity: 0.85, mb: 4 }}>Bid on exclusive items from around the world</Typography>
        <TextField
          placeholder="Search auctions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ bgcolor: 'white', borderRadius: 2, width: { xs: '90%', sm: 500 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
          <ToggleButtonGroup value={category} exclusive onChange={(_, v) => v && setCategory(v)} size="small">
            {CATEGORIES.map(c => <ToggleButton key={c} value={c}>{c}</ToggleButton>)}
          </ToggleButtonGroup>
          <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="active">Live</ToggleButton>
            <ToggleButton value="ended">Ended</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" mb={2}>{filtered.length} auctions found</Typography>

        <Grid container spacing={3}>
          {filtered.map(auction => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={auction.id}>
              <AuctionCard auction={auction} />
            </Grid>
          ))}
          {filtered.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">No auctions found</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}
