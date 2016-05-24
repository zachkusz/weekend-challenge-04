var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/to-do-list';

router.delete('/:id', function(req, res) { //could copy from delete to unique get request
  var id = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM tasks ' +
                'WHERE id = $1 ' ,
                [id],
                function(err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                    return;
                  }
                  res.sendStatus(200);
                }
    );
  });
});

router.put('/', function(req, res) {
  var task = req.body;
  console.log(task);

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE tasks ' +
                  'SET complete = $1 ' +
                  'WHERE id = $2', [task.complete, task.id],
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  }
    );
  });
});

router.get('/', function (req, res) {
  console.log('get call');

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks ORDER BY id DESC',
      function(err, result) {
      done();

      res.send(result.rows);

    });
  });
});

router.post('/', function(req, res) {
  var task = req.body;
  console.log('post call');

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO tasks (description, complete) ' +
                    'VALUES ($1, $2)', [task.description, task.complete], //will complete cause errs?
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(201);
                  }
    );
  });
});

module.exports = router;
