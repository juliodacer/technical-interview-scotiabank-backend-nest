import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Código no válido' })
  code: string;

  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'Nombre no válido' })
  name: string;

  @IsNotEmpty({ message: 'La descripción del producto es obligatorio' })
  @IsString({ message: 'Descripción no válida' })
  description: string;

  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio no válido' })
  price: number;

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsInt({ message: 'La categoría no es válida' })
  categoryId: number;

  @IsOptional()
  @IsBoolean({ message: 'El estado del producto no es válido' })
  state?: boolean;
}
