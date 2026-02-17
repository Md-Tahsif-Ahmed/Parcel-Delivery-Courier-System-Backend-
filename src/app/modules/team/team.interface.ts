import { IEvent } from '../event/event.interface';

export enum TeamGenre {
  FOOTBALL = "Football",
  CRICKET = "Cricket",
  BASKETBALL = "Basketball",
  TENNIS = "Tennis",
  BASEBALL = "Baseball",
  HOCKEY = "Hockey",
  RUGBY = "Rugby",
  VOLLEYBALL = "Volleyball",
  SWIMMING = "Swimming",
  ATHLETICS = "Athletics"
}


export interface ITeam {
  image?: string;
  name: string;
  genre: TeamGenre;
  bio?: string;
  isVerified: boolean;
 
}
export interface ITeamWithEvents extends ITeam {
  events: IEvent[];
}
 