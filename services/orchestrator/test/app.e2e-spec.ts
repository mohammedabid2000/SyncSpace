import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { NekoService } from './../src/neko/neko.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let running: Array<{ Id: string; Labels: Record<string, string> }>;
  const startLocal = vi.fn();
  const stopLocal = vi.fn();
  const listLocal = vi.fn();

  beforeEach(async () => {
    running = [];
    startLocal
      .mockReset()
      .mockImplementation(async (httpPort, udpPort, sessionId) => {
        running.push({
          Id: 'neko-container-id',
          Labels: {
            'com.syncspace.http-port': String(httpPort),
            'com.syncspace.udp-port': String(udpPort),
            'com.syncspace.session-id': String(sessionId),
          },
        });
        return 'neko-container-id';
      });
    stopLocal.mockReset().mockImplementation(async (id) => {
      running = running.filter((container) => container.Id !== id);
    });
    listLocal.mockReset().mockImplementation(async () => [...running]);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NekoService)
      .useValue({ startLocal, stopLocal, listLocal })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('creates, reads, and deletes a session through HTTP', async () => {
    const created = await request(app.getHttpServer())
      .post('/sessions')
      .expect(201);
    expect(created.body).toEqual({
      id: 1,
      status: 'created',
      containerId: 'neko-container-id',
      httpPort: 8080,
      udpPort: 55000,
    });

    await request(app.getHttpServer()).get('/sessions/1').expect(200).expect({
      id: 1,
      status: 'created',
      containerId: 'neko-container-id',
      httpPort: 8080,
      udpPort: 55000,
    });
    await request(app.getHttpServer()).delete('/sessions/1').expect(204);
    expect(stopLocal).toHaveBeenCalledWith('neko-container-id');
    await request(app.getHttpServer()).get('/sessions/1').expect(404);
  });

  it('rejects non-numeric session IDs and has no direct Neko test route', async () => {
    await request(app.getHttpServer()).get('/sessions/abc').expect(400);
    await request(app.getHttpServer()).delete('/sessions/abc').expect(400);
    await request(app.getHttpServer()).post('/neko/local').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
