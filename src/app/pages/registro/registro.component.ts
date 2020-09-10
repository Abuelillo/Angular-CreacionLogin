import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.models';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {

  usuario:UsuarioModel;
  recordarme:boolean = false;
  
  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
     
    }
  }

  onSubmit(form:NgForm){
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick:false,
      icon: 'info',
      text:'Espere porfavor ...'      
    });
    Swal.showLoading();

    this.auth.registro(this.usuario).subscribe((data) =>{      
      Swal.close();

      if (this.recordarme) {
        localStorage.setItem('email',this.usuario.email);
      }

      this.router.navigateByUrl('/home');
    },(err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Error al crear cuenta',
        text:err.error.error.message        
      });      
    })
  }

}
