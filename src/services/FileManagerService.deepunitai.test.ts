import { jest } from '@jest/globals';

import FileManagerService from './FileManagerService';

describe('FileManagerService', () => {
  const instance = FileManagerService();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    expect(instance).toBeTruthy();
  });
});
