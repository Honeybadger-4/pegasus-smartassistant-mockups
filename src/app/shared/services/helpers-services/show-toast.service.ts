import { inject, Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root',
})
export class ShowToastService {
    messageService = inject(MessageService);

    showSuccessToast(message: string) {
        this.messageService.add({severity: 'success', summary: "Success", detail: message})
    }

    showErrorToast(message: string) {
        this.messageService.add({severity: 'error', summary: "Error", detail: message})
    }
}