export interface AuthorResponse {
  success: boolean;
  data: Author[];
  timestamp: Date;
}

export interface Author {
  id: string;
  name: string;
  deletedAt?: string;
}
