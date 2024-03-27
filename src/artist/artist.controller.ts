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
import { ArtistService } from './artist.service';
import { Response } from 'express';
import { CreateArtistDto, createArtistSchema } from './dto/create-artist.dto';
import { ZodValidationPipe } from 'src/utils/zodValidationPipe';
import { UpdateArtistDto, updateArtistSchema } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists() {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtist(@Param('id') id: string, @Res() res: Response) {
    const artist = await this.artistService.getArtist(id);

    res.status(HttpStatus.OK).send(artist);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createArtistSchema))
  async createArtist(
    @Body() createArtistDto: CreateArtistDto,
    @Res() res: Response,
  ) {
    const newArtist = await this.artistService.createArtist(createArtistDto);

    res.status(HttpStatus.CREATED).send(newArtist);
  }

  @Put(':id')
  async updateArtist(
    @Body(new ZodValidationPipe(updateArtistSchema))
    updateArtistDto: UpdateArtistDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedArtist = await this.artistService.updateArtist(
      id,
      updateArtistDto,
    );

    res.status(HttpStatus.OK).send(updatedArtist);
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string, @Res() res: Response) {
    await this.artistService.deleteArtist(id);

    res.status(HttpStatus.NO_CONTENT).send(true);
  }
}
