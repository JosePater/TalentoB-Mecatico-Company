import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  AbstractControl,
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
  cantSelectProducts: number = 0;

  products = [
    { id: 1, name: 'Papas rizadas', price: '$3200' },
    { id: 2, name: 'Papas margaritas', price: '$3000' },
    { id: 3, name: 'Papas BBQ', price: '$3500' },
    { id: 4, name: 'Cheetos de queso', price: '$2000' },
    { id: 5, name: 'Cheetos picante', price: '$2000' },
    { id: 6, name: 'Doritos', price: '$3600' },
    { id: 7, name: 'Boliqueso', price: '$3500' },
    { id: 8, name: 'De todito natural', price: '$4000' },
    { id: 9, name: 'De todito BBQ', price: '$4000' },
  ];

  constructor(private formBuilder: FormBuilder) {
    this.buyForm = this.formBuilder.group({
      typeID: ['', Validators.required],
      numID: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      checkboxes: this.formBuilder.array([], [this.minSelectedCheckboxes(3)]),
    });

    // Checkbox de cada producto (desmarcados)
    this.products.forEach((i) =>
      this.checkboxes.push(this.formBuilder.control(false))
    );
  }

  ngOnInit(): void {
    // Tipo documento seleccionado
    this.buyForm.get('typeID')?.valueChanges.subscribe((value) => {
      this.typeID = value;
    });
  }

  // Obtener el valor de la propiedad checkboxes
  get checkboxes(): FormArray {
    return this.buyForm.get('checkboxes') as FormArray;
  }

  // Selección de productos
  private minSelectedCheckboxes(min: number) {
    return (formArray: AbstractControl) => {
      const totalSelected = formArray.value.filter(
        (checked: boolean) => checked
      ).length;
      this.cantSelectProducts = totalSelected;
      return totalSelected >= min ? null : { minSelectedCheckboxes: false };
    };
  }

  // Submit
  generarOrdenDeCompra() {
    const formValues = this.buyForm.value;
    this.focusCampos();

    if (this.buyForm.valid) {
      alert('Orden de compra realizada con éxito!!!');

      // Mapea los valores booleanos de los checkboxes a los productos correspondientes
      const selectedProducts = this.products
        .filter((product, index) => formValues.checkboxes[index])
        .map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
        }));

      // Crear un objeto con los datos completos
      const result = {
        ...formValues,
        selectedProducts: selectedProducts,
      };

      delete result.checkboxes; // Eliminar el array de checkboxes del objeto
      console.log('Form Values:', result); // Mostrar los datos ingresados
      this.buyForm.reset(); // Resetear el formulario
    }
  }

  // Verificación de datos inválidos en los campos
  hasErrors(field: string, typeError: string) {
    return (
      this.buyForm.get(field)?.hasError(typeError) && this.wasItTouched(field) // Si fue tocado
    );
  }

  // Detecta si se ha tocado el campo (touched)
  wasItTouched(field: string) {
    return this.buyForm.get(field)?.touched;
  }

  // Hace foco en los campos inválidos o vacíos
  focusCampos() {
    const form = Object.keys(this.buyForm.value); // Objeto del formulario (inputs)
    const buyFormControls = this.buyForm.controls;
    let statusForm: boolean = buyFormControls['typeID'].status === 'VALID';

    // Comprobar que todos los campos sean true (excepto checkbox)
    form.map((field) => {
      if (field !== 'checkboxes') {
        statusForm &&= buyFormControls[field].status === 'VALID';
      }
    });

    // Bucle para el alert del primer campo inválido
    for (let index = 0; index < form.length; index++) {
      const field = form[index]; // id del input
      const label = document.querySelector(`label[for="${field}"]`); // Label del input

      // Si el input es inválido
      if (buyFormControls[field].status === 'INVALID') {
        if (!statusForm || this.cantSelectProducts < 3) {
          alert(
            `Por favor, ${label?.textContent?.replace(
              ':',
              ' '
            )}(correctamente).`
          );
          const fieldElement = window.document.getElementById(field);
          fieldElement?.focus(); // focus
          // Cuando detecta el primer campo inválido se detiene para hacerle el focus
          break;
        }
      }
    }

    // Validación final
    if (statusForm && this.cantSelectProducts >= 3) {
      /* Forzar a que todos los checkbox sean 'true' cuando se cumpla la condición (>3 productos)
          ya que el formulario es solo es VÁLIDO cuando todos los checkbox son 'true'.
          Aunque se haya marcado todos los productos, solo están registrados los que el usuario seleccionó
      */
      this.checkboxes.controls.forEach((control) => control.setValue(true));
    }
  }
}
