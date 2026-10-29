import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker/docker.service.js';

@Injectable()
export class NekoService {
  constructor(private readonly dockerService: DockerService) {}

  async startLocal(
    httpPort = 8080,
    udpPort = 55000,
    sessionId = 0,
  ): Promise<string> {
    const id = await this.dockerService.startContainer({
      Image: 'ghcr.io/m1k1o/neko/firefox:latest',
      Labels: {
        'com.syncspace.neko': 'true',
        'com.syncspace.http-port': String(httpPort),
        'com.syncspace.udp-port': String(udpPort),
        'com.syncspace.session-id': String(sessionId),
      },
      Env: [
        `NEKO_WEBRTC_UDPMUX=${udpPort}`,
        'NEKO_WEBRTC_NAT1TO1=127.0.0.1',
        'NEKO_MEMBER_MULTIUSER_USER_PASSWORD=neko',
        'NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD=admin',
      ],
      ExposedPorts: {
        '8080/tcp': {},
        [`${udpPort}/udp`]: {},
      },
      HostConfig: {
        AutoRemove: true,
        PortBindings: {
          '8080/tcp': [{ HostPort: String(httpPort) }],
          [`${udpPort}/udp`]: [{ HostPort: String(udpPort) }],
        },
      },
    });
    return id;
  }
  async stopLocal(id: string): Promise<void> {
    await this.dockerService.stopContainer(id);
  }
  async listLocal() {
    return this.dockerService.listContainersByLabel('com.syncspace.neko=true');
  }
}
