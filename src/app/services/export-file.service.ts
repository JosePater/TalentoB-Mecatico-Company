import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class ExportFileService {
  private row: number = 20; // Renglón
  private col: number = 15; // Borde izquierdo
  private nameDoc!: string; // Nombre del documento PDF
  // Fecha:
  private today = new Date();
  private year = this.today.getFullYear();
  private months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  private month = this.months[this.today.getMonth()];
  private fechaFormateada = `${String(this.today.getDate()).padStart(2, '0')} - ${this.month} - ${this.year}`;

  constructor() {}

  generatePDF(formData: any, selectedProducts: any[]) {
    const doc = new jsPDF(); // Objeto pra PDF
    const nameCompany = 'Distribuidora MECATICO COMPANY';
    const pageWidth = doc.internal.pageSize.getWidth(); // Centrar texto
    const textWidth = doc.getTextWidth(nameCompany);    // Centrar texto
    const x = (pageWidth - textWidth) / 2;              // Centrar texto
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text(`${nameCompany}`, x, this.row); // Texto centrado
    doc.setFont('helvetica', 'normal'); // Texto normal
    doc.text('Empresa líder comercializadora de mecatos a las tiendas de barrio' ,this.col, this.row+=10);
    doc.text(`Fecha: ${this.fechaFormateada}`, this.col, this.row+=10);
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text('Datos del cliente: ', this.col, this.row+=20);
    doc.setFont('helvetica', 'normal'); // Texto normal
    doc.text(`Número de ${formData.typeID}: ${formData.numID}`, this.col, this.row+=10);
    doc.text(`Nombre: ${formData.name} ${formData.lastname}`, this.col, this.row+=10);
    doc.text(`Teléfono: ${formData.phone}`, this.col, this.row+=10);
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text('Productos ordenados:', this.col, this.row+=20);
    doc.setFont('helvetica', 'normal'); // Texto normal

    let total: number = 0;

    // Productos ordenados para la compra
    selectedProducts.forEach(product => {
      const price = product.price;
      const name = product.name;
      const line = this.justifyText(name, price, 180);
      doc.text(line, this.col, this.row+=10);
      total += parseFloat(price.replace('$', ''));
    });

    const totalLine = this.justifyText('Total a pagar', `$${total}`, 180);
    doc.setFont('helvetica', 'bold'); // Texto en negrita
    doc.text(totalLine, this.col, this.row+=10 + 10);

    if (formData.typeID == 'NIT') this.nameDoc = 'Compra NIT';
    else this.nameDoc = 'Compra CC';
    
    doc.save(`${this.nameDoc} ${formData.numID}.pdf`); // Nombre del doc a guardar
    this.row = 20; // Vuelve al primer renglón
  }

  // Justificar el texto
  private justifyText(leftText: string, rightText: string, maxWidth: number): string {
    const doc = new jsPDF();
    const leftWidth = doc.getTextWidth(leftText);
    const rightWidth = doc.getTextWidth(rightText);
    const spaceWidth = doc.getTextWidth(' ');
    const dotsWidth = maxWidth - (leftWidth + rightWidth);

    const dotsCount = Math.floor(dotsWidth / spaceWidth);
    const dots = '.'.repeat(dotsCount);

    return `${leftText}${dots}${rightText}`;
  }
}
