const Product = require("../models/Product")
const User = require("../models/User")
const { errorHandler } = require("../auth")

//Create a Product
module.exports.addProduct = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(401).send({ message: "Only admin can add products" })
  }

  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  })

  try {
    const existingProduct = await Product.findOne({ name: req.body.name })
    if (existingProduct) {
      return res.status(409).send({ message: "Product already exists" })
    } else {
      await newProduct.save()
      return res.send({
        success: true,
        message: "Product added successfully",
        result: newProduct,
      })
    }
  } catch (err) {
    errorHandler(err, req, res)
  }
}

//Retrieve all Products
module.exports.getAllProducts = async (req, res) => {
  if (!req.user.isAdmin) {
    return res
      .status(401)
      .send({ message: "Only admin can retrieve all products" })
  }

  try {
    const products = await Product.find({})
    if (products.length > 0) {
      return res.status(200).send(products)
    } else {
      return res.status(404).send({ message: "No product found" })
    }
  } catch (error) {
    errorHandler(error, req, res)
  }
}
//Retrieve all active products
module.exports.getAllActive = (req, res) => {
  Product.find({ isActive: true })
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send(result)
      } else {
        return res.status(404).send(false)
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Retrieve a single product
module.exports.getProduct = (req, res) => {
  Product.findById(req.params.id)
    .then((product) => res.send(product))
    .catch((err) => errorHandler(err, req, res))
}

//Update a Product information

module.exports.updateProduct = (req, res) => {
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  }

  return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then((product) => {
      if (product) {
        res.send(true)
      } else {
        res.send(false)
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Archive a product
module.exports.archiveProduct = (req, res) => {
  let updateActiveField = {
    isActive: false,
  }

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (!product.isActive) {
          return res.status(200).send({
            message: "Product already archived",
            product: product,
          })
        }

        return res.status(200).send({
          success: true,
          message: "Product archived successfully",
        })
      } else {
        return res.status(404).send({ message: "Product not found" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}

//Activate a product
module.exports.activateProduct = (req, res) => {
  let updateActiveField = {
    isActive: true,
  }

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (product.isActive) {
          return res.status(200).send({
            message: "Product already activated",
            product: product,
          })
        }

        return res.status(200).send({
          success: true,
          message: "Product activated successfully",
        })
      } else {
        return res.status(404).send({ message: "Product not found" })
      }
    })
    .catch((error) => errorHandler(error, req, res))
}
