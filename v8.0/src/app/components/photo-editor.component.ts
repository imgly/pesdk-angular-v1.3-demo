import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core'
// @ts-ignore
import { deepmergeAll, Configuration } from 'photoeditorsdk/no-polyfills'
import { EditorApi, PhotoEditorSDKUI } from 'photoeditorsdk/no-polyfills'

const license = "";

@Component({
  selector: "app-photo-editor",
  templateUrl: "./photo-editor.component.html",
})
export class PhotoEditorComponent implements AfterViewInit {
  @Input()
  public src: string;

  @ViewChild("psdkContainer", { static: false })
  private container: ElementRef<HTMLDivElement>;

  public editor: EditorApi;

  ngAfterViewInit() {
    this.initEditor();
    // Make the value global for the Cypress end-to-end (E2E) test.
    // This is not necessary for the PhotoEditorSDK to work and can be removed safely.
    (window as any).initPesdk = this.initEditor.bind(this);
  }

  async initEditor(config: Partial<Configuration> = {}) {
    if (this.editor) {
      this.editor.dispose();
    }
    const defaultConfig: Configuration = {
      license,
      container: this.container.nativeElement,
      image: this.src,
      assetBaseUrl: "/assets/photoeditorsdk",
    };
    const editor = await PhotoEditorSDKUI.init(
      deepmergeAll([defaultConfig, config])
    );
    this.editor = editor;

    // Make the value global for the Cypress end-to-end (E2E) test.
    // This is not necessary for the PhotoEditorSDK to work and can be removed safely.
    (window as any).pesdkEditor = editor;
  }
}
