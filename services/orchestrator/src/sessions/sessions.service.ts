import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  OnModuleInit,
} from '@nestjs/common';
import { NekoService } from '../neko/neko.service.js';

type Session = {
  id: number;
  status: string;
  containerId: string;
  httpPort: number;
  udpPort: number;
};

@Injectable()
export class SessionsService implements OnModuleInit {
  private readonly sessions: Session[] = [];
  private nextId = 1;
  constructor(private readonly nekoService: NekoService) {}

  private readonly usedSlots = new Set<number>();
  private reserveSlot(): number {
    for (let slot = 0; slot < 100; slot++) {
      if (!this.usedSlots.has(slot)) {
        this.usedSlots.add(slot);
        return slot;
      }
    }
    throw new ServiceUnavailableException('No free Neko ports');
  }

  list(): Session[] {
    return this.sessions;
  }

  async create(): Promise<Session> {
    const slot = this.reserveSlot();
    const httpPort = 8080 + slot;
    const udpPort = 55000 + slot;
    const sessionId = this.nextId++;
    let containerId: string;

    try {
      containerId = await this.nekoService.startLocal(
        httpPort,
        udpPort,
        sessionId,
      );
    } catch (error) {
      this.usedSlots.delete(slot);
      throw error;
    }

    const session: Session = {
      id: sessionId,
      status: 'created',
      containerId,
      httpPort,
      udpPort,
    };

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
        const session = this.sessions[i];
        await this.nekoService.stopLocal(this.sessions[i].containerId);
        this.sessions.splice(i, 1);
        this.usedSlots.delete(session.httpPort - 8080);
        return;
      }
    }
    throw new NotFoundException('Session not found');
  }

  // Restore running neko sessions and reserve their ports after Nest restarts
  async onModuleInit(): Promise<void> {
    const containers = await this.nekoService.listLocal();

    for (const container of containers) {
      const httpPort = Number(container.Labels['com.syncspace.http-port']);
      const udpPort = Number(container.Labels['com.syncspace.udp-port']);
      const slot = httpPort - 8080;

      if (
        !Number.isInteger(slot) ||
        slot < 0 ||
        slot >= 100 ||
        udpPort !== 55000 + slot
      ) {
        continue;
      }
      this.usedSlots.add(slot);

      const id = Number(container.Labels['com.syncspace.session-id']);
      if (!Number.isSafeInteger(id) || id <= 0) continue;
      this.sessions.push({
        id,
        status: 'created',
        containerId: container.Id,
        httpPort,
        udpPort,
      });
      this.nextId = Math.max(this.nextId, id + 1);
    }
  }
}
