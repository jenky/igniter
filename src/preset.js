import { Preset } from 'apply'

Preset.setName('Igniter')

Preset.extract()

Preset.confirm('schema', 'Do you want to set default string length to `191` for schema migration', true)

Preset.group(preset => {
  preset.edit('app/Providers/AppServiceProvider.php')
    .addAfter('ServiceProvider;', 'use Illuminate\\Support\\Facades\\Schema;')

  preset.edit('app/Providers/AppServiceProvider.php')
    .addAfter('public function boot', 'Schema::defaultStringLength(191);')
    .skipLines(1)
    .withIndent('double')
})
  .ifPrompt('schema')
  .withTitle('Set Schema default length')

Preset.editPhpPackages()
  .withTitle('Setup Composer dependencies')
  .add('doctrine/dbal', '^3.1')
  .addDev('friendsofphp/php-cs-fixer', '^3.1')
  .set('autoload.files', ['app/Support/helpers.php'])

// Preset.group(preset => {
//   preset.editNodePackages()
//     .remove('axios')
//     .remove('lodash')
//     .add('axios', '^0.19')
//     .add('lodash', '^4.17.13')
//     .addDev('husky', '^4.2.5')
//     .addDev('lint-staged', '^10.2.5')

//   preset.editNodePackages().merge({
//     husky: {
//       hooks: {
//         'pre-commit': 'lint-staged'
//       }
//     },
//     'lint-staged': {
//       '*.php': 'php ./vendor/bin/php-cs-fixer fix --config .php_cs'
//     }
//   })
// })

Preset.editJson('package.json')
  .delete([
    'devDependencies.axios',
    'devDependencies.lodash',
  ])
  .withTitle('Setup Node dependencies')
  .merge({
    dependencies: {
      axios: '^0.21',
      lodash: '^4.17.19'
    },
    devDependencies: {
      husky: '^6.0.0',
      'lint-staged': '^10.5.1'
    },
    'lint-staged': {
      '*.php': 'php ./vendor/bin/php-cs-fixer fix'
    }
  })

Preset.edit('.gitignore')
  .withTitle('Update .gitignore')
  .addAfter('.phpunit.result.cache', '.php_cs.cache')

Preset.edit('config/logging.php')
  .update(content => content.replace(`['single']`, `['daily']`))
  .withTitle('Set stack log channels to daily')

Preset.installDependencies('node')
  .ifUserApproves()
  .withTitle('Install Node dependencies')

Preset.execute('npx', 'husky', 'install')
Preset.execute('npm', 'set-script', 'prepare', 'husky install')
  .withTitle('Install Husky')

Preset.execute('npx', 'husky', 'add', '.husky/pre-commit', '"npx lint-staged"')

Preset.installDependencies('php')
  .ifUserApproves()
  .withTitle('Install PHP dependencies')
