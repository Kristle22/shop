const express = require('express')
const app = express()

const path = require('path');

const port = process.env.PORT || 3003;

if (process.env.NODE_ENV === "production") {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  })
}

const cors = require("cors");
app.use(express.json({ limit: '10mb' }));
app.use(cors());

const mysql = require("mysql");
const md5 = require('js-md5');
const uuid = require('uuid');

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "la_ma_shop",
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const doAuth = function (req, res, next) {
  if (0 === req.url.indexOf('/admin')) {
    // admin
    const sql = `
      SELECT
      name, role
      FROM users
      WHERE session = ?
  `;
    con.query(
      sql, [req.headers['authorization'] || ''],
      (err, results) => {
        if (err) throw err;
        console.log('bebe', results);
        if (!results.length || results[0].role !== 'admin') {
          res.status(401).send({});
          req.connection.destroy();
        } else {
          next();
        }
      }
    );
  } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login')) {
    next();
  } else {
    // FRONT
    const sql = `
      SELECT
      name, role
      FROM users
      WHERE session = ?
  `;
    con.query(
      sql, [req.headers['authorization'] || ''],
      (err, results) => {
        if (err) throw err;
        if (!results.length) {
          res.status(401).send({});
          req.connection.destroy();
        } else {
          next();
        }
      }
    );
  }
}
app.use(doAuth)

/////////////////////AUTH///////////////////////
app.get("/login-check", (req, res) => {
  let sql;
  let requests;
  if (req.query.role === 'admin') {
    sql = `
      SELECT
      name
      FROM users
      WHERE session = ? AND role = ?
      `;
    requests = [req.headers['authorization'] || '', req.query.role];
  } else {
    sql = `
      SELECT
      name
      FROM users
      WHERE session = ?
      `;
    requests = [req.headers['authorization'] || ''];
  }
  con.query(sql, requests, (err, result) => {
    if (err) throw err;
    if (!result.length) {
      res.send({ msg: 'error' });
    } else {
      res.send({ msg: 'ok' });
    }
  });
});

app.post("/login", (req, res) => {
  const key = uuid.v4();
  const sql = `
  UPDATE users
  SET session = ?
  WHERE name = ? AND pass = ?
`;
  con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
    if (err) throw err;
    if (!result.affectedRows) {
      res.send({ msg: 'error', key: '' });
    } else {
      res.send({ msg: 'ok', key });
    }
  });
});

// /////////////REQUESTS TO DATABASE///////////

// CATS
app.post("/adm/kategorijos", (req, res) => {
  const sql = `
  INSERT INTO cats
  (title)
  VALUES (?)
  `;
  con.query(sql, [req.body.title], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, new Cat was created', type: 'success' } });
  });
});
app.get("/adm/kategorijos", (req, res) => {
  const sql = `
SELECT *
FROM cats
ORDER BY title
`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete("/adm/kategorijos/:id", (req, res) => {
  const sql = `
  DELETE FROM cats
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, Cat gone', type: 'success' } });
  });
});
app.put("/adm/kategorijos/:id", (req, res) => {
  const sql = `
  UPDATE cats
  SET title = ?
  WHERE id = ?
  `;
  con.query(sql, [req.body.title, req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, Cat updated. Now it is as new', type: 'success' } });
  });
});

// PRODUCTS
app.post("/adm/prekes", (req, res) => {
  const sql = `
  INSERT INTO products
  (title, price, in_stock, cats_id, photo)
  VALUES (?, ?, ?, ?, ?)
  `;
  con.query(sql, [req.body.title, req.body.price, req.body.inStock, req.body.cat, req.body.photo], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, new and shiny product was created', type: 'success' } });
  });
});

app.get("/adm/prekes", (req, res) => {
  const sql = `
SELECT p.id, price, p.title, c.title AS cat, in_stock, last_update AS lu, photo
FROM products AS p
LEFT JOIN cats AS c
ON c.id = p.cats_id
ORDER BY title
`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
app.delete("/adm/prekes/:id", (req, res) => {
  const sql = `
  DELETE FROM products
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, Product gone', type: 'success' } });
  });
});
app.put("/adm/prekes/:id", (req, res) => {
  const sql = `
  UPDATE products
  SET title = ?, price = ?, last_update = ?, cats_id = ?, in_stock = ?, photo = ?
  WHERE id = ?
  `;
  con.query(sql, [req.body.title, req.body.price, req.body.lu, req.body.cat, req.body.in_stock, req.body.photo, req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, Cat updated. Now it is as new', type: 'success' } });
  });
});

