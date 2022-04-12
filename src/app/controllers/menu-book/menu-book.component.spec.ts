import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBookComponent } from './menu-book.component';

describe('MenuBookComponent', () => {
  let component: MenuBookComponent;
  let fixture: ComponentFixture<MenuBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
