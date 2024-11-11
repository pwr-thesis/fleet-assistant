module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-coverage-istanbul-reporter')
        ],
        client: {
            clearContext: false
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, './coverage'),
            reports: ['html', 'text-summary'],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml', 'coverage-istanbul'],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        restartOnFileChange: false
    });
};
