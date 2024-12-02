import { TestBed } from '@angular/core/testing';

import { BinddingService } from './bindding.service';

describe('BinddingService', () => {
  let service: BinddingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinddingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
