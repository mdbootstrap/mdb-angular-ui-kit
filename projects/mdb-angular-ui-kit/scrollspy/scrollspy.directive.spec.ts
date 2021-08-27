import { DOCUMENT } from '@angular/common';
import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';
import { MdbScrollspyDirective } from './scrollspy.directive';
import { MdbScrollspyService } from './scrollspy.service';

describe('ScrollspyDirective', () => {
  let scrollspy: MdbScrollspyDirective;
  let scrollspyService: MdbScrollspyService;
  const cdRefMock = {
    detectChanges: jest.fn(),
  };

  beforeEach(() => {
    scrollspyService = new MdbScrollspyService();
    scrollspy = new MdbScrollspyDirective(scrollspyService);
  });

  it('should add new scrollspy to service after content init', () => {
    const spy = jest.spyOn(scrollspyService, 'addScrollspy');
    scrollspy.ngAfterContentInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove scrollspy from service on destroy', () => {
    const spy = jest.spyOn(scrollspyService, 'removeScrollspy');
    scrollspy.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit activeLinkChange event when active link change', () => {
    const spy = jest.spyOn(scrollspy.activeLinkChange, 'emit');
    const document = DOCUMENT;
    const link = new MdbScrollspyLinkDirective(cdRefMock as any, document);
    scrollspy.ngOnInit();
    scrollspyService.setActiveLink(link);
    expect(spy).toHaveBeenCalled();
  });
});
