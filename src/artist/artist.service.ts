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

  getAllArtists(): Artist[] {
    return Object.values(this.database.artists);
  }

  getArtist(id: string): Artist {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const artist = this.database.artists[id];

    if (!artist) {
      throw new NotFoundException();
    }

    return this.database.artists[id];
  }

  createArtist(createArtistDto: CreateArtistDto): Artist {
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

  updateArtist(id: string, updateArtistDto: UpdateArtistDto): Artist {
    this.getArtist(id);

    for (const key in updateArtistDto) {
      const newValue = updateArtistDto[key];
      if (newValue !== undefined) {
        this.database.artists[id][key] = newValue;
      }
    }

    return this.getArtist(id);
  }

  deleteArtist(id: string): void {
    this.getArtist(id);

    this.updateTracksArtistId(id);
    this.updateAlbumsArtistId(id);
    this.database.deleteFromFavorites(id, 'artists');
    delete this.database.artists[id];
  }

  private updateTracksArtistId(id: string) {
    const tracks = this.database.tracks;

    for (const trackId in tracks) {
      const curTrack = tracks[trackId];

      const { artistId } = curTrack;

      if (artistId === id) {
        curTrack.artistId = null;
      }
    }
  }

  private updateAlbumsArtistId(id: string) {
    const albums = this.database.albums;

    for (const albumId in albums) {
      const curAlbum = albums[albumId];

      const { artistId } = curAlbum;

      if (artistId === id) {
        curAlbum.artistId = null;
      }
    }
  }
}
