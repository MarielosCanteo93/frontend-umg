import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Laboratories } from './laboratories';

describe('Laboratories', () => {
  let component: Laboratories;
  let fixture: ComponentFixture<Laboratories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Laboratories],
    }).compileComponents();

    fixture = TestBed.createComponent(Laboratories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
