import Phaser from 'phaser';
import Boot from './src/Scenes/Boot';
import Play from './src/Scenes/Play';
import Credits from './src/Scenes/Credits';
import WebFontLoader from 'webfontloader';
import packageJson from './package.json';

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'game-container',
        zoom: 1,
        width: 640,
        height: 480,
        autoCenter: Phaser.DOM.CENTER_BOTH,
        mode: Phaser.Scale.NONE
    },
    backgroundColor: 0x444444,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: [Boot, Play, Credits],
    debug: true,
    textStyles: {} // defined in Boot.js
};

WebFontLoader.load({
    google: {
        families: [
            'Amatic SC',
        ]
    },
    active: () => {
        new Phaser.Game(config);
    }
});

const versionElement = document.getElementById('game-version');
versionElement.innerHTML = `v${packageJson.version}`;

if (config.debug) {
    const debugOutput = document.getElementById('debug-output');
    debugOutput.style.display = 'block';
}