import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToPersons1735650000000 implements MigrationInterface {
  name = 'AddEmailToPersons1735650000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists before adding
    const table = await queryRunner.getTable('persons');
    const emailColumn = table?.columns.find((col) => col.name === 'email');

    if (!emailColumn) {
      await queryRunner.query(
        `ALTER TABLE "persons" ADD "email" character varying NULL`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "persons" DROP COLUMN "email"`);
  }
}

