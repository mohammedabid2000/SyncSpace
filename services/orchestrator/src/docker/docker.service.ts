import { Injectable } from '@nestjs/common';
import Docker from 'dockerode';

@Injectable()
export class DockerService {
  private readonly client = new Docker();

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async runHelloWorld(): Promise<number> {
    const container = await this.client.createContainer({
      Image: 'hello-world:latest',
    });

    try {
      await container.start();
      const result = await container.wait();
      return result.StatusCode;
    } finally {
      await container.remove({ force: true });
    }
  }
}
