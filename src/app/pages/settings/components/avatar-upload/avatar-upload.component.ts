import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { SvgIconComponent } from '../../../../shared/components/common/svg-icon/svg-icon.component';
import { DragAndDropDirective } from '../../../../shared/directives/drag-and-drop.directive';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-avatar-upload',
  imports: [SvgIconComponent, DragAndDropDirective, NgOptimizedImage],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUploadComponent {
  readonly preview = signal('/assets/imgs/avatar-placeholder.jpg');
  readonly updateAvatar = output<File>();

  changeFileHandler(files: Event | FileList): void {
    const file =
      files instanceof FileList ? files[0] : (files.target as HTMLInputElement).files?.[0];

    if (!file || !file.type.match('image')) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent): void => {
      const binaryFile = readerEvent.target?.result?.toString() || '';
      this.preview.set(binaryFile);
    };

    reader.readAsDataURL(file);

    this.updateAvatar.emit(file);
  }
}
