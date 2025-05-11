export class CreateProductDto {
  name: string;
  thumbnail: string;
  about: string;
  price: number;
  category_id: string;
  is_popular: boolean;
}
