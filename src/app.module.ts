import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserModule } from './endpoints/user/user.module';
import { TrackModule } from './endpoints/track/track.module';
import { ArtistModule } from './endpoints/artist/artist.module';
import { AlbumModule } from './endpoints/album/album.module';
import { FavoritesModule } from './endpoints/favorites/favorites.module';
import { User } from './endpoints/user/models/user.entity';
import { Track } from './endpoints/track/models/track.entity';
import { Artist } from './endpoints/artist/models/artist.entity';
import { Album } from './endpoints/album/models/album.entity';
import { Favorites } from './endpoints/favorites/models/favorites.entity';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/exception.filter';
import { AuthModule } from './endpoints/auth/auth.module';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_URL } =
  process.env;

@Module({
  imports: [
    AuthModule,
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
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  },],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
