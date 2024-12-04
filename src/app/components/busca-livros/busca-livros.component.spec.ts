import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscaLivrosComponent } from './busca-livros.component';

describe('BuscaLivrosComponent', () => {
  let component: BuscaLivrosComponent;
  let fixture: ComponentFixture<BuscaLivrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscaLivrosComponent]
    });
    fixture = TestBed.createComponent(BuscaLivrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
