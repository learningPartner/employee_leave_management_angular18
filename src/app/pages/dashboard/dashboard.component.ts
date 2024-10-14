import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  masterSrv = inject(MasterService);
  dashboardData:any;
  
  ngOnInit(): void { 
    this.getGriData();
  }

  getGriData() {
    if(this.masterSrv.loggedUserData.role == "Employee") {
      this.getData()
    } else {
      this.getAllData()
    }
  }

  getData() {
    this.masterSrv.getEmpDash(this.masterSrv.loggedUserData.employeeId).subscribe((res:any)=>{
      this.dashboardData = res;
    })
  }
  getAllData() {
    this.masterSrv.getHrDash().subscribe((res:any)=>{
      this.dashboardData = res;
    })
  }

}
