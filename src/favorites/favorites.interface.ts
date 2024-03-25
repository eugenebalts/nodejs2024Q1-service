import { Album } from 'src/album/album.interface';
import { Artist } from 'src/artist/artist.interface';
import { Track } from 'src/track/track.interface';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
