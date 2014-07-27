var Metalsmith  = require('metalsmith');
    markdown    = require('metalsmith-markdown');
    templates   = require('metalsmith-templates');
    collections = require('metalsmith-collections');
    permalinks  = require('metalsmith-permalinks');
    Handlebars  = require('handlebars');
    fs          = require('fs');

Handlebars.registerPartial('header',
fs.readFileSync(__dirname + '/src/templates/header.hbt').toString());
Handlebars.registerPartial('footer',
fs.readFileSync(__dirname + '/src/templates/footer.hbt').toString());

Metalsmith(__dirname)
    .use(collections({
        pages: {
            pattern: 'pages/*.md'
        },
        posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(markdown())
    .use(permalinks({
        pattern: ':collection/:title'
    }))
    .use(templates({
       engine: 'handlebars',
       directory: 'src/templates'
    }))
    .destination('./public')
    .clean(false)
    .build(function(err,files){
        if (err){ console.log(err); }
    });
