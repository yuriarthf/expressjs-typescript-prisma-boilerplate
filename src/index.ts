import { config as configDotenv } from 'dotenv';
import server from './app';
import { PrismaClient } from '@prisma/client';
import environment from '@/lib/environment';
import { printAppInfo } from './utils/print-app-info';
import appConfig from './config/app.config';

configDotenv();

const prisma = new PrismaClient();

server.listen(process.env.PORT, () => {
  const { port, env, appUrl: _appUrl } = environment;
  const {
    api: { basePath, version },
  } = appConfig;
  const appUrl = `${_appUrl}:${port}`;
  const apiUrl = `${appUrl}/${basePath}/${version}/${env}`;
  printAppInfo(port, env, appUrl, apiUrl);
});

process.on('SIGINT', () => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  prisma.$disconnect();
  console.log('Prisma Disconnected.');
  process.exit(0);
});
