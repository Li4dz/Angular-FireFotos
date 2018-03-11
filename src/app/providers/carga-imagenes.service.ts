import { Injectable } from '@angular/core';
import { AngularFirestore  } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item.model';

@Injectable()
export class CargaImagenesService {

  private carpetaImagenes = 'img';

  constructor(private db: AngularFirestore) { }

  cargarImagenesFirebase(imagenes: FileItem[]) {
    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.estaSubiendo = true;

      if (item.progreso >= 100) {
        continue;
      }

      const uploadTask: firebase.storage.UploadTask =
              storageRef.child(`${this.carpetaImagenes}/${item.nombreArchivo}`)
                        .put(item.archivo);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('Error al subir', error),
        () => {
          item.url = uploadTask.snapshot.downloadURL;
          item.estaSubiendo = false;
          this.guardarImagen({
            nombre: item.nombreArchivo,
            url: item.url
          });
          console.log('Imagen cargada correctamente');
        }
      );
    }
  }

  private guardarImagen(imagen: { nombre: string, url: string}) {
    this.db.collection(`/${this.carpetaImagenes}`)
      .add(imagen);
  }
}
