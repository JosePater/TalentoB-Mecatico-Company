import { NgClass } from '@angular/common';
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
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css',
})
export class FormsComponent implements OnInit {
  buyForm: FormGroup; // Formulario de compra
  typeID!: string; // Tipo de documento

  constructor(private forBuilder: FormBuilder) {
    this.buyForm = forBuilder.group({
      typeID: ['', Validators.required],
      numID: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    // Tipo documento seleccionado
    this.buyForm.get('typeID')?.valueChanges.subscribe((value) => {
      this.typeID = value;
    });
  }

  // Submit
  ordenar() {
    this.focusCampos();
    if (this.buyForm.valid) {
      alert('Orden realizada con éxito!!!');
      this.buyForm.reset();
    }
  }

  // Verificación de datos inválidos en los campos
  hasErrors(field: string, typeError: string) {
    return (
      this.buyForm.get(field)?.hasError(typeError) &&
      this.buyForm.get(field)?.touched // Si fue tocado
    );
  }

  // Detecta si se ha tocado el campo (touched)
  tocarCampo(field: string) {
    return this.buyForm.get(field)?.touched;
  }

  // Hace foco en los campos inválidos o vacíos
  focusCampos() {
    const form = Object.keys(this.buyForm.value); // Objeto del formulario (inputs)

    for (let index = 0; index < form.length; index++) {
      const field = form[index]; // Input
      const label = document.querySelector(`label[for="${field}"]`); // Label del input

      if (this.buyForm.controls[field].status === 'INVALID') {
        // Si el input es inválido
        const fieldElement = window.document.getElementById(field);
        alert(
          `Por favor, ${label?.textContent?.replace(':', ',')} correctamente.`
        );
        fieldElement?.focus();
        break;
      }
    }
  }
}
