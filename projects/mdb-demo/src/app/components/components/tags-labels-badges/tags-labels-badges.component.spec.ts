import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsLabelsBadgesComponent } from './tags-labels-badges.component';

describe('TagsLabelsBadgesComponent', () => {
  let component: TagsLabelsBadgesComponent;
  let fixture: ComponentFixture<TagsLabelsBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsLabelsBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsLabelsBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
