export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_color: string;
  created_at: string;
}

export interface Note {
  id: string;
  owner: number;
  owner_name: string;
  title: string;
  content: string;
  tags: string;
  is_public: boolean;
  collaborators: number[];
  collaborator_count: number;
  created_at: string;
  updated_at: string;
}

export interface ActiveUser {
  user_id: number;
  username: string;
  color: string;
  position?: number;
}
