import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker/docker.service.js';

@Injectable()
export class NekoService {
  constructor(private readonly dockerService: DockerService) {}

  async startLocal(
    httpPort: number,
    udpPort: number,
    sessionId: number,
    ownerPassword: string,
    viewerPassword: string,
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
        `NEKO_MEMBER_MULTIUSER_USER_PASSWORD=${viewerPassword}`,
        'NEKO_MEMBER_MULTIUSER_USER_PROFILE={"can_login":true,"can_connect":true,"can_watch":true,"can_host":false,"can_share_media":false,"can_access_clipboard":false}',
        `NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD=${ownerPassword}`,
        'NEKO_MEMBER_MULTIUSER_ADMIN_PROFILE={"is_admin":false,"can_login":true,"can_connect":true,"can_watch":true,"can_host":true,"can_share_media":false,"can_access_clipboard":false}',
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
