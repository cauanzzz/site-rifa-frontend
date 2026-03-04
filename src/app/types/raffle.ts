export interface Raffle {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl: string;
  price: number;
  totalNumbers: number;
  soldNumbers: number[];
  status: 'active' | 'completed' | 'cancelled';
  drawDate: string;
  createdAt: string;
  winningNumber?: number;
}

export interface Purchase {
  id: string;
  raffleId: string;
  numbers: number[];
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  purchaseDate: string;
  totalAmount: number;
}
