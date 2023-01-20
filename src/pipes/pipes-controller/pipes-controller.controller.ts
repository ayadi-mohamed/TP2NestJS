import { Controller } from '@nestjs/common';
import { Delete, Get,Patch, Post, Put,Body,Param,NotFoundException,Query,ParseArrayPipe,HttpStatus } from '@nestjs/common';
import { OurPipePipe } from '../our-pipe.pipe';

@Controller('pipes-controller')
export class PipesControllerController {
      //Pipes
      @Post('test')
    async pipeSkills(@Body(OurPipePipe) body) {
          console.log(body)
      return body;
  }
  



}
