export class BotTokenDto {
  botId: string;
  token: string;
  tokenHash: string;
  createdAt: Date;
  expiresAt?: Date | null;
}
