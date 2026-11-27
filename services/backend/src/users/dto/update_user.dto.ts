import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'username must be at least 3 characters long' })
  username?: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'passwordHash must be at least 6 characters long' })
  passwordHash?: string;

  @IsString()
  @IsOptional()
  displayName?: string;
}
