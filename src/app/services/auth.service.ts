import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private API_KEY = 'AIzaSyDd0rJmTyBwQoz0u2CyXNLlxm7TURKJkwU';
  userToken:string;
  
  constructor(private http:HttpClient) { this.leerToken(); }

  login(usuario:UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken:true
    }
    const query = 'signInWithPassword?key=';
    
    return this.http.post(this.url+query+this.API_KEY,authData).pipe(map(resp =>{
      this.guardarToken(resp['idToken']);      
      return resp;
    }));
  }

  logOut(){
    localStorage.removeItem('token');
  }

  registro(usuario:UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken:true
    }
    const query = 'signUp?key=';
    
    return this.http.post(this.url+query+this.API_KEY,authData).pipe(map(resp =>{
      this.guardarToken(resp['idToken']);      
      return resp;
    }));
  }

  private guardarToken(idToken:string){
    this.userToken = idToken;
    localStorage.setItem('token',idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira',hoy.getTime().toString());
  }

  leerToken(){
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutentificado():boolean{

    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    }else{
      return false;
    }

  }
}
