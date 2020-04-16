'use strict';

window.__globalAdapter = {
    adaptView: function adaptView(viewProto) {
        Object.assign(viewProto, {
            _adjustViewportMeta: function _adjustViewportMeta() {
                // minigame not support
            },
            setRealPixelResolution: function setRealPixelResolution(width, height, resolutionPolicy) {
                // Reset the resolution size and policy
                this.setDesignResolutionSize(width, height, resolutionPolicy);
            },
            enableAutoFullScreen: function enableAutoFullScreen(enabled) {
                cc.warn('cc.view.enableAutoFullScreen() is not supported on minigame platform.');
            },
            isAutoFullScreenEnabled: function isAutoFullScreenEnabled() {
                return false;
            },
            setCanvasSize: function setCanvasSize() {
                cc.warn('cc.view.setCanvasSize() is not supported on minigame platform.');
            },
            setFrameSize: function setFrameSize() {
                cc.warn('frame size is readonly on minigame platform.');
            },
            _initFrameSize: function _initFrameSize() {
                var locFrameSize = this._frameSize;
                if (__globalAdapter.isSubContext) {
                    var sharedCanvas = window.sharedCanvas || __globalAdapter.getSharedCanvas();
                    locFrameSize.width = sharedCanvas.width;
                    locFrameSize.height = sharedCanvas.height;
                } else {
                    locFrameSize.width = window.innerWidth;
                    locFrameSize.height = window.innerHeight;
                }
            }
        });
    },

    adaptContainerStrategy: function adaptContainerStrategy(containerStrategyProto) {
        containerStrategyProto._setupContainer = function (view, width, height) {
            var locCanvas = cc.game.canvas;
            // Setup pixel ratio for retina display
            var devicePixelRatio = view._devicePixelRatio = 1;
            if (view.isRetinaEnabled()) devicePixelRatio = view._devicePixelRatio = Math.min(view._maxPixelRatio, window.devicePixelRatio || 1);
            // Setup canvas
            width *= devicePixelRatio;
            height *= devicePixelRatio;
            // FIX: black screen on Baidu platform
            // reset canvas size may call gl.clear(), especially when you call cc.director.loadScene()
            if (locCanvas.width !== width || locCanvas.height !== height) {
                locCanvas.width = width;
                locCanvas.height = height;
            }
        };
    }
};