export default interface TRANSACTION_DATA {
  id: number;
  id_user: string;
  id_rental: number;
  id_payment: string | null;
  id_room: number;
  time_checkIn: Date;
  time_checkOut: Date;
  rent_time: number;
  status: TypeTransactionsStatus;
  total_prices: number;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
