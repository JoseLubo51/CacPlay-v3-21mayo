import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoGrilla } from './contenido-grilla';

describe('ContenidoGrilla', () => {
  let component: ContenidoGrilla;
  let fixture: ComponentFixture<ContenidoGrilla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidoGrilla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoGrilla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
