const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.format = "utf-8";
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, this.format);
      this.products = JSON.parse(data) || [];
    } catch (error) {
      console.error("Error al leer el archivo:", error);
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products), this.format);
    } catch (error) {
      console.error("Error al escribir en el archivo:", error);
    }
  }

  generarCode() {
    const CODE = "PROD" + this.products.length;
    return CODE;
  }

  addProduct(product) {
    try {
      const { title, description, price, thumbnail, stock } = product;
      if (!title || !description || !price || !thumbnail || !stock) {
        return "Todos los campos son obligatorios.";
      }

      const newProduct = {
        id: this.products.length + 1,
        ...product,
        code: this.generarCode(),
      };

      const idExiste = this.products.some(
        (producto) => producto.id === newProduct.id
      );
      if (idExiste) {
        return "El código ID del producto ya existe";
      }

      this.products.push(newProduct);
      this.saveProducts();

      return "Producto agregado exitosamente.";
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return "Error al agregar el producto.";
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find((product) => product.id === productId);

    if (product) {
      return product;
    } else {
      return "Producto no identificado.";
    }
  }

  updateProduct(productId, updatedFields) {
    try {
      const productIndex = this.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        const updatedProduct = {
          ...this.products[productIndex],
          ...updatedFields,
        };

        this.products[productIndex] = updatedProduct;
        this.saveProducts();

        return "Producto actualizado exitosamente.";
      } else {
        return "Producto no identificado.";
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      return "Error al actualizar el producto.";
    }
  }

  deleteProduct(productId) {
    try {
      const productIndex = this.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        const eliminado = this.products.splice(productIndex, 1);
        this.saveProducts();

        return eliminado;
      } else {
        return "Producto no identificado.";
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return "Error al eliminar el producto.";
    }
  }
}

const producto = new ProductManager("db.json");

console.log(
  producto.addProduct({
    title: "Taza",
    description: "Taza sublimable",
    price: 50,
    thumbnail: "#",
    stock: 30,
  })
);
console.log(
  producto.addProduct({
    title: "TV",
    description: "Samdung 21Pulg",
    price: 20560,
    thumbnail: "#",
    stock: 70,
  })
);
console.log(
  producto.addProduct({
    title: "Pampers",
    description: "Confort y cuidado",
    price: 1020,
    thumbnail: "#",
    stock: "50",
  })
);
console.log(
  producto.addProduct({
    title: "Pampers",
    description: "Confort y cuidado",
    price: 1020,
    thumbnail: "#",
    stock: "50",
  })
);

console.log("Listado de Productos:", producto.getProducts());
console.log("----------------------------------------------");
console.log("Encontrado:", producto.getProductById(2));
console.log("----------------------------------------------");
console.log("Eliminado:", producto.deleteProduct(10));
