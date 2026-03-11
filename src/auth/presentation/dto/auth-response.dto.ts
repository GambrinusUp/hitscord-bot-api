import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto.js';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ type: ProfileDto })
  user: ProfileDto;
}
