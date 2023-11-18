import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserWithoutbtnPage } from './user-withoutbtn.page';

describe('UserWithoutbtnPage', () => {
  let component: UserWithoutbtnPage;
  let fixture: ComponentFixture<UserWithoutbtnPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserWithoutbtnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
