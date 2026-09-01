
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';

import { App } from './app';
import { LiveSyncService } from './services/live-sync';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: LiveSyncService,
          useValue: {
            connect: () => {},
            events$: EMPTY,
            connectionState: () => 'disconnected',
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });
});

