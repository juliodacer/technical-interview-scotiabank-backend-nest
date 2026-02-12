import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class GetProductQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'La página debe ser un número' })
  @Min(1, { message: 'La página debe ser mayor a 0' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt({ message: 'El tamaño de página debe ser un número' })
  @Min(1, { message: 'El tamaño de página debe ser mayor a 0' })
  size?: number;

  @IsOptional()
  @IsString({ message: 'El término de búsqueda no es válido' })
  @MaxLength(200, { message: 'El término de búsqueda es demasiado largo' })
  q?: string;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser un texto' })
  category?: string;

  @IsOptional()
  @IsBooleanString({ message: 'El estado debe ser true o false' })
  state?: string;
}
