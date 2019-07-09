import { TestBed, inject } from '@angular/core/testing';

import { SailsClientService } from './sails-client.service';

describe('SailsClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SailsClientService]
    });
  });

  it('should be created', inject([SailsClientService], (service: SailsClientService) => {
    expect(service).toBeTruthy();
  }));
});
