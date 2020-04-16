window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;

    if ( !settings.debug ) {
        var uuids = settings.uuids;

        var rawAssets = settings.rawAssets;
        var assetTypes = settings.assetTypes;
        var realRawAssets = settings.rawAssets = {};
        for (var mount in rawAssets) {
            var entries = rawAssets[mount];
            var realEntries = realRawAssets[mount] = {};
            for (var id in entries) {
                var entry = entries[id];
                var type = entry[1];
                // retrieve minified raw asset
                if (typeof type === 'number') {
                    entry[1] = assetTypes[type];
                }
                // retrieve uuid
                realEntries[uuids[id] || id] = entry;
            }
        }

        var scenes = settings.scenes;
        for (var i = 0; i < scenes.length; ++i) {
            var scene = scenes[i];
            if (typeof scene.uuid === 'number') {
                scene.uuid = uuids[scene.uuid];
            }
        }

        var packedAssets = settings.packedAssets;
        for (var packId in packedAssets) {
            var packedIds = packedAssets[packId];
            for (var j = 0; j < packedIds.length; ++j) {
                if (typeof packedIds[j] === 'number') {
                    packedIds[j] = uuids[packedIds[j]];
                }
            }
        }

        var subpackages = settings.subpackages;
        for (var subId in subpackages) {
            var uuidArray = subpackages[subId].uuids;
            if (uuidArray) {
                for (var k = 0, l = uuidArray.length; k < l; k++) {
                    if (typeof uuidArray[k] === 'number') {
                        uuidArray[k] = uuids[uuidArray[k]];
                    }
                }
            }
        }
    }

    function setLoadingDisplay () {
        // Loading splash scene
        // var splash = document.getElementById('splash');
        // var progressBar = splash.querySelector('.progress-bar span');
        // cc.loader.onProgress = function (completedCount, totalCount, item) {
        //     var percent = 100 * completedCount / totalCount;
        //     if (progressBar) {
        //         progressBar.style.width = percent.toFixed(2) + '%';
        //     }
        // };
        // splash.style.display = 'block';
        // progressBar.style.width = '0%';

        // cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        //     splash.style.display = 'none';
        // });
    }

    var onStart = function () {
        cc.loader.downloader._subpackages = settings.subpackages;

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isBrowser) {
            setLoadingDisplay();
        }

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
            ].indexOf(cc.sys.browserType) < 0);
        }

        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.macro.DOWNLOAD_MAX_CONCURRENT = 2;
        }

        function loadScene(launchScene) {
            cc.director.loadScene(launchScene,
                function (err) {
                    if (!err) {
                        if (cc.sys.isBrowser) {
                            // show canvas
                            var canvas = document.getElementById('GameCanvas');
                            canvas.style.visibility = '';
                            var div = document.getElementById('GameDiv');
                            if (div) {
                                div.style.backgroundImage = '';
                            }
                        }
                        cc.loader.onProgress = null;
                        console.log('Success to load scene: ' + launchScene);
                    }
                    else if (CC_BUILD) {
                        setTimeout(function () {
                            loadScene(launchScene);
                        }, 1000);
                    }
                }
            );

        }

        var launchScene = settings.launchScene;

        // load scene
        loadScene(launchScene);

    };

    // jsList
    var jsList = settings.jsList;

    var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
    if (jsList) {
        jsList = jsList.map(function (x) {
            return 'src/' + x;
        });
        jsList.push(bundledScript);
    }
    else {
        jsList = [bundledScript];
    }

    var option = {
        id: 'GameCanvas',
        scenes: settings.scenes,
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        jsList: jsList,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    // init assets
    cc.AssetLibrary.init({
        libraryPath: 'res/import',
        rawAssetsBase: 'res/raw-',
        rawAssets: settings.rawAssets,
        packedAssets: settings.packedAssets,
        md5AssetsMap: settings.md5AssetsMap,
        subpackages: settings.subpackages
    });

    cc.game.run(option, onStart);
};

if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('src/settings.js');
        require('src/cocos2d-runtime.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('src/settings.js');
        require('src/cocos2d-jsb.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/jsb-engine.js');
    }

    cc.macro.CLEANUP_IMAGE_CACHE = true;
    window.boot();
}

