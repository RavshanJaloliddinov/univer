import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
  private readonly uploadsFolder = join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadsFolder();
  }

  private async ensureUploadsFolder(): Promise<void> {
    await fs.mkdir(this.uploadsFolder, { recursive: true });
  }

  async savePdf(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Faqat PDF fayl yuklashga ruxsat beriladi');
      }
  
      const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const fileName = `${uuidv4()}_${safeName}`;
      const filePath = join(this.uploadsFolder, fileName);
  
      await fs.writeFile(filePath, file.buffer);
      return fileName;
    } catch (error) {
      console.error('Fayl saqlash xatosi:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('PDF faylni saqlashda xatolik yuz berdi');
    }
  }
  


  // // ✅ Rasm faylni saqlash
  // async saveImage(file: Express.Multer.File): Promise<string> {
  //   try {
  //     const fileTypeModule: any = await import('file-type');
  //     const fileType = await fileTypeModule.fromBuffer(file.buffer);

  //     if (!fileType || !fileType.mime.startsWith('image/')) {
  //       throw new BadRequestException('Faqat rasm fayllarini yuklashga ruxsat beriladi (jpg, png, jpeg, webp)');
  //     }

  //     const extension = fileType.ext || 'jpg';
  //     const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
  //     const fileName = `${uuidv4()}_${safeName}.${extension}`;
  //     const filePath = join(this.uploadsFolder, fileName);

  //     await fs.writeFile(filePath, file.buffer);
  //     return fileName;
  //   } catch (error) {
  //     if (error instanceof BadRequestException) throw error;
  //     throw new InternalServerErrorException('Rasmni saqlashda xatolik yuz berdi');
  //   }
  // }

  // ✅ Faylni o‘chirish (PDF yoki rasm uchun umumiy)
  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = join(this.uploadsFolder, fileName);
      await fs.rm(filePath, { force: true });
    } catch {
      throw new InternalServerErrorException('Faylni o‘chirishda xatolik yuz berdi');
    }
  }

  // ✅ Fayl URL olish
  getFileUrl(fileName: string): string {
    return `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${fileName}`;
  }
}
