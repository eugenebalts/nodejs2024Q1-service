import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { FavoritesResponse } from './favorites.interface';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';

@Injectable()
export class FavoritesService {
  constructor(private database: DataBaseService) {}

  getAllFavorites(): FavoritesResponse {
    const response: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    for (const fav in this.database.favorites) {
      const objectIds: string[] = this.database.favorites[fav];

      if (!objectIds.length) {
        continue;
      }

      if (fav in this.database) {
        objectIds.forEach((id) => {
          if (this.database[fav][id]) {
            response[fav].push(this.database[fav][id]);
          }
        });
      }
    }

    return response;
  }

  addToFavorites(id: string, objectToAdd: 'artists' | 'albums' | 'tracks') {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const object = this.database[objectToAdd][id];

    if (!object) {
      throw new UnprocessableEntityException();
    }

    this.database.addToFavorites(id, objectToAdd);
  }

  deleteFromFavorites(
    id: string,
    objectToDelete: 'artists' | 'albums' | 'tracks',
  ) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const isAdded = this.database.favorites[objectToDelete].includes(id);

    if (!isAdded) {
      throw new NotFoundException();
    }

    this.database.deleteFromFavorites(id, objectToDelete);
  }
}
