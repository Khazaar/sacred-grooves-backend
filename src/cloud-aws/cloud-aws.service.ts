import {
    Inject,
    Injectable,
    InternalServerErrorException,
    LoggerService,
} from "@nestjs/common";
import {
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
    S3,
} from "@aws-sdk/client-s3";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { v4 as uuid } from "uuid";
import { Multer } from "multer";
import * as fs from "fs";

@Injectable()
export class CloudAwsService {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {}

    public async uploadImageToS3AWS(file) {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            },
            region: "eu-central-1",
        });
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const pictureId = uuid();
        const objectKey = `${pictureId}`; //${file.originalname.split(".").pop()}`;
        const contentType = file.mimetype;
        const fileStream = fs.createReadStream(file.path);

        const uploadParams: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: objectKey,
            Body: fileStream,
            ACL: "public-read",
            // ContentType: contentType,
        };
        const imagerUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
        try {
            await s3.send(new PutObjectCommand(uploadParams));
            this.logger.log(`Image uploaded to S3: ${imagerUrl}`);
            return imagerUrl;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error);
        }
    }
}
