import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { isValidUuid } from 'src/utils/isValidUuid';
import { ERROR_INVALID_ID, FAILED_TO_DELETE, FAILED_TO_SAVE } from 'src/constants';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './models/track.entity';

@Injectable()
export class TrackService {
  // constructor(private database: DataBaseService) {}
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>
  ) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async getTrack(id: string): Promise<Track> {
    if (!isValidUuid(id)) {
      throw new BadRequestException(ERROR_INVALID_ID);
    }

    const track = await this.trackRepository.findOneBy({id});

    if (!track) {
      throw new NotFoundException();
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const id = uuidv4();

    const newTrack: Track = {
      id,
      ...createTrackDto,
    };

    try {
      await this.trackRepository.save(newTrack);

      return newTrack;
    } catch (err) {
      throw new InternalServerErrorException(`${FAILED_TO_SAVE}: ${err instanceof Error ? err.message : 'Failed'}`);
    }
  }

  async updateTrack(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.getTrack(id);

    for (const key in updateTrackDto) {
      const newValue = updateTrackDto[key];

      if (newValue !== undefined) {
        track[key] = newValue;
      }
    }

    try {
      await this.trackRepository.save(track);

      return track;
    } catch(err) {
      throw new InternalServerErrorException(`${FAILED_TO_SAVE}: ${err instanceof Error ? err.message : 'Failed'}`);
    }
  }

  async deleteTrack(id: string): Promise<void> {
    await this.getTrack(id);

    // this.database.deleteFromFavorites(id, 'tracks');
    try {
      await this.trackRepository.delete({id});
    } catch (err) {
      throw new InternalServerErrorException(`${FAILED_TO_DELETE}: ${err instanceof Error ? err.message : 'Failed'}`);
    }
  }
}
