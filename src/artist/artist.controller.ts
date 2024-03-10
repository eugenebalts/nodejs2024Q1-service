import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Response } from 'express';
import { CreateArtistDto, createArtistSchema } from './dto/create-artist.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { UpdateArtistDto, updateArtistSchema } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getArtist(@Param('id') id: string, @Res() res: Response) {
    const artist = this.artistService.getArtist(id);

    res.status(HttpStatus.OK).send(artist);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createArtistSchema))
  createArtist(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
    const newArtist = this.artistService.createArtist(createArtistDto);

    res.status(HttpStatus.CREATED).send(newArtist);
  }

  @Put(':id')
  updateArtist(
    @Body(new ZodValidationPipe(updateArtistSchema))
    updateArtistDto: UpdateArtistDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedArtist = this.artistService.updateArtist(id, updateArtistDto);

    res.status(HttpStatus.OK).send(updatedArtist);
  }
}
