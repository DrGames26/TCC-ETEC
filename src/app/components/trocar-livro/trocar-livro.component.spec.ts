import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrocarLivroComponent } from './trocar-livro.component';

describe('TrocarLivroComponent', () => {
  let component: TrocarLivroComponent;
  let fixture: ComponentFixture<TrocarLivroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrocarLivroComponent]
    });
    fixture = TestBed.createComponent(TrocarLivroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
