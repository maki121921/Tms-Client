import { TestBed } from '@angular/core/testing';
import { LiveSyncService } from './live-sync';

describe('LiveSyncService', () => {
  let service: LiveSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveSyncService],
    });

    service = TestBed.inject(LiveSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially be disconnected', () => {
    expect(service.connectionState()).toBe('disconnected');
  });
});