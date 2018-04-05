/* global SyncedCron, FXRates, FXRatesHelper */
/* eslint no-console:0 */
"use strict";

FXRatesHelper.updateFxRates = function() {
  var appId = Meteor.settings && Meteor.settings.OpenExchange && Meteor.settings.OpenExchange.appId;
  if (!appId) {
    console.error("updateFxRates: Unable to get fx rates with no app id");
    return;
  }
  var url = 'http://openexchangerates.org/api/latest.json?app_id=' + appId;
  var doc = HTTP.get(url);
  if (doc.statusCode !== 200) {
    console.error("updateFxRates: GET to " + url + " returned with status code: " + doc.statusCode +
      ".  Doc: " + EJSON.stringify(doc));
    return;
  }

  FXRates.upsert({
    timestamp: doc.content.timestamp
  }, {
    $set: EJSON.parse(doc.content)
  });
};

Meteor.startup(function() {
  Meteor.defer(function() {
    if(!FXRates.findOne()) {
      FXRatesHelper.updateFxRates();
    }
  });

  //this job gets updated fx rates
  SyncedCron.add({
    name: 'Update fx rates',
    schedule: function(parser) {
      // parser is a later.parse object
      var schedule = Meteor.settings && Meteor.settings.OpenExchange &&
        Meteor.settings.OpenExchange.updateSchedule || "every 1 day";
      // var schedule = 'every minute';
      return parser.text(schedule);
    },
    job: function() {
      FXRatesHelper.updateFxRates();
    }
  });
});
