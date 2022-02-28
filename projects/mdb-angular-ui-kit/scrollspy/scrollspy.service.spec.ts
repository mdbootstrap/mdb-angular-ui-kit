import { TestBed, inject } from '@angular/core/testing';
import { QueryList } from '@angular/core';

import { MdbScrollspyService } from './scrollspy.service';
import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';

describe('ScrollspyService', () => {
  let scrollspyService: MdbScrollspyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdbScrollspyService],
      teardown: { destroyAfterEach: false },
    });

    inject([MdbScrollspyService], (service: MdbScrollspyService) => {
      scrollspyService = service;
    })();
  });

  it('should add new scrollspy to the list', () => {
    const links = new QueryList<MdbScrollspyLinkDirective>();
    const id = 'test-scrollspy';
    scrollspyService.addScrollspy({ id, links });

    expect(scrollspyService.scrollSpys).toEqual([{ id: 'test-scrollspy', links }]);
  });

  it('should remove scrollspy from the list', () => {
    const links = new QueryList<MdbScrollspyLinkDirective>();
    const id = 'test-scrollspy';
    scrollspyService.addScrollspy({ id, links });

    expect(scrollspyService.scrollSpys).toEqual([{ id: 'test-scrollspy', links }]);

    scrollspyService.removeScrollspy('test-scrollspy');

    expect(scrollspyService.scrollSpys).toEqual([]);
  });
});
