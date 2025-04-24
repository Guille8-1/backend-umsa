import { Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class FileService {
    constructor(

    ){}

    async uploadPicture(res: Response) {
        return res.json('uploading image from a service')
    }
}