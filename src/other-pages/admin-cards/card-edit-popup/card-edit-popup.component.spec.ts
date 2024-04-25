import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditPopupComponent } from './card-edit-popup.component';

describe('CardEditPopupComponent', () => {
  let component: CardEditPopupComponent;
  let fixture: ComponentFixture<CardEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEditPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
