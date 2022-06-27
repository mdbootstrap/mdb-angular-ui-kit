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

  it('should correctly set and remove link active state', () => {
    const links = [
      {
        id: 'test-link',
        active: false,
        section: 'test-section',
        detectChanges: () => {},
      },
    ];

    scrollspyService.scrollSpys = <any>[{ id: 'test-scrollspy', links }];

    expect(links[0].active).toBe(false);

    scrollspyService.updateActiveState('test-scrollspy', 'test-link');

    expect(links[0].active).toBe(true);

    scrollspyService.removeActiveState('test-scrollspy', 'test-link');
  });

  it('should correctly remove active state from all links in specific scrollspy', () => {
    const links = [
      {
        id: 'test-link-1',
        active: true,
        section: 'test-section-1',
        detectChanges: () => {},
      },
      {
        id: 'test-link-2',
        active: true,
        section: 'test-section-2',
        detectChanges: () => {},
      },
    ];

    scrollspyService.scrollSpys = <any>[{ id: 'test-scrollspy', links }];

    scrollspyService.removeActiveLinks('test-scrollspy');
  });
});
