# CLS shimmer for Mongoose

Adds CLS wrapper for Mongoose, making mongoose safe to use with [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage).

Usage: 

```js
var cls = require('continuation-local-storage');
var clsMongoose = require('cls-mongoose');

// or cls.getNamespace if exists
var clsns = cls.createNamespace('app');

var mongoose = require('mongoose');
clsMongoose(clsns);
```

After `mongoose` is patched, use it as usual.
