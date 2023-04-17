import { Component, OnInit } from '@angular/core';
import { AlumnoService } from './alumno.service';
import { Alumno } from './alumno';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public alumno: Alumno=new Alumno();
  public errores: string[];

  constructor(
    private alumnoService:AlumnoService,
    private router:Router,
    private route: ActivatedRoute
  ){

  }

  ngOnInit(): void {
    let params = this.route.snapshot.params;
    let alumno = params as Alumno;

    if (Object.keys(params).length != 0) {
      this.alumno.idAlumno=alumno.idAlumno;
      this.alumno.nombre=alumno.nombre;
      this.alumno.numeroControl=alumno.numeroControl;
      this.alumno.email=alumno.email;
      // this.alumno.fechaRegistro=alumno.fechaRegistro;
    }
  }

  enviarDatos(){
    if(this.alumno.idAlumno!=null){
      this.actualizarAlumno();
    }else{
      this.guardar();
    }
  }

  guardar(): void {
    console.log(this.alumno)
    this.alumnoService.guardarAlumno(this.alumno).subscribe({
      next: alumnos =>{
        this.router.navigate(["/alumnos"]);
        Swal.fire("Alumno nuevo", `El alumno: ${alumnos.nombre} se guardo con exito`, "success")
      }, error:e=>{
        this.errores= e.error.errors as string[];
        console.log(e);
      }
    })
  }

  actualizarAlumno(): void {
    console.log(this.alumno)
    this.alumnoService.actualizarAlumno(this.alumno.idAlumno,this.alumno).subscribe({
      next: alumnos =>{
        this.router.navigate(["/alumnos"]);
        Swal.fire("Alumno actualizado", `El alumno: ${alumnos.nombre} se actualizo con exito`, "success")
      }, error:e=>{
        this.errores= e.error.errors as string[];
        console.log(this.errores);
      }
    })
  }

}
