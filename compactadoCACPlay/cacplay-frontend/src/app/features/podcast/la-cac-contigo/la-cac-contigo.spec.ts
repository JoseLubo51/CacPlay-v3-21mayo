import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaCacContigo } from './la-cac-contigo';

describe('LaCacContigo', () => {
  let component: LaCacContigo;
  let fixture: ComponentFixture<LaCacContigo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaCacContigo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaCacContigo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
