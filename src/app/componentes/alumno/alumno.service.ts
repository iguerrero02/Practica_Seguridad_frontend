import { Alumno } from './alumno';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private urlAlumno:string= "http://localhost:8080/api/alumnos"

  private headers= new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient
  ) { }

  public getAlumnos():Observable<Alumno[]> {
    return this.http.get(this.urlAlumno).pipe(
      map( response=> response as Alumno[])
    );
  }

  public guardarAlumno(alumno:Alumno):Observable<Alumno>{
    return this.http.post(this.urlAlumno, alumno, {headers:this.headers}).pipe(
      map( (response: any)=> response.alumno as Alumno),
      catchError( e=>{
        if(e.status ==400){
          return throwError(()=>e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(()=>e);

      })
    );
  }

  public actualizarAlumno(id:number, alumno:Alumno):Observable<Alumno>{
    return this.http.put(`${this.urlAlumno}/${id}`, alumno, {headers:this.headers}).pipe(
      map( (response: any)=> response.alumno as Alumno),
      catchError( e=>{
        if(e.status ==400){
          return throwError(()=>e);
        }

        Swal.fire(e.error.mensaje, e.error.error, "error");
        return throwError(()=>e);

      })
    );
  }

  public eliminarAlumno(id:number){
    return this.http.delete(`${this.urlAlumno}/${id}`, {headers:this.headers});
  }

}
