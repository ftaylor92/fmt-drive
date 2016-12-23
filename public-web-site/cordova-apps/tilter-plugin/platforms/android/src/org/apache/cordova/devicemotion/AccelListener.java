/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package org.apache.cordova.devicemotion;

import java.util.List;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import android.os.Handler;
import android.os.Looper;

/**
 * This class listens to the accelerometer sensor and stores the latest
 * acceleration values x,y,z.
 */
public class AccelListener extends CordovaPlugin implements SensorEventListener {

	public static float zzz= 3.0F;
    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;
   
private float rx,ry,rz;
    private float ogx,ogy,ogz;                                // most recent acceleration values
    private float mx,my,mz;                                // most recent acceleration values
    private float gx,gy,gz;                                // most recent acceleration values
    private float orx,ory,orz;                                // most recent acceleration values
    private float gyx,gyy,gyz;                                // most recent acceleration values
    private long timestamp;                         // time of most recent value
    private int status;                                 // status of listener
    private int accuracy = SensorManager.SENSOR_STATUS_UNRELIABLE;

    private SensorManager sensorManager;    // Sensor manager
    private Sensor mOrigSensor;                           // Acceleration sensor returned by sensor manager
    private Sensor mMotionSensor;                     // Acceleration sensor returned by sensor manager
    private Sensor mGravitySensor;                     // Acceleration sensor returned by sensor manager
    private Sensor mGyroSensor;                     // Acceleration sensor returned by sensor manager
    private Sensor mOrientSensor;                     // Acceleration sensor returned by sensor manager
	private Sensor mRotateSensor;

    private CallbackContext callbackContext;              // Keeps track of the JS callback context.

    private Handler mainHandler=null;
    private Runnable mainRunnable =new Runnable() {
        public void run() {
            AccelListener.this.timeout();
        }
    };

