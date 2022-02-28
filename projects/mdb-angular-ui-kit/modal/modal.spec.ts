import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { MdbModalModule } from './modal.module';
import { MdbModalService } from './modal.service';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  template: `
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="close()"></button>
    </div>
    <div class="modal-body">
      <div id="main-view" *ngIf="mainView">
        <button id="main-view-toggler" class="btn btn-primary" (click)="setView(false)"></button>
        <p>main view</p>
      </div>
      <div id="not-main-view" *ngIf="!mainView">
        <button id="not-main-view-toggler" class="btn btn-primary" (click)="setView(true)"></button>
        <p>not main view</p>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="close()">Close</button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  `,
  providers: [MdbModalService],
})
class BasicModalComponent {
  constructor(public modal: MdbModalService) {}

  mainView = true;

  setView(isMain) {
    this.mainView = isMain;
  }
}

@NgModule({
  declarations: [BasicModalComponent],
  imports: [BrowserModule],
})
class TestModalModule {}

describe('MDB Modal', () => {
  let modal: MdbModalService;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<BasicModalComponent>;

  beforeEach(fakeAsync(() => {
    const module = TestBed.configureTestingModule({
      imports: [MdbModalModule, TestModalModule],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();
    fixture = module.createComponent(BasicModalComponent);
  }));

  beforeEach(inject(
    [MdbModalService, OverlayContainer],
    (mdbModal: MdbModalService, oc: OverlayContainer) => {
      modal = mdbModal;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should open a modal with a  specified component', () => {
    modal.open(BasicModalComponent);

    expect(overlayContainerElement.textContent).toContain('Modal title');

    const modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    expect(modalContainer).not.toBe(null);
  });

  it('should correctly add container classes', fakeAsync(() => {
    modal.open(BasicModalComponent, {
      containerClass: 'top',
    });

    fixture.detectChanges();
    tick(350);

    const modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    expect(modalContainer.classList.contains('top')).toBe(true);
  }));

  it('should correctly add modal classes', fakeAsync(() => {
    modal.open(BasicModalComponent, {
      modalClass: 'modal-top-right',
    });

    fixture.detectChanges();
    tick(350);

    const modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    const modalDialog = modalContainer.querySelector('.modal-dialog');
    expect(modalDialog.classList.contains('modal-top-right')).toBe(true);
  }));

  it('should close the modal on backdrop click', fakeAsync(() => {
    modal.open(BasicModalComponent);

    fixture.detectChanges();
    tick(350);

    let modalContainer = overlayContainerElement.querySelector(
      'mdb-modal-container'
    ) as HTMLElement;
    expect(modalContainer).not.toBe(null);

    const event = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    modalContainer.dispatchEvent(event);

    fixture.detectChanges();
    tick(700);

    modalContainer = overlayContainerElement.querySelector('mdb-modal-container') as HTMLElement;

    expect(modalContainer).toBe(null);
  }));

  it('should dont close the modal on mousedown inside modal, move mouse outside modal and mouseup', fakeAsync(() => {
    modal.open(BasicModalComponent);

    fixture.detectChanges();
    tick(350);

    let modalContainer = overlayContainerElement.querySelector(
      'mdb-modal-container'
    ) as HTMLElement;
    let modalContent = overlayContainerElement.querySelector('.modal-content') as HTMLElement;

    expect(modalContainer).not.toBe(null);
    expect(modalContent).not.toBe(null);

    const mousedownEvent = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    const mouseupEvent = new MouseEvent('mouseup', { clientX: 0, clientY: 0 });

    modalContent.dispatchEvent(mousedownEvent);
    modalContainer.dispatchEvent(mouseupEvent);

    fixture.detectChanges();
    tick(700);

    modalContainer = overlayContainerElement.querySelector('mdb-modal-container') as HTMLElement;
    modalContent = overlayContainerElement.querySelector('.modal-content') as HTMLElement;

    expect(modalContent).not.toBe(null);
    expect(modalContainer).not.toBe(null);
  }));

  it('should not close the modal on backdrop click if ignoreBackdropClick is set to true', fakeAsync(() => {
    modal.open(BasicModalComponent, {
      ignoreBackdropClick: true,
    });

    fixture.detectChanges();
    tick(350);

    let modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    expect(modalContainer).not.toBe(null);

    const event = new MouseEvent('mousedown');
    modalContainer.dispatchEvent(event);

    fixture.detectChanges();
    tick(700);

    modalContainer = overlayContainerElement.querySelector('mdb-modal-container');

    expect(modalContainer).not.toBe(null);
  }));

  it('should close on escape press if keyboard option is true', fakeAsync(() => {
    modal.open(BasicModalComponent, {
      keyboard: true,
    });

    fixture.detectChanges();
    tick(350);

    let modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    expect(modalContainer).not.toBe(null);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    modalContainer.dispatchEvent(event);

    fixture.detectChanges();
    tick(700);

    modalContainer = overlayContainerElement.querySelector('mdb-modal-container');

    expect(modalContainer).toBe(null);
  }));

  it('should not close on escape press if keyboard option is false', fakeAsync(() => {
    modal.open(BasicModalComponent, {
      keyboard: false,
    });

    let modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    expect(modalContainer).not.toBe(null);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    modalContainer.dispatchEvent(event);

    fixture.detectChanges();
    tick(700);

    modalContainer = overlayContainerElement.querySelector('mdb-modal-container');

    expect(modalContainer).not.toBe(null);
  }));

  it('should not close when click on btn inside modal', fakeAsync(() => {
    modal.open(BasicModalComponent);

    fixture.detectChanges();
    tick(700);

    let modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    let mainView = modalContainer.querySelector('#main-view');
    let notMainView = modalContainer.querySelector('#not-main-view');
    let mainViewToggler = modalContainer.querySelector('#main-view-toggler');
    let notMainViewToggler = modalContainer.querySelector('#not-main-view-toggler');

    expect(modalContainer).not.toBe(null);
    expect(mainView).not.toBe(null);
    expect(notMainView).toBe(null);
    expect(mainViewToggler).not.toBe(null);
    expect(notMainViewToggler).toBe(null);

    mainViewToggler.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();
    tick(700);

    modalContainer = overlayContainerElement.querySelector('mdb-modal-container');
    mainView = modalContainer.querySelector('#main-view');
    notMainView = modalContainer.querySelector('#not-main-view');
    mainViewToggler = modalContainer.querySelector('#main-view-toggler');
    notMainViewToggler = modalContainer.querySelector('#not-main-view-toggler');

    expect(modalContainer).not.toBe(null);
    expect(mainView).toBe(null);
    expect(notMainView).not.toBe(null);
    expect(mainViewToggler).toBe(null);
    expect(notMainViewToggler).not.toBe(null);
  }));
});
