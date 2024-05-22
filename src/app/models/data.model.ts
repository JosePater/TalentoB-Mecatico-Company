// Interface para los productos
export interface IProduct {
  id: number;
  name: string;
  price: string;
}

// Interface para los datos del los usuarios y su pedido
export interface IUSer {
  typeID: string;
  numID: string;
  name: string;
  lastname: string;
  phone: string;
  selectedProducts: IProduct[];
}

// Interface para los campos del formulario
export interface IBuyForm {
  typeID: string;
  numID: string;
  name: string;
  lastname: string;
  phone: string;
  checkboxes: any;
}
