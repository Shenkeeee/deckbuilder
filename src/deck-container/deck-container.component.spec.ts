import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckContainerComponent } from './deck-container.component';

describe('DeckContainerComponent', () => {
  let component: DeckContainerComponent;
  let fixture: ComponentFixture<DeckContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeckContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
