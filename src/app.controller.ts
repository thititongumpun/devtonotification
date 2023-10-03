import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { WebhookEvent } from '@line/bot-sdk';
import { handleEvent } from './libs/line';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async webhook(@Req() req: Request, @Res() res: Response) {
    const events: WebhookEvent[] = req.body.events;
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await handleEvent(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          return res.status(500).json({
            status: 'error',
          });
        }
      }),
    );
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
}
