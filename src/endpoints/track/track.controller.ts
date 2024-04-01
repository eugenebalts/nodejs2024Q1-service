import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { CreateTrackDto, createTrackSchema } from './dto/create-track.dto';
import { Response } from 'express';
import { UpdateTrackDto, updateTrackSchema } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks() {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  async getTrack(@Param('id') id: string, @Res() res: Response) {
    const track = await this.trackService.getTrack(id);

    res.status(HttpStatus.OK).send(track);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTrackSchema))
  async createTrack(
    @Body() createTrackDto: CreateTrackDto,
    @Res() res: Response,
  ) {
    const track = await this.trackService.createTrack(createTrackDto);

    res.status(HttpStatus.CREATED).send(track);
  }

  @Put(':id')
  async updateTrack(
    @Body(new ZodValidationPipe(updateTrackSchema))
    updateTrackDto: UpdateTrackDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedTrack = await this.trackService.updateTrack(
      id,
      updateTrackDto,
    );

    res.status(HttpStatus.OK).send(updatedTrack);
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string, @Res() res: Response) {
    await this.trackService.deleteTrack(id);

    res.status(HttpStatus.NO_CONTENT).send(true);
  }
}
