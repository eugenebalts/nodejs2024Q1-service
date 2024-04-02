import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse, RepositoryName } from './models/favorites.entity';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from './models/favorites.entity';
import { Artist } from '../artist/models/artist.entity';
import { Album } from '../album/models/album.entity';
import { Track } from '../track/models/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  private async getFavorites(): Promise<Favorites> {
    const favorites: Favorites | undefined = await this.favoritesRepository
      .find()
      .then((fav: Favorites[]) => fav[0]);

    if (!favorites) {
      const newFavorites = new Favorites();

      await this.favoritesRepository.save(newFavorites);

      return newFavorites;
    }

    return favorites;
  }

  private async getObjectFromRepository<T extends Artist | Album | Track>(
    id: string,
    repositoryName: RepositoryName,
  ): Promise<T> {
    let repository: Repository<any>;

    switch (repositoryName) {
      case 'artists':
        repository = this.artistRepository;
        break;

      case 'albums':
        repository = this.albumRepository;
        break;

      case 'tracks':
        repository = this.trackRepository;
        break;
    }

    const object = await repository.findOneBy({ id });

    return object;
  }

  async getAllFavorites(): Promise<FavoritesResponse> {
    const favoritesObject: Favorites = await this.getFavorites();

    const { id, ...repositories } = favoritesObject;

    id; //hide warnings :D

    const response: FavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };

    await Promise.all(
      Object.keys(repositories).map(async (repository: RepositoryName) => {
        const repositoryIds: string[] = repositories[repository];

        await Promise.all(
          repositoryIds.map(async (id) => {
            const object = await this.getObjectFromRepository(id, repository);

            if (object) {
              response[repository as keyof RepositoryName].push(object);
            }
          }),
        );
      }),
    );

    return response;
  }

  async addToFavorites(id: string, repositoryName: RepositoryName) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const object = await this.getObjectFromRepository(id, repositoryName);

    if (!object) {
      throw new UnprocessableEntityException();
    }

    const favorites = await this.getFavorites();

    const isAddedToFavorites = favorites[repositoryName].includes(id);

    if (!isAddedToFavorites) {
      favorites[repositoryName].push(id);

      await this.updateFavorites(favorites);
    }
  }

  async deleteFromFavorites(
    id: string,
    repositoryName: RepositoryName,
    type: 'update' | 'delete',
  ): Promise<void> {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const favorites = await this.getFavorites();

    const isAddedToFavorites = favorites[repositoryName].includes(id);

    if (!isAddedToFavorites) {
      if (type === 'delete') {
        throw new NotFoundException();
      }

      return;
    }

    const objectIndex = favorites[repositoryName].findIndex(
      (val) => val === id,
    );

    if (objectIndex !== -1) {
      favorites[repositoryName].splice(objectIndex, 1);
    }

    await this.updateFavorites(favorites);
  }

  async updateFavorites(newFavorites: Favorites) {
    try {
      await this.favoritesRepository.save(newFavorites);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
