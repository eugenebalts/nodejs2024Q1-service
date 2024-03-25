import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', default: null })
  artistId: string | null;

  @Column({ type: 'uuid', default: null })
  albumId: string | null;

  @Column()
  duration: number;
}
