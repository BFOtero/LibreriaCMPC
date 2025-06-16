export interface GenreResponse {
  success: boolean;
  data: Genre[];
  timestamp: Date;
}

export interface Genre {
  id: string;
  name: string;
  deletedAt?: string;
}
