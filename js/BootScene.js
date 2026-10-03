class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.json('gameData', 'js/data.json');
        
        // Load ảnh nhân vật
        this.load.image('raw_down', 'assets/walk_down.png');
        this.load.image('raw_up', 'assets/walk_up.png');
        this.load.image('raw_left', 'assets/walk_left.png');
        this.load.image('raw_right', 'assets/walk_right.png');

        // Load nền cỏ chính và cỏ hoa điểm xuyết
        this.load.image('grass', 'assets/grass.png');
        this.load.image('grass_flower', 'assets/grass_flower.png');
        this.load.image('tree', 'assets/tree.png');
    }

    create() {
        ['down', 'up', 'left', 'right'].forEach(dir => {
            let img = this.textures.get('raw_' + dir).getSourceImage();
            let fw = Math.round(img.width / 8); 
            let fh = Math.round(img.height);
            this.textures.addSpriteSheet('walk_' + dir, img, { frameWidth: fw, frameHeight: fh });
        });

        this.anims.create({ key: 'anim_walk_down', frames: this.anims.generateFrameNumbers('walk_down', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'anim_walk_up', frames: this.anims.generateFrameNumbers('walk_up', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'anim_walk_left', frames: this.anims.generateFrameNumbers('walk_left', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'anim_walk_right', frames: this.anims.generateFrameNumbers('walk_right', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });

        this.scene.start('GameScene');
    }
}