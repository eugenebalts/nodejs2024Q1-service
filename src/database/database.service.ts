import { Injectable } from '@nestjs/common';
import { Favorites } from 'src/favorites/favorites.interface';

@Injectable()
export class DataBaseService {
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
