import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RolEntity } from '../rol/rol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from '../rol/rol.repository';
import { AuthRepository } from './auth.repository';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { MessageDto } from '../common/message.dto';
import { RolNombre } from '../rol/rol.enum';
import { NuevoUsuarioDto } from './dto/nuevo-usuario.dto';
import { PayloadInterface } from './payload.interface';
import { LoginUsuarioDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { TokenDto } from './dto/token.dto';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(RolEntity)
        private readonly rolRepository: RolRepository,
        @InjectRepository(UsuarioEntity)
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) { }

    async getall(): Promise<UsuarioEntity[]> {
        const usuarios = await this.authRepository.find();
        if (!usuarios.length) throw new NotFoundException(new MessageDto('no hay usuarios en la lista'));
        return usuarios;
    }

    async create(dto: NuevoUsuarioDto): Promise<any> {
        const { nombreUsuario, email } = dto;
        const exists = await this.authRepository.findOne({ where: [{ nombreUsuario: nombreUsuario }, { email: email }] });
        if (exists) throw new BadRequestException(new MessageDto('ese usuario ya existe'));
        const rolUser = await this.rolRepository.findOne({ where: { rolNombre: RolNombre.USER } });
        if (!rolUser) throw new InternalServerErrorException(new MessageDto('los roles aún no han sido creados'));
        const user = this.authRepository.create(dto);
        user.roles = [rolUser];
        await this.authRepository.save(user);
        return new MessageDto('usuario creado');
    }

    async login(dto: LoginUsuarioDto): Promise<any> {
        const { nombreUsuario } = dto;
        const usuario = await this.authRepository.findOne({ where: [{ nombreUsuario: nombreUsuario }, { email: nombreUsuario }] });
        if (!usuario) return new UnauthorizedException(new MessageDto('no existe el usuario'));
        const passwordOK = await compare(dto.password, usuario.password);
        if (!passwordOK) return new UnauthorizedException(new MessageDto('contraseña errónea'));
        const payload: PayloadInterface = {
            id: usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            email: usuario.email,
            roles: usuario.roles.map(rol => rol.rolNombre as RolNombre)
        }
        const token = await this.jwtService.sign(payload);
        return { token };
    }

    async refresh(dto: TokenDto): Promise<any> {
        const usuario = await this.jwtService.decode(dto.token);
        const payload: PayloadInterface = {
            id: usuario[`id`],
            nombreUsuario: usuario[`nombreUsuario`],
            email: usuario[`email`],
            roles: usuario[`roles`]
        }
        const token = await this.jwtService.sign(payload);
        return { token };
    }
}
