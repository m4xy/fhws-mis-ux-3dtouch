/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');


        document.addEventListener('deviceready', function ()
        {
            // on cordova start, asks plugin continuosly for ForceTouchData
            setInterval(getForceTouchData,15); // 15? => 1000ms/15 = ~60fps;
        }, false);

        // getForceTouchData Method
        function getForceTouchData()
        {
            ForceTouch.getForceTouchData(function (ForceTouchData)
            {
                // checking if device allows ForceTouch interaction
                var forceTouchCapability = '';
                switch(ForceTouchData.forceTouchCapability)
                {
                    case '0':
                        forceTouchCapability = 'Unknown';
                        break;
                    case '1':
                        forceTouchCapability = 'Unavailable';
                        break;
                    case '2':
                        forceTouchCapability = 'Available';
                        break;
                }

                document.getElementById('forceTouchCapability').innerHTML = forceTouchCapability;

                if(ForceTouchData.touches[0])
                {
                    // setting output values for first Touch Point at index:0 -> "ForceTouchData.touches[0]"
                    document.getElementById('timestamp').innerHTML = ForceTouchData.touches[0].timestamp;
                    document.getElementById('force').innerHTML = ForceTouchData.touches[0].force;

                    var force = parseFloat(ForceTouchData.touches[0].force);
                    // checking if No Touch or StandardTouch or Force Touch
                    if(ForceTouchData.touches[0].tapCount == 0 && force == 0.0)
                        document.getElementById('touchType').innerHTML = 'No Touch';
                    else
                    if((ForceTouchData.touches[0].tapCount > 0 && force == 0.0) || (force > 0.0 && force < 0.08))
                        document.getElementById('touchType').innerHTML = 'Standard Touch';
                    else
                    if(force > 0.08)
                        document.getElementById('touchType').innerHTML = 'Force Touch';

                    // printing Touch Point position coordinates
                    console.log("x: " + ForceTouchData.touches[0].position.x + " ; " + "y: " + ForceTouchData.touches[0].position.y);
                }
                else
                {
                    // no Touch Point available -> resetting output values
                    document.getElementById('timestamp').innerHTML = '0.000000';
                    document.getElementById('force').innerHTML = '0.000000';
                    document.getElementById('touchType').innerHTML = 'No Touch';
                }
                // printing ForceTouchData output for each Touch Point available on screen
                console.log(JSON.stringify(ForceTouchData.touches));
            });
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();