import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Locks } from './locks';

describe('Locks', () => {
  let component: Locks;
  let fixture: ComponentFixture<Locks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Locks],
    }).compileComponents();

    fixture = TestBed.createComponent(Locks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
