import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service.js';
import { NekoService } from '../neko/neko.service.js';

describe('SessionsService', () => {
  let service: SessionsService;
  let running: Array<{ Id: string; Labels: Record<string, string> }>;
  let containerCounter: number;
  const startLocal = vi.fn();
  const stopLocal = vi.fn();
  const listLocal = vi.fn();

  beforeEach(async () => {
    running = [];
    containerCounter = 0;
    startLocal
      .mockReset()
      .mockImplementation(async (httpPort, udpPort, sessionId) => {
        const Id = `neko-container-${++containerCounter}`;
        running.push({
          Id,
          Labels: {
            'com.syncspace.http-port': String(httpPort),
            'com.syncspace.udp-port': String(udpPort),
            'com.syncspace.session-id': String(sessionId),
          },
        });
        return Id;
      });
    stopLocal.mockReset().mockImplementation(async (id) => {
      running = running.filter((container) => container.Id !== id);
    });
    listLocal.mockReset().mockImplementation(async () => [...running]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: NekoService,
          useValue: { startLocal, stopLocal, listLocal },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('starts a browser when creating a session and stops it when deleting', async () => {
    const session = await service.create();
    expect(session).toMatchObject({
      id: 1,
      status: 'created',
      containerId: 'neko-container-1',
      httpPort: 8080,
      udpPort: 55000,
    });
    expect(session.credentials.ownerPassword).toMatch(/^[0-9a-f]{64}$/);
    expect(session.credentials.viewerPassword).toMatch(/^[0-9a-f]{64}$/);
    expect(session.credentials.ownerPassword).not.toBe(session.credentials.viewerPassword);

    expect(startLocal).toHaveBeenCalledWith(
      8080,
      55000,
      1,
      session.credentials.ownerPassword,
      session.credentials.viewerPassword,
    );
    const stored = await service.get(session.id);
    expect(stored).toEqual({
      id: 1,
      status: 'created',
      containerId: 'neko-container-1',
      httpPort: 8080,
      udpPort: 55000,
    });
    expect(await service.list()).toEqual([stored]);
    await service.delete(session.id);
    expect(stopLocal).toHaveBeenCalledWith('neko-container-1');
    await expect(service.list()).resolves.toEqual([]);
  });

  it('gives concurrent sessions separate ports and reuses a released slot', async () => {
    const first = await service.create();
    const second = await service.create();
    expect(second).toMatchObject({ id: 2, httpPort: 8081, udpPort: 55001 });
    expect(startLocal).toHaveBeenNthCalledWith(
      2,
      8081,
      55001,
      2,
      second.credentials.ownerPassword,
      second.credentials.viewerPassword,
    );
    expect(first.credentials.ownerPassword).not.toBe(second.credentials.ownerPassword);
    await service.delete(first.id);
    const third = await service.create();
    expect(third).toMatchObject({ id: 3, httpPort: 8080, udpPort: 55000 });
  });

  it('releases a reserved port when starting Neko fails', async () => {
    startLocal.mockRejectedValueOnce(new Error('Docker start failed'));
    await expect(service.create()).rejects.toThrow('Docker start failed');

    const session = await service.create();
    expect(session).toMatchObject({ id: 2, httpPort: 8080, udpPort: 55000 });
  });

  it('restores labeled containers and reserves their ports on startup', async () => {
    running.push({
      Id: 'existing-container',
      Labels: {
        'com.syncspace.http-port': '8080',
        'com.syncspace.udp-port': '55000',
        'com.syncspace.session-id': '7',
      },
    });

    await service.onModuleInit();
    await expect(service.get(7)).resolves.toMatchObject({
      containerId: 'existing-container',
      httpPort: 8080,
      udpPort: 55000,
    });

    const next = await service.create();
    expect(next).toMatchObject({ id: 8, httpPort: 8081, udpPort: 55001 });
  });

  it('removes a browser that stopped outside the API and reuses its ports', async () => {
    const first = await service.create();
    running = [];

    await expect(service.get(first.id)).rejects.toThrow('Session not found');
    const second = await service.create();
    expect(second).toMatchObject({ id: 2, httpPort: 8080, udpPort: 55000 });
  });
});
