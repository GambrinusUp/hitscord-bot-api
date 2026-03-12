/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `published` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BotPermissionType" AS ENUM ('MANAGE_ROLES', 'MANAGE_CHANNELS', 'SEND_MESSAGES', 'READ_MESSAGES', 'ATTACH_FILES', 'JOIN_VOICE', 'RECORD_AUDIO', 'STREAM_SCREEN', 'MUTE_MEMBERS', 'KICK_MEMBERS', 'CREATE_LESSON', 'CHECK_ATTENDANCE', 'NOTIFY_CHANNEL');

-- CreateEnum
CREATE TYPE "BotChannelPermissionType" AS ENUM ('CAN_SEE', 'CAN_WRITE', 'CAN_NOTIFY', 'CAN_JOIN');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "published" SET NOT NULL,
ALTER COLUMN "authorId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "permissions" "BotPermissionType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotToken" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BotToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerBot" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "installedBy" TEXT,
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServerBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerBotChannelOverride" (
    "id" TEXT NOT NULL,
    "serverBotId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "permissions" "BotChannelPermissionType"[],

    CONSTRAINT "ServerBotChannelOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Server_ownerId_idx" ON "Server"("ownerId");

-- CreateIndex
CREATE INDEX "Channel_serverId_idx" ON "Channel"("serverId");

-- CreateIndex
CREATE INDEX "Bot_ownerId_idx" ON "Bot"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "BotToken_tokenHash_key" ON "BotToken"("tokenHash");

-- CreateIndex
CREATE INDEX "BotToken_botId_idx" ON "BotToken"("botId");

-- CreateIndex
CREATE INDEX "ServerBot_serverId_idx" ON "ServerBot"("serverId");

-- CreateIndex
CREATE INDEX "ServerBot_botId_idx" ON "ServerBot"("botId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerBot_botId_serverId_key" ON "ServerBot"("botId", "serverId");

-- CreateIndex
CREATE INDEX "ServerBotChannelOverride_serverBotId_idx" ON "ServerBotChannelOverride"("serverBotId");

-- CreateIndex
CREATE INDEX "ServerBotChannelOverride_channelId_idx" ON "ServerBotChannelOverride"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "ServerBotChannelOverride_serverBotId_channelId_key" ON "ServerBotChannelOverride"("serverBotId", "channelId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotToken" ADD CONSTRAINT "BotToken_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerBot" ADD CONSTRAINT "ServerBot_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerBot" ADD CONSTRAINT "ServerBot_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerBotChannelOverride" ADD CONSTRAINT "ServerBotChannelOverride_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerBotChannelOverride" ADD CONSTRAINT "ServerBotChannelOverride_serverBotId_fkey" FOREIGN KEY ("serverBotId") REFERENCES "ServerBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
