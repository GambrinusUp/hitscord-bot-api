import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({ example: 'a3b0f2f0-9c4f-4b7a-9d6b-1234567890ab' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Ivan' })
  name: string;
}
