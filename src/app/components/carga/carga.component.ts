import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item.model';
import { CargaImagenesService } from '../../providers/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: []
})
export class CargaComponent implements OnInit {
  archivos: FileItem[] = [];
  estaSobreElemento = true;

  constructor(public cargaImagenesService: CargaImagenesService) { }

  ngOnInit() {
  }

  cargarImagenes() {
    this.cargaImagenesService.cargarImagenesFirebase(this.archivos);
  }

  limpiarArchivos() {
    this.archivos = [];
  }

}
