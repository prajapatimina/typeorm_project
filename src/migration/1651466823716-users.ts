import { MigrationInterface, QueryRunner } from 'typeorm';

export class users1651466823716 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "testcolumn" string`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`ALTER TABLE "user" DROP COLUMN "testcolumn"`);
    }
}
