import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true',
  extra:
    process.env.DB_SSL === 'true'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Hash password for users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Seed Users
    console.log('Seeding users...');
    await AppDataSource.query(`
      INSERT INTO users (full_name, username, password_hash, email, phone, role, is_active)
      VALUES
        ('Nguyễn Văn An', 'admin', '${hashedPassword}', 'admin@example.com', '0901234567', 'admin', true),
        ('Trần Thị Bình', 'user1', '${hashedPassword}', 'user1@example.com', '0901234568', 'user', true),
        ('Lê Văn Cường', 'user2', '${hashedPassword}', 'user2@example.com', '0901234569', 'user', true)
      ON CONFLICT (username) DO NOTHING
    `);

    // Seed Households
    console.log('Seeding households...');
    await AppDataSource.query(`
      INSERT INTO households (household_code, address, ward, district, city, household_type, password, is_active)
      VALUES
        ('HH001', '123 Đường Lê Lợi', 'Phường 1', 'Quận 1', 'TP. Hồ Chí Minh', 'Thường trú', '${hashedPassword}', true),
        ('HH002', '456 Đường Nguyễn Huệ', 'Phường 2', 'Quận 1', 'TP. Hồ Chí Minh', 'Thường trú', '${hashedPassword}', true),
        ('HH003', '789 Đường Trần Hưng Đạo', 'Phường 3', 'Quận 1', 'TP. Hồ Chí Minh', 'Tạm trú', '${hashedPassword}', true),
        ('HH004', '321 Đường Hai Bà Trưng', 'Phường 4', 'Quận 3', 'TP. Hồ Chí Minh', 'Thường trú', '${hashedPassword}', true),
        ('HH005', '654 Đường Lý Thường Kiệt', 'Phường 5', 'Quận 10', 'TP. Hồ Chí Minh', 'Thường trú', '${hashedPassword}', true)
      ON CONFLICT DO NOTHING
    `);

    // Seed Persons
    console.log('Seeding persons...');
    await AppDataSource.query(`
      INSERT INTO persons (full_name, date_of_birth, gender, identification_number, relationship_with_head, occupation, education_level, migration_status, is_deceased, household_id)
      VALUES
        ('Nguyễn Văn Hùng', '1975-05-15', 'Nam', '001075001234', 'Chủ hộ', 'Kỹ sư', 'Đại học', 'Thường trú', null, 1),
        ('Trần Thị Lan', '1978-08-20', 'Nữ', '001078002345', 'Vợ', 'Giáo viên', 'Đại học', 'Thường trú', null, 1),
        ('Nguyễn Văn Nam', '2005-03-10', 'Nam', '001005003456', 'Con', 'Học sinh', 'Trung học phổ thông', 'Thường trú', null, 1),
        ('Lê Văn Minh', '1980-12-25', 'Nam', '001080004567', 'Chủ hộ', 'Bác sĩ', 'Thạc sĩ', 'Thường trú', null, 2),
        ('Phạm Thị Hoa', '1982-07-18', 'Nữ', '001082005678', 'Vợ', 'Y tá', 'Cao đẳng', 'Thường trú', null, 2),
        ('Lê Thị Mai', '2008-09-05', 'Nữ', '001008006789', 'Con', 'Học sinh', 'Trung học cơ sở', 'Thường trú', null, 2),
        ('Hoàng Văn Đức', '1990-01-30', 'Nam', '001090007890', 'Chủ hộ', 'Nhân viên văn phòng', 'Đại học', 'Tạm trú', null, 3),
        ('Vũ Thị Hương', '1992-11-12', 'Nữ', '001092008901', 'Vợ', 'Kế toán', 'Đại học', 'Tạm trú', null, 3),
        ('Đặng Văn Phong', '1968-06-08', 'Nam', '001068009012', 'Chủ hộ', 'Thợ mộc', 'Trung học phổ thông', 'Thường trú', null, 4),
        ('Ngô Thị Thu', '1970-04-22', 'Nữ', '001070010123', 'Vợ', 'Nội trợ', 'Trung học cơ sở', 'Thường trú', null, 4),
        ('Đặng Văn Tuấn', '1995-02-14', 'Nam', '001095011234', 'Con', 'Lập trình viên', 'Đại học', 'Thường trú', null, 4),
        ('Phan Văn Tài', '1985-10-03', 'Nam', '001085012345', 'Chủ hộ', 'Kinh doanh', 'Cao đẳng', 'Thường trú', null, 5),
        ('Lý Thị Ngọc', '1987-12-28', 'Nữ', '001087013456', 'Vợ', 'Nhân viên bán hàng', 'Trung học phổ thông', 'Thường trú', null, 5)
      ON CONFLICT (identification_number) DO NOTHING
    `);

    // Seed Contributions
    console.log('Seeding contributions...');
    await AppDataSource.query(`
      INSERT INTO contributions (type, amount, due_date, paid, paid_at, household_id)
      VALUES
        ('Phí vệ sinh', 50000, '2024-01-31', true, '2024-01-15', 1),
        ('Phí vệ sinh', 50000, '2024-02-29', true, '2024-02-10', 1),
        ('Phí vệ sinh', 50000, '2024-03-31', false, null, 1),
        ('Phí bảo vệ', 100000, '2024-01-31', true, '2024-01-15', 1),
        ('Phí vệ sinh', 50000, '2024-01-31', true, '2024-01-20', 2),
        ('Phí vệ sinh', 50000, '2024-02-29', true, '2024-02-15', 2),
        ('Phí vệ sinh', 50000, '2024-03-31', true, '2024-03-10', 2),
        ('Phí bảo vệ', 100000, '2024-01-31', true, '2024-01-20', 2),
        ('Phí vệ sinh', 50000, '2024-01-31', false, null, 3),
        ('Phí vệ sinh', 50000, '2024-02-29', false, null, 3),
        ('Hỗ trợ hộ nghèo', 200000, '2024-01-31', true, '2024-01-25', 4),
        ('Phí vệ sinh', 50000, '2024-01-31', true, '2024-01-18', 4),
        ('Phí vệ sinh', 50000, '2024-01-31', true, '2024-01-22', 5),
        ('Phí bảo vệ', 100000, '2024-01-31', true, '2024-01-22', 5),
        ('Phí vệ sinh', 50000, '2024-02-29', false, null, 5)
    `);

    // Seed Population Events
    console.log('Seeding population events...');
    await AppDataSource.query(`
      INSERT INTO population_events (type, description, event_date, person_id, handled_by)
      VALUES
        ('Khai sinh', 'Khai sinh cho trẻ em mới sinh', '2024-01-15', 3, 1),
        ('Chuyển đến', 'Chuyển đến từ tỉnh khác', '2024-02-01', 7, 2),
        ('Chuyển đi', 'Chuyển đi công tác', '2024-02-15', 11, 1),
        ('Thay đổi thông tin', 'Cập nhật nghề nghiệp', '2024-03-01', 5, 2),
        ('Thay đổi thông tin', 'Cập nhật trình độ học vấn', '2024-03-10', 6, 1)
    `);

    console.log('Seed data inserted successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
