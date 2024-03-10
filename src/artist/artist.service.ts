import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './artist.interface';

@Injectable()
export class ArtistService {
  private artists: Record<string, Artist> = {};

  getAllArtists() {
    return Object.values(this.artists);
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
}
