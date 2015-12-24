function SoundEffect(SRC, MAXVOL){
	this.src = SRC;
	this.playing = false;
	this.maxVolume = MAXVOL;
	this.init = function(){
		this.audio = new Audio();
		this.audio.src = this.src;
		this.audio.load();
		// this.audio.muted = true;
	}
	this.init();

	this.update = function(){
		if (this.playing) {
	        this.audio.play();
            this.audio.volume += (this.maxVolume - this.audio.volume) * 0.05;

        } else {
            this.audio.volume += (0.0 - this.audio.volume) * 0.05;
            if(this.audio.volume < 0.05){
            	this.audio.pause();
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