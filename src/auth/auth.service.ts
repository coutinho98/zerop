import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signUp(data: any) {
        const { email, password, businessName, businessType } = data;

        const userExists = await this.prisma.user.findUnique({ where: { email } });
        if (userExists) throw new ConflictException('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.$transaction(async (tx) => { 
            const business = await tx.business.create({
                data: {
                    name: businessName,
                    type: businessType,
                },
            });

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    businessId: business.id,
                    isAdmin: true,
                },
            });

            return { userId: user.id, businessId: business.id };
        });
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            businessId: user.businessId
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}