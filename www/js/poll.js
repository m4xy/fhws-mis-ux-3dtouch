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

        document.addEventListener('deviceready', function ()
        {
            $.getJSON( "js/emoji.json", function( emojis ) {
                window.emojis = emojis;
            });

            var circle = initProgressBar();
            $(document).on('touchstart', function(){
                window.refreshIntervalId = setInterval(getForceTouchData,15); // 15? => 1000ms/15 = ~60fps;
                $('#main-btn').html('Press');
                $('#main-btn').addClass('calculate-mood');
                circle.animate(1, function(){
                    clearInterval(window.refreshIntervalId);
                    $('#main-btn').html('Submit');
                });
            });
            $(document).on('touchend', function(){
                if($('#main-btn').html() != 'Submit')
                    $('#main-btn').removeClass('calculate-mood');
                clearInterval(window.refreshIntervalId);
                circle.stop();
                circle.destroy();
                circle = initProgressBar();
            });
            $('#toggle-sensordata').on('touchstart', function(){
                $('#forcetouch').toggle();
            });
            $('#main-btn').on('touchstart', function(){
                if($('#main-btn').html() == 'Submit') {
                    window.location.href = "index.html";
                }
            });

        }, false);

        function initProgressBar() {
            return new ProgressBar.Circle('#progress', {
                color: '#488aff',
                duration: 3000,
                easing: 'linear'
            });
        }

        function updateEmoji(force) {
            for(var i = 0;i<window.emojis.emojis.length;i++) {
                if(force >= window.emojis.emojis[i]['min'] && force <= window.emojis.emojis[i]['max']) {
                    $('#mood-emoji').html('&#x' + window.emojis.emojis[i]['hex'] + ';');
                }
            }
        }

        function getForceTouchData() {
            ForceTouch.getForceTouchData(function (ForceTouchData)
            {
                var forceTouchCapability = '';
                switch(ForceTouchData.forceTouchCapability) {
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

                if(ForceTouchData.touches[0]) {
                    document.getElementById('timestamp').innerHTML = ForceTouchData.touches[0].timestamp;
                    document.getElementById('force').innerHTML = ForceTouchData.touches[0].force;
                }
                else {
                    document.getElementById('timestamp').innerHTML = '0.000000';
                    document.getElementById('force').innerHTML = '0.000000';
                }

                var shadow = 200 - (ForceTouchData.touches[0].force * 100);
                document.getElementById("shadow-circle").style.boxShadow = "0px 00px " + shadow + "px 40px black";
                updateEmoji(ForceTouchData.touches[0].force * 100);
            });
        }
    }
};

app.initialize();