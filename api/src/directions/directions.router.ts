import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import {
  CreateDirectionDto,
  DirectionsSchema,
  DirectionsSchemaInput,
  UpdateDirectionDto,
} from './schema/directions.schema';
import { DirectionsService } from './directions.service';
import { z } from 'zod';

@Router()
export class DirectionsRouter {
  constructor(private readonly directionsService: DirectionsService) {}

  @Mutation({
    input: DirectionsSchemaInput,
    output: DirectionsSchema,
  })
  async create(@Input() createDirectionDto: CreateDirectionDto) {
    return this.directionsService.create(createDirectionDto);
  }

  @Query({
    input: z.object({ id: z.string() }),
    output: DirectionsSchema,
  })
  async findOne(@Input('id') id: string) {
    return this.directionsService.findOne(id);
  }

  @Query({
    output: z.array(DirectionsSchema),
  })
  async findAll() {
    return this.directionsService.findAll();
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: DirectionsSchema,
  })
  async update(@Input('id') id: string, @Input() updateDirectionDto: UpdateDirectionDto) {
    return this.directionsService.update(id, updateDirectionDto);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: DirectionsSchema,
  })
  async delete(@Input('id') id: string) {
    return this.directionsService.delete(id);
  }
}
