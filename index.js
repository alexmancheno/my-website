var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

var dbURL = 'postgres://localhost:5432/my_website';
console.log(dbURL);

app.get('/', function(req, res) {
    res.render('homepage');
})

app.get('/portfolio', function(req, res) {
    res.render('portfolio');
})

app.get('/blog', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        client.query(`select * from blog`, function(err, result) {
            res.render('blog/index', {data: result.rows});
            done();
            pg.end();
        })
    })
})

app.get('/blog/:id', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        var blog_id = req.params.id;
        client.query(`select * from blog where id = '${blog_id}' `, function(err, result) {
            console.log(result + " yuuuup");
            res.render('blog/blog_post', {data: result.rows[0]});
            console.log(result.rows);
            done();
            pg.end();
        })
    })
})

app.get('/edit-posts', function(req, res) {
    res.render('blog/edit-posts');
})

//edit entries
app.post('/edit-posts', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        client.query(`insert into blog (title, body) values('${req.body.title})', '${req.body.body}')`, function(err, result) {
            res.redirect('/blog');
            done();
            pg.end();
        })
    })
})

app.listen(3000, function() {
    console.log("Your app is running!");
})
