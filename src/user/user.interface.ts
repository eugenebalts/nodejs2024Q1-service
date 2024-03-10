export interface PublicUser {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface User extends PublicUser {
  password: string;
}
