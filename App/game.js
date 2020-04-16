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

        env: {"USER_DATA_PATH":"http://usr"}
    }
}

require('./libs/wrapper/builtin/index');
window.DOMParser = require('./libs/common/xmldom/dom-parser').DOMParser;
require('./libs/common/engine/globalAdapter/index');
require('./libs/wrapper/unify');
require('./libs/wrapper/systemInfo');
// Ensure getting the system info in open data context
window.__globalAdapter.init(function () {
    require('./src/settings');
    // Will be replaced with cocos2d-js path in editor
    require('./cocos/cocos2d-js-min.js');
    require('./libs/common/engine/index');
    // Introduce Cocos Service here
    require('./main');
    require('./libs/common/remote-downloader');
    require('./libs/wrapper/engine/index');

    // Adjust devicePixelRatio
    cc.view._maxPixelRatio = 4;

    // downloader polyfill
    window.wxDownloader = remoteDownloader;
    // handle remote downloader
    remoteDownloader.REMOTE_SERVER_ROOT = "";
    remoteDownloader.SUBCONTEXT_ROOT = "";
    var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
    cc.loader.insertPipeAfter(pipeBeforeDownloader, remoteDownloader);

    if (cc.sys.platform === cc.sys.WECHAT_GAME_SUB) {
        // TODO(lucky)
        // var SUBDOMAIN_DATA = require('src/subdomain.json.js');
        // cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
        //     cc.Pipeline.Downloader.PackDownloader._doPreload("SUBDOMAIN_DATA", SUBDOMAIN_DATA);
        // });

        // require('./libs/wrapper/sub-context-adapter');
    }
    else {
        // Release Image objects after uploaded gl texture
        cc.macro.CLEANUP_IMAGE_CACHE = true;
    }

    remoteDownloader.init();
    window.boot();
});