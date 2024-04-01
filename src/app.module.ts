import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { Favorites } from './favorites/models/favorites.entity';
import * as dotenv from 'dotenv';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_URL } =
  process.env;

@Module({
  imports: [
    LoggerModule,
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: DB_URL,
      host: 'localhost',
      port: parseInt(DB_PORT || '5432', 10),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      entities: [User, Track, Artist, Album, Favorites],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
