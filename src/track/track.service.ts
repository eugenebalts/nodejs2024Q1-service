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
import { UpdateTrackDto } from './dto/update-track.dto';

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

  updateTrack(id: string, updateTrackDto: UpdateTrackDto) {
    this.getTrack(id);

    for (const key in updateTrackDto) {
      const newValue = updateTrackDto[key];
      if (newValue !== undefined) {
        this.database.tracks[id][key] = newValue;
      }
    }

    return this.getTrack(id);
  }

  deleteTrack(id: string): void {
    this.getTrack(id);

    delete this.database.tracks[id];
  }
}
