import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseErrorDto } from '../dtos';

const errorResponseDecorator = (status?: number) => ApiResponse({
        status: status ?? 400,
        schema: {
            title: `Error Response`,
            allOf: [
                { $ref: getSchemaPath(ResponseErrorDto) },
            ],
        },
    });
export const ResponseErrorSchema = (...statuses: number[]) => {
    const decorators = [];
    for (const status of new Set(statuses)) {
        decorators.push(errorResponseDecorator(status))
    }
  return applyDecorators(...decorators);
};