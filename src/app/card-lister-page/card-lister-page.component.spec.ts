import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardListerPageComponent } from './card-lister-page.component';

describe('CardListerPageComponent', () => {
  let component: CardListerPageComponent;
  let fixture: ComponentFixture<CardListerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardListerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
