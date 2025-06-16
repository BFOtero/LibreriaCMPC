export interface PublisherResponse {
  success: boolean;
  data: Publisher[];
  timestamp: Date;
}

export interface Publisher {
  id: string;
  name: string;
  deletedAt?: string;
}
