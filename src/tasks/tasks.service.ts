import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { DevtoResponse } from 'src/types/DevtoResponse';
import { catchError, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly httpService: HttpService) {}

  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the second is 45');
  // }

  // @Interval(5000)
  // @Timeout(2000)
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleInterval() {
    this.logger.debug('Called every 10 seconds');
    // const res = await fetch('https://dev.to/api/articles?top=1');
    const res = this.httpService
      .get('https://dev.to/api/articles?top=1')
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      );
    // res.json().then((res: DevtoResponse) => this.logger.log(res));
    // console.log(res.pipe(map((x) => x)));
    const fact = await lastValueFrom(res);
    console.log(fact);
  }

  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Called once after 5 seconds');
  // }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // handleCronq() {
  //   this.logger.debug('Called when the second every 10 seconds');
  // }
}
