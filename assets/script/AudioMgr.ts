//AudioMgr.ts
import { Node, AudioSource, AudioClip, resources, director, AssetManager, sys } from 'cc';
import { AssetMgr } from './AssetMgr';
import { GlobalData } from './GlobalData';
import { IOS } from 'cc/env';
/**
 * @en
 * this is a sington class for audio play, can be easily called from anywhere in you project.
 * @zh
 * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
 */
export class AudioMgr {
    private static _inst: AudioMgr;
    public static get inst(): AudioMgr {
        if (this._inst == null) {
            this._inst = new AudioMgr();
        }
        return this._inst;
    }
    public volume: number = 1;
    private _audioSource: AudioSource;
    private _complete: Function
    constructor() {
        //@en create a node as audioMgr
        //@zh 创建一个节点作为 audioMgr
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';

        //@en add to the scene.
        //@zh 添加节点到场景
        director.getScene().addChild(audioMgr);

        //@en make it as a persistent node, so it won't be destroied when scene change.
        //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);

        //@en add AudioSource componrnt to play audios.
        //@zh 添加 AudioSource 组件，用于播放音频。
        this._audioSource = audioMgr.addComponent(AudioSource);
        this.audioSource.node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    }

    public get audioSource() {
        return this._audioSource;
    }

    /**
     * @en
     * play short audio, such as strikes,explosions
     * @zh
     * 播放短音频,比如 打击音效，爆炸音效等
     * @param sound clip or url for the audio
     * @param volume 
     */
    playOneShot(sound: AudioClip, volume: number = 1.0) {

        this._audioSource.playOneShot(sound, volume);


    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume 
     */
    play(sound: AudioClip, volume: number = 1.0) {
        this._audioSource.stop();
        this._audioSource.clip = sound;
        this._audioSource.play();
        this.audioSource.volume = volume;
    }

    /**
     * stop the audio play
     */
    stop() {
        this._audioSource.stop();
    }

    /**
     * pause the audio play
     */
    pause() {
        this._audioSource.pause();
    }

    /**
     * resume the audio play
     */
    resume() {
        this._audioSource.play();
    }
    public setVolume(val: number) {
        this._audioSource.volume = val;
        this.volume = val;
    }
    public playRemoteSound(name: string, isOnePlay: boolean, complete?: Function) {
        if (complete) {
            this._complete = complete;
        }
        if (GlobalData.getSoundDenyState()) {
            return;
        }
        if (sys.os == sys.OS.IOS) {
            console.log("iossound")
            AssetMgr.instance.getRemoteResByUrl(`${AssetMgr.instance.RES_CONFIG.iosSoundUrl}${name}.mp3`, AudioClip, ".mp3").then(data => {
                if (isOnePlay) {
                    this.playOneShot(data, this.volume)

                } else {

                    this.play(data, this.volume)
                }
            })
        } else {
            AssetMgr.instance.getRemoteResByUrl(`${AssetMgr.instance.RES_CONFIG.soundUrl}${name}.ogg`, AudioClip, ".ogg").then(data => {
                if (isOnePlay) {
                    this.playOneShot(data, this.volume)

                } else {

                    this.play(data, this.volume)
                }
            })
        }
    }

    onAudioEnded() {
        console.log("播放结束")
        if (this._complete) {
            this._complete();
        }
    }
}