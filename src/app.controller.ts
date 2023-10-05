import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Req, Res, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { map, lastValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { requestConfig } from './libs/request';
import axios from 'axios';
import { DevtoResponse } from './types/DevtoResponse';
@Controller()
export class AppController {
  private logger: Logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async webhook(@Req() req: Request, @Res() res: Response) {
    // const articles = this.httpService
    //   .get<DevtoResponse>('https://dev.to/api/articles?top=1')
    //   .pipe(map((res: any) => res.data))
    //   .pipe(
    //     catchError((error: AxiosError) => {
    //       this.logger.error(error.response.data);
    //       throw 'An error happened!';
    //     }),
    //   );

    // const response = await lastValueFrom(articles);
    const articles = await lastValueFrom(
      this.httpService
        .post<DevtoResponse[]>('https://dev.to/api/articles?top=1')
        .pipe(map((res) => res.data))
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    await axios.post(
      'https://api.line.me/v2/bot/message/broadcast',
      {
        messages: [
          {
            type: 'text',
            text: articles[0].title,
          },
          {
            type: 'text',
            text: articles[0].description,
          },
        ],
      },
      requestConfig(process.env.CHANNELACCESSTOKEN),
    );
    res.status(200).json('q');
  }
}
