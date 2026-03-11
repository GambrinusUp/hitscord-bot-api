export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface AuthResult {
  accessToken: string;
  user: UserProfile;
}
