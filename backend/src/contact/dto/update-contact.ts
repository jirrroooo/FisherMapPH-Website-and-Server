import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact';

export class UpdateContactDto extends PartialType(CreateContactDto) {}
