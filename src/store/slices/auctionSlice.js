import { createSlice } from '@reduxjs/toolkit';

const now = Date.now();
const hour = 3600000;

const initialAuctions = [
  {
    id: 1, title: 'Vintage Rolex Submariner', category: 'Watches',
    description: 'A rare 1965 Rolex Submariner in excellent condition with original box and papers.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400',
    startingPrice: 5000, currentBid: 7200, sellerId: 2,
    endTime: now + 2 * hour, status: 'active', bids: [],
  },
  {
    id: 2, title: 'Abstract Oil Painting', category: 'Art',
    description: 'Original abstract oil painting by emerging artist. 24x36 inches on canvas.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    startingPrice: 800, currentBid: 1150, sellerId: 1,
    endTime: now + 5 * hour, status: 'active', bids: [],
  },
  {
    id: 3, title: 'MacBook Pro M3 Max', category: 'Electronics',
    description: 'Brand new MacBook Pro 16" M3 Max, 64GB RAM, 2TB SSD. Sealed box.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    startingPrice: 2500, currentBid: 3100, sellerId: 2,
    endTime: now + 1 * hour, status: 'active', bids: [],
  },
  {
    id: 4, title: 'Antique Persian Rug', category: 'Home & Decor',
    description: 'Hand-knotted Persian rug from the 1920s. 8x10 ft, excellent condition.',
    image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400',
    startingPrice: 1200, currentBid: 1800, sellerId: 1,
    endTime: now + 8 * hour, status: 'active', bids: [],
  },
  {
    id: 5, title: 'Signed Michael Jordan Jersey', category: 'Sports',
    description: 'Authentic signed Chicago Bulls jersey with COA. Framed and ready to display.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    startingPrice: 3000, currentBid: 4500, sellerId: 2,
    endTime: now + 12 * hour, status: 'active', bids: [],
  },
  {
    id: 6, title: 'Vintage Gibson Les Paul', category: 'Music',
    description: '1959 Gibson Les Paul Standard. All original parts, stunning flame top.',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400',
    startingPrice: 15000, currentBid: 22000, sellerId: 1,
    endTime: now - 1 * hour, status: 'ended', bids: [],
  },
];

const auctionSlice = createSlice({
  name: 'auctions',
  initialState: { items: initialAuctions, selectedId: null },
  reducers: {
    selectAuction(state, action) {
      state.selectedId = action.payload;
    },
    placeBid(state, action) {
      const { auctionId, bid } = action.payload;
      const auction = state.items.find(a => a.id === auctionId);
      if (auction) {
        auction.currentBid = bid.amount;
        auction.bids.unshift(bid);
      }
    },
    addAuction(state, action) {
      state.items.unshift(action.payload);
    },
  },
});

export const { selectAuction, placeBid, addAuction } = auctionSlice.actions;
export default auctionSlice.reducer;
