import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuporteComponent } from './suporte.component';

describe('SuporteComponent', () => {
  let component: SuporteComponent;
  let fixture: ComponentFixture<SuporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuporteComponent]
    });
    fixture = TestBed.createComponent(SuporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
