// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(use, data)
      // Object.assign(user, { email })
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router

// повертає: {
// [Object: null prototype] {
//   email: 'mail@mail.com',
//   login: 'S-V-I',
//   password: 'qwerty'
// }

// ****************************

// [
//   User { email: 'ambitious@ukr.net', login: 'S-V-I', password: 'qwerty'  },
//   User { email: 'admin@mail.com', login: 'admin', password: 'asdfghj' },
//   User { email: 'user@mail.com', login: 'user', password: '134567' }
// ]

// [nodemon] app crashed - waiting for file changes before starting...
// [nodemon] restarting due to changes...
// [nodemon] starting `node ./index.js`
// Listening on http://localhost:3000
// [ User { email: 'user@mail.com', login: 'user', password: '134567' } ]
// POST /user-create 200 227.888 ms - 924
// GET /css/normalize.css 304 10.489 ms - -
// GET /dist/css/layout/default/style.css 304 3.939 ms - -
// GET /dist/css/container/user-create/style.css 304 34.001 ms - -
// }

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// повертає: {
//   [
//     User {
//       email: '123@mail.com',
//       login: '123',
//       password: 'cvb',
//       id: 1707646706876
//     }
//   ]
// }

// ======================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  // console.log(email, password, id)
  // const result = User.updateById(Number(id), { email })

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Електронна пошта користувача оновлена'
      : 'Сталася помилка',
  })
})
