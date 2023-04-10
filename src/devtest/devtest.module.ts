import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";

@Module({
    imports: [
        MulterModule.register({
            dest: "./uploads", // directory to store uploaded files
        }),
    ],
})
export class DevtestModule {}
