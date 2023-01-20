import { Controller,Get,Req,Post,Delete,Put,Patch } from '@nestjs/common';


@Controller('premier')
export class PremierController {
    @Get()
    getPremier():string {
        console.log('GET');
        return('GET');
    }
    @Post()
    postPremier():string {
        console.log('POST');
        return('POST');
    }
    @Delete()
    deletePremier():string {
        console.log('DELETE');
        return('DELETE');
    }
    @Put()
    putPremier():string {
        console.log('PUT');
        return('PUT');
    }
    @Patch()
    patchPremier():string {
        console.log('PATCH');
        return('PATCH');
    }
}
