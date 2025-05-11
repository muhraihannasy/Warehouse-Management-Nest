import { HttpExceptionFilter } from './bad-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });
});
