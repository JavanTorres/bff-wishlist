import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpErrorHandler extends HttpException {
  private readonly _errorHandled: boolean;

  constructor(error: any, errorHandled = true, customMessage = '') {
    const response = error?.response || {};
    const status = response.status || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = response?.data?.message || error.message || 'Erro desconhecido.';
    
    const data = response?.data ? `, ${customMessage}, ${JSON.stringify(response.data)}` : '';
    const finalMessage = `${message}${data}`;


    super(finalMessage, status, { cause: error, description: message });
    
    this._errorHandled = errorHandled;
  }

  get errorHandled(): boolean {
    return this._errorHandled;
  }
}