// DELETE PHOTO
app.delete("/adm/nuotrauka/:id", (req, res) => {
  const sql = `
  UPDATE products
  SET photo = null
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, photo gone. Have a nice day.', type: 'success' } });
  });
});

// GET COMMENTS
app.get("/adm/komentai", (req, res) => {
  const sql = `
SELECT com.id AS id, com, p.title AS title
FROM comments AS com
LEFT JOIN products AS p
ON com.product_id = p.id
ORDER BY p.title
`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// DELETE COMMENTS
app.delete("/adm/komentai/:id", (req, res) => {
  const sql = `
  DELETE FROM comments
  WHERE id = ?
  `;
  con.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, Comment was deleted', type: 'success' } });
  });
});

// FRONT Products
app.get("/prekes", (req, res) => {
  let sql;
  let requests;
  // console.log(req.query);
  if (!req.query['cat-id'] && !req.query['s']) {
    sql = `
SELECT p.id, c.id AS cid,  price, p.title, c.title AS cat, in_stock, last_update AS lu, photo, com.id AS com_id, com.com AS coms
FROM products AS p
LEFT JOIN cats AS c
ON c.id = p.cats_id
LEFT JOIN comments AS com
ON p.id = com.product_id
ORDER BY title
`;
    requests = [];
  } else if (req.query['cat-id']) {
    sql = `
    SELECT p.id, c.id AS cid, price, p.title, c.title AS cat, in_stock, last_update AS lu, photo, com.id AS com_id, com.com AS coms
    FROM products AS p
    LEFT JOIN cats AS c
    ON c.id = p.cats_id
    LEFT JOIN comments AS com
    ON p.id = com.product_id
    WHERE p.cats_id = ?
    ORDER BY title
    `;
    requests = [req.query['cat-id']];
  } else {
    sql = `
  SELECT p.id, c.id AS cid, price, p.title, c.title AS cat, in_stock, last_update AS lu, photo, com.id AS com_id, com.com AS coms
  FROM products AS p
  LEFT JOIN cats AS c
  ON c.id = p.cats_id
  LEFT JOIN comments AS com
  ON p.id = com.product_id
  WHERE p.title LIKE ?
  ORDER BY title
  `;
    requests = ['%' + req.query['s'] + '%'];
  }
  con.query(sql, requests, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// FRONT Categories
app.get("/kategorijos", (req, res) => {
  const sql = `
SELECT *
FROM cats
ORDER BY title
`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// COMMENTS
app.post("/front/komentai", (req, res) => {
  const sql = `
  INSERT INTO comments
  (com, product_id)
  VALUES (?, ?)
  `;
  con.query(sql, [req.body.com, req.body.product_id], (err, result) => {
    if (err) throw err;
    res.send({ result, msg: { text: 'OK, new Comment was created', type: 'success' } });
  });
});

// POST => UPDATE CURRENCY
app.post("/adm/valiuta", (req, res) => {
  let val = '';
  for (const c in req.body.data) {
    console.log(req.body.data[c]);
    val += `('${req.body.data[c].code}', ${req.body.data[c].value}),`
  }
  val = val.slice(0, -1);

  const sql = `
  INSERT INTO currency
  /*currency of 2022-07-14*/
  (code, value)
  VALUES ${val}

  ON DUPLICATE KEY UPDATE
  value = VALUES(value)
  `;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send({ result });
  });
});

// GET FRONT CURRENCY
app.get("/valiuta", (req, res) => {
  const sql = `
SELECT *
FROM currency
`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Peleda klauso porto ${port}`)
})