import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
} from "@nestjs/common";
import { S3 } from "aws-sdk";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { v4 as uuid } from "uuid";
import { Multer } from "multer";
import * as fs from "fs";

@Injectable()
export class CloudAwsService {
    private s3: S3;
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {
        this.s3 = new S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        });
    }
    public async uploadImageToS3AWS(file) {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const pictureId = uuid();
        const objectKey = `${pictureId}-${file.originalname}`;
        const contentType = file.mimetype;
        const fileStream = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: fileStream,
            ContentType: contentType,
        };
        const imagerUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
        try {
            await this.s3.upload(uploadParams).promise();
            this.logger.log(`Image uploaded to S3: ${imagerUrl}`);
            return imagerUrl;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
}
