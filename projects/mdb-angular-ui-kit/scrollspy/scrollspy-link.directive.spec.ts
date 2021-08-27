import { MdbScrollspyLinkDirective } from './scrollspy-link.directive';

describe('ScrollspyDirective', () => {
  let scrollspyLink: MdbScrollspyLinkDirective;
  const cdRefMock = {
    detectChanges: jest.fn(),
  };

  beforeEach(() => {
    scrollspyLink = new MdbScrollspyLinkDirective(cdRefMock as any, document);
  });

  it('should get section with id equal to link id', () => {
    scrollspyLink.id = 'scrollspy';
    const div = document.createElement('div');
    div.setAttribute('id', scrollspyLink.id);
    document.body.appendChild(div);

    scrollspyLink.ngOnInit();

    expect(scrollspyLink.section).toBe(div);
  });

  it('should activate change detection cycle', () => {
    scrollspyLink.detectChanges();
    expect(cdRefMock.detectChanges).toHaveBeenCalled();
  });
});
