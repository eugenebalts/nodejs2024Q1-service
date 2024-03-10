import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.interface';
import { DataBaseService } from 'src/database/database.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID } from 'src/constants';

@Injectable()
export class TrackService {
  constructor(private database: DataBaseService) {}

  getAllTracks(): Track[] {
    return Object.values(this.database.tracks);
  }

  getTrack(id: string) {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const track = this.database.tracks[id];

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  createTrack(createTrackDto: CreateTrackDto): Track {
    const id = uuidv4();

    const newTrack: Track = {
      id,
      ...createTrackDto,
    };

    this.database.tracks[id] = newTrack;

    return newTrack;
  }
}
