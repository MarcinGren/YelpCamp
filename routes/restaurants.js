const express               = require('express'),
      router                = express.Router(),
      Restaurant            = require('../models/restaurant'),
      isLoggedIn            = require('../scripts/is-logged-in'),
      checkCampgroundAuthor = require('../scripts/check-campground-author')

// INDEX ROUTE
router.get('/', function (req, res) {
    Restaurant.find({}, function (err, allRestaurants) {
        if (err) {
            console.log('COULDNT OBTAIN RESTAURANTS')
        } else {
            res.render('restaurants-index.ejs', {
                restaurants: allRestaurants
            })
        }
    })
})

// CREATE ROUTE
router.post('/', isLoggedIn, function (req, res) {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var menu = req.body.menu
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRestaurant = {
        name: name,
        image: image,
        menu: menu,
        description: desc,
        author: author
    }
    Restaurant.create(newRestaurant, function (err) {
        console.log(err)
    })
    res.redirect('/restaurants')
})

// NEW ROUTE
router.get('/new', isLoggedIn, function (req, res) {
    res.render('restaurants-new.ejs')
})

// SHOW ROUTE
router.get('/:id', function (req, res) {
    Restaurant.findById(req.params.id).populate('comments').exec(function (err, restaurantUsed) {
        if (err) {
            console.log(err)
        } else {
            res.render('restaurants-show.ejs', {
                restaurant: restaurantUsed
            })
        }
    })
})

// EDIT ROUTE
router.get('/:id/edit', checkCampgroundAuthor, function (req, res) {
    Restaurant.findById(req.params.id, function (err, foundRestaurant) {
        res.render('restaurants-edit.ejs', {restaurant: foundRestaurant})
    })
})

// UPDATE ROUTE
router.put('/:id', checkCampgroundAuthor, function(req, res) {
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant) {
        if (err) {
            res.redirect('/restaurants')
        } else {
            res.redirect(`/restaurants/${req.params.id}`)
        }
    })
})

// DESTROY ROUTE
router.delete('/:id', checkCampgroundAuthor, function(req, res) {
    Restaurant.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/restaurants')
        } else {
            res.redirect('/restaurants')
        }
    })
})

module.exports = router