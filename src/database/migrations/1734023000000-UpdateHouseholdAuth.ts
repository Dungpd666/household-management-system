import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateHouseholdAuth1734023000000 implements MigrationInterface {
    name = 'UpdateHouseholdAuth1734023000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Xóa cột username vì dùng household_code làm username
        await queryRunner.query(`ALTER TABLE "households" DROP COLUMN IF EXISTS "username"`);

        // Đổi tên password_hash thành password
        await queryRunner.query(`ALTER TABLE "households" RENAME COLUMN "password_hash" TO "password"`);

        // Thêm cột is_active
        await queryRunner.query(`ALTER TABLE "households" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback: xóa is_active
        await queryRunner.query(`ALTER TABLE "households" DROP COLUMN "is_active"`);

        // Đổi lại tên password thành password_hash
        await queryRunner.query(`ALTER TABLE "households" RENAME COLUMN "password" TO "password_hash"`);

        // Thêm lại cột username
        await queryRunner.query(`ALTER TABLE "households" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "households" ADD CONSTRAINT "UQ_households_username" UNIQUE ("username")`);
    }
}
