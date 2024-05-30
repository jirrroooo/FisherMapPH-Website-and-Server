import { PartialType } from '@nestjs/mapped-types';
import { CreateBoundaryDto } from './create-boundary.dto';

export class UpdateBoundaryDto extends PartialType(CreateBoundaryDto) {}
