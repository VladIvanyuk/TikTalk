import { Directive, output, signal } from '@angular/core';

@Directive({
  selector: '[appDnd]',
  standalone: true,
  host: {
    '[class.fileover]': 'isFileOver()',
    '(dragover)': 'onDragOver($event)',
    '(drop)': 'onDragDrop($event)',
    '(dragleave)': 'onDragLeave($event)',
  },
})
export class DragAndDropDirective {
  readonly isFileOver = signal(false);
  readonly updateAvatar = output<FileList>();

  onDragOver(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isFileOver.set(true);
  }

  onDragDrop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isFileOver.set(false);
    const files = event.dataTransfer?.files;
    if (files) {
      this.updateAvatar.emit(files);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.isFileOver.set(false);
  }
}
