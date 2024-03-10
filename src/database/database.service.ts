import { Injectable } from '@nestjs/common';
import { Album } from 'src/album/album.interface';
import { Artist } from 'src/artist/artist.interface';
import { Track } from 'src/track/track.interface';
import { User } from 'src/user/user.interface';

@Injectable()
export class DataBaseService {
  public users: Record<string, User> = {};
  public artists: Record<string, Artist> = {};
  public tracks: Record<string, Track> = {};
  public albums: Record<string, Album> = {};
}