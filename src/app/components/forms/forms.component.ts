import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css',
})
export class FormsComponent implements OnInit {
  buyForm: FormGroup; // Formulario de compra
  typeID!: string; // Tipo de documento

  constructor(private forBuilder: FormBuilder) {
    this.buyForm = forBuilder.group({
      typeID: ['', Validators.required],
      numID: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Tipo documento seleccionado
    this.buyForm.get('typeID')?.valueChanges.subscribe((value) => {
      this.typeID = value;
    });
  }

  ordenar() {
    if (this.buyForm.valid) {
      alert('Orden realizada con éxito!!!');
      this.buyForm.reset();
    } else {
      alert('Campos faltantes');
    }
  }
}
