import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item.model';

@Directive({
  selector: '[appNgDropFile]'
})
export class NgDropFileDirective {

  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any) {
    this.mouseSobre.emit(true);
    this.prevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    const transferencia = this.getTransferencia(event);

    if ( !transferencia) {
      return;
    }

    this.prevenirDetener(event);
    this.extraerArchivos(transferencia.files);
    this.mouseSobre.emit(false);
  }

  private getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private extraerArchivos(archivosLista: FileList) {
    // console.log(archivosLista);

    // tslint:disable-next-line:forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];
      if (this.ArchivoValido(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }
  }

  private ArchivoValido(archivo: File): boolean {
    if (this.validarElementoExistente(archivo.name) && this.validarImagen(archivo.type)) {
      return true;
    } else {
      return  false;
    }
  }

  private prevenirDetener(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  private validarElementoExistente(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('El achivo' + nombreArchivo + 'ya existe');
        return false;
      }
    }

    return true;
  }

  private validarImagen(tipoArchivo: string): boolean {
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }

}
