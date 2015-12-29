function SoundEffect(SRC, ID, MAXVOL){
	this.src = SRC;
	this.id = ID;
	this.playing = false;
	this.maxVolume = MAXVOL;
	this.audio;
	this.loaded = false;
	var handleLoad = function(event) {
		this.audio = createjs.Sound.createInstance(this.id);
		this.loaded = true;

    }
	var loadProxy = createjs.proxy(handleLoad, this);
    createjs.Sound.addEventListener("fileload", loadProxy);
	createjs.Sound.registerSound(this.src, this.id);

	this.update = function(){
		if(this.loaded){
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
	}
	this.fadeIn = function(){
		this.playing = true;
	}
	this.fadeOut = function(){
		this.playing = false;
	}
}