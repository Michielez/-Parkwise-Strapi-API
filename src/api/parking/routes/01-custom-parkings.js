"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/parkings/park",
      handler: "parking.park"
    },
    {
      method: "POST",
      path: "/parkings/leave",
      handler: "parking.leave"
    }
  ]
}
