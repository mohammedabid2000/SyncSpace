import { Injectable, NotFoundException } from '@nestjs/common';

type Session = {
  id: number;
  status: string;
};

@Injectable()
export class SessionsService {
  private readonly sessions: Session[] = [];
  private nextId = 1;

  list(): Session[] {
    return this.sessions;
  }

  create(): Session {
    const session: Session = {
      id: this.nextId,
      status: 'created',
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
  delete(id: number): void {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id === id) {
        this.sessions.splice(i, 1);
        return;
      }
    }
    throw new NotFoundException('Session not found');
  }
}
