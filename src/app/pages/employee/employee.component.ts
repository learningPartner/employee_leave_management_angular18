import { Component, inject, OnInit } from '@angular/core';
import { APIResponse, ChildDept, Employee, ParentDept } from '../../model/master';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  employeeObj:Employee = new Employee();
  parentDeptId: string  = '';
  masterSrv = inject(MasterService);
  parentDepartmentList: ParentDept [] = [];
  childDepartmentList: ChildDept [] = []
  employeeList: Employee [] = []

  ngOnInit(): void {
    this.loadEmployee();
    this.loadParentDept();
  }

  loadParentDept() {
    this.masterSrv.getDepartment().subscribe((res:APIResponse)=>{
      this.parentDepartmentList = res.data;
    })
  }
  getAllChild() {
    this.masterSrv.GetAllChildDepartment().subscribe((res:APIResponse)=>{
      this.childDepartmentList = res.data;
    })
  }

  loadEmployee() {
    this.masterSrv.GetAllEmployees().subscribe((res:Employee[])=>{
      this.employeeList = res;
    })
  }

  onEdit(item: Employee) {
    this.employeeObj = item;
    this.getAllChild()
  }
  onDelete(id: number) {
    const isDelete =  confirm("Are u Sure Want to Delete");
    if(isDelete) {
      this.masterSrv.deleteEmp(id).subscribe((res:Employee)=>{
        this.loadEmployee();
      })
    }
  }

  onDeptChange() {
    this.masterSrv.getChildDepartmentByParentId(this.parentDeptId).subscribe((res:APIResponse)=>{
      this.childDepartmentList =  res.data;
    })
  }
  onSaveEmployee() {
    this.masterSrv.createNewEmployee(this.employeeObj).subscribe((res:Employee)=>{ 
        alert("Employee Created Success");
        this.employeeObj = new Employee(); 
        this.loadEmployee();
    })
  }
  onUpdateEmployee() {
    this.masterSrv.updateEMp(this.employeeObj).subscribe((res:Employee)=>{ 
        alert("Employee Created Success");
        this.employeeObj = new Employee(); 
        this.loadEmployee();
    })
  }

}
