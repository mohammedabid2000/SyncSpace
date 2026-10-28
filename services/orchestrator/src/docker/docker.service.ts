import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class DockerService {
	private readonly client = new Docker();

	async ping(): Promise<void>{
		await this.client.ping();
	}
}
