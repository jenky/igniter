const { Preset } = require('use-preset');

module.exports = Preset.make('Igniter')
  .option('interaction', true)
  .option('schema', false)
  .prompts()
    .confirm('Do you want to set default string length to `191` for schema migration', 'schema')
    .chain()
  .copyTemplates('ask')
  .edit('app/Providers/AppServiceProvider.php')
    .if(({ flags, prompts }) => Boolean(flags.schema) || Boolean(prompts.schema))
    .title('Set Schema default length')
    .search(/use Illuminate\\Support\\ServiceProvider;/)
			.addBefore('use Illuminate\\Support\\Facades\\Schema;')
			.end()
    .search(/public function boot\(\)/)
      .addAfter([
        `{`,
        `    Schema::defaultStringLength(191);`,
      ])
      .removeAfter(2) // Removes opening curly bracket and comment
      .end()
    .chain()
  .editJson('composer.json')
    .title('Setup Composer dependencies')
    .merge({
      require: {
        'doctrine/dbal': '^2.10'
      },
      'require-dev': {
        'friendsofphp/php-cs-fixer': '^2.16'
      },
      autoload: {
        files: [
          'app/Support/helpers.php'
        ]
      }
    })
    .chain()
  .editJson('package.json')
    .delete([
      'devDependencies.axios',
      'devDependencies.lodash',
    ])
    .title('Setup Node dependencies')
    .merge({
      dependencies: {
        axios: '^0.19',
        lodash: '^4.17.13'
      },
      devDependencies: {
        husky: '^4.2.5',
        'lint-staged': '^10.2.5'
      },
      husky: {
        hooks: {
          'pre-commit': 'lint-staged'
        }
      },
      'lint-staged': {
        '*.php': 'php ./vendor/bin/php-cs-fixer fix --config .php_cs'
      }
    })
    .chain()
  .edit('.gitignore')
    .title('Update .gitignore')
    .search(/\.phpunit\.result\.cache/)
      .addAfter('.php_cs.cache')
      .end()
    .chain()
  .edit('config/logging.php')
    .title('Set stack log channels to daily')
    .replace(`['single']`)
      .with(`['daily']`)
    .chain()
  .installDependencies()
    .if(({ flags }) => Boolean(flags.interaction))
    .for('node')
    .title('Install Node dependencies')
    .chain()

  .updateDependencies()
    .if(({ flags }) => Boolean(flags.interaction))
    .for('php')
    .title('Install PHP dependencies')
    .chain();
