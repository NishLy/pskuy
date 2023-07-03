export default interface USER_DATA extends USER {
  id: string;
}

export interface USER {
  username: string;
  number: string;
  profile_image?: string;
  email: string;
  password: string;
}
