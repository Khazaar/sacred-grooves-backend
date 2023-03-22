import {
    BadRequestException,
    Controller,
    Inject,
    InternalServerErrorException,
    LoggerService,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CloudAwsService } from "../cloud-aws/cloud-aws.service";
import { Multer } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("devtest")
export class DevtestController {
    constructor(
        private readonly cloudAwsService: CloudAwsService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    @Post("uploadPicture")
    @UseInterceptors(FileInterceptor("file"))
    public async uploadPicture(@UploadedFile() file) {
        const maxSizeInBytes = 3 * 1024 * 1024; // 2 MB
        if (file.size > maxSizeInBytes) {
            throw new BadRequestException(
                "File size exceeds the maximum allowed size",
            );
        }
        try {
            // const buffer = await fs.readFile(
            //     "test/images/Life_Disorder_cover.jpeg",
            // );
            console.log(file);
            //return this.cloudAwsService.uploadImageToS3AWS(file);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
