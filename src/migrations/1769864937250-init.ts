import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1769864937250 implements MigrationInterface {
    name = 'Init1769864937250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_competitiontype_enum" AS ENUM('Male', 'Female', 'Open')`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "description" text, "venue" character varying(255) NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE, "weightCategories" text array NOT NULL DEFAULT '{}', "competitionType" "public"."events_competitiontype_enum" NOT NULL, "status" "public"."events_status_enum" NOT NULL DEFAULT 'upcoming', "organizerPhoneNumber" character varying(30), "eventImage" text, "otherOfficial" jsonb, "coordinator" jsonb, "createdById" uuid NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40731c7151fe4be3116e45ddf7" ON "events" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3911711b8afdd783fe98b7f979" ON "events" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_caad021bd1f4161811a0d30b23" ON "events" ("updatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_03dcebc1ab44daa177ae9479c4" ON "events" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_1ac6ceb59509dff38bde4549ca" ON "events" ("competitionType") `);
        await queryRunner.query(`CREATE INDEX "IDX_89790086fbc0aa80d8cf577285" ON "events" ("startDate") `);
        await queryRunner.query(`CREATE TABLE "event_prizes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "amount" numeric(12,2) NOT NULL, "eventId" uuid, CONSTRAINT "PK_be021a04a42a4fce9160a80fb91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be021a04a42a4fce9160a80fb9" ON "event_prizes" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0c2bd85430ee7b9e3de536f6c" ON "event_prizes" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_6d7302347f9d0893990bc1f43b" ON "event_prizes" ("updatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_5326301347e40cc003c35a2fd7" ON "event_prizes" ("eventId") `);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_2fb864f37ad210f4295a09b684d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_prizes" ADD CONSTRAINT "FK_5326301347e40cc003c35a2fd75" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_prizes" DROP CONSTRAINT "FK_5326301347e40cc003c35a2fd75"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_2fb864f37ad210f4295a09b684d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5326301347e40cc003c35a2fd7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d7302347f9d0893990bc1f43b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0c2bd85430ee7b9e3de536f6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be021a04a42a4fce9160a80fb9"`);
        await queryRunner.query(`DROP TABLE "event_prizes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_89790086fbc0aa80d8cf577285"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ac6ceb59509dff38bde4549ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03dcebc1ab44daa177ae9479c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_caad021bd1f4161811a0d30b23"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3911711b8afdd783fe98b7f979"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40731c7151fe4be3116e45ddf7"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."events_competitiontype_enum"`);
    }

}
