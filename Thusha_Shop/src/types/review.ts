export interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  user?: string;
  created_at?: string;
}
