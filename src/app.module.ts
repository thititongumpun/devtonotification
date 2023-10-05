import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, HttpService],
})
export class AppModule {}
