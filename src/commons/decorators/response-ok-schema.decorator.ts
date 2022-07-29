import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseOkDto } from '../dtos';

export const ResponseOkSchema = <TModel extends Type<any>>(
  model: TModel, statusCode?: number,
) => {
  return applyDecorators(
    ApiOkResponse({
      status: statusCode ?? 200,
      schema: {
        title: `Response of ${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ResponseOkDto) },
          {
            properties: {
              result: {
                $ref: getSchemaPath(model)
              },
            },
          },
        ],
      },
    }),
  );
};