import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthResponse } from 'src/app/shared/models/auth.interface';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = new BehaviorSubject<string>('');
  private tokenData = new BehaviorSubject<any>({});

  private headers= new HttpHeaders({'Content-Type': 'application/json'});


  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  get token$(): Observable<string> {
    return this.token.asObservable();
  }

  get tokenData$(): Observable<any> {
    return this.tokenData.asObservable();
  }

  headerError(error: any): Observable<never> {
    let errorMessage = 'Ocurrio un error';

    if (error.status == 401) {
      errorMessage = 'El usuario y/o contraseña esta incorrecto';
    }

    Swal.fire({
      icon: 'error',
      title: '',
      text: errorMessage,
      confirmButtonText: 'Aceptar',
    });

    return throwError(() => errorMessage);
  }

  saveLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    this.token.next('');
    this.tokenData.next(null);
    this.router.navigate(['/']);
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const isExpired = helper.isTokenExpired(token);
      if (isExpired) {
        this.logout();
      } else {
        this.token.next(token);
        // renovar los datos del perfil
        const { iat, exp, ...data } = helper.decodeToken(token);
        this.tokenData.next(data);
      }
    } else {
      this.logout();
    }
  }

  login(loginData:any): Observable<AuthResponse | void> {
    return this.http.post<AuthResponse>(`${environment.API_URL}/auth/login`, loginData, {headers:this.headers})
    .pipe(map((data:AuthResponse)=>{
      console.log(data);
      if(data.token){
        this.saveLocalStorage(data.token);
        this.token.next(data.token);
        this.router.navigate(['/home']);

        this.checkToken();
      }

      return data;
    }),
      catchError((error)=> this.headerError(error)));
  }

  get tokenValue(){
    return this.token.getValue();
  }

}
