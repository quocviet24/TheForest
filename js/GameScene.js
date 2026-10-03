class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.physics.world.setBounds(0, 0, 2000, 2000);
        this.cameras.main.setBackgroundColor('#359835');

        const tileSize = 64; 
        for (let y = 0; y < 2000; y += tileSize) {
            for (let x = 0; x < 2000; x += tileSize) {
                if (Phaser.Math.Between(1, 100) <= 10) {
                    let flower = this.add.image(x, y, 'grass_flower').setOrigin(0, 0);
                    flower.setDisplaySize(tileSize, tileSize);
                }
            }
        }

        this.createTextures(); 

        this.player = this.physics.add.sprite(1000, 1000, 'walk_down');
        this.player.setScale(2.5);
        this.player.setCollideWorldBounds(true); 
        
        this.trees = this.physics.add.staticGroup();
        for (let i = 0; i < 50; i++) {
            let x = Phaser.Math.Between(100, 1900);
            let y = Phaser.Math.Between(100, 1900);
            this.trees.create(x, y, 'tree'); 
        }
        this.physics.add.collider(this.player, this.trees);

        this.signboard = this.physics.add.staticSprite(1050, 1000, 'signboard');
        this.physics.add.collider(this.player, this.signboard);

        this.cameras.main.setBounds(0, 0, 2000, 2000);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cameras.main.roundPixels = true; 

        // Khai báo phím vật lý
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Biến trạng thái joystick
        this.moveState = { up: false, down: false, left: false, right: false, interact: false };

        this.interactPrompt = this.add.text(0, 0, '[E] Tương tác', { 
            fontSize: '14px', backgroundColor: '#000', color: '#fff', padding: { x: 5, y: 5 }
        }).setOrigin(0.5).setVisible(false);

        this.isInteracting = false;
        this.scene.launch('UIScene');
    }

    update() {
        if (this.isInteracting) {
            this.player.setVelocity(0);
            this.player.anims.stop(); 
            this.interactPrompt.setVisible(false);
            this.moveState.interact = false;
            return;
        }

        this.player.setVelocity(0);
        const speed = 250;
        let isMoving = false;

        // Xử lý di chuyển
        if (this.cursors.left.isDown || this.moveState.left) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('anim_walk_left', true);
            isMoving = true;
        } else if (this.cursors.right.isDown || this.moveState.right) {
            this.player.setVelocityX(speed);
            this.player.anims.play('anim_walk_right', true);
            isMoving = true;
        } else if (this.cursors.up.isDown || this.moveState.up) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('anim_walk_up', true);
            isMoving = true;
        } else if (this.cursors.down.isDown || this.moveState.down) {
            this.player.setVelocityY(speed);
            this.player.anims.play('anim_walk_down', true);
            isMoving = true;
        }

        if (!isMoving) {
            this.player.anims.stop(); 
        }

        let distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.signboard.x, this.signboard.y);
        if (distance < 70) {
            this.interactPrompt.setPosition(this.signboard.x, this.signboard.y - 40);
            this.interactPrompt.setVisible(true);

            if (Phaser.Input.Keyboard.JustDown(this.interactKey) || this.moveState.interact) {
                this.isInteracting = true; 
                this.scene.get('UIScene').showQuestion('Q01'); 
            }
        } else {
            this.interactPrompt.setVisible(false);
        }

        this.moveState.interact = false;
    }

    createTextures() {
        let treeGfx = this.make.graphics({ x: 0, y: 0, add: false });
        treeGfx.fillStyle(0x5c4033, 1); treeGfx.fillRect(20, 30, 20, 40);
        treeGfx.fillStyle(0x2d6a4f, 1); treeGfx.fillCircle(30, 25, 25);
        treeGfx.generateTexture('tree', 60, 70);

        let signGfx = this.make.graphics({ x: 0, y: 0, add: false });
        signGfx.fillStyle(0x8b4513, 1); signGfx.fillRect(0, 0, 40, 25); 
        signGfx.fillStyle(0x5c4033, 1); signGfx.fillRect(16, 25, 8, 20); 
        signGfx.generateTexture('signboard', 40, 45);
    }
}