import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller.js';
import { SessionsService } from './sessions.service.js';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionsService],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates the session lifecycle to the service', () => {
    const session = controller.create();
    expect(controller.list()).toEqual([session]);
    expect(controller.get(String(session.id))).toEqual(session);
    controller.delete(String(session.id));
    expect(controller.list()).toEqual([]);
  });
});