window._CCSettings = {
    platform: "web-mobile",
    groupList: [
        "default"
    ],
    collisionMatrix: [
        [
            true
        ]
    ],
    rawAssets: {
        assets: {
            f5fpfUvWlGbqkhGTcPOZ7T: [
                "scene/test.fire",
                "cc.SceneAsset"
            ]
        },
        internal: {
            "14TDKXr2NJ6LjvHPops74o": [
                "effects/builtin-2d-gray-sprite.effect",
                "cc.EffectAsset"
            ],
            "0ek66qC1NOQLjgYmi04HvX": [
                "effects/builtin-2d-spine.effect",
                "cc.EffectAsset"
            ],
            "28dPjdQWxEQIG3VVl1Qm6T": [
                "effects/builtin-2d-sprite.effect",
                "cc.EffectAsset"
            ],
            "82migssElAGb04Ws6NimQX": [
                "effects/builtin-3d-particle.effect",
                "cc.EffectAsset"
            ],
            "2afAA24LNP4YmYiaVLiivs": [
                "effects/builtin-3d-trail.effect",
                "cc.EffectAsset"
            ],
            c0BAyVxX9JzZy8EjFrc9DU: [
                "effects/builtin-clear-stencil.effect",
                "cc.EffectAsset"
            ],
            "6dkeWRTOBGXICfYQ7JUBnG": [
                "effects/builtin-unlit.effect",
                "cc.EffectAsset"
            ],
            "6fgBCSDDdPMInvyNlggls2": [
                "materials/builtin-2d-base.mtl",
                "cc.Material"
            ],
            "3ae7efMv1CLq2ilvUY/tQi": [
                "materials/builtin-2d-gray-sprite.mtl",
                "cc.Material"
            ],
            "7a/QZLET9IDreTiBfRn2PD": [
                "materials/builtin-2d-spine.mtl",
                "cc.Material"
            ],
            "ecpdLyjvZBwrvm+cedCcQy": [
                "materials/builtin-2d-sprite.mtl",
                "cc.Material"
            ],
            "43L6CczwNM/6GGmCYEQIoH": [
                "materials/builtin-3d-particle.mtl",
                "cc.Material"
            ],
            "46bU+b5fROqIXVPG6aZWWK": [
                "materials/builtin-3d-trail.mtl",
                "cc.Material"
            ],
            cffgu4qBxEqa150o1DmRAy: [
                "materials/builtin-clear-stencil.mtl",
                "cc.Material"
            ],
            "2aKWBXJHxKHLvrBUi2yYZQ": [
                "materials/builtin-unlit.mtl",
                "cc.Material"
            ]
        }
    },
    launchScene: "db://assets/resources/scene/test.fire",
    scenes: [
        {
            url: "db://assets/resources/scene/test.fire",
            uuid: "f5fpfUvWlGbqkhGTcPOZ7T"
        }
    ],
    packedAssets: {
        "024f72680": [
            "29FYIk+N1GYaeWH/q1NxQO",
            "e97GVMl6JHh5Ml5qEDdSGa",
            "f0BIwQ8D5Ml7nTNQbh1YlS",
            "f5fpfUvWlGbqkhGTcPOZ7T"
        ],
        "0287f0ea0": [
            "02delMVqdBD70a/HSD99FK",
            "60AwGqM1dKELCGhPAR+jK6",
            "71VhFCTINJM6/Ky3oX9nBT",
            "b4P/PCArtIdIH38t6mlw8Y",
            "e8Ueib+qJEhL6mXAHdnwbi"
        ],
        "0771a325d": [
            "43L6CczwNM/6GGmCYEQIoH",
            "82migssElAGb04Ws6NimQX"
        ],
        "079499991": [
            "2aKWBXJHxKHLvrBUi2yYZQ",
            "6dkeWRTOBGXICfYQ7JUBnG"
        ],
        "07ce7530a": [
            "14TDKXr2NJ6LjvHPops74o",
            "3ae7efMv1CLq2ilvUY/tQi"
        ],
        "0a5cba09d": [
            "2afAA24LNP4YmYiaVLiivs",
            "46bU+b5fROqIXVPG6aZWWK"
        ],
        "0d669730c": [
            "c0BAyVxX9JzZy8EjFrc9DU",
            "cffgu4qBxEqa150o1DmRAy"
        ],
        "0e4bc3b03": [
            "0ek66qC1NOQLjgYmi04HvX",
            "7a/QZLET9IDreTiBfRn2PD"
        ]
    },
    md5AssetsMap: {},
    orientation: "",
    debug: true,
    subpackages: {}
};

window.HTMLCanvasElement = function(){};

(function () {debugger
    
    // open web debugger console
    if (typeof VConsole !== 'undefined') {
        window.vConsole = new VConsole();
    }

    var debug = window._CCSettings.debug;
    // var splash = document.getElementById('splash');
    // splash.style.display = 'block';

    function loadScript (moduleName, cb) {
      function scriptLoaded () {
          document.body.removeChild(domScript);
          domScript.removeEventListener('load', scriptLoaded, false);
          cb && cb();
      };
      var domScript = document.createElement('script');
      domScript.async = true;
      domScript.src = moduleName;
      domScript.addEventListener('load', scriptLoaded, false);
      document.body.appendChild(domScript);
    }

    loadScript(debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js', function () {
      if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
        loadScript(debug ? 'physics.js' : 'physics-min.js', window.boot);
      }
      else {
        window.boot();
      }
    });
})();