    /**
     * Create an accelerometer listener.
     */
    public AccelListener() {
        this.rx = 0;
        this.ry = 0;
        this.rz = 0;

        this.gx = 0;
        this.gy = 0;
        this.gz = 0;

        this.gyx = 0;
        this.gyy = 0;
        this.gyz = 0;

        this.mx = 0;
        this.my = 0;
        this.mz = 0;

        this.orx = 0;
        this.ory = 0;
        this.orz = 0;

        this.ogx = 0;
        this.ogy = 0;
        this.ogz = 0;

        this.timestamp = 0;
        this.setStatus(AccelListener.STOPPED);
     }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The associated CordovaWebView.
     */
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.sensorManager = (SensorManager) cordova.getActivity().getSystemService(Context.SENSOR_SERVICE);
    }

    /**
     * Executes the request.
     *
     * @param action        The action to execute.
     * @param args          The exec() arguments.
     * @param callbackId    The callback id used when calling back into JavaScript.
     * @return              Whether the action was valid.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        if (action.equals("start")) {
            this.callbackContext = callbackContext;
            if (this.status != AccelListener.RUNNING) {
                // If not running, then this is an async call, so don't worry about waiting
                // We drop the callback onto our stack, call start, and let start and the sensor callback fire off the callback down the road
                this.start();
            }
        }
        else if (action.equals("stop")) {
            if (this.status == AccelListener.RUNNING) {
                this.stop();
            }
        } else {
          // Unsupported action
            return false;
        }

        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT, "");
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
        return true;
    }

    /**
     * Called by AccelBroker when listener is to be shut down.
     * Stop listener.
     */
    public void onDestroy() {
        this.stop();
    }

    //--------------------------------------------------------------------------
    // LOCAL METHODS
    //--------------------------------------------------------------------------
    //
    /**
     * Start listening for acceleration sensor.
     * 
     * @return          status of listener
    */
    private int start() {
        // If already starting or running, then just return
        if ((this.status == AccelListener.RUNNING) || (this.status == AccelListener.STARTING)) {
            return this.status;
        }

        this.setStatus(AccelListener.STARTING);

        // Get accelerometer from sensor manager
        List<Sensor> list = this.sensorManager.getSensorList(Sensor.TYPE_ACCELEROMETER);

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
          this.mOrigSensor = list.get(0);
          this.sensorManager.registerListener(this, this.mOrigSensor, SensorManager.SENSOR_DELAY_UI);
          this.setStatus(AccelListener.STARTING);
        } else {
          this.setStatus(AccelListener.ERROR_FAILED_TO_START);
          this.fail(AccelListener.ERROR_FAILED_TO_START, "No sensors found to register accelerometer listening to.");
          //return this.status;
        }

		list = this.sensorManager.getSensorList(Sensor.TYPE_GRAVITY);

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
          this.mGravitySensor = list.get(0);
          this.sensorManager.registerListener(this, this.mGravitySensor, SensorManager.SENSOR_DELAY_UI);
          this.setStatus(AccelListener.STARTING);
        } else {
          this.setStatus(AccelListener.ERROR_FAILED_TO_START);
          this.fail(AccelListener.ERROR_FAILED_TO_START, "No sensors found to register accelerometer listening to.");
//          return this.status;
        }

		list = this.sensorManager.getSensorList(Sensor.TYPE_GYROSCOPE);

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
          this.mGyroSensor = list.get(0);
          this.sensorManager.registerListener(this, this.mGyroSensor, SensorManager.SENSOR_DELAY_UI);
          this.setStatus(AccelListener.STARTING);
        } else {
          this.setStatus(AccelListener.ERROR_FAILED_TO_START);
          this.fail(AccelListener.ERROR_FAILED_TO_START, "No sensors found to register accelerometer listening to.");
//          return this.status;
        }

		list = this.sensorManager.getSensorList(Sensor.TYPE_LINEAR_ACCELERATION);

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
          this.mMotionSensor = list.get(0);
          this.sensorManager.registerListener(this, this.mMotionSensor, SensorManager.SENSOR_DELAY_UI);
          this.setStatus(AccelListener.STARTING);
        } else {
          this.setStatus(AccelListener.ERROR_FAILED_TO_START);
          this.fail(AccelListener.ERROR_FAILED_TO_START, "No sensors found to register accelerometer listening to.");
          //return this.status;
        }

		list = this.sensorManager.getSensorList(Sensor.TYPE_ORIENTATION );

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
          this.mOrientSensor = list.get(0);
          this.sensorManager.registerListener(this, this.mOrientSensor, SensorManager.SENSOR_DELAY_UI);
          this.setStatus(AccelListener.STARTING);
        } else {
          this.setStatus(AccelListener.ERROR_FAILED_TO_START);
          this.fail(AccelListener.ERROR_FAILED_TO_START, "No sensors found to register accelerometer listening to.");
          //return this.status;
        }

		list = this.sensorManager.getSensorList(Sensor.TYPE_ROTATION_VECTOR);

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
          this.mRotateSensor = list.get(0);
          this.sensorManager.registerListener(this, this.mRotateSensor, SensorManager.SENSOR_DELAY_UI);
          this.setStatus(AccelListener.STARTING);
        } else {
          this.setStatus(AccelListener.ERROR_FAILED_TO_START);
          this.fail(AccelListener.ERROR_FAILED_TO_START, "No sensors found to register accelerometer listening to.");
          //return this.status;
        }

        // Set a timeout callback on the main thread.
        stopTimeout();
        mainHandler = new Handler(Looper.getMainLooper());
        mainHandler.postDelayed(mainRunnable, 2000);

        return this.status;
    }
    private void stopTimeout() {
        if(mainHandler!=null){
            mainHandler.removeCallbacks(mainRunnable);
        }
    }
    /**
     * Stop listening to acceleration sensor.
     */
    private void stop() {
        stopTimeout();
        if (this.status != AccelListener.STOPPED) {
            this.sensorManager.unregisterListener(this);
        }
        this.setStatus(AccelListener.STOPPED);
        this.accuracy = SensorManager.SENSOR_STATUS_UNRELIABLE;
    }

    /**
     * Returns an error if the sensor hasn't started.
     *
     * Called two seconds after starting the listener.
     */
    private void timeout() {
        if (this.status == AccelListener.STARTING) {
            this.setStatus(AccelListener.ERROR_FAILED_TO_START);
            this.fail(AccelListener.ERROR_FAILED_TO_START, "Accelerometer could not be started.");
        }
    }

    /**
     * Called when the accuracy of the sensor has changed.
     *
     * @param sensor
     * @param accuracy
     */
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Only look at accelerometer events
        if (sensor.getType() != Sensor.TYPE_ACCELEROMETER) {
            return;
        }

        // If not running, then just return
        if (this.status == AccelListener.STOPPED) {
            return;
        }
        this.accuracy = accuracy;
    }

    /**
     * Sensor listener event.
     *
     * @param SensorEvent event
     */
    public void onSensorChanged(SensorEvent event) {
        // Only look at accelerometer events
        if (event.sensor.getType() != Sensor.TYPE_ACCELEROMETER && 
event.sensor.getType() != Sensor.TYPE_GRAVITY && 
event.sensor.getType() != Sensor.TYPE_GYROSCOPE && 
event.sensor.getType() != Sensor.TYPE_LINEAR_ACCELERATION && 
event.sensor.getType() != Sensor.TYPE_ORIENTATION && 
event.sensor.getType() != Sensor.TYPE_ROTATION_VECTOR
			) {
            return;
        }

        // If not running, then just return
        if (this.status == AccelListener.STOPPED) {
            return;
        }
        this.setStatus(AccelListener.RUNNING);

        if (this.accuracy >= SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM) {

            // Save time that event was received
            this.timestamp = System.currentTimeMillis();
			if(event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
		        this.ogx = event.values[0];
		        this.ogy = event.values[1];
		        this.ogz = event.values[2];
			}
			if(event.sensor.getType() == Sensor.TYPE_GRAVITY) {
		        this.gx = event.values[0];
		        this.gy = event.values[1];
		        this.gz = event.values[2];
			}
			if(event.sensor.getType() == Sensor.TYPE_GYROSCOPE) {
		        this.gyx = event.values[0];
		        this.gyy = event.values[1];
		        this.gyz = event.values[2];
			}
			if(event.sensor.getType() == Sensor.TYPE_LINEAR_ACCELERATION) {
		        this.mx = event.values[0];
		        this.my = event.values[1];
		        this.mz = event.values[2];
			}
			if(event.sensor.getType() == Sensor.TYPE_ORIENTATION) {
		        this.orx = event.values[0];
		        this.ory = event.values[1];
		        this.orz = event.values[2];
			}
			if(event.sensor.getType() == Sensor.TYPE_ROTATION_VECTOR) {
		        this.rx = event.values[0];
		        this.ry = event.values[1];
		        this.rz = event.values[2];
			}

            this.win();
        }
    }

    /**
     * Called when the view navigates.
     */
    @Override
    public void onReset() {
        if (this.status == AccelListener.RUNNING) {
            this.stop();
        }
    }

    // Sends an error back to JS
    private void fail(int code, String message) {
        // Error object
        JSONObject errorObj = new JSONObject();
        try {
            errorObj.put("code", code);
            errorObj.put("message", message);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        PluginResult err = new PluginResult(PluginResult.Status.ERROR, errorObj);
        err.setKeepCallback(true);
        callbackContext.sendPluginResult(err);
    }

    private void win() {
        // Success return object
        PluginResult result = new PluginResult(PluginResult.Status.OK, this.getAccelerationJSON());
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }

    private void setStatus(int status) {
        this.status = status;
    }
    private JSONObject getAccelerationJSON() {
        JSONObject r = new JSONObject();
        try {
            r.put("ogx", this.ogx);
            r.put("ogy", this.ogy);
            r.put("ogz", 3.0F /*this.ogz*/);
           r.put("orx", this.orx);
            r.put("ory", this.ory);
            r.put("orz", 3.0F /*this.orz*/);
           r.put("mx", this.mx);
            r.put("my", this.my);
            r.put("mz", 3.0F /*this.mz*/);
           r.put("gx", this.gx);
            r.put("gy", this.gy);
            r.put("gz", 3.0F /*this.gz*/);
           r.put("gyx", this.gyx);
            r.put("gyy", this.gyy);
            r.put("gyz", 3.0F /*this.gyz*/);
           r.put("rx", this.rx);
            r.put("ry", this.ry);
            r.put("rz", 3.0F /*this.rz*/);
            r.put("timestamp", this.timestamp);
        r.put("ogx", this.ogx);
            r.put("ogy", this.ogy);
            r.put("ogz", 3.0F /*this.ogz*/);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return r;
    }
}
