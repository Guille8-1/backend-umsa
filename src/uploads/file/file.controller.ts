import { Controller, Post, Res, UploadedFile } from "@nestjs/common";
import { Response } from "express";
import { FileService } from "./file.service";

@Controller('/file')
export class FileController {
    constructor(
        private readonly fileService: FileService
    ){}

    @Post('/image')
    imageUpload(@UploadedFile() fileBody, @Res() res: Response){
        return this.fileService.uploadPicture(res)
    }
}