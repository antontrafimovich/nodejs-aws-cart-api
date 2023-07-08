import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, proxy, Response } from '@vendia/serverless-express';
import express from 'express';
import { Server } from 'http';

import { AppModule } from './app.module';

export async function createApp(
  expressApp: express.Express,
): Promise<INestApplication> {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.init();

  return app;
}

let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  const expressApp = express();

  const app = await createApp(expressApp);
  await app.init();

  return createServer(expressApp);
}

export async function handler(event: any, context): Promise<Response> {
  if (!cachedServer) {
    const server = await bootstrap();
    cachedServer = server;
  }

  return proxy(cachedServer, event, context, 'PROMISE').promise;
}
