import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './artist.interface';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private artists: Record<string, Artist> = {};

  getAllArtists() {
    return Object.values(this.artists);
  }

  getArtist(id: string) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const artist = this.artists[id];

    if (!artist) {
      throw new NotFoundException();
    }

    return this.artists[id];
  }

  createArtist(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    const id = uuidv4();

    const newArtist: Artist = {
      id,
      name,
      grammy,
    };

    this.artists[id] = newArtist;

    return newArtist;
  }

  updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    this.getArtist(id);

    for (const key in updateArtistDto) {
      const newValue = updateArtistDto[key];
      if (newValue !== undefined) {
        this.artists[id][key] = newValue;
      }
    }

    return this.artists[id];
  }
}
