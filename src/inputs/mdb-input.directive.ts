
import { isPlatformBrowser } from '@angular/common';
import {
    Directive,
    ElementRef,
    Renderer2,
    Input,
    AfterViewInit,
    HostListener,
    PLATFORM_ID,
    Inject,
    AfterViewChecked,
    OnInit
} from '@angular/core';

@Directive({
    selector: '[mdbInputDirective]'
})
export class MdbInputDirective implements AfterViewChecked, OnInit, AfterViewInit {

    @Input('mdbInputDirective') mdbInputDirective: MdbInputDirective;
    @Input('placeholder') public placeholder: string;
    @Input('minLength') public minLength: string = '0';
    @Input('maxLength') public maxLength: string = '524288';
    @Input('customRegex') customRegex: any;
    @Input('mdbValidate') mdbValidate: boolean = true;
    @Input('focusCheckbox') focusCheckbox: boolean = true;
    @Input('focusRadio') focusRadio: boolean = true;

    isBrowser: any = false;
    isClicked: boolean = false;

    public wrongTextContainer: any;
    public rightTextContainer: any;
    public el: ElementRef | any = null;
    public elLabel: ElementRef | any = null;
    public elIcon: Element | any = null;


    @HostListener('click') onclick() {
        this.renderer.addClass(this.elLabel, 'active');
        this.isClicked = true;
    }

