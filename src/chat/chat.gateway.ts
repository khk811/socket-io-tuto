import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common';

interface chatInfo {
	userName: string;
	roomId: string;
}

@WebSocketGateway({
	cors: {
		origin: ['http://localshost:81'],
	},
})
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger("ChatGateway");

	afterInit(server: Server) {
		this.logger.log('Initialized')
	}

	handleConnection(client: Socket) {
		this.logger.log(`${client.id}: Socket connected`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`${client.id}: Socket Disconnected`)
	}

	@SubscribeMessage('connect-user')
	connectUser(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		const [nickname, room] = data;
		const enterMsg = `User ${nickname} just arrived in room ${room}`;
		console.log(enterMsg);
		// this.server.emit('test', "test message");
		this.server.emit('sysmsg', room, enterMsg);
	}

	@SubscribeMessage('send-message')
	sendToOther(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
		const [room, nickname, message] = data;
		console.log("enter sendToOther");
		const userMessage = `[${nickname}]: ${message}`;
		console.log(`${room}, ${userMessage}, from ${client.id}`);
		client.broadcast.emit('receive-message', room, userMessage);
	}
}
