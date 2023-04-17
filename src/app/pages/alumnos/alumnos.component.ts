import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlumnoResponse } from 'src/app/shared/models/alumno.interface';
import { BaseForm } from 'src/app/shared/utils/base-form';
import { AlumnosService } from './services/alumnos.service';
import Swal from 'sweetalert2';

declare var window: any;


enum Action{
  NEW= 'new',
  EDIT= 'edit'
}

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit{

  selectedAlumno: any={};
  alumnos: AlumnoResponse[]=[];
  formalModal:any;

  titleButton= "Guardar";
  actionTODO= Action.NEW;
  alumnoForm= this.fb.group({
    idAlumno:[""],
    nombre: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    numeroControl: ["", [Validators.required]]
  });

  constructor(private fb: FormBuilder,
    public baseForm: BaseForm,
    private alumnoSvc: AlumnosService){}

  ngOnInit(): void {
    this.listar();
    this.formalModal= new window.bootstrap.Modal(
      document.getElementById('modalAlumno')
    )
  }

  listar(){
    this.alumnoSvc.getAlumnos().subscribe((data:AlumnoResponse[])=>{
      this.alumnos= data;
    })
  }

  onOpenModal(alumno: any){
    this.selectedAlumno= alumno;
    console.log(this.selectedAlumno)
    this.pathData();
    this.formalModal.show(alumno);
  }

  pathData(){
    if(this.selectedAlumno.idAlumno){
      this.titleButton= "Actualizar";
      this.actionTODO= Action.EDIT;
      this.alumnoForm.patchValue({
        idAlumno: this.selectedAlumno.idAlumno,
        nombre: this.selectedAlumno.nombre,
        email: this.selectedAlumno.email,
        numeroControl: this.selectedAlumno.numeroControl
      })

      this.alumnoForm.updateValueAndValidity();

    }else{
      this.alumnoForm.reset();
      this.titleButton= "Guardar";
      this.actionTODO= Action.NEW;
    }
  }

  onSave(){
    if(this.alumnoForm.invalid) return;

    const formValues = this.alumnoForm.value;

    var data: AlumnoResponse= {
      email: formValues.email? formValues.email:'',
      nombre: formValues.nombre? formValues.nombre:'',
      numeroControl: formValues.numeroControl? formValues.numeroControl:''
    }

    if(this.actionTODO==Action.NEW){
      this.alumnoSvc.new(data).subscribe(()=>{
        this.formalModal.hide();

        this.listar();

        Swal.fire({
          icon:"success",
          title: "",
          text: "El registro se guardo correctamente",
          confirmButtonText: "Aceptar"

        })

      });
    }else{
      let idAlumno= formValues.idAlumno? parseInt(formValues.idAlumno):0;
      this.alumnoSvc.update(idAlumno, data).subscribe(()=>{
        this.formalModal.hide();
        this.listar();

        Swal.fire({
          icon:"success",
          title: "",
          text: "El registro se actualizó correctamente",
          confirmButtonText: "Aceptar"
        });
      })
    }
  }


  onDelete(idAlumno: any) {
    Swal.fire({
      title: '',
      text: '¿Realmente desea eliminar el registro?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        if (idAlumno) {
          this.alumnoSvc.delete(idAlumno).subscribe(() => {
            this.listar();

            Swal.fire({
              icon: 'success',
              title: '',
              text: 'El registro se elimino correctamente',
              confirmButtonText: 'Aceptar'
            });
          });
        }
      }
    })
  }



}
