import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
    expect(created.body).toEqual({ id: 1, status: 'created' });

    await request(app.getHttpServer())
      .get('/sessions/1')
      .expect(200)
      .expect({ id: 1, status: 'created' });
    await request(app.getHttpServer()).delete('/sessions/1').expect(204);
    await request(app.getHttpServer()).get('/sessions/1').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
