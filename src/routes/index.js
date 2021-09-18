const express = require('express');
const { accessSync } = require('fs');
const router = express.Router();
const { text } = require('express');
const { randomNumber } = require('../helpers/libs');
const path = require('path');
const fs = require('fs-extra');



const User = require('../models/Users');
const Cita = require('../models/Cita');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');
const { findById } = require('../models/Users');



router.get('/', async (req, res) => {
    res.render('index');
});

router.get('/quienessomos', (req, res) => {
    res.render('quienessomos');
});

router.get('/contacto', (req, res) => {
    res.render('contacto');
});

router.get('/signin', (req, res) => {
    res.render('signin');
})

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/signup', async (req, res) => {
    const { usuario, email, contraseña, confirmacion } = req.body;
    const errors = [];
    if (usuario.length <= 0) {
        errors.push({ text: "Por favor, ingrese un nombre válido" });
    }
    if (email.length <= 0) {
        errors.push({ text: "Por favor, ingrese un email válido" });
    }
    if (contraseña != confirmacion) {
        errors.push({ text: 'La contraseña no coincide' });
    }
    if (contraseña.length < 7) {
        errors.push({ text: "La contraseña ha de tener 7 carácteres como mínimo" });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, usuario, email, contraseña, confirmacion });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'Este email ya está asociado a una cuenta');
            res.redirect('/signup');
        }
        const newUser = new User({ usuario, email, contraseña });
        newUser.contraseña = await newUser.encryptPassword(contraseña);
        await newUser.save();
        res.locals.user = newUser;
        res.redirect('/signin');
    }
});

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true
}));

router.get('/new', isAuthenticated, async (req, res) => {
    res.render('new');
});

router.post('/new', isAuthenticated, async (req, res) => {
    const { titulo, descripcion, lugar, date, compañia, detalles } = req.body;
    const errors = [];
    if (titulo.length <= 0) {
        errors.push({ text: "Por favor, ingrese un titulo válido" });
    }
    if (descripcion.length <= 0) {
        errors.push({ text: "Por favor, ingrese un email válido" });
    }
    if (errors.length > 0) {
        res.render('signup', { errors, titulo, descripcion, lugar, date, compañia, detalles });
    } else {
        const usuarios = res.locals.user._id;
        const newCita = new Cita({ usuarios, titulo, descripcion, lugar, date, compañia, detalles });
        await newCita.save();
        res.redirect('/pending');
    }
});

router.get('/pending', isAuthenticated, async (req, res) => {
    const citas = await Cita.find();
    res.render('pending', { citas });
});

router.delete('/pending/:cita_id/', isAuthenticated, async (req, res) => {
    const cita = await Cita.findById(req.params.cita_id);
    if (cita) {
        await cita.remove();
        req.flash('success_msg', 'Cita eliminada');
        res.redirect('/pending');
    } else {
        req.flash('error_msg', 'La cita no ha podido eliminarse');
        res.redirect('/pending');
    }
});

router.get('/pending/:cita_id/edit', isAuthenticated, async (req, res) => {
    const cita = await Cita.findById(req.params.cita_id);
    res.render("editar", { cita });
});

router.put('/editar/:cita_id', isAuthenticated, async (req, res) => {
    const { titulo, descripcion, lugar, date, compañia, detalles } = req.body;
    const cita = await Cita.findById(req.params.cita_id);
    if (cita) {
        await Cita.findByIdAndUpdate(req.params.cita_id, { titulo, descripcion, lugar, date, compañia, detalles });
        req.flash('success_msg', 'Cita actualizada');
        res.redirect("/pending");
    }
    else{
        req.flash('error_msg', 'La cita no ha podido editarse');
        res.redirect('/pending');
    }
});

router.get('/logout', isAuthenticated, (req,res) => {
    req.logout();
    req.flash('success_msg', 'Has salido de tu sesión correctamente');
    res.redirect('/signin');
});



module.exports = router;