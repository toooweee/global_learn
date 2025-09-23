import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { RegisterRequestsService } from './register-requests.service';
import {
  CompleteRegistrationDto,
  CompleteRegistrationSchemaInput,
  CreateRegisterRequestDto,
  RegisterRequestSchemaInput,
  RegisterRequestSchemaOutput,
  RegisterRequestsSchema,
  UpdateRegisterRequestStatusDto,
} from './register-request.schema';
import z from 'zod';

@Router()
export class RegisterRequestsRouter {
  constructor(private readonly registerRequestService: RegisterRequestsService) {}

  @Mutation({
    input: RegisterRequestSchemaInput,
    output: RegisterRequestSchemaOutput,
  })
  async createRegisterRequest(@Input() createRegisterRequestDto: CreateRegisterRequestDto) {
    return this.registerRequestService.create(createRegisterRequestDto);
  }

  @Query({
    output: z.array(RegisterRequestsSchema),
  })
  async findAllRegisterRequests() {
    return this.registerRequestService.findAll();
  }

  @Mutation({
    input: UpdateRegisterRequestStatusDto,
    output: RegisterRequestsSchema,
  })
  async updateRegisterRequestStatus(@Input() updateRegisterRequestDto: UpdateRegisterRequestStatusDto) {
    return this.registerRequestService.updateStatus(updateRegisterRequestDto);
  }

  @Mutation({
    input: CompleteRegistrationSchemaInput,
    output: z.object({
      userId: z.string(),
      companyId: z.string(),
    }),
  })
  async completeRegistration(@Input() dto: CompleteRegistrationDto) {
    return this.registerRequestService.completeRegistration(dto);
  }
}
