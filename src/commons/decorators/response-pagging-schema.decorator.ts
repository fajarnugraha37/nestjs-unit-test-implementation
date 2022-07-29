import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponsePaggingDto } from '../dtos';

export const ResponsePaggingSchema = <TModel extends Type<any>>(
  model: TModel, statusCode?: number,
) => {
  return applyDecorators(
    ApiOkResponse({
      status: statusCode ?? 200,
      schema: {
        title: `Pagination of ${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ResponsePaggingDto) },
          {
            properties: {
              result: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};