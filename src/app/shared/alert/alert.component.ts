import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class AlertComponent {
    // Message set from outside Alert component
   @Input() message: string; 
    
   // Close button to close the alert
   // EventEmitter to emit the close event to the parent component
   @Output() close = new EventEmitter<void>();


   onClose(){
        this.close.emit()
   }
}