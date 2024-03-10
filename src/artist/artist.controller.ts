import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Response } from 'express';
import { CreateArtistDto, createArtistSchema } from './dto/create-artist.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createArtistSchema))
  createArtist(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
    const newArtist = this.artistService.createArtist(createArtistDto);

    res.status(HttpStatus.CREATED).send(newArtist);
  }
}
