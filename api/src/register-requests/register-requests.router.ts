import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { RegisterRequestsService } from './register-requests.service';
import {
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
    return this.registerRequestService.createRegisterRequest(createRegisterRequestDto);
  }

  @Query({
    output: z.array(RegisterRequestsSchema),
  })
  async findAllRegisterRequests() {
    return this.registerRequestService.findAllRegisterRequests();
  }

  @Mutation({
    input: UpdateRegisterRequestStatusDto,
    output: RegisterRequestsSchema,
  })
  async updateRegisterRequestStatus(@Input() updateRegisterRequestDto: UpdateRegisterRequestStatusDto) {
    return this.registerRequestService.updateRegisterRequestStatus(updateRegisterRequestDto);
  }
}
