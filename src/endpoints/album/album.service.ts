import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './models/album.entity';
import { Repository } from 'typeorm';
import { Track } from '../track/models/track.entity';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAllAlbums(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async getAlbum(id: string): Promise<Album> {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException();
    }

    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const id = uuidv4();

    const newAlbum: Album = {
      id,
      ...createAlbumDto,
    };

    try {
      await this.albumRepository.save(newAlbum);

      return newAlbum;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const album = await this.getAlbum(id);

    for (const key in updateAlbumDto) {
      const newValue = updateAlbumDto[key];

      if (newValue !== undefined) {
        album[key] = newValue;
      }
    }

    try {
      await this.albumRepository.save(album);

      return album;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async deleteAlbum(id: string): Promise<void> {
    await this.getAlbum(id);

    try {
      await this.albumRepository.delete({ id });
    } catch (err) {
      throw new InternalServerErrorException();
    }

    await this.updateTracksAlbumId(id);
    await this.favoritesService.deleteFromFavorites(id, 'albums', 'update');
  }

  private async updateTracksAlbumId(id: string): Promise<void> {
    const tracksWithAlbumId = await this.trackRepository.findBy({
      albumId: id,
    });

    try {
      await Promise.all(
        tracksWithAlbumId.map(async (track) => {
          track.albumId = null;

          await this.trackRepository.save(track);
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
