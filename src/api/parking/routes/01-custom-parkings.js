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
      path: "/parkings/verlaat",
      handler: "parking.verlaat"
    }
  ]
}
