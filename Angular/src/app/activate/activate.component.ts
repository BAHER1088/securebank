import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { numPadComponent } from '../num-pad/num-pad.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardService } from '../services/card.service';
import { ErrorService } from '../services/errorMessage.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-money-deposit',
  imports: [numPadComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {
  amount: string = '';
  userData: any;
  errorMessage: string = '';
  activateForm: FormGroup;

  constructor(
    private router: Router,
    private _AuthService: AuthService,
    private _CardService: CardService,
    private _ErrorService: ErrorService,
    private fb: FormBuilder
  ) {
    this.activateForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this._AuthService.currentUser.subscribe(user => {
      this.userData = user;
    });
  }



  cancel() {
    this.router.navigate(['/card-services']);
  }



  confirm() {
    this.amount = this.activateForm.value;
    console.log(this.amount);
    this._CardService.activateCard(this.amount).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/activate-done']);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error?.message || 'Something went wrong';
        console.log(this.errorMessage);
        //error service==> i set error message and we will show the error message in auth-failed
        this._ErrorService.setError(this.errorMessage);
        this.router.navigate(['/authFailed']);
      }
    })
  }

}
