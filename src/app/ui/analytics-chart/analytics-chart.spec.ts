
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsChart } from './analytics-chart';

describe('AnalyticsChart', () => {
  let component: AnalyticsChart;
  let fixture: ComponentFixture<AnalyticsChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsChart],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsChart);

    fixture.componentRef.setInput('data', []);

    await fixture.whenStable();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

