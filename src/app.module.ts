import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/models/user.entity';
import { Track } from './track/models/track.entity';
import { Artist } from './artist/models/artist.entity';
import { Album } from './album/models/album.entity';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'eugenebalts',
      password: 'eugenebalts',
      database: 'nestjs',
      entities: [User, Track, Artist, Album],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
