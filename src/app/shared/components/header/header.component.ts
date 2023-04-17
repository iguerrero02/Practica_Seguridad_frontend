import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit {
  data:any = null;
  constructor(private authSvc: AuthService){}

  ngOnInit(): void {
    this.authSvc.tokenData$.subscribe((data: any) => {
      console.log(data);
      this.data=data;
    })
  }

  onLogout(){
    this.authSvc.logout();
    this.data=null;
  }
}
