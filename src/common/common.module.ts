import { Module } from '@nestjs/common';
import { uuidProvider } from './common.uuidProvider';

@Module({
    providers:[uuidProvider],
    exports:[uuidProvider],
})
export class CommonModule {
}
