import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiografPage } from './biograf.page';

describe('BiografPage', () => {
  let component: BiografPage;
  let fixture: ComponentFixture<BiografPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BiografPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
