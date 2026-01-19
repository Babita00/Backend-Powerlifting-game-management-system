import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1768841038393 implements MigrationInterface {
    name = 'Init1768841038393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refreshToken" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "tokenHash" text NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "revokedAt" TIMESTAMP, "userAgent" character varying(255), "ip" character varying(64), CONSTRAINT "PK_be91607b0697b092c2bdff83b45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be91607b0697b092c2bdff83b4" ON "refreshToken" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3705833d94ef47d2c67d1955a7" ON "refreshToken" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_3cc52daf1b7010df3489894ffc" ON "refreshToken" ("updatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_65e2736a46518154b1c2fb5f2e" ON "refreshToken" ("tokenHash") `);
        await queryRunner.query(`CREATE INDEX "IDX_7008a2b0fb083127f60b5f4448" ON "refreshToken" ("userId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'official', 'player')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "firstName" character varying(255) NOT NULL, "lastName" character varying(255), "profileImage" text, "email" character varying(255) NOT NULL, "password" text NOT NULL, "phone" character varying(30), "age" integer, "weight" numeric(6,2), "gender" character varying(20), "role" "public"."users_role_enum" NOT NULL DEFAULT 'player', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_204e9b624861ff4a5b26819210" ON "users" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f5cbe00928ba4489cc7312573" ON "users" ("updatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "refreshToken" ADD CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshToken" DROP CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f5cbe00928ba4489cc7312573"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_204e9b624861ff4a5b26819210"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ffb1c0c8416b9fc6f907b743"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7008a2b0fb083127f60b5f4448"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65e2736a46518154b1c2fb5f2e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3cc52daf1b7010df3489894ffc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3705833d94ef47d2c67d1955a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be91607b0697b092c2bdff83b4"`);
        await queryRunner.query(`DROP TABLE "refreshToken"`);
    }

}
