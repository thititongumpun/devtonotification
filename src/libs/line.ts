import {
  Client,
  WebhookEvent,
  MessageAPIResponseBase,
  FlexBubble,
  FlexMessage,
  Message,
} from '@line/bot-sdk';
import { DevtoResponse } from 'src/types/DevtoResponse';

export const lineConfig = {
  // channelAccessToken: process.env.CHANNELACCESSTOKEN as string,
  // channelSecret: process.env.CHANNELSECRET as string,
  channelAccessToken:
    'RJtk0HUzAcKx9Cxh5qyu3T5HapjFtivBWejd0irvbsy48eIw2vj7uXvtoHq+0t36FaoepJTmBAeeFwXzh5svBWNRqdphkNKTskGaGIq5wJNQ9xFBkKkzcKHJz0d4Pj78TQOhBqT2tg13BK1BX40cnAdB04t89/1O/w1cDnyilFU=' as string,
  channelSecret: '0ebe5ec57f2808cef34be6aefc437640' as string,
};

export const client: Client = new Client(lineConfig);

export const handleEvent = async (
  event: WebhookEvent,
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const { replyToken } = event;
  const { text } = event.message;

  // let data: ApiResponse[] = await fetchData();

  // const regexNumber = /^\d+$/;
  // if (text.match(regexNumber)) {
  //   data = await fetchDataPerPage(text);
  // }

  // if (text.startsWith('tags=')) {
  //   data = await fetchDataWithTag(text.split('=').pop());
  // }

  // const response: any = data.map((val) => ({
  //   title: val.title,
  //   description: val.description,
  //   url: val.url,
  //   tags: val.tags,
  //   readable_publish_date: val.readable_publish_date,
  //   social_image: val.social_image,
  // }));

  // let flexBubbles: FlexBubble[] = [];

  // for (const content of response) {
  //   const bubbles: FlexBubble = {
  //     type: 'bubble',
  //     hero: {
  //       type: 'image',
  //       size: 'full',
  //       aspectRatio: '20:13',
  //       aspectMode: 'cover',
  //       url: content.social_image,
  //     },
  //     body: {
  //       type: 'box',
  //       layout: 'vertical',
  //       spacing: 'sm',
  //       contents: [
  //         {
  //           type: 'text',
  //           text: content.title,
  //           wrap: true,
  //           weight: 'bold',
  //           size: 'md',
  //         },
  //         {
  //           type: 'box',
  //           layout: 'baseline',
  //           contents: [
  //             {
  //               type: 'text',
  //               text: content.tags,
  //               wrap: true,
  //               weight: 'regular',
  //               size: 'xs',
  //               flex: 0,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     footer: {
  //       type: 'box',
  //       layout: 'vertical',
  //       spacing: 'sm',
  //       contents: [
  //         {
  //           type: 'button',
  //           style: 'primary',
  //           action: {
  //             type: 'uri',
  //             label: 'Link',
  //             uri: content.url,
  //           },
  //         },
  //         {
  //           type: 'text',
  //           text: content.readable_publish_date,
  //           wrap: true,
  //           weight: 'bold',
  //           size: 'md',
  //           align: 'center',
  //         },
  //       ],
  //     },
  //   };
  //   flexBubbles.push(bubbles);
  // }

  // const flexRes: FlexMessage = {
  //   type: 'flex',
  //   altText: '....',
  //   contents: {
  //     type: 'carousel',
  //     contents: flexBubbles,
  //   },
  // };
  const res: Message = {
    text: text,
    type: 'text',
  };

  await client.replyMessage(replyToken, res);
};
