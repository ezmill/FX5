;(function (root, document, factory) {
    root.blackbox = factory()
})(this, this.document, function () {

/**
 * @param {DOMNode} el
 * @param {string} inputImage
 * @param {string} origImage
 * @param {object} size
 * @param {number} size.w
 * @param {number} size.h
 * @param {object} cbs
 * @param {function} cbs.save
 * @param {function} cbs.info
 */
function blackbox(el, inputImage, origImage, size, cbs) {
    // Create the Blackbox's UI elements wrapper.
    var isMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);

    var div = document.createElement('div')
    div.className = 'blackbox'
    div.style.overflow = "hidden";
    div.style.height = "100vh";
    div.style.width = "100vw";
    var marginLeft = 900;
    var useMargin = false;
    var renderSize;
    var imgNum = 2;
    var path = "assets/textures/" + imgNum + "/";
    var mouse = new THREE.Vector2(0.0, 0.0);
    var time = 0.0;
    var mouseDown = false;
    var r2 = 0.0;
    var origTex, origImage;
    var w = size.w,
        h = size.h
    setRenderSize();
    var scene, camera, light, renderer, texture, fbMaterial, mask;
    var effectIndex = 0;
    var id;
    var glitchShaderSeed;
    var effects = ["warp", "revert", "rgb shift", "oil paint", "repos", "flow",/*"gradient",*/ "warp flow", "curves", "neon glow"];
    var loadedItems = 0;
    var mask1 = THREE.ImageUtils.loadTexture(path + "mask1.png", undefined, checkLoading);
    mask1.minFilter = mask1.magFilter = THREE.LinearFilter;
    var mask2 = THREE.ImageUtils.loadTexture(path + "mask2.png", undefined, checkLoading);
    mask2.minFilter = mask2.magFilter = THREE.LinearFilter;
    var revertTex = THREE.ImageUtils.loadTexture(path + "revert.png", undefined, checkLoading);
    revertTex.minFilter = revertTex.magFilter = THREE.LinearFilter;
    var white = THREE.ImageUtils.loadTexture("assets/textures/white.jpg", undefined, checkLoading);
    white.minFilter = white.magFilter = THREE.LinearFilter;
    var black = THREE.ImageUtils.loadTexture("assets/textures/black.jpg", undefined, checkLoading);
    black.minFilter = black.magFilter = THREE.LinearFilter;
    var noiseTex = THREE.ImageUtils.loadTexture("assets/textures/tex11.png", undefined, checkLoading);
    noiseTex.minFilter = noiseTex.magFilter = THREE.LinearFilter;
    var noiseTex2 = THREE.ImageUtils.loadTexture("assets/textures/tex16.png", undefined, checkLoading);
    noiseTex2.minFilter = noiseTex2.magFilter = THREE.LinearFilter;
    var img = new Image();
    img.src = inputImage;
    var origImg = new Image();
    origImg.src = origImage;

    texture = new THREE.Texture();
    origTex = new THREE.Texture();
    
    img.onload = function() {
        checkLoading();  
    }
    origImg.onload = function() {
        checkLoading(); 
    }
    var infoButton = document.createElement("div");
    var uploadButton = document.createElement("div");
    var icons = document.createElement("div");
    addIcons();
    var soundFX = [];
    var backingTrack = new SoundEffect("assets/audio/backing.mp3", "backing", 0.25);
    var rendererStats  = new THREEx.RendererStats()
    rendererStats.domElement.style.position   = 'absolute'
    rendererStats.domElement.style.left  = '0px'
    rendererStats.domElement.style.bottom    = '0px'
    var debounceResize;
    var currentSound, playing = true;
    var overlay = document.getElementById("overlay");
    var startedAnimating = false;
    var timer = "paused";
    // document.body.appendChild( rendererStats.domElement )
    function checkLoading() {
        ++loadedItems;
        if (loadedItems >= 9) {
            texture.image = img;
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
            origTex.image = img;
            origTex.minFilter = origTex.magFilter = THREE.LinearFilter;
            origTex.needsUpdate = true;
            backingTrack.fadeIn();
            init();
        }
    }
    function init() {
        scene = new THREE.Scene();
        camera = new THREE.Camera();
        camera.position.z = 1;
        renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true
        });
        renderer.setSize(renderSize.x, renderSize.y);
        renderer.setClearColor(0x000000, 1.0);
        renderer.autoClear = false;
        // renderer.setPixelRatio(1);
        // console.log(window.devicePixelRatio);

        if(isMobile){
            if(window.innerHeight > window.innerWidth){
                overlay.style.display = "block";
            } else {
                overlay.style.display = "none";
                // animate();
                createEffect();
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mousedown", onMouseDown);
                document.addEventListener("mouseup", onMouseUp);
                document.addEventListener('touchstart', onDocumentTouchStart, false);
                document.addEventListener('touchdown', onDocumentTouchStart, false);
                document.addEventListener('touchmove', onDocumentTouchMove, false);
                document.addEventListener('touchend', onDocumentTouchEnd, false);
                document.addEventListener('touchcancel', onDocumentTouchEnd, false);
                document.addEventListener('touchleave', onDocumentTouchEnd, false);
                // document.addEventListener('keydown', onKeyDown, false);
                debounceResize = debounce(onWindowResize, 250);
                window.addEventListener("resize", debounceResize);
                if(isMobile)div.addEventListener("click", null);
                if(isMobile)div.addEventListener("touchstart", null);
                if(isMobile)div.addEventListener("touchdown", null);
                infoButton.addEventListener("click", cbs.info);
                infoButton.addEventListener("touchstart", cbs.info);
                infoButton.addEventListener("touchdown", cbs.info);
                uploadButton.addEventListener('click', onClickButton)
                uploadButton.addEventListener('touchstart', onClickButton)
                uploadButton.addEventListener('touchdown', onClickButton)

                div.appendChild(renderer.domElement)
                el.appendChild(div)
                onWindowResize();

            }
        }
        if(startedAnimating){
            timer = "playing";
            animate();
        }
    }
    function createSoundEffects(effects){
        if (!createjs.Sound.initializeDefaultPlugins()) {return;}

        var path = "assets/audio/"
        var format = ".mp3";
        for(var i = 0; i < effects.length; i++){
            var src = path + effects[i] + format;
            var sound = new SoundEffect(src, effects[i], 1.0);
            soundFX.push(sound);
        }
        // var path = "assets/audio/"
//         var sounds = [
//             {id:"backing", src:"backing.mp3"},
//             {id:"warp", src:"warp.mp3"},
//             {id:"revert", src:"revert.mp3"},
//             {id:"rgb shift", src:"rgb shift.mp3"},
//             {id:"oil paint", src:"oil paint.mp3"},
//             {id:"repos", src:"repos.mp3"},
//             {id:"flow", src:"flow.mp3"},
//             {id:"glitch", src:"neon glow.mp3"},
//             {id:"gradient", src:"gradient.mp3"},
//             {id:"warp flow", src:"warp flow.mp3"},
//             {id:"curves", src:"curves.mp3"},
//             {id:"neon glow", src:"neon glow.mp3"}
//         ];
        // createjs.Sound.addEventListener("fileload", handleLoad);
        // console.log(createjs.Sound);
//         createjs.Sound.registerSounds(sounds, path);
    }
    function createEffect() {
        shuffle(effects);
        insertRevert(effects);
        createSoundEffects(effects);
        effectIndex = 0;
        
        // var blob = dataURItoBlob(base64);
        // var file = window.URL.createObjectURL(blob);
        
        // console.log(img);
        // image.src = base64;
        
        // origTex = THREE.ImageUtils.loadTexture("assets/textures/newtest.jpg");
        
        // origTex = texture.clone();
        effect = new Effect(effects[effectIndex]);
        effect.init();
        mask = new Mask(renderer);
        mask.init();
        mask.update();
        // testMat = new THREE.MeshBasicMaterial({
            // map:mask.oRenderTarget
        // });
        // testGeo = new THREE.PlaneBufferGeometry(2,2);
        // testMesh = new THREE.Mesh(testGeo, testMat );
        // scene.add(testMesh);
        // testMesh.position.z = 0;
        // alpha = new THREE.Texture(mask.renderer.domElement);
        alpha = mask.oRenderTarget;
        // alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
        // alpha.needsUpdate = true;

        if (fbMaterial) fbMaterial.dispose();
        fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, effect.shaders);
        fbMaterial.init();
        setMask();
        fbMaterial.setOriginalTex(origTex);
        planeRotate();
    }

    function createNewEffect() {
        var useNewOriginal = false;
        if (effectIndex == effects.length - 1) {
            effectIndex = 0;
        } else {
            effectIndex++;
        }
        if (effects[effectIndex] == "neon glow") {
            useNewOriginal = true;
        } else if (effects[effectIndex] == "rgb shift" || effects[effectIndex] == "oil paint" || effects[effectIndex] == "flow" || effects[effectIndex] == "warp flow" || effects[effectIndex] == "repos") {
            useNewOriginal = true;
        } else if (effects[effectIndex] == "warp") {
            useNewOriginal = true;
        } else if (effects[effectIndex] == "revert"){
            useNewOriginal = false;
        } else {
            useNewOriginal = false;            
        }

        // var blob = dataURItoBlob(renderer.domElement.toDataURL('image/jpg'));
        // var file = window.URL.createObjectURL(blob);
        // var img = new Image();
        // img.src = file;
        // img.onload = function(e) {
            // texture.image = img;
            fbMaterial.update();
            renderer.render(scene, camera);
            fbMaterial.getNewFrame();
            fbMaterial.swapBuffers();
            texture.dispose();
            texture.image = renderer.domElement;
            // texture = new THREE.Texture(renderer.domElement);
            texture.needsUpdate = true;
            texture.minFilter = texture.magFilter = THREE.LinearFilter;
            // fbMaterial.setUniforms();

            // texture.needsUpdate = true;

            effect = new Effect(effects[effectIndex]);
            effect.init();
                // mask = new Mask();
                // mask.init();
                // mask.update();
                // mask.renderer.autoClear = true;
                // mask.renderer.clearDepth(0x000000);
                mask.renderer.clearDepth();
                mask.renderer.clearTarget(mask.renderTarget1,0x000000);
                mask.renderer.clearTarget(mask.renderTarget2,0x000000);
                mask.renderer.clear();
                // mask.update()
                // mask.renderer.autoClear = false;
                // mask.outputRenderer.clear();
                // alpha.dipose();
                // alpha = new THREE.Texture(mask.renderer.domElement);
                // alpha.minFilter = alpha.magFilter = THREE.LinearFilter;
                // alpha.needsUpdate = true;

            fbMaterial.dispose();
            fbMaterial = new FeedbackMaterial(renderer, scene, camera, texture, effect.shaders);
            fbMaterial.init();
            if (useNewOriginal) {
                fbMaterial.setOriginalTex(texture);
            } else {
                fbMaterial.setOriginalTex(origTex);
            }
            setMask();
    }
    function setMask(){
        if (effect.name == "neon glow") {
            mask.setMask(mask1);
        } else if (effect.name == "rgb shift" || effect.name == "oil paint" || effect.name == "flow" || effect.name == "warp flow" || effect.name == "repos" || /*effect.name == "revert" ||*/ effect.name == "warp" || effect.name == "glitch") {
            mask.setMask(mask2);
        } else {
            mask.setMask(false);
        }
        fbMaterial.setMask(revertTex)
    }
    function animate() {
        id = requestAnimationFrame(animate);
        draw();
    }

    function draw() {
        time += 0.01;
        if (mouseDown) {
            // if(effect.name == "gradient"){
                // r2 += 0.0075;
                // mask.radius += 0.0075;
            // } else {
                r2 = 0.5;
                mask.radius = 0.5;
            // }
        }
        mask.update();
        alpha.needsUpdate = true;
        // texture.needsUpdate = true;

        // origTex.needsUpdate = true;

        backingTrack.update();
        for(var i = 0; i < soundFX.length; i++){
            soundFX[i].update();
        }
        // if (playing) {
            // currentSound.volume += (1.0 - currentSound.volume) * 0.05;
        // } else {
            // currentSound.volume += (0.0 - currentSound.volume) * 0.05;
            // if(currentSound.volume < 0.05){
                // currentSound.stop();
            // }
        // }
// 
        // testMesh.material.map.needsUpdate = true;
        fbMaterial.setUniforms();
        fbMaterial.update();
        renderer.render(scene, camera);
        fbMaterial.getNewFrame();
        fbMaterial.swapBuffers();

        // rendererStats.update(renderer);
    }
    
    function onClickButton() {
        // Remove the button's event listener.
        uploadButton.removeEventListener('click', onClickButton)
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener('touchstart', onDocumentTouchStart, false);
        document.removeEventListener('touchmove', onDocumentTouchMove, false);
        document.removeEventListener('touchend', onDocumentTouchEnd, false);
        document.removeEventListener('touchcancel', onDocumentTouchEnd, false);
        document.removeEventListener('touchleave', onDocumentTouchEnd, false);
        document.removeEventListener('keydown', onKeyDown, false);
        window.removeEventListener("resize", onWindowResize);
        infoButton.removeEventListener("click", cbs.info);
        infoButton.removeEventListener("touchstart", cbs.info);
        infoButton.removeEventListener("touchdown", cbs.info);
        // Detach the UI wrapper and its content from the root element.
        el.removeChild(div)

        // Call the callback function, passing the new canvas content to it.
        // if (window.innerWidth > h * (window.innerHeight / w)) {
            // renderSize = new THREE.Vector2(window.innerWidth, w * (window.innerWidth / h));
        // } else {
            // renderSize = new THREE.Vector2(h * (window.innerHeight / w), window.innerHeight);
        // }
        // renderSize = new THREE.Vector2(w,h);
        // renderer.setSize(renderSize.x, renderSize.y);
        // mask.resize();
        // fbMaterial.resize();
        // fbMaterial.setUniforms();
        // mask.resize();
        // fbMaterial.setUniforms();
        // fbMaterial.update();
        // renderer.render(scene, camera);
        // fbMaterial.getNewFrame();
        // fbMaterial.swapBuffers();

        var base64 = renderer.domElement.toDataURL('image/jpeg');

        cancelAnimationFrame(id); // Stop the animation
        // scene = null;
        // camera = null;
        cbs.save(null, base64, origImage);
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function insertRevert(array) {
        var length = array.length;
        for (var i = 0; i < length; i++) {
            if (array[i] == "revert") {
                array.splice(i, 1);
            }
        }
        for (var i = 0; i < length; i++) {
            if (array[i] == "flow" || array[i] == "repos") {
                array.splice(i + 1, 0, "revert");
            }
        }
        var startEffects = ["rgb shift", "neon glow", "curves", "oil paint", "warp"];
        var startEffectNum = Math.floor(Math.random() * startEffects.length);
        var startEffect = startEffects[startEffectNum];
        for (var i = 0; i < length + 2; i++) {
            if (array[i] == startEffect) {
                array.splice(i, 1);
            }
        }

        var glitchSeed = Math.random();
        console.log(glitchSeed);
        if(glitchSeed >= 0.75){
            glitchShaderSeed = Math.random();

            // var glitchEffect = Math.floor(Math.random()*
            var randomIndex = Math.floor(Math.random() * (length + 2));
            array.splice(randomIndex, 0, "glitch");
        }

        array.splice(0, 0, startEffect);
        for(var i = 0; i < array.length; i++){
            console.log(array[i]);
        }
    }

    function onMouseMove(event) {
        if(useMargin){
            mouse.x = ((event.pageX - (window.innerWidth - marginLeft) ) / renderSize.x) * 2 - 1;
        } else {
            mouse.x = (event.pageX / renderSize.x) * 2 - 1;            
        }
        mouse.y = -(event.pageY / renderSize.y) * 2 + 1;
        mask.mouse = new THREE.Vector2(mouse.x, mouse.y);
    }

    function onMouseDown() {
        mouseDown = true;
        soundFX[effectIndex].fadeIn();
        // console.log(effects[effectIndex]);
        // currentSound = createjs.Sound.play(effects[effectIndex]);
        // playing = true;
        // currentSound = createjs.Sound.play(effects[effectIndex]);

    }

    function onMouseUp() {
        // if(effect.name != "gradient"){
            mouseDown = false;
            r2 = 0;
            mask.radius = 0;
            soundFX[effectIndex].fadeOut();
            // playing = false;
            // currentSound.stop()
            // createjs.Sound.stop(effects[effectIndex]);

            createNewEffect();
        // } else {
            // document.removeEventListener("mousedown", onMouseDown);
            // window.setTimeout(function(){
                // mouseDown = false;
                // r2 = 0;
                // mask.radius = 0;
                // playing = false;
                // soundFX[effectIndex].fadeOut();
                // currentSound.stop()
                // createjs.Sound.stop(effects[effectIndex]);
// 
                // createNewEffect();
                // document.addEventListener("mousedown", onMouseDown);
            // }, 2000)
        // }

    }
    // function onMobileClick(){
        // mouseDown = true;
        // soundFX[effectIndex].fadeIn();
        // div.removeEventListener("click", onMobileClick);
        // div.removeEventListener("click", onMobileClick);
        // div.removeEventListener("click", onMobileClick);
    // }

    function onDocumentTouchStart(event) {
        mouseDown = true;
        soundFX[effectIndex].fadeIn();
        updateMouse(event);
    }

    function onDocumentTouchMove(event) {
        mouseDown = true;
        // soundFX[effectIndex].audio.play();
        updateMouse(event);
    }

    function updateMouse(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouse.x = (event.touches[0].pageX / renderSize.x) * 2 - 1;
            mouse.y = -(event.touches[0].pageY / renderSize.y) * 2 + 1;
            mask.mouse = new THREE.Vector2(mouse.x, mouse.y);
        }
    }

    function onDocumentTouchEnd(event) {
        mouseDown = false;
        r2 = 0;
        mask.radius = 0;
        // soundFX[effectIndex].fade();
        soundFX[effectIndex].fadeOut();
        createNewEffect();
    }

    function onWindowResize(event) {

        setRenderSize();
        renderer.setSize(renderSize.x, renderSize.y);
        mask.resize();
        fbMaterial.resize();
        // fbMaterial.update();
        // renderer.render(scene, camera);
        // fbMaterial.getNewFrame();
        // fbMaterial.swapBuffers();
        fbMaterial.setUniforms();
        if(isMobile){
            if(window.innerHeight > window.innerWidth){
                overlay.style.display = "block";
                if(startedAnimating){
                    if(timer == "playing"){
                        timer = "paused";                    
                        window.cancelAnimationFrame(id);
                    }
                }
            } else {
                overlay.style.display = "none";
                if(startedAnimating){
                    if(timer == "paused"){
                        timer = "playing";
                        id = window.requestAnimationFrame(animate);                        
                    }
                    // draw();
                } else {
                    // animate();
                    startedAnimating = true;
                }
            }
        }
        if(marginLeft > window.innerWidth && !isMobile /*&& renderSize.y > marginLeft/2*/){
        // var ratio = window.innerWidth/window.innerHeight;
        // if( ratio > 1.7 && !isMobile /*&& renderSize.y > marginLeft/2*/){
            useMargin = true;
            // for(var i = 0; i < fbMaterial.fbos.length; i++){
                // fbMaterial.fbos[i].mesh.position.set(-10, 0, 0);
            // }
            // console.log((window.innerWidth - marginLeft)/renderSize.x);
            // fbMaterial.mesh.position.set((window.innerWidth - marginLeft)/renderSize.x, 0, 0);

            renderer.domElement.style["margin-left"] = (window.innerWidth - marginLeft) + "px";
        } else {
            useMargin = false;
            // for(var i = 0; i < fbMaterial.fbos.length; i++){
                // fbMaterial.fbos[i].mesh.position.set(0, 0, 0)
            // }
            // fbMaterial.mesh.position.set(0, 0, 0)

            renderer.domElement.style["margin-left"] = 0;
        }
    }
    function planeRotate(){
        // mask.mesh.rotation.set(0,0, Math.PI/2);
        // mask.overlayMesh.rotation.set(0,0, Math.PI/2);
        // mask.overlayMesh2.rotation.set(0,0, Math.PI/2);
        // fbMaterial.mesh.rotation.set(0,0, Math.PI/2);
        // for(var i = 0; i < fbMaterial.fbos.length; i++){
            // fbMaterial.fbos[i].mesh.rotation.set(0,0, Math.PI/2);
        // }
    }

    function onKeyDown(event) {
         // if(event.keyCode == "39"){
            // if(imgNum < 13){
                // imgNum++;
            // } else {
                // imgNum = 1;
            // }
            // path = "assets/textures/" + imgNum + "/";
            // inputImage = path + "texture.jpg";
            // createEffect();
        // }
        // if(event.keyCode == "37"){
            // if(imgNum == 1){
                // imgNum = 12;
            // } else {
                // imgNum--;
            // }
            // path = "assets/textures/" + imgNum + "/";
            // inputImage = path + "texture.jpg";
            // createEffect();
        // }
    
    }
    function setRenderSize(){
        if (window.innerWidth > w * (window.innerHeight / h)) {
            renderSize = new THREE.Vector2(window.innerWidth, h * (window.innerWidth / w));
        } else {
            // if(!isMobile){
                renderSize = new THREE.Vector2(w * (window.innerHeight / h), window.innerHeight);
            // } else {
                // if(renderer)renderer.domElement.style.transform = "rotate(90deg)";
                // renderSize = new THREE.Vector2(window.innerHeight, h * (window.innerHeight / w));
            // }
        }
    }
    function addIcons(){
        icons.style["position"] = "fixed";
        icons.style["top"] = 0;
        icons.style["left"] = 0;
        icons.style["right"] = 0;
        icons.style["bottom"] = 0;
        icons.style["width"] = window.innerWidth;
        icons.style["height"] = window.innerHeight;
        icons.style["font-size"] = 48;
        uploadButton.style["position"] = infoButton.style["position"] = "absolute";
        uploadButton.style["right"] = infoButton.style["right"] = 0;
        uploadButton.style["margin"] = infoButton.style["margin"] = "20px";
        uploadButton.style["cursor"] = infoButton.style["cursor"] = "pointer";
        uploadButton.style["font-size"] = infoButton.style["font-size"] = "48px";
        uploadButton.style["bottom"] = 0;
        var infoIcon = document.createElement("i");
        infoIcon.className = "pe-7s-info";
        var uploadIcon = document.createElement("i");
        uploadIcon.className = "pe-7s-upload";
        infoButton.appendChild(infoIcon);
        uploadButton.appendChild(uploadIcon);
        icons.appendChild(infoButton);
        icons.appendChild(uploadButton);
        div.appendChild(icons);
    }
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    /**

Below this comment are dependencies

*/
    function FeedbackMaterial(RENDERER, SCENE, CAMERA, TEXTURE, SHADERS) {

        this.renderer = RENDERER;
        this.scene = SCENE;
        this.camera = CAMERA;
        this.texture = TEXTURE;
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.mask, this.origTex;
        this.shader1 = SHADERS[0];
        this.shader2 = SHADERS[1];
        this.shader3 = SHADERS[2];
        // this.shader4 = SHADERS[3];
        // this.shader5 = SHADERS[4];
        this.outputShader = SHADERS[3]

        this.mesh;

        //this.geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);


        this.fbos = [];
        this.init = function() {
            this.fbos[0] = new FeedbackObject(this.shader1);
            this.fbos[0].material.uniforms.texture.value = this.texture;

            this.fbos[1] = new FeedbackObject(this.shader2);
            this.fbos[1].material.uniforms.texture2.value = this.texture;
            this.fbos[1].material.uniforms.texture.value = this.fbos[0].renderTarget;

            this.fbos[2] = new FeedbackObject(this.shader3);
            this.fbos[2].material.uniforms.texture.value = this.fbos[1].renderTarget;

            // this.fbos.push(this.fbo1);
            // this.fbos.push(this.frameDiff);
            // this.fbos.push(this.fbo2);
            // 
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].material.uniforms.resolution.value = new THREE.Vector2(renderSize.x, renderSize.y);
            }


            this.material = new THREE.ShaderMaterial({
                uniforms: this.outputShader.uniforms,
                vertexShader: this.outputShader.vertexShader,
                fragmentShader: this.outputShader.fragmentShader,
                transparent: true,
                side: 2
            });
            this.material.uniforms["texture"].value = this.fbos[2].renderTarget;
            this.material.uniforms["texture"].minFilter = this.material.uniforms["texture"].magFilter = THREE.LinearFilter;
            this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
            this.material.uniforms["mouse"].value = new THREE.Vector2(renderSize.x, 0);

            this.geometry = new THREE.PlaneGeometry(2, 2, 0);

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(0, 0, 0);
            this.scene.add(this.mesh);

            // this.setUniforms();
            // this.update();

            this.fbos[0].material.uniforms.texture.value = this.fbos[1].renderTarget;
            // this.getNewFrame();

        }

        this.resize = function() {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].renderTarget.setSize(renderSize.x, renderSize.y);
                // this.fbos[i].geometry.dispose();
                // this.fbos[i].mesh.scale(renderSize.x/oldX, renderSize.y/oldY,0)
                // 
                // this.geometry.dispose();
                // this.geometry = new THREE.PlaneGeometry(renderSize.x, renderSize.y, 0);
            }
            // this.mesh.scale(renderSize.x/oldX, renderSize.y/oldY,0)

        }

        this.update = function() {
            // this.fbo2.render(this.renderer, this.camera);
            this.fbos[1].render(this.renderer, this.camera);
            this.fbos[2].render(this.renderer, this.camera);
            this.fbos[2].material.uniforms["texture"].value.needsUpdate = true;

            // this.fbo4.render(this.renderer, this.camera);
        }
        this.expand = function(scl) {
            this.frameDiff.mesh.scale.set(scl, scl, scl);
        }
        this.scale = function(scl) {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].mesh.scale.set(scl, scl, scl);
            }
        }
        this.getNewFrame = function() {
            this.fbos[0].render(this.renderer, this.camera);
        }
        this.swapBuffers = function() {
            var a = this.fbos[2].renderTarget;
            this.fbos[2].renderTarget = this.fbos[0].renderTarget;
            this.fbos[0].renderTarget = a;
        }
        this.setUniforms = function() {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].material.uniforms.time.value = time;
                this.material.uniforms.time.value = time;
                if (this.fbos[i].material.uniforms["r2"]) this.fbos[i].material.uniforms["r2"].value = r2;
                if (this.material.uniforms["r2"]) this.material.uniforms["r2"].value = r2;
                if (this.fbos[i].material.uniforms["resolution"]) this.fbos[i].material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
                if (this.material.uniforms["resolution"]) this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
                if (this.fbos[i].material.uniforms["alpha"]) this.fbos[i].material.uniforms["alpha"].value = alpha;
                if (this.material.uniforms["alpha"]) this.material.uniforms["alpha"].value = alpha;
                if (this.fbos[i].material.uniforms["mouse"]) this.fbos[i].material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
                if (this.material.uniforms["mouse"]) this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
                if (this.material.uniforms["curveMap"]) this.material.uniforms["curveMap"].value.needsUpdate = true;
                if(this.material.uniforms["noise"])this.material.uniforms["noise"].value = noiseTex;
                if(this.material.uniforms["noise2"])this.material.uniforms["noise2"].value = noiseTex2;
                if (this.material.uniforms["mask"]) this.material.uniforms["mask"].value = this.mask;
                if (this.fbos[i].material.uniforms["mask"]) this.fbos[i].material.uniforms["mask"].value = this.mask;

                if (this.fbos[i].material.uniforms["origTex"]) this.fbos[i].material.uniforms["origTex"].value = this.origTex;
                if (this.material.uniforms["origTex"]) this.material.uniforms["origTex"].value = this.origTex;
                if (this.fbos[i].material.uniforms["seed"]) this.fbos[i].material.uniforms["seed"].value = seed;
                if (this.material.uniforms["seed"]) this.material.uniforms["seed"].value = seed;
            }
        }
        this.setMask = function(tex) {
            this.mask = tex;
            // origTex = this.fbos[2].renderTarget.clone();
        }
        this.setOriginalTex = function(tex) {
            this.origTex = tex;
            // origTex = this.fbos[2].renderTarget.clone();
        }
        this.dispose = function() {
            for (var i = 0; i < this.fbos.length; i++) {
                this.fbos[i].dispose();
            }
            this.material.dispose();
            this.geometry.dispose();
            this.scene.remove(this.mesh)
        }
    }

    function FeedbackObject(SHADER) {
        this.scene = new THREE.Scene();
        this.renderTarget, this.shader, this.material, this.geometry, this.mesh;
        this.initialize = function(SHADER) {
            this.renderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            });
            this.shader = SHADER;
            this.material = new THREE.ShaderMaterial({
                uniforms: this.shader.uniforms,
                vertexShader: this.shader.vertexShader,
                fragmentShader: this.shader.fragmentShader
            });
            this.geometry = new THREE.PlaneGeometry(2, 2);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(0, 0, 0);
            this.scene.add(this.mesh);
        }
        this.initialize(SHADER);
        this.render = function(RENDERER, CAMERA) {
            RENDERER.render(this.scene, CAMERA, this.renderTarget, true);
        }
        this.dispose = function() {
            this.renderTarget.dispose();
            this.material.dispose();
            this.material.uniforms.texture.value.dispose();
            this.geometry.dispose();
            this.scene.remove(this.mesh);
        }
    }

    function Effect(NAME) {
        this.shaders;
        this.blendId;
        this.name = NAME;
        this.curves = [
            [
                [
                    [0, 0],
                    [0.349, 0.448],
                    [0.493, 0.626],
                    [0.77, 0.814],
                    [1, 1]
                ],
                [
                    [0, 0.171],
                    [0.349, 0.394],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.304, 0.27],
                    [0.577, 0.423],
                    [0.73, 0.715],
                    [1, 1]
                ]
            ],

            [
                [
                    [0, 0.235],
                    [0.324, 0.369],
                    [1, 1]
                ],
                [
                    [0.057, 0],
                    [0.5, 0.473],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.646, 0.547],
                    [1, 1]
                ]
            ],

            [
                [
                    [0, 0],
                    [0.087, 0.141],
                    [0.434, 0.478],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.661, 0.6],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.24, 0.235],
                    [0.5, 0.483],
                    [0.795, 0.9],
                    [1, 1]
                ]
            ],

            [
                [
                    [0, 0],
                    [0.287, 0.193],
                    [0.718, 0.792],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.394, 0.374],
                    [0.824, 0.879],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.205, 0.23],
                    [0.725, 0.641],
                    [1, 0.893]
                ]
            ],

            [
                [
                    [0, 0],
                    [0.626, 0.667],
                    [0.755, 0.874],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.423, 0.621],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.66, 0.67],
                    [1, 1]
                ]
            ],

            [
                [
                    [0, 0],
                    [0.557, 0.413],
                    [0.79, 0.755],
                    [1, 1]
                ],
                [
                    [0, 0],
                    [0.666, 0.661],
                    [0.889, 1]
                ],
                [
                    [0, 0],
                    [0.156, 0.21],
                    [0.468, 0.453],
                    [1, 1]
                ]
            ]
        ]
        this.init = function() {
            switch (this.name) {
                case "warp":
                    this.shaders = this.warpEffect();
                    break;
                case "revert":
                    seed = Math.random() * 2 - 1;
                    this.shaders = this.revertEffect();
                    break;
                case "rgb shift":
                    this.shaders = this.rgbShiftEffect();
                    break;
                case "oil paint":
                    this.shaders = this.oilPaintEffect();
                    break;
                case "repos":
                    this.shaders = this.reposEffect();
                    break;
                case "flow":
                    this.shaders = this.flowEffect();
                    break;
                case "gradient":
                    this.shaders = this.gradientEffect();
                    break;
                case "warp flow":
                    this.shaders = this.warpFlowEffect();
                    break;
                case "curves":
                    var curveNum = Math.floor(Math.random() * this.curves.length)
                    this.shaders = this.curvesEffect(
                        this.curves[curveNum][0],
                        this.curves[curveNum][1],
                        this.curves[curveNum][2]
                    );
                    break;
                case "neon glow":
                    this.shaders = this.neonGlowEffect();
                    break;
                case "glass":
                    this.shaders = this.glassEffect();
                case "glitch":
                    this.shaders = this.glitchEffect();
            }
        }
        this.warpEffect = function() {
            var customShaders = new CustomShaders();
            var shaders = [
                customShaders.passShader,
                customShaders.diffShader2,
                customShaders.passShader,
                customShaders.warp2
            ]
            return shaders;
        }
        this.revertEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            var revertShader = new RevertShader();
            var denoiseShader = new DenoiseShader();
            var shaders = [
                    customShaders.passShader,
                    customShaders.diffShader2,
                    customShaders2.passShader,
                    revertShader
                ]
            return shaders;
        }
        this.rgbShiftEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            var rgbShiftShader = new RgbShiftShader();
            var shaders = [
                customShaders2.passShader,
                customShaders.diffShader2,
                customShaders.passShader,
                rgbShiftShader
            ]
            return shaders;
        }
        this.oilPaintEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            var oilPaintShader = new OilPaintShader();
            var shaders = [
                customShaders.passShader,
                customShaders.diffShader2,
                customShaders2.passShader,
                oilPaintShader
            ]
            return shaders;
        }
        this.reposEffect = function() {
            var customShaders = new CustomShaders();
            var denoiseShader = new DenoiseShader();
            var customShaders2 = new CustomShaders();
            var psdMaskShader = new PSDMaskShader();
            var shaders = [
                customShaders.reposShader,
                customShaders.diffShader,
                customShaders.passShader,
                psdMaskShader,
            ]
            return shaders;
        }
        this.flowEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            var psdMaskShader = new PSDMaskShader();
            var shaders = [
                customShaders.flowShader,
                customShaders.diffShader,
                customShaders.passShader,
                psdMaskShader,
            ]
            return shaders;
        }
        this.gradientEffect = function() {
            var customShaders = new CustomShaders();
            var gradientShader = new GradientShader();
            var customShaders2 = new CustomShaders();
            var shaders = [
                customShaders.passShader,
                customShaders.diffShader2,
                customShaders2.passShader,
                gradientShader

            ]
            return shaders;
        }
        this.warpFlowEffect = function() {
            var customShaders = new CustomShaders();
            var warpFlowShader = new WarpFlowShader();
            var psdMaskShader = new PSDMaskShader();
            var gradientShader = new GradientShader();
            var shaders = [
                customShaders.flowShader,
                customShaders.diffShader,
                warpFlowShader,
                // customShaders.passShader,
                psdMaskShader,
            ]
            return shaders;
        }
        this.curvesEffect = function(red, green, blue) {
            var customShaders = new CustomShaders();
            var curvesShader = new CurvesShader(red, green, blue);
            var gradientShader = new GradientShader();
            var shaders = [
                customShaders.passShader,
                customShaders.diffShader2,
                customShaders.passShader,
                curvesShader
            ]
            return shaders;
        }
        this.neonGlowEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            var neonGlowShader = new NeonGlowShader();
            var shaders = [
                customShaders2.passShader,
                customShaders.diffShader2,
                customShaders.passShader,
                neonGlowShader
            ]
            return shaders;
        }
        this.glassEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            var glassShader = new GlassShader();
            var shaders = [
                customShaders2.passShader,
                customShaders.diffShader2,
                customShaders.passShader,
                glassShader
            ]
            return shaders;
        }
        this.glitchEffect = function() {
            var customShaders = new CustomShaders();
            var customShaders2 = new CustomShaders();
            if(glitchShaderSeed <= 0.333){
                var glitchShader = new GlitchShader();                
            } else if(glitchShaderSeed > 0.333 && glitchShaderSeed <= 0.666){
                var glitchShader = new GlitchShader2();                
            } else {
                var glitchShader = new GlitchShader3();
            }
            var shaders = [
                customShaders2.passShader,
                customShaders.diffShader2,
                customShaders.passShader,
                glitchShader
            ]
            return shaders;
        }
    }

    function Mask(RENDERER) {
        this.scene, this.camera, this.renderer = RENDERER;
        this.mesh, this.material, this.geometry;
        this.shader;
        this.radius = 0.0;
        this.counter = 0;
        this.renderTarget1, this.renderTarget2;
        this.mouse;
        this.maskTex;
        this.oMesh;
        this.useRaster = false;
        this.init = function() {
            this.scene = new THREE.Scene();

            this.camera = new THREE.OrthographicCamera(renderSize.x / -2, renderSize.x / 2, renderSize.y / 2, renderSize.y / -2, -10000, 10000);
            this.camera.position.set(0, 0, 0);

            // this.renderer = new THREE.WebGLRenderer({
                // preserveDrawingBuffer: true
            // });
            // this.renderer.setSize(renderSize.x, renderSize.y);
            // this.renderer.setClearColor(0x000000, 1.0);
            // this.renderer.autoClear = false;


            // 
            // this.oScene = new THREE.Scene();
            // this.oCamera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -10000, 10000 );
            // this.oCamera.position.set(0,0,0);
            // this.oRenderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
            // this.oRenderer.setSize( renderSize.x, renderSize.y );
            // this.oRenderer.setClearColor(0xffffff,1.0);
            // this.oGeometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
            // this.oMaterial = new THREE.MeshBasicMaterial({
            // map: this.alphaTex,
            // transparent: true
            // })
            // this.oMesh = new THREE.Mesh(this.oGeometry, this.oMaterial);
            // this.oScene.add(this.oMesh);
            // this.oMesh.position.z = 1;
            this.oRenderTarget = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
            this.oRenderTarget.minFilter = this.oRenderTarget.magFilter = THREE.LinearFilter;
            // 


            this.geometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
            this.shader = new MaskShader();
            this.material = new THREE.ShaderMaterial({
                uniforms: this.shader.uniforms,
                fragmentShader: this.shader.fragmentShader,
                vertexShader: this.shader.vertexShader,
                transparent: true
            });
            this.material.uniforms["resolution"].value = new THREE.Vector2(renderSize.x, renderSize.y);
            this.material.uniforms["white"].value = white;
            this.material.uniforms["black"].value = black;
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.mesh);
            this.mesh.position.z = 0;


            this.renderTarget1 = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
            this.renderTarget1.minFilter = this.renderTarget1.magFilter = THREE.LinearFilter;
            this.renderTarget2 = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y);
            this.renderTarget2.minFilter = this.renderTarget2.magFilter = THREE.LinearFilter;

            // this.maskTex = new THREE.Texture(this.renderer.domElement);
            // this.maskTex.minFilter = this.maskTex.magFilter = THREE.LinearFilter;
            // this.maskTex.needsUpdate = true;

            this.outputScene = new THREE.Scene();
            this.outputCamera = new THREE.OrthographicCamera(renderSize.x / -2, renderSize.x / 2, renderSize.y / 2, renderSize.y / -2, -10000, 10000);
            this.outputCamera.position.set(0, 0, 0);
            // this.outputRenderer = new THREE.WebGLRenderer({
                // preserveDrawingBuffer: true
            // });
            // this.outputRenderer.setSize(renderSize.x, renderSize.y);
            // this.outputRenderer.setClearColor(0xffffff, 1.0);

            // this.maskGeometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
            // this.maskMaterial = new THREE.MeshBasicMaterial({
                // map: this.maskTex,
                // transparent: true
            // })
            // this.maskMesh = new THREE.Mesh(this.maskGeometry, this.maskMaterial);
            // this.outputScene.add(this.maskMesh);
            // this.maskMesh.position.z = 0;

            this.alphaTex = mask2;
            this.alphaTex.minFilter = this.alphaTex.magFilter = THREE.LinearFilter;
            this.overlayGeometry = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
            this.overlayMaterial = new THREE.MeshBasicMaterial({
                map: this.renderTarget1,
                transparent: true
            })
            this.overlayMesh = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial);
            this.outputScene.add(this.overlayMesh);
            this.overlayMesh.position.z = 0;

            this.overlayGeometry2 = new THREE.PlaneBufferGeometry(renderSize.x, renderSize.y);
            this.overlayMaterial2 = new THREE.MeshBasicMaterial({
                map: this.alphaTex,
                transparent: true
            })
            this.overlayMesh2 = new THREE.Mesh(this.overlayGeometry2, this.overlayMaterial2);
            this.outputScene.add(this.overlayMesh2);
            this.overlayMesh2.position.z = 1;
        }
        this.update = function() {
            // this.erase();
            this.material.uniforms["r2"].value = this.radius;
            this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
            // this.material.uniforms["mouse"].value = new THREE.Vector2(mouse.x, mouse.y);
            this.material.uniforms["time"].value = time;
            if (mouseDown) {
                // this.radius = 0.5;
            } else {
                // this.radius = 0.0;
            }
            // this.overlayTexture.needsUpdate = true;
            // this.maskTex.needsUpdate = true;
            // this.renderer.clear();
            this.renderer.clearTarget(this.oRenderTarget, true, false, false);
            this.renderer.render(this.scene, this.camera, this.oRenderTarget);
            this.renderer.render(this.scene, this.camera, this.renderTarget1);

            // this.oRenderer.render(this.oScene, this.oCamera, this.oRenderTarget);
            this.renderer.clearTarget(this.oRenderTarget, true, true, false);
            this.renderer.render(this.outputScene, this.outputCamera, this.oRenderTarget);

            // this.overlayMesh.material.map.value = this.alphaTex;
            // this.alphaTex.needsUpdate = true;
            // this.renderer.render(this.scene, this.camera, this.renderTarget2);
            this.material.uniforms["black"].value = this.renderTarget1;
            this.swapBuffers();

        }
        this.setMask = function(tex) {
            // this.useRaster = useRaster;
            // if(this.useRaster){
            // this.overlayMesh.visible = true;
            if (tex) {
                this.overlayMesh2.visible = true;
                this.overlayMesh2.material.map = tex;
            } else {
                this.overlayMesh2.visible = false;
            }
        }
        this.swapBuffers = function() {
            var temp = this.renderTarget1;
            this.renderTarget1 = this.renderTarget2;
            this.renderTarget2 = temp;
        }
        this.resize = function() {
            this.renderer.setSize(renderSize.x, renderSize.y);
            this.renderTarget1.setSize(renderSize.x, renderSize.y);
            this.renderTarget2.setSize(renderSize.x, renderSize.y);
            // this.renderer.setSize(renderSize.x, renderSize.y);
            // this.outputRenderer.setSize(renderSize.x, renderSize.y);
            this.camera.left = this.outputCamera.left = renderSize.x / -2;
            this.camera.right = this.outputCamera.right = renderSize.x / 2;
            this.camera.top = this.outputCamera.top = renderSize.y / 2;
            this.camera.bottom = this.outputCamera.bottom = renderSize.y / -2;
        }
    }

    function MaskShader() {
        this.uniforms = THREE.UniformsUtils.merge([{
            "mouse": {
                type: "v2",
                value: null
            },
            "resolution": {
                type: "v2",
                value: null
            },
            "time": {
                type: "f",
                value: 0.0
            },
            "r2": {
                type: "f",
                value: null
            },
            "white": {
                type: "t",
                value: null
            },
            "black": {
                type: "t",
                value: null
            },
        }]);

        this.vertexShader = [

            "varying vec2 vUv;",
            "void main() {",
            "    vUv = uv;",
            "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"

        ].join("\n");

        this.fragmentShader = [

            "uniform vec2 resolution;",
            "uniform vec2 mouse;",
            "uniform sampler2D white;",
            "uniform sampler2D black;",
            "uniform float r2;",
            "uniform float time;",
            "varying vec2 vUv;",

            "void main() {",
            "   vec2 q = vUv;",
            "   vec2 p = -1.0 + 2.0*q;",
            "   p.x *= resolution.x/resolution.y;",
            "   vec2 m = mouse;",
            "   m.x *= resolution.x/resolution.y;",
            "   float r = sqrt( dot((p - m), (p - m)) );",
            "   float a = atan(p.y, p.x);",
            "   vec4 white = vec4(texture2D(white, vUv).rgb, 1.0);",
            "   vec4 black = vec4(texture2D(black, vUv).rgb, 1.0);;",
            "   if(r < r2){",
            "       float f = smoothstep(r2, r2-1.0, r);",
            "       black = mix( black, white, f);",
            "   }",
            "   gl_FragColor = black;",
            "}",



        ].join("\n");
    }
}

return blackbox

})