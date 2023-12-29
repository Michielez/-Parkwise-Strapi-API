"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/recent-transactions/me",
      handler: "recent-transaction.findCurrentUserRecentTransactions",
      config: {
        policies: [],
        middlewares: [],
      }
    }
  ]
}
