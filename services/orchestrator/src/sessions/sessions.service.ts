import { Injectable, NotFoundException } from '@nestjs/common';
import { NekoService } from '../neko/neko.service.js';

type Session = {
  id: number;
  status: string;
  containerId: string;
};

@Injectable()
export class SessionsService {
  private readonly sessions: Session[] = [];
  private nextId = 1;
  constructor(private readonly nekoService: NekoService) {}

  list(): Session[] {
    return this.sessions;
  }

  async create(): Promise<Session> {
    const containerId = await this.nekoService.startLocal();
    const session: Session = {
      id: this.nextId,
      status: 'created',
      containerId,
    };
    this.nextId++;
    this.sessions.push(session);
    return session;
  }

  get(id: number): Session {
    for (const session of this.sessions) {
      if (session.id === id) return session;
    }
    throw new NotFoundException('Session not found');
  }
  async delete(id: number): Promise<void> {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id === id) {
        await this.nekoService.stopLocal(this.sessions[i].containerId);
        this.sessions.splice(i, 1);
        return;
      }
    }
    throw new NotFoundException('Session not found');
  }
}
