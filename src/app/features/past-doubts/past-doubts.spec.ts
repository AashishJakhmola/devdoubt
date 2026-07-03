import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDoubts } from './past-doubts';

describe('PastDoubts', () => {
  let component: PastDoubts;
  let fixture: ComponentFixture<PastDoubts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastDoubts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastDoubts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
