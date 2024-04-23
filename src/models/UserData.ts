export interface IUserData {
  id: number;
  data_json: object;
  highest_level: number;
  total_experience: number;
  total_gold: number;
  premium: string;
}

export class UserData implements IUserData {
  constructor(
    public id: number,
    public data_json: object,
    public highest_level: number,
    public total_experience: number,
    public total_gold: number,
    public premium: string
  ) {}
}
