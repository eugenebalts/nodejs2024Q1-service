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
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
  constructor(private database: DataBaseService) {}

  getAllArtists() {
    return Object.values(this.database.artists);
  }

  getArtist(id: string) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const artist = this.database.artists[id];

    if (!artist) {
      throw new NotFoundException();
    }

    return this.database.artists[id];
  }

  createArtist(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    const id = uuidv4();

    const newArtist: Artist = {
      id,
      name,
      grammy,
    };

    this.database.artists[id] = newArtist;

    return newArtist;
  }

  updateArtist(id: string, updateArtistDto: UpdateArtistDto) {
    this.getArtist(id);

    for (const key in updateArtistDto) {
      const newValue = updateArtistDto[key];
      if (newValue !== undefined) {
        this.database.artists[id][key] = newValue;
      }
    }

    return this.database.artists[id];
  }

  deleteArtist(id: string) {
    this.getArtist(id);

    return delete this.database.artists[id];
  }
}
