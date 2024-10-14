import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { APIResponse, Employee, LeaveRequest, LeaveType } from '../../model/master';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-leave',
  standalone: true,
  imports: [ReactiveFormsModule,AsyncPipe,DatePipe],
  templateUrl: './new-leave.component.html',
  styleUrl: './new-leave.component.css'
})
export class NewLeaveComponent implements OnInit{

  leaveForm: FormGroup = new FormGroup({});
  masterSrv = inject(MasterService);

  leaveTypeList = signal<LeaveType[]>([]);
  requstList:LeaveRequest []= [];
  empoloyee$: Observable<Employee[]> = new Observable<Employee[]>();
  constructor() {
    this.initializeForm();
    this.empoloyee$ =  this.masterSrv.GetAllEmployees();
  }

  initializeForm() {
    this.leaveForm =  new FormGroup({
      leaveId: new FormControl(0),
      employeeId: new FormControl(this.masterSrv.loggedUserData.employeeId),
      leaveTypeId: new FormControl(0),
      startDate: new FormControl(""), 
      endDate: new FormControl(""),
      status: new FormControl("New"),
      reason: new FormControl(""),
      requestDate: new FormControl(new Date()),
    })
    debugger;
    if(this.masterSrv.loggedUserData.role == 'Employee') {
      this.leaveForm.controls['employeeId'].disable();
    }
  }

  ngOnInit(): void {
    this.getLeaveType();
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
    this.masterSrv.getAllLeaveRequestByEmpId(this.masterSrv.loggedUserData.employeeId).subscribe((res:APIResponse)=>{
      this.requstList = res.data;
    })
  }
  getAllData() {
    this.masterSrv.GetAllLeaveRequest().subscribe((res:APIResponse)=>{
      this.requstList = res.data;
    })
  }

  getLeaveType() {
    this.masterSrv.getLeaveType().subscribe((Res:APIResponse)=>{
        this.leaveTypeList.set(Res.data)
    })
  }

  onSave() {
    const formValue = this.leaveForm.getRawValue();
    debugger;
    this.masterSrv.newRequest(formValue).subscribe((res:APIResponse)=>{
      if(res.result) {
        alert("request Raised")
        this.getGriData();
      } else {
        alert(res.message)
      }
    })
  }

  changeStatus(id: number) {
    this.masterSrv.changeLeaveReq(id, 'Approved').subscribe((Res:APIResponse)=>{
      this.leaveTypeList.set(Res.data)
      this.getGriData();
    })
  }

  onCancel(id: number) {
    this.masterSrv.changeLeaveReq(id, 'Canceled').subscribe((Res:APIResponse)=>{
      this.leaveTypeList.set(Res.data)
      this.getGriData();
    })
  }
  
  
}
