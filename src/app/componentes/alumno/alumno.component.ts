import { ActivatedRoute } from '@angular/router';
import { Alumno } from './alumno';
import { AlumnoService } from './alumno.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {

  alumnos: Alumno[];

  constructor(
    private alumnoService:AlumnoService,
  ){

  }

  ngOnInit(): void {
    this.getAlumno();
  }

  getAlumno(){
    this.alumnoService.getAlumnos().subscribe(data=>{
      this.alumnos = data;
      console.log(this.alumnos);
    });
  }

  eliminarAlumno(id:number){
    this.alumnoService.eliminarAlumno(id).subscribe(data=>{
      console.log(data);
      Swal.fire("Alumno eliminado", `El alumno fue eliminado con exito`, "success")
      this.getAlumno();
    }, error=>{
      Swal.fire("Error", `Ocurrio un error al eliminar el alumno`, "error")
    })
  }

}
