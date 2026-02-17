import { IEvent } from '../event/event.interface';

export enum ArtistGenre {
  POP = "Pop",
  ROCK = "Rock",
  HIP_HOP = "Hip-Hop",
  RB = "R&B",
  COUNTRY = "Country",
  ELECTRONIC = "Electronic",
  JAZZ = "Jazz",
  CLASSICAL = "Classical",
  REGGAE = "Reggae",
}

export interface IArtist {
  image?: string;
  name: string;
  genre: ArtistGenre;
  bio?: string;
  instagram?: string; // Individual field
  twitter?: string; // Individual field
  facebook?: string; // Individual field
  website?: string; // Individual field
  isVerified: boolean;
}
export interface IArtistWithEvents extends IArtist {
  events: IEvent[];
}
 