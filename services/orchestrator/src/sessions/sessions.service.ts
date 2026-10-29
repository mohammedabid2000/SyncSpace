import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  OnModuleInit,
} from '@nestjs/common';
import { NekoService } from '../neko/neko.service.js';

const HTTP_PORT_START = 8080;
const UDP_PORT_START = 55000;
const MAX_SESSIONS = 100;

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
    for (let slot = 0; slot < MAX_SESSIONS; slot++) {
      if (!this.usedSlots.has(slot)) {
        this.usedSlots.add(slot);
        return slot;
      }
    }
    throw new ServiceUnavailableException('No free Neko ports');
  }

  async list(): Promise<Session[]> {
    await this.removeStoppedSessions();
    return this.sessions;
  }

  async create(): Promise<Session> {
    await this.removeStoppedSessions();
    const slot = this.reserveSlot();
    const httpPort = HTTP_PORT_START + slot;
    const udpPort = UDP_PORT_START + slot;
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

  async get(id: number): Promise<Session> {
    await this.removeStoppedSessions();
    for (const session of this.sessions) {
      if (session.id === id) return session;
    }
    throw new NotFoundException('Session not found');
  }
  async delete(id: number): Promise<void> {
    const session = this.sessions.find((item) => item.id === id);
    if (!session) throw new NotFoundException('Session not found');
    await this.nekoService.stopLocal(session.containerId);
    const index = this.sessions.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.sessions.splice(index, 1);
      this.usedSlots.delete(session.httpPort - HTTP_PORT_START);
    }
  }

  // Restore running neko sessions and reserve their ports after Nest restarts
  async onModuleInit(): Promise<void> {
    const containers = await this.nekoService.listLocal();

    for (const container of containers) {
      const httpPort = Number(container.Labels['com.syncspace.http-port']);
      const udpPort = Number(container.Labels['com.syncspace.udp-port']);
      const slot = httpPort - HTTP_PORT_START;

      if (
        !Number.isInteger(slot) ||
        slot < 0 ||
        slot >= MAX_SESSIONS ||
        udpPort !== UDP_PORT_START + slot
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

  // remove sessions whose containers stopped; loop backward so splice does not skip entries
  private async removeStoppedSessions(): Promise<void> {
    const existingIds = new Set(this.sessions.map((session) => session.id));
    const containers = await this.nekoService.listLocal();
    const runningIds = new Set(containers.map((container) => container.Id));

    for (let i = this.sessions.length - 1; i >= 0; i--) {
      const session = this.sessions[i];
      if (!existingIds.has(session.id)) continue;
      if (!runningIds.has(session.containerId)) {
        this.usedSlots.delete(session.httpPort - HTTP_PORT_START);
        this.sessions.splice(i, 1);
      }
    }
  }
}
