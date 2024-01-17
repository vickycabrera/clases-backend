const fs = require("fs")

/*Tercer desafio: */
class ProductManager {
    #productCounter
    constructor(path){
        this.#productCounter = 0;
        this.products = []; 
        this.path = path
    }

    //función para chequear que el producto tiene todas las propiedades
    hasAllProperties(product){
        const {title, description, price, thumbnail, code, stock} = product
        return title && description && price && thumbnail && code && (stock !== undefined);
    }

    //función para chequear si ya existe un producto con ese código
    isCodeAllreadyInUse (productCode){
        const codesArray = this.products.map(p=>p.code)
        return codesArray.includes(productCode)
    }

    //Método para agregar un producto: 
    addProduct(newProduct){
        if (!this.hasAllProperties(newProduct)) {
            console.log ("Error: faltan propiedades en el producto")
        }
        else if (this.isCodeAllreadyInUse(newProduct.code)){
            console.log ("Error: el code ya existe")    
        }
        else {
            this.products.push({...newProduct, id: this.#productCounter++}) 
            this.escribirArchivo(this.products)
        }
    }

    async getProducts() {
        return await this.leerArchivo()
    }

    async getProductById(id){
        const productsArray = await this.leerArchivo()
        if (productsArray) {
            const findedProduct = productsArray.find(item => item.id === id)
            if (findedProduct){
                return findedProduct
            }
            else console.log ("No se encontró un producto con ese id") 
        } else console.log ("No se pudo leer el archivo")
    }

    async updateProduct(id, newProduct){
        if (!this.hasAllProperties(newProduct)) {
            return console.log ("Error: faltan propiedades en el producto")
        }
        else {
            try {
                const allProducts = await this.getProducts()
                if (allProducts) {
                    const newArray = allProducts.map(p => 
                        p.id === id ?
                        {...newProduct, id} :
                        p
                    )
                    const action = await this.escribirArchivo(newArray)
                    if (action) this.products = newArray
                }
            } catch (error) {
                console.log("error: no se pudo actualizar el producto", error)
            }
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        if (products.some(p => p.id === id)){
            const newArray = products.filter (p => p.id === id)
            this.escribirArchivo(newArray)
            this.products = newArray
        } else console.log ("Error, no existe un producto con ese id")
    }


    //Funciones del file system:

    //Crear un archivo:
    async escribirArchivo(data){
        try {
            const formatedData = JSON.stringify(data)
            await fs.promises.writeFile(this.path, formatedData)
        } catch (error) {
            console.log("No se pudo crear el archivo: ", error)
        }
    }

    //Leer un archivo:
    async leerArchivo(){
        try {
            const respuesta = await fs.promises.readFile(this.path, "utf-8")
            console.log("data del read file", this.path, respuesta)
            if (respuesta) {
                const productsArray = JSON.parse(respuesta);
                return productsArray;
            } else return []
        } catch (error) {
            console.log("No se pudo leer el archivo: ", error)
            return null
        }
    }
}

module.exports= ProductManager