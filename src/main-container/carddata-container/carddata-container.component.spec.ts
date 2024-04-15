import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarddataContainerComponent } from './carddata-container.component';

describe('CarddataContainerComponent', () => {
  let component: CarddataContainerComponent;
  let fixture: ComponentFixture<CarddataContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarddataContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarddataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