    @HostListener('blur') onBlur() {
        if (this.el.nativeElement.value === '') {
            this.renderer.removeClass(this.elLabel, 'active');
        }
        this.isClicked = false;

        // Validation:
        if (this.mdbValidate) {
            const inputType = this.el.nativeElement.type;

            if (inputType === 'email') {
                if (this.customRegex) {
                    const re = new RegExp(this.el.nativeElement.getAttribute('customRegex'));
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        /*tslint:disable:max-line-length*/
                    } else if (re.test(this.el.nativeElement.value) && this.el.nativeElement.value.length >= this.minLength && this.el.nativeElement.value.length <= this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                    } else if (!re.test(this.el.nativeElement.value) || this.el.nativeElement.value.length < this.minLength || this.el.nativeElement.value.length > this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                    }

                } else if (!this.customRegex) {
                    /*tslint:disable:max-line-length*/
                    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    } else if (re.test(this.el.nativeElement.value) && this.el.nativeElement.value.length >= this.minLength && this.el.nativeElement.value.length <= this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                    } else if (!re.test(this.el.nativeElement.value) || this.el.nativeElement.value.length < this.minLength || this.el.nativeElement.value.length > this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                    }
                }


            } else if (inputType === 'password') {
                if (this.customRegex) {
                    const re = new RegExp(this.el.nativeElement.getAttribute('customRegex'));
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (this.el.nativeElement.value.match(re) && this.el.nativeElement.value.length >= this.minLength && this.el.nativeElement.value.length <= this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (!this.el.nativeElement.value.match(re) || this.el.nativeElement.value.length < this.minLength || this.el.nativeElement.value.length > this.maxLength) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                } else if (!this.customRegex) {
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (this.el.nativeElement.value.match(/^(?=(.*\d){1})(.*\S)(?=.*[a-zA-Z\S])[0-9a-zA-Z\S]/g) && this.el.nativeElement.value.length >= this.minLength && this.el.nativeElement.value.length <= this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (!this.el.nativeElement.value.match(/^(?=(.*\d){1})(.*\S)(?=.*[a-zA-Z\S])[0-9a-zA-Z\S]/g) || this.el.nativeElement.value.length < this.minLength || this.el.nativeElement.value.length > this.maxLength) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                }

            } else if (inputType === 'text') {
                if (this.customRegex) {
                    const re = new RegExp(this.el.nativeElement.getAttribute('customRegex'));
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (this.el.nativeElement.value.match(re) && this.el.nativeElement.value.length >= this.minLength && this.el.nativeElement.value.length <= this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (!this.el.nativeElement.value.match(re) || this.el.nativeElement.value.length < this.minLength || this.el.nativeElement.value.length > this.maxLength) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                } else if (!this.customRegex) {
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (this.el.nativeElement.value.match(/^[a-zA-Z0-9]+$/g) && this.el.nativeElement.value.length >= this.minLength && this.el.nativeElement.value.length <= this.maxLength) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                        // tslint:disable-next-line:max-line-length
                    } else if (!this.el.nativeElement.value.match(/^[a-zA-Z0-9]+$/g) || this.el.nativeElement.value.length < this.minLength || this.el.nativeElement.value.length > this.maxLength) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                }

            } else if (inputType === 'submit') {
                for (let i = 0; i < this.el.nativeElement.parentElement.length; i++) {
                    if (this.el.nativeElement.parentElement[i].value == null || this.el.nativeElement.parentElement[i].value === '') {
                        this.renderer.addClass(this.el.nativeElement.parentElement[i], 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement.parentElement[i], 'counter-success');

                    } else if (!this.el.nativeElement.parentElement[i].value == null) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                }

            } else if (inputType === 'tel') {
                if (this.customRegex) {
                    const re = new RegExp(this.el.nativeElement.getAttribute('customRegex'));
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    } else if (re.test(this.el.nativeElement.value) && this.el.nativeElement.value.length >= 8 && this.el.nativeElement.value.length <= 20) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                    } else if (!re.test(this.el.nativeElement.value) || this.el.nativeElement.value.length > 20) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                } else if (!this.customRegex) {
                    const re = /^(1[ \-\+]{0,3}|\+1[ -\+]{0,3}|\+1|\+)?((\(\+?1-[2-9][0-9]{1,2}\))|(\(\+?[2-8][0-9][0-9]\))|(\(\+?[1-9][0-9]\))|(\(\+?[17]\))|(\([2-9][2-9]\))|([ \-\.]{0,3}[0-9]{2,4}))?([ \-\.][0-9])?([ \-\.]{0,3}[0-9]{2,4}){2,3}$/;
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    } else if (re.test(this.el.nativeElement.value) && this.el.nativeElement.value.length >= 8 && this.el.nativeElement.value.length <= 20) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                    } else if (!re.test(this.el.nativeElement.value) || this.el.nativeElement.value.length > 20) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                }


            } else if (inputType === 'number') {
                if (this.customRegex) {
                    const re = new RegExp(this.el.nativeElement.getAttribute('customRegex'));
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    } else if (re.test(this.el.nativeElement.value) && this.el.nativeElement.value.length > 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                    } else if (!re.test(this.el.nativeElement.value) || this.el.nativeElement.value.length < 1) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                } else if (!this.customRegex) {
                    const re = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/;
                    if (this.el.nativeElement.length === 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    } else if (re.test(this.el.nativeElement.value) && this.el.nativeElement.value.length > 0) {
                        this.renderer.removeClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.addClass(this.el.nativeElement, 'counter-success');
                    } else if (!re.test(this.el.nativeElement.value) || this.el.nativeElement.value.length < 1) {
                        this.renderer.addClass(this.el.nativeElement, 'counter-danger');
                        this.renderer.removeClass(this.el.nativeElement, 'counter-success');
                    }
                }
            }
        }

    }


    @HostListener('change') onchange() {
        this.checkValue();
    }


    constructor(el: ElementRef, private renderer: Renderer2, @Inject(PLATFORM_ID) platformId: string) {
        this.el = el;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit() {
        if (this.mdbValidate) {
            // Inititalise a new <span> wrong/right elements and render it below the host component.
            // this.wrongTextContainer = this.renderer.createElement(this.el.nativeElement.parentElement, 'span');
            this.wrongTextContainer = this.renderer.createElement('span');
            this.renderer.addClass(this.wrongTextContainer, 'inputVal');
            this.renderer.addClass(this.wrongTextContainer, 'text-danger');
            this.renderer.appendChild(this.el.nativeElement.parentElement, this.wrongTextContainer);
            const textWrong = this.el.nativeElement.getAttribute('data-error');
            this.wrongTextContainer.innerHTML = (textWrong ? textWrong : 'wrong');
            this.renderer.setStyle(this.wrongTextContainer, 'visibility', 'hidden');

            // this.rightTextContainer = this.renderer.createElement(this.el.nativeElement.parentElement, 'span');
            this.rightTextContainer = this.renderer.createElement('span');
            this.renderer.addClass(this.rightTextContainer, 'inputVal');
            this.renderer.addClass(this.rightTextContainer, 'text-success');
            this.renderer.appendChild(this.el.nativeElement.parentElement, this.rightTextContainer);
            const textSuccess = this.el.nativeElement.getAttribute('data-success');
            this.rightTextContainer.innerHTML = (textSuccess ? textSuccess : 'success');
            this.renderer.setStyle(this.rightTextContainer, 'visibility', 'hidden');
        }

    }

    ngAfterViewInit() {
        const type = this.el.nativeElement.type;
        if (this.focusCheckbox && type === 'checkbox') {
            this.renderer.addClass(this.el.nativeElement, 'onFocusSelect');
        }

        if (this.focusRadio && type === 'radio') {
            this.renderer.addClass(this.el.nativeElement, 'onFocusSelect');
        }
    }

    ngAfterViewChecked() {
        this.initComponent();
        this.checkValue();
        // tslint:disable-next-line:max-line-length
        if (this.el.nativeElement.tagName === 'MDB-COMPLETER' && this.el.nativeElement.getAttribute('ng-reflect-model') == null && !this.isClicked) {
            this.renderer.removeClass(this.elLabel, 'active');
        }
    }

    public initComponent(): void {
        let inputId;
        let inputP;
        if (this.isBrowser) {
            try {
                inputId = this.el.nativeElement.id;
            } catch (err) { }

            try {
                inputP = this.el.nativeElement.parentNode;
            } catch (err) { }

            this.elLabel = inputP.querySelector('label[for="' + inputId + '"]') || inputP.querySelector('label');
            if (this.elLabel && this.el.nativeElement.value !== '') {
                this.renderer.addClass(this.elLabel, 'active');
            }

            this.elIcon = inputP.querySelector('i') || false;

            if (this.elIcon) {
                this.renderer.addClass(this.elIcon, 'active');
            }
        }
    }



    private checkValue(): void {
        let value = '';
        if (this.elLabel != null) {
            value = this.el.nativeElement.value || '';
            if (value === '') {
                this.renderer.removeClass(this.elLabel, 'active');
                if (this.elIcon) {
                    this.renderer.removeClass(this.elIcon, 'active');
                }
                // tslint:disable-next-line:max-line-length
            } if (value === '' && this.isClicked ||
                value === '' && this.el.nativeElement.placeholder ||
                value === '' && this.el.nativeElement.attributes.placeholder
            ) {
                this.renderer.addClass(this.elLabel, 'active');
            }
            if (this.el.nativeElement.getAttribute('ng-reflect-model') != null) {
                if (this.el.nativeElement.tagName === 'MDB-COMPLETER' && this.el.nativeElement.getAttribute('ng-reflect-model').length !== 0) {
                    this.renderer.addClass(this.elLabel, 'active');
                }
            }
        }
    }
}
