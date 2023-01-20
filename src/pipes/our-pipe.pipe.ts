import { ArgumentMetadata, Injectable, PipeTransform,BadRequestException } from '@nestjs/common';
import { skillsDto } from 'src/todo/todo.skills.Dto';

@Injectable()
export class OurPipePipe implements PipeTransform {
  transform(value: { skills: string[] }, metadata: ArgumentMetadata): any {
    console.log(value);
    if (!value) throw new BadRequestException('Array Does not Exist');
    if (metadata.type === 'body') {
      return value.skills.map((val) => val.toUpperCase()).join('-');
    }
    return value.skills;
  }
}
