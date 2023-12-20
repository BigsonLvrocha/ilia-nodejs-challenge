import { PartialType } from '@nestjs/mapped-types';
import { UserRequestDto } from './user.request.dto.js';

export class PatchUserRequestDto extends PartialType(UserRequestDto) {}
