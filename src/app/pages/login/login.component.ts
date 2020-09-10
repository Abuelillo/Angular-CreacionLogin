import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.models';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel = new UsuarioModel();
  recordarme:boolean = false;

  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {

    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }

  }

  login(form:NgForm){

    if (form.invalid) {return; }

    Swal.fire({
      allowOutsideClick:false,
      icon: 'info',
      text:'Espere porfavor ...'      
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe((resp)=>{      
      Swal.close();

      if (this.recordarme) {
        localStorage.setItem('email',this.usuario.email);
      }

      this.router.navigateByUrl('/home');
    },(err)=>{
      Swal.fire({
        icon: 'error',
        title: 'Error al auntentificar',
        text:err.error.error.message        
      });
      console.log(err.error.error.message)
    });
  }

}