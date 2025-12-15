import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  email: string;
  sub: string;
  businessId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'chave-muito-secreta-padrao', 
    });
  }

  async validate(payload: JwtPayload) {
    return { 
        userId: payload.sub, 
        email: payload.email, 
        businessId: payload.businessId 
    };
  }
}