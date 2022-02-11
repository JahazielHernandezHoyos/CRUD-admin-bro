// Requirements
const mongoose = require('mongoose')
const express = require('express')
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const bcrypt = require('bcrypt')

//importacion de modelos de mongodb
const User = require('./models/User')
const PostBlog = require('./models/PostBlog')

// Tenemos que decirle a AdminJS que administraremos los recursos de mongoose con él.
AdminJS.registerAdapter(require('@adminjs/mongoose'))

// definición de servidor express
const app = express()

const options = {
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
  resources:
  [{
    resource: User,
    options:
    {options}},

  {
    resource: PostBlog
  }],
    rootPath: '/admin' })
    

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

// settings
app.set("port", process.env.PORT || 8080);

// Running the server
const run = () => {
  mongoose.connect('mongodb+srv://tecnoacademiaADMIN:1126912183Hh@tecnoacademiablogs.mjfzz.mongodb.net/test', { useNewUrlParser: true })
  app.listen(app.get("port"), () => 
  console.log(`El puerto esta alojado en ${app.get("port")}!`))
}

run()