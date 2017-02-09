# asset-service

Fornisce api per la registrazione di 
un nuovo asset, la modifica del suo stato
e l'interrogazione dello stato di un asset.

##INSTALL
``` npm install @vivoil/assert-service ```

## Usage
```
const assetService = require('@vivoil/asset-service')

var service = assetService()

```

### Adding an asset
**service.add(name[, callback])**

### Updating an asset
**service.update(id, state[, callback])**

### Queryiung an asset state
**service.query(id[, callback])**
