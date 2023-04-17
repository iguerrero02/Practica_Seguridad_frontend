import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AlumnoResponse } from 'src/app/shared/models/alumno.interface';
import { DefaultResponse } from 'src/app/shared/models/default.interface';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  constructor(private http: HttpClient) {}

  getAlumnos(): Observable<AlumnoResponse[]> {
    return this.http
      .get<AlumnoResponse[]>(`${environment.API_URL}/api/alumnos`, {
        headers: { 'require-token': 'true' },
      })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  new(alumno: AlumnoResponse): Observable<DefaultResponse> {
    return this.http
      .post<DefaultResponse>(`${environment.API_URL}/api/alumnos`, alumno, {
        headers: { 'require-token': 'true' },
      })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  update(
    idAlumno: number,
    alumno: AlumnoResponse
  ): Observable<DefaultResponse> {
    return this.http
      .put<DefaultResponse>(
        `${environment.API_URL}/api/alumnos/${idAlumno}`,
        alumno,
        { headers: { 'require-token': 'true' } }
      )
      .pipe(catchError((error) => this.handlerError(error)));
  }

  delete(idAlumno: number): Observable<DefaultResponse> {
    return this.http
      .delete<DefaultResponse>(
        `${environment.API_URL}/api/alumnos/${idAlumno}`,
        { headers: { 'require-token': 'true' } }
      )
      .pipe(catchError((error) => this.handlerError(error)));
  }

  handlerError(error: any): Observable<never> {
    let errorMessage = 'Ocurrio un error';

    if (error.status == 401) {
      errorMessage = 'No autorizado';
    }

    Swal.fire({
      icon: 'error',
      title: '',
      text: errorMessage,
      confirmButtonText: 'Aceptar',
    });
    return throwError(() => errorMessage);
  }
}
