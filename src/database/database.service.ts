import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/album.interface';
import { Artist } from 'src/artist/artist.interface';
import { Favorites } from 'src/favorites/favorites.interface';
import { Track } from 'src/track/track.interface';
import { User } from 'src/user/user.interface';

@Injectable()
export class DataBaseService {
  public users: Record<string, User> = {};
  public artists: Record<string, Artist> = {};
  public tracks: Record<string, Track> = {};
  public albums: Record<string, Album> = {};
  public favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  addToFavorites(id, objectToAdd: 'artists' | 'albums' | 'tracks') {
    this.favorites[objectToAdd].push(id);
  }

  deleteFromFavorites(
    id: string,
    objectToDelete: 'artists' | 'albums' | 'tracks',
  ) {
    const objectIndex = this.favorites[objectToDelete].findIndex(
      (val) => val === id,
    );

    if (objectIndex !== -1) {
      this.favorites[objectToDelete].splice(objectIndex, 1);
    }
  }
}
