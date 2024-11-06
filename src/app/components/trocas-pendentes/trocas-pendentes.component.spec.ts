import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrocasPendentesComponent } from './trocas-pendentes.component';

describe('TrocasPendentesComponent', () => {
  let component: TrocasPendentesComponent;
  let fixture: ComponentFixture<TrocasPendentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrocasPendentesComponent]
    });
    fixture = TestBed.createComponent(TrocasPendentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
