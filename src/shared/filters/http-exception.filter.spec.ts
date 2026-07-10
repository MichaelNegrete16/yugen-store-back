import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

function mockHost(): {
  host: ArgumentsHost;
  json: jest.Mock;
  status: jest.Mock;
} {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ method: 'GET', url: '/api/v1/x' }),
    }),
  } as unknown as ArgumentsHost;
  return { host, json, status };
}

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  it('normaliza una HttpException con mensaje string', () => {
    const { host, json, status } = mockHost();

    filter.catch(new BadRequestException('dato invalido'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: ['dato invalido'],
      }),
    );
  });

  it('preserva el array de mensajes de validacion', () => {
    const { host, json } = mockHost();
    const exception = new HttpException(
      { statusCode: 422, error: 'Unprocessable Entity', message: ['a', 'b'] },
      422,
    );

    filter.catch(exception, host);

    expect(json).toHaveBeenCalledWith({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: ['a', 'b'],
    });
  });

  it('convierte un error desconocido en 500 con mensaje generico', () => {
    const { host, json, status } = mockHost();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    filter.catch(new Error('boom'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: ['Internal server error'],
      }),
    );
    spy.mockRestore();
  });
});
