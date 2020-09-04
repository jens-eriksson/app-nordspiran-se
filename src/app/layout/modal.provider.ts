import { ConfirmComponent } from './confirm/confirm.component';
import { BehaviorSubject } from 'rxjs';
import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { ModalComponent } from './modal/modal.component';

@Injectable()
export class ModalProvider {
    private placeholder: ViewContainerRef;
    public isOpen: BehaviorSubject<boolean>;

    constructor(private resolver: ComponentFactoryResolver) {
        this.isOpen = new BehaviorSubject<boolean>(false);
    }

    public open(component, maxWidth?, maxHeight?): number {
        const modalFactory = this.resolver.resolveComponentFactory(ModalComponent);
        const modal = this.placeholder.createComponent(modalFactory).instance;
        modal.content = component;
        if (maxWidth) {
            modal.maxWidth = maxWidth;
        }
        if (maxHeight) {
            modal.maxHeight = maxHeight;
        }
        const index = this.placeholder.length - 1;
        modal.close = () => {
            this.close(index);
        };
        if (this.placeholder.length > 0) {
            this.isOpen.next(true);
        }
        return index;
    }

    public close(index: number) {
        this.placeholder.remove(index);
        if (this.placeholder.length === 0) {
            this.isOpen.next(false);
        }
    }

    public confirm(message: string, confirmCallback, cancelCallback?): number {
        const confirmFactory = this.resolver.resolveComponentFactory(ConfirmComponent);
        const confirm = this.placeholder.createComponent(confirmFactory).instance;
        confirm.message = message;
        const index = this.placeholder.length - 1;
        confirm.cancel = () => {
            if (cancelCallback) {
                cancelCallback();
            }
            this.close(index);
        };
        confirm.confirm = () => {
            confirmCallback();
            this.close(index);
        };
        if (this.placeholder.length > 0) {
            this.isOpen.next(true);
        }
        return index;
    }

    public setPlaceholder(placeholder: ViewContainerRef) {
        this.placeholder = placeholder;
    }
}
