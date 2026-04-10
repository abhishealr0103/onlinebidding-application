import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box, LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useCountdown } from '../hooks/useCountdown';

export default function AuctionCard({ auction }) {
  const navigate = useNavigate();
  const timeLeft = useCountdown(auction.endTime);
  const isEnded = auction.status === 'ended' || Date.now() > auction.endTime;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
      <CardMedia component="img" height="200" image={auction.image} alt={auction.title} sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip label={auction.category} size="small" color="primary" variant="outlined" />
          <Chip label={isEnded ? 'Ended' : 'Live'} size="small" color={isEnded ? 'default' : 'success'} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>{auction.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {auction.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Current Bid</Typography>
            <Typography variant="h6" color="primary" fontWeight={700}>${auction.currentBid.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">Starting</Typography>
            <Typography variant="body2">${auction.startingPrice.toLocaleString()}</Typography>
          </Box>
        </Box>
        {!isEnded && (
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon fontSize="small" color="warning" />
            <Typography variant="caption" color="warning.main" fontWeight={600}>{timeLeft}</Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button fullWidth variant="contained" onClick={() => navigate(`/auction/${auction.id}`)}
          disabled={isEnded}
          sx={{ bgcolor: isEnded ? undefined : '#1a237e', '&:hover': { bgcolor: '#283593' } }}>
          {isEnded ? 'Auction Ended' : 'Place Bid'}
        </Button>
      </CardActions>
    </Card>
  );
}
