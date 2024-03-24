import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PublicUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column({type: 'bigint'})
  createdAt: number;

  @Column({type: 'bigint'})
  updatedAt: number;

  @Column({ default: 1 })
  version: number;
}

@Entity()
export class User extends PublicUser {
  @Column()
  password: string;
}
