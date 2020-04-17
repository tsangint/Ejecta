if(typeof GameGlobal === "undefined") {
    window.GameGlobal = window;
    window.wx = {
        getSystemInfoSync: function() {
            return {"model":"iPhone 5","pixelRatio":2,"windowWidth":320,"windowHeight":568,"system":"iOS 10.0.1","language":"en","version":"7.0.4","screenWidth":320,"screenHeight":568,"SDKVersion":"2.11.0","brand":"devtools","fontSizeSetting":16,"benchmarkLevel":1,"batteryLevel":100,"statusBarHeight":20,"safeArea":{"right":320,"bottom":568,"left":0,"top":20,"width":320,"height":548},"platform":"devtools","devicePixelRatio":2}
        },
        onTouchStart: function() {},
        onTouchMove: function() {},
        onTouchEnd: function() {},
        onTouchCancel: function() {},
        createInnerAudioContext: function() {},
        createVideo: function() {},
        setPreferredFramesPerSecond: function() {},
        showKeyboard: function() {},
        hideKeyboard: function() {},
        updateKeyboard: function() {},
        onKeyboardInput: function() {},
        onKeyboardConfirm: function() {},
        onKeyboardComplete: function() {},
        offKeyboardInput: function() {},
        offKeyboardConfirm: function() {},
        offKeyboardComplete: function() {},
        getOpenDataContext: function() {},
        onMessage: function() {},
        loadSubpackage: function() {},
        getSharedCanvas: function() {},
        loadFont: function() {},
        onShow: function() {},
        onHide: function() {},
        onError: function() {},
        offError: function() {},

        createImage: function() {
            return function(){}
        },
        createCanvas: function() {
            return new Ejecta.Canvas();
        },

        env: {"USER_DATA_PATH":"http://usr"},

        getFileSystemManager: function(){}
    }
}
