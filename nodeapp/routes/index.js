var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'Testing' });
});

/* GET from db */
router.get('/teststorage', function(req, res) {
  var db = req.db;
  db.collection('teststorage').find().toArray(function (err, items) {
  	res.json(items);
  });
});

/* POST to db */
router.post('/teststorage', function(req, res) {
	var db = req.db;
	db.collection('teststorage').insert(req.body, function(err, result) {
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

/* Delete API response entry */
router.delete('/teststorage/deleteentry/:id', function(req, res) {
  var db = req.db;
  var entryToDelete = req.params.id;
  db.collection('teststorage').removeById(entryToDelete, function(err, result) {
  	res.send((result === 1) ? { msg: '' } : { msg: 'error: ' + err});
  });
});


module.exports = router;
