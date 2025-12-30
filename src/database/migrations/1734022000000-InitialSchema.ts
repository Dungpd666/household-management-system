import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1734022000000 implements MigrationInterface {
  name = 'InitialSchema1734022000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "username" character varying NOT NULL, "password_hash" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "role" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contributions" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "amount" integer NOT NULL, "due_date" date, "paid" boolean NOT NULL, "paid_at" date, "household_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca2b4f39eb9e32a61278c711f79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "households" ("id" SERIAL NOT NULL, "household_code" character varying NOT NULL, "address" character varying NOT NULL, "ward" character varying NOT NULL, "district" character varying NOT NULL, "city" character varying NOT NULL, "household_type" character varying NOT NULL, "username" character varying, "password_hash" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1e166b0691e1d0e0d724176b910" UNIQUE ("username"), CONSTRAINT "PK_2b1aef2640717132e9231aac756" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "persons" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "gender" character varying NOT NULL, "identification_number" character varying NOT NULL, "relationship_with_head" character varying, "occupation" character varying, "education_level" character varying, "migration_status" character varying, "is_deceased" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "household_id" integer, CONSTRAINT "UQ_e87d05175d27e125932dbbfacc7" UNIQUE ("identification_number"), CONSTRAINT "PK_74278d8812a049233ce41440ac7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "population_events" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "description" text, "event_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "person_id" integer, "handled_by" integer, CONSTRAINT "PK_a4b3489d20185c0f058042ab2ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" ADD CONSTRAINT "FK_c7f2fdb241b567871642f628aa2" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "persons" ADD CONSTRAINT "FK_34ad8ce5fe24f5fae6a42eff7c6" FOREIGN KEY ("household_id") REFERENCES "households"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "population_events" ADD CONSTRAINT "FK_ef604608fa43ec7bd35b18c046e" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "population_events" ADD CONSTRAINT "FK_d8fd88674978491894f8869ca9c" FOREIGN KEY ("handled_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "population_events" DROP CONSTRAINT "FK_d8fd88674978491894f8869ca9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "population_events" DROP CONSTRAINT "FK_ef604608fa43ec7bd35b18c046e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "persons" DROP CONSTRAINT "FK_34ad8ce5fe24f5fae6a42eff7c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" DROP CONSTRAINT "FK_c7f2fdb241b567871642f628aa2"`,
    );
    await queryRunner.query(`DROP TABLE "population_events"`);
    await queryRunner.query(`DROP TABLE "persons"`);
    await queryRunner.query(`DROP TABLE "households"`);
    await queryRunner.query(`DROP TABLE "contributions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
