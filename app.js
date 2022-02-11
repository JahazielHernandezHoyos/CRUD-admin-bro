// Requirements
const mongoose = require('mongoose')
const express = require('express')
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const bcrypt = require('bcrypt')

// We have to tell AdminJS that we will manage mongoose resources with it
AdminJS.registerAdapter(require('@adminjs/mongoose'))

// express server definition
const app = express()

// Resources definitions
const User = mongoose.model('User', {
  email: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  role: { type: String, enum: ['admin', 'restricted'], required: true },
})

options = {
  branding: {
    logo: 'https://www.sena.edu.co/Style%20Library/alayout/images/logoSena.png',
    companyName: 'Tecnoacademia',
  },
  locale: {
    language: "es",
  }, 
  properties: {
    encryptedPassword: {
      isVisible: false,
    },
    password: {
      type: 'string',
      isVisible: {
        list: false, edit: true, filter: false, show: false,
      },
    },
  },
  actions: {
    new: {
      before: async (request) => {
        if(request.payload.password) {
          request.payload = {
            ...request.payload,
            encryptedPassword: await bcrypt.hash(request.payload.password, 10),
            password: undefined,
          }
        }
        return request
      },
    }
  }
}


// Pass all configuration settings to AdminJS
const adminJs = new AdminJS({
  resources: [{
    resource: User,
    options:
    {options}}],
    rootPath: '/admin',
    })

// Build and use a router which will handle all AdminJS routes
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})

app.use(adminJs.options.rootPath, router)

// Running the server
const run = () => {
  mongoose.connect('mongodb+srv://tecnoacademiaADMIN:1126912183Hh@tecnoacademiablogs.mjfzz.mongodb.net/test', { useNewUrlParser: true })
  app.listen(8080, () => console.log(`Example app listening on port 8080!`))
}

run()