import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống.' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống. Vui lòng nhập chuỗi không chứa dấu cách, ví dụ: admin01.' })
  userName: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoặc số. Ví dụ: admin123.' })
  passWordHash: string;

  @IsString()
  @IsNotEmpty()
  role: string; //"admin", "superadmin"

  @IsEmail({}, { message: 'Email không hợp lệ. Định dạng đúng ví dụ: tennguoidung@tenmien.com.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ. Vui lòng nhập số di động Việt Nam dài 10 chữ số, bắt đầu bằng 0. Ví dụ: 0912345678.' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống.' })
  phone: string;
}
