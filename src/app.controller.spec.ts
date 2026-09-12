import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('should return "Hello World!"', () => {
    const appService = new AppService();
    const appController = new AppController(appService);

    expect(appController.getHello()).toBe('Hello World!');
  });
});
