function SoundEffect(SRC, ID, MAXVOL){
	this.src = SRC;
	this.id = ID;
	this.playing = false;
	this.maxVolume = MAXVOL;
	var handleLoad = function(event) {
		// this.init();
		this.audio = createjs.Sound.createInstance(event.src);

    }
	var loadProxy = createjs.proxy(handleLoad, this);
    createjs.Sound.addEventListener("fileload", loadProxy);
	createjs.Sound.registerSound(this.src, this.id);

	// this.init = function(){
		// this.audio = createjs.Sound.createInstance(this.id);
		// this.audio.src = this.src;
		// this.audio.load();
		// this.audio.muted = true;
// 
	// }

	this.update = function(){
		if (this.playing) {
	        this.audio.play();
            this.audio.volume += (this.maxVolume - this.audio.volume) * 0.05;

        } else {
            this.audio.volume += (0.0 - this.audio.volume) * 0.05;
            if(this.audio.volume < 0.05){
            	this.audio.stop();
            }
        }
	}
	this.fadeIn = function(){
		this.playing = true;
	}
	this.fadeOut = function(){
		this.playing = false;
	}
}