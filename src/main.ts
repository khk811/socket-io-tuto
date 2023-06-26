import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors();
	app.useWebSocketAdapter(new IoAdapter(app));
	app.useStaticAssets(join(__dirname, '..', 'static'));
	await app.listen(3000);
}
bootstrap();
