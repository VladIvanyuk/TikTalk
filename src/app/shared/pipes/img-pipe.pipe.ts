import { Pipe, PipeTransform } from '@angular/core';
import { BASE_API_URL } from '../constants/constants';

@Pipe({
  name: 'imgPipe',
})
export class ImgPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) {
      return null;
    }
    return BASE_API_URL + value;
  }
}
