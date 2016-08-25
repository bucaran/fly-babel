const test = require('tape').test
const babel = require('../')

test('fly-babel', function (t) {
  t.plan(5)
  babel.call({
    filter: function (name, transform) {
      const content = 'let a = 0'
      const result = transform(content, {file: {}, presets: ['es2015']})
      const map = transform(content, {file: {}, sourceMaps: true}).map

      t.equal(name, 'babel', 'add babel filter')
      t.ok(/var a/.test(result.code), 'babel transform')
      t.equal(result.ext, '.js', 'extension is .js')
      t.equal(result.map, null, 'no sourcemaps by default')
      t.equal(map.sourcesContent[0], content, 'turn on sourcemaps')
    }
  })
  t.end()
})

test('fly-babel preloading does nothing if plugins/presets not found', function (t) {
  t.plan(1)
  babel.call({
    filter: function (name, transform) {
      const content = 'let a = 0'
      const result = transform(content, {file: {}, preload: true})

      t.notOk(/var a/.test(result.code), 'code not transformed')
    }
  })
  t.end()
})

test('fly-babel preloading will load presets & continue transformation', function (t) {
  t.plan(3)
  process.chdir(__dirname)
  babel.call({
    filter: function (name, transform) {
      const content = 'let a = 0'
      const result = transform(content, {file: {}, preload: true})

      t.equal(name, 'babel', 'babel filter')
      t.ok(/var a/.test(result.code), 'code transformed')
      t.equal(result.ext, '.js', 'correct extension')
    }
  })
  t.end()
})

test('fly-babel preloading will load plugins & continue transformation', function (t) {
  t.plan(3)
  babel.call({
    filter: function (name, transform) {
      const fixture = 'var obj = {}; obj::func'
      const result = transform(fixture, {file: {}, preload: true})

      t.equal(name, 'babel', 'babel filter')
      t.ok(/func\.bind\(obj\)/.test(result.code), 'code transformed')
      t.equal(result.ext, '.js', 'correct extension')
    }
  })
  t.end()
})
