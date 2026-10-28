import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker/docker.service.js';

@Injectable()
export class NekoService {
  constructor(private readonly dockerService: DockerService) {}

  async startLocal(): Promise<string> {
    const id = await this.dockerService.startContainer({
      Image: 'ghcr.io/m1k1o/neko/firefox:latest',
      Env: [
        'NEKO_WEBRTC_UDPMUX=55000',
        'NEKO_WEBRTC_NAT1TO1=127.0.0.1',
        'NEKO_MEMBER_MULTIUSER_USER_PASSWORD=neko',
        'NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD=admin',
      ],
      ExposedPorts: {
        '8080/tcp': {},
        '55000/udp': {},
      },
      HostConfig: {
        AutoRemove: true,
        PortBindings: {
          '8080/tcp': [{ HostPort: '8080' }],
          '55000/udp': [{ HostPort: '55000' }],
        },
      },
    });
    return id;
  }
  async stopLocal(id: string): Promise<void> {
    await this.dockerService.stopContainer(id);
  }
}
