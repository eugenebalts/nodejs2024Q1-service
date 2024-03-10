import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrack(@Param('id') id: string, @Res() res: Response) {
    const track = this.trackService.getTrack(id);

    res.status(HttpStatus.OK).send(track);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTrackSchema))
  createTrack(@Body() createTrackDto: CreateTrackDto, @Res() res: Response) {
    const track = this.trackService.createTrack(createTrackDto);

    res.status(HttpStatus.CREATED).send(track);
  }

  @Put(':id')
  updateTrack(
    @Body(new ZodValidationPipe(updateTrackSchema))
    updateTrackDto: UpdateTrackDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedTrack = this.trackService.updateTrack(id, updateTrackDto);

    res.status(HttpStatus.OK).send(updatedTrack);
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string, @Res() res: Response) {
    this.trackService.deleteTrack(id);

    res.status(HttpStatus.NO_CONTENT).send(true);
  }
}
