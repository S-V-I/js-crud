// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// const Handlebars = require('handlebars')

const app = express()

// Handlebars.registerPartial('myPartial', '{{partial}}')
// Handlebars.registerPartial()

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000 + 9999)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static update = (product, { id }) => {
    if (id) {
      product.id = id
    }
  }
}

// ===========================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ==========================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ==========================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  let result = false

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getList())

  if (Product.getList(product)) {
    result = true
  }

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно створений'
      : 'Сталася помилка',
  })
})

// ===========================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ===========================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product: product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ===========================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body

  let product = Product.getById(Number(id))

  if (product) {
    product.updateById(id, { name, price, description })

    res.render('alert', {
      style: 'alert',
      info: 'Товар успішно оновлено',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ===========================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Товар видалений',
  })
})

// ===========================================================

// app.set('view engine', 'handlebars')
// Підключаємо роутер до бек-енду
module.exports = router
