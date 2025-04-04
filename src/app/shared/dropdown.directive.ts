import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;
    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }
}

// Disable dropdown by clicking anywhere else:

//   @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
//     this.isOpen = this.eltRef.nativeElement.contains(event.target) ? !this.isOpen : false;
//   }
//   constructor(private eltRef: ElementRef) {}
