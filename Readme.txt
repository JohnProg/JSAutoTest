
Env setup:
1.install appium according to website appium.io
2.make sure js project has been pulled and can be run successfully
3.install nvm and run “npm install” in “test” folder

How to use:
1.open termial
2.make sure app has been built
3.modify app path in test/helpers/apps.js (can take PWCApp in apps.js as example)
4.input ”appium -g /tmp/appium.log --log-timestamp &” to run appium in backgroud
5.input ”mocha [case folder]/[case] > /tmp/mocha.log” to run specified test case