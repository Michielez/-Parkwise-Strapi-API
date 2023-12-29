"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/current-sessions/me",
      handler: "current-session.findCurrentUserCurrentSessions",
      config: {
        policies: [],
        middlewares: [],
      }
    }
  ]
}
