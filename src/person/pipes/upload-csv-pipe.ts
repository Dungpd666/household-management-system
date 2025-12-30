import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UploadCsvPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException('Please select file to upload!');
    }
    const fileSize = 100000; // 100kb
    if (value.size > fileSize) {
      throw new BadRequestException('File too large! Only under 100KB allowed');
    }
    if (!value.mimetype.match(/(csv|vnd.ms-excel)/)) {
      throw new BadRequestException(
        'Invalid format! Only CSV files are accepted.',
      );
    }
    return value;
  }
}
