import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Res, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { requestConfig } from './libs/request';
import axios from 'axios';
import { DevtoResponse } from './types/DevtoResponse';
import { FlexBubble, FlexMessage } from '@line/bot-sdk';
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
    // const articles = await lastValueFrom(
    //   this.httpService
    //     .post<DevtoResponse[]>('https://dev.to/api/articles?top=1&per_page=10')
    //     .pipe(map((res) => res.data))
    //     .pipe(
    //       catchError((error: AxiosError) => {
    //         this.logger.error(error.response.data);
    //         throw 'An error happened!';
    //       }),
    //     ),
    // );
    const { data: articles } = await axios.get<DevtoResponse[]>(
      'https://dev.to/api/articles?top=1&per_page=10',
    );

    const parseArticles = articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      tags: article.tags,
      readable_publish_date: article.readable_publish_date,
      social_image: article.social_image,
    }));

    const flexBubbles: FlexBubble[] = [];

    for (const article of parseArticles) {
      const bubbles: FlexBubble = {
        type: 'bubble',
        hero: {
          type: 'image',
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'cover',
          url: article.social_image,
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'text',
              text: article.title,
              wrap: true,
              weight: 'bold',
              size: 'md',
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: article.tags,
                  wrap: true,
                  weight: 'regular',
                  size: 'xs',
                  flex: 0,
                },
              ],
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'uri',
                label: 'Link',
                uri: article.url,
              },
            },
            {
              type: 'text',
              text: article.readable_publish_date,
              wrap: true,
              weight: 'bold',
              size: 'md',
              align: 'center',
            },
          ],
        },
      };
      flexBubbles.push(bubbles);
    }

    const flexMessage: FlexMessage = {
      type: 'flex',
      altText: '....',
      contents: {
        type: 'carousel',
        contents: flexBubbles,
      },
    };

    await axios.post(
      'https://api.line.me/v2/bot/message/broadcast',
      {
        messages: [flexMessage],
      },
      requestConfig(process.env.CHANNELACCESSTOKEN),
    );
    res.status(200).json('done');
  }
}
