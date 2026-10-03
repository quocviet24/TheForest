class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        // Bật cảm ứng đa điểm (hỗ trợ ít nhất 2 ngón tay cùng lúc trên màn hình)
        this.input.addPointer(2);

        this.totalScore = 0;
        this.scoreText = this.add.text(20, 20, 'FOREST SCORE: 0', { fill: '#fff', fontSize: '24px', fontFamily: 'monospace' });

        this.panel = this.add.container(240, 100);
        this.panel.setVisible(false);

        let bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.lineStyle(4, 0xffffff);
        bg.fillRect(0, 0, 800, 500);
        bg.strokeRect(0, 0, 800, 500);
        this.panel.add(bg);

        this.situationText = this.add.text(40, 40, '', { fill: '#fff', fontSize: '20px', wordWrap: { width: 720 }, fontFamily: 'monospace' });
        this.questionText = this.add.text(40, 110, '', { fill: '#ffcc00', fontSize: '24px', fontStyle: 'bold', fontFamily: 'monospace' });
        
        this.feedbackText = this.add.text(40, 180, '', { fill: '#00ffcc', fontSize: '20px', wordWrap: { width: 720 }, fontFamily: 'monospace' });
        this.insightText = this.add.text(40, 300, '', { fill: '#ffffff', fontSize: '18px', fontStyle: 'italic', wordWrap: { width: 720 }, fontFamily: 'monospace' });
        this.panel.add([this.situationText, this.questionText, this.feedbackText, this.insightText]);

        this.optionTexts = [];
        for(let i = 0; i < 4; i++) {
            let opt = this.add.text(40, 180 + (i * 60), '', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' });
            opt.setInteractive({ useHandCursor: true });
            opt.on('pointerover', () => opt.setFill('#ffcc00'));
            opt.on('pointerout', () => opt.setFill('#ffffff'));
            opt.on('pointerdown', () => this.selectOption(i));
            this.panel.add(opt);
            this.optionTexts.push(opt);
        }

        this.closeButton = this.add.text(350, 430, '[ TIẾP TỤC ]', { fill: '#fff', fontSize: '22px', backgroundColor: '#333', padding: { x: 10, y: 5 }, fontFamily: 'monospace' });
        this.closeButton.setInteractive({ useHandCursor: true });
        this.closeButton.on('pointerdown', () => this.closePanel());
        this.closeButton.setVisible(false);
        this.panel.add(this.closeButton);

        // Gọi hàm tạo Joystick Nổi (Floating Joystick)
        this.createVirtualJoystick();
    }

    createVirtualJoystick() {
        let gameScene = this.scene.get('GameScene');

        const baseRadius = 70;
        const thumbRadius = 30;

        // Vẽ Joystick tàng hình mặc định
        this.joyBase = this.add.circle(0, 0, baseRadius, 0xffffff, 0.2).setDepth(10).setVisible(false);
        this.joyThumb = this.add.circle(0, 0, thumbRadius, 0xffffff, 0.5).setDepth(11).setVisible(false);

        this.joystickActive = false;
        this.joystickPointerId = null;
        this.joyBaseX = 0;
        this.joyBaseY = 0;

        // 1. Khi ngón tay chạm vào màn hình
        this.input.on('pointerdown', (pointer) => {
            // Nếu chạm ở nửa màn hình bên trái (X < 640) và chưa có joystick nào kích hoạt
            if (pointer.x < 640 && !this.joystickActive) {
                this.joystickActive = true;
                this.joystickPointerId = pointer.id; // Lưu lại ID của ngón tay này
                this.joyBaseX = pointer.x;
                this.joyBaseY = pointer.y;

                // Hiện Joystick ngay tại điểm chạm
                this.joyBase.setPosition(this.joyBaseX, this.joyBaseY).setVisible(true);
                this.joyThumb.setPosition(this.joyBaseX, this.joyBaseY).setVisible(true);
            }
        });

        // 2. Khi ngón tay kéo đi
        this.input.on('pointermove', (pointer) => {
            // Chỉ xử lý nếu đúng là ngón tay đang giữ Joystick
            if (this.joystickActive && pointer.id === this.joystickPointerId) {
                let distance = Phaser.Math.Distance.Between(this.joyBaseX, this.joyBaseY, pointer.x, pointer.y);
                let angle = Phaser.Math.Angle.Between(this.joyBaseX, this.joyBaseY, pointer.x, pointer.y);

                let thumbX = pointer.x;
                let thumbY = pointer.y;

                // Nếu kéo quá xa thì giới hạn núm Joystick lại ở viền
                if (distance > baseRadius) {
                    thumbX = this.joyBaseX + Math.cos(angle) * baseRadius;
                    thumbY = this.joyBaseY + Math.sin(angle) * baseRadius;
                }

                this.joyThumb.setPosition(thumbX, thumbY);

                // Tính toán hướng đi
                let degrees = Phaser.Math.RadToDeg(angle);
                
                gameScene.moveState.up = false;
                gameScene.moveState.down = false;
                gameScene.moveState.left = false;
                gameScene.moveState.right = false;

                // Deadzone: Chỉ cho nhân vật đi khi kéo ngón tay xa hơn 10 pixel
                if (distance > 10) {
                    if (degrees >= -45 && degrees <= 45) {
                        gameScene.moveState.right = true;
                    } else if (degrees > 45 && degrees < 135) {
                        gameScene.moveState.down = true;
                    } else if (degrees >= 135 || degrees <= -135) {
                        gameScene.moveState.left = true;
                    } else if (degrees < -45 && degrees > -135) {
                        gameScene.moveState.up = true;
                    }
                }
            }
        });

        // 3. Hàm xử lý khi nhấc ngón tay lên
        const stopJoystick = (pointer) => {
            if (this.joystickActive && pointer.id === this.joystickPointerId) {
                this.joystickActive = false;
                this.joystickPointerId = null;
                
                // Giấu Joystick đi
                this.joyBase.setVisible(false);
                this.joyThumb.setVisible(false);
                
                // Dừng nhân vật
                gameScene.moveState.up = false;
                gameScene.moveState.down = false;
                gameScene.moveState.left = false;
                gameScene.moveState.right = false;
            }
        };

        this.input.on('pointerup', stopJoystick);
        this.input.on('pointerout', stopJoystick);

        // Nút Tương tác (E) Cố định bên góc phải (Không thay đổi)
        let actBtn = this.add.circle(1150, 590, 50, 0xffcc00, 0.5).setInteractive();
        this.add.text(1150, 590, 'E', { fontSize: '40px', fill: '#000', fontStyle: 'bold' }).setOrigin(0.5);

        actBtn.on('pointerdown', () => {
            actBtn.setFillStyle(0xffcc00, 0.9);
            gameScene.moveState.interact = true;
        });
        actBtn.on('pointerup', () => actBtn.setFillStyle(0xffcc00, 0.5));
        actBtn.on('pointerout', () => actBtn.setFillStyle(0xffcc00, 0.5));
    }

    showQuestion(questionId) {
        this.currentData = this.cache.json.get('gameData').questions[questionId];
        
        this.situationText.setText("TÌNH HUỐNG: " + this.currentData.situation);
        this.questionText.setText(this.currentData.question);
        
        this.feedbackText.setText('');
        this.insightText.setText('');
        this.closeButton.setVisible(false);

        for(let i = 0; i < 4; i++) {
            if(this.currentData.options[i]) {
                this.optionTexts[i].setText("○ " + this.currentData.options[i].id + ". " + this.currentData.options[i].text);
                this.optionTexts[i].setVisible(true);
            }
        }
        this.panel.setVisible(true);
    }

    selectOption(index) {
        let selectedOption = this.currentData.options[index];
        this.totalScore += selectedOption.score;
        this.scoreText.setText('FOREST SCORE: ' + this.totalScore);
        this.optionTexts.forEach(opt => opt.setVisible(false));

        this.feedbackText.setText(`[ +${selectedOption.score} ĐIỂM ]\nPHẢN HỒI: ${selectedOption.feedback}`);
        this.insightText.setText(`RANGER INSIGHT: ${this.currentData.rangerInsight}`);
        
        this.closeButton.setVisible(true);
    }

    closePanel() {
        this.panel.setVisible(false);
        this.scene.get('GameScene').isInteracting = false; 
    }
}