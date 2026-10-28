import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class DockerService {
  private readonly client = new Docker();

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async startContainer(
    options: Docker.ContainerCreateOptions,
  ): Promise<string> {
    const container = await this.client.createContainer(options);

    try {
      await container.start();
      return container.id;
    } catch (error) {
      await container.remove({ force: true });
      throw error;
    }
  }
  async stopContainer(id: string) {
    await this.client.getContainer(id).stop();
  }
}
