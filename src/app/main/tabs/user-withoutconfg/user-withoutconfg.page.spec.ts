import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserWithoutconfgPage } from './user-withoutconfg.page';

describe('UserWithoutconfgPage', () => {
  let component: UserWithoutconfgPage;
  let fixture: ComponentFixture<UserWithoutconfgPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserWithoutconfgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
