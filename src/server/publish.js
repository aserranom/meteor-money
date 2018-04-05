/* global FXRates */
Meteor.publish('money-package-fxrates', function () {
  check();
  const self = this;

  if (!self.userId) {
    this.ready();
    return undefined;
  }

  if (this.unblock) { // if meteorhacks:unblock is installed, let's use it
    this.unblock();
  }

  return FXRates.find({}, {
    sort: {
      timestamp: -1
    },
    limit: 1,
  });
});

Meteor.publish('fxrates', function () {
  check();

  return FXRates.find({}, {
    sort: {
      timestamp: -1
    },
    limit: 1,
  });
});
