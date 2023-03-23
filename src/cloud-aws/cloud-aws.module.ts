import { Global, Module } from "@nestjs/common";
import { CloudAwsService } from "./cloud-aws.service";

@Global()
@Module({
    imports: [],
    providers: [CloudAwsService],
    exports: [CloudAwsService],
})
export class CloudAwsModule {}
