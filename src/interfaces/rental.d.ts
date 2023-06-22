export default interface RENTAL_DATA {
  id?: number;
  name: string;
  description: string;
  rental_logo?: string | null;
  rental_images?: string;
  address: string;
  id_owner: string;
  latitude: number;
  longitude: number;
  total_rating?: number;
  total_transaction?: number;
}
