export default interface USER_DATA extends USER {
  id: number;
}

export interface USER {
  username: string;
  number: string;
  email: string;
  password: string;
}
