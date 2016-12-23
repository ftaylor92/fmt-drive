cordova.define("org.apache.cordova.device-motion.Acceleration", function(require, exports, module) { /*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var Acceleration = function(ogx, ogy, ogz,mx, my, mz, gx, gy, gz,gyx, gyy, gyz,orx, ory, orz,rx, ry, rz, timestamp) {
    this.ogx = ogx;
    this.ogy = ogy;
    this.ogz = ogz;

    this.mx = mx;
    this.my = my;
    this.mz = mz;

    this.gx = gx;
    this.gy = gy;
    this.gz = gz;

    this.gyx = gyx;
    this.gyy = gyy;
    this.gyz = gyz;

    this.orx = orx;
    this.ory = ory;
    this.orz = orz;

    this.rx = rx;
    this.ry = ry;
    this.rz = rz;

    this.timestamp = timestamp || (new Date()).getTime();
};

module.exports = Acceleration;

});
