import { UserType } from "@prisma/client";
import { SetMetadata } from '@nestjs/common'


// ...roles put it from erray and transfer to toles, unpack
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);