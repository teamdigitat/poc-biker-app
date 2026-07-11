import { Injectable, Inject, OnModuleInit, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    console.log('Checking default test user seed...');
    try {
      const existingUser = await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, 'test@example.com'))
        .limit(1);

      if (existingUser.length === 0) {
        console.log('Seeding default test user test@example.com / password123...');
        const passwordHash = await bcrypt.hash('password123', 10);
        await this.db.insert(schema.users).values({
          email: 'test@example.com',
          username: 'testuser',
          fullName: 'Test User',
          displayName: 'Test User',
          passwordHash,
          status: 'active',
        });
        console.log('Seeding completed successfully!');
      } else {
        console.log('Default test user already exists.');
      }
    } catch (err) {
      console.error('Error during seeding:', err);
    }
  }

  async login(emailOrUsername: string, password: string) {
    if (!emailOrUsername || !password) {
      throw new BadRequestException('Email/Username and Password are required');
    }

    const userRecordList = await this.db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.email, emailOrUsername.toLowerCase()),
          eq(schema.users.username, emailOrUsername),
        ),
      )
      .limit(1);

    if (userRecordList.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = userRecordList[0];
    if (!user.passwordHash) {
      throw new UnauthorizedException('Authentication method not supported');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        displayName: user.displayName,
        status: user.status,
      },
    };
  }

  async signup(email: string, username: string, fullName: string, password: string) {
    if (!email || !username || !password) {
      throw new BadRequestException('Email, Username, and Password are required');
    }

    const existing = await this.db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.email, email.toLowerCase()),
          eq(schema.users.username, username),
        ),
      );

    if (existing.length > 0) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await this.db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        username,
        fullName,
        displayName: fullName,
        passwordHash,
        status: 'active',
      })
      .returning();

    const user = result[0];
    const payload = { sub: user.id, email: user.email, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        displayName: user.displayName,
      },
    };
  }

  async getProfile(userId: string) {
    const userList = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    if (userList.length === 0) {
      throw new UnauthorizedException('User not found');
    }

    const user = userList[0];
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      displayName: user.displayName,
      status: user.status,
    };
  }
}
