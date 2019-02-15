module.exports = function(config) {
  config.set({
      frameworks: ["mocha", "karma-typescript"],
      files: [
          "packages/**/test/*.spec.ts"
      ],
      preprocessors: {
          "**/*.ts": "karma-typescript"
      },
      reporters: ["progress", "karma-typescript", 'mocha', 'coverage-istanbul'],

      // browsers: ['ChromeHeadlessNoSandbox'],
      browsers: ['Chrome'],

      karmaTypescriptConfig: {
        compilerOptions: {
            "sourceMap": true, // allow sourcemap support
            "declaration": true,
            "moduleResolution": "node",
            "experimentalDecorators": true,
            lib: [
              "es2018",
              "dom"
          ],
          plugins: [
            {
                "name": "typescript-lit-html-plugin"
            }
          ]
        },
    },
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },

      mochaReporter: {
        showDiff: true,
      },

      colors: true,

      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: config.LOG_INFO,

      // ## code coverage config
      coverageIstanbulReporter: {
        reports: ['html', 'lcovonly', 'text-summary'],
        dir: 'coverage',
        combineBrowserReports: true,
        skipFilesWithNoCoverage: true,
        thresholds: {
          global: {
            statements: 90,
            branches: 90,
            functions: 90,
            lines: 90,
          },
        },
      },

      autoWatch: true,
      singleRun: false
  });
};