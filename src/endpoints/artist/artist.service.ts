import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { isValidUuid } from 'src/utils/isValidUuid';
import {
  ERROR_INVALID_ID,
  FAILED_TO_DELETE,
  FAILED_TO_SAVE,
} from 'src/constants';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Repository } from 'typeorm';
import { Artist } from './models/artist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../track/models/track.entity';
import { Album } from '../album/models/album.entity';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async getArtist(id: string): Promise<Artist> {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException();
    }

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = createArtistDto;

    const id = uuidv4();

    const newArtist: Artist = {
      id,
      name,
      grammy,
    };

    try {
      await this.artistRepository.save(newArtist);

      return newArtist;
    } catch (err) {
      throw new InternalServerErrorException(
        `${FAILED_TO_SAVE}: ${err instanceof Error ? err.message : 'Failed'}`,
      );
    }
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.getArtist(id);

    for (const key in updateArtistDto) {
      const newValue = updateArtistDto[key];

      if (newValue !== undefined) {
        artist[key] = newValue;
      }
    }

    try {
      await this.artistRepository.save(artist);

      return artist;
    } catch (err) {
      throw new InternalServerErrorException(
        `${FAILED_TO_SAVE}: ${err instanceof Error ? err.message : 'Failed'}`,
      );
    }
  }

  async deleteArtist(id: string): Promise<void> {
    await this.getArtist(id);

    try {
      await this.artistRepository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(
        `${FAILED_TO_DELETE}: ${err instanceof Error ? err.message : 'Failed'}`,
      );
    }

    await this.updateTracksArtistId(id);
    await this.updateAlbumsArtistId(id);
  }

  private async updateTracksArtistId(id: string) {
    const tracksWithArtistId = await this.trackRepository.findBy({
      artistId: id,
    });

    try {
      await Promise.all(
        tracksWithArtistId.map(async (track) => {
          track.artistId = null;

          await this.trackRepository.save(track);
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException(
        `${FAILED_TO_SAVE}: ${err instanceof Error ? err.message : 'Failed'}`,
      );
    }
  }

  private async updateAlbumsArtistId(id: string) {
    const albumsWithArtistId = await this.albumRepository.findBy({
      artistId: id,
    });

    try {
      await Promise.all(
        albumsWithArtistId.map(async (album) => {
          album.artistId = null;

          await this.albumRepository.save(album);
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException(
        `${FAILED_TO_SAVE}: ${err instanceof Error ? err.message : 'Failed'}`,
      );
    }
  }
}
