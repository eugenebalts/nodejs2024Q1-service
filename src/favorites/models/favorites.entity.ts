import { Album } from 'src/album/models/album.entity';
import { Artist } from 'src/artist/models/artist.entity';
import { Track } from 'src/track/models/track.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', array: true, default: [] })
  artists: string[];

  @Column({ type: 'uuid', array: true, default: [] })
  tracks: string[];

  @Column({ type: 'uuid', array: true, default: [] })
  albums: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

export type RepositoryName = keyof FavoritesResponse;
