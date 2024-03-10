import { Injectable } from '@nestjs/common';
import { Artist } from 'src/artist/artist.interface';
import { User } from 'src/user/user.interface';

@Injectable()
export class DataBaseService {
  public users: Record<string, User> = {};
  public artists: Record<string, Artist> = {};
}
